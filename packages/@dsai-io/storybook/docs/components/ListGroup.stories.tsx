import {
  Badge,
  CheckCircleFillIcon,
  EnvelopeIcon,
  Heading,
  ListGroup,
  ListGroupItem,
  StarIcon,
  TrashIcon,
  XCircleFillIcon,
} from '@dsai-io/react';
import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * ListGroup component for displaying lists of content.
 * Built with Bootstrap 5 design tokens and WCAG 2.2 AA compliance.
 *
 * Security Features:
 * - Href sanitization: Blocks dangerous URL protocols (javascript:, data:, vbscript:, file:)
 * - External link protection: Automatically adds rel="noopener noreferrer" to external links
 * - XSS prevention: Dangerous hrefs are replaced with # to prevent script injection
 *
 * Accessibility Features (WCAG 2.2 AA):
 * - Semantic list structure (ul/ol with li elements)
 * - aria-current on active items
 * - aria-disabled on disabled items
 * - role="button" for interactive div items with full keyboard support
 */
const meta: Meta<typeof ListGroup> = {
  title: 'Components/ListGroup',
  component: ListGroup,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'An accessible list group component supporting variants, ' +
          'interactive items, badges, and icons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'flush', 'numbered'],
      description: 'List variant',
      table: {
        type: { summary: "'default' | 'flush' | 'numbered'" },
        defaultValue: { summary: 'default' },
      },
    },
    horizontal: {
      control: 'select',
      options: [false, true, 'sm', 'md', 'lg', 'xl', 'xxl'],
      description: 'Horizontal layout',
      table: {
        type: { summary: "boolean | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'" },
        defaultValue: { summary: 'false' },
      },
    },
    ordered: {
      control: 'boolean',
      description: 'Render as ordered list',
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
  { id: '1', content: 'An item' },
  { id: '2', content: 'A second item' },
  { id: '3', content: 'A third item' },
  { id: '4', content: 'A fourth item' },
  { id: '5', content: 'And a fifth one' },
];

// =============================================================================
// Basic Examples
// =============================================================================

/**
 * Default list group using items prop
 */
export const Default: Story = {
  args: {
    items: basicItems,
  },
};

/**
 * List group using compound components
 */
export const CompoundComponents: Story = {
  render: () => (
    <ListGroup>
      <ListGroupItem>An item</ListGroupItem>
      <ListGroupItem>A second item</ListGroupItem>
      <ListGroupItem>A third item</ListGroupItem>
      <ListGroupItem>A fourth item</ListGroupItem>
      <ListGroupItem>And a fifth one</ListGroupItem>
    </ListGroup>
  ),
};

// =============================================================================
// States
// =============================================================================

/**
 * Active and disabled states
 */
export const ActiveAndDisabled: Story = {
  render: () => (
    <ListGroup>
      <ListGroupItem active>Active item</ListGroupItem>
      <ListGroupItem>Normal item</ListGroupItem>
      <ListGroupItem disabled>Disabled item</ListGroupItem>
      <ListGroupItem>Another item</ListGroupItem>
    </ListGroup>
  ),
};

// =============================================================================
// Variants
// =============================================================================

/**
 * Flush variant (no borders on sides)
 */
export const FlushVariant: Story = {
  args: {
    items: basicItems,
    variant: 'flush',
  },
};

/**
 * Numbered variant
 */
export const NumberedVariant: Story = {
  args: {
    items: basicItems,
    variant: 'numbered',
  },
};

// =============================================================================
// Color Variants
// =============================================================================

/**
 * Item color variants
 */
export const ColorVariants: Story = {
  render: () => (
    <ListGroup>
      <ListGroupItem>Default item</ListGroupItem>
      <ListGroupItem variant="primary">Primary item</ListGroupItem>
      <ListGroupItem variant="secondary">Secondary item</ListGroupItem>
      <ListGroupItem variant="success">Success item</ListGroupItem>
      <ListGroupItem variant="danger">Danger item</ListGroupItem>
      <ListGroupItem variant="warning">Warning item</ListGroupItem>
      <ListGroupItem variant="info">Info item</ListGroupItem>
      <ListGroupItem variant="light">Light item</ListGroupItem>
      <ListGroupItem variant="dark">Dark item</ListGroupItem>
    </ListGroup>
  ),
};

// =============================================================================
// Interactive Items
// =============================================================================

/**
 * Clickable items
 */
export const ClickableItems: Story = {
  render: function ClickableExample() {
    const [selected, setSelected] = useState<string | null>(null);

    return (
      <ListGroup>
        {['Item 1', 'Item 2', 'Item 3', 'Item 4'].map((item) => (
          <ListGroupItem key={item} active={selected === item} onClick={() => setSelected(item)}>
            {item}
          </ListGroupItem>
        ))}
      </ListGroup>
    );
  },
};

/**
 * Link items
 */
export const LinkItems: Story = {
  render: () => (
    <ListGroup>
      <ListGroupItem href="#" active>
        Active link
      </ListGroupItem>
      <ListGroupItem href="#">Link item</ListGroupItem>
      <ListGroupItem href="#">Another link</ListGroupItem>
      <ListGroupItem href="#" disabled>
        Disabled link
      </ListGroupItem>
    </ListGroup>
  ),
};

// =============================================================================
// With Badges
// =============================================================================

/**
 * Items with badges
 */
export const WithBadges: Story = {
  render: () => (
    <ListGroup>
      <ListGroupItem
        badge={
          <Badge variant="primary" pill>
            14
          </Badge>
        }
      >
        Inbox
      </ListGroupItem>
      <ListGroupItem
        badge={
          <Badge variant="primary" pill>
            3
          </Badge>
        }
      >
        Drafts
      </ListGroupItem>
      <ListGroupItem
        badge={
          <Badge variant="primary" pill>
            99+
          </Badge>
        }
      >
        Spam
      </ListGroupItem>
    </ListGroup>
  ),
};

// =============================================================================
// With Icons
// =============================================================================

/**
 * Items with icons
 */
export const WithIcons: Story = {
  render: () => (
    <ListGroup>
      <ListGroupItem icon={<EnvelopeIcon size={16} />}>Inbox</ListGroupItem>
      <ListGroupItem icon={<StarIcon size={16} />}>Starred</ListGroupItem>
      <ListGroupItem icon={<TrashIcon size={16} />}>Trash</ListGroupItem>
    </ListGroup>
  ),
};

// =============================================================================
// Horizontal Layout
// =============================================================================

/**
 * Horizontal list group
 */
export const Horizontal: Story = {
  args: {
    items: [
      { id: '1', content: 'Item 1' },
      { id: '2', content: 'Item 2' },
      { id: '3', content: 'Item 3' },
    ],
    horizontal: true,
  },
};

/**
 * Responsive horizontal layout
 */
export const ResponsiveHorizontal: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <small className="text-muted d-block mb-1">horizontal=&quot;sm&quot;</small>
        <ListGroup
          horizontal="sm"
          items={[
            { id: '1', content: 'Item 1' },
            { id: '2', content: 'Item 2' },
            { id: '3', content: 'Item 3' },
          ]}
        />
      </div>
      <div>
        <small className="text-muted d-block mb-1">horizontal=&quot;md&quot;</small>
        <ListGroup
          horizontal="md"
          items={[
            { id: '1', content: 'Item 1' },
            { id: '2', content: 'Item 2' },
            { id: '3', content: 'Item 3' },
          ]}
        />
      </div>
      <div>
        <small className="text-muted d-block mb-1">horizontal=&quot;lg&quot;</small>
        <ListGroup
          horizontal="lg"
          items={[
            { id: '1', content: 'Item 1' },
            { id: '2', content: 'Item 2' },
            { id: '3', content: 'Item 3' },
          ]}
        />
      </div>
    </div>
  ),
};

// =============================================================================
// Custom Content
// =============================================================================

/**
 * Rich content items
 */
export const CustomContent: Story = {
  render: () => (
    <ListGroup>
      <ListGroupItem href="#" active>
        <div className="d-flex w-100 justify-content-between">
          <Heading level={5} className="mb-1">
            List group item heading
          </Heading>
          <small>3 days ago</small>
        </div>
        <p className="mb-1">Some placeholder content in a paragraph.</p>
        <small>And some small print.</small>
      </ListGroupItem>
      <ListGroupItem href="#">
        <div className="d-flex w-100 justify-content-between">
          <Heading level={5} className="mb-1">
            List group item heading
          </Heading>
          <small className="text-body-secondary">3 days ago</small>
        </div>
        <p className="mb-1">Some placeholder content in a paragraph.</p>
        <small className="text-body-secondary">And some muted small print.</small>
      </ListGroupItem>
      <ListGroupItem href="#">
        <div className="d-flex w-100 justify-content-between">
          <Heading level={5} className="mb-1">
            List group item heading
          </Heading>
          <small className="text-body-secondary">3 days ago</small>
        </div>
        <p className="mb-1">Some placeholder content in a paragraph.</p>
        <small className="text-body-secondary">And some muted small print.</small>
      </ListGroupItem>
    </ListGroup>
  ),
};

// =============================================================================
// In Card
// =============================================================================

/**
 * List group in a card
 */
export const InCard: Story = {
  render: () => (
    <div className="card" style={{ width: '18rem' }}>
      <div className="card-header">Featured</div>
      <ListGroup variant="flush">
        <ListGroupItem>An item</ListGroupItem>
        <ListGroupItem>A second item</ListGroupItem>
        <ListGroupItem>A third item</ListGroupItem>
      </ListGroup>
    </div>
  ),
};

// =============================================================================
// Complete Showcase
// =============================================================================

/**
 * Complete list group showcase
 */
export const CompleteShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Basic */}
      <section>
        <Heading level={5} className="mb-2">
          Basic
        </Heading>
        <ListGroup items={basicItems} />
      </section>

      {/* States */}
      <section>
        <Heading level={5} className="mb-2">
          States
        </Heading>
        <ListGroup>
          <ListGroupItem active>Active</ListGroupItem>
          <ListGroupItem>Normal</ListGroupItem>
          <ListGroupItem disabled>Disabled</ListGroupItem>
        </ListGroup>
      </section>

      {/* Variants */}
      <section>
        <Heading level={5} className="mb-2">
          Variants
        </Heading>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div>
            <small className="text-muted d-block mb-1">Default</small>
            <ListGroup
              items={[
                { id: '1', content: 'Item 1' },
                { id: '2', content: 'Item 2' },
              ]}
            />
          </div>
          <div>
            <small className="text-muted d-block mb-1">Flush</small>
            <ListGroup
              variant="flush"
              items={[
                { id: '1', content: 'Item 1' },
                { id: '2', content: 'Item 2' },
              ]}
            />
          </div>
          <div>
            <small className="text-muted d-block mb-1">Numbered</small>
            <ListGroup
              variant="numbered"
              items={[
                { id: '1', content: 'Item 1' },
                { id: '2', content: 'Item 2' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* With Badges */}
      <section>
        <Heading level={5} className="mb-2">
          With Badges
        </Heading>
        <ListGroup>
          <ListGroupItem
            badge={
              <Badge variant="primary" pill>
                14
              </Badge>
            }
          >
            Inbox
          </ListGroupItem>
          <ListGroupItem
            badge={
              <Badge variant="primary" pill>
                3
              </Badge>
            }
          >
            Drafts
          </ListGroupItem>
        </ListGroup>
      </section>

      {/* Horizontal */}
      <section>
        <Heading level={5} className="mb-2">
          Horizontal
        </Heading>
        <ListGroup
          horizontal
          items={[
            { id: '1', content: 'Item 1' },
            { id: '2', content: 'Item 2' },
            { id: '3', content: 'Item 3' },
          ]}
        />
      </section>
    </div>
  ),
};

// =============================================================================
// Security Features
// =============================================================================

/**
 * Security: Href Sanitization
 *
 * The ListGroup component blocks dangerous URL protocols to prevent XSS attacks.
 * Dangerous protocols (javascript:, data:, vbscript:, file:) are replaced with #.
 */
export const SecurityHrefSanitization: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <Heading level={5}>Href Sanitization</Heading>
        <p className="text-muted small">
          Dangerous URL protocols are automatically blocked and replaced with #.
        </p>
      </div>
      <ListGroup>
        <ListGroupItem href="https://example.com">
          <CheckCircleFillIcon className="text-success me-2" size={16} />
          Safe: HTTPS link
        </ListGroupItem>
        <ListGroupItem href="/internal/path">
          <CheckCircleFillIcon className="text-success me-2" size={16} />
          Safe: Relative link
        </ListGroupItem>
        <ListGroupItem href="mailto:test@example.com">
          <CheckCircleFillIcon className="text-success me-2" size={16} />
          Safe: Email link
        </ListGroupItem>
        <ListGroupItem href="javascript:alert('XSS')">
          <XCircleFillIcon className="text-danger me-2" size={16} />
          Blocked: javascript: protocol (renders as #)
        </ListGroupItem>
        <ListGroupItem href="data:text/html,<script>alert('XSS')</script>">
          <XCircleFillIcon className="text-danger me-2" size={16} />
          Blocked: data: protocol (renders as #)
        </ListGroupItem>
      </ListGroup>
    </div>
  ),
};

/**
 * Security: External Link Protection
 *
 * External links automatically receive rel="noopener noreferrer" to prevent
 * tabnabbing attacks and referrer leakage.
 */
export const SecurityExternalLinks: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <Heading level={5}>External Link Protection</Heading>
        <p className="text-muted small">
          External links (http:// and https://) automatically get rel=&quot;noopener
          noreferrer&quot;.
        </p>
      </div>
      <ListGroup>
        <ListGroupItem href="https://external.com">
          External HTTPS link (has rel=&quot;noopener noreferrer&quot;)
        </ListGroupItem>
        <ListGroupItem href="http://external.com">
          External HTTP link (has rel=&quot;noopener noreferrer&quot;)
        </ListGroupItem>
        <ListGroupItem href="/internal">Internal link (no rel attribute)</ListGroupItem>
        <ListGroupItem href="#section">Anchor link (no rel attribute)</ListGroupItem>
      </ListGroup>
      <div className="alert alert-info small">
        <strong>Why this matters:</strong> The <code>rel=&quot;noopener noreferrer&quot;</code>{' '}
        attribute prevents the linked page from accessing <code>window.opener</code>, protecting
        against tabnabbing attacks and preventing referrer information leakage.
      </div>
    </div>
  ),
};

// =============================================================================
// Accessibility Features
// =============================================================================

/**
 * Accessibility: Interactive Div with Keyboard Support
 *
 * When using as="div" with onClick, the component provides full keyboard
 * accessibility with role="button", tabIndex, and Enter/Space key support.
 */
export const AccessibilityInteractiveDiv: Story = {
  render: function InteractiveDivExample() {
    const [clicked, setClicked] = useState<string | null>(null);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <Heading level={5}>Interactive Div with Keyboard Support</Heading>
          <p className="text-muted small">
            Use Tab to navigate and Enter/Space to activate. The div has role=&quot;button&quot;.
          </p>
        </div>
        <ListGroup>
          <ListGroupItem
            as="div"
            onClick={() => setClicked('Item 1')}
            active={clicked === 'Item 1'}
          >
            Div Item 1 (click or press Enter/Space)
          </ListGroupItem>
          <ListGroupItem
            as="div"
            onClick={() => setClicked('Item 2')}
            active={clicked === 'Item 2'}
          >
            Div Item 2 (click or press Enter/Space)
          </ListGroupItem>
          <ListGroupItem as="div" onClick={() => setClicked('Item 3')} disabled>
            Disabled Div Item (not focusable)
          </ListGroupItem>
        </ListGroup>
        {clicked && <p className="text-muted small">Last clicked: {clicked}</p>}
      </div>
    );
  },
};
