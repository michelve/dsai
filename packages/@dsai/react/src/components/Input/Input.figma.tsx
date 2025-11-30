/**
 * Figma Code Connect - Input Component
 *
 * Maps the DSAi Input Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module Input/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { Input } from './Input';

/**
 * DSAi Input - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_INPUT>` substitution variable defined in figma.config.json.
 * This allows changing the Figma URL in one place instead of updating every mapping file.
 *
 * Security Features:
 * - Safe attribute whitelist (blocks dangerous event handlers)
 * - No dangerouslySetInnerHTML
 *
 * Accessibility goals:
 * - Require label or aria-label for screen readers
 * - Proper aria-invalid and aria-describedby for validation
 * - Character count announced via aria-live
 */
figma.connect(Input, '<FIGMA_DSAI_INPUT>', {
  props: {
    /**
     * Input type
     * Maps Figma "Type" property to React type prop
     */
    type: figma.enum('Type', {
      Text: 'text',
      Email: 'email',
      Password: 'password',
      Number: 'number',
      Tel: 'tel',
      URL: 'url',
      Search: 'search',
    }),

    /**
     * Input size
     * Maps Figma "Size" property to React size prop
     */
    size: figma.enum('Size', {
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
    }),

    /**
     * Disabled state
     * Maps Figma "Disabled" boolean property
     */
    disabled: figma.boolean('Disabled'),

    /**
     * Read-only state
     * Maps Figma "Read Only" boolean property
     */
    readOnly: figma.boolean('Read Only'),

    /**
     * Required field
     * Maps Figma "Required" boolean property
     */
    required: figma.boolean('Required'),

    /**
     * Error state
     * Maps Figma "Error" boolean property
     */
    error: figma.boolean('Error'),

    /**
     * Success state
     * Maps Figma "Success" boolean property
     */
    success: figma.boolean('Success'),

    /**
     * Floating label style
     * Maps Figma "Floating" boolean property
     */
    floating: figma.boolean('Floating'),

    /**
     * Plaintext readonly display
     * Maps Figma "Plaintext" boolean property
     */
    plaintext: figma.boolean('Plaintext'),

    /**
     * Show clear button
     * Maps Figma "Clearable" boolean property
     */
    clearable: figma.boolean('Clearable'),

    /**
     * Show character count
     * Maps Figma "Show Count" boolean property
     */
    showCount: figma.boolean('Show Count'),

    /**
     * Has prefix addon
     * Maps Figma "Has Prefix" boolean property
     */
    hasPrefix: figma.boolean('Has Prefix'),

    /**
     * Prefix text/content
     * Maps Figma "Prefix" text property
     */
    prefix: figma.string('Prefix'),

    /**
     * Has suffix addon
     * Maps Figma "Has Suffix" boolean property
     */
    hasSuffix: figma.boolean('Has Suffix'),

    /**
     * Suffix text/content
     * Maps Figma "Suffix" text property
     */
    suffix: figma.string('Suffix'),

    /**
     * Input label
     * Maps Figma "Label" text property
     */
    label: figma.string('Label'),

    /**
     * Placeholder text
     * Maps Figma "Placeholder" text property
     */
    placeholder: figma.string('Placeholder'),

    /**
     * Helper or error text
     * Maps Figma "Helper Text" text property
     */
    helperText: figma.string('Helper Text'),

    /**
     * Maximum character length
     * Maps Figma "Max Length" property
     */
    maxLength: figma.enum('Max Length', {
      '50': 50,
      '100': 100,
      '150': 150,
      '200': 200,
      None: undefined,
    }),

    /**
     * Accessible label (for inputs without visible label)
     * Maps Figma "Aria Label" text property
     */
    ariaLabel: figma.string('Aria Label'),
  },

  /**
   * Example code template
   * This is what AI agents and Code Connect will generate by default.
   *
   * Notes:
   * - Label or aria-label required for accessibility
   * - Error state sets aria-invalid automatically
   * - Character count requires maxLength
   */
  example: ({
    type,
    size,
    disabled,
    readOnly,
    required,
    error,
    success,
    floating,
    plaintext,
    clearable,
    showCount,
    hasPrefix,
    prefix,
    hasSuffix,
    suffix,
    label,
    placeholder,
    helperText,
    maxLength,
    ariaLabel,
  }) => {
    // Normalize optional strings
    const normalizedLabel = label && label.trim().length > 0 ? label.trim() : undefined;
    const normalizedPlaceholder =
      placeholder && placeholder.trim().length > 0 ? placeholder.trim() : undefined;
    const normalizedHelperText =
      helperText && helperText.trim().length > 0 ? helperText.trim() : undefined;
    const normalizedAriaLabel =
      ariaLabel && ariaLabel.trim().length > 0 ? ariaLabel.trim() : undefined;
    const normalizedPrefix =
      hasPrefix && prefix && prefix.trim().length > 0 ? prefix.trim() : undefined;
    const normalizedSuffix =
      hasSuffix && suffix && suffix.trim().length > 0 ? suffix.trim() : undefined;

    return (
      <Input
        type={type}
        size={size}
        label={normalizedLabel}
        placeholder={normalizedPlaceholder}
        helperText={normalizedHelperText}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        error={error}
        success={success}
        floating={floating}
        plaintext={plaintext}
        clearable={clearable}
        onClear={clearable ? () => {} : undefined}
        showCount={showCount}
        maxLength={maxLength}
        prefix={normalizedPrefix}
        suffix={normalizedSuffix}
        aria-label={!normalizedLabel ? normalizedAriaLabel : undefined}
      />
    );
  },
});

/**
 * Input Usage Patterns
 *
 * 1. Basic Input:
 *    <Input
 *      label="Email"
 *      type="email"
 *      placeholder="Enter your email"
 *    />
 *
 * 2. With Validation Error:
 *    <Input
 *      label="Username"
 *      error
 *      helperText="Username is already taken"
 *    />
 *
 * 3. With Success State:
 *    <Input
 *      label="Email"
 *      type="email"
 *      success
 *      helperText="Email is available"
 *    />
 *
 * 4. With Prefix and Suffix:
 *    <Input
 *      label="Website"
 *      prefix="https://"
 *      suffix=".com"
 *      placeholder="example"
 *    />
 *
 * 5. With Character Counter:
 *    <Input
 *      label="Bio"
 *      maxLength={150}
 *      showCount
 *      placeholder="Tell us about yourself"
 *    />
 *
 * 6. Clearable Input:
 *    <Input
 *      label="Search"
 *      type="search"
 *      clearable
 *      onClear={() => console.log('Cleared')}
 *    />
 *
 * 7. Floating Label:
 *    <Input
 *      label="Name"
 *      floating
 *      placeholder="Enter your name"
 *    />
 *
 * 8. Password Input:
 *    <Input
 *      label="Password"
 *      type="password"
 *      required
 *    />
 *
 * Accessibility Notes:
 * - Always provide label or aria-label
 * - Error state automatically sets aria-invalid="true"
 * - Helper text linked via aria-describedby
 * - Required indicator shown visually and via aria-required
 *
 * Security Notes:
 * - Component uses attribute whitelist for safety
 * - Dangerous event handlers (onLoad, onError) are blocked
 * - No dangerouslySetInnerHTML
 */
