/**
 * Figma Code Connect - SelectableCard Component
 *
 * Maps the DSAi SelectableCard Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module SelectableCard/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { SelectableCard } from './SelectableCard';

/**
 * DSAi SelectableCard - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_SELECTABLE_CARD>` substitution variable defined in figma.config.json.
 *
 * A card that behaves like a checkbox or radio option.
 * Click anywhere on the card to toggle/select.
 *
 * Accessibility goals:
 * - Native checkbox/radio input for keyboard support
 * - Entire card acts as label for the control
 * - Proper focus management
 * - aria-checked state exposed
 */
figma.connect(SelectableCard, '<FIGMA_DSAI_SELECTABLE_CARD>', {
  props: {
    /**
     * Selection mode
     * Maps Figma "Selection Mode" property
     */
    selectionMode: figma.enum('Selection Mode', {
      None: 'none',
      Checkbox: 'checkbox',
      Radio: 'radio',
    }),

    /**
     * Card variant
     * Maps Figma "Variant" property
     */
    variant: figma.enum('Variant', {
      Elevated: 'elevated',
      Outlined: 'outlined',
      Ghost: 'ghost',
    }),

    /**
     * Selected/checked state
     * Maps Figma "Selected" boolean property
     */
    checked: figma.boolean('Selected'),

    /**
     * Disabled state
     * Maps Figma "Disabled" boolean property
     */
    disabled: figma.boolean('Disabled'),

    /**
     * Error state
     * Maps Figma "Error" boolean property
     */
    error: figma.boolean('Error'),

    /**
     * Required field
     * Maps Figma "Required" boolean property
     */
    required: figma.boolean('Required'),

    /**
     * Horizontal layout
     * Maps Figma "Horizontal" boolean property
     */
    horizontal: figma.boolean('Horizontal'),

    /**
     * Card title
     * Maps Figma "Title" text property
     */
    title: figma.string('Title'),

    /**
     * Card subtitle
     * Maps Figma "Subtitle" text property
     */
    subtitle: figma.string('Subtitle'),

    /**
     * Card description
     * Maps Figma "Description" text property
     */
    description: figma.string('Description'),

    /**
     * Has media
     * Maps Figma "Has Media" boolean property
     */
    hasMedia: figma.boolean('Has Media'),

    /**
     * Has footer
     * Maps Figma "Has Footer" boolean property
     */
    hasFooter: figma.boolean('Has Footer'),

    /**
     * Selected color variant
     * Maps Figma "Selected Color" property
     */
    selectedColor: figma.enum('Selected Color', {
      None: undefined,
      Primary: 'primary',
      Secondary: 'secondary',
      Success: 'success',
      Info: 'info',
    }),
  },

  example: ({
    selectionMode,
    variant,
    checked,
    disabled,
    error,
    required,
    horizontal,
    title,
    subtitle,
    description,
    hasMedia,
    hasFooter,
    selectedColor,
  }) => {
    const normalizedTitle = title && title.trim().length > 0 ? title.trim() : 'Card Title';
    const normalizedSubtitle = subtitle && subtitle.trim().length > 0 ? subtitle.trim() : undefined;
    const normalizedDescription =
      description && description.trim().length > 0 ? description.trim() : undefined;

    return (
      <SelectableCard
        value="card-1"
        selectionMode={selectionMode}
        variant={variant}
        checked={checked}
        disabled={disabled}
        error={error}
        required={required}
        horizontal={horizontal}
        title={normalizedTitle}
        subtitle={normalizedSubtitle}
        description={normalizedDescription}
        selectedColor={selectedColor}
        media={hasMedia ? <div className="bg-secondary" style={{ height: 120 }} /> : undefined}
        footer={hasFooter ? <span className="text-muted">Footer content</span> : undefined}
        name={selectionMode === 'radio' ? 'card-group' : undefined}
        onChange={() => {}}
      />
    );
  },
});

/**
 * SelectableCard Usage Patterns
 *
 * 1. Checkbox Card (standalone):
 *    <SelectableCard
 *      selectionMode="checkbox"
 *      title="Premium Plan"
 *      description="$29/month - Full access to all features"
 *      defaultChecked
 *      onChange={(checked) => console.log('Selected:', checked)}
 *    />
 *
 * 2. Radio Cards (in a group):
 *    <CardList selectionMode="single" value={plan} onChange={setPlan}>
 *      <SelectableCard
 *        value="free"
 *        title="Free"
 *        description="Basic features"
 *      />
 *      <SelectableCard
 *        value="pro"
 *        title="Pro"
 *        description="$9/month"
 *      />
 *      <SelectableCard
 *        value="enterprise"
 *        title="Enterprise"
 *        description="Custom pricing"
 *      />
 *    </CardList>
 *
 * 3. With Media:
 *    <SelectableCard
 *      selectionMode="checkbox"
 *      title="Product Name"
 *      description="Product description"
 *      media={<img src="/product.jpg" alt="Product" />}
 *    />
 *
 * 4. Horizontal Layout:
 *    <SelectableCard
 *      selectionMode="checkbox"
 *      horizontal
 *      title="Feature Option"
 *      description="Description of the feature"
 *      media={<Icon name="feature" />}
 *    />
 *
 * 5. With Selected Color:
 *    <SelectableCard
 *      selectionMode="checkbox"
 *      selectedColor="success"
 *      title="Completed Task"
 *      checked
 *    />
 *
 * 6. Non-interactive (display only):
 *    <SelectableCard
 *      selectionMode="none"
 *      title="Info Card"
 *      description="This card is for display only"
 *    />
 *
 * Accessibility Notes:
 * - Entire card is wrapped in <label> for checkbox/radio modes
 * - Native input provides keyboard support
 * - Avoid nested interactive elements (buttons, links) in content
 * - Use selectionMode="none" if you need interactive elements inside
 */
