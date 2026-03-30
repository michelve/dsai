import { Button, Checkbox, CheckIcon, Heading, XLgIcon } from '@dsai-io/react';
import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Checkbox component for form inputs with full accessibility support.
 * Built with Bootstrap 5 design tokens and WCAG 2.2 AA compliance.
 *
 * Security Features:
 * - Unrestricted prop spreading blocked with safe attribute whitelist
 * - Dangerous event handlers (onLoad, onError, etc.) filtered at the input element
 * - Only explicitly whitelisted HTML attributes allowed on the DOM element
 *
 * Accessibility Features (WCAG 2.2 AA):
 * - Native `<input type="checkbox">` element for full keyboard support
 * - Proper `<label>` association for all states
 * - `aria-invalid`, `aria-describedby`, `aria-label` support
 * - `aria-checked="mixed"` for indeterminate state (assistive tech explicit)
 * - Space key toggles checkbox state
 * - Minimum 44×44px touch target via Bootstrap styling
 * - Development warning when no accessible name (label or aria-label) is provided
 *
 * Performance Features:
 * - Component wrapped with React.memo to prevent unnecessary re-renders
 * - Class names computed with useMemo for efficient rendering
 * - Helper text ID memoized for stable references
 *
 * @see https://getbootstrap.com/docs/5.3/forms/checks-radios/
 */
const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A Bootstrap 5 checkbox component supporting controlled and uncontrolled modes, ' +
          'indeterminate state, switch styling, error states, and full accessibility.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Checkbox label text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    checked: {
      control: 'boolean',
      description: 'Controlled checked state',
      table: {
        type: { summary: 'boolean' },
      },
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Initial checked state (uncontrolled)',
      table: {
        type: { summary: 'boolean' },
      },
    },
    indeterminate: {
      control: 'boolean',
      description: 'Indeterminate (partial) state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      control: 'boolean',
      description: 'Error state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    helperText: {
      control: 'text',
      description: 'Helper or error message',
      table: {
        type: { summary: 'string' },
      },
    },
    inline: {
      control: 'boolean',
      description: 'Inline display',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    reverse: {
      control: 'boolean',
      description: 'Reverse label/checkbox order',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    switch: {
      control: 'boolean',
      description: 'Switch toggle style',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Required field',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Checkbox size',
      table: { type: { summary: "'sm' | 'md' | 'lg'" } },
    },
    readOnly: {
      control: 'boolean',
      description: 'ReadOnly mode',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'],
      description: 'Color variant',
      table: { type: { summary: 'SemanticColorVariant' } },
    },
    loading: {
      control: 'boolean',
      description: 'Loading state — shows spinner and disables interaction',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    description: {
      control: 'text',
      description: 'Persistent description text displayed below the label',
      table: { type: { summary: 'ReactNode' } },
    },
    onCheckedChange: {
      action: 'checkedChange',
      description: 'Convenience callback receiving boolean checked state',
      table: { type: { summary: '(checked: boolean) => void' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// Basic Examples
// =============================================================================

/**
 * Default checkbox with label
 */
export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
};

/**
 * Checkbox with default checked state
 */
export const DefaultChecked: Story = {
  args: {
    label: 'Remember me',
    defaultChecked: true,
  },
};

/**
 * Checkbox without label (uses aria-label)
 */
export const WithoutLabel: Story = {
  args: {
    'aria-label': 'Select row',
  },
};

// =============================================================================
// Controlled Mode
// =============================================================================

/**
 * Controlled checkbox with state
 */
export const Controlled: Story = {
  render: function ControlledCheckbox() {
    const [checked, setChecked] = useState(false);
    return (
      <div>
        <Checkbox
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          label={`Checkbox is ${checked ? 'checked' : 'unchecked'}`}
        />
        <p className="mt-2 small text-muted">State: {checked ? 'true' : 'false'}</p>
      </div>
    );
  },
};

// =============================================================================
// Indeterminate State
// =============================================================================

/**
 * Indeterminate state for parent checkboxes.
 *
 * When `indeterminate` is true:
 * - The DOM `indeterminate` property is set via JavaScript (no HTML attribute exists)
 * - `aria-checked="mixed"` is added for assistive technology support
 *
 * This is commonly used for "select all" parent checkboxes.
 */
export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    label: 'Select all',
  },
};

/**
 * Parent-child checkbox pattern
 */
export const ParentChildPattern: Story = {
  render: function ParentChild() {
    const [items, setItems] = useState([
      { id: 1, label: 'Item 1', checked: false },
      { id: 2, label: 'Item 2', checked: true },
      { id: 3, label: 'Item 3', checked: false },
    ]);

    const allChecked = items.every((item) => item.checked);
    const someChecked = items.some((item) => item.checked);
    const isIndeterminate = someChecked && !allChecked;

    const handleParentChange = (): void => {
      const newChecked = !allChecked;
      setItems(items.map((item) => ({ ...item, checked: newChecked })));
    };

    const handleChildChange = (id: number): void => {
      setItems(items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
    };

    return (
      <div>
        <Checkbox
          indeterminate={isIndeterminate}
          checked={allChecked}
          onChange={handleParentChange}
          label="Select all"
        />
        <div className="ms-4 mt-2">
          {items.map((item) => (
            <Checkbox
              key={item.id}
              checked={item.checked}
              onChange={() => handleChildChange(item.id)}
              label={item.label}
            />
          ))}
        </div>
      </div>
    );
  },
};

// =============================================================================
// Switch Style
// =============================================================================

/**
 * Switch toggle style
 */
export const Switch: Story = {
  args: {
    switch: true,
    label: 'Enable notifications',
  },
};

/**
 * Switch with default checked
 */
export const SwitchChecked: Story = {
  args: {
    switch: true,
    label: 'Dark mode',
    defaultChecked: true,
  },
};

/**
 * Multiple switches
 */
export const MultipleSwitches: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Checkbox switch label="Email notifications" defaultChecked />
      <Checkbox switch label="Push notifications" />
      <Checkbox switch label="SMS notifications" disabled />
    </div>
  ),
};

// =============================================================================
// States
// =============================================================================

/**
 * Disabled checkbox
 */
export const Disabled: Story = {
  args: {
    label: 'Disabled checkbox',
    disabled: true,
  },
};

/**
 * Disabled and checked
 */
export const DisabledChecked: Story = {
  args: {
    label: 'Disabled checked',
    disabled: true,
    defaultChecked: true,
  },
};

/**
 * Error state
 */
export const ErrorState: Story = {
  args: {
    label: 'I agree to the terms',
    error: true,
    helperText: 'You must accept the terms to continue',
  },
};

/**
 * Required field
 */
export const Required: Story = {
  args: {
    label: 'I accept the privacy policy',
    required: true,
  },
};

// =============================================================================
// Helper Text
// =============================================================================

/**
 * With helper text
 */
export const WithHelperText: Story = {
  args: {
    label: 'Subscribe to newsletter',
    helperText: "We'll send you updates about new features and promotions",
  },
};

/**
 * Error with helper text
 */
export const ErrorWithHelperText: Story = {
  args: {
    label: 'Accept terms',
    error: true,
    helperText: 'This field is required',
  },
};

// =============================================================================
// Layout Options
// =============================================================================

/**
 * Inline checkboxes
 */
export const Inline: Story = {
  render: () => (
    <div>
      <Checkbox inline label="Option 1" />
      <Checkbox inline label="Option 2" />
      <Checkbox inline label="Option 3" />
    </div>
  ),
};

/**
 * Reverse layout (label on left)
 */
export const Reverse: Story = {
  args: {
    reverse: true,
    label: 'Label on the left',
  },
};

/**
 * Stacked checkboxes
 */
export const Stacked: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <Checkbox label="Option 1" defaultChecked />
      <Checkbox label="Option 2" />
      <Checkbox label="Option 3" />
      <Checkbox label="Option 4" disabled />
    </div>
  ),
};

// =============================================================================
// Size Variants
// =============================================================================
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Checkbox size="sm" label="Small checkbox" />
      <Checkbox label="Default checkbox (md)" />
      <Checkbox size="lg" label="Large checkbox" />
    </div>
  ),
};

export const SizesWithSwitch: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Checkbox size="sm" switch label="Small switch" />
      <Checkbox switch label="Default switch (md)" />
      <Checkbox size="lg" switch label="Large switch" />
    </div>
  ),
};

// =============================================================================
// Color Variants
// =============================================================================
export const ColorVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Checkbox variant="primary" defaultChecked label="Primary" />
      <Checkbox variant="secondary" defaultChecked label="Secondary" />
      <Checkbox variant="success" defaultChecked label="Success" />
      <Checkbox variant="danger" defaultChecked label="Danger" />
      <Checkbox variant="warning" defaultChecked label="Warning" />
      <Checkbox variant="info" defaultChecked label="Info" />
    </div>
  ),
};

// =============================================================================
// ReadOnly Mode
// =============================================================================
export const ReadOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Checkbox readOnly checked onChange={() => {}} label="ReadOnly checked" />
      <Checkbox readOnly label="ReadOnly unchecked" />
      <Checkbox readOnly indeterminate label="ReadOnly indeterminate" />
      <Checkbox disabled label="Disabled (for comparison)" />
    </div>
  ),
};

// =============================================================================
// Custom Icons
// =============================================================================
export const CustomIcons: Story = {
  render: function CustomIconDemo() {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        checkedIcon={<CheckIcon size={18} className="text-success" />}
        uncheckedIcon={<XLgIcon size={18} className="text-muted" />}
        label="Custom check/x icons"
      />
    );
  },
};

// =============================================================================
// Form Integration
// =============================================================================

/**
 * Form with checkboxes
 */
export const FormExample: Story = {
  render: function FormCheckboxes() {
    const [formData, setFormData] = useState({
      terms: false,
      newsletter: true,
      marketing: false,
    });

    const handleSubmit = (e: React.FormEvent): void => {
      e.preventDefault();
      alert(JSON.stringify(formData, null, 2));
    };

    return (
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Checkbox
            name="terms"
            checked={formData.terms}
            onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
            label="I accept the terms and conditions"
            required
          />
          <Checkbox
            name="newsletter"
            checked={formData.newsletter}
            onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
            label="Subscribe to newsletter"
            helperText="Get weekly updates about new features"
          />
          <Checkbox
            name="marketing"
            checked={formData.marketing}
            onChange={(e) => setFormData({ ...formData, marketing: e.target.checked })}
            label="Receive marketing emails"
          />
        </div>
        <Button type="submit" variant="primary" className="mt-3">
          Submit
        </Button>
      </form>
    );
  },
};

/**
 * Checkbox group with fieldset
 */
export const CheckboxGroup: Story = {
  render: () => (
    <fieldset>
      <legend className="h6">Select your interests</legend>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <Checkbox name="interests" value="technology" label="Technology" />
        <Checkbox name="interests" value="sports" label="Sports" />
        <Checkbox name="interests" value="music" label="Music" />
        <Checkbox name="interests" value="travel" label="Travel" />
      </div>
    </fieldset>
  ),
};

// =============================================================================
// Security Features
// =============================================================================

/**
 * Security: Event Handler Validation
 *
 * The Checkbox component uses a whitelist of safe HTML attributes to prevent
 * dangerous event handlers from being injected via props. All dangerously
 * event handlers (onLoad, onError, etc.) are blocked at the input element level.
 *
 * This protects against XSS vulnerabilities through prop spreading.
 */
export const SecurityEventHandlerValidation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <Heading level={5}>Safe Attributes Allowed</Heading>
        <p className="text-muted small">
          These standard form attributes are safely passed through:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Checkbox label="With name attribute" name="demo-1" />
          <Checkbox label="With required" required />
          <Checkbox label="With title" title="This is a tooltip" />
          <Checkbox label="With aria-label" aria-label="Custom accessible label" />
        </div>
      </div>
      <div>
        <Heading level={5}>Dangerous Event Handlers Blocked</Heading>
        <p className="text-muted small">
          Event handlers like onLoad, onError, etc. are automatically filtered out to prevent XSS
          attacks.
        </p>
      </div>
    </div>
  ),
};

/**
 * Security: Prop Whitelist Protection
 *
 * Only explicitly whitelisted HTML attributes are allowed on the input element.
 * This prevents injection of dangerous attributes and event handlers through
 * the `rest` props parameter.
 */
export const SecurityPropWhitelist: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <Heading level={5}>Protected Against Prop Injection</Heading>
        <p className="text-muted small">
          Only safe HTML attributes are rendered to the DOM. Dangerous props are silently filtered.
        </p>
      </div>
      <div>
        <Heading level={5}>Whitelisted Categories</Heading>
        <ul className="text-muted small">
          <li>
            <CheckIcon size={14} className="text-success me-1" />
            Standard HTML attributes (name, value, disabled, required, etc.)
          </li>
          <li>
            <CheckIcon size={14} className="text-success me-1" />
            All ARIA attributes (aria-label, aria-describedby, etc.)
          </li>
          <li>
            <CheckIcon size={14} className="text-success me-1" />
            Input-specific attributes (autoComplete, tabIndex, etc.)
          </li>
          <li>
            <XLgIcon size={14} className="text-danger me-1" />
            All event handlers (onClick, onLoad, onError, etc.)
          </li>
          <li>
            <XLgIcon size={14} className="text-danger me-1" />
            Dangerous properties (innerHTML, dangerouslySetInnerHTML, etc.)
          </li>
        </ul>
      </div>
      <div>
        <Checkbox
          label="Example: Safe and protected"
          name="security-demo"
          title="This checkbox is protected against prop injection attacks"
          required
        />
      </div>
    </div>
  ),
};

// =============================================================================
// Accessibility Features
// =============================================================================

/**
 * Accessibility: Keyboard Navigation
 *
 * The Checkbox component provides full keyboard support for all interactions:
 * - Tab/Shift+Tab: Navigate to/from checkbox
 * - Space: Toggle checkbox state
 * - All states remain accessible: disabled, error, indeterminate
 */
export const AccessibilityKeyboardNavigation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <Heading level={5}>Keyboard Navigation Demo</Heading>
        <p className="text-muted small">
          Use Tab to navigate and Space to toggle. All checkboxes have proper keyboard support.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Checkbox label="Focus here and press Space" />
        <Checkbox label="Second checkbox" />
        <Checkbox label="Third checkbox" error helperText="Also fully keyboard accessible" />
        <Checkbox label="Disabled checkbox (not in tab order)" disabled />
      </div>
    </div>
  ),
};

/**
 * Accessibility: Screen Reader Support
 *
 * Proper semantic markup and ARIA attributes ensure screen reader compatibility:
 * - Native `<input type="checkbox">` for full semantic meaning
 * - `<label>` properly associated via `htmlFor`
 * - `aria-describedby` links to helper text
 * - `aria-invalid` indicates error state
 * - `aria-checked="mixed"` for indeterminate state
 * - Error/helper messages associated with `id`
 */
export const AccessibilityScreenReaderSupport: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <Heading level={5}>Screen Reader Friendly</Heading>
        <p className="text-muted small">
          Semantic HTML and ARIA attributes provide full accessibility.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Checkbox label="Basic checkbox" />
        <Checkbox label="Required field" required />
        <Checkbox label="With helper text" helperText="This field helps you understand context" />
        <Checkbox label="With error" error helperText="This field is required and has an error" />
        <Checkbox indeterminate label="Indeterminate (aria-checked=mixed)" />
        <Checkbox aria-label="Checkbox without visible label" />
      </div>
    </div>
  ),
};

/**
 * Accessibility: Development Warnings
 *
 * The Checkbox component includes development-time warnings to catch accessibility issues early:
 * - Warns when neither `label` nor `aria-label` is provided
 * - Warning only appears once per component instance
 * - Only in development mode (not in production builds)
 *
 * This helps developers catch missing accessible names before deployment.
 */
export const AccessibilityDevWarnings: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <Heading level={5}>Development-Time Accessibility Warnings</Heading>
        <p className="text-muted small">
          The Checkbox component warns in development when accessibility best practices are not
          followed.
        </p>
      </div>

      <div className="alert alert-warning small">
        <strong>⚠️ Dev Warning Example</strong>
        <p className="mb-0 mt-2">
          Open your browser&apos;s console. A checkbox without `label` or `aria-label` will log:
        </p>
        <code className="d-block mt-2 p-2 bg-dark text-light rounded">
          [DSAi Checkbox] Missing accessible name. Provide either a &quot;label&quot; prop or an
          &quot;aria-label&quot; attribute for screen reader users.
        </code>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div>
          <Heading level={6} className="text-success">
            <CheckIcon size={14} className="me-1" />
            Correct Usage
          </Heading>
          <Checkbox label="With visible label" />
          <Checkbox aria-label="With aria-label for screen readers" />
        </div>
      </div>

      <div className="alert alert-info small">
        <strong>Why This Matters:</strong>
        <ul className="mb-0 mt-2">
          <li>Screen readers need text to announce the checkbox purpose</li>
          <li>WCAG 2.2 requires all form controls to have accessible names</li>
          <li>Early warnings prevent accessibility issues in production</li>
        </ul>
      </div>
    </div>
  ),
};

// =============================================================================
// Performance Features
// =============================================================================

/**
 * Performance: Memoization
 *
 * The Checkbox component is optimized with React.memo and useMemo:
 * - React.memo prevents re-renders when parent props don't change
 * - useMemo caches computed class names
 * - Helper text ID is memoized for stable references
 *
 * This ensures efficient rendering in complex forms with many checkboxes.
 */
export const PerformanceMemoization: Story = {
  render: function PerformanceDemo() {
    const [counter, setCounter] = useState(0);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <Heading level={5}>Memoization Performance Demo</Heading>
          <p className="text-muted small">
            The checkboxes won&apos;t re-render unnecessarily when you increment the counter below.
            Check your browser DevTools to see component renders.
          </p>
        </div>

        <div>
          <Button size="sm" variant="outline-primary" onClick={() => setCounter(counter + 1)}>
            Increment Counter: {counter}
          </Button>
          <p className="text-muted small mt-2">Parent re-renders: {counter} times</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Checkbox label="Memoized checkbox 1" />
          <Checkbox label="Memoized checkbox 2" />
          <Checkbox label="Memoized checkbox 3" />
          <Checkbox
            label="With performance optimizations"
            helperText="All class names are memoized"
          />
        </div>

        <div className="alert alert-info small">
          <strong>Performance Benefits:</strong>
          <ul className="mb-0 mt-2">
            <li>
              <CheckIcon size={14} className="text-success me-1" />
              Component wrapped with React.memo
            </li>
            <li>
              <CheckIcon size={14} className="text-success me-1" />
              Class names memoized with useMemo
            </li>
            <li>
              <CheckIcon size={14} className="text-success me-1" />
              Helper text ID computed once and cached
            </li>
            <li>
              <CheckIcon size={14} className="text-success me-1" />
              Efficient re-render only when actual props change
            </li>
          </ul>
        </div>
      </div>
    );
  },
};

// =============================================================================
// Loading State
// =============================================================================

/**
 * Loading state — shows a spinner and disables interaction.
 * Sets `aria-busy="true"` for assistive technologies.
 * Useful for async operations like saving preferences.
 */
export const Loading: Story = {
  args: {
    loading: true,
    label: 'Saving preference...',
  },
};

/**
 * Loading state with checked checkbox
 */
export const LoadingChecked: Story = {
  args: {
    loading: true,
    checked: true,
    onChange: () => {},
    label: 'Processing...',
  },
};

/**
 * Loading vs Disabled comparison
 */
export const LoadingVsDisabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Checkbox loading label="Loading (shows spinner, aria-busy)" />
      <Checkbox disabled label="Disabled (greyed out, no spinner)" />
      <Checkbox label="Normal (interactive)" />
    </div>
  ),
};

// =============================================================================
// Description Prop
// =============================================================================

/**
 * Persistent description text displayed below the label.
 * Unlike `helperText` (used for validation feedback), `description`
 * provides permanent contextual information.
 */
export const WithDescription: Story = {
  args: {
    label: 'Enable two-factor authentication',
    description: 'Adds an extra layer of security to your account using an authenticator app.',
  },
};

/**
 * Description with validation feedback
 */
export const DescriptionWithError: Story = {
  args: {
    label: 'Accept terms of service',
    description: 'By checking this box, you agree to our terms and privacy policy.',
    error: true,
    helperText: 'You must accept the terms to continue',
  },
};

// =============================================================================
// onCheckedChange Callback
// =============================================================================

/**
 * Convenience callback that receives the boolean checked state directly.
 * Matches the API convention of Radix, Chakra UI, and shadcn/ui.
 * Can be used alongside or instead of `onChange`.
 */
export const OnCheckedChange: Story = {
  render: function OnCheckedChangeDemo() {
    const [checked, setChecked] = useState(false);
    return (
      <div>
        <Checkbox
          checked={checked}
          onCheckedChange={setChecked}
          label="Using onCheckedChange (simpler API)"
        />
        <p className="mt-2 small text-muted">State: {checked ? 'true' : 'false'}</p>
      </div>
    );
  },
};

// =============================================================================
// Data State Attribute
// =============================================================================

/**
 * The `data-state` attribute is set on the wrapper div for CSS targeting.
 * Values: `checked`, `unchecked`, or `indeterminate`.
 * Matches the Radix UI convention for styling via data attributes.
 */
export const DataStateAttribute: Story = {
  render: function DataStateDemo() {
    const [checked, setChecked] = useState(false);
    return (
      <div>
        <Checkbox
          checked={checked}
          onCheckedChange={setChecked}
          label="Toggle to see data-state change"
        />
        <p className="mt-2 small text-muted">
          data-state={checked ? '"checked"' : '"unchecked"'}
        </p>
        <Checkbox indeterminate label="data-state=&quot;indeterminate&quot;" />
      </div>
    );
  },
};
