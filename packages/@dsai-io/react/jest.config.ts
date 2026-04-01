export default {
  preset: './jest.preset.cjs',
  displayName: '@dsai-io/react',
  rootDir: '../../../',
  roots: ['<rootDir>/packages/@dsai-io/react'],
  setupFilesAfterEnv: [
    '<rootDir>/test/setup.ts',
    '<rootDir>/packages/@dsai-io/react/src/hooks/__tests__/setup.ts',
  ],
  coverageDirectory: '<rootDir>/coverage/packages/@dsai-io/react',
  coverageThreshold: {
    'packages/@dsai-io/react/src/hooks/**/*.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testMatch: ['<rootDir>/packages/@dsai-io/react/**/*.(test|spec).(ts|tsx)'],
};
