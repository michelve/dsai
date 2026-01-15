/**
 * @file Form Utilities Test Suite (M2.11)
 * @module @dsai-io/react/utils/__tests__/forms-m2.test
 *
 * Comprehensive test coverage for M2.11 Form utilities:
 * - Form data handling: parseFormData, serializeForm
 * - Validation: validateField, validateForm, createValidator
 * - Form state: isFormValid, isFormDirty, getFieldError
 * - Form actions: resetForm, submitForm
 *
 * Target: 100% code coverage for form utilities
 */

import {
  createValidator,
  getFieldError,
  isFormDirty,
  isFormValid,
  parseFormData,
  resetForm,
  serializeForm,
  submitForm,
  validateField,
  validateForm,
  type ValidationSchema,
} from '../forms';

import type { FormValidationResult, ValidationRule } from '../forms/types';

describe('M2.11 Form Utilities', () => {
  describe('parseFormData', () => {
    it('should parse simple form data', () => {
      const formData = new FormData();
      formData.append('name', 'John');
      formData.append('email', 'john@example.com');

      const result = parseFormData(formData);

      expect(result).toEqual({
        name: 'John',
        email: 'john@example.com',
      });
    });

    it('should handle multiple values as arrays', () => {
      const formData = new FormData();
      formData.append('tags', 'react');
      formData.append('tags', 'typescript');
      formData.append('tags', 'testing');

      const result = parseFormData(formData);

      expect(result.tags).toEqual(['react', 'typescript', 'testing']);
    });

    it('should handle files', () => {
      const formData = new FormData();
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      formData.append('file', file);

      const result = parseFormData(formData);

      expect(result.file).toBe(file);
    });

    it('should handle nested object notation with dot', () => {
      const formData = new FormData();
      formData.append('user.name', 'John');
      formData.append('user.email', 'john@example.com');

      const result = parseFormData(formData);

      expect(result).toEqual({
        user: {
          name: 'John',
          email: 'john@example.com',
        },
      });
    });

    it('should handle array bracket notation', () => {
      const formData = new FormData();
      formData.append('tags[0]', 'react');
      formData.append('tags[1]', 'typescript');

      const result = parseFormData(formData);

      expect(result.tags).toEqual(['react', 'typescript']);
    });

    it('should handle empty form data', () => {
      const formData = new FormData();
      const result = parseFormData(formData);

      expect(result).toEqual({});
    });

    it('should handle deep nesting', () => {
      const formData = new FormData();
      formData.append('user.profile.name', 'John');
      formData.append('user.profile.age', '30');

      const result = parseFormData(formData);

      expect(result).toEqual({
        user: {
          profile: {
            name: 'John',
            age: '30',
          },
        },
      });
    });
  });

  describe('serializeForm', () => {
    it('should serialize simple object to URL string', () => {
      const data = {
        name: 'John',
        email: 'john@example.com',
        age: 30,
      };

      const result = serializeForm(data);

      expect(result).toContain('name=John');
      expect(result).toContain('email=john%40example.com');
      expect(result).toContain('age=30');
    });

    it('should handle arrays with indices format (default)', () => {
      const data = {
        tags: ['react', 'typescript', 'testing'],
      };

      const result = serializeForm(data);

      expect(result).toContain('tags%5B0%5D=react');
      expect(result).toContain('tags%5B1%5D=typescript');
      expect(result).toContain('tags%5B2%5D=testing');
    });

    it('should handle arrays with brackets format', () => {
      const data = {
        tags: ['a', 'b', 'c'],
      };

      const result = serializeForm(data, { arrayFormat: 'brackets' });

      expect(result).toContain('tags%5B%5D=a');
      expect(result).toContain('tags%5B%5D=b');
      expect(result).toContain('tags%5B%5D=c');
    });

    it('should handle arrays with repeat format', () => {
      const data = {
        tags: ['x', 'y'],
      };

      const result = serializeForm(data, { arrayFormat: 'repeat' });

      expect(result).toContain('tags=x');
      expect(result).toContain('tags=y');
    });

    it('should handle nested objects', () => {
      const data = {
        user: {
          name: 'John',
          email: 'john@example.com',
        },
      };

      const result = serializeForm(data);

      expect(result).toContain('user.name=John');
      expect(result).toContain('user.email=john%40example.com');
    });

    it('should filter out null and undefined', () => {
      const data = {
        name: 'John',
        middleName: null,
        lastName: undefined,
      };

      const result = serializeForm(data);

      expect(result).toContain('name=John');
      expect(result).not.toContain('middleName');
      expect(result).not.toContain('lastName');
    });

    it('should handle booleans', () => {
      const data = {
        newsletter: true,
        terms: false,
      };

      const result = serializeForm(data);

      expect(result).toContain('newsletter=true');
      expect(result).toContain('terms=false');
    });

    it('should return empty string for empty object', () => {
      const result = serializeForm({});
      expect(result).toBe('');
    });
  });

  describe('validateField', () => {
    it('should return valid for passing validation', async () => {
      const rules: ValidationRule<string>[] = [
        { validate: (v) => v.length > 0, message: 'Required' },
      ];

      const result = await validateField('test', rules);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return error for failing validation', async () => {
      const rules: ValidationRule<string>[] = [
        { validate: (v) => v.length > 5, message: 'Must be longer than 5' },
      ];

      const result = await validateField('test', rules);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Must be longer than 5');
    });

    it('should run rules until first failure', async () => {
      const rules: ValidationRule<string>[] = [
        { validate: (v) => v.length > 0, message: 'Required' },
        { validate: (v) => v.length > 5, message: 'Too short' },
        { validate: (v) => v.includes('@'), message: 'Must contain @' },
      ];

      const result = await validateField('test', rules);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Too short');
    });

    it('should handle async validators', async () => {
      const rules: ValidationRule<string>[] = [
        {
          validate: async (v) => {
            await new Promise((resolve) => setTimeout(resolve, 10));
            return v === 'valid';
          },
          message: 'Invalid value',
        },
      ];

      const result = await validateField('invalid', rules);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid value');
    });

    it('should handle empty rules array', async () => {
      const result = await validateField('test', []);

      expect(result.valid).toBe(true);
    });
  });

  describe('validateForm', () => {
    it('should validate entire form', async () => {
      const data = {
        email: 'john@example.com',
        password: 'password123',
        age: 25,
      };

      const schema: ValidationSchema<typeof data> = {
        email: [{ validate: (v) => v.includes('@'), message: 'Invalid email' }],
        password: [{ validate: (v) => v.length >= 8, message: 'Too short' }],
        age: [{ validate: (v) => v >= 18, message: 'Must be 18+' }],
      };

      const result = await validateForm(data, schema);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should collect all errors', async () => {
      const data = {
        email: 'invalid',
        password: 'short',
        age: 15,
      };

      const schema: ValidationSchema<typeof data> = {
        email: [{ validate: (v) => v.includes('@'), message: 'Invalid email' }],
        password: [{ validate: (v) => v.length >= 8, message: 'Too short' }],
        age: [{ validate: (v) => v >= 18, message: 'Must be 18+' }],
      };

      const result = await validateForm(data, schema);

      expect(result.valid).toBe(false);
      expect(result.errors).toEqual({
        email: 'Invalid email',
        password: 'Too short',
        age: 'Must be 18+',
      });
    });

    it('should handle partial validation', async () => {
      const data = {
        email: 'john@example.com',
        password: 'password123',
      };

      const schema: ValidationSchema<typeof data> = {
        email: [{ validate: (v) => v.includes('@'), message: 'Invalid email' }],
      };

      const result = await validateForm(data, schema);

      expect(result.valid).toBe(true);
    });

    it('should handle empty schema', async () => {
      const data = {
        name: 'John',
      };

      const result = await validateForm(data, {});

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });

  describe('createValidator', () => {
    it('should create reusable validator', async () => {
      const validateEmail = createValidator<string>([
        { validate: (v) => v.length > 0, message: 'Required' },
        { validate: (v) => v.includes('@'), message: 'Invalid email' },
      ]);

      const valid = await validateEmail('john@example.com');
      const invalid = await validateEmail('invalid');

      expect(valid.valid).toBe(true);
      expect(invalid.valid).toBe(false);
      expect(invalid.error).toBe('Invalid email');
    });

    it('should handle complex validation rules', async () => {
      const validatePassword = createValidator<string>([
        { validate: (v) => v.length >= 8, message: 'Min 8 characters' },
        { validate: (v) => /[A-Z]/.test(v), message: 'Need uppercase' },
        { validate: (v) => /[0-9]/.test(v), message: 'Need number' },
      ]);

      const result = await validatePassword('password');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Need uppercase');
    });
  });

  describe('getFieldError', () => {
    it('should get error from validation result', () => {
      const result: FormValidationResult = {
        valid: false,
        errors: {
          email: 'Invalid email',
          password: 'Too short',
        },
      };

      expect(getFieldError(result, 'email')).toBe('Invalid email');
      expect(getFieldError(result, 'password')).toBe('Too short');
    });

    it('should return undefined for valid field', () => {
      const result: FormValidationResult = {
        valid: true,
        errors: {},
      };

      expect(getFieldError(result, 'email')).toBeUndefined();
    });

    it('should return undefined for non-existent field', () => {
      const result: FormValidationResult = {
        valid: false,
        errors: {
          email: 'Invalid',
        },
      };

      expect(getFieldError(result, 'password')).toBeUndefined();
    });
  });

  describe('isFormValid', () => {
    it('should return true for valid form', () => {
      const result: FormValidationResult = {
        valid: true,
        errors: {},
      };

      expect(isFormValid(result)).toBe(true);
    });

    it('should return false for invalid form', () => {
      const result: FormValidationResult = {
        valid: false,
        errors: {
          email: 'Invalid',
        },
      };

      expect(isFormValid(result)).toBe(false);
    });
  });

  describe('isFormDirty', () => {
    it('should return false when values match initial', () => {
      const initial = { name: 'John', email: 'john@example.com' };
      const current = { name: 'John', email: 'john@example.com' };

      expect(isFormDirty(current, initial)).toBe(false);
    });

    it('should return true when values differ', () => {
      const initial = { name: 'John', email: 'john@example.com' };
      const current = { name: 'Jane', email: 'john@example.com' };

      expect(isFormDirty(current, initial)).toBe(true);
    });

    it('should handle nested objects', () => {
      const initial = { user: { name: 'John' } };
      const current = { user: { name: 'Jane' } };

      expect(isFormDirty(current, initial)).toBe(true);
    });

    it('should handle arrays', () => {
      const initial = { tags: ['react', 'typescript'] };
      const current = { tags: ['react', 'javascript'] };

      expect(isFormDirty(current, initial)).toBe(true);
    });

    it('should return false for same reference', () => {
      const data = { name: 'John' };

      expect(isFormDirty(data, data)).toBe(false);
    });
  });

  describe('resetForm', () => {
    it('should return deep clone of initial values', () => {
      const initial = { name: 'John', email: 'john@example.com' };

      const reset = resetForm(initial);

      expect(reset).toEqual(initial);
      expect(reset).not.toBe(initial);
    });

    it('should handle nested objects', () => {
      const initial = {
        user: { name: 'John', age: 30 },
        tags: ['react'],
      };

      const reset = resetForm(initial);

      expect(reset).toEqual(initial);
      expect(reset.user).not.toBe(initial.user);
      expect(reset.tags).not.toBe(initial.tags);
    });
  });

  describe('submitForm', () => {
    it('should submit form with onSuccess callback', async () => {
      const data = { email: 'john@example.com', password: 'password123' };
      const onSuccess = jest.fn();

      const result = await submitForm(data, { onSuccess });

      expect(result.success).toBe(true);
      expect(onSuccess).toHaveBeenCalledWith(data);
    });

    it('should validate before submission if schema provided', async () => {
      const data = { email: 'invalid', password: 'short' };
      const onError = jest.fn();

      const schema: ValidationSchema<typeof data> = {
        email: [{ validate: (v) => v.includes('@'), message: 'Invalid email' }],
      };

      const result = await submitForm(data, { schema, onError });

      expect(result.success).toBe(false);
      expect(result.validation).toBeDefined();
      expect(result.validation?.valid).toBe(false);
      expect(onError).toHaveBeenCalled();
    });

    it('should transform data if transform provided', async () => {
      const data = { email: ' JOHN@EXAMPLE.COM ' };
      const onSuccess = jest.fn();

      await submitForm(data, {
        transform: (d) => ({
          ...d,
          email: d.email.trim().toLowerCase(),
        }),
        onSuccess,
      });

      expect(onSuccess).toHaveBeenCalledWith({
        email: 'john@example.com',
      });
    });

    it('should handle async onSuccess', async () => {
      const data = { email: 'test@example.com' };
      const onSuccess = jest.fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      const result = await submitForm(data, { onSuccess });

      expect(result.success).toBe(true);
      expect(onSuccess).toHaveBeenCalled();
    });

    it('should catch errors and return in result', async () => {
      const data = { email: 'test@example.com' };
      const error = new Error('Network error');

      const result = await submitForm(data, {
        onSuccess: async () => {
          throw error;
        },
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe(error);
    });

    it('should work without any options', async () => {
      const data = { name: 'John' };

      const result = await submitForm(data);

      expect(result.success).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should handle full form workflow', async () => {
      const initialValues = {
        email: '',
        password: '',
        confirmPassword: '',
      };

      const currentValues = {
        email: 'john@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      // Check if dirty
      expect(isFormDirty(currentValues, initialValues)).toBe(true);

      // Validate form
      const schema: ValidationSchema<typeof currentValues> = {
        email: [{ validate: (v) => v.includes('@'), message: 'Invalid email' }],
        password: [{ validate: (v) => v.length >= 8, message: 'Min 8 chars' }],
        confirmPassword: [
          {
            validate: (v) => v === currentValues.password,
            message: 'Passwords must match',
          },
        ],
      };

      const validation = await validateForm(currentValues, schema);
      expect(isFormValid(validation)).toBe(true);

      // Submit form
      const onSuccess = jest.fn();
      const result = await submitForm(currentValues, { schema, onSuccess });

      expect(result.success).toBe(true);
      expect(onSuccess).toHaveBeenCalled();
    });

    it('should handle form with errors', async () => {
      const values = {
        email: 'invalid',
        password: 'short',
      };

      const schema: ValidationSchema<typeof values> = {
        email: [{ validate: (v) => v.includes('@'), message: 'Invalid email' }],
        password: [{ validate: (v) => v.length >= 8, message: 'Min 8 chars' }],
      };

      const validation = await validateForm(values, schema);
      expect(isFormValid(validation)).toBe(false);
      expect(getFieldError(validation, 'email')).toBe('Invalid email');
      expect(getFieldError(validation, 'password')).toBe('Min 8 chars');

      const onError = jest.fn();
      const result = await submitForm(values, { schema, onError });

      expect(result.success).toBe(false);
      expect(onError).toHaveBeenCalled();
    });
  });

  // ========================================
  // Security Tests - Prototype Pollution
  // ========================================
  describe('parseFormData - Security', () => {
    it('should reject __proto__ key (prototype pollution protection)', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const formData = new FormData();
      formData.append('__proto__', 'polluted');
      formData.append('name', 'John');

      const result = parseFormData(formData);

      expect(result).toEqual({ name: 'John' });
      expect(result).not.toHaveProperty('__proto__', 'polluted');
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Skipping dangerous key "__proto__"')
      );
      warnSpy.mockRestore();
    });

    it('should reject constructor key', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const formData = new FormData();
      formData.append('constructor', 'polluted');
      formData.append('valid', 'value');

      const result = parseFormData(formData);

      expect(result).toEqual({ valid: 'value' });
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should reject prototype key', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const formData = new FormData();
      formData.append('prototype', 'polluted');

      const result = parseFormData(formData);

      expect(result).toEqual({});
      warnSpy.mockRestore();
    });

    it('should reject dangerous keys in nested notation', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const formData = new FormData();
      formData.append('user.__proto__.admin', 'true');
      formData.append('user.constructor.polluted', 'value');
      formData.append('user.name', 'John');

      const result = parseFormData(formData);

      expect(result).toEqual({
        user: { name: 'John' },
      });
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should reject dangerous keys in array notation', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const formData = new FormData();
      formData.append('__proto__[0]', 'polluted');
      formData.append('items[0]', 'valid');

      const result = parseFormData(formData);

      expect(result).toEqual({ items: ['valid'] });
      warnSpy.mockRestore();
    });

    it('should reject __defineGetter__ and similar keys', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const formData = new FormData();
      formData.append('__defineGetter__', 'polluted');
      formData.append('__defineSetter__', 'polluted');
      formData.append('__lookupGetter__', 'polluted');
      formData.append('safe', 'value');

      const result = parseFormData(formData);

      expect(result).toEqual({ safe: 'value' });
      warnSpy.mockRestore();
    });
  });

  // ========================================
  // Async Validation Error Handling
  // ========================================
  describe('validateField - Error Handling', () => {
    it('should handle async validators that throw exceptions', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const rules = [
        {
          validate: async () => {
            throw new Error('Network error');
          },
          message: 'Validation failed',
        },
      ];

      const result = await validateField('test', rules);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Validation failed');
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Validator threw an exception'));
      warnSpy.mockRestore();
    });

    it('should handle sync validators that throw exceptions', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const rules = [
        {
          validate: () => {
            throw new TypeError('Cannot read property');
          },
          message: 'Field error',
        },
      ];

      const result = await validateField(null, rules);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Field error');
      warnSpy.mockRestore();
    });

    it('should continue processing after catching exception', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      // First rule throws, validation should stop at first error
      const rules = [
        {
          validate: () => {
            throw new Error('First rule throws');
          },
          message: 'First rule failed',
        },
        {
          validate: () => true,
          message: 'Second rule message',
        },
      ];

      const result = await validateField('test', rules);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('First rule failed');
      warnSpy.mockRestore();
    });

    it('should handle non-Error objects thrown', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const rules = [
        {
          validate: () => {
            throw 'string error'; // Non-Error throw
          },
          message: 'Validation error',
        },
      ];

      const result = await validateField('test', rules);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Validation error');
      warnSpy.mockRestore();
    });
  });

  // ========================================
  // validateForm - Edge Cases
  // ========================================
  describe('validateForm - Edge Cases', () => {
    it('should handle schema fields not present in data', async () => {
      const data = { email: 'test@example.com' };
      const schema = {
        email: [{ validate: (v: string) => v.includes('@'), message: 'Invalid email' }],
        password: [{ validate: (v: string) => v?.length >= 8, message: 'Password required' }],
      };

      // Password is undefined in data but has schema rules
      const result = await validateForm(data as { email: string; password: string }, schema);

      expect(result.valid).toBe(false);
      expect(result.errors.password).toBe('Password required');
    });

    it('should handle empty schema', async () => {
      const data = { email: 'test@example.com' };
      const schema = {};

      const result = await validateForm(data, schema);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should handle async validator rejection in form validation', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const data = { username: 'test' };
      const schema = {
        username: [
          {
            validate: async () => {
              throw new Error('API error');
            },
            message: 'Username check failed',
          },
        ],
      };

      const result = await validateForm(data, schema);

      expect(result.valid).toBe(false);
      expect(result.errors.username).toBe('Username check failed');
      warnSpy.mockRestore();
    });
  });
});
