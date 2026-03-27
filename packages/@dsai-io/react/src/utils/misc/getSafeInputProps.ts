/**
 * getSafeInputProps - Filters props to only include safe HTML attributes
 *
 * Provides a whitelist-based approach to filtering HTML attributes,
 * blocking dangerous event handlers and attributes for security.
 *
 * @module utils/misc/getSafeInputProps
 *
 * Consolidated from:
 * - packages/@dsai-io/react/src/components/Checkbox/Checkbox.tsx
 * - packages/@dsai-io/react/src/components/Input/Input.tsx
 */

/**
 * Safe whitelist of HTML attributes allowed on input elements.
 * Blocks all event handlers (onClick, onLoad, onError, etc.) and dangerous attributes.
 */
export const SAFE_INPUT_ATTRIBUTES = {
  accept: true,
  acceptCharset: true,
  alt: true,
  autoComplete: true,
  autoFocus: true,
  capture: true,
  className: true,
  contentEditable: true,
  crossOrigin: true,
  data: true,
  datatype: true,
  defaultChecked: true,
  defaultValue: true,
  dir: true,
  disabled: true,
  draggable: true,
  form: true,
  formEncType: true,
  formMethod: true,
  formNoValidate: true,
  formTarget: true,
  height: true,
  hidden: true,
  id: true,
  lang: true,
  list: true,
  max: true,
  maxLength: true,
  min: true,
  minLength: true,
  multiple: true,
  name: true,
  pattern: true,
  placeholder: true,
  prefix: true,
  property: true,
  readOnly: true,
  required: true,
  resource: true,
  rev: true,
  role: true,
  spellCheck: true,
  step: true,
  style: true,
  tabIndex: true,
  title: true,
  translate: true,
  typeof: true,
  value: true,
  vocab: true,
  width: true,
  'aria-activedescendant': true,
  'aria-atomic': true,
  'aria-autocomplete': true,
  'aria-busy': true,
  'aria-checked': true,
  'aria-colcount': true,
  'aria-colindex': true,
  'aria-colspan': true,
  'aria-controls': true,
  'aria-current': true,
  'aria-describedby': true,
  'aria-description': true,
  'aria-details': true,
  'aria-disabled': true,
  'aria-errormessage': true,
  'aria-expanded': true,
  'aria-flowto': true,
  'aria-haspopup': true,
  'aria-hidden': true,
  'aria-invalid': true,
  'aria-keyshortcuts': true,
  'aria-label': true,
  'aria-labelledby': true,
  'aria-level': true,
  'aria-live': true,
  'aria-modal': true,
  'aria-multiline': true,
  'aria-multiselectable': true,
  'aria-orientation': true,
  'aria-owns': true,
  'aria-placeholder': true,
  'aria-posinset': true,
  'aria-pressed': true,
  'aria-readonly': true,
  'aria-relevant': true,
  'aria-required': true,
  'aria-roledescription': true,
  'aria-rowcount': true,
  'aria-rowindex': true,
  'aria-rowspan': true,
  'aria-selected': true,
  'aria-setsize': true,
  'aria-sort': true,
  'aria-valuemax': true,
  'aria-valuemin': true,
  'aria-valuenow': true,
  'aria-valuetext': true,
} as const;

/** Type representing a safe input attribute key */
export type SafeInputAttribute = keyof typeof SAFE_INPUT_ATTRIBUTES;

/** Array of safe input attribute keys for iteration */
const SAFE_INPUT_ATTRIBUTE_KEYS = Object.keys(SAFE_INPUT_ATTRIBUTES) as SafeInputAttribute[];

export type SafeInputProps = Partial<Record<SafeInputAttribute, unknown>>;

/**
 * Filters props to only include safe HTML attributes.
 * Blocks dangerous event handlers (onClick, onLoad, onError, etc.) and other
 * potentially unsafe attributes.
 *
 * @param props - The props object to filter
 * @returns A new object containing only safe attributes
 *
 * @example
 * const inputProps = getSafeInputProps({
 *   id: 'email',
 *   name: 'email',
 *   onClick: handleClick,     // blocked - event handler
 *   onError: handleError,     // blocked - event handler
 *   'aria-label': 'Email',
 * });
 * // Result: { id: 'email', name: 'email', 'aria-label': 'Email' }
 */
/** Keys that must never be accessed dynamically (prototype pollution prevention) */
const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/** Pattern for safe data-* attributes */
const DATA_ATTR_PATTERN = /^data-[a-z][a-z0-9-]*$/;

export function getSafeInputProps(props: Record<string, unknown>): SafeInputProps {
  const safeEntries: Array<[string, unknown]> = [];

  // Pass through whitelisted attributes
  for (const safeKey of SAFE_INPUT_ATTRIBUTE_KEYS) {
    const descriptor = Object.getOwnPropertyDescriptor(props, safeKey);
    if (descriptor) {
      safeEntries.push([safeKey, descriptor.value]);
    }
  }

  // Pass through data-* attributes (e.g., data-testid, data-cy)
  for (const key of Object.keys(props)) {
    if (BLOCKED_KEYS.has(key)) {continue;}
    if (DATA_ATTR_PATTERN.test(key)) {
      safeEntries.push([key, Reflect.get(props, key)]);
    }
  }

  return Object.fromEntries(safeEntries) as SafeInputProps;
}

export default getSafeInputProps;
