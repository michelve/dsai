# Utility Readiness Criteria and Roadmap

## 1. Enterprise-Grade Acceptance Criteria
- **Type strictness**: All utilities expose fully typed inputs/outputs, prefer `readonly` props, discriminated unions for variants, and avoid implicit `any` or `unknown` returns. Publish d.ts bundles validated with `tsc --noEmit` against sample consumers.
- **SSR safety**: No direct `window`/`document`/`navigator` usage at module scope; guard access behind feature checks; provide noop fallbacks on the server and avoid side effects in top-level code so utilities remain tree-shakeable in SSR builds.
- **Accessibility guarantees**: Default behaviors must protect focus order, respect reduced-motion preferences, expose ARIA-friendly defaults for announcements, and document keyboard traps/escapes for any focus management helpers.
- **Input validation**: Validate external inputs and options, reject invalid configurations with descriptive errors, and normalize data to invariant internal shapes before work begins.
- **Side-effect isolation**: Pure utilities remain side-effect free; stateful helpers encapsulate mutations behind explicit functions with cleanup hooks (e.g., unsubscribe/teardown) and avoid shared mutable singletons.
- **Tree-shakeability**: Use ES modules, avoid dynamic requires, keep module-scope constants side-effect free, and mark pure helper paths with `/* #__PURE__ */` where appropriate to help bundlers drop unused code.

## 2. Test Additions by Utility Type
- **Positive/negative paths**: Cover happy paths with diverse inputs plus failure modes (invalid options, boundary values, unexpected types) asserting explicit error messages and no silent fallbacks.
- **SSR rendering checks**: Add tests that render utilities in SSR-like contexts (e.g., Jest environment without DOM or using `@testing-library/react` with `renderToString`) to ensure guards prevent crashes and fallbacks are returned.
- **Accessibility behaviors**: For focus utilities, verify focus trap setup/teardown, escape sequences (Escape/Tab/Shift+Tab), and announcement helpers firing `aria-live` updates with expected copy; include reduced-motion toggles where animations are involved.
- **Browser feature fallbacks**: Mock missing APIs (ResizeObserver, IntersectionObserver, matchMedia) to ensure graceful degradation, and assert that polyfill hooks or alternative code paths are invoked without throwing.

## 3. API Refinements and Deprecations
- **Naming and shape**: Use verb-first function names (`measureElement`, `waitForTransition`), keep arguments ordered from required to optional, prefer options objects for configurable helpers, and return tuples/objects with explicit keys instead of positional arrays.
- **Return types**: Standardize on `Result`-like objects for operations that can fail (`{ ok: boolean; value?: T; error?: Error }`) and promise-returning utilities should resolve deterministically without throwing except on programmer errors.
- **Deprecation paths**: Mark renamed exports with `@deprecated` JSDoc plus console warnings gated to development builds; supply migration shims that forward to new APIs, schedule removal in the next major, and document replacements in the CHANGELOG.

## 4. Priority Utility Candidates and Consumers
- **Async orchestration**: `waitForIdle`, `deferredEffect`, and retry/backoff helpers for data fetching; consumed by components with async flows (Toast loaders, Autocomplete, infinite lists).
- **Layout/measurement**: `measureElement`, `observeSize`, and `viewportInView` wrappers that abstract Resize/Intersection observers with SSR guards; consumed by Tooltip/Popover positioning, virtualized lists, and responsive layouts.
- **Keyboard/focus orchestration**: `focusTrap`, `focusScope`, `rovingIndex`, and announcement helpers; consumed by Dialog/Modal, Menu, Tabs, Carousel, and Combobox components to guarantee keyboard coverage.
- **Input normalization/validation**: Parsers for numbers, dates, and locale-aware text plus schema-based option validators; consumed by Form controls (Input, DatePicker, Select) to prevent invalid state propagation.
