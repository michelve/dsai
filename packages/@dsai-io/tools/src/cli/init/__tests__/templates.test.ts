/**
 * Tests for templates module
 *
 * @packageDocumentation
 * @module @dsai-io/tools/cli/init/__tests__/templates
 */

import {
  generateTemplate,
  isFrameworkSupported,
  getFrameworkSupportMessage,
  generateSourceReadme,
  generateTokenTypesStub,
  getFrameworkOutputDir,
} from '../templates';

import type { ProjectInfo } from '../detector';
import type { TemplateOptions } from '../templates';

describe('Templates', () => {
  describe('isFrameworkSupported', () => {
    it('should return true for React', () => {
      expect(isFrameworkSupported('react')).toBe(true);
    });

    it('should return true for vanilla', () => {
      expect(isFrameworkSupported('vanilla')).toBe(true);
    });

    it('should return false for Vue', () => {
      expect(isFrameworkSupported('vue')).toBe(false);
    });

    it('should return false for Angular', () => {
      expect(isFrameworkSupported('angular')).toBe(false);
    });

    it('should return false for Svelte', () => {
      expect(isFrameworkSupported('svelte')).toBe(false);
    });

    it('should return false for Solid', () => {
      expect(isFrameworkSupported('solid')).toBe(false);
    });
  });

  describe('getFrameworkSupportMessage', () => {
    it('should return undefined for React (supported)', () => {
      const message = getFrameworkSupportMessage('react');
      expect(message).toBeUndefined();
    });

    it('should return undefined for vanilla (supported)', () => {
      const message = getFrameworkSupportMessage('vanilla');
      expect(message).toBeUndefined();
    });

    it('should return coming soon message for Vue', () => {
      const message = getFrameworkSupportMessage('vue');
      expect(message).toBeDefined();
      expect(message).toContain('coming soon');
    });

    it('should return coming soon message for Angular', () => {
      const message = getFrameworkSupportMessage('angular');
      expect(message).toBeDefined();
      expect(message).toContain('coming soon');
    });
  });

  describe('getFrameworkOutputDir', () => {
    it('should return src/styles/tokens for Next.js', () => {
      const result = getFrameworkOutputDir('react', 'next');
      expect(result).toBe('src/styles/tokens');
    });

    it('should return src/tokens for Vite + React', () => {
      const result = getFrameworkOutputDir('react', 'vite');
      expect(result).toBe('src/tokens');
    });

    it('should return dist/tokens for none/unknown', () => {
      const result = getFrameworkOutputDir('react', 'none');
      expect(result).toBe('dist/tokens');
    });

    it('should use sourceDir when provided', () => {
      const result = getFrameworkOutputDir('vanilla', 'none', 'styles');
      expect(result).toBe('styles/tokens');
    });
  });

  describe('generateSourceReadme', () => {
    it('should generate README with npm commands for npm', () => {
      const readme = generateSourceReadme('npm', 'react');
      expect(readme).toContain('npm run');
      expect(readme).toContain('Design Tokens');
    });

    it('should generate README with pnpm commands for pnpm', () => {
      const readme = generateSourceReadme('pnpm', 'react');
      expect(readme).toContain('pnpm');
      expect(readme).toContain('tokens:build');
    });

    it('should generate README with yarn commands for yarn', () => {
      const readme = generateSourceReadme('yarn', 'react');
      expect(readme).toContain('yarn');
    });
  });

  describe('generateTokenTypesStub', () => {
    it('should generate TypeScript declaration stub', () => {
      const stub = generateTokenTypesStub();
      expect(stub).toContain('declare');
      expect(stub).toContain('DesignTokens');
    });
  });

  describe('generateTemplate', () => {
    const createProjectInfo = (overrides: Partial<ProjectInfo> = {}): ProjectInfo => ({
      isProject: true,
      isMonorepo: false,
      framework: 'react',
      metaFramework: 'none',
      packageManager: 'npm',
      typescript: true,
      esm: true,
      styling: 'css',
      hasExistingTokens: false,
      styleDirectories: [],
      ...overrides,
    });

    const createOptions = (overrides: Partial<TemplateOptions> = {}): TemplateOptions => ({
      projectInfo: createProjectInfo(),
      prefix: '--dsai-',
      outputDir: 'dist/tokens',
      sourceDir: 'tokens',
      formats: ['css'],
      template: 'full',
      configFormat: 'mjs',
      ...overrides,
    });

    describe('React templates', () => {
      it('should generate minimal React config', () => {
        const options = createOptions({
          template: 'minimal',
          projectInfo: createProjectInfo({ framework: 'react' }),
        });

        const result = generateTemplate(options);

        expect(result.configFileName).toBe('dsai.config.mjs');
        expect(result.configContent).toContain('defineConfig');
        expect(result.configContent).toContain('--dsai-');
        expect(result.configContent).toContain('tokens');
      });

      it('should generate full React config', () => {
        const options = createOptions({
          template: 'full',
          projectInfo: createProjectInfo({ framework: 'react' }),
        });

        const result = generateTemplate(options);

        expect(result.configFileName).toBe('dsai.config.mjs');
        expect(result.configContent).toContain('defineConfig');
        expect(result.configContent).toContain('themes');
      });

      it('should generate enterprise React config', () => {
        const options = createOptions({
          template: 'enterprise',
          projectInfo: createProjectInfo({ framework: 'react' }),
        });

        const result = generateTemplate(options);

        expect(result.configFileName).toBe('dsai.config.mjs');
        expect(result.configContent).toContain('defineConfig');
        expect(result.configContent).toContain('transforms');
        expect(result.configContent).toContain('formats');
      });

      it('should use TypeScript config format when typescript is true', () => {
        const options = createOptions({
          configFormat: 'ts',
          projectInfo: createProjectInfo({ typescript: true }),
        });

        const result = generateTemplate(options);

        expect(result.configFileName).toBe('dsai.config.ts');
      });
    });

    describe('Next.js templates', () => {
      it('should generate Next.js config with app router support', () => {
        const options = createOptions({
          projectInfo: createProjectInfo({
            framework: 'react',
            metaFramework: 'next',
          }),
        });

        const result = generateTemplate(options);

        expect(result.configContent).toContain('next');
      });
    });

    describe('Vanilla templates', () => {
      it('should generate vanilla config', () => {
        const options = createOptions({
          projectInfo: createProjectInfo({ framework: 'vanilla' }),
        });

        const result = generateTemplate(options);

        expect(result.configFileName).toBe('dsai.config.mjs');
        expect(result.configContent).toContain('defineConfig');
      });
    });

    describe('Template structure', () => {
      it('should include source README in additional files', () => {
        const options = createOptions();
        const result = generateTemplate(options);

        const readmeFile = result.additionalFiles.find((f) => f.path.includes('README'));
        expect(readmeFile).toBeDefined();
        if (readmeFile) {
          expect(readmeFile.content).toContain('Design Tokens');
        }
      });

      it('should include directories to create', () => {
        const options = createOptions();
        const result = generateTemplate(options);

        expect(result.directories).toContain('tokens');
        expect(result.directories).toContain('dist/tokens');
      });
    });

    describe('Format options', () => {
      it('should include CSS format in config', () => {
        const options = createOptions({
          formats: ['css', 'scss', 'js'],
        });

        const result = generateTemplate(options);

        expect(result.configContent).toContain('css');
        expect(result.configContent).toContain('scss');
        expect(result.configContent).toContain('js');
      });

      it('should include the correct prefix', () => {
        const options = createOptions({
          prefix: '--custom-prefix-',
        });

        const result = generateTemplate(options);

        expect(result.configContent).toContain('--custom-prefix-');
      });
    });
  });
});
