# Implementation Plan: [COMPONENT_NAME]

**Branch**: `component/[component-name]`
**Date**: [DATE]
**Spec**: [spec.md](spec.md)
**Figma**: [Figma link if available]

---

## Summary

[One sentence describing what this component does and the technical approach]

---

## Technical Context

**Framework**: React 18+ with TypeScript strict mode
**Styling**: Bootstrap 5.3 + SCSS Modules + Design Tokens
**Testing**: Jest 30.x + RTL 16.x + jest-axe 10.x
**Documentation**: Storybook 10

---

## Constitution Check

*GATE: Must pass before implementation. Re-check after completion.*

### Security Gates

- [ ] No unrestricted prop spreading planned
- [ ] All event handlers will be explicitly defined
- [ ] No dangerouslySetInnerHTML usage

### Accessibility Gates

- [ ] Keyboard navigation requirements identified
- [ ] ARIA attributes planned
- [ ] Focus management strategy defined

### Performance Gates

- [ ] Bundle size estimate under 3 KB
- [ ] Memoization strategy defined (if needed)

---

## Component Structure

```text
packages/@dsai-io/react/src/components/[ComponentName]/
├── [ComponentName].tsx           # Main component
├── [ComponentName].test.tsx      # Unit + accessibility tests
├── [ComponentName].module.scss   # Component styles (if needed)
├── [ComponentName].figma.tsx     # Figma Code Connect
├── [ComponentName].types.ts      # TypeScript interfaces
└── index.ts                      # Barrel export
```

---

## Design Token Mapping

| CSS Property | Token Variable | Example Value |
| ------------ | -------------- | ------------- |
| `padding` | `$spacing-3` | `16px` |
| `background` | `$theme-primary` | `#0d6efd` |
| `border-radius` | `$border-radius-2` | `8px` |
| `font-size` | `$font-size-base` | `1rem` |

---

## Implementation Phases

### Phase 1: Core Component (Required)

- [ ] Create component file structure
- [ ] Implement base component with required props
- [ ] Add TypeScript interfaces
- [ ] Create barrel export

### Phase 2: Variants & States (Required)

- [ ] Implement all visual variants
- [ ] Implement all size variants
- [ ] Implement disabled state
- [ ] Implement loading state (if applicable)

### Phase 3: Accessibility (Required)

- [ ] Add keyboard navigation
- [ ] Add ARIA attributes
- [ ] Add focus management
- [ ] Test with screen reader

### Phase 4: Testing (Required - 95%+ Coverage)

- [ ] Render tests for all variants
- [ ] Interaction tests
- [ ] Keyboard navigation tests
- [ ] jest-axe accessibility tests
- [ ] Edge case tests

### Phase 5: Documentation (Required)

- [ ] Storybook stories for all variants
- [ ] Props documentation
- [ ] Usage examples
- [ ] Figma Code Connect file

---

## Quality Gates (Pre-Completion)

### Before Marking Complete

- [ ] `nx test @dsai-io/react --testFile=[ComponentName]` passes
- [ ] `nx lint @dsai-io/react` passes
- [ ] jest-axe reports zero violations
- [ ] Bundle size verified under 3 KB
- [ ] Storybook renders without errors

---

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected |
| --------- | ---------- | ---------------------------- |
| [e.g., prop spreading] | [specific need] | [why explicit props insufficient] |

---

## Notes

[Any additional considerations, edge cases, or decisions made]
