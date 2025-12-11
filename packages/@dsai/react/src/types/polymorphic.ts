/**
 * Polymorphic Component Types
 *
 * Type definitions for components that support the 'as' prop pattern.
 * Allows components to render as different HTML elements while maintaining type safety.
 *
 * Inspired by Material UI's OverridableComponent pattern.
 *
 * @module @dsai/react/types/polymorphic
 */

import type React from 'react';

/**
 * Polymorphic component props with 'as' prop support
 *
 * Allows components to render as different elements while maintaining type safety.
 * The component inherits all props from the target element type.
 *
 * @template C - React element type (e.g., 'button', 'a', typeof Link)
 * @template Props - Component-specific props
 *
 * @example
 * ```typescript
 * interface ButtonOwnProps {
 *   variant?: 'primary' | 'secondary';
 *   size?: ComponentSize;
 * }
 *
 * type ButtonProps<C extends React.ElementType = 'button'> =
 *   PolymorphicComponentProps<C, ButtonOwnProps>;
 *
 * // Usage:
 * <Button variant="primary">Regular button</Button>
 * <Button as="a" href="/link">Link button</Button>
 * <Button as={RouterLink} to="/route">Router link</Button>
 * ```
 */
export type PolymorphicComponentProps<
  C extends React.ElementType,
  Props = Record<string, never>,
> = Props &
  Omit<React.ComponentPropsWithRef<C>, keyof Props> & {
    /**
     * Element type to render as
     * @default 'div' or component's default element
     */
    as?: C;
  };

/**
 * Extract props from polymorphic component
 *
 * Utility type for working with polymorphic component props.
 *
 * @template C - React element type
 * @template Props - Component-specific props
 *
 * @example
 * ```typescript
 * type LinkButtonProps = PolymorphicProps<'a', ButtonOwnProps>;
 * ```
 */
export type PolymorphicProps<C extends React.ElementType, Props> = PolymorphicComponentProps<
  C,
  Props
>;

/**
 * Polymorphic ref type
 *
 * Correct ref type for polymorphic components.
 *
 * @template C - React element type
 *
 * @example
 * ```typescript
 * const Button = React.forwardRef(
 *   <C extends React.ElementType = 'button'>(
 *     props: ButtonProps<C>,
 *     ref: PolymorphicRef<C>
 *   ) => {
 *     // Component implementation
 *   }
 * );
 * ```
 */
export type PolymorphicRef<C extends React.ElementType> = React.ComponentPropsWithRef<C>['ref'];
