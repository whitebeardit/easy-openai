const mainRules = {
  '@typescript-eslint/naming-convention': [
    'error',
    {
      selector: 'interface',
      format: ['PascalCase'],
      custom: {
        regex: '^I[A-Z]',
        match: true,
      },
    },
  ],
  'max-params': ['error', 3],
  'import/prefer-default-export': 'off',
};

module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-typescript/base',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
    'plugin:boundaries/recommended',
    'eslint:recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
    project: 'tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'prettier', 'boundaries'],
  rules: {
    ...mainRules,
    '@typescript-eslint/prefer-readonly': [
      'error',
      { onlyInlineLambdas: true },
    ],
    'default-case': 'error',
    'no-fallthrough': 'error',
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
    'no-unused-vars': 'off',
    'no-underscore-dangle': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'class-methods-use-this': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-unresolved': 'off',
    'boundaries/element-types': [
      2,
      {
        default: 'disallow',
        rules: [
          {
            from: 'domains',
            allow: ['domains'],
          },
          {
            from: 'infrastructure',
            allow: ['infrastructure', 'domains', 'configurations'],
          },
          {
            from: 'application',
            allow: ['domains', 'application', 'configurations'],
          },
          {
            from: 'configurations',
            allow: [
              'infrastructure',
              'domains',
              'application',
              'configurations',
            ],
          },
        ],
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    'boundaries/no-unknown-files': false,
    'boundaries/no-unknown': false,
    'boundaries/elements': [
      {
        type: 'configurations',
        mode: 'file',
        pattern: 'src/configurations/**/*.ts',
      },
      {
        type: 'infrastructure',
        mode: 'file',
        pattern: 'src/infrastructure/**/*.ts',
      },
      {
        type: 'domains',
        mode: 'file',
        pattern: 'src/domain/**/*.ts',
      },
      {
        type: 'application',
        mode: 'file',
        pattern: 'src/application/**/*.ts',
      },
    ],
  },
};
