# TASK-125: Token Deprecation Workflow

**Task ID:** TASK-125
**Title:** Implement Token Deprecation Workflow
**Priority:** Medium
**Status:** ⚪ Not Started
**Assigned To:** Developer
**Blocked by Task:** TASK-124
**Created:** 2026-01-19
**Updated:** 2026-01-19
**Estimated Time:** 6 hours

---

## 📋 Task Description

### Goal

Implement a deprecation workflow for tokens to provide migration paths and warnings before breaking changes.

### Problem/Issue

- No mechanism to mark tokens as deprecated
- Breaking changes occur without consumer warning
- No migration path documentation
- No deprecation warnings in generated output

### Expected Outcome

- `$deprecated` extension support in tokens
- Deprecation warnings in CSS comments
- Console warnings during build
- Migration path documentation
- Grace period tracking

---

## 🎯 Acceptance Criteria

- [ ] `$deprecated` extension parsed from tokens
- [ ] Deprecation info includes: message, replacement, removeIn
- [ ] CSS output includes deprecation comments
- [ ] Build warns about deprecated tokens
- [ ] Migration report generated
- [ ] Grace period countdown in warnings

---

## 📂 Files to Create/Modify

### New Files

- `packages/@dsai-io/tools/src/tokens/deprecation.ts`
- `packages/@dsai-io/tools/src/tokens/deprecation.test.ts`

### Modified Files

- `packages/@dsai-io/tools/src/tokens/types.ts` - Add deprecation types
- `packages/@dsai-io/tools/src/tokens/style-dictionary/formats/` - Add deprecation comments
- `packages/@dsai-io/tools/src/tokens/build.ts` - Add deprecation warnings

---

## 🔄 Implementation Steps

1. [ ] Define deprecation extension schema
2. [ ] Parse `$deprecated` from tokens
3. [ ] Add deprecation info to token metadata
4. [ ] Generate CSS deprecation comments
5. [ ] Add build-time warnings
6. [ ] Create migration report command
7. [ ] Add `tokens deprecated` CLI command
8. [ ] Write tests
9. [ ] Document deprecation workflow

---

## 📝 Token Deprecation Format

```json
{
  "color": {
    "gray": {
      "100": {
        "$value": "#f3f4f6",
        "$type": "color",
        "$deprecated": {
          "message": "Use color.neutral.100 instead",
          "replacement": "{color.neutral.100}",
          "removeIn": "2.0.0",
          "since": "1.5.0"
        }
      }
    }
  }
}
```

### Generated CSS

```css
/* ⚠️ DEPRECATED: color-gray-100 - Use color.neutral.100 instead
   Will be removed in v2.0.0. Deprecated since v1.5.0 */
--dsai-color-gray-100: #f3f4f6;
```

---

## ✅ Definition of Done

- [ ] Deprecation extension parsed
- [ ] CSS comments generated
- [ ] Build warnings shown
- [ ] Migration report available
- [ ] Tests passing with 90%+ coverage
- [ ] Documentation updated
