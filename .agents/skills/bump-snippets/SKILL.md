---
name: bump-snippets
description: Use this skill whenever the user requests to update snippets (e.g., "更新代码片段", "同步最新代码片段", "检查代码片段是否需要更新", "check for snippets updates").
---

# 更新代码片段 snippets

根据以下参考信息，检查 `snippets/` 是否需要更新，包括但不限于代码本身和描述文案。若需要，则更新。

1. https://uniapp.dcloud.net.cn/api/
2. https://doc.dcloud.net.cn/uni-app-x/api/
3. 两个页面上的外链
4. 描述里的链接

要求：

1. 统一的表达格式，参考现有代码
2. 统一的命名方式，参考现有代码
3. 规范的表达，遵循 https://github.com/ruanyf/document-style-guide
4. 链接页面的内容可能表达不规范、不通顺、不连贯，具体信息可能分散在页面各处，不要照抄，需要整合优化
5. 检查并处理其它不利于阅读和理解的因素

## 检查顺序

1. 逐个打开描述里的链接。链接返回 301 或 308 说明路径变了，按跳转后的地址更新；`/api/` 索引表里有的 API，snippet 里缺失的补上，已废弃的 API 不加。
2. 对照索引表核对页面名称：平台值、API 说明改动过的，同步改 snippet 的 key 和 `description`。
3. `description` 只重述 API 名的（`uni-app getDeviceInfo`）要改写成一句话说明，依据是该条目的文档页。
4. 检查四个文件里的平台值是否一致：内容一致，候选列表顺序与平台值条目顺序一致，字节跳动 / 抖音这类改名要四个文件一起改。

## 改完必须跑

```bash
npm run test    # snippets 与 README 的一致性校验
npm run check   # 格式和 lint
```

`npm run test` 会拦截这些问题：描述缺少 `更多信息查看 <链接>。`、同一文件里重复的 prefix、`javascript.json` 里插入后无法解析的代码、四个文件平台值不一致、README 表格与 snippets 不同步。README 是手工维护的，改 snippet 时同步改对应行。
