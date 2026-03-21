/**
 * Avatar Context
 *
 * Shares avatar state (size, shape, tone, image status) with compound
 * sub-components. Follows the Accordion context pattern.
 *
 * @packageDocumentation
 */

import { createContext, useContext } from 'react';

import type { AvatarContextValue } from './Avatar.types';

const AvatarContext = createContext<AvatarContextValue | null>(null);

/**
 * Hook to access avatar context from compound sub-components.
 * Throws if used outside an Avatar component.
 */
export function useAvatarContext(): AvatarContextValue {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error('Avatar compound components must be used within an Avatar component');
  }
  return context;
}

export { AvatarContext };
