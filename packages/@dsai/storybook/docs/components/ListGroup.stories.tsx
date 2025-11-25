import { useState } from 'react';

import { Badge, ListGroup, ListGroupItem } from '@dsai/react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * ListGroup component for displaying lists of content.
 * Built with Bootstrap 5 design tokens and WCAG 2.2 AA compliance.
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
          <ListGroupItem
            key={item}
            active={selected === item}
            onClick={() => setSelected(item)}
          >
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
      <ListGroupItem badge={<Badge variant="primary" pill>14</Badge>}>
        Inbox
      </ListGroupItem>
      <ListGroupItem badge={<Badge variant="primary" pill>3</Badge>}>
        Drafts
      </ListGroupItem>
      <ListGroupItem badge={<Badge variant="primary" pill>99+</Badge>}>
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
      <ListGroupItem
        icon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
          </svg>
        }
      >
        Inbox
      </ListGroupItem>
      <ListGroupItem
        icon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
          </svg>
        }
      >
        Starred
      </ListGroupItem>
      <ListGroupItem
        icon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
          </svg>
        }
      >
        Trash
      </ListGroupItem>
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
        <small className="text-muted d-block mb-1">horizontal="sm"</small>
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
        <small className="text-muted d-block mb-1">horizontal="md"</small>
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
        <small className="text-muted d-block mb-1">horizontal="lg"</small>
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
          <h5 className="mb-1">List group item heading</h5>
          <small>3 days ago</small>
        </div>
        <p className="mb-1">Some placeholder content in a paragraph.</p>
        <small>And some small print.</small>
      </ListGroupItem>
      <ListGroupItem href="#">
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1">List group item heading</h5>
          <small className="text-body-secondary">3 days ago</small>
        </div>
        <p className="mb-1">Some placeholder content in a paragraph.</p>
        <small className="text-body-secondary">And some muted small print.</small>
      </ListGroupItem>
      <ListGroupItem href="#">
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1">List group item heading</h5>
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
        <h5 className="mb-2">Basic</h5>
        <ListGroup items={basicItems} />
      </section>

      {/* States */}
      <section>
        <h5 className="mb-2">States</h5>
        <ListGroup>
          <ListGroupItem active>Active</ListGroupItem>
          <ListGroupItem>Normal</ListGroupItem>
          <ListGroupItem disabled>Disabled</ListGroupItem>
        </ListGroup>
      </section>

      {/* Variants */}
      <section>
        <h5 className="mb-2">Variants</h5>
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
        <h5 className="mb-2">With Badges</h5>
        <ListGroup>
          <ListGroupItem badge={<Badge variant="primary" pill>14</Badge>}>
            Inbox
          </ListGroupItem>
          <ListGroupItem badge={<Badge variant="primary" pill>3</Badge>}>
            Drafts
          </ListGroupItem>
        </ListGroup>
      </section>

      {/* Horizontal */}
      <section>
        <h5 className="mb-2">Horizontal</h5>
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

