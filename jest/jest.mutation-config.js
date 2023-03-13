const defaultConfig = require('./jest.config');

module.exports = {
  ...defaultConfig,
  coverageDirectory: '../coverage/mutation',
};