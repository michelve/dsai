# Avatar Component Audit & Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor Avatar internals, fix accessibility bugs, add competitive-parity features (delayMs, onLoadingStatusChange, image security attrs, compound sub-components), enhance AvatarGroup (total, renderSurplus, onOverflowClick, stackingOrder), and update tests/stories.

**Architecture:** Incremental enhancement — keep existing flat-props API, add compound sub-components via Object.assign() + AvatarContext (matching Accordion pattern). Safe lookup helper replaces verbose if-chains. AvatarGroup semantic element changes from fieldset to div[role=group].

**Tech Stack:** React 19, TypeScript strict, Jest 30, React Testing Library 16, jest-axe, Bootstrap 5 classes, tsup build

**Spec:** `docs/superpowers/specs/2026-03-21-avatar-audit-design.md`

---

## File Structure

### Files to Create

| File | Responsibility |
|---|---|
| `packages/@dsai-io/react/src/components/Avatar/AvatarContext.tsx` | React context for sharing avatar state with compound children |
| `packages/@dsai-io/react/src/components/Avatar/AvatarImage.tsx` | `Avatar.Image` compound sub-component |
| `packages/@dsai-io/react/src/components/Avatar/AvatarFallback.tsx` | `Avatar.Fallback` compound sub-component with delayMs |
| `packages/@dsai-io/react/src/components/Avatar/AvatarBadge.tsx` | `Avatar.Badge` compound sub-component |
| `packages/@dsai-io/react/src/components/Avatar/AvatarStatus.tsx` | `Avatar.Status` compound sub-component |
| `packages/@dsai-io/react/src/components/Avatar/avatarUtils.ts` | Shared `safeLookup` helper + extracted utility functions |

### Files to Modify

| File | Changes |
|---|---|
| `packages/@dsai-io/react/src/components/Avatar/Avatar.types.ts` | Add `AvatarImageStatus`, compound sub-component prop interfaces, new Avatar/AvatarGroup props |
| `packages/@dsai-io/react/src/components/Avatar/Avatar.tsx` | Refactor lookups, add delayMs/onLoadingStatusChange/security attrs, integrate compound children detection, Space key fix |
| `packages/@dsai-io/react/src/components/Avatar/AvatarGroup.tsx` | Add total/renderSurplus/onOverflowClick/stackingOrder, fieldset→div semantic fix, grammar fix |
| `packages/@dsai-io/react/src/components/Avatar/index.ts` | Export new sub-components and types |
| `packages/@dsai-io/react/src/components/Avatar/Avatar.test.tsx` | New + fixed tests |
| `packages/@dsai-io/storybook/docs/components/Avatar.stories.tsx` | New stories + updated argTypes |

---

## Task 1: Extract Shared Utility Functions

**Files:**
- Create: `packages/@dsai-io/react/src/components/Avatar/avatarUtils.ts`
- Modify: `packages/@dsai-io/react/src/components/Avatar/Avatar.tsx`
- Modify: `packages/@dsai-io/react/src/components/Avatar/AvatarGroup.tsx`

- [ ] **Step 1: Create avatarUtils.ts with safeLookup helper**

```typescript
// packages/@dsai-io/react/src/components/Avatar/avatarUtils.ts

/**
 * Avatar Utility Functions
 *
 * Shared helpers for Avatar and AvatarGroup components.
 * Uses Reflect.get() for safe dynamic property access per security policy.
 *
 * @packageDocumentation
 */

import {
  AVATAR_FONT_SIZE_MAP,
  AVATAR_HASH_COLORS,
  AVATAR_SIZE_MAP,
  AVATAR_STATUS_COLOR_MAP,
  AVATAR_STATUS_LABEL_MAP,
  AVATAR_STATUS_SIZE_MAP,
  AVATAR_TONE_MAP,
  AVATAR_GROUP_GAP_MAP,
  AVATAR_GROUP_OVERLAP_MAP,
} from './Avatar.types';

import type {
  AvatarGroupSpacing,
  AvatarProps,
  AvatarSize,
  AvatarStatus,
  AvatarTone,
} from './Avatar.types';

// =============================================================================
// Safe Lookup
// =============================================================================

const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Safe property lookup that blocks prototype pollution keys.
 * Uses Reflect.get() per CLAUDE.md security rules.
 */
export function safeLookup<T>(
  map: Readonly<Record<string, T>>,
  key: string,
  fallback: T
): T {
  if (BLOCKED_KEYS.has(key)) {
    return fallback;
  }
  const value = Reflect.get(map, key) as T | undefined;
  return value !== undefined ? value : fallback;
}

// =============================================================================
// Numeric fallbacks for calculations
// =============================================================================

const AVATAR_SIZE_FALLBACK_NUMBERS: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  '2xl': 80,
  xxl: 96,
};

// =============================================================================
// Avatar Lookups
// =============================================================================

export function getNumericSize(size: AvatarSize): number {
  return safeLookup(AVATAR_SIZE_FALLBACK_NUMBERS, size, 40);
}

export function getSizeValue(size: AvatarSize): string {
  return safeLookup(AVATAR_SIZE_MAP, size, AVATAR_SIZE_MAP.md);
}

export function getFontSize(size: AvatarSize): string {
  return safeLookup(AVATAR_FONT_SIZE_MAP, size, AVATAR_FONT_SIZE_MAP.md);
}

export function getStatusSize(size: AvatarSize): string {
  return safeLookup(AVATAR_STATUS_SIZE_MAP, size, AVATAR_STATUS_SIZE_MAP.md);
}

export function getToneClasses(tone: AvatarTone): { bg: string; text: string } {
  return safeLookup(AVATAR_TONE_MAP, tone, AVATAR_TONE_MAP.neutral);
}

export function getStatusLabel(status: AvatarStatus): string {
  return safeLookup(AVATAR_STATUS_LABEL_MAP, status, AVATAR_STATUS_LABEL_MAP.unknown);
}

export function getStatusColor(status: AvatarStatus): string {
  return safeLookup(AVATAR_STATUS_COLOR_MAP, status, AVATAR_STATUS_COLOR_MAP.unknown);
}

// =============================================================================
// AvatarGroup Lookups
// =============================================================================

export function resolveOverlap(spacing: AvatarGroupSpacing): string {
  return safeLookup(AVATAR_GROUP_OVERLAP_MAP, spacing, AVATAR_GROUP_OVERLAP_MAP.normal);
}

export function resolveInlineGap(spacing: AvatarGroupSpacing): string {
  return safeLookup(AVATAR_GROUP_GAP_MAP, spacing, AVATAR_GROUP_GAP_MAP.normal);
}

// =============================================================================
// Name Utilities
// =============================================================================

/**
 * Generates a simple hash from a string.
 * Used for deterministic color selection based on name.
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Gets deterministic tone based on name hash.
 */
export function getToneFromName(name: string): AvatarTone {
  const hash = hashString(name);
  const index = hash % AVATAR_HASH_COLORS.length;
  return AVATAR_HASH_COLORS[index] ?? 'brand';
}

/**
 * Extracts initials from a name string.
 * Returns up to 2 characters (first letter of first and last name).
 */
export function getInitialsFromName(name: string): string {
  if (!name || typeof name !== 'string') {
    return '';
  }

  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '';
  }

  const [firstPart = ''] = parts;

  if (parts.length === 1) {
    return firstPart.substring(0, 2).toUpperCase();
  }

  const lastPart = parts[parts.length - 1] ?? firstPart;
  const first = firstPart[0] ?? '';
  const last = lastPart[0] ?? '';
  return (first + last).toUpperCase();
}

/**
 * Gets shape class based on shape prop.
 */
export function getShapeClass(shape: AvatarProps['shape']): string {
  if (shape === 'square') {
    return '';
  }
  if (shape === 'rounded') {
    return 'rounded-3';
  }
  return 'rounded-circle';
}
```

- [ ] **Step 2: Update Avatar.tsx to import from avatarUtils**

Remove all inline utility functions (`hashString`, `getInitialsFromName`, `getShapeClass`, `getNumericSize`, `getSizeValue`, `getFontSize`, `getStatusSize`, `getToneClasses`, `getStatusLabel`, `getStatusColor`, `getToneFromName`, `AVATAR_SIZE_FALLBACK_NUMBERS`) from Avatar.tsx. Replace with imports from `./avatarUtils`.

The import block at the top of Avatar.tsx should change from:

```typescript
import {
  AVATAR_FONT_SIZE_MAP,
  AVATAR_HASH_COLORS,
  AVATAR_SIZE_MAP,
  AVATAR_STATUS_COLOR_MAP,
  AVATAR_STATUS_LABEL_MAP,
  AVATAR_STATUS_SIZE_MAP,
  AVATAR_TONE_MAP,
} from './Avatar.types';
```

To:

```typescript
import {
  getFontSize,
  getInitialsFromName,
  getNumericSize,
  getShapeClass,
  getSizeValue,
  getStatusColor,
  getStatusLabel,
  getStatusSize,
  getToneClasses,
  getToneFromName,
} from './avatarUtils';
```

- [ ] **Step 3: Update AvatarGroup.tsx to import from avatarUtils**

Remove the duplicate `resolveAvatarSize`, `resolveOverlap`, `resolveInlineGap` functions from AvatarGroup.tsx. Replace with imports from `./avatarUtils`. Note: `resolveAvatarSize` is removed — use `getSizeValue` instead (identical function).

Change from:

```typescript
import {
  AVATAR_GROUP_GAP_MAP,
  AVATAR_GROUP_OVERLAP_MAP,
  AVATAR_SIZE_MAP,
  type AvatarGroupProps,
  type AvatarGroupSpacing,
  type AvatarSize,
} from './Avatar.types';
```

To:

```typescript
import { getSizeValue, resolveOverlap, resolveInlineGap } from './avatarUtils';
import type { AvatarGroupProps, AvatarGroupSpacing, AvatarSize } from './Avatar.types';
```

Replace all references to `resolveAvatarSize(size)` in AvatarGroup.tsx with `getSizeValue(size)`.

- [ ] **Step 4: Run tests to verify refactor is non-breaking**

Run: `cd /Users/michel/GitHub/dsai && export PATH="/Users/michel/Library/pnpm:$PATH" && npx jest --testPathPattern=Avatar --no-coverage`
Expected: All existing tests pass

- [ ] **Step 5: Commit**

```bash
git add packages/@dsai-io/react/src/components/Avatar/avatarUtils.ts \
  packages/@dsai-io/react/src/components/Avatar/Avatar.tsx \
  packages/@dsai-io/react/src/components/Avatar/AvatarGroup.tsx
git commit -m "refactor(Avatar): extract shared utilities with safeLookup helper"
```

---

## Task 2: Fix Accessibility Bugs

**Files:**
- Modify: `packages/@dsai-io/react/src/components/Avatar/Avatar.tsx`
- Modify: `packages/@dsai-io/react/src/components/Avatar/AvatarGroup.tsx`
- Modify: `packages/@dsai-io/react/src/components/Avatar/Avatar.test.tsx`

- [ ] **Step 1: Add Space key test for interactive Avatar**

Add to the "interactive mode" describe block in `Avatar.test.tsx`:

```typescript
it('calls onClick on Space key', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  render(<Avatar name="Test" interactive onClick={onClick} data-testid="avatar" />);

  const avatar = screen.getByTestId('avatar');
  avatar.focus();
  await user.keyboard(' ');

  expect(onClick).toHaveBeenCalled();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/michel/GitHub/dsai && export PATH="/Users/michel/Library/pnpm:$PATH" && npx jest --testPathPattern=Avatar --no-coverage -t "calls onClick on Space key"`
Expected: FAIL

- [ ] **Step 3: Fix Space key handling in Avatar.tsx**

In Avatar.tsx, update the `handleKeyDown` callback:

```typescript
const handleKeyDown = useCallback(
  (event: React.KeyboardEvent) => {
    if (interactive && (isEnterKey(event) || event.key === ' ')) {
      event.preventDefault(); // Prevent scroll on Space
      onClick?.(event as unknown as React.MouseEvent);
    }
    onKeyDown?.(event);
  },
  [interactive, onClick, onKeyDown]
);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/michel/GitHub/dsai && export PATH="/Users/michel/Library/pnpm:$PATH" && npx jest --testPathPattern=Avatar --no-coverage -t "calls onClick on Space key"`
Expected: PASS

- [ ] **Step 5: Add grammar fix test for AvatarGroup**

Add to the AvatarGroup "accessibility" describe block in `Avatar.test.tsx`:

```typescript
it('uses singular "user" for single avatar', () => {
  render(
    <AvatarGroup data-testid="group">
      <Avatar name="Alice" />
    </AvatarGroup>
  );
  expect(screen.getByTestId('group')).toHaveAttribute('aria-label', '1 user');
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `cd /Users/michel/GitHub/dsai && export PATH="/Users/michel/Library/pnpm:$PATH" && npx jest --testPathPattern=Avatar --no-coverage -t "uses singular"`
Expected: FAIL — gets "1 users" instead of "1 user"

- [ ] **Step 7: Fix grammar in AvatarGroup.tsx**

In AvatarGroup.tsx, update the `groupAriaLabel` useMemo:

```typescript
const groupAriaLabel = useMemo(() => {
  if (ariaLabel) {
    return ariaLabel;
  }
  const userWord = totalCount === 1 ? 'user' : 'users';
  if (hasOverflow) {
    return `${visibleCount} of ${totalCount} ${userWord} shown`;
  }
  return `${totalCount} ${userWord}`;
}, [ariaLabel, hasOverflow, visibleCount, totalCount]);
```

- [ ] **Step 8: Fix semantic element — change fieldset to div[role=group]**

In AvatarGroup.tsx, change the forwarded ref type from `HTMLFieldSetElement` to `HTMLDivElement`:

```typescript
export const AvatarGroup = memo(
  forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
```

Change the JSX return from `<fieldset>` to `<div role="group">` and `<legend>` to `<span>`:

```tsx
return (
  <div
    role="group"
    ref={ref}
    id={id}
    className={containerClasses}
    style={containerStyle}
    aria-label={groupAriaLabel}
    aria-hidden={ariaHidden}
    title={title}
    data-testid={dataTestId}
    data-test={dataTest}
    data-layout={layout}
    data-spacing={spacing}
    data-visible-count={visibleCount}
    data-total-count={totalCount}
  >
    <span className="visually-hidden">{groupAriaLabel}</span>

    {layout === 'stacked' && renderOverflowChip()}
    {visibleChildren}
    {layout === 'inline' && renderOverflowChip()}
  </div>
);
```

- [ ] **Step 9: Update existing tests that check for fieldset**

In Avatar.test.tsx, update:

```typescript
// Change: expect(group.tagName).toBe('FIELDSET');
// To:
expect(group.tagName).toBe('DIV');
expect(group).toHaveAttribute('role', 'group');

// Change: expect(ref.current).toBeInstanceOf(HTMLFieldSetElement);
// To:
expect(ref.current).toBeInstanceOf(HTMLDivElement);
```

Also update the existing "1 users" test assertion to "1 user":

```typescript
// Change: expect(group).toHaveAttribute('aria-label', '1 users');
// To:
expect(group).toHaveAttribute('aria-label', '1 user');
```

- [ ] **Step 10: Run all Avatar tests**

Run: `cd /Users/michel/GitHub/dsai && export PATH="/Users/michel/Library/pnpm:$PATH" && npx jest --testPathPattern=Avatar --no-coverage`
Expected: All tests pass

- [ ] **Step 11: Commit**

```bash
git add packages/@dsai-io/react/src/components/Avatar/Avatar.tsx \
  packages/@dsai-io/react/src/components/Avatar/AvatarGroup.tsx \
  packages/@dsai-io/react/src/components/Avatar/Avatar.test.tsx
git commit -m "fix(Avatar): Space key activation, grammar pluralization, fieldset→div[role=group]"
```

---

## Task 3: Add New Types

**Files:**
- Modify: `packages/@dsai-io/react/src/components/Avatar/Avatar.types.ts`

- [ ] **Step 1: Add AvatarImageStatus type and new Avatar props**

Add to `Avatar.types.ts` after the existing status types section:

```typescript
// =============================================================================
// Image Loading Status
// =============================================================================

/**
 * Granular image loading status for onLoadingStatusChange callback.
 */
export type AvatarImageStatus = 'idle' | 'loading' | 'loaded' | 'error';
```

Add new props to the `AvatarProps` interface (before the closing brace):

```typescript
  /**
   * Children for compound sub-components (Avatar.Image, Avatar.Fallback, etc.)
   * When compound children are present, they override their corresponding flat prop slot.
   */
  children?: ReactNode;

  /**
   * Delay (ms) before showing fallback content.
   * Prevents flash of initials/icon when images load quickly.
   */
  delayMs?: number;

  /**
   * Callback fired on every image loading state transition.
   * Provides granular idle → loading → loaded/error tracking.
   */
  onLoadingStatusChange?: (status: AvatarImageStatus) => void;

  /**
   * Referrer policy for the image element.
   * Controls the Referer header sent with image requests.
   */
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;

  /**
   * Cross-origin setting for the image element.
   * Controls CORS for images loaded from external CDNs.
   */
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
```

- [ ] **Step 2: Add compound sub-component prop interfaces**

Add to `Avatar.types.ts` after AvatarProps:

```typescript
// =============================================================================
// Compound Sub-Component Props
// =============================================================================

/**
 * Props for Avatar.Image compound sub-component.
 * Allows custom image elements (e.g., Next.js Image).
 */
export interface AvatarImageProps {
  src?: string;
  alt?: string;
  srcSet?: string;
  sizes?: string;
  loading?: 'eager' | 'lazy';
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  children?: ReactNode;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Props for Avatar.Fallback compound sub-component.
 */
export interface AvatarFallbackProps {
  delayMs?: number;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Props for Avatar.Badge compound sub-component.
 */
export interface AvatarBadgeProps {
  count?: number;
  dot?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Props for Avatar.Status compound sub-component.
 */
export interface AvatarStatusProps {
  value: AvatarStatus;
  position?: AvatarStatusPosition;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Context value shared from Avatar root to compound children.
 */
export interface AvatarContextValue {
  size: AvatarSize;
  shape: AvatarShape;
  tone: AvatarTone;
  imageStatus: AvatarImageStatus;
}
```

- [ ] **Step 3: Add new AvatarGroup props**

Add to the `AvatarGroupProps` interface (before the closing brace):

```typescript
  /**
   * Server-side total count, independent of rendered children.
   * When set, overflow chip shows +(total - visibleCount).
   */
  total?: number;

  /**
   * Custom render function for the overflow chip.
   * Receives surplus count, returns custom ReactNode.
   */
  renderSurplus?: (surplusCount: number) => ReactNode;

  /**
   * Click handler for the default overflow chip.
   * Ignored when renderSurplus is provided.
   */
  onOverflowClick?: (event: React.MouseEvent) => void;

  /**
   * Controls which avatar appears on top in stacked layout.
   * @default 'lastOnTop'
   */
  stackingOrder?: 'firstOnTop' | 'lastOnTop';
```

- [ ] **Step 4: Commit**

```bash
git add packages/@dsai-io/react/src/components/Avatar/Avatar.types.ts
git commit -m "feat(Avatar): add new types for compound sub-components and competitive features"
```

---

## Task 4: Create AvatarContext

**Files:**
- Create: `packages/@dsai-io/react/src/components/Avatar/AvatarContext.tsx`

- [ ] **Step 1: Create AvatarContext.tsx**

```typescript
// packages/@dsai-io/react/src/components/Avatar/AvatarContext.tsx

/**
 * Avatar Context
 *
 * Shares avatar state (size, shape, tone, image status) with compound
 * sub-components. Follows the Accordion context pattern.
 *
 * @packageDocumentation
 */

import { createContext, useContext } from 'react';

import type { AvatarContextValue } from './Avatar.types';

const AvatarContext = createContext<AvatarContextValue | null>(null);

/**
 * Hook to access avatar context from compound sub-components.
 * Throws if used outside an Avatar component.
 */
export function useAvatarContext(): AvatarContextValue {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error('Avatar compound components must be used within an Avatar component');
  }
  return context;
}

export { AvatarContext };
```

- [ ] **Step 2: Commit**

```bash
git add packages/@dsai-io/react/src/components/Avatar/AvatarContext.tsx
git commit -m "feat(Avatar): add AvatarContext for compound sub-components"
```

---

## Task 5: Create Compound Sub-Components

**Files:**
- Create: `packages/@dsai-io/react/src/components/Avatar/AvatarImage.tsx`
- Create: `packages/@dsai-io/react/src/components/Avatar/AvatarFallback.tsx`
- Create: `packages/@dsai-io/react/src/components/Avatar/AvatarBadge.tsx`
- Create: `packages/@dsai-io/react/src/components/Avatar/AvatarStatus.tsx`

- [ ] **Step 1: Create AvatarImage.tsx**

```typescript
// packages/@dsai-io/react/src/components/Avatar/AvatarImage.tsx

import { forwardRef, memo } from 'react';

import { cn } from '../../utils';
import { useAvatarContext } from './AvatarContext';
import { getShapeClass } from './avatarUtils';

import type { AvatarImageProps } from './Avatar.types';

export const AvatarImage = memo(
  forwardRef<HTMLImageElement, AvatarImageProps>(function AvatarImage(
    {
      src,
      alt,
      srcSet,
      sizes,
      loading = 'eager',
      referrerPolicy,
      crossOrigin,
      children,
      onError,
      onLoad,
      className,
      style,
    },
    ref
  ) {
    const { shape } = useAvatarContext();

    // If children provided, render custom image element
    if (children) {
      return (
        <span
          className={cn('dsai-avatar__image-wrapper', 'w-100', 'h-100', className)}
          style={style}
        >
          {children}
        </span>
      );
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt ?? ''}
        srcSet={srcSet}
        sizes={sizes}
        loading={loading}
        referrerPolicy={referrerPolicy}
        crossOrigin={crossOrigin}
        onError={onError}
        onLoad={onLoad}
        className={cn(
          'dsai-avatar__image',
          'w-100',
          'h-100',
          'object-fit-cover',
          getShapeClass(shape),
          className
        )}
        style={style}
        data-testid="avatar-image"
      />
    );
  })
);

AvatarImage.displayName = 'Avatar.Image';
```

- [ ] **Step 2: Create AvatarFallback.tsx**

```typescript
// packages/@dsai-io/react/src/components/Avatar/AvatarFallback.tsx

import { forwardRef, memo, useEffect, useState } from 'react';

import { cn } from '../../utils';
import { useAvatarContext } from './AvatarContext';

import type { AvatarFallbackProps } from './Avatar.types';

export const AvatarFallback = memo(
  forwardRef<HTMLSpanElement, AvatarFallbackProps>(function AvatarFallback(
    { delayMs, children, className, style },
    ref
  ) {
    const { imageStatus } = useAvatarContext();
    const [delayElapsed, setDelayElapsed] = useState(delayMs === undefined || delayMs === 0);

    useEffect(() => {
      if (delayMs === undefined || delayMs === 0) {
        setDelayElapsed(true);
        return undefined;
      }

      const timer = window.setTimeout(() => {
        setDelayElapsed(true);
      }, delayMs);

      return () => {
        window.clearTimeout(timer);
      };
    }, [delayMs]);

    // Only show fallback when image is not loaded
    if (imageStatus === 'loaded') {
      return null;
    }

    // Respect delay
    if (!delayElapsed) {
      return null;
    }

    return (
      <span
        ref={ref}
        className={cn('dsai-avatar__fallback', className)}
        style={style}
        data-testid="avatar-fallback"
      >
        {children}
      </span>
    );
  })
);

AvatarFallback.displayName = 'Avatar.Fallback';
```

- [ ] **Step 3: Create AvatarBadge.tsx**

```typescript
// packages/@dsai-io/react/src/components/Avatar/AvatarBadge.tsx

import { forwardRef, memo } from 'react';

import { cn } from '../../utils';
import { useAvatarContext } from './AvatarContext';

import type { AvatarBadgeProps } from './Avatar.types';

export const AvatarBadge = memo(
  forwardRef<HTMLSpanElement, AvatarBadgeProps>(function AvatarBadge(
    { count, dot = false, className, style },
    ref
  ) {
    // Access context for consistency (throws if used outside Avatar)
    useAvatarContext();

    if (count === undefined && !dot) {
      return null;
    }

    const badgeClasses = cn(
      'dsai-avatar__badge',
      'position-absolute',
      'top-0',
      'end-0',
      'badge',
      'rounded-pill',
      'bg-danger',
      'text-white',
      className
    );

    const badgeStyle = {
      zIndex: 1,
      transform: 'translate(25%, -25%)',
      ...style,
    };

    // Count takes priority over dot
    if (count !== undefined) {
      const displayCount = count > 99 ? '99+' : count;
      return (
        <span
          ref={ref}
          className={badgeClasses}
          style={{
            ...badgeStyle,
            fontSize: '0.625rem',
            minWidth: '1rem',
            padding: '0.15rem 0.35rem',
          }}
          aria-hidden="true"
          data-testid="avatar-badge-count"
        >
          {displayCount}
        </span>
      );
    }

    return (
      <span
        ref={ref}
        className={cn(badgeClasses, 'p-1')}
        style={badgeStyle}
        aria-hidden="true"
        data-testid="avatar-badge-dot"
      />
    );
  })
);

AvatarBadge.displayName = 'Avatar.Badge';
```

- [ ] **Step 4: Create AvatarStatus.tsx**

```typescript
// packages/@dsai-io/react/src/components/Avatar/AvatarStatus.tsx

import { forwardRef, memo } from 'react';

import { cn } from '../../utils';
import { useAvatarContext } from './AvatarContext';
import { getStatusColor, getStatusSize } from './avatarUtils';

import type { AvatarStatusProps } from './Avatar.types';

export const AvatarStatus = memo(
  forwardRef<HTMLSpanElement, AvatarStatusProps>(function AvatarStatus(
    { value, position = 'bottom-right', className, style },
    ref
  ) {
    const { size } = useAvatarContext();
    const statusSize = getStatusSize(size);

    const statusClasses = cn(
      'dsai-avatar__status',
      'position-absolute',
      'rounded-circle',
      'border',
      'border-2',
      'border-white',
      getStatusColor(value),
      position === 'bottom-left' ? 'start-0' : 'end-0',
      'bottom-0',
      className
    );

    const statusStyle = {
      width: statusSize,
      height: statusSize,
      zIndex: 1,
      transform:
        position === 'bottom-left' ? 'translate(-25%, 25%)' : 'translate(25%, 25%)',
      ...style,
    };

    // aria-hidden="true" — the parent Avatar's computed aria-label already
    // includes the status text (e.g., "John Doe, Online"), so this indicator
    // is purely visual. Matches the flat-API pattern.
    return (
      <span
        ref={ref}
        className={statusClasses}
        style={statusStyle}
        aria-hidden="true"
        data-status={value}
      />
    );
  })
);

AvatarStatus.displayName = 'Avatar.Status';
```

- [ ] **Step 5: Commit**

```bash
git add packages/@dsai-io/react/src/components/Avatar/AvatarImage.tsx \
  packages/@dsai-io/react/src/components/Avatar/AvatarFallback.tsx \
  packages/@dsai-io/react/src/components/Avatar/AvatarBadge.tsx \
  packages/@dsai-io/react/src/components/Avatar/AvatarStatus.tsx
git commit -m "feat(Avatar): add compound sub-components (Image, Fallback, Badge, Status)"
```

---

## Task 6: Integrate Compound Components + New Features into Avatar.tsx

**Files:**
- Modify: `packages/@dsai-io/react/src/components/Avatar/Avatar.tsx`

This is the largest task. Avatar.tsx needs:
1. AvatarContext provider wrapping children
2. Compound child detection (per-slot override)
3. `delayMs` support for flat API
4. `onLoadingStatusChange` callback
5. `referrerPolicy` / `crossOrigin` passthrough
6. Object.assign to attach sub-components

- [ ] **Step 1: Rewrite Avatar.tsx with all new features**

The full updated Avatar.tsx should:

**Imports** — add:
```typescript
import { Children, isValidElement } from 'react';
import { AvatarContext } from './AvatarContext';
import { AvatarImage } from './AvatarImage';
import { AvatarFallback } from './AvatarFallback';
import { AvatarBadge } from './AvatarBadge';
import { AvatarStatus } from './AvatarStatus';
import type { AvatarImageStatus } from './Avatar.types';
```

**New props destructured** — add to the destructuring:
```typescript
delayMs,
onLoadingStatusChange,
referrerPolicy,
crossOrigin,
```

**Compound child detection** — after destructuring, scan children:
```typescript
// Detect compound sub-components (per-slot override)
const childArray = children ? Children.toArray(children) : [];
const compoundImage = childArray.find(
  (child) => isValidElement(child) && (child.type as { displayName?: string }).displayName === 'Avatar.Image'
);
const compoundFallback = childArray.find(
  (child) => isValidElement(child) && (child.type as { displayName?: string }).displayName === 'Avatar.Fallback'
);
const compoundBadge = childArray.find(
  (child) => isValidElement(child) && (child.type as { displayName?: string }).displayName === 'Avatar.Badge'
);
const compoundStatus = childArray.find(
  (child) => isValidElement(child) && (child.type as { displayName?: string }).displayName === 'Avatar.Status'
);
```

Note: `children` was added to `AvatarProps` in Task 3. Destructure it from the props.

**Image status tracking + onLoadingStatusChange** — replace the simple imageState with:
```typescript
const [imageStatus, setImageStatus] = useState<AvatarImageStatus>(() =>
  src ? 'loading' : 'idle'
);

// Fire onLoadingStatusChange on transitions
const prevStatusRef = useRef<AvatarImageStatus>(src ? 'loading' : 'idle');
useEffect(() => {
  if (imageStatus !== prevStatusRef.current) {
    prevStatusRef.current = imageStatus;
    onLoadingStatusChange?.(imageStatus);
  }
}, [imageStatus, onLoadingStatusChange]);

// Reset status when src changes
useEffect(() => {
  if (src) {
    setImageStatus('loading');
  } else {
    setImageStatus('idle');
  }
}, [src]);
```

Update the image event handlers to use `setImageStatus('loaded')` and `setImageStatus('error')`.

**delayMs support** — add state for flat-API delay:
```typescript
const effectiveDelayMs = compoundFallback
  ? undefined  // compound child handles its own delay
  : delayMs;

const [delayElapsed, setDelayElapsed] = useState(
  effectiveDelayMs === undefined || effectiveDelayMs === 0
);

useEffect(() => {
  if (effectiveDelayMs === undefined || effectiveDelayMs === 0) {
    setDelayElapsed(true);
    return undefined;
  }
  const timer = window.setTimeout(() => setDelayElapsed(true), effectiveDelayMs);
  return () => window.clearTimeout(timer);
}, [effectiveDelayMs]);
```

**Image element** — add `referrerPolicy` and `crossOrigin`:
```tsx
<img
  ref={imageRef}
  src={src}
  alt={decorative ? '' : (alt ?? name ?? undefined)}
  srcSet={srcSet}
  sizes={sizes}
  loading={loading}
  referrerPolicy={referrerPolicy}
  crossOrigin={crossOrigin}
  className={cn(...)}
  ...
/>
```

**Render logic** — wrap in AvatarContext.Provider:
```tsx
const contextValue = useMemo<AvatarContextValue>(() => ({
  size,
  shape: shape ?? 'circle',
  tone,
  imageStatus,
}), [size, shape, tone, imageStatus]);

return (
  <Component ref={ref} {...baseContainerProps} {...interactiveProps}>
    <AvatarContext.Provider value={contextValue}>
      {isLoading ? (
        renderSkeleton()
      ) : compoundImage ? (
        compoundImage
      ) : showImage ? (
        <img ... />
      ) : compoundFallback ? (
        compoundFallback
      ) : (
        delayElapsed && renderFallbackContent()
      )}

      {compoundStatus ?? renderStatus()}
      {compoundBadge ?? renderBadge()}
    </AvatarContext.Provider>
  </Component>
);
```

**Object.assign** — at the bottom, after the Avatar component:
```typescript
const AvatarRoot = Avatar;

const AvatarCompound = Object.assign(AvatarRoot, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
  Badge: AvatarBadge,
  Status: AvatarStatus,
});

export { AvatarCompound as Avatar };
```

Note: The existing `export const Avatar = memo(forwardRef(...))` will need to be renamed to `const AvatarRoot = memo(forwardRef(...))` and the compound version exported instead.

- [ ] **Step 2: Run tests to verify existing behavior preserved**

Run: `cd /Users/michel/GitHub/dsai && export PATH="/Users/michel/Library/pnpm:$PATH" && npx jest --testPathPattern=Avatar --no-coverage`
Expected: All existing tests pass

- [ ] **Step 3: Commit**

```bash
git add packages/@dsai-io/react/src/components/Avatar/Avatar.tsx
git commit -m "feat(Avatar): integrate compound components, delayMs, onLoadingStatusChange, image security attrs"
```

---

## Task 7: Enhance AvatarGroup with New Features

**Files:**
- Modify: `packages/@dsai-io/react/src/components/Avatar/AvatarGroup.tsx`

- [ ] **Step 1: Add new props to AvatarGroup destructuring**

Add `total`, `renderSurplus`, `onOverflowClick`, `stackingOrder = 'lastOnTop'` to the destructured props.

Also add a dev-mode warning `useEffect` (fires once per prop combination, not every render):

```typescript
useEffect(() => {
  if (process.env.NODE_ENV !== 'production' && renderSurplus && onOverflowClick) {
    console.warn(
      'AvatarGroup: onOverflowClick is ignored when renderSurplus is provided. ' +
      'Handle click events in your renderSurplus function instead.'
    );
  }
}, [renderSurplus, onOverflowClick]);
```

- [ ] **Step 2: Update overflow count logic with `total` support**

```typescript
const totalCount = total ?? childArray.length;
const visibleCount = maxVisible !== undefined ? Math.min(maxVisible, childArray.length) : childArray.length;
const hiddenCount = totalCount - visibleCount;
const hasOverflow = hiddenCount > 0;
```

- [ ] **Step 3: Add stackingOrder support**

Update the container classes:
```typescript
const containerClasses = useMemo(
  () =>
    cn(
      'dsai-avatar-group',
      'd-inline-flex',
      'align-items-center',
      layout === 'stacked' && stackingOrder === 'lastOnTop' && 'flex-row-reverse',
      className
    ),
  [layout, stackingOrder, className]
);
```

Update margin/z-index logic in `visibleChildren`:
```typescript
style: {
  ...childProps.style,
  marginLeft:
    layout === 'stacked' && stackingOrder === 'lastOnTop' && index > 0
      ? marginLeft
      : undefined,
  marginRight:
    layout === 'stacked' && stackingOrder === 'firstOnTop' && index > 0
      ? marginLeft  // same negative overlap, applied to right
      : undefined,
  zIndex:
    layout === 'stacked'
      ? visibleCount - index
      : undefined,
},
```

- [ ] **Step 4: Add renderSurplus and onOverflowClick to overflow chip**

```typescript
const renderOverflowChip = (): React.ReactNode => {
  if (!hasOverflow) {
    return null;
  }

  // Custom render
  if (renderSurplus) {
    return renderSurplus(hiddenCount);
  }

  // Default chip (existing code, but add onOverflowClick)
  const chipClasses = cn(
    'dsai-avatar-group__overflow',
    'd-inline-flex',
    'align-items-center',
    'justify-content-center',
    'bg-secondary',
    'text-white',
    'fw-semibold',
    shape === 'circle' && 'rounded-circle',
    shape === 'rounded' && 'rounded-3',
    layout === 'stacked' && 'border border-2 border-white'
  );

  const chipStyle: React.CSSProperties = {
    width: avatarSize,
    height: avatarSize,
    fontSize: `calc(${avatarSize} * 0.35)`,
    marginLeft: layout === 'stacked' && stackingOrder === 'lastOnTop' ? marginLeft : undefined,
    marginRight: layout === 'stacked' && stackingOrder === 'firstOnTop' ? marginLeft : undefined,
    zIndex: 0,
  };

  return (
    <button
      type="button"
      className={cn(chipClasses, 'border-0', 'p-0')}
      style={chipStyle}
      aria-label={computedOverflowLabel}
      title={showOverflowTooltip ? computedOverflowLabel : undefined}
      onClick={onOverflowClick}
      data-testid="avatar-group-overflow"
    >
      +{hiddenCount}
    </button>
  );
};
```

- [ ] **Step 5: Run tests**

Run: `cd /Users/michel/GitHub/dsai && export PATH="/Users/michel/Library/pnpm:$PATH" && npx jest --testPathPattern=Avatar --no-coverage`
Expected: All tests pass

- [ ] **Step 6: Commit**

```bash
git add packages/@dsai-io/react/src/components/Avatar/AvatarGroup.tsx
git commit -m "feat(AvatarGroup): add total, renderSurplus, onOverflowClick, stackingOrder"
```

---

## Task 8: Update Exports

**Files:**
- Modify: `packages/@dsai-io/react/src/components/Avatar/index.ts`

- [ ] **Step 1: Update index.ts with new exports**

```typescript
/**
 * Avatar Component Exports
 *
 * @packageDocumentation
 */

export { Avatar } from './Avatar';
export { AvatarGroup } from './AvatarGroup';
export { AvatarContext, useAvatarContext } from './AvatarContext';
export {
  AVATAR_FONT_SIZE_MAP,
  AVATAR_HASH_COLORS,
  AVATAR_SIZE_MAP,
  AVATAR_STATUS_COLOR_MAP,
  AVATAR_STATUS_LABEL_MAP,
  AVATAR_STATUS_SIZE_MAP,
  AVATAR_TONE_MAP,
} from './Avatar.types';
export type {
  AvatarBadgeProps,
  AvatarContextValue,
  AvatarFallbackProps,
  AvatarGroupLayout,
  AvatarGroupProps,
  AvatarGroupSpacing,
  AvatarImageProps,
  AvatarImageStatus,
  AvatarProps,
  AvatarShape,
  AvatarSize,
  AvatarStatus,
  AvatarStatusPosition,
  AvatarStatusProps,
  AvatarTone,
} from './Avatar.types';
```

- [ ] **Step 2: Commit**

```bash
git add packages/@dsai-io/react/src/components/Avatar/index.ts
git commit -m "feat(Avatar): export compound sub-components and new types"
```

---

## Task 9: Add Tests for New Features

**Files:**
- Modify: `packages/@dsai-io/react/src/components/Avatar/Avatar.test.tsx`

- [ ] **Step 1: Add tests for delayMs, onLoadingStatusChange, security attrs**

Ensure `act` is imported at the top of `Avatar.test.tsx`:
```typescript
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
```

Add a new describe block in `Avatar.test.tsx`:

```typescript
// ===========================================================================
// New Features
// ===========================================================================

describe('delayMs', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('delays fallback rendering', () => {
    render(<Avatar name="Test" delayMs={500} data-testid="avatar" />);
    // Fallback should not be visible yet
    expect(screen.queryByText('TE')).not.toBeInTheDocument();

    // Advance timer
    act(() => { jest.advanceTimersByTime(500); });
    expect(screen.getByText('TE')).toBeInTheDocument();
  });

  it('shows image immediately regardless of delayMs', () => {
    render(<Avatar src="/test.jpg" alt="Test" delayMs={500} data-testid="avatar" />);
    expect(screen.getByTestId('avatar-image')).toBeInTheDocument();
  });
});

describe('onLoadingStatusChange', () => {
  it('fires with loaded on successful image load', () => {
    const onChange = jest.fn();
    render(
      <Avatar src="/test.jpg" alt="Test" onLoadingStatusChange={onChange} data-testid="avatar" />
    );

    const img = screen.getByTestId('avatar-image');
    fireEvent.load(img);

    expect(onChange).toHaveBeenCalledWith('loaded');
  });

  it('fires with error on failed image', () => {
    const onChange = jest.fn();
    render(
      <Avatar src="/bad.jpg" alt="Test" onLoadingStatusChange={onChange} data-testid="avatar" />
    );

    const img = screen.getByTestId('avatar-image');
    fireEvent.error(img);

    expect(onChange).toHaveBeenCalledWith('error');
  });
});

describe('image security attributes', () => {
  it('passes referrerPolicy to img', () => {
    render(
      <Avatar src="/test.jpg" alt="Test" referrerPolicy="no-referrer" data-testid="avatar" />
    );
    expect(screen.getByTestId('avatar-image')).toHaveAttribute('referrerpolicy', 'no-referrer');
  });

  it('passes crossOrigin to img', () => {
    render(
      <Avatar src="/test.jpg" alt="Test" crossOrigin="anonymous" data-testid="avatar" />
    );
    expect(screen.getByTestId('avatar-image')).toHaveAttribute('crossorigin', 'anonymous');
  });
});
```

- [ ] **Step 2: Add tests for compound sub-components**

```typescript
describe('compound components', () => {
  it('renders Avatar.Badge as compound child', () => {
    render(
      <Avatar name="Test" data-testid="avatar">
        <Avatar.Badge count={3} />
      </Avatar>
    );
    expect(screen.getByTestId('avatar-badge-count')).toHaveTextContent('3');
  });

  it('renders Avatar.Status as compound child', () => {
    render(
      <Avatar name="Test" data-testid="avatar">
        <Avatar.Status value="online" />
      </Avatar>
    );
    const indicator = screen.getByTestId('avatar').querySelector('[data-status]');
    expect(indicator).toHaveAttribute('data-status', 'online');
  });

  it('compound child overrides flat prop (per-slot)', () => {
    render(
      <Avatar name="Test" badgeCount={5} data-testid="avatar">
        <Avatar.Badge count={10} />
      </Avatar>
    );
    // Compound badge should win
    expect(screen.getByTestId('avatar-badge-count')).toHaveTextContent('10');
  });

  it('flat props still work when no compound child for that slot', () => {
    render(
      <Avatar name="Test" status="online" data-testid="avatar">
        <Avatar.Badge count={3} />
      </Avatar>
    );
    // Status from flat prop, badge from compound
    const indicator = screen.getByTestId('avatar').querySelector('[data-status]');
    expect(indicator).toHaveAttribute('data-status', 'online');
    expect(screen.getByTestId('avatar-badge-count')).toHaveTextContent('3');
  });
});
```

- [ ] **Step 3: Add tests for new AvatarGroup features**

```typescript
describe('AvatarGroup new features', () => {
  it('uses total prop for overflow count', () => {
    render(
      <AvatarGroup maxVisible={2} total={50} data-testid="group">
        <Avatar name="Alice" />
        <Avatar name="Bob" />
        <Avatar name="Charlie" />
      </AvatarGroup>
    );
    expect(screen.getByTestId('avatar-group-overflow')).toHaveTextContent('+48');
  });

  it('renders custom surplus with renderSurplus', () => {
    render(
      <AvatarGroup
        maxVisible={2}
        renderSurplus={(count) => <span data-testid="custom-surplus">+{count} more</span>}
        data-testid="group"
      >
        <Avatar name="Alice" />
        <Avatar name="Bob" />
        <Avatar name="Charlie" />
      </AvatarGroup>
    );
    expect(screen.getByTestId('custom-surplus')).toHaveTextContent('+1 more');
    expect(screen.queryByTestId('avatar-group-overflow')).not.toBeInTheDocument();
  });

  it('fires onOverflowClick on default chip click', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <AvatarGroup maxVisible={2} onOverflowClick={onClick} data-testid="group">
        <Avatar name="Alice" />
        <Avatar name="Bob" />
        <Avatar name="Charlie" />
      </AvatarGroup>
    );

    await user.click(screen.getByTestId('avatar-group-overflow'));
    expect(onClick).toHaveBeenCalled();
  });

  it('supports firstOnTop stacking order', () => {
    render(
      <AvatarGroup stackingOrder="firstOnTop" data-testid="group">
        <Avatar name="Alice" data-testid="alice" />
        <Avatar name="Bob" data-testid="bob" />
      </AvatarGroup>
    );
    const group = screen.getByTestId('group');
    // firstOnTop should not have flex-row-reverse
    expect(group).not.toHaveClass('flex-row-reverse');
  });

  it('uses lastOnTop stacking by default', () => {
    render(
      <AvatarGroup data-testid="group">
        <Avatar name="Alice" />
        <Avatar name="Bob" />
      </AvatarGroup>
    );
    const group = screen.getByTestId('group');
    expect(group).toHaveClass('flex-row-reverse');
  });
});
```

- [ ] **Step 4: Run all Avatar tests**

Run: `cd /Users/michel/GitHub/dsai && export PATH="/Users/michel/Library/pnpm:$PATH" && npx jest --testPathPattern=Avatar --no-coverage`
Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add packages/@dsai-io/react/src/components/Avatar/Avatar.test.tsx
git commit -m "test(Avatar): add tests for new features, compound components, and group enhancements"
```

---

## Task 10: Update Storybook Stories

**Files:**
- Modify: `packages/@dsai-io/storybook/docs/components/Avatar.stories.tsx`

- [ ] **Step 1: Add xxl to Sizes story and argTypes**

Update the `argTypes.size.options` to include `'xxl'`:
```typescript
size: {
  control: 'select',
  options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'xxl'],
},
```

Add new argTypes:
```typescript
delayMs: {
  control: 'number',
  description: 'Delay (ms) before showing fallback content',
},
referrerPolicy: {
  control: 'select',
  options: [undefined, 'no-referrer', 'no-referrer-when-downgrade', 'origin', 'same-origin'],
  description: 'Referrer policy for image requests',
},
crossOrigin: {
  control: 'select',
  options: [undefined, 'anonymous', 'use-credentials'],
  description: 'Cross-origin setting for image element',
},
```

Add `xxl` to the SizesExample:
```tsx
<Avatar name="XXL Size" size="xxl" />
```

- [ ] **Step 2: Add compound component story**

```tsx
const CompoundComponentsExample = (): JSX.Element => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        Compound Badge
      </Heading>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Avatar name="John Doe" size="lg">
          <Avatar.Badge count={5} />
        </Avatar>
        <Avatar name="Jane Smith" size="lg">
          <Avatar.Badge dot />
        </Avatar>
      </div>
    </div>

    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        Compound Status
      </Heading>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Avatar name="Online User" size="lg">
          <Avatar.Status value="online" />
        </Avatar>
        <Avatar name="Busy User" size="lg">
          <Avatar.Status value="busy" position="bottom-left" />
        </Avatar>
      </div>
    </div>

    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        Compound Fallback with Delay
      </Heading>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Avatar src="https://invalid-url.example/fail.jpg" size="lg">
          <Avatar.Fallback delayMs={300}>
            <span style={{ fontSize: '0.875rem' }}>FB</span>
          </Avatar.Fallback>
        </Avatar>
      </div>
    </div>

    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        Mixed: Compound + Flat Props
      </Heading>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Avatar name="Mixed User" status="online" size="lg">
          <Avatar.Badge count={3} />
        </Avatar>
        <span style={{ fontSize: '0.875rem', color: 'var(--bs-secondary)' }}>
          Status from flat prop, badge from compound
        </span>
      </div>
    </div>
  </div>
);

export const CompoundComponents: Story = {
  render: CompoundComponentsExample,
  parameters: {
    docs: {
      description: {
        story:
          'Compound sub-components provide advanced composition. Use Avatar.Image, Avatar.Fallback, Avatar.Badge, and Avatar.Status for fine-grained control. Flat props still work — compound children override only their corresponding slot.',
      },
    },
  },
};
```

- [ ] **Step 3: Add Group new features stories**

```tsx
const GroupNewFeaturesExample = (): JSX.Element => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        Server-Side Total (total=50)
      </Heading>
      <AvatarGroup maxVisible={3} total={50}>
        <Avatar name="Alice Johnson" />
        <Avatar name="Bob Smith" />
        <Avatar name="Charlie Brown" />
      </AvatarGroup>
    </div>

    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        Custom Overflow (renderSurplus)
      </Heading>
      <AvatarGroup
        maxVisible={3}
        renderSurplus={(count) => (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              backgroundColor: 'var(--bs-primary)',
              color: 'white',
              borderRadius: '1rem',
            }}
          >
            View {count} more
          </span>
        )}
      >
        <Avatar name="Alice Johnson" />
        <Avatar name="Bob Smith" />
        <Avatar name="Charlie Brown" />
        <Avatar name="Diana Prince" />
        <Avatar name="Edward Norton" />
      </AvatarGroup>
    </div>

    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        Stacking Order: First on Top
      </Heading>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>lastOnTop (default)</div>
          <AvatarGroup stackingOrder="lastOnTop">
            <Avatar name="First" tone="brand" />
            <Avatar name="Second" tone="success" />
            <Avatar name="Third" tone="danger" />
          </AvatarGroup>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>firstOnTop</div>
          <AvatarGroup stackingOrder="firstOnTop">
            <Avatar name="First" tone="brand" />
            <Avatar name="Second" tone="success" />
            <Avatar name="Third" tone="danger" />
          </AvatarGroup>
        </div>
      </div>
    </div>
  </div>
);

export const GroupNewFeatures: Story = {
  render: GroupNewFeaturesExample,
  name: 'AvatarGroup: New Features',
  parameters: {
    docs: {
      description: {
        story:
          'New AvatarGroup features: `total` for server-side counts, `renderSurplus` for custom overflow rendering, and `stackingOrder` to control which avatar appears on top.',
      },
    },
  },
};
```

- [ ] **Step 4: Commit**

```bash
git add packages/@dsai-io/storybook/docs/components/Avatar.stories.tsx
git commit -m "docs(Avatar): add stories for compound components, group features, and xxl size"
```

---

## Task 11: Lint, Build, and Final Verification

**Files:** None (verification only)

- [ ] **Step 1: Run lint**

Run: `cd /Users/michel/GitHub/dsai && export PATH="/Users/michel/Library/pnpm:$PATH" && npx nx run @dsai-io/react:lint`
Expected: 0 errors, 0 warnings

- [ ] **Step 2: Run tests with coverage**

Run: `cd /Users/michel/GitHub/dsai && export PATH="/Users/michel/Library/pnpm:$PATH" && npx jest --testPathPattern=Avatar --coverage`
Expected: All tests pass, coverage at target

- [ ] **Step 3: Run build**

Run: `cd /Users/michel/GitHub/dsai && export PATH="/Users/michel/Library/pnpm:$PATH" && npx nx run @dsai-io/react:build`
Expected: Build succeeds

- [ ] **Step 4: Fix any issues found in steps 1-3**

Address lint errors, test failures, or build errors. Re-run verification after each fix.

- [ ] **Step 5: Final commit if fixes were needed**

```bash
git add -A
git commit -m "fix(Avatar): address lint/build/test issues from final verification"
```
