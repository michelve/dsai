# TASK-061: Avatar Component

**Task ID:** TASK-061
**Title:** Avatar Component
**Priority:** Medium
**Status:** Completed ✅
**Assigned To:** Developer
**Estimated Time:** 12 hours
**Actual Time:** ~8 hours
**Phase:** Phase 2B - Medium Components (Weeks 9-10)
**Completed:** 2024

---

## Description

Build an enterprise-ready Avatar component set (Avatar + AvatarGroup) follow bootstrap classes when possible. Support images, initials, icons, status indicators, badges, stacked groups, accessibility, and robust fallbacks inspired by—but not copied from—PrimeReact Avatar or Ant Design system capabilities.

---

## Acceptance Criteria

### Component API & Variants

- [x] Single `Avatar` component with `src`, `alt`, `name`, `initials`, `icon`, `shape`, `size`, `tone`, `status`, `interactive` props.
- [x] Shapes: `circle` (default), `rounded`, `square`.
- [x] Sizes: `xs`, `sm`, `md`, `lg`, `xl`, `2xl` mapped to tokenized spacing/radius/typography.
- [x] Tone/background variants for non-image avatars: `neutral`, `brand`, `accent`, `success`, `warning`, `danger`, `info`, `muted`, `inverse` (text contrast auto-handled).
- [x] Deterministic fallback background color from hashed `name`/`email` when tone is not provided (stable per user).
- [x] Fallback order: image → custom `fallback` slot → `initials` prop → derived initials from `name` → `icon`/default silhouette.

### Status, Badge & Overlay

- [x] Presence status chip with values: `online`, `busy`, `away`, `offline`, `dnd`, `unknown`; optional custom color map via tokens.
- [x] Status positioning options (bottom-right default, bottom-left optional) with proper stacking/z-index.
- [x] Optional notification badge/dot and numeric badge (`count`, max 99 shown as `99+`) without covering initials.
- [x] Optional focus/selection ring style for interactive avatars and controlled `selected` state.

### Grouping

- [x] `AvatarGroup` component supporting `maxVisible` with overflow chip (`+N`) and tooltip/aria label for truncated members.
- [x] Group layout options: `stacked` (overlapping) and `inline` (spaced); configurable `spacing` token values.
- [x] Group inherits `size`, `shape`, `tone` defaults but allows per-avatar overrides.
- [x] Handles mixed content (images + text + icons) without layout shift; consistent status/badge alignment in groups.

### Loading, Errors & Fallbacks

- [x] Graceful image loading with optional skeleton/placeholder; `loading` prop sets `aria-busy`.
- [x] `onError` handled without infinite reload loops; falls back to non-image rendering.
- [x] Supports `srcSet`/`sizes` for HiDPI and `loading="lazy"` option.
- [x] Option to mark avatar as decorative (`aria-hidden`, empty `alt`) vs. identifiable (`alt`/`aria-label` required).

### Accessibility

- [x] WCAG 2.2 AA: focus ring, 44×44 touch targets for interactive mode, sufficient color contrast for tones/status.
- [x] Keyboard operable when `interactive` or `as="button"|"a"`; proper role and `aria-pressed` when `selected`.
- [x] Status announced via `aria-label`/`aria-describedby` (e.g., “Jane Doe, online”).
- [x] AvatarGroup is navigable: overflow chip focusable with label of hidden users; no duplicate tab stops for decorative avatars.
- [x] Honors `prefers-reduced-motion` for any entrance/stack animations.

### Theming & Styling

- [x] Uses design tokens (color, radius, spacing, typography) via CSS variables/Bootstrap theme—no hardcoded values.
- [x] Supports light/dark/inverse surfaces; tone and status colors adapt to theme.
- [x] Export minimal class names for overrides; no global leaks.

### Testing

- [x] Unit tests for prop defaults, size/shape variants, tone and deterministic backgrounds, fallback order, status rendering, badges, interactive mode.
- [x] AvatarGroup tests: stacking, overflow chip math, inherited props, truncation labeling.
- [x] Accessibility tests with jest-axe for Avatar and AvatarGroup.
- [x] Snapshot/DOM structure tests for key variants; image error handler covered.

### Documentation & Examples

- [x] Storybook stories covering: image, initials, icon, tones, sizes, shapes, status variants, badges, interactive avatars, skeleton/loading, AvatarGroup (stacked/inline, overflow).
- [x] Usage guidelines: alt/text rules, when to mark decorative, status labeling, recommended image resolutions, theming hooks.
- [x] Migration/compatibility notes if replacing existing ad-hoc avatars.

---

## Context

Utilities live in `packages/@dsai/react/src/utils` and sub-folders:

- **Core:**  
  `cn`, `clamp`, `generateId` (SSR-safe), `isBrowser`, `prefersReducedMotion`, `mergeRefs`
- **a11y:**  
  `focusableSelectors`, `focusableSelectorString`, `trapFocus`, `announceToScreenReader`, `generateId`
- **keyboard:**  
  `isEnterKey`, `isEscapeKey`
- **validation:**  
  `isSafeHref`, `isValidHref`, `isValidUrl`, `isValidEmail`
- **types:**  
  `isExternalUrl`
- **string:**  
  `getVariantClass`
- **misc:**  
  `getSafeInputProps`, `normalizeTriggers`, `mapPlacement`,  
  `toggleItemEvent`, `toggleAllEvent`, `selectAllEvent`, `clearAllEvent`, `ClearIcon`

Components live under:  
`packages/@dsai/react/src/components`.

---

## Files to Modify

- `packages/@dsai/react/src/components/Avatar/Avatar.tsx` — main component implementation.
- `packages/@dsai/react/src/components/Avatar/Avatar.types.ts` — props and shared types.
- `packages/@dsai/react/src/components/Avatar/AvatarGroup.tsx` — grouped/stacked behavior.
- `packages/@dsai/react/src/components/Avatar/Avatar.test.tsx` — unit + accessibility tests.
- `packages/@dsai/storybook/docs/components/Avatar.stories.tsx` — stories and controls.
- `packages/@dsai/react/src/components/Avatar/index.ts` — barrel export.

---

## Testing Requirements

- [x] Jest unit tests and jest-axe accessibility checks added for Avatar and AvatarGroup.
- [x] Storybook manual check for all variants (light/dark surfaces).
- [x] Visual review for stacked overlap and badge/status positioning in responsive breakpoints.

---

## Documentation Requirements

- [x] Props table with defaults and accessibility notes.
- [x] Do/Don’t section for alt text, decorative usage, and tone selection.
- [x] Notes on deterministic color hashing and how to override with tokens.

---

## Implementation Steps

1. Finalize Avatar and AvatarGroup API (props, defaults, tokens, status color map, fallback order).
2. Implement Avatar rendering logic (image + fallbacks), interactive mode, badge/status overlays, selection ring.
3. Build AvatarGroup with stacking, overflow chip, inherited props, and truncation labeling.
4. Wire styling to tokens (sizes, radius, tones, statuses) and ensure theme adaptability + reduced motion support.
5. Add tests (unit, jest-axe) and Storybook stories with comprehensive examples and guidance.

---

## Definition of Done

- [x] All acceptance criteria met for Avatar and AvatarGroup.
- [x] Tests passing (unit + accessibility) with coverage on fallbacks, status, grouping.
- [x] Storybook docs updated with variant coverage and guidance.
- [x] Lint/build succeed via Nx pipeline.
