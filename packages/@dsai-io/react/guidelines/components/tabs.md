# Tabs Component Guidelines

The Tabs component organizes content into switchable panels.

## Import

```tsx
import { Tabs } from '@dsai-io/react';
```

## When to Use

Use Tabs when:

- Content can be logically grouped into sections
- User needs to switch between related views
- All tab content is at the same hierarchy level
- Only one tab content should be visible at a time

Do not use Tabs when:

- Content must be viewed sequentially (use Stepper)
- Tabs would exceed screen width (use Dropdown or Accordion)
- Content should be visible simultaneously (use sections)

## Basic Usage

```tsx
<Tabs defaultValue="overview">
  <Tabs.List>
    <Tabs.Tab value="overview">Overview</Tabs.Tab>
    <Tabs.Tab value="features">Features</Tabs.Tab>
    <Tabs.Tab value="pricing">Pricing</Tabs.Tab>
  </Tabs.List>

  <Tabs.Panel value="overview">Overview content goes here.</Tabs.Panel>
  <Tabs.Panel value="features">Features content goes here.</Tabs.Panel>
  <Tabs.Panel value="pricing">Pricing content goes here.</Tabs.Panel>
</Tabs>
```

## Controlled Tabs

```tsx
const [activeTab, setActiveTab] = useState('overview');

<Tabs value={activeTab} onValueChange={setActiveTab}>
  <Tabs.List>
    <Tabs.Tab value="overview">Overview</Tabs.Tab>
    <Tabs.Tab value="settings">Settings</Tabs.Tab>
  </Tabs.List>

  <Tabs.Panel value="overview">Overview</Tabs.Panel>
  <Tabs.Panel value="settings">Settings</Tabs.Panel>
</Tabs>;
```

## Variants

### Default (Underlined)

```tsx
<Tabs variant="underlined">
  <Tabs.List>
    <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
    <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
  </Tabs.List>
</Tabs>
```

### Boxed

```tsx
<Tabs variant="boxed">
  <Tabs.List>
    <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
    <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
  </Tabs.List>
</Tabs>
```

### Pills

```tsx
<Tabs variant="pills">
  <Tabs.List>
    <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
    <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
  </Tabs.List>
</Tabs>
```

## With Icons

```tsx
<Tabs defaultValue="messages">
  <Tabs.List>
    <Tabs.Tab value="messages">
      <Icon name="mail" />
      Messages
    </Tabs.Tab>
    <Tabs.Tab value="notifications">
      <Icon name="bell" />
      Notifications
    </Tabs.Tab>
    <Tabs.Tab value="settings">
      <Icon name="settings" />
      Settings
    </Tabs.Tab>
  </Tabs.List>
</Tabs>
```

## With Badge

```tsx
<Tabs defaultValue="inbox">
  <Tabs.List>
    <Tabs.Tab value="inbox">
      Inbox
      <Badge variant="danger" pill size="sm">
        12
      </Badge>
    </Tabs.Tab>
    <Tabs.Tab value="sent">Sent</Tabs.Tab>
    <Tabs.Tab value="drafts">
      Drafts
      <Badge size="sm">3</Badge>
    </Tabs.Tab>
  </Tabs.List>
</Tabs>
```

## Disabled Tab

```tsx
<Tabs defaultValue="general">
  <Tabs.List>
    <Tabs.Tab value="general">General</Tabs.Tab>
    <Tabs.Tab value="advanced" disabled>
      Advanced (Coming soon)
    </Tabs.Tab>
  </Tabs.List>
</Tabs>
```

## Vertical Tabs

```tsx
<Tabs orientation="vertical" defaultValue="profile">
  <Tabs.List>
    <Tabs.Tab value="profile">Profile</Tabs.Tab>
    <Tabs.Tab value="security">Security</Tabs.Tab>
    <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
  </Tabs.List>

  <div style={{ marginLeft: 'var(--spacing-6)' }}>
    <Tabs.Panel value="profile">Profile settings</Tabs.Panel>
    <Tabs.Panel value="security">Security settings</Tabs.Panel>
    <Tabs.Panel value="notifications">Notification settings</Tabs.Panel>
  </div>
</Tabs>
```

## Full Width Tabs

```tsx
<Tabs fullWidth defaultValue="tab1">
  <Tabs.List>
    <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
    <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
    <Tabs.Tab value="tab3">Tab 3</Tabs.Tab>
  </Tabs.List>
</Tabs>
```

## Lazy Loading Panels

```tsx
<Tabs defaultValue="overview">
  <Tabs.List>
    <Tabs.Tab value="overview">Overview</Tabs.Tab>
    <Tabs.Tab value="analytics">Analytics</Tabs.Tab>
  </Tabs.List>

  <Tabs.Panel value="overview">
    <OverviewContent />
  </Tabs.Panel>
  <Tabs.Panel value="analytics" lazy>
    {/* Only loads when tab is active */}
    <AnalyticsContent />
  </Tabs.Panel>
</Tabs>
```

## Accessibility

- Arrow keys navigate between tabs
- Tab key moves focus to active panel
- Home/End keys move to first/last tab
- ARIA roles and states are automatic

```tsx
// Accessible by default
<Tabs defaultValue="tab1">
  <Tabs.List aria-label="Account settings">
    <Tabs.Tab value="tab1">General</Tabs.Tab>
    <Tabs.Tab value="tab2">Security</Tabs.Tab>
  </Tabs.List>
</Tabs>
```

## Common Patterns

### Settings Page

```tsx
<Tabs orientation="vertical" defaultValue="profile">
  <Tabs.List>
    <Tabs.Tab value="profile">Profile</Tabs.Tab>
    <Tabs.Tab value="account">Account</Tabs.Tab>
    <Tabs.Tab value="billing">Billing</Tabs.Tab>
    <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
  </Tabs.List>

  <Tabs.Panel value="profile">
    <Card>
      <Card.Header>Profile Settings</Card.Header>
      <Card.Body>
        <Input label="Display Name" />
        <Input label="Bio" />
      </Card.Body>
    </Card>
  </Tabs.Panel>
  {/* Other panels */}
</Tabs>
```

### Dashboard Tabs

```tsx
<Card>
  <Card.Header>Analytics</Card.Header>
  <Tabs defaultValue="daily">
    <Tabs.List>
      <Tabs.Tab value="daily">Daily</Tabs.Tab>
      <Tabs.Tab value="weekly">Weekly</Tabs.Tab>
      <Tabs.Tab value="monthly">Monthly</Tabs.Tab>
    </Tabs.List>

    <Card.Body>
      <Tabs.Panel value="daily">Daily chart</Tabs.Panel>
      <Tabs.Panel value="weekly">Weekly chart</Tabs.Panel>
      <Tabs.Panel value="monthly">Monthly chart</Tabs.Panel>
    </Card.Body>
  </Tabs>
</Card>
```

## Do's and Don'ts

### Do

- Keep tab labels short (1-2 words)
- Use icons to aid recognition
- Maintain consistent content structure across tabs
- Order tabs by importance or workflow

### Don't

- Don't use more than 6-7 tabs (use navigation or dropdown)
- Don't nest tabs inside tabs
- Don't use tabs for sequential processes
- Don't change tab order dynamically
