import { Accordion, Badge, Button, Heading } from '@dsai/react';
import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Accordion component for displaying collapsible content sections.
 * Built with Bootstrap 5 design tokens and FSM-driven animations.
 *
 * Features:
 * - Single mode (one panel at a time) or multiple mode (any panels open)
 * - Controlled and uncontrolled modes
 * - Smooth expand/collapse animations via CSS transitions
 * - Full keyboard navigation (Tab, Enter, Space)
 * - FSM state management for visual states
 * - Flush variant for edge-to-edge rendering
 *
 * @see https://getbootstrap.com/docs/5.3/components/accordion/
 */

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A fully accessible accordion component with collapsible content sections, ' +
          'keyboard navigation, and smooth animations. Supports single and multiple expansion modes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    selectionMode: {
      control: 'radio',
      options: ['single', 'multiple'],
      description: 'Selection mode for accordion items',
      table: {
        type: { summary: "'single' | 'multiple'" },
        defaultValue: { summary: 'single' },
      },
    },
    flush: {
      control: 'boolean',
      description: 'Render in flush mode (edge-to-edge)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    defaultActiveKeys: {
      control: 'object',
      description: 'Default expanded items (uncontrolled)',
      table: {
        type: { summary: 'string[]' },
        defaultValue: { summary: '[]' },
      },
    },
    activeKeys: {
      control: 'object',
      description: 'Currently expanded items (controlled)',
      table: {
        type: { summary: 'string[]' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// Basic Accordion
// =============================================================================

/**
 * Basic accordion with single selection mode (default).
 * Note: Wrap Accordion.Button in a heading element for semantic HTML structure.
 */
export const Basic: Story = {
  render: function BasicAccordion() {
    return (
      <Accordion>
        <Accordion.Item eventKey="1">
          <Heading level={2} className="accordion-header">
            <Accordion.Button>Accordion Item #1</Accordion.Button>
          </Heading>
          <Accordion.Panel>
            <strong>This is the first item&apos;s accordion body.</strong> It is shown by default,
            until the collapse plugin adds the appropriate classes that we use to style each
            element. These classes control the overall appearance, as well as the showing and hiding
            via CSS transitions.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Heading level={2} className="accordion-header">
            <Accordion.Button>Accordion Item #2</Accordion.Button>
          </Heading>
          <Accordion.Panel>
            <strong>This is the second item&apos;s accordion body.</strong> It is hidden by default,
            until the collapse plugin adds the appropriate classes that we use to style each
            element. These classes control the overall appearance, as well as the showing and hiding
            via CSS transitions.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Heading level={2} className="accordion-header">
            <Accordion.Button>Accordion Item #3</Accordion.Button>
          </Heading>
          <Accordion.Panel>
            <strong>This is the third item&apos;s accordion body.</strong> It is hidden by default,
            until the collapse plugin adds the appropriate classes that we use to style each
            element. These classes control the overall appearance, as well as the showing and hiding
            via CSS transitions.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );
  },
};

// =============================================================================
// Default Expanded
// =============================================================================

/**
 * Accordion with first item expanded by default
 */
export const DefaultExpanded: Story = {
  render: function DefaultExpandedAccordion() {
    return (
      <Accordion defaultActiveKeys={['1']}>
        <Accordion.Item eventKey="1">
          <Heading level={2} className="accordion-header">
            <Accordion.Button>Accordion Item #1 (Expanded by default)</Accordion.Button>
          </Heading>
          <Accordion.Panel>
            This panel is expanded by default because we passed{' '}
            <code>defaultActiveKeys={`['1']`}</code> to the Accordion.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Heading level={2} className="accordion-header">
            <Accordion.Button>Accordion Item #2</Accordion.Button>
          </Heading>
          <Accordion.Panel>This panel starts collapsed.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Heading level={2} className="accordion-header">
            <Accordion.Button>Accordion Item #3</Accordion.Button>
          </Heading>
          <Accordion.Panel>This panel also starts collapsed.</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );
  },
};

// =============================================================================
// Multiple Mode (Always Open)
// =============================================================================

/**
 * Accordion with multiple selection mode - multiple panels can be open simultaneously
 */
export const MultipleMode: Story = {
  render: function MultipleModeAccordion() {
    return (
      <Accordion selectionMode="multiple" defaultActiveKeys={['1', '2']}>
        <Accordion.Item eventKey="1">
          <Heading level={2} className="accordion-header">
            <Accordion.Button>Accordion Item #1</Accordion.Button>
          </Heading>
          <Accordion.Panel>
            <strong>Multiple panels can be open at once.</strong> This accordion uses{' '}
            <code>selectionMode=&quot;multiple&quot;</code> which is equivalent to Bootstrap&apos;s
            &quot;Always open&quot; feature.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Heading level={2} className="accordion-header">
            <Accordion.Button>Accordion Item #2</Accordion.Button>
          </Heading>
          <Accordion.Panel>
            <strong>This panel is also open by default.</strong> Each panel operates independently -
            opening or closing one does not affect the others.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Heading level={2} className="accordion-header">
            <Accordion.Button>Accordion Item #3</Accordion.Button>
          </Heading>
          <Accordion.Panel>
            This panel starts collapsed but can be opened without closing the others.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );
  },
};

// =============================================================================
// Flush Variant
// =============================================================================

/**
 * Flush accordion that renders edge-to-edge with parent container
 */
export const Flush: Story = {
  render: function FlushAccordion() {
    return (
      <div style={{ backgroundColor: '#f8f9fa', padding: '1rem' }}>
        <Accordion flush>
          <Accordion.Item eventKey="1">
            <Heading level={2} className="accordion-header">
              <Accordion.Button>Accordion Item #1</Accordion.Button>
            </Heading>
            <Accordion.Panel>
              <strong>This is the flush variant.</strong> It removes borders and rounded corners to
              render edge-to-edge with the parent container.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Heading level={2} className="accordion-header">
              <Accordion.Button>Accordion Item #2</Accordion.Button>
            </Heading>
            <Accordion.Panel>
              The flush variant is useful when embedding accordions in cards or other containers
              where you want seamless integration.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Heading level={2} className="accordion-header">
              <Accordion.Button>Accordion Item #3</Accordion.Button>
            </Heading>
            <Accordion.Panel>
              Use the <code>flush</code> prop to enable this variant.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
    );
  },
};

// =============================================================================
// Controlled Accordion
// =============================================================================

/**
 * Controlled accordion with external state management
 */
export const Controlled: Story = {
  render: function ControlledAccordion() {
    const [activeKeys, setActiveKeys] = useState<string[]>(['1']);

    return (
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <strong>Active Keys:</strong> {activeKeys.length > 0 ? activeKeys.join(', ') : '(none)'}
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
            <Button size="sm" variant="outline-primary" onClick={() => setActiveKeys(['1'])}>
              Open #1
            </Button>
            <Button size="sm" variant="outline-primary" onClick={() => setActiveKeys(['2'])}>
              Open #2
            </Button>
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() => setActiveKeys(['1', '2', '3'])}
            >
              Open All
            </Button>
            <Button size="sm" variant="outline-secondary" onClick={() => setActiveKeys([])}>
              Close All
            </Button>
          </div>
        </div>
        <Accordion
          selectionMode="multiple"
          activeKeys={activeKeys}
          onActiveKeysChange={setActiveKeys}
        >
          <Accordion.Item eventKey="1">
            <Heading level={2} className="accordion-header">
              <Accordion.Button>Accordion Item #1</Accordion.Button>
            </Heading>
            <Accordion.Panel>Content for section 1</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Heading level={2} className="accordion-header">
              <Accordion.Button>Accordion Item #2</Accordion.Button>
            </Heading>
            <Accordion.Panel>Content for section 2</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Heading level={2} className="accordion-header">
              <Accordion.Button>Accordion Item #3</Accordion.Button>
            </Heading>
            <Accordion.Panel>Content for section 3</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
    );
  },
};

// =============================================================================
// Disabled Items
// =============================================================================

/**
 * Accordion with disabled items that cannot be expanded/collapsed
 */
export const DisabledItems: Story = {
  render: function DisabledItemsAccordion() {
    return (
      <Accordion defaultActiveKeys={['1']}>
        <Accordion.Item eventKey="1">
          <Heading level={2} className="accordion-header">
            <Accordion.Button>Accordion Item #1 (Enabled)</Accordion.Button>
          </Heading>
          <Accordion.Panel>This item is enabled and can be toggled.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item eventKey="2" disabled>
          <Heading level={2} className="accordion-header">
            <Accordion.Button>Accordion Item #2 (Disabled)</Accordion.Button>
          </Heading>
          <Accordion.Panel>This item is disabled and cannot be expanded.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Heading level={2} className="accordion-header">
            <Accordion.Button>Accordion Item #3 (Enabled)</Accordion.Button>
          </Heading>
          <Accordion.Panel>This item is also enabled.</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );
  },
};

// =============================================================================
// With Rich Content
// =============================================================================

/**
 * Accordion with rich content in panels including lists, badges, and nested elements
 */
export const WithRichContent: Story = {
  render: function RichContentAccordion() {
    return (
      <Accordion defaultActiveKeys={['features']}>
        <Accordion.Item eventKey="features">
          <Heading level={2} className="accordion-header">
            <Accordion.Button>
              Features <Badge variant="primary">New</Badge>
            </Accordion.Button>
          </Heading>
          <Accordion.Panel>
            <Heading level={5}>Key Features</Heading>
            <ul>
              <li>Fully accessible with WCAG 2.2 AA compliance</li>
              <li>Keyboard navigation support</li>
              <li>Smooth animations with CSS transitions</li>
              <li>Single and multiple selection modes</li>
            </ul>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item eventKey="pricing">
          <Heading level={2} className="accordion-header">
            <Accordion.Button>
              Pricing <Badge variant="success">Free</Badge>
            </Accordion.Button>
          </Heading>
          <Accordion.Panel>
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Price</th>
                  <th>Features</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Basic</td>
                  <td>Free</td>
                  <td>Core features</td>
                </tr>
                <tr>
                  <td>Pro</td>
                  <td>$9/mo</td>
                  <td>Advanced features</td>
                </tr>
                <tr>
                  <td>Enterprise</td>
                  <td>Contact us</td>
                  <td>Custom solutions</td>
                </tr>
              </tbody>
            </table>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item eventKey="faq">
          <Heading level={2} className="accordion-header">
            <Accordion.Button>FAQ</Accordion.Button>
          </Heading>
          <Accordion.Panel>
            <div className="accordion-body">
              <p>
                <strong>Q: Is it accessible?</strong>
              </p>
              <p>A: Yes! The accordion is fully WCAG 2.2 AA compliant.</p>
              <p>
                <strong>Q: Does it support keyboard navigation?</strong>
              </p>
              <p>A: Yes, use Tab to navigate and Enter/Space to toggle.</p>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );
  },
};

// =============================================================================
// With Callbacks
// =============================================================================

/**
 * Accordion with expand/collapse callbacks for tracking state changes
 */
export const WithCallbacks: Story = {
  render: function CallbacksAccordion() {
    const [events, setEvents] = useState<string[]>([]);

    const addEvent = (event: string): void => {
      setEvents((prev) => [...prev.slice(-4), event]);
    };

    return (
      <div>
        <Accordion
          onItemExpand={(key: string) => addEvent(`Expanded: ${key}`)}
          onItemCollapse={(key: string) => addEvent(`Collapsed: ${key}`)}
          onItemToggle={(key: string, { expanded }: { expanded: boolean }) =>
            addEvent(`Toggle: ${key} → ${expanded ? 'open' : 'closed'}`)
          }
        >
          <Accordion.Item eventKey="1">
            <Heading level={2} className="accordion-header">
              <Accordion.Button>Accordion Item #1</Accordion.Button>
            </Heading>
            <Accordion.Panel>Click to expand/collapse and see events logged below.</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Heading level={2} className="accordion-header">
              <Accordion.Button>Accordion Item #2</Accordion.Button>
            </Heading>
            <Accordion.Panel>Each expansion and collapse fires a callback.</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Heading level={2} className="accordion-header">
              <Accordion.Button>Accordion Item #3</Accordion.Button>
            </Heading>
            <Accordion.Panel>
              Use <code>onItemExpand</code> and <code>onItemCollapse</code> to track changes.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        <div
          style={{
            marginTop: '1rem',
            padding: '0.5rem',
            background: '#f1f1f1',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
          }}
        >
          <strong>Events:</strong>
          <ul style={{ margin: 0, padding: '0.5rem 0 0 1.5rem' }}>
            {events.length === 0 ? (
              <li style={{ color: '#666' }}>No events yet...</li>
            ) : (
              events.map((event, i) => <li key={`event-${i}-${event}`}>{event}</li>)
            )}
          </ul>
        </div>
      </div>
    );
  },
};

// =============================================================================
// Nested Accordions
// =============================================================================

/**
 * Accordion with nested accordions inside panels
 */
export const NestedAccordions: Story = {
  render: function NestedAccordionsStory() {
    return (
      <Accordion defaultActiveKeys={['outer-1']}>
        <Accordion.Item eventKey="outer-1">
          <Heading level={2} className="accordion-header">
            <Accordion.Button>Parent Accordion #1</Accordion.Button>
          </Heading>
          <Accordion.Panel>
            <p>This panel contains a nested accordion:</p>
            <Accordion flush>
              <Accordion.Item eventKey="inner-1">
                <Heading level={3} className="accordion-header">
                  <Accordion.Button>Nested Item #1</Accordion.Button>
                </Heading>
                <Accordion.Panel>Nested content 1</Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item eventKey="inner-2">
                <Heading level={3} className="accordion-header">
                  <Accordion.Button>Nested Item #2</Accordion.Button>
                </Heading>
                <Accordion.Panel>Nested content 2</Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item eventKey="outer-2">
          <Heading level={2} className="accordion-header">
            <Accordion.Button>Parent Accordion #2</Accordion.Button>
          </Heading>
          <Accordion.Panel>Regular content without nested accordion.</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );
  },
};

// =============================================================================
// Keyboard Navigation Demo
// =============================================================================

/**
 * Demonstrates keyboard navigation capabilities
 */
export const KeyboardNavigation: Story = {
  render: function KeyboardNavigationAccordion() {
    return (
      <div>
        <div className="alert alert-info" role="alert">
          <strong>Keyboard Navigation:</strong>
          <ul className="mb-0">
            <li>
              <kbd>Tab</kbd> / <kbd>Shift+Tab</kbd> - Navigate between accordion buttons
            </li>
            <li>
              <kbd>Enter</kbd> or <kbd>Space</kbd> - Toggle accordion item
            </li>
            <li>
              <kbd>↓</kbd> / <kbd>↑</kbd> - Move focus to next/previous button (wraps)
            </li>
            <li>
              <kbd>Home</kbd> / <kbd>End</kbd> - Move focus to first/last button
            </li>
          </ul>
        </div>
        <Accordion>
          <Accordion.Item eventKey="1">
            <Heading level={2} className="accordion-header">
              <Accordion.Button>Press Tab to navigate here</Accordion.Button>
            </Heading>
            <Accordion.Panel>
              Use Enter or Space to toggle. The focus remains on the button after toggling.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Heading level={2} className="accordion-header">
              <Accordion.Button>Tab again to reach this button</Accordion.Button>
            </Heading>
            <Accordion.Panel>Each button is a focusable element in the tab order.</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Heading level={2} className="accordion-header">
              <Accordion.Button>And one more Tab to reach this one</Accordion.Button>
            </Heading>
            <Accordion.Panel>
              All interactions are fully keyboard accessible for WCAG 2.2 AA compliance.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
    );
  },
};

// =============================================================================
// Visual States
// =============================================================================

/**
 * Shows the data-visual-state attribute for styling and testing
 */
export const VisualStates: Story = {
  render: function VisualStatesAccordion() {
    return (
      <div>
        <div className="alert alert-secondary mb-3" role="alert">
          <strong>Visual States:</strong> Each accordion item has a <code>data-visual-state</code>{' '}
          attribute that can be used for custom styling or testing. States: <code>collapsed</code>,{' '}
          <code>expanding</code>, <code>expanded</code>, <code>collapsing</code>
        </div>
        <Accordion defaultActiveKeys={['1']}>
          <Accordion.Item eventKey="1" data-testid="item-1">
            <Heading level={2} className="accordion-header">
              <Accordion.Button>Expanded Item (check data-visual-state)</Accordion.Button>
            </Heading>
            <Accordion.Panel>
              This item is expanded. Inspect the accordion-item element to see{' '}
              <code>data-visual-state=&quot;expanded&quot;</code>.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item eventKey="2" data-testid="item-2">
            <Heading level={2} className="accordion-header">
              <Accordion.Button>Collapsed Item</Accordion.Button>
            </Heading>
            <Accordion.Panel>
              This item is collapsed. It has <code>data-visual-state=&quot;collapsed&quot;</code>.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
    );
  },
};
