process.env.TZ = 'UTC';

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../src',
  bail: 1,
  testRegex: '.*\\.unit.test\\.ts$',
  setupFiles: ['../jest/setup-tests.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s', '!**/test/**'],
  coveragePathIgnorePatterns: [
    '/src/server.ts',
    '/src/contracts/',
    '/src/__tests__',
    '/src/configurations/dotenv.ts',
    '/src/configurations/env-constants.ts',
  ],
  coverageDirectory: '../coverage/unit',
  preset: 'ts-jest',
};
