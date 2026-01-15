/**
 * @jest-environment node
 * @file scanner.test.ts
 * @description Unit tests for SVG file scanner
 */

import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { readSVGFile, scanSVGFiles } from '../../../../src/icons/core/scanner.js';

describe('SVG Scanner', () => {
  let testDir: string;

  beforeAll(() => {
    testDir = join(tmpdir(), `scanner-test-${Date.now()}`);
    mkdirSync(testDir, { recursive: true });
  });

  afterAll(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('scanSVGFiles', () => {
    it('should scan directory for SVG files', async () => {
      // Create test SVG files
      const iconsDir = join(testDir, 'icons-scan');
      mkdirSync(iconsDir, { recursive: true });

      writeFileSync(join(iconsDir, 'icon1.svg'), '<svg><circle cx="10" cy="10" r="5"/></svg>');
      writeFileSync(join(iconsDir, 'icon2.svg'), '<svg><rect width="10" height="10"/></svg>');

      const result = await scanSVGFiles({ sourceDir: iconsDir });

      expect(result).toHaveLength(2);
      expect(result[0].fileName).toBe('icon1');
      expect(result[1].fileName).toBe('icon2');
      expect(result[0].content).toContain('circle');
      expect(result[1].content).toContain('rect');
    });

    it('should return sorted results by filename', async () => {
      const iconsDir = join(testDir, 'icons-sort');
      mkdirSync(iconsDir, { recursive: true });

      writeFileSync(join(iconsDir, 'zebra.svg'), '<svg></svg>');
      writeFileSync(join(iconsDir, 'apple.svg'), '<svg></svg>');
      writeFileSync(join(iconsDir, 'mango.svg'), '<svg></svg>');

      const result = await scanSVGFiles({ sourceDir: iconsDir });

      expect(result).toHaveLength(3);
      expect(result[0].fileName).toBe('apple');
      expect(result[1].fileName).toBe('mango');
      expect(result[2].fileName).toBe('zebra');
    });

    it('should use default include patterns', async () => {
      const iconsDir = join(testDir, 'icons-default');
      mkdirSync(iconsDir, { recursive: true });
      mkdirSync(join(iconsDir, 'subdir'), { recursive: true });

      writeFileSync(join(iconsDir, 'root.svg'), '<svg></svg>');
      writeFileSync(join(iconsDir, 'subdir', 'nested.svg'), '<svg></svg>');

      const result = await scanSVGFiles({ sourceDir: iconsDir });

      expect(result).toHaveLength(2);
    });

    it('should respect exclude patterns', async () => {
      const iconsDir = join(testDir, 'icons-exclude');
      mkdirSync(iconsDir, { recursive: true });
      mkdirSync(join(iconsDir, 'excluded'), { recursive: true });

      writeFileSync(join(iconsDir, 'keep.svg'), '<svg></svg>');
      writeFileSync(join(iconsDir, 'excluded', 'skip.svg'), '<svg></svg>');

      const result = await scanSVGFiles({
        sourceDir: iconsDir,
        exclude: ['**/excluded/**'],
      });

      expect(result).toHaveLength(1);
      expect(result[0].fileName).toBe('keep');
    });

    it('should handle custom include patterns', async () => {
      const iconsDir = join(testDir, 'icons-include');
      mkdirSync(iconsDir, { recursive: true });
      mkdirSync(join(iconsDir, 'match'), { recursive: true });
      mkdirSync(join(iconsDir, 'nomatch'), { recursive: true });

      writeFileSync(join(iconsDir, 'match', 'found.svg'), '<svg></svg>');
      writeFileSync(join(iconsDir, 'nomatch', 'skipped.svg'), '<svg></svg>');

      const result = await scanSVGFiles({
        sourceDir: iconsDir,
        include: ['match/*.svg'],
      });

      expect(result).toHaveLength(1);
      expect(result[0].fileName).toBe('found');
    });

    it('should return empty array for empty directory', async () => {
      const emptyDir = join(testDir, 'icons-empty');
      mkdirSync(emptyDir, { recursive: true });

      const result = await scanSVGFiles({ sourceDir: emptyDir });

      expect(result).toHaveLength(0);
    });

    it('should include file size information', async () => {
      const iconsDir = join(testDir, 'icons-size');
      mkdirSync(iconsDir, { recursive: true });

      const svgContent = '<svg width="100" height="100"><rect width="50" height="50"/></svg>';
      writeFileSync(join(iconsDir, 'sized.svg'), svgContent);

      const result = await scanSVGFiles({ sourceDir: iconsDir });

      expect(result).toHaveLength(1);
      expect(result[0].originalSize).toBeGreaterThan(0);
      expect(result[0].originalSize).toBe(Buffer.byteLength(svgContent));
    });
  });

  describe('readSVGFile', () => {
    it('should read a single SVG file', () => {
      const filePath = join(testDir, 'single.svg');
      const content = '<svg><path d="M0 0 L10 10"/></svg>';
      writeFileSync(filePath, content);

      const result = readSVGFile(filePath);

      expect(result).not.toBeNull();
      expect(result?.fileName).toBe('single');
      expect(result?.content).toBe(content);
      expect(result?.filePath).toBe(filePath);
      expect(result?.originalSize).toBe(Buffer.byteLength(content));
    });

    it('should return null for non-existent file', () => {
      const result = readSVGFile('/non/existent/file.svg');

      expect(result).toBeNull();
    });

    it('should return null for unreadable file', () => {
      const result = readSVGFile('/dev/null/impossible.svg');

      expect(result).toBeNull();
    });

    it('should strip .svg extension from filename', () => {
      const filePath = join(testDir, 'MY-ICON.SVG');
      writeFileSync(filePath, '<svg></svg>');

      const result = readSVGFile(filePath);

      expect(result?.fileName).toBe('MY-ICON');
    });

    it('should handle files with .svg in the name', () => {
      const filePath = join(testDir, 'icon-svg-style.svg');
      writeFileSync(filePath, '<svg></svg>');

      const result = readSVGFile(filePath);

      expect(result?.fileName).toBe('icon-svg-style');
    });
  });
});
