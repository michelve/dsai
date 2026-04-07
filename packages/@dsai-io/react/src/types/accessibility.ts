/**
 * Accessibility and Security Types
 *
 * Type definitions for accessible and secure component development.
 *
 * @module @dsai-io/react/types/accessibility
 */

import type { CSSProperties } from 'react';

type AriaTristate = boolean | 'true' | 'false';
type AriaMixed = AriaTristate | 'mixed';
type AriaCurrent = AriaTristate | 'page' | 'step' | 'location' | 'date' | 'time';
type AriaInvalid = AriaTristate | 'grammar' | 'spelling';
type AriaRelevant = 'additions' | 'removals' | 'text' | 'all';
type AriaDropEffect = 'none' | 'copy' | 'move' | 'link' | 'execute' | 'popup';
type DataAttributeValue = string | number | boolean | undefined;
type AriaHasPopup = boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
type AriaLive = 'off' | 'polite' | 'assertive';

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
  'aria-roledescription'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;

  // ARIA - State
  'aria-hidden'?: AriaTristate;
  'aria-expanded'?: AriaTristate;
  'aria-selected'?: AriaTristate;
  'aria-checked'?: AriaMixed;
  'aria-disabled'?: AriaTristate;
  'aria-pressed'?: AriaMixed;
  'aria-current'?: AriaCurrent;
  'aria-busy'?: AriaTristate;

  // ARIA - Form validation (WCAG 2.2 AA)
  'aria-invalid'?: AriaInvalid;
  'aria-required'?: AriaTristate;
  'aria-errormessage'?: string;

  // ARIA - Relationships
  'aria-controls'?: string;
  'aria-owns'?: string;
  'aria-activedescendant'?: string;

  // ARIA - Live regions
  'aria-live'?: AriaLive;
  'aria-atomic'?: AriaTristate;
  'aria-relevant'?: AriaRelevant;

  // ARIA - Drag and drop
  'aria-dropeffect'?: AriaDropEffect;
  'aria-grabbed'?: AriaTristate;

  // Custom data attributes (allow any data-* attribute)
  // Safe because data attributes cannot execute JavaScript
  [key: `data-${string}`]: DataAttributeValue;
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
  'aria-checked'?: AriaMixed;
  'aria-disabled'?: boolean;
  'aria-hidden'?: boolean;
  'aria-controls'?: string;
  'aria-haspopup'?: AriaHasPopup;
  'aria-live'?: AriaLive;
}
