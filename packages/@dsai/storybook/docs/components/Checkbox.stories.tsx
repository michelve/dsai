import { useState } from 'react';

import { Checkbox } from '@dsai/react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Checkbox component for form inputs with full accessibility support.
 * Built with Bootstrap 5 design tokens and WCAG 2.2 AA compliance.
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
 * Indeterminate state for parent checkboxes
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

    const handleParentChange = () => {
      const newChecked = !allChecked;
      setItems(items.map((item) => ({ ...item, checked: newChecked })));
    };

    const handleChildChange = (id: number) => {
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
export const Error: Story = {
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

    const handleSubmit = (e: React.FormEvent) => {
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
        <button type="submit" className="btn btn-primary mt-3">
          Submit
        </button>
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
// Complete Showcase
// =============================================================================

/**
 * Complete checkbox showcase
 */
export const CompleteShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Basic States */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Basic States</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Checkbox label="Unchecked" />
          <Checkbox label="Checked" defaultChecked />
          <Checkbox label="Indeterminate" indeterminate />
          <Checkbox label="Disabled" disabled />
          <Checkbox label="Disabled checked" disabled defaultChecked />
        </div>
      </div>

      {/* Switch Style */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Switch Style</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Checkbox switch label="Off" />
          <Checkbox switch label="On" defaultChecked />
          <Checkbox switch label="Disabled" disabled />
        </div>
      </div>

      {/* Error States */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Validation</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Checkbox label="Required field" required />
          <Checkbox label="With error" error helperText="This field is required" />
          <Checkbox label="With helper" helperText="Optional helper text" />
        </div>
      </div>

      {/* Layout Options */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Inline Layout</h4>
        <div>
          <Checkbox inline label="Option A" />
          <Checkbox inline label="Option B" />
          <Checkbox inline label="Option C" />
        </div>
      </div>
    </div>
  ),
};
