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
README.md             # 手工维护,表格与 snippets 一一对应
```

## 本地开发

```bash
npm install
npm run check  # ultracite(Biome)检查,唯一的校验门槛
npm run fix    # 自动修复格式和 lint 问题
```

没有构建步骤,也没有测试套件。修改 `snippets/*.json` 后,在 VSCode 里重载窗口(`Developer: Reload Window`)即可看到片段效果。

## 测试与检查

仓库没有测试套件,`npm run check` 是唯一的自动检查。CI 会在 Node 22/24/26 × ubuntu/macos/windows 上跑同样的检查。

改 snippets 时必须在同一次改动里同步 README 对应的表格行(表格是手工维护的,必须与 `snippets/*.json` 一致)。

## 提交规范

1. Fork 仓库,从 `main` 拉分支,分支名用 `feat/xxx`、`fix/xxx`、`docs/xxx` 风格。
2. 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/),如 `feat:`、`fix:`、`docs:`。
3. 提交前跑 `npm run check`。
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
