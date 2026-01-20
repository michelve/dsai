# TASK-124: Token Changelog Generation

**Task ID:** TASK-124
**Title:** Automatic Token Changelog Generation
**Priority:** Medium
**Status:** ⚪ Not Started
**Assigned To:** Developer
**Blocked by Task:** TASK-118
**Created:** 2026-01-19
**Updated:** 2026-01-19
**Estimated Time:** 8 hours

---

## 📋 Task Description

### Goal

Implement automatic changelog generation for token changes to improve design-dev handoff visibility.

### Problem/Issue

- No visibility into what tokens changed between versions
- Design-dev handoff lacks change documentation
- Breaking changes not clearly communicated
- Manual changelog maintenance is error-prone

### Expected Outcome

- Automatic diff between token versions
- Markdown changelog generation
- Breaking change detection
- Integration with git commits

---

## 🎯 Acceptance Criteria

- [ ] Diff detection for added/removed/modified tokens
- [ ] Markdown changelog generation
- [ ] Breaking change flagging (removed tokens, type changes)
- [ ] Value change tracking with before/after
- [ ] Git commit integration option
- [ ] Changelog stored in `TOKENS-CHANGELOG.md`

---

## 📂 Files to Create/Modify

### New Files

- `packages/@dsai-io/tools/src/tokens/changelog.ts`
- `packages/@dsai-io/tools/src/tokens/changelog.test.ts`
- `packages/@dsai-io/tools/src/tokens/diff.ts`
- `packages/@dsai-io/tools/src/tokens/diff.test.ts`

### Modified Files

- `packages/@dsai-io/tools/src/tokens/index.ts` - Export changelog
- `packages/@dsai-io/tools/src/cli/commands/tokens.ts` - Add changelog command

---

## 🔄 Implementation Steps

1. [ ] Create token diffing utility
2. [ ] Detect added tokens
3. [ ] Detect removed tokens
4. [ ] Detect modified tokens (value changes)
5. [ ] Detect type changes (breaking)
6. [ ] Generate Markdown changelog
7. [ ] Add CLI `tokens changelog` command
8. [ ] Add git integration (commit message, tag)
9. [ ] Write tests
10. [ ] Document usage

---

## 📝 Changelog Output Example

```markdown
# Token Changelog

## [Unreleased] - 2026-01-19

### ⚠️ Breaking Changes
- **REMOVED** `color.brand.accent` - Use `color.brand.secondary` instead

### Added
- `color.brand.tertiary` - New tertiary brand color (#94a3b8)
- `spacing.4xl` - Extra large spacing (64px)

### Changed
- `color.brand.primary` - Updated from #3b82f6 to #2563eb
- `typography.heading.h1` - Font size changed from 2.5rem to 3rem

### Deprecated
- `color.gray.100` - Will be removed in v2.0, use `color.neutral.100`
```

---

## ✅ Definition of Done

- [ ] Token diffing works correctly
- [ ] Changelog generated in Markdown
- [ ] Breaking changes flagged
- [ ] CLI command available
- [ ] Tests passing with 90%+ coverage
- [ ] Documentation updated
