# Spinner Component Guidelines

The Spinner component displays a loading indicator animation.

## Import

```tsx
import { Spinner } from '@dsai/react';
```

## When to Use

Use Spinner when:

- Content is loading asynchronously
- Action is being processed
- User needs to wait for a response
- Indicating background activity

Do not use Spinner when:

- Loading is instant (under 300ms)
- Progress can be measured (use Progress)
- Content has skeleton layout (use Skeleton)

## Basic Usage

```tsx
<Spinner />
```

## Sizes

```tsx
<Spinner size="sm" />  {/* 16px */}
<Spinner size="md" />  {/* 24px (default) */}
<Spinner size="lg" />  {/* 32px */}
<Spinner size="xl" />  {/* 48px */}
```

## With Label

```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
  <Spinner size="sm" />
  <span>Loading...</span>
</div>
```

## In Button

```tsx
<Button disabled>
  <Spinner size="sm" />
  Saving...
</Button>

// Using Button's loading prop (preferred)
<Button loading>Save</Button>
<Button loading loadingText="Saving...">Save</Button>
```

## Full Page Loading

```tsx
<div
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: 'var(--spacing-4)',
  }}
>
  <Spinner size="xl" />
  <p>Loading your dashboard...</p>
</div>
```

## Inline Loading

```tsx
<p>
  Your results are loading <Spinner size="sm" />
</p>
```

## Card Loading State

```tsx
<Card>
  <Card.Body>
    {isLoading ? (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: 'var(--spacing-8)',
        }}
      >
        <Spinner />
      </div>
    ) : (
      <div>{content}</div>
    )}
  </Card.Body>
</Card>
```

## Conditional Rendering

```tsx
{
  isLoading ? <Spinner /> : <DataTable data={data} />;
}
```

## Delayed Spinner

Prevent flashing for fast loads:

```tsx
const [showSpinner, setShowSpinner] = useState(false);

useEffect(() => {
  if (isLoading) {
    const timer = setTimeout(() => setShowSpinner(true), 300);
    return () => clearTimeout(timer);
  } else {
    setShowSpinner(false);
  }
}, [isLoading]);

{
  showSpinner && <Spinner />;
}
```

## Accessibility

- Spinner includes `role="status"` by default
- Use `aria-label` for context
- Announce loading state to screen readers

```tsx
// With accessible label
<Spinner aria-label="Loading content" />

// With live region announcement
<div aria-live="polite">
  {isLoading && <Spinner aria-label="Loading" />}
</div>
```

## Spinner vs Progress vs Skeleton

| Spinner          | Progress         | Skeleton            |
| ---------------- | ---------------- | ------------------- |
| Unknown duration | Known progress   | Layout preview      |
| Indeterminate    | Determinate      | Content placeholder |
| Compact          | Shows percentage | Full layout         |

```tsx
// Spinner - unknown duration
{isLoading && <Spinner />}

// Progress - known progress
<Progress value={uploadProgress} max={100} />

// Skeleton - layout preview
<Skeleton width="100%" height={200} />
```

## Common Patterns

### Table Loading

```tsx
<Table>
  <Table.Head>...</Table.Head>
  <Table.Body>
    {isLoading ? (
      <Table.Row>
        <Table.Cell colSpan={4}>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
            <Spinner />
          </div>
        </Table.Cell>
      </Table.Row>
    ) : (
      rows.map((row) => <Table.Row key={row.id}>...</Table.Row>)
    )}
  </Table.Body>
</Table>
```

### Button Submit

```tsx
async function handleSubmit() {
  setIsLoading(true);
  try {
    await submitForm(data);
  } finally {
    setIsLoading(false);
  }
}

<Button onClick={handleSubmit} loading={isLoading}>
  Submit
</Button>;
```

### Overlay Loading

```tsx
<div style={{ position: 'relative' }}>
  <DataTable data={data} />

  {isRefreshing && (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
      }}
    >
      <Spinner size="lg" />
    </div>
  )}
</div>
```

## Do's and Don'ts

### Do

- Show spinner for operations over 300ms
- Provide context with label when possible
- Use appropriate size for context
- Disable interactions during loading

### Don't

- Don't show spinner for instant operations
- Don't use multiple spinners in same area
- Don't block entire screen for partial loads
- Don't forget to hide spinner when complete
