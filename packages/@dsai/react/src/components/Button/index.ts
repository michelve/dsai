/**
 * Button Component
 *
 * A versatile, accessible button component with multiple variants and sizes.
 * Built with Bootstrap 5 design tokens and full WCAG 2.2 AA compliance.
 *
 * The Button component includes an internal Finite State Machine (FSM) that manages
 * visual states (idle, hovered, focused, pressed, disabled, loading, error) for
 * predictable and consistent interaction feedback.
 *
 * For advanced use cases, FSM types and utilities are also exported.
 *
 * @module Button
 */

// BaseButton is exported for advanced scenarios (custom wrappers, testing)
export { BaseButton } from './BaseButton';
export { Button } from './Button';

// FSM exports for advanced use cases (internal state management, testing, extensions)
export {
  type ButtonFSMEvent,
  type ButtonFSMState,
  type ButtonVisualState,
  buttonFSMReducer,
  createInitialButtonFSMState,
} from './Button.fsm';
export type { ButtonProps, ButtonSize, ButtonType, ButtonVariant } from './Button.types';
