# Quality Checklist: [COMPONENT_NAME]

**Purpose**: Pre-completion validation against DSAi Constitution
**Created**: [DATE]
**Component**: [ComponentName]
**Spec**: [spec.md](spec.md)

---

## Security Gates ❌ Must all pass

- [ ] **SEC-01**: No unrestricted prop spreading (`{...rest}` directly on elements)
- [ ] **SEC-02**: All event handlers explicitly defined in props interface
- [ ] **SEC-03**: No `dangerouslySetInnerHTML` without approval
- [ ] **SEC-04**: String props validated/sanitized if used in attributes
- [ ] **SEC-05**: Security tests passing (no prop injection vulnerabilities)

---

## Accessibility Gates ❌ Must all pass (WCAG 2.2 AA)

### Keyboard Navigation

- [ ] **A11Y-01**: Tab/Shift+Tab navigates to/from component
- [ ] **A11Y-02**: Enter/Space activates interactive elements
- [ ] **A11Y-03**: Escape closes modals/dropdowns (if applicable)
- [ ] **A11Y-04**: Arrow keys navigate within component (if applicable)
- [ ] **A11Y-05**: No keyboard traps

### ARIA & Semantics

- [ ] **A11Y-06**: Proper ARIA labels on interactive elements
- [ ] **A11Y-07**: ARIA roles match element behavior
- [ ] **A11Y-08**: Decorative icons have `aria-hidden="true"`
- [ ] **A11Y-09**: Loading states have `aria-busy="true"`
- [ ] **A11Y-10**: Focus indicators visible

### Testing

- [ ] **A11Y-11**: jest-axe test exists
- [ ] **A11Y-12**: jest-axe reports zero violations
- [ ] **A11Y-13**: Manual screen reader test completed (NVDA/VoiceOver)

---

## Performance Gates ❌ Must all pass

- [ ] **PERF-01**: Bundle size under 3 KB (check with `nx build`)
- [ ] **PERF-02**: Expensive computations memoized
- [ ] **PERF-03**: No unnecessary re-renders (React DevTools profiler)
- [ ] **PERF-04**: Images/icons optimized (if applicable)

---

## Code Quality Gates ❌ Must all pass

### TypeScript

- [ ] **TS-01**: TypeScript strict mode passing (`nx lint`)
- [ ] **TS-02**: No `any` types without justification
- [ ] **TS-03**: Props interface fully documented with JSDoc
- [ ] **TS-04**: All props have explicit types

### Architecture

- [ ] **ARCH-01**: Bootstrap 5 native markup used
- [ ] **ARCH-02**: Named exports only (no default exports)
- [ ] **ARCH-03**: Component in correct directory structure
- [ ] **ARCH-04**: Barrel export in index.ts

### Styling

- [ ] **STYLE-01**: All colors from design tokens
- [ ] **STYLE-02**: All spacing from design tokens
- [ ] **STYLE-03**: No hardcoded values (magic numbers)
- [ ] **STYLE-04**: CSS Modules used (no inline styles)

---

## Testing Gates ❌ Must all pass

- [ ] **TEST-01**: Test file exists: `[ComponentName].test.tsx`
- [ ] **TEST-02**: Coverage ≥ 95% statements
- [ ] **TEST-03**: Coverage ≥ 95% branches
- [ ] **TEST-04**: Coverage ≥ 95% functions
- [ ] **TEST-05**: All variants tested
- [ ] **TEST-06**: All sizes tested
- [ ] **TEST-07**: All states tested (disabled, loading, error)
- [ ] **TEST-08**: User interactions tested (click, keyboard)
- [ ] **TEST-09**: Accessibility tests passing

---

## Documentation Gates ❌ Must all pass

### Storybook

- [ ] **DOC-01**: Story file exists in `@dsai-io/storybook`
- [ ] **DOC-02**: Default story created
- [ ] **DOC-03**: All variants have stories
- [ ] **DOC-04**: All sizes have stories
- [ ] **DOC-05**: AllVariants matrix story
- [ ] **DOC-06**: Props table auto-generated
- [ ] **DOC-07**: Usage examples provided

### Figma

- [ ] **DOC-08**: Code Connect file exists: `[ComponentName].figma.tsx`
- [ ] **DOC-09**: All Figma properties mapped to React props
- [ ] **DOC-10**: Code Connect published

---

## Commands to Verify

```bash
# Lint check
nx lint @dsai-io/react

# Run tests with coverage
nx test @dsai-io/react --testFile=[ComponentName] --coverage

# Check bundle size
nx build @dsai-io/react --analyze

# Storybook
nx storybook @dsai-io/storybook
```

---

## Sign-off

| Gate | Status | Verified By | Date |
| ---- | ------ | ----------- | ---- |
| Security | ⬜ | | |
| Accessibility | ⬜ | | |
| Performance | ⬜ | | |
| Code Quality | ⬜ | | |
| Testing | ⬜ | | |
| Documentation | ⬜ | | |

**Final Status**: ⬜ Not Ready / ✅ Ready for Merge

---

## Notes

[Any deviations from Constitution with justification]
