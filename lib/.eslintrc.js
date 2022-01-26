module.exports = {
  env: {
    browser: true,
    es6: true
  },
  root: true,
  plugins: ['compat'],
  extends: ['eslint:recommended', 'airbnb-base/legacy', 'prettier'],
  rules: {
    'compat/compat': 'error',
    'vars-on-top': 0,
    'func-names': 0,
    strict: 0
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
};
