/**
 * @fileoverview Token snapshot service for backup and rollback
 * Creates snapshots of token collections before transformations
 */

/* eslint-disable security/detect-non-literal-fs-filename */

import { createHash, randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

// Length of the recursive glob prefix "**/"
const RECURSIVE_GLOB_PREFIX_LENGTH = 3;

/** Length of the wildcard glob prefix "*" */
const WILDCARD_PREFIX_LENGTH = 1;

/**
 * Token snapshot metadata
 */
export interface TokenSnapshot {
  /** Unique snapshot ID */
  id: string;
  /** Timestamp when snapshot was created */
  timestamp: Date;
  /** Directory that was snapshotted */
  collectionsDir: string;
  /** Files included in snapshot */
  files: TokenSnapshotFile[];
  /** Optional description */
  description?: string;
}

/**
 * File in a token snapshot
 */
export interface TokenSnapshotFile {
  /** Relative path from collections directory */
  path: string;
  /** File content */
  content: string;
  /** SHA-256 checksum */
  checksum: string;
}

/**
 * Snapshot configuration
 */
export interface SnapshotConfig {
  /** Directory to store snapshots */
  snapshotDir?: string;
  /** Maximum number of snapshots to keep */
  maxSnapshots?: number;
  /** File patterns to include (glob) */
  include?: string[];
  /** File patterns to exclude */
  exclude?: string[];
}

/**
 * Snapshot result
 */
export interface SnapshotResult {
  /** Whether snapshot was successful */
  success: boolean;
  /** Snapshot metadata */
  snapshot?: TokenSnapshot;
  /** Error message if failed */
  error?: string;
}

/**
 * Rollback result
 */
export interface RollbackResult {
  /** Whether rollback was successful */
  success: boolean;
  /** Number of files restored */
  filesRestored: number;
  /** Error message if failed */
  error?: string;
}

/**
 * Token snapshot service
 */
export class SnapshotService {
  private readonly snapshotDir: string;
  private readonly maxSnapshots: number;
  private readonly include: string[];
  private readonly exclude: string[];

  constructor(config: SnapshotConfig = {}) {
    this.snapshotDir = config.snapshotDir ?? '.snapshots';
    this.maxSnapshots = config.maxSnapshots ?? 10;
    this.include = config.include ?? ['**/*.json'];
    this.exclude = config.exclude ?? ['**/node_modules/**', '**/.git/**'];
  }

  /**
   * Create a snapshot of the collections directory
   */
  createSnapshot(collectionsDir: string, description?: string): SnapshotResult {
    try {
      // Verify directory exists
      if (!existsSync(collectionsDir)) {
        return {
          success: false,
          error: `Collections directory not found: ${collectionsDir}`,
        };
      }

      // Create snapshot metadata
      const snapshot: TokenSnapshot = {
        id: this.generateSnapshotId(),
        timestamp: new Date(),
        collectionsDir,
        files: [],
        description,
      };

      // Scan directory for files
      const files = this.scanDirectory(collectionsDir);
      if (files.length === 0) {
        return {
          success: false,
          error: 'No files found to snapshot',
        };
      }

      // Create snapshot files
      for (const filePath of files) {
        const fullPath = join(collectionsDir, filePath);
        const content = readFileSync(fullPath, 'utf-8');
        const checksum = this.calculateChecksum(content);

        snapshot.files.push({
          path: filePath,
          content,
          checksum,
        });
      }

      // Ensure snapshot directory exists
      if (!existsSync(this.snapshotDir)) {
        mkdirSync(this.snapshotDir, { recursive: true });
      }

      // Write snapshot to disk
      const snapshotPath = join(this.snapshotDir, `${snapshot.id}.json`);
      writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2), 'utf-8');

      // Clean up old snapshots
      this.cleanupOldSnapshots();

      return {
        success: true,
        snapshot,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Rollback to a specific snapshot
   */
  rollback(snapshotId: string): RollbackResult {
    try {
      // Load snapshot
      const snapshot = this.loadSnapshot(snapshotId);
      if (!snapshot) {
        return {
          success: false,
          filesRestored: 0,
          error: `Snapshot not found: ${snapshotId}`,
        };
      }

      // Validate snapshot
      const validationError = this.validateSnapshot(snapshot);
      if (validationError) {
        return {
          success: false,
          filesRestored: 0,
          error: validationError,
        };
      }

      // Ensure target directory exists
      if (!existsSync(snapshot.collectionsDir)) {
        mkdirSync(snapshot.collectionsDir, { recursive: true });
      }

      // Restore files
      let filesRestored = 0;
      for (const file of snapshot.files) {
        const targetPath = join(snapshot.collectionsDir, file.path);

        // Ensure directory exists
        const targetDir = dirname(targetPath);
        if (!existsSync(targetDir)) {
          mkdirSync(targetDir, { recursive: true });
        }

        // Write file
        writeFileSync(targetPath, file.content, 'utf-8');
        filesRestored++;
      }

      return {
        success: true,
        filesRestored,
      };
    } catch (error) {
      return {
        success: false,
        filesRestored: 0,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Get list of available snapshots
   */
  listSnapshots(): TokenSnapshot[] {
    if (!existsSync(this.snapshotDir)) {
      return [];
    }

    const files = readdirSync(this.snapshotDir).filter((f) => f.endsWith('.json'));

    const snapshots: TokenSnapshot[] = [];
    for (const file of files) {
      const snapshot = this.loadSnapshot(basename(file, '.json'));
      if (snapshot) {
        // Don't include file contents in list
        snapshots.push({
          ...snapshot,
          files: snapshot.files.map((f) => ({
            ...f,
            content: '',
          })),
        });
      }
    }

    // Sort by timestamp (newest first)
    return snapshots.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get the most recent snapshot
   */
  getLatestSnapshot(): TokenSnapshot | null {
    const snapshots = this.listSnapshots();
    if (snapshots.length > 0 && snapshots[0]) {
      return snapshots[0];
    }
    return null;
  }

  /**
   * Delete a snapshot
   */
  deleteSnapshot(snapshotId: string): boolean {
    try {
      const snapshotPath = join(this.snapshotDir, `${snapshotId}.json`);
      if (existsSync(snapshotPath)) {
        rmSync(snapshotPath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Delete all snapshots
   */
  clearSnapshots(): number {
    if (!existsSync(this.snapshotDir)) {
      return 0;
    }

    const files = readdirSync(this.snapshotDir).filter((f) => f.endsWith('.json'));
    let deleted = 0;

    for (const file of files) {
      try {
        rmSync(join(this.snapshotDir, file));
        deleted++;
      } catch {
        // Continue on error
      }
    }

    return deleted;
  }

  // Private methods

  /**
   * Generate unique snapshot ID
   */
  private generateSnapshotId(): string {
    const timestamp = Date.now();
    const random = randomBytes(4).toString('hex');
    return `snapshot-${timestamp}-${random}`;
  }

  /**
   * Calculate SHA-256 checksum
   */
  private calculateChecksum(content: string): string {
    return createHash('sha256').update(content, 'utf-8').digest('hex');
  }

  /**
   * Scan directory for files matching include/exclude patterns
   */
  private scanDirectory(dir: string, baseDir = dir): string[] {
    const files: string[] = [];

    try {
      const entries = readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        const relativePath = fullPath.substring(baseDir.length + 1);

        if (entry.isDirectory() && !this.shouldExclude(relativePath)) {
          files.push(...this.scanDirectory(fullPath, baseDir));
        } else if (entry.isFile() && this.shouldInclude(relativePath)) {
          files.push(relativePath);
        }
      }
    } catch {
      // Ignore errors
    }

    return files;
  }

  /**
   * Check if path should be included
   */
  private shouldInclude(path: string): boolean {
    // Simple pattern matching (supports *.ext and **/*.ext)
    return this.include.some((pattern) => {
      if (pattern === '**/*') {
        return true;
      }
      if (pattern.startsWith('**/')) {
        // **/*.json matches any path ending with .json
        const suffix = pattern.substring(RECURSIVE_GLOB_PREFIX_LENGTH); // Remove **/
        if (suffix.startsWith('*.')) {
          // Pattern like **/*.json - check extension
          const ext = suffix.substring(WILDCARD_PREFIX_LENGTH); // .json
          return path.endsWith(ext);
        }
        return path.endsWith(suffix);
      }
      if (pattern.startsWith('*.')) {
        return path.endsWith(pattern.substring(WILDCARD_PREFIX_LENGTH));
      }
      return path === pattern;
    });
  }

  /**
   * Check if path should be excluded
   */
  private shouldExclude(path: string): boolean {
    return this.exclude.some((pattern) => {
      if (pattern.startsWith('**/')) {
        return path.includes(pattern.substring(RECURSIVE_GLOB_PREFIX_LENGTH).replaceAll('/**', ''));
      }
      return path.includes(pattern);
    });
  }

  /**
   * Load snapshot from disk
   */
  private loadSnapshot(snapshotId: string): TokenSnapshot | null {
    try {
      const snapshotPath = join(this.snapshotDir, `${snapshotId}.json`);
      if (!existsSync(snapshotPath)) {
        return null;
      }

      const content = readFileSync(snapshotPath, 'utf-8');
      const snapshot = JSON.parse(content) as TokenSnapshot;

      // Convert timestamp string to Date
      snapshot.timestamp = new Date(snapshot.timestamp);

      return snapshot;
    } catch {
      return null;
    }
  }

  /**
   * Validate snapshot integrity
   */
  private validateSnapshot(snapshot: TokenSnapshot): string | null {
    if (!snapshot.files || snapshot.files.length === 0) {
      return 'Snapshot has no files';
    }

    for (const file of snapshot.files) {
      const actualChecksum = this.calculateChecksum(file.content);
      if (actualChecksum !== file.checksum) {
        return `Checksum mismatch for file: ${file.path}`;
      }
    }

    return null;
  }

  /**
   * Clean up old snapshots keeping only maxSnapshots most recent
   */
  private cleanupOldSnapshots(): void {
    if (!existsSync(this.snapshotDir)) {
      return;
    }

    const files = readdirSync(this.snapshotDir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => ({
        name: f,
        path: join(this.snapshotDir, f),
        mtime: this.getFileModificationTime(join(this.snapshotDir, f)),
      }))
      .sort((a, b) => b.mtime - a.mtime);

    // Delete old snapshots
    for (let i = this.maxSnapshots; i < files.length; i++) {
      const file = files.at(i);
      if (file?.path) {
        try {
          rmSync(file.path);
        } catch {
          // Ignore errors
        }
      }
    }
  }

  /**
   * Get file modification time
   */
  private getFileModificationTime(path: string): number {
    try {
      const snapshot = this.loadSnapshot(basename(path, '.json'));
      return snapshot ? snapshot.timestamp.getTime() : 0;
    } catch {
      return 0;
    }
  }
}
