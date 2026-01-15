import {
  BoxIcon,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Heading,
  HouseIcon,
  SearchIcon,
  StarFillIcon,
} from '@dsai-io/react';
import { type ComponentProps, useCallback, useId, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Breadcrumb navigation component for hierarchical page structure.
 * Built with Bootstrap 5 design tokens and WCAG 2.2 AA compliance.
 *
 * **State Machine (FSM):**
 * - Uses finite state machine for expand/collapse behavior
 * - States: `collapsed` | `expanded`
 * - Events: `EXPAND` (ellipsis click), `RESET_FROM_PROPS` (controlled sync)
 * - `data-visual-state` attribute exposes current state for testing
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
 * - useReducer FSM ensures predictable state transitions
 *
 * **Accessibility:**
 * - WCAG 2.2 AA compliant navigation
 * - Icons automatically hidden from screen readers (aria-hidden=&quot;true&quot;)
 * - Proper aria-current="page" on active items
 * - Ellipsis button has aria-expanded state
 * - Semantic HTML with proper ARIA labels
 */
type StoryBreadcrumbProps = ComponentProps<typeof Breadcrumb>;

const StoryBreadcrumb = (props: StoryBreadcrumbProps): JSX.Element => {
  const generatedId = useId();
  const computedAriaLabel = props['aria-label'] ?? `Breadcrumb navigation example ${generatedId}`;

  return <Breadcrumb {...props} aria-label={computedAriaLabel} />;
};

const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  render: (args) => <StoryBreadcrumb {...args} />,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'An accessible breadcrumb navigation component supporting custom separators, ' +
          'collapsible items for long paths, and router integration. ' +
          'Uses a finite state machine (FSM) for expand/collapse behavior. ' +
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
    expanded: {
      control: 'boolean',
      description: 'Controlled expanded state (triggers FSM RESET_FROM_PROPS event)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
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
    <StoryBreadcrumb>
      <BreadcrumbItem href="#">Home</BreadcrumbItem>
      <BreadcrumbItem href="#">Library</BreadcrumbItem>
      <BreadcrumbItem active>Data</BreadcrumbItem>
    </StoryBreadcrumb>
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
        <StoryBreadcrumb items={basicItems} />
      </div>
      <div>
        <small className="text-muted d-block mb-1">Arrow (&gt;)</small>
        <StoryBreadcrumb items={basicItems} separator=">" />
      </div>
      <div>
        <small className="text-muted d-block mb-1">Chevron (›)</small>
        <StoryBreadcrumb items={basicItems} separator="›" />
      </div>
      <div>
        <small className="text-muted d-block mb-1">Bullet (•)</small>
        <StoryBreadcrumb items={basicItems} separator="•" />
      </div>
      <div>
        <small className="text-muted d-block mb-1">Pipe (|)</small>
        <StoryBreadcrumb items={basicItems} separator="|" />
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
        <StoryBreadcrumb
          items={longPathItems}
          maxItems={4}
          expanded={expanded}
          onExpand={() => setExpanded(true)}
        />
        <div className="mt-2 d-flex gap-2 align-items-center">
          <span className="badge bg-secondary">
            FSM State: {expanded ? 'expanded' : 'collapsed'}
          </span>
          {expanded && (
            <Button size="sm" variant="outline-secondary" onClick={() => setExpanded(false)}>
              Collapse
            </Button>
          )}
        </div>
      </div>
    );
  },
};

// =============================================================================
// FSM State Machine
// =============================================================================

/**
 * Demonstrates the FSM-based expand/collapse behavior.
 * The `data-visual-state` attribute reflects the current FSM state.
 */
export const FSMStateMachine: Story = {
  render: function FSMBreadcrumb() {
    const [expanded, setExpanded] = useState(false);
    const [mode, setMode] = useState<'uncontrolled' | 'controlled'>('uncontrolled');

    const handleExpand = useCallback(() => {
      if (mode === 'controlled') {
        setExpanded(true);
      }
      // In uncontrolled mode, FSM handles state internally
    }, [mode]);

    return (
      <div>
        <div className="mb-3">
          <fieldset
            className="btn-group"
            aria-label="Mode selection"
            style={{ border: 0, padding: 0, margin: 0 }}
          >
            <legend className="visually-hidden">Mode selection</legend>
            <Button
              size="sm"
              variant={mode === 'uncontrolled' ? 'primary' : 'outline-primary'}
              onClick={() => {
                setMode('uncontrolled');
                setExpanded(false);
              }}
            >
              Uncontrolled
            </Button>
            <Button
              size="sm"
              variant={mode === 'controlled' ? 'primary' : 'outline-primary'}
              onClick={() => {
                setMode('controlled');
                setExpanded(false);
              }}
            >
              Controlled
            </Button>
          </fieldset>
        </div>

        <StoryBreadcrumb
          items={longPathItems}
          maxItems={4}
          expanded={mode === 'controlled' ? expanded : undefined}
          onExpand={handleExpand}
        />

        <div className="mt-3 p-3 bg-light rounded">
          <Heading level={6} className="mb-2">
            FSM State Debug
          </Heading>
          <div className="d-flex flex-column gap-1">
            <small>
              <strong>Mode:</strong> {mode}
            </small>
            <small>
              <strong>Controlled expanded prop:</strong>{' '}
              {mode === 'controlled' ? String(expanded) : 'undefined (uncontrolled)'}
            </small>
            <small>
              <code>data-visual-state</code> attribute shows current FSM state
            </small>
          </div>
          {mode === 'controlled' && (
            <div className="mt-2">
              <Button
                size="sm"
                variant="outline-primary"
                className="me-2"
                onClick={() => setExpanded(true)}
              >
                Set expanded=true
              </Button>
              <Button size="sm" variant="outline-secondary" onClick={() => setExpanded(false)}>
                Set expanded=false
              </Button>
            </div>
          )}
        </div>

        <div className="alert alert-info mt-3 mb-0">
          <small>
            <strong>FSM State Machine:</strong>
            <ul className="mb-0 mt-1">
              <li>
                <strong>States:</strong> <code>collapsed</code> | <code>expanded</code>
              </li>
              <li>
                <strong>EXPAND event:</strong> Ellipsis click (only works in uncontrolled mode)
              </li>
              <li>
                <strong>RESET_FROM_PROPS event:</strong> Syncs with controlled <code>expanded</code>{' '}
                prop
              </li>
              <li>
                <strong>data-visual-state:</strong> Attribute on nav for testing/styling
              </li>
            </ul>
          </small>
        </div>
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
        icon: <HouseIcon size={16} />,
      },
      {
        id: 'settings',
        label: 'Settings',
        href: '#',
        icon: <BoxIcon size={16} />,
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
      <StoryBreadcrumb
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
        <StoryBreadcrumb
          items={[
            { id: 'dashboard', label: 'Dashboard', href: '#' },
            { id: 'users', label: 'Users', href: '#' },
            { id: 'profile', label: 'User Profile', active: true },
          ]}
        />
      </div>
      <div className="card-body">
        <Heading level={5} className="card-title">
          User Profile
        </Heading>
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
          Safe: HTTP/HTTPS links and internal paths work
        </small>
        <StoryBreadcrumb
          items={[
            { id: 'home', label: 'Home', href: '/' },
            { id: 'external', label: 'External Site', href: 'https://example.com' },
            { id: 'current', label: 'Current', active: true },
          ]}
        />
      </div>
      <div>
        <small className="text-muted d-block mb-1">
          Blocked: Dangerous protocols (javascript:, data:, vbscript:) are safely converted to
          &apos;#&apos;
        </small>
        <StoryBreadcrumb
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
        External links automatically get rel=&quot;noopener noreferrer&quot; for security
      </small>
      <StoryBreadcrumb
        items={[
          { id: 'home', label: 'Home', href: '#' },
          { id: 'docs', label: 'Documentation', href: 'https://docs.example.com' },
          { id: 'api', label: 'API Reference', href: 'https://api.example.com' },
          { id: 'current', label: 'Current Page', active: true },
        ]}
      />
      <div className="alert alert-info mt-3 mb-0">
        <small>
          <strong>Security:</strong> All external links include rel=&quot;noopener noreferrer&quot;
          to prevent:
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
        Icons are visually displayed but hidden from screen readers (aria-hidden=&quot;true&quot;)
      </small>
      <StoryBreadcrumb
        items={[
          {
            id: 'home',
            label: 'Home',
            href: '#',
            icon: <HouseIcon size={16} />,
          },
          {
            id: 'products',
            label: 'Products',
            href: '#',
            icon: <BoxIcon size={16} />,
          },
          {
            id: 'details',
            label: 'Product Details',
            href: '#',
            icon: <SearchIcon size={16} />,
          },
          {
            id: 'reviews',
            label: 'Customer Reviews',
            active: true,
            icon: <StarFillIcon size={16} />,
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
 * In real usage, parent re-renders won&rsquo;t trigger child re-renders
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
        <StoryBreadcrumb
          items={[
            { id: 'home', label: 'Home', href: '/' },
            { id: 'products', label: 'Products', href: '/products' },
            { id: 'current', label: 'Current Page', active: true },
          ]}
        />
        <Button
          size="sm"
          variant="outline-primary"
          className="mt-3"
          onClick={() => setCounter(counter + 1)}
        >
          Force Parent Re-render ({counter})
        </Button>
        <div className="alert alert-info mt-3 mb-0">
          <small>
            <strong>Performance:</strong> The breadcrumb component uses React.memo and useMemo hooks
            to:
            <ul className="mb-0 mt-1">
              <li>Skip re-renders when props haven&apos;t changed</li>
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
        <Heading level={5} className="mb-2">
          Basic
        </Heading>
        <StoryBreadcrumb items={basicItems} />
      </section>

      {/* Separators */}
      <section>
        <Heading level={5} className="mb-2">
          Custom Separators
        </Heading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <StoryBreadcrumb items={basicItems} separator=">" />
          <StoryBreadcrumb items={basicItems} separator="›" />
          <StoryBreadcrumb items={basicItems} separator="•" />
        </div>
      </section>

      {/* Collapsible */}
      <section>
        <Heading level={5} className="mb-2">
          Collapsible (click ellipsis to expand)
        </Heading>
        <StoryBreadcrumb items={longPathItems} maxItems={4} />
      </section>

      {/* With Icons */}
      <section>
        <Heading level={5} className="mb-2">
          With Icons
        </Heading>
        <StoryBreadcrumb
          items={[
            {
              id: 'home',
              label: 'Home',
              href: '#',
              icon: <HouseIcon size={14} aria-hidden="true" />,
            },
            { id: 'library', label: 'Library', href: '#' },
            { id: 'data', label: 'Data', active: true },
          ]}
        />
      </section>

      {/* Compound Components */}
      <section>
        <Heading level={5} className="mb-2">
          Compound Components
        </Heading>
        <StoryBreadcrumb>
          <BreadcrumbItem href="#">Home</BreadcrumbItem>
          <BreadcrumbItem href="#">Products</BreadcrumbItem>
          <BreadcrumbItem active>Current</BreadcrumbItem>
        </StoryBreadcrumb>
      </section>
    </div>
  ),
};
