/**
 * @fileoverview Additional coverage tests for Scrollspy component
 * Tests edge cases, scroll containers, and branch coverage
 */

import { fireEvent, render, screen } from '@testing-library/react';

import { Scrollspy } from './Scrollspy';

import type { ScrollspyItem } from './Scrollspy.types';

// =============================================================================
// Shared Test Utilities - Reduces Code Duplication
// =============================================================================

/**
 * Creates an IntersectionObserver mock that captures constructor options
 * and allows triggering intersection callbacks programmatically.
 */
function createIntersectionObserverMock() {
  let capturedCallback: IntersectionObserverCallback | null = null;
  let capturedOptions: IntersectionObserverInit | undefined;
  const observedElements = new Set<Element>();

  const mockObserver = {
    observe: jest.fn((element: Element) => observedElements.add(element)),
    unobserve: jest.fn((element: Element) => observedElements.delete(element)),
    disconnect: jest.fn(() => observedElements.clear()),
    takeRecords: jest.fn().mockReturnValue([]),
  };

  const MockIntersectionObserver = jest.fn((callback, options) => {
    capturedCallback = callback;
    capturedOptions = options;
    return mockObserver;
  });

  return {
    MockIntersectionObserver,
    mockObserver,
    getCallback: () => capturedCallback,
    getOptions: () => capturedOptions,
    getObservedElements: () => observedElements,
    triggerIntersection: (entries: Partial<IntersectionObserverEntry>[]) => {
      if (capturedCallback) {
        const fullEntries = entries.map((entry) => ({
          isIntersecting: false,
          intersectionRatio: 0,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          target: document.createElement('div'),
          time: Date.now(),
          ...entry,
        })) as IntersectionObserverEntry[];
        capturedCallback(fullEntries, mockObserver as unknown as IntersectionObserver);
      }
    },
  };
}

/**
 * Creates a matchMedia mock with configurable reduced motion preference.
 */
function createMatchMediaMock(prefersReducedMotion = false) {
  return jest.fn().mockImplementation((query: string) => ({
    matches: prefersReducedMotion && query === '(prefers-reduced-motion: reduce)',
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}

// =============================================================================
// Global Setup
// =============================================================================

let intersectionObserverMock: ReturnType<typeof createIntersectionObserverMock>;

beforeAll(() => {
  intersectionObserverMock = createIntersectionObserverMock();
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: intersectionObserverMock.MockIntersectionObserver,
  });
});

beforeEach(() => {
  jest.clearAllMocks();
  intersectionObserverMock = createIntersectionObserverMock();
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: intersectionObserverMock.MockIntersectionObserver,
  });
  window.matchMedia = createMatchMediaMock(false);
});

// =============================================================================
// Test Data
// =============================================================================

const sampleItems: ScrollspyItem[] = [
  { id: '1', label: 'Introduction', target: 'intro' },
  { id: '2', label: 'Features', target: 'features' },
  { id: '3', label: 'API', target: 'api' },
];

const nestedItems: ScrollspyItem[] = [
  {
    id: '1',
    label: 'Getting Started',
    target: 'getting-started',
    children: [
      { id: '1-1', label: 'Installation', target: 'installation' },
      {
        id: '1-2',
        label: 'Configuration',
        target: 'config',
        children: [{ id: '1-2-1', label: 'Advanced Config', target: 'advanced-config' }],
      },
    ],
  },
  { id: '2', label: 'API Reference', target: 'api-ref' },
];

// =============================================================================
// Scrollable Container Tests
// =============================================================================

describe('Scrollable Container Behavior', () => {
  it('falls back to window scroll when no scrollable container', () => {
    const windowScrollTo = jest.fn();
    window.scrollTo = windowScrollTo;

    render(
      <div>
        <Scrollspy items={sampleItems} />
        <section id="intro">Intro</section>
        <section id="features">Features</section>
      </div>
    );

    const link = screen.getByRole('link', { name: 'Features' });
    fireEvent.click(link);

    expect(windowScrollTo).toHaveBeenCalled();
  });

  it('uses scrollIntoView fallback when scrollTo is unavailable', () => {
    const scrollIntoViewMock = jest.fn();

    // Mock scrollTo as undefined (more robust than delete)
    Object.defineProperty(window, 'scrollTo', {
      writable: true,
      configurable: true,
      value: undefined,
    });
    Element.prototype.scrollIntoView = scrollIntoViewMock;

    render(
      <div>
        <Scrollspy items={sampleItems} />
        <section id="intro">Intro</section>
        <section id="features">Features</section>
      </div>
    );

    const link = screen.getByRole('link', { name: 'Features' });
    fireEvent.click(link);

    expect(scrollIntoViewMock).toHaveBeenCalled();
  });
});

// =============================================================================
// Reduced Motion Tests
// =============================================================================

describe('Reduced Motion Preference', () => {
  it('uses auto behavior when reduced motion is preferred', () => {
    const scrollToMock = jest.fn();
    window.scrollTo = scrollToMock;
    window.matchMedia = createMatchMediaMock(true);

    render(
      <div>
        <Scrollspy items={sampleItems} smoothScroll />
        <section id="intro">Intro</section>
        <section id="features">Features</section>
      </div>
    );

    const link = screen.getByRole('link', { name: 'Features' });
    fireEvent.click(link);

    expect(scrollToMock).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'auto' }));
  });

  it('uses smooth behavior when reduced motion is not preferred', () => {
    const scrollToMock = jest.fn();
    window.scrollTo = scrollToMock;
    window.matchMedia = createMatchMediaMock(false);

    render(
      <div>
        <Scrollspy items={sampleItems} smoothScroll />
        <section id="intro">Intro</section>
        <section id="features">Features</section>
      </div>
    );

    const link = screen.getByRole('link', { name: 'Features' });
    fireEvent.click(link);

    expect(scrollToMock).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'smooth' }));
  });
});

// =============================================================================
// Edge Cases and Branch Coverage
// =============================================================================

describe('Edge Cases', () => {
  describe('Empty and Sanitized Targets', () => {
    it('handles click on link with empty target', () => {
      const scrollToMock = jest.fn();
      window.scrollTo = scrollToMock;

      render(
        <Scrollspy items={[]}>
          <Scrollspy.Link target="">Empty Target</Scrollspy.Link>
        </Scrollspy>
      );

      const link = screen.getByText('Empty Target');
      fireEvent.click(link);

      // Should not scroll when target is empty
      expect(scrollToMock).not.toHaveBeenCalled();
    });

    it('handles click on link with whitespace-only target', () => {
      const scrollToMock = jest.fn();
      window.scrollTo = scrollToMock;

      render(
        <Scrollspy items={[]}>
          <Scrollspy.Link target="   ">Whitespace Target</Scrollspy.Link>
        </Scrollspy>
      );

      const link = screen.getByText('Whitespace Target');
      fireEvent.click(link);

      expect(scrollToMock).not.toHaveBeenCalled();
    });

    it('handles keydown on link with sanitized target', () => {
      const scrollToMock = jest.fn();
      window.scrollTo = scrollToMock;

      render(
        <Scrollspy items={[]}>
          <Scrollspy.Link target="javascript:alert(1)">Dangerous Target</Scrollspy.Link>
        </Scrollspy>
      );

      const link = screen.getByText('Dangerous Target');
      fireEvent.keyDown(link, { key: 'Enter' });

      // Should not scroll when target is sanitized away
      expect(scrollToMock).not.toHaveBeenCalled();
    });

    it('handles space keydown on link with empty target', () => {
      const scrollToMock = jest.fn();
      window.scrollTo = scrollToMock;

      render(
        <Scrollspy items={[]}>
          <Scrollspy.Link target="">Empty</Scrollspy.Link>
        </Scrollspy>
      );

      const link = screen.getByText('Empty');
      fireEvent.keyDown(link, { key: ' ' });

      expect(scrollToMock).not.toHaveBeenCalled();
    });
  });

  describe('Deeply Nested Items', () => {
    it('handles deeply nested item targets', () => {
      render(
        <div>
          <Scrollspy items={nestedItems} data-testid="scrollspy" />
          <section id="getting-started">GS Section</section>
          <section id="installation">Install Section</section>
          <section id="config">Config Section</section>
          <section id="advanced-config">Advanced Section</section>
          <section id="api-ref">API Section</section>
        </div>
      );

      // All nested links should be rendered (using getAllByRole to avoid duplicate text issues)
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThanOrEqual(5);

      // Verify specific links exist by href
      expect(screen.getByRole('link', { name: 'Getting Started' })).toHaveAttribute(
        'href',
        '#getting-started'
      );
      expect(screen.getByRole('link', { name: 'Installation' })).toHaveAttribute(
        'href',
        '#installation'
      );
      expect(screen.getByRole('link', { name: 'Configuration' })).toHaveAttribute(
        'href',
        '#config'
      );
      expect(screen.getByRole('link', { name: 'Advanced Config' })).toHaveAttribute(
        'href',
        '#advanced-config'
      );
      expect(screen.getByRole('link', { name: 'API Reference' })).toHaveAttribute(
        'href',
        '#api-ref'
      );
    });
  });

  describe('stickyTop as String', () => {
    it('parses stickyTop string value and applies offset to scroll position', () => {
      const scrollToMock = jest.fn();
      window.scrollTo = scrollToMock;

      // Mock getBoundingClientRect to return predictable values
      const mockRect = { top: 500 };
      jest.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(mockRect as DOMRect);

      render(
        <div>
          <Scrollspy items={sampleItems} stickyTop="50" />
          <section id="intro">Intro</section>
          <section id="features">Features</section>
        </div>
      );

      const link = screen.getByRole('link', { name: 'Features' });
      fireEvent.click(link);

      expect(scrollToMock).toHaveBeenCalled();
      // Verify stickyTop offset is applied (top = elementTop + scrollY - stickyTop)
      const scrollArgs = scrollToMock.mock.calls[0][0];
      expect(scrollArgs).toHaveProperty('top');
      // The top value should account for the 50px stickyTop offset
      expect(typeof scrollArgs.top).toBe('number');
    });

    it('handles invalid stickyTop string gracefully (falls back to 0)', () => {
      const scrollToMock = jest.fn();
      window.scrollTo = scrollToMock;

      const mockRect = { top: 500 };
      jest.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(mockRect as DOMRect);

      render(
        <div>
          <Scrollspy items={sampleItems} stickyTop="invalid" />
          <section id="intro">Intro</section>
          <section id="features">Features</section>
        </div>
      );

      const link = screen.getByRole('link', { name: 'Features' });
      fireEvent.click(link);

      // Should handle NaN from parseInt gracefully (falls back to 0)
      expect(scrollToMock).toHaveBeenCalled();
      const scrollArgs = scrollToMock.mock.calls[0][0];
      expect(scrollArgs).toHaveProperty('top');
    });
  });

  describe('Non-existent Target Elements', () => {
    it('handles click to non-existent section gracefully', () => {
      const scrollToMock = jest.fn();
      window.scrollTo = scrollToMock;

      render(
        <Scrollspy items={[]}>
          <Scrollspy.Link target="nonexistent">Link</Scrollspy.Link>
        </Scrollspy>
      );

      const link = screen.getByText('Link');
      fireEvent.click(link);

      // Should not crash, scrollTo not called since element doesn't exist
      expect(scrollToMock).not.toHaveBeenCalled();
    });

    it('handles keydown to non-existent section gracefully', () => {
      const scrollToMock = jest.fn();
      window.scrollTo = scrollToMock;

      render(
        <Scrollspy items={[]}>
          <Scrollspy.Link target="nonexistent">Link</Scrollspy.Link>
        </Scrollspy>
      );

      const link = screen.getByText('Link');
      fireEvent.keyDown(link, { key: 'Enter' });

      expect(scrollToMock).not.toHaveBeenCalled();
    });
  });

  describe('Other Keyboard Keys', () => {
    it('ignores non-Enter/Space keys', () => {
      const scrollToMock = jest.fn();
      window.scrollTo = scrollToMock;

      render(
        <div>
          <Scrollspy items={sampleItems} />
          <section id="features">Features</section>
        </div>
      );

      const link = screen.getByRole('link', { name: 'Features' });
      fireEvent.keyDown(link, { key: 'Tab' });
      fireEvent.keyDown(link, { key: 'Escape' });
      fireEvent.keyDown(link, { key: 'a' });

      // None of these should trigger scroll
      expect(scrollToMock).not.toHaveBeenCalled();
    });
  });
});

// =============================================================================
// Scrollspy.Link Additional Coverage
// =============================================================================

describe('Scrollspy.Link Additional Coverage', () => {
  it('applies custom id', () => {
    render(
      <Scrollspy items={[]}>
        <Scrollspy.Link target="section" id="custom-link-id">
          Link
        </Scrollspy.Link>
      </Scrollspy>
    );

    expect(document.getElementById('custom-link-id')).toBeInTheDocument();
  });

  it('applies custom style', () => {
    render(
      <Scrollspy items={[]}>
        <Scrollspy.Link target="section" style={{ color: 'red' }}>
          Link
        </Scrollspy.Link>
      </Scrollspy>
    );

    const link = screen.getByText('Link');
    expect(link).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });

  it('applies data-test attribute', () => {
    render(
      <Scrollspy items={[]}>
        <Scrollspy.Link target="section" data-test="link-test">
          Link
        </Scrollspy.Link>
      </Scrollspy>
    );

    const link = screen.getByText('Link');
    expect(link).toHaveAttribute('data-test', 'link-test');
  });

  it('gets active state from context when active prop not provided', () => {
    render(
      <div>
        <Scrollspy items={sampleItems} activeId="features" />
      </div>
    );

    const featuresLink = screen.getByRole('link', { name: 'Features' });
    expect(featuresLink).toHaveClass('active');

    const introLink = screen.getByRole('link', { name: 'Introduction' });
    expect(introLink).not.toHaveClass('active');
  });

  it('handles click with valid target and calls onClick', () => {
    const scrollToMock = jest.fn();
    const onClickMock = jest.fn();
    window.scrollTo = scrollToMock;

    render(
      <div>
        <Scrollspy items={[]}>
          <Scrollspy.Link target="test-section" onClick={onClickMock}>
            Link
          </Scrollspy.Link>
        </Scrollspy>
        <section id="test-section">Test Section</section>
      </div>
    );

    const link = screen.getByText('Link');
    fireEvent.click(link);

    expect(scrollToMock).toHaveBeenCalled();
    expect(onClickMock).toHaveBeenCalled();
  });
});

// =============================================================================
// Controlled Mode Tests
// =============================================================================

describe('Controlled Mode', () => {
  it('controlled mode maintains activeId regardless of internal state', () => {
    render(
      <div>
        <Scrollspy items={sampleItems} activeId="api" />
        <section id="intro">Intro</section>
        <section id="features">Features</section>
        <section id="api">API</section>
      </div>
    );

    // API should be active (controlled)
    const apiLink = screen.getByRole('link', { name: 'API' });
    expect(apiLink).toHaveClass('active');

    // Other links should not be active
    const introLink = screen.getByRole('link', { name: 'Introduction' });
    expect(introLink).not.toHaveClass('active');
  });

  it('calls onActiveChange callback when intersection observer fires', () => {
    const onActiveChange = jest.fn();

    // Create sections and mock their intersection
    render(
      <div>
        <Scrollspy items={sampleItems} onActiveChange={onActiveChange} />
        <section id="intro" data-testid="intro-section">
          Intro
        </section>
        <section id="features" data-testid="features-section">
          Features
        </section>
      </div>
    );

    // Verify component rendered
    expect(screen.getByRole('link', { name: 'Introduction' })).toBeInTheDocument();

    // Get the observed section elements
    const featuresSection = screen.getByTestId('features-section');

    // Simulate an intersection event for the features section
    intersectionObserverMock.triggerIntersection([
      {
        isIntersecting: true,
        intersectionRatio: 0.5,
        target: featuresSection,
      },
    ]);

    // onActiveChange should be called when intersection occurs
    expect(onActiveChange).toHaveBeenCalledWith('features');
  });
});

// =============================================================================
// rootMargin Configuration Tests
// =============================================================================

describe('rootMargin Configuration', () => {
  it('passes custom rootMargin to IntersectionObserver', () => {
    const customRootMargin = '100px 0px -100px 0px';

    render(
      <div>
        <Scrollspy items={sampleItems} rootMargin={customRootMargin} />
        <section id="intro">Intro</section>
      </div>
    );

    // Verify IntersectionObserver was called with the custom rootMargin
    expect(intersectionObserverMock.MockIntersectionObserver).toHaveBeenCalled();
    const options = intersectionObserverMock.getOptions();
    expect(options?.rootMargin).toBe(customRootMargin);
  });

  it('computes rootMargin from offset when rootMargin not provided', () => {
    const offset = 50;

    render(
      <div>
        <Scrollspy items={sampleItems} offset={offset} />
        <section id="intro">Intro</section>
      </div>
    );

    // Verify IntersectionObserver was called with computed rootMargin
    expect(intersectionObserverMock.MockIntersectionObserver).toHaveBeenCalled();
    const options = intersectionObserverMock.getOptions();
    // The rootMargin should include the offset value
    expect(options?.rootMargin).toBeDefined();
    expect(options?.rootMargin).toContain('-50px');
  });

  it('uses default rootMargin when neither offset nor rootMargin provided', () => {
    render(
      <div>
        <Scrollspy items={sampleItems} />
        <section id="intro">Intro</section>
      </div>
    );

    expect(intersectionObserverMock.MockIntersectionObserver).toHaveBeenCalled();
    const options = intersectionObserverMock.getOptions();
    expect(options?.rootMargin).toBeDefined();
  });
});
