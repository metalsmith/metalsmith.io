module.exports = {
  env: {
    browser: true
  },
  root: true,
  plugins: ['compat'],
  extends: ['airbnb-base/legacy', 'prettier'],
  rules: {
    'compat/compat': 'error',
    'vars-on-top': 0,
    'func-names': 0
  }
};
