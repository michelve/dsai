/**
 * Type Tests for DSAi Types Module
 *
 * These tests use @ts-expect-error to verify type constraints.
 * The tests pass if TypeScript correctly rejects invalid types.
 *
 * @module @dsai/react/types/types.test
 */

import { getResponsiveValue, isResponsiveValue } from './index';

import type { CSSProperties } from 'react';
import type {
  ARIAProps,
  Breakpoint,
  ComponentSize,
  ExtendedSize,
  FSMConfig,
  FSMEventBase,
  FSMReducer,
  FSMStateBase,
  PolymorphicComponentProps,
  ResponsiveProp,
  ResponsiveValue,
  SafeHTMLAttributes,
  SemanticColorVariant,
  VisualStateBase,
} from './index';

// =============================================================================
// SafeHTMLAttributes Tests
// =============================================================================

describe('SafeHTMLAttributes type constraints', () => {
  it('should allow valid safe attributes', () => {
    // These should all compile without errors
    const validAttrs: SafeHTMLAttributes<HTMLDivElement> = {
      className: 'test-class',
      style: { color: 'red' } as CSSProperties,
      id: 'test-id',
      tabIndex: 0,
      role: 'button',
      'aria-label': 'Test label',
      'aria-labelledby': 'label-id',
      'aria-describedby': 'desc-id',
      'aria-hidden': true,
      'aria-expanded': false,
      'aria-selected': true,
      'aria-checked': 'mixed',
      'aria-disabled': false,
      'aria-pressed': true,
      'aria-current': 'page',
      'aria-controls': 'panel-id',
      'aria-owns': 'owned-id',
      'aria-activedescendant': 'active-id',
      'aria-live': 'polite',
      'aria-atomic': true,
      'data-testid': 'test',
      'data-custom': 'value',
      'data-visual-state': 'idle',
    };

    expect(validAttrs).toBeDefined();
  });

  it('should reject dangerous event handlers', () => {
    // @ts-expect-error - onLoad is not in SafeHTMLAttributes (XSS vector)
    const withOnLoad: SafeHTMLAttributes<HTMLDivElement> = { onLoad: () => {} };

    // @ts-expect-error - onError is not in SafeHTMLAttributes (XSS vector)
    const withOnError: SafeHTMLAttributes<HTMLDivElement> = { onError: () => {} };

    // @ts-expect-error - onClick is not in SafeHTMLAttributes (use dedicated handlers)
    const withOnClick: SafeHTMLAttributes<HTMLDivElement> = { onClick: () => {} };

    // @ts-expect-error - onMouseOver is not in SafeHTMLAttributes
    const withOnMouseOver: SafeHTMLAttributes<HTMLDivElement> = { onMouseOver: () => {} };

    // @ts-expect-error - onFocus is not in SafeHTMLAttributes
    const withOnFocus: SafeHTMLAttributes<HTMLDivElement> = { onFocus: () => {} };

    // Suppress unused variable warnings
    void withOnLoad;
    void withOnError;
    void withOnClick;
    void withOnMouseOver;
    void withOnFocus;
  });

  it('should reject href and src attributes', () => {
    // @ts-expect-error - href is not in SafeHTMLAttributes (handled separately with URL validation)
    const withHref: SafeHTMLAttributes<HTMLAnchorElement> = { href: 'javascript:alert(1)' };

    // @ts-expect-error - src is not in SafeHTMLAttributes (handled separately)
    const withSrc: SafeHTMLAttributes<HTMLImageElement> = { src: 'data:image/svg+xml,...' };

    void withHref;
    void withSrc;
  });
});

// =============================================================================
// ARIAProps Tests
// =============================================================================

describe('ARIAProps type constraints', () => {
  it('should allow valid ARIA properties', () => {
    const validAria: ARIAProps = {
      role: 'dialog',
      'aria-label': 'Modal dialog',
      'aria-labelledby': 'modal-title',
      'aria-describedby': 'modal-desc',
      'aria-expanded': true,
      'aria-selected': false,
      'aria-checked': 'mixed',
      'aria-disabled': true,
      'aria-hidden': false,
      'aria-controls': 'panel',
      'aria-haspopup': 'menu',
      'aria-live': 'assertive',
    };

    expect(validAria).toBeDefined();
  });
});

// =============================================================================
// Primitive Types Tests
// =============================================================================

describe('Primitive type constraints', () => {
  it('should accept valid SemanticColorVariant values', () => {
    const variants: SemanticColorVariant[] = [
      'primary',
      'secondary',
      'success',
      'danger',
      'warning',
      'info',
      'light',
      'dark',
    ];

    expect(variants).toHaveLength(8);
  });

  it('should reject invalid SemanticColorVariant values', () => {
    // @ts-expect-error - 'invalid' is not a valid SemanticColorVariant
    const invalid: SemanticColorVariant = 'invalid';

    // @ts-expect-error - 'error' should be 'danger' not 'error'
    const errorVariant: SemanticColorVariant = 'error';

    void invalid;
    void errorVariant;
  });

  it('should accept valid ComponentSize values', () => {
    const sizes: ComponentSize[] = ['sm', 'md', 'lg'];
    expect(sizes).toHaveLength(3);
  });

  it('should reject invalid ComponentSize values', () => {
    // @ts-expect-error - 'xs' is not a ComponentSize (it's ExtendedSize)
    const xs: ComponentSize = 'xs';

    // @ts-expect-error - 'xl' is not a ComponentSize (it's ExtendedSize)
    const xl: ComponentSize = 'xl';

    void xs;
    void xl;
  });

  it('should accept valid ExtendedSize values', () => {
    const sizes: ExtendedSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'xxl'];
    expect(sizes).toHaveLength(7);
  });
});

// =============================================================================
// FSM Types Tests
// =============================================================================

describe('FSM type constraints', () => {
  it('should allow status in FSMStateBase', () => {
    interface ValidState extends FSMStateBase {
      status: 'idle' | 'loading';
      count: number;
    }

    const state: ValidState = { status: 'idle', count: 0 };
    expect(state.status).toBe('idle');
  });

  it('should require type in FSMEventBase', () => {
    interface ValidEvent extends FSMEventBase {
      type: 'INCREMENT' | 'DECREMENT';
      payload?: number;
    }

    const event: ValidEvent = { type: 'INCREMENT', payload: 1 };
    expect(event.type).toBe('INCREMENT');
  });

  it('should enforce reducer signature', () => {
    interface CounterState extends FSMStateBase {
      status: 'idle';
      count: number;
    }

    interface CounterEvent extends FSMEventBase {
      type: 'INCREMENT' | 'DECREMENT';
    }

    const reducer: FSMReducer<CounterState, CounterEvent> = (state, event) => {
      switch (event.type) {
        case 'INCREMENT':
          return { ...state, count: state.count + 1 };
        case 'DECREMENT':
          return { ...state, count: state.count - 1 };
        default:
          return state;
      }
    };

    const result = reducer({ status: 'idle', count: 0 }, { type: 'INCREMENT' });
    expect(result.count).toBe(1);
  });

  it('should validate FSMConfig structure', () => {
    interface TestState extends FSMStateBase {
      status: 'idle' | 'active';
      value: string;
    }

    interface TestEvent extends FSMEventBase {
      type: 'UPDATE';
      value: string;
    }

    const config: FSMConfig<TestState, TestEvent> = {
      initialState: { status: 'idle', value: '' },
      reducer: (state, event) => ({ ...state, value: event.value }),
    };

    expect(config.initialState).toBeDefined();
  });

  it('should accept valid VisualStateBase structure', () => {
    const visualState: VisualStateBase = {
      state: 'idle',
      shouldRender: true,
      modifiers: ['active'],
    };

    expect(visualState.state).toBe('idle');
    expect(visualState.shouldRender).toBe(true);
  });
});

// =============================================================================
// Responsive Types Tests
// =============================================================================

describe('Responsive type constraints', () => {
  it('should accept valid Breakpoint values', () => {
    const breakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
    expect(breakpoints).toHaveLength(6);
  });

  it('should reject invalid Breakpoint values', () => {
    // @ts-expect-error - 'mobile' is not a valid Breakpoint
    const mobile: Breakpoint = 'mobile';

    // @ts-expect-error - 'tablet' is not a valid Breakpoint
    const tablet: Breakpoint = 'tablet';

    void mobile;
    void tablet;
  });

  it('should accept single value as ResponsiveValue', () => {
    const value: ResponsiveValue<number> = 42;
    expect(value).toBe(42);
  });

  it('should accept responsive object as ResponsiveValue', () => {
    const value: ResponsiveValue<number> = { xs: 1, md: 2, lg: 3 };
    expect(value).toEqual({ xs: 1, md: 2, lg: 3 });
  });

  it('should extract value for breakpoint', () => {
    const responsive: ResponsiveValue<number> = { xs: 1, md: 2, lg: 3 };

    expect(getResponsiveValue(responsive, 'xs')).toBe(1);
    expect(getResponsiveValue(responsive, 'md')).toBe(2);
    expect(getResponsiveValue(responsive, 'lg')).toBe(3);
    expect(getResponsiveValue(responsive, 'sm')).toBe(1); // Falls back to xs
  });

  it('should return single value for non-responsive', () => {
    const single: ResponsiveValue<number> = 42;
    expect(getResponsiveValue(single, 'lg')).toBe(42);
  });

  it('should detect responsive values with type guard', () => {
    const responsive: ResponsiveValue<number> = { xs: 1, md: 2 };
    const single: ResponsiveValue<number> = 42;

    expect(isResponsiveValue(responsive)).toBe(true);
    expect(isResponsiveValue(single)).toBe(false);
  });

  it('should work with ResponsiveProp alias', () => {
    const prop: ResponsiveProp<string> = { xs: 'small', lg: 'large' };
    expect(isResponsiveValue(prop)).toBe(true);
  });
});

// =============================================================================
// Polymorphic Types Tests
// =============================================================================

describe('Polymorphic type constraints', () => {
  it('should accept component props with as prop', () => {
    interface ButtonOwnProps {
      variant?: 'primary' | 'secondary';
    }

    type ButtonProps = PolymorphicComponentProps<'button', ButtonOwnProps>;

    const props: ButtonProps = {
      variant: 'primary',
      type: 'submit', // Valid for button element
    };

    expect(props.variant).toBe('primary');
  });

  it('should accept anchor element props when as="a"', () => {
    interface LinkOwnProps {
      variant?: 'primary' | 'secondary';
    }

    type LinkProps = PolymorphicComponentProps<'a', LinkOwnProps>;

    const props: LinkProps = {
      as: 'a',
      variant: 'primary',
      href: '/path', // Valid for anchor element
      target: '_blank',
    };

    expect(props.href).toBe('/path');
  });
});
