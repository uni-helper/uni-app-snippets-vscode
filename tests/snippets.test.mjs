// Guards the shape and cross-file consistency of the snippet files. A broken
// snippet reaches users as invalid inserted code, so it is checked here rather
// than by hand.
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import vm from "node:vm";
import { loadSnippets } from "./helpers.mjs";

const snippets = loadSnippets();
const root = path.resolve(import.meta.dirname, "..");

/** `contributes.snippets` from package.json. */
const contributes = JSON.parse(
  readFileSync(path.join(root, "package.json"), "utf8")
).contributes.snippets;

const DESCRIPTION_PATTERN =
  /^.+。更多信息查看 (?:<https:\/\/[^>]+>(?: 和 )?)+。$/u;
const CHOICE_TABSTOP_PATTERN = /\$\{\d+\|(?<choice>[^{}]*)\|\}/gu;
const DEFAULT_TABSTOP_PATTERN = /\$\{\d+:(?<default>\{[^{}]*\}|[^{}]*)\}/gu;
const FINAL_TABSTOP_PATTERN = /\$0/gu;
const BARE_TABSTOP_PATTERN = /\$\d+/gu;
const FILLED_OBJECT_PATTERN = /\{\s*null\s*\}/gu;
const PLATFORM_CHOICE_PATTERN = /\$\{1\|(?<choices>[^|]*)\|\}/u;

/**
 * Platform-value snippets: keys such as "uni-app APP 平台". The
 * conditional-compilation snippets also end with 平台 but list the values
 * instead of inserting one, so they are not platform values themselves.
 *
 * @param {string} key
 */
function isPlatformSnippet(key) {
  return key.endsWith("平台") && !key.includes("条件编译");
}

/**
 * Replaces tabstops with text that keeps the surrounding code parseable: a
 * choice takes its first option, a named default keeps the default, and a bare
 * `$n` becomes `null` because it can sit in a value position.
 *
 * @param {string} code
 */
function fillTabstops(code) {
  return (
    code
      .replace(CHOICE_TABSTOP_PATTERN, (_match, choice) => choice.split(",")[0])
      .replace(DEFAULT_TABSTOP_PATTERN, (_match, defaultValue) => defaultValue)
      .replace(FINAL_TABSTOP_PATTERN, "")
      .replace(BARE_TABSTOP_PATTERN, "null")
      // A tabstop alone inside an object literal is there for the user to fill
      // in, and `{null}` is not valid JavaScript.
      .replace(FILLED_OBJECT_PATTERN, "{}")
  );
}

/** @param {string} code */
function parses(code) {
  // Snippet bodies are fragments: statements, expressions, or object members
  // such as page lifecycle methods.
  return [code, `(${code})`, `({${code}})`].some((source) => {
    try {
      const compiled = new vm.Script(source);
      return Boolean(compiled);
    } catch {
      return false;
    }
  });
}

test("every snippet file is served to its languages", () => {
  const files = readdirSync(path.join(root, "snippets")).filter((name) =>
    name.endsWith(".json")
  );
  const served = new Set(
    contributes.map(({ path: snippetPath }) => path.basename(snippetPath))
  );
  assert.deepEqual(
    [...served].sort(),
    files.sort(),
    "snippets/ and contributes.snippets disagree"
  );
  for (const { path: snippetPath } of contributes) {
    assert.ok(
      snippetPath.startsWith("./snippets/"),
      `${snippetPath} is outside snippets/`
    );
  }
});

test("every snippet has a prefix, a body and a doc-linked description", () => {
  for (const { name, entries } of snippets) {
    for (const [key, snippet] of Object.entries(entries)) {
      const where = `${name}: ${key}`;
      assert.ok(
        Array.isArray(snippet.prefix),
        `${where} - prefix is not an array`
      );
      assert.ok(snippet.prefix.length > 0, `${where} - prefix is empty`);
      for (const prefix of snippet.prefix) {
        assert.ok(prefix.length > 0, `${where} - prefix entry is empty`);
      }
      assert.ok(Array.isArray(snippet.body), `${where} - body is not an array`);
      assert.ok(snippet.body.length > 0, `${where} - body is empty`);
      for (const line of snippet.body) {
        assert.equal(
          typeof line,
          "string",
          `${where} - body line is not a string`
        );
      }
      assert.match(
        snippet.description,
        DESCRIPTION_PATTERN,
        `${where} - description does not end with a doc link`
      );
    }
  }
});

test("no two snippets in a file claim the same prefix", () => {
  for (const { name, entries } of snippets) {
    const owners = new Map();
    for (const [key, snippet] of Object.entries(entries)) {
      for (const prefix of snippet.prefix) {
        const owner = owners.get(prefix);
        assert.equal(
          owner,
          undefined,
          `${name}: prefix ${prefix} is used by both ${owner} and ${key}`
        );
        owners.set(prefix, key);
      }
    }
  }
});

test("no two snippets in a file insert the same code", () => {
  for (const { name, entries } of snippets) {
    const owners = new Map();
    for (const [key, snippet] of Object.entries(entries)) {
      const body = JSON.stringify(snippet.body);
      const owner = owners.get(body);
      assert.equal(
        owner,
        undefined,
        `${name}: ${owner} and ${key} share a body`
      );
      owners.set(body, key);
    }
  }
});

test("JavaScript bodies are parseable", () => {
  const javascript = snippets.find(({ name }) => name === "javascript");
  for (const [key, snippet] of Object.entries(javascript.entries)) {
    const code = fillTabstops(snippet.body.join("\n"));
    // `import.meta` is only valid in a module, which a script context cannot
    // parse. Those bodies are single expressions covered by the shape test.
    if (code.includes("import.meta")) {
      continue;
    }
    assert.ok(parses(code), `javascript: ${key} - ${JSON.stringify(code)}`);
  }
});

test("platform snippets are identical across the four files", () => {
  const [reference, ...others] = snippets;
  const expected = new Map(
    Object.entries(reference.entries)
      .filter(([key]) => isPlatformSnippet(key))
      .map(([key, snippet]) => [snippet.body.join(""), { key, snippet }])
  );
  assert.ok(expected.size > 0, "no platform snippets found");

  for (const { name, entries } of others) {
    const actual = new Map(
      Object.entries(entries)
        .filter(([key]) => isPlatformSnippet(key))
        .map(([key, snippet]) => [snippet.body.join(""), { key, snippet }])
    );
    assert.deepEqual(
      [...actual.keys()].sort(),
      [...expected.keys()].sort(),
      `${name}: platform values differ from ${reference.name}`
    );
    for (const [body, { key, snippet }] of actual) {
      const { key: referenceKey, snippet: referenceSnippet } =
        expected.get(body);
      assert.equal(
        snippet.description,
        referenceSnippet.description,
        `${name}: ${key} description differs from ${reference.name}: ${referenceKey}`
      );
    }
  }
});

test("the conditional-compilation choice list matches the platform snippets", () => {
  for (const { name, entries } of snippets) {
    const platforms = Object.entries(entries)
      .filter(([key]) => isPlatformSnippet(key))
      .map(([, snippet]) => snippet.body.join(""));

    const choices = Object.entries(entries)
      .filter(([key]) => key.includes("条件编译，"))
      .map(([key, snippet]) => {
        const match = snippet.body.join("").match(PLATFORM_CHOICE_PATTERN);
        assert.ok(match, `${name}: ${key} has no platform choice list`);
        return { choices: match.groups.choices.split(","), key };
      });
    assert.equal(choices.length, 2, `${name}: expected #ifdef and #ifndef`);

    for (const { key, choices: list } of choices) {
      assert.deepEqual(
        list,
        platforms,
        `${name}: ${key} choice list does not match the platform snippets, in order`
      );
    }
  }
});
