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

/** Prefix for subtle variant names (e.g., "subtle-primary") */
const SUBTLE_VARIANT_PREFIX = 'subtle-';

/**
 * Determine if a variant is a subtle variant and extract its color.
 */
function parseSubtleVariant(variant: string): string | null {
  if (variant.startsWith(SUBTLE_VARIANT_PREFIX)) {
    return variant.slice(SUBTLE_VARIANT_PREFIX.length);
  }
  return null;
}

/** Render a start/end adornment (icon or loading spinner) */
function renderAdornment(
  position: 'start' | 'end',
  loading: boolean,
  loadingPosition: string,
  loaderEl: React.ReactNode,
  iconEl: React.ReactNode
): React.ReactNode {
  const spacingClass = position === 'start' ? 'me-2' : 'ms-2';

  if (loading && loadingPosition === position) {
    return <span className={spacingClass} aria-hidden="true">{loaderEl}</span>;
  }
  if (!loading && iconEl) {
    return <span className={spacingClass} aria-hidden="true">{iconEl}</span>;
  }
  return null;
}

/** Resolve data-variant attribute value */
function resolveDataVariant(
  isGhost: boolean,
  isSubtle: boolean,
  subtleColor: string | null
): string | undefined {
  if (isGhost) {
    return 'ghost';
  }
  if (isSubtle) {
    return `subtle-${subtleColor}`;
  }
  return undefined;
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

    // Resolve data-variant attribute
    const dataVariant = resolveDataVariant(isGhost, isSubtle, subtleColor);

    // Render loading at center position (hides text, shows only spinner)
    const isCenterLoading = loading && loadingPosition === 'center';

    // Render start/end adornments (icon or spinner)
    const startAdornment = renderAdornment('start', loading, loadingPosition, loaderEl, startIcon);
    const endAdornment = renderAdornment('end', loading, loadingPosition, loaderEl, endIcon);

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
          data-variant={dataVariant}
          title={title}
          form={form}
          formAction={formAction}
          formMethod={formMethod}
          formNoValidate={formNoValidate}
          formTarget={formTarget}
          {...autoFocusProps}
        >
          {isCenterLoading ? (
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
            <>
              {startAdornment}
              <span>{displayText}</span>
              {endAdornment}
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
