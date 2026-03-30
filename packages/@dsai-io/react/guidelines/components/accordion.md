# Accordion Component Guidelines

The Accordion component displays collapsible content sections.

## Import

```tsx
import { Accordion } from '@dsai-io/react';
```

## When to Use

Use Accordion when:

- Displaying FAQ-style content
- Grouping related settings or options
- Reducing visual complexity on long pages
- Showing progressive disclosure of information

Do not use Accordion when:

- Content should be compared side by side (use Tabs or columns)
- Content is short and fits easily (show directly)
- Sequential steps are needed (use Stepper)

## Basic Usage

```tsx
<Accordion>
  <Accordion.Item value="item-1">
    <Accordion.Header>What is DSAi?</Accordion.Header>
    <Accordion.Content>DSAi is a design system with accessible React components.</Accordion.Content>
  </Accordion.Item>

  <Accordion.Item value="item-2">
    <Accordion.Header>How do I install it?</Accordion.Header>
    <Accordion.Content>Run dsai add accordion to add it to your project.</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

## Single vs Multiple

### Single (default)

Only one item can be open at a time:

```tsx
<Accordion type="single" collapsible>
  <Accordion.Item value="section-1">
    <Accordion.Header>Section 1</Accordion.Header>
    <Accordion.Content>Content 1</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="section-2">
    <Accordion.Header>Section 2</Accordion.Header>
    <Accordion.Content>Content 2</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

### Multiple

Multiple items can be open simultaneously:

```tsx
<Accordion type="multiple">
  <Accordion.Item value="section-1">
    <Accordion.Header>Section 1</Accordion.Header>
    <Accordion.Content>Content 1</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="section-2">
    <Accordion.Header>Section 2</Accordion.Header>
    <Accordion.Content>Content 2</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

## Default Open

```tsx
// Single type - default open
<Accordion type="single" defaultValue="faq-1">
  <Accordion.Item value="faq-1">...</Accordion.Item>
  <Accordion.Item value="faq-2">...</Accordion.Item>
</Accordion>

// Multiple type - default open items
<Accordion type="multiple" defaultValue={['section-1', 'section-3']}>
  <Accordion.Item value="section-1">...</Accordion.Item>
  <Accordion.Item value="section-2">...</Accordion.Item>
  <Accordion.Item value="section-3">...</Accordion.Item>
</Accordion>
```

## Controlled

```tsx
const [openItems, setOpenItems] = useState(['item-1']);

<Accordion type="multiple" value={openItems} onValueChange={setOpenItems}>
  <Accordion.Item value="item-1">
    <Accordion.Header>Item 1</Accordion.Header>
    <Accordion.Content>Content 1</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Header>Item 2</Accordion.Header>
    <Accordion.Content>Content 2</Accordion.Content>
  </Accordion.Item>
</Accordion>;
```

## Disabled Items

```tsx
<Accordion>
  <Accordion.Item value="enabled">
    <Accordion.Header>Available Section</Accordion.Header>
    <Accordion.Content>Content</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="disabled" disabled>
    <Accordion.Header>Unavailable Section</Accordion.Header>
    <Accordion.Content>Content</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

## Custom Header Content

```tsx
<Accordion>
  <Accordion.Item value="billing">
    <Accordion.Header>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
        <Icon name="credit-card" />
        <span>Billing Information</span>
        <Badge variant="success" size="sm">
          Active
        </Badge>
      </div>
    </Accordion.Header>
    <Accordion.Content>Billing details...</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

## Nested Content

```tsx
<Accordion>
  <Accordion.Item value="settings">
    <Accordion.Header>Account Settings</Accordion.Header>
    <Accordion.Content>
      <Input label="Display Name" />
      <Input label="Email" type="email" />
      <Button>Save Changes</Button>
    </Accordion.Content>
  </Accordion.Item>
</Accordion>
```

## Accessibility

- Headers are keyboard accessible (Enter/Space to toggle)
- Arrow keys navigate between headers
- ARIA expanded state is managed automatically

```tsx
// Accessible by default
<Accordion>
  <Accordion.Item value="section">
    <Accordion.Header>Section Title</Accordion.Header>
    <Accordion.Content>Content is accessible</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

## Common Patterns

### FAQ Section

```tsx
<Accordion type="single" collapsible>
  {faqs.map((faq, index) => (
    <Accordion.Item key={index} value={`faq-${index}`}>
      <Accordion.Header>{faq.question}</Accordion.Header>
      <Accordion.Content>{faq.answer}</Accordion.Content>
    </Accordion.Item>
  ))}
</Accordion>
```

### Settings Panel

```tsx
<Accordion type="multiple" defaultValue={['general']}>
  <Accordion.Item value="general">
    <Accordion.Header>General Settings</Accordion.Header>
    <Accordion.Content>
      <Checkbox label="Enable notifications" />
      <Checkbox label="Dark mode" />
    </Accordion.Content>
  </Accordion.Item>

  <Accordion.Item value="privacy">
    <Accordion.Header>Privacy Settings</Accordion.Header>
    <Accordion.Content>
      <Checkbox label="Public profile" />
      <Checkbox label="Show email" />
    </Accordion.Content>
  </Accordion.Item>
</Accordion>
```

### Collapsible Sidebar

```tsx
<Accordion type="multiple">
  <Accordion.Item value="dashboard">
    <Accordion.Header>
      <Icon name="home" /> Dashboard
    </Accordion.Header>
    <Accordion.Content>
      <nav>
        <a href="/overview">Overview</a>
        <a href="/analytics">Analytics</a>
      </nav>
    </Accordion.Content>
  </Accordion.Item>

  <Accordion.Item value="settings">
    <Accordion.Header>
      <Icon name="settings" /> Settings
    </Accordion.Header>
    <Accordion.Content>
      <nav>
        <a href="/account">Account</a>
        <a href="/billing">Billing</a>
      </nav>
    </Accordion.Content>
  </Accordion.Item>
</Accordion>
```

## Do's and Don'ts

### Do

- Use clear, descriptive headers
- Group related content logically
- Allow collapsing for "single" type when appropriate
- Use for content that doesn't need to be compared

### Don't

- Don't nest accordions too deeply
- Don't use for critical information that must be seen
- Don't put essential actions inside collapsed sections
- Don't use if users need to see all content at once
