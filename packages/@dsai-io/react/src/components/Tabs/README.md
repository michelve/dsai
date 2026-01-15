# Tabs

An accessible tabbed interface component built with Bootstrap 5 styling. Supports multiple variants, orientations, and compound component patterns.

## Features

- 📑 Multiple variants: tabs, pills, underline
- ↔️ Horizontal and vertical orientations
- ⌨️ Full keyboard navigation
- ♿ WCAG 2.2 AA compliant
- 🎯 Controlled and uncontrolled modes
- 🧩 Compound component pattern

## Installation

```bash
npm install @dsai/react
```

## Usage

### Basic Tabs (Items Mode)

```tsx
import { Tabs } from '@dsai/react';

function Example() {
  return (
    <Tabs
      items={[
        { id: 'home', label: 'Home', content: <p>Home content</p> },
        { id: 'profile', label: 'Profile', content: <p>Profile content</p> },
        { id: 'settings', label: 'Settings', content: <p>Settings content</p> },
      ]}
    />
  );
}
```

### Compound Components

```tsx
import { Tab, TabList, TabPanel, Tabs } from '@dsai/react';

function Example() {
  return (
    <Tabs defaultActiveTab="home">
      <TabList aria-label="Main navigation">
        <Tab id="home">Home</Tab>
        <Tab id="profile">Profile</Tab>
        <Tab id="settings">Settings</Tab>
      </TabList>
      <TabPanel id="home">Home content</TabPanel>
      <TabPanel id="profile">Profile content</TabPanel>
      <TabPanel id="settings">Settings content</TabPanel>
    </Tabs>
  );
}
```

### Controlled Mode

```tsx
function ControlledTabs() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <Tabs
      activeTab={activeTab}
      onTabChange={setActiveTab}
      items={[
        { id: 'home', label: 'Home', content: <p>Home</p> },
        { id: 'profile', label: 'Profile', content: <p>Profile</p> },
      ]}
    />
  );
}
```

### Variants

```tsx
// Default tabs
<Tabs variant="tabs" items={items} />

// Pills
<Tabs variant="pills" items={items} />

// Underline
<Tabs variant="underline" items={items} />
```

### Vertical Orientation

```tsx
<Tabs orientation="vertical" items={items} />
```

### Fill and Justified

```tsx
// Fill available width
<Tabs fill items={items} />

// Evenly justified
<Tabs justified items={items} />
```

### Disabled Tabs

```tsx
<Tabs
  items={[
    { id: 'home', label: 'Home', content: <p>Home</p> },
    { id: 'disabled', label: 'Disabled', content: <p>Disabled</p>, disabled: true },
    { id: 'settings', label: 'Settings', content: <p>Settings</p> },
  ]}
/>
```

### With Icons

```tsx
<Tabs
  items={[
    { id: 'home', label: 'Home', icon: <HomeIcon />, content: <p>Home</p> },
    { id: 'profile', label: 'Profile', icon: <UserIcon />, content: <p>Profile</p> },
  ]}
/>
```

### Keep Panel Mounted

Use `keepMounted` to preserve panel state when switching tabs:

```tsx
<Tabs defaultActiveTab="tab1">
  <TabList aria-label="Tabs">
    <Tab id="tab1">Tab 1</Tab>
    <Tab id="tab2">Tab 2</Tab>
  </TabList>
  <TabPanel id="tab1">Content 1</TabPanel>
  <TabPanel id="tab2" keepMounted>
    <FormWithState />
  </TabPanel>
</Tabs>
```

## Props

### Tabs

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `TabItem[]` | - | Tab items to render |
| `children` | `ReactNode` | - | Compound components |
| `activeTab` | `string` | - | Controlled active tab ID |
| `defaultActiveTab` | `string` | first item | Default active tab ID |
| `onTabChange` | `(id: string) => void` | - | Change handler |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Tab orientation |
| `variant` | `'tabs' \| 'pills' \| 'underline'` | `'tabs'` | Visual variant |
| `fill` | `boolean` | `false` | Fill available width |
| `justified` | `boolean` | `false` | Evenly justify tabs |
| `className` | `string` | - | Additional classes |
| `style` | `CSSProperties` | - | Inline styles |
| `id` | `string` | auto | Element ID |

### TabItem

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier |
| `label` | `ReactNode` | Tab label |
| `content` | `ReactNode` | Panel content |
| `icon` | `ReactNode` | Optional icon |
| `disabled` | `boolean` | Disabled state |

### TabList

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Tab buttons |
| `className` | `string` | Additional classes |
| `style` | `CSSProperties` | Inline styles |
| `aria-label` | `string` | Accessible label |

### Tab

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Unique identifier |
| `children` | `ReactNode` | Tab label |
| `icon` | `ReactNode` | Optional icon |
| `disabled` | `boolean` | Disabled state |
| `className` | `string` | Additional classes |
| `style` | `CSSProperties` | Inline styles |

### TabPanel

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Matching tab ID |
| `children` | `ReactNode` | Panel content |
| `keepMounted` | `boolean` | Keep mounted when inactive |
| `className` | `string` | Additional classes |
| `style` | `CSSProperties` | Inline styles |

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `ArrowRight` | Next tab (horizontal) |
| `ArrowLeft` | Previous tab (horizontal) |
| `ArrowDown` | Next tab (vertical) |
| `ArrowUp` | Previous tab (vertical) |
| `Home` | First tab |
| `End` | Last tab |
| `Tab` | Move focus out |

## Accessibility

The Tabs component follows WCAG 2.2 AA guidelines:

- `role="tablist"` on the tab container
- `role="tab"` on each tab button
- `role="tabpanel"` on each content panel
- `aria-selected` indicates active tab
- `aria-controls` links tab to panel
- `aria-labelledby` links panel to tab
- `aria-orientation` indicates layout
- `aria-disabled` for disabled tabs
- `tabIndex` management for roving focus
- Full keyboard navigation

## Related Components

- [Button](../Button/README.md) - For actions
- [Card](../Card/README.md) - For content containers
