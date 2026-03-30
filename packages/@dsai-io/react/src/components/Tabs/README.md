# Tabs

An accessible tabbed interface component built with Bootstrap 5 styling. Supports multiple variants, orientations, and compound component patterns.

## Features

- 📑 Multiple variants: tabs, pills, underline
- ↔️ Horizontal and vertical orientations
- ⌨️ Full keyboard navigation
- ♿ WCAG 2.2 AA compliant
- 🎯 Controlled and uncontrolled modes
- 🧩 Compound component pattern
- 📜 Scrollable tab overflow with scroll buttons
- ❌ Closable and editable tabs (add/remove)
- 📌 Tab bar extra content (left/right slots)
- 🖱️ Manual activation mode for keyboard
- 💤 Lazy mount and unmount on exit
- 🎬 Animation hooks via data-state attributes

## Installation

Add the Tabs component to your project using the DSAi CLI:

```bash
dsai add tabs
```

This copies the component source files into your project and automatically resolves all dependencies.

> **First time?** Install the CLI and generate your design tokens first:
>
> ```bash
> pnpm add @dsai-io/tools
> npx dsai tokens build
> ```

## Usage

### Basic Tabs (Items Mode)

```tsx
import { Tabs } from '@dsai-io/react';

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
import { Tab, TabList, TabPanel, Tabs } from '@dsai-io/react';

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

### Activation Mode

```tsx
// Manual: arrow keys move focus, Enter/Space activates
<Tabs activationMode="manual" defaultActiveTab="home">
  <TabList aria-label="Manual tabs">
    <Tab id="home">Home</Tab>
    <Tab id="profile">Profile</Tab>
  </TabList>
  <TabPanel id="home">Home content</TabPanel>
  <TabPanel id="profile">Profile content</TabPanel>
</Tabs>
```

### Lazy Mount & Unmount on Exit

```tsx
// Only render panels when first activated
<Tabs lazyMount defaultActiveTab="home">
  <TabList aria-label="Lazy tabs">
    <Tab id="home">Home</Tab>
    <Tab id="heavy">Heavy Content</Tab>
  </TabList>
  <TabPanel id="home">Loaded immediately</TabPanel>
  <TabPanel id="heavy">Only loaded when clicked</TabPanel>
</Tabs>

// Unmount panels when switching away
<Tabs unmountOnExit defaultActiveTab="home">
  ...
</Tabs>
```

### Closable Tabs

```tsx
function ClosableTabs() {
  const [tabs, setTabs] = useState([
    { id: 'tab1', label: 'Tab 1', content: <p>Content 1</p>, closable: true },
    { id: 'tab2', label: 'Tab 2', content: <p>Content 2</p>, closable: true },
  ]);

  const handleClose = (tabId: string) => {
    setTabs((prev) => prev.filter((t) => t.id !== tabId));
  };

  return <Tabs items={tabs} onTabClose={handleClose} />;
}
```

### Add Tab Button

```tsx
<Tabs items={tabs} onTabAdd={() => addNewTab()} onTabClose={handleClose} />
```

### Tab Bar Extra Content

```tsx
// Simple extra content (rendered at the end)
<TabList aria-label="Tabs" extra={<Button size="sm">Action</Button>}>
  ...
</TabList>

// Left and right slots
<TabList
  aria-label="Tabs"
  extra={{
    left: <Badge>3 items</Badge>,
    right: <Button size="sm">Settings</Button>,
  }}
>
  ...
</TabList>
```

### Scrollable Tabs

```tsx
<TabList aria-label="Many tabs" scrollable>
  <Tab id="tab1">Tab 1</Tab>
  <Tab id="tab2">Tab 2</Tab>
  {/* ...many more tabs */}
  <Tab id="tab20">Tab 20</Tab>
</TabList>
```

### Animation Support

```css
/* Animate tab panels */
[role="tabpanel"][data-state="active"] {
  animation: fadeIn 0.2s ease-in;
}

/* Style active/inactive tabs */
[role="tab"][data-state="active"] {
  /* active styles */
}
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
| `activationMode` | `'automatic' \| 'manual'` | `'automatic'` | Keyboard activation behavior |
| `lazyMount` | `boolean` | `false` | Only render panels on first activation |
| `unmountOnExit` | `boolean` | `false` | Unmount inactive panels |
| `onTabClose` | `(id: string) => void` | - | Close handler for closable tabs |
| `onTabAdd` | `() => void` | - | Add tab handler (shows + button) |

### TabItem

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier |
| `label` | `ReactNode` | Tab label |
| `content` | `ReactNode` | Panel content |
| `icon` | `ReactNode` | Optional icon |
| `disabled` | `boolean` | Disabled state |
| `closable` | `boolean` | Whether the tab can be closed |

### TabList

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Tab buttons |
| `className` | `string` | Additional classes |
| `style` | `CSSProperties` | Inline styles |
| `aria-label` | `string` | Accessible label |
| `extra` | `ReactNode \| { left?: ReactNode; right?: ReactNode }` | Extra content alongside tabs |
| `scrollable` | `boolean` | Enable scroll buttons for overflow |

### Tab

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Unique identifier |
| `children` | `ReactNode` | Tab label |
| `icon` | `ReactNode` | Optional icon |
| `disabled` | `boolean` | Disabled state |
| `closable` | `boolean` | Show close button on tab |
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
| `Enter` / `Space` | Activate tab (manual mode only) |
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
