module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    project: './tsconfig.eslint.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'import/extensions': ['error', { ts: 'never' }],
    'no-console': 'error',
    'no-use-before-define': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: [
          'packages/storage-engine-core/tsconfig.json',
          'packages/storage-engine-dynamodb/tsconfig.json',
          'packages/storage-engine-filedb/tsconfig.json',
          'packages/storage-engine-test/tsconfig.json',
        ],
      },
    },
  },
};
