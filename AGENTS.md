# @uni-helper/uni-app-snippets-vscode

VSCode extension providing uni-app code snippets (`prefix` + `body` pairs): conditional-compilation platform values, built-in components, CSS variables, page/app lifecycle hooks, and the `uni.*` API surface. There is no runtime extension code — the artifact is four hand-maintained snippet JSON files plus wiring in `package.json`, and a hand-written README whose tables mirror those snippets.

## Project

- **Language/runtime:** no app source code — snippet JSON files and configuration only. Dev pins Node 26 via `.node-version` and `devEngines.runtime` (`onFail: warn`). Published `engines` are consumer-facing: `vscode ^1.40.0` (minimum VSCode) and `node >=18`.
- **Toolchain:** npm 12 (pinned via `packageManager` + `devEngines.packageManager`), ultracite (a zero-config Biome preset) for lint/format, bumpp (release), @vscode/vsce + ovsx (publish). There is no test suite and no typecheck.
- **Artifact:** the VSIX ships `snippets/`, `LICENSE`, `logo.png` (`files` + `icon`). Published to both VSCode Marketplace and OpenVSX under publisher `uni-helper`.

## Commands

```bash
npm install
npm run check     # ultracite check — the only validation gate
npm run fix       # ultracite fix
npm run release   # bumpp: bumps version, commits, tags, pushes; the tag triggers .github/workflows/release.yml
```

CI (`.github/workflows/ci.yml`) runs `vpr check` via `voidzero-dev/setup-vp` on Node 22/24/26 × ubuntu/macos/windows. The release workflow publishes to both marketplaces (`VSCE_PAT` / `OVSX_PAT` secrets) and creates the GitHub Release via changelogithub.

## Architecture

| File | Role |
|---|---|
| `snippets/vue-html.json` | platform values and built-in components (e.g. `<view>`), served to `vue-html` / `vue` / `html` |
| `snippets/css.json` | platform values and uni-app CSS variables, served to `css` / `less` / `scss` / `sass` / `stylus` / `vue` |
| `snippets/jsonc.json` | platform values and `// #ifdef` comment blocks for `pages.json`, served to `jsonc` |
| `snippets/javascript.json` | platform values, environment checks, lifecycle hooks and the `uni.*` API, served to `javascript` / `javascriptreact` / `typescript` / `typescriptreact` / `vue` |
| `package.json` → `contributes.snippets` | Maps each snippet file to its language IDs |

### Snippet shape conventions

The four snippet files are the single source of truth — the extension serves them directly and the README tables mirror them:

- `prefix` is an array so one snippet can offer aliases (`mp-weixin` also matches `platform-mp-weixin`).
- `body` is an array of lines, indented with literal tabs, using `$1`…`$n` tabstops ending in `$0`; choice placeholders like `${1|VUE3,…|}` offer the platform list inline.
- Top-level keys are human-readable Chinese labels; `description` follows the pattern `……。更多信息查看 <官方文档 URL>。`
- When adding or changing a snippet, update the matching README table row in the same change — the tables are hand-maintained to match `snippets/*.json`. The README API column shows the inserted code with placeholders elided, and the platform-value rows intentionally repeat across all four tables.

## Conventions

- **Lint/format:** ultracite (Biome) via `npm run check` / `npm run fix`; `biome.jsonc` only adds the `!banner.svg` exclusion — the hand-drawn SVG must not be reformatted. The committed `.vscode/settings.json` sets Biome as the per-language formatter with format-on-save and organize-imports; `.editorconfig` enforces 2-space indent, LF, UTF-8 (Markdown keeps trailing whitespace).
- **Content language:** snippet keys and descriptions are Simplified Chinese, following the official uni-app docs; README and other docs are Simplified Chinese.
- **Branches/commits:** `feat/xxx`, `fix/xxx`, `docs/xxx`; Conventional Commits.
