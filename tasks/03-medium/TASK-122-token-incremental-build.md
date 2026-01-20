# TASK-122: Token Incremental Build Support

**Task ID:** TASK-122
**Title:** Implement Incremental Build for Token Pipeline
**Priority:** Medium
**Status:** ⚪ Not Started
**Assigned To:** Developer
**Blocked by Task:** TASK-118
**Created:** 2026-01-19
**Updated:** 2026-01-19
**Estimated Time:** 10 hours

---

## 📋 Task Description

### Goal

Implement incremental/differential builds for the token pipeline to improve build performance at scale.

### Problem/Issue

- Full rebuild required for any token change
- Slow CI/CD with 100s of tokens
- No caching of unchanged collections
- Wasted resources rebuilding unchanged outputs

### Expected Outcome

- Hash-based change detection for token files
- Only transform changed collections
- Only rebuild affected Style Dictionary outputs
- 10x faster builds for single-token changes

---

## 🎯 Acceptance Criteria

- [ ] Token files hashed for change detection
- [ ] Only changed collections are transformed
- [ ] Style Dictionary only rebuilds affected platforms
- [ ] Cache invalidation works correctly
- [ ] Force rebuild option available
- [ ] Build time reduced by 80% for single changes
- [ ] Cache stored in `.dsai-cache/` directory

---

## 📂 Files to Create/Modify

### New Files

- `packages/@dsai-io/tools/src/tokens/cache.ts`
- `packages/@dsai-io/tools/src/tokens/cache.test.ts`
- `packages/@dsai-io/tools/src/tokens/incremental.ts`
- `packages/@dsai-io/tools/src/tokens/incremental.test.ts`

### Modified Files

- `packages/@dsai-io/tools/src/tokens/build.ts` - Integrate caching
- `packages/@dsai-io/tools/src/tokens/transform.ts` - Add incremental mode
- `packages/@dsai-io/tools/src/config/types.ts` - Add cache config

---

## 🔄 Implementation Steps

1. [ ] Create hash utility for token files
2. [ ] Create cache storage service
3. [ ] Implement change detection
4. [ ] Add incremental transform mode
5. [ ] Add incremental build mode
6. [ ] Add `--force` flag to bypass cache
7. [ ] Add `--cache-dir` configuration
8. [ ] Write tests for all scenarios
9. [ ] Add performance benchmarks
10. [ ] Document caching behavior

---

## 📝 Cache Structure

```typescript
interface TokenCache {
  version: string;
  timestamp: Date;
  files: Record<string, {
    hash: string;
    mtime: Date;
    outputs: string[];
  }>;
}
```

---

## ✅ Definition of Done

- [ ] Incremental builds work correctly
- [ ] 80%+ time savings for single changes
- [ ] Cache invalidation tested
- [ ] Force rebuild works
- [ ] Tests passing with 90%+ coverage
- [ ] Documentation updated
