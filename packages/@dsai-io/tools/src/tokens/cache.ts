/**
 * @fileoverview Token cache management for incremental builds
 * Provides hash-based change detection and cache storage
 */

/* eslint-disable security/detect-non-literal-fs-filename */

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

/**
 * Cache entry for a single token file
 */
export interface CacheEntry {
  /** SHA-256 hash of file content */
  hash: string;
  /** Last modification time */
  mtime: Date;
  /** Generated output files */
  outputs: string[];
}

/**
 * Token cache structure
 */
export interface TokenCache {
  /** Cache format version */
  version: string;
  /** Cache creation timestamp */
  timestamp: Date;
  /** Cached file entries */
  files: Record<string, CacheEntry>;
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  /** Cache directory path */
  cacheDir?: string;
  /** Enable/disable caching */
  enabled?: boolean;
  /** Cache file name */
  cacheFile?: string;
}

/**
 * Cache storage service for token builds
 */
export class CacheService {
  private readonly cacheDir: string;
  private readonly cacheFile: string;
  private readonly enabled: boolean;
  private cache: TokenCache | null = null;

  constructor(config: CacheConfig = {}) {
    this.cacheDir = config.cacheDir ?? '.dsai-cache';
    this.cacheFile = config.cacheFile ?? 'tokens.json';
    this.enabled = config.enabled ?? true;
  }

  /**
   * Get full path to cache file
   */
  private getCachePath(): string {
    return join(this.cacheDir, this.cacheFile);
  }

  /**
   * Ensure cache directory exists
   */
  private ensureCacheDir(): void {
    if (!existsSync(this.cacheDir)) {
      mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  /**
   * Calculate SHA-256 hash of file content
   */
  static hashFile(filePath: string): string {
    const content = readFileSync(filePath, 'utf-8');
    return createHash('sha256').update(content).digest('hex');
  }

  /**
   * Calculate hash of string content
   */
  static hashContent(content: string): string {
    return createHash('sha256').update(content).digest('hex');
  }

  /**
   * Load cache from disk
   */
  loadCache(): TokenCache {
    if (!this.enabled) {
      return this.createEmptyCache();
    }

    if (this.cache) {
      return this.cache;
    }

    const cachePath = this.getCachePath();

    if (!existsSync(cachePath)) {
      this.cache = this.createEmptyCache();
      return this.cache;
    }

    try {
      const content = readFileSync(cachePath, 'utf-8');
      const parsed = JSON.parse(content) as TokenCache;

      // Convert date strings back to Date objects
      this.cache = {
        ...parsed,
        timestamp: new Date(parsed.timestamp),
        files: Object.fromEntries(
          Object.entries(parsed.files).map(([path, entry]) => [
            path,
            { ...entry, mtime: new Date(entry.mtime) },
          ])
        ),
      };

      return this.cache;
    } catch {
      // Invalid cache, start fresh
      this.cache = this.createEmptyCache();
      return this.cache;
    }
  }

  /**
   * Save cache to disk
   */
  saveCache(cache: TokenCache): void {
    if (!this.enabled) {
      return;
    }

    this.ensureCacheDir();
    const cachePath = this.getCachePath();

    try {
      const content = JSON.stringify(cache, null, 2);
      writeFileSync(cachePath, content, 'utf-8');
      this.cache = cache;
    } catch (error) {
      console.warn(
        `Failed to save cache: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Create empty cache structure
   */
  private createEmptyCache(): TokenCache {
    return {
      version: '1.0.0',
      timestamp: new Date(),
      files: {},
    };
  }

  /**
   * Check if a file has changed since last cache
   */
  hasFileChanged(filePath: string, baseDir: string): boolean {
    if (!this.enabled) {
      return true; // Always rebuild if caching disabled
    }

    const cache = this.loadCache();
    const relativePath = relative(baseDir, filePath);

    // File not in cache = changed
    const entry = Reflect.get(cache.files, relativePath) as CacheEntry | undefined;
    if (!entry) {
      return true;
    }

    // Check if file still exists
    if (!existsSync(filePath)) {
      return true;
    }

    const currentHash = CacheService.hashFile(filePath);

    // Hash mismatch = changed
    if (entry.hash !== currentHash) {
      return true;
    }

    // Check mtime as fast path (but hash is source of truth)
    const stats = statSync(filePath);
    const currentMtime = stats.mtime;

    return currentMtime.getTime() !== new Date(entry.mtime).getTime();
  }

  /**
   * Get list of changed files in a directory
   */
  getChangedFiles(directory: string, pattern = '**/*.json'): string[] {
    if (!this.enabled) {
      // Return all files if caching disabled
      return this.getAllFiles(directory, pattern);
    }

    const allFiles = this.getAllFiles(directory, pattern);
    const changedFiles: string[] = [];

    for (const file of allFiles) {
      if (this.hasFileChanged(file, directory)) {
        changedFiles.push(file);
      }
    }

    return changedFiles;
  }

  /**
   * Get all files matching pattern
   */
  private getAllFiles(directory: string, pattern: string): string[] {
    const files: string[] = [];

    const scan = (dir: string): void => {
      if (!existsSync(dir)) {
        return;
      }

      const entries = readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dir, entry.name);

        if (entry.isDirectory()) {
          scan(fullPath);
        } else if (entry.isFile()) {
          // Get relative path for pattern matching
          const relativePath = relative(directory, fullPath);
          if (this.matchesPattern(relativePath, pattern)) {
            files.push(fullPath);
          }
        }
      }
    };

    scan(directory);
    return files;
  }

  /**
   * Simple pattern matching for file globs
   * Supports: *.json, **\/*.json, *.tokens.json
   */
  private matchesPattern(filename: string, pattern: string): boolean {
    // Simple cases
    if (pattern === '*' || pattern === '**/*') {
      return true;
    }

    if (pattern === '*.*') {
      return filename.includes('.');
    }

    // Handle **.ext patterns
    if (pattern.startsWith('**/*.')) {
      const ext = pattern.substring(4); // Remove **/*
      return filename.endsWith(ext);
    }

    // Handle *.ext patterns
    if (pattern.startsWith('*.')) {
      const ext = pattern.substring(1); // Remove *
      return filename.endsWith(ext);
    }

    // Convert glob pattern to regex for complex patterns
    /* eslint-disable security/detect-non-literal-regexp */
    const regexPattern = pattern
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\./g, '\\.');

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(filename);
    /* eslint-enable security/detect-non-literal-regexp */
  }

  /**
   * Update cache entry for a file
   */
  updateCacheEntry(filePath: string, baseDir: string, outputs: string[] = []): void {
    if (!this.enabled) {
      return;
    }

    const cache = this.loadCache();
    const relativePath = relative(baseDir, filePath);

    if (!existsSync(filePath)) {
      return;
    }

    const hash = CacheService.hashFile(filePath);
    const stats = statSync(filePath);

    Object.defineProperty(cache.files, relativePath, {
      value: {
        hash,
        mtime: stats.mtime,
        outputs,
      },
      writable: true,
      enumerable: true,
      configurable: true,
    });

    cache.timestamp = new Date();
    this.saveCache(cache);
  }

  /**
   * Update multiple cache entries at once
   */
  updateCacheEntries(
    entries: Array<{ filePath: string; outputs?: string[] }>,
    baseDir: string
  ): void {
    if (!this.enabled) {
      return;
    }

    const cache = this.loadCache();

    for (const entry of entries) {
      const relativePath = relative(baseDir, entry.filePath);

      if (!existsSync(entry.filePath)) {
        continue;
      }

      const hash = CacheService.hashFile(entry.filePath);
      const stats = statSync(entry.filePath);

      Object.defineProperty(cache.files, relativePath, {
        value: {
          hash,
          mtime: stats.mtime,
          outputs: entry.outputs ?? [],
        },
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }

    cache.timestamp = new Date();
    this.saveCache(cache);
  }

  /**
   * Clear cache entry for a file
   */
  clearCacheEntry(filePath: string, baseDir: string): void {
    if (!this.enabled) {
      return;
    }

    const cache = this.loadCache();
    const relativePath = relative(baseDir, filePath);

    // Safe deletion using Map-like operation
    const { [relativePath]: _removed, ...remainingFiles } = cache.files;
    cache.files = remainingFiles;

    cache.timestamp = new Date();
    this.saveCache(cache);
  }

  /**
   * Clear entire cache
   */
  clearCache(): void {
    this.cache = this.createEmptyCache();

    if (this.enabled) {
      const cachePath = this.getCachePath();
      if (existsSync(cachePath)) {
        try {
          writeFileSync(cachePath, JSON.stringify(this.cache, null, 2), 'utf-8');
        } catch {
          // Ignore write errors during clear
        }
      }
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    enabled: boolean;
    fileCount: number;
    cacheSize: number;
    oldestEntry: Date | null;
    newestEntry: Date | null;
  } {
    const cache = this.loadCache();
    const entries = Object.values(cache.files);

    let oldestEntry: Date | null = null;
    let newestEntry: Date | null = null;

    for (const entry of entries) {
      const mtime = new Date(entry.mtime);
      if (!oldestEntry || mtime < oldestEntry) {
        oldestEntry = mtime;
      }
      if (!newestEntry || mtime > newestEntry) {
        newestEntry = mtime;
      }
    }

    let cacheSize = 0;
    const cachePath = this.getCachePath();
    if (existsSync(cachePath)) {
      cacheSize = statSync(cachePath).size;
    }

    return {
      enabled: this.enabled,
      fileCount: entries.length,
      cacheSize,
      oldestEntry,
      newestEntry,
    };
  }

  /**
   * Check if cache is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Get cache directory path
   */
  getCacheDir(): string {
    return this.cacheDir;
  }
}
