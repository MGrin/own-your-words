require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    require.resolve('./eslint-config-react/index.js'),
    // More info on it https://github.com/microsoft/rushstack/blob/master/stack/eslint-plugin-packlets/README.md
    'plugin:@rushstack/eslint-plugin-packlets/recommended',
  ],
  overrides: [
    {
      files: '**.scss.d.ts',
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
  rules: {
    '@rushstack/packlets/mechanics': 'error',
    '@rushstack/packlets/circular-deps': 'error',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    // TODO: Enable and fix
    'import/no-default-export': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    'testing-library/no-debug': 'off',
    'no-console': 'off',
  },
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
}
