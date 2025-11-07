# TASK-028: Form Input Component

**Task ID:** TASK-028
**Title:** Form Input Component
**Priority:** High
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 8 hours
**Phase:** Phase 2B - Medium Components (Weeks 9-10)

---

## Description

Create accessible text Input component with support for various types (text, email, password, number), validation states, helper text, prefix/suffix icons, and clear button. Must integrate with form libraries (React Hook Form, Formik).

---

## Acceptance Criteria

### Component Implementation
- [ ] Component file: `packages/components/src/Input/Input.tsx`
- [ ] Input types: text, email, password, number, tel, url, search
- [ ] Sizes: sm, md, lg
- [ ] States: default, hover, focus, disabled, error, success
- [ ] Prefix/suffix icons or text
- [ ] Clear button (optional): `clearable` prop
- [ ] Character counter: `maxLength` + `showCount` props
- [ ] Controlled/uncontrolled modes
- [ ] Forward ref support

### Styling
- [ ] CSS Modules with design tokens
- [ ] Focus ring with token colors
- [ ] Error/success border colors
- [ ] Disabled state styling
- [ ] Icon positioning (prefix/suffix)

### Accessibility
- [ ] Semantic `<input>` element
- [ ] Associated `<label>`
- [ ] `aria-invalid` when error
- [ ] `aria-describedby` for helper text
- [ ] `aria-required` when required
- [ ] Clear button has `aria-label`

### Testing
- [ ] Unit tests 90%+ coverage
- [ ] Test controlled/uncontrolled modes
- [ ] Test validation states
- [ ] jest-axe tests

### Documentation
- [ ] Storybook stories with all variants
- [ ] Form integration examples
- [ ] README

---

## Dependencies

### Requires:
- **TASK-014**: Base Component Template
- **TASK-019**: Semantic Token Definitions

---

## Implementation Steps

### Step 1: Types (0.5 hours)
```typescript
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  type?: InputType;
  size?: InputSize;
  label?: string;
  helperText?: string;
  error?: boolean;
  success?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  clearable?: boolean;
  showCount?: boolean;
}
```

### Step 2: Component Implementation (3 hours)

### Step 3: Styles (2 hours)

### Step 4: Tests (1.5 hours)

### Step 5: Storybook (0.5 hours)

### Step 6: Documentation (0.5 hours)

---

## Definition of Done

- [ ] Input component with all types
- [ ] Validation states work
- [ ] Icons and clear button work
- [ ] Character counter works
- [ ] Form library integration tested
- [ ] Tests pass 90%+
- [ ] Stories complete

---

**Estimated Effort:** 8 hours
