# Avatar Component Audit & Enhancement Design

**Date:** 2026-03-21
**Scope:** Full audit, refactor, competitive parity, compound sub-components
**Components:** `Avatar`, `AvatarGroup`

---

## 1. Internal Refactoring & Bug Fixes

### 1.1 Lookup Function Cleanup

Replace all verbose if-chain lookup functions with a single safe generic helper using `Reflect.get()` per CLAUDE.md security rules. Block prototype pollution keys (`__proto__`, `constructor`, `prototype`).

**Helper signature:**

```typescript
const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function safeLookup<T>(map: Readonly<Record<string, T>>, key: string, fallback: T): T {
  if (BLOCKED_KEYS.has(key)) return fallback;
  const value = Reflect.get(map, key) as T | undefined;
  return value !== undefined ? value : fallback;
}
```

**Functions to consolidate:**
- `getSizeValue`, `getFontSize`, `getStatusSize`, `getNumericSize` — all avatar size map lookups
- `getToneClasses`, `getStatusLabel`, `getStatusColor` — status/tone map lookups
- `getToneFromName` — replace index-to-tone if-chain with direct array index from `AVATAR_HASH_COLORS`
- `resolveAvatarSize`, `resolveOverlap`, `resolveInlineGap` in AvatarGroup — deduplicate with shared helper

### 1.2 Accessibility Fixes

- **Space key activation:** Add Space key handling for interactive mode using inline `e.key === ' '` check (consistent with existing ListGroup/Select patterns). Prevent default scroll on Space.
- **Grammar fix:** `"1 users"` → `"1 user"` in AvatarGroup aria-label (pluralize correctly).
- **Semantic element:** Change AvatarGroup from `<fieldset>` + `<legend>` to `<div role="group">` + `<span className="visually-hidden">` for label text. **Note:** This changes the forwarded ref type from `HTMLFieldSetElement` to `HTMLDivElement`.

### 1.3 Cleanup

- Reconcile `xxl` size: keep it, add to stories and argTypes so it's documented.
- Remove duplicate `resolveAvatarSize` in AvatarGroup — reuse shared safe lookup helper.

---

## 2. New Features — Avatar Component

### 2.1 `delayMs` Prop

```typescript
delayMs?: number;
```

Delays rendering fallback content to prevent flash when images load quickly. When set, renders nothing (transparent) for the specified milliseconds before revealing fallback. Once the image loads, it shows immediately regardless of timer.

**Precedence rule:** When both the flat `delayMs` prop and an `<Avatar.Fallback delayMs={...}>` compound child are provided, the compound child's `delayMs` wins (per-slot override principle — see section 2.4).

### 2.2 `onLoadingStatusChange` Callback

```typescript
export type AvatarImageStatus = 'idle' | 'loading' | 'loaded' | 'error';

onLoadingStatusChange?: (status: AvatarImageStatus) => void;
```

Fires on every image state transition, giving consumers granular control over loading UX. `AvatarImageStatus` must be exported from `Avatar.types.ts` and re-exported from `index.ts`.

### 2.3 Image Security Attributes

```typescript
referrerPolicy?: React.HTMLAttributeReferrerPolicy;
crossOrigin?: 'anonymous' | 'use-credentials' | '';
```

Passed through to the internal `<img>` element. Enterprise use case: controlling referrer headers and CORS for avatar images loaded from external CDNs.

### 2.4 Compound Sub-Components

Optional advanced composition API. The flat-props API continues to work unchanged.

**Override rule: per-slot.** Each compound child overrides only its corresponding flat prop slot. For example, `<Avatar src="/a.jpg" status="online"><Avatar.Image src="/b.jpg" /></Avatar>` uses the compound Image (src="/b.jpg") but still uses the flat `status="online"` prop since no `<Avatar.Status>` child is present.

**Attachment pattern:** Use `Object.assign()` to attach sub-components to `Avatar` (matching the Accordion pattern in this codebase). Each sub-component uses the `memo(forwardRef(function Name(...)))` pattern with explicit `displayName` set (e.g., `'Avatar.Image'`). The `displayName` is set explicitly as a string literal, so it survives minification.

**Context:** An `AvatarContext` (via `React.createContext`) is used internally to pass avatar state (size, shape, image loading status, tone) from the root Avatar to compound children. This follows the Accordion pattern.

#### Avatar.Image

Custom image element override. Primary use case: rendering a custom image component (e.g., Next.js `Image`) instead of the default `<img>`.

```typescript
interface AvatarImageProps {
  /** Image source URL */
  src?: string;
  /** Alt text */
  alt?: string;
  /** Source set for responsive images */
  srcSet?: string;
  /** Sizes for responsive images */
  sizes?: string;
  /** Image loading strategy */
  loading?: 'eager' | 'lazy';
  /** Referrer policy */
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  /** Cross-origin setting */
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  /** Custom image element (e.g., Next.js Image) */
  children?: ReactNode;
  /** Error handler */
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  /** Load handler */
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  /** Additional class names */
  className?: string;
  /** Additional styles */
  style?: React.CSSProperties;
}
```

When `children` is provided, it renders the children instead of the internal `<img>`. When only props are provided, it renders `<img>` with those props (equivalent to flat API).

```tsx
// Props-based (same as flat API, but composable)
<Avatar name="John">
  <Avatar.Image src="/john.jpg" alt="John Doe" />
</Avatar>

// Custom element (Next.js Image)
<Avatar name="John">
  <Avatar.Image>
    <NextImage src="/john.jpg" alt="John Doe" width={40} height={40} />
  </Avatar.Image>
</Avatar>
```

#### Avatar.Fallback

Custom fallback content with optional delay.

```typescript
interface AvatarFallbackProps {
  /** Delay before showing fallback (ms) */
  delayMs?: number;
  /** Custom fallback content */
  children?: ReactNode;
  /** Additional class names */
  className?: string;
  /** Additional styles */
  style?: React.CSSProperties;
}
```

```tsx
<Avatar src="/john.jpg">
  <Avatar.Fallback delayMs={300}>
    <CustomSpinner />
  </Avatar.Fallback>
</Avatar>
```

#### Avatar.Badge

Positioned notification badge.

```typescript
interface AvatarBadgeProps {
  /** Badge count (capped at 99+) */
  count?: number;
  /** Show dot instead of count */
  dot?: boolean;
  /** Additional class names */
  className?: string;
  /** Additional styles */
  style?: React.CSSProperties;
}
```

```tsx
<Avatar name="John">
  <Avatar.Badge count={5} />
</Avatar>
```

#### Avatar.Status

Positioned status indicator.

```typescript
interface AvatarStatusProps {
  /** Status value */
  value: AvatarStatus;
  /** Position of indicator */
  position?: AvatarStatusPosition;
  /** Additional class names */
  className?: string;
  /** Additional styles */
  style?: React.CSSProperties;
}
```

```tsx
<Avatar name="John">
  <Avatar.Status value="online" position="bottom-right" />
</Avatar>
```

Note: The prop is named `position` (not `statusPosition`) since the `Avatar.Status` context makes it unambiguous. The flat API retains `statusPosition` for backward compatibility.

---

## 3. New Features — AvatarGroup Component

### 3.1 `total` Prop

```typescript
total?: number;
```

Server-side total count independent of rendered children. When set, overflow chip shows `+(total - visibleCount)` instead of counting child elements. Useful when API returns a total count but only sends a subset of avatar data.

### 3.2 `renderSurplus` Prop

```typescript
renderSurplus?: (surplusCount: number) => ReactNode;
```

Replaces the default "+N" chip with custom content. Consumer receives the surplus count and renders their own element (e.g., dropdown trigger, popover, tooltip).

### 3.3 `onOverflowClick` Prop

```typescript
onOverflowClick?: (event: React.MouseEvent) => void;
```

Fires when the default overflow chip is clicked. Ignored at runtime when `renderSurplus` is used (consumer handles their own events). A `console.warn` is emitted in development mode if both `renderSurplus` and `onOverflowClick` are provided simultaneously, to alert the developer that `onOverflowClick` will have no effect.

### 3.4 `stackingOrder` Prop

```typescript
stackingOrder?: 'firstOnTop' | 'lastOnTop';
```

Default: `'lastOnTop'` (current behavior).

**Implementation:**
- `'lastOnTop'`: Uses `flex-row-reverse` so the last child in source order appears at the front/left of the stack with the highest z-index. This is the current behavior.
- `'firstOnTop'`: Uses normal `flex-direction: row` (no reverse). The first child in source order gets the highest z-index and appears at the front/left of the stack. Margin overlap is applied as negative `marginRight` instead of negative `marginLeft`.

### 3.5 Semantic Fix

Change `<fieldset>` to `<div role="group">`. Replace `<legend>` with `<span className="visually-hidden">` for the accessible label text. The forwarded ref type changes from `HTMLFieldSetElement` to `HTMLDivElement`.

---

## 4. Stories & Documentation Updates

### 4.1 New Storybook Stories

- **DelayMs:** Show fallback delay behavior with slow-loading images
- **LoadingStatusChange:** Interactive demo logging status transitions
- **Image Security:** Example with `referrerPolicy` and `crossOrigin`
- **Compound Components:** Show `Avatar.Image`, `Avatar.Fallback`, `Avatar.Badge`, `Avatar.Status` usage, including custom image element (Next.js-style)
- **Group Total:** Server-side total count example
- **Group RenderSurplus:** Custom overflow rendering (dropdown trigger example)
- **Group StackingOrder:** First-on-top vs last-on-top comparison
- Document `xxl` size in Sizes story

### 4.2 Updated ArgTypes

Add controls for all new props: `delayMs`, `referrerPolicy`, `crossOrigin`, `stackingOrder`, `total`.

---

## 5. Test Updates (Reasonable Scope)

### 5.1 New Tests

- `delayMs`: verify fallback delay behavior with fake timers
- `onLoadingStatusChange`: verify callback fires with correct statuses
- `referrerPolicy` / `crossOrigin`: verify attrs pass through to `<img>`
- Compound sub-components: basic rendering and composition (per-slot override)
- Group `total`: verify overflow count uses total instead of child count
- Group `renderSurplus`: verify custom render replaces default chip
- Group `onOverflowClick`: verify handler fires on chip click
- Group `stackingOrder`: verify stacking direction changes

### 5.2 Fixed Tests

- Space key activation for interactive mode
- `"1 user"` singular grammar in group aria-label
- `<div role="group">` instead of `<fieldset>`

---

## 6. Competitive Positioning Summary

| Feature | Chakra | MUI | Radix | shadcn | DSAi (after) |
|---|---|---|---|---|---|
| Image fallback chain | Yes | Manual | Yes | Yes | Yes |
| Name-to-initials | Yes | No | No | No | Yes |
| Deterministic color | Yes | No | No | No | Yes |
| Status indicators | No | No | No | No | Yes |
| Badge (count/dot) | No | No | No | Yes | Yes |
| Interactive/selected | No | No | No | No | Yes |
| Loading skeleton | No | No | No | No | Yes |
| `delayMs` | No | No | Yes | Yes | **Yes** |
| `onLoadingStatusChange` | Yes | No | Yes | Yes | **Yes** |
| Image security attrs | Yes | No | No | No | **Yes** |
| Compound sub-components | Yes | No | Yes | Yes | **Yes** |
| Group `total` | No | Yes | No | No | **Yes** |
| Group `renderSurplus` | No | Yes | No | No | **Yes** |
| Group `onOverflowClick` | No | No | No | No | **Yes** |
| Group stacking direction | Yes | No | No | No | **Yes** |
| Polymorphic `as` | No | Yes | asChild | No | Yes |
| WCAG 2.2 AA built-in | Partial | Partial | No | No | Yes |

After this work, DSAi's Avatar will be the most feature-complete Avatar component across all five libraries.

---

## 7. Files to Modify

- `packages/@dsai-io/react/src/components/Avatar/Avatar.tsx` — refactor + new features + compound detection + AvatarContext
- `packages/@dsai-io/react/src/components/Avatar/Avatar.types.ts` — new types/props (`AvatarImageStatus`, compound sub-component props, updated `AvatarGroupProps`)
- `packages/@dsai-io/react/src/components/Avatar/AvatarGroup.tsx` — new group features + semantic fix (ref type → `HTMLDivElement`)
- `packages/@dsai-io/react/src/components/Avatar/index.ts` — export new sub-components, `AvatarImageStatus`, and compound prop types
- `packages/@dsai-io/react/src/components/Avatar/Avatar.test.tsx` — new + fixed tests
- `packages/@dsai-io/storybook/docs/components/Avatar.stories.tsx` — new stories + argTypes
- New files: `AvatarImage.tsx`, `AvatarFallback.tsx`, `AvatarBadge.tsx`, `AvatarStatus.tsx`, `AvatarContext.tsx` — compound sub-components (separate files, following codebase pattern)
