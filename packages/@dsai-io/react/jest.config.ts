import { pathsToModuleNameMapper } from 'ts-jest';

// Manual path mapping from tsconfig.base.json
const pathMapping = {
  '@dsai/tokens': ['packages/@dsai/tokens/src'],
  '@dsai/tokens/(.*)': ['packages/@dsai/tokens/src/$1'],
  '@dsai/react': ['packages/@dsai/react/src'],
  '@dsai/react/(.*)': ['packages/@dsai/react/src/$1'],
  '@dsai/figma-tokens': ['packages/@dsai/figma-tokens/src'],
  '@dsai/figma-tokens/(.*)': ['packages/@dsai/figma-tokens/src/$1'],
};

export default {
  displayName: '@dsai/react',
  testEnvironment: 'jsdom',
  rootDir: '../../../',
  roots: ['<rootDir>/packages/@dsai/react'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          isolatedModules: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@/test/(.*)$': '<rootDir>/test/$1',
    ...pathsToModuleNameMapper(pathMapping, {
      prefix: '<rootDir>/',
    }),
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: [
    '<rootDir>/test/setup.ts',
    '<rootDir>/packages/@dsai/react/src/hooks/__tests__/setup.ts',
  ],
  coverageDirectory: '<rootDir>/coverage/packages/@dsai/react',
  coverageThreshold: {
    'packages/@dsai/react/src/hooks/**/*.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testMatch: ['<rootDir>/packages/@dsai/react/**/*.(test|spec).(ts|tsx)'],
};
