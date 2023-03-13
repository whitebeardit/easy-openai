const defaultConfig = require('./jest.config');

module.exports = {
  ...defaultConfig,
  rootDir: '../src',
  testRegex: '.component.test.ts$',
};
