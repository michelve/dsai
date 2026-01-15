/**
 * ClearIcon - SVG icon component for clear/close actions
 *
 * Renders an accessible X icon used for clearing inputs, closing dialogs,
 * or removing items. Uses Bootstrap Icons design language.
 *
 * @module utils/misc/ClearIcon
 *
 * Consolidated from:
 * - packages/@dsai-io/react/src/components/Input/Input.tsx
 * - packages/@dsai-io/react/src/components/Select/Select.tsx
 */

import { XIcon } from '../../components/Icon';

import type React from 'react';

/**
 * Renders a clear/close X icon as an SVG.
 *
 * The icon is marked with aria-hidden="true" as it's typically
 * used alongside accessible text or within a button with an aria-label.
 *
 * @returns React SVG element
 *
 * @example
 * // In a clear button
 * <button aria-label="Clear input">
 *   <ClearIcon />
 * </button>
 *
 * @example
 * // With visible text
 * <button>
 *   <ClearIcon />
 *   <span>Clear</span>
 * </button>
 */
export function ClearIcon(): React.JSX.Element {
  return <XIcon aria-hidden size={16} />;
}

export default ClearIcon;
