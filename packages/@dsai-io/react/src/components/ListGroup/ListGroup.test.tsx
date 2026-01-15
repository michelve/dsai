import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef } from 'react';

import { Badge } from '../Badge';

import { ListGroup, ListGroupItem } from './ListGroup';

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
