/**
 * Accordion Component Tests
 *
 * Comprehensive unit tests for the Accordion component covering:
 * - Rendering and structure
 * - Controlled and uncontrolled modes
 * - Single and multiple selection modes
 * - Keyboard interactions
 * - Event callbacks
 * - Visual states and CSS classes
 * - Accessibility attributes
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Accordion } from './Accordion';

// =============================================================================
// Test Setup
// =============================================================================

const defaultItems = [
  { key: '1', title: 'Item 1', content: 'Content 1' },
  { key: '2', title: 'Item 2', content: 'Content 2' },
  { key: '3', title: 'Item 3', content: 'Content 3' },
];

const renderAccordion = (props: Partial<React.ComponentProps<typeof Accordion>> = {}) => {
  return render(
    <Accordion {...props}>
      {defaultItems.map((item) => (
        <Accordion.Item key={item.key} eventKey={item.key}>
          <Accordion.Button>{item.title}</Accordion.Button>
          <Accordion.Panel>{item.content}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

// =============================================================================
// Rendering Tests
// =============================================================================

describe('Accordion', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderAccordion();
      expect(screen.getAllByRole('region', { hidden: true }).length).toBeGreaterThan(0);
    });

    it('renders with the accordion class', () => {
      const { container } = renderAccordion();
      expect(container.querySelector('.accordion')).toBeInTheDocument();
    });

    it('renders all accordion items', () => {
      renderAccordion();
      expect(screen.getAllByRole('button')).toHaveLength(3);
    });

    it('renders with custom className', () => {
      const { container } = renderAccordion({ className: 'custom-accordion' });
      expect(container.querySelector('.accordion.custom-accordion')).toBeInTheDocument();
    });

    it('renders with custom data-testid', () => {
      renderAccordion({ 'data-testid': 'test-accordion' });
      expect(screen.getByTestId('test-accordion')).toBeInTheDocument();
    });

    it('renders with flush variant', () => {
      const { container } = renderAccordion({ flush: true });
      expect(container.querySelector('.accordion-flush')).toBeInTheDocument();
    });

    it('applies custom id to accordion', () => {
      renderAccordion({ id: 'my-accordion' });
      expect(document.getElementById('my-accordion')).toBeInTheDocument();
    });

    it('forwards ref to accordion element', () => {
      const ref = { current: null };
      render(
        <Accordion ref={ref}>
          <Accordion.Item eventKey="1">
            <Accordion.Button>Test</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  // ===========================================================================
  // Accordion Item Tests
  // ===========================================================================

  describe('Accordion.Item', () => {
    it('renders with accordion-item class', () => {
      const { container } = renderAccordion();
      expect(container.querySelectorAll('.accordion-item')).toHaveLength(3);
    });

    it('renders with custom className', () => {
      render(
        <Accordion>
          <Accordion.Item eventKey="1" className="custom-item">
            <Accordion.Button>Test</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
      expect(document.querySelector('.accordion-item.custom-item')).toBeInTheDocument();
    });

    it('renders with custom data-testid', () => {
      render(
        <Accordion>
          <Accordion.Item eventKey="1" data-testid="test-item">
            <Accordion.Button>Test</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
      expect(screen.getByTestId('test-item')).toBeInTheDocument();
    });

    it('applies disabled state correctly', () => {
      render(
        <Accordion>
          <Accordion.Item eventKey="1" disabled>
            <Accordion.Button>Test</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  // ===========================================================================
  // Accordion Button Tests
  // ===========================================================================

  describe('Accordion.Button', () => {
    it('renders as a button element', () => {
      renderAccordion();
      expect(screen.getAllByRole('button')).toHaveLength(3);
    });

    it('renders with accordion-button class', () => {
      const { container } = renderAccordion();
      expect(container.querySelectorAll('.accordion-button')).toHaveLength(3);
    });

    it('renders button text content', () => {
      renderAccordion();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('has collapsed class when not expanded', () => {
      const { container } = renderAccordion();
      expect(container.querySelectorAll('.accordion-button.collapsed')).toHaveLength(3);
    });

    it('removes collapsed class when expanded', () => {
      renderAccordion({ defaultActiveKeys: ['1'] });
      const button = screen.getByText('Item 1');
      expect(button).not.toHaveClass('collapsed');
    });

    it('has correct aria-expanded attribute when collapsed', () => {
      renderAccordion();
      expect(screen.getByText('Item 1')).toHaveAttribute('aria-expanded', 'false');
    });

    it('has correct aria-expanded attribute when expanded', () => {
      renderAccordion({ defaultActiveKeys: ['1'] });
      expect(screen.getByText('Item 1')).toHaveAttribute('aria-expanded', 'true');
    });

    it('has aria-controls pointing to panel', () => {
      const { container } = renderAccordion();
      const button = screen.getByText('Item 1');
      const panelId = button.getAttribute('aria-controls');
      expect(panelId).toBeTruthy();
      expect(container.querySelector(`#${panelId}`)).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(
        <Accordion>
          <Accordion.Item eventKey="1">
            <Accordion.Button className="custom-button">Test</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
      expect(document.querySelector('.accordion-button.custom-button')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Accordion Panel Tests
  // ===========================================================================

  describe('Accordion.Panel', () => {
    it('renders with accordion-collapse class', () => {
      const { container } = renderAccordion();
      expect(container.querySelectorAll('.accordion-collapse')).toHaveLength(3);
    });

    it('renders with collapse class', () => {
      const { container } = renderAccordion();
      expect(container.querySelectorAll('.collapse')).toHaveLength(3);
    });

    it('has show class when expanded', () => {
      const { container } = renderAccordion({ defaultActiveKeys: ['1'] });
      const panels = container.querySelectorAll('.accordion-collapse');
      expect(panels[0]).toHaveClass('show');
      expect(panels[1]).not.toHaveClass('show');
      expect(panels[2]).not.toHaveClass('show');
    });

    it('renders panel content', () => {
      renderAccordion({ defaultActiveKeys: ['1'] });
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });

    it('has role="region" attribute', () => {
      renderAccordion();
      const regions = screen.getAllByRole('region', { hidden: true });
      expect(regions.length).toBeGreaterThan(0);
    });

    it('has aria-labelledby pointing to button', () => {
      const { container } = renderAccordion();
      const button = screen.getByText('Item 1');
      const buttonId = button.id;
      const panel = container.querySelector('.accordion-collapse');
      expect(panel).toHaveAttribute('aria-labelledby', buttonId);
    });

    it('renders accordion-body wrapper', () => {
      const { container } = renderAccordion({ defaultActiveKeys: ['1'] });
      expect(container.querySelector('.accordion-body')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(
        <Accordion defaultActiveKeys={['1']}>
          <Accordion.Item eventKey="1">
            <Accordion.Button>Test</Accordion.Button>
            <Accordion.Panel className="custom-panel">Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
      expect(document.querySelector('.accordion-collapse.custom-panel')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Uncontrolled Mode Tests
  // ===========================================================================

  describe('Uncontrolled Mode', () => {
    it('starts with no items expanded by default', () => {
      const { container } = renderAccordion();
      expect(container.querySelectorAll('.accordion-collapse.show')).toHaveLength(0);
    });

    it('respects defaultActiveKeys prop', () => {
      const { container } = renderAccordion({
        defaultActiveKeys: ['1', '2'],
        selectionMode: 'multiple',
      });
      const showPanels = container.querySelectorAll('.accordion-collapse.show');
      expect(showPanels).toHaveLength(2);
    });

    it('toggles item on click in uncontrolled mode', async () => {
      const user = userEvent.setup();
      const { container } = renderAccordion();

      const button1 = screen.getByText('Item 1');
      await user.click(button1);

      expect(container.querySelector('.accordion-collapse.show')).toBeInTheDocument();
    });

    it('collapses other items in single mode (default)', async () => {
      const user = userEvent.setup();
      renderAccordion({ defaultActiveKeys: ['1'] });

      // Click Item 2 should collapse Item 1
      const button2 = screen.getByText('Item 2');
      await user.click(button2);

      expect(screen.getByText('Item 1')).toHaveAttribute('aria-expanded', 'false');
      expect(screen.getByText('Item 2')).toHaveAttribute('aria-expanded', 'true');
    });

    it('keeps multiple items open in multiple mode', async () => {
      const user = userEvent.setup();
      renderAccordion({ selectionMode: 'multiple', defaultActiveKeys: ['1'] });

      // Click Item 2 should keep Item 1 open
      const button2 = screen.getByText('Item 2');
      await user.click(button2);

      expect(screen.getByText('Item 1')).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Item 2')).toHaveAttribute('aria-expanded', 'true');
    });

    it('allows toggling off an expanded item', async () => {
      const user = userEvent.setup();
      renderAccordion({ defaultActiveKeys: ['1'] });

      const button1 = screen.getByText('Item 1');
      await user.click(button1);

      expect(button1).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // ===========================================================================
  // Controlled Mode Tests
  // ===========================================================================

  describe('Controlled Mode', () => {
    it('respects activeKeys prop', () => {
      renderAccordion({ activeKeys: ['2'] });
      expect(screen.getByText('Item 1')).toHaveAttribute('aria-expanded', 'false');
      expect(screen.getByText('Item 2')).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Item 3')).toHaveAttribute('aria-expanded', 'false');
    });

    it('calls onActiveKeysChange on toggle', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      renderAccordion({ activeKeys: ['1'], onActiveKeysChange: handleChange });

      const button2 = screen.getByText('Item 2');
      await user.click(button2);

      expect(handleChange).toHaveBeenCalledWith(['2']);
    });

    it('does not change state without activeKeys update', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      renderAccordion({ activeKeys: ['1'], onActiveKeysChange: handleChange });

      const button2 = screen.getByText('Item 2');
      await user.click(button2);

      // Should still show Item 1 as expanded (controlled)
      expect(screen.getByText('Item 1')).toHaveAttribute('aria-expanded', 'true');
    });

    it('updates when activeKeys prop changes', () => {
      const { rerender } = render(
        <Accordion activeKeys={['1']}>
          <Accordion.Item eventKey="1">
            <Accordion.Button>Item 1</Accordion.Button>
            <Accordion.Panel>Content 1</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Button>Item 2</Accordion.Button>
            <Accordion.Panel>Content 2</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      expect(screen.getByText('Item 1')).toHaveAttribute('aria-expanded', 'true');

      rerender(
        <Accordion activeKeys={['2']}>
          <Accordion.Item eventKey="1">
            <Accordion.Button>Item 1</Accordion.Button>
            <Accordion.Panel>Content 1</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Button>Item 2</Accordion.Button>
            <Accordion.Panel>Content 2</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      expect(screen.getByText('Item 1')).toHaveAttribute('aria-expanded', 'false');
      expect(screen.getByText('Item 2')).toHaveAttribute('aria-expanded', 'true');
    });

    it('provides correct active keys in callback for multiple mode', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      renderAccordion({
        selectionMode: 'multiple',
        activeKeys: ['1'],
        onActiveKeysChange: handleChange,
      });

      const button2 = screen.getByText('Item 2');
      await user.click(button2);

      expect(handleChange).toHaveBeenCalledWith(['1', '2']);
    });

    it('provides correct active keys when closing in multiple mode', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      renderAccordion({
        selectionMode: 'multiple',
        activeKeys: ['1', '2'],
        onActiveKeysChange: handleChange,
      });

      const button1 = screen.getByText('Item 1');
      await user.click(button1);

      expect(handleChange).toHaveBeenCalledWith(['2']);
    });
  });

  // ===========================================================================
  // Keyboard Interaction Tests
  // ===========================================================================

  describe('Keyboard Interactions', () => {
    it('toggles on Enter key', async () => {
      const user = userEvent.setup();
      renderAccordion();

      const button1 = screen.getByText('Item 1');
      button1.focus();
      await user.keyboard('{Enter}');

      expect(button1).toHaveAttribute('aria-expanded', 'true');
    });

    it('toggles on Space key', async () => {
      const user = userEvent.setup();
      renderAccordion();

      const button1 = screen.getByText('Item 1');
      button1.focus();
      await user.keyboard(' ');

      expect(button1).toHaveAttribute('aria-expanded', 'true');
    });

    it('moves focus with Tab key', async () => {
      const user = userEvent.setup();
      renderAccordion();

      const button1 = screen.getByText('Item 1');
      const button2 = screen.getByText('Item 2');

      button1.focus();
      expect(document.activeElement).toBe(button1);

      await user.tab();
      expect(document.activeElement).toBe(button2);
    });

    it('moves focus backwards with Shift+Tab', async () => {
      const user = userEvent.setup();
      renderAccordion();

      const button1 = screen.getByText('Item 1');
      const button2 = screen.getByText('Item 2');

      button2.focus();
      await user.tab({ shift: true });
      expect(document.activeElement).toBe(button1);
    });
  });

  // ===========================================================================
  // Disabled State Tests
  // ===========================================================================

  describe('Disabled State', () => {
    it('prevents toggle when item is disabled', async () => {
      const user = userEvent.setup();
      render(
        <Accordion>
          <Accordion.Item eventKey="1" disabled>
            <Accordion.Button>Disabled Item</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      const button = screen.getByText('Disabled Item');
      await user.click(button);

      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('renders disabled button correctly', () => {
      render(
        <Accordion>
          <Accordion.Item eventKey="1" disabled>
            <Accordion.Button>Disabled Item</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('does not call onActiveKeysChange for disabled items', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      render(
        <Accordion onActiveKeysChange={handleChange}>
          <Accordion.Item eventKey="1" disabled>
            <Accordion.Button>Disabled Item</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      const button = screen.getByText('Disabled Item');
      await user.click(button);

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // Visual State Tests
  // ===========================================================================

  describe('Visual States', () => {
    it('applies data-visual-state attribute to items', () => {
      render(
        <Accordion defaultActiveKeys={['1']}>
          <Accordion.Item eventKey="1" data-testid="item-1">
            <Accordion.Button>Item 1</Accordion.Button>
            <Accordion.Panel>Content 1</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item eventKey="2" data-testid="item-2">
            <Accordion.Button>Item 2</Accordion.Button>
            <Accordion.Panel>Content 2</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      expect(screen.getByTestId('item-1')).toHaveAttribute('data-visual-state', 'expanded');
      expect(screen.getByTestId('item-2')).toHaveAttribute('data-visual-state', 'collapsed');
    });
  });

  // ===========================================================================
  // Edge Cases
  // ===========================================================================

  describe('Edge Cases', () => {
    it('handles empty accordion', () => {
      const { container } = render(<Accordion>{null}</Accordion>);
      expect(container.querySelector('.accordion')).toBeInTheDocument();
    });

    it('handles single item accordion', () => {
      render(
        <Accordion>
          <Accordion.Item eventKey="1">
            <Accordion.Button>Single Item</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('handles rapid toggling', async () => {
      const user = userEvent.setup();
      renderAccordion();

      const button1 = screen.getByText('Item 1');

      // Rapid clicks
      await user.click(button1);
      await user.click(button1);
      await user.click(button1);

      // Should end up expanded (odd number of clicks)
      expect(button1).toHaveAttribute('aria-expanded', 'true');
    });

    it('handles activeKeys with non-existent key', () => {
      renderAccordion({ activeKeys: ['nonexistent'] });
      // Should not crash
      expect(screen.getAllByRole('button')).toHaveLength(3);
    });

    it('handles switching from uncontrolled to controlled', () => {
      const { rerender } = render(
        <Accordion defaultActiveKeys={['1']}>
          <Accordion.Item eventKey="1">
            <Accordion.Button>Item 1</Accordion.Button>
            <Accordion.Panel>Content 1</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      rerender(
        <Accordion activeKeys={['1']}>
          <Accordion.Item eventKey="1">
            <Accordion.Button>Item 1</Accordion.Button>
            <Accordion.Panel>Content 1</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      // Should not crash and maintain state
      expect(screen.getByText('Item 1')).toHaveAttribute('aria-expanded', 'true');
    });
  });

  // ===========================================================================
  // Event Callback Tests
  // ===========================================================================

  describe('Event Callbacks', () => {
    it('calls onItemExpand when an item is expanded', async () => {
      const handleExpand = jest.fn();
      const user = userEvent.setup();
      render(
        <Accordion onItemExpand={handleExpand}>
          <Accordion.Item eventKey="1">
            <Accordion.Button>Item 1</Accordion.Button>
            <Accordion.Panel>Content 1</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      await user.click(screen.getByText('Item 1'));

      expect(handleExpand).toHaveBeenCalledWith('1');
    });

    it('calls onItemCollapse when collapsing', async () => {
      const handleCollapse = jest.fn();
      const user = userEvent.setup();
      render(
        <Accordion onItemCollapse={handleCollapse} defaultActiveKeys={['1']}>
          <Accordion.Item eventKey="1">
            <Accordion.Button>Item 1</Accordion.Button>
            <Accordion.Panel>Content 1</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      await user.click(screen.getByText('Item 1'));

      expect(handleCollapse).toHaveBeenCalledWith('1');
    });

    it('calls onItemToggle with expanded: true when expanding', async () => {
      const handleToggle = jest.fn();
      const user = userEvent.setup();
      render(
        <Accordion onItemToggle={handleToggle}>
          <Accordion.Item eventKey="1">
            <Accordion.Button>Item 1</Accordion.Button>
            <Accordion.Panel>Content 1</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      await user.click(screen.getByText('Item 1'));

      expect(handleToggle).toHaveBeenCalledWith('1', { expanded: true });
    });

    it('calls onItemToggle with expanded: false when collapsing', async () => {
      const handleToggle = jest.fn();
      const user = userEvent.setup();
      render(
        <Accordion onItemToggle={handleToggle} defaultActiveKeys={['1']}>
          <Accordion.Item eventKey="1">
            <Accordion.Button>Item 1</Accordion.Button>
            <Accordion.Panel>Content 1</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      await user.click(screen.getByText('Item 1'));

      expect(handleToggle).toHaveBeenCalledWith('1', { expanded: false });
    });

    it('calls onItemToggle alongside onItemExpand and onItemCollapse', async () => {
      const handleExpand = jest.fn();
      const handleCollapse = jest.fn();
      const handleToggle = jest.fn();
      const user = userEvent.setup();
      render(
        <Accordion
          onItemExpand={handleExpand}
          onItemCollapse={handleCollapse}
          onItemToggle={handleToggle}
        >
          <Accordion.Item eventKey="1">
            <Accordion.Button>Item 1</Accordion.Button>
            <Accordion.Panel>Content 1</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      // Expand
      await user.click(screen.getByText('Item 1'));
      expect(handleExpand).toHaveBeenCalledWith('1');
      expect(handleToggle).toHaveBeenCalledWith('1', { expanded: true });

      // Collapse
      await user.click(screen.getByText('Item 1'));
      expect(handleCollapse).toHaveBeenCalledWith('1');
      expect(handleToggle).toHaveBeenCalledWith('1', { expanded: false });
    });
  });

  // ===========================================================================
  // Arrow Key Navigation Tests
  // ===========================================================================

  describe('Arrow Key Navigation', () => {
    it('moves focus to next button on ArrowDown', async () => {
      const user = userEvent.setup();
      renderAccordion();

      const buttons = screen.getAllByRole('button');
      buttons[0].focus();
      expect(buttons[0]).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      expect(buttons[1]).toHaveFocus();
    });

    it('moves focus to previous button on ArrowUp', async () => {
      const user = userEvent.setup();
      renderAccordion();

      const buttons = screen.getAllByRole('button');
      buttons[1].focus();
      expect(buttons[1]).toHaveFocus();

      await user.keyboard('{ArrowUp}');
      expect(buttons[0]).toHaveFocus();
    });

    it('wraps focus from last to first on ArrowDown', async () => {
      const user = userEvent.setup();
      renderAccordion();

      const buttons = screen.getAllByRole('button');
      buttons[2].focus();
      expect(buttons[2]).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      expect(buttons[0]).toHaveFocus();
    });

    it('wraps focus from first to last on ArrowUp', async () => {
      const user = userEvent.setup();
      renderAccordion();

      const buttons = screen.getAllByRole('button');
      buttons[0].focus();
      expect(buttons[0]).toHaveFocus();

      await user.keyboard('{ArrowUp}');
      expect(buttons[2]).toHaveFocus();
    });

    it('skips disabled buttons when navigating', async () => {
      const user = userEvent.setup();
      render(
        <Accordion>
          <Accordion.Item eventKey="1">
            <Accordion.Button>Item 1</Accordion.Button>
            <Accordion.Panel>Content 1</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item eventKey="2" disabled>
            <Accordion.Button>Item 2 (Disabled)</Accordion.Button>
            <Accordion.Panel>Content 2</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Accordion.Button>Item 3</Accordion.Button>
            <Accordion.Panel>Content 3</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      const buttons = screen.getAllByRole('button');
      buttons[0].focus();
      expect(buttons[0]).toHaveFocus();

      // Should skip disabled button and go to Item 3
      await user.keyboard('{ArrowDown}');
      expect(buttons[2]).toHaveFocus();
    });

    it('does not respond to arrow keys when button is disabled', async () => {
      const user = userEvent.setup();
      render(
        <Accordion>
          <Accordion.Item eventKey="1">
            <Accordion.Button>Item 1</Accordion.Button>
            <Accordion.Panel>Content 1</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item eventKey="2" disabled>
            <Accordion.Button>Item 2 (Disabled)</Accordion.Button>
            <Accordion.Panel>Content 2</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Accordion.Button>Item 3</Accordion.Button>
            <Accordion.Panel>Content 3</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      const buttons = screen.getAllByRole('button');
      // Focus first non-disabled button
      buttons[0].focus();
      expect(buttons[0]).toHaveFocus();

      // Navigate down - should skip disabled and go to Item 3
      await user.keyboard('{ArrowDown}');
      expect(buttons[2]).toHaveFocus();

      // Navigate up from Item 3 - should skip disabled and go back to Item 1
      await user.keyboard('{ArrowUp}');
      expect(buttons[0]).toHaveFocus();
    });
  });

  // ===========================================================================
  // DisplayName Tests
  // ===========================================================================

  describe('Display Names', () => {
    it('has correct displayName for Accordion', () => {
      // Access the root component name
      expect(Accordion.displayName).toBe('Accordion');
    });

    it('has correct displayName for subcomponents', () => {
      expect(Accordion.Item.displayName).toBe('Accordion.Item');
      expect(Accordion.Button.displayName).toBe('Accordion.Button');
      expect(Accordion.Panel.displayName).toBe('Accordion.Panel');
    });
  });
});
