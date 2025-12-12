/**
 * Accessibility and Security Types
 *
 * Type definitions for accessible and secure component development.
 *
 * @module @dsai/react/types/accessibility
 */

import type { CSSProperties } from 'react';

/**
 * Safe HTML attributes whitelist
 *
 * SECURITY: Prevents injection of dangerous attributes or event handlers
 *
 * This interface provides a whitelist of HTML attributes that are safe to spread
 * onto components. It explicitly excludes event handlers (onClick, onMouseOver, etc.)
 * and other potentially dangerous attributes to prevent XSS attacks.
 *
 *
 * @template T - HTML element type for element-specific attributes
 *
 * @example
 * ```typescript
 * interface ButtonProps extends SafeHTMLAttributes<HTMLButtonElement> {
 *   variant?: ButtonVariant;
 *   size?: ComponentSize;
 * }
 *
 * // Component can safely spread safe props
 * <button {...safeProps} className={className} />
 * ```
 */
export interface SafeHTMLAttributes<_T extends HTMLElement = HTMLElement> {
  // Standard HTML attributes
  className?: string;
  style?: CSSProperties;
  id?: string;

  // Test identifiers
  'data-testid'?: string;
  'data-test'?: string;

  // Descriptive
  title?: string;

  // Interaction
  tabIndex?: number;

  // ARIA - Core
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;

  // ARIA - State
  'aria-hidden'?: boolean | 'true' | 'false';
  'aria-expanded'?: boolean | 'true' | 'false';
  'aria-selected'?: boolean | 'true' | 'false';
  'aria-checked'?: boolean | 'true' | 'false' | 'mixed';
  'aria-disabled'?: boolean | 'true' | 'false';
  'aria-pressed'?: boolean | 'true' | 'false' | 'mixed';
  'aria-current'?: boolean | 'true' | 'false' | 'page' | 'step' | 'location' | 'date' | 'time';
  'aria-busy'?: boolean | 'true' | 'false';

  // ARIA - Form validation (WCAG 2.2 AA)
  'aria-invalid'?: boolean | 'true' | 'false' | 'grammar' | 'spelling';
  'aria-required'?: boolean | 'true' | 'false';
  'aria-errormessage'?: string;

  // ARIA - Relationships
  'aria-controls'?: string;
  'aria-owns'?: string;
  'aria-activedescendant'?: string;

  // ARIA - Live regions
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-atomic'?: boolean | 'true' | 'false';
  'aria-relevant'?: 'additions' | 'removals' | 'text' | 'all';

  // ARIA - Drag and drop
  'aria-dropeffect'?: 'none' | 'copy' | 'move' | 'link' | 'execute' | 'popup';
  'aria-grabbed'?: boolean | 'true' | 'false';

  // Custom data attributes (allow any data-* attribute)
  // Safe because data attributes cannot execute JavaScript
  [key: `data-${string}`]: string | number | boolean | undefined;
}

/**
 * Common ARIA properties for interactive components
 *
 * Subset of ARIA attributes commonly used for component accessibility.
 * Use SafeHTMLAttributes for components that need the full whitelist.
 *
 * @example
 * ```typescript
 * interface TooltipProps extends ARIAProps {
 *   content: ReactNode;
 * }
 * ```
 */
export interface ARIAProps {
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-selected'?: boolean;
  'aria-checked'?: boolean | 'mixed';
  'aria-disabled'?: boolean;
  'aria-hidden'?: boolean;
  'aria-controls'?: string;
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-live'?: 'off' | 'polite' | 'assertive';
}
