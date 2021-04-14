module.exports = {
  settings: {
    'wepy.validation.templateProps': true
  },
  projects: [
    './packages/vue2',
    { root: './packages/vue3', tsconfig: './src/tsconfig.json', globalComponents: ['./src/components/**/*.vue'] }
  ]
};
