# Navbar

A fully accessible responsive navigation header component using Bootstrap 5 native classes with smooth collapse animations, keyboard navigation, and FSM-driven state management.

## Features

- **Native Bootstrap 5 Classes**: Uses standard Bootstrap navbar styling
- **Responsive Design**: Configurable breakpoint for mobile/desktop layouts
- **Smooth Animations**: CSS transitions for collapse/expand with FSM states
- **Keyboard Navigation**: Tab, Enter, Space support for accessibility
- **Color Variants**: Light and dark color schemes with customizable backgrounds
- **Compound Components**: Navbar.Brand, Navbar.Toggle, Navbar.Collapse, Navbar.Nav, Navbar.Link, Navbar.Item, Navbar.Text
- **FSM State Management**: Predictable state transitions for animations
- **Security**: Prop whitelisting, href validation, XSS protection
- **Controlled & Uncontrolled**: Flexible state management options

## Installation

The Navbar component is part of the `@dsai/react` package:

```tsx
import { Navbar } from '@dsai/react';
```

## Usage

### Basic Navbar

```tsx
import { Navbar } from '@dsai/react';

function Example() {
  return (
    <Navbar>
      <Navbar.Brand href="#">Brand</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Nav>
          <Navbar.Link href="#" active>
            Home
          </Navbar.Link>
          <Navbar.Link href="#">Features</Navbar.Link>
          <Navbar.Link href="#">Pricing</Navbar.Link>
          <Navbar.Link href="#" disabled>
            Disabled
          </Navbar.Link>
        </Navbar.Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
```

### With Logo

```tsx
<Navbar>
  <Navbar.Brand href="#">
    <img src="/logo.svg" alt="Logo" width="30" height="24" className="me-2" />
    Company Name
  </Navbar.Brand>
  <Navbar.Toggle />
  <Navbar.Collapse>
    <Navbar.Nav>
      <Navbar.Link href="#" active>
        Home
      </Navbar.Link>
      <Navbar.Link href="#">Products</Navbar.Link>
    </Navbar.Nav>
  </Navbar.Collapse>
</Navbar>
```

### Dark Variant

```tsx
<Navbar variant="dark" bg="dark">
  <Navbar.Brand href="#">Dark Navbar</Navbar.Brand>
  <Navbar.Toggle />
  <Navbar.Collapse>
    <Navbar.Nav>
      <Navbar.Link href="#" active>
        Home
      </Navbar.Link>
      <Navbar.Link href="#">About</Navbar.Link>
    </Navbar.Nav>
  </Navbar.Collapse>
</Navbar>
```

### Color Variants

```tsx
// Primary background
<Navbar variant="dark" bg="primary">
  <Navbar.Brand href="#">Primary</Navbar.Brand>
  {/* ... */}
</Navbar>

// Success background
<Navbar variant="dark" bg="success">
  <Navbar.Brand href="#">Success</Navbar.Brand>
  {/* ... */}
</Navbar>

// Warning background (use light variant)
<Navbar variant="light" bg="warning">
  <Navbar.Brand href="#">Warning</Navbar.Brand>
  {/* ... */}
</Navbar>
```

### Responsive Breakpoints

```tsx
// Expand at small screens (≥576px)
<Navbar expand="sm">...</Navbar>

// Expand at medium screens (≥768px)
<Navbar expand="md">...</Navbar>

// Expand at large screens (≥992px) - default
<Navbar expand="lg">...</Navbar>

// Always collapsed (hamburger menu)
<Navbar expand={false}>...</Navbar>

// Never collapses (always horizontal)
<Navbar expand={true}>...</Navbar>
```

### Default Expanded

```tsx
// Menu is expanded by default (uncontrolled)
<Navbar defaultExpanded>
  <Navbar.Brand href="#">Brand</Navbar.Brand>
  <Navbar.Toggle />
  <Navbar.Collapse>
    <Navbar.Nav>
      <Navbar.Link href="#" active>
        Home
      </Navbar.Link>
    </Navbar.Nav>
  </Navbar.Collapse>
</Navbar>
```

### Controlled Mode

```tsx
import { useState } from 'react';
import { Navbar } from '@dsai/react';

function ControlledNavbar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="mb-3">
        <button onClick={() => setExpanded(true)}>Open Menu</button>
        <button onClick={() => setExpanded(false)}>Close Menu</button>
      </div>
      <Navbar expanded={expanded} onExpandedChange={setExpanded}>
        <Navbar.Brand href="#">Controlled</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Nav>
            <Navbar.Link href="#" active>
              Home
            </Navbar.Link>
            <Navbar.Link href="#">Features</Navbar.Link>
          </Navbar.Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}
```

### With Search Form

```tsx
<Navbar>
  <Navbar.Brand href="#">Brand</Navbar.Brand>
  <Navbar.Toggle />
  <Navbar.Collapse>
    <Navbar.Nav>
      <Navbar.Link href="#" active>
        Home
      </Navbar.Link>
      <Navbar.Link href="#">Link</Navbar.Link>
    </Navbar.Nav>
    <form className="d-flex ms-auto" role="search">
      <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
      <button className="btn btn-outline-success" type="submit">
        Search
      </button>
    </form>
  </Navbar.Collapse>
</Navbar>
```

### With Navbar.Text

```tsx
<Navbar>
  <Navbar.Brand href="#">Brand</Navbar.Brand>
  <Navbar.Toggle />
  <Navbar.Collapse>
    <Navbar.Nav>
      <Navbar.Link href="#" active>
        Home
      </Navbar.Link>
    </Navbar.Nav>
    <Navbar.Text className="ms-auto">
      Signed in as: <a href="#">Mark Otto</a>
    </Navbar.Text>
  </Navbar.Collapse>
</Navbar>
```

### With Dropdown

```tsx
import { Navbar, Dropdown } from '@dsai/react';

<Navbar>
  <Navbar.Brand href="#">Brand</Navbar.Brand>
  <Navbar.Toggle />
  <Navbar.Collapse>
    <Navbar.Nav>
      <Navbar.Link href="#" active>
        Home
      </Navbar.Link>
      <Navbar.Item dropdown>
        <Dropdown>
          <Dropdown.Toggle variant="link" className="nav-link">
            Dropdown
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#">Action</Dropdown.Item>
            <Dropdown.Item href="#">Another action</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="#">Something else</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar.Item>
    </Navbar.Nav>
  </Navbar.Collapse>
</Navbar>;
```

### Container Options

```tsx
// Full-width container (default)
<Navbar fluid>...</Navbar>

// Fixed-width container
<Navbar fluid={false}>...</Navbar>

// Specific breakpoint container
<Navbar fluid={false} container="md">...</Navbar>
```

### Placement Options

```tsx
// Fixed to top
<Navbar placement="fixed-top">...</Navbar>

// Fixed to bottom
<Navbar placement="fixed-bottom">...</Navbar>

// Sticky top
<Navbar placement="sticky-top">...</Navbar>
```

### External Links

```tsx
// External links automatically get rel="noopener noreferrer"
<Navbar>
  <Navbar.Brand href="#">Brand</Navbar.Brand>
  <Navbar.Toggle />
  <Navbar.Collapse>
    <Navbar.Nav>
      <Navbar.Link href="https://github.com" target="_blank">
        GitHub ↗
      </Navbar.Link>
    </Navbar.Nav>
  </Navbar.Collapse>
</Navbar>
```

### With Callback

```tsx
<Navbar
  onExpandedChange={(expanded) => {
    console.log(`Menu ${expanded ? 'opened' : 'closed'}`);
  }}
>
  <Navbar.Brand href="#">Brand</Navbar.Brand>
  <Navbar.Toggle />
  <Navbar.Collapse>
    <Navbar.Nav>
      <Navbar.Link href="#" active>
        Home
      </Navbar.Link>
    </Navbar.Nav>
  </Navbar.Collapse>
</Navbar>
```

### Scrolling Nav

```tsx
// For long navigation lists with scroll
<Navbar>
  <Navbar.Brand href="#">Brand</Navbar.Brand>
  <Navbar.Toggle />
  <Navbar.Collapse>
    <Navbar.Nav scroll scrollHeight="200px">
      <Navbar.Link href="#">Link 1</Navbar.Link>
      <Navbar.Link href="#">Link 2</Navbar.Link>
      {/* ... many more links */}
    </Navbar.Nav>
  </Navbar.Collapse>
</Navbar>
```

## API Reference

### Navbar Props

| Prop               | Type                                               | Default             | Description                                    |
| ------------------ | -------------------------------------------------- | ------------------- | ---------------------------------------------- |
| `children`         | `ReactNode`                                        | -                   | Navbar content (Brand, Toggle, Collapse, etc.) |
| `expand`           | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl' \| boolean` | `'lg'`              | Breakpoint at which navbar expands             |
| `variant`          | `'light' \| 'dark'`                                | `'light'`           | Color scheme variant                           |
| `bg`               | `NavbarBackground`                                 | `'body-tertiary'`   | Background color                               |
| `placement`        | `NavbarPlacement`                                  | `'static'`          | Navbar positioning                             |
| `fluid`            | `boolean`                                          | `true`              | Use container-fluid (full-width)               |
| `container`        | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'`            | -                   | Container breakpoint (when fluid=false)        |
| `expanded`         | `boolean`                                          | -                   | Controlled expanded state                      |
| `onExpandedChange` | `(expanded: boolean) => void`                      | -                   | Callback when expanded state changes           |
| `defaultExpanded`  | `boolean`                                          | `false`             | Default expanded state (uncontrolled)          |
| `aria-label`       | `string`                                           | `'Main navigation'` | Accessible label for the navigation            |
| `className`        | `string`                                           | -                   | Additional class name                          |
| `style`            | `CSSProperties`                                    | -                   | Inline styles                                  |
| `id`               | `string`                                           | -                   | Container ID                                   |
| `data-testid`      | `string`                                           | -                   | Test ID                                        |

### Navbar.Brand Props

| Prop          | Type                                         | Default | Description                            |
| ------------- | -------------------------------------------- | ------- | -------------------------------------- |
| `children`    | `ReactNode`                                  | -       | Brand content (text, logo, or both)    |
| `href`        | `string`                                     | -       | URL to navigate to (renders as anchor) |
| `target`      | `'_self' \| '_blank' \| '_parent' \| '_top'` | -       | Link target attribute                  |
| `rel`         | `string`                                     | -       | Link rel attribute                     |
| `onClick`     | `(event: MouseEvent) => void`                | -       | Click handler                          |
| `className`   | `string`                                     | -       | Additional class name                  |
| `style`       | `CSSProperties`                              | -       | Inline styles                          |
| `data-testid` | `string`                                     | -       | Test ID                                |

### Navbar.Toggle Props

| Prop          | Type                          | Default               | Description                              |
| ------------- | ----------------------------- | --------------------- | ---------------------------------------- |
| `children`    | `ReactNode`                   | -                     | Custom content (replaces hamburger icon) |
| `onClick`     | `(event: MouseEvent) => void` | -                     | Click handler                            |
| `aria-label`  | `string`                      | `'Toggle navigation'` | Accessible label                         |
| `className`   | `string`                      | -                     | Additional class name                    |
| `style`       | `CSSProperties`               | -                     | Inline styles                            |
| `data-testid` | `string`                      | -                     | Test ID                                  |

### Navbar.Collapse Props

| Prop          | Type            | Default | Description                            |
| ------------- | --------------- | ------- | -------------------------------------- |
| `children`    | `ReactNode`     | -       | Content to collapse (Nav, forms, etc.) |
| `className`   | `string`        | -       | Additional class name                  |
| `style`       | `CSSProperties` | -       | Inline styles                          |
| `data-testid` | `string`        | -       | Test ID                                |

### Navbar.Nav Props

| Prop           | Type            | Default   | Description                          |
| -------------- | --------------- | --------- | ------------------------------------ |
| `children`     | `ReactNode`     | -         | Navigation items                     |
| `scroll`       | `boolean`       | `false`   | Use scroll container with max height |
| `scrollHeight` | `string`        | `'100px'` | Max height for scroll container      |
| `className`    | `string`        | -         | Additional class name                |
| `style`        | `CSSProperties` | -         | Inline styles                        |
| `data-testid`  | `string`        | -         | Test ID                              |

### Navbar.Link Props

| Prop          | Type                                         | Default | Description                                   |
| ------------- | -------------------------------------------- | ------- | --------------------------------------------- |
| `children`    | `ReactNode`                                  | -       | Link content                                  |
| `href`        | `string`                                     | -       | URL to navigate to                            |
| `active`      | `boolean`                                    | `false` | Whether this link represents the current page |
| `disabled`    | `boolean`                                    | `false` | Whether the link is disabled                  |
| `target`      | `'_self' \| '_blank' \| '_parent' \| '_top'` | -       | Link target attribute                         |
| `rel`         | `string`                                     | -       | Link rel attribute                            |
| `onClick`     | `(event: MouseEvent) => void`                | -       | Click handler                                 |
| `as`          | `React.ElementType`                          | -       | Custom component (for router integration)     |
| `className`   | `string`                                     | -       | Additional class name                         |
| `style`       | `CSSProperties`                              | -       | Inline styles                                 |
| `data-testid` | `string`                                     | -       | Test ID                                       |

### Navbar.Item Props

| Prop          | Type            | Default | Description                     |
| ------------- | --------------- | ------- | ------------------------------- |
| `children`    | `ReactNode`     | -       | Item content (link or dropdown) |
| `dropdown`    | `boolean`       | `false` | Whether this is a dropdown item |
| `className`   | `string`        | -       | Additional class name           |
| `style`       | `CSSProperties` | -       | Inline styles                   |
| `data-testid` | `string`        | -       | Test ID                         |

### Navbar.Text Props

| Prop          | Type            | Default | Description           |
| ------------- | --------------- | ------- | --------------------- |
| `children`    | `ReactNode`     | -       | Text content          |
| `className`   | `string`        | -       | Additional class name |
| `style`       | `CSSProperties` | -       | Inline styles         |
| `data-testid` | `string`        | -       | Test ID               |

## Accessibility

The Navbar component follows WAI-ARIA Navigation pattern (WCAG 2.2 AA):

- **Semantic Structure**: Uses native `<nav>`, `<button>`, and `<a>` elements
- **ARIA Attributes**:
  - Navigation has `aria-label` for screen readers
  - Toggle button has `aria-expanded` to indicate collapse state
  - Toggle button has `aria-controls` pointing to collapse element
  - Active links have `aria-current="page"`
- **Disabled State**: Disabled links have `tabindex="-1"` and `aria-disabled="true"`
- **Visual State**: `data-visual-state` attribute reflects FSM state
- **External Links**: Automatically get `rel="noopener noreferrer"` for security

### Keyboard Shortcuts

| Key               | Action                                  |
| ----------------- | --------------------------------------- |
| `Tab`             | Move focus between interactive elements |
| `Shift+Tab`       | Move focus backwards                    |
| `Enter` / `Space` | Activate links or toggle menu           |

### Screen Reader Announcements

- Navigation region is labeled with `aria-label`
- Toggle button announces its current state (expanded/collapsed)
- Active link announces "current page" via `aria-current`
- Disabled links are announced as disabled

## Security

The Navbar component includes comprehensive security features:

### Href Validation

Dangerous protocols are blocked to prevent XSS attacks:

```tsx
// These are blocked and will not render as links:
<Navbar.Link href="javascript:alert('xss')">Bad Link</Navbar.Link>
<Navbar.Link href="data:text/html,...">Data URI</Navbar.Link>
<Navbar.Link href="vbscript:...">VBScript</Navbar.Link>
<Navbar.Link href="file:///etc/passwd">File URI</Navbar.Link>
```

### Prop Whitelisting

Only safe props are passed to DOM elements:

```tsx
interface SafeNavbarHTMLAttributes {
  className?: string;
  style?: CSSProperties;
  id?: string;
  'data-testid'?: string;
  'data-test'?: string;
}
```

### External Link Security

External links (with `target="_blank"`) automatically receive `rel="noopener noreferrer"`:

```tsx
<Navbar.Link href="https://external.com" target="_blank">
  External ↗
</Navbar.Link>
// Renders with rel="noopener noreferrer"
```

### Security Best Practices

- No `dangerouslySetInnerHTML` usage
- No unrestricted prop spreading to DOM
- Dangerous event handlers are blocked
- URLs are validated before rendering

## FSM States

The Navbar uses a finite state machine for predictable collapse transitions:

| State        | Description                             |
| ------------ | --------------------------------------- |
| `collapsed`  | Menu is fully hidden                    |
| `expanding`  | Menu is animating open (CSS transition) |
| `expanded`   | Menu is fully visible                   |
| `collapsing` | Menu is animating closed                |

### Visual State Attribute

The collapse element exposes its visual state via `data-visual-state`:

```html
<div class="collapse navbar-collapse" data-visual-state="expanded">...</div>
```

This is a first-class styling hook for custom animations, testing, and analytics:

```css
/* Custom animation overrides */
[data-visual-state='expanding'] {
  animation: custom-expand 0.3s ease-out;
}

[data-visual-state='collapsing'] {
  animation: custom-collapse 0.3s ease-in;
}
```

You can also use it for testing:

```tsx
// In tests
expect(screen.getByTestId('navbar-collapse')).toHaveAttribute('data-visual-state', 'expanded');
```

## Performance

The Navbar component is optimized for performance:

- **React.memo**: All subcomponents are memoized
- **useCallback**: Event handlers are stable across renders
- **useMemo**: Class name computations are memoized
- **Context Optimization**: Single context with minimal updates
- **CSS Transitions**: Animations use GPU-accelerated CSS, not JavaScript
- **forwardRef**: All components forward refs for interoperability

## Router Integration

The Navbar.Link component supports router integration via the `as` prop:

```tsx
import { Link } from 'react-router-dom';

<Navbar.Nav>
  <Navbar.Link as={Link} to="/home" active>
    Home
  </Navbar.Link>
  <Navbar.Link as={Link} to="/about">
    About
  </Navbar.Link>
</Navbar.Nav>;
```

Or with Next.js:

```tsx
import Link from 'next/link';

<Navbar.Nav>
  <Navbar.Link as={Link} href="/home" active>
    Home
  </Navbar.Link>
  <Navbar.Link as={Link} href="/about">
    About
  </Navbar.Link>
</Navbar.Nav>;
```

## Related Components

- [Accordion](../Accordion/README.md) - For collapsible content sections
- [Dropdown](../Dropdown/README.md) - For dropdown menus within navbar
- [Modal](../Modal/README.md) - For dialog overlays
