// eslint.config.js
import js from '@eslint/js'

export default [
  // 1. 全局忽略：构建产物、依赖、临时文件等
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.git/**',
      '**/*.min.js',
    ],
  },

  // 2. ESLint 推荐规则（覆盖所有 JS/TS 文件）
  js.configs.recommended,

  // 3. 基础规则 + Prettier 冲突解决
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // 如果是 Node.js 项目，添加全局变量
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },

    rules: {
      // 代码质量规则（Prettier 不管这些）
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-undef': 'error',

      // 注意：不要在这里配置任何格式类规则（如 indent、quotes、semi）
      // 这些全部交给 Prettier 管理
    },
  },

  // 4. 测试文件特殊规则（如果有）
  {
    files: ['**/*.test.{js,mjs,cjs}', '**/test/**/*.{js,mjs,cjs}'],
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'off',
    },
  },

  // 5. 配置文件特殊规则
  {
    files: ['eslint.config.js', '*.config.{js,mjs,cjs}'],
    rules: {
      'no-undef': 'off', // 配置文件中的模块导出不需要全局定义
    },
  },
]
