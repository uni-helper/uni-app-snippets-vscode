# 参与贡献

感谢你愿意为 uni-app-snippets-vscode 贡献代码！本文档介绍项目结构、本地开发流程、测试方式和提交规范。

## 前置条件

- Node.js 26(见 `.node-version`;`devEngines.runtime` 只警告不强制)
- npm 12(见 `package.json` 的 `packageManager`)

## 仓库结构

```
.github/workflows/    # CI 与发布工作流
snippets/             # 四个代码片段 JSON 文件,插件的全部"源代码"
  vue-html.json       # 条件编译平台值、内置组件
  css.json            # 平台值、CSS 变量
  jsonc.json          # pages.json 用的 // #ifdef 注释块
  javascript.json     # 平台值、环境判断、生命周期、uni.* API
tests/                # node --test 测试，snippets 与 README 的一致性校验
README.md             # 手工维护,表格与 snippets 一一对应
```

## 本地开发

```bash
npm install
npm run check  # ultracite(Biome)检查
npm test       # 校验 snippets 与 README
npm run fix    # 自动修复格式和 lint 问题
```

没有构建步骤。修改 `snippets/*.json` 后,在 VSCode 里重载窗口(`Developer: Reload Window`)即可看到片段效果。

## 测试与检查

`npm run test` 用 Node 自带的测试运行器检查以下内容:

- 每个 snippet 都有 `prefix`、`body`,以及以 `更多信息查看 <链接>。` 结尾的 `description`。
- 同一个文件里没有重复的 `prefix`,也没有两条插入完全相同代码的 snippet。
- `javascript.json` 的 `body` 在替换掉占位符之后能通过语法解析。
- 四个文件里的平台值内容一致,条件编译的候选列表与平台值逐一对应。
- README 表格与 snippets 一一对应,每条 snippet 都有对应行,不多不少。

`npm run check` 负责格式和 lint。CI 会在 Node 22/24/26 × ubuntu/macos/windows 上跑这两个命令。

改 snippets 时必须在同一次改动里同步 README 对应的表格行，否则 `npm run test` 会失败。

## 提交规范

1. Fork 仓库,从 `main` 拉分支,分支名用 `feat/xxx`、`fix/xxx`、`docs/xxx` 风格。
2. 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/),如 `feat:`、`fix:`、`docs:`;主题和正文都用英文书写。
3. 提交前跑 `npm run check` 和 `npm run test`。
4. 推送并打开 PR。

## Pull Request 指南

- 保持改动聚焦,一个 PR 只解决一个问题。
- 新增、删除或改名 snippet 时,README 表格必须同步更新。
- CI 通过后等待 review;拿不准方案时先开 issue 讨论。

## 发布

维护者操作:运行 `npm run release`,bumpp 会提升版本号、提交、打 tag 并推送;tag 触发 `.github/workflows/release.yml`,自动发布到 VSCode Marketplace 和 OpenVSX,并用 changelogithub 创建 GitHub Release。

## 行为准则

参与本项目请遵守[组织级行为准则](https://github.com/uni-helper/.github/blob/main/CODE_OF_CONDUCT.md)。

有任何问题欢迎在 [Issues](https://github.com/uni-helper/uni-app-snippets-vscode/issues) 提出。
