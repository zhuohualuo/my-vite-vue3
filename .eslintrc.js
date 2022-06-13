module.exports = {
  parserOptions: {
    ecmaVersion: 2018, // 默认设置为 3，5（默认）， 你可以使用 6、7、8、9 或 10 来指定你想要使用的 ECMAScript 版本。你也可以用使用年份命名的版本号指定为 2015（同 6），2016（同 7），或 2017（同 8）或 2018（同 9）或 2019 (same as 10)
    sourceType: 'module', // 设置为 "script" (默认) 或 "module"（如果你的代码是 ECMAScript 模块)。
    ecmaFeatures: {
      globalReturn: false, // 允许在全局作用域下使用 return 语句
      impliedStrict: false, // 启用全局 strict mode (如果 ecmaVersion 是 5 或更高)
      jsx: false, // 启用 JSX
      experimentalObjectRestSpread: false // 启用实验性的 object rest/spread properties 支持。(重要：这是一个实验性的功能,在未来可能会有明显改变。 建议你写的规则 不要 依赖该功能，除非当它发生改变时你愿意承担维护成本。)
    },
    requireConfigFile: false, // 解决Parsing error: No Babel config file detected for报错
    parser: '@typescript-eslint/parser' // esprima,ESLint 默认使用Espree作为其解析器；或者 babel-eslint，如果项目是基于webpack的，项目里的代码都是需要经过babel去处理的，引入之后，我们可以在vue-loader处理文件之前进行eslint检查，就不需要每次执行npm run lint去独立检查
  },
  parser: 'vue-eslint-parser',
  /* "off" 或 0 - 关闭规则
  "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
  "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出) */
  rules: {
    'prettier/prettier': 0,
    'arrow-body-style': 0,
    'prefer-arrow-callback': 0,
    'vue/multi-word-component-names': 0, // 不规定了组件的名称格式 解决报错Component name “xxx“ should always be multi-word vue/multi-word-component-names
    '@typescript-eslint/no-non-null-assertion': 0,
    semi: 0,
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_', // 指定排除不需要检测 例如，下划线开头的变量。
        varsIgnorePattern: '^_' // 指定了不需要检测的异常：变量名称匹配正则模式。例如，变量的名字包含 ignored 或者 Ignored。
      }
    ]
  },
  plugins: ['prettier'], // 启用插件prettier
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        mocha: true
      }
    }
  ],
  // 该设置启用了 Node.js 和 Mocha 环境
  env: {
    browser: true,
    node: true
  },
  // 当访问当前源文件内未定义的变量时，no-undef 规则将发出警告; 要在配置文件中配置全局变量，请将 globals 配置属性设置为一个对象，该对象包含以你希望使用的每个全局变量。对于每个全局变量键，将对应的值设置为 "writable" 以允许重写变量，或 "readonly" 不允许重写变量
  globals: {
    defineProps: 'readonly'
  },
  root: true, // 默认情况下，ESLint 会在所有父级目录里寻找配置文件，一直到根目录。如果你想要你所有项目都遵循一个特定的约定时，这将会很有用，但有时候会导致意想不到的结果。为了将 ESLint 限制到一个特定的项目
  // 一个配置文件可以被基础配置中的已启用的规则继承
  extends: ['standard', 'plugin:vue/vue3-recommended', 'plugin:@typescript-eslint/recommended']
  // eslintIgnore: ['hello.js', 'world.js'] //如果没有发现 .eslintignore 文件，也没有指定替代文件，ESLint 将在 package.json 文件中查找 eslintIgnore 键，来检查要忽略的文件。
};
