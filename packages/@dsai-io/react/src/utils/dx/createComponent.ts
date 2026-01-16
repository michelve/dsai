/** @jsxRuntime classic */
/** @jsx React.createElement */
import React, { type ComponentType } from 'react';

import type { JSX } from 'react/jsx-runtime';

/**
 * Options for creating a component with defaults.
 */
export interface CreateComponentOptions<P> {
  /** Component to wrap */
  component: ComponentType<P>;
  /** Default props to apply */
  defaultProps: Partial<P>;
  /** Display name for the wrapped component */
  displayName?: string;
}

/**
 * Creates a component with default props applied.
 *
 * This is useful for creating variants of components with preset
 * configurations while maintaining full type safety.
 *
 * **Key Features**:
 * - Type-safe default props
 * - Preserves component types
 * - Custom display names
 * - Shallow merge of props
 *
 * @param options - Component configuration
 * @returns Component with defaults applied
 *
 * @example
 * ```tsx
 * // Create button variants
 * import { Button } from './Button';
 *
 * export const PrimaryButton = createComponent({
 *   component: Button,
 *   defaultProps: {
 *     variant: 'primary',
 *     size: 'medium',
 *   },
 *   displayName: 'PrimaryButton',
 * });
 *
 * export const SecondaryButton = createComponent({
 *   component: Button,
 *   defaultProps: {
 *     variant: 'secondary',
 *     size: 'medium',
 *   },
 *   displayName: 'SecondaryButton',
 * });
 *
 * // Usage
 * <PrimaryButton onClick={handleClick}>Click me</PrimaryButton>
 * ```
 *
 * @example
 * ```tsx
 * // Create styled input
 * const EmailInput = createComponent({
 *   component: Input,
 *   defaultProps: {
 *     type: 'email',
 *     autoComplete: 'email',
 *     placeholder: 'Enter your email',
 *   },
 *   displayName: 'EmailInput',
 * });
 * ```
 */
export function createComponent<P extends object>({
  component: Component,
  defaultProps,
  displayName,
}: CreateComponentOptions<P>): ComponentType<P> {
  const WrappedComponent = (props: P): JSX.Element => {
    // Merge default props with provided props (provided props take precedence)
    const mergedProps = { ...defaultProps, ...props } as P;
    return React.createElement(Component, mergedProps);
  };

  // Set display name for debugging
  WrappedComponent.displayName =
    displayName || `WithDefaults(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}
