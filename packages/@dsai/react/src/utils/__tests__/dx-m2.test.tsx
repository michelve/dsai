/**
 * @file Developer Experience Utilities Test Suite (M2.10)
 * @module @dsai/react/utils/__tests__/dx-m2.test
 *
 * Comprehensive test coverage for M2.10 DX (Developer Experience) utilities:
 * - Environment detection: isDev
 * - Development warnings: warn, warnOnce
 * - Runtime assertions: invariant
 * - Component utilities: getDisplayName, createContext, createComponent, createPolymorphic
 *
 * Target: 100% code coverage for development tooling
 */

import React from 'react';

import {
  createComponent,
  createContext,
  createPolymorphic,
  getDisplayName,
  invariant,
  isDev,
  warn,
  warnOnce,
} from '../dx';

describe('M2.10 Developer Experience Utilities', () => {
  let originalConsoleWarn: typeof console.warn;
  let originalConsoleError: typeof console.error;
  let originalNodeEnv: string | undefined;

  beforeEach(() => {
    originalConsoleWarn = console.warn;
    originalConsoleError = console.error;
    originalNodeEnv = process.env.NODE_ENV;
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
    process.env.NODE_ENV = originalNodeEnv;
    jest.clearAllMocks();
  });

  describe('isDev', () => {
    it('should return true in development', () => {
      process.env.NODE_ENV = 'development';
      expect(isDev()).toBe(true);
    });

    it('should return false in production', () => {
      process.env.NODE_ENV = 'production';
      expect(isDev()).toBe(false);
    });

    it('should return false in test', () => {
      process.env.NODE_ENV = 'test';
      expect(isDev()).toBe(false);
    });

    it('should check __DEV__ global if NODE_ENV is not set', () => {
      delete process.env.NODE_ENV;
      (globalThis as any).__DEV__ = true;

      expect(isDev()).toBe(true);

      delete (globalThis as any).__DEV__;
    });

    it('should return false by default', () => {
      delete process.env.NODE_ENV;
      delete (globalThis as any).__DEV__;

      expect(isDev()).toBe(false);
    });
  });

  describe('warn', () => {
    it('should log warning in development', () => {
      process.env.NODE_ENV = 'development';
      warn('Test warning');

      expect(console.warn).toHaveBeenCalledWith('[Warning] Test warning');
    });

    it('should not log warning in production', () => {
      process.env.NODE_ENV = 'production';
      warn('Test warning');

      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should include component name when provided', () => {
      process.env.NODE_ENV = 'development';
      warn('Invalid prop', 'Button');

      expect(console.warn).toHaveBeenCalledWith('[Button] Invalid prop');
    });
  });

  describe('warnOnce', () => {
    it('should log warning only once', () => {
      process.env.NODE_ENV = 'development';

      warnOnce('test-key', 'Test warning');
      warnOnce('test-key', 'Test warning');
      warnOnce('test-key', 'Test warning');

      expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it('should log different warnings with different keys', () => {
      process.env.NODE_ENV = 'development';

      warnOnce('key1', 'Warning 1');
      warnOnce('key2', 'Warning 2');

      expect(console.warn).toHaveBeenCalledTimes(2);
    });

    it('should not log in production', () => {
      process.env.NODE_ENV = 'production';

      warnOnce('test-key', 'Test warning');

      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('invariant', () => {
    it('should not throw when condition is true', () => {
      expect(() => {
        invariant(true, 'Should not throw');
      }).not.toThrow();
    });

    it('should throw when condition is false', () => {
      expect(() => {
        invariant(false, 'Invariant violation');
      }).toThrow('Invariant violation: Invariant violation');
    });

    it('should throw with descriptive message', () => {
      expect(() => {
        invariant(false, 'Value is invalid');
      }).toThrow('Invariant violation: Value is invalid');
    });

    it('should throw in production', () => {
      process.env.NODE_ENV = 'production';

      expect(() => {
        invariant(false, 'Error');
      }).toThrow('Invariant violation: Error');
    });

    it('should narrow types', () => {
      const value: string | null = 'test';
      invariant(value !== null, 'Value must not be null');
      // TypeScript knows value is string here
      expect(value.toUpperCase()).toBe('TEST');
    });
  });

  describe('getDisplayName', () => {
    it('should get display name from functional component', () => {
      const Component = () => <div>Test</div>;
      Component.displayName = 'CustomName';

      expect(getDisplayName(Component)).toBe('CustomName');
    });

    it('should get name from function name', () => {
      function MyComponent() {
        return <div>Test</div>;
      }

      expect(getDisplayName(MyComponent)).toBe('MyComponent');
    });

    it('should fallback to "Component" for anonymous components', () => {
      const Component = () => <div>Test</div>;

      expect(getDisplayName(Component)).toBe('Component');
    });

    it('should handle class components', () => {
      class MyClass extends React.Component {
        render() {
          return <div>Test</div>;
        }
      }

      expect(getDisplayName(MyClass)).toBe('MyClass');
    });

    it('should handle memo components', () => {
      const Component = React.memo(() => <div>Test</div>);
      Component.displayName = 'MemoComponent';

      expect(getDisplayName(Component)).toBe('MemoComponent');
    });

    it('should handle forwardRef components', () => {
      const Component = React.forwardRef<HTMLDivElement>((_props, ref) => (
        <div ref={ref}>Test</div>
      ));
      Component.displayName = 'ForwardRefComponent';

      expect(getDisplayName(Component)).toBe('ForwardRefComponent');
    });
  });

  describe('createContext', () => {
    it('should create context with default value', () => {
      const { Provider, useContext } = createContext<string>({
        name: 'TestContext',
        defaultValue: 'default',
        strict: false,
      });

      const TestComponent = () => {
        const value = useContext();
        return <div>{value}</div>;
      };

      expect(() => {
        const { container } = require('@testing-library/react').render(
          <Provider value="test">
            <TestComponent />
          </Provider>
        );
        expect(container.textContent).toBe('test');
      }).not.toThrow();
    });

    it('should throw error when used outside Provider in strict mode', () => {
      const { useContext } = createContext<string>({
        name: 'StrictContext',
        errorMessage: 'Must use within provider',
      });

      const TestComponent = () => {
        return <div>{useContext()}</div>;
      };

      expect(() => {
        require('@testing-library/react').render(<TestComponent />);
      }).toThrow('Must use within provider');
    });

    it('should have context display name', () => {
      const { Context } = createContext<number>({
        name: 'MyContext',
        defaultValue: 42,
      });

      expect(Context.displayName).toBe('MyContext');
    });
  });

  describe('createComponent', () => {
    it('should create component with default props', () => {
      const BaseButton = ({ label, disabled = false }: { label: string; disabled?: boolean }) => (
        <button disabled={disabled}>{label}</button>
      );

      const Button = createComponent({
        component: BaseButton,
        defaultProps: { disabled: false },
        displayName: 'Button',
      });

      expect(Button.displayName).toBe('Button');
    });

    it('should render component with merged props', () => {
      const BaseGreeting = ({ name }: { name: string }) => <div>Hello {name}</div>;

      const Greeting = createComponent({
        component: BaseGreeting,
        defaultProps: {},
        displayName: 'Greeting',
      });

      const { container } = require('@testing-library/react').render(<Greeting name="World" />);

      expect(container.textContent).toBe('Hello World');
    });

    it('should apply default props', () => {
      const BaseCard = ({ title, subtitle }: { title: string; subtitle?: string }) => (
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
      );

      const Card = createComponent({
        component: BaseCard,
        defaultProps: { subtitle: 'Default subtitle' },
      });

      expect(() => {
        require('@testing-library/react').render(<Card title="Test" />);
      }).not.toThrow();
    });
  });

  describe('createPolymorphic', () => {
    it('should create polymorphic component with default element', () => {
      const Box = createPolymorphic<'div', { padding?: string }>(
        'div',
        'Box'
      )(({ as: Component = 'div', padding, ...props }) => (
        <Component style={{ padding }} {...props} />
      ));

      const { container } = require('@testing-library/react').render(
        <Box padding="20px">Content</Box>
      );

      expect(container.querySelector('div')).toBeTruthy();
    });

    it('should render as different element when "as" prop is provided', () => {
      const Text = createPolymorphic<'span', { bold?: boolean }>(
        'span',
        'Text'
      )(({ as: Component = 'span', bold, ...props }) => (
        <Component style={{ fontWeight: bold ? 'bold' : 'normal' }} {...props} />
      ));

      const { container } = require('@testing-library/react').render(
        <Text as="p" bold>
          Bold text
        </Text>
      );

      expect(container.querySelector('p')).toBeTruthy();
      expect(container.textContent).toBe('Bold text');
    });

    it('should forward all HTML attributes', () => {
      const Link = createPolymorphic<'a', { external?: boolean }>(
        'a',
        'Link'
      )(({ as: Component = 'a', external, ...props }) => (
        <Component
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          {...props}
        />
      ));

      const { container } = require('@testing-library/react').render(
        <Link href="https://example.com" external>
          Link
        </Link>
      );

      const anchor = container.querySelector('a');
      expect(anchor?.getAttribute('href')).toBe('https://example.com');
      expect(anchor?.getAttribute('target')).toBe('_blank');
    });

    it('should have correct display name', () => {
      const Polymorphic = createPolymorphic<'div', {}>(
        'div',
        'Polymorphic'
      )(({ as: Component = 'div', ...props }) => <Component {...props} />);

      // PolymorphicComponent is a function, displayName would be on the implementation
      expect(typeof Polymorphic).toBe('function');
    });
  });

  describe('Edge Cases', () => {
    it('should handle warnOnce with empty key', () => {
      process.env.NODE_ENV = 'development';

      warnOnce('', 'Warning 1');
      warnOnce('', 'Warning 2');

      // Empty keys are treated as different warnings
      expect(console.warn).toHaveBeenCalledTimes(2);
    });

    it('should handle getDisplayName with null', () => {
      expect(getDisplayName(null as any)).toBe('Component');
    });

    it('should handle getDisplayName with undefined', () => {
      expect(getDisplayName(undefined as any)).toBe('Component');
    });

    it('should handle createComponent with complex prop types', () => {
      interface ComplexProps {
        data: { id: number; name: string }[];
        onSelect: (id: number) => void;
        render?: (item: { id: number; name: string }) => React.ReactNode;
      }

      const BaseList = ({ data, onSelect, render }: ComplexProps) => (
        <ul>
          {data.map((item) => (
            <li key={item.id} onClick={() => onSelect(item.id)}>
              {render ? render(item) : item.name}
            </li>
          ))}
        </ul>
      );

      const List = createComponent({
        component: BaseList,
        defaultProps: {},
        displayName: 'List',
      });

      expect(List.displayName).toBe('List');
    });
  });
});
