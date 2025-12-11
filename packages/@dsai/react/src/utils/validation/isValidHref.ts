/**
 * isValidHref - Validates that a href is safe to use
 *
 * Re-exported from isSafeHref for backwards compatibility.
 * Both functions are identical - use isSafeHref as the canonical name.
 *
 * @deprecated Use isSafeHref instead
 * @see {@link ./isSafeHref.ts}
 */
export {
  isSafeHref as isValidHref,
  type IsSafeHrefOptions as IsValidHrefOptions,
} from './isSafeHref';

import { isSafeHref as _isValidHref } from './isSafeHref';
export default _isValidHref;
