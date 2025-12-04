import { forwardRef, memo, useCallback, useId, useMemo, useRef, useState } from 'react';

import { Card, CardBody, CardFooter, CardText, CardTitle } from '../Card';
import { Checkbox } from '../Checkbox';
import { Radio } from '../Radio';

import type { SelectableCardProps } from './SelectableCard.types';

// =============================================================================
// Development Warnings
// =============================================================================

const warnedIds = new Set<string>();

/**
 * Warns in development when SelectableCard is used incorrectly
 */
function warnMissingValue(id: string, selectionMode: string): void {
  if (
    typeof process !== 'undefined' &&
    process.env?.NODE_ENV !== 'production' &&
    !warnedIds.has(id)
  ) {
    warnedIds.add(id);
    console.warn(
      `[DSAi SelectableCard] Card with id "${id}" has selectionMode="${selectionMode}" but no "value" prop. ` +
        `The "value" prop is required when using SelectableCard within a CardList.`
    );
  }
}

/**
 * Warns when radio mode is used without a name
 */
function warnMissingName(id: string): void {
  if (
    typeof process !== 'undefined' &&
    process.env?.NODE_ENV !== 'production' &&
    !warnedIds.has(`${id}-name`)
  ) {
    warnedIds.add(`${id}-name`);
    console.warn(
      `[DSAi SelectableCard] Card with id "${id}" has selectionMode="radio" but no "name" prop. ` +
        `Radio buttons require a "name" for proper grouping.`
    );
  }
}

const textFromReactNode = (node: React.ReactNode | undefined): string | undefined => {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  return undefined;
};

// =============================================================================
// SelectableCard Component
// =============================================================================

/**
 * SelectableCard Component
 *
 * A card that behaves like a checkbox or radio option.
 * Click anywhere on the card to toggle/select, not just the small control.
 *
 * Uses existing Card, Checkbox, Radio primitives internally.
 *
 * @see https://getbootstrap.com/docs/5.3/components/card/
 *
 * @example
 * ```tsx
 * // Standalone checkbox card
 * <SelectableCard
 *   selectionMode="checkbox"
 *   title="Premium Plan"
 *   description="$29/month"
 *   defaultChecked
 *   onChange={(checked) => console.log('Selected:', checked)}
 * />
 *
 * // Radio card in a group
 * <SelectableCard
 *   selectionMode="radio"
 *   value="premium"
 *   name="plan"
 *   checked={selectedPlan === 'premium'}
 *   onChange={(checked) => setSelectedPlan(checked ? 'premium' : null)}
 *   title="Premium Plan"
 * />
 * ```
 *
 * Accessibility Features (WCAG 2.2 AA):
 * - Uses native `<input type="checkbox">` or `<input type="radio">`
 * - Card click forwards to the control (like clicking a label)
 * - Proper focus management and keyboard support
 * - Minimum touch target via Bootstrap styling
 *
 * @important When selectionMode is "checkbox" or "radio", the entire card is
 * wrapped in a `<label>` element. Avoid placing nested interactive elements
 * (buttons, links, other inputs) inside the card content, as this creates
 * invalid HTML and may cause double-activation issues in some browsers.
 * Use selectionMode="none" if you need interactive elements inside the card.
 */
const SelectableCardComponent = forwardRef<HTMLElement, SelectableCardProps>(
  function SelectableCard(
    {
      // Identity
      value,
      id: providedId,

      // Selection
      selectionMode = 'none',
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      name,

      // States
      disabled = false,
      error = false,
      required = false,

      // Visual
      variant = 'outlined',
      selectedColor,
      horizontal = false,

      // Content
      title,
      subtitle,
      description,
      media,
      footer,
      children,

      // Accessibility
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,

      // Styling
      className = '',
      style,

      // Callbacks
      onCardClick,
    },
    ref
  ) {
    // Generate unique IDs
    const generatedId = useId();
    const id = providedId || generatedId;
    const inputId = `${id}-input`;
    const titleId = title ? `${id}-title` : undefined;
    const descriptionId = description ? `${id}-description` : undefined;

    // Ref for the input element
    const inputRef = useRef<HTMLInputElement>(null);

    // Determine if controlled
    const isControlled = controlledChecked !== undefined;

    // Internal state for uncontrolled mode
    const [internalChecked, setInternalChecked] = useState(defaultChecked);

    // Current checked state
    const isChecked = isControlled ? controlledChecked : internalChecked;

    // Development warnings
    if (selectionMode !== 'none' && !value) {
      warnMissingValue(id, selectionMode);
    }
    if (selectionMode === 'radio' && !name) {
      warnMissingName(id);
    }

    // Handle selection change
    const handleChange = useCallback(
      (newChecked: boolean) => {
        // Update internal state for uncontrolled mode
        if (!isControlled) {
          setInternalChecked(newChecked);
        }

        // Call onChange handler
        onChange?.(newChecked);

        // Call additional click handler
        onCardClick?.();
      },
      [isControlled, onChange, onCardClick]
    );

    // Handle checkbox/radio input change
    const handleInputChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) {
          return;
        }

        // For radio, only trigger change if not already checked
        if (selectionMode === 'radio' && isChecked) {
          return;
        }

        handleChange(event.target.checked);
      },
      [disabled, selectionMode, isChecked, handleChange]
    );

    // Build card classes
    const cardClasses = useMemo(() => {
      return [
        'selectable-card',
        selectionMode !== 'none' && 'selectable-card--interactive',
        isChecked && 'selectable-card--selected',
        disabled && 'selectable-card--disabled',
        error && 'selectable-card--error',
        className,
      ]
        .filter(Boolean)
        .join(' ');
    }, [selectionMode, isChecked, disabled, error, className]);

    // Build card style with selection highlight
    const cardStyle = useMemo<React.CSSProperties>(() => {
      const baseStyle: React.CSSProperties = {
        cursor: selectionMode !== 'none' && !disabled ? 'pointer' : undefined,
        ...style,
      };

      // Add selection border highlight
      if (isChecked && selectionMode !== 'none') {
        baseStyle.borderColor = 'var(--bs-primary)';
        baseStyle.borderWidth = '2px';
      }

      return baseStyle;
    }, [selectionMode, disabled, isChecked, style]);

    // Determine color based on selection state
    const cardColor = isChecked && selectedColor ? selectedColor : undefined;

    // Compute aria-labelledby
    const computedLabelledby = useMemo(() => {
      if (ariaLabelledby) {
        return ariaLabelledby;
      }
      if (titleId) {
        return titleId;
      }
      return undefined;
    }, [ariaLabelledby, titleId]);

    // Compute aria-describedby
    const computedDescribedby = useMemo(() => {
      const ids: string[] = [];
      if (ariaDescribedby) {
        ids.push(ariaDescribedby);
      }
      if (descriptionId) {
        ids.push(descriptionId);
      }
      return ids.length > 0 ? ids.join(' ') : undefined;
    }, [ariaDescribedby, descriptionId]);

    const controlAriaLabel = useMemo(() => {
      return (
        ariaLabel ??
        textFromReactNode(title) ??
        textFromReactNode(subtitle) ??
        textFromReactNode(description) ??
        value ??
        (selectionMode !== 'none' ? 'Selectable option' : undefined)
      );
    }, [ariaLabel, title, subtitle, description, value, selectionMode]);

    // Render the selection control
    const renderControl = (): React.ReactNode => {
      if (selectionMode === 'none') {
        return null;
      }

      const controlProps = {
        ref: inputRef,
        id: inputId,
        checked: isChecked,
        onChange: handleInputChange,
        disabled,
        required,
        name,
        value: value || '',
        'aria-label': controlAriaLabel,
        className: 'selectable-card__control',
      };

      if (selectionMode === 'checkbox') {
        return <Checkbox {...controlProps} />;
      }

      if (selectionMode === 'radio') {
        return <Radio {...controlProps} />;
      }

      return null;
    };

    // Render card content
    const renderContent = (): React.ReactNode => {
      // If children are provided, render them directly
      if (children) {
        return (
          <CardBody>
            {renderControl()}
            {children}
          </CardBody>
        );
      }

      // Otherwise, build content from props
      return (
        <>
          {media && <div className="selectable-card__media">{media}</div>}
          <CardBody>
            <div className="selectable-card__header">
              {renderControl()}
              <div className="selectable-card__content">
                {title && (
                  <div id={titleId}>
                    <CardTitle as="h5">
                      {title}
                      {required && selectionMode !== 'none' && (
                        <span className="text-danger ms-1">*</span>
                      )}
                    </CardTitle>
                  </div>
                )}
                {subtitle && (
                  <CardText muted className="selectable-card__subtitle">
                    {subtitle}
                  </CardText>
                )}
              </div>
            </div>
            {description && (
              <div id={descriptionId}>
                <CardText className="selectable-card__description">{description}</CardText>
              </div>
            )}
          </CardBody>
          {footer && <CardFooter>{footer}</CardFooter>}
        </>
      );
    };

    // For non-interactive mode, render a standard Card
    if (selectionMode === 'none') {
      return (
        <Card
          ref={ref}
          id={id}
          variant={variant}
          color={cardColor}
          horizontal={horizontal}
          interactive={false}
          className={cardClasses}
          style={cardStyle}
          aria-label={!title ? ariaLabel : undefined}
          aria-labelledby={computedLabelledby}
        >
          <div aria-describedby={computedDescribedby}>{renderContent()}</div>
        </Card>
      );
    }

    // For checkbox/radio mode, use a label wrapper for proper accessibility.
    // The entire card acts as a label for the checkbox/radio, avoiding
    // nested interactive elements while maintaining full card clickability.
    return (
      <label
        ref={ref as React.Ref<HTMLLabelElement>}
        htmlFor={inputId}
        className={`card ${variant === 'outlined' ? 'border' : ''} ${cardClasses}`}
        style={{
          ...cardStyle,
          display: 'block',
          transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
        }}
        id={id}
        aria-label={!title ? ariaLabel : undefined}
        aria-labelledby={computedLabelledby}
        aria-describedby={computedDescribedby}
      >
        {renderContent()}
      </label>
    );
  }
);

SelectableCardComponent.displayName = 'SelectableCard';

// Memoize component to prevent unnecessary re-renders
export const SelectableCard = memo(SelectableCardComponent);

// Preserve displayName through memo wrapper
SelectableCard.displayName = 'SelectableCard';
