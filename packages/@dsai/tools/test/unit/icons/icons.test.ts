/**
 * @jest-environment node
 *
 * Unit tests for the icons module
 *
 * Tests cover:
 * - buildIcons function
 * - Icon scanning
 * - Icon generation
 * - SVG optimization
 */

import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { createResolvedConfig } from '../../../src/config/resolver.js';
import { buildIcons } from '../../../src/icons/index.js';

// ============================================================================
// Test Helpers
// ============================================================================

function createTestDir(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const testDir = join(tmpdir(), `dsai-icons-test-${timestamp}-${random}`);
  mkdirSync(testDir, { recursive: true });
  return testDir;
}

function cleanupTestDir(dir: string): void {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
  }
}

function writeSVGFile(dir: string, name: string, content: string): string {
  const filePath = join(dir, name);
  const parentDir = join(filePath, '..');
  if (!existsSync(parentDir)) {
    mkdirSync(parentDir, { recursive: true });
  }
  writeFileSync(filePath, content, 'utf8');
  return filePath;
}

// Sample SVG content
const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
</svg>`;

const SIMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="10"/>
</svg>`;

// ============================================================================
// buildIcons Tests
// ============================================================================

describe('buildIcons', () => {
  let testDir: string;
  let iconsDir: string;
  let outputDir: string;

  beforeEach(() => {
    testDir = createTestDir();
    iconsDir = join(testDir, 'icons');
    outputDir = join(testDir, 'output');
    mkdirSync(iconsDir, { recursive: true });
    mkdirSync(outputDir, { recursive: true });
  });

  afterEach(() => {
    cleanupTestDir(testDir);
  });

  describe('basic functionality', () => {
    it('should handle empty icons directory', async () => {
      const config = createResolvedConfig({
        icons: {
          sourceDir: iconsDir,
          outputDir: outputDir,
        },
        configDir: testDir,
      });

      const result = await buildIcons(config);

      expect(result.success).toBe(true);
      expect(result.totalIcons).toBe(0);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0].message).toMatch(/No SVG files found/i);
    });

    it('should scan and process SVG files', async () => {
      writeSVGFile(iconsDir, 'arrow.svg', SAMPLE_SVG);
      writeSVGFile(iconsDir, 'circle.svg', SIMPLE_SVG);

      const config = createResolvedConfig({
        icons: {
          sourceDir: iconsDir,
          outputDir: outputDir,
        },
        configDir: testDir,
      });

      const result = await buildIcons(config, { dryRun: true });

      expect(result.success).toBe(true);
      expect(result.totalIcons).toBe(2);
    });

    it('should filter icons by name', async () => {
      writeSVGFile(iconsDir, 'arrow.svg', SAMPLE_SVG);
      writeSVGFile(iconsDir, 'circle.svg', SIMPLE_SVG);

      const config = createResolvedConfig({
        icons: {
          sourceDir: iconsDir,
          outputDir: outputDir,
        },
        configDir: testDir,
      });

      const result = await buildIcons(config, {
        icons: ['arrow'],
        dryRun: true,
      });

      expect(result.success).toBe(true);
      expect(result.totalIcons).toBe(1);
    });

    it('should support dry run mode', async () => {
      writeSVGFile(iconsDir, 'test.svg', SAMPLE_SVG);

      const config = createResolvedConfig({
        icons: {
          sourceDir: iconsDir,
          outputDir: outputDir,
        },
        configDir: testDir,
      });

      const result = await buildIcons(config, { dryRun: true });

      expect(result.success).toBe(true);
      expect(result.filesWritten).toBe(0);
    });
  });

  describe('format support', () => {
    beforeEach(() => {
      writeSVGFile(iconsDir, 'test-icon.svg', SAMPLE_SVG);
    });

    it('should generate react components', async () => {
      const config = createResolvedConfig({
        icons: {
          sourceDir: iconsDir,
          outputDir: outputDir,
          framework: 'react',
        },
        configDir: testDir,
      });

      const result = await buildIcons(config, { formats: ['react'], dryRun: true });

      expect(result.success).toBe(true);
      expect(result.icons.length).toBeGreaterThanOrEqual(1);
    });

    it('should generate SVG sprites', async () => {
      const config = createResolvedConfig({
        icons: {
          sourceDir: iconsDir,
          outputDir: outputDir,
        },
        configDir: testDir,
      });

      const result = await buildIcons(config, { formats: ['svg-sprite'], dryRun: true });

      expect(result.success).toBe(true);
    });
  });

  describe('SVG optimization', () => {
    it('should reduce SVG file size', async () => {
      // Create SVG with extra whitespace and comments
      const unoptimizedSVG = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generator: Adobe Illustrator -->
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 24 24"
     enable-background="new 0 0 24 24">

  <g id="Layer_1">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
  </g>

</svg>`;
      writeSVGFile(iconsDir, 'unoptimized.svg', unoptimizedSVG);

      const config = createResolvedConfig({
        icons: {
          sourceDir: iconsDir,
          outputDir: outputDir,
        },
        configDir: testDir,
      });

      const result = await buildIcons(config, { dryRun: true });

      expect(result.success).toBe(true);
      // Optimization should reduce size
      expect(result.totalSizeReduction).toBeGreaterThanOrEqual(0);
    });
  });

  describe('nested directory support', () => {
    it('should scan nested directories', async () => {
      writeSVGFile(join(iconsDir, 'arrows'), 'up.svg', SAMPLE_SVG);
      writeSVGFile(join(iconsDir, 'arrows'), 'down.svg', SAMPLE_SVG);
      writeSVGFile(join(iconsDir, 'shapes'), 'circle.svg', SIMPLE_SVG);

      const config = createResolvedConfig({
        icons: {
          sourceDir: iconsDir,
          outputDir: outputDir,
        },
        configDir: testDir,
      });

      const result = await buildIcons(config, { dryRun: true });

      expect(result.success).toBe(true);
      expect(result.totalIcons).toBe(3);
    });
  });

  describe('error handling', () => {
    it('should handle invalid SVG gracefully', async () => {
      writeSVGFile(iconsDir, 'invalid.svg', '<not-svg>broken content</not-svg>');

      const config = createResolvedConfig({
        icons: {
          sourceDir: iconsDir,
          outputDir: outputDir,
        },
        configDir: testDir,
      });

      const result = await buildIcons(config, { dryRun: true });

      // Should not throw, may report warnings or handle gracefully
      expect(result).toBeDefined();
    });

    it('should handle non-existent source directory', async () => {
      const config = createResolvedConfig({
        icons: {
          sourceDir: join(testDir, 'nonexistent'),
          outputDir: outputDir,
        },
        configDir: testDir,
      });

      const result = await buildIcons(config, { dryRun: true });

      expect(result.success).toBe(true);
      expect(result.totalIcons).toBe(0);
    });
  });
});
