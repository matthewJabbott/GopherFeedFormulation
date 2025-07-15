module.exports = {
  testEnvironment: 'node',
  roots: ['../'],
  testMatch: [
    '**/tests/unit/**/*.test.js',
    '**/tests/integration/**/*.test.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
    '!**/node_modules/**'
  ],
  coverageDirectory: '../coverage',
  setupFilesAfterEnv: ['../tests/config/setup.js'],
  moduleDirectories: ['node_modules', 'src'],
  verbose: true
}; 