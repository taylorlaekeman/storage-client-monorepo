const getJestConfig = () => ({
  clearMocks: true,
  moduleNameMapper: {
    '^@src(.*)$': '<rootDir>/src$1',
    '^@test(.*)$': '<rootDir>/__test__$1',
  },
  preset: 'ts-jest',
  setupFiles: ['dotenv/config'],
  testPathIgnorePatterns: ['/node_modules/', '.*.integration.test.ts'],
});

export default getJestConfig;
