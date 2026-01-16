# Form Utilities

Enterprise-grade form handling utilities for parsing, serialization, validation, and submission.

## Overview

This module provides utilities for:

- Form data parsing and serialization
- Field and form validation
- Form state management
- Form submission with error handling

## Installation

```tsx
import { parseFormData, serializeForm, validateField, validateForm, submitForm } from '@dsai-io/react';
```

---

## Form Data

### `parseFormData`

Parse FormData into structured object.

**Signature:**

```tsx
function parseFormData(formData: FormData): FormData;
```

**Examples:**

```tsx
const data = parseFormData(new FormData(formElement));
// { name: 'John', email: 'john@example.com' }
```

---

### `serializeForm`

Serialize form element to FormData.

**Signature:**

```tsx
function serializeForm(form: HTMLFormElement): FormData;
```

**Examples:**

```tsx
const formData = serializeForm(formRef.current);
```

---

## Validation

### `validateField`

Validate single form field.

**Signature:**

```tsx
function validateField(value: FormFieldValue, rules: ValidationRule[]): FieldValidationResult;
```

**Examples:**

```tsx
const result = validateField(email, [
  { type: 'required', message: 'Email required' },
  { type: 'email', message: 'Invalid email' },
]);

if (!result.valid) {
  console.error(result.errors);
}
```

---

### `validateForm`

Validate entire form against schema.

**Signature:**

```tsx
function validateForm<T>(data: T, schema: ValidationSchema<T>): FormValidationResult;
```

**Examples:**

```tsx
const schema = {
  email: [{ type: 'required' }, { type: 'email' }],
  password: [{ type: 'required' }, { type: 'minLength', value: 8 }],
};

const result = validateForm(formData, schema);
if (!result.valid) {
  setErrors(result.errors);
}
```

---

### `createValidator`

Create reusable custom validator.

**Signature:**

```tsx
function createValidator<T>(validate: (value: T) => boolean | string): Validator<T>;
```

**Examples:**

```tsx
const strongPassword = createValidator((value: string) => {
  if (!/[A-Z]/.test(value)) return 'Must contain uppercase';
  if (!/[0-9]/.test(value)) return 'Must contain number';
  return true;
});
```

---

## Form State

### `isFormDirty`

Check if form has been modified.

**Signature:**

```tsx
function isFormDirty(current: FormData, initial: FormData): boolean;
```

**Examples:**

```tsx
const isDirty = isFormDirty(formState, initialState);
```

---

### `isFormValid`

Check if form passes all validations.

**Signature:**

```tsx
function isFormValid(result: FormValidationResult): boolean;
```

**Examples:**

```tsx
const canSubmit = isFormValid(validationResult);
```

---

### `resetForm`

Reset form to initial state.

**Signature:**

```tsx
function resetForm(form: HTMLFormElement): void;
```

**Examples:**

```tsx
resetForm(formRef.current);
```

---

## Form Submission

### `submitForm`

Submit form with validation and error handling.

**Signature:**

```tsx
function submitForm<T>(data: T, options: SubmitFormOptions<T>): Promise<SubmitFormResult<T>>;

interface SubmitFormOptions<T> {
  schema?: ValidationSchema<T>;
  onSubmit: (data: T) => Promise<unknown>;
  onSuccess?: (result: unknown) => void;
  onError?: (error: Error) => void;
}
```

**Examples:**

```tsx
const result = await submitForm(formData, {
  schema: validationSchema,
  onSubmit: async (data) => {
    const response = await api.post('/users', data);
    return response.data;
  },
  onSuccess: (user) => {
    console.log('User created:', user);
  },
  onError: (error) => {
    console.error('Submit failed:', error);
  },
});
```

---

## Common Patterns

### React Form Hook

```tsx
function useForm<T>(initialValues: T, schema: ValidationSchema<T>) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForm(values, schema);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await submitForm(values, {
        schema,
        onSubmit: async (data) => {
          // API call
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { values, setValues, errors, handleSubmit, isSubmitting };
}
```

### Field Validation Component

```tsx
function ValidatedField({ name, rules, ...props }: Props) {
  const [error, setError] = useState('');

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const result = validateField(e.target.value, rules);
    setError(result.errors[0] || '');
  };

  return (
    <div>
      <input {...props} onBlur={handleBlur} />
      {error && <span className="error">{error}</span>}
    </div>
  );
}
```

---

## Best Practices

1. **Validate on blur, submit on form:**

```tsx
<input onBlur={() => validateField(value, rules)} />
```

1. **Show validation errors clearly:**

```tsx
{
  errors.email && <span role="alert">{errors.email}</span>;
}
```

1. **Disable submit during validation:**

```tsx
<button disabled={isSubmitting || !isFormValid(validation)}>Submit</button>
```

---

## Related Documentation

- [Main Utils README](../README.md)
- [Validation Utilities](../validation/README.md)
- [Safety Utilities](../safety/README.md)

---

## License

Copyright © 2024 DSAi. All rights reserved.
