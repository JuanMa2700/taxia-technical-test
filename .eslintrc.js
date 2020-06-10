module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2020: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    "no-mixed-spaces-and-tabs": 0,
    "no-path-concat": 2,
    "no-process-exit": 2,
  },
  globals: {
    use: "readonly",
  },
};
