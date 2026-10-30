// Fixtures shared by the snippet tests: the four snippet files and the README
// API tables that have to mirror them.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

const PREFIX_PATTERN = /`(?<prefix>[^`]+)`/gu;

/** Snippet file names, in the order README lists them. */
const snippetFiles = ["vue-html", "css", "jsonc", "javascript"];

/**
 * Loads every snippet file.
 *
 * @returns {{ name: string, entries: Record<string, { prefix: string[], body: string[], description: string }> }[]}
 */
export function loadSnippets() {
  return snippetFiles.map((name) => ({
    entries: JSON.parse(
      fs.readFileSync(path.join(root, "snippets", `${name}.json`), "utf8")
    ),
    name,
  }));
}

/**
 * Parses the README API tables. Each row lists the snippet prefixes and the
 * description copied from the snippet, so rows can be compared against them.
 *
 * @returns {{ prefixes: string[], description: string }[]}
 */
export function loadReadmeRows() {
  const text = fs.readFileSync(path.join(root, "README.md"), "utf8");
  const rows = [];
  for (const line of text.split("\n")) {
    const cells = line.split("|");
    // A three-column row splits into ["", api, prefix, description, ""].
    if (cells.length !== 5 || cells[0] !== "") {
      continue;
    }
    const prefixes = [...cells[2].matchAll(PREFIX_PATTERN)].map(
      (match) => match.groups.prefix
    );
    if (prefixes.length > 0) {
      rows.push({ description: cells[3], prefixes });
    }
  }
  return rows;
}
