# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take Over mode by following these steps:

1. Run `Extensions: Show Built-in Extensions` from VS Code's command palette, look for `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`. By default, Take Over mode will enable itself if the default TypeScript extension is disabled.
2. Reload the VS Code window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over mode [here](https://github.com/johnsoncodehk/volar/discussions/471).

### eslint.js 和 prettierrc.json 配置

eslint 是用来校验格式
prettierrc 是用来修改格式

eslint 可以直接通过 npx eslint index.js 命令来校验，会提示在终端中；如果想要在每个文件里面提示，需要在 vscode 中下载插件 eslint；

```
// eslint 在package.json里配置
{
//--ext后面需要写上指定检测文件的后缀，如.js、.jsx、 .vue等，紧接着后面要写上一个参数，这个参数就是我们要检测哪个目录下面的文件，一般项目文件都在src下面，所以在后面写上src/就好
"lint": "eslint --ext .js --ext .jsx --ext .vue src/"
// 会自动修复eslint问题
"lint-fix": "eslint --fix --ext .js --ext .jsx --ext .vue src/"
}
```

prettier 可以通过 npx prettier --write index.js 命令来修改；如果要自动保存时修改，需要先在 setting.js 中设置自动保存后，再下载 prettier 插件；
husky 提交代码前的校验

eslint vite 项目下载 npm 包：
eslint-config-standard eslint-plugin-import eslint-plugin-promise eslint-plugin-node
husky 操作步骤：

- 方法一：
  1.npm i -D husky
  2.npx husky install // 创建 husky 目录，并初始化
  3.npx husky add .husky/pre-commit 'npm run lint' // 创建 pre-commit，并执行 package.js 里面的 npm run lint
  ![](image/README/1651230583536.png)

- 方法二：
  1.npm i -D husky @commitlint/config-conventional

  ```
  // commitlint.config.js规范
  build：主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
  ci：主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交
  docs：文档更新
  feat：新增功能
  merge：分支合并 Merge branch ? of ?
  fix：bug 修复
  perf：性能, 体验优化
  refactor：重构代码(既没有新增功能，也没有修复 bug)
  style：不影响程序逻辑的代码修改(修改空白字符，格式缩进，补全缺失的分号等，没有改变代码逻辑)
  test：新增测试用例或是更新现有测试
  revert：回滚某个更早之前的提交
  chore：不属于以上类型的其他类型
  ```

  2.

### stylelintrc.js 配置

CSS 代码检查工具 stylelint

1. 下载 npm install --save-dev postcss-scss postcss-html stylelint-config-recommended-vue stylelint-config-standard-scss stylelint
2. 在.stylelintrc.js 中配置

```
module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recommended-vue/scss', 'stylelint-config-recess-order'],
  rules: {
    'order/properties-order': ['color', 'padding', 'color', 'margin-top']
  }
};
```

3.在 setting.js 中配置

```
{
  // stylelint 需要检查的文件
  "stylelint.validate": [
    "css",
    "less",
    "postcss",
    "scss",
    "vue",
    "sass"
  ],

}
```

### package.json 中的设置

- 配置

```
{
    "dev": "cross-env NODE_ENV=development vite",
    "build": "vue-tsc --noEmit && vite build",
    // 用作预览本地构建，而不应直接作为生产服务器。先 npm run build && npm run preview
    "preview": "vite preview",
    // vue-tsc --noEmit 构建之前添加 tsc 校验,再次打包，错误代码被校验出来，打包失败
    "typecheck": "vue-tsc --noEmit",
    // 分析打包产物
    "report": "set report=true&& vite build",
    "eslint": "eslint --fix --ext .js --ext .jsx --ext .ts --ext .tsx --ext .vue src/",
    "stylelint": "stylelint **/*.{html,vue,css,scss}",
    "lint": "npm run typecheck && npm run eslint && npm run stylelint",
    "lint-fix": "npm run eslint -- --fix && npm run stylelint -- --fix",
    // husky 提交代码前的校验
    "prepare": "husky install"
}
```

- eslint Vue3 一直报错 error: Parsing error: Unexpected token 解决方法(在 vue3 ts 中的解决办法)
  ![](image/项目试错/1651216293068.png)
  ![](image/项目试错.md/1651215176.jpg)

  1.安装依赖 eslint-plugin-vue @typescript-eslint/parser @typescript-eslint/eslint-plugin
  2.eslintrc.js 文件中的配置

  ```
  module.exports = {
    parserOptions: {
      parser: '@typescript-eslint/parser'
    },
    parser: 'vue-eslint-parser',
    extends: ['plugin:vue/vue3-recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  }
  ```

- vite2 添加类似 webpack-bundle-analyzer 依赖分析插件

```
import vue from "@vitejs/plugin-vue";
import visualizer from "rollup-plugin-visualizer";

const plugins = [];

// 打包生产环境才引入的插件
if (process.env.NODE_ENV === "production") {
    // 打包依赖展示
    plugins.push(
        visualizer({
            open: true,
            gzipSize: true,
            brotliSize: true,
        })
    );
}

export default defineConfig({
    plugins: [
          vue(),
          ...plugins
    ]
})
```
