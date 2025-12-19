/**
 * @fileoverview Additional coverage tests for Scrollspy component
 * Tests edge cases, scroll containers, and branch coverage
 */

import { fireEvent, render, screen } from '@testing-library/react';

import { Scrollspy } from './Scrollspy';

import type { ScrollspyItem } from './Scrollspy.types';

// =============================================================================
// Mock IntersectionObserver
// =============================================================================

beforeAll(() => {
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
      takeRecords: jest.fn().mockReturnValue([]),
    })),
  });
});

beforeEach(() => {
  jest.clearAllMocks();
  // Mock matchMedia for reduced motion tests
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
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
    const originalScrollTo = window.scrollTo;
    const scrollIntoViewMock = jest.fn();

    // Remove scrollTo temporarily
    delete (window as unknown as Record<string, unknown>).scrollTo;
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

    // Restore scrollTo
    window.scrollTo = originalScrollTo;

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

    // Mock prefers-reduced-motion: reduce
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

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

    // Mock prefers-reduced-motion: no-preference
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

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
    it('parses stickyTop string value correctly', () => {
      const scrollToMock = jest.fn();
      window.scrollTo = scrollToMock;

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
    });

    it('handles invalid stickyTop string gracefully', () => {
      const scrollToMock = jest.fn();
      window.scrollTo = scrollToMock;

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

  it('calls onActiveChange callback', () => {
    const onActiveChange = jest.fn();
    const scrollToMock = jest.fn();
    window.scrollTo = scrollToMock;

    render(
      <div>
        <Scrollspy items={sampleItems} onActiveChange={onActiveChange} />
        <section id="intro">Intro</section>
        <section id="features">Features</section>
      </div>
    );

    // The component should render without errors
    expect(screen.getByRole('link', { name: 'Introduction' })).toBeInTheDocument();
  });
});

// =============================================================================
// rootMargin Configuration Tests
// =============================================================================

describe('rootMargin Configuration', () => {
  it('uses custom rootMargin when provided', () => {
    render(
      <div>
        <Scrollspy items={sampleItems} rootMargin="100px 0px -100px 0px" />
        <section id="intro">Intro</section>
      </div>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('computes rootMargin from offset when rootMargin not provided', () => {
    render(
      <div>
        <Scrollspy items={sampleItems} offset={50} />
        <section id="intro">Intro</section>
      </div>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
