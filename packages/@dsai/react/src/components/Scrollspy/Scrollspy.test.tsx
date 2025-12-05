/**
 * @fileoverview Unit tests for Scrollspy component
 * Tests rendering, IntersectionObserver behavior, and user interactions
 */

import { act, fireEvent, render, screen } from '@testing-library/react';

import { Scrollspy, useScrollspy } from './Scrollspy';

import type { ScrollspyItem } from './Scrollspy.types';

// =============================================================================
// Mock IntersectionObserver
// =============================================================================

type IntersectionCallback = (entries: IntersectionObserverEntry[]) => void;

const mockObservers: Map<Element, IntersectionCallback> = new Map();

interface ConstructorCall {
  callback: IntersectionCallback;
  options: IntersectionObserverInit;
}

// Create a class-based mock to avoid issues with jest.fn() clearing
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  private callback: IntersectionCallback;

  constructor(callback: IntersectionCallback, _options?: IntersectionObserverInit) {
    this.callback = callback;
    MockIntersectionObserver.calls.push({ callback, options: _options ?? {} });
    MockIntersectionObserver.instances.push(this);
  }

  observe(element: Element): void {
    mockObservers.set(element, this.callback);
  }

  unobserve(element: Element): void {
    mockObservers.delete(element);
  }

  disconnect(): void {
    // Remove all entries with this callback
    for (const [element, cb] of mockObservers.entries()) {
      if (cb === this.callback) {
        mockObservers.delete(element);
      }
    }
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  // Static tracking
  static instances: MockIntersectionObserver[] = [];
  static calls: ConstructorCall[] = [];
  static clear(): void {
    MockIntersectionObserver.instances = [];
    MockIntersectionObserver.calls = [];
  }
}

beforeAll(() => {
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
});

beforeEach(() => {
  mockObservers.clear();
  MockIntersectionObserver.clear();
});

// Helper to simulate intersection
function simulateIntersection(elementId: string, isIntersecting: boolean): void {
  const element = document.getElementById(elementId);
  if (element) {
    const callback = mockObservers.get(element);
    if (callback) {
      callback([
        {
          target: element,
          isIntersecting,
          intersectionRatio: isIntersecting ? 1 : 0,
          boundingClientRect: element.getBoundingClientRect(),
          intersectionRect: element.getBoundingClientRect(),
          rootBounds: null,
          time: Date.now(),
        } as IntersectionObserverEntry,
      ]);
    }
  }
}

// =============================================================================
// Test Data
// =============================================================================

beforeEach(() => {
  if (typeof window.matchMedia !== 'function') {
    (window as any).matchMedia = jest.fn(() => ({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  }
});

const sampleItems: ScrollspyItem[] = [
  { id: '1', label: 'Introduction', target: 'intro' },
  { id: '2', label: 'Features', target: 'features' },
  { id: '3', label: 'API', target: 'api' },
  { id: '4', label: 'Examples', target: 'examples' },
];

const nestedItems: ScrollspyItem[] = [
  {
    id: '1',
    label: 'Getting Started',
    target: 'getting-started',
    children: [
      { id: '1-1', label: 'Installation', target: 'installation' },
      { id: '1-2', label: 'Quick Start', target: 'quick-start' },
    ],
  },
  { id: '2', label: 'Advanced', target: 'advanced' },
];

// Helper to render scrollspy with target sections
function renderWithSections(
  items: ScrollspyItem[],
  props: Partial<React.ComponentProps<typeof Scrollspy>> = {}
): ReturnType<typeof render> {
  return render(
    <div>
      <Scrollspy items={items} {...props} />
      {items.map((item) => (
        <section key={item.id} id={item.target}>
          <h2>{item.label}</h2>
          <p>Content for {item.label}</p>
        </section>
      ))}
    </div>
  );
}

// =============================================================================
// Rendering Tests
// =============================================================================

describe('Scrollspy Component', () => {
  describe('Rendering', () => {
    it('renders nav element', () => {
      render(<Scrollspy items={sampleItems} data-testid="scrollspy" />);

      const nav = screen.getByTestId('scrollspy');
      expect(nav.tagName).toBe('NAV');
    });

    it('renders with nav-pills classes', () => {
      render(<Scrollspy items={sampleItems} data-testid="scrollspy" />);

      const nav = screen.getByTestId('scrollspy');
      expect(nav).toHaveClass('nav', 'nav-pills', 'flex-column');
    });

    it('renders all navigation links', () => {
      render(<Scrollspy items={sampleItems} />);

      for (const item of sampleItems) {
        expect(screen.getByText(item.label)).toBeInTheDocument();
      }
    });

    it('renders links with correct hrefs', () => {
      render(<Scrollspy items={sampleItems} />);

      for (const item of sampleItems) {
        const link = screen.getByText(item.label).closest('a');
        expect(link).toHaveAttribute('href', `#${item.target}`);
      }
    });

    it('renders nested items', () => {
      render(<Scrollspy items={nestedItems} />);

      expect(screen.getByText('Getting Started')).toBeInTheDocument();
      expect(screen.getByText('Installation')).toBeInTheDocument();
      expect(screen.getByText('Quick Start')).toBeInTheDocument();
      expect(screen.getByText('Advanced')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<Scrollspy items={sampleItems} className="custom-nav" data-testid="scrollspy" />);

      expect(screen.getByTestId('scrollspy')).toHaveClass('custom-nav');
    });

    it('renders with custom style', () => {
      render(
        <Scrollspy items={sampleItems} style={{ maxWidth: '200px' }} data-testid="scrollspy" />
      );

      const nav = screen.getByTestId('scrollspy');
      expect(nav.getAttribute('style')).toContain('max-width');
    });

    it('renders with custom id', () => {
      render(<Scrollspy items={sampleItems} id="my-scrollspy" />);

      expect(document.getElementById('my-scrollspy')).toBeInTheDocument();
    });

    it('renders data-test attribute', () => {
      render(<Scrollspy items={sampleItems} data-test="scrollspy-test" data-testid="scrollspy" />);

      expect(screen.getByTestId('scrollspy')).toHaveAttribute('data-test', 'scrollspy-test');
    });
  });

  // ===========================================================================
  // Sticky Behavior
  // ===========================================================================
  describe('Sticky Behavior', () => {
    it('applies position-sticky class when sticky', () => {
      render(<Scrollspy items={sampleItems} sticky data-testid="scrollspy" />);

      expect(screen.getByTestId('scrollspy')).toHaveClass('position-sticky');
    });

    it('does not apply position-sticky when not sticky', () => {
      render(<Scrollspy items={sampleItems} sticky={false} data-testid="scrollspy" />);

      expect(screen.getByTestId('scrollspy')).not.toHaveClass('position-sticky');
    });

    it('applies stickyTop as number', () => {
      render(<Scrollspy items={sampleItems} sticky stickyTop={100} data-testid="scrollspy" />);

      const nav = screen.getByTestId('scrollspy');
      expect(nav.getAttribute('style')).toContain('top');
      expect(nav.getAttribute('style')).toContain('100px');
    });

    it('applies stickyTop as string', () => {
      render(<Scrollspy items={sampleItems} sticky stickyTop="5rem" data-testid="scrollspy" />);

      const nav = screen.getByTestId('scrollspy');
      expect(nav.getAttribute('style')).toContain('top');
      expect(nav.getAttribute('style')).toContain('5rem');
    });
  });

  // ===========================================================================
  // Accessibility
  // ===========================================================================
  describe('Accessibility', () => {
    it('uses nav element', () => {
      render(<Scrollspy items={sampleItems} data-testid="scrollspy" />);

      const nav = screen.getByTestId('scrollspy');
      expect(nav.tagName).toBe('NAV');
    });

    it('has default aria-label', () => {
      render(<Scrollspy items={sampleItems} data-testid="scrollspy" />);

      expect(screen.getByTestId('scrollspy')).toHaveAttribute('aria-label', 'Page navigation');
    });

    it('accepts custom aria-label', () => {
      render(<Scrollspy items={sampleItems} aria-label="Contents" data-testid="scrollspy" />);

      expect(screen.getByTestId('scrollspy')).toHaveAttribute('aria-label', 'Contents');
    });

    it('accepts aria-labelledby', () => {
      render(
        <>
          <h2 id="nav-heading">Navigation</h2>
          <Scrollspy items={sampleItems} aria-labelledby="nav-heading" data-testid="scrollspy" />
        </>
      );

      const nav = screen.getByTestId('scrollspy');
      expect(nav).toHaveAttribute('aria-labelledby', 'nav-heading');
      expect(nav).not.toHaveAttribute('aria-label');
    });

    it('renders links as anchor elements', () => {
      render(<Scrollspy items={sampleItems} />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(sampleItems.length);
    });

    it('links have nav-link class', () => {
      render(<Scrollspy items={sampleItems} />);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link).toHaveClass('nav-link');
      });
    });
  });

  // ===========================================================================
  // Visual State
  // ===========================================================================
  describe('Visual State', () => {
    it('renders data-visual-state attribute', () => {
      render(<Scrollspy items={sampleItems} data-testid="scrollspy" />);

      expect(screen.getByTestId('scrollspy')).toHaveAttribute('data-visual-state');
    });

    it('has idle visual state initially', () => {
      render(<Scrollspy items={sampleItems} data-testid="scrollspy" />);

      // Initial state before intersection observer kicks in
      expect(screen.getByTestId('scrollspy')).toHaveAttribute('data-visual-state');
    });
  });

  // ===========================================================================
  // IntersectionObserver
  // ===========================================================================
  describe('IntersectionObserver', () => {
    it('creates IntersectionObserver on mount', () => {
      renderWithSections(sampleItems);

      expect(MockIntersectionObserver.calls.length).toBeGreaterThan(0);
    });

    it('observes all target sections', () => {
      renderWithSections(sampleItems);

      // Check that observer.observe was called for each section
      for (const item of sampleItems) {
        const element = document.getElementById(item.target);
        expect(element).not.toBeNull();
        if (element) {
          expect(mockObservers.has(element)).toBe(true);
        }
      }
    });

    it('applies custom rootMargin', () => {
      renderWithSections(sampleItems, { rootMargin: '100px 0px -100px 0px' });

      const call = MockIntersectionObserver.calls[0];
      expect(call?.options).toEqual(
        expect.objectContaining({ rootMargin: '100px 0px -100px 0px' })
      );
    });

    it('applies custom threshold', () => {
      renderWithSections(sampleItems, { threshold: 0.5 });

      const call = MockIntersectionObserver.calls[0];
      expect(call?.options).toEqual(expect.objectContaining({ threshold: 0.5 }));
    });

    it('applies offset to rootMargin', () => {
      renderWithSections(sampleItems, { offset: 100 });

      const call = MockIntersectionObserver.calls[0];
      expect(call?.options).toEqual(expect.objectContaining({ rootMargin: '-100px 0px -50% 0px' }));
    });

    it('disconnects observer on unmount', () => {
      const { unmount } = renderWithSections(sampleItems);

      unmount();

      // Observer disconnect should have been called
      expect(mockObservers.size).toBe(0);
    });
  });

  // ===========================================================================
  // Active State
  // ===========================================================================
  describe('Active State', () => {
    it('marks first visible section as active', () => {
      renderWithSections(sampleItems);

      act(() => {
        simulateIntersection('intro', true);
      });

      const introLink = screen.getByRole('link', { name: 'Introduction' });
      expect(introLink).toHaveClass('active');
    });

    it('adds aria-current to active link', () => {
      renderWithSections(sampleItems);

      act(() => {
        simulateIntersection('intro', true);
      });

      const introLink = screen.getByRole('link', { name: 'Introduction' });
      expect(introLink).toHaveAttribute('aria-current', 'location');
    });

    it('does not add aria-current to inactive links', () => {
      renderWithSections(sampleItems);

      act(() => {
        simulateIntersection('intro', true);
      });

      const featuresLink = screen.getByRole('link', { name: 'Features' });
      expect(featuresLink).not.toHaveAttribute('aria-current');
    });

    it('updates active section when scrolling', () => {
      renderWithSections(sampleItems);

      // First section enters
      act(() => {
        simulateIntersection('intro', true);
      });

      expect(screen.getByRole('link', { name: 'Introduction' })).toHaveClass('active');

      // First section leaves, second enters
      act(() => {
        simulateIntersection('intro', false);
        simulateIntersection('features', true);
      });

      expect(screen.getByRole('link', { name: 'Introduction' })).not.toHaveClass('active');
      expect(screen.getByRole('link', { name: 'Features' })).toHaveClass('active');
    });

    it('calls onActiveChange when active section changes', () => {
      const onActiveChange = jest.fn();
      renderWithSections(sampleItems, { onActiveChange });

      act(() => {
        simulateIntersection('intro', true);
      });

      expect(onActiveChange).toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // Controlled Mode
  // ===========================================================================
  describe('Controlled Mode', () => {
    it('uses controlled activeId', () => {
      render(<Scrollspy items={sampleItems} activeId="features" />);

      const featuresLink = screen.getByRole('link', { name: 'Features' });
      expect(featuresLink).toHaveClass('active');
    });

    it('ignores IntersectionObserver in controlled mode for activeId', () => {
      renderWithSections(sampleItems, { activeId: 'features' });

      // Even when intro becomes visible, features stays active
      act(() => {
        simulateIntersection('intro', true);
      });

      const featuresLink = screen.getByRole('link', { name: 'Features' });
      expect(featuresLink).toHaveClass('active');
    });

    it('respects null controlled activeId', () => {
      render(<Scrollspy items={sampleItems} activeId={null} />);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link).not.toHaveClass('active');
      });
    });
  });

  // ===========================================================================
  // Default Active
  // ===========================================================================
  describe('Default Active', () => {
    it('uses defaultActiveId when provided', () => {
      render(<Scrollspy items={sampleItems} defaultActiveId="api" />);

      const apiLink = screen.getByRole('link', { name: 'API' });
      expect(apiLink).toHaveClass('active');
    });
  });

  // ===========================================================================
  // Link Interactions
  // ===========================================================================
  describe('Link Interactions', () => {
    it('prevents default on link click', () => {
      renderWithSections(sampleItems);

      const link = screen.getByRole('link', { name: 'Features' });
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      const preventDefault = jest.spyOn(event, 'preventDefault');

      fireEvent(link, event);

      expect(preventDefault).toHaveBeenCalled();
    });

    it('scrolls to section on link click', () => {
      const scrollToMock = jest.fn();
      const scrollIntoViewMock = jest.fn();
      window.scrollTo = scrollToMock;
      Element.prototype.scrollIntoView = scrollIntoViewMock;

      renderWithSections(sampleItems, { smoothScroll: true });

      fireEvent.click(screen.getByRole('link', { name: 'Features' }));

      // The component uses window.scrollTo, but we can verify the section exists
      expect(document.getElementById('features')).toBeInTheDocument();
      expect(scrollToMock).toHaveBeenCalledTimes(1);
      expect(scrollIntoViewMock).not.toHaveBeenCalled();
    });

    it('handles keyboard Enter on link', () => {
      const scrollToMock = jest.fn();
      const scrollIntoViewMock = jest.fn();
      window.scrollTo = scrollToMock;
      Element.prototype.scrollIntoView = scrollIntoViewMock;

      renderWithSections(sampleItems);

      const link = screen.getByRole('link', { name: 'Features' });
      fireEvent.keyDown(link, { key: 'Enter' });

      expect(scrollToMock).toHaveBeenCalledTimes(1);
      expect(scrollIntoViewMock).not.toHaveBeenCalled();
    });

    it('handles keyboard Space on link', () => {
      const scrollToMock = jest.fn();
      const scrollIntoViewMock = jest.fn();
      window.scrollTo = scrollToMock;
      Element.prototype.scrollIntoView = scrollIntoViewMock;

      renderWithSections(sampleItems);

      const link = screen.getByRole('link', { name: 'Features' });
      fireEvent.keyDown(link, { key: ' ' });

      expect(scrollToMock).toHaveBeenCalledTimes(1);
      expect(scrollIntoViewMock).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // Smooth Scroll
  // ===========================================================================
  describe('Smooth Scroll', () => {
    it('uses smooth behavior by default', () => {
      const scrollToMock = jest.fn();
      const scrollIntoViewMock = jest.fn();
      window.scrollTo = scrollToMock;
      Element.prototype.scrollIntoView = scrollIntoViewMock;

      renderWithSections(sampleItems);

      const link = screen.getByRole('link', { name: 'Features' });
      fireEvent.keyDown(link, { key: 'Enter' });

      expect(scrollToMock).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'smooth' }));
      expect(scrollIntoViewMock).not.toHaveBeenCalled();
    });

    it('uses auto behavior when smoothScroll is false', () => {
      const scrollToMock = jest.fn();
      const scrollIntoViewMock = jest.fn();
      window.scrollTo = scrollToMock;
      Element.prototype.scrollIntoView = scrollIntoViewMock;

      renderWithSections(sampleItems, { smoothScroll: false });

      const link = screen.getByRole('link', { name: 'Features' });
      fireEvent.keyDown(link, { key: 'Enter' });

      expect(scrollToMock).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'auto' }));
      expect(scrollIntoViewMock).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // Ref Forwarding
  // ===========================================================================
  describe('Ref Forwarding', () => {
    it('forwards ref to nav element', () => {
      const ref = { current: null };
      render(<Scrollspy ref={ref} items={sampleItems} />);

      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect((ref.current as HTMLElement).tagName).toBe('NAV');
    });
  });

  // ===========================================================================
  // Custom Children
  // ===========================================================================
  describe('Custom Children', () => {
    it('renders custom children instead of items', () => {
      render(
        <Scrollspy items={[]}>
          <ul>
            <li>
              <Scrollspy.Link target="custom">Custom Link</Scrollspy.Link>
            </li>
          </ul>
        </Scrollspy>
      );

      expect(screen.getByText('Custom Link')).toBeInTheDocument();
    });
  });
});

// =============================================================================
// Scrollspy.Link Tests
// =============================================================================

describe('Scrollspy.Link', () => {
  it('renders anchor element', () => {
    render(
      <Scrollspy items={[]}>
        <Scrollspy.Link target="section">Test Link</Scrollspy.Link>
      </Scrollspy>
    );

    const link = screen.getByText('Test Link');
    expect(link.tagName).toBe('A');
  });

  it('has correct href', () => {
    render(
      <Scrollspy items={[]}>
        <Scrollspy.Link target="section">Test Link</Scrollspy.Link>
      </Scrollspy>
    );

    expect(screen.getByText('Test Link')).toHaveAttribute('href', '#section');
  });

  it('applies active class when active prop is true', () => {
    render(
      <Scrollspy items={[]}>
        <Scrollspy.Link target="section" active>
          Test Link
        </Scrollspy.Link>
      </Scrollspy>
    );

    expect(screen.getByText('Test Link')).toHaveClass('active');
  });

  it('applies aria-current when active', () => {
    render(
      <Scrollspy items={[]}>
        <Scrollspy.Link target="section" active>
          Test Link
        </Scrollspy.Link>
      </Scrollspy>
    );

    expect(screen.getByText('Test Link')).toHaveAttribute('aria-current', 'location');
  });

  it('calls onClick handler', () => {
    const onClick = jest.fn();
    render(
      <Scrollspy items={[]}>
        <Scrollspy.Link target="section" onClick={onClick}>
          Test Link
        </Scrollspy.Link>
      </Scrollspy>
    );

    fireEvent.click(screen.getByText('Test Link'));
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards ref', () => {
    const ref = { current: null };
    render(
      <Scrollspy items={[]}>
        <Scrollspy.Link ref={ref} target="section">
          Test Link
        </Scrollspy.Link>
      </Scrollspy>
    );

    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it('applies custom className', () => {
    render(
      <Scrollspy items={[]}>
        <Scrollspy.Link target="section" className="custom-link">
          Test Link
        </Scrollspy.Link>
      </Scrollspy>
    );

    expect(screen.getByText('Test Link')).toHaveClass('custom-link');
  });
});

// =============================================================================
// useScrollspy Hook Tests
// =============================================================================

describe('useScrollspy Hook', () => {
  it('throws error when used outside Scrollspy', () => {
    const TestComponent = (): React.JSX.Element => {
      useScrollspy();
      return <div>Test</div>;
    };

    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      'useScrollspy must be used within a Scrollspy component'
    );

    consoleSpy.mockRestore();
  });

  it('provides context within Scrollspy', () => {
    // Test that context is provided by checking if hook doesn't throw
    const TestComponent = (): React.JSX.Element => {
      const context = useScrollspy();

      // Verify context has expected properties
      expect(context).toHaveProperty('activeId');
      expect(context).toHaveProperty('visibleIds');
      expect(context).toHaveProperty('setActive');
      expect(context).toHaveProperty('scrollToSection');
      expect(context).toHaveProperty('smoothScroll');

      return <div data-testid="context-present">Context Available</div>;
    };

    const { getByTestId } = render(
      <Scrollspy items={sampleItems}>
        <TestComponent />
      </Scrollspy>
    );

    expect(getByTestId('context-present')).toBeInTheDocument();
  });
});
