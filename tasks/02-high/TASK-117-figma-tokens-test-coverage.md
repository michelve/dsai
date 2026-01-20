# TASK-117: Figma Tokens Package Test Coverage

**Task ID:** TASK-117
**Title:** Add Comprehensive Test Coverage for @dsai-io/figma-tokens
**Priority:** High (Critical for Enterprise)
**Status:** ⚪ Not Started
**Assigned To:** Developer
**Blocked by Task:** None
**Created:** 2026-01-19
**Updated:** 2026-01-19
**Estimated Time:** 16 hours

---

## 📋 Task Description

### Goal

Add comprehensive unit and integration tests for the `@dsai-io/figma-tokens` package, specifically the `FigmaClient` class which currently has **0% test coverage**.

### Problem/Issue

- The Figma client (`client.ts` - 1988 lines) has zero test coverage
- API changes, rate limiting edge cases, and token export errors will go undetected
- Enterprise-level deployments require robust testing for external API integrations
- No mocked tests for Figma API responses

### Expected Outcome

- 80%+ test coverage for `@dsai-io/figma-tokens` package
- Mocked Figma API tests for all client methods
- Edge case coverage (rate limits, errors, malformed responses)
- Integration tests for export → transform workflow

---

## 🎯 Acceptance Criteria

- [ ] Test coverage for `FigmaClient` class reaches 80%+
- [ ] All public methods have unit tests with mocked API
- [ ] Error handling paths are tested (403, 404, 429, 500 errors)
- [ ] Retry logic and exponential backoff tested
- [ ] Token export functionality tested with mock data
- [ ] Variable → token conversion tested
- [ ] Color, typography, shadow transformations tested
- [ ] Integration test: mock Figma export → transform → validate

---

## 📂 Files to Create/Modify

### New Files

- `packages/@dsai-io/figma-tokens/src/__tests__/client.test.ts`
- `packages/@dsai-io/figma-tokens/src/__tests__/client.integration.test.ts`
- `packages/@dsai-io/figma-tokens/test/fixtures/figma-api-responses.ts`
- `packages/@dsai-io/figma-tokens/test/mocks/figma-client.mock.ts`

### Modified Files

- `packages/@dsai-io/figma-tokens/jest.config.ts` - Add coverage thresholds
- `packages/@dsai-io/figma-tokens/package.json` - Add test scripts if needed

---

## 🔗 Dependencies

### Prerequisites

- [ ] Understanding of Figma REST API responses
- [ ] Review existing `client.ts` implementation

### Blocks

- TASK-118: Schema Validation (needs stable client first)
- TASK-120: Transform Coverage (uses client output)

---

## 🧪 Testing Requirements

### Unit Tests

- [ ] `FigmaClient` constructor and configuration
- [ ] `isReady()` method
- [ ] `getFile()` with mock response
- [ ] `getVariables()` with mock response
- [ ] `getPublishedVariables()` with mock response
- [ ] `getFileNodes()` with mock response
- [ ] `exportTokens()` with mock data
- [ ] `syncTokens()` with mock data
- [ ] Error handling (FigmaClientError, FigmaConfigError)
- [ ] Retry logic with exponential backoff
- [ ] Rate limit handling (429 responses)

### Integration Tests

- [ ] Full export workflow with mocked API
- [ ] Export → transform → validate chain
- [ ] Multi-collection export
- [ ] Multi-mode export (Light/Dark)

### Edge Cases

- [ ] Empty collections
- [ ] Missing modes
- [ ] Malformed variable values
- [ ] Network timeout
- [ ] Invalid access token

---

## 🔄 Implementation Steps

### Phase 1: Setup (2 hours)

1. [ ] Create test directory structure
2. [ ] Create Figma API mock fixtures
3. [ ] Configure jest for figma-tokens package
4. [ ] Create mock client helper

### Phase 2: Unit Tests (8 hours)

1. [ ] Test client configuration and initialization
2. [ ] Test authentication flow
3. [ ] Test `getFile()` method
4. [ ] Test `getVariables()` method
5. [ ] Test `exportTokens()` method
6 [ ] Test error classes (FigmaClientError, FigmaConfigError)
7 [ ] Test retry logic
8 [ ] Test helper methods (color conversion, path building)

### Phase 3: Integration Tests (4 hours)

1 [ ] Create realistic Figma API response fixtures
2 [ ] Test complete export workflow
3 [ ] Test export with multiple collections
4 [ ] Test export with theme modes

### Phase 4: Validation (2 hours)

1 [ ] Run full test suite
2 [ ] Verify 80%+ coverage achieved
3 [ ] Add coverage thresholds to jest config
4 [ ] Update package documentation

---

## 📝 Mock Fixtures Required

```typescript
// Example fixture structure
export const mockFigmaVariablesResponse = {
  variables: {
    'var-1': {
      id: 'var-1',
      name: 'colors/brand/primary',
      resolvedType: 'COLOR',
      valuesByMode: {
        'mode-light': { r: 0.23, g: 0.51, b: 0.96, a: 1 },
        'mode-dark': { r: 0.35, g: 0.61, b: 0.98, a: 1 },
      },
      variableCollectionId: 'collection-1',
    },
  },
  variableCollections: {
    'collection-1': {
      id: 'collection-1',
      name: 'Foundation',
      modes: [
        { modeId: 'mode-light', name: 'Light' },
        { modeId: 'mode-dark', name: 'Dark' },
      ],
      remote: false,
    },
  },
};
```

---

## ✅ Definition of Done

- [ ] All acceptance criteria met
- [ ] 80%+ coverage for figma-tokens package
- [ ] All tests passing in CI
- [ ] No regressions in existing functionality
- [ ] Code reviewed and approved
