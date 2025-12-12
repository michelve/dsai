# TASK-78: DSAi Types Module Audit

> **Status**: ✅ Complete  
> **Date**: 2025-01-21  
> **Module**: `packages/@dsai/react/src/types/`  
> **Files Audited**: accessibility.ts, fsm.ts, polymorphic.ts, primitives.ts, responsive.ts, index.ts

---

## 1. What this module actually does

The `types/` module provides the **core type primitives** for the DSAi design system. It establishes a single source of truth for:

### Files & Responsibilities

| File                                                                      | Purpose                                        | Type-Only | Runtime |
| ------------------------------------------------------------------------- | ---------------------------------------------- | --------- | ------- |
| [accessibility.ts](../../packages/@dsai/react/src/types/accessibility.ts) | Safe HTML attributes whitelist + ARIA props    | ✅        | ❌      |
| [fsm.ts](../../packages/@dsai/react/src/types/fsm.ts)                     | Finite State Machine type contracts            | ✅        | ❌      |
| [polymorphic.ts](../../packages/@dsai/react/src/types/polymorphic.ts)     | Polymorphic "as" prop pattern                  | ✅        | ❌      |
| [primitives.ts](../../packages/@dsai/react/src/types/primitives.ts)       | Design system tokens (colors, sizes, variants) | ✅        | ❌      |
| [responsive.ts](../../packages/@dsai/react/src/types/responsive.ts)       | Responsive/breakpoint-aware types + utilities  | ❌        | ✅      |
| [index.ts](../../packages/@dsai/react/src/types/index.ts)                 | Barrel exports                                 | ✅        | ✅      |

### Key Exports

**Types:**

- `SafeHTMLAttributes<T>`, `ARIAProps` - Security-first HTML attribute types
- `FSMStateBase`, `FSMEventBase`, `FSMReducer<S, E>`, `FSMConfig<S, E>`, `VisualStateBase` - FSM contracts
- `PolymorphicComponentProps<C, Props>`, `PolymorphicProps<C, Props>`, `PolymorphicRef<C>` - Polymorphic patterns
- `SemanticColorVariant`, `ComponentSize`, `ExtendedSize`, `FeedbackVariant`, `Alignment`, `Orientation` - Design tokens
- `Breakpoint`, `ResponsiveValue<T>`, `ResponsiveProp<T>` - Responsive types

**Runtime:**

- `getResponsiveValue<T>(value, breakpoint)` - Extract value for breakpoint
- `isResponsiveValue<T>(value)` - Type guard for responsive objects

---

## 2. Public API Surface & Type Quality

### 2.1 accessibility.ts (108 lines)

**Exports:**

```typescript
export type SafeHTMLAttributes<T extends HTMLElement> = {
  className?: string;
  style?: CSSProperties;
  id?: string;
  tabIndex?: number;
  role?: string;
  [key: `data-${string}`]: string | boolean | number | undefined;
  // + 15 ARIA attributes
};

export type ARIAProps = {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  // + 13 more ARIA props
};
```

**Quality Assessment:**
| Criterion | Status | Notes |
|-----------|--------|-------|
| Proper generics | ✅ | `<T extends HTMLElement>` correctly constrains |
| TypeScript 5.x compatible | ✅ | Template literal types work |
| JSDoc documentation | ✅ | Comprehensive with @example blocks |
| No `any` types | ✅ | All properties typed |
| Readonly where applicable | ⚠️ | Could add `readonly` to ARIA props |

**Security Value:**
The `SafeHTMLAttributes` type acts as a **security allowlist**, preventing dangerous attributes like `onLoad`, `onError`, `formAction`, etc. from passing through. This is intentional and well-documented.

---

### 2.2 fsm.ts (133 lines)

**Exports:**

```typescript
export type FSMStateBase = { visualState: string };
export type FSMEventBase = { type: string };
export type FSMReducer<S extends FSMStateBase, E extends FSMEventBase> = (state: S, event: E) => S;
export type FSMConfig<S extends FSMStateBase, E extends FSMEventBase> = {
  initialState: S | ((props: unknown) => S);
  reducer: FSMReducer<S, E>;
};
export type VisualStateBase =
  | 'idle'
  | 'hover'
  | 'focus'
  | 'active'
  | 'disabled'
  | 'error'
  | 'loading'
  | 'selected';
```

**Quality Assessment:**
| Criterion | Status | Notes |
|-----------|--------|-------|
| Proper generics | ✅ | Constrained with base types |
| Extensible | ✅ | `extends` pattern allows custom states |
| JSDoc documentation | ✅ | Each type documented with @example |
| Used across codebase | ✅ | Toast, Popover, Accordion, CardList, etc. |

---

### 2.3 polymorphic.ts (82 lines)

**Exports:**

```typescript
export type PolymorphicRef<C extends React.ElementType> = React.ComponentPropsWithRef<C>['ref'];

export type PolymorphicProps<C extends React.ElementType, Props = object> = Props & { as?: C };

export type PolymorphicComponentProps<
  C extends React.ElementType,
  Props = object,
> = PolymorphicProps<C, Props> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof PolymorphicProps<C, Props>>;
```

**Quality Assessment:**
| Criterion | Status | Notes |
|-----------|--------|-------|
| React-specific | ✅ | Correct use of ElementType |
| Proper inference | ✅ | `as` prop correctly distributes |
| Inspired by MUI | ✅ | OverridableComponent pattern |
| JSDoc documentation | ✅ | Clear examples |

---

### 2.4 primitives.ts (84 lines)

**Exports:**

```typescript
export type SemanticColorVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

export type ComponentSize = 'sm' | 'md' | 'lg';
export type ExtendedSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type FeedbackVariant = 'success' | 'danger' | 'warning' | 'info';
export type Alignment = 'start' | 'center' | 'end';
export type Orientation = 'horizontal' | 'vertical';
```

**Quality Assessment:**
| Criterion | Status | Notes |
|-----------|--------|-------|
| Bootstrap 5 aligned | ✅ | Color variants match Bootstrap |
| Consistent naming | ✅ | `Variant`, `Size` suffix pattern |
| JSDoc documentation | ✅ | Usage examples provided |
| No numeric/magic values | ✅ | All semantic strings |

---

### 2.5 responsive.ts (132 lines)

**Exports:**

```typescript
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;
export type ResponsiveProp<T> = T | { [K in Breakpoint]?: T };

// Runtime functions
export function getResponsiveValue<T>(
  value: ResponsiveValue<T>,
  breakpoint: Breakpoint
): T | undefined;

export function isResponsiveValue<T>(value: unknown): value is Partial<Record<Breakpoint, T>>;
```

**Quality Assessment:**
| Criterion | Status | Notes |
|-----------|--------|-------|
| Bootstrap 5 breakpoints | ✅ | xs/sm/md/lg/xl/xxl |
| Runtime type guard | ✅ | `isResponsiveValue` |
| No runtime overhead | ⚠️ | Has runtime code in types module |
| JSDoc documentation | ✅ | Comprehensive |

**⚠️ Architectural Note:**
The `getResponsiveValue` and `isResponsiveValue` functions are **runtime code** in a types module. Consider relocating to `utils/responsive/` for clearer separation.

---

### 2.6 index.ts (67 lines)

**Exports:**

- Uses `export type { ... }` for type-only exports ✅
- Re-exports runtime functions from responsive.ts ✅

**🔴 CRITICAL ISSUE: Duplicate Export**

```typescript
// In src/index.ts (main package)
export type { Breakpoint } from './types'; // Line 338
// ...
export type { Breakpoint } from './hooks'; // Line 398 (duplicate!)
```

**TypeScript Error:**

```
src/index.ts(338,3): error TS2300: Duplicate identifier 'Breakpoint'.
src/index.ts(398,15): error TS2300: Duplicate identifier 'Breakpoint'.
```

**Root Cause:**

- `types/responsive.ts` exports `Breakpoint`
- `hooks/useMediaQuery/breakpoints.ts` exports `Breakpoint`
- Both are re-exported in `src/index.ts`

---

## 3. Accessibility Semantics

### SafeHTMLAttributes Coverage

The `SafeHTMLAttributes<T>` type correctly includes WCAG 2.2 AA required attributes:

| ARIA Attribute     | Included | Purpose                   |
| ------------------ | -------- | ------------------------- |
| `aria-label`       | ✅       | Accessible name           |
| `aria-labelledby`  | ✅       | Accessible name reference |
| `aria-describedby` | ✅       | Accessible description    |
| `aria-hidden`      | ✅       | Hide from AT              |
| `aria-live`        | ✅       | Live regions              |
| `aria-atomic`      | ✅       | Live region atomic        |
| `aria-busy`        | ✅       | Loading state             |
| `aria-current`     | ✅       | Current item              |
| `aria-disabled`    | ✅       | Disabled state            |
| `aria-expanded`    | ✅       | Expandable state          |
| `aria-haspopup`    | ✅       | Popup indicator           |
| `aria-pressed`     | ✅       | Toggle state              |
| `aria-selected`    | ✅       | Selection state           |
| `aria-controls`    | ✅       | Controls relationship     |
| `aria-owns`        | ✅       | Ownership relationship    |

**Missing (could add):**

- `aria-invalid` - Form validation state
- `aria-required` - Required field indicator
- `aria-errormessage` - Error message reference
- `aria-valuemin/max/now/text` - Slider/progress values

---

## 4. Security / XSS / Safety

### SafeHTMLAttributes Allowlist Approach

**✅ SECURE BY DESIGN**

The `SafeHTMLAttributes` type uses an **allowlist pattern**, meaning only explicitly listed attributes can be forwarded to DOM elements. This prevents:

| Attack Vector          | Blocked | How                                                         |
| ---------------------- | ------- | ----------------------------------------------------------- |
| XSS via event handlers | ✅      | `onLoad`, `onError`, etc. not in allowlist                  |
| Form hijacking         | ✅      | `formAction`, `formMethod` not in allowlist                 |
| URL injection          | ⚠️      | `href` not in SafeHTMLAttributes (handled in Card/CardLink) |
| Script injection       | ✅      | No `dangerouslySetInnerHTML`                                |

**Components Using SafeHTMLAttributes:**

- Toast (verified extends SafeHTMLAttributes)
- Card components (use CardLink security for hrefs)

---

## 5. State Management & FSM Types

### FSM Type Contracts

The `fsm.ts` file provides **contracts** for FSM implementations:

```typescript
// Contract: State must have visualState
interface FSMStateBase {
  visualState: string;
}

// Contract: Event must have type
interface FSMEventBase {
  type: string;
}

// Contract: Reducer is pure
type FSMReducer<S, E> = (state: S, event: E) => S;
```

### Components Using FSM Types

| Component     | FSM State                               | Verified |
| ------------- | --------------------------------------- | -------- |
| Toast         | ToastState extends FSMStateBase         | ✅       |
| Popover       | PopoverState extends FSMStateBase       | ✅       |
| Accordion     | AccordionState extends FSMStateBase     | ✅       |
| CardList      | CardListState extends FSMStateBase      | ✅       |
| Carousel      | CarouselState extends FSMStateBase      | ✅       |
| TabsPro       | TabsProState extends FSMStateBase       | ✅       |
| Navbar        | NavbarState extends FSMStateBase        | ✅       |
| CheckboxGroup | CheckboxGroupState extends FSMStateBase | ✅       |
| Scrollspy     | ScrollspyState extends FSMStateBase     | ✅       |

**FSM Type Quality: ✅ Justified and well-designed**

---

## 6. Performance & DX

### Type-Level Performance

| Metric           | Status     | Notes                             |
| ---------------- | ---------- | --------------------------------- |
| Bundle impact    | ✅ Minimal | Types tree-shake away             |
| TypeScript perf  | ✅ Good    | No recursive/complex conditionals |
| IDE IntelliSense | ✅ Fast    | Simple union types                |

### Developer Experience

| Aspect               | Status | Notes                                  |
| -------------------- | ------ | -------------------------------------- |
| JSDoc on all exports | ✅     | Every type documented                  |
| @example blocks      | ✅     | Usage examples provided                |
| Consistent naming    | ✅     | `*Variant`, `*Size`, `*Props` patterns |
| Import ergonomics    | ✅     | Single barrel import                   |

---

## 7. Docs / README / Figma Mapping

### Documentation Status

| File             | README Coverage | Examples |
| ---------------- | --------------- | -------- |
| accessibility.ts | ✅ JSDoc inline | ✅       |
| fsm.ts           | ✅ JSDoc inline | ✅       |
| polymorphic.ts   | ✅ JSDoc inline | ✅       |
| primitives.ts    | ✅ JSDoc inline | ✅       |
| responsive.ts    | ✅ JSDoc inline | ✅       |

**No standalone README.md** exists for the types module. This is acceptable given comprehensive inline documentation.

### Figma Mapping

Types map to Figma design tokens:

- `SemanticColorVariant` → Figma color styles
- `ComponentSize` → Figma size variants
- `Breakpoint` → Figma responsive breakpoints

---

## 8. Testing & Validation

### ❌ NO TYPE TESTS EXIST

**Gap Identified:**

The types module has **no dedicated type tests**. This means:

- Type errors could be introduced without CI catching them
- Complex generics aren't validated
- Edge cases aren't tested

**Recommended Test Patterns:**

1. **Using `tsd`:**

```typescript
import { expectType, expectError } from 'tsd';
import type { SafeHTMLAttributes } from './accessibility';

// Positive test
expectType<SafeHTMLAttributes<HTMLButtonElement>>({
  className: 'btn',
  'aria-label': 'Submit',
});

// Negative test (should error)
expectError<SafeHTMLAttributes<HTMLButtonElement>>({
  onLoad: () => {}, // Not in allowlist
});
```

2. **Using `@ts-expect-error`:**

```typescript
// @ts-expect-error - onLoad should not be assignable
const bad: SafeHTMLAttributes<HTMLDivElement> = { onLoad: () => {} };
```

3. **Using `vitest` `expectTypeOf`:**

```typescript
import { expectTypeOf } from 'vitest';

expectTypeOf<ResponsiveValue<number>>().toMatchTypeOf<
  number | Partial<Record<Breakpoint, number>>
>();
```

---

## 9. Gaps, Risks, and Concrete Changes

### 🔴 Critical

| Issue                         | Impact      | Fix                                                                 |
| ----------------------------- | ----------- | ------------------------------------------------------------------- |
| Duplicate `Breakpoint` export | Build fails | Remove duplicate from main index.ts or consolidate to single source |

**Fix for Duplicate Export:**

```typescript
// In src/index.ts - REMOVE the duplicate
// Keep only ONE of these:

// Option A: Export from types (recommended - types module is source of truth)
export type { Breakpoint } from './types';
// Remove: export type { Breakpoint } from './hooks';

// Option B: Have hooks re-export from types
// In hooks/useMediaQuery/breakpoints.ts:
export type { Breakpoint } from '../../types';
```

### 🟡 Medium

| Issue                                    | Impact             | Fix                                                                   |
| ---------------------------------------- | ------------------ | --------------------------------------------------------------------- |
| Runtime code in types module             | Architecture smell | Move `getResponsiveValue`, `isResponsiveValue` to `utils/responsive/` |
| No type tests                            | Missing coverage   | Add `types.test.ts` with `@ts-expect-error` patterns                  |
| Missing ARIA props in SafeHTMLAttributes | A11y gaps          | Add `aria-invalid`, `aria-required`, `aria-errormessage`              |

### 🟢 Low

| Issue                            | Impact      | Notes                                               |
| -------------------------------- | ----------- | --------------------------------------------------- |
| No README.md for types           | DX          | JSDoc is sufficient, but README could aid discovery |
| `readonly` missing on ARIA props | Type safety | Minor improvement                                   |

---

## 10. Recommendations Summary

### Immediate Actions (P0)

1. **Fix duplicate Breakpoint export** in `src/index.ts`:

   ```typescript
   // Remove line 398:
   // export type { Breakpoint, UseMediaQueryOptions } from './hooks';
   // Change to:
   export type { UseMediaQueryOptions } from './hooks';
   ```

2. **Add type test file** `src/types/types.test.ts`:

   ```typescript
   // @ts-expect-error - SafeHTMLAttributes should not allow onLoad
   const bad: SafeHTMLAttributes<HTMLDivElement> = { onLoad: () => {} };

   // Should compile - valid attributes
   const good: SafeHTMLAttributes<HTMLDivElement> = {
     className: 'test',
     'aria-label': 'test',
     'data-testid': 'test',
   };
   ```

### Short-term Actions (P1)

3. **Relocate runtime functions** from `responsive.ts`:
   - Move `getResponsiveValue`, `isResponsiveValue` to `utils/responsive/`
   - Keep types in `types/responsive.ts`

4. **Expand SafeHTMLAttributes** with missing ARIA:
   ```typescript
   'aria-invalid'?: boolean | 'grammar' | 'spelling';
   'aria-required'?: boolean;
   'aria-errormessage'?: string;
   ```

### Long-term Actions (P2)

5. **Add Toast type fix**:
   ```
   src/components/Toast/Toast.types.ts(164,18): error TS2430:
   Interface 'ToastProps' incorrectly extends interface 'SafeHTMLAttributes<HTMLDivElement>'.
   Types of property 'title' are incompatible.
   ```
   Fix by making ToastProps use intersection instead of extension, or rename `title` prop.

---

## 11. TypeScript Errors Summary

The `tsc --noEmit` check revealed errors across the codebase. Types-module-specific:

| File               | Error                                             | Severity    |
| ------------------ | ------------------------------------------------- | ----------- |
| src/index.ts:338   | Duplicate identifier 'Breakpoint'                 | 🔴 Critical |
| src/index.ts:398   | Duplicate identifier 'Breakpoint'                 | 🔴 Critical |
| Toast.types.ts:164 | ToastProps incorrectly extends SafeHTMLAttributes | 🟡 Medium   |

Other errors (not types-specific, but discovered during audit):

- Missing `CSSProperties` imports in 10+ component files
- `Object.hasOwn` requires ES2022 target
- `process.env.NODE_ENV` index access issues

---

## 12. FSM Decision

**FSM Types: ✅ Justified and correctly designed**

The FSM type contracts in `fsm.ts` provide:

- Base interfaces that all FSM implementations must extend
- Generic reducer types that enforce purity
- Clear separation between state shape and event types
- `VisualStateBase` union for common visual states

These types are used by 10+ components and provide valuable compile-time guarantees.

---

## Audit Checklist

| Category                | Status | Notes                         |
| ----------------------- | ------ | ----------------------------- |
| Public API Surface      | ✅     | Well-organized exports        |
| Type Safety (TS 5.x)    | ✅     | No `any`, proper generics     |
| React/JSX Compatibility | ✅     | ElementType, CSSProperties    |
| Safety/Security         | ✅     | Allowlist pattern             |
| A11y Semantics          | ✅     | ARIA props included           |
| Testing                 | ❌     | No type tests                 |
| Documentation           | ✅     | JSDoc on all exports          |
| Build/Bundle            | 🔴     | Duplicate export breaks build |

---

**Overall Assessment: 🟡 NEEDS FIXES**

The types module is well-designed but has a **critical duplicate export issue** that breaks TypeScript compilation. After fixing that and adding type tests, it will be enterprise-ready.
