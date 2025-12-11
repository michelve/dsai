# DSAi Utilities Architecture & Delivery Plan

## Objectives and quality bar

- Establish a comprehensive, enterprise-grade utilities layer that exceeds the rigor of mature systems (Material UI, Redux utilities, Carbon, Ant Design) with stronger guarantees around security, resilience, and observability.
- Provide predictable, pure, and side-effect-free helpers wherever possible; when side effects are required (e.g., timers, DOM access), isolate them and guard for SSR/Edge environments.
- Maintain strict TypeScript typing (no implicit `any`), exhaustive input validation, and defensive coding against XSS, timing attacks, and data leakage.
- Favor composability and tree-shakeable modules so consumers only pay for the code they import.
- Treat reliability as a first-class outcome: aim for zero unhandled promise rejections, zero unsafe mutations, and documented fallbacks for every external dependency (Intl, DOM, crypto, storage APIs).

## Scope and priorities

1. **Stabilize current exports**: harden `cn`, `generateId`, `isBrowser`, `prefersReducedMotion`, `clamp`, `mergeRefs` with input validation, SSR guards, and documentation.
2. **Implement commented TODO utilities** with production-ready parity:
   - Date/time: `formatDate`, `formatRelativeTime` with locale/time-zone awareness and fallbacks for Intl-less environments.
   - Numbers: `formatCurrency`, `formatNumber` supporting locales, rounding modes, compact notation, safe handling of `NaN`/`Infinity`.
   - Strings: `truncate`, `capitalize`, `slugify` with Unicode safety and script-awareness (combining marks, RTL, emoji handling).
   - Timing: `debounce`, `throttle` with leading/trailing options, cancellation, max-wait, and SSR-safe timers.
   - Objects: `deepMerge`, `pick`, `omit` supporting readonly inputs, circular guardrails, and predictable merge strategies.
3. **Fill critical gaps for a design system** (phased after TODOs):
   - **Accessibility & interactions**: focus trap helpers, ARIA attribute builders, keyboard navigation maps, reduced-motion aware animations.
   - **Color & theming**: contrast checking, token-to-css-variable helpers, color conversion (hex/rgb/hsl), safe luminance calculations.
   - **Async and control-flow**: retry with backoff/jitter, task queue utilities for animations/transitions, cancellation-friendly promises.
   - **Data safety**: input sanitizers for URLs and HTML fragments, clipboard-safe helpers, and secure random token helpers.
   - **Collections**: stable sort, unique-by, chunking/pagination, memoized selectors for derived data.
   - **Layout & measurements**: viewport/element measurement wrappers with ResizeObserver guards and requestAnimationFrame scheduling.
   - **Telemetry hooks**: lightweight perf timing helpers and error boundary-friendly wrappers (no hard dependency on specific loggers).

## Architectural guidelines

- **Module structure**: keep utilities in focused subfolders (`date`, `number`, `string`, `timing`, `object`, `a11y`, `browser`, etc.) with index barrels for discoverability. Avoid deep re-export chains that hinder tree-shaking.
- **Purity and referential transparency**: prefer pure functions; any mutable/shared state must be encapsulated and documented. Avoid hidden globals.
- **Environment safety**: guard DOM/Browser APIs with `isBrowser` checks; provide no-op fallbacks for SSR/Edge. Prefer `globalThis` references with feature detection.
- **Error handling**: fail fast with descriptive errors for programmer misuse; return `Result`-style objects or typed errors for recoverable issues. Never throw on user input without validation.
- **i18n and locale handling**: centralize locale resolution; expose options to override defaults and inject polyfills. Ensure deterministic behavior when Intl APIs are unavailable.
- **Performance**: design APIs to be allocation-aware; reuse memoized formatters where safe. Include benchmarking hooks for heavy utilities (e.g., deep merges).
- **Security**: validate and sanitize inputs for URL, HTML, and string utilities; avoid `eval`/`Function`; prefer allow-lists over block-lists; document trust boundaries.
- **Dependency discipline**: utilities should remain dependency-light. Any third-party addition requires justification, audit for bundle impact, and security review.
- **Versioning & compatibility**: mark breaking changes clearly, provide migration notes, and avoid leaking unstable signatures through the package root.
- **Governance & reviews**: every new utility requires a lightweight ADR (architecture decision record) capturing intent, alternatives, expected contracts, and observability hooks. Enforce pair-review for security-sensitive helpers and require sign-off from design system owners for API surface changes.
- **Availability & SLOs**: set operational goals (e.g., 99.99% availability target for utility behavior consistency across supported browsers/regions) and codify acceptance in CI checks (cross-browser snapshots, locale parity tests).
- **Backward compatibility**: provide feature flags or staged rollouts for behavior changes; publish deprecation schedules and migration codemods when breaking changes are unavoidable.

## Implementation plan

1. **Foundation hardening**
   - Add unit tests and docs for existing exports; enforce SSR guards and deterministic IDs for testing.
   - Introduce shared types (e.g., `FormatterOptions`, `ThrottleOptions`) under `utils/types` to reduce duplication.
2. **Date/number/string utilities**
   - Build wrapper formatters using `Intl` with polyfill-friendly adapters; include caching keyed by locale/options.
   - Implement Unicode-aware string helpers using `Intl.Segmenter` when available and robust fallbacks otherwise.
3. **Timing and async controls**
   - Provide debounced/throttled versions with cancellation tokens; document edge cases (rapid fire, long idle). Ensure no timer leaks.
4. **Object and data helpers**
   - Implement immutable-friendly `deepMerge` with configurable strategies (overwrite, merge arrays, replace primitives). Ensure cycle detection.
   - Ship `pick`/`omit` with literal key inference and readonly preservation.
5. **A11y, color, and layout utilities**
   - Add contrast and focus management utilities aligned with WCAG; integrate with existing `a11y` and `browser` modules.
   - Provide measurement utilities that degrade gracefully without DOM.
6. **Security & resilience**
   - Add input sanitizers and URL validators; ensure any clipboard or storage helpers encode/escape properly.
   - Create a `security.md` checklist in the utilities folder to gate new additions.
7. **Documentation & demos**
   - Generate usage guides in `guidelines/` with code samples and decision records for complex APIs (e.g., merge strategies).
   - Add Storybook/MDX snippets where utilities influence component behavior (e.g., focus traps, animation helpers).

## Testing, quality, and release checks

- **Testing**: 100% statement/branch coverage for utilities; property-based tests for pure functions; contract tests for formatter determinism under different locales/time zones; SSR smoke tests. Cross-browser test matrix must include latest 2 major versions of Chromium, Firefox, Safari; mobile WebKit must be spot-checked for DOM-dependent helpers.
- **Static analysis**: strict TypeScript, ESLint/biome rules aligned with repo standards; ban implicit `any`; ensure side-effect-free entrypoints for tree-shaking. Add dependency vulnerability scans (npm audit or equivalent) in CI gates.
- **Performance**: micro-benchmarks for hot-path utilities (string/number formatting, deepMerge). Include safeguards for pathological inputs and publish perf budgets per package (e.g., <2 KB per helper when min+gzip, <1 ms median execution for hot-paths in benchmarks).
- **Security & compliance**: apply a repeatable threat model per utility category (input validation, encoding/escaping, timing side-channel mitigation). Require secure defaults (e.g., URL sanitization uses allow-list schemes) and document supported compliance needs (SOC 2 controls for change management; OWASP ASVS L2 alignment for input-processing utilities).
- **Documentation completeness**: every export needs JSDoc, usage examples, and migration notes when relevant. Public APIs must declare stability level (stable/experimental/internal) and compatibility guarantees (browser versions, Node/Edge runtimes).
- **Release gating**: utilities must pass security review (dependency audit + sanitizer checks), bundle size checks, backward-compatibility validation, and observability checks (log/metric hooks verified) before export is uncommented in `src/utils/index.ts`.
- **Resilience verification**: chaos tests for timing utilities (e.g., clock skew, timer clamping), fault-injection tests for Intl/polyfill absence, and fuzzing for string/object helpers to prevent crashes.

## Milestones

1. **M0 (stabilize)**: tests/docs for current exports, add shared types, create security checklist.
2. **M1 (core TODOs)**: deliver date/number/string/timing/object utilities with full test + docs; enable exports in `src/utils/index.ts`.
3. **M2 (design-system gaps)**: ship a11y, color, layout, async helpers; integrate with tokens and component packages where needed.
4. **M3 (hardening & scalability)**: performance benchmarks, telemetry hooks, API audits, and formalize contribution guidelines for utilities.

## Enterprise readiness scoring (target ≥96/100)

- **Security (25 pts)**: threat models completed; sanitization defaults enabled; zero high/critical vulnerabilities; SSR/Edge guards in place.
- **Stability (20 pts)**: 100% coverage with property-based tests where applicable; deterministic outputs across locale/time-zone matrices; no unhandled rejections.
- **Performance (15 pts)**: meets published perf budgets; no unbounded recursion; benchmarks tracked per release.
- **Compatibility (10 pts)**: documented support matrix; progressive enhancement with graceful degradation; feature-detection first.
- **Accessibility (10 pts)**: a11y helpers validated against WCAG AA/AAA targets; keyboard/focus utilities tested in screen readers where relevant.
- **Observability (10 pts)**: optional hooks for logging/metrics; error surfaces carry actionable context; redaction applied to sensitive values.
- **DX & Documentation (10 pts)**: ADRs for new utilities; JSDoc completeness; playground/Storybook examples for behavioral utilities.
