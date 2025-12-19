# Component Task Template Guide

**Purpose:** Standardized template for creating component development tasks  
**Applies To:** TASK-021 through TASK-045 (All 25 component tasks)  
**Created:** 2025-11-07

---

## How to Use This Template

1. Copy the template below
2. Replace `[COMPONENT_NAME]` with actual component name
3. Replace `[XXX]` with task number
4. Fill in component-specific details in acceptance criteria
5. Adjust estimated time based on complexity:
   - Simple: 6 hours
   - Medium: 8 hours
   - Complex: 12 hours

---

## TEMPLATE: Component Task

````markdown
# Task Template

**Task ID:** TASK-[XXX]
**Title:** Build [COMPONENT_NAME] Component
**Priority:** High
**Status:** ⚪ Not Started
**Assigned To:** Developer
**Phase:** Phase 2[A/B/C] - [Simple/Medium/Complex] Components (Week XX-XX)
**Created:** 2025-11-07
**Updated:** 2025-11-07

---

## 📋 Task Description

### Goal

Build a fully functional, accessible, and tested [COMPONENT_NAME] component with all variants, states, and proper design token integration to replace Bootstrap's implementation.

### Problem/Issue

Need [COMPONENT_NAME] component for the React library with:

- Better accessibility than Bootstrap default
- Full customization through design tokens
- Complete TypeScript type safety
- Comprehensive test coverage
- Production-ready quality

### Expected Outcome

Production-ready [COMPONENT_NAME] component with:

- All variants implemented
- All interactive states working
- 90%+ test coverage
- Complete Storybook documentation
- WCAG 2.1 AA accessibility compliance
- Design token integration
- Migration guide from Bootstrap

---

## 🎯 Acceptance Criteria

### Functionality

- [ ] Component renders correctly with default props
- [ ] All variants implemented: [list specific variants]
- [ ] All sizes implemented: [sm, md, lg]
- [ ] All states working: [default, hover, focus, active, disabled]
- [ ] Props interface fully typed with TypeScript
- [ ] No prop-types, only TypeScript interfaces
- [ ] All interactive behaviors working
- [ ] Keyboard navigation fully functional

### Code Quality

- [ ] TypeScript strict mode, no `any` types
- [ ] Props interface documented with JSDoc comments
- [ ] Semantic HTML elements used (not div soup)
- [ ] CSS Modules only (no inline styles)
- [ ] All styles use design tokens (CSS variables)
- [ ] No hardcoded colors, spacing, or typography
- [ ] Named exports (not default exports)
- [ ] Component properly memoized if needed

### Accessibility (WCAG 2.1 AA)

- [ ] All interactive elements keyboard accessible
- [ ] Proper ARIA labels and roles
- [ ] Color contrast ratio 4.5:1 minimum for text
- [ ] Focus indicators visible and clear
- [ ] Screen reader tested (NVDA or VoiceOver)
- [ ] Semantic HTML structure
- [ ] Form labels properly associated (if applicable)
- [ ] Error messages accessible (if applicable)

### Testing (90%+ Coverage Target)

- [ ] Unit tests for all props
- [ ] Unit tests for all variants
- [ ] Unit tests for all states
- [ ] User interaction tests (clicks, keypresses)
- [ ] Keyboard navigation tests
- [ ] jest-axe accessibility tests passing
- [ ] Edge cases tested
- [ ] Error states tested
- [ ] Test coverage 90% or higher

### Storybook Documentation

- [ ] Default/primary story created
- [ ] Story for each variant
- [ ] Story for each size
- [ ] Story for disabled state
- [ ] Story for loading state (if applicable)
- [ ] Story for error state (if applicable)
- [ ] Interactive Controls panel working
- [ ] Accessibility panel passing
- [ ] Props table auto-generated and accurate
- [ ] Usage examples in MDX docs
- [ ] Do's and Don'ts documented

### Documentation

- [ ] Component API documented
- [ ] All props explained with descriptions
- [ ] Usage examples provided
- [ ] Accessibility guidelines documented
- [ ] Migration guide from Bootstrap
- [ ] Related components linked
- [ ] Code examples for common use cases

### Design Token Integration

- [ ] All colors from design tokens
- [ ] All spacing from design tokens
- [ ] All typography from design tokens
- [ ] All shadows from design tokens (if applicable)
- [ ] All border radii from design tokens
- [ ] All transitions from design tokens
- [ ] Supports light/dark mode through tokens
- [ ] No magic numbers in code

### Performance

- [ ] Component renders without unnecessary re-renders
- [ ] Memoization used appropriately
- [ ] No performance warnings in dev tools
- [ ] Bundle size reasonable for component type

---

## 📂 Files to Create

- `packages/@yourorg/react/src/components/[ComponentName]/[ComponentName].tsx` - Main component
- `packages/@yourorg/react/src/components/[ComponentName]/[ComponentName].module.css` - Styles
- `packages/@yourorg/react/src/components/[ComponentName]/[ComponentName].stories.tsx` - Storybook stories
- `packages/@yourorg/react/src/components/[ComponentName]/[ComponentName].test.tsx` - Unit tests
- `packages/@yourorg/react/src/components/[ComponentName]/[ComponentName].a11y.test.tsx` - Accessibility tests
- `packages/@yourorg/react/src/components/[ComponentName]/[ComponentName].figma.tsx` - Figma Code Connect (Phase 3)
- `packages/@yourorg/react/src/components/[ComponentName]/index.ts` - Export file
- `packages/@yourorg/react/src/components/[ComponentName]/README.md` - Component documentation

---

## 🔗 Dependencies

### Prerequisites

- [x] TASK-001-005: Foundation infrastructure complete
- [x] TASK-011-017: Token system operational
- [x] TASK-013: Storybook configured
- [x] TASK-014: Component template/generator available

### Blocks

- None (components are independent)

---

## 🧪 Testing Requirements

### Unit Tests

Run: `pnpm test [ComponentName]`

- [ ] All tests pass
- [ ] Coverage 90%+ for component file
- [ ] No console errors or warnings
- [ ] Fast execution (< 1 second)

### Accessibility Tests

Run: `pnpm test [ComponentName].a11y`

- [ ] jest-axe tests pass
- [ ] No accessibility violations
- [ ] Screen reader tested manually

### Integration Tests

- [ ] Component works in Storybook
- [ ] Component works in playground app
- [ ] No console errors in browser

### Visual Testing (Optional)

- [ ] Chromatic visual regression (if configured)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)

---

## 📖 Documentation Requirements

### Code Comments

- [ ] JSDoc comments on props interface
- [ ] Complex logic explained with comments
- [ ] Accessibility notes where relevant

### Storybook MDX

- [ ] Overview of component purpose
- [ ] When to use vs alternatives
- [ ] Do's and Don'ts with examples
- [ ] Accessibility best practices
- [ ] Code examples for common patterns

### Migration Guide

- [ ] Bootstrap class equivalent
- [ ] Prop mapping (Bootstrap → React)
- [ ] Breaking changes noted
- [ ] Migration examples

---

## 🔄 Implementation Steps

### Step 1: Setup (15 minutes)

1. [ ] Generate component scaffold using generator
   ```bash
   pnpm generate:component [ComponentName]
   ```
````

1. [ ] Review generated files
2. [ ] Plan component structure

### Step 2: Component Implementation (2-5 hours depending on complexity)

1. [ ] Define TypeScript Props interface

   ```typescript
   export interface [ComponentName]Props {
     variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
     size?: 'sm' | 'md' | 'lg';
     disabled?: boolean;
     children: React.ReactNode;
     // ... other props
   }
   ```

2. [ ] Implement component logic
3. [ ] Add proper semantic HTML
4. [ ] Handle all prop variations
5. [ ] Implement keyboard navigation (if interactive)
6. [ ] Add ARIA attributes for accessibility
7. [ ] Export component properly

### Step 3: Styling (1-2 hours)

1. [ ] Create CSS Module file
2. [ ] Use CSS variables from design tokens
3. [ ] Style all variants
4. [ ] Style all sizes
5. [ ] Style all states (hover, focus, active, disabled)
6. [ ] Add transitions/animations
7. [ ] Ensure responsive behavior
8. [ ] Test in browser

### Step 4: Testing (2-3 hours)

1. [ ] Write unit tests for all props
2. [ ] Write tests for user interactions
3. [ ] Write keyboard navigation tests
4. [ ] Write accessibility tests with jest-axe
5. [ ] Verify 90%+ coverage
6. [ ] Run tests and fix failures

### Step 5: Storybook Stories (1-2 hours)

1. [ ] Create default story
2. [ ] Create variant stories
3. [ ] Create size stories
4. [ ] Create state stories
5. [ ] Add interactive Controls
6. [ ] Write MDX documentation
7. [ ] Test in Storybook UI

### Step 6: Documentation (1 hour)

1. [ ] Write component README
2. [ ] Document all props with examples
3. [ ] Add usage guidelines
4. [ ] Create migration guide from Bootstrap
5. [ ] Add accessibility notes

### Step 7: Review & Polish (30 minutes)

1. [ ] Code self-review
2. [ ] Run linter and fix issues
3. [ ] Run type-check and fix errors
4. [ ] Verify accessibility in browser
5. [ ] Test with screen reader
6. [ ] Check bundle size impact
7. [ ] Update component index exports

---

## 📝 Notes

### Component-Specific Considerations

[Add component-specific notes, edge cases, or special requirements here]

**Bootstrap Reference:**
[Link to Bootstrap documentation for this component]

**Complexity:** [Simple/Medium/Complex]

**Key Challenges:**

- [Challenge 1]
- [Challenge 2]

**Design Tokens Used:**

- Colors: [list relevant token categories]
- Spacing: [list relevant token categories]
- Typography: [list relevant token categories]
- Shadows: [if applicable]

### Common Patterns

**Simple Components (6 hours):**

- Minimal interactivity
- Few variants
- Example: Badge, Alert, Progress

**Medium Components (8 hours):**

- Moderate interactivity
- Multiple variants and sizes
- Form elements
- Example: Input, Select, Tabs

**Complex Components (12 hours):**

- Heavy interactivity
- Complex state management
- Accessibility challenges
- Portal rendering
- Example: Modal, Dropdown, Tooltip

### Accessibility Checklist

For all components:

- [ ] Keyboard accessible (Tab, Enter, Escape, Arrow keys)
- [ ] Screen reader friendly (proper labels, roles, announcements)
- [ ] Focus management (visible focus, logical tab order)
- [ ] Color contrast (4.5:1 for text, 3:1 for UI elements)
- [ ] ARIA attributes (roles, labels, described-by, etc.)
- [ ] Semantic HTML (button, not div with onClick)

For form components specifically:

- [ ] Labels associated with inputs
- [ ] Error messages accessible
- [ ] Required fields indicated
- [ ] Validation feedback provided
- [ ] Help text associated

For interactive overlays (Modal, Dropdown, Tooltip):

- [ ] Focus trap (for modals)
- [ ] Escape to close
- [ ] Focus return on close
- [ ] Portal rendering with proper ARIA

### Testing Best Practices

**What to test:**

- Component renders with various props
- User interactions (clicks, key presses)
- State changes
- Edge cases (empty, null, undefined)
- Error handling

**What NOT to test:**

- Implementation details
- Internal state (test behavior)
- Third-party library internals
- CSS styles (test presence of class names)

**Testing Library Philosophy:**

- Query by accessible labels (not test IDs)
- Interact as users would (click, type)
- Assert on what users see
- Avoid testing implementation details

### Estimated Effort Breakdown

**Simple Component (6 hours total):**

- Setup: 0.25h
- Implementation: 2h
- Styling: 1h
- Testing: 1.5h
- Storybook: 0.75h
- Documentation: 0.5h

**Medium Component (8 hours total):**

- Setup: 0.25h
- Implementation: 3h
- Styling: 1.5h
- Testing: 2h
- Storybook: 1h
- Documentation: 0.75h

**Complex Component (12 hours total):**

- Setup: 0.5h
- Implementation: 5h
- Styling: 2h
- Testing: 3h
- Storybook: 2h
- Documentation: 1h

---

## ✅ Definition of Done

- [ ] All acceptance criteria met
- [ ] All tests passing (90%+ coverage)
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Storybook stories working
- [ ] Accessibility tests passing
- [ ] Manual screen reader test passed
- [ ] Documentation complete
- [ ] Code reviewed (self or peer)
- [ ] Component exported from package
- [ ] Works in playground app
- [ ] Ready for npm publish

---

## Post-Completion

After completing this task:

1. [ ] Mark task as completed in task tracker
2. [ ] Move task file to `tasks/completed/`
3. [ ] Update progress tracking document
4. [ ] Create git commit with conventional commit message
5. [ ] Update CHANGELOG if relevant
6. [ ] Notify team in communication channel

---

**Component Ready for Production! 🎉**

```

---

## Example: Filled Template for Button Component

**TASK-021: Build Button Component**

*Acceptance Criteria (component-specific):*

### Functionality

- [ ] Component renders correctly with default props
- [ ] All variants implemented: primary, secondary, success, warning, danger, outline
- [ ] All sizes implemented: sm, md, lg
- [ ] All states working: default, hover, focus, active, disabled, loading
- [ ] Button type: button, submit, reset
- [ ] Icon support (left and right positions)
- [ ] Full width option
- [ ] Loading state with spinner

*Implementation Notes:*

- Use semantic `<button>` element
- Loading state disables interaction and shows spinner
- Icons should inherit button color
- Outline variants should have transparent background
- Focus ring should be visible and meet contrast requirements

*Bootstrap Reference:* https://getbootstrap.com/docs/5.3/components/buttons/

*Complexity:* Simple (6 hours)

---

## Component Task Creation Checklist

When creating a new component task from this template:

- [ ] Copy template to appropriate priority folder
- [ ] Update task number (TASK-XXX)
- [ ] Set component name throughout
- [ ] Set correct phase and week range
- [ ] Set estimated time (6h/8h/12h)
- [ ] Fill in component-specific acceptance criteria
- [ ] Add component-specific notes
- [ ] Link to Bootstrap documentation
- [ ] Note complexity level
- [ ] List specific variants and states
- [ ] Add any special requirements
- [ ] Save file with naming convention: `TASK-XXX-build-[component]-component.md`

---

**This template ensures consistency across all 25 component tasks!**

```
