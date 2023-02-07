import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const htmlObject = JSON.parse(
  readFileSync(resolve(root, 'snippets', 'vue-html.json'), { encoding: 'utf8' }),
);
const cssObject = JSON.parse(
  readFileSync(resolve(root, 'snippets', 'css.json'), { encoding: 'utf8' }),
);
const javascriptObject = JSON.parse(
  readFileSync(resolve(root, 'snippets', 'javascript.json'), { encoding: 'utf8' }),
);

let readme = `# @uni-helper/uni-app-snippets-vscode

[![License](https://img.shields.io/github/license/uni-helper/uni-app-snippets-vscode)](https://github.com/uni-helper/uni-app-snippets-vscode/blob/main/LICENSE)

[![VSCode](https://vsmarketplacebadge.apphb.com/version-short/uni-helper.uni-app-snippets-vscode.png)](https://marketplace.visualstudio.com/items?itemName=uni-helper.uni-app-snippets-vscode)

[![OpenVSX](https://img.shields.io/badge/dynamic/json?color=brightgreen&label=OpenVSX&query=%24.version&url=https%3A%2F%2Fopen-vsx.org%2Fapi%2Funi-helper%2Funi-app-snippets-vscode)](https://open-vsx.org/extension/uni-helper/uni-app-snippets-vscode)

[改动日志](https://github.com/uni-helper/uni-app-snippets-vscode/blob/main/CHANGELOG.md)

## 插件特性

- uni-app 基本能力代码片段
- 参考 [uni-app 官方组件文档](https://uniapp.dcloud.io/component/)
- 参考 [Vue.js 2 风格指南](https://v2.cn.vuejs.org/v2/style-guide/) 和 [Vue.js 3 风格指南](https://cn.vuejs.org/style-guide/)

**插件和文档的冲突之处，请以文档为准。**

插件源代码在 [uni-helper/uni-app-snippets-vscode](https://github.com/uni-helper/uni-app-snippets-vscode)。欢迎提交 ISSUE 和 PR 改进本插件。

## 使用

安装插件后重启 VSCode 即可。

`;

// 添加 HTML
readme += '## HTML\n\n';
readme += '|API|Prefix|Description|\n|-|-|-|\n';
for (const key of Object.keys(htmlObject)) {
  const { prefix, body, description } = htmlObject[key];
  let newPrefix = '';
  for (const text of prefix) {
    newPrefix += `\`${text}\`, `;
  }
  newPrefix = newPrefix.slice(0, -2);
  let newBody = '';
  newBody = `\`${body[0]
    .replace(/\b .*[/>]/g, '')
    .replace(/\(?\([\w "$'(),/:=>{|}]+/g, '()')
    .replace(/\$\d[\w/<>-]*/g, '')}`;
  if (newBody.includes('/* ') && !newBody.includes(' */')) {
    newBody += ' */`';
  } else if (newBody.includes('<!-- ') && !newBody.includes(' -->')) {
    newBody += ' -->`';
  } else if (newBody.includes('<') && !newBody.includes('>')) {
    newBody += '>`';
  } else {
    newBody += '`';
  }
  readme += `|${newBody}|${newPrefix}|${description}|\n`;
}
readme += '\n';

// 添加 CSS/LESS/SCSS/SASS/STYLUS
readme += '## CSS/LESS/SCSS/SASS/STYLUS\n\n';
readme += '|API|Prefix|Description|\n|-|-|-|\n';
for (const key of Object.keys(cssObject)) {
  const { prefix, body, description } = cssObject[key];
  let newPrefix = '';
  for (const text of prefix) {
    newPrefix += `\`${text}\`, `;
  }
  newPrefix = newPrefix.slice(0, -2);
  let newBody = '';
  newBody = `\`${body[0]
    .replace(/\b .*[/>]/g, '')
    .replace(/\(?\([\w "$'(),/:=>{|}]+/g, '()')
    .replace(/\$\d[\w/<>-]*/g, '')}`;
  if (newBody.includes('/* ') && !newBody.includes(' */')) {
    newBody += ' */`';
  } else if (newBody.includes('<!-- ') && !newBody.includes(' -->')) {
    newBody += ' -->`';
  } else if (newBody.includes('<') && !newBody.includes('>')) {
    newBody += '>`';
  } else {
    newBody += '`';
  }
  readme += `|${newBody}|${newPrefix}|${description}|\n`;
}
readme += '\n';

// 添加 JavaScript/TypeScript
readme += '## JavaScript/TypeScript\n\n';
readme += '|API|Prefix|Description|\n|-|-|-|\n';
for (const key of Object.keys(javascriptObject)) {
  const { prefix, body, description } = javascriptObject[key];
  let newPrefix = '';
  for (const text of prefix) {
    newPrefix += `\`${text}\`, `;
  }
  newPrefix = newPrefix.slice(0, -2);
  let newBody = '';
  newBody = `\`${body[0]
    .replace(/\b .*[/>]/g, '')
    .replace(/\(?\([\w "$'(),/:=>{|}]+/g, '()')
    .replace(/\$\d[\w/<>-]*/g, '')}`;
  if (newBody.includes('/* ') && !newBody.includes(' */')) {
    newBody += ' */`';
  } else if (newBody.includes('<!-- ') && !newBody.includes(' -->')) {
    newBody += ' -->`';
  } else if (newBody.includes('<') && !newBody.includes('>')) {
    newBody += '>`';
  } else {
    newBody += '`';
  }
  readme += `|${newBody}|${newPrefix}|${description}|\n`;
}
readme += '\n';

readme += `## 额外推荐

请查看 [uni-helper 插件说明](https://marketplace.visualstudio.com/items?itemName=uni-helper.uni-helper-vscode)。
`;

writeFileSync(resolve(root, 'README.md'), readme);
