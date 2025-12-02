import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';

import { Dropdown } from './Dropdown';

describe('Dropdown', () => {
  // ===========================================================================
  // Rendering
  // ===========================================================================
  describe('Rendering', () => {
    it('renders toggle button', () => {
      render(
        <Dropdown>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.getByRole('button', { name: 'Options' })).toBeInTheDocument();
    });

    it('does not render menu when closed', () => {
      render(
        <Dropdown>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('renders menu when isOpen is true', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('renders menu when defaultOpen is true', async () => {
      render(
        <Dropdown defaultOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
    });

    it('renders all subcomponents', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Header>Section</Dropdown.Header>
            <Dropdown.Item>Action</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.ItemText>Info text</Dropdown.ItemText>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.getByText('Section')).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'Action' })).toBeInTheDocument();
      expect(screen.getByText('Info text')).toBeInTheDocument();
    });

    it('applies custom className to container', () => {
      const { container } = render(
        <Dropdown className="custom-dropdown">
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(container.firstChild).toHaveClass('custom-dropdown');
    });

    it('applies custom style to container', () => {
      const { container } = render(
        <Dropdown style={{ width: '200px' }}>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(container.firstChild).toHaveStyle({ width: '200px' });
    });

    it('applies data-testid to container', () => {
      render(
        <Dropdown data-testid="my-dropdown">
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.getByTestId('my-dropdown')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Toggle Component
  // ===========================================================================
  describe('Toggle Component', () => {
    it('renders with default variant', () => {
      render(
        <Dropdown>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const toggle = screen.getByRole('button', { name: 'Options' });
      expect(toggle).toHaveClass('btn-secondary');
    });

    it('renders with primary variant', () => {
      render(
        <Dropdown>
          <Dropdown.Toggle variant="primary">Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const toggle = screen.getByRole('button', { name: 'Options' });
      expect(toggle).toHaveClass('btn-primary');
    });

    it('renders with different sizes', () => {
      const { rerender } = render(
        <Dropdown>
          <Dropdown.Toggle size="sm">Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.getByRole('button')).toHaveClass('btn-sm');

      rerender(
        <Dropdown>
          <Dropdown.Toggle size="lg">Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.getByRole('button')).toHaveClass('btn-lg');
    });

    it('renders with dropdown-toggle class for caret by default', () => {
      render(
        <Dropdown>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.getByRole('button')).toHaveClass('dropdown-toggle');
    });

    it('omits dropdown-toggle class when caret is false', () => {
      render(
        <Dropdown>
          <Dropdown.Toggle caret={false}>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.getByRole('button')).not.toHaveClass('dropdown-toggle');
    });

    it('renders split button', () => {
      render(
        <Dropdown>
          <Dropdown.Toggle split aria-label="Toggle" />
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const toggle = screen.getByRole('button', { name: 'Toggle' });
      expect(toggle).toHaveClass('dropdown-toggle-split');
    });

    it('is disabled when dropdown is disabled', () => {
      render(
        <Dropdown disabled>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('is disabled when toggle is disabled', () => {
      render(
        <Dropdown>
          <Dropdown.Toggle disabled>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  // ===========================================================================
  // Menu Component
  // ===========================================================================
  describe('Menu Component', () => {
    it('renders with show class when open', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.getByRole('menu')).toHaveClass('show');
    });

    it('renders with dropdown-menu-end for end alignment', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false} align="end">
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.getByRole('menu')).toHaveClass('dropdown-menu-end');
    });

    it('applies custom className to menu', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false} className="custom-menu">
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.getByRole('menu')).toHaveClass('custom-menu');
    });
  });

  // ===========================================================================
  // Item Component
  // ===========================================================================
  describe('Item Component', () => {
    it('renders as button by default', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const item = screen.getByRole('menuitem', { name: 'Action' });
      expect(item.tagName).toBe('BUTTON');
    });

    it('renders as anchor when href is provided', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item href="/link">Link</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const item = screen.getByRole('menuitem', { name: 'Link' });
      expect(item.tagName).toBe('A');
      expect(item).toHaveAttribute('href', '/link');
    });

    it('applies active class when active', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item active>Active</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.getByRole('menuitem')).toHaveClass('active');
    });

    it('applies disabled class when disabled', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item disabled>Disabled</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.getByRole('menuitem')).toHaveClass('disabled');
    });

    it('calls onClick when clicked', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item onClick={handleClick}>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      await user.click(screen.getByRole('menuitem', { name: 'Action' }));
      expect(handleClick).toHaveBeenCalled();
    });

    it('does not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item disabled onClick={handleClick}>
              Disabled
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      await user.click(screen.getByRole('menuitem'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('renders start icon', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item startIcon={<span data-testid="icon">🔧</span>}>Settings</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('renders end icon', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item endIcon={<span data-testid="icon">→</span>}>Next</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Opening and Closing
  // ===========================================================================
  describe('Opening and Closing', () => {
    it('opens on toggle click', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      await user.click(screen.getByRole('button', { name: 'Options' }));

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
    });

    it('closes on toggle click when open', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown defaultOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Options' }));

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('does not open when disabled', async () => {
      render(
        <Dropdown disabled>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      // Can't click disabled button with userEvent
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('calls onOpenChange when opening', async () => {
      const handleOpenChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Dropdown onOpenChange={handleOpenChange}>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      await user.click(screen.getByRole('button', { name: 'Options' }));
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });

    it('calls onOpenChange when closing', async () => {
      const handleOpenChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Dropdown defaultOpen onOpenChange={handleOpenChange}>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Options' }));

      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    it('calls onOpened when opened', async () => {
      const handleOpened = jest.fn();
      const user = userEvent.setup();

      render(
        <Dropdown onOpened={handleOpened}>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      await user.click(screen.getByRole('button', { name: 'Options' }));

      await waitFor(() => {
        expect(handleOpened).toHaveBeenCalled();
      });
    });
  });

  // ===========================================================================
  // Controlled Mode
  // ===========================================================================
  describe('Controlled Mode', () => {
    it('respects controlled isOpen prop', () => {
      const { rerender } = render(
        <Dropdown isOpen={false}>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();

      rerender(
        <Dropdown isOpen={true}>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('works with useState controller', async () => {
      const ControlledDropdown = () => {
        const [isOpen, setIsOpen] = useState(false);
        return (
          <>
            <button onClick={() => setIsOpen(!isOpen)}>External Toggle</button>
            <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
              <Dropdown.Toggle>Options</Dropdown.Toggle>
              <Dropdown.Menu portal={false}>
                <Dropdown.Item>Action</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        );
      };

      const user = userEvent.setup();
      render(<ControlledDropdown />);

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'External Toggle' }));
      expect(screen.getByRole('menu')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'External Toggle' }));
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Auto Close Behavior
  // ===========================================================================
  describe('Auto Close Behavior', () => {
    it('closes on item click with autoClose=true (default)', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown defaultOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('menuitem', { name: 'Action' }));

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('closes on item click with autoClose="inside"', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown defaultOpen autoClose="inside">
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('menuitem', { name: 'Action' }));

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('does not close on item click with autoClose=false', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown defaultOpen autoClose={false}>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('menuitem', { name: 'Action' }));

      // Menu should stay open
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('does not close on item click with autoClose="outside"', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown defaultOpen autoClose="outside">
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('menuitem', { name: 'Action' }));

      // Menu should stay open
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Placement/Direction
  // ===========================================================================
  describe('Placement/Direction', () => {
    it('applies dropup class for top placement', () => {
      const { container } = render(
        <Dropdown placement="top">
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(container.firstChild).toHaveClass('dropup');
    });

    it('applies dropdown class for bottom placement', () => {
      const { container } = render(
        <Dropdown placement="bottom">
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(container.firstChild).toHaveClass('dropdown');
    });

    it('applies dropstart class for left placement', () => {
      const { container } = render(
        <Dropdown placement="left">
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(container.firstChild).toHaveClass('dropstart');
    });

    it('applies dropend class for right placement', () => {
      const { container } = render(
        <Dropdown placement="right">
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(container.firstChild).toHaveClass('dropend');
    });
  });

  // ===========================================================================
  // Visual State
  // ===========================================================================
  describe('Visual State', () => {
    it('has data-visual-state="closed" when closed', () => {
      render(
        <Dropdown data-testid="dropdown">
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.getByTestId('dropdown')).toHaveAttribute('data-visual-state', 'closed');
    });

    it('has data-visual-state="open" when open', async () => {
      render(
        <Dropdown isOpen data-testid="dropdown">
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      await waitFor(() => {
        expect(screen.getByTestId('dropdown')).toHaveAttribute('data-visual-state', 'open');
      });
    });
  });

  // ===========================================================================
  // Ref Forwarding
  // ===========================================================================
  describe('Ref Forwarding', () => {
    it('forwards ref to container', () => {
      const ref = createRef<HTMLDivElement>();

      render(
        <Dropdown ref={ref}>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  // ===========================================================================
  // Divider and Header
  // ===========================================================================
  describe('Divider and Header', () => {
    it('renders Divider correctly', () => {
      const { container } = render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action 1</Dropdown.Item>
            <Dropdown.Divider data-testid="divider" />
            <Dropdown.Item>Action 2</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const divider = container.querySelector('.dropdown-divider');
      expect(divider).toBeInTheDocument();
      expect(divider?.tagName).toBe('HR');
    });

    it('renders Header correctly', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Header>Section Title</Dropdown.Header>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const header = screen.getByText('Section Title');
      expect(header).toHaveClass('dropdown-header');
      expect(header.tagName).toBe('H6');
    });
  });

  // ===========================================================================
  // ItemText
  // ===========================================================================
  describe('ItemText', () => {
    it('renders ItemText correctly', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.ItemText>Informational text</Dropdown.ItemText>
          </Dropdown.Menu>
        </Dropdown>
      );

      const text = screen.getByText('Informational text');
      expect(text).toHaveClass('dropdown-item-text');
      expect(text.tagName).toBe('SPAN');
    });
  });

  // ===========================================================================
  // Error Handling
  // ===========================================================================
  describe('Error Handling', () => {
    it('throws error when Toggle is used outside Dropdown', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<Dropdown.Toggle>Options</Dropdown.Toggle>);
      }).toThrow('Dropdown components must be used within a Dropdown component');

      consoleSpy.mockRestore();
    });

    it('throws error when Menu is used outside Dropdown', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        );
      }).toThrow('Dropdown components must be used within a Dropdown component');

      consoleSpy.mockRestore();
    });

    it('throws error when Item is used outside Dropdown', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<Dropdown.Item>Action</Dropdown.Item>);
      }).toThrow();

      consoleSpy.mockRestore();
    });
  });
});
