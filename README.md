# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take Over mode by following these steps:

1. Run `Extensions: Show Built-in Extensions` from VS Code's command palette, look for `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`. By default, Take Over mode will enable itself if the default TypeScript extension is disabled.
2. Reload the VS Code window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over mode [here](https://github.com/johnsoncodehk/volar/discussions/471).

### eslint.js 和 prettierrc.json配置

eslint 是用来校验格式
prettierrc 是用来修改格式

eslint 可以直接通过 npx eslint index.js 命令来校验，会提示在终端中；如果想要在每个文件里面提示，需要在vscode中下载插件eslint；
prettier 可以通过 npx prettier --write index.js 命令来修改；如果要自动保存时修改，需要先在setting.js中设置自动保存后，再下载prettier插件；
husky 提交代码前的校验

eslint vite项目下载npm包：
eslint-config-standard eslint-plugin-import eslint-plugin-promise eslint-plugin-node
husky 操作步骤：
1.npm i -D husky
2.npx husky install // 创建husky目录，并初始化
3.npx husky add .husky/pre-commit 'npm run lint' // 创建pre-commit，并执行package.js里面的npm run lint
