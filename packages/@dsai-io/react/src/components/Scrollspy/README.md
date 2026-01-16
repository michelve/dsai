# Scrollspy

An accessible table-of-contents style navigation that highlights the section that is currently in view. The component relies on `IntersectionObserver`, manages its own finite-state machine, and exposes context helpers so you can build custom experiences.

## Highlights

- **IntersectionObserver powered**: no scroll listeners or throttling required.
- **Offset + sticky aware**: account for fixed headers by combining `offset`, `sticky`, and `stickyTop`.
- **Controlled or uncontrolled**: pass `activeId` or let the FSM manage active state with `defaultActiveId`.
- **Composable API**: use `Scrollspy.Link` or provide your own children; consume state via `useScrollspy` or `ScrollspyProvider`.
- **Security & a11y baked in**: target IDs are sanitized and links announce the current section with `aria-current="location"`.
- **Respects user motion prefs**: smooth scrolling is disabled when `prefers-reduced-motion` is on.

## Installation

```tsx
import { Scrollspy } from '@dsai-io/react';
```

## Basic usage

```tsx
const items = [
  { id: 'intro', label: 'Introduction', target: 'intro' },
  { id: 'features', label: 'Features', target: 'features' },
  { id: 'api', label: 'API', target: 'api' },
];

export function Page(): React.ReactElement {
  return (
    <div className="row">
      <aside className="col-3">
        <Scrollspy items={items} sticky stickyTop={80} aria-label="Page navigation" />
      </aside>
      <main className="col-9">
        <section id="intro">…</section>
        <section id="features">…</section>
        <section id="api">…</section>
      </main>
    </div>
  );
}
```

## Controlled vs uncontrolled

```tsx
const items = [
  /* … */
];

export function ControlledTOC(): React.ReactElement {
  const [activeId, setActiveId] = useState<string | null>('intro');

  return (
    <Scrollspy
      items={items}
      activeId={activeId}
      onActiveChange={setActiveId}
      smoothScroll={false}
    />
  );
}
```

`defaultActiveId` keeps the component uncontrolled but seeds the initial section. When `activeId` is supplied the component becomes controlled and only fires `onActiveChange`.

## Custom links & nested items

```tsx
const nestedItems = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    target: 'getting-started',
    children: [
      { id: 'installation', label: 'Installation', target: 'installation' },
      { id: 'quick-start', label: 'Quick Start', target: 'quick-start' },
    ],
  },
  { id: 'advanced', label: 'Advanced Topics', target: 'advanced' },
];

<Scrollspy items={nestedItems} />;

// Fully custom layout using Scrollspy.Link
<Scrollspy items={[]} aria-label="Custom navigation">
  <ul className="nav flex-column">
    <li className="nav-item">
      <Scrollspy.Link target="overview">Overview</Scrollspy.Link>
    </li>
    <li className="nav-item">
      <Scrollspy.Link target="faq">FAQ</Scrollspy.Link>
    </li>
  </ul>
</Scrollspy>;
```

## Sharing state with the provider

```tsx
import { ScrollspyProvider, Scrollspy, useScrollspy } from '@dsai-io/react';

function ActiveBadge(): React.ReactElement {
  const { activeId, scrollToSection } = useScrollspy();

  return (
    <div className="d-flex align-items-center gap-2">
      <span className="text-muted">Currently viewing:</span>
      <strong>{activeId ?? '—'}</strong>
      <button className="btn btn-link" onClick={() => scrollToSection('features')}>
        Jump to Features
      </button>
    </div>
  );
}

export function Page(): React.ReactElement {
  return (
    <ScrollspyProvider items={items}>
      <div className="row">
        <aside className="col-3">
          <Scrollspy items={items} />
        </aside>
        <main className="col-9">
          <ActiveBadge />
          {/* sections */}
        </main>
      </div>
    </ScrollspyProvider>
  );
}
```

## Props

### `Scrollspy`

| Prop                                 | Type                           | Default                                             | Notes                                                                                                                  |
| ------------------------------------ | ------------------------------ | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `items`                              | `ScrollspyItem[]`              | **required**                                        | List of navigation items (nested arrays supported).                                                                    |
| `offset`                             | `number`                       | `0`                                                 | Pixels subtracted from the viewport top before a section is considered “visible”. Helpful when you have fixed headers. |
| `rootMargin`                         | `string`                       | Derived from `offset` (`${-offset}px 0px -50% 0px`) | Overrides the IntersectionObserver root margin entirely.                                                               |
| `threshold`                          | `number \| number[]`           | `0`                                                 | Passed directly to `IntersectionObserver`.                                                                             |
| `smoothScroll`                       | `boolean`                      | `true`                                              | Controls whether link clicks call `window.scrollTo` with `behavior: 'smooth'`.                                         |
| `sticky`                             | `boolean`                      | `false`                                             | Adds `position-sticky` to the nav.                                                                                     |
| `stickyTop`                          | `number \| string`             | `0`                                                 | Applied as the CSS `top` when `sticky` is true. Accepts numbers (converted to px) or raw CSS values.                   |
| `activeId`                           | `string \| null`               | `undefined`                                         | Controlled active section. When provided the FSM won’t mutate `activeId`.                                              |
| `defaultActiveId`                    | `string \| null`               | `null`                                              | Initial value for uncontrolled mode.                                                                                   |
| `onActiveChange`                     | `(id: string \| null) => void` | `undefined`                                         | Fired whenever the active section changes, even in controlled mode.                                                    |
| `aria-label`                         | `string`                       | `'Page navigation'`                                 | Accessible name for the `<nav>` landmark. Ignored when `aria-labelledby` is supplied.                                  |
| `aria-labelledby`                    | `string`                       | `undefined`                                         | Reference an external heading instead of `aria-label`.                                                                 |
| `children`                           | `React.ReactNode`              | `undefined`                                         | Render custom content (`items` are ignored when provided).                                                             |
| `className`, `style`, `id`, `data-*` | —                              | —                                                   | Safe HTML attributes passed to the `<nav>`.                                                                            |

### `ScrollspyItem`

| Field      | Type              | Description                                                     |
| ---------- | ----------------- | --------------------------------------------------------------- |
| `id`       | `string`          | Unique identifier for React rendering (not used for scrolling). |
| `label`    | `string`          | Visible label rendered inside `Scrollspy.Link`.                 |
| `target`   | `string`          | ID (without `#`) of the section to observe and scroll to.       |
| `children` | `ScrollspyItem[]` | Optional nested sections that render as sub navigations.        |

### `Scrollspy.Link`

Accepts the safe HTML attributes plus:

| Prop     | Type      | Notes                                                                                |
| -------- | --------- | ------------------------------------------------------------------------------------ |
| `target` | `string`  | The section ID to scroll to. Run through the same sanitizer the main component uses. |
| `active` | `boolean` | Forcefully styles the link as active. Defaults to context state.                     |

## Accessibility

- Renders a semantic `<nav>` landmark with either `aria-label` or `aria-labelledby`.
- Active links receive `aria-current="location"` so screen readers announce the current section.
- Keyboard behavior mirrors native anchors (`Enter`/`Space` scroll the document) and scrolls the nearest scrollable container (or the window).
- Smooth scrolling is automatically downgraded to instant when the user prefers reduced motion.
- Developers are warned (in dev) when no accessible name is provided.

## Security

- Target IDs are sanitized and blocked if they start with `javascript:`, `data:`, `vbscript:`, or `file:`.
- Only a safe subset of HTML attributes is exposed—no prop spreading.
- No usage of `dangerouslySetInnerHTML`.

## FSM overview

Internally the component dispatches an FSM reducer defined in `Scrollspy.fsm.ts`:

- **State**: `{ activeId: string | null, visibleIds: string[], isObserving: boolean }`
- **Events**: `SECTION_ENTER`, `SECTION_LEAVE`, `SET_ACTIVE`, `START_OBSERVING`, `STOP_OBSERVING`, `RESET`

This FSM drives the `data-visual-state` attribute (`idle`, `tracking`, `scrolling`) so tests and dev tools can introspect behavior.

## Performance notes

- Only one `IntersectionObserver` instance is created per component.
- Observers disconnect on unmount to avoid memory leaks.
- Synchronous evaluation of `visibleIds` prevents flicker when multiple entries fire in a single callback.

## Browser support

Modern evergreen browsers with `IntersectionObserver` support (Chrome ≥ 51, Firefox ≥ 55, Safari ≥ 12.1, Edge ≥ 15). Add a polyfill if you must support older environments.
