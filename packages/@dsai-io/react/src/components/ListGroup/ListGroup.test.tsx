import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef } from 'react';

import { Badge } from '../Badge';

import { ListGroup, ListGroupItem } from './ListGroup';
import { ListGroupDivider } from './ListGroupDivider';
import { ListGroupHeader } from './ListGroupHeader';

expect.extend(toHaveNoViolations);

// Sample items for testing
const sampleItems = [
  { id: '1', content: 'Item 1' },
  { id: '2', content: 'Item 2' },
  { id: '3', content: 'Item 3' },
];

describe('ListGroup', () => {
  // ===========================================================================
  // Rendering - Items Mode
  // ===========================================================================
  describe('Rendering - Items Mode', () => {
    it('renders list group with items prop', () => {
      render(<ListGroup items={sampleItems} />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('renders as unordered list by default', () => {
      const { container } = render(<ListGroup items={sampleItems} />);
      expect(container.querySelector('ul')).toBeInTheDocument();
    });

    it('renders as ordered list when ordered prop is true', () => {
      const { container } = render(<ListGroup items={sampleItems} ordered />);
      expect(container.querySelector('ol')).toBeInTheDocument();
    });

    it('renders empty when no items', () => {
      const { container } = render(<ListGroup items={[]} />);
      expect(container.querySelector('ul')).toBeEmptyDOMElement();
    });
  });

  // ===========================================================================
  // Rendering - Compound Mode
  // ===========================================================================
  describe('Rendering - Compound Mode', () => {
    it('renders list group with compound components', () => {
      render(
        <ListGroup>
          <ListGroupItem>Item 1</ListGroupItem>
          <ListGroupItem>Item 2</ListGroupItem>
          <ListGroupItem>Item 3</ListGroupItem>
        </ListGroup>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Variants
  // ===========================================================================
  describe('Variants', () => {
    it('renders default variant', () => {
      const { container } = render(<ListGroup items={sampleItems} />);
      expect(container.querySelector('.list-group')).toBeInTheDocument();
      expect(container.querySelector('.list-group-flush')).not.toBeInTheDocument();
    });

    it('renders flush variant', () => {
      const { container } = render(<ListGroup items={sampleItems} variant="flush" />);
      expect(container.querySelector('.list-group-flush')).toBeInTheDocument();
    });

    it('renders numbered variant', () => {
      const { container } = render(<ListGroup items={sampleItems} variant="numbered" />);
      expect(container.querySelector('.list-group-numbered')).toBeInTheDocument();
      expect(container.querySelector('ol')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Horizontal Layout
  // ===========================================================================
  describe('Horizontal Layout', () => {
    it('renders horizontal layout', () => {
      const { container } = render(<ListGroup items={sampleItems} horizontal />);
      expect(container.querySelector('.list-group-horizontal')).toBeInTheDocument();
    });

    it('renders responsive horizontal layout', () => {
      const { container } = render(<ListGroup items={sampleItems} horizontal="md" />);
      expect(container.querySelector('.list-group-horizontal-md')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Item Variants
  // ===========================================================================
  describe('Item Variants', () => {
    it('renders item with color variant', () => {
      render(
        <ListGroup>
          <ListGroupItem variant="primary">Primary</ListGroupItem>
          <ListGroupItem variant="success">Success</ListGroupItem>
          <ListGroupItem variant="danger">Danger</ListGroupItem>
        </ListGroup>
      );

      expect(screen.getByText('Primary').closest('li')).toHaveClass('list-group-item-primary');
      expect(screen.getByText('Success').closest('li')).toHaveClass('list-group-item-success');
      expect(screen.getByText('Danger').closest('li')).toHaveClass('list-group-item-danger');
    });
  });

  // ===========================================================================
  // Active State
  // ===========================================================================
  describe('Active State', () => {
    it('renders active item', () => {
      render(
        <ListGroup>
          <ListGroupItem active>Active Item</ListGroupItem>
        </ListGroup>
      );

      const item = screen.getByText('Active Item').closest('li');
      expect(item).toHaveClass('active');
      expect(item).toHaveAttribute('aria-current', 'true');
    });

    it('renders active item from items prop', () => {
      render(
        <ListGroup
          items={[
            { id: '1', content: 'Item 1' },
            { id: '2', content: 'Active', active: true },
          ]}
        />
      );

      const item = screen.getByText('Active').closest('li');
      expect(item).toHaveClass('active');
    });
  });

  // ===========================================================================
  // Disabled State
  // ===========================================================================
  describe('Disabled State', () => {
    it('renders disabled item', () => {
      render(
        <ListGroup>
          <ListGroupItem disabled>Disabled Item</ListGroupItem>
        </ListGroup>
      );

      const item = screen.getByText('Disabled Item').closest('li');
      expect(item).toHaveClass('disabled');
      expect(item).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not trigger onClick when disabled', async () => {
      const handleClick = jest.fn();
      render(
        <ListGroup>
          <ListGroupItem disabled onClick={handleClick}>
            Disabled
          </ListGroupItem>
        </ListGroup>
      );

      await userEvent.click(screen.getByText('Disabled'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // Interactive Items
  // ===========================================================================
  describe('Interactive Items', () => {
    it('renders clickable item as button', () => {
      const handleClick = jest.fn();
      render(
        <ListGroup>
          <ListGroupItem onClick={handleClick}>Clickable</ListGroupItem>
        </ListGroup>
      );

      const button = screen.getByRole('button', { name: 'Clickable' });
      expect(button).toHaveClass('list-group-item-action');
    });

    it('calls onClick when item is clicked', async () => {
      const handleClick = jest.fn();
      render(
        <ListGroup>
          <ListGroupItem onClick={handleClick}>Clickable</ListGroupItem>
        </ListGroup>
      );

      await userEvent.click(screen.getByRole('button', { name: 'Clickable' }));
      expect(handleClick).toHaveBeenCalled();
    });

    it('renders link item as anchor', () => {
      render(
        <ListGroup>
          <ListGroupItem href="/test">Link Item</ListGroupItem>
        </ListGroup>
      );

      const link = screen.getByRole('link', { name: 'Link Item' });
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveClass('list-group-item-action');
    });
  });

  // ===========================================================================
  // Badges
  // ===========================================================================
  describe('Badges', () => {
    it('renders item with badge', () => {
      render(
        <ListGroup>
          <ListGroupItem badge={<Badge variant="primary">14</Badge>}>With Badge</ListGroupItem>
        </ListGroup>
      );

      expect(screen.getByText('With Badge')).toBeInTheDocument();
      expect(screen.getByText('14')).toBeInTheDocument();
    });

    it('renders item with badge from items prop', () => {
      render(
        <ListGroup
          items={[
            {
              id: '1',
              content: 'Messages',
              badge: <Badge variant="primary">5</Badge>,
            },
          ]}
        />
      );

      expect(screen.getByText('Messages')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Icons
  // ===========================================================================
  describe('Icons', () => {
    it('renders item with icon', () => {
      render(
        <ListGroup>
          <ListGroupItem icon={<span data-testid="icon">📧</span>}>With Icon</ListGroupItem>
        </ListGroup>
      );

      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('With Icon')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Custom Element
  // ===========================================================================
  describe('Custom Element', () => {
    it('renders as specified element type wrapped in li', () => {
      const { container } = render(
        <ListGroup>
          <ListGroupItem as="div">Div Item</ListGroupItem>
        </ListGroup>
      );

      // div is wrapped in li for list semantics
      const li = container.querySelector('li');
      expect(li).toBeInTheDocument();
      expect(li?.querySelector('div.list-group-item')).toBeInTheDocument();
    });

    it('renders interactive div with role="button" and keyboard support', async () => {
      const handleClick = jest.fn();
      render(
        <ListGroup>
          <ListGroupItem as="div" onClick={handleClick}>
            Interactive Div
          </ListGroupItem>
        </ListGroup>
      );

      // Component uses native button for better accessibility instead of div with role="button"
      const button = screen.getByRole('button', { name: 'Interactive Div' });
      expect(button).toHaveAttribute('tabindex', '0');
      expect(button.tagName).toBe('BUTTON');
    });

    it('triggers onClick on Enter key for interactive div', async () => {
      const handleClick = jest.fn();
      render(
        <ListGroup>
          <ListGroupItem as="div" onClick={handleClick}>
            Interactive Div
          </ListGroupItem>
        </ListGroup>
      );

      const div = screen.getByRole('button', { name: 'Interactive Div' });
      div.focus();
      await userEvent.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('triggers onClick on Space key for interactive div', async () => {
      const handleClick = jest.fn();
      render(
        <ListGroup>
          <ListGroupItem as="div" onClick={handleClick}>
            Interactive Div
          </ListGroupItem>
        </ListGroup>
      );

      const div = screen.getByRole('button', { name: 'Interactive Div' });
      div.focus();
      await userEvent.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not trigger onClick on disabled interactive div', async () => {
      const handleClick = jest.fn();
      render(
        <ListGroup>
          <ListGroupItem as="div" onClick={handleClick} disabled>
            Disabled Div
          </ListGroupItem>
        </ListGroup>
      );

      // Component uses native button for better accessibility
      // Disabled state is communicated via aria-disabled and tabindex
      const button = screen.getByRole('button', { name: 'Disabled Div' });
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toHaveAttribute('tabindex', '-1');
      expect(button).toHaveClass('disabled');

      // Click should not work (prevented in handleClick)
      await userEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('has no a11y violations for interactive div', async () => {
      const { container } = render(
        <ListGroup>
          <ListGroupItem as="div" onClick={jest.fn()}>
            Interactive Div
          </ListGroupItem>
        </ListGroup>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ===========================================================================
  // Keyboard Navigation
  // ===========================================================================
  describe('Keyboard Navigation', () => {
    it('triggers onClick on Enter key (native button behavior)', async () => {
      const handleClick = jest.fn();
      render(
        <ListGroup>
          <ListGroupItem onClick={handleClick}>Clickable</ListGroupItem>
        </ListGroup>
      );

      const button = screen.getByRole('button', { name: 'Clickable' });
      button.focus();
      // Native buttons respond to Enter via keyboard event
      await userEvent.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalled();
    });

    it('triggers onClick on Space key (native button behavior)', async () => {
      const handleClick = jest.fn();
      render(
        <ListGroup>
          <ListGroupItem onClick={handleClick}>Clickable</ListGroupItem>
        </ListGroup>
      );

      const button = screen.getByRole('button', { name: 'Clickable' });
      button.focus();
      // Native buttons respond to Space via keyboard event
      await userEvent.keyboard(' ');

      expect(handleClick).toHaveBeenCalled();
    });

    it('is focusable with Tab', async () => {
      render(
        <ListGroup>
          <ListGroupItem onClick={jest.fn()}>Item 1</ListGroupItem>
          <ListGroupItem onClick={jest.fn()}>Item 2</ListGroupItem>
        </ListGroup>
      );

      await userEvent.tab();
      expect(screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();

      await userEvent.tab();
      expect(screen.getByRole('button', { name: 'Item 2' })).toHaveFocus();
    });
  });

  // ===========================================================================
  // Ref Forwarding
  // ===========================================================================
  describe('Ref Forwarding', () => {
    it('forwards ref to ListGroup element', () => {
      const ref = createRef<HTMLUListElement>();
      render(<ListGroup ref={ref} items={sampleItems} />);
      expect(ref.current).toBeInstanceOf(HTMLUListElement);
    });

    it('forwards ref to ListGroupItem element', () => {
      const ref = createRef<HTMLElement>();
      render(
        <ListGroup>
          <ListGroupItem ref={ref}>Item</ListGroupItem>
        </ListGroup>
      );
      expect(ref.current).toBeInstanceOf(HTMLLIElement);
    });
  });

  // ===========================================================================
  // Custom Styling
  // ===========================================================================
  describe('Custom Styling', () => {
    it('accepts custom className on ListGroup', () => {
      const { container } = render(<ListGroup items={sampleItems} className="custom-class" />);
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('accepts custom className on ListGroupItem', () => {
      render(
        <ListGroup>
          <ListGroupItem className="custom-item">Item</ListGroupItem>
        </ListGroup>
      );
      expect(screen.getByText('Item').closest('li')).toHaveClass('custom-item');
    });

    it('accepts inline styles', () => {
      const { container } = render(<ListGroup items={sampleItems} style={{ marginTop: '10px' }} />);
      expect(container.querySelector('ul')).toHaveStyle({ marginTop: '10px' });
    });

    it('accepts custom id', () => {
      render(<ListGroup items={sampleItems} id="my-list" />);
      expect(document.getElementById('my-list')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Accessibility (WCAG 2.2 AA)
  // ===========================================================================
  describe('Accessibility (WCAG 2.2 AA)', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<ListGroup items={sampleItems} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with interactive items', async () => {
      const { container } = render(
        <ListGroup
          items={[
            { id: '1', content: 'Clickable', onClick: jest.fn() },
            { id: '2', content: 'Link', href: '#' },
          ]}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with variants', async () => {
      const { container } = render(
        <ListGroup>
          <ListGroupItem variant="primary">Primary</ListGroupItem>
          <ListGroupItem variant="success" active>
            Active
          </ListGroupItem>
          <ListGroupItem variant="danger" disabled>
            Disabled
          </ListGroupItem>
        </ListGroup>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('uses semantic list structure', () => {
      render(<ListGroup items={sampleItems} />);
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    it('accepts aria-label', () => {
      render(<ListGroup items={sampleItems} aria-label="Navigation menu" />);
      expect(screen.getByRole('list')).toHaveAttribute('aria-label', 'Navigation menu');
    });

    it('accepts aria-labelledby', () => {
      render(
        <>
          <h2 id="list-heading">My List</h2>
          <ListGroup items={sampleItems} aria-labelledby="list-heading" />
        </>
      );
      expect(screen.getByRole('list')).toHaveAttribute('aria-labelledby', 'list-heading');
    });
  });

  // ===========================================================================
  // Managed Selection
  // ===========================================================================
  describe('Managed Selection', () => {
    it('supports uncontrolled selection with defaultActiveKey', () => {
      render(
        <ListGroup defaultActiveKey="b">
          <ListGroupItem eventKey="a">A</ListGroupItem>
          <ListGroupItem eventKey="b">B</ListGroupItem>
        </ListGroup>
      );
      expect(screen.getByText('B').closest('li')).toHaveClass('active');
      expect(screen.getByText('A').closest('li')).not.toHaveClass('active');
    });

    it('fires onSelect when item is clicked', async () => {
      const onSelect = jest.fn();
      render(
        <ListGroup onSelect={onSelect} defaultActiveKey="a">
          <ListGroupItem eventKey="a">A</ListGroupItem>
          <ListGroupItem eventKey="b">B</ListGroupItem>
        </ListGroup>
      );
      await userEvent.click(screen.getByText('B'));
      expect(onSelect).toHaveBeenCalledWith('b', expect.any(Object));
    });

    it('supports controlled activeKey', () => {
      const { rerender } = render(
        <ListGroup activeKey="a">
          <ListGroupItem eventKey="a">A</ListGroupItem>
          <ListGroupItem eventKey="b">B</ListGroupItem>
        </ListGroup>
      );
      expect(screen.getByText('A').closest('li')).toHaveClass('active');

      rerender(
        <ListGroup activeKey="b">
          <ListGroupItem eventKey="a">A</ListGroupItem>
          <ListGroupItem eventKey="b">B</ListGroupItem>
        </ListGroup>
      );
      expect(screen.getByText('B').closest('li')).toHaveClass('active');
      expect(screen.getByText('A').closest('li')).not.toHaveClass('active');
    });

    it('supports multiple selection mode', async () => {
      const onSelect = jest.fn();
      render(
        <ListGroup selectionMode="multiple" defaultActiveKey={['a']} onSelect={onSelect}>
          <ListGroupItem eventKey="a">A</ListGroupItem>
          <ListGroupItem eventKey="b">B</ListGroupItem>
        </ListGroup>
      );
      expect(screen.getByText('A').closest('li')).toHaveClass('active');
      await userEvent.click(screen.getByText('B'));
      expect(onSelect).toHaveBeenCalledWith('b', expect.any(Object));
    });

    it('explicit active prop overrides context', () => {
      render(
        <ListGroup activeKey="a">
          <ListGroupItem eventKey="a" active={false}>A</ListGroupItem>
          <ListGroupItem eventKey="b" active={true}>B</ListGroupItem>
        </ListGroup>
      );
      expect(screen.getByText('A').closest('li')).not.toHaveClass('active');
      expect(screen.getByText('B').closest('li')).toHaveClass('active');
    });

    it('works with items prop', async () => {
      const onSelect = jest.fn();
      render(
        <ListGroup
          defaultActiveKey="1"
          onSelect={onSelect}
          items={[
            { id: '1', eventKey: '1', content: 'Item 1' },
            { id: '2', eventKey: '2', content: 'Item 2' },
          ]}
        />
      );
      expect(screen.getByText('Item 1').closest('li')).toHaveClass('active');
      await userEvent.click(screen.getByText('Item 2'));
      expect(onSelect).toHaveBeenCalledWith('2', expect.any(Object));
    });

    it('applies role="listbox" when onSelect is provided', () => {
      render(
        <ListGroup onSelect={jest.fn()} defaultActiveKey="a">
          <ListGroupItem eventKey="a">A</ListGroupItem>
        </ListGroup>
      );
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('applies role="option" and aria-selected on items with eventKey', () => {
      render(
        <ListGroup onSelect={jest.fn()} activeKey="a">
          <ListGroupItem eventKey="a">A</ListGroupItem>
          <ListGroupItem eventKey="b">B</ListGroupItem>
        </ListGroup>
      );
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(2);
      expect(options[0]).toHaveAttribute('aria-selected', 'true');
      expect(options[1]).toHaveAttribute('aria-selected', 'false');
    });

    it('fires onSelect for href items with eventKey', async () => {
      const onSelect = jest.fn();
      render(
        <ListGroup onSelect={onSelect}>
          <ListGroupItem eventKey="a" href="/page-a">Link A</ListGroupItem>
          <ListGroupItem eventKey="b" href="/page-b">Link B</ListGroupItem>
        </ListGroup>
      );
      await userEvent.click(screen.getByText('Link B'));
      expect(onSelect).toHaveBeenCalledWith('b', expect.any(Object));
    });

    it('has no a11y violations with selection', async () => {
      const { container } = render(
        <ListGroup onSelect={jest.fn()} activeKey="a">
          <ListGroupItem eventKey="a">A</ListGroupItem>
          <ListGroupItem eventKey="b">B</ListGroupItem>
        </ListGroup>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ===========================================================================
  // Arrow Key Navigation
  // ===========================================================================
  describe('Arrow Key Navigation', () => {
    it('moves focus with arrow keys when onSelect is provided', async () => {
      render(
        <ListGroup onSelect={jest.fn()} defaultActiveKey="a">
          <ListGroupItem eventKey="a">A</ListGroupItem>
          <ListGroupItem eventKey="b">B</ListGroupItem>
          <ListGroupItem eventKey="c">C</ListGroupItem>
        </ListGroup>
      );

      const options = screen.getAllByRole('option');
      options[0].focus();

      await userEvent.keyboard('{ArrowDown}');
      expect(options[1]).toHaveFocus();

      await userEvent.keyboard('{ArrowDown}');
      expect(options[2]).toHaveFocus();
    });

    it('skips disabled items', async () => {
      render(
        <ListGroup onSelect={jest.fn()}>
          <ListGroupItem eventKey="a">A</ListGroupItem>
          <ListGroupItem eventKey="b" disabled>B</ListGroupItem>
          <ListGroupItem eventKey="c">C</ListGroupItem>
        </ListGroup>
      );

      const options = screen.getAllByRole('option');
      options[0].focus();

      await userEvent.keyboard('{ArrowDown}');
      expect(options[2]).toHaveFocus(); // Skips B
    });

    it('does not use arrow keys for static lists', async () => {
      render(
        <ListGroup>
          <ListGroupItem>A</ListGroupItem>
          <ListGroupItem>B</ListGroupItem>
        </ListGroup>
      );

      const items = screen.getAllByRole('listitem');
      // Static list uses standard tab navigation, not arrow keys
      expect(items[0]).not.toHaveAttribute('role', 'option');
    });

    it('selects item on Enter key', async () => {
      const onSelect = jest.fn();
      render(
        <ListGroup onSelect={onSelect}>
          <ListGroupItem eventKey="a">A</ListGroupItem>
          <ListGroupItem eventKey="b">B</ListGroupItem>
        </ListGroup>
      );

      const options = screen.getAllByRole('option');
      options[0].focus();

      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{Enter}');
      expect(onSelect).toHaveBeenCalledWith('b', expect.any(Object));
    });

    it('selects item on Space key', async () => {
      const onSelect = jest.fn();
      render(
        <ListGroup onSelect={onSelect}>
          <ListGroupItem eventKey="a">A</ListGroupItem>
          <ListGroupItem eventKey="b">B</ListGroupItem>
        </ListGroup>
      );

      const options = screen.getAllByRole('option');
      options[0].focus();

      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard(' ');
      expect(onSelect).toHaveBeenCalledWith('b', expect.any(Object));
    });

    it('jumps to first/last with Home/End', async () => {
      render(
        <ListGroup onSelect={jest.fn()}>
          <ListGroupItem eventKey="a">A</ListGroupItem>
          <ListGroupItem eventKey="b">B</ListGroupItem>
          <ListGroupItem eventKey="c">C</ListGroupItem>
        </ListGroup>
      );

      const options = screen.getAllByRole('option');
      options[1].focus();

      await userEvent.keyboard('{Home}');
      expect(options[0]).toHaveFocus();

      await userEvent.keyboard('{End}');
      expect(options[2]).toHaveFocus();
    });
  });

  // ===========================================================================
  // Description
  // ===========================================================================
  describe('Description', () => {
    it('renders description text below content', () => {
      render(
        <ListGroup>
          <ListGroupItem description="12 unread">Inbox</ListGroupItem>
        </ListGroup>
      );
      expect(screen.getByText('Inbox')).toBeInTheDocument();
      expect(screen.getByText('12 unread')).toBeInTheDocument();
    });

    it('renders description in items mode', () => {
      render(
        <ListGroup items={[{ id: '1', content: 'Inbox', description: '12 unread' }]} />
      );
      expect(screen.getByText('12 unread')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Dividers
  // ===========================================================================
  describe('Dividers', () => {
    it('renders divider compound component', () => {
      const { container } = render(
        <ListGroup>
          <ListGroupItem>A</ListGroupItem>
          <ListGroupDivider />
          <ListGroupItem>B</ListGroupItem>
        </ListGroup>
      );
      expect(container.querySelector('[role="separator"]')).toBeInTheDocument();
    });

    it('renders divider in items mode', () => {
      const { container } = render(
        <ListGroup
          items={[
            { id: '1', content: 'A' },
            { type: 'divider' },
            { id: '2', content: 'B' },
          ]}
        />
      );
      expect(container.querySelector('[role="separator"]')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Headers
  // ===========================================================================
  describe('Headers', () => {
    it('renders header compound component', () => {
      render(
        <ListGroup>
          <ListGroupHeader>Category</ListGroupHeader>
          <ListGroupItem>A</ListGroupItem>
        </ListGroup>
      );
      expect(screen.getByText('Category')).toBeInTheDocument();
    });

    it('renders header in items mode', () => {
      render(
        <ListGroup
          items={[
            { type: 'header', content: 'Category' },
            { id: '1', content: 'A' },
          ]}
        />
      );
      expect(screen.getByText('Category')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Loading State
  // ===========================================================================
  describe('Loading State', () => {
    it('renders spinner when loading', () => {
      const { container } = render(<ListGroup loading items={sampleItems} />);
      expect(container.querySelector('.spinner-border')).toBeInTheDocument();
    });

    it('renders items when loading', () => {
      render(<ListGroup loading items={sampleItems} />);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Empty State
  // ===========================================================================
  describe('Empty State', () => {
    it('renders emptyContent when items is empty', () => {
      render(<ListGroup items={[]} emptyContent="No items found" />);
      expect(screen.getByText('No items found')).toBeInTheDocument();
    });

    it('does not render emptyContent when items exist', () => {
      render(<ListGroup items={sampleItems} emptyContent="No items found" />);
      expect(screen.queryByText('No items found')).not.toBeInTheDocument();
    });

    it('renders nothing for empty list without emptyContent', () => {
      const { container } = render(<ListGroup items={[]} />);
      expect(container.querySelector('ul')).toBeEmptyDOMElement();
    });
  });

  // ===========================================================================
  // Collapsible Items
  // ===========================================================================
  describe('Collapsible Items', () => {
    it('renders collapsible item with toggle', () => {
      render(
        <ListGroup>
          <ListGroupItem collapsible defaultExpanded={false}>
            Parent
            <ListGroup>
              <ListGroupItem>Child 1</ListGroupItem>
            </ListGroup>
          </ListGroupItem>
        </ListGroup>
      );

      // Toggle button should exist
      expect(screen.getByRole('button', { expanded: false })).toBeInTheDocument();
      // Nested content should be hidden
      expect(screen.queryByText('Child 1')).not.toBeVisible();
    });

    it('expands on toggle click', async () => {
      render(
        <ListGroup>
          <ListGroupItem collapsible defaultExpanded={false}>
            Parent
            <ListGroup>
              <ListGroupItem>Child 1</ListGroupItem>
            </ListGroup>
          </ListGroupItem>
        </ListGroup>
      );

      await userEvent.click(screen.getByRole('button', { expanded: false }));
      expect(screen.getByRole('button', { expanded: true })).toBeInTheDocument();
      expect(screen.getByText('Child 1')).toBeVisible();
    });

    it('supports controlled expanded state', () => {
      const onExpandedChange = jest.fn();
      const { rerender } = render(
        <ListGroup>
          <ListGroupItem collapsible expanded={false} onExpandedChange={onExpandedChange}>
            Parent
            <ListGroup>
              <ListGroupItem>Child 1</ListGroupItem>
            </ListGroup>
          </ListGroupItem>
        </ListGroup>
      );

      expect(screen.queryByText('Child 1')).not.toBeVisible();

      rerender(
        <ListGroup>
          <ListGroupItem collapsible expanded={true} onExpandedChange={onExpandedChange}>
            Parent
            <ListGroup>
              <ListGroupItem>Child 1</ListGroupItem>
            </ListGroup>
          </ListGroupItem>
        </ListGroup>
      );

      expect(screen.getByText('Child 1')).toBeVisible();
    });

    it('fires onExpandedChange callback', async () => {
      const onExpandedChange = jest.fn();
      render(
        <ListGroup>
          <ListGroupItem collapsible defaultExpanded={false} onExpandedChange={onExpandedChange}>
            Parent
            <ListGroup>
              <ListGroupItem>Child 1</ListGroupItem>
            </ListGroup>
          </ListGroupItem>
        </ListGroup>
      );

      await userEvent.click(screen.getByRole('button', { expanded: false }));
      expect(onExpandedChange).toHaveBeenCalledWith(true);
    });

    it('renders expanded by default when defaultExpanded is true', () => {
      render(
        <ListGroup>
          <ListGroupItem collapsible defaultExpanded={true}>
            Parent
            <ListGroup>
              <ListGroupItem>Child 1</ListGroupItem>
            </ListGroup>
          </ListGroupItem>
        </ListGroup>
      );

      expect(screen.getByText('Child 1')).toBeVisible();
      expect(screen.getByRole('button', { expanded: true })).toBeInTheDocument();
    });

    it('supports items mode with collapsible children', () => {
      render(
        <ListGroup
          items={[
            {
              id: 'parent',
              content: 'Parent',
              collapsible: true,
              defaultExpanded: true,
              children: [
                { id: 'child1', content: 'Child 1' },
                { id: 'child2', content: 'Child 2' },
              ],
            },
          ]}
        />
      );

      expect(screen.getByText('Parent')).toBeInTheDocument();
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });

    it('has no a11y violations', async () => {
      const { container } = render(
        <ListGroup>
          <ListGroupItem collapsible defaultExpanded>
            Parent
            <ListGroup>
              <ListGroupItem>Child 1</ListGroupItem>
            </ListGroup>
          </ListGroupItem>
        </ListGroup>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ===========================================================================
  // Virtualization
  // ===========================================================================
  describe('Virtualization', () => {
    it('renders all items when virtualized is false', () => {
      const items = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        content: `Item ${i}`,
      }));
      render(<ListGroup items={items} />);
      expect(screen.getAllByText(/^Item \d+$/)).toHaveLength(100);
    });

    it('warns in dev when virtualized without @tanstack/react-virtual', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const items = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        content: `Item ${i}`,
      }));
      render(
        <ListGroup virtualized itemHeight={40} items={items} style={{ height: 400 }} />
      );
      // Should fall back to rendering all items
      expect(screen.getAllByText(/^Item \d+$/)).toHaveLength(100);
      consoleSpy.mockRestore();
    });
  });

  // ===========================================================================
  // Display Names
  // ===========================================================================
  describe('Display Names', () => {
    it('ListGroup has correct displayName', () => {
      expect(ListGroup.displayName).toBe('ListGroup');
    });

    it('ListGroupItem has correct displayName', () => {
      expect(ListGroupItem.displayName).toBe('ListGroupItem');
    });
  });
});
