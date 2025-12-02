import { CardList, CheckIcon, XLgIcon } from '@dsai/react';
import { type ReactElement, useState } from 'react';

import type { CardListItem } from '@dsai/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

// Define a simplified props type for Storybook since CardListProps is a discriminated union
// that doesn't work well with Storybook's type inference
interface CardListStorybookProps {
  items: CardListItem[];
  selectionMode?: 'none' | 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[] | undefined) => void;
  name?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  variant?: 'elevated' | 'outlined' | 'ghost';
  selectedColor?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark';
  horizontal?: boolean;
  orientation?: 'horizontal' | 'vertical';
  gap?: string;
  columns?: number;
  label?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  helperText?: string;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

/**
 * CardList is a high-level component that manages a group of SelectableCard components
 * with FSM-based selection logic. It supports three selection modes: none (display only),
 * single (radio-like), and multiple (checkbox-like).
 *
 * The component owns:
 * - Group selection state via an internal Finite State Machine (FSM)
 * - Derived visual state (none/one/some/all) computation
 * - Group-level accessibility (fieldset/legend pattern)
 * - Responsive grid/flex layout options
 *
 * FSM Visual States:
 * - `none`: No items selected
 * - `one`: Exactly one item selected
 * - `some`: More than one but not all selected
 * - `all`: All enabled items selected
 *
 * Selection Modes:
 * - `none`: Display only, no selection
 * - `single`: Radio-like, one item at a time
 * - `multiple`: Checkbox-like, multiple items
 *
 * Security Features:
 * - Uses SelectableCard which inherits safe attribute handling from Card/Checkbox/Radio
 * - No dangerouslySetInnerHTML
 * - Props are typed and validated
 *
 * Accessibility Features (WCAG 2.2 AA):
 * - `<fieldset>` + `<legend>` for semantic grouping
 * - `aria-invalid` for error state on fieldset
 * - `aria-describedby` for helper/error text
 * - Native radio/checkbox inputs for screen reader support
 * - Development warning when no accessible label provided
 *
 * @see https://getbootstrap.com/docs/5.3/components/card/
 */
const meta: Meta<CardListStorybookProps> = {
  title: 'Components/CardList',
  component: CardList as React.ComponentType<CardListStorybookProps>,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A high-level component managing multiple selectable cards with FSM-based state, ' +
          'three selection modes (none/single/multiple), and full accessibility via fieldset/legend.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['none', 'single', 'multiple'],
      description: 'Selection mode for the CardList',
      table: {
        type: { summary: "'none' | 'single' | 'multiple'" },
        defaultValue: { summary: "'none'" },
      },
    },
    label: {
      control: 'text',
      description: 'Group label rendered as legend',
      table: {
        type: { summary: 'string' },
      },
    },
    variant: {
      control: 'select',
      options: ['elevated', 'outlined', 'ghost'],
      description: 'Card variant for all cards',
      table: {
        type: { summary: "'elevated' | 'outlined' | 'ghost'" },
        defaultValue: { summary: "'outlined'" },
      },
    },
    selectedColor: {
      control: 'select',
      options: [
        undefined,
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark',
      ],
      description: 'Color when card is selected',
      table: {
        type: { summary: 'CardColor' },
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
    columns: {
      control: 'number',
      description: 'Number of grid columns',
      table: {
        type: { summary: 'number' },
      },
    },
    gap: {
      control: 'text',
      description: 'Gap between cards',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'0.5rem'" },
      },
    },
    horizontal: {
      control: 'boolean',
      description: 'Horizontal card layout (image beside content)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all cards',
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
        type: { summary: 'string' },
      },
    },
    helperText: {
      control: 'text',
      description: 'Helper text',
      table: {
        type: { summary: 'string' },
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
// Sample Data
// =============================================================================

const pricingPlans: CardListItem[] = [
  {
    value: 'basic',
    title: 'Basic',
    subtitle: '$9/month',
    description: 'Perfect for individuals getting started.',
  },
  {
    value: 'pro',
    title: 'Pro',
    subtitle: '$29/month',
    description: 'Best for growing teams and businesses.',
  },
  {
    value: 'enterprise',
    title: 'Enterprise',
    subtitle: '$99/month',
    description: 'Advanced features for large organizations.',
  },
];

const featureOptions: CardListItem[] = [
  {
    value: 'analytics',
    title: 'Analytics',
    description: 'Track user behavior and engagement metrics.',
  },
  {
    value: 'automation',
    title: 'Automation',
    description: 'Automate repetitive tasks and workflows.',
  },
  {
    value: 'integrations',
    title: 'Integrations',
    description: 'Connect with your favorite tools.',
  },
  {
    value: 'support',
    title: 'Priority Support',
    description: '24/7 dedicated support team.',
  },
  {
    value: 'api',
    title: 'API Access',
    description: 'Build custom integrations with our API.',
  },
];

const permissionCards: CardListItem[] = [
  { value: 'read', title: 'Read', description: 'View content and data' },
  { value: 'write', title: 'Write', description: 'Create and edit content' },
  { value: 'delete', title: 'Delete', description: 'Remove content', disabled: true },
  { value: 'admin', title: 'Admin', description: 'Full administrative access' },
];

const showcaseCards: CardListItem[] = [
  { value: 'card1', title: 'Card 1', description: 'First card in the list' },
  { value: 'card2', title: 'Card 2', description: 'Second card in the list' },
  { value: 'card3', title: 'Card 3', description: 'Third card in the list' },
];

// =============================================================================
// Basic Examples
// =============================================================================

/**
 * Default CardList in display-only mode (no selection)
 */
export const Default: Story = {
  args: {
    label: 'Available Plans',
    items: pricingPlans,
  },
};

/**
 * Single selection mode (radio-like behavior)
 */
export const SingleSelection: Story = {
  args: {
    label: 'Select a Plan',
    items: pricingPlans,
    selectionMode: 'single',
    defaultValue: 'pro',
  },
};

/**
 * Multiple selection mode (checkbox-like behavior)
 */
export const MultipleSelection: Story = {
  args: {
    label: 'Select Features',
    items: featureOptions,
    selectionMode: 'multiple',
    defaultValue: ['analytics', 'integrations'],
  },
};

/**
 * With helper text
 */
export const WithHelperText: Story = {
  args: {
    label: 'Select a Plan',
    items: pricingPlans,
    selectionMode: 'single',
    helperText: 'Choose the plan that best fits your needs',
  },
};

// =============================================================================
// Selection Modes Demo
// =============================================================================

/**
 * All three selection modes side by side
 */
export const SelectionModes: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
      <div>
        <h6 className="mb-2">None (Display Only)</h6>
        <CardList label="Plans" items={showcaseCards} selectionMode="none" />
      </div>
      <div>
        <h6 className="mb-2">Single (Radio)</h6>
        <CardList
          label="Select One"
          items={showcaseCards}
          selectionMode="single"
          defaultValue="card2"
        />
      </div>
      <div>
        <h6 className="mb-2">Multiple (Checkbox)</h6>
        <CardList
          label="Select Many"
          items={showcaseCards}
          selectionMode="multiple"
          defaultValue={['card1', 'card3']}
        />
      </div>
    </div>
  ),
};

// =============================================================================
// Controlled Mode
// =============================================================================

/**
 * Controlled single selection with external state
 */
export const ControlledSingle: Story = {
  render: function ControlledSingleDemo() {
    const [selected, setSelected] = useState<string | undefined>('pro');

    return (
      <div>
        <CardList
          label="Select a Plan"
          items={pricingPlans}
          selectionMode="single"
          value={selected}
          onChange={setSelected}
        />
        <div className="mt-3">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary me-2"
            onClick={() => setSelected(undefined)}
          >
            Clear
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={() => setSelected('enterprise')}
          >
            Select Enterprise
          </button>
        </div>
        <p className="mt-2 text-muted small">Selected: {selected || 'None'}</p>
      </div>
    );
  },
};

/**
 * Controlled multiple selection with external state
 */
export const ControlledMultiple: Story = {
  render: function ControlledMultipleDemo() {
    const [selected, setSelected] = useState<string[]>(['analytics']);

    return (
      <div>
        <CardList
          label="Select Features"
          items={featureOptions}
          selectionMode="multiple"
          value={selected}
          onChange={setSelected}
        />
        <div className="mt-3">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary me-2"
            onClick={() => setSelected([])}
          >
            Clear All
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={() => setSelected(featureOptions.map((f) => f.value))}
          >
            Select All
          </button>
        </div>
        <p className="mt-2 text-muted small">
          Selected: {selected.length > 0 ? selected.join(', ') : 'None'}
        </p>
      </div>
    );
  },
};

// =============================================================================
// Visual Variants
// =============================================================================

/**
 * Card variants: elevated, outlined, ghost
 */
export const CardVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h6 className="mb-2">Elevated</h6>
        <CardList
          label="Elevated Cards"
          items={showcaseCards}
          selectionMode="single"
          variant="elevated"
          defaultValue="card1"
        />
      </div>
      <div>
        <h6 className="mb-2">Outlined (Default)</h6>
        <CardList
          label="Outlined Cards"
          items={showcaseCards}
          selectionMode="single"
          variant="outlined"
          defaultValue="card2"
        />
      </div>
      <div>
        <h6 className="mb-2">Ghost</h6>
        <CardList
          label="Ghost Cards"
          items={showcaseCards}
          selectionMode="single"
          variant="ghost"
          defaultValue="card3"
        />
      </div>
    </div>
  ),
};

/**
 * Selected color variants
 */
export const SelectedColors: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
      {(['primary', 'success', 'warning', 'info'] as const).map((color) => (
        <div key={color}>
          <h6 className="mb-2 text-capitalize">{color}</h6>
          <CardList
            label={`${color} Selection`}
            items={showcaseCards.slice(0, 2)}
            selectionMode="single"
            selectedColor={color}
            defaultValue="card1"
          />
        </div>
      ))}
    </div>
  ),
};

// =============================================================================
// Layout Options
// =============================================================================

/**
 * Horizontal orientation (row layout)
 */
export const HorizontalOrientation: Story = {
  args: {
    label: 'Quick Selection',
    items: showcaseCards,
    selectionMode: 'single',
    orientation: 'horizontal',
    defaultValue: 'card2',
  },
};

/**
 * Grid layout with columns
 */
export const GridLayout: Story = {
  args: {
    label: 'Select Features',
    items: featureOptions,
    selectionMode: 'multiple',
    columns: 3,
    gap: '1rem',
    defaultValue: ['analytics', 'api'],
  },
};

/**
 * Custom gap spacing
 */
export const CustomGap: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h6 className="mb-2">Small Gap (0.25rem)</h6>
        <CardList
          label="Compact"
          items={showcaseCards}
          selectionMode="single"
          gap="0.25rem"
          defaultValue="card1"
        />
      </div>
      <div>
        <h6 className="mb-2">Large Gap (1.5rem)</h6>
        <CardList
          label="Spacious"
          items={showcaseCards}
          selectionMode="single"
          gap="1.5rem"
          defaultValue="card1"
        />
      </div>
    </div>
  ),
};

/**
 * Horizontal cards (image beside content)
 */
export const HorizontalCards: Story = {
  args: {
    label: 'Select a Plan',
    items: pricingPlans,
    selectionMode: 'single',
    horizontal: true,
    defaultValue: 'pro',
  },
};

// =============================================================================
// Disabled States
// =============================================================================

/**
 * Entire CardList disabled
 */
export const Disabled: Story = {
  args: {
    label: 'Select a Plan',
    items: pricingPlans,
    selectionMode: 'single',
    defaultValue: 'pro',
    disabled: true,
  },
};

/**
 * Individual items disabled
 */
export const DisabledItems: Story = {
  args: {
    label: 'Permissions',
    items: permissionCards,
    selectionMode: 'multiple',
    helperText: 'Delete permission requires admin approval',
    defaultValue: ['read'],
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
    label: 'Select a Plan',
    items: pricingPlans,
    selectionMode: 'single',
    error: true,
    errorMessage: 'Please select a plan to continue',
  },
};

/**
 * Required field
 */
export const Required: Story = {
  args: {
    label: 'Select a Plan',
    items: pricingPlans,
    selectionMode: 'single',
    required: true,
  },
};

// =============================================================================
// FSM State Visualization
// =============================================================================

/**
 * FSM State Diagram
 *
 * The CardList uses a Finite State Machine (FSM) to manage selection state.
 * This demo visualizes the current FSM visual state.
 */
export const FSMStateVisualization: Story = {
  render: function FSMDemo(): ReactElement {
    const [selected, setSelected] = useState<string[]>([]);

    const getVisualState = (): 'none' | 'one' | 'some' | 'all' => {
      if (selected.length === 0) {
        return 'none';
      }
      if (selected.length === 1) {
        return 'one';
      }
      if (selected.length === featureOptions.length) {
        return 'all';
      }
      return 'some';
    };

    const visualState = getVisualState();

    return (
      <div>
        <div className="mb-4">
          <h5>FSM Visual State Machine</h5>
          <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
            <div
              className={`p-2 rounded ${visualState === 'none' ? 'bg-secondary text-white' : 'bg-light'}`}
              style={{ minWidth: '70px', textAlign: 'center' }}
            >
              <strong>none</strong>
              <div className="small">0 items</div>
            </div>
            <div className="text-muted">→</div>
            <div
              className={`p-2 rounded ${visualState === 'one' ? 'bg-info text-dark' : 'bg-light'}`}
              style={{ minWidth: '70px', textAlign: 'center' }}
            >
              <strong>one</strong>
              <div className="small">1 item</div>
            </div>
            <div className="text-muted">→</div>
            <div
              className={`p-2 rounded ${visualState === 'some' ? 'bg-warning text-dark' : 'bg-light'}`}
              style={{ minWidth: '70px', textAlign: 'center' }}
            >
              <strong>some</strong>
              <div className="small">Partial</div>
            </div>
            <div className="text-muted">→</div>
            <div
              className={`p-2 rounded ${visualState === 'all' ? 'bg-success text-white' : 'bg-light'}`}
              style={{ minWidth: '70px', textAlign: 'center' }}
            >
              <strong>all</strong>
              <div className="small">All items</div>
            </div>
          </div>
          <p className="text-muted small">
            Current state: <code>{visualState}</code> | Selected: {selected.length}/
            {featureOptions.length}
          </p>
        </div>

        <CardList
          label="Select Features"
          items={featureOptions}
          selectionMode="multiple"
          value={selected}
          onChange={setSelected}
          columns={2}
          gap="0.75rem"
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
  render: function FormDemo(): ReactElement {
    const [plan, setPlan] = useState<string | undefined>('pro');
    const [features, setFeatures] = useState<string[]>(['analytics']);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      setSubmitted(true);
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <CardList
            label="Select a Plan"
            items={pricingPlans}
            selectionMode="single"
            value={plan}
            onChange={setPlan}
            name="plan"
            required
          />
        </div>

        <div className="mb-4">
          <CardList
            label="Add Features"
            items={featureOptions.slice(0, 4)}
            selectionMode="multiple"
            value={features}
            onChange={setFeatures}
            name="features"
            columns={2}
            gap="0.75rem"
            helperText="Select additional features for your plan"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>

        {submitted && (
          <div className="alert alert-success mt-3">
            <strong>Form Submitted!</strong>
            <pre className="mb-0 mt-2">{JSON.stringify({ plan, features }, null, 2)}</pre>
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
 * The CardList uses semantic HTML for accessibility:
 * - `<fieldset>` groups related cards
 * - `<legend>` provides the group label
 * - `aria-describedby` links to helper/error text
 * - `aria-invalid` for error state
 * - Native radio/checkbox inputs for screen reader support
 */
export const AccessibilityFieldsetLegend: Story = {
  render: () => (
    <div className="d-flex flex-column gap-4">
      <div>
        <h5>Semantic HTML Structure</h5>
        <p className="text-muted small">
          CardList renders as fieldset/legend with native inputs for proper screen reader support.
        </p>
      </div>

      <CardList
        label="Notification Preferences"
        items={showcaseCards}
        selectionMode="single"
        helperText="Choose your preferred notification method"
        defaultValue="card1"
      />

      <div className="alert alert-info small">
        <strong>HTML Structure:</strong>
        <pre className="mb-0 mt-2">{`<fieldset aria-describedby="...">
  <legend>Notification Preferences</legend>
  <div>Choose your preferred...</div>
  <label>
    <input type="radio" name="..." />
    <article class="card">...</article>
  </label>
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
 * - Individual cards properly labeled
 * - Error/helper text associated via aria-describedby
 */
export const AccessibilityScreenReader: Story = {
  render: () => (
    <div className="d-flex flex-column gap-4">
      <div>
        <h5>Screen Reader Features</h5>
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
            Native radio/checkbox inputs for full support
          </li>
        </ul>
      </div>

      <CardList
        label="With Helper Text"
        items={showcaseCards}
        selectionMode="single"
        helperText="Helper text is announced by screen readers"
        defaultValue="card1"
      />

      <CardList
        label="With Error State"
        items={showcaseCards}
        selectionMode="single"
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
        <h5>Development-Time Accessibility Warnings</h5>
        <p className="text-muted small">
          Open browser console to see warnings for missing accessible names.
        </p>
      </div>

      <div className="alert alert-warning small">
        <strong>⚠️ Dev Warning</strong>
        <p className="mb-0 mt-2">A CardList without `label` or `aria-label` will log:</p>
        <code className="d-block mt-2 p-2 bg-dark text-light rounded">
          [DSAi CardList] Missing accessible label. Provide a &quot;label&quot; prop or
          &quot;aria-label&quot;/&quot;aria-labelledby&quot; for screen reader users.
        </code>
      </div>

      <div>
        <h6 className="text-success">
          <CheckIcon size={14} className="me-1" />
          Correct Usage
        </h6>
        <CardList label="With visible label" items={showcaseCards.slice(0, 2)} />
        <div className="mt-3">
          <CardList aria-label="With aria-label" items={showcaseCards.slice(0, 2)} />
        </div>
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
 * CardList uses SelectableCard which inherits security features from Card, Checkbox, and Radio.
 */
export const SecuritySafeAttributes: Story = {
  render: () => (
    <div className="d-flex flex-column gap-4">
      <div>
        <h5>Security Features</h5>
        <p className="text-muted small">
          CardList inherits security features from underlying components.
        </p>
      </div>

      <ul className="small">
        <li>
          <CheckIcon size={14} className="text-success me-1" />
          No dangerouslySetInnerHTML usage
        </li>
        <li>
          <CheckIcon size={14} className="text-success me-1" />
          Props are typed and validated
        </li>
        <li>
          <CheckIcon size={14} className="text-success me-1" />
          Safe attribute handling from Card/Checkbox/Radio
        </li>
        <li>
          <XLgIcon size={14} className="text-danger me-1" />
          No unrestricted prop spreading
        </li>
      </ul>

      <CardList
        label="Secure Card List"
        items={showcaseCards}
        selectionMode="single"
        name="secure-list"
        defaultValue="card1"
      />
    </div>
  ),
};

// =============================================================================
// Real-World Examples
// =============================================================================

/**
 * Pricing page example
 */
export const PricingPageExample: Story = {
  render: function PricingPage() {
    const [selectedPlan, setSelectedPlan] = useState<string | undefined>('pro');

    const plans: CardListItem[] = [
      {
        value: 'starter',
        title: 'Starter',
        subtitle: 'Free',
        description: 'For individuals exploring the platform.',
        footer: (
          <ul className="list-unstyled small mb-0">
            <li>✓ 5 projects</li>
            <li>✓ Basic analytics</li>
            <li>✓ Community support</li>
          </ul>
        ),
      },
      {
        value: 'pro',
        title: 'Pro',
        subtitle: '$29/month',
        description: 'For professionals and growing teams.',
        footer: (
          <ul className="list-unstyled small mb-0">
            <li>✓ Unlimited projects</li>
            <li>✓ Advanced analytics</li>
            <li>✓ Priority support</li>
            <li>✓ API access</li>
          </ul>
        ),
      },
      {
        value: 'enterprise',
        title: 'Enterprise',
        subtitle: 'Custom',
        description: 'For large organizations with custom needs.',
        footer: (
          <ul className="list-unstyled small mb-0">
            <li>✓ Everything in Pro</li>
            <li>✓ SSO & SAML</li>
            <li>✓ Dedicated support</li>
            <li>✓ Custom integrations</li>
          </ul>
        ),
      },
    ];

    return (
      <div style={{ maxWidth: '800px' }}>
        <div className="text-center mb-4">
          <h4>Choose Your Plan</h4>
          <p className="text-muted">Select the plan that best fits your needs</p>
        </div>
        <CardList
          label="Pricing Plans"
          items={plans}
          selectionMode="single"
          value={selectedPlan}
          onChange={setSelectedPlan}
          columns={3}
          gap="1rem"
          selectedColor="primary"
        />
        <div className="text-center mt-4">
          <button type="button" className="btn btn-primary btn-lg" disabled={!selectedPlan}>
            Continue with{' '}
            {selectedPlan ? plans.find((p) => p.value === selectedPlan)?.title : '...'}
          </button>
        </div>
      </div>
    );
  },
};

/**
 * Feature selection example
 */
export const FeatureSelectionExample: Story = {
  render: function FeatureSelection() {
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['analytics', 'support']);

    const features: CardListItem[] = [
      {
        value: 'analytics',
        title: '📊 Analytics',
        description: 'Track user behavior, page views, and conversion rates.',
      },
      {
        value: 'automation',
        title: '⚡ Automation',
        description: 'Automate workflows with triggers and actions.',
      },
      {
        value: 'integrations',
        title: '🔗 Integrations',
        description: 'Connect with Slack, Zapier, and 100+ apps.',
      },
      {
        value: 'support',
        title: '💬 Priority Support',
        description: 'Get help within 4 hours from our team.',
      },
      {
        value: 'api',
        title: '🔧 API Access',
        description: 'Build custom solutions with our REST API.',
      },
      {
        value: 'white-label',
        title: '🏷️ White Label',
        description: 'Remove branding and use your own domain.',
        disabled: true,
      },
    ];

    const basePrice = 29;
    const featurePriceMap = new Map<string, number>([
      ['analytics', 0],
      ['automation', 10],
      ['integrations', 5],
      ['support', 15],
      ['api', 20],
      ['white-label', 50],
    ]);

    const totalPrice =
      basePrice +
      selectedFeatures.reduce((sum, featureKey) => sum + (featurePriceMap.get(featureKey) ?? 0), 0);

    return (
      <div className="card" style={{ maxWidth: '700px' }}>
        <div className="card-header">
          <h5 className="mb-0">Customize Your Plan</h5>
        </div>
        <div className="card-body">
          <CardList
            label="Select Features"
            items={features}
            selectionMode="multiple"
            value={selectedFeatures}
            onChange={setSelectedFeatures}
            columns={2}
            gap="0.75rem"
            helperText="White Label requires Enterprise plan"
          />
        </div>
        <div className="card-footer d-flex justify-content-between align-items-center">
          <div>
            <span className="text-muted">Monthly total:</span>
            <strong className="ms-2 fs-4">${totalPrice}/mo</strong>
          </div>
          <button type="button" className="btn btn-primary">
            Upgrade Plan
          </button>
        </div>
      </div>
    );
  },
};

/**
 * Onboarding wizard example
 */
export const OnboardingWizardExample: Story = {
  render: function OnboardingWizard() {
    const [role, setRole] = useState<string | undefined>();
    const [interests, setInterests] = useState<string[]>([]);
    const [step, setStep] = useState(1);

    const roles: CardListItem[] = [
      {
        value: 'developer',
        title: '👩‍💻 Developer',
        description: "I build software and want to improve my team's workflow.",
      },
      {
        value: 'designer',
        title: '🎨 Designer',
        description: 'I design interfaces and want to collaborate better.',
      },
      {
        value: 'manager',
        title: '📋 Manager',
        description: 'I lead teams and want to track progress effectively.',
      },
      {
        value: 'other',
        title: '🌟 Other',
        description: "I'm exploring what this platform can do for me.",
      },
    ];

    const interestOptions: CardListItem[] = [
      { value: 'project-management', title: 'Project Management' },
      { value: 'team-collaboration', title: 'Team Collaboration' },
      { value: 'code-review', title: 'Code Review' },
      { value: 'design-feedback', title: 'Design Feedback' },
      { value: 'documentation', title: 'Documentation' },
      { value: 'analytics', title: 'Analytics' },
    ];

    return (
      <div className="card" style={{ maxWidth: '600px' }}>
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Welcome! Let&apos;s personalize your experience</h5>
            <span className="badge bg-secondary">Step {step} of 2</span>
          </div>
        </div>
        <div className="card-body">
          {step === 1 ? (
            <CardList
              label="What best describes your role?"
              items={roles}
              selectionMode="single"
              value={role}
              onChange={setRole}
              gap="0.75rem"
            />
          ) : (
            <CardList
              label="What are you interested in?"
              items={interestOptions}
              selectionMode="multiple"
              value={interests}
              onChange={setInterests}
              columns={2}
              gap="0.5rem"
              helperText="Select all that apply"
            />
          )}
        </div>
        <div className="card-footer d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setStep(1)}
            disabled={step === 1}
          >
            Back
          </button>
          {step === 1 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setStep(2)}
              disabled={!role}
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-success"
              disabled={interests.length === 0}
              onClick={() =>
                alert(`Setup complete!\nRole: ${role}\nInterests: ${interests.join(', ')}`)
              }
            >
              Complete Setup
            </button>
          )}
        </div>
      </div>
    );
  },
};

/**
 * Complete showcase of CardList features
 */
export const CompleteShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Selection Modes */}
      <section>
        <h5 className="mb-3">Selection Modes</h5>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <CardList label="None" items={showcaseCards.slice(0, 2)} selectionMode="none" />
          <CardList
            label="Single"
            items={showcaseCards.slice(0, 2)}
            selectionMode="single"
            defaultValue="card1"
          />
          <CardList
            label="Multiple"
            items={showcaseCards.slice(0, 2)}
            selectionMode="multiple"
            defaultValue={['card1']}
          />
        </div>
      </section>

      {/* Variants */}
      <section>
        <h5 className="mb-3">Card Variants</h5>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <CardList
            label="Elevated"
            items={showcaseCards.slice(0, 2)}
            selectionMode="single"
            variant="elevated"
            defaultValue="card1"
          />
          <CardList
            label="Outlined"
            items={showcaseCards.slice(0, 2)}
            selectionMode="single"
            variant="outlined"
            defaultValue="card1"
          />
          <CardList
            label="Ghost"
            items={showcaseCards.slice(0, 2)}
            selectionMode="single"
            variant="ghost"
            defaultValue="card1"
          />
        </div>
      </section>

      {/* States */}
      <section>
        <h5 className="mb-3">States</h5>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <CardList
            label="Disabled"
            items={showcaseCards.slice(0, 2)}
            selectionMode="single"
            defaultValue="card1"
            disabled
          />
          <CardList
            label="Error"
            items={showcaseCards.slice(0, 2)}
            selectionMode="single"
            error
            errorMessage="Selection required"
          />
          <CardList
            label="Required"
            items={showcaseCards.slice(0, 2)}
            selectionMode="single"
            required
          />
        </div>
      </section>

      {/* Layout */}
      <section>
        <h5 className="mb-3">Layout Options</h5>
        <div className="mb-3">
          <h6>Horizontal Orientation</h6>
          <CardList
            label="Quick Select"
            items={showcaseCards}
            selectionMode="single"
            orientation="horizontal"
            defaultValue="card2"
          />
        </div>
        <div>
          <h6>Grid (3 columns)</h6>
          <CardList
            label="Features"
            items={featureOptions.slice(0, 6)}
            selectionMode="multiple"
            columns={3}
            gap="0.75rem"
            defaultValue={['analytics', 'api']}
          />
        </div>
      </section>
    </div>
  ),
};
