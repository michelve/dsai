/**
 * Incremental Build System
 *
 * Provides intelligent change detection and incremental processing for token builds.
 * Only transforms and processes tokens that have changed since the last build.
 *
 * @packageDocumentation
 */

/* eslint-disable no-console, security/detect-non-literal-fs-filename */

import { existsSync } from 'node:fs';
import { basename, join, relative } from 'node:path';

import type { CacheService } from './cache.js';
import type { TransformOptions } from './types.js';

/** Threshold percentage above which a full build is more efficient than selective processing */
const FULL_BUILD_THRESHOLD_PERCENT = 50;

/** Width of separator lines in build reports */
const REPORT_SEPARATOR_WIDTH = 50;

// ============================================================================
// Types
// ============================================================================

/**
 * Options for incremental builds
 */
export interface IncrementalOptions {
  /** Whether incremental mode is enabled */
  enabled: boolean;
  /** Force full rebuild (ignores cache) */
  force?: boolean;
  /** Cache service instance */
  cacheService?: CacheService;
  /** Verbose logging */
  verbose?: boolean;
}

/**
 * Result of incremental analysis
 */
export interface IncrementalAnalysis {
  /** Whether a full build is required */
  needsFullBuild: boolean;
  /** Files that have changed since last build */
  changedFiles: string[];
  /** Files that can be skipped */
  unchangedFiles: string[];
  /** Reason for full build (if needed) */
  fullBuildReason?: string;
  /** Total files analyzed */
  totalFiles: number;
}

/**
 * Collection dependency information
 */
interface CollectionDependency {
  /** Collection name */
  name: string;
  /** Input file path */
  inputFile: string;
  /** Output file paths */
  outputFiles: string[];
  /** Collections that depend on this one */
  dependents: string[];
  /** Collections this one depends on */
  dependencies: string[];
}

/**
 * Dependency graph for collections
 */
interface DependencyGraph {
  /** Map of collection name to dependency info */
  collections: Map<string, CollectionDependency>;
  /** Collections in topological order */
  buildOrder: string[];
}

// ============================================================================
// Incremental Analysis
// ============================================================================

/**
 * Analyze files to determine what needs to be rebuilt
 */
/** Create a full-build analysis result */
function fullBuildAnalysis(reason: string, extra?: Partial<IncrementalAnalysis>): IncrementalAnalysis {
  return {
    needsFullBuild: true,
    changedFiles: [],
    unchangedFiles: [],
    fullBuildReason: reason,
    totalFiles: 0,
    ...extra,
  };
}

export async function analyzeChanges(
  sourceDir: string,
  options: IncrementalOptions
): Promise<IncrementalAnalysis> {
  const { enabled, force, cacheService, verbose } = options;

  if (!enabled || force) {
    return fullBuildAnalysis(force ? 'Force rebuild requested' : 'Incremental mode disabled');
  }

  if (!cacheService) {
    return fullBuildAnalysis('No cache service available');
  }

  const cache = cacheService.loadCache();
  if (!cache || Object.keys(cache.files).length === 0) {
    if (verbose) {
      console.info('  ℹ️  No cache found, performing full build');
    }
    return fullBuildAnalysis('No cache available');
  }

  const sourceFiles = await getSourceFiles(sourceDir);
  if (sourceFiles.length === 0) {
    return fullBuildAnalysis('No source files found');
  }

  return classifyFileChanges(sourceFiles, cacheService, sourceDir, verbose);
}

/**
 * Classify source files into changed/unchanged and decide build strategy
 */
function classifyFileChanges(
  sourceFiles: string[],
  cacheService: CacheService,
  sourceDir: string,
  verbose?: boolean
): IncrementalAnalysis {
  const changedFiles: string[] = [];
  const unchangedFiles: string[] = [];

  for (const file of sourceFiles) {
    if (cacheService.hasFileChanged(file, sourceDir)) {
      changedFiles.push(file);
    } else {
      unchangedFiles.push(file);
    }
  }

  const totalFiles = sourceFiles.length;
  const changePercentage = (changedFiles.length / totalFiles) * 100;

  if (verbose && changedFiles.length > 0) {
    console.info(
      `  📊 Analysis: ${changedFiles.length}/${totalFiles} files changed (${changePercentage.toFixed(1)}%)`
    );
  }

  if (changePercentage > FULL_BUILD_THRESHOLD_PERCENT) {
    if (verbose) {
      console.info('  ℹ️  >50% files changed, performing full build for efficiency');
    }
    return { needsFullBuild: true, changedFiles, unchangedFiles, fullBuildReason: 'Too many files changed (>50%)', totalFiles };
  }

  if (changedFiles.length === 0) {
    if (verbose) {
      console.info('  ✅ No changes detected, skipping build');
    }
    return { needsFullBuild: false, changedFiles: [], unchangedFiles, totalFiles };
  }

  return { needsFullBuild: false, changedFiles, unchangedFiles, totalFiles };
}

/**
 * Get all source files in directory
 */
async function getSourceFiles(sourceDir: string): Promise<string[]> {
  if (!existsSync(sourceDir)) {
    return [];
  }

  const fs = await import('node:fs/promises');
  const files: string[] = [];

  try {
    const entries = await fs.readdir(sourceDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.json')) {
        files.push(join(sourceDir, entry.name));
      }
    }
  } catch (error) {
    console.error(
      `Error reading source directory: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  return files;
}

// ============================================================================
// Dependency Graph
// ============================================================================

/**
 * Build dependency graph for collections
 *
 * Currently returns empty graph as collections are independent.
 * This can be extended to support collection dependencies in the future.
 */
export function buildDependencyGraph(
  collections: Array<{ name: string; inputFile: string; outputFiles: string[] }>
): DependencyGraph {
  const graph: DependencyGraph = {
    collections: new Map(),
    buildOrder: [],
  };

  // Add all collections
  for (const collection of collections) {
    graph.collections.set(collection.name, {
      name: collection.name,
      inputFile: collection.inputFile,
      outputFiles: collection.outputFiles,
      dependents: [],
      dependencies: [],
    });
    graph.buildOrder.push(collection.name);
  }


  return graph;
}

/**
 * Get collections that need to be rebuilt based on changed files
 */
export function getAffectedCollections(
  changedFiles: string[],
  collections: Array<{ name: string; inputFile: string }>,
  dependencyGraph: DependencyGraph
): string[] {
  const affected = new Set<string>();

  // Find directly affected collections
  for (const file of changedFiles) {
    const fileName = basename(file);

    for (const collection of collections) {
      const collectionFile = basename(collection.inputFile);

      if (collectionFile === fileName) {
        affected.add(collection.name);

        // Add dependent collections
        const deps = dependencyGraph.collections.get(collection.name);
        if (deps) {
          for (const dependent of deps.dependents) {
            affected.add(dependent);
          }
        }
      }
    }
  }

  return Array.from(affected);
}

// ============================================================================
// Incremental Transform
// ============================================================================

/**
 * Filter transform options to only process changed collections
 * Returns both the options and list of affected collections
 */
export function filterTransformForIncremental(
  options: TransformOptions,
  analysis: IncrementalAnalysis,
  collections: Array<{ name: string; inputFile: string }>
): { options: TransformOptions; affectedCollections: string[] } {
  // If full build needed, return original options
  if (analysis.needsFullBuild) {
    return { options, affectedCollections: [] };
  }

  // If no changes, return options that will skip processing
  if (analysis.changedFiles.length === 0) {
    return {
      options: {
        ...options,
        sourceDir: '',
      },
      affectedCollections: [],
    };
  }

  // Build dependency graph
  const graph = buildDependencyGraph(
    collections.map((c) => ({
      name: c.name,
      inputFile: c.inputFile,
      outputFiles: [], // Will be populated after transform
    }))
  );

  // Get affected collections
  const affectedCollections = getAffectedCollections(analysis.changedFiles, collections, graph);

  if (options.verbose) {
    console.info(
      `  🎯 Incremental: processing ${affectedCollections.length}/${collections.length} collections`
    );
    for (const name of affectedCollections) {
      console.info(`     - ${name}`);
    }
  }

  // Return original options and affected collections list
  return { options, affectedCollections };
}

/**
 * Check if a collection should be processed in incremental mode
 */
export function shouldProcessCollection(
  collectionName: string,
  affectedCollections?: string[]
): boolean {
  // If no incremental filter, process all
  if (!affectedCollections || affectedCollections.length === 0) {
    return true;
  }

  // Check if in affected list
  return affectedCollections.includes(collectionName);
}

// ============================================================================
// Cache Updates
// ============================================================================

/**
 * Update cache after successful incremental build
 */
export async function updateCacheAfterBuild(
  cacheService: CacheService | undefined,
  sourceFiles: string[],
  outputFiles: string[],
  sourceDir: string,
  collectionsDir: string,
  verbose: boolean
): Promise<void> {
  if (!cacheService) {
    return;
  }

  const updates: Array<{ filePath: string; relativePath: string; outputs: string[] }> = [];

  // Update source file cache entries
  for (const sourceFile of sourceFiles) {
    const relativePath = relative(sourceDir, sourceFile);

    // Find corresponding output files
    const sourceBaseName = basename(sourceFile, '.json');
    const relatedOutputs = outputFiles.filter((f) => {
      const outputBaseName = basename(f, '.json');
      return outputBaseName.includes(sourceBaseName);
    });

    updates.push({
      filePath: sourceFile,
      relativePath,
      outputs: relatedOutputs.map((f) => relative(collectionsDir, f)),
    });
  }

  // Batch update cache
  cacheService.updateCacheEntries(
    updates.map((u) => ({
      filePath: u.filePath,
      outputs: u.outputs,
    })),
    sourceDir
  );

  if (verbose) {
    console.info(`  💾 Cache updated: ${updates.length} entries`);
  }
}

/**
 * Generate incremental build report
 */
export function generateIncrementalReport(
  analysis: IncrementalAnalysis,
  startTime: number,
  collectionsProcessed: number,
  totalCollections: number
): string {
  const duration = Date.now() - startTime;
  const lines: string[] = [];

  lines.push('\n📊 Incremental Build Report', '─'.repeat(REPORT_SEPARATOR_WIDTH));

  if (analysis.needsFullBuild) {
    lines.push(`Reason: ${analysis.fullBuildReason}`, `Duration: ${duration}ms`);
  } else if (analysis.changedFiles.length === 0) {
    lines.push(
      'Result: No changes detected',
      `Duration: ${duration}ms`,
      `Time saved: ~${duration}ms (100%)`
    );
  } else {
    const savedCollections = totalCollections - collectionsProcessed;
    const savedPercentage = ((savedCollections / totalCollections) * 100).toFixed(1);

    lines.push(
      `Files analyzed: ${analysis.totalFiles}`,
      `Files changed: ${analysis.changedFiles.length}`,
      `Files unchanged: ${analysis.unchangedFiles.length}`,
      `Collections processed: ${collectionsProcessed}/${totalCollections}`,
      `Collections skipped: ${savedCollections} (${savedPercentage}%)`,
      `Duration: ${duration}ms`
    );
  }

  lines.push('─'.repeat(REPORT_SEPARATOR_WIDTH));

  return lines.join('\n');
}
