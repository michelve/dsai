import { useState } from 'react';

import { Input } from '@dsai/react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Input component for text entry.
 * Built with Bootstrap 5 design tokens and WCAG 2.2 AA compliance.
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
export const Error: Story = {
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
};

/**
 * Character counter with initial value
 */
export const CharacterCounterWithValue: Story = {
  args: {
    label: 'Tweet',
    maxLength: 280,
    showCount: true,
    defaultValue: 'Just shipped a new feature! 🚀',
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
// Complete Showcase
// =============================================================================

/**
 * Complete input showcase
 */
export const CompleteShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '500px' }}>
      {/* Basic */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Basic Input</h4>
        <Input label="Name" placeholder="Enter your name" />
      </div>

      {/* Sizes */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Sizes</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Input size="sm" aria-label="Small" placeholder="Small" />
          <Input size="md" aria-label="Medium" placeholder="Medium" />
          <Input size="lg" aria-label="Large" placeholder="Large" />
        </div>
      </div>

      {/* States */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>States</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Input label="Error" error helperText="This field has an error" />
          <Input label="Success" success defaultValue="Valid" />
          <Input label="Disabled" disabled placeholder="Disabled" />
        </div>
      </div>

      {/* Addons */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Addons</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Input label="Price" prefix="$" type="number" placeholder="0.00" />
          <Input label="Domain" suffix=".com" placeholder="example" />
        </div>
      </div>

      {/* Features */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Features</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Input label="Clearable" clearable defaultValue="Clear me" />
          <Input label="Character Count" maxLength={50} showCount />
          <Input label="Floating Label" floating placeholder="Floating" />
          <Input label="Required" required placeholder="Required field" />
        </div>
      </div>
    </div>
  ),
};
