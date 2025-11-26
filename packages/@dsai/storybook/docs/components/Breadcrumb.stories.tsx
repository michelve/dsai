import { Breadcrumb, BreadcrumbItem } from '@dsai/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

/**
 * Breadcrumb navigation component for hierarchical page structure.
 * Built with Bootstrap 5 design tokens and WCAG 2.2 AA compliance.
 *
 * **Security Features:**
 * - Automatic HREF validation blocks dangerous protocols (javascript:, data:, vbscript:, file:)
 * - External links automatically get rel="noopener noreferrer" for protection
 * - XSS-safe rendering with protocol validation
 *
 * **Performance Optimizations:**
 * - React.memo wrapper prevents unnecessary re-renders
 * - useMemo caching for classes, styles, and render functions
 * - useCallback for event handlers to prevent child re-renders
 *
 * **Accessibility:**
 * - WCAG 2.2 AA compliant navigation
 * - Icons automatically hidden from screen readers (aria-hidden="true")
 * - Proper aria-current="page" on active items
 * - Semantic HTML with proper ARIA labels
 */
const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'An accessible breadcrumb navigation component supporting custom separators, ' +
          'collapsible items for long paths, and router integration. ' +
          'Features automatic security validation, performance optimizations, and WCAG 2.2 AA compliance.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    separator: {
      control: 'text',
      description: 'Custom separator between items',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: '/' },
      },
    },
    maxItems: {
      control: 'number',
      description: 'Maximum items before collapse',
      table: {
        type: { summary: 'number' },
      },
    },
    itemsBeforeCollapse: {
      control: 'number',
      description: 'Items to show before ellipsis',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    itemsAfterCollapse: {
      control: 'number',
      description: 'Items to show after ellipsis',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample items
const basicItems = [
  { id: 'home', label: 'Home', href: '#' },
  { id: 'library', label: 'Library', href: '#' },
  { id: 'data', label: 'Data', active: true },
];

const longPathItems = [
  { id: 'home', label: 'Home', href: '#' },
  { id: 'products', label: 'Products', href: '#' },
  { id: 'electronics', label: 'Electronics', href: '#' },
  { id: 'computers', label: 'Computers', href: '#' },
  { id: 'laptops', label: 'Laptops', href: '#' },
  { id: 'gaming', label: 'Gaming Laptops', active: true },
];

// =============================================================================
// Basic Examples
// =============================================================================

/**
 * Default breadcrumb using items prop
 */
export const Default: Story = {
  args: {
    items: basicItems,
  },
};

/**
 * Breadcrumb using compound components
 */
export const CompoundComponents: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem href="#">Home</BreadcrumbItem>
      <BreadcrumbItem href="#">Library</BreadcrumbItem>
      <BreadcrumbItem active>Data</BreadcrumbItem>
    </Breadcrumb>
  ),
};

// =============================================================================
// Custom Separators
// =============================================================================

/**
 * Custom separators
 */
export const CustomSeparators: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <small className="text-muted d-block mb-1">Default (/)</small>
        <Breadcrumb items={basicItems} />
      </div>
      <div>
        <small className="text-muted d-block mb-1">Arrow (&gt;)</small>
        <Breadcrumb items={basicItems} separator=">" />
      </div>
      <div>
        <small className="text-muted d-block mb-1">Chevron (›)</small>
        <Breadcrumb items={basicItems} separator="›" />
      </div>
      <div>
        <small className="text-muted d-block mb-1">Bullet (•)</small>
        <Breadcrumb items={basicItems} separator="•" />
      </div>
      <div>
        <small className="text-muted d-block mb-1">Pipe (|)</small>
        <Breadcrumb items={basicItems} separator="|" />
      </div>
    </div>
  ),
};

// =============================================================================
// Collapsible
// =============================================================================

/**
 * Collapsible breadcrumb for long paths
 */
export const Collapsible: Story = {
  args: {
    items: longPathItems,
    maxItems: 4,
    itemsBeforeCollapse: 1,
    itemsAfterCollapse: 2,
  },
};

/**
 * Collapsible with expand interaction
 */
export const CollapsibleInteractive: Story = {
  render: function CollapsibleBreadcrumb() {
    const [expanded, setExpanded] = useState(false);

    return (
      <div>
        <Breadcrumb
          items={longPathItems}
          maxItems={4}
          expanded={expanded}
          onExpand={() => setExpanded(true)}
        />
        {expanded && (
          <button
            type="button"
            className="btn btn-sm btn-link mt-2"
            onClick={() => setExpanded(false)}
          >
            Collapse
          </button>
        )}
      </div>
    );
  },
};

// =============================================================================
// With Icons
// =============================================================================

/**
 * Breadcrumb with icons
 */
export const WithIcons: Story = {
  args: {
    items: [
      {
        id: 'home',
        label: 'Home',
        href: '#',
        icon: (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <title>Home</title>
            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
          </svg>
        ),
      },
      {
        id: 'settings',
        label: 'Settings',
        href: '#',
        icon: (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <title>Settings</title>
            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
          </svg>
        ),
      },
      {
        id: 'profile',
        label: 'Profile',
        active: true,
      },
    ],
  },
};

// =============================================================================
// Click Handlers
// =============================================================================

/**
 * Breadcrumb with click handlers
 */
export const WithClickHandlers: Story = {
  render: () => {
    const handleClick = (page: string) => (): void => {
      alert(`Navigating to ${page}`);
    };

    return (
      <Breadcrumb
        items={[
          { id: 'home', label: 'Home', onClick: handleClick('Home') },
          { id: 'products', label: 'Products', onClick: handleClick('Products') },
          { id: 'current', label: 'Current Page', active: true },
        ]}
      />
    );
  },
};

// =============================================================================
// In Card Header
// =============================================================================

/**
 * Breadcrumb in a card header
 */
export const InCardHeader: Story = {
  render: () => (
    <div className="card">
      <div className="card-header bg-light">
        <Breadcrumb
          items={[
            { id: 'dashboard', label: 'Dashboard', href: '#' },
            { id: 'users', label: 'Users', href: '#' },
            { id: 'profile', label: 'User Profile', active: true },
          ]}
        />
      </div>
      <div className="card-body">
        <h5 className="card-title">User Profile</h5>
        <p className="card-text">This is the user profile page content.</p>
      </div>
    </div>
  ),
};

// =============================================================================
// Long Labels
// =============================================================================

/**
 * Breadcrumb with long labels
 */
export const LongLabels: Story = {
  args: {
    items: [
      { id: '1', label: 'Home', href: '#' },
      { id: '2', label: 'This is a very long category name', href: '#' },
      { id: '3', label: 'Another extremely long subcategory name', href: '#' },
      { id: '4', label: 'Current Page with Long Title', active: true },
    ],
  },
};

// =============================================================================
// Single Item
// =============================================================================

/**
 * Single item breadcrumb
 */
export const SingleItem: Story = {
  args: {
    items: [{ id: 'home', label: 'Home', active: true }],
  },
};

// =============================================================================
// Security: HREF Validation
// =============================================================================

/**
 * Demonstrates security validation - dangerous protocols are blocked
 * and converted to safe '#' fallback
 */
export const SecurityHREFValidation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <small className="text-muted d-block mb-1">
          ✅ Safe: HTTP/HTTPS links and internal paths work
        </small>
        <Breadcrumb
          items={[
            { id: 'home', label: 'Home', href: '/' },
            { id: 'external', label: 'External Site', href: 'https://example.com' },
            { id: 'current', label: 'Current', active: true },
          ]}
        />
      </div>
      <div>
        <small className="text-muted d-block mb-1">
          🛡️ Blocked: Dangerous protocols (javascript:, data:, vbscript:) are safely converted to
          '#'
        </small>
        <Breadcrumb
          items={[
            { id: 'home', label: 'Home', href: '/' },
            { id: 'danger1', label: 'javascript: (blocked)', href: '#' },
            { id: 'danger2', label: 'data: (blocked)', href: '#' },
            { id: 'safe', label: 'Safe', active: true },
          ]}
        />
      </div>
    </div>
  ),
};

/**
 * Demonstrates automatic rel attribute for external links
 */
export const SecurityExternalLinks: Story = {
  render: () => (
    <div>
      <small className="text-muted d-block mb-2">
        External links automatically get rel="noopener noreferrer" for security
      </small>
      <Breadcrumb
        items={[
          { id: 'home', label: 'Home', href: '#' },
          { id: 'docs', label: 'Documentation', href: 'https://docs.example.com' },
          { id: 'api', label: 'API Reference', href: 'https://api.example.com' },
          { id: 'current', label: 'Current Page', active: true },
        ]}
      />
      <div className="alert alert-info mt-3 mb-0">
        <small>
          <strong>Security:</strong> All external links include rel="noopener noreferrer" to
          prevent:
          <ul className="mb-0 mt-1">
            <li>window.opener access from target page</li>
            <li>Referrer information leakage</li>
            <li>Performance issues from noopener</li>
          </ul>
        </small>
      </div>
    </div>
  ),
};

// =============================================================================
// Accessibility: Icons
// =============================================================================

/**
 * Demonstrates icon accessibility - icons are hidden from screen readers
 */
export const AccessibilityIcons: Story = {
  render: () => (
    <div>
      <small className="text-muted d-block mb-2">
        Icons are visually displayed but hidden from screen readers (aria-hidden="true")
      </small>
      <Breadcrumb
        items={[
          {
            id: 'home',
            label: 'Home',
            href: '#',
            icon: '🏠',
          },
          {
            id: 'products',
            label: 'Products',
            href: '#',
            icon: '📦',
          },
          {
            id: 'details',
            label: 'Product Details',
            href: '#',
            icon: '🔍',
          },
          {
            id: 'reviews',
            label: 'Customer Reviews',
            active: true,
            icon: '⭐',
          },
        ]}
      />
      <div className="alert alert-info mt-3 mb-0">
        <small>
          <strong>Accessibility:</strong> Screen readers announce only text labels, not icons. Icons
          enhance visual hierarchy without affecting assistive technology.
        </small>
      </div>
    </div>
  ),
};

// =============================================================================
// Performance: Memoization
// =============================================================================

/**
 * Demonstrates performance optimizations through memoization
 * In real usage, parent re-renders won't trigger child re-renders
 */
export const PerformanceMemoization: Story = {
  render: function PerformanceBreadcrumb() {
    const [counter, setCounter] = useState(0);

    return (
      <div>
        <small className="text-muted d-block mb-2">
          Component re-renders: {counter}
          <br />
          Breadcrumb uses React.memo + useMemo to prevent unnecessary renders
        </small>
        <Breadcrumb
          items={[
            { id: 'home', label: 'Home', href: '/' },
            { id: 'products', label: 'Products', href: '/products' },
            { id: 'current', label: 'Current Page', active: true },
          ]}
        />
        <button
          type="button"
          className="btn btn-sm btn-outline-primary mt-3"
          onClick={() => setCounter(counter + 1)}
        >
          Force Parent Re-render ({counter})
        </button>
        <div className="alert alert-info mt-3 mb-0">
          <small>
            <strong>Performance:</strong> The breadcrumb component uses React.memo and useMemo hooks
            to:
            <ul className="mb-0 mt-1">
              <li>Skip re-renders when props haven't changed</li>
              <li>Cache className and style computations</li>
              <li>Memoize render functions with useCallback</li>
              <li>Optimize for re-render-heavy parent components</li>
            </ul>
          </small>
        </div>
      </div>
    );
  },
};

// =============================================================================
// Complete Showcase
// =============================================================================

/**
 * Complete breadcrumb showcase
 */
export const CompleteShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Basic */}
      <section>
        <h5 className="mb-2">Basic</h5>
        <Breadcrumb items={basicItems} />
      </section>

      {/* Separators */}
      <section>
        <h5 className="mb-2">Custom Separators</h5>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Breadcrumb items={basicItems} separator=">" />
          <Breadcrumb items={basicItems} separator="›" />
          <Breadcrumb items={basicItems} separator="•" />
        </div>
      </section>

      {/* Collapsible */}
      <section>
        <h5 className="mb-2">Collapsible (click ellipsis to expand)</h5>
        <Breadcrumb items={longPathItems} maxItems={4} />
      </section>

      {/* With Icons */}
      <section>
        <h5 className="mb-2">With Icons</h5>
        <Breadcrumb
          items={[
            {
              id: 'home',
              label: 'Home',
              href: '#',
              icon: (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <title>Home</title>
                  <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
                </svg>
              ),
            },
            { id: 'library', label: 'Library', href: '#' },
            { id: 'data', label: 'Data', active: true },
          ]}
        />
      </section>

      {/* Compound Components */}
      <section>
        <h5 className="mb-2">Compound Components</h5>
        <Breadcrumb>
          <BreadcrumbItem href="#">Home</BreadcrumbItem>
          <BreadcrumbItem href="#">Products</BreadcrumbItem>
          <BreadcrumbItem active>Current</BreadcrumbItem>
        </Breadcrumb>
      </section>
    </div>
  ),
};
