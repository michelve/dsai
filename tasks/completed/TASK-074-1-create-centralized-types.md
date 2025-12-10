# Task Template

**Task ID:** TASK-074-1
**Title:** Create Centralized Type System - Core Primitives
**Priority:** Critical
**Status:** ✅ Completed
**Assigned To:** GitHub Copilot
**Estimated Time:** 2-3 days
**Actual Time:** 1 day
**Parent Task:** TASK-074
**Created:** 2025-12-10
**Updated:** 2025-12-10
**Completed:** 2025-12-10

---

## 📋 Task Description

### Goal

Create a new `packages/@dsai/react/src/types/` directory with centralized type primitives that eliminate duplication across 20+ components. This establishes the foundation for a unified type system aligned with Material UI, Ant Design, and Carbon patterns.

### Problem/Issue

**CRITICAL DUPLICATION DISCOVERED:**

- `SemanticColorVariant` type duplicated **8 times** across Alert, Badge, Button (extended), Card, ListGroup, Progress, Spinner, Table components
- `ComponentSize` (sm/md/lg) duplicated **7 times** across Button, Input, Pagination, Progress, Select, Switch, Table
- `SafeHTMLAttributes` security whitelist duplicated **14 times** across Accordion, Alert (2 interfaces), Avatar, Badge, Button, Carousel, Dropdown, Modal (4 interfaces), Navbar, Popover, Scrollspy, Toast, Tooltip, Typography with inconsistent naming
- Current `utils/types/` directory is utility-focused, not component-primitive-focused
- Zero centralized component design vocabulary

**Impact**:

- Code duplication: ~150+ type definitions could be reduced to ~80 (-47%)
- Maintenance burden when updating shared semantics
- Inconsistent naming patterns across components
- Difficult for new contributors to discover common types

### Expected Outcome

Production-ready centralized type system with:

- New `src/types/` directory (separate from `src/utils/types/`)
- Core primitive types that cover 80% of component needs
- Zero breaking changes to existing component APIs
- Complete TypeScript type safety and IntelliSense
- Performance: Type-only imports compile away (zero bundle impact)

---

## 🎯 Acceptance Criteria

### Directory Structure

- [ ] Create `packages/@dsai/react/src/types/` directory
- [ ] Create `types/primitives.ts` - Core design system types (variants, sizes)
- [ ] Create `types/accessibility.ts` - A11y and security types
- [ ] Create `types/polymorphic.ts` - 'as' prop support (MUI-style)
- [ ] Create `types/fsm.ts` - State machine base interfaces
- [ ] Create `types/responsive.ts` - Responsive value types (future)
- [ ] Create `types/index.ts` - Barrel exports

### Core Primitive Types (primitives.ts)

**CRITICAL - Must implement exactly as specified:**

```typescript
/**
 * Semantic color variants used across components
 *
 * Used by: Alert, Badge, Button (extended), Card, ListGroup, Progress, Spinner, Table
 * Replaces 8 duplicate type definitions
 *
 * @example
 * type AlertVariant = SemanticColorVariant; // ✅ Reuse
 * type ButtonVariant = SemanticColorVariant | `outline-${SemanticColorVariant}` | 'link'; // ✅ Extend
 */
export type SemanticColorVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

/**
 * Standard component sizing scale
 *
 * Used by: Button, Input, Pagination, Progress, Select, Switch, Table
 * Replaces 7 duplicate type definitions
 *
 * @example
 * type ButtonSize = ComponentSize;
 */
export type ComponentSize = 'sm' | 'md' | 'lg';

/**
 * Extended size scale for components needing finer granularity
 *
 * Used by: Avatar, Spinner, Modal
 *
 * @example
 * type AvatarSize = ExtendedSize;
 */
export type ExtendedSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Feedback/notification variants
 *
 * Used by: Toast, notification systems
 * Note: Uses 'error' instead of 'danger' for feedback semantics
 *
 * @example
 * type ToastVariant = FeedbackVariant;
 */
export type FeedbackVariant = 'success' | 'error' | 'warning' | 'info' | 'default';

/**
 * Alignment options for layout components
 */
export type Alignment = 'start' | 'center' | 'end';

/**
 * Orientation for components that support both directions
 */
export type Orientation = 'horizontal' | 'vertical';
```

### Accessibility Types (accessibility.ts)

**SECURITY CRITICAL - Must prevent XSS:**

```typescript
/**
 * Safe HTML attributes whitelist
 *
 * SECURITY: Prevents injection of dangerous attributes or event handlers
 *
 * Used by: 14 components - Accordion, Alert (2 interfaces), Avatar, Badge, Button, Carousel, Dropdown, Modal (4 interfaces), Navbar, Popover, Scrollspy, Toast, Tooltip, Typography
 * Replaces: 18+ duplicate interface definitions (SafeHTMLAttributes, SafeBadgeHTMLAttributes, SafeAvatarHTMLAttributes, SafeModalHTMLAttributes, SafeModalHeaderHTMLAttributes, SafeModalBodyHTMLAttributes, SafeModalFooterHTMLAttributes, SafeAlertHTMLAttributes, SafeAlertLinkHTMLAttributes, SafeAccordionHTMLAttributes, SafeCarouselHTMLAttributes, SafeDropdownHTMLAttributes, SafeNavbarHTMLAttributes, SafePopoverHTMLAttributes, SafeScrollspyHTMLAttributes, SafeToastHTMLAttributes, SafeTooltipHTMLAttributes, TypographySafeHTMLAttributes)
 *
 * @template T - HTML element type for element-specific attributes
 *
 * @example
 * interface ButtonProps extends SafeHTMLAttributes<HTMLButtonElement> {
 *   variant?: ButtonVariant;
 * }
 */
export interface SafeHTMLAttributes<T extends HTMLElement = HTMLElement> {
  // Test identifiers
  'data-testid'?: string;
  'data-test'?: string;

  // Descriptive
  title?: string;

  // ARIA - Core
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;

  // ARIA - State
  'aria-hidden'?: boolean | 'true' | 'false';
  'aria-expanded'?: boolean | 'true' | 'false';
  'aria-selected'?: boolean | 'true' | 'false';
  'aria-checked'?: boolean | 'true' | 'false' | 'mixed';
  'aria-disabled'?: boolean | 'true' | 'false';
  'aria-pressed'?: boolean | 'true' | 'false' | 'mixed';
  'aria-current'?: boolean | 'true' | 'false' | 'page' | 'step' | 'location' | 'date' | 'time';

  // ARIA - Relationships
  'aria-controls'?: string;
  'aria-owns'?: string;
  'aria-activedescendant'?: string;

  // ARIA - Live regions
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-atomic'?: boolean | 'true' | 'false';
  'aria-relevant'?: 'additions' | 'removals' | 'text' | 'all';

  // ARIA - Drag and drop
  'aria-dropeffect'?: 'none' | 'copy' | 'move' | 'link' | 'execute' | 'popup';
  'aria-grabbed'?: boolean | 'true' | 'false';

  // Custom data attributes (allow any data-* attribute)
  [key: `data-${string}`]: string | number | boolean | undefined;
}

/**
 * Common ARIA properties for interactive components
 */
export interface ARIAProps {
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-selected'?: boolean;
  'aria-checked'?: boolean | 'mixed';
  'aria-disabled'?: boolean;
  'aria-hidden'?: boolean;
  'aria-controls'?: string;
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-live'?: 'off' | 'polite' | 'assertive';
}
```

### FSM Base Types (fsm.ts)

**PERFORMANCE CRITICAL - Keep minimal:**

````typescript
/**
 * Base interface for Finite State Machine states
 *
 * ⚠️ PERFORMANCE: Keep minimal - FSM updates happen frequently
 * ⚠️ SCALABILITY: Use discriminated unions for state variants
 *
 * Used by: Toast, Popover, Accordion, CardList, Carousel, TabsPro, Table, Tooltip, Navbar, CheckboxGroup, Scrollspy
 *
 * @example
 * ```typescript
 * interface ToastFSMState extends FSMStateBase {
 *   visibility: 'hidden' | 'entering' | 'visible' | 'exiting';
 *   shouldRender: boolean;
 * }
 * ```
 */
export interface FSMStateBase {
  /**
   * Current state identifier
   * Use discriminated union for type safety
   */
  status?: string;
}

/**
 * Base interface for FSM events
 *
 * ⚠️ PERFORMANCE: Events should be lightweight POJOs
 * ⚠️ BEST PRACTICE: Use discriminated unions with 'type' field
 *
 * @example
 * ```typescript
 * type ToastFSMEvent =
 *   | { type: 'SHOW' }
 *   | { type: 'HIDE' }
 *   | { type: 'DISMISS' }
 *   | { type: 'ANIMATION_END' };
 * ```
 */
export interface FSMEventBase {
  /**
   * Event type identifier (discriminant)
   */
  type: string;
}

/**
 * FSM Reducer function signature
 *
 * @template State - FSM state type
 * @template Event - FSM event type
 *
 * @example
 * ```typescript
 * const reducer: FSMReducer<ToastFSMState, ToastFSMEvent> = (state, event) => {
 *   switch (event.type) {
 *     case 'SHOW': return { visibility: 'entering', shouldRender: true };
 *     default: return state;
 *   }
 * };
 * ```
 */
export type FSMReducer<State extends FSMStateBase, Event extends FSMEventBase> = (
  state: State,
  event: Event
) => State;

/**
 * Visual state derived from FSM state
 *
 * Used for CSS classes and rendering decisions
 * Keeps FSM state minimal while providing rich rendering info
 */
export interface VisualStateBase {
  /**
   * Primary visual state (maps to CSS classes)
   */
  state: string;

  /**
   * Whether component should be in DOM
   */
  shouldRender: boolean;

  /**
   * Optional CSS class modifiers
   */
  modifiers?: string[];
}
````

### Polymorphic Types (polymorphic.ts)

**FUTURE - Template only:**

````typescript
/**
 * Polymorphic component props with 'as' prop support
 *
 * Inspired by Material UI's OverridableComponent pattern
 * Allows components to render as different elements while maintaining type safety
 *
 * @template C - React element type
 * @template Props - Component-specific props
 *
 * @example
 * ```typescript
 * interface ButtonOwnProps {
 *   variant?: 'primary' | 'secondary';
 * }
 *
 * type ButtonProps<C extends React.ElementType = 'button'> =
 *   PolymorphicComponentProps<C, ButtonOwnProps>;
 *
 * // Usage:
 * <Button as="a" href="/link">Link button</Button>
 * ```
 */
export type PolymorphicComponentProps<C extends React.ElementType, Props = {}> = Props &
  Omit<React.ComponentPropsWithRef<C>, keyof Props> & {
    as?: C;
  };

/**
 * Extract props from polymorphic component
 */
export type PolymorphicProps<C extends React.ElementType, Props> = PolymorphicComponentProps<
  C,
  Props
>;
````

### Responsive Types (responsive.ts)

**FUTURE - Template only:**

````typescript
/**
 * Responsive value that supports breakpoint-specific values
 *
 * @template T - Value type
 *
 * @example
 * ```typescript
 * interface CardProps {
 *   columns?: ResponsiveValue<1 | 2 | 3 | 4>;
 * }
 *
 * // Usage:
 * <Card columns={{ base: 1, md: 2, lg: 3 }} />
 * <Card columns={2} /> // Non-responsive shorthand
 * ```
 */
export type ResponsiveValue<T> =
  | T
  | {
      base?: T;
      sm?: T;
      md?: T;
      lg?: T;
      xl?: T;
      '2xl'?: T;
    };

/**
 * Extract base value from responsive value
 */
export function getResponsiveValue<T>(
  value: ResponsiveValue<T>,
  breakpoint: 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'base'
): T | undefined {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value[breakpoint] ?? value.base;
  }
  return value as T;
}
````

### Barrel Exports (index.ts)

````typescript
/**
 * DSAi React - Centralized Type System
 *
 * Shared type primitives for component development
 * Reduces duplication and ensures consistency across the design system
 *
 * @module @dsai/react/types
 *
 * @example
 * ```typescript
 * // Import shared primitives
 * import type { SemanticColorVariant, ComponentSize } from '@dsai/react/types';
 *
 * // Or from main package
 * import type { SemanticColorVariant } from '@dsai/react';
 * ```
 */

// Core primitives
export type {
  SemanticColorVariant,
  ComponentSize,
  ExtendedSize,
  FeedbackVariant,
  Alignment,
  Orientation,
} from './primitives';

// Accessibility & security
export type { SafeHTMLAttributes, ARIAProps } from './accessibility';

// State machines
export type { FSMStateBase, FSMEventBase, FSMReducer, VisualStateBase } from './fsm';

// Polymorphic (future)
export type { PolymorphicComponentProps, PolymorphicProps } from './polymorphic';

// Responsive (future)
export type { ResponsiveValue } from './responsive';
export { getResponsiveValue } from './responsive';
````

### Code Quality

- [ ] All types use `export type` for type-only exports
- [ ] All types have JSDoc comments with `@example` where applicable
- [ ] All types specify usage locations in comments
- [ ] Security-critical types (SafeHTMLAttributes) have `⚠️ SECURITY` warnings
- [ ] Performance-critical types (FSM) have `⚠️ PERFORMANCE` warnings
- [ ] No runtime code except helper functions (getResponsiveValue)
- [ ] TypeScript strict mode compliant
- [ ] Zero bundle size impact (type-only)

### Documentation

- [ ] Each type has clear purpose in JSDoc
- [ ] Each type lists components that use it
- [ ] Security types include XSS prevention notes
- [ ] FSM types include performance best practices
- [ ] Examples show proper usage patterns

---

## 📂 Files to Create

**All files in `packages/@dsai/react/src/types/`:**

1. **`primitives.ts`** - Core design system types
   - SemanticColorVariant (replaces 8 duplicates)
   - ComponentSize (replaces 7 duplicates)
   - ExtendedSize (3 users)
   - FeedbackVariant (2 users)
   - Alignment, Orientation

2. **`accessibility.ts`** - A11y and security types
   - SafeHTMLAttributes<T> (replaces 18+ interface duplicates across 14 components: Accordion, Alert (2 interfaces), Avatar, Badge, Button, Carousel, Dropdown, Modal (4 interfaces), Navbar, Popover, Scrollspy, Toast, Tooltip, Typography)
   - ARIAProps

3. **`fsm.ts`** - State machine base types
   - FSMStateBase
   - FSMEventBase
   - FSMReducer<State, Event>
   - VisualStateBase

4. **`polymorphic.ts`** - Polymorphic 'as' prop support
   - PolymorphicComponentProps<C, Props>
   - PolymorphicProps<C, Props>

5. **`responsive.ts`** - Responsive value types
   - ResponsiveValue<T>
   - getResponsiveValue() helper

6. **`index.ts`** - Barrel exports
   - Re-export all types
   - Package documentation

---

## 🔗 Dependencies

### Prerequisites

- [ ] None - creates new directory

### Blocks

- TASK-074-2: Refactor component types (needs primitives)
- TASK-074-3: Update main exports (needs all types)
- TASK-074-4: Documentation (needs complete type system)

---

## 🧪 Testing Requirements

### Type Tests (Create `types/__tests__/primitives.test-d.ts`)

```typescript
import { expectType } from 'tsd';
import type {
  SemanticColorVariant,
  ComponentSize,
  ExtendedSize,
  SafeHTMLAttributes,
} from '../index';

// Test SemanticColorVariant
expectType<SemanticColorVariant>('primary');
expectType<SemanticColorVariant>('success');
// @ts-expect-error - 'invalid' is not a valid variant
expectType<SemanticColorVariant>('invalid');

// Test ComponentSize
expectType<ComponentSize>('sm');
expectType<ComponentSize>('md');
expectType<ComponentSize>('lg');
// @ts-expect-error - 'xs' not in ComponentSize
expectType<ComponentSize>('xs');

// Test ExtendedSize includes all ComponentSize values
expectType<ExtendedSize>('sm'); // ✅
expectType<ExtendedSize>('xs'); // ✅
expectType<ExtendedSize>('2xl'); // ✅

// Test SafeHTMLAttributes type safety
interface TestProps extends SafeHTMLAttributes<HTMLButtonElement> {
  variant: 'primary';
}

const props: TestProps = {
  variant: 'primary',
  'data-testid': 'test',
  'aria-label': 'Button',
  // @ts-expect-error - dangerous attributes not allowed
  onClick: () => {}, // Should not be in SafeHTMLAttributes
};
```

### Runtime Tests

- [ ] No runtime tests needed (type-only module)
- [ ] Verify zero bundle impact: `npm run build` should not include types in bundle

### Manual Testing

- [ ] Import types in VSCode - verify IntelliSense works
- [ ] Test autocomplete for SemanticColorVariant values
- [ ] Test autocomplete for ARIA attributes in SafeHTMLAttributes
- [ ] Verify JSDoc comments appear in hover tooltips

---

## 📖 Documentation Requirements

### Inline Documentation

- [ ] All exported types have JSDoc comments
- [ ] JSDoc includes `@example` for non-obvious types
- [ ] JSDoc includes usage locations (`Used by: Component1, Component2`)
- [ ] Security/performance warnings included where applicable

### Migration Guide (for next task)

- [ ] Document type imports: `import type { ... } from '@dsai/react/types'`
- [ ] Show before/after examples for component refactoring
- [ ] List all breaking changes (expect: zero)

---

## 🔄 Implementation Steps

1. [ ] **Create directory structure**

   ```bash
   mkdir -p packages/@dsai/react/src/types
   cd packages/@dsai/react/src/types
   ```

2. [ ] **Create primitives.ts**
   - Copy exact implementation from acceptance criteria
   - Add JSDoc with usage examples
   - List components that will use each type

3. [ ] **Create accessibility.ts**
   - Implement SafeHTMLAttributes<T> with generic
   - Include all ARIA attributes
   - Add security warnings in JSDoc
   - Support data-\* attributes via index signature

4. [ ] **Create fsm.ts**
   - Define minimal FSMStateBase
   - Define FSMEventBase with discriminated union pattern
   - Add FSMReducer type
   - Add VisualStateBase
   - Include performance warnings

5. [ ] **Create polymorphic.ts**
   - Template implementation (not used yet)
   - Based on Material UI pattern
   - Full type safety for 'as' prop

6. [ ] **Create responsive.ts**
   - Template implementation (not used yet)
   - ResponsiveValue<T> type
   - getResponsiveValue() helper function

7. [ ] **Create index.ts**
   - Export all types
   - Add module documentation
   - Show import examples

8. [ ] **Create type tests**
   - Install `tsd` or configure vitest for type tests
   - Create primitives.test-d.ts
   - Test positive and negative cases
   - Verify type errors where expected

9. [ ] **Verify in VSCode**
   - Open types/index.ts
   - Test autocomplete
   - Check JSDoc hover tooltips
   - Verify no TypeScript errors

10. [ ] **Document for next phase**
    - List all types created
    - List components to refactor (TASK-074-2)
    - Note any design decisions

---

## 📝 Notes

### FSM Pattern Best Practices

Based on analysis of 11 existing FSM implementations (Toast, Popover, Accordion, CardList, Carousel, TabsPro, Table, Tooltip, Navbar, CheckboxGroup, Scrollspy):

**✅ GOOD PATTERNS (keep in fsm.ts):**

- Minimal state objects (2-4 properties max)
- Discriminated unions for type safety
- Pure reducer functions
- Separate visual state derivation
- Type-safe event objects

**❌ AVOID (not in base types):**

- Complex nested state
- Mutable state objects
- Side effects in reducers
- Large context objects
- Dynamic property access

**Example from Toast.fsm.ts (best practice):**

```typescript
interface ToastFSMState {
  visibility: 'hidden' | 'entering' | 'visible' | 'exiting'; // Discriminated union
  shouldRender: boolean; // Minimal properties
}

type ToastFSMEvent =
  | { type: 'SHOW' }
  | { type: 'HIDE' }
  | { type: 'DISMISS' }
  | { type: 'ANIMATION_END' };

// Pure function, no side effects
function toastFSMReducer(state: ToastFSMState, event: ToastFSMEvent): ToastFSMState {
  // Immutable updates only
}
```

### Performance Considerations

1. **Type-only exports**: Use `export type` to ensure types don't end up in bundle
2. **Minimal FSM state**: Keep FSM state objects small (frequent updates)
3. **Discriminated unions**: Better performance than string unions with type guards
4. **No runtime helpers in types**: Only getResponsiveValue() has runtime code

### Security Considerations

1. **SafeHTMLAttributes**: Whitelist approach prevents XSS
2. **No event handlers**: onClick, onMouseOver, etc. intentionally excluded
3. **Data attributes**: Safe via index signature (can't execute code)
4. **Form attributes**: Only safe form props allowed

### Scalability Considerations

1. **Extensibility**: Components can extend base types
2. **Backward compatibility**: New types don't break existing code
3. **Tree-shaking**: Type-only imports don't affect bundle size
4. **Versioning**: Types can evolve without breaking changes

---

## ✅ Definition of Done

- [x] All 6 type files created in `src/types/`
- [x] All types have comprehensive JSDoc
- [x] Type tests pass with `tsd` or vitest
- [x] VSCode IntelliSense works correctly
- [x] Zero bundle size impact verified
- [x] No TypeScript errors in strict mode
- [x] Performance patterns documented
- [x] Security patterns documented
- [x] Ready for component refactoring (TASK-074-2)

---

## 📝 Completion Summary

**Completed:** December 10, 2025

### What Was Delivered

All 6 centralized type files successfully created with zero errors:

1. **primitives.ts** - Core design system types
   - SemanticColorVariant (8 values)
   - ComponentSize (sm/md/lg)
   - ExtendedSize (xs→2xl)
   - FeedbackVariant (success/error/warning/info/default)
   - Alignment and Orientation enums

2. **accessibility.ts** - Security-hardened ARIA types
   - SafeHTMLAttributes with XSS protection
   - ARIAProps interface
   - Security whitelist implementation

3. **fsm.ts** - Finite state machine patterns
   - FSMStateBase, FSMEventBase interfaces
   - FSMReducer and FSMConfig types
   - VisualStateBase for UI states

4. **polymorphic.ts** - Polymorphic component support
   - PolymorphicComponentProps with 'as' prop
   - Type-safe element rendering
   - MUI-style pattern implementation

5. **responsive.ts** - Responsive value system
   - ResponsiveValue<T> type
   - getResponsiveValue() helper (security-hardened)
   - isResponsiveValue() type guard
   - Breakpoint support (base→2xl)

6. **index.ts** - Barrel exports with full documentation

### Quality Verification

- ✅ **TypeScript**: Zero compilation errors in strict mode
- ✅ **Linting**: All files pass Codacy analysis
- ✅ **Security**: No object injection vulnerabilities
- ✅ **Documentation**: Comprehensive JSDoc on all exports
- ✅ **Type Safety**: Used Record<string, never> instead of {}
- ✅ **Performance**: Type-only exports (zero runtime cost)

### Security Highlights

- Rewrote `getResponsiveValue()` to avoid dynamic property access
- Used switch statement with explicit property checks
- SafeHTMLAttributes prevents XSS attacks
- All security patterns documented

### Next Steps

Ready to proceed with **TASK-074-2: Refactor Component Types** to migrate 23 components to use these centralized types.

- [ ] Code reviewed and approved
