TODO: avatar

# TASK-061: Avatar Component

**Task ID:** TASK-061
**Title:** Avatar Component
**Priority:** Medium
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 12 hours
**Phase:** Phase 2B - Medium Components (Weeks 9-10)

---

## Description

Build an enterprise-ready Avatar component set (Avatar + AvatarGroup) for the React design system. Support images, initials, icons, status indicators, badges, stacked groups, accessibility, and robust fallbacks inspired by—but not copied from—PrimeReact Avatar capabilities.

---

## Acceptance Criteria

### Component API & Variants

- [ ] Single `Avatar` component with `src`, `alt`, `name`, `initials`, `icon`, `shape`, `size`, `tone`, `status`, `interactive` props.
- [ ] Shapes: `circle` (default), `rounded`, `square`.
- [ ] Sizes: `xs`, `sm`, `md`, `lg`, `xl`, `2xl` mapped to tokenized spacing/radius/typography.
- [ ] Tone/background variants for non-image avatars: `neutral`, `brand`, `accent`, `success`, `warning`, `danger`, `info`, `muted`, `inverse` (text contrast auto-handled).
- [ ] Deterministic fallback background color from hashed `name`/`email` when tone is not provided (stable per user).
- [ ] Fallback order: image → custom `fallback` slot → `initials` prop → derived initials from `name` → `icon`/default silhouette.

### Status, Badge & Overlay

- [ ] Presence status chip with values: `online`, `busy`, `away`, `offline`, `dnd`, `unknown`; optional custom color map via tokens.
- [ ] Status positioning options (bottom-right default, bottom-left optional) with proper stacking/z-index.
- [ ] Optional notification badge/dot and numeric badge (`count`, max 99 shown as `99+`) without covering initials.
- [ ] Optional focus/selection ring style for interactive avatars and controlled `selected` state.

### Grouping

- [ ] `AvatarGroup` component supporting `maxVisible` with overflow chip (`+N`) and tooltip/aria label for truncated members.
- [ ] Group layout options: `stacked` (overlapping) and `inline` (spaced); configurable `spacing` token values.
- [ ] Group inherits `size`, `shape`, `tone` defaults but allows per-avatar overrides.
- [ ] Handles mixed content (images + text + icons) without layout shift; consistent status/badge alignment in groups.

### Loading, Errors & Fallbacks

- [ ] Graceful image loading with optional skeleton/placeholder; `loading` prop sets `aria-busy`.
- [ ] `onError` handled without infinite reload loops; falls back to non-image rendering.
- [ ] Supports `srcSet`/`sizes` for HiDPI and `loading="lazy"` option.
- [ ] Option to mark avatar as decorative (`aria-hidden`, empty `alt`) vs. identifiable (`alt`/`aria-label` required).

### Accessibility

- [ ] WCAG 2.2 AA: focus ring, 44×44 touch targets for interactive mode, sufficient color contrast for tones/status.
- [ ] Keyboard operable when `interactive` or `as="button"|"a"`; proper role and `aria-pressed` when `selected`.
- [ ] Status announced via `aria-label`/`aria-describedby` (e.g., “Jane Doe, online”).
- [ ] AvatarGroup is navigable: overflow chip focusable with label of hidden users; no duplicate tab stops for decorative avatars.
- [ ] Honors `prefers-reduced-motion` for any entrance/stack animations.

### Theming & Styling

- [ ] Uses design tokens (color, radius, spacing, typography) via CSS variables/Bootstrap theme—no hardcoded values.
- [ ] Supports light/dark/inverse surfaces; tone and status colors adapt to theme.
- [ ] Export minimal class names for overrides; no global leaks.

### Testing

- [ ] Unit tests for prop defaults, size/shape variants, tone and deterministic backgrounds, fallback order, status rendering, badges, interactive mode.
- [ ] AvatarGroup tests: stacking, overflow chip math, inherited props, truncation labeling.
- [ ] Accessibility tests with jest-axe for Avatar and AvatarGroup.
- [ ] Snapshot/DOM structure tests for key variants; image error handler covered.

### Documentation & Examples

- [ ] Storybook stories covering: image, initials, icon, tones, sizes, shapes, status variants, badges, interactive avatars, skeleton/loading, AvatarGroup (stacked/inline, overflow).
- [ ] Usage guidelines: alt/text rules, when to mark decorative, status labeling, recommended image resolutions, theming hooks.
- [ ] Migration/compatibility notes if replacing existing ad-hoc avatars.

---

## Files to Modify

- `packages/@dsai/react/src/components/Avatar/Avatar.tsx` — main component implementation.
- `packages/@dsai/react/src/components/Avatar/Avatar.types.ts` — props and shared types.
- `packages/@dsai/react/src/components/Avatar/AvatarGroup.tsx` — grouped/stacked behavior.
- `packages/@dsai/react/src/components/Avatar/Avatar.test.tsx` — unit + accessibility tests.
- `packages/@dsai/storybook/docs/components/Avatar.stories.tsx` — stories and controls.
- `packages/@dsai/react/src/components/Avatar/index.ts` — barrel export.

---

## Dependencies

### Requires:

- **TASK-014**: Base Component Template
- **TASK-013**: Configure Storybook 7
- **TASK-016**: Create TypeScript Types for Tokens (token access)

### Blocks:

- Future people-picker/mentions components needing avatars (TBD)

---

## Testing Requirements

- [ ] Jest unit tests and jest-axe accessibility checks added for Avatar and AvatarGroup.
- [ ] Storybook manual check for all variants (light/dark surfaces).
- [ ] Visual review for stacked overlap and badge/status positioning in responsive breakpoints.

---

## Documentation Requirements

- [ ] Props table with defaults and accessibility notes.
- [ ] Do/Don’t section for alt text, decorative usage, and tone selection.
- [ ] Notes on deterministic color hashing and how to override with tokens.

---

## Implementation Steps

1. Finalize Avatar and AvatarGroup API (props, defaults, tokens, status color map, fallback order).
2. Implement Avatar rendering logic (image + fallbacks), interactive mode, badge/status overlays, selection ring.
3. Build AvatarGroup with stacking, overflow chip, inherited props, and truncation labeling.
4. Wire styling to tokens (sizes, radius, tones, statuses) and ensure theme adaptability + reduced motion support.
5. Add tests (unit, jest-axe) and Storybook stories with comprehensive examples and guidance.

---

## Definition of Done

- [ ] All acceptance criteria met for Avatar and AvatarGroup.
- [ ] Tests passing (unit + accessibility) with coverage on fallbacks, status, grouping.
- [ ] Storybook docs updated with variant coverage and guidance.
- [ ] Lint/build succeed via Nx pipeline.
