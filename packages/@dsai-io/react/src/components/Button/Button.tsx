/* eslint jsx-a11y/no-autofocus: 0 */

import { forwardRef, useEffect, useReducer } from 'react';

import { BaseButton } from './BaseButton';
import { type ButtonFSMEvent, buttonFSMReducer, createInitialButtonFSMState } from './Button.fsm';

import type { ButtonProps } from './Button.types';

/**
 * Button Component with FSM State Management
 *
 * A versatile, accessible button component using Bootstrap 5 native classes
 * enhanced with Finite State Machine for visual state management.
 *
 * FSM manages visual states based on user interactions:
 * - idle: default state
 * - hovered: mouse over
 * - focused: keyboard focus
 * - pressed: mouse down
 * - disabled: disabled state (prop-driven)
 * - loading: loading state (prop-driven)
 * - error: error state (prop-driven)
 *
 * The FSM ensures predictable, consistent visual feedback for all interactions.
 *
 * DSAi design tokens are applied through the Bootstrap theme (dsai-theme-bs.css).
 * Supports multiple variants, sizes, states, icons, and loading with full WCAG 2.2 AA compliance.
 *
 * SECURITY: Prop spreading is restricted to a whitelist of safe HTML attributes only.
 * Event handlers must be explicitly passed through the component API.
 *
 * @see https://getbootstrap.com/docs/5.3/components/buttons/
 *
 * @example
 * ```tsx
 * // Primary button
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 *
 * // Outline variant
 * <Button variant="outline-secondary" size="lg">
 *   Large Outline Button
 * </Button>
 *
 * // Loading state
 * <Button variant="primary" loading>
 *   Saving...
 * </Button>
 *
 * // With icons
 * <Button variant="success" startIcon={<CheckIcon />}>
 *   Save
 * </Button>
 *
 * // Error state
 * <Button variant="primary" error>
 *   Error occurred
 * </Button>
 *
 * // Full width button
 * <Button variant="success" fullWidth>
 *   Full Width
 * </Button>
 *
 * // With ref
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * <Button ref={buttonRef} onClick={handleClick}>
 *   Button with Ref
 * </Button>
 *
 * // With aria-live announcements for async operations
 * <Button announceText="Saving changes..." loading>
 *   Save
 * </Button>
 * ```
 *
 * Accessibility Features (WCAG 2.2 AA):
 * - Semantic HTML `<button>` element
 * - Keyboard navigation (Enter, Space)
 * - Focus indicators (visible focus ring via Bootstrap)
 * - Disabled state with aria-disabled
 * - Loading state with aria-busy
 * - Decorative icons marked with aria-hidden="true"
 * - Dynamic state announcements via aria-live="polite"
 * - Sufficient color contrast (4.5:1 for normal text, 3:1 for large text)
 * - Touch target size ≥44×44px (WCAG 2.2 2.5.8)
 * - Focus Not Obscured (WCAG 2.2 2.4.11, 2.4.12)
 * - Consistent Help (WCAG 2.2 3.2.6)
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ disabled = false, loading = false, error = false, onClick, as, ...restProps }, ref) => {
    // Initialize FSM with current state
    const [fsmState, dispatch] = useReducer(
      buttonFSMReducer,
      { disabled, loading, error },
      (initialState) =>
        createInitialButtonFSMState(initialState.disabled, initialState.loading, initialState.error)
    );

    // Sync FSM with external prop changes
    useEffect(() => {
      if (disabled && !fsmState.isDisabled) {
        dispatch({ type: 'DISABLE' });
      } else if (!disabled && fsmState.isDisabled) {
        dispatch({ type: 'ENABLE' });
      }
    }, [disabled, fsmState.isDisabled]);

    useEffect(() => {
      dispatch({ type: 'LOADING', payload: loading });
    }, [loading]);

    useEffect(() => {
      dispatch({ type: 'ERROR', payload: error });
    }, [error]);

    // FSM event handlers
    const dispatchFSMEvent = (event: ButtonFSMEvent): void => {
      dispatch(event);
    };

    // Create wrapper handlers that dispatch FSM events and call user handlers
    const handleMouseEnter = (): void => {
      dispatchFSMEvent({ type: 'HOVER' });
    };

    const handleMouseLeave = (): void => {
      dispatchFSMEvent({ type: 'BLUR' });
    };

    const handleFocus = (): void => {
      dispatchFSMEvent({ type: 'FOCUS' });
    };

    const handleBlur = (): void => {
      dispatchFSMEvent({ type: 'BLUR' });
    };

    const handleMouseUp = (): void => {
      dispatchFSMEvent({ type: 'RELEASE' });
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
      // Prevent click if disabled or loading
      if (disabled || loading) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    // Note: onMouseDown for FSM - only respond to left button (button 0)
    const handleMouseDownFSM = (e: React.MouseEvent<HTMLButtonElement>): void => {
      // Only dispatch PRESS for left mouse button
      if (e.button === 0) {
        dispatchFSMEvent({ type: 'PRESS' });
      }
    };

    return (
      <BaseButton
        ref={ref}
        {...restProps}
        as={as}
        disabled={disabled}
        loading={loading}
        error={error}
        onClick={handleClick}
        fsmState={fsmState}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={handleMouseDownFSM}
        onMouseUp={handleMouseUp}
      />
    );
  }
);

Button.displayName = 'Button';
