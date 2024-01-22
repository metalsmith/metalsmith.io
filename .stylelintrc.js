module.exports = {
  extends: ['stylelint-config-recommended-scss'],
  plugins: [
    'stylelint-scss',
    'stylelint-no-unsupported-browser-features',
    'stylelint-selector-bem-pattern'
  ],
  rules: {
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['first-nested']
      }
    ],
    'font-family-name-quotes': 'always-where-recommended',
    'at-rule-no-vendor-prefix': true,
    'media-feature-name-no-vendor-prefix': true,
    'property-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    'color-named': 'never',
    'declaration-no-important': true,
    'font-weight-notation': 'numeric',
    'plugin/no-unsupported-browser-features': [
      true,
      {
        severity: 'warning',
        ignorePartialSupport: true,
        ignore: ['css-scroll-behavior', 'css-nesting'], // SCSS wrongly detected as CSS nesting
        browsers: ['> 2%', 'Last 2 versions', 'not OperaMini all', 'not dead']
      }
    ],
    'plugin/selector-bem-pattern': {
      preset: 'suit'
    },
    'selector-class-pattern': '.+'
  }
};
