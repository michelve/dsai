import { CheckIcon, Input, XLgIcon } from '@dsai/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { screen } from 'storybook/test';

/**
 * Input component for text entry.
 * Built with Bootstrap 5 design tokens and WCAG 2.2 AA compliance.
 *
 * Security Features:
 * - Restricts prop spreading to safe HTML attributes only
 * - Blocks dangerous event handlers (onLoad, onError, etc.)
 * - Uses explicit whitelist for input element attributes
 *
 * Accessibility Features (WCAG 2.2 AA):
 * - Native `<input>` element for full keyboard support
 * - Proper `<label>` association with input
 * - `aria-invalid`, `aria-describedby`, `aria-label` support
 * - Error messages linked to input via aria-describedby
 * - Minimum 44×44px touch target via Bootstrap styling
 *
 * Performance Features:
 * - Component wrapped with React.memo to prevent unnecessary re-renders
 * - Class names computed with useMemo for efficient rendering
 * - Event handlers memoized with useCallback
 * - Computed values (hasPrefix, hasSuffix, etc.) memoized
 *
 * @see https://getbootstrap.com/docs/5.3/forms/form-control/
 */
const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A flexible text input component built with Bootstrap 5 classes. ' +
          'Supports multiple types, sizes, validation states, and addons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'Input type',
      table: {
        type: { summary: 'InputType' },
        defaultValue: { summary: 'text' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Input size',
      table: {
        type: { summary: 'InputSize' },
        defaultValue: { summary: 'md' },
      },
    },
    label: {
      control: 'text',
      description: 'Input label',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    helperText: {
      control: 'text',
      description: 'Helper or error message',
      table: {
        type: { summary: 'string' },
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
    success: {
      control: 'boolean',
      description: 'Success state',
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
    readOnly: {
      control: 'boolean',
      description: 'Read-only state',
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
    clearable: {
      control: 'boolean',
      description: 'Show clear button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showCount: {
      control: 'boolean',
      description: 'Show character counter',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    floating: {
      control: 'boolean',
      description: 'Floating label style',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    plaintext: {
      control: 'boolean',
      description: 'Plaintext style',
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
 * Default text input with label
 */
export const Default: Story = {
  args: {
    label: 'Email address',
    type: 'email',
    placeholder: 'Enter your email',
  },
  play: async ({ userEvent }) => {
    const input = screen.getByLabelText('Email address');
    await userEvent.type(input, 'user@example.com');
  },
};

/**
 * Input without label (uses aria-label)
 */
export const WithoutLabel: Story = {
  args: {
    'aria-label': 'Search',
    placeholder: 'Search...',
    type: 'search',
  },
  play: async ({ userEvent }) => {
    const input = screen.getByLabelText('Search');
    await userEvent.type(input, 'storybook');
  },
};

// =============================================================================
// Input Types
// =============================================================================

/**
 * All input types
 */
export const InputTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Input label="Text" type="text" placeholder="Enter text" />
      <Input label="Email" type="email" placeholder="name@example.com" />
      <Input label="Password" type="password" placeholder="Enter password" />
      <Input label="Number" type="number" placeholder="0" />
      <Input label="Phone" type="tel" placeholder="+1 (555) 123-4567" />
      <Input label="URL" type="url" placeholder="https://example.com" />
      <Input label="Search" type="search" placeholder="Search..." />
    </div>
  ),
};

// =============================================================================
// Sizes
// =============================================================================

/**
 * Input sizes
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Input label="Small" size="sm" placeholder="Small input" />
      <Input label="Medium (default)" size="md" placeholder="Medium input" />
      <Input label="Large" size="lg" placeholder="Large input" />
    </div>
  ),
};

// =============================================================================
// States
// =============================================================================

/**
 * Validation states
 */
export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Input label="Default" placeholder="Default state" />
      <Input label="Error" error helperText="This field is required" />
      <Input label="Success" success helperText="Looks good!" defaultValue="Valid input" />
      <Input label="Disabled" disabled placeholder="Disabled input" />
      <Input label="Read Only" readOnly defaultValue="Read-only value" />
    </div>
  ),
};

/**
 * Error state with message
 */
export const ErrorState: Story = {
  args: {
    label: 'Email',
    type: 'email',
    error: true,
    helperText: 'Please enter a valid email address',
    defaultValue: 'invalid-email',
  },
};

/**
 * Success state
 */
export const Success: Story = {
  args: {
    label: 'Username',
    success: true,
    helperText: 'Username is available',
    defaultValue: 'johndoe',
  },
};

// =============================================================================
// Prefix and Suffix
// =============================================================================

/**
 * Input with prefix
 */
export const WithPrefix: Story = {
  args: {
    label: 'Price',
    type: 'number',
    prefix: '$',
    placeholder: '0.00',
  },
  play: async ({ userEvent }) => {
    const input = screen.getByLabelText('Price');
    await userEvent.type(input, '99.99');
  },
};

/**
 * Input with suffix
 */
export const WithSuffix: Story = {
  args: {
    label: 'Email',
    suffix: '@company.com',
    placeholder: 'username',
  },
  play: async ({ userEvent }) => {
    const input = screen.getByLabelText('Email');
    await userEvent.type(input, 'john.doe');
  },
};

/**
 * Input with both prefix and suffix
 */
export const WithPrefixAndSuffix: Story = {
  args: {
    label: 'Amount',
    type: 'number',
    prefix: '$',
    suffix: '.00',
    placeholder: '0',
  },
  play: async ({ userEvent }) => {
    const input = screen.getByLabelText('Amount');
    await userEvent.type(input, '150');
  },
};

/**
 * Input with icon prefix
 */
export const WithIconPrefix: Story = {
  render: () => {
    const SearchIcon = (): React.JSX.Element => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
      </svg>
    );

    return <Input label="Search" type="search" prefix={<SearchIcon />} placeholder="Search..." />;
  },
  play: async ({ userEvent }) => {
    const input = screen.getByLabelText('Search');
    await userEvent.type(input, 'components');
  },
};

// =============================================================================
// Clear Button
// =============================================================================

/**
 * Clearable input
 */
export const Clearable: Story = {
  render: function ClearableInput() {
    const [value, setValue] = useState('Hello World');

    return (
      <Input
        label="Clearable Input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        clearable
        onClear={() => setValue('')}
        helperText="Click the X to clear"
      />
    );
  },
  play: async ({ userEvent }) => {
    const clearButton = screen.getByRole('button');
    await userEvent.click(clearButton);
  },
};

// =============================================================================
// Character Counter
// =============================================================================

/**
 * Input with character counter
 */
export const CharacterCounter: Story = {
  args: {
    label: 'Bio',
    maxLength: 150,
    showCount: true,
    helperText: 'Brief description about yourself',
    placeholder: 'Tell us about yourself...',
  },
  play: async ({ userEvent }) => {
    const input = screen.getByPlaceholderText('Tell us about yourself...');
    await userEvent.type(
      input,
      'I am a developer interested in design systems and component libraries.'
    );
  },
};

/**
 * Character counter with initial value
 */
export const CharacterCounterWithValue: Story = {
  args: {
    label: 'Tweet',
    maxLength: 280,
    showCount: true,
    defaultValue: 'Just shipped a new feature!',
  },
};

// =============================================================================
// Floating Label
// =============================================================================

/**
 * Floating label input
 */
export const FloatingLabel: Story = {
  args: {
    label: 'Email address',
    floating: true,
    placeholder: 'name@example.com',
    type: 'email',
  },
  play: async ({ userEvent }) => {
    const input = screen.getByPlaceholderText('name@example.com');
    await userEvent.type(input, 'user@example.com');
  },
};

/**
 * Floating labels showcase
 */
export const FloatingLabels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Input label="Email address" floating placeholder="name@example.com" type="email" />
      <Input label="Password" floating placeholder="Password" type="password" />
      <Input label="Username" floating placeholder="Username" />
    </div>
  ),
};

// =============================================================================
// Plaintext
// =============================================================================

/**
 * Plaintext readonly input
 */
export const Plaintext: Story = {
  args: {
    label: 'Email',
    plaintext: true,
    readOnly: true,
    defaultValue: 'email@example.com',
  },
};

// =============================================================================
// Required Field
// =============================================================================

/**
 * Required field
 */
export const Required: Story = {
  args: {
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'Required field',
  },
  play: async ({ userEvent }) => {
    const input = screen.getByLabelText('Email');
    await userEvent.type(input, 'required@example.com');
  },
};

// =============================================================================
// Helper Text
// =============================================================================

/**
 * Input with helper text
 */
export const WithHelperText: Story = {
  args: {
    label: 'Password',
    type: 'password',
    helperText: 'Must be at least 8 characters long',
  },
  play: async ({ userEvent }) => {
    const input = screen.getByLabelText('Password');
    await userEvent.type(input, 'SecurePassword123');
  },
};

// =============================================================================
// Controlled Mode
// =============================================================================

/**
 * Controlled input
 */
export const Controlled: Story = {
  render: function ControlledInput() {
    const [value, setValue] = useState('');

    return (
      <div>
        <Input
          label="Controlled Input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type something..."
        />
        <p className="mt-2 text-muted small">Value: {value || '(empty)'}</p>
      </div>
    );
  },
  play: async ({ userEvent }) => {
    const input = screen.getByPlaceholderText('Type something...');
    await userEvent.type(input, 'Controlled component');
  },
};

// =============================================================================
// Form Example
// =============================================================================

/**
 * Login form example
 */
export const LoginForm: Story = {
  render: function LoginFormExample() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const handleSubmit = (e: React.FormEvent): void => {
      e.preventDefault();
      const newErrors: { email?: string; password?: string } = {};

      if (!email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Please enter a valid email';
      }

      if (!password) {
        newErrors.password = 'Password is required';
      } else if (password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        alert('Form submitted successfully!');
      }
    };

    return (
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password || 'Must be at least 8 characters'}
            required
          />
          <button type="submit" className="btn btn-primary">
            Sign In
          </button>
        </div>
      </form>
    );
  },
  play: async ({ userEvent }) => {
    const emailInputs = screen.getAllByDisplayValue('');
    const emailInput = emailInputs[0] as HTMLInputElement;
    const passwordInput = emailInputs[1] as HTMLInputElement;

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'password123');
  },
};

/**
 * Registration form example
 */
export const RegistrationForm: Story = {
  render: function RegistrationFormExample() {
    return (
      <form style={{ maxWidth: '400px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Input label="First Name" required />
            <Input label="Last Name" required />
          </div>
          <Input label="Email" type="email" required />
          <Input label="Phone" type="tel" helperText="Optional" />
          <Input
            label="Password"
            type="password"
            required
            helperText="At least 8 characters with a number"
          />
          <Input label="Confirm Password" type="password" required />
          <button type="submit" className="btn btn-primary">
            Create Account
          </button>
        </div>
      </form>
    );
  },
};

// =============================================================================
// Search Input
// =============================================================================

/**
 * Search input pattern
 */
export const SearchInput: Story = {
  render: function SearchInputExample() {
    const [query, setQuery] = useState('');

    const SearchIcon = (): React.JSX.Element => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
      </svg>
    );

    return (
      <Input
        type="search"
        aria-label="Search"
        prefix={<SearchIcon />}
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        clearable
        onClear={() => setQuery('')}
      />
    );
  },
};

// =============================================================================
// Focus State
// =============================================================================

/**
 * Focus State: data-focused Attribute
 *
 * The Input component exposes a `data-focused` attribute on the input element
 * when it has focus. This enables custom CSS styling for focus states beyond
 * the default browser outline.
 *
 * The attribute is:
 * - `data-focused="true"` when the input is focused
 * - Removed (undefined) when the input loses focus
 */
export const FocusState: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <h5>Focus State with data-focused Attribute</h5>
        <p className="text-muted small">
          Click on the input below to see the focus state. The <code>data-focused</code> attribute
          is set to <code>true</code> when focused.
        </p>
      </div>
      <Input
        label="Focus me"
        placeholder="Click to focus..."
        helperText="Watch the data-focused attribute change"
      />
      <div className="alert alert-info small">
        <strong>Custom Focus Styling:</strong>
        <pre className="mb-0 mt-2">
          {`input[data-focused='true'] {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}`}
        </pre>
      </div>
    </div>
  ),
};

// =============================================================================
// Security Features
// =============================================================================

/**
 * Security: Event Handler Validation
 *
 * The Input component uses a whitelist of safe HTML attributes to prevent
 * dangerous event handlers from being injected via props. All dangerously
 * event handlers (onLoad, onError, etc.) are blocked at the input element level.
 *
 * This protects against XSS vulnerabilities through prop spreading.
 */
export const SecurityEventHandlerValidation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <h5>Safe Attributes Allowed</h5>
        <p className="text-muted small">
          These standard form attributes are safely passed through:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Input label="With name attribute" name="demo-1" />
          <Input label="With required" required />
          <Input label="With title" title="This is a tooltip" />
          <Input label="With aria-label" aria-label="Custom accessible label" />
        </div>
      </div>
      <div>
        <h5>Dangerous Event Handlers Blocked</h5>
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
        <h5>Protected Against Prop Injection</h5>
        <p className="text-muted small">
          Only safe HTML attributes are rendered to the DOM. Dangerous props are silently filtered.
        </p>
      </div>
      <div>
        <h5>Whitelisted Categories</h5>
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
        <Input
          label="Example: Safe and protected"
          name="security-demo"
          title="This input is protected against prop injection attacks"
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
 * Accessibility: Full Keyboard Support
 *
 * The Input component provides full keyboard support for all interactions:
 * - Tab/Shift+Tab: Navigate to/from input
 * - Type: Enter text into input
 * - All states remain accessible: disabled, error, clearable
 */
export const AccessibilityKeyboardNavigation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <h5>Keyboard Navigation Demo</h5>
        <p className="text-muted small">
          Use Tab to navigate and type to enter text. All inputs have proper keyboard support.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Input label="Focus here and type" />
        <Input label="Second input" />
        <Input label="With error" error helperText="Also fully keyboard accessible" />
        <Input label="Disabled input (not in tab order)" disabled />
      </div>
    </div>
  ),
};

/**
 * Accessibility: Screen Reader Support
 *
 * Proper semantic markup and ARIA attributes ensure screen reader compatibility:
 * - Native `<input>` element for full semantic meaning
 * - `<label>` properly associated via `htmlFor`
 * - `aria-describedby` links to helper text and error messages
 * - `aria-invalid` indicates error state
 * - Error/helper messages associated with `id`
 */
export const AccessibilityScreenReaderSupport: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <h5>Screen Reader Friendly</h5>
        <p className="text-muted small">
          Semantic HTML and ARIA attributes provide full accessibility.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Input label="Basic input" />
        <Input label="Required field" required />
        <Input label="With helper text" helperText="This field helps you understand context" />
        <Input label="With error" error helperText="This field is required and has an error" />
        <Input aria-label="Input without visible label" />
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
 * The Input component is optimized with React.memo and useMemo:
 * - React.memo prevents re-renders when parent props don't change
 * - useMemo caches computed class names
 * - useCallback memoizes event handlers
 * - Computed values (hasPrefix, hasSuffix, etc.) are memoized
 *
 * This ensures efficient rendering in complex forms with many inputs.
 */
export const PerformanceMemoization: Story = {
  render: function PerformanceDemo() {
    const [counter, setCounter] = useState(0);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <h5>Memoization Performance Demo</h5>
          <p className="text-muted small">
            The inputs won't re-render unnecessarily when you increment the counter below. Check
            your browser DevTools to see component renders.
          </p>
        </div>

        <div>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={() => setCounter(counter + 1)}
          >
            Increment Counter: {counter}
          </button>
          <p className="text-muted small mt-2">Parent re-renders: {counter} times</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Input label="Memoized input 1" placeholder="Stays efficient" />
          <Input label="Memoized input 2" placeholder="No unnecessary renders" />
          <Input
            label="With performance optimizations"
            helperText="All class names and event handlers are memoized"
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
              Event handlers memoized with useCallback
            </li>
            <li>
              <CheckIcon size={14} className="text-success me-1" />
              Computed values cached for efficient rendering
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
