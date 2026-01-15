/**
 * Tests for project detector module
 *
 * @packageDocumentation
 * @module @dsai/tools/cli/init/__tests__/detector
 */

import { existsSync, readFileSync } from 'node:fs';

import {
  detectProject,
  detectPackageManager,
  detectFramework,
  detectMetaFramework,
  detectStyling,
  detectTypeScript,
  getRecommendedConfig,
  getProjectSummary,
  SUPPORTED_FRAMEWORKS,
  COMING_SOON_FRAMEWORKS,
} from '../detector';
import { isFrameworkSupported, getFrameworkSupportMessage } from '../templates';

import type { ProjectInfo, PackageJsonData } from '../detector';

// Mock fs module
jest.mock('node:fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
}));

const mockExistsSync = existsSync as jest.Mock;
const mockReadFileSync = readFileSync as jest.Mock;

describe('Project Detector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('detectPackageManager', () => {
    it('should detect pnpm from pnpm-lock.yaml', () => {
      mockExistsSync.mockImplementation((path: string) => {
        return path.endsWith('pnpm-lock.yaml');
      });

      const result = detectPackageManager('/test/project');
      expect(result).toBe('pnpm');
    });

    it('should detect yarn from yarn.lock', () => {
      mockExistsSync.mockImplementation((path: string) => {
        return path.endsWith('yarn.lock');
      });

      const result = detectPackageManager('/test/project');
      expect(result).toBe('yarn');
    });

    it('should detect bun from bun.lockb', () => {
      mockExistsSync.mockImplementation((path: string) => {
        return path.endsWith('bun.lockb');
      });

      const result = detectPackageManager('/test/project');
      expect(result).toBe('bun');
    });

    it('should default to npm when no lock file found', () => {
      mockExistsSync.mockReturnValue(false);

      const result = detectPackageManager('/test/project');
      expect(result).toBe('npm');
    });
  });

  describe('detectFramework', () => {
    it('should detect React from dependencies', () => {
      const pkg: PackageJsonData = {
        name: 'test',
        dependencies: { react: '^18.2.0', 'react-dom': '^18.2.0' },
      };
      const result = detectFramework(pkg);
      expect(result).toBe('react');
    });

    it('should detect Vue from dependencies', () => {
      const pkg: PackageJsonData = {
        name: 'test',
        dependencies: { vue: '^3.3.0' },
      };
      const result = detectFramework(pkg);
      expect(result).toBe('vue');
    });

    it('should detect Angular from dependencies', () => {
      const pkg: PackageJsonData = {
        name: 'test',
        dependencies: { '@angular/core': '^16.0.0' },
      };
      const result = detectFramework(pkg);
      expect(result).toBe('angular');
    });

    it('should detect Svelte from dependencies', () => {
      const pkg: PackageJsonData = {
        name: 'test',
        dependencies: { svelte: '^4.0.0' },
      };
      const result = detectFramework(pkg);
      expect(result).toBe('svelte');
    });

    it('should return vanilla for unknown dependencies', () => {
      const pkg: PackageJsonData = {
        name: 'test',
        dependencies: { lodash: '^4.17.21' },
      };
      const result = detectFramework(pkg);
      expect(result).toBe('vanilla');
    });
  });

  describe('detectMetaFramework', () => {
    it('should detect Next.js from dependencies', () => {
      const pkg: PackageJsonData = {
        name: 'test',
        dependencies: { next: '^14.0.0', react: '^18.2.0' },
      };
      const result = detectMetaFramework(pkg, '/test/project');
      expect(result).toBe('next');
    });

    it('should detect Remix from dependencies', () => {
      const pkg: PackageJsonData = {
        name: 'test',
        dependencies: { '@remix-run/react': '^2.0.0' },
      };
      const result = detectMetaFramework(pkg, '/test/project');
      expect(result).toBe('remix');
    });

    it('should detect Gatsby from dependencies', () => {
      const pkg: PackageJsonData = {
        name: 'test',
        dependencies: { gatsby: '^5.0.0' },
      };
      const result = detectMetaFramework(pkg, '/test/project');
      expect(result).toBe('gatsby');
    });

    it('should detect Nuxt from dependencies', () => {
      const pkg: PackageJsonData = {
        name: 'test',
        dependencies: { nuxt: '^3.0.0' },
      };
      const result = detectMetaFramework(pkg, '/test/project');
      expect(result).toBe('nuxt');
    });

    it('should return none for no meta framework', () => {
      const pkg: PackageJsonData = {
        name: 'test',
        dependencies: { react: '^18.2.0' },
      };
      const result = detectMetaFramework(pkg, '/test/project');
      expect(result).toBe('none');
    });
  });

  describe('detectStyling', () => {
    beforeEach(() => {
      mockExistsSync.mockReturnValue(false);
    });

    it('should detect Tailwind from devDependencies', () => {
      const pkg: PackageJsonData = {
        name: 'test',
        devDependencies: { tailwindcss: '^3.3.0' },
      };
      const result = detectStyling(pkg, '/test/project');
      expect(result).toBe('tailwind');
    });

    it('should detect Styled Components from dependencies', () => {
      const pkg: PackageJsonData = {
        name: 'test',
        dependencies: { 'styled-components': '^6.0.0' },
      };
      const result = detectStyling(pkg, '/test/project');
      expect(result).toBe('styled-components');
    });

    it('should detect Emotion from dependencies', () => {
      const pkg: PackageJsonData = {
        name: 'test',
        dependencies: { '@emotion/react': '^11.0.0' },
      };
      const result = detectStyling(pkg, '/test/project');
      expect(result).toBe('emotion');
    });

    it('should detect SCSS from devDependencies', () => {
      const pkg: PackageJsonData = {
        name: 'test',
        devDependencies: { sass: '^1.60.0' },
      };
      const result = detectStyling(pkg, '/test/project');
      expect(result).toBe('scss');
    });

    it('should return unknown as default when no styling detected', () => {
      const pkg: PackageJsonData = {
        name: 'test',
      };
      const result = detectStyling(pkg, '/test/project');
      expect(result).toBe('unknown');
    });
  });

  describe('detectTypeScript', () => {
    it('should detect TypeScript from devDependencies', () => {
      const pkg: PackageJsonData = {
        name: 'test',
        devDependencies: { typescript: '^5.0.0' },
      };
      mockExistsSync.mockReturnValue(false);
      const result = detectTypeScript(pkg, '/test/project');
      expect(result).toBe(true);
    });

    it('should detect TypeScript from tsconfig.json', () => {
      const pkg: PackageJsonData = {
        name: 'test',
      };
      mockExistsSync.mockImplementation((path: string) => {
        return path.endsWith('tsconfig.json');
      });
      const result = detectTypeScript(pkg, '/test/project');
      expect(result).toBe(true);
    });

    it('should return false when no TypeScript indicators', () => {
      const pkg: PackageJsonData = {
        name: 'test',
      };
      mockExistsSync.mockReturnValue(false);
      const result = detectTypeScript(pkg, '/test/project');
      expect(result).toBe(false);
    });
  });

  describe('detectProject', () => {
    it('should detect a complete React project', () => {
      const mockPackageJson = {
        name: 'test-react-app',
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0',
        },
        devDependencies: {
          typescript: '^5.0.0',
          tailwindcss: '^3.3.0',
        },
      };

      mockExistsSync.mockImplementation((path: string) => {
        if (path.endsWith('package.json')) {
          return true;
        }
        if (path.endsWith('tsconfig.json')) {
          return true;
        }
        if (path.endsWith('pnpm-lock.yaml')) {
          return true;
        }
        return false;
      });

      mockReadFileSync.mockReturnValue(JSON.stringify(mockPackageJson));

      const result = detectProject('/test/project');

      expect(result.isProject).toBe(true);
      expect(result.framework).toBe('react');
      expect(result.typescript).toBe(true);
      expect(result.packageManager).toBe('pnpm');
      expect(result.styling).toBe('tailwind');
    });

    it('should detect when no package.json exists', () => {
      mockExistsSync.mockReturnValue(false);

      const result = detectProject('/test/empty');

      expect(result.isProject).toBe(false);
      expect(result.framework).toBe('unknown');
    });

    it('should handle malformed package.json', () => {
      mockExistsSync.mockImplementation((path: string) => {
        return path.endsWith('package.json');
      });

      mockReadFileSync.mockReturnValue('{ invalid json }');

      const result = detectProject('/test/project');

      expect(result.isProject).toBe(false);
    });
  });

  describe('getRecommendedConfig', () => {
    it('should recommend React-specific settings for React projects', () => {
      const projectInfo: ProjectInfo = {
        isProject: true,
        isMonorepo: false,
        framework: 'react',
        metaFramework: 'none',
        packageManager: 'pnpm',
        typescript: true,
        esm: true,
        styling: 'css',
        hasExistingTokens: false,
        styleDirectories: [],
      };

      const config = getRecommendedConfig(projectInfo);

      expect(config.prefix).toBe('--dsai-');
      expect(config.outputFormats).toContain('css');
      expect(config.configFormat).toBe('ts');
    });

    it('should recommend JS config for non-TypeScript projects', () => {
      const projectInfo: ProjectInfo = {
        isProject: true,
        isMonorepo: false,
        framework: 'vanilla',
        metaFramework: 'none',
        packageManager: 'npm',
        typescript: false,
        esm: true,
        styling: 'css',
        hasExistingTokens: false,
        styleDirectories: [],
      };

      const config = getRecommendedConfig(projectInfo);

      expect(config.configFormat).toBe('mjs');
    });

    it('should recommend SCSS format for projects using SCSS', () => {
      const projectInfo: ProjectInfo = {
        isProject: true,
        isMonorepo: false,
        framework: 'react',
        metaFramework: 'none',
        packageManager: 'npm',
        typescript: true,
        esm: true,
        styling: 'scss',
        hasExistingTokens: false,
        styleDirectories: [],
      };

      const config = getRecommendedConfig(projectInfo);

      expect(config.outputFormats).toContain('scss');
    });

    it('should recommend Next.js specific output for Next.js projects', () => {
      const projectInfo: ProjectInfo = {
        isProject: true,
        isMonorepo: false,
        framework: 'react',
        metaFramework: 'next',
        packageManager: 'npm',
        typescript: true,
        esm: true,
        styling: 'css',
        hasExistingTokens: false,
        styleDirectories: [],
      };

      const config = getRecommendedConfig(projectInfo);

      expect(config.outputDir).toContain('styles');
    });
  });

  describe('getProjectSummary', () => {
    it('should generate summary lines for a project', () => {
      const projectInfo: ProjectInfo = {
        isProject: true,
        isMonorepo: false,
        framework: 'react',
        metaFramework: 'next',
        packageManager: 'pnpm',
        typescript: true,
        esm: true,
        styling: 'tailwind',
        hasExistingTokens: false,
        styleDirectories: [],
      };

      const summary = getProjectSummary(projectInfo);

      expect(summary).toContainEqual(expect.stringContaining('Framework'));
      expect(summary).toContainEqual(expect.stringContaining('react'));
      expect(summary).toContainEqual(expect.stringContaining('next'));
      expect(summary).toContainEqual(expect.stringContaining('pnpm'));
      expect(summary).toContainEqual(expect.stringContaining('TypeScript'));
    });

    it('should indicate JavaScript for non-TypeScript projects', () => {
      const projectInfo: ProjectInfo = {
        isProject: true,
        isMonorepo: false,
        framework: 'vanilla',
        metaFramework: 'none',
        packageManager: 'npm',
        typescript: false,
        esm: true,
        styling: 'css',
        hasExistingTokens: false,
        styleDirectories: [],
      };

      const summary = getProjectSummary(projectInfo);

      // Check that it indicates no TypeScript (TypeScript: No)
      expect(summary).toContainEqual(expect.stringContaining('TypeScript: No'));
    });
  });

  describe('Framework Support', () => {
    it('should indicate React is supported', () => {
      expect(isFrameworkSupported('react')).toBe(true);
    });

    it('should indicate vanilla is supported', () => {
      expect(isFrameworkSupported('vanilla')).toBe(true);
    });

    it('should indicate Vue is not yet supported', () => {
      expect(isFrameworkSupported('vue')).toBe(false);
    });

    it('should indicate Angular is not yet supported', () => {
      expect(isFrameworkSupported('angular')).toBe(false);
    });

    it('should have correct supported frameworks list', () => {
      expect(SUPPORTED_FRAMEWORKS).toContain('react');
      expect(SUPPORTED_FRAMEWORKS).toContain('vanilla');
      expect(SUPPORTED_FRAMEWORKS).not.toContain('vue');
    });

    it('should have Vue in coming soon list', () => {
      expect(COMING_SOON_FRAMEWORKS).toContain('vue');
      expect(COMING_SOON_FRAMEWORKS).toContain('angular');
      expect(COMING_SOON_FRAMEWORKS).toContain('svelte');
    });

    it('should return a message for unsupported frameworks', () => {
      const message = getFrameworkSupportMessage('vue');
      expect(message).toBeDefined();
      expect(message).toContain('coming soon');
    });

    it('should return undefined for supported frameworks', () => {
      const message = getFrameworkSupportMessage('react');
      expect(message).toBeUndefined();
    });
  });
});
