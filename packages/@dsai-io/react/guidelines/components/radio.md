# Radio Component Guidelines

The Radio component provides single selection from mutually exclusive options.

## Import

```tsx
import { Radio, RadioGroup } from '@dsai/react';
```

## When to Use

Use Radio when:

- User must select exactly one option
- Options are mutually exclusive
- All options should be visible at once
- 2-6 options are available

Do not use Radio when:

- Multiple selections are allowed (use Checkbox)
- More than 6 options (use Select)
- Binary toggle (use Switch for on/off settings)

## Basic Usage

```tsx
<RadioGroup label="Payment method">
  <Radio value="card" label="Credit Card" />
  <Radio value="paypal" label="PayPal" />
  <Radio value="bank" label="Bank Transfer" />
</RadioGroup>
```

## Controlled

```tsx
const [method, setMethod] = useState('card');

<RadioGroup label="Payment method" value={method} onChange={(value) => setMethod(value)}>
  <Radio value="card" label="Credit Card" />
  <Radio value="paypal" label="PayPal" />
  <Radio value="bank" label="Bank Transfer" />
</RadioGroup>;
```

## With Descriptions

```tsx
<RadioGroup label="Shipping speed">
  <Radio value="standard" label="Standard Shipping" description="5-7 business days - Free" />
  <Radio value="express" label="Express Shipping" description="2-3 business days - $9.99" />
  <Radio value="overnight" label="Overnight Shipping" description="Next business day - $24.99" />
</RadioGroup>
```

## Sizes

```tsx
<RadioGroup label="Size">
  <Radio size="sm" value="sm" label="Small" />
  <Radio size="md" value="md" label="Medium" />
  <Radio size="lg" value="lg" label="Large" />
</RadioGroup>
```

## Orientation

### Vertical (default)

```tsx
<RadioGroup label="Choose an option" orientation="vertical">
  <Radio value="a" label="Option A" />
  <Radio value="b" label="Option B" />
  <Radio value="c" label="Option C" />
</RadioGroup>
```

### Horizontal

```tsx
<RadioGroup label="Choose an option" orientation="horizontal">
  <Radio value="a" label="Option A" />
  <Radio value="b" label="Option B" />
  <Radio value="c" label="Option C" />
</RadioGroup>
```

## Disabled State

```tsx
<RadioGroup label="Plan" defaultValue="free">
  <Radio value="free" label="Free" />
  <Radio value="pro" label="Pro" />
  <Radio value="enterprise" label="Enterprise" disabled />
</RadioGroup>

// Entire group disabled
<RadioGroup label="Status" disabled>
  <Radio value="active" label="Active" />
  <Radio value="inactive" label="Inactive" />
</RadioGroup>
```

## Error State

```tsx
<RadioGroup label="Subscription" error="Please select a subscription plan" required>
  <Radio value="monthly" label="Monthly" />
  <Radio value="annual" label="Annual" />
</RadioGroup>
```

## Form Integration

```tsx
<form onSubmit={handleSubmit}>
  <RadioGroup name="contactPreference" label="Preferred contact method" required>
    <Radio value="email" label="Email" />
    <Radio value="phone" label="Phone" />
    <Radio value="sms" label="SMS" />
  </RadioGroup>

  <Button type="submit">Submit</Button>
</form>
```

## Card-Style Radio

```tsx
<RadioGroup label="Select a plan">
  {plans.map((plan) => (
    <Radio key={plan.id} value={plan.id} asChild>
      <Card interactive>
        <Card.Body>
          <h4>{plan.name}</h4>
          <p>{plan.price}/month</p>
          <ul>
            {plan.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </Card.Body>
      </Card>
    </Radio>
  ))}
</RadioGroup>
```

## Accessibility

- RadioGroup provides accessible group label
- Arrow keys navigate between options
- Space selects the focused option
- Tab moves focus to the group, not individual radios

```tsx
// Accessible by default
<RadioGroup label="Options">
  <Radio value="a" label="Option A" />
  <Radio value="b" label="Option B" />
</RadioGroup>
```

## Radio vs Checkbox vs Select

| Radio                 | Checkbox            | Select             |
| --------------------- | ------------------- | ------------------ |
| Exactly one selection | Zero or more        | Exactly one        |
| All options visible   | All options visible | Hidden until click |
| 2-6 options           | Any number          | 5+ options         |
| Mutually exclusive    | Independent         | Mutually exclusive |

```tsx
// Radio - one of few visible options
<RadioGroup label="Size">
  <Radio value="s" label="S" />
  <Radio value="m" label="M" />
  <Radio value="l" label="L" />
</RadioGroup>

// Checkbox - multiple selections
<CheckboxGroup label="Toppings">
  <Checkbox value="cheese" label="Cheese" />
  <Checkbox value="pepperoni" label="Pepperoni" />
</CheckboxGroup>

// Select - many options
<Select label="Country">
  {countries.map(c => <Select.Option value={c.code}>{c.name}</Select.Option>)}
</Select>
```

## Common Patterns

### Yes/No Question

```tsx
<RadioGroup label="Do you agree to the terms?" required>
  <Radio value="yes" label="Yes, I agree" />
  <Radio value="no" label="No, I do not agree" />
</RadioGroup>
```

### Rating Scale

```tsx
<RadioGroup label="How satisfied are you?" orientation="horizontal">
  <Radio value="1" label="1" aria-label="Very unsatisfied" />
  <Radio value="2" label="2" aria-label="Unsatisfied" />
  <Radio value="3" label="3" aria-label="Neutral" />
  <Radio value="4" label="4" aria-label="Satisfied" />
  <Radio value="5" label="5" aria-label="Very satisfied" />
</RadioGroup>
```

### Filter Options

```tsx
<RadioGroup label="Sort by" value={sortBy} onChange={setSortBy} orientation="horizontal">
  <Radio value="newest" label="Newest" />
  <Radio value="popular" label="Most Popular" />
  <Radio value="price-low" label="Price: Low to High" />
  <Radio value="price-high" label="Price: High to Low" />
</RadioGroup>
```

## Do's and Don'ts

### Do

- Always use with RadioGroup for accessibility
- Provide clear, distinct labels
- Set a default selection when appropriate
- Keep number of options manageable (2-6)

### Don't

- Don't use for multiple selections
- Don't use without a group label
- Don't use for toggling settings (use Switch)
- Don't use when options exceed 6 (use Select)
