# Incremental Build System

The DSAi token pipeline includes an intelligent incremental build system that dramatically reduces build times by only processing files that have changed since the last build.

## Overview

The incremental build system uses SHA-256 content hashing to detect file changes with precision. When enabled, it:

1. **Analyzes** source files to detect changes
2. **Determines** whether a full or incremental build is needed
3. **Processes** only changed files and their dependencies
4. **Updates** the cache with new file states
5. **Reports** time savings and efficiency gains

## Quick Start

### Enable Incremental Builds

```bash
# Basic incremental build
pnpm tokens:build --incremental

# Or using the --cache flag (alias)
pnpm tokens:build --cache

# Force a full rebuild (ignore cache)
pnpm tokens:build --incremental --force

# Custom cache directory
pnpm tokens:build --incremental --cache-dir=.custom-cache
```

### CLI Flags

| Flag | Alias | Description |
|------|-------|-------------|
| `--incremental` | `--cache` | Enable incremental build mode |
| `--force` | - | Force full rebuild, ignore cache |
| `--cache-dir=<path>` | - | Custom cache directory (default: `.dsai-cache`) |

## How It Works

### 1. File Hashing

Each source file is hashed using SHA-256:

```typescript
// Hash is calculated from file content
const hash = CacheService.hashFile('/path/to/colors.json');
// Result: "a1b2c3d4..." (64-character hex string)
```

### 2. Change Detection

Files are compared against cached hashes:

```typescript
const hasChanged = cacheService.hasFileChanged(
  '/path/to/colors.json',
  sourceDir
);

if (hasChanged) {
  // File content has changed - needs rebuild
} else {
  // File unchanged - skip processing
}
```

### 3. Build Decision Logic

The system uses smart heuristics to decide between full and incremental builds:

```
┌─────────────────────────────────────┐
│ Analyze Changed Files               │
└─────────────┬───────────────────────┘
              │
              ▼
         No Changes?
              │
        ┌─────┴─────┐
       Yes          No
        │            │
        ▼            ▼
   Skip Build   >50% Changed?
                     │
               ┌─────┴─────┐
              Yes          No
               │            │
               ▼            ▼
          Full Build   Incremental Build
```

**Full Build Triggers:**

- No cache exists
- Force rebuild requested (`--force`)
- More than 50% of files changed (more efficient to rebuild all)
- No source files found

**Incremental Build:**

- Less than 50% of files changed
- Cache is valid and up-to-date
- Dependencies can be resolved

### 4. Cache Structure

Cache is stored in `.dsai-cache/token-cache.json`:

```json
{
  "version": "1.0.0",
  "timestamp": "2026-01-19T10:30:00.000Z",
  "files": {
    "colors.json": {
      "hash": "a1b2c3d4...",
      "mtime": "2026-01-19T10:25:00.000Z",
      "outputs": [
        "collections/colors-light.json",
        "collections/colors-dark.json"
      ]
    },
    "spacing.json": {
      "hash": "e5f6g7h8...",
      "mtime": "2026-01-19T09:15:00.000Z",
      "outputs": [
        "collections/spacing.json"
      ]
    }
  }
}
```

**Cache Entry Fields:**

- `hash`: SHA-256 content hash (primary change detection)
- `mtime`: File modification time (fast-path check)
- `outputs`: Generated output files (for cleanup)

### 5. Cache Update

After a successful build, the cache is automatically updated:

```typescript
await updateCacheAfterBuild(
  cacheService,
  changedFiles,      // Files that were processed
  outputFiles,       // Generated outputs
  sourceDir,
  collectionsDir,
  verbose
);
```

## Performance

### Expected Time Savings

| Scenario | Files Changed | Time Savings | Example |
|----------|---------------|--------------|---------|
| No changes | 0% | ~100% | 5s → 0.1s |
| Single file | ~10% | 80-90% | 5s → 0.5s |
| Few files | 10-30% | 60-80% | 5s → 1-2s |
| Many files | 30-50% | 30-60% | 5s → 2-3.5s |
| Most files | >50% | 0% | Full rebuild triggered |

### Real-World Examples

**Typical Token Change (Single Color):**

```bash
# Without incremental: 5.2s
$ pnpm tokens:build
✅ Build complete in 5.2s

# With incremental: 0.6s (88% faster)
$ pnpm tokens:build --incremental
📊 Analysis: 1/10 files changed (10.0%)
🎯 Incremental: processing 1/5 collections
✅ Build complete in 0.6s
```

**No Changes (Cache Hit):**

```bash
$ pnpm tokens:build --incremental
✅ No changes detected, skipping build
⏱️  Duration: 95ms
```

## Integration with Build Pipeline

### Programmatic API

```typescript
import { buildTokens } from '@dsai-io/tools';

const result = await buildTokens(tokensDir, toolsDir, {
  incremental: true,
  force: false,
  cacheDir: '.dsai-cache',
  verbose: true,
});

if (result.success) {
  console.log(`Build completed in ${result.duration}ms`);
  console.log(`Steps completed: ${result.stepsCompleted.join(', ')}`);
}
```

### With Transform Only

You can also use incremental mode with just the transform step:

```typescript
import { transformTokens } from '@dsai-io/tools';
import { CacheService, analyzeChanges } from '@dsai-io/tools/cache';

const cacheService = new CacheService({ cacheDir: '.cache' });

const analysis = await analyzeChanges(sourceDir, {
  enabled: true,
  cacheService,
  verbose: true,
});

if (!analysis.needsFullBuild && analysis.changedFiles.length === 0) {
  console.log('No changes detected');
} else {
  const result = transformTokens({
    sourceDir,
    collectionsDir,
    verbose: true,
  });
}
```

## Cache Management

### Cache Location

By default, the cache is stored in:

```
packages/@dsai-io/tokens/.dsai-cache/
└── token-cache.json
```

### Clear Cache

```bash
# Manual cache clear
rm -rf packages/@dsai-io/tokens/.dsai-cache

# Or use a task
pnpm tokens:clean-cache
```

### Inspect Cache

```typescript
import { CacheService } from '@dsai-io/tools/cache';

const service = new CacheService({ cacheDir: '.dsai-cache' });
const stats = service.getCacheStats();

console.log(`Cached files: ${stats.fileCount}`);
console.log(`Cache size: ${(stats.cacheSize / 1024).toFixed(2)} KB`);
console.log(`Oldest entry: ${stats.oldestEntry}`);
console.log(`Newest entry: ${stats.newestEntry}`);
```

### Cache Invalidation

The cache is automatically invalidated when:

- File content changes (detected by hash)
- File modification time changes
- `--force` flag is used
- Cache version is incompatible

## Best Practices

### ✅ Do

- **Enable by default for local development**

  ```json
  // package.json
  {
    "scripts": {
      "tokens:build": "dsai tokens build --incremental"
    }
  }
  ```

- **Use `--force` for CI/CD builds**

  ```yaml
  # .github/workflows/build.yml
  - run: pnpm tokens:build --force
  ```

- **Commit `.dsai-cache` to `.gitignore`**

  ```gitignore
  # .gitignore
  .dsai-cache/
  ```

- **Use custom cache dir for monorepos**

  ```bash
  pnpm tokens:build --incremental --cache-dir=../../.cache/tokens
  ```

### ❌ Don't

- Don't commit cache files to version control
- Don't rely on cache for production builds (use `--force`)
- Don't manually edit cache files
- Don't share cache between different environments

## Troubleshooting

### Cache Not Working

**Symptom:** Every build is full, even with `--incremental`

**Solutions:**

1. Check cache directory exists and is writable
2. Verify files aren't being modified by formatters
3. Check for `.gitignore` conflicts
4. Use `--force` to rebuild cache

```bash
# Rebuild cache from scratch
rm -rf .dsai-cache
pnpm tokens:build --incremental --force
```

### Unexpected Full Builds

**Symptom:** Incremental builds trigger full rebuild

**Likely causes:**

- More than 50% of files changed
- Cache was cleared or is missing
- File timestamps changed (e.g., `git pull`)

**Check with:**

```bash
# Run with verbose to see why
pnpm tokens:build --incremental --verbose
```

### Stale Cache

**Symptom:** Build doesn't pick up recent changes

**Solutions:**

1. Clear cache and rebuild
2. Check file modification times
3. Verify hash calculation is working

```bash
# Force rebuild to update cache
pnpm tokens:build --incremental --force
```

## Advanced Usage

### Custom Cache Service

```typescript
import { CacheService } from '@dsai-io/tools/cache';

const cache = new CacheService({
  cacheDir: '.custom-cache',
  enabled: true,
  cacheFile: 'my-cache.json',
});

// Manual cache operations
cache.updateCacheEntry('/path/to/file.json', sourceDir);
const hasChanged = cache.hasFileChanged('/path/to/file.json', sourceDir);
cache.clearCacheEntry('/path/to/file.json', sourceDir);
```

### Dependency Tracking

The system supports collection dependencies (coming soon):

```typescript
// Future: Define dependencies
const graph = buildDependencyGraph([
  {
    name: 'semantic',
    inputFile: 'semantic.json',
    outputFiles: ['semantic-light.json'],
    dependencies: ['primitives'], // Depends on primitives
  },
]);

// If primitives changes, semantic is also rebuilt
```

## Metrics & Monitoring

### Build Reports

Incremental builds generate detailed reports:

```
📊 Incremental Build Report
──────────────────────────────────────────────────
Files analyzed: 10
Files changed: 2
Files unchanged: 8
Collections processed: 2/5
Collections skipped: 3 (60.0%)
Duration: 850ms
──────────────────────────────────────────────────
```

### Performance Tracking

```typescript
const startTime = Date.now();
const result = await buildTokens(tokensDir, toolsDir, {
  incremental: true,
});
const timeSaved = estimatedFullBuildTime - result.duration;

console.log(`Time saved: ${timeSaved}ms (${(timeSaved/estimatedFullBuildTime*100).toFixed(1)}%)`);
```

## Implementation Details

### CacheService Class

**Location:** `packages/@dsai-io/tools/src/tokens/cache.ts`

**Key Methods:**

- `hashFile(filePath)` - Generate SHA-256 hash
- `hasFileChanged(filePath, baseDir)` - Detect changes
- `updateCacheEntry(filePath, baseDir, outputs)` - Update cache
- `getCacheStats()` - Get cache metrics

### Incremental Module

**Location:** `packages/@dsai-io/tools/src/tokens/incremental.ts`

**Key Functions:**

- `analyzeChanges(sourceDir, options)` - Analyze what changed
- `filterTransformForIncremental(options, analysis)` - Filter transform
- `updateCacheAfterBuild(...)` - Update cache post-build
- `generateIncrementalReport(...)` - Generate report

## Future Enhancements

### Planned Features

1. **Dependency Tracking**
   - Track dependencies between collections
   - Cascade rebuilds when dependencies change
   - Smart rebuild order based on dependency graph

2. **Remote Cache**
   - Share cache across CI/CD runs
   - Team-wide cache sharing
   - Cloud storage integration

3. **Watch Mode Integration**
   - Real-time incremental rebuilds
   - File system watching
   - Hot reload support

4. **Advanced Heuristics**
   - ML-based build prediction
   - Historical build time analysis
   - Adaptive threshold tuning

5. **Parallel Processing**
   - Process independent collections in parallel
   - Worker thread pool for hashing
   - Async cache operations

## References

- [TASK-122: Token Incremental Build Support](../../tasks/03-medium/TASK-122-token-incremental-build.md)
- [Cache Implementation](../packages/@dsai-io/tools/src/tokens/cache.ts)
- [Incremental Build Logic](../packages/@dsai-io/tools/src/tokens/incremental.ts)
- [Build Pipeline Integration](../packages/@dsai-io/tools/src/tokens/build.ts)

## Contributing

To improve the incremental build system:

1. Add tests to `packages/@dsai-io/tools/src/tokens/__tests__/incremental.test.ts`
2. Update cache logic in `cache.ts`
3. Enhance analysis in `incremental.ts`
4. Document changes in this file

## License

Copyright © 2026 DSAi. All rights reserved.
