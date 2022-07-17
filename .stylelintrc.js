// .stylelintrc.js

module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recommended-vue/scss', 'stylelint-config-recess-order'],
  rules: {
    'order/properties-order': ['color', 'padding', 'color', 'margin-top']
  }
};
