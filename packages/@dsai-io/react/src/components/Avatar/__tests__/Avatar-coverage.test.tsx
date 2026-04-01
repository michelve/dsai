/**
 * Avatar Coverage Tests
 *
 * Supplements Avatar.test.tsx with targeted tests for uncovered branches
 * in AvatarFallback, AvatarImage, AvatarBadge, AvatarContext, AvatarStatus,
 * and avatarUtils.
 */

import { act, render, renderHook, screen } from '@testing-library/react';
import { createRef } from 'react';

import { Avatar } from '../Avatar';
import { AvatarBadge } from '../AvatarBadge';
import { AvatarContext, useAvatarContext } from '../AvatarContext';
import { AvatarFallback } from '../AvatarFallback';
import { AvatarImage } from '../AvatarImage';
import { AvatarStatus } from '../AvatarStatus';
import {
  getInitialsFromName,
  getShapeClass,
  getStatusColor,
  getStatusSize,
  getToneClasses,
  getToneFromName,
  hashString,
  resolveInlineGap,
  resolveOverlap,
  safeLookup,
} from '../avatarUtils';

import type { AvatarContextValue } from '../Avatar.types';

// =============================================================================
// Test Helpers
// =============================================================================

const defaultContextValue: AvatarContextValue = {
  size: 'md',
  shape: 'circle',
  tone: 'neutral',
  imageStatus: 'idle',
};

function renderWithContext(
  ui: React.ReactNode,
  contextValue: AvatarContextValue = defaultContextValue
) {
  return render(
    <AvatarContext.Provider value={contextValue}>{ui}</AvatarContext.Provider>
  );
}

// =============================================================================
// AvatarFallback
// =============================================================================

describe('AvatarFallback', () => {
  describe('delay timer', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('renders immediately when no delayMs is provided', () => {
      renderWithContext(<AvatarFallback>FB</AvatarFallback>);
      expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('FB');
    });

    it('renders immediately when delayMs is 0', () => {
      renderWithContext(<AvatarFallback delayMs={0}>FB</AvatarFallback>);
      expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('FB');
    });

    it('delays rendering when delayMs is positive', () => {
      renderWithContext(<AvatarFallback delayMs={300}>FB</AvatarFallback>);
      expect(screen.queryByTestId('avatar-fallback')).not.toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('FB');
    });

    it('clears timer on unmount', () => {
      const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
      const { unmount } = renderWithContext(
        <AvatarFallback delayMs={500}>FB</AvatarFallback>
      );

      unmount();
      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });

    it('resets delay when delayMs prop changes', () => {
      const { rerender } = render(
        <AvatarContext.Provider value={defaultContextValue}>
          <AvatarFallback delayMs={500}>FB</AvatarFallback>
        </AvatarContext.Provider>
      );

      // Not visible yet
      expect(screen.queryByTestId('avatar-fallback')).not.toBeInTheDocument();

      // Change delayMs to undefined (should show immediately)
      rerender(
        <AvatarContext.Provider value={defaultContextValue}>
          <AvatarFallback>FB</AvatarFallback>
        </AvatarContext.Provider>
      );

      expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('FB');
    });

    it('resets delay when delayMs changes to 0', () => {
      const { rerender } = render(
        <AvatarContext.Provider value={defaultContextValue}>
          <AvatarFallback delayMs={500}>FB</AvatarFallback>
        </AvatarContext.Provider>
      );

      expect(screen.queryByTestId('avatar-fallback')).not.toBeInTheDocument();

      rerender(
        <AvatarContext.Provider value={defaultContextValue}>
          <AvatarFallback delayMs={0}>FB</AvatarFallback>
        </AvatarContext.Provider>
      );

      expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('FB');
    });
  });

  describe('imageStatus gating', () => {
    it('returns null when imageStatus is loaded', () => {
      const loadedContext: AvatarContextValue = {
        ...defaultContextValue,
        imageStatus: 'loaded',
      };
      const { container } = renderWithContext(
        <AvatarFallback>FB</AvatarFallback>,
        loadedContext
      );
      expect(container.innerHTML).toBe('');
    });

    it('renders when imageStatus is error', () => {
      const errorContext: AvatarContextValue = {
        ...defaultContextValue,
        imageStatus: 'error',
      };
      renderWithContext(<AvatarFallback>FB</AvatarFallback>, errorContext);
      expect(screen.getByTestId('avatar-fallback')).toBeInTheDocument();
    });

    it('renders when imageStatus is idle', () => {
      renderWithContext(<AvatarFallback>FB</AvatarFallback>);
      expect(screen.getByTestId('avatar-fallback')).toBeInTheDocument();
    });

    it('renders when imageStatus is loading', () => {
      const loadingContext: AvatarContextValue = {
        ...defaultContextValue,
        imageStatus: 'loading',
      };
      renderWithContext(<AvatarFallback>FB</AvatarFallback>, loadingContext);
      expect(screen.getByTestId('avatar-fallback')).toBeInTheDocument();
    });
  });

  describe('props', () => {
    it('applies custom className', () => {
      renderWithContext(
        <AvatarFallback className="custom-fb">FB</AvatarFallback>
      );
      expect(screen.getByTestId('avatar-fallback')).toHaveClass('custom-fb');
    });

    it('applies custom style', () => {
      renderWithContext(
        <AvatarFallback style={{ color: 'red' }}>FB</AvatarFallback>
      );
      expect(screen.getByTestId('avatar-fallback').style.color).toBe('red');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLSpanElement>();
      renderWithContext(<AvatarFallback ref={ref}>FB</AvatarFallback>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });
});

// =============================================================================
// AvatarImage
// =============================================================================

describe('AvatarImage', () => {
  describe('standard img rendering', () => {
    it('renders img element with src and alt', () => {
      renderWithContext(
        <AvatarImage src="/photo.jpg" alt="User photo" />
      );
      const img = screen.getByTestId('avatar-image');
      expect(img.tagName).toBe('IMG');
      expect(img).toHaveAttribute('src', '/photo.jpg');
      expect(img).toHaveAttribute('alt', 'User photo');
    });

    it('defaults alt to empty string when not provided', () => {
      renderWithContext(<AvatarImage src="/photo.jpg" />);
      expect(screen.getByTestId('avatar-image')).toHaveAttribute('alt', '');
    });

    it('passes srcSet and sizes', () => {
      renderWithContext(
        <AvatarImage src="/photo.jpg" srcSet="/photo-2x.jpg 2x" sizes="100px" />
      );
      const img = screen.getByTestId('avatar-image');
      expect(img).toHaveAttribute('srcSet', '/photo-2x.jpg 2x');
      expect(img).toHaveAttribute('sizes', '100px');
    });

    it('passes loading attribute', () => {
      renderWithContext(<AvatarImage src="/photo.jpg" loading="lazy" />);
      expect(screen.getByTestId('avatar-image')).toHaveAttribute('loading', 'lazy');
    });

    it('defaults loading to eager', () => {
      renderWithContext(<AvatarImage src="/photo.jpg" />);
      expect(screen.getByTestId('avatar-image')).toHaveAttribute('loading', 'eager');
    });

    it('passes referrerPolicy', () => {
      renderWithContext(
        <AvatarImage src="/photo.jpg" referrerPolicy="no-referrer" />
      );
      expect(screen.getByTestId('avatar-image')).toHaveAttribute(
        'referrerpolicy',
        'no-referrer'
      );
    });

    it('passes crossOrigin', () => {
      renderWithContext(
        <AvatarImage src="/photo.jpg" crossOrigin="anonymous" />
      );
      expect(screen.getByTestId('avatar-image')).toHaveAttribute(
        'crossorigin',
        'anonymous'
      );
    });

    it('applies className and style', () => {
      renderWithContext(
        <AvatarImage src="/photo.jpg" className="extra" style={{ opacity: 0.5 }} />
      );
      const img = screen.getByTestId('avatar-image');
      expect(img).toHaveClass('extra');
      expect(img).toHaveStyle({ opacity: 0.5 });
    });

    it('applies shape class from context', () => {
      const roundedContext: AvatarContextValue = {
        ...defaultContextValue,
        shape: 'rounded',
      };
      renderWithContext(<AvatarImage src="/photo.jpg" />, roundedContext);
      expect(screen.getByTestId('avatar-image')).toHaveClass('rounded-3');
    });
  });

  describe('custom children rendering', () => {
    it('renders children wrapper instead of img when children provided', () => {
      renderWithContext(
        <AvatarImage>
          <img src="/custom.jpg" alt="Custom" data-testid="custom-img" />
        </AvatarImage>
      );
      expect(screen.queryByTestId('avatar-image')).not.toBeInTheDocument();
      expect(screen.getByTestId('custom-img')).toBeInTheDocument();
    });

    it('applies className and style to wrapper span', () => {
      const { container } = renderWithContext(
        <AvatarImage className="wrap-class" style={{ border: '1px solid red' }}>
          <img src="/custom.jpg" alt="Custom" />
        </AvatarImage>
      );
      const wrapper = container.querySelector('.dsai-avatar__image-wrapper');
      expect(wrapper).toHaveClass('wrap-class');
      expect(wrapper).toHaveStyle({ border: '1px solid red' });
    });
  });

  describe('ref callback', () => {
    it('forwards function ref to img element', () => {
      let imgElement: HTMLImageElement | null = null;
      const refFn = (node: HTMLImageElement | null) => {
        imgElement = node;
      };
      renderWithContext(<AvatarImage ref={refFn} src="/photo.jpg" />);
      expect(imgElement).toBeInstanceOf(HTMLImageElement);
    });

    it('forwards object ref to img element', () => {
      const ref = createRef<HTMLImageElement>();
      renderWithContext(<AvatarImage ref={ref} src="/photo.jpg" />);
      expect(ref.current).toBeInstanceOf(HTMLImageElement);
    });

    it('attaches onLoad event listener via ref', () => {
      const onLoad = jest.fn();
      renderWithContext(<AvatarImage src="/photo.jpg" onLoad={onLoad} />);
      const img = screen.getByTestId('avatar-image');
      // Dispatch a native load event (as the component uses addEventListener)
      img.dispatchEvent(new Event('load'));
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    it('attaches onError event listener via ref', () => {
      const onError = jest.fn();
      renderWithContext(<AvatarImage src="/bad.jpg" onError={onError} />);
      const img = screen.getByTestId('avatar-image');
      img.dispatchEvent(new Event('error'));
      expect(onError).toHaveBeenCalledTimes(1);
    });

    it('handles null node in ref callback gracefully', () => {
      const ref = createRef<HTMLImageElement>();
      const { unmount } = renderWithContext(
        <AvatarImage ref={ref} src="/photo.jpg" />
      );
      // Unmount triggers ref callback with null
      expect(() => unmount()).not.toThrow();
    });
  });
});

// =============================================================================
// AvatarBadge
// =============================================================================

describe('AvatarBadge', () => {
  it('returns null when neither count nor dot is provided', () => {
    const { container } = renderWithContext(<AvatarBadge />);
    expect(container.innerHTML).toBe('');
  });

  it('returns null when dot is explicitly false and no count', () => {
    const { container } = renderWithContext(<AvatarBadge dot={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders count badge with number', () => {
    renderWithContext(<AvatarBadge count={5} />);
    expect(screen.getByTestId('avatar-badge-count')).toHaveTextContent('5');
  });

  it('renders 99+ when count exceeds 99', () => {
    renderWithContext(<AvatarBadge count={100} />);
    expect(screen.getByTestId('avatar-badge-count')).toHaveTextContent('99+');
  });

  it('renders count of 0', () => {
    renderWithContext(<AvatarBadge count={0} />);
    expect(screen.getByTestId('avatar-badge-count')).toHaveTextContent('0');
  });

  it('renders dot badge', () => {
    renderWithContext(<AvatarBadge dot />);
    expect(screen.getByTestId('avatar-badge-dot')).toBeInTheDocument();
  });

  it('count takes priority over dot', () => {
    renderWithContext(<AvatarBadge count={3} dot />);
    expect(screen.getByTestId('avatar-badge-count')).toBeInTheDocument();
    expect(screen.queryByTestId('avatar-badge-dot')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    renderWithContext(<AvatarBadge dot className="my-badge" />);
    expect(screen.getByTestId('avatar-badge-dot')).toHaveClass('my-badge');
  });

  it('applies custom style to count badge', () => {
    renderWithContext(<AvatarBadge count={1} style={{ backgroundColor: 'blue' }} />);
    // The style prop merges with base badge styles; verify the custom property is present
    expect(screen.getByTestId('avatar-badge-count').style.backgroundColor).toBe('blue');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLSpanElement>();
    renderWithContext(<AvatarBadge ref={ref} dot />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('sets aria-hidden on count badge', () => {
    renderWithContext(<AvatarBadge count={5} />);
    expect(screen.getByTestId('avatar-badge-count')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('sets aria-hidden on dot badge', () => {
    renderWithContext(<AvatarBadge dot />);
    expect(screen.getByTestId('avatar-badge-dot')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('throws when used outside Avatar context', () => {
    // Suppress React error boundary console output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<AvatarBadge dot />)).toThrow(
      'Avatar compound components must be used within an Avatar component'
    );
    consoleSpy.mockRestore();
  });
});

// =============================================================================
// AvatarContext
// =============================================================================

describe('AvatarContext', () => {
  it('throws when useAvatarContext is used outside provider', () => {
    const TestConsumer = () => {
      useAvatarContext();
      return null;
    };
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      'Avatar compound components must be used within an Avatar component'
    );
    consoleSpy.mockRestore();
  });

  it('provides context values to consumers', () => {
    const customContext: AvatarContextValue = {
      size: 'lg',
      shape: 'rounded',
      tone: 'brand',
      imageStatus: 'loaded',
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AvatarContext.Provider value={customContext}>
        {children}
      </AvatarContext.Provider>
    );

    const { result } = renderHook(() => useAvatarContext(), { wrapper });

    expect(result.current).toEqual(customContext);
  });

  it('returns updated values when provider value changes', () => {
    let contextValue = defaultContextValue;

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AvatarContext.Provider value={contextValue}>
        {children}
      </AvatarContext.Provider>
    );

    const { result, rerender } = renderHook(() => useAvatarContext(), { wrapper });

    expect(result.current).toEqual(defaultContextValue);

    const updated: AvatarContextValue = {
      size: 'xl',
      shape: 'square',
      tone: 'danger',
      imageStatus: 'error',
    };

    contextValue = updated;
    rerender();

    expect(result.current).toEqual(updated);
  });
});

// =============================================================================
// AvatarStatus
// =============================================================================

describe('AvatarStatus', () => {
  const statuses = ['online', 'busy', 'away', 'offline', 'dnd', 'unknown'] as const;

  statuses.forEach((status) => {
    it(`renders ${status} status with correct data attribute`, () => {
      renderWithContext(<AvatarStatus value={status} />);
      const el = document.querySelector(`[data-status="${status}"]`);
      expect(el).toBeInTheDocument();
    });
  });

  it('positions at bottom-right by default', () => {
    renderWithContext(<AvatarStatus value="online" />);
    const el = document.querySelector('[data-status="online"]');
    expect(el).toHaveClass('end-0');
    expect(el).toHaveClass('bottom-0');
  });

  it('positions at bottom-left when specified', () => {
    renderWithContext(<AvatarStatus value="online" position="bottom-left" />);
    const el = document.querySelector('[data-status="online"]');
    expect(el).toHaveClass('start-0');
    expect(el).toHaveClass('bottom-0');
    expect(el).not.toHaveClass('end-0');
  });

  it('applies transform for bottom-left position', () => {
    renderWithContext(<AvatarStatus value="online" position="bottom-left" />);
    const el = document.querySelector('[data-status="online"]');
    expect(el).toHaveStyle({ transform: 'translate(-25%, 25%)' });
  });

  it('applies transform for bottom-right position', () => {
    renderWithContext(<AvatarStatus value="online" position="bottom-right" />);
    const el = document.querySelector('[data-status="online"]');
    expect(el).toHaveStyle({ transform: 'translate(25%, 25%)' });
  });

  it('applies custom className', () => {
    renderWithContext(<AvatarStatus value="online" className="custom-status" />);
    const el = document.querySelector('[data-status="online"]');
    expect(el).toHaveClass('custom-status');
  });

  it('applies custom style', () => {
    renderWithContext(
      <AvatarStatus value="online" style={{ border: '2px solid green' }} />
    );
    const el = document.querySelector('[data-status="online"]');
    expect(el).toHaveStyle({ border: '2px solid green' });
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLSpanElement>();
    renderWithContext(<AvatarStatus ref={ref} value="online" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('sets aria-hidden', () => {
    renderWithContext(<AvatarStatus value="online" />);
    const el = document.querySelector('[data-status="online"]');
    expect(el).toHaveAttribute('aria-hidden', 'true');
  });

  it('uses size from context for status indicator sizing', () => {
    const lgContext: AvatarContextValue = {
      ...defaultContextValue,
      size: 'lg',
    };
    renderWithContext(<AvatarStatus value="online" />, lgContext);
    const el = document.querySelector('[data-status="online"]');
    // lg status size from AVATAR_STATUS_SIZE_MAP
    expect(el).toHaveStyle({ width: 'var(--dsai-avatar-status-size-lg, 12px)' });
  });

  it('throws when used outside Avatar context', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<AvatarStatus value="online" />)).toThrow(
      'Avatar compound components must be used within an Avatar component'
    );
    consoleSpy.mockRestore();
  });
});

// =============================================================================
// avatarUtils
// =============================================================================

describe('avatarUtils', () => {
  describe('safeLookup', () => {
    const testMap = { a: 1, b: 2 } as const;

    it('returns value for valid key', () => {
      expect(safeLookup(testMap, 'a', 0)).toBe(1);
    });

    it('returns fallback for missing key', () => {
      expect(safeLookup(testMap, 'z', 99)).toBe(99);
    });

    it('blocks __proto__', () => {
      expect(safeLookup(testMap, '__proto__', 99)).toBe(99);
    });

    it('blocks constructor', () => {
      expect(safeLookup(testMap, 'constructor', 99)).toBe(99);
    });

    it('blocks prototype', () => {
      expect(safeLookup(testMap, 'prototype', 99)).toBe(99);
    });
  });

  describe('getInitialsFromName', () => {
    it('returns empty for empty string', () => {
      expect(getInitialsFromName('')).toBe('');
    });

    it('returns empty for whitespace only', () => {
      expect(getInitialsFromName('   ')).toBe('');
    });

    it('returns first two chars for single name', () => {
      expect(getInitialsFromName('Alice')).toBe('AL');
    });

    it('returns first and last initials for two names', () => {
      expect(getInitialsFromName('John Doe')).toBe('JD');
    });

    it('returns first and last initials for multiple names', () => {
      expect(getInitialsFromName('John Michael Doe')).toBe('JD');
    });

    it('handles single character name', () => {
      expect(getInitialsFromName('A')).toBe('A');
    });

    it('handles names with extra whitespace', () => {
      expect(getInitialsFromName('  John   Doe  ')).toBe('JD');
    });

    it('converts to uppercase', () => {
      expect(getInitialsFromName('jane doe')).toBe('JD');
    });

    it('handles unicode characters', () => {
      const result = getInitialsFromName('Jose Garcia');
      expect(result).toBe('JG');
    });

    it('returns empty for non-string input', () => {
       
      expect(getInitialsFromName(null as any)).toBe('');
       
      expect(getInitialsFromName(undefined as any)).toBe('');
    });
  });

  describe('getShapeClass', () => {
    it('returns rounded-circle for circle', () => {
      expect(getShapeClass('circle')).toBe('rounded-circle');
    });

    it('returns rounded-3 for rounded', () => {
      expect(getShapeClass('rounded')).toBe('rounded-3');
    });

    it('returns empty string for square', () => {
      expect(getShapeClass('square')).toBe('');
    });

    it('returns rounded-circle for undefined (default)', () => {
      expect(getShapeClass(undefined)).toBe('rounded-circle');
    });
  });

  describe('hashString', () => {
    it('returns 0 for empty string', () => {
      expect(hashString('')).toBe(0);
    });

    it('returns consistent hash for same input', () => {
      expect(hashString('Alice')).toBe(hashString('Alice'));
    });

    it('returns different hashes for different inputs', () => {
      expect(hashString('Alice')).not.toBe(hashString('Bob'));
    });

    it('returns non-negative number', () => {
      expect(hashString('test')).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getToneFromName', () => {
    it('returns a valid tone', () => {
      const validTones = [
        'neutral',
        'brand',
        'accent',
        'success',
        'warning',
        'danger',
        'info',
        'inverse',
      ];
      expect(validTones).toContain(getToneFromName('Alice'));
    });

    it('returns consistent tone for same name', () => {
      expect(getToneFromName('Alice')).toBe(getToneFromName('Alice'));
    });
  });

  describe('getStatusColor', () => {
    it('returns bg-success for online', () => {
      expect(getStatusColor('online')).toBe('bg-success');
    });

    it('returns bg-danger for busy', () => {
      expect(getStatusColor('busy')).toBe('bg-danger');
    });

    it('returns bg-warning for away', () => {
      expect(getStatusColor('away')).toBe('bg-warning');
    });

    it('returns bg-secondary for offline', () => {
      expect(getStatusColor('offline')).toBe('bg-secondary');
    });

    it('returns bg-danger for dnd', () => {
      expect(getStatusColor('dnd')).toBe('bg-danger');
    });

    it('returns bg-secondary for unknown', () => {
      expect(getStatusColor('unknown')).toBe('bg-secondary');
    });
  });

  describe('getStatusSize', () => {
    it('returns correct size for xs', () => {
      expect(getStatusSize('xs')).toContain('xs');
    });

    it('returns correct size for xxl', () => {
      expect(getStatusSize('xxl')).toContain('xxl');
    });
  });

  describe('getToneClasses', () => {
    it('returns bg and text classes for neutral', () => {
      const result = getToneClasses('neutral');
      expect(result).toEqual({ bg: 'bg-secondary', text: 'text-white' });
    });

    it('returns correct classes for warning (text-dark)', () => {
      const result = getToneClasses('warning');
      expect(result).toEqual({ bg: 'bg-warning', text: 'text-dark' });
    });
  });

  describe('resolveOverlap', () => {
    it('returns value for compact', () => {
      expect(resolveOverlap('compact')).toContain('compact');
    });

    it('returns value for normal', () => {
      expect(resolveOverlap('normal')).toContain('normal');
    });

    it('returns value for loose', () => {
      expect(resolveOverlap('loose')).toContain('loose');
    });
  });

  describe('resolveInlineGap', () => {
    it('returns value for compact', () => {
      expect(resolveInlineGap('compact')).toContain('compact');
    });

    it('returns value for normal', () => {
      expect(resolveInlineGap('normal')).toContain('normal');
    });

    it('returns value for loose', () => {
      expect(resolveInlineGap('loose')).toContain('loose');
    });
  });
});

// =============================================================================
// Compound component integration (direct subcomponent usage)
// =============================================================================

describe('Compound components integration', () => {
  it('Avatar.Fallback with delay inside Avatar compound', () => {
    jest.useFakeTimers();

    render(
      <Avatar name="Test" data-testid="avatar">
        <Avatar.Fallback delayMs={200}>Custom FB</Avatar.Fallback>
      </Avatar>
    );

    // Fallback should not be visible yet (delay not elapsed)
    expect(screen.queryByText('Custom FB')).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByText('Custom FB')).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('Avatar.Image with custom children renders wrapper', () => {
    render(
      <Avatar name="Test" data-testid="avatar">
        <Avatar.Image>
          <img src="/next-image.jpg" alt="Next.js" data-testid="next-img" />
        </Avatar.Image>
      </Avatar>
    );

    expect(screen.getByTestId('next-img')).toBeInTheDocument();
    expect(screen.queryByTestId('avatar-image')).not.toBeInTheDocument();
  });

  it('Avatar.Image with src renders standard img', () => {
    render(
      <Avatar name="Test" data-testid="avatar">
        <Avatar.Image src="/photo.jpg" alt="Photo" />
      </Avatar>
    );

    expect(screen.getByTestId('avatar-image')).toBeInTheDocument();
  });
});
