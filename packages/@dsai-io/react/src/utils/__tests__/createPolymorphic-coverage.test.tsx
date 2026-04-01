/**
 * createPolymorphic Coverage Tests
 *
 * Tests branch paths: with/without displayName, component rendering.
 */

import { render, screen } from '@testing-library/react';

import { createPolymorphic } from '../dx/createPolymorphic';

import type { PolymorphicProps } from '../dx/createPolymorphic';

describe('createPolymorphic', () => {
  describe('With displayName', () => {
    it('sets displayName on the component', () => {
      const TestComponent = createPolymorphic<'span', object>(
        'span',
        'TestComponent'
      )(({ as: Element = 'span', ...props }: PolymorphicProps<'span'>) => (
        <Element {...props} />
      ));

      expect((TestComponent as { displayName?: string }).displayName).toBe('TestComponent');
    });
  });

  describe('Without displayName', () => {
    it('does not set displayName when not provided', () => {
      const TestComponent = createPolymorphic<'div', object>(
        'div'
      )(({ as: Element = 'div', ...props }: PolymorphicProps<'div'>) => (
        <Element {...props} />
      ));

      // displayName may be undefined or the function name
      expect((TestComponent as { displayName?: string }).displayName).toBeUndefined();
    });
  });

  describe('Rendering', () => {
    interface TextProps {
      variant?: 'body' | 'heading';
    }

    const Text = createPolymorphic<'span', TextProps>(
      'span',
      'Text'
    )(({ as: Element = 'span', variant = 'body', ...props }: PolymorphicProps<'span', TextProps>) => (
      <Element data-variant={variant} {...props} />
    ));

    it('renders with default element', () => {
      render(<Text data-testid="text">Hello</Text>);
      const el = screen.getByTestId('text');
      expect(el.tagName).toBe('SPAN');
      expect(el).toHaveAttribute('data-variant', 'body');
    });

    it('renders as a different element via "as" prop', () => {
      render(
        <Text as="div" data-testid="text">
          Hello
        </Text>
      );
      expect(screen.getByTestId('text').tagName).toBe('DIV');
    });

    it('passes custom props', () => {
      render(
        <Text variant="heading" data-testid="text">
          Title
        </Text>
      );
      expect(screen.getByTestId('text')).toHaveAttribute('data-variant', 'heading');
    });

    it('renders null when component returns null', () => {
      const NullComponent = createPolymorphic<'div', object>(
        'div',
        'NullComponent'
      )(() => null);

      const { container } = render(<NullComponent />);
      expect(container.innerHTML).toBe('');
    });
  });
});
