# Navbar Component Guidelines

The Navbar component provides a responsive navigation header.

## Import

```tsx
import { Navbar } from '@dsai-io/react';
```

## When to Use

Use Navbar when:

- Creating site-wide navigation
- Top-level header with branding
- Navigation that collapses on mobile
- Global actions like search or user menu

## Basic Usage

```tsx
<Navbar>
  <Navbar.Brand href="/">
    <img src="/logo.svg" alt="Company" />
  </Navbar.Brand>
  <Navbar.Nav>
    <Navbar.Link href="/" active>
      Home
    </Navbar.Link>
    <Navbar.Link href="/products">Products</Navbar.Link>
    <Navbar.Link href="/about">About</Navbar.Link>
  </Navbar.Nav>
</Navbar>
```

## With User Menu

```tsx
<Navbar>
  <Navbar.Brand href="/">Logo</Navbar.Brand>
  <Navbar.Nav>
    <Navbar.Link href="/">Home</Navbar.Link>
    <Navbar.Link href="/docs">Docs</Navbar.Link>
  </Navbar.Nav>
  <Navbar.Actions>
    <Dropdown>
      <Dropdown.Trigger>
        <Avatar src={user.avatar} name={user.name} size="sm" />
      </Dropdown.Trigger>
      <Dropdown.Content align="end">
        <Dropdown.Item>Profile</Dropdown.Item>
        <Dropdown.Item>Settings</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item>Sign out</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  </Navbar.Actions>
</Navbar>
```

## Responsive Collapse

```tsx
<Navbar>
  <Navbar.Brand href="/">Logo</Navbar.Brand>
  <Navbar.Toggle aria-label="Toggle navigation" />
  <Navbar.Collapse>
    <Navbar.Nav>
      <Navbar.Link href="/">Home</Navbar.Link>
      <Navbar.Link href="/about">About</Navbar.Link>
    </Navbar.Nav>
  </Navbar.Collapse>
</Navbar>
```

## Sticky Navbar

```tsx
<Navbar sticky="top">
  <Navbar.Brand>Logo</Navbar.Brand>
  <Navbar.Nav>...</Navbar.Nav>
</Navbar>
```

## Accessibility

```tsx
<Navbar as="header" role="banner">
  <Navbar.Brand href="/">Company</Navbar.Brand>
  <nav aria-label="Main navigation">
    <Navbar.Nav>
      <Navbar.Link href="/" aria-current="page">
        Home
      </Navbar.Link>
      <Navbar.Link href="/about">About</Navbar.Link>
    </Navbar.Nav>
  </nav>
</Navbar>
```

## Do's and Don'ts

### Do

- Include clear branding/logo
- Highlight current page
- Make mobile-friendly with collapse
- Put key actions in accessible location

### Don't

- Don't put too many items
- Don't hide important navigation
- Don't use nested navigation in navbar
