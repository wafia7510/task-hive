module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.m?[jt]sx?$': 'babel-jest', // ✅ Handle .js, .jsx, .ts, .tsx, .mjs
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios)/)',       // ✅ Force Jest to transform axios
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
};
