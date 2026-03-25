import { Button, CheckboxGroup, CheckIcon, Heading, XLgIcon } from '@dsai-io/react';
import { useState } from 'react';

import type { CheckboxGroupOption } from '@dsai-io/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * CheckboxGroup is a high-level component that manages a group of Checkbox components
 * with tri-state (none/some/all) selection logic and optional "select all" functionality.
 *
 * The component owns:
 * - Group selection state via an internal Finite State Machine (FSM)
 * - Derived tri-state (none/some/all) computation
 * - Select-all behavior with indeterminate state
 * - Group-level accessibility (fieldset/legend pattern)
 *
 * FSM States:
 * - `none`: No items selected
 * - `some`: Some items selected (indeterminate)
 * - `all`: All enabled items selected
 *
 * Security Features:
 * - Safe attribute whitelist on underlying Checkbox components
 * - No dangerous prop spreading
 *
 * Accessibility Features (WCAG 2.2 AA):
 * - `<fieldset>` + `<legend>` for semantic grouping
 * - Native `required` attribute on checkbox inputs
 * - `aria-invalid` for error state on fieldset
 * - `aria-describedby` for helper/error text
 * - Select all checkbox uses `aria-checked="mixed"` for indeterminate
 * - Development warning when no accessible label provided
 *
 * @see https://getbootstrap.com/docs/5.3/forms/checks-radios/
 */
const meta: Meta<typeof CheckboxGroup> = {
  title: 'Components/CheckboxGroup',
  component: CheckboxGroup,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A high-level component managing multiple checkboxes with tri-state selection, ' +
          'optional select-all, and full accessibility via fieldset/legend.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Group label rendered as legend',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    options: {
      control: 'object',
      description: 'Array of checkbox options',
      table: {
        type: { summary: 'CheckboxGroupOption[]' },
      },
    },
    value: {
      control: 'object',
      description: 'Controlled selected values',
      table: {
        type: { summary: 'string[]' },
      },
    },
    defaultValue: {
      control: 'object',
      description: 'Initial values (uncontrolled)',
      table: {
        type: { summary: 'string[]' },
      },
    },
    showSelectAll: {
      control: 'boolean',
      description: 'Show select all checkbox',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    selectAllLabel: {
      control: 'text',
      description: 'Label for select all checkbox',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: '"Select all"' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all checkboxes',
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
    errorMessage: {
      control: 'text',
      description: 'Error message',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    helperText: {
      control: 'text',
      description: 'Helper text',
      table: {
        type: { summary: 'ReactNode' },
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
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Layout orientation',
      table: {
        type: { summary: "'vertical' | 'horizontal'" },
        defaultValue: { summary: "'vertical'" },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size passed to child checkboxes',
      table: { type: { summary: "'sm' | 'md' | 'lg'" } },
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'],
      description: 'Color variant passed to child checkboxes',
      table: { type: { summary: 'SemanticColorVariant' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default options for examples
const defaultOptions: CheckboxGroupOption[] = [
  { value: 'email', label: 'Email notifications' },
  { value: 'sms', label: 'SMS notifications' },
  { value: 'push', label: 'Push notifications' },
];

const interestOptions: CheckboxGroupOption[] = [
  { value: 'technology', label: 'Technology' },
  { value: 'sports', label: 'Sports' },
  { value: 'music', label: 'Music' },
  { value: 'travel', label: 'Travel' },
  { value: 'food', label: 'Food & Dining' },
];

const permissionOptions: CheckboxGroupOption[] = [
  { value: 'read', label: 'Read' },
  { value: 'write', label: 'Write' },
  { value: 'delete', label: 'Delete', disabled: true },
  { value: 'admin', label: 'Admin' },
];

// =============================================================================
// Basic Examples
// =============================================================================

/**
 * Default CheckboxGroup with label and options
 */
export const Default: Story = {
  args: {
    label: 'Notification Preferences',
    options: defaultOptions,
  },
};

/**
 * With default values selected
 */
export const WithDefaultValues: Story = {
  args: {
    label: 'Notification Preferences',
    options: defaultOptions,
    defaultValue: ['email', 'push'],
  },
};

/**
 * With helper text
 */
export const WithHelperText: Story = {
  args: {
    label: 'Notification Preferences',
    options: defaultOptions,
    helperText: 'Choose how you want to receive updates',
  },
};

// =============================================================================
// Select All Feature
// =============================================================================

/**
 * With select all checkbox - shows none selected state
 */
export const SelectAllNone: Story = {
  args: {
    label: 'Your Interests',
    options: interestOptions,
    showSelectAll: true,
    defaultValue: [],
  },
};

/**
 * With select all checkbox - shows some selected (indeterminate) state
 */
export const SelectAllSome: Story = {
  args: {
    label: 'Your Interests',
    options: interestOptions,
    showSelectAll: true,
    defaultValue: ['technology', 'music'],
  },
};

/**
 * With select all checkbox - shows all selected state
 */
export const SelectAllAll: Story = {
  args: {
    label: 'Your Interests',
    options: interestOptions,
    showSelectAll: true,
    defaultValue: ['technology', 'sports', 'music', 'travel', 'food'],
  },
};

/**
 * Custom select all label
 */
export const CustomSelectAllLabel: Story = {
  args: {
    label: 'Your Interests',
    options: interestOptions,
    showSelectAll: true,
    selectAllLabel: 'Check all interests',
  },
};

/**
 * Interactive select all demo
 */
export const SelectAllInteractive: Story = {
  render: function SelectAllDemo() {
    const [selected, setSelected] = useState<string[]>(['technology']);

    return (
      <div>
        <CheckboxGroup
          label="Your Interests"
          options={interestOptions}
          showSelectAll
          value={selected}
          onChange={setSelected}
        />
        <div className="mt-3">
          <strong>Selected values:</strong>
          <pre className="mt-2 p-2 bg-light rounded">{JSON.stringify(selected, null, 2)}</pre>
        </div>
      </div>
    );
  },
};

// =============================================================================
// Controlled Mode
// =============================================================================

/**
 * Fully controlled with state
 */
export const Controlled: Story = {
  render: function ControlledGroup() {
    const [selected, setSelected] = useState<string[]>(['email']);

    return (
      <div>
        <CheckboxGroup
          label="Notification Preferences"
          options={defaultOptions}
          value={selected}
          onChange={setSelected}
        />
        <div className="mt-3">
          <Button
            size="sm"
            variant="outline-secondary"
            className="me-2"
            onClick={() => setSelected([])}
          >
            Clear All
          </Button>
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => setSelected(['email', 'sms', 'push'])}
          >
            Select All
          </Button>
        </div>
        <p className="mt-2 text-muted small">
          Selected: {selected.length > 0 ? selected.join(', ') : 'None'}
        </p>
      </div>
    );
  },
};

// =============================================================================
// Disabled States
// =============================================================================

/**
 * Entire group disabled
 */
export const Disabled: Story = {
  args: {
    label: 'Notification Preferences',
    options: defaultOptions,
    defaultValue: ['email'],
    disabled: true,
  },
};

/**
 * Individual options disabled
 */
export const DisabledOptions: Story = {
  args: {
    label: 'File Permissions',
    options: permissionOptions,
    showSelectAll: true,
    helperText: 'Delete permission requires admin approval',
  },
};

/**
 * Select all with disabled options
 *
 * When some options are disabled:
 * - Select all only toggles enabled items
 * - Disabled items are excluded from the count
 */
export const SelectAllWithDisabled: Story = {
  render: function SelectAllDisabledDemo() {
    const [selected, setSelected] = useState<string[]>(['read']);

    return (
      <div>
        <CheckboxGroup
          label="File Permissions"
          options={permissionOptions}
          showSelectAll
          value={selected}
          onChange={setSelected}
        />
        <div className="alert alert-info mt-3 small">
          <strong>Note:</strong> The &quot;Delete&quot; option is disabled and won&apos;t be
          affected by &quot;Select all&quot;. Select all will toggle: Read, Write, Admin.
        </div>
        <p className="text-muted small">
          Selected: {selected.length > 0 ? selected.join(', ') : 'None'}
        </p>
      </div>
    );
  },
};

// =============================================================================
// Error States
// =============================================================================

/**
 * Error state with message
 */
export const ErrorState: Story = {
  args: {
    label: 'Required Selection',
    options: defaultOptions,
    error: true,
    errorMessage: 'Please select at least one notification method',
  },
};

/**
 * Required field
 */
export const Required: Story = {
  args: {
    label: 'Terms and Conditions',
    options: [
      { value: 'terms', label: 'I accept the terms and conditions' },
      { value: 'privacy', label: 'I accept the privacy policy' },
    ],
    required: true,
  },
};

// =============================================================================
// Layout Options
// =============================================================================

/**
 * Horizontal layout
 */
export const Horizontal: Story = {
  args: {
    label: 'Quick Filters',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'pending', label: 'Pending' },
      { value: 'archived', label: 'Archived' },
    ],
    orientation: 'horizontal',
  },
};

// =============================================================================
// Size & Variant Pass-through
// =============================================================================
export const WithSize: Story = {
  args: {
    label: 'Large Group',
    options: defaultOptions,
    size: 'lg',
    showSelectAll: true,
  },
};

export const WithVariant: Story = {
  args: {
    label: 'Success Variant Group',
    options: defaultOptions,
    variant: 'success',
    showSelectAll: true,
    defaultValue: ['email'],
  },
};

// =============================================================================
// FSM State Visualization
// =============================================================================

/**
 * FSM State Diagram
 *
 * The CheckboxGroup uses a Finite State Machine (FSM) to manage selection state.
 * This demo visualizes the current FSM state.
 */
export const FSMStateVisualization: Story = {
  render: function FSMDemo() {
    const [selected, setSelected] = useState<string[]>([]);

    const getState = (): string => {
      if (selected.length === 0) {
        return 'none';
      }
      if (selected.length === interestOptions.length) {
        return 'all';
      }
      return 'some';
    };

    const state = getState();

    return (
      <div>
        <div className="mb-4">
          <Heading level={5}>FSM State Machine</Heading>
          <div className="d-flex gap-3 align-items-center mb-3">
            <div
              className={`p-2 rounded ${state === 'none' ? 'bg-warning text-dark' : 'bg-light'}`}
              style={{ minWidth: '80px', textAlign: 'center' }}
            >
              <strong>none</strong>
              <div className="small">No items</div>
            </div>
            <div className="text-muted">→</div>
            <div
              className={`p-2 rounded ${state === 'some' ? 'bg-info text-dark' : 'bg-light'}`}
              style={{ minWidth: '80px', textAlign: 'center' }}
            >
              <strong>some</strong>
              <div className="small">Partial</div>
            </div>
            <div className="text-muted">→</div>
            <div
              className={`p-2 rounded ${state === 'all' ? 'bg-success text-white' : 'bg-light'}`}
              style={{ minWidth: '80px', textAlign: 'center' }}
            >
              <strong>all</strong>
              <div className="small">All items</div>
            </div>
          </div>
          <p className="text-muted small">
            Current state: <code>{state}</code> | Selected: {selected.length}/
            {interestOptions.length}
          </p>
        </div>

        <CheckboxGroup
          label="Your Interests"
          options={interestOptions}
          showSelectAll
          value={selected}
          onChange={setSelected}
        />
      </div>
    );
  },
};

// =============================================================================
// Form Integration
// =============================================================================

/**
 * Form submission example
 */
export const FormExample: Story = {
  render: function FormDemo() {
    const [notifications, setNotifications] = useState<string[]>(['email']);
    const [interests, setInterests] = useState<string[]>([]);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent): void => {
      e.preventDefault();
      setSubmitted(true);
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <CheckboxGroup
            label="Notification Preferences"
            options={defaultOptions}
            value={notifications}
            onChange={setNotifications}
            name="notifications"
            required
          />
        </div>

        <div className="mb-4">
          <CheckboxGroup
            label="Your Interests"
            options={interestOptions}
            showSelectAll
            value={interests}
            onChange={setInterests}
            name="interests"
            helperText="Select topics you're interested in"
          />
        </div>

        <Button type="submit" variant="primary">
          Submit
        </Button>

        {submitted && (
          <div className="alert alert-success mt-3">
            <strong>Form Submitted!</strong>
            <pre className="mb-0 mt-2">{JSON.stringify({ notifications, interests }, null, 2)}</pre>
          </div>
        )}
      </form>
    );
  },
};

// =============================================================================
// Accessibility Features
// =============================================================================

/**
 * Accessibility: Fieldset/Legend Pattern
 *
 * The CheckboxGroup uses semantic HTML for accessibility:
 * - `<fieldset>` groups related checkboxes
 * - `<legend>` provides the group label
 * - `aria-describedby` links to helper/error text
 * - `aria-invalid` for error state
 * - Native `required` on checkbox inputs when `required` prop is set
 */
export const AccessibilityFieldsetLegend: Story = {
  render: () => (
    <div className="d-flex flex-column gap-4">
      <div>
        <Heading level={5}>Semantic HTML Structure</Heading>
        <p className="text-muted small">
          CheckboxGroup renders as fieldset/legend for proper screen reader support.
        </p>
      </div>

      <CheckboxGroup
        label="Notification Preferences"
        options={defaultOptions}
        helperText="Choose your preferred notification methods"
      />

      <div className="alert alert-info small">
        <strong>HTML Structure:</strong>
        <pre className="mb-0 mt-2">{`<fieldset aria-describedby="...">
  <legend>Notification Preferences</legend>
  <div id="...">Choose your preferred...</div>
  <input type="checkbox" ... />
  ...
</fieldset>`}</pre>
      </div>
    </div>
  ),
};

/**
 * Accessibility: Screen Reader Support
 *
 * Proper ARIA attributes ensure screen reader compatibility:
 * - Group announced with label
 * - Individual checkboxes properly labeled
 * - Error/helper text associated via aria-describedby
 * - Select all announces "mixed" state when indeterminate
 */
export const AccessibilityScreenReader: Story = {
  render: () => (
    <div className="d-flex flex-column gap-4">
      <div>
        <Heading level={5}>Screen Reader Features</Heading>
        <ul className="text-muted small">
          <li>
            <CheckIcon size={14} className="text-success me-1" />
            Group label announced as fieldset legend
          </li>
          <li>
            <CheckIcon size={14} className="text-success me-1" />
            Helper text linked via aria-describedby
          </li>
          <li>
            <CheckIcon size={14} className="text-success me-1" />
            Error state announced via aria-invalid
          </li>
          <li>
            <CheckIcon size={14} className="text-success me-1" />
            Select all announces &quot;mixed&quot; when indeterminate
          </li>
        </ul>
      </div>

      <CheckboxGroup
        label="With Helper Text"
        options={defaultOptions}
        helperText="Helper text is announced by screen readers"
        showSelectAll
        defaultValue={['email']}
      />

      <CheckboxGroup
        label="With Error State"
        options={defaultOptions}
        error
        errorMessage="Error message is announced when focused"
      />
    </div>
  ),
};

/**
 * Accessibility: Development Warnings
 *
 * The component warns in development when accessibility best practices aren't followed:
 * - Warns when no `label` or `aria-label` is provided
 * - Warning only appears once per component instance
 */
export const AccessibilityDevWarnings: Story = {
  render: () => (
    <div className="d-flex flex-column gap-4">
      <div>
        <Heading level={5}>Development-Time Accessibility Warnings</Heading>
        <p className="text-muted small">
          Open browser console to see warnings for missing accessible names.
        </p>
      </div>

      <div className="alert alert-warning small">
        <strong>⚠️ Dev Warning</strong>
        <p className="mb-0 mt-2">A CheckboxGroup without `label` or `aria-label` will log:</p>
        <code className="d-block mt-2 p-2 bg-dark text-light rounded">
          [DSAi CheckboxGroup] Missing accessible label. Provide either a &quot;label&quot; prop or
          an &quot;aria-label&quot; attribute.
        </code>
      </div>

      <div>
        <Heading level={6} className="text-success">
          <CheckIcon size={14} className="me-1" />
          Correct Usage
        </Heading>
        <CheckboxGroup label="With visible label" options={defaultOptions} />
        <CheckboxGroup aria-label="With aria-label" options={defaultOptions} />
      </div>
    </div>
  ),
};

// =============================================================================
// Security Features
// =============================================================================

/**
 * Security: Safe Attribute Handling
 *
 * The underlying Checkbox components use a whitelist of safe HTML attributes.
 * This prevents dangerous event handlers from being injected.
 */
export const SecuritySafeAttributes: Story = {
  render: () => (
    <div className="d-flex flex-column gap-4">
      <div>
        <Heading level={5}>Security Features</Heading>
        <p className="text-muted small">
          CheckboxGroup inherits security features from the Checkbox component.
        </p>
      </div>

      <ul className="small">
        <li>
          <CheckIcon size={14} className="text-success me-1" />
          Safe attribute whitelist on input elements
        </li>
        <li>
          <CheckIcon size={14} className="text-success me-1" />
          Dangerous event handlers filtered (onLoad, onError, etc.)
        </li>
        <li>
          <XLgIcon size={14} className="text-danger me-1" />
          No unrestricted prop spreading
        </li>
      </ul>

      <CheckboxGroup label="Secure Checkbox Group" options={defaultOptions} name="secure-group" />
    </div>
  ),
};

// =============================================================================
// Real-World Examples
// =============================================================================

/**
 * Settings page example
 */
export const SettingsPageExample: Story = {
  render: function SettingsPage() {
    const [emailSettings, setEmailSettings] = useState(['important', 'digest']);
    const [privacySettings, setPrivacySettings] = useState(['profile']);

    return (
      <div className="card" style={{ maxWidth: '500px' }}>
        <div className="card-header">
          <Heading level={5} className="mb-0">
            Account Settings
          </Heading>
        </div>
        <div className="card-body">
          <div className="mb-4">
            <CheckboxGroup
              label="Email Notifications"
              options={[
                { value: 'important', label: 'Important updates' },
                { value: 'digest', label: 'Weekly digest' },
                { value: 'marketing', label: 'Marketing emails' },
                { value: 'product', label: 'Product announcements' },
              ]}
              showSelectAll
              value={emailSettings}
              onChange={setEmailSettings}
            />
          </div>

          <hr />

          <div className="mb-4">
            <CheckboxGroup
              label="Privacy Settings"
              options={[
                { value: 'profile', label: 'Show my profile publicly' },
                { value: 'activity', label: 'Show my activity' },
                { value: 'search', label: 'Allow search engines to index' },
              ]}
              value={privacySettings}
              onChange={setPrivacySettings}
              helperText="Control who can see your information"
            />
          </div>
        </div>
        <div className="card-footer">
          <Button variant="primary">Save Settings</Button>
        </div>
      </div>
    );
  },
};

/**
 * Filter panel example
 */
export const FilterPanelExample: Story = {
  render: function FilterPanel() {
    const [categories, setCategories] = useState<string[]>([]);
    const [status, setStatus] = useState<string[]>(['active']);
    const [priceRange, setPriceRange] = useState<string[]>([]);

    return (
      <div className="card" style={{ maxWidth: '280px' }}>
        <div className="card-header">
          <strong>Filters</strong>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <CheckboxGroup
              label="Category"
              options={[
                { value: 'electronics', label: 'Electronics' },
                { value: 'clothing', label: 'Clothing' },
                { value: 'books', label: 'Books' },
                { value: 'home', label: 'Home & Garden' },
              ]}
              showSelectAll
              selectAllLabel="All categories"
              value={categories}
              onChange={setCategories}
            />
          </div>

          <hr />

          <div className="mb-3">
            <CheckboxGroup
              label="Status"
              options={[
                { value: 'active', label: 'In Stock' },
                { value: 'backorder', label: 'Backorder' },
                { value: 'discontinued', label: 'Discontinued', disabled: true },
              ]}
              value={status}
              onChange={setStatus}
            />
          </div>

          <hr />

          <div className="mb-3">
            <CheckboxGroup
              label="Price Range"
              options={[
                { value: 'under25', label: 'Under $25' },
                { value: '25to50', label: '$25 - $50' },
                { value: '50to100', label: '$50 - $100' },
                { value: 'over100', label: 'Over $100' },
              ]}
              value={priceRange}
              onChange={setPriceRange}
            />
          </div>
        </div>
        <div className="card-footer">
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => {
              setCategories([]);
              setStatus(['active']);
              setPriceRange([]);
            }}
          >
            Reset Filters
          </Button>
        </div>
      </div>
    );
  },
};
