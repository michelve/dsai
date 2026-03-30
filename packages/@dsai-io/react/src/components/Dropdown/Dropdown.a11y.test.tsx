import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

import { Dropdown } from './Dropdown';

expect.extend(toHaveNoViolations);

describe('Dropdown Accessibility', () => {
  // ===========================================================================
  // jest-axe Validations
  // ===========================================================================
  describe('jest-axe Validations', () => {
    it('has no accessibility violations when closed', async () => {
      const { container } = render(
        <Dropdown>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action 1</Dropdown.Item>
            <Dropdown.Item>Action 2</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations when open', async () => {
      const { container } = render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action 1</Dropdown.Item>
            <Dropdown.Item>Action 2</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with disabled dropdown', async () => {
      const { container } = render(
        <Dropdown disabled>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with disabled items', async () => {
      const { container } = render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Enabled</Dropdown.Item>
            <Dropdown.Item disabled>Disabled</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with active items', async () => {
      const { container } = render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item active>Active</Dropdown.Item>
            <Dropdown.Item>Other</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with dividers and headers', async () => {
      const { container } = render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Header>Section 1</Dropdown.Header>
            <Dropdown.Item>Action 1</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Header>Section 2</Dropdown.Header>
            <Dropdown.Item>Action 2</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with item text', async () => {
      const { container } = render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.ItemText>Some descriptive text</Dropdown.ItemText>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with link items', async () => {
      const { container } = render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item href="/page1">Page 1</Dropdown.Item>
            <Dropdown.Item href="/page2">Page 2</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with split button', async () => {
      const { container } = render(
        <Dropdown>
          <button type="button" className="btn btn-secondary">
            Action
          </button>
          <Dropdown.Toggle split aria-label="Toggle dropdown" />
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Option 1</Dropdown.Item>
            <Dropdown.Item>Option 2</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ===========================================================================
  // ARIA Attributes
  // ===========================================================================
  describe('ARIA Attributes', () => {
    it('toggle has aria-haspopup="menu"', () => {
      render(
        <Dropdown>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const toggle = screen.getByRole('button', { name: 'Options' });
      expect(toggle).toHaveAttribute('aria-haspopup', 'menu');
    });

    it('toggle has aria-expanded="false" when closed', () => {
      render(
        <Dropdown>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const toggle = screen.getByRole('button', { name: 'Options' });
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });

    it('toggle has aria-expanded="true" when open', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const toggle = screen.getByRole('button', { name: 'Options' });
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
    });

    it('toggle omits aria-controls when menu is closed', () => {
      render(
        <Dropdown id="test-dropdown">
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const toggle = screen.getByRole('button', { name: 'Options' });
      expect(toggle).not.toHaveAttribute('aria-controls');
    });

    it('toggle has aria-controls pointing to menu id when open', () => {
      render(
        <Dropdown id="test-dropdown" isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const toggle = screen.getByRole('button', { name: 'Options' });
      expect(toggle).toHaveAttribute('aria-controls', 'dropdown-menu-test-dropdown');
    });

    it('menu has role="menu"', () => {
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

    it('menu has aria-labelledby pointing to toggle id', () => {
      render(
        <Dropdown isOpen id="test-dropdown">
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const menu = screen.getByRole('menu');
      expect(menu).toHaveAttribute('aria-labelledby', 'dropdown-toggle-test-dropdown');
    });

    it('items have role="menuitem"', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action 1</Dropdown.Item>
            <Dropdown.Item>Action 2</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const items = screen.getAllByRole('menuitem');
      expect(items).toHaveLength(2);
    });

    it('disabled items have aria-disabled="true"', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item disabled>Disabled</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const item = screen.getByRole('menuitem', { name: 'Disabled' });
      expect(item).toHaveAttribute('aria-disabled', 'true');
    });

    it('active items have aria-current="true"', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item active>Active</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const item = screen.getByRole('menuitem', { name: 'Active' });
      expect(item).toHaveAttribute('aria-current', 'true');
    });

    it('dividers have role="none" wrapper', () => {
      const { container } = render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
            <Dropdown.Divider data-testid="divider" />
          </Dropdown.Menu>
        </Dropdown>
      );

      const dividerWrapper = container.querySelector('li[role="none"]');
      expect(dividerWrapper).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Keyboard Navigation
  // ===========================================================================
  describe('Keyboard Navigation', () => {
    it('opens dropdown with Enter key on toggle', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const toggle = screen.getByRole('button', { name: 'Options' });
      toggle.focus();
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
    });

    it('opens dropdown with Space key on toggle', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const toggle = screen.getByRole('button', { name: 'Options' });
      toggle.focus();
      await user.keyboard(' ');

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
    });

    it('closes dropdown with Escape key', async () => {
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

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('activates item with Enter key', async () => {
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

      const item = screen.getByRole('menuitem', { name: 'Action' });
      item.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalled();
    });

    it('does not activate disabled items', async () => {
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

      const item = screen.getByRole('menuitem', { name: 'Disabled' });
      item.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // Focus Management
  // ===========================================================================
  describe('Focus Management', () => {
    it('toggle is focusable', () => {
      render(
        <Dropdown>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const toggle = screen.getByRole('button', { name: 'Options' });
      toggle.focus();
      expect(document.activeElement).toBe(toggle);
    });

    it('disabled toggle is not focusable', () => {
      render(
        <Dropdown disabled>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const toggle = screen.getByRole('button', { name: 'Options' });
      expect(toggle).toBeDisabled();
    });

    it('menu items are focusable when open', async () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action 1</Dropdown.Item>
            <Dropdown.Item>Action 2</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      const items = screen.getAllByRole('menuitem');
      items[0].focus();
      expect(document.activeElement).toBe(items[0]);
    });

    it('disabled items are not interactable', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item disabled>Disabled</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const item = screen.getByRole('menuitem', { name: 'Disabled' });
      expect(item).toHaveClass('disabled');
    });
  });

  // ===========================================================================
  // Split Button Accessibility
  // ===========================================================================
  describe('Split Button Accessibility', () => {
    it('split toggle has aria-label for screen readers', () => {
      render(
        <Dropdown>
          <button type="button" className="btn btn-secondary">
            Primary Action
          </button>
          <Dropdown.Toggle split aria-label="Toggle dropdown" />
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Option</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const toggle = screen.getByRole('button', { name: 'Toggle dropdown' });
      expect(toggle).toHaveAttribute('aria-label', 'Toggle dropdown');
    });

    it('split toggle renders visually hidden label text', () => {
      const { container } = render(
        <Dropdown>
          <button type="button" className="btn btn-secondary">
            Primary Action
          </button>
          <Dropdown.Toggle split aria-label="Toggle dropdown" />
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Option</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const visuallyHidden = container.querySelector('.visually-hidden');
      expect(visuallyHidden).toHaveTextContent('Toggle dropdown');
    });
  });

  // ===========================================================================
  // Screen Reader Announcements
  // ===========================================================================
  describe('Screen Reader Support', () => {
    it('headers are not focusable but visible to screen readers', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Header>Section</Dropdown.Header>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const header = screen.getByText('Section');
      expect(header).toBeInTheDocument();
      // Headers should not have role="menuitem"
      expect(header).not.toHaveAttribute('role', 'menuitem');
    });

    it('item text is visible but not interactive', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.ItemText>Some info text</Dropdown.ItemText>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const text = screen.getByText('Some info text');
      expect(text).toBeInTheDocument();
      // Item text should not have role="menuitem"
      expect(text).not.toHaveAttribute('role', 'menuitem');
    });
  });

  // ===========================================================================
  // Icons Accessibility
  // ===========================================================================
  describe('Icons Accessibility', () => {
    it('icons in items are hidden from screen readers', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item startIcon={<span>🔧</span>}>Settings</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const icon = screen.getByText('🔧');
      expect(icon.parentElement).toHaveAttribute('aria-hidden', 'true');
    });

    it('end icons are hidden from screen readers', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item endIcon={<span>→</span>}>Next</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      const icon = screen.getByText('→');
      expect(icon.parentElement).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // ===========================================================================
  // CheckboxItem Accessibility
  // ===========================================================================
  describe('CheckboxItem Accessibility', () => {
    it('has no accessibility violations with CheckboxItem', async () => {
      const { container } = render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.CheckboxItem checked>Bold</Dropdown.CheckboxItem>
            <Dropdown.CheckboxItem>Italic</Dropdown.CheckboxItem>
          </Dropdown.Menu>
        </Dropdown>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('CheckboxItem has correct ARIA role and state', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.CheckboxItem checked>Bold</Dropdown.CheckboxItem>
            <Dropdown.CheckboxItem>Italic</Dropdown.CheckboxItem>
          </Dropdown.Menu>
        </Dropdown>
      );

      const boldItem = screen.getByRole('menuitemcheckbox', { name: 'Bold' });
      expect(boldItem).toHaveAttribute('aria-checked', 'true');

      const italicItem = screen.getByRole('menuitemcheckbox', { name: 'Italic' });
      expect(italicItem).toHaveAttribute('aria-checked', 'false');
    });

    it('disabled CheckboxItem has aria-disabled', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.CheckboxItem disabled>Bold</Dropdown.CheckboxItem>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.getByRole('menuitemcheckbox', { name: 'Bold' })).toHaveAttribute(
        'aria-disabled',
        'true'
      );
    });
  });

  // ===========================================================================
  // RadioGroup + RadioItem Accessibility
  // ===========================================================================
  describe('RadioGroup + RadioItem Accessibility', () => {
    it('has no accessibility violations with RadioGroup', async () => {
      const { container } = render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.RadioGroup value="sm">
              <Dropdown.RadioItem value="sm">Small</Dropdown.RadioItem>
              <Dropdown.RadioItem value="md">Medium</Dropdown.RadioItem>
            </Dropdown.RadioGroup>
          </Dropdown.Menu>
        </Dropdown>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('RadioItem has correct ARIA role and state', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.RadioGroup value="md">
              <Dropdown.RadioItem value="sm">Small</Dropdown.RadioItem>
              <Dropdown.RadioItem value="md">Medium</Dropdown.RadioItem>
            </Dropdown.RadioGroup>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.getByRole('menuitemradio', { name: 'Small' })).toHaveAttribute(
        'aria-checked',
        'false'
      );
      expect(screen.getByRole('menuitemradio', { name: 'Medium' })).toHaveAttribute(
        'aria-checked',
        'true'
      );
    });

    it('disabled RadioItem has aria-disabled', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.RadioGroup>
              <Dropdown.RadioItem value="a" disabled>
                Option A
              </Dropdown.RadioItem>
            </Dropdown.RadioGroup>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.getByRole('menuitemradio', { name: 'Option A' })).toHaveAttribute(
        'aria-disabled',
        'true'
      );
    });
  });

  // ===========================================================================
  // Group Accessibility
  // ===========================================================================
  describe('Group Accessibility', () => {
    it('has no accessibility violations with Group', async () => {
      const { container } = render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Group label="File">
              <Dropdown.Item>New</Dropdown.Item>
              <Dropdown.Item>Open</Dropdown.Item>
            </Dropdown.Group>
          </Dropdown.Menu>
        </Dropdown>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('Group label is linked via aria-labelledby', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Group label="File" data-testid="group">
              <Dropdown.Item>New</Dropdown.Item>
            </Dropdown.Group>
          </Dropdown.Menu>
        </Dropdown>
      );

      const group = screen.getByRole('group');
      const labelId = group.getAttribute('aria-labelledby');
      expect(labelId).toBeTruthy();
      const label = document.getElementById(labelId!);
      expect(label).toHaveTextContent('File');
    });
  });

  // ===========================================================================
  // Shortcut Accessibility
  // ===========================================================================
  describe('Shortcut Accessibility', () => {
    it('Shortcut is hidden from screen readers', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Options</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>
              Save
              <Dropdown.Shortcut data-testid="shortcut">Ctrl+S</Dropdown.Shortcut>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );

      expect(screen.getByTestId('shortcut')).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
