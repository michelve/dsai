import type { ComponentPropsWithRef, ElementType } from 'react';
import type { JSX } from 'react/jsx-runtime';

/**
 * Props for polymorphic components.
 *
 * Allows components to render as different HTML elements or components
 * while maintaining type safety for props.
 */
export type PolymorphicProps<E extends ElementType, P = object> = P & {
  /** Element type to render as */
  as?: E;
} & Omit<ComponentPropsWithRef<E>, keyof P | 'as'>;

/**
 * Polymorphic component type.
 */
export type PolymorphicComponent<DefaultElement extends ElementType, P = object> = <
  E extends ElementType = DefaultElement,
>(
  props: PolymorphicProps<E, P>
) => JSX.Element | null;

/**
 * Creates a polymorphic component that can render as different elements.
 *
 * This enables the "as" prop pattern popularized by libraries like
 * Chakra UI and Radix UI, allowing components to be flexible while
 * maintaining full type safety.
 *
 * **Key Features**:
 * - Type-safe "as" prop
 * - Preserves element-specific props
 * - Automatic ref forwarding
 * - Display name support
 *
 * @param defaultElement - Default element to render
 * @param displayName - Component display name
 * @returns Polymorphic component factory
 *
 * @example
 * ```tsx
 * // Create a polymorphic Text component
 * interface TextProps {
 *   variant?: 'body' | 'heading' | 'caption';
 *   weight?: 'normal' | 'bold';
 * }
 *
 * const Text = createPolymorphic<'span', TextProps>('span', 'Text')(
 *   ({ as: Element = 'span', variant = 'body', weight = 'normal', ...props }) => {
 *     return (
 *       <Element
 *         {...props}
 *         className={cn(
 *           'text',
 *           `text-${variant}`,
 *           `text-${weight}`,
 *           props.className
 *         )}
 *       />
 *     );
 *   }
 * );
 *
 * // Usage with different elements
 * <Text>Default span</Text>
 * <Text as="p">Paragraph</Text>
 * <Text as="h1" variant="heading">Heading</Text>
 * <Text as="a" href="/link">Link with href prop!</Text>
 * ```
 *
 * @example
 * ```tsx
 * // Polymorphic Button
 * interface ButtonProps {
 *   variant?: 'primary' | 'secondary';
 *   size?: 'sm' | 'md' | 'lg';
 * }
 *
 * const Button = createPolymorphic<'button', ButtonProps>('button', 'Button')(
 *   ({ as: Element = 'button', variant = 'primary', size = 'md', ...props }) => {
 *     return (
 *       <Element
 *         {...props}
 *         className={cn('btn', `btn-${variant}`, `btn-${size}`, props.className)}
 *       />
 *     );
 *   }
 * );
 *
 * // Can render as button or link
 * <Button onClick={handleClick}>Button</Button>
 * <Button as="a" href="/path">Link Button</Button>
 * ```
 */
export function createPolymorphic<DefaultElement extends ElementType, P = object>(
  _defaultElement: DefaultElement,
  displayName?: string
) {
  return function createComponent(
    render: (props: PolymorphicProps<DefaultElement, P>) => JSX.Element | null
  ): PolymorphicComponent<DefaultElement, P> {
    const Component = render as PolymorphicComponent<DefaultElement, P> & {
      displayName?: string;
    };

    if (displayName) {
      Component.displayName = displayName;
    }

    return Component;
  };
}
