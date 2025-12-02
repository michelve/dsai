# Accordion

A fully accessible accordion component using Bootstrap 5 native classes with smooth CSS transitions, keyboard navigation, and FSM-driven state management.

## Features

- **Native Bootstrap 5 Classes**: Uses standard Bootstrap accordion styling
- **Selection Modes**: Single (one panel at a time) or multiple (many panels open)
- **Smooth Animations**: CSS transitions for expand/collapse with FSM states
- **Keyboard Navigation**: Tab, Enter, Space support for accessibility
- **Flush Variant**: Edge-to-edge rendering without borders
- **Compound Components**: Accordion.Item, Accordion.Button, Accordion.Panel
- **FSM State Management**: Predictable state transitions for animations
- **Security**: Prop whitelisting, no dangerous attributes

## Installation

The Accordion component is part of the `@dsai/react` package:

```tsx
import { Accordion } from '@dsai/react';
```

## Usage

### Basic Accordion

```tsx
import { Accordion } from '@dsai/react';

function Example() {
  return (
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Button>Section 1</Accordion.Button>
        <Accordion.Panel>Content for section 1</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Button>Section 2</Accordion.Button>
        <Accordion.Panel>Content for section 2</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Button>Section 3</Accordion.Button>
        <Accordion.Panel>Content for section 3</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
```

### Default Expanded

```tsx
// Single mode: first item expanded
<Accordion defaultActiveKeys={['0']}>
  <Accordion.Item eventKey="0">
    <Accordion.Button>Expanded by Default</Accordion.Button>
    <Accordion.Panel>This panel is open initially.</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item eventKey="1">
    <Accordion.Button>Section 2</Accordion.Button>
    <Accordion.Panel>Content for section 2</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

### Multiple Selection Mode

```tsx
// Multiple items can be open at once ("Always Open" in Bootstrap)
<Accordion selectionMode="multiple" defaultActiveKeys={['0', '2']}>
  <Accordion.Item eventKey="0">
    <Accordion.Button>Section 1</Accordion.Button>
    <Accordion.Panel>This stays open when other panels are opened.</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item eventKey="1">
    <Accordion.Button>Section 2</Accordion.Button>
    <Accordion.Panel>Click to expand without closing section 1.</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item eventKey="2">
    <Accordion.Button>Section 3</Accordion.Button>
    <Accordion.Panel>Also initially expanded.</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

### Flush Variant

```tsx
// Removes borders and rounded corners for edge-to-edge layout
<Accordion flush>
  <Accordion.Item eventKey="0">
    <Accordion.Button>Flush Section 1</Accordion.Button>
    <Accordion.Panel>Edge-to-edge content with no border radius.</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item eventKey="1">
    <Accordion.Button>Flush Section 2</Accordion.Button>
    <Accordion.Panel>Perfect for sidebars and tight spaces.</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

### Controlled Mode

```tsx
import { useState } from 'react';
import { Accordion } from '@dsai/react';

function ControlledAccordion() {
  const [activeKeys, setActiveKeys] = useState<string[]>(['0']);

  return (
    <>
      <div className="mb-3">
        <button onClick={() => setActiveKeys(['0'])}>Open First</button>
        <button onClick={() => setActiveKeys(['1'])}>Open Second</button>
        <button onClick={() => setActiveKeys([])}>Close All</button>
      </div>
      <Accordion activeKeys={activeKeys} onActiveKeysChange={setActiveKeys}>
        <Accordion.Item eventKey="0">
          <Accordion.Button>Controlled Section 1</Accordion.Button>
          <Accordion.Panel>Controlled by external state.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Button>Controlled Section 2</Accordion.Button>
          <Accordion.Panel>State updates are handled externally.</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
```

### Disabled Items

```tsx
<Accordion>
  <Accordion.Item eventKey="0">
    <Accordion.Button>Enabled Section</Accordion.Button>
    <Accordion.Panel>This panel can be toggled.</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item eventKey="1" disabled>
    <Accordion.Button>Disabled Section</Accordion.Button>
    <Accordion.Panel>This panel cannot be expanded.</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

### With Icons and Custom Content

```tsx
import { ChevronRightIcon, StarIcon, GearIcon } from '@dsai/react';

<Accordion>
  <Accordion.Item eventKey="0">
    <Accordion.Button>
      <StarIcon className="me-2" />
      Favorites
    </Accordion.Button>
    <Accordion.Panel>Your favorite items go here.</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item eventKey="1">
    <Accordion.Button>
      <GearIcon className="me-2" />
      Settings
    </Accordion.Button>
    <Accordion.Panel>Configure your preferences.</Accordion.Panel>
  </Accordion.Item>
</Accordion>;
```

### Event Callbacks

```tsx
<Accordion
  onItemExpand={(eventKey) => console.log(`Expanded: ${eventKey}`)}
  onItemCollapse={(eventKey) => console.log(`Collapsed: ${eventKey}`)}
>
  <Accordion.Item eventKey="0">
    <Accordion.Button>Section with Events</Accordion.Button>
    <Accordion.Panel>Open/close to see console logs.</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

### Nested Content

```tsx
<Accordion>
  <Accordion.Item eventKey="0">
    <Accordion.Button>Rich Content Example</Accordion.Button>
    <Accordion.Panel>
      <h5>Nested Heading</h5>
      <p>Paragraphs of content with full HTML support.</p>
      <ul>
        <li>List item 1</li>
        <li>List item 2</li>
        <li>List item 3</li>
      </ul>
      <button className="btn btn-primary">Nested Button</button>
    </Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

## API Reference

### Accordion Props

| Prop                 | Type                             | Default    | Description                        |
| -------------------- | -------------------------------- | ---------- | ---------------------------------- |
| `children`           | `ReactNode`                      | -          | AccordionItem components           |
| `selectionMode`      | `'single' \| 'multiple'`         | `'single'` | Selection behavior                 |
| `activeKeys`         | `string[]`                       | -          | Controlled active keys             |
| `onActiveKeysChange` | `(activeKeys: string[]) => void` | -          | Callback when active keys change   |
| `defaultActiveKeys`  | `string[]`                       | `[]`       | Default active keys (uncontrolled) |
| `flush`              | `boolean`                        | `false`    | Edge-to-edge variant               |
| `onItemExpand`       | `(eventKey: string) => void`     | -          | Callback when an item is expanded  |
| `onItemCollapse`     | `(eventKey: string) => void`     | -          | Callback when an item is collapsed |
| `className`          | `string`                         | -          | Additional class name              |
| `style`              | `CSSProperties`                  | -          | Inline styles                      |
| `id`                 | `string`                         | -          | Container ID                       |
| `data-testid`        | `string`                         | -          | Test ID                            |

### Accordion.Item Props

| Prop          | Type            | Default | Description                        |
| ------------- | --------------- | ------- | ---------------------------------- |
| `children`    | `ReactNode`     | -       | AccordionButton and AccordionPanel |
| `eventKey`    | `string`        | -       | Unique identifier for this item    |
| `disabled`    | `boolean`       | `false` | Disable expand/collapse            |
| `className`   | `string`        | -       | Additional class name              |
| `style`       | `CSSProperties` | -       | Inline styles                      |
| `id`          | `string`        | -       | Item ID                            |
| `data-testid` | `string`        | -       | Test ID                            |

### Accordion.Button Props

| Prop          | Type                             | Default | Description           |
| ------------- | -------------------------------- | ------- | --------------------- |
| `children`    | `ReactNode`                      | -       | Button content        |
| `onClick`     | `(event: MouseEvent) => void`    | -       | Click handler         |
| `onKeyDown`   | `(event: KeyboardEvent) => void` | -       | Keyboard handler      |
| `className`   | `string`                         | -       | Additional class name |
| `style`       | `CSSProperties`                  | -       | Inline styles         |
| `id`          | `string`                         | -       | Button ID             |
| `data-testid` | `string`                         | -       | Test ID               |

### Accordion.Panel Props

| Prop          | Type            | Default | Description           |
| ------------- | --------------- | ------- | --------------------- |
| `children`    | `ReactNode`     | -       | Panel content         |
| `className`   | `string`        | -       | Additional class name |
| `style`       | `CSSProperties` | -       | Inline styles         |
| `id`          | `string`        | -       | Panel ID              |
| `data-testid` | `string`        | -       | Test ID               |

## Accessibility

The Accordion component follows WAI-ARIA Accordion pattern (WCAG 2.2 AA):

- **Semantic Structure**: Uses native `<button>` elements for triggers
- **ARIA Attributes**:
  - Buttons have `aria-expanded` to indicate state
  - Buttons have `aria-controls` pointing to their panel
  - Panels have `role="region"` and `aria-labelledby` pointing to their button
- **Disabled State**: Buttons have `aria-disabled="true"` when disabled
- **Visual State**: `data-visual-state` attribute reflects FSM state

### Keyboard Shortcuts

| Key               | Action                             |
| ----------------- | ---------------------------------- |
| `Tab`             | Move focus between buttons         |
| `Enter` / `Space` | Toggle current panel               |
| `Arrow Down`      | (Optional) Move to next button     |
| `Arrow Up`        | (Optional) Move to previous button |

### Screen Reader Announcements

- Button announces its label and current expanded/collapsed state
- Panel content is associated with the button via `aria-labelledby`
- State changes are announced automatically through `aria-expanded`

## Security

The Accordion component includes security features:

- **Prop Whitelisting**: Only safe props are passed to DOM elements
  - `className`, `style`, `id`, `data-testid`, `data-test`
- **No Dangerous Attributes**: Event handlers like `onLoad`, `onError` are blocked
- **No Prop Spreading**: No unrestricted `...props` spread to DOM
- **No dangerouslySetInnerHTML**: Content is safely rendered through React

### Safe Attributes Interface

```tsx
interface SafeAccordionHTMLAttributes {
  className?: string;
  style?: CSSProperties;
  id?: string;
  'data-testid'?: string;
  'data-test'?: string;
}
```

## FSM States

The Accordion uses a finite state machine for predictable panel transitions:

| State        | Description                              |
| ------------ | ---------------------------------------- |
| `collapsed`  | Panel is fully hidden                    |
| `expanding`  | Panel is animating open (CSS transition) |
| `expanded`   | Panel is fully visible                   |
| `collapsing` | Panel is animating closed                |

### Visual State Attribute

Each item exposes its visual state via `data-visual-state`:

```html
<div class="accordion-item" data-visual-state="expanded">...</div>
```

This can be used for custom styling or testing:

```css
[data-visual-state='expanding'] .accordion-body {
  /* Custom animation overrides */
}
```

## Performance

The Accordion component is optimized for performance:

- **React.memo**: Button and Panel components are memoized
- **useCallback**: Event handlers are stable across renders
- **useMemo**: Class name computations are memoized
- **Context Splitting**: Accordion and Item contexts are separate to minimize re-renders
- **CSS Transitions**: Animations use GPU-accelerated CSS, not JavaScript

## Related Components

- [Card](../Card/README.md) - For static content containers
- [Modal](../Modal/README.md) - For dialog content that requires attention
- [Dropdown](../Dropdown/README.md) - For action menus
