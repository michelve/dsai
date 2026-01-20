/**
 * @fileoverview Tests for CacheService
 */

import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { CacheService } from '../cache.js';

// ============================================================================
// Test Setup
// ============================================================================

const TEST_DIR = join(__dirname, '../__test-output__/cache');
const CACHE_DIR = join(TEST_DIR, '.cache');
const SOURCE_DIR = join(TEST_DIR, 'source');

function setupTestDirs(): void {
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true, force: true });
  }
  mkdirSync(SOURCE_DIR, { recursive: true });
  mkdirSync(CACHE_DIR, { recursive: true });
}

function createTestFile(name: string, content: string | object): string {
  const filePath = join(SOURCE_DIR, name);
  const fileContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
  writeFileSync(filePath, fileContent, 'utf-8');
  return filePath;
}

// ============================================================================
// Test Suites
// ============================================================================

describe('CacheService', () => {
  beforeEach(() => {
    setupTestDirs();
  });

  describe('constructor', () => {
    it('should create cache service with default options', () => {
      const service = new CacheService({ cacheDir: CACHE_DIR });

      expect(service).toBeDefined();
      const stats = service.getCacheStats();
      expect(stats.enabled).toBe(true);
      expect(stats.fileCount).toBe(0);
    });

    it('should respect enabled flag', () => {
      const service = new CacheService({ cacheDir: CACHE_DIR, enabled: false });

      const stats = service.getCacheStats();
      expect(stats.enabled).toBe(false);
    });

    it('should use custom cache file name', () => {
      const customFile = 'custom-cache.json';
      const service = new CacheService({
        cacheDir: CACHE_DIR,
        cacheFile: customFile,
      });

      const stats = service.getCacheStats();
      expect(stats.enabled).toBe(true);
      expect(stats.fileCount).toBe(0);
    });
  });

  describe('hashFile', () => {
    it('should generate consistent hash for same content', () => {
      const file1 = createTestFile('test1.json', { foo: 'bar' });
      const file2 = createTestFile('test2.json', { foo: 'bar' });

      const hash1 = CacheService.hashFile(file1);
      const hash2 = CacheService.hashFile(file2);

      expect(hash1).toBe(hash2);
      expect(hash1).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hex format
    });

    it('should generate different hash for different content', () => {
      const file1 = createTestFile('test1.json', { foo: 'bar' });
      const file2 = createTestFile('test2.json', { foo: 'baz' });

      const hash1 = CacheService.hashFile(file1);
      const hash2 = CacheService.hashFile(file2);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('hashContent', () => {
    it('should hash string content', () => {
      const hash = CacheService.hashContent('test content');
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should generate same hash for same content', () => {
      const content = 'test content';
      const hash1 = CacheService.hashContent(content);
      const hash2 = CacheService.hashContent(content);

      expect(hash1).toBe(hash2);
    });
  });

  describe('loadCache and saveCache', () => {
    it('should create new cache if none exists', () => {
      const service = new CacheService({ cacheDir: CACHE_DIR });
      const cache = service.loadCache();

      expect(cache).toBeDefined();
      expect(cache.version).toBe('1.0.0');
      expect(cache.files).toEqual({});
    });

    it('should save and load cache', () => {
      const service = new CacheService({ cacheDir: CACHE_DIR });
      const cache = service.loadCache();

      cache.files['test.json'] = {
        hash: 'abc123',
        mtime: new Date(),
        outputs: ['output.json'],
      };

      service.saveCache(cache);

      const loadedCache = service.loadCache();
      expect(loadedCache.files['test.json']).toBeDefined();
      expect(loadedCache.files['test.json'].hash).toBe('abc123');
    });

    it('should not save when disabled', () => {
      const service = new CacheService({ cacheDir: CACHE_DIR, enabled: false });
      const cache = service.loadCache();

      cache.files['test.json'] = {
        hash: 'abc123',
        mtime: new Date(),
        outputs: [],
      };

      service.saveCache(cache);

      const cacheFile = join(CACHE_DIR, 'token-cache.json');
      expect(existsSync(cacheFile)).toBe(false);
    });
  });

  describe('hasFileChanged', () => {
    it('should detect new files as changed', () => {
      const service = new CacheService({ cacheDir: CACHE_DIR });
      const file = createTestFile('test.json', { foo: 'bar' });

      const hasChanged = service.hasFileChanged(file, SOURCE_DIR);
      expect(hasChanged).toBe(true);
    });

    it('should detect unchanged files', () => {
      const service = new CacheService({ cacheDir: CACHE_DIR });
      const file = createTestFile('test.json', { foo: 'bar' });

      // Add to cache
      service.updateCacheEntry(file, SOURCE_DIR);

      // Check if changed
      const hasChanged = service.hasFileChanged(file, SOURCE_DIR);
      expect(hasChanged).toBe(false);
    });

    it('should detect content changes', async () => {
      const service = new CacheService({ cacheDir: CACHE_DIR });
      const file = createTestFile('test.json', { foo: 'bar' });

      // Add to cache
      service.updateCacheEntry(file, SOURCE_DIR);

      // Wait a bit to ensure different mtime
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Modify file
      writeFileSync(file, JSON.stringify({ foo: 'baz' }, null, 2), 'utf-8');

      // Check if changed
      const hasChanged = service.hasFileChanged(file, SOURCE_DIR);
      expect(hasChanged).toBe(true);
    });

    it('should return all files as changed when cache is disabled', () => {
      const service = new CacheService({ cacheDir: CACHE_DIR, enabled: false });
      const file = createTestFile('test.json', { foo: 'bar' });

      const hasChanged = service.hasFileChanged(file, SOURCE_DIR);
      expect(hasChanged).toBe(true);
    });
  });

  describe('updateCacheEntry', () => {
    it('should add new cache entry', () => {
      const service = new CacheService({ cacheDir: CACHE_DIR });
      const file = createTestFile('test.json', { foo: 'bar' });

      service.updateCacheEntry(file, SOURCE_DIR, ['output.json']);

      const cache = service.loadCache();
      expect(cache.files['test.json']).toBeDefined();
      expect(cache.files['test.json'].outputs).toEqual(['output.json']);
    });

    it('should update existing cache entry', () => {
      const service = new CacheService({ cacheDir: CACHE_DIR });
      const file = createTestFile('test.json', { foo: 'bar' });

      service.updateCacheEntry(file, SOURCE_DIR, ['output1.json']);
      service.updateCacheEntry(file, SOURCE_DIR, ['output2.json']);

      const cache = service.loadCache();
      expect(cache.files['test.json'].outputs).toEqual(['output2.json']);
    });
  });

  describe('updateCacheEntries', () => {
    it('should update multiple entries at once', () => {
      const service = new CacheService({ cacheDir: CACHE_DIR });

      const file1 = createTestFile('test1.json', { foo: 'bar' });
      const file2 = createTestFile('test2.json', { bar: 'baz' });

      service.updateCacheEntries(
        [
          { filePath: file1, outputs: ['output1.json'] },
          { filePath: file2, outputs: ['output2.json'] },
        ],
        SOURCE_DIR
      );

      const cache = service.loadCache();
      expect(cache.files['test1.json']).toBeDefined();
      expect(cache.files['test2.json']).toBeDefined();
    });
  });

  describe('clearCacheEntry', () => {
    it('should remove cache entry', () => {
      const service = new CacheService({ cacheDir: CACHE_DIR });
      const file = createTestFile('test.json', { foo: 'bar' });

      service.updateCacheEntry(file, SOURCE_DIR);
      service.clearCacheEntry(file, SOURCE_DIR);

      const cache = service.loadCache();
      expect(cache.files['test.json']).toBeUndefined();
    });
  });

  describe('clearCache', () => {
    it('should clear all cache entries', () => {
      const service = new CacheService({ cacheDir: CACHE_DIR });

      const file1 = createTestFile('test1.json', { foo: 'bar' });
      const file2 = createTestFile('test2.json', { bar: 'baz' });

      service.updateCacheEntry(file1, SOURCE_DIR);
      service.updateCacheEntry(file2, SOURCE_DIR);

      service.clearCache();

      const cache = service.loadCache();
      expect(Object.keys(cache.files)).toHaveLength(0);
    });
  });

  describe('getCacheStats', () => {
    it('should return cache statistics', () => {
      const service = new CacheService({ cacheDir: CACHE_DIR });

      const file1 = createTestFile('test1.json', { foo: 'bar' });
      const file2 = createTestFile('test2.json', { bar: 'baz' });

      service.updateCacheEntry(file1, SOURCE_DIR);
      service.updateCacheEntry(file2, SOURCE_DIR);

      const stats = service.getCacheStats();

      expect(stats.fileCount).toBe(2);
      expect(stats.enabled).toBe(true);
      expect(stats.cacheSize).toBeGreaterThan(0);
      expect(stats.oldestEntry).toBeDefined();
      expect(stats.newestEntry).toBeDefined();
    });

    it('should handle missing cache file', () => {
      const service = new CacheService({ cacheDir: CACHE_DIR });

      const stats = service.getCacheStats();

      expect(stats.fileCount).toBe(0);
      expect(stats.cacheSize).toBe(0);
      expect(stats.oldestEntry).toBeNull();
      expect(stats.newestEntry).toBeNull();
    });
  });

  describe('getChangedFiles', () => {
    it('should return all files when cache is empty', () => {
      const service = new CacheService({ cacheDir: CACHE_DIR });

      createTestFile('test1.json', { foo: 'bar' });
      createTestFile('test2.json', { bar: 'baz' });

      const changed = service.getChangedFiles(SOURCE_DIR);

      expect(changed).toHaveLength(2);
    });

    it('should return only changed files', async () => {
      const service = new CacheService({ cacheDir: CACHE_DIR });

      const file1 = createTestFile('test1.json', { foo: 'bar' });
      const file2 = createTestFile('test2.json', { bar: 'baz' });

      service.updateCacheEntry(file1, SOURCE_DIR);
      service.updateCacheEntry(file2, SOURCE_DIR);

      await new Promise((resolve) => setTimeout(resolve, 10));

      // Modify only file1
      writeFileSync(file1, JSON.stringify({ foo: 'changed' }, null, 2), 'utf-8');

      const changed = service.getChangedFiles(SOURCE_DIR);

      expect(changed).toHaveLength(1);
      expect(changed[0]).toBe(file1);
    });

    it('should return all files when caching is disabled', () => {
      const service = new CacheService({ cacheDir: CACHE_DIR, enabled: false });

      createTestFile('test1.json', { foo: 'bar' });
      createTestFile('test2.json', { bar: 'baz' });

      const changed = service.getChangedFiles(SOURCE_DIR);

      expect(changed).toHaveLength(2);
    });
  });

  describe('matchesPattern', () => {
    it('should match simple patterns', () => {
      const service = new CacheService({ cacheDir: CACHE_DIR });

      createTestFile('test.json', {});
      createTestFile('test.txt', '');

      const jsonFiles = service.getChangedFiles(SOURCE_DIR, '*.json');
      const allFiles = service.getChangedFiles(SOURCE_DIR, '*.*');

      expect(jsonFiles.every((f) => f.endsWith('.json'))).toBe(true);
      expect(allFiles.length).toBeGreaterThanOrEqual(jsonFiles.length);
    });

    it('should match glob patterns', () => {
      const service = new CacheService({ cacheDir: CACHE_DIR });

      createTestFile('colors.tokens.json', {});
      createTestFile('spacing.tokens.json', {});
      createTestFile('theme.json', {});

      const tokenFiles = service.getChangedFiles(SOURCE_DIR, '*.tokens.json');

      expect(tokenFiles.length).toBe(2);
      expect(tokenFiles.every((f) => f.includes('.tokens.json'))).toBe(true);
    });
  });
});
