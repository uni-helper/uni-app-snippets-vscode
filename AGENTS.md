# @uni-helper/uni-app-snippets-vscode

提供 uni-app 代码片段的 VSCode 插件（`prefix` + `body` 成对）：条件编译平台值、内置组件、CSS 变量、页面和应用生命周期钩子，以及 `uni.*` API。没有运行时插件代码，产物是四个手工维护的片段 JSON、`package.json` 里的接线，加一份手工编写、表格与片段一一对应的 README。

## 项目

- **语言和运行时：** 没有应用源码，只有片段 JSON 和配置。开发用 Node 26，由 `.node-version` 和 `devEngines.runtime`（`onFail: warn`）固定。发布用的 `engines` 面向使用者：`vscode ^1.40.0`（最低 VSCode 版本）、`node >=18`。
- **工具链：** npm 12（`packageManager` 和 `devEngines.packageManager` 固定）；ultracite（零配置的 Biome 预设）管 lint 和格式化；测试用 `node --test`；发布用 bumpp；上架用 @vscode/vsce 和 ovsx。没有类型检查。
- **产物：** VSIX 只带 `snippets/`、`LICENSE`、`logo.png`（`files` 和 `icon`），发布到 VSCode Marketplace 和 OpenVSX，发布者 `uni-helper`。

## 命令

```bash
npm install
npm run check     # ultracite check：lint 和格式检查
npm test          # node --test：片段与 README 一致性
npm run fix       # ultracite fix
npm run release   # bumpp：升版本号、提交、打 tag、推送，tag 触发 .github/workflows/release.yml
```

CI（`.github/workflows/ci.yml`）用 `voidzero-dev/setup-vp` 在 Node 22/24/26 × ubuntu/macos/windows 上跑 `vpr check` 和 `vpr test`。发布工作流把包发到两个市场（`VSCE_PAT`、`OVSX_PAT` 密钥），并用 changelogithub 建 GitHub Release。

## 架构

| 文件 | 作用 |
|---|---|
| `snippets/vue-html.json` | 平台值和内置组件（如 `<view>`），服务于 `vue-html` / `vue` / `html` |
| `snippets/css.json` | 平台值和 uni-app CSS 变量，服务于 `css` / `less` / `scss` / `sass` / `stylus` / `vue` |
| `snippets/jsonc.json` | 平台值和 `pages.json` 用的 `// #ifdef` 注释块，服务于 `jsonc` |
| `snippets/javascript.json` | 平台值、环境判断、生命周期钩子和 `uni.*` API，服务于 `javascript` / `javascriptreact` / `typescript` / `typescriptreact` / `vue` |
| `package.json` → `contributes.snippets` | 把每个片段文件映射到对应语言 ID |
| `tests/snippets.test.mjs` | 对片段文件做结构、重复、可解析性和跨文件一致性检查 |
| `tests/readme.test.mjs` | 断言 README 表格与片段完全对应 |
| `tests/helpers.mjs` | 为两个测试文件加载片段、解析 README 表格 |

### 片段格式约定

- `prefix` 用数组，一条片段可以有多个别名（`mp-weixin` 也匹配 `platform-mp-weixin`）。
- `body` 是行数组，用字面 tab 缩进。占位符 `$1`…`$n` 一般以 `$0` 结尾；候选占位符如 `${1|VUE3,…|}` 把平台列表内联进去。
- 顶层键是可读的中文标签，`description` 写成 `……。更多信息查看 <官方文档 URL>。`。
- 四个片段文件是唯一事实来源，插件直接提供它们，README 表格手工维护、与之一一对应。新增或修改片段时，同一次改动里更新对应的 README 表格行。API 列展示插入的代码、省掉占位符；平台值那几行在四个表格里有意识重复。

## 约定

- **测试：** `tests/*.test.mjs` 用内置的 `node --test` 跑，无依赖。它们守着下面这些约定：`description` 格式、`prefix` 不重复、JavaScript 片段可解析、四个文件平台值一致、平台候选列表顺序一致、README 与每条片段对应。新增一条约定，就在那里加一条检查。
- **Lint 和格式化：** ultracite（Biome），用 `npm run check` 和 `npm run fix`。`biome.jsonc` 只排除了 `!banner.svg`，手绘 SVG 不能被重新格式化。`.vscode/settings.json` 把 Biome 设成各语言的格式化工具，保存时格式化并整理 import。`.editorconfig` 规定 2 空格缩进、LF、UTF-8，Markdown 保留行尾空格。
- **内容语言：** 片段键、`description` 和所有文档都用简体中文，术语跟随 uni-app 官方文档。
- **提交：** 分支名用 `feat/xxx`、`fix/xxx`、`docs/xxx`。提交信息遵循[约定式提交](https://www.conventionalcommits.org/zh-hans/)（`feat:`、`fix:`、`docs:`、`chore:`、`ci:` 等），主题和正文都用英文书写。提交前跑 `npm run check` 和 `npm test`。
