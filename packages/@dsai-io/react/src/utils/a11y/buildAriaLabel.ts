/**
 * @file buildAriaLabel - Build comprehensive ARIA label attributes
 * @module @dsai-io/react/utils/a11y
 *
 * Enterprise-grade ARIA label builder with:
 * - Combines label, labelledby, and describedby
 * - Handles multiple ID references
 * - Validates and sanitizes IDs
 * - Returns proper ARIA attributes object
 */

import type { BuildAriaLabelOptions } from '../types/shared';

/**
 * Build ARIA label attributes from various sources
 *
 * @param options - Label building options
 * @returns Object with aria-label, aria-labelledby, aria-describedby
 *
 * @example
 * ```tsx
 * // Basic label
 * buildAriaLabel({ label: 'Submit form' });
 * // => { 'aria-label': 'Submit form' }
 *
 * // Label by reference
 * buildAriaLabel({ labelledBy: 'form-title' });
 * // => { 'aria-labelledby': 'form-title' }
 *
 * // Multiple labelledby IDs
 * buildAriaLabel({ labelledBy: ['title', 'subtitle'] });
 * // => { 'aria-labelledby': 'title subtitle' }
 *
 * // With description
 * buildAriaLabel({
 *   label: 'Email',
 *   description: 'Enter your email address'
 * });
 * // => { 'aria-label': 'Email', 'aria-describedby': undefined }
 *
 * // Complex example
 * buildAriaLabel({
 *   labelledBy: 'dialog-title',
 *   describedBy: ['dialog-desc', 'dialog-help'],
 *   description: 'Additional context'
 * });
 * // => {
 * //   'aria-labelledby': 'dialog-title',
 * //   'aria-describedby': 'dialog-desc dialog-help'
 * // }
 * ```
 */
export function buildAriaLabel(options: BuildAriaLabelOptions): {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
} {
  const { label, labelledBy, describedBy } = options;

  const result: {
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
  } = {};

  // Priority: labelledBy > label
  if (labelledBy) {
    const ids = Array.isArray(labelledBy) ? labelledBy : [labelledBy];
    const sanitizedIds = ids
      .filter((id) => typeof id === 'string' && id.trim().length > 0)
      .map((id) => id.trim());

    if (sanitizedIds.length > 0) {
      result['aria-labelledby'] = sanitizedIds.join(' ');
    }
  } else if (label && label.trim().length > 0) {
    result['aria-label'] = label.trim();
  }

  // Handle describedBy
  if (describedBy) {
    const ids = Array.isArray(describedBy) ? describedBy : [describedBy];
    const sanitizedIds = ids
      .filter((id) => typeof id === 'string' && id.trim().length > 0)
      .map((id) => id.trim());

    if (sanitizedIds.length > 0) {
      result['aria-describedby'] = sanitizedIds.join(' ');
    }
  }

  // Note: description text is not used directly in ARIA attributes
  // It should be rendered as visible text with an ID, then referenced via describedBy

  return result;
}
