/**
 * Accordion Accessibility Tests
 *
 * Tests for WCAG 2.2 AA compliance using jest-axe.
 * Covers keyboard navigation, ARIA attributes, and screen reader support.
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

import { Accordion } from './Accordion';

expect.extend(toHaveNoViolations);

// =============================================================================
// Test Setup
// =============================================================================

const defaultItems = [
  { key: '1', title: 'Section 1', content: 'Content for section 1' },
  { key: '2', title: 'Section 2', content: 'Content for section 2' },
  { key: '3', title: 'Section 3', content: 'Content for section 3' },
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
// Automated A11y Tests (jest-axe)
// =============================================================================

describe('Accordion Accessibility', () => {
  describe('Automated A11y Checks (jest-axe)', () => {
    it('has no accessibility violations in default state', async () => {
      const { container } = renderAccordion();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with one item expanded', async () => {
      const { container } = renderAccordion({ defaultActiveKeys: ['1'] });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with multiple items expanded', async () => {
      const { container } = renderAccordion({
        selectionMode: 'multiple',
        defaultActiveKeys: ['1', '2'],
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with all items expanded', async () => {
      const { container } = renderAccordion({
        selectionMode: 'multiple',
        defaultActiveKeys: ['1', '2', '3'],
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with disabled item', async () => {
      const { container } = render(
        <Accordion>
          <Accordion.Item eventKey="1">
            <Accordion.Button>Enabled Section</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item eventKey="2" disabled>
            <Accordion.Button>Disabled Section</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with flush variant', async () => {
      const { container } = renderAccordion({ flush: true });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations after user interaction', async () => {
      const user = userEvent.setup();
      const { container } = renderAccordion();

      // Expand first item
      await user.click(screen.getByText('Section 1'));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ===========================================================================
  // ARIA Attributes Tests
  // ===========================================================================

  describe('ARIA Attributes', () => {
    it('buttons have aria-expanded attribute', () => {
      renderAccordion();
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('aria-expanded');
      });
    });

    it('buttons have correct aria-expanded value when collapsed', () => {
      renderAccordion();
      const button = screen.getByText('Section 1');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('buttons have correct aria-expanded value when expanded', () => {
      renderAccordion({ defaultActiveKeys: ['1'] });
      const button = screen.getByText('Section 1');
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('buttons have aria-controls pointing to panels', () => {
      const { container } = renderAccordion();
      const buttons = screen.getAllByRole('button');

      buttons.forEach((button) => {
        const controlsId = button.getAttribute('aria-controls');
        expect(controlsId).toBeTruthy();
        expect(container.querySelector(`#${controlsId}`)).toBeInTheDocument();
      });
    });

    it('panels have role="region"', () => {
      renderAccordion();
      const regions = screen.getAllByRole('region', { hidden: true });
      expect(regions.length).toBeGreaterThan(0);
    });

    it('panels have aria-labelledby pointing to buttons', () => {
      const { container } = renderAccordion();
      const buttons = screen.getAllByRole('button');
      const panels = container.querySelectorAll('.accordion-collapse');

      expect(panels).toHaveLength(buttons.length);

      // Collect all button IDs as a Set for lookup
      const buttonIdSet = new Set(buttons.map((b) => b.id));

      // Verify each panel's aria-labelledby references a valid button ID
      panels.forEach((panel) => {
        const labelledBy = panel.getAttribute('aria-labelledby');
        expect(labelledBy).toBeTruthy();
        expect(buttonIdSet.has(labelledBy as string)).toBe(true);
      });
    });

    it('disabled buttons have disabled attribute', () => {
      render(
        <Accordion>
          <Accordion.Item eventKey="1" disabled>
            <Accordion.Button>Disabled Section</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('button IDs are unique', () => {
      renderAccordion();
      const buttons = screen.getAllByRole('button');
      const ids = buttons.map((b) => b.id);
      const uniqueIds = [...new Set(ids)];
      expect(uniqueIds).toHaveLength(buttons.length);
    });

    it('panel IDs are unique', () => {
      const { container } = renderAccordion();
      const panels = container.querySelectorAll('.accordion-collapse');
      const ids = Array.from(panels).map((p) => p.id);
      const uniqueIds = [...new Set(ids)];
      expect(uniqueIds).toHaveLength(panels.length);
    });
  });

  // ===========================================================================
  // Keyboard Navigation Tests
  // ===========================================================================

  describe('Keyboard Navigation', () => {
    it('buttons are focusable with Tab', async () => {
      const user = userEvent.setup();
      renderAccordion();

      const button1 = screen.getByText('Section 1');

      await user.tab();
      expect(document.activeElement).toBe(button1);
    });

    it('can navigate between buttons with Tab', async () => {
      const user = userEvent.setup();
      renderAccordion();

      const [button1, button2, button3] = screen.getAllByRole('button');

      await user.tab();
      expect(document.activeElement).toBe(button1);

      await user.tab();
      expect(document.activeElement).toBe(button2);

      await user.tab();
      expect(document.activeElement).toBe(button3);
    });

    it('can navigate backwards with Shift+Tab', async () => {
      const user = userEvent.setup();
      renderAccordion();

      const buttons = screen.getAllByRole('button');
      const button1 = buttons[0];
      const button2 = buttons[1];
      expect(button1).toBeDefined();
      expect(button2).toBeDefined();

      button2?.focus();
      await user.tab({ shift: true });
      expect(document.activeElement).toBe(button1);
    });

    it('Enter key toggles accordion item', async () => {
      const user = userEvent.setup();
      renderAccordion();

      const button = screen.getByText('Section 1');
      button.focus();

      await user.keyboard('{Enter}');
      expect(button).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard('{Enter}');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('Space key toggles accordion item', async () => {
      const user = userEvent.setup();
      renderAccordion();

      const button = screen.getByText('Section 1');
      button.focus();

      await user.keyboard(' ');
      expect(button).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard(' ');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('disabled buttons cannot be activated with keyboard', async () => {
      const user = userEvent.setup();
      render(
        <Accordion>
          <Accordion.Item eventKey="1" disabled>
            <Accordion.Button>Disabled Section</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      const button = screen.getByText('Disabled Section');
      button.focus();

      await user.keyboard('{Enter}');
      expect(button).toHaveAttribute('aria-expanded', 'false');

      await user.keyboard(' ');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('buttons have visible focus indicators (via focus-visible)', async () => {
      const user = userEvent.setup();
      renderAccordion();

      const button = screen.getByText('Section 1');
      await user.tab();

      // Button should be focusable
      expect(document.activeElement).toBe(button);
      // Bootstrap provides focus styles via .accordion-button:focus
      expect(button).toHaveClass('accordion-button');
    });
  });

  // ===========================================================================
  // Screen Reader Announcements
  // ===========================================================================

  describe('Screen Reader Support', () => {
    it('expanded state is announced via aria-expanded', () => {
      renderAccordion({ defaultActiveKeys: ['1'] });
      const button = screen.getByText('Section 1');

      // Screen readers will announce this as expanded
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('collapsed state is announced via aria-expanded', () => {
      renderAccordion();
      const button = screen.getByText('Section 1');

      // Screen readers will announce this as collapsed
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('panel content is associated with button via aria-labelledby', () => {
      const { container } = renderAccordion({ defaultActiveKeys: ['1'] });
      const button = screen.getByText('Section 1');
      const panel = container.querySelector('.accordion-collapse.show');

      expect(panel).toHaveAttribute('aria-labelledby', button.id);
    });

    it('panel is marked as region for landmark navigation', () => {
      renderAccordion({ defaultActiveKeys: ['1'] });
      const regions = screen.getAllByRole('region', { hidden: true });
      expect(regions.length).toBeGreaterThan(0);
    });

    it('button role is implicit from button element', () => {
      renderAccordion();
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });
  });

  // ===========================================================================
  // Focus Management
  // ===========================================================================

  describe('Focus Management', () => {
    it('focus remains on button after toggle', async () => {
      const user = userEvent.setup();
      renderAccordion();

      const button = screen.getByText('Section 1');
      await user.click(button);

      // Focus should remain on the button after clicking
      expect(document.activeElement).toBe(button);
    });

    it('focus is not trapped in accordion', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <button>Before</button>
          <Accordion>
            <Accordion.Item eventKey="1">
              <Accordion.Button>Section 1</Accordion.Button>
              <Accordion.Panel>Content</Accordion.Panel>
            </Accordion.Item>
          </Accordion>
          <button>After</button>
        </div>
      );

      const afterButton = screen.getByText('After');
      const accordionButton = screen.getByText('Section 1');

      accordionButton.focus();
      await user.tab();
      expect(document.activeElement).toBe(afterButton);
    });

    it('expanded content is focusable if it contains interactive elements', async () => {
      const user = userEvent.setup();
      render(
        <Accordion defaultActiveKeys={['1']}>
          <Accordion.Item eventKey="1">
            <Accordion.Button>Section 1</Accordion.Button>
            <Accordion.Panel>
              <button>Inner Button</button>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      const accordionButton = screen.getByText('Section 1');
      const innerButton = screen.getByText('Inner Button');

      accordionButton.focus();
      await user.tab();

      expect(document.activeElement).toBe(innerButton);
    });
  });

  // ===========================================================================
  // Color Contrast (Visual)
  // ===========================================================================

  describe('Visual Accessibility', () => {
    it('applies visual state to items for styling', () => {
      render(
        <Accordion defaultActiveKeys={['1']}>
          <Accordion.Item eventKey="1" data-testid="expanded-item">
            <Accordion.Button>Expanded</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item eventKey="2" data-testid="collapsed-item">
            <Accordion.Button>Collapsed</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      expect(screen.getByTestId('expanded-item')).toHaveAttribute('data-visual-state', 'expanded');
      expect(screen.getByTestId('collapsed-item')).toHaveAttribute(
        'data-visual-state',
        'collapsed'
      );
    });

    it('collapsed button has collapsed class for visual styling', () => {
      renderAccordion();
      const button = screen.getByText('Section 1');
      expect(button).toHaveClass('collapsed');
    });

    it('expanded button does not have collapsed class', () => {
      renderAccordion({ defaultActiveKeys: ['1'] });
      const button = screen.getByText('Section 1');
      expect(button).not.toHaveClass('collapsed');
    });
  });

  // ===========================================================================
  // Heading Structure (when using headings in items)
  // ===========================================================================

  describe('Semantic Heading Structure', () => {
    it('allows wrapping button in heading for semantic structure', async () => {
      const { container } = render(
        <Accordion>
          <Accordion.Item eventKey="1">
            <h2 className="accordion-header">
              <Accordion.Button>Section Title</Accordion.Button>
            </h2>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      const heading = container.querySelector('h2.accordion-header');
      expect(heading).toBeInTheDocument();
      expect(heading?.querySelector('button')).toBeInTheDocument();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports custom heading levels', async () => {
      const { container } = render(
        <Accordion>
          <Accordion.Item eventKey="1">
            <h3 className="accordion-header">
              <Accordion.Button>Level 3 Section</Accordion.Button>
            </h3>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      expect(container.querySelector('h3.accordion-header')).toBeInTheDocument();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
