# Sheet Component Guidelines

The Sheet component provides a slide-in panel from screen edge.

## Import

```tsx
import { Sheet } from '@dsai-io/react';
```

## When to Use

Use Sheet when:

- Showing supplementary content
- Filters or settings panels
- Detail views without full navigation
- Mobile-friendly side panels

Do not use Sheet when:

- Content requires focused attention (use Modal)
- Primary workflow step (use dedicated page)
- Quick confirmations (use Modal or Toast)

## Basic Usage

```tsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open Sheet</Button>

<Sheet open={open} onOpenChange={setOpen}>
  <Sheet.Header>
    <Sheet.Title>Sheet Title</Sheet.Title>
  </Sheet.Header>
  <Sheet.Body>
    Sheet content goes here.
  </Sheet.Body>
</Sheet>
```

## Side Position

```tsx
<Sheet side="right">...</Sheet>  {/* default */}
<Sheet side="left">...</Sheet>
<Sheet side="top">...</Sheet>
<Sheet side="bottom">...</Sheet>
```

## Sizes

```tsx
<Sheet size="sm">...</Sheet>   {/* 320px */}
<Sheet size="md">...</Sheet>   {/* 400px */}
<Sheet size="lg">...</Sheet>   {/* 540px */}
<Sheet size="full">...</Sheet> {/* 100% */}
```

## With Footer

```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <Sheet.Header>
    <Sheet.Title>Filters</Sheet.Title>
  </Sheet.Header>
  <Sheet.Body>
    <Checkbox label="In Stock" />
    <Checkbox label="On Sale" />
  </Sheet.Body>
  <Sheet.Footer>
    <Button variant="secondary" onClick={() => setOpen(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={applyFilters}>
      Apply
    </Button>
  </Sheet.Footer>
</Sheet>
```

## Sheet vs Modal

| Sheet                 | Modal                |
| --------------------- | -------------------- |
| Slides from edge      | Centers on screen    |
| Partial overlay       | Full overlay         |
| Supplementary content | Focused tasks        |
| Filters, details      | Confirmations, forms |

## Accessibility

- Focus is trapped within sheet
- Escape closes sheet
- Focus returns to trigger

```tsx
<Sheet aria-labelledby="sheet-title">
  <Sheet.Header>
    <Sheet.Title id="sheet-title">Panel Title</Sheet.Title>
  </Sheet.Header>
</Sheet>
```

## Common Patterns

### Filter Panel

```tsx
<Sheet side="left" open={filtersOpen} onOpenChange={setFiltersOpen}>
  <Sheet.Header>
    <Sheet.Title>Filters</Sheet.Title>
  </Sheet.Header>
  <Sheet.Body>
    <CheckboxGroup label="Category">...</CheckboxGroup>
    <RadioGroup label="Price Range">...</RadioGroup>
  </Sheet.Body>
  <Sheet.Footer>
    <Button onClick={clearFilters}>Clear All</Button>
    <Button variant="primary" onClick={applyFilters}>
      Apply
    </Button>
  </Sheet.Footer>
</Sheet>
```

### Mobile Navigation

```tsx
<Sheet side="left" open={menuOpen} onOpenChange={setMenuOpen}>
  <Sheet.Body>
    <nav>
      <a href="/">Home</a>
      <a href="/products">Products</a>
      <a href="/about">About</a>
    </nav>
  </Sheet.Body>
</Sheet>
```

## Do's and Don'ts

### Do

- Use for supplementary content
- Allow closing via overlay click
- Keep content focused

### Don't

- Don't use for critical workflows
- Don't nest sheets
- Don't put too much content
