# TabsPro Component Guidelines

The TabsPro component provides advanced tabs with additional features.

## Import

```tsx
import { TabsPro } from '@dsai-io/react';
```

## When to Use

Use TabsPro when:

- Need closable/removable tabs
- Tabs can be reordered
- Adding new tabs dynamically
- More complex tab interactions needed

Use regular Tabs for simpler use cases.

## Basic Usage

```tsx
<TabsPro defaultValue="tab1">
  <TabsPro.List>
    <TabsPro.Tab value="tab1">Tab 1</TabsPro.Tab>
    <TabsPro.Tab value="tab2">Tab 2</TabsPro.Tab>
    <TabsPro.Tab value="tab3">Tab 3</TabsPro.Tab>
  </TabsPro.List>

  <TabsPro.Panel value="tab1">Content 1</TabsPro.Panel>
  <TabsPro.Panel value="tab2">Content 2</TabsPro.Panel>
  <TabsPro.Panel value="tab3">Content 3</TabsPro.Panel>
</TabsPro>
```

## Closable Tabs

```tsx
<TabsPro onTabClose={(value) => removeTab(value)}>
  <TabsPro.List>
    {tabs.map((tab) => (
      <TabsPro.Tab key={tab.id} value={tab.id} closable>
        {tab.label}
      </TabsPro.Tab>
    ))}
  </TabsPro.List>
</TabsPro>
```

## Add New Tab

```tsx
<TabsPro>
  <TabsPro.List>
    {tabs.map((tab) => (
      <TabsPro.Tab key={tab.id} value={tab.id}>
        {tab.label}
      </TabsPro.Tab>
    ))}
    <TabsPro.AddButton onClick={addNewTab} aria-label="Add new tab" />
  </TabsPro.List>
</TabsPro>
```

## Draggable Tabs

```tsx
<TabsPro draggable onTabReorder={(fromIndex, toIndex) => reorderTabs(fromIndex, toIndex)}>
  <TabsPro.List>
    {tabs.map((tab) => (
      <TabsPro.Tab key={tab.id} value={tab.id}>
        {tab.label}
      </TabsPro.Tab>
    ))}
  </TabsPro.List>
</TabsPro>
```

## With Icons

```tsx
<TabsPro>
  <TabsPro.List>
    <TabsPro.Tab value="file1" icon={<Icon name="file" />} closable>
      document.tsx
    </TabsPro.Tab>
    <TabsPro.Tab value="file2" icon={<Icon name="file" />} closable>
      styles.css
    </TabsPro.Tab>
  </TabsPro.List>
</TabsPro>
```

## Accessibility

- All standard Tabs accessibility features
- Close buttons have accessible labels
- Drag operations announced

```tsx
<TabsPro>
  <TabsPro.List aria-label="Open files">
    <TabsPro.Tab value="file1" closable closeAriaLabel="Close document.tsx">
      document.tsx
    </TabsPro.Tab>
  </TabsPro.List>
</TabsPro>
```

## TabsPro vs Tabs

| TabsPro              | Tabs                |
| -------------------- | ------------------- |
| Closable tabs        | Static tabs         |
| Reorderable          | Fixed order         |
| Dynamic tab creation | Predefined tabs     |
| IDE-like interface   | Standard navigation |

## Do's and Don'ts

### Do

- Use for dynamic, user-controlled tabs
- Provide close confirmation for unsaved changes
- Keep tab labels short

### Don't

- Don't use for simple static navigation
- Don't allow too many tabs
- Don't forget to handle empty state
