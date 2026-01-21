# TASK-120: Improve Transform Module Test Coverage

**Task ID:** TASK-120
**Title:** Increase transform.ts Test Coverage to 85%+
**Priority:** High
**Status:** ⚪ Not Started
**Assigned To:** Developer
**Blocked by Task:** None
**Created:** 2026-01-19
**Updated:** 2026-01-19
**Estimated Time:** 8 hours

---

## 📋 Task Description

### Goal

Increase test coverage for `packages/@dsai-io/tools/src/tokens/transform.ts` from current 63.4% to 85%+.

### Problem/Issue

- Current coverage: 63.4% (below enterprise standard)
- Uncovered lines: 465-617 (collection extractors)
- Uncovered lines: 848-916 (CLI error handling)
- Edge cases in Figma exports can cause silent failures
- Incomplete coverage for multi-mode transformations

### Expected Outcome

- 85%+ coverage for transform.ts
- All collection extractors tested
- CLI error paths tested
- Multi-mode transformation tested
- Edge cases documented and covered

---

## 🎯 Acceptance Criteria

- [ ] Test coverage reaches 85%+ for transform.ts
- [ ] All extractors (color, typography, spacing, etc.) tested
- [ ] CLI error handling paths tested
- [ ] Multi-mode transformation tested (Light/Dark)
- [ ] Edge cases covered (empty collections, invalid tokens)
- [ ] Theme-specific transformations tested

---

## 📂 Files to Modify

### Test File

- `packages/@dsai-io/tools/test/unit/tokens/transform.test.ts`

### Source File (Reference)

- `packages/@dsai-io/tools/src/tokens/transform.ts`

---

## 🔗 Dependencies

### Prerequisites

- [ ] Review current test coverage report
- [ ] Understand transform module architecture

### Blocks

- None (can run in parallel with other tasks)

---

## 🧪 Testing Requirements

### Uncovered Paths to Test

Based on coverage report, these lines need tests:

```
Lines 465-617: Collection-specific extractors
Lines 848-916: CLI transformTokensCLI error handling
Lines 686-688, 738, 748-755: Edge cases in transformTokenTree
Lines 789, 792, 801-820: Mode detection and handling
```

### New Test Cases Needed

- [ ] Test `extractColors()` with various color formats
- [ ] Test `extractTypography()` with font stacks
- [ ] Test `extractSpacing()` with different units
- [ ] Test `extractRadius()` with circle/pill values
- [ ] Test `extractShadows()` with complex shadows
- [ ] Test `extractLayout()` with grid configurations
- [ ] Test `transformTokensCLI()` error paths
- [ ] Test multi-mode transformation (Light + Dark)
- [ ] Test theme-specific file naming
- [ ] Test empty collection handling
- [ ] Test invalid token structure handling

---

## 🔄 Implementation Steps

### Phase 1: Analyze Uncovered Code (1 hour)

1. [ ] Run coverage report: `pnpm nx test @dsai-io/tools --coverage`
2. [ ] Identify specific uncovered lines
3. [ ] Categorize by functionality
4. [ ] Plan test cases for each area

### Phase 2: Collection Extractor Tests (4 hours)

1. [ ] Create fixtures for each collection type
2. [ ] Test color extraction with hex, rgb, references
3. [ ] Test typography extraction with font stacks
4. [ ] Test spacing extraction with various units
5. [ ] Test radius extraction with special values
6. [ ] Test shadow extraction with complex values
7. [ ] Test layout extraction with grid config

### Phase 3: CLI & Error Path Tests (2 hours)

1. [ ] Test `transformTokensCLI()` with missing source
2. [ ] Test `transformTokensCLI()` with invalid config
3. [ ] Test `transformTokensCLI()` with write errors
4. [ ] Test verbose and quiet modes

### Phase 4: Multi-Mode Tests (1 hour)

1. [ ] Test transformation with Light/Dark modes
2. [ ] Test theme-specific file naming
3. [ ] Test mode detection from filenames
4. [ ] Verify coverage target met

---

## 📝 Test Fixtures Needed

```typescript
// Foundation collection with modes
export const mockFoundationCollection = {
  Foundation: {
    modes: {
      Light: {
        colors: {
          brand: {
            primary: { $value: '#3b82f6', $type: 'color' },
          },
        },
      },
      Dark: {
        colors: {
          brand: {
            primary: { $value: '#60a5fa', $type: 'color' },
          },
        },
      },
    },
  },
};

// Typography collection
export const mockTypographyCollection = {
  Typography: {
    modes: {
      Base: {
        fontFamily: {
          base: { $value: 'Inter', $type: 'string' },
          mono: { $value: 'Roboto Mono', $type: 'string' },
        },
        fontSize: {
          base: { $value: 16, $type: 'number' },
          lg: { $value: 18, $type: 'number' },
        },
      },
    },
  },
};
```

---

## ✅ Definition of Done

- [ ] Coverage for transform.ts reaches 85%+
- [ ] All new tests passing
- [ ] No regression in existing tests
- [ ] Coverage report updated in CI
- [ ] Code reviewed and approved
