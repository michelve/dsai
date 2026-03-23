import { forwardRef, useMemo } from 'react';

import { cn } from '../../utils';
import { Spinner } from '../Spinner';

import type { ButtonFSMState } from './Button.fsm';
import type { ButtonProps } from './Button.types';

// Visually-hidden styles for sr-only elements
const srOnlyStyle: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  border: 0,
};

// Icon size dimensions (square button for icon-only use)
const ICON_SIZE_STYLE: React.CSSProperties = {
  width: '2.5rem',
  height: '2.5rem',
  padding: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

// Ghost variant base styles
const GHOST_BASE_STYLE: React.CSSProperties = {
  backgroundColor: 'transparent',
  border: 'none',
  color: 'inherit',
};

// Ghost variant hover/pressed styles
const GHOST_HOVER_STYLE: React.CSSProperties = {
  ...GHOST_BASE_STYLE,
  backgroundColor: 'var(--bs-tertiary-bg, rgba(0,0,0,0.05))',
};

/**
 * Determine if a variant is a subtle variant and extract its color.
 */
function parseSubtleVariant(variant: string): string | null {
  if (variant.startsWith('subtle-')) {
    return variant.slice(7);
  }
  return null;
}

/**
 * BaseButton - Presentational Button Component
 *
 * Receives visual state from the FSM and renders the button with appropriate
 * styling via Bootstrap classes and data-visual-state attribute.
 *
 * SECURITY: Prop spreading is restricted to a whitelist of safe HTML attributes.
 * Event handlers must be explicitly passed through the component API.
 */
export const BaseButton = forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    fsmState: ButtonFSMState;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onMouseUp?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
  }
>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      error = false,
      loadingText,
      loadingPosition = 'start',
      loadingIndicator,
      startIcon,
      endIcon,
      onClick,
      className = '',
      type = 'button',
      fullWidth = false,
      style,
      id,
      name,
      value,
      tabIndex,
      autoFocus,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'aria-controls': ariaControls,
      'aria-expanded': ariaExpanded,
      'aria-pressed': ariaPressed,
      'aria-haspopup': ariaHasPopup,
      'data-testid': dataTestId,
      'data-test': dataTest,
      title,
      form,
      formAction,
      formMethod,
      formNoValidate,
      formTarget,
      announceText,
      announce = !!announceText,
      fsmState,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      onFocus,
      onBlur,
    },
    ref
  ) => {
    // Button is disabled when explicitly disabled or loading
    const isDisabled = disabled || loading;

    // Parse subtle variant color
    const subtleColor = parseSubtleVariant(variant);
    const isGhost = variant === 'ghost';
    const isSubtle = subtleColor !== null;

    // Build Bootstrap class names - memoized to prevent unnecessary recalculation
    const bootstrapClasses = useMemo(() => {
      // Determine the variant class
      let variantClass: string;
      if (isGhost) {
        // Ghost: use btn base only, styles applied via style prop
        variantClass = '';
      } else if (isSubtle) {
        // Subtle: use Bootstrap subtle background utilities
        variantClass = `bg-${subtleColor}-subtle text-${subtleColor}-emphasis`;
      } else {
        // Standard Bootstrap variant
        variantClass = `btn-${variant}`;
      }

      return cn(
        'btn',
        variantClass,
        isSubtle && 'border-0',
        size === 'sm' && 'btn-sm',
        size === 'lg' && 'btn-lg',
        size === 'icon' && 'btn-sm', // Base sizing, exact dimensions via style
        fullWidth && 'w-100',
        error && 'btn-error',
        className
      );
    }, [variant, size, fullWidth, error, className, isGhost, isSubtle, subtleColor]);

    // Compute variant-specific styles (ghost uses FSM state for hover feedback)
    const computedStyle = useMemo<React.CSSProperties | undefined>(() => {
      const baseStyle: React.CSSProperties = {};

      // Ghost variant: dynamic background based on FSM hover/pressed state
      if (isGhost) {
        const isInteractive =
          fsmState.visualState === 'hovered' ||
          fsmState.visualState === 'pressed' ||
          fsmState.visualState === 'focused';
        Object.assign(baseStyle, isInteractive ? GHOST_HOVER_STYLE : GHOST_BASE_STYLE);
      }

      // Icon size: square dimensions
      if (size === 'icon') {
        Object.assign(baseStyle, ICON_SIZE_STYLE);
      }

      // Merge with user-provided style
      if (style || Object.keys(baseStyle).length > 0) {
        return { ...baseStyle, ...style };
      }
      return style;
    }, [isGhost, size, fsmState.visualState, style]);

    // Determine what content to show
    const showLoadingText = loading && loadingText;
    const displayText = showLoadingText ? loadingText : children;

    // Build the loading indicator element
    const loaderEl = loading
      ? loadingIndicator ?? (
          <Spinner
            size="sm"
            style={{
              display: 'inline-block',
            }}
            aria-hidden="true"
          />
        )
      : null;

    // Handle click - prevent if disabled or loading
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
      if (isDisabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    // Build autoFocus props conditionally to avoid linter warnings
    const autoFocusProps = autoFocus ? { autoFocus: true as const } : {};

    // Render loading at center position (hides text, shows only spinner)
    const isCenterLoading = loading && loadingPosition === 'center';

    return (
      <>
        <button
          ref={ref}
          type={type}
          className={bootstrapClasses}
          disabled={isDisabled}
          onClick={handleClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onFocus={onFocus}
          onBlur={onBlur}
          style={computedStyle}
          id={id}
          name={name}
          value={value}
          tabIndex={tabIndex}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          aria-controls={ariaControls}
          aria-expanded={ariaExpanded}
          aria-pressed={ariaPressed}
          aria-haspopup={ariaHasPopup}
          aria-busy={loading}
          aria-disabled={isDisabled ? true : undefined}
          data-testid={dataTestId}
          data-test={dataTest}
          data-visual-state={fsmState.visualState}
          data-variant={isGhost ? 'ghost' : isSubtle ? `subtle-${subtleColor}` : undefined}
          title={title}
          form={form}
          formAction={formAction}
          formMethod={formMethod}
          formNoValidate={formNoValidate}
          formTarget={formTarget}
          {...autoFocusProps}
        >
          {isCenterLoading ? (
            /* Center loading: hide text, show only loader */
            <>
              <span style={{ visibility: 'hidden' }}>{displayText}</span>
              <span
                style={{
                  position: 'absolute',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-hidden="true"
              >
                {loaderEl}
              </span>
            </>
          ) : (
            /* Start/end loading or non-loading content */
            <>
              {/* Start icon or start-position spinner */}
              {loading && loadingPosition === 'start' && (
                <span className="me-2" aria-hidden="true">
                  {loaderEl}
                </span>
              )}
              {!loading && startIcon && (
                <span className="me-2" aria-hidden="true">
                  {startIcon}
                </span>
              )}

              <span>{displayText}</span>

              {/* End icon or end-position spinner */}
              {loading && loadingPosition === 'end' && (
                <span className="ms-2" aria-hidden="true">
                  {loaderEl}
                </span>
              )}
              {!loading && endIcon && (
                <span className="ms-2" aria-hidden="true">
                  {endIcon}
                </span>
              )}
            </>
          )}
        </button>

        {/* Announce state changes to screen readers */}
        {announce && announceText && (
          <output aria-live="polite" aria-atomic="true" style={srOnlyStyle}>
            {announceText}
          </output>
        )}

        {/* Spinner status region for screen readers (present whenever loading) */}
        {loading && !announceText && (
          <output aria-live="polite" aria-atomic="true" style={srOnlyStyle}>
            Loading
          </output>
        )}
      </>
    );
  }
);

BaseButton.displayName = 'BaseButton';
