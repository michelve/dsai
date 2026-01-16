# Progress Component Guidelines

The Progress component displays visual indicator for completion percentage.

## Import

```tsx
import { Progress } from '@dsai-io/react';
```

## When to Use

Use Progress when:

- Showing upload/download progress
- Indicating form completion
- Displaying loading with known duration
- Showing step completion

Do not use Progress when:

- Duration is unknown (use Spinner)
- Just showing a statistic (use text)

## Basic Usage

```tsx
<Progress value={60} />
```

## With Label

```tsx
<Progress value={60} label="60% complete" />
<Progress value={60} showValue />  {/* Auto-shows percentage */}
```

## Sizes

```tsx
<Progress size="sm" value={60} />
<Progress size="md" value={60} />
<Progress size="lg" value={60} />
```

## Variants

```tsx
<Progress value={60} variant="default" />
<Progress value={60} variant="success" />
<Progress value={60} variant="warning" />
<Progress value={60} variant="danger" />
```

## Indeterminate

```tsx
<Progress indeterminate />
```

## Accessibility

```tsx
<Progress value={60} aria-label="Upload progress" aria-valuetext="60% uploaded" />
```

## Common Patterns

### File Upload

```tsx
<div>
  <span>{file.name}</span>
  <Progress value={uploadProgress} showValue />
</div>
```

### Step Progress

```tsx
<Progress value={(currentStep / totalSteps) * 100} />
<span>Step {currentStep} of {totalSteps}</span>
```

## Do's and Don'ts

### Do

- Use for measurable progress
- Show percentage or step count
- Update smoothly

### Don't

- Don't use for unknown duration
- Don't jump values erratically
