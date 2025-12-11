# Task Template

**Task ID:** TASK-074-2
**Title:** Refactor Component Types to Use Centralized Primitives
**Priority:** High
**Status:** 🟡 Ready
**Assigned To:** Unassigned
**Estimated Time:** 4-5 days
**Parent Task:** TASK-074
**Blocked By:** ~~TASK-074-1~~ (Completed 2025-12-10)
**Created:** 2025-12-10
**Updated:** 2025-12-10

---

## 📋 Task Description

### Goal

Refactor 20+ component type definitions to import from centralized `src/types/` primitives, eliminating duplication while maintaining 100% backward compatibility. This reduces technical debt and improves maintainability without breaking any public APIs.

### Problem/Issue

**Current State:**

- SemanticColorVariant duplicated 8 times (Alert, Badge, Button, Card, ListGroup, Progress, Spinner, Table)
- ComponentSize duplicated 7 times (Button, Input, Pagination, Progress, Select, Switch, Table)
- SafeHTMLAttributes duplicated **14 times** across Accordion, Alert (2 interfaces), Avatar, Badge, Button, Carousel, Dropdown, Modal (4 interfaces), Navbar, Popover, Scrollspy, Toast, Tooltip, Typography - **total 17 interface definitions**
- Total: **65+ duplicate type definitions** across components (17 SafeHTMLAttributes interfaces + others)
- Maintenance burden when updating shared semantics
- Inconsistent type naming patterns

**Risk if not addressed:**

- Continued code duplication
- Type drift between components
- Difficult to enforce design system consistency
- Higher maintenance costs

### Expected Outcome

All component types refactored to use centralized primitives with:

- Zero breaking changes to public APIs
- All existing component tests still pass
- Improved IntelliSense (shows shared type origin)
- Reduced TypeScript compilation time
- Single source of truth for design system vocabulary

---

## 🎯 Acceptance Criteria

### High Priority - SemanticColorVariant (8 components)

- [ ] **Alert** (`Alert/Alert.types.ts`)

  ```typescript
  // BEFORE:
  export type AlertVariant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark';

  // AFTER:
  import type { SemanticColorVariant } from '../../types';
  export type AlertVariant = SemanticColorVariant;
  ```

- [ ] **Badge** (`Badge/Badge.types.ts`)

  ```typescript
  // BEFORE:
  export type BadgeVariant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark';

  // AFTER:
  import type { SemanticColorVariant } from '../../types';
  export type BadgeVariant = SemanticColorVariant;
  ```

- [ ] **Progress** (`Progress/Progress.types.ts`)

  ```typescript
  // BEFORE:
  export type ProgressVariant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark';

  // AFTER:
  import type { SemanticColorVariant } from '../../types';
  export type ProgressVariant = SemanticColorVariant;
  ```

- [ ] **Spinner** (`Spinner/Spinner.types.ts`)

  ```typescript
  // BEFORE:
  export type SpinnerVariant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark';

  // AFTER:
  import type { SemanticColorVariant } from '../../types';
  export type SpinnerVariant = SemanticColorVariant;
  ```

- [ ] **ListGroup** (`ListGroup/ListGroup.types.ts`)

  ```typescript
  // BEFORE:
  export type ListGroupItemVariant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark';

  // AFTER:
  import type { SemanticColorVariant } from '../../types';
  export type ListGroupItemVariant = SemanticColorVariant;
  ```

- [ ] **Table** (`Table/Table.types.ts`)

  ```typescript
  // BEFORE:
  export type TableColor =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark';

  // AFTER:
  import type { SemanticColorVariant } from '../../types';
  export type TableColor = SemanticColorVariant;
  ```

- [ ] **Card** (`Card/Card.types.ts`)

  ```typescript
  // BEFORE:
  export type CardColor =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark';

  // AFTER:
  import type { SemanticColorVariant } from '../../types';
  export type CardColor = SemanticColorVariant;
  ```

- [ ] **Button** (`Button/Button.types.ts`) - Extended variant

  ```typescript
  // BEFORE:
  export type ButtonVariant = 'primary' | 'secondary' | ... | 'outline-primary' | ... | 'link';

  // AFTER:
  import type { SemanticColorVariant } from '../../types';
  export type ButtonVariant =
    | SemanticColorVariant
    | `outline-${SemanticColorVariant}`
    | 'link';
  ```

### High Priority - ComponentSize (7 components)

- [ ] **Button** (`Button/Button.types.ts`)

  ```typescript
  // BEFORE:
  export type ButtonSize = 'sm' | 'md' | 'lg';

  // AFTER:
  import type { ComponentSize } from '../../types';
  export type ButtonSize = ComponentSize;
  ```

- [ ] **Input** (`Input/Input.types.ts`)

  ```typescript
  // BEFORE:
  export type InputSize = 'sm' | 'md' | 'lg';

  // AFTER:
  import type { ComponentSize } from '../../types';
  export type InputSize = ComponentSize;
  ```

- [ ] **Select** (`Select/Select.types.ts`)

  ```typescript
  // BEFORE:
  export type SelectSize = 'sm' | 'md' | 'lg';

  // AFTER:
  import type { ComponentSize } from '../../types';
  export type SelectSize = ComponentSize;
  ```

- [ ] **Switch** (`Switch/Switch.types.ts`)

  ```typescript
  // BEFORE:
  export type SwitchSize = 'sm' | 'md' | 'lg';

  // AFTER:
  import type { ComponentSize } from '../../types';
  export type SwitchSize = ComponentSize;
  ```

- [ ] **Pagination** (`Pagination/Pagination.types.ts`)

  ```typescript
  // BEFORE:
  export type PaginationSize = 'sm' | 'md' | 'lg';

  // AFTER:
  import type { ComponentSize } from '../../types';
  export type PaginationSize = ComponentSize;
  ```

- [ ] **Progress** (`Progress/Progress.types.ts`)

  ```typescript
  // BEFORE:
  export type ProgressSize = 'sm' | 'md' | 'lg';

  // AFTER:
  import type { ComponentSize } from '../../types';
  export type ProgressSize = ComponentSize;
  ```

- [ ] **Table** (`Table/Table.types.ts`)

  ```typescript
  // BEFORE:
  export type TableSize = 'sm' | 'md' | 'lg';

  // AFTER:
  import type { ComponentSize } from '../../types';
  export type TableSize = ComponentSize;
  ```

### Medium Priority - ExtendedSize (3 components)

- [ ] **Avatar** (`Avatar/Avatar.types.ts`)

  ```typescript
  // BEFORE:
  export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

  // AFTER:
  import type { ExtendedSize } from '../../types';
  export type AvatarSize = ExtendedSize;
  ```

- [ ] **Spinner** (`Spinner/Spinner.types.ts`)

  ```typescript
  // BEFORE:
  export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  // AFTER:
  import type { ExtendedSize } from '../../types';
  export type SpinnerSize = Exclude<ExtendedSize, '2xl'>; // Spinner doesn't have 2xl
  ```

- [ ] **Modal** (`Modal/Modal.types.ts`)

  ```typescript
  // BEFORE:
  export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';

  // AFTER:
  import type { ComponentSize, ExtendedSize } from '../../types';
  export type ModalSize = ComponentSize | 'xl' | 'fullscreen'; // Mix of standard + extended + custom
  ```

### Medium Priority - FeedbackVariant (1 component)

- [ ] **Toast** (`Toast/Toast.types.ts`)

  ```typescript
  // BEFORE:
  export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'default';

  // AFTER:
  import type { FeedbackVariant } from '../../types';
  export type ToastVariant = FeedbackVariant;
  ```

### Critical Priority - SafeHTMLAttributes (14 components, 17 interfaces)

**⚠️ SECURITY CRITICAL - Handle with care**

**Note:** Some components have multiple SafeHTMLAttributes interfaces:

- Modal: 4 interfaces (Modal, ModalHeader, ModalBody, ModalFooter)
- Alert: 2 interfaces (Alert, AlertLink)
- Others: 1 interface each (11 more components)

- [ ] **Alert** (`Alert/Alert.types.ts`) - **2 interfaces**

  ```typescript
  // BEFORE:
  export interface SafeAlertHTMLAttributes {
    className?: string;
    style?: CSSProperties;
    id?: string;
    'data-testid'?: string;
    'data-test'?: string;
    // ...
  }

  export interface SafeAlertLinkHTMLAttributes {
    className?: string;
    href?: string;
    // ...
  }

  // AFTER:
  import type { SafeHTMLAttributes } from '../../types';
  export type SafeAlertHTMLAttributes = SafeHTMLAttributes<HTMLDivElement>;
  export type SafeAlertLinkHTMLAttributes = SafeHTMLAttributes<HTMLAnchorElement>;
  ```

- [ ] **Avatar** (`Avatar/Avatar.types.ts`)

  ```typescript
  // BEFORE:
  export interface SafeAvatarHTMLAttributes {
    'data-testid'?: string;
    // ...
  }

  // AFTER:
  import type { SafeHTMLAttributes } from '../../types';
  export type SafeAvatarHTMLAttributes = SafeHTMLAttributes<HTMLDivElement>;
  ```

- [ ] **Badge** (`Badge/Badge.types.ts`)

  ```typescript
  // BEFORE:
  export interface SafeBadgeHTMLAttributes {
    id?: string;
    className?: string;
    // ...
  }

  // AFTER:
  import type { SafeHTMLAttributes } from '../../types';
  export type SafeBadgeHTMLAttributes = SafeHTMLAttributes<HTMLSpanElement>;
  ```

- [ ] **Button** (`Button/Button.types.ts`)

  ```typescript
  // BEFORE:
  export interface SafeHTMLAttributes {
    'data-testid'?: string;
    'data-test'?: string;
    title?: string;
    form?: string;
    formAction?: string;
    formMethod?: 'get' | 'post' | 'dialog';
    formNoValidate?: boolean;
    formTarget?: string;
  }

  export interface ButtonProps extends SafeHTMLAttributes {
    variant?: ButtonVariant;
    // ... other props
  }

  // AFTER:
  import type { SafeHTMLAttributes } from '../../types';

  // Extend with button-specific attributes
  export interface ButtonSafeHTMLAttributes extends SafeHTMLAttributes<HTMLButtonElement> {
    form?: string;
    formAction?: string;
    formMethod?: 'get' | 'post' | 'dialog';
    formNoValidate?: boolean;
    formTarget?: string;
  }

  export interface ButtonProps extends ButtonSafeHTMLAttributes {
    variant?: ButtonVariant;
    // ... other props
  }
  ```

- [ ] **Popover** (`Popover/Popover.types.ts`)

  ```typescript
  // BEFORE:
  export interface SafePopoverHTMLAttributes {
    className?: string;
    style?: CSSProperties;
    id?: string;
    'data-testid'?: string;
    'data-test'?: string;
  }

  // AFTER:
  import type { SafeHTMLAttributes } from '../../types';
  export type SafePopoverHTMLAttributes = SafeHTMLAttributes<HTMLDivElement>;
  ```

- [ ] **Toast** (`Toast/Toast.types.ts`)

  ```typescript
  // BEFORE:
  export interface SafeToastHTMLAttributes {
    className?: string;
    style?: CSSProperties;
    id?: string;
    'data-testid'?: string;
    'data-test'?: string;
    'aria-label'?: string;
  }

  // AFTER:
  import type { SafeHTMLAttributes } from '../../types';
  export type SafeToastHTMLAttributes = SafeHTMLAttributes<HTMLDivElement>;
  ```

- [ ] **Tooltip** (`Tooltip/Tooltip.types.ts`)

  ```typescript
  // BEFORE:
  export interface SafeTooltipHTMLAttributes {
    className?: string;
    style?: CSSProperties;
    id?: string;
    'data-testid'?: string;
    'data-test'?: string;
  }

  // AFTER:
  import type { SafeHTMLAttributes } from '../../types';
  export type SafeTooltipHTMLAttributes = SafeHTMLAttributes<HTMLDivElement>;
  ```

- [ ] **Scrollspy** (`Scrollspy/Scrollspy.types.ts`)

  ```typescript
  // BEFORE:
  export interface SafeScrollspyHTMLAttributes {
    className?: string;
    style?: CSSProperties;
    id?: string;
    'data-testid'?: string;
    'data-test'?: string;
  }

  // AFTER:
  import type { SafeHTMLAttributes } from '../../types';
  export type SafeScrollspyHTMLAttributes = SafeHTMLAttributes<HTMLElement>;
  ```

- [ ] **Typography** (`Typography/Typography.types.ts`)

  ```typescript
  // BEFORE:
  export interface TypographySafeHTMLAttributes {
    'data-testid'?: string;
    'data-test'?: string;
    title?: string;
  }

  // AFTER:
  import type { SafeHTMLAttributes } from '../../types';

  // Typography can use base directly (no additional attributes needed)
  export type TypographySafeHTMLAttributes = SafeHTMLAttributes<HTMLElement>;
  ```

### Low Priority - Keep Component-Specific (DO NOT CHANGE)

These types are intentionally component-specific and should NOT use centralized primitives:

- [ ] **Typography sizes** - Keep semantic (HeadingSize, DisplaySize, TextSize)
- [ ] **Component-specific variants** - Keep unique (TabsVariant, CardVariant, NavbarVariant, etc.)
- [ ] **FSM states** - Each component keeps its own FSM types (use FSMStateBase as reference only)

### Code Quality

- [ ] All imports use `import type { ... } from '../../types'`
- [ ] Existing JSDoc comments preserved
- [ ] Export names unchanged (backward compatibility)
- [ ] No changes to component implementations (`.tsx` files)
- [ ] TypeScript strict mode passes
- [ ] No `@ts-ignore` or `@ts-expect-error` added

### Testing

- [ ] All existing component tests pass without modification
- [ ] Type tests verify backward compatibility
- [ ] Manual testing in Storybook
- [ ] VSCode IntelliSense works correctly

---

## 📂 Files to Modify

**Total: 23 unique component files**
**Total type interfaces to refactor: ~32 type definitions**

- 8 SemanticColorVariant duplicates
- 7 ComponentSize duplicates
- 17 SafeHTMLAttributes interfaces (across 14 components)

### High Priority (15 files)

1. `packages/@dsai/react/src/components/Alert/Alert.types.ts` - SemanticColorVariant
2. `packages/@dsai/react/src/components/Badge/Badge.types.ts` - SemanticColorVariant
3. `packages/@dsai/react/src/components/Progress/Progress.types.ts` - SemanticColorVariant + ComponentSize
4. `packages/@dsai/react/src/components/Spinner/Spinner.types.ts` - SemanticColorVariant + ExtendedSize
5. `packages/@dsai/react/src/components/ListGroup/ListGroup.types.ts` - SemanticColorVariant
6. `packages/@dsai/react/src/components/Table/Table.types.ts` - SemanticColorVariant + ComponentSize
7. `packages/@dsai/react/src/components/Card/Card.types.ts` - SemanticColorVariant
8. `packages/@dsai/react/src/components/Button/Button.types.ts` - SemanticColorVariant (extended) + ComponentSize + SafeHTMLAttributes
9. `packages/@dsai/react/src/components/Input/Input.types.ts` - ComponentSize
10. `packages/@dsai/react/src/components/Select/Select.types.ts` - ComponentSize
11. `packages/@dsai/react/src/components/Switch/Switch.types.ts` - ComponentSize
12. `packages/@dsai/react/src/components/Pagination/Pagination.types.ts` - ComponentSize
13. `packages/@dsai/react/src/components/Avatar/Avatar.types.ts` - ExtendedSize
14. `packages/@dsai/react/src/components/Modal/Modal.types.ts` - Mixed sizes
15. `packages/@dsai/react/src/components/Toast/Toast.types.ts` - FeedbackVariant

### Critical Priority (14 files - SafeHTMLAttributes, 18+ interfaces)

16. `packages/@dsai/react/src/components/Accordion/Accordion.types.ts` - SafeAccordionHTMLAttributes
17. `packages/@dsai/react/src/components/Alert/Alert.types.ts` - SafeAlertHTMLAttributes + SafeAlertLinkHTMLAttributes
18. `packages/@dsai/react/src/components/Avatar/Avatar.types.ts` - SafeAvatarHTMLAttributes
19. `packages/@dsai/react/src/components/Badge/Badge.types.ts` - SafeBadgeHTMLAttributes
20. `packages/@dsai/react/src/components/Button/Button.types.ts` - SafeHTMLAttributes (also in list above)
21. `packages/@dsai/react/src/components/Carousel/Carousel.types.ts` - SafeCarouselHTMLAttributes
22. `packages/@dsai/react/src/components/Dropdown/Dropdown.types.ts` - SafeDropdownHTMLAttributes
23. `packages/@dsai/react/src/components/Modal/Modal.types.ts` - SafeModalHTMLAttributes + SafeModalHeaderHTMLAttributes + SafeModalBodyHTMLAttributes + SafeModalFooterHTMLAttributes
24. `packages/@dsai/react/src/components/Navbar/Navbar.types.ts` - SafeNavbarHTMLAttributes
25. `packages/@dsai/react/src/components/Popover/Popover.types.ts` - SafePopoverHTMLAttributes
26. `packages/@dsai/react/src/components/Scrollspy/Scrollspy.types.ts` - SafeScrollspyHTMLAttributes
27. `packages/@dsai/react/src/components/Toast/Toast.types.ts` - SafeToastHTMLAttributes
28. `packages/@dsai/react/src/components/Tooltip/Tooltip.types.ts` - SafeTooltipHTMLAttributes
29. `packages/@dsai/react/src/components/Typography/Typography.types.ts` - TypographySafeHTMLAttributes

### Low Priority - DO NOT CHANGE (keep for reference)

- Typography/Typography.types.ts - Keep semantic sizes (h1-h6, 1-6, sm/base/lg)
- Tabs/Tabs.types.ts - Keep TabsVariant ('underline' | 'pills' | 'tabs')
- All FSM files - Keep component-specific state machines

---

## 🔗 Dependencies

### Prerequisites

- [x] TASK-074-1 completed (centralized types created)

### Blocks

- TASK-074-3: Update main exports (needs refactored types)
- TASK-074-4: Documentation (needs examples from refactored components)

---

## 🧪 Testing Requirements

### Type Tests

Create `types/__tests__/component-compatibility.test-d.ts`:

```typescript
import { expectType, expectAssignable } from 'tsd';
import type { ButtonVariant, ButtonSize, ButtonProps } from '../../components/Button';
import type { AlertVariant } from '../../components/Alert';
import type { ComponentSize, SemanticColorVariant } from '../index';

// Test ButtonSize is compatible with ComponentSize
expectType<ComponentSize>('sm' as ButtonSize);
expectType<ComponentSize>('md' as ButtonSize);
expectType<ComponentSize>('lg' as ButtonSize);

// Test AlertVariant is compatible with SemanticColorVariant
expectType<SemanticColorVariant>('primary' as AlertVariant);
expectType<SemanticColorVariant>('danger' as AlertVariant);

// Test ButtonVariant includes SemanticColorVariant + outline + link
expectAssignable<ButtonVariant>('primary' as SemanticColorVariant);
expectType<ButtonVariant>('outline-primary');
expectType<ButtonVariant>('link');

// Test ButtonProps accepts SafeHTMLAttributes
const buttonProps: ButtonProps = {
  variant: 'primary',
  'data-testid': 'test-button',
  'aria-label': 'Click me',
  form: 'my-form', // button-specific
};
```

### Unit Tests

- [ ] Run all component tests: `pnpm nx test @dsai/react`
- [ ] Verify zero test failures
- [ ] Verify zero TypeScript errors
- [ ] Check test coverage maintained

### Integration Tests

- [ ] Build package: `pnpm nx build @dsai/react`
- [ ] Verify no build errors
- [ ] Check bundle size unchanged (types don't affect bundle)

### Manual Testing

- [ ] Open Storybook: `pnpm nx storybook @dsai/storybook`
- [ ] Test each refactored component
- [ ] Verify all variants/sizes still work
- [ ] Check no visual regressions

### Backward Compatibility Tests

```typescript
// Test that existing imports still work
import type { ButtonVariant, AlertVariant } from '@dsai/react';

const buttonVariant: ButtonVariant = 'primary'; // ✅ Should work
const alertVariant: AlertVariant = 'success'; // ✅ Should work
```

---

## 📖 Documentation Requirements

### Code Comments

- [ ] Preserve all existing JSDoc comments
- [ ] Add note: `@see SemanticColorVariant` or `@see ComponentSize`
- [ ] Update `@example` if imports change

### Migration Notes (for TASK-074-4)

Document for each changed component:

- Old type definition (for reference)
- New type import path
- Any behavior changes (expect: none)
- Compatibility notes

---

## 🔄 Implementation Steps

### Phase 1: Preparation (0.5 days)

1. [ ] **Create backup branch**

   ```bash
   git checkout -b task-074-2-refactor-component-types
   ```

2. [ ] **Verify TASK-074-1 complete**
   - Check `src/types/` directory exists
   - Verify all primitive types exported
   - Test imports work

3. [ ] **Create refactoring script** (optional)
   ```bash
   # packages/@dsai/react/scripts/refactor-types.js
   # Automate repetitive type replacements
   ```

### Phase 2: Refactor SemanticColorVariant (1 day)

4. [ ] **Refactor Alert** (15 min)
   - Import SemanticColorVariant
   - Change AlertVariant definition
   - Run tests: `pnpm nx test Alert`

5. [ ] **Refactor Badge** (15 min)
   - Import SemanticColorVariant
   - Change BadgeVariant definition
   - Run tests

6. [ ] **Refactor Progress** (15 min)
   - Import SemanticColorVariant
   - Change ProgressVariant definition
   - Also change ProgressSize (ComponentSize)
   - Run tests

7. [ ] **Refactor Spinner** (20 min)
   - Import SemanticColorVariant + ExtendedSize
   - Change SpinnerVariant definition
   - Change SpinnerSize definition
   - Run tests

8. [ ] **Refactor ListGroup** (15 min)
   - Import SemanticColorVariant
   - Change ListGroupItemVariant definition
   - Run tests

9. [ ] **Refactor Table** (20 min)
   - Import SemanticColorVariant + ComponentSize
   - Change TableColor definition
   - Change TableSize definition
   - Run tests

10. [ ] **Refactor Card** (15 min)
    - Import SemanticColorVariant
    - Change CardColor definition
    - Run tests

11. [ ] **Refactor Button** (30 min)
    - Import SemanticColorVariant + ComponentSize + SafeHTMLAttributes
    - Change ButtonVariant (use template literal for outline variants)
    - Change ButtonSize definition
    - Extend SafeHTMLAttributes for button-specific props
    - Run tests (critical - Button heavily used)

### Phase 3: Refactor ComponentSize (0.5 days)

12. [ ] **Refactor Input** (15 min)
    - Import ComponentSize
    - Change InputSize definition
    - Run tests

13. [ ] **Refactor Select** (15 min)
    - Import ComponentSize
    - Change SelectSize definition
    - Run tests

14. [ ] **Refactor Switch** (15 min)
    - Import ComponentSize
    - Change SwitchSize definition
    - Run tests

15. [ ] **Refactor Pagination** (15 min)
    - Import ComponentSize
    - Change PaginationSize definition
    - Run tests

### Phase 4: Refactor ExtendedSize & Others (0.5 days)

16. [ ] **Refactor Avatar** (15 min)
    - Import ExtendedSize
    - Change AvatarSize definition
    - Run tests

17. [ ] **Refactor Modal** (20 min)
    - Import ComponentSize
    - Change ModalSize (mixed approach)
    - Run tests

18. [ ] **Refactor Toast** (15 min)
    - Import FeedbackVariant
    - Change ToastVariant definition
    - Run tests

### Phase 5: Refactor SafeHTMLAttributes (2 days)

19. [ ] **Refactor Accordion** (20 min)
    - Import SafeHTMLAttributes
    - Replace SafeAccordionHTMLAttributes
    - Run tests

20. [ ] **Refactor Alert** (40 min) - **2 interfaces**
    - Import SafeHTMLAttributes
    - Replace SafeAlertHTMLAttributes
    - Replace SafeAlertLinkHTMLAttributes
    - Run tests

21. [ ] **Refactor Avatar** (20 min)
    - Import SafeHTMLAttributes
    - Replace SafeAvatarHTMLAttributes
    - Run tests

22. [ ] **Refactor Badge** (20 min)
    - Import SafeHTMLAttributes
    - Replace SafeBadgeHTMLAttributes
    - Run tests

23. [ ] **Refactor Button SafeHTMLAttributes** (30 min)
    - Already doing Button for other types
    - Update SafeHTMLAttributes interface
    - Run tests (critical - Button heavily used)

24. [ ] **Refactor Carousel** (20 min)
    - Import SafeHTMLAttributes
    - Replace SafeCarouselHTMLAttributes
    - Run tests

25. [ ] **Refactor Dropdown** (20 min)
    - Import SafeHTMLAttributes
    - Replace SafeDropdownHTMLAttributes
    - Run tests

26. [ ] **Refactor Modal** (1 hour) - **4 interfaces**
    - Import SafeHTMLAttributes
    - Replace SafeModalHTMLAttributes
    - Replace SafeModalHeaderHTMLAttributes
    - Replace SafeModalBodyHTMLAttributes
    - Replace SafeModalFooterHTMLAttributes
    - Run tests (critical - Modal heavily used)

27. [ ] **Refactor Navbar** (20 min)
    - Import SafeHTMLAttributes
    - Replace SafeNavbarHTMLAttributes
    - Run tests

28. [ ] **Refactor Popover** (20 min)
    - Import SafeHTMLAttributes
    - Replace SafePopoverHTMLAttributes
    - Run tests

29. [ ] **Refactor Scrollspy** (20 min)
    - Import SafeHTMLAttributes
    - Replace SafeScrollspyHTMLAttributes
    - Run tests

30. [ ] **Refactor Toast** (20 min)
    - Import SafeHTMLAttributes
    - Replace SafeToastHTMLAttributes
    - Run tests

31. [ ] **Refactor Tooltip** (20 min)
    - Import SafeHTMLAttributes
    - Replace SafeTooltipHTMLAttributes
    - Run tests

32. [ ] **Refactor Typography** (30 min)
    - Import SafeHTMLAttributes
    - Replace TypographySafeHTMLAttributes
    - Update all Typography component props
    - Run tests (critical - Typography heavily used)

### Phase 6: Verification (1 day)

33. [ ] **Run full test suite**

    ```bash
    pnpm nx test @dsai/react
    pnpm nx build @dsai/react
    ```

34. [ ] **Type testing**
    - Run type tests: `pnpm tsd` or vitest type tests
    - Verify no type errors
    - Test backward compatibility

35. [ ] **Manual testing**
    - Start Storybook
    - Test each refactored component
    - Verify all variants/sizes work
    - Check IntelliSense shows new type origins

36. [ ] **Performance check**
    - Measure TypeScript compilation time (should be same or faster)
    - Verify bundle size unchanged

37. [ ] **Documentation**
    - Document all changes in CHANGELOG
    - Note any edge cases discovered
    - List breaking changes (expect: none)

### Phase 7: FSM Types Refactoring (OPTIONAL - Future Enhancement)

**Note:** This phase is optional and can be done in a follow-up task. The centralized FSM types (FSMStateBase, FSMEventBase, FSMReducer) are created in TASK-074-1, but refactoring components to use them is not required for the main task completion.

**Components using FSM patterns (8 components):**

- Carousel (CarouselFSMState, CarouselFSMEvent)
- CheckboxGroup (CheckboxGroupFSMState - imported from .fsm file)
- Navbar (NavbarFSMState, NavbarFSMEvent)
- Popover (PopoverFSMState, PopoverFSMEvent)
- Scrollspy (ScrollspyFSMState, ScrollspyFSMEvent)
- Table (TableFSMState)
- Toast (ToastFSMState, ToastFSMEvent)
- Tooltip (TooltipFSMState, TooltipFSMEvent)

38. [ ] **OPTIONAL: Refactor FSM components** (2-3 days if pursued)
    - Update each component to extend FSMStateBase
    - Ensure FSMEvent types follow centralized pattern
    - Verify reducers match FSMReducer<State, Event> signature
    - Run tests for each component

**Benefits if pursued:**

- Consistent FSM pattern across all components
- Easier to understand state machines
- Better IntelliSense for FSM patterns
- Foundation for future FSM utilities

**Why optional:**

- Not code duplication (each FSM has different states/events)
- Mainly structural consistency, not eliminating duplicates
- Can be done incrementally in future
- Main task already delivers significant value without this

---

## 📝 Notes

### Components with Extended Patterns (Not Duplicates)

These components have types that extend centralized primitives but aren't duplicates to refactor:

1. **Typography.TextColor** - Extends SemanticColorVariant with additional typography-specific colors
   - Has all 8 semantic colors (primary, secondary, success, danger, warning, info, light, dark)
   - PLUS typography-specific: body, body-secondary, body-tertiary, muted, white, black
   - **Decision:** Keep as component-specific type, it's an intentional extension

2. **Modal.ModalSize** - Extends ComponentSize with modal-specific sizes
   - Has: sm, md, lg (ComponentSize) PLUS: xl, fullscreen (modal-specific)
   - **Decision:** Keep as component-specific type, useful for modal-specific needs

3. **Spinner.SpinnerSize** - Uses ExtendedSize without '2xl'
   - Has: xs, sm, md, lg, xl (missing '2xl' from ExtendedSize)
   - **Decision:** Could refactor to `Exclude<ExtendedSize, '2xl'>` for consistency (included in Phase 4)

4. **Avatar.AvatarSize** - Uses full ExtendedSize
   - Has: xs, sm, md, lg, xl, 2xl (exact match to ExtendedSize)
   - **Decision:** Should refactor to `type AvatarSize = ExtendedSize;` (included in Phase 4)

### Component-Specific Variants (Keep Separate)

These variants are unique to their components and should NOT be centralized:

- **Card.CardVariant** = 'elevated' | 'outlined' | 'ghost'
- **Table.TableVariant** = 'default' | 'striped' | 'bordered' | 'borderless'
- **ListGroup.ListGroupVariant** = 'default' | 'flush' | 'numbered'
- **Tabs.TabsVariant** = 'underline' | 'pills' | 'tabs'
- **Navbar.NavbarVariant** = 'light' | 'dark' (theme variant, not semantic color)
- **Scrollspy.ScrollspyVariant** = 'pills' | 'underline' | 'minimal'

### Best Practices

1. **One component at a time**: Refactor, test, commit
2. **Preserve exports**: Keep export names identical for backward compatibility
3. **Type-only imports**: Always use `import type { ... }`
4. **Test immediately**: Run component tests after each refactor
5. **Commit frequently**: One commit per component or logical group

### Edge Cases to Watch

1. **Button outline variants**: Use template literal type

   ```typescript
   type ButtonVariant = SemanticColorVariant | `outline-${SemanticColorVariant}` | 'link';
   ```

2. **Spinner size**: Doesn't have '2xl', use Exclude

   ```typescript
   type SpinnerSize = Exclude<ExtendedSize, '2xl'>;
   ```

3. **Modal size**: Mix of standard + custom

   ```typescript
   type ModalSize = ComponentSize | 'xl' | 'fullscreen';
   ```

4. **SafeHTMLAttributes**: Extend with element-specific props
   ```typescript
   interface ButtonSafeHTMLAttributes extends SafeHTMLAttributes<HTMLButtonElement> {
     form?: string; // button-specific
   }
   ```

### Performance Impact

- **Type checking**: Slightly faster (fewer type definitions to process)
- **Bundle size**: Zero impact (types compile away)
- **Runtime**: Zero impact (types don't exist at runtime)
- **IntelliSense**: May be slightly faster (shared type cache)

### Security Considerations

- **SafeHTMLAttributes refactor**: MUST maintain security whitelist
- **No event handlers**: onClick, etc. still excluded
- **Test XSS prevention**: Verify dangerous props still blocked

### Common Pitfalls to Avoid

1. ❌ **Don't change export names**

   ```typescript
   // BAD: Breaks imports
   export type ButtonVariant = SemanticColorVariant;

   // GOOD: Preserves compatibility
   import type { SemanticColorVariant } from '../../types';
   export type ButtonVariant = SemanticColorVariant;
   ```

2. ❌ **Don't modify component implementations**
   - Only change `.types.ts` files
   - `.tsx` files should not need changes

3. ❌ **Don't add runtime imports**

   ```typescript
   // BAD: Runtime import
   import { SemanticColorVariant } from '../../types';

   // GOOD: Type-only import
   import type { SemanticColorVariant } from '../../types';
   ```

4. ❌ **Don't skip tests**
   - Test after each component refactor
   - Don't batch without testing

---

## ✅ Definition of Done

- [ ] All 23 component type files refactored (~30+ type interfaces total)
- [ ] All component exports use centralized primitives where applicable
- [ ] Zero breaking changes to public APIs
- [ ] All component tests pass (100% pass rate)
- [ ] Type tests verify backward compatibility
- [ ] TypeScript strict mode passes
- [ ] Bundle size unchanged
- [ ] Storybook manual testing complete
- [ ] No TypeScript errors in VSCode
- [ ] IntelliSense shows correct type origins
- [ ] Performance metrics stable
- [ ] Security tests pass (SafeHTMLAttributes)
- [ ] Changes documented for TASK-074-4
- [ ] Code reviewed and approved
- [ ] Ready for main export updates (TASK-074-3)
