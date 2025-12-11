# Task Template

**Task ID:** TASK-074-4
**Title:** Documentation and Type Testing for Centralized Type System
**Priority:** High
**Status:** 🔴 Blocked
**Assigned To:** Unassigned
**Estimated Time:** 2-3 days
**Parent Task:** TASK-074
**Blocked By:** TASK-074-3 (Must complete export updates first)
**Created:** 2025-12-10
**Updated:** 2025-12-10

---

## 📋 Task Description

### Goal

Create comprehensive documentation, type-level tests, and migration guides for the centralized type system. Ensure developers understand the new type architecture and can use it effectively.

### Problem/Issue

**Current State:**

- Centralized types created (TASK-074-1)
- Components refactored (TASK-074-2)
- Exports updated (TASK-074-3)
- **NO documentation exists**
- **NO type tests exist**
- **NO migration guide exists**

**Why this matters:**

1. **Developer adoption**: Without docs, developers won't use shared types
2. **Type safety**: Without tests, type regressions can slip through
3. **Maintenance**: Without migration guide, future refactors are harder
4. **API surface**: Undocumented types are effectively private

### Expected Outcome

Complete documentation and testing suite including:

- Type system overview documentation
- API reference for all primitive types
- Usage examples for common patterns
- Type-level tests with tsd
- Migration guide for future refactors
- Storybook integration for type exploration

---

## 🎯 Acceptance Criteria

### Documentation

- [ ] **Type System Overview** (`docs/type-system.md`)
  - Architecture explanation
  - Design decisions
  - Type hierarchy diagram
  - Import patterns

- [ ] **API Reference** (`docs/api/types.md`)
  - Each primitive type documented
  - All type parameters explained
  - Usage examples for each type
  - Edge cases and gotchas

- [ ] **Migration Guide** (`docs/migration/type-system.md`)
  - How we refactored (for future reference)
  - Before/after examples
  - Breaking change policy
  - Backward compatibility strategy

- [ ] **Component Type Patterns** (`docs/patterns/component-types.md`)
  - How to use primitives in components
  - FSM pattern documentation
  - Polymorphic component guide
  - Responsive type patterns

### Type Tests

- [ ] **Primitive Type Tests** (`src/types/__tests__/primitives.test-d.ts`)
  - SemanticColorVariant tests
  - ComponentSize tests
  - ExtendedSize tests
  - FeedbackVariant tests

- [ ] **Accessibility Type Tests** (`src/types/__tests__/accessibility.test-d.ts`)
  - SafeHTMLAttributes tests
  - XSS prevention verification
  - Generic parameter tests

- [ ] **FSM Type Tests** (`src/types/__tests__/fsm.test-d.ts`)
  - FSMStateBase tests
  - FSMReducer tests
  - Type safety verification

- [ ] **Polymorphic Type Tests** (`src/types/__tests__/polymorphic.test-d.ts`)
  - PolymorphicComponentProps tests
  - Element type inference
  - Ref forwarding types

- [ ] **Responsive Type Tests** (`src/types/__tests__/responsive.test-d.ts`)
  - ResponsiveValue tests
  - Breakpoint tests
  - Media query types

- [ ] **Integration Tests** (`src/types/__tests__/integration.test-d.ts`)
  - Component type compatibility
  - Import pattern verification
  - Backward compatibility checks

### Storybook Integration

- [ ] **Type Explorer Story** - Interactive type documentation
- [ ] **Usage Examples** - Real-world component examples
- [ ] **Type Playground** - Test type interactions

### Code Quality

- [ ] All docs follow markdown style guide
- [ ] All code examples compile
- [ ] All tests pass
- [ ] Coverage for all exported types

---

## 📂 Files to Create

### Documentation Files (8 files)

1. **`packages/@dsai/docs/type-system/overview.md`** - Type system overview
2. **`packages/@dsai/docs/type-system/primitives.md`** - Primitive types API
3. **`packages/@dsai/docs/type-system/accessibility.md`** - Accessibility types
4. **`packages/@dsai/docs/type-system/fsm.md`** - FSM type patterns
5. **`packages/@dsai/docs/type-system/polymorphic.md`** - Polymorphic types
6. **`packages/@dsai/docs/type-system/responsive.md`** - Responsive types
7. **`packages/@dsai/docs/type-system/migration.md`** - Migration guide
8. **`packages/@dsai/docs/type-system/patterns.md`** - Common patterns

### Type Test Files (6 files)

9. **`packages/@dsai/react/src/types/__tests__/primitives.test-d.ts`**
10. **`packages/@dsai/react/src/types/__tests__/accessibility.test-d.ts`**
11. **`packages/@dsai/react/src/types/__tests__/fsm.test-d.ts`**
12. **`packages/@dsai/react/src/types/__tests__/polymorphic.test-d.ts`**
13. **`packages/@dsai/react/src/types/__tests__/responsive.test-d.ts`**
14. **`packages/@dsai/react/src/types/__tests__/integration.test-d.ts`**

### Storybook Files (3 files)

15. **`packages/@dsai/storybook/src/stories/TypeSystem/TypeExplorer.stories.tsx`**
16. **`packages/@dsai/storybook/src/stories/TypeSystem/UsageExamples.stories.tsx`**
17. **`packages/@dsai/storybook/src/stories/TypeSystem/Playground.stories.tsx`**

### Configuration Files (1 file)

18. **`packages/@dsai/react/tsd.json`** - tsd configuration

---

## 🔗 Dependencies

### Prerequisites

- [x] TASK-074-1 completed (types created)
- [ ] TASK-074-2 completed (components refactored)
- [ ] TASK-074-3 completed (exports updated)

### Blocks

- None (final task in TASK-074 series)

---

## 🧪 Testing Requirements

### Type Test Coverage

**Required: 100% coverage of all exported types**

#### Primitives Tests (`primitives.test-d.ts`)

```typescript
import { expectType, expectError, expectAssignable, expectNotAssignable } from 'tsd';
import type {
  SemanticColorVariant,
  ComponentSize,
  ExtendedSize,
  FeedbackVariant,
} from '../primitives';

// SemanticColorVariant tests
describe('SemanticColorVariant', () => {
  // Valid values
  expectType<SemanticColorVariant>('primary');
  expectType<SemanticColorVariant>('secondary');
  expectType<SemanticColorVariant>('success');
  expectType<SemanticColorVariant>('danger');
  expectType<SemanticColorVariant>('warning');
  expectType<SemanticColorVariant>('info');
  expectType<SemanticColorVariant>('light');
  expectType<SemanticColorVariant>('dark');

  // Invalid values
  expectError<SemanticColorVariant>('invalid');
  expectError<SemanticColorVariant>('blue');
  expectError<SemanticColorVariant>(123);
  expectError<SemanticColorVariant>(null);

  // Type narrowing
  const variant: SemanticColorVariant = 'primary';
  if (variant === 'danger') {
    expectType<'danger'>(variant); // Type narrowed
  }

  // Array of variants
  const variants: SemanticColorVariant[] = ['primary', 'success', 'danger'];
  expectAssignable<SemanticColorVariant[]>(variants);

  // Cannot assign invalid to array
  expectError<SemanticColorVariant[]>(['primary', 'invalid']);
});

// ComponentSize tests
describe('ComponentSize', () => {
  expectType<ComponentSize>('sm');
  expectType<ComponentSize>('md');
  expectType<ComponentSize>('lg');

  expectError<ComponentSize>('xs');
  expectError<ComponentSize>('xl');
  expectError<ComponentSize>('small');
});

// ExtendedSize tests
describe('ExtendedSize', () => {
  expectType<ExtendedSize>('xs');
  expectType<ExtendedSize>('sm');
  expectType<ExtendedSize>('md');
  expectType<ExtendedSize>('lg');
  expectType<ExtendedSize>('xl');
  expectType<ExtendedSize>('2xl');

  // ExtendedSize includes ComponentSize
  expectAssignable<ExtendedSize>('md' as ComponentSize);

  // But ComponentSize does not include all ExtendedSize
  expectNotAssignable<ComponentSize>('xs' as ExtendedSize);
  expectNotAssignable<ComponentSize>('xl' as ExtendedSize);
});

// FeedbackVariant tests
describe('FeedbackVariant', () => {
  expectType<FeedbackVariant>('success');
  expectType<FeedbackVariant>('error');
  expectType<FeedbackVariant>('warning');
  expectType<FeedbackVariant>('info');
  expectType<FeedbackVariant>('default');

  expectError<FeedbackVariant>('primary');
  expectError<FeedbackVariant>('danger');
});
```

#### Accessibility Tests (`accessibility.test-d.ts`)

```typescript
import { expectType, expectError, expectAssignable } from 'tsd';
import type { SafeHTMLAttributes } from '../accessibility';

describe('SafeHTMLAttributes', () => {
  // Valid ARIA attributes
  const validAttrs: SafeHTMLAttributes = {
    'aria-label': 'Label',
    'aria-labelledby': 'id',
    'aria-describedby': 'id',
    'aria-hidden': true,
    'aria-expanded': false,
    'aria-controls': 'id',
    'data-testid': 'test',
    'data-custom': 'value',
  };
  expectAssignable<SafeHTMLAttributes>(validAttrs);

  // Generic parameter test
  const buttonAttrs: SafeHTMLAttributes<HTMLButtonElement> = {
    'aria-label': 'Click',
    'data-testid': 'btn',
  };
  expectAssignable<SafeHTMLAttributes<HTMLButtonElement>>(buttonAttrs);

  // Data attributes with index signature
  const dataAttrs: SafeHTMLAttributes = {
    'data-anything': 'value',
    'data-number': 123,
    'data-boolean': true,
  };
  expectAssignable<SafeHTMLAttributes>(dataAttrs);

  // Security: Event handlers should NOT be allowed
  expectError<SafeHTMLAttributes>({
    onClick: () => {},
  });

  expectError<SafeHTMLAttributes>({
    onMouseEnter: () => {},
  });

  // Security: Dangerous attributes should NOT be allowed
  expectError<SafeHTMLAttributes>({
    dangerouslySetInnerHTML: { __html: '<script>alert("xss")</script>' },
  });
});
```

#### FSM Tests (`fsm.test-d.ts`)

```typescript
import { expectType, expectError, expectAssignable } from 'tsd';
import type { FSMStateBase, FSMEventBase, FSMReducer, FSMConfig } from '../fsm';

describe('FSM Types', () => {
  // FSMStateBase
  interface MyState extends FSMStateBase {
    visibility: 'hidden' | 'visible';
    shouldRender: boolean;
  }

  const state: MyState = {
    status: 'idle',
    visibility: 'hidden',
    shouldRender: false,
  };
  expectAssignable<FSMStateBase>(state);

  // FSMEventBase
  type MyEvent = { type: 'SHOW' } | { type: 'HIDE' } | { type: 'TOGGLE'; payload: boolean };

  const event: MyEvent = { type: 'SHOW' };
  expectAssignable<FSMEventBase>(event);

  // FSMReducer
  const reducer: FSMReducer<MyState, MyEvent> = (state, event) => {
    switch (event.type) {
      case 'SHOW':
        return { ...state, visibility: 'visible' };
      case 'HIDE':
        return { ...state, visibility: 'hidden' };
      case 'TOGGLE':
        return { ...state, visibility: event.payload ? 'visible' : 'hidden' };
      default:
        return state;
    }
  };

  // Type safety: reducer must return correct state type
  const newState = reducer(state, { type: 'SHOW' });
  expectType<MyState>(newState);

  // Type safety: invalid event should error
  expectError(reducer(state, { type: 'INVALID' }));

  // FSMConfig
  const config: FSMConfig<MyState, MyEvent> = {
    initialState: state,
    reducer,
  };
  expectAssignable<FSMConfig<MyState, MyEvent>>(config);

  // Pure function test (no side effects allowed in types)
  const pureReducer: FSMReducer<MyState, MyEvent> = (state, event) => {
    // Cannot mutate state
    expectError((state.visibility = 'visible'));

    // Must return new state
    return { ...state };
  };
});
```

#### Polymorphic Tests (`polymorphic.test-d.ts`)

```typescript
import { expectType, expectError, expectAssignable } from 'tsd';
import type { PolymorphicComponentProps, PolymorphicRef } from '../polymorphic';
import type { ComponentPropsWithoutRef, ElementType } from 'react';

describe('Polymorphic Types', () => {
  // Basic polymorphic component props
  interface MyComponentOwnProps {
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
  }

  // As button
  type ButtonProps = PolymorphicComponentProps<'button', MyComponentOwnProps>;

  const buttonProps: ButtonProps = {
    as: 'button',
    variant: 'primary',
    type: 'button', // HTMLButtonElement props allowed
    onClick: () => {},
  };
  expectAssignable<ButtonProps>(buttonProps);

  // As anchor
  type AnchorProps = PolymorphicComponentProps<'a', MyComponentOwnProps>;

  const anchorProps: AnchorProps = {
    as: 'a',
    variant: 'primary',
    href: 'https://example.com', // HTMLAnchorElement props allowed
    target: '_blank',
  };
  expectAssignable<AnchorProps>(anchorProps);

  // As custom component
  interface CustomComponentProps {
    customProp: string;
  }

  type CustomProps = PolymorphicComponentProps<
    ElementType<CustomComponentProps>,
    MyComponentOwnProps
  >;

  // Ref forwarding
  const buttonRef: PolymorphicRef<'button'> = { current: null };
  expectType<HTMLButtonElement | null>(buttonRef.current);

  const anchorRef: PolymorphicRef<'a'> = { current: null };
  expectType<HTMLAnchorElement | null>(anchorRef.current);

  // Type safety: cannot use wrong element props
  expectError<ButtonProps>({
    as: 'button',
    href: 'https://example.com', // href not valid on button
  });

  expectError<AnchorProps>({
    as: 'a',
    type: 'button', // type not valid on anchor
  });
});
```

#### Responsive Tests (`responsive.test-d.ts`)

```typescript
import { expectType, expectError, expectAssignable } from 'tsd';
import type { ResponsiveValue, ResponsiveProp, Breakpoint } from '../responsive';

describe('Responsive Types', () => {
  // Breakpoint
  expectType<Breakpoint>('xs');
  expectType<Breakpoint>('sm');
  expectType<Breakpoint>('md');
  expectType<Breakpoint>('lg');
  expectType<Breakpoint>('xl');
  expectType<Breakpoint>('2xl');

  expectError<Breakpoint>('mobile');
  expectError<Breakpoint>('desktop');

  // ResponsiveValue - single value
  const singleValue: ResponsiveValue<string> = 'value';
  expectAssignable<ResponsiveValue<string>>(singleValue);

  // ResponsiveValue - array
  const arrayValue: ResponsiveValue<string> = ['xs-value', 'sm-value', 'md-value'];
  expectAssignable<ResponsiveValue<string>>(arrayValue);

  // ResponsiveValue - object
  const objectValue: ResponsiveValue<string> = {
    xs: 'xs-value',
    md: 'md-value',
    lg: 'lg-value',
  };
  expectAssignable<ResponsiveValue<string>>(objectValue);

  // ResponsiveProp with numbers
  const numberProp: ResponsiveProp<number> = {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
  };
  expectAssignable<ResponsiveProp<number>>(numberProp);

  // ResponsiveProp with boolean
  const booleanProp: ResponsiveProp<boolean> = {
    xs: false,
    md: true,
  };
  expectAssignable<ResponsiveProp<boolean>>(booleanProp);

  // Type safety: all values must be same type
  expectError<ResponsiveValue<string>>({
    xs: 'string',
    md: 123, // Type mismatch
  });

  // Optional breakpoints
  const partialProp: ResponsiveProp<string> = {
    md: 'value', // Only define md, others optional
  };
  expectAssignable<ResponsiveProp<string>>(partialProp);
});
```

---

## 📖 Documentation Requirements

### Type System Overview (`docs/type-system/overview.md`)

```markdown
# Type System Overview

## Architecture

The DSAI React component library uses a centralized type system to ensure consistency across all components and reduce code duplication.

### Design Principles

1. **Single Source of Truth**: All shared types defined once in `src/types/`
2. **Type-Only Exports**: Zero runtime impact, tree-shaking friendly
3. **Backward Compatibility**: Existing component types preserved
4. **Type Safety**: Strict TypeScript with no `any` escapes
5. **Developer Experience**: Clear IntelliSense and error messages

### Type Hierarchy

\`\`\`
src/types/
├── primitives.ts → Core design system types
├── accessibility.ts → ARIA and safe HTML attributes
├── fsm.ts → Finite State Machine patterns
├── polymorphic.ts → Polymorphic component patterns
├── responsive.ts → Responsive design utilities
└── index.ts → Barrel exports
\`\`\`

### Import Patterns

\`\`\`typescript
// Import primitives
import type { SemanticColorVariant, ComponentSize } from '@dsai/react';

// Import component types (unchanged)
import type { ButtonProps, ButtonVariant } from '@dsai/react';

// Import from types subpath (alternative)
import type { SemanticColorVariant } from '@dsai/react/types';
\`\`\`

## Type Categories

### 1. Primitives

Core design system vocabulary: colors, sizes, feedback states.

### 2. Accessibility

Safe HTML/ARIA attributes with XSS prevention.

### 3. FSM (Finite State Machines)

Base types for component state management.

### 4. Polymorphic

Types for components that render as different elements.

### 5. Responsive

Types for responsive prop values.

[See detailed API reference →](./api-reference.md)
```

### API Reference (`docs/type-system/primitives.md`)

```markdown
# Primitives API Reference

## SemanticColorVariant

Semantic color variants used across components.

\`\`\`typescript
export type SemanticColorVariant =
| 'primary'
| 'secondary'
| 'success'
| 'danger'
| 'warning'
| 'info'
| 'light'
| 'dark';
\`\`\`

### Usage

\`\`\`typescript
import type { SemanticColorVariant } from '@dsai/react';

interface MyComponentProps {
variant?: SemanticColorVariant;
}

const MyComponent = ({ variant = 'primary' }: MyComponentProps) => {
return <div className={\`variant-\${variant}\`}>Content</div>;
};
\`\`\`

### Component Compatibility

Used by: Alert, Badge, Button, Card, ListGroup, Progress, Spinner, Table

### Design System Mapping

| Variant   | Token                    | Usage               |
| --------- | ------------------------ | ------------------- |
| primary   | \`colors.primary.500\`   | Primary actions     |
| secondary | \`colors.secondary.500\` | Secondary actions   |
| success   | \`colors.success.500\`   | Success states      |
| danger    | \`colors.danger.500\`    | Destructive actions |
| warning   | \`colors.warning.500\`   | Warning states      |
| info      | \`colors.info.500\`      | Informational       |
| light     | \`colors.gray.100\`      | Light backgrounds   |
| dark      | \`colors.gray.900\`      | Dark backgrounds    |

[See color system docs →](https://dsai.dev/docs/design/colors)

---

## ComponentSize

Standard component sizes (small, medium, large).

\`\`\`typescript
export type ComponentSize = 'sm' | 'md' | 'lg';
\`\`\`

### Usage

\`\`\`typescript
import type { ComponentSize } from '@dsai/react';

interface MyComponentProps {
size?: ComponentSize;
}
\`\`\`

### Component Compatibility

Used by: Button, Input, Pagination, Progress, Select, Switch, Table

### Size Guidelines

| Size | Height | Padding | Font Size | Use Case           |
| ---- | ------ | ------- | --------- | ------------------ |
| sm   | 32px   | 0.5rem  | 0.875rem  | Compact UIs        |
| md   | 40px   | 0.75rem | 1rem      | Default            |
| lg   | 48px   | 1rem    | 1.125rem  | Prominent elements |

[More examples →](#examples)
```

### Migration Guide (`docs/type-system/migration.md`)

```markdown
# Type System Migration Guide

## Overview

This guide documents how we refactored the type system from component-local to centralized primitives.

## Motivation

**Before refactoring:**

- 8 duplicate SemanticColorVariant definitions
- 7 duplicate ComponentSize definitions
- 2 duplicate SafeHTMLAttributes definitions
- ~150 total type definitions

**After refactoring:**

- Single source of truth for shared types
- ~80 type definitions (47% reduction)
- Improved IntelliSense
- Easier maintenance

## Breaking Changes

**None.** This refactoring maintains 100% backward compatibility.

## Migration Steps (For Future Reference)

### Step 1: Create Centralized Types

See [TASK-074-1](../../../tasks/03-medium/TASK-074-1-create-centralized-types.md)

### Step 2: Refactor Components

See [TASK-074-2](../../../tasks/03-medium/TASK-074-2-refactor-component-types.md)

### Step 3: Update Exports

See [TASK-074-3](../../../tasks/03-medium/TASK-074-3-update-package-exports.md)

### Step 4: Documentation

See [TASK-074-4](../../../tasks/03-medium/TASK-074-4-documentation-testing.md)

## Before & After Examples

### Component Type Definition

**Before:**
\`\`\`typescript
// Alert/Alert.types.ts
export type AlertVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
\`\`\`

**After:**
\`\`\`typescript
// Alert/Alert.types.ts
import type { SemanticColorVariant } from '../../types';
export type AlertVariant = SemanticColorVariant;
\`\`\`

### Consumer Code

**No changes required:**
\`\`\`typescript
// User code - still works exactly the same
import type { AlertVariant } from '@dsai/react';

const variant: AlertVariant = 'primary';
\`\`\`

## Future Refactoring Guidelines

1. **Identify duplication**: Use grep/search for repeated patterns
2. **Extract to primitives**: Add to `src/types/primitives.ts`
3. **Refactor components**: One at a time with tests
4. **Update exports**: Add to main package exports
5. **Document**: Update this guide and API docs
6. **Verify**: Type tests + backward compatibility tests

## Rollback Strategy

If issues arise, revert in reverse order:

1. Revert documentation (TASK-074-4)
2. Revert exports (TASK-074-3)
3. Revert component refactors (TASK-074-2)
4. Revert centralized types (TASK-074-1)

Each step maintains working code.
```

---

## 🔄 Implementation Steps

### Phase 1: Type Tests (1 day)

1. [ ] **Install tsd**

   ```bash
   cd packages/@dsai/react
   pnpm add -D tsd @tsd/typescript
   ```

2. [ ] **Configure tsd** (`tsd.json`)

   ```json
   {
     "compilerOptions": {
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": false
     }
   }
   ```

3. [ ] **Create test files** (6 files)
   - primitives.test-d.ts (150 lines)
   - accessibility.test-d.ts (120 lines)
   - fsm.test-d.ts (100 lines)
   - polymorphic.test-d.ts (130 lines)
   - responsive.test-d.ts (100 lines)
   - integration.test-d.ts (80 lines)

4. [ ] **Run type tests**

   ```bash
   pnpm tsd
   ```

5. [ ] **Fix any type errors**

### Phase 2: Documentation Structure (1 day)

6. [ ] **Create docs directory structure**

   ```bash
   mkdir -p packages/@dsai/docs/type-system
   ```

7. [ ] **Create overview doc** (overview.md, ~300 lines)
   - Architecture explanation
   - Design principles
   - Type hierarchy diagram
   - Import patterns

8. [ ] **Create API reference docs** (6 files, ~200 lines each)
   - primitives.md
   - accessibility.md
   - fsm.md
   - polymorphic.md
   - responsive.md
   - patterns.md

9. [ ] **Create migration guide** (migration.md, ~250 lines)
   - Before/after examples
   - Breaking change policy
   - Future refactoring guide

### Phase 3: Code Examples (1 day)

10. [ ] **Add examples to docs**
    - Real-world usage patterns
    - Common recipes
    - Edge case handling
    - Anti-patterns to avoid

11. [ ] **Create Storybook stories** (3 files)
    - TypeExplorer.stories.tsx - Interactive type docs
    - UsageExamples.stories.tsx - Component examples
    - Playground.stories.tsx - Test type interactions

12. [ ] **Verify all examples compile**
    ```bash
    pnpm nx build @dsai/react
    pnpm nx build @dsai/storybook
    ```

### Phase 4: Integration (0.5 days)

13. [ ] **Update main README**
    - Link to type system docs
    - Quick start examples
    - Migration notes

14. [ ] **Update package.json**
    - Add `tsd` script
    - Document type testing

15. [ ] **Update CI/CD**
    - Run type tests in CI
    - Generate type docs

### Phase 5: Review & Polish (0.5 days)

16. [ ] **Internal review**
    - Check all docs render correctly
    - Verify all examples work
    - Test all import patterns

17. [ ] **External review**
    - Share with team
    - Gather feedback
    - Iterate

18. [ ] **Final polish**
    - Fix typos
    - Improve clarity
    - Add more examples if needed

---

## 📝 Notes

### Documentation Style Guide

- **Use code blocks** for all TypeScript examples
- **Show imports** in every example
- **Include IntelliSense screenshots** where helpful
- **Link to design system docs** for tokens
- **Add JSDoc to code examples** for clarity

### Type Test Best Practices

1. **Test positive cases**: Valid types should work
2. **Test negative cases**: Invalid types should error
3. **Test edge cases**: Boundary conditions
4. **Test integration**: Types work together
5. **Test backward compatibility**: Existing imports work

### Storybook Integration

Use Storybook to:

- **Visualize types**: Show valid variant/size combinations
- **Interactive testing**: Let developers play with types
- **Documentation**: Auto-generate prop tables

### Common Pitfalls

1. ❌ **Don't skip type tests** - They catch regressions
2. ❌ **Don't use outdated examples** - Verify all examples compile
3. ❌ **Don't document internal types** - Only public API
4. ❌ **Don't forget JSDoc** - Types need explanations too

### Maintenance

- **Update when types change**: Keep docs in sync
- **Review quarterly**: Ensure examples still relevant
- **Gather feedback**: Improve based on usage
- **Version docs**: Match docs to package versions

---

## ✅ Definition of Done

- [ ] All 6 type test files created and passing
- [ ] tsd configured and running in CI
- [ ] Type system overview doc complete
- [ ] All 6 API reference docs complete
- [ ] Migration guide complete
- [ ] Pattern docs complete
- [ ] All code examples compile
- [ ] 3 Storybook stories created
- [ ] Main README updated
- [ ] package.json scripts added
- [ ] CI/CD running type tests
- [ ] Internal review complete
- [ ] External review complete
- [ ] All feedback addressed
- [ ] Documentation renders correctly
- [ ] No broken links
- [ ] TASK-074 fully complete
- [ ] Type system ready for production use
