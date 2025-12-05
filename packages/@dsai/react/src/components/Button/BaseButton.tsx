import { forwardRef, useMemo } from 'react';

import { cn } from '../../utils';
import { Spinner } from '../Spinner';

import type { ButtonFSMState } from './Button.fsm';
import type { ButtonProps } from './Button.types';

/**
 * BaseButton - Presentational Button Component
 *
 * Receives visual state from the FSM and renders the button with appropriate
 * styling via Bootstrap classes and data-visual-state attribute.
 *
 * This component:
 * - Does NOT manage FSM state (passed in via fsmState)
 * - Applies Bootstrap classes for styling
 * - Adds data-visual-state attribute for CSS targeting
 * - Handles rendering of icons, spinner, and content
 * - Applies accessibility attributes
 *
 * SECURITY: Prop spreading is restricted to a whitelist of safe HTML attributes.
 * Event handlers must be explicitly passed through the component API.
 *
 * @example
 * ```tsx
 * const [fsmState, dispatch] = useReducer(buttonFSMReducer, initialState);
 *
 * <BaseButton
 *   fsmState={fsmState}
 *   variant="primary"
 *   size="md"
 *   onMouseEnter={() => dispatch({ type: 'HOVER' })}
 *   onMouseLeave={() => dispatch({ type: 'BLUR' })}
 *   onClick={handleClick}
 * >
 *   Click me
 * </BaseButton>
 * ```
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
    // Note: FSM state already reflects this, but we keep it for safety
    const isDisabled = disabled || loading;

    // Build Bootstrap class names - memoized to prevent unnecessary recalculation
    const bootstrapClasses = useMemo(
      () =>
        cn(
          'btn', // Base Bootstrap button class
          `btn-${variant}`, // Variant: btn-primary, btn-outline-secondary, etc.
          size === 'sm' && 'btn-sm',
          size === 'lg' && 'btn-lg',
          // Note: 'md' is the default size in Bootstrap, no class needed
          fullWidth && 'w-100', // Bootstrap utility for full width
          error && 'btn-error', // Error state class for styling
          className // Allow additional custom classes
        ),
      [variant, size, fullWidth, error, className]
    );

    // Determine what content to show
    const showLoadingText = loading && loadingText;
    const displayText = showLoadingText ? loadingText : children;

    // Spinner or loading indicator (shown when loading = true)
    const spinnerEl = loading ? (
      <Spinner
        size="sm"
        className="me-2"
        style={{
          display: 'inline-block',
          marginRight: '0.5rem',
          marginLeft: '-0.25rem',
        }}
        aria-hidden="true"
      />
    ) : null;

    // Handle click - prevent if disabled or loading
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
      if (isDisabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    // Build autoFocus props conditionally to avoid linter warnings
    // autoFocus is a valid use case for modal dialogs, forms, etc.
    const autoFocusProps = autoFocus ? { autoFocus: true as const } : {};

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
          style={style}
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
          title={title}
          form={form}
          formAction={formAction}
          formMethod={formMethod}
          formNoValidate={formNoValidate}
          formTarget={formTarget}
          {...autoFocusProps}
        >
          {!loading && startIcon && (
            <span className="me-2" aria-hidden="true">
              {startIcon}
            </span>
          )}
          {spinnerEl}
          <span>{displayText}</span>
          {!loading && endIcon && (
            <span className="ms-2" aria-hidden="true">
              {endIcon}
            </span>
          )}
        </button>

        {/* Announce state changes to screen readers (e.g., "Saving changes...") */}
        {announce && announceText && (
          <output
            aria-live="polite"
            aria-atomic="true"
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              margin: '-1px',
              padding: 0,
              overflow: 'hidden',
              clip: 'rect(0 0 0 0)',
              border: 0,
            }}
          >
            {announceText}
          </output>
        )}

        {/* Spinner status region for screen readers (present whenever loading) */}
        {loading && !announceText && (
          <output
            aria-live="polite"
            aria-atomic="true"
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              margin: '-1px',
              padding: 0,
              overflow: 'hidden',
              clip: 'rect(0 0 0 0)',
              border: 0,
            }}
          >
            Loading
          </output>
        )}
      </>
    );
  }
);

BaseButton.displayName = 'BaseButton';
