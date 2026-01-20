# Token Pipeline Error Recovery Guide

**Version:** 1.0  
**Last Updated:** 2026-01-19

---

## Overview

The DSAi token pipeline includes three error recovery systems to ensure reliability and prevent data loss:

1. **Circuit Breaker** - Prevents cascade failures when Figma API is down
2. **Rate Limiter** - Proactively throttles requests to avoid hitting API limits
3. **Snapshot Service** - Creates backups before transforms for safe rollback

This guide explains how to use these features and recover from common failures.

---

## Table of Contents

- [Circuit Breaker](#circuit-breaker)
- [Rate Limiting](#rate-limiting)
- [Snapshot Management](#snapshot-management)
- [Recovery Procedures](#recovery-procedures)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## Circuit Breaker

The circuit breaker protects your pipeline from repeated failures when the Figma API is unavailable or unstable.

### How It Works

The circuit breaker has three states:

```
CLOSED (Normal) → OPEN (Failing) → HALF_OPEN (Testing) → CLOSED
```

- **CLOSED**: Normal operation, all requests go through
- **OPEN**: Too many failures detected, all requests blocked
- **HALF_OPEN**: Cooldown complete, testing if service recovered

### Configuration

Default settings (configured in `FigmaClient`):

```typescript
{
  failureThreshold: 5,      // Open circuit after 5 failures
  cooldownMs: 60000,        // Wait 1 minute before testing recovery
  timeout: 30000            // Request timeout (30 seconds)
}
```

### Error Messages

**When circuit opens:**

```
❌ Circuit breaker 'FigmaAPI' is OPEN after 5 consecutive failures
   The circuit breaker will automatically retry in 60 seconds
   
   Failed request: GET /v1/files/abc123/variables
```

**What to do:**

1. Wait for the cooldown period (1 minute)
2. Check Figma API status at <https://status.figma.com>
3. Retry your operation after cooldown completes
4. If failures persist, check your network/credentials

### Manual Reset

Circuit breakers reset automatically, but if you need to force a reset:

```typescript
import { FigmaClient } from '@dsai-io/figma-tokens';

const client = new FigmaClient({ accessToken: 'your-token' });
// Circuit breaker is internal and resets automatically
```

---

## Rate Limiting

The rate limiter prevents hitting Figma's API rate limits by proactively slowing down requests.

### How It Works

The rate limiter parses `X-RateLimit-*` headers from Figma responses:

- `X-RateLimit-Limit`: Total requests allowed
- `X-RateLimit-Remaining`: Requests left in current window
- `X-RateLimit-Reset`: Unix timestamp when limit resets

### Throttling Thresholds

| Remaining % | Delay | Warning Level |
|-------------|-------|---------------|
| > 20% | 0ms | None |
| 10-20% | 2000ms (2s) | ℹ️ Throttling |
| < 10% | 5000ms (5s) | ⚠️ Critical |

### Console Output

**Throttling (20% remaining):**

```
ℹ️  Throttling Figma API requests (18% remaining)
```

**Critical (10% remaining):**

```
⚠️  Figma API rate limit critically low (8% remaining)
   Rate limit resets in 847 seconds
```

### What to Do

**If you see throttling warnings:**

- ✅ This is normal - the system is protecting you
- ✅ Requests will continue, just slower
- ✅ No action needed

**If you see critical warnings:**

- ⚠️ Consider pausing your operation
- ⚠️ Wait for rate limit to reset (time shown in warning)
- ⚠️ Review if you're making too many requests

### Rate Limit Best Practices

1. **Batch Operations**: Transform multiple collections at once instead of one at a time
2. **Cache Results**: Use the `--cache` flag to avoid redundant API calls
3. **Off-Peak Hours**: Schedule large builds during off-peak times
4. **Watch Mode**: Avoid using watch mode with frequent Figma syncs

---

## Snapshot Management

Snapshots create point-in-time backups of your token collections before potentially destructive operations.

### Automatic Snapshots

Snapshots are created automatically during the build pipeline:

```bash
# Build tokens (creates snapshot before transform)
pnpm tokens build

# Output:
[1/11] 📸 Create Snapshot Backup
       📸 Snapshot created: snapshot_20260119_143052_a7f3
       Files: 12
```

### Manual Snapshot Commands

#### List All Snapshots

```bash
dsai tokens snapshots list
```

**Output:**

```
Found 5 snapshot(s):

  snapshot_20260119_143052_a7f3
    Date: 1/19/2026, 2:30:52 PM
    Files: 12
    Description: Pre-transform backup - 2026-01-19T14:30:52.123Z

  snapshot_20260119_120031_b2c4
    Date: 1/19/2026, 12:00:31 PM
    Files: 12
    Description: Pre-transform backup - 2026-01-19T12:00:31.456Z
```

#### View Snapshot Details

```bash
dsai tokens snapshots info snapshot_20260119_143052_a7f3
```

**Output:**

```
Snapshot: snapshot_20260119_143052_a7f3
Date: 1/19/2026, 2:30:52 PM
Files: 12
Description: Pre-transform backup - 2026-01-19T14:30:52.123Z

Files in snapshot:
  base/colors.json (3421 bytes, checksum: a7f38d2e...)
  base/typography.json (1854 bytes, checksum: b9c41f6a...)
  semantic/tokens.json (5632 bytes, checksum: d4e52a1b...)
  ...
```

#### Rollback to Snapshot

**Dry run (preview changes):**

```bash
dsai tokens snapshots rollback snapshot_20260119_143052_a7f3 --dry-run
```

**Output:**

```
DRY RUN - Would restore snapshot: snapshot_20260119_143052_a7f3
Date: 1/19/2026, 2:30:52 PM
Files to restore: 12
  base/colors.json
  base/typography.json
  semantic/tokens.json
  ...
```

**Actual rollback:**

```bash
dsai tokens snapshots rollback snapshot_20260119_143052_a7f3
```

**Output:**

```
✅ Rolled back to snapshot snapshot_20260119_143052_a7f3
Restored 12 file(s)
Snapshot date: 1/19/2026, 2:30:52 PM
```

### Snapshot Storage

- **Location**: `.snapshots/` directory in your tokens package
- **Format**: JSON files with metadata and checksums
- **Retention**: Last 10 snapshots kept automatically (older ones deleted)
- **Size**: Minimal - only stores JSON token files

### Snapshot File Structure

```
packages/@dsai-io/tokens/
├── collections/          # Your token files
│   ├── base/
│   └── semantic/
└── .snapshots/          # Snapshot storage
    ├── snapshot_20260119_143052_a7f3.json
    ├── snapshot_20260119_120031_b2c4.json
    └── ...
```

---

## Recovery Procedures

### Scenario 1: Transform Failed

**Symptoms:**

- Build fails during transform step
- Token files are corrupted or incomplete
- Error: "Transform failed: Invalid token format"

**Recovery:**

1. **List recent snapshots:**

   ```bash
   dsai tokens snapshots list
   ```

2. **View the latest snapshot:**

   ```bash
   dsai tokens snapshots info <latest-snapshot-id>
   ```

3. **Rollback to the snapshot:**

   ```bash
   dsai tokens snapshots rollback <snapshot-id>
   ```

4. **Verify restoration:**

   ```bash
   dsai tokens validate
   ```

5. **Investigate the issue:**
   - Check Figma export format
   - Review transform options
   - Run with `--verbose` for detailed logs

### Scenario 2: Figma API Down

**Symptoms:**

- Multiple API request failures
- Error: "Circuit breaker 'FigmaAPI' is OPEN"
- Cannot fetch Figma variables

**Recovery:**

1. **Check Figma status:**
   - Visit <https://status.figma.com>
   - Check their Twitter: @figma

2. **Wait for cooldown:**
   - Circuit breaker opens after 5 failures
   - Cooldown period is 1 minute
   - System will retry automatically

3. **Use cached data:**
   - If you have recent Figma exports in `figma-exports/`
   - Run transform without fetching:

   ```bash
   dsai tokens build --skip-fetch
   ```

4. **Retry after recovery:**
   - Wait for Figma to recover
   - Circuit breaker will automatically test recovery
   - Run your build again

### Scenario 3: Rate Limit Exceeded

**Symptoms:**

- Error: "429 Too Many Requests"
- Warning: "Figma API rate limit critically low"
- Requests are very slow

**Recovery:**

1. **Check current rate limit:**
   - Warnings show remaining percentage
   - Shows time until reset

2. **Wait for reset:**
   - Typical reset window: 1 hour
   - Time remaining shown in critical warnings
   - Example: "Rate limit resets in 847 seconds"

3. **Reduce request frequency:**

   ```bash
   # Use cache to avoid redundant requests
   pnpm tokens build --cache
   
   # Transform only (skip Figma fetch)
   dsai tokens transform
   ```

4. **Batch operations:**
   - Combine multiple small builds into one
   - Use scheduled builds instead of continuous

### Scenario 4: Corrupt Token Files

**Symptoms:**

- Validation errors
- Missing required properties
- Invalid JSON structure
- Build fails unexpectedly

**Recovery:**

1. **Try validation first:**

   ```bash
   dsai tokens validate --strict
   ```

2. **If validation fails, rollback:**

   ```bash
   # List snapshots
   dsai tokens snapshots list
   
   # Find the last known good snapshot
   dsai tokens snapshots info <snapshot-id>
   
   # Rollback
   dsai tokens snapshots rollback <snapshot-id>
   ```

3. **Re-fetch from Figma:**

   ```bash
   pnpm tokens fetch
   dsai tokens transform
   ```

4. **Validate again:**

   ```bash
   dsai tokens validate
   ```

---

## Troubleshooting

### Circuit Breaker Not Opening

**Problem:** API is clearly failing, but circuit breaker isn't triggering

**Possible causes:**

- Failures are intermittent (< 5 consecutive)
- Errors are 4xx (client errors, not server errors)
- Circuit breaker only tracks 5xx errors and timeouts

**Solution:**

- Circuit breaker is working as designed
- 4xx errors indicate client-side issues (check credentials, permissions)
- Review error messages for specific issues

### Snapshots Not Created

**Problem:** Build runs but no snapshots appear

**Possible causes:**

- Snapshot step skipped in custom pipeline
- `.snapshots/` directory permissions issue
- Running transform directly instead of build

**Solution:**

1. **Check pipeline configuration:**

   ```javascript
   // dsai.config.mjs
   export default {
     tokens: {
       pipeline: {
         steps: [
           'validate',
           'snapshot',  // Ensure this is included
           'transform',
           // ...
         ]
       }
     }
   }
   ```

2. **Use full build:**

   ```bash
   # Instead of:
   dsai tokens transform
   
   # Use:
   dsai tokens build
   ```

3. **Check directory:**

   ```bash
   ls -la packages/@dsai-io/tokens/.snapshots/
   ```

### Rollback Checksum Mismatch

**Problem:** Error: "Checksum mismatch for file: colors.json"

**Possible causes:**

- Snapshot file corrupted
- File was modified after snapshot creation
- Disk issues

**Solution:**

1. **Try different snapshot:**

   ```bash
   dsai tokens snapshots list
   # Pick an older snapshot
   dsai tokens snapshots rollback <older-snapshot-id>
   ```

2. **Re-fetch from Figma:**

   ```bash
   pnpm tokens fetch
   dsai tokens build
   ```

3. **Manual restore:**
   - Backup current files
   - Open snapshot file (`.snapshots/<id>.json`)
   - Extract `files` array
   - Manually copy content

### Rate Limiting Too Aggressive

**Problem:** Builds are very slow due to excessive throttling

**Possible causes:**

- Multiple concurrent builds
- Shared Figma account with high usage
- Rate limit already depleted before your build

**Solution:**

1. **Check rate limit status:**
   - Warnings show remaining percentage
   - If critically low, wait for reset

2. **Optimize builds:**

   ```bash
   # Cache Figma responses
   pnpm tokens build --cache
   
   # Transform only (no Figma fetch)
   dsai tokens transform
   ```

3. **Schedule builds:**
   - Run during off-peak hours
   - Avoid multiple simultaneous builds
   - Use CI/CD throttling

---

## Best Practices

### Development Workflow

1. **Always validate before building:**

   ```bash
   dsai tokens validate
   dsai tokens build
   ```

2. **Use dry-run for testing:**

   ```bash
   dsai tokens transform --dry-run
   dsai tokens snapshots rollback <id> --dry-run
   ```

3. **Keep snapshots clean:**
   - Automatic cleanup keeps last 10
   - Delete old snapshots manually if needed
   - Don't commit `.snapshots/` to git

4. **Monitor warnings:**
   - Pay attention to rate limit warnings
   - Watch for circuit breaker state changes
   - Check Figma API status regularly

### CI/CD Integration

1. **Enable caching:**

   ```yaml
   # GitHub Actions example
   - name: Build Tokens
     run: pnpm tokens build --cache
   ```

2. **Handle failures gracefully:**

   ```yaml
   - name: Build Tokens
     run: pnpm tokens build
     continue-on-error: true  # Don't fail entire pipeline
     
   - name: Rollback on Failure
     if: failure()
     run: dsai tokens snapshots rollback $(dsai tokens snapshots list | head -1 | awk '{print $1}')
   ```

3. **Add retry logic:**

   ```yaml
   - name: Build Tokens with Retry
     uses: nick-invision/retry@v2
     with:
       timeout_minutes: 10
       max_attempts: 3
       command: pnpm tokens build
   ```

4. **Monitor rate limits:**

   ```yaml
   - name: Check Rate Limit
     run: |
       if pnpm tokens build 2>&1 | grep -q "critically low"; then
         echo "::warning::Rate limit critically low"
       fi
   ```

### Production Deployments

1. **Pre-deployment validation:**

   ```bash
   # Validate tokens before deploy
   dsai tokens validate --strict
   
   # Build with verbose output
   dsai tokens build --verbose
   ```

2. **Backup before major changes:**

   ```bash
   # Create manual snapshot
   # (Build automatically creates one, but good for peace of mind)
   dsai tokens build
   ```

3. **Gradual rollout:**
   - Test in staging first
   - Use snapshot rollback if issues found
   - Keep production snapshots for at least 7 days

4. **Monitoring:**
   - Track circuit breaker open events
   - Monitor rate limit usage
   - Alert on snapshot creation failures

### Team Collaboration

1. **Share snapshot IDs:**
   - Include in PR descriptions
   - Reference in issue tracking
   - Document in release notes

2. **Coordinate builds:**
   - Avoid simultaneous builds (rate limits)
   - Use queue for CI/CD builds
   - Communicate when testing transforms

3. **Document failures:**
   - Save error messages
   - Note which snapshot to rollback to
   - Share recovery procedures

---

## Appendix

### Configuration Reference

**Circuit Breaker:**

```typescript
// packages/@dsai-io/figma-tokens/src/client.ts
new CircuitBreaker({
  name: 'FigmaAPI',
  failureThreshold: 5,    // Open after N failures
  cooldownMs: 60000,      // Wait before retry (ms)
  timeout: 30000          // Request timeout (ms)
})
```

**Rate Limiter:**

```typescript
// packages/@dsai-io/figma-tokens/src/client.ts
new RateLimiter({
  throttleThreshold: 0.2,  // Slow down at 20%
  throttleDelay: 2000,     // 2s delay when throttling
  criticalThreshold: 0.1,  // Critical at 10%
  criticalDelay: 5000      // 5s delay when critical
})
```

**Snapshot Service:**

```typescript
// packages/@dsai-io/tools/src/tokens/build.ts
new SnapshotService({
  collectionsDir: 'collections/',
  snapshotDir: '.snapshots/',
  maxSnapshots: 10,        // Keep last N snapshots
  include: ['**/*.json']   // File patterns to include
})
```

### CLI Command Reference

```bash
# Snapshot management
dsai tokens snapshots list                    # List all snapshots
dsai tokens snapshots info <id>              # Show snapshot details
dsai tokens snapshots rollback <id>          # Restore snapshot
dsai tokens snapshots rollback <id> --dry-run # Preview rollback

# Build with snapshot creation
dsai tokens build                            # Creates snapshot before transform
dsai tokens build --verbose                  # Show detailed output

# Validation
dsai tokens validate                         # Validate tokens
dsai tokens validate --strict                # Strict validation mode

# Transform only (uses existing Figma exports)
dsai tokens transform                        # Transform without fetch
dsai tokens transform --dry-run             # Preview transform
```

### File Locations

```
packages/@dsai-io/tokens/
├── collections/                 # Token collections
│   ├── base/
│   ├── semantic/
│   └── ...
├── figma-exports/              # Raw Figma exports
│   ├── collections.json
│   └── ...
├── .snapshots/                 # Snapshot storage
│   ├── snapshot_<timestamp>_<id>.json
│   └── ...
└── dist/                       # Build outputs
    ├── js/
    ├── css/
    └── ...
```

### Support

**Issues:** <https://github.com/michelve/dsai/issues>  
**Discussions:** <https://github.com/michelve/dsai/discussions>  
**Documentation:** <https://github.com/michelve/dsai/tree/main/docs>

---

## Changelog

**v1.0.0** (2026-01-19)

- Initial release
- Circuit breaker implementation
- Rate limiter implementation
- Snapshot service implementation
- CLI commands for snapshot management
