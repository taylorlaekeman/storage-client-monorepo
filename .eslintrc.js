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
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'import/no-extraneous-dependencies': ['error', { packageDir: '../../' }],
    'no-console': 'error',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: [
          'packages/storage-client-core/tsconfig.json',
          'packages/storage-client-dynamodb/tsconfig.json',
          'packages/storage-client-filedb/tsconfig.json',
          'packages/storage-client-test/tsconfig.json',
        ],
      },
    },
  },
};
