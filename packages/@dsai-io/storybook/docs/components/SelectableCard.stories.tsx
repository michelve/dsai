import { Button, Heading, SelectableCard } from '@dsai-io/react';
import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * SelectableCard is a card component that can behave like a checkbox or radio option.
 * Click anywhere on the card to toggle/select, not just the small control.
 *
 * The component supports three selection modes:
 * - `none`: No selection control (display-only card)
 * - `checkbox`: Checkbox for multi-selection scenarios
 * - `radio`: Radio for single-selection scenarios
 *
 * Key Features:
 * - Uses existing Card, Checkbox, Radio primitives internally
 * - Full card is clickable when in checkbox/radio mode
 * - Supports controlled and uncontrolled patterns
 * - Visual feedback for selected state (border highlight)
 *
 * Accessibility Features (WCAG 2.2 AA):
 * - Uses native `<input type="checkbox">` or `<input type="radio">`
 * - Card click forwards to the control (like clicking a label)
 * - Proper focus management and keyboard support
 * - Minimum touch target via Bootstrap styling
 *
 * @important When selectionMode is "checkbox" or "radio", the entire card is
 * wrapped in a `<label>` element. Avoid placing nested interactive elements
 * (buttons, links, other inputs) inside the card content.
 *
 * @see https://getbootstrap.com/docs/5.3/components/card/
 */
const meta: Meta<typeof SelectableCard> = {
  title: 'Components/SelectableCard',
  component: SelectableCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A card that behaves like a checkbox or radio option. ' +
          'Click anywhere on the card to toggle/select, not just the small control.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['none', 'checkbox', 'radio'],
      description: 'Selection mode for the card',
      table: {
        type: { summary: "'none' | 'checkbox' | 'radio'" },
        defaultValue: { summary: "'none'" },
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
      description: 'Default checked state (uncontrolled)',
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
    required: {
      control: 'boolean',
      description: 'Required field',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    variant: {
      control: 'select',
      options: ['elevated', 'outlined', 'ghost'],
      description: 'Card variant styling',
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
      description: 'Background color when selected',
      table: {
        type: {
          summary:
            "'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'",
        },
      },
    },
    horizontal: {
      control: 'boolean',
      description: 'Horizontal layout (media on side)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    title: {
      control: 'text',
      description: 'Card title',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    subtitle: {
      control: 'text',
      description: 'Card subtitle',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    description: {
      control: 'text',
      description: 'Card description',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    value: {
      control: 'text',
      description: 'Unique value (required when used in CardList)',
      table: {
        type: { summary: 'string' },
      },
    },
    name: {
      control: 'text',
      description: 'Form field name (for radio grouping)',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SelectableCard>;

// =============================================================================
// Basic Examples
// =============================================================================

/**
 * Default SelectableCard with no selection mode.
 * Acts as a regular display card.
 */
export const Default: Story = {
  args: {
    title: 'Basic Card',
    description: 'This is a basic selectable card with no selection mode.',
    selectionMode: 'none',
  },
};

/**
 * SelectableCard with checkbox mode.
 * Click anywhere on the card to toggle the checkbox.
 */
export const Checkbox: Story = {
  args: {
    title: 'Checkbox Card',
    description: 'Click anywhere on this card to toggle the checkbox.',
    selectionMode: 'checkbox',
    value: 'checkbox-card',
  },
};

/**
 * SelectableCard with radio mode.
 * Used when only one option can be selected from a group.
 */
export const Radio: Story = {
  args: {
    title: 'Radio Card',
    description: 'Click anywhere on this card to select it.',
    selectionMode: 'radio',
    value: 'radio-card',
    name: 'radio-group',
  },
};

// =============================================================================
// Selection Modes
// =============================================================================

/**
 * Comparison of all three selection modes side by side.
 */
export const SelectionModes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <div style={{ flex: '1', minWidth: '250px' }}>
        <Heading level={6} className="mb-2">
          None (Display Only)
        </Heading>
        <SelectableCard
          selectionMode="none"
          title="Display Card"
          description="No selection control. Just displays content."
        />
      </div>
      <div style={{ flex: '1', minWidth: '250px' }}>
        <Heading level={6} className="mb-2">
          Checkbox
        </Heading>
        <SelectableCard
          selectionMode="checkbox"
          value="checkbox"
          title="Checkbox Card"
          description="Can be toggled on/off independently."
        />
      </div>
      <div style={{ flex: '1', minWidth: '250px' }}>
        <Heading level={6} className="mb-2">
          Radio
        </Heading>
        <SelectableCard
          selectionMode="radio"
          value="radio"
          name="mode-demo"
          title="Radio Card"
          description="Part of a mutually exclusive group."
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The three selection modes available for SelectableCard.',
      },
    },
  },
};

// =============================================================================
// Controlled vs Uncontrolled
// =============================================================================

/**
 * Uncontrolled SelectableCard manages its own state.
 * Uses `defaultChecked` for initial value.
 */
export const Uncontrolled: Story = {
  args: {
    title: 'Uncontrolled Card',
    description: 'This card manages its own checked state internally.',
    selectionMode: 'checkbox',
    value: 'uncontrolled',
    defaultChecked: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Uses `defaultChecked` prop. The component manages its own state. ' +
          'Good for simple forms where you only need the final value on submit.',
      },
    },
  },
};

/**
 * Controlled SelectableCard where parent manages state.
 */
export const Controlled: Story = {
  render: function ControlledStory() {
    const [isChecked, setIsChecked] = useState(false);

    return (
      <div>
        <SelectableCard
          selectionMode="checkbox"
          value="controlled"
          title="Controlled Card"
          description={`Current state: ${isChecked ? 'Selected' : 'Not selected'}`}
          checked={isChecked}
          onChange={setIsChecked}
        />
        <div className="mt-3">
          <Button
            size="sm"
            variant="outline-primary"
            className="me-2"
            onClick={() => setIsChecked(true)}
          >
            Select
          </Button>
          <Button size="sm" variant="outline-secondary" onClick={() => setIsChecked(false)}>
            Deselect
          </Button>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Parent component controls the checked state via `checked` and `onChange` props. ' +
          'Use this when you need to synchronize state with other components or validate before changes.',
      },
    },
  },
};

// =============================================================================
// Radio Group Example
// =============================================================================

/**
 * Multiple radio cards forming a group.
 * Only one can be selected at a time.
 */
export const RadioGroup: Story = {
  render: function RadioGroupStory() {
    const [selected, setSelected] = useState<string | null>('basic');

    const plans = [
      {
        value: 'basic',
        title: 'Basic Plan',
        price: '$9/month',
        description: '5 projects, 10GB storage',
      },
      {
        value: 'pro',
        title: 'Pro Plan',
        price: '$29/month',
        description: 'Unlimited projects, 100GB storage',
      },
      {
        value: 'enterprise',
        title: 'Enterprise',
        price: 'Custom',
        description: 'Unlimited everything, priority support',
      },
    ];

    return (
      <div>
        <p className="text-muted mb-3">Selected: {selected || 'none'}</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {plans.map((plan) => (
            <SelectableCard
              key={plan.value}
              selectionMode="radio"
              name="pricing-plan"
              value={plan.value}
              checked={selected === plan.value}
              onChange={(checked) => {
                if (checked) {
                  setSelected(plan.value);
                }
              }}
              title={plan.title}
              subtitle={plan.price}
              description={plan.description}
              style={{ flex: '1', minWidth: '200px' }}
            />
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Radio cards with the same `name` form a group where only one can be selected. ' +
          'Note: For managed radio groups, prefer using `CardList` with `selectionMode="single"`.',
      },
    },
  },
};

// =============================================================================
// Checkbox Group Example
// =============================================================================

/**
 * Multiple checkbox cards for multi-selection.
 */
export const CheckboxGroup: Story = {
  render: function CheckboxGroupStory() {
    const [selected, setSelected] = useState<Set<string>>(new Set(['notifications']));

    const features = [
      {
        value: 'notifications',
        title: 'Email Notifications',
        description: 'Receive updates about your account',
      },
      {
        value: 'newsletter',
        title: 'Weekly Newsletter',
        description: 'Tips, tricks, and product updates',
      },
      {
        value: 'marketing',
        title: 'Marketing Emails',
        description: 'Special offers and promotions',
      },
    ];

    const toggleFeature = (value: string, checked: boolean): void => {
      setSelected((prev) => {
        const next = new Set(prev);
        if (checked) {
          next.add(value);
        } else {
          next.delete(value);
        }
        return next;
      });
    };

    return (
      <div>
        <p className="text-muted mb-3">Selected: {[...selected].join(', ') || 'none'}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {features.map((feature) => (
            <SelectableCard
              key={feature.value}
              selectionMode="checkbox"
              value={feature.value}
              checked={selected.has(feature.value)}
              onChange={(checked) => toggleFeature(feature.value, checked)}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Multiple checkbox cards allow independent selection of each option. ' +
          'Note: For managed checkbox groups, prefer using `CardList` with `selectionMode="multiple"`.',
      },
    },
  },
};

// =============================================================================
// Visual Variants
// =============================================================================

/**
 * Different card variants (outlined, elevated, ghost).
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <SelectableCard
        variant="outlined"
        selectionMode="checkbox"
        value="outlined"
        title="Outlined"
        description="Default variant with border"
        defaultChecked
        style={{ flex: '1', minWidth: '200px' }}
      />
      <SelectableCard
        variant="elevated"
        selectionMode="checkbox"
        value="elevated"
        title="Elevated"
        description="Raised card with shadow"
        style={{ flex: '1', minWidth: '200px' }}
      />
      <SelectableCard
        variant="ghost"
        selectionMode="checkbox"
        value="ghost"
        title="Ghost"
        description="Minimal styling"
        style={{ flex: '1', minWidth: '200px' }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'SelectableCard supports the same variants as the base Card component.',
      },
    },
  },
};

/**
 * Selected color variants applied when card is checked.
 */
export const SelectedColors: Story = {
  render: function Render() {
    const colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'] as const;

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {colors.map((color) => (
          <SelectableCard
            key={color}
            selectionMode="checkbox"
            value={color}
            selectedColor={color}
            title={color.charAt(0).toUpperCase() + color.slice(1)}
            description="Click to see selected color"
            defaultChecked
          />
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'The `selectedColor` prop changes the card background color when selected. ' +
          'This provides visual feedback for the selected state.',
      },
    },
  },
};

// =============================================================================
// States
// =============================================================================

/**
 * Disabled state prevents interaction.
 */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <SelectableCard
        selectionMode="checkbox"
        value="disabled-unchecked"
        title="Disabled (Unchecked)"
        description="Cannot be selected"
        disabled
        style={{ flex: '1', minWidth: '200px' }}
      />
      <SelectableCard
        selectionMode="checkbox"
        value="disabled-checked"
        title="Disabled (Checked)"
        description="Cannot be deselected"
        disabled
        defaultChecked
        style={{ flex: '1', minWidth: '200px' }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled cards cannot be interacted with and show muted styling.',
      },
    },
  },
};

/**
 * Error state for validation feedback.
 */
export const ErrorState: Story = {
  args: {
    title: 'Required Selection',
    description: 'This field is required',
    selectionMode: 'checkbox',
    value: 'error-card',
    error: true,
    required: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Error state provides visual feedback for validation errors.',
      },
    },
  },
};

/**
 * Required field indicator.
 */
export const Required: Story = {
  args: {
    title: 'Terms and Conditions',
    description: 'You must agree to continue',
    selectionMode: 'checkbox',
    value: 'terms',
    required: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Required cards show a red asterisk (*) indicator next to the title.',
      },
    },
  },
};

// =============================================================================
// Content Options
// =============================================================================

/**
 * Card with media content (image at top).
 */
export const WithMedia: Story = {
  args: {
    title: 'Product Card',
    description: 'A beautiful product with an image.',
    selectionMode: 'checkbox',
    value: 'media-card',
    media: (
      <img
        src="https://via.placeholder.com/300x150/e9ecef/495057?text=Product+Image"
        alt="Product"
        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use the `media` prop to add images, icons, or other content at the top of the card.',
      },
    },
  },
};

/**
 * Card with footer content.
 */
export const WithFooter: Story = {
  args: {
    title: 'Plan Details',
    description: 'Includes all the features you need.',
    selectionMode: 'checkbox',
    value: 'footer-card',
    footer: (
      <div className="d-flex justify-content-between align-items-center">
        <span className="text-muted small">Updated 2 days ago</span>
        <span className="badge bg-success">Popular</span>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the `footer` prop to add content at the bottom of the card.',
      },
    },
  },
};

/**
 * Card with title and subtitle.
 */
export const WithSubtitle: Story = {
  args: {
    title: 'Professional Plan',
    subtitle: '$29/month',
    description: 'Perfect for growing teams with advanced needs.',
    selectionMode: 'checkbox',
    value: 'subtitle-card',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The `subtitle` prop adds secondary text below the title, ideal for pricing or metadata.',
      },
    },
  },
};

/**
 * Card with custom children instead of structured content.
 */
export const WithChildren: Story = {
  render: () => (
    <SelectableCard selectionMode="checkbox" value="custom-children" defaultChecked>
      <div>
        <Heading level={5} className="card-title">
          Custom Content
        </Heading>
        <p className="card-text">
          Use <code>children</code> for completely custom card content.
        </p>
        <ul className="list-unstyled mb-0">
          <li>✓ Feature one</li>
          <li>✓ Feature two</li>
          <li>✓ Feature three</li>
        </ul>
      </div>
    </SelectableCard>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use `children` instead of `title`/`description` props for fully custom card content. ' +
          'The checkbox control is still rendered automatically.',
      },
    },
  },
};

// =============================================================================
// Layout Options
// =============================================================================

/**
 * Horizontal layout with media on the side.
 */
export const HorizontalLayout: Story = {
  args: {
    title: 'Horizontal Card',
    description: 'Media appears on the left side in horizontal mode.',
    selectionMode: 'checkbox',
    value: 'horizontal-card',
    horizontal: true,
    media: (
      <img
        src="https://via.placeholder.com/100x100/e9ecef/495057?text=Icon"
        alt="Icon"
        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Set `horizontal` to true for a side-by-side layout with media on the left.',
      },
    },
  },
};

// =============================================================================
// Interactive Examples
// =============================================================================

/**
 * Interactive demo with state display and controls.
 */
export const InteractiveDemo: Story = {
  render: function InteractiveDemoStory() {
    const [state, setState] = useState<{
      selectionMode: 'none' | 'checkbox' | 'radio';
      checked: boolean;
      disabled: boolean;
      error: boolean;
      required: boolean;
      variant: 'outlined' | 'elevated' | 'ghost';
      selectedColor: 'primary' | 'success' | undefined;
    }>({
      selectionMode: 'checkbox',
      checked: false,
      disabled: false,
      error: false,
      required: false,
      variant: 'outlined',
      selectedColor: undefined,
    });

    return (
      <div className="row">
        <div className="col-md-6 mb-4">
          <Heading level={6}>Preview</Heading>
          <SelectableCard
            selectionMode={state.selectionMode}
            value="demo"
            name="demo-group"
            checked={state.checked}
            onChange={(checked) => setState((s) => ({ ...s, checked }))}
            disabled={state.disabled}
            error={state.error}
            required={state.required}
            variant={state.variant}
            selectedColor={state.selectedColor}
            title="Interactive Card"
            subtitle="$19.99/month"
            description="Toggle the controls to see how the card responds."
          />
        </div>
        <div className="col-md-6">
          <Heading level={6}>Controls</Heading>
          <div className="d-flex flex-column gap-2">
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={state.checked}
                onChange={(e) => setState((s) => ({ ...s, checked: e.target.checked }))}
              />
              <span className="form-check-label">Checked</span>
            </label>
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={state.disabled}
                onChange={(e) => setState((s) => ({ ...s, disabled: e.target.checked }))}
              />
              <span className="form-check-label">Disabled</span>
            </label>
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={state.error}
                onChange={(e) => setState((s) => ({ ...s, error: e.target.checked }))}
              />
              <span className="form-check-label">Error</span>
            </label>
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={state.required}
                onChange={(e) => setState((s) => ({ ...s, required: e.target.checked }))}
              />
              <span className="form-check-label">Required</span>
            </label>
            <div>
              <label htmlFor="demo-selection-mode" className="form-label small">
                Selection Mode
              </label>
              <select
                id="demo-selection-mode"
                className="form-select form-select-sm"
                value={state.selectionMode}
                onChange={(e) =>
                  setState((s) => ({
                    ...s,
                    selectionMode: e.target.value as 'none' | 'checkbox' | 'radio',
                  }))
                }
              >
                <option value="none">None</option>
                <option value="checkbox">Checkbox</option>
                <option value="radio">Radio</option>
              </select>
            </div>
            <div>
              <label htmlFor="demo-selected-color" className="form-label small">
                Selected Color
              </label>
              <select
                id="demo-selected-color"
                className="form-select form-select-sm"
                value={state.selectedColor || ''}
                onChange={(e) =>
                  setState((s) => ({
                    ...s,
                    selectedColor: e.target.value
                      ? (e.target.value as 'primary' | 'success')
                      : undefined,
                  }))
                }
              >
                <option value="">None</option>
                <option value="primary">Primary</option>
                <option value="success">Success</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'An interactive demo showing all the different states and options available.',
      },
    },
  },
};

// =============================================================================
// Real-World Examples
// =============================================================================

/**
 * Pricing tier selection (common use case).
 */
export const PricingTierSelection: Story = {
  render: function PricingTierSelectionStory() {
    const [selectedTier, setSelectedTier] = useState('pro');

    const tiers = [
      {
        value: 'starter',
        name: 'Starter',
        price: 'Free',
        features: ['1 project', '1GB storage', 'Community support'],
        badge: null,
      },
      {
        value: 'pro',
        name: 'Pro',
        price: '$29/mo',
        features: ['10 projects', '50GB storage', 'Email support', 'API access'],
        badge: 'Most Popular',
      },
      {
        value: 'enterprise',
        name: 'Enterprise',
        price: '$99/mo',
        features: ['Unlimited projects', '500GB storage', 'Priority support', 'SSO', 'SLA'],
        badge: null,
      },
    ];

    return (
      <div>
        <Heading level={5} className="mb-4">
          Choose Your Plan
        </Heading>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
          }}
        >
          {tiers.map((tier) => (
            <SelectableCard
              key={tier.value}
              selectionMode="radio"
              name="pricing-tier"
              value={tier.value}
              checked={selectedTier === tier.value}
              onChange={(checked) => {
                if (checked) {
                  setSelectedTier(tier.value);
                }
              }}
              selectedColor={selectedTier === tier.value ? 'primary' : undefined}
            >
              <div className="text-center py-2">
                {tier.badge && <span className="badge bg-primary mb-2">{tier.badge}</span>}
                <Heading level={4} className="mb-1">
                  {tier.name}
                </Heading>
                <p className="h3 mb-3">{tier.price}</p>
                <ul className="list-unstyled text-start small">
                  {tier.features.map((feature) => (
                    <li key={feature} className="mb-1">
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </SelectableCard>
          ))}
        </div>
        <p className="text-muted mt-3">Selected: {selectedTier}</p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'A common use case: selecting a pricing tier from multiple options.',
      },
    },
  },
};

/**
 * Feature toggles with checkbox cards.
 */
export const FeatureToggles: Story = {
  render: function FeatureTogglesStory() {
    const [features, setFeatures] = useState<Set<string>>(new Set(['dark-mode', 'notifications']));

    const featureList = [
      {
        value: 'dark-mode',
        icon: '🌙',
        title: 'Dark Mode',
        description: 'Use dark theme across the application',
      },
      {
        value: 'notifications',
        icon: '🔔',
        title: 'Push Notifications',
        description: 'Receive real-time alerts and updates',
      },
      {
        value: 'analytics',
        icon: '📊',
        title: 'Analytics',
        description: 'Track usage and performance metrics',
      },
      {
        value: 'ai-assist',
        icon: '🤖',
        title: 'AI Assistant',
        description: 'Get intelligent suggestions and help',
      },
    ];

    const toggleFeature = (value: string, checked: boolean): void => {
      setFeatures((prev) => {
        const next = new Set(prev);
        if (checked) {
          next.add(value);
        } else {
          next.delete(value);
        }
        return next;
      });
    };

    return (
      <div>
        <Heading level={5} className="mb-4">
          Customize Your Experience
        </Heading>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1rem',
          }}
        >
          {featureList.map((feature) => (
            <SelectableCard
              key={feature.value}
              selectionMode="checkbox"
              value={feature.value}
              checked={features.has(feature.value)}
              onChange={(checked) => toggleFeature(feature.value, checked)}
              selectedColor={features.has(feature.value) ? 'success' : undefined}
            >
              <div className="text-center">
                <div style={{ fontSize: '2rem' }}>{feature.icon}</div>
                <Heading level={6} className="mt-2 mb-1">
                  {feature.title}
                </Heading>
                <p className="small text-muted mb-0">{feature.description}</p>
              </div>
            </SelectableCard>
          ))}
        </div>
        <p className="text-muted mt-3">
          Enabled: {features.size > 0 ? [...features].join(', ') : 'None'}
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Checkbox cards work great for enabling/disabling multiple features.',
      },
    },
  },
};

/**
 * Survey/quiz question with single selection.
 */
export const SurveyQuestion: Story = {
  render: function SurveyQuestionStory() {
    const [answer, setAnswer] = useState<string | null>(null);

    const options = [
      { value: 'very-satisfied', emoji: '😄', label: 'Very Satisfied' },
      { value: 'satisfied', emoji: '🙂', label: 'Satisfied' },
      { value: 'neutral', emoji: '😐', label: 'Neutral' },
      { value: 'dissatisfied', emoji: '🙁', label: 'Dissatisfied' },
      { value: 'very-dissatisfied', emoji: '😞', label: 'Very Dissatisfied' },
    ];

    return (
      <div style={{ maxWidth: '600px' }}>
        <Heading level={5} className="mb-2">
          How satisfied are you with our service?
        </Heading>
        <p className="text-muted small mb-4">Select one option</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {options.map((option) => (
            <SelectableCard
              key={option.value}
              selectionMode="radio"
              name="satisfaction"
              value={option.value}
              checked={answer === option.value}
              onChange={(checked) => {
                if (checked) {
                  setAnswer(option.value);
                }
              }}
              selectedColor="primary"
            >
              <div className="d-flex align-items-center gap-3">
                <span style={{ fontSize: '1.5rem' }}>{option.emoji}</span>
                <span>{option.label}</span>
              </div>
            </SelectableCard>
          ))}
        </div>
        {answer && (
          <div className="alert alert-success mt-3">
            Thank you for your feedback! You selected: <strong>{answer}</strong>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Survey or quiz questions with visual card-based options.',
      },
    },
  },
};

// =============================================================================
// Accessibility
// =============================================================================

/**
 * Accessibility features demonstration.
 */
export const AccessibilityDemo: Story = {
  render: () => (
    <div>
      <Heading level={5} className="mb-3">
        Accessibility Features
      </Heading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <SelectableCard
          selectionMode="checkbox"
          value="aria-label-demo"
          aria-label="Select the premium subscription plan"
          title="With aria-label"
          description="Has a custom aria-label for screen readers."
        />
        <SelectableCard
          selectionMode="checkbox"
          value="required-demo"
          required
          title="Required Field"
          description="Shows required indicator and passes required to input."
        />
        <SelectableCard
          selectionMode="radio"
          name="a11y-group"
          value="keyboard-demo"
          title="Keyboard Navigable"
          description="Tab to focus, Space/Enter to select. Arrow keys for radio groups."
        />
      </div>
      <div className="alert alert-info mt-4">
        <strong>Accessibility Notes:</strong>
        <ul className="mb-0 mt-2">
          <li>Uses native checkbox/radio inputs for screen reader support</li>
          <li>
            Card is wrapped in a <code>&lt;label&gt;</code> for click-anywhere behavior
          </li>
          <li>
            Supports <code>aria-label</code>, <code>aria-labelledby</code>, and{' '}
            <code>aria-describedby</code>
          </li>
          <li>Shows development warnings for missing accessibility attributes</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'SelectableCard includes comprehensive accessibility support following WCAG 2.2 AA guidelines.',
      },
    },
  },
};

// =============================================================================
// Complete Showcase
// =============================================================================

/**
 * Complete showcase demonstrating all features.
 */
export const CompleteShowcase: Story = {
  render: function CompleteShowcaseStory() {
    const [selectedPlan, setSelectedPlan] = useState('basic');
    const [addOns, setAddOns] = useState<Set<string>>(new Set());

    const plans = [
      { value: 'basic', title: 'Basic', price: '$0', desc: 'For individuals' },
      { value: 'pro', title: 'Pro', price: '$19', desc: 'For professionals' },
      { value: 'team', title: 'Team', price: '$49', desc: 'For small teams' },
    ];

    const addOnsList = [
      { value: 'support', title: 'Priority Support', price: '+$10/mo' },
      { value: 'storage', title: 'Extra Storage', price: '+$5/mo' },
      { value: 'analytics', title: 'Advanced Analytics', price: '+$15/mo' },
    ];

    const toggleAddOn = (value: string, checked: boolean): void => {
      setAddOns((prev) => {
        const next = new Set(prev);
        if (checked) {
          next.add(value);
        } else {
          next.delete(value);
        }
        return next;
      });
    };

    return (
      <div>
        <div className="mb-5">
          <Heading level={5} className="mb-3">
            1. Choose Your Plan (Radio)
          </Heading>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {plans.map((plan) => (
              <SelectableCard
                key={plan.value}
                selectionMode="radio"
                name="showcase-plan"
                value={plan.value}
                checked={selectedPlan === plan.value}
                onChange={(checked) => {
                  if (checked) {
                    setSelectedPlan(plan.value);
                  }
                }}
                title={plan.title}
                subtitle={plan.price}
                description={plan.desc}
                selectedColor="primary"
              />
            ))}
          </div>
        </div>

        <div className="mb-5">
          <Heading level={5} className="mb-3">
            2. Select Add-ons (Checkbox)
          </Heading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {addOnsList.map((addOn) => (
              <SelectableCard
                key={addOn.value}
                selectionMode="checkbox"
                value={addOn.value}
                checked={addOns.has(addOn.value)}
                onChange={(checked) => toggleAddOn(addOn.value, checked)}
                title={addOn.title}
                subtitle={addOn.price}
                selectedColor="success"
              />
            ))}
          </div>
        </div>

        <div className="card bg-light">
          <div className="card-body">
            <Heading level={6} className="card-title">
              Your Selection
            </Heading>
            <p className="mb-1">
              <strong>Plan:</strong> {plans.find((p) => p.value === selectedPlan)?.title}
            </p>
            <p className="mb-0">
              <strong>Add-ons:</strong>{' '}
              {addOns.size > 0
                ? [...addOns].map((a) => addOnsList.find((x) => x.value === a)?.title).join(', ')
                : 'None'}
            </p>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'A complete showcase combining radio cards for single selection ' +
          'and checkbox cards for multiple selections in a realistic checkout flow.',
      },
    },
  },
};

// =============================================================================
// Selection Indicators
// =============================================================================

/**
 * Different selection indicator styles.
 */
export const SelectionIndicators: Story = {
  render: function SelectionIndicatorsStory() {
    const [checked, setChecked] = useState<Record<string, boolean>>({
      control: true,
      'check-icon': true,
      'border-only': true,
      none: true,
    });

    const toggle = (key: string, val: boolean): void => {
      setChecked((prev) => ({ ...prev, [key]: val }));
    };

    return (
      <div>
        <Heading level={5} className="mb-3">
          Selection Indicator Variants
        </Heading>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1rem',
          }}
        >
          <SelectableCard
            selectionMode="checkbox"
            value="control"
            title="Control (Default)"
            description="Standard checkbox input"
            selectionIndicator="control"
            checked={checked.control}
            onChange={(v) => toggle('control', v)}
          />
          <SelectableCard
            selectionMode="checkbox"
            value="check-icon"
            title="Check Icon"
            description="SVG checkmark badge overlay"
            selectionIndicator="check-icon"
            checked={checked['check-icon']}
            onChange={(v) => toggle('check-icon', v)}
          />
          <SelectableCard
            selectionMode="checkbox"
            value="border-only"
            title="Border Only"
            description="Selection via border highlight only"
            selectionIndicator="border-only"
            checked={checked['border-only']}
            onChange={(v) => toggle('border-only', v)}
          />
          <SelectableCard
            selectionMode="checkbox"
            value="none-indicator"
            title="None"
            description="No visible indicator"
            selectionIndicator="none"
            checked={checked.none}
            onChange={(v) => toggle('none', v)}
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'The `selectionIndicator` prop controls how the selection state is visually communicated. ' +
          'All variants maintain a hidden native input for form participation and accessibility.',
      },
    },
  },
};

// =============================================================================
// Description Truncation
// =============================================================================

/**
 * Description line clamping.
 */
export const DescriptionTruncation: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <SelectableCard
        selectionMode="checkbox"
        value="no-clamp"
        title="No Truncation"
        description="This description has no line limit and will expand to show all content regardless of how long it is. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        style={{ flex: '1', minWidth: '250px' }}
      />
      <SelectableCard
        selectionMode="checkbox"
        value="clamp-2"
        title="2 Lines Max"
        description="This description is limited to 2 lines using CSS line-clamp. Any content beyond these 2 lines will be truncated with an ellipsis. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        descriptionLines={2}
        style={{ flex: '1', minWidth: '250px' }}
      />
      <SelectableCard
        selectionMode="checkbox"
        value="clamp-1"
        title="1 Line Max"
        description="This long description is truncated after just one single line using the descriptionLines prop."
        descriptionLines={1}
        style={{ flex: '1', minWidth: '250px' }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use `descriptionLines` to limit the number of visible lines in the description. ' +
          'Overflow is hidden with CSS line-clamp.',
      },
    },
  },
};

// =============================================================================
// Selected Color Border
// =============================================================================

/**
 * Selected color affects both background and border.
 */
export const SelectedColorBorder: Story = {
  render: function Render() {
    const colors = ['primary', 'success', 'danger', 'warning', 'info'] as const;

    return (
      <div>
        <Heading level={5} className="mb-3">
          Selected Color on Border
        </Heading>
        <p className="text-muted small mb-3">
          The <code>selectedColor</code> prop now sets both the background and border color.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          {colors.map((color) => (
            <SelectableCard
              key={color}
              selectionMode="checkbox"
              value={color}
              selectedColor={color}
              title={color.charAt(0).toUpperCase() + color.slice(1)}
              description={`Border uses var(--bs-${color})`}
              defaultChecked
            />
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'When `selectedColor` is set, the selection border uses `var(--bs-{color})` instead of the default `var(--bs-primary)`.',
      },
    },
  },
};
