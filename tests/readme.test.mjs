// The README tables are maintained by hand and must mirror the snippets. Every
// snippet gets one row per file that defines it, so a change to a snippet that
// skips the README shows up here.
import assert from "node:assert/strict";
import { test } from "node:test";
import { loadReadmeRows, loadSnippets } from "./helpers.mjs";

/** @param {{ prefixes: string[], description: string }[]} rows */
function countByContent(rows) {
  const counts = new Map();
  for (const row of rows) {
    const key = `${row.prefixes.join(",")}||${row.description}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

test("README tables mirror the snippets", () => {
  const expected = countByContent(
    loadSnippets().flatMap(({ entries }) =>
      Object.values(entries).map(({ prefix, description }) => ({
        description,
        prefixes: prefix,
      }))
    )
  );
  const actual = countByContent(loadReadmeRows());

  const problems = [];
  for (const [key, count] of expected) {
    const found = actual.get(key) ?? 0;
    if (found !== count) {
      problems.push(`expected ${count} row(s), found ${found}: ${key}`);
    }
  }
  for (const [key, count] of actual) {
    if (!expected.has(key)) {
      problems.push(`row without a snippet (${count}x): ${key}`);
    }
  }

  assert.deepEqual(problems, [], problems.join("\n"));
});
