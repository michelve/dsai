# TASK-126: Config Loader Edge Case Coverage

**Task ID:** TASK-126
**Title:** Improve Config Loader Test Coverage
**Priority:** Low
**Status:** ⚪ Not Started
**Assigned To:** Developer
**Blocked by Task:** None
**Created:** 2026-01-19
**Updated:** 2026-01-19
**Estimated Time:** 4 hours

---

## 📋 Task Description

### Goal

Increase test coverage for `packages/@dsai-io/tools/src/config/loader.ts` from current 67.2% to 85%+.

### Problem/Issue

- Current coverage: 67.2%
- Uncovered: Error handling for malformed config files
- Uncovered: Missing paths, sync config loading
- Edge cases can cause unclear errors

### Expected Outcome

- 85%+ coverage for loader.ts
- All error paths tested
- Edge cases documented and covered

---

## 🎯 Acceptance Criteria

- [ ] Coverage reaches 85%+ for loader.ts
- [ ] Malformed config file handling tested
- [ ] Missing config file scenarios tested
- [ ] Sync vs async loading both tested
- [ ] Config override merging tested

---

## 📂 Files to Modify

- `packages/@dsai-io/tools/test/unit/config/loader.test.ts`

---

## 🔄 Implementation Steps

1. [ ] Review current coverage report for loader.ts
2. [ ] Identify uncovered lines (77, 135-140, 179, 211-236)
3. [ ] Add tests for malformed JSON/YAML configs
4. [ ] Add tests for missing config directories
5. [ ] Add tests for sync loading edge cases
6. [ ] Add tests for override merging
7. [ ] Verify coverage target met

---

## ✅ Definition of Done

- [ ] Coverage reaches 85%+
- [ ] All tests passing
- [ ] No regressions
- [ ] Code reviewed
