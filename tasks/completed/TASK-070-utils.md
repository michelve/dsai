# Utils reference (a11y, browser, dom, keyboard, misc, number, string, types, validation)

## Accessibility (a11y)

- **announceToScreenReader(message, options?)**
  - Purpose: push a string into an offscreen `aria-live` region, defaulting to a polite live region and clearing text after `timeoutMs`.
  - Inputs/outputs: accepts `message: string` and optional `{ politeness?: 'polite' | 'assertive'; id?: string; timeoutMs?: number }`; returns `void` and no-ops when `document` is undefined (SSR guard).
  - Consumers: no in-repo component imports.
  - Tests/contracts: not covered; implicit contract is live-region cleanup after timeout.
- **focusableSelectors / focusableSelectorString**
  - Purpose: curated selector list plus CSV string for keyboard-focusable elements.
  - Inputs/outputs: exports `string[]` and joined selector string; used as defaults by focus management utilities.
  - Consumers: `Modal` uses selectors to seed a trap, Popover README references trapping; tests assert selector string includes buttons/tabindex.
  - Tests/contracts: `enterprise-utils.test.ts` verifies selector string content; focus wrapping behavior exercised indirectly through `trapFocus` usage in components.
- **generateId(prefix?)** (a11y version)
  - Purpose: incrementing counter-based ID generator for SSR-safe deterministic IDs.
  - Inputs/outputs: `prefix: string = 'id'` → returns `"<prefix>-<n>"`.
  - Consumers: no current imports.
  - Tests/contracts: not covered.
- **trapFocus(container, options?)**
  - Purpose: install keydown handler to keep focus within a container, optionally notifying on wrap.
  - Inputs/outputs: `container: HTMLElement`, optional `{ focusableSelectors?: string[]; onWrap?: () => void }`; returns cleanup function removing the listener; returns no-op when focusable list empty.
  - Consumers: `Modal` uses with `focusableSelectors` spread for portal content; Popover docs describe `trapFocus` prop though utility is not exported from a11y index.
  - Tests/contracts: no direct tests; modal/popup tests assert aria-modal behaviors when trapping is enabled.

## Browser environment

- **isBrowser()** (browser module)
  - Purpose: guard DOM-specific code paths by checking `window` and `document` presence.
  - Inputs/outputs: no args → boolean.
  - Consumers: no direct imports; components rely on the top-level `utils/isBrowser` instead.
  - Tests/contracts: `enterprise-utils.test.ts` compares to runtime environment; SSR safety implicit.
- **prefersReducedMotion()** (browser module)
  - Purpose: detect `prefers-reduced-motion` using `matchMedia` while remaining SSR-safe.
  - Inputs/outputs: no args → boolean; returns `false` when `window.matchMedia` missing.
  - Consumers: none; Scrollspy uses the top-level util variant.
  - Tests/contracts: `enterprise-utils.test.ts` deletes `matchMedia` to assert false fallback.

## DOM

- **mergeRefs<T>(refs)**
  - Purpose: combine multiple React refs (functions or mutable objects) into a single callback.
  - Inputs/outputs: array of refs → ref callback that assigns/invokes each; swallows assignment errors.
  - Consumers: `Accordion` forwards merged refs; also similar helper exposed in root utils index.
  - Tests/contracts: `enterprise-utils.test.ts` covers function and object ref composition.

## Keyboard

- **isEnterKey(event)** / **isEscapeKey(event)**
  - Purpose: normalize key detection across `key`/`keyCode` shapes.
  - Inputs/outputs: accepts `{ key?: string; keyCode?: number }` → boolean.
  - Consumers: none recorded.
  - Tests/contracts: `enterprise-utils.test.ts` asserts Enter/Escape detection via key and keyCode.

## Miscellaneous

- **ClearIcon**
  - Purpose: shared X/close icon component using `XIcon` for clear/remove affordances.
  - Inputs/outputs: returns `React.JSX.Element`; marked `aria-hidden`.
  - Consumers: `Input` clear button, `Select` clear action.
  - Tests/contracts: not directly tested.
- **getSafeInputProps(props)**
  - Purpose: whitelist-only filter for safe input attributes (blocks event handlers/unknown props).
  - Inputs/outputs: props record → filtered `SafeInputProps`; whitelist constant exported for stability checks.
  - Consumers: `Input` and `Checkbox` sanitize passthrough props.
  - Tests/contracts: `core-utils.test.ts` validates filtering and whitelist contents.
- **mapPlacement(placement)**
  - Purpose: map component placement props to Floating UI placements (currently pass-through).
  - Inputs/outputs: placement string → same string typed as `Placement`.
  - Consumers: `Dropdown`, `Popover`, `Tooltip` pass through to floating positioning.
  - Tests/contracts: none; behavior is identity mapping.
- **normalizeTriggers(trigger)**
  - Purpose: normalize trigger prop to array for floating components.
  - Inputs/outputs: trigger string or array → array.
  - Consumers: `Popover`, `Tooltip` normalize prop before wiring Floating UI hooks.
  - Tests/contracts: none.
- **selectAllEvent(enabled, totalEnabled)** / **toggleAllEvent(enabled, totalEnabled)** / **toggleItemEvent(value, totalEnabled)** / **clearAllEvent()**
  - Purpose: factory helpers for FSM selection events used by list/table/checkbox state machines.
  - Inputs/outputs: produce typed event objects containing values/rowIds and total enabled counts.
  - Consumers: CardList/Table/CheckboxGroup FSMs and public component indexes re-export them for external dispatch.
  - Tests/contracts: `core-utils.test.ts` ensures select/toggle events emit both stringified `enabledValues` and `enabledRowIds`; component FSM tests cover downstream reducers.

## Number

- **clamp(value, min, max)**
  - Purpose: constrain numeric input to provided bounds.
  - Inputs/outputs: numbers → bounded number.
  - Consumers: none; available for components.
  - Tests/contracts: `enterprise-utils.test.ts` covers upper/lower/within range.

## String

- **getVariantClass(variant, options?)**
  - Purpose: build Bootstrap-style variant class names with optional prefix/mapping.
  - Inputs/outputs: `variant: string`, optional `{ prefix?: string; map?: Record<string, string> }` → class string or '' when falsy variant.
  - Consumers: `Card` (prefix `card`), `Toast` (prefix `toast` or text backgrounds) compute variant classes.
  - Tests/contracts: none.

## Types / URLs

- **isExternalUrl(href?)**
  - Purpose: identify external links by protocol check (`http`/`https`).
  - Inputs/outputs: optional string → boolean.
  - Consumers: `Card`, `Breadcrumb`, `ListGroup` use to decide `target`/`rel` behavior.
  - Tests/contracts: not covered.

## Validation / URL safety

- **isSafeHref(href, options?)**
  - Purpose: block dangerous protocols (javascript:, data:, vbscript:, file:, about:blank, text/html) with optional strictness for undefined.
  - Inputs/outputs: `href?: string`, optional `{ undefinedBehavior?: 'safe' | 'unsafe' }` → boolean after decoding/trim.
  - Consumers: `Alert`, `Breadcrumb`, `Card`, `ListGroup` sanitize links; defaults allow undefined, some callers request strict.
  - Tests/contracts: `core-utils.test.ts` covers blocked protocols, encoded payloads, and undefined behavior.
- **isValidHref(href, options?)**
  - Purpose: similar blocked-protocol guard used by nav-like components; same undefined behavior toggle.
  - Inputs/outputs: string or undefined → boolean.
  - Consumers: `Navbar`, `Dropdown` validate link props.
  - Tests/contracts: `core-utils.test.ts` shares blocked-protocol/undefined coverage with `isSafeHref`.
- **isValidEmail(value)**
  - Purpose: pragmatic email validation with length and label checks.
  - Inputs/outputs: string/nullable → boolean.
  - Consumers: none yet.
  - Tests/contracts: `enterprise-utils.test.ts` verifies valid/invalid cases.
- **isValidUrl(href, options?)**
  - Purpose: URL parser that enforces allowed schemes and optional hostname allow/block lists.
  - Inputs/outputs: string/nullable plus `{ allowedSchemes?, allowHostnames?, blockHostnames? }` → boolean; catches parsing failures.
  - Consumers: none.
  - Tests/contracts: `enterprise-utils.test.ts` covers allowed http/https, rejects ftp/invalid strings.

## SSR and accessibility assumptions

- DOM-touching helpers guard SSR: `announceToScreenReader` returns early when `document` is undefined; browser utilities check `window`/`document`; `prefersReducedMotion` returns `false` without `matchMedia`; `Modal` invokes `trapFocus` only when mounted in the browser.
- Focus management: `trapFocus` uses configurable selector lists (defaults plus `focusableSelectors`) and returns a cleanup function; Popover/Modal treat trapped focus as modal behavior (tests assert `aria-modal`).
- Live-region accessibility: `announceToScreenReader` creates/updates an offscreen `aria-live` container and clears text post-timeout to avoid chatter.

## Reference map

| Utility                               | Purpose                                   | Consumers                          | Tests                              |
| ------------------------------------- | ----------------------------------------- | ---------------------------------- | ---------------------------------- |
| announceToScreenReader                | Live region announcements                 | (none)                             | (none)                             |
| focusableSelectors/string             | Focusable element selectors               | Modal (focus trap setup)           | enterprise-utils                   |
| generateId (a11y)                     | Incrementing IDs                          | (none)                             | (none)                             |
| trapFocus                             | Focus trap + wrap callback                | Modal (runtime); Popover docs      | (indirect via component behavior)  |
| isBrowser (browser module)            | SSR guard                                 | (none; components use root util)   | enterprise-utils                   |
| prefersReducedMotion (browser module) | Reduced motion detection                  | (none; Scrollspy uses root util)   | enterprise-utils                   |
| mergeRefs (dom)                       | Compose refs                              | Accordion                          | enterprise-utils                   |
| isEnterKey / isEscapeKey              | Key detection helpers                     | (none)                             | enterprise-utils                   |
| ClearIcon                             | Clear/close icon                          | Input, Select                      | (none)                             |
| getSafeInputProps                     | Input prop whitelist                      | Input, Checkbox                    | core-utils                         |
| mapPlacement                          | Placement passthrough                     | Dropdown, Popover, Tooltip         | (none)                             |
| normalizeTriggers                     | Normalize trigger prop                    | Popover, Tooltip                   | (none)                             |
| selectAllEvent                        | FSM select-all payload                    | CardList, Table                    | core-utils (+ component FSM tests) |
| toggleAllEvent                        | FSM toggle-all payload                    | CheckboxGroup, Table               | core-utils (+ component FSM tests) |
| toggleItemEvent                       | FSM toggle item payload                   | CardList, CheckboxGroup            | (component FSM tests)              |
| clearAllEvent                         | FSM clear payload                         | CardList, Table                    | core-utils (+ component FSM tests) |
| clamp                                 | Number bounding                           | (none)                             | enterprise-utils                   |
| getVariantClass                       | Variant class builder                     | Card, Toast                        | (none)                             |
| isExternalUrl                         | External link detection                   | Card, Breadcrumb, ListGroup        | (none)                             |
| isSafeHref                            | Protocol guard (safe links)               | Alert, Breadcrumb, Card, ListGroup | core-utils                         |
| isValidHref                           | Protocol guard (nav links)                | Navbar, Dropdown                   | core-utils                         |
| isValidEmail                          | Email validation                          | (none)                             | enterprise-utils                   |
| isValidUrl                            | URL validation with scheme/host filtering | (none)                             | enterprise-utils                   |
