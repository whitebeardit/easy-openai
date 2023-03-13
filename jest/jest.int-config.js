const defaultConfig = require('./jest.config');

module.exports = {
  ...defaultConfig,
  testRegex: '.*\\.int.test\\.ts$',
  coverageDirectory: '../coverage/int',
  setupFilesAfterEnv: [
    '../jest/setup-integration-tests.ts',
  ],
  setupFiles: [...defaultConfig.setupFiles],
  globalSetup: '../jest/start-integration.ts',
  globalTeardown: '../jest/stop-integration.ts',
};