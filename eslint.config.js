// @ts-check
import { builtinModules, createRequire } from 'node:module';
import eslint from '@eslint/js';
import pluginN from 'eslint-plugin-n';
import * as pluginI from 'eslint-plugin-i';
import pluginRegExp from 'eslint-plugin-regexp';
import tsParser from '@typescript-eslint/parser';
import tseslint from 'typescript-eslint';
import globals from 'globals';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/assets/**',
      '**/report/**',
      '**/public/**',
      '**/fixtures/**',
      '**/playground-temp/**',
      '**/temp/**',
      '**/*.snap',
      '**/cache/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  /** @type {any} */ (pluginRegExp.configs['flat/recommended']),
  {
    name: 'main',
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2022,
      },
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      n: pluginN,
      i: pluginI,
    },
    rules: {
      'n/no-exports-assign': 'error',
      'n/no-unpublished-bin': 'error',
      'n/no-unsupported-features/es-builtins': 'error',
      'n/no-unsupported-features/node-builtins': 'off',
      'n/process-exit-as-throw': 'error',
      'n/hashbang': 'error',

      eqeqeq: ['warn', 'always', { null: 'never' }],
      'no-debugger': ['error'],
      // 'no-empty': ['warn', { allowEmptyCatch: true }],
      'no-empty': 'off',
      'no-process-exit': 'off',
      'no-useless-escape': 'off',
      'prefer-rest-params': 'off',
      'regexp/no-obscure-range': 'off',
      'prefer-const': [
        'warn',
        {
          destructuring: 'all',
        },
      ],

      'n/no-missing-require': [
        'error',
        {
          // for try-catching yarn pnp
          allowModules: ['pnpapi', 'vite'],
          tryExtensions: ['.ts', '.js', '.jsx', '.tsx', '.d.ts'],
        },
      ],
      'n/no-extraneous-import': [
        'error',
        {
          allowModules: ['vite', 'less', 'sass', 'vitest', 'unbuild'],
        },
      ],
      'n/no-extraneous-require': [
        'error',
        {
          allowModules: ['vite'],
        },
      ],
      '@typescript-eslint/no-wrapper-object-types': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/ban-types': 'off', // TODO: we should turn this on in a new PR
      '@typescript-eslint/explicit-module-boundary-types': ['error', { allowArgumentsExplicitlyTypedAsAny: true }],
      // '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-explicit-any': 'off', // maybe we should turn this on in a new PR
      'no-extra-semi': 'off',
      '@typescript-eslint/no-extra-semi': 'off', // conflicts with prettier
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off', // maybe we should turn this on in a new PR
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', disallowTypeAnnotations: false },
      ],
      // disable rules set in @typescript-eslint/stylistic v6 that wasn't set in @typescript-eslint/recommended v5 and which conflict with current code
      // maybe we should turn them on in a new PR
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/ban-tslint-comment': 'off',
      '@typescript-eslint/consistent-generic-constructors': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/prefer-for-of': 'off',
      '@typescript-eslint/prefer-function-type': 'off',

      'i/no-nodejs-modules': ['error', { allow: builtinModules.map((mod) => `node:${mod}`) }],
      'i/no-duplicates': 'error',
      'i/order': 'error',
      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: false,
        },
      ],

      'regexp/no-contradiction-with-assertion': 'error',
      // in some cases using explicit letter-casing is more performant than the `i` flag
      'regexp/use-ignore-case': 'off',
    },
  },
  {
    name: 'vite/globals',
    files: ['packages/**/*.?([cm])[jt]s?(x)'],
    ignores: ['**/__tests__/**'],
    rules: {
      'no-restricted-globals': ['error', 'require', '__dirname', '__filename'],
    },
  },
  {
    name: 'playground/enforce-esm',
    files: ['playground/**/*.?([cm])[jt]s?(x)'],
    ignores: [
      'playground/ssr-resolve/**',
      'playground/**/*{commonjs,cjs}*/**',
      'playground/**/*{commonjs,cjs}*',
      'playground/**/*dep*/**',
      'playground/resolve/browser-module-field2/index.web.js',
      'playground/resolve/browser-field/**',
      'playground/tailwind/**', // blocked by https://github.com/postcss/postcss-load-config/issues/239
    ],
    rules: {
      'i/no-commonjs': 'error',
    },
  },
  {
    name: 'playground/test',
    files: ['playground/**/__tests__/**/*.?([cm])[jt]s?(x)'],
    rules: {
      // engine field doesn't exist in playgrounds
      'n/no-unsupported-features/es-builtins': [
        'error',
        {
          version: pkg.engines.node,
        },
      ],
      'n/no-unsupported-features/node-builtins': [
        'error',
        {
          version: pkg.engines.node,
          // ideally we would like to allow all experimental features
          // https://github.com/eslint-community/eslint-plugin-n/issues/199
          ignores: ['fetch'],
        },
      ],
    },
  },

  {
    name: 'disables/vite/client',
    files: ['packages/vite/src/client/**/*.?([cm])[jt]s?(x)'],
    ignores: ['**/__tests__/**'],
    rules: {
      'n/no-unsupported-features/node-builtins': 'off',
    },
  },
  {
    name: 'disables/vite/types',
    files: [
      'packages/vite/src/types/**/*.?([cm])[jt]s?(x)',
      'packages/vite/scripts/**/*.?([cm])[jt]s?(x)',
      '**/*.spec.ts',
    ],
    rules: {
      'n/no-extraneous-import': 'off',
    },
  },
  {
    name: 'disables/create-vite/templates',
    files: ['packages/create-vite/template-*/**/*.?([cm])[jt]s?(x)', '**/build.config.ts'],
    rules: {
      'no-undef': 'off',
      'n/no-missing-import': 'off',
      'n/no-extraneous-import': 'off',
      'n/no-extraneous-require': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    name: 'disables/playground',
    files: ['playground/**/*.?([cm])[jt]s?(x)', 'docs/**/*.?([cm])[jt]s?(x)'],
    rules: {
      'n/no-extraneous-import': 'off',
      'n/no-extraneous-require': 'off',
      'n/no-missing-import': 'off',
      'n/no-missing-require': 'off',
      'n/no-unsupported-features/es-builtins': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-undef': 'off',
      'no-empty': 'off',
      'no-constant-condition': 'off',
    },
  },
  {
    name: 'disables/playground/tsconfig-json',
    files: [
      'playground/tsconfig-json/**/*.?([cm])[jt]s?(x)',
      'playground/tsconfig-json-load-error/**/*.?([cm])[jt]s?(x)',
    ],
    ignores: ['**/__tests__/**'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
  {
    name: 'disables/js',
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    name: 'disables/dts',
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
  {
    name: 'disables/test',
    files: ['**/__tests__/**/*.?([cm])[jt]s?(x)'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
);
