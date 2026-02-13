module.exports = {
  root: true,
  env: {
    node: true,
    commonjs: true,
    es2020: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "no-undef": "off",
    "@typescript-eslint/no-require-imports": "off",
    "@typescript-eslint/no-unused-vars": "warn",
  },
};
