module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser', 
    requireConfigFile: false,
    sourceType: 'module',
  },
  extends: [
    'plugin:vue/vue3-recommended',
  ],
};
