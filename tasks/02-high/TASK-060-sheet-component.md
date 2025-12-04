**Transitions**:

| Current State | Event | Next State |
| ------------- [ ] | --------------------- | --------------------------------------------------------- |
| `closed` | `OPEN` | `opening` |
| `opening` | `OPEN_ANIMATION_END` | `open` |
| `opening` | `CLOSE` | `closing` or `unmounting` (depending on desired behavior) |
| `open` | `CLOSE` | `closing` |
| `open` | `FORCE_CLOSE` | `closing` |
| `closing` | `CLOSE_ANIMATION_END` | `unmounting` |
| `unmounting` | _cleanup done_ | `closed` |
| Any state | `ERROR` | `error` |

**Behavior expectations**:

- Entry into `opening`: mount portal, render backdrop & container, start slide/fade-in animation, lock document scroll, set focus trap.
- On `OPEN_ANIMATION_END`: mark as fully open, enable full interactions.
- On `CLOSE`: kick off animation, disable interactions inside sheet (optional), start slide/fade-out.
- On `CLOSE_ANIMATION_END`: unmount portal, release scroll lock, restore focus to trigger (or `finalFocusRef`).
- On `error`: safe fallback — unmount if needed, log error, restore document state (scroll, focus).

This FSM ensures every open/close cycle is deterministic, unambiguous, testable, and safe — minimizing risk of race conditions, inconsistent states, memory leaks, or UI glitches.

### Overlay & Stacking Behavior

- [ ] Implement support for stacking multiple overlays (sheets, modals, drawers) — each instance’s z-index and stacking order managed reliably.
- [ ] Ensure focus trap and scroll lock logic works correctly when multiple overlays are open (e.g. sheet behind modal, nested drawer inside sheet).
- [ ] Ensure backdrop layering and click-to-close behavior works correctly per overlay, without leaks or interference.

### Accessibility & Keyboard Interaction

- [ ] Use proper ARIA attributes:
  - `role="dialog"` (or appropriate per variant)
  - `aria-modal="true"` for blocking overlays
  - `aria-labelledby` referencing title heading
  - `aria-describedby` optional referencing body content (if provided)
- [ ] On open: move focus to `initialFocusRef` or first focusable element (or close button if no other) — focus trap active.
- [ ] On close: restore focus to trigger (or `finalFocusRef`).
- [ ] Keyboard support:
  - ESC closes sheet when `closeOnEsc === true`.
  - Tab / Shift+Tab cycles within sheet (no escape to background).
- [ ] Proper handling for screen-readers: overlay announced, heading read, background inert/unfocusable.
- [ ] Respect user system preference for reduced motion — if `prefers-reduced-motion`, disable or simplify animations.

### Theming, Styling & Variants

- [ ] Use design-system style tokens for colors, shadows, radii, spacing.
- [ ] Allow variant surfaces: e.g. default surface, elevated, inverse, transparent, etc.
- [ ] Support variant modes: modal-style sheet (with backdrop), permanent sidebar (no backdrop, part of layout), bottom-sheet (mobile-style), etc.
- [ ] Responsive defaults: e.g. bottom-sheet full width on mobile, right-drawer medium width on desktop; adapt with breakpoints where relevant.

### Performance & Mounting Behavior

- [ ] Lazy mount: portal & sheet DOM only created when open or opening state.
- [ ] Unmount on close (after animation) to avoid keeping hidden DOM elements.
- [ ] Minimal re-renders: avoid unnecessary renders during animation; isolate sheet logic from rest of app where possible.

---

## 📂 Files to Modify

- `packages/@dsai/react/src/components/Sheet/Sheet.tsx` — root component + logic (state, portal, open/close, animations, props handling)
- `packages/@dsai/react/src/components/Sheet/SheetHeader.tsx` — header sub-component (title, subtitle, close button)
- `packages/@dsai/react/src/components/Sheet/SheetBody.tsx` — body sub-component (scrollable region for content)
- `packages/@dsai/react/src/components/Sheet/SheetFooter.tsx` — footer sub-component (action buttons / controls)
- `packages/@dsai/react/src/components/Sheet/styles.css` (or `.scss`, or design-system theming file) — class definitions for `.sheet`, `.sheet-backdrop`, `.sheet-dialog`, placement/size modifiers, transition/animation styles.
- `packages/@dsai/react/src/utils/overlayManager.ts` — overlay stack manager and global registry for stacking / z-index / scroll-lock coordination.
- `packages/@dsai/react/src/utils/useFocusTrap.ts` — either reuse existing focus-trap infrastructure or implement / adapt one (e.g. using a lightweight utility or existing shared hook).
- `packages/@dsai/react/src/tests/Sheet/Sheet.test.tsx` — unit & integration tests covering state transitions, props, behaviors.
- `packages/@dsai/react/src/tests/Sheet/Sheet.a11y.test.tsx` — accessibility tests (keyboard behavior, ARIA, focus, screen reader expectations).
- `packages/@dsai/storybook/docs/components/Sheet.stories.tsx` — Storybook stories showing variants (placements, sizes, variants, nested overlays, responsive behavior).
- - `packages/@dsai/react/src/components/Sheet/README.md` — Full documentation

---

## 🔗 Dependencies

### Prerequisites

- Overlay / Portal / Scroll-lock / Focus-trap infrastructure (shared with existing modal system), or ability to build those as part of sheet module.
- Button/Icon component for close button (existing in design system).
- Theme / design-token system for colors, spacing, shadows, radii, etc.
- Z-index / layering utilities or conventions for overlay stacking.

### Blocks

- None beyond missing prerequisites for overlay and focus/trap infrastructure.
- Other overlay-related tasks (modal, drawer, sidebar) should reference this sheet when needing consistent overlay behavior.

---

## 🧪 Testing Requirements

- [ ] Unit tests for state-machine logic: transitions (open → opening → open → closing → closed), handling of invalid transitions, forced close, rapid toggles.
- [ ] Integration tests: full render, user interactions (backdrop click, close button, ESC key), size & placement variants, portal mount/unmount behavior.
- [ ] Accessibility tests: focus trap behavior, keyboard navigation (Tab, Shift+Tab, ESC), ARIA attributes, screen-reader semantics.
- [ ] Scroll lock tests: background scrolling disabled when sheet open; restored on close; correct behavior under stacking (multiple overlays).
- [ ] Performance checks: mounting/unmounting cost, animation smoothness, no memory leaks under repeated open/close cycles or stacking.

---

## 📖 Documentation Requirements

- [ ] Inline code comments for API parts, state-machine logic, edge-cases.
- [ ] Public API documentation (prop types/description, usage, examples).
- [ ] Storybook documentation with examples and usage guidelines.
- [ ] Usage guidance: when to use Sheet vs Modal vs Sidebar vs inline panel (layout), best practices, accessibility notes.
- [ ] Changelog / release note entry describing the new Sheet component, its API, backward-compatibility (if relevant), and migration guidance from any existing ad-hoc overlays.

---

## 🔄 Implementation Steps

1. [ ] Define TypeScript types (or PropTypes if JS) for API: props, events, variants, refs.
2. [ ] Build the fundamental component structure: portal, backdrop, dialog container, content wrapper.
3. [ ] Implement state-machine logic (internal or via a small FSM utility) — manage states and transitions as defined above.
4. [ ] Add placement + size logic + dynamic class assignment per placement & size modifiers.
5. [ ] Implement open/close behavior: reacting to `isOpen` prop or programmatic open/close, triggering transitions, mounting/unmounting, animations.
6. [ ] Hook up animations: slide-in/out + backdrop fade, with CSS transforms & transitions, respect `prefers-reduced-motion`.
7. [ ] Focus management & accessibility: trap focus, move focus on open, restore on close, ARIA attributes, keyboard handlers (ESC, Tab/Shift+Tab).
8. [ ] Scroll lock & overlay stacking logic: disable background scroll when any overlay is open, manage z-index stack, backdrop layering.
9. [ ] Implement optional features: variant modes, lifecycle callbacks (onBeforeOpen, onAfterClose, etc.), custom portal container.
10. [ ] Write unit tests for FSM and behavior, integration tests, accessibility tests.
11. [ ] Create Storybook stories covering all variants, edge-cases, nested overlays, mobile/desktop behaviors.
12. [ ] Write documentation (API, README or docs site, change log) and usage guidance for other teams.
13. [ ] Review, code review, polish CSS/styling, finalize transitions, ensure robustness under edge cases (rapid toggles, nested modals/drawers, theme changes).

---

## 📝 Notes / Considerations

- Implementing FSM or state-machine logic brings initial complexity, but drastically improves reliability, predictability, and maintainability of overlay behavior — especially as the UI layer grows. Many experienced developers and libraries consider state-charts/state-machines the best practice for complex UI components.
- Using transform-based animations (translate + opacity) ensures smooth, GPU-accelerated transitions without layout thrashing.
- Focus trap, scroll lock, ARIA attributes, and proper portal usage are non-negotiable for accessibility and a consistent user experience.
- For stacking overlays, an overlay-manager (global registry) helps avoid z-index conflicts, scroll/focus bleed, and ensures correct layering — especially when multiple sheets, modals, or drawers may be active.
- Provide hooks/events for consumers (e.g. `onBeforeClose`, `onAfterOpen`, etc.) to allow for cleanup, analytics, or orchestration logic in host application.

---

## ✅ Definition of Done

- [ ] All acceptance criteria satisfied.
- [ ] State-machine model implemented and tested.
- [ ] Code reviewed and approved by peer.
- [ ] Unit, integration, and accessibility tests pass.
- [ ] Storybook stories cover all major variants and edge cases.
- [ ] Public API documentation and usage guidelines complete.
- [ ] Change log / release notes updated.
- [ ] Deployed to staging, manual QA passed, ready for production use.

## Important Notes

**_What to Watch Out For — What Our Spec Must Do to Succeed:_**

- [ ] Implementation Complexity: building overlay manager + stacking + animations + focus + accessibility + theming + variant modes + FSM is non-trivial. Mistakes could lead to subtle bugs (scroll leaks, focus bugs, z-index conflicts, animation glitches).
- [ ] Maintenance Overhead: Because this is custom, we own everything — changes to design tokens, global styles, or layout might break the sheet. Documentation, tests, and governance will be vital.
- [ ] Performance Risk: If animations or overlay stacking aren’t optimized, repeated open/close cycles or many overlays could degrade performance. Must minimize re-renders, memory leaks, avoid layout thrash, use transforms only, etc.
- [ ] Consistency Across Teams: Teams might misuse or override styles, or diverge in custom variants — need strong guidelines and enforcement to maintain consistency.
- [ ] Accessibility is only as good as implementation: If any detail is missed (e.g. missing aria-labelledby, or focus trap fails), compliance breaks. Must include manual and automated a11y tests, plus perhaps screen-reader manual testing.
