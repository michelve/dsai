/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

import { TabsPro } from './TabsPro';
import type { TabsProItem } from './TabsPro.types';

expect.extend(toHaveNoViolations);

// =============================================================================
// Test Data
// =============================================================================

const createSampleItems = (): TabsProItem[] => [
  { id: 'home', label: 'Home', content: <p>Home content</p> },
  { id: 'profile', label: 'Profile', content: <p>Profile content</p> },
  { id: 'settings', label: 'Settings', content: <p>Settings content</p> },
];

// Helper to wait for static content to load through FSM
const waitForContent = async (text: string) => {
  await waitFor(
    () => {
      expect(screen.getByText(text)).toBeInTheDocument();
    },
    { timeout: 3000 }
  );
};

// =============================================================================
// Accessibility Tests
// =============================================================================

describe('TabsPro Accessibility', () => {
  // ===========================================================================
  // Axe Automated Testing
  // ===========================================================================

  describe('Axe Automated Testing', () => {
    it('has no accessibility violations with default tabs', async () => {
      const { container } = render(<TabsPro items={createSampleItems()} />);

      await waitForContent('Home content');

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with pills variant', async () => {
      const { container } = render(<TabsPro items={createSampleItems()} variant="pills" />);

      await waitForContent('Home content');

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with underline variant', async () => {
      const { container } = render(<TabsPro items={createSampleItems()} variant="underline" />);

      await waitForContent('Home content');

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with vertical orientation', async () => {
      const { container } = render(<TabsPro items={createSampleItems()} orientation="vertical" />);

      await waitForContent('Home content');

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with disabled tabs', async () => {
      const items: TabsProItem[] = [
        ...createSampleItems(),
        { id: 'disabled', label: 'Disabled', content: <p>Disabled</p>, disabled: true },
      ];

      const { container } = render(<TabsPro items={items} />);

      await waitForContent('Home content');

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations in loading state', async () => {
      const loadContent = jest.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(<p>Content</p>), 500);
          })
      );

      const items: TabsProItem[] = [{ id: 'async', label: 'Async', loadContent }];

      const { container } = render(<TabsPro items={items} />);

      await waitFor(
        () => {
          expect(screen.getByRole('status')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations in error state', async () => {
      const loadContent = jest.fn().mockRejectedValue(new Error('Failed'));

      const items: TabsProItem[] = [{ id: 'error', label: 'Error', loadContent }];

      const { container } = render(<TabsPro items={items} />);

      await waitFor(
        () => {
          expect(screen.getByRole('alert')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations in blocked state', async () => {
      const guard = jest.fn().mockResolvedValue({ allowed: false, reason: 'Not authorized' });

      const items: TabsProItem[] = [
        {
          id: 'guarded',
          label: 'Guarded',
          guard,
          content: <p>Protected</p>,
        },
      ];

      const { container } = render(<TabsPro items={items} />);

      await waitFor(
        () => {
          expect(screen.getByText('Access Restricted')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with leave confirmation modal', async () => {
      const isDirty = jest.fn().mockReturnValue(true);

      const { container } = render(<TabsPro items={createSampleItems()} isDirty={isDirty} />);

      await waitForContent('Home content');

      await userEvent.click(screen.getByRole('tab', { name: 'Profile' }));

      await waitFor(
        () => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ===========================================================================
  // ARIA Attributes
  // ===========================================================================

  describe('ARIA Attributes', () => {
    it('has role="tablist" on container', async () => {
      render(<TabsPro items={createSampleItems()} />);

      await waitForContent('Home content');

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('has role="tab" on tab buttons', async () => {
      render(<TabsPro items={createSampleItems()} />);

      await waitForContent('Home content');

      expect(screen.getAllByRole('tab')).toHaveLength(3);
    });

    it('has role="tabpanel" on content', async () => {
      render(<TabsPro items={createSampleItems()} />);

      await waitForContent('Home content');

      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('has aria-selected on tabs', async () => {
      render(<TabsPro items={createSampleItems()} />);

      await waitForContent('Home content');

      expect(screen.getByRole('tab', { name: 'Home' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute(
        'aria-selected',
        'false'
      );
    });

    it('has aria-controls linking tab to panel', async () => {
      render(<TabsPro items={createSampleItems()} id="test" />);

      await waitForContent('Home content');

      const homeTab = screen.getByRole('tab', { name: 'Home' });
      expect(homeTab).toHaveAttribute('aria-controls', 'test-panel-home');
    });

    it('has aria-labelledby linking panel to tab', async () => {
      render(<TabsPro items={createSampleItems()} id="test" />);

      await waitForContent('Home content');

      const panel = screen.getByRole('tabpanel');
      expect(panel).toHaveAttribute('aria-labelledby', 'test-tab-home');
    });

    it('has aria-orientation on tablist', async () => {
      render(<TabsPro items={createSampleItems()} orientation="vertical" />);

      await waitForContent('Home content');

      expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('active tab has tabIndex 0, inactive tabs have tabIndex -1', async () => {
      render(<TabsPro items={createSampleItems()} />);

      await waitForContent('Home content');

      expect(screen.getByRole('tab', { name: 'Home' })).toHaveAttribute('tabIndex', '0');
      expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('tabIndex', '-1');
    });
  });

  // ===========================================================================
  // Loading State Accessibility
  // ===========================================================================

  describe('Loading State Accessibility', () => {
    it('loading indicator has role="status"', async () => {
      const loadContent = jest.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(<p>Content</p>), 500);
          })
      );

      const items: TabsProItem[] = [{ id: 'async', label: 'Async', loadContent }];

      render(<TabsPro items={items} />);

      await waitFor(
        () => {
          expect(screen.getByRole('status')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('loading indicator has aria-live="polite"', async () => {
      const loadContent = jest.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(<p>Content</p>), 500);
          })
      );

      const items: TabsProItem[] = [{ id: 'async', label: 'Async', loadContent }];

      render(<TabsPro items={items} />);

      await waitFor(
        () => {
          const status = screen.getByRole('status');
          expect(status).toHaveAttribute('aria-live', 'polite');
        },
        { timeout: 3000 }
      );
    });

    it('loading spinner has visually-hidden text', async () => {
      const loadContent = jest.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(<p>Content</p>), 500);
          })
      );

      const items: TabsProItem[] = [{ id: 'async', label: 'Async', loadContent }];

      const { container } = render(<TabsPro items={items} />);

      await waitFor(
        () => {
          expect(screen.getByRole('status')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const hiddenText = container.querySelector('.visually-hidden');
      expect(hiddenText).toBeInTheDocument();
      expect(hiddenText).toHaveTextContent('Loading');
    });
  });

  // ===========================================================================
  // Error State Accessibility
  // ===========================================================================

  describe('Error State Accessibility', () => {
    it('error container has role="alert"', async () => {
      const loadContent = jest.fn().mockRejectedValue(new Error('Failed'));

      const items: TabsProItem[] = [{ id: 'error', label: 'Error', loadContent }];

      render(<TabsPro items={items} />);

      await waitFor(
        () => {
          expect(screen.getByRole('alert')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('retry button is keyboard accessible', async () => {
      const loadContent = jest.fn().mockRejectedValue(new Error('Failed'));

      const items: TabsProItem[] = [{ id: 'error', label: 'Error', loadContent }];

      render(<TabsPro items={items} />);

      await waitFor(
        () => {
          expect(screen.getByText('Try again')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const retryButton = screen.getByText('Try again');
      retryButton.focus();

      expect(document.activeElement).toBe(retryButton);
    });
  });

  // ===========================================================================
  // Modal Accessibility
  // ===========================================================================

  describe('Modal Accessibility', () => {
    it('modal has role="dialog"', async () => {
      const isDirty = jest.fn().mockReturnValue(true);

      render(<TabsPro items={createSampleItems()} isDirty={isDirty} />);

      await waitForContent('Home content');

      await userEvent.click(screen.getByRole('tab', { name: 'Profile' }));

      await waitFor(
        () => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('modal has aria-modal="true"', async () => {
      const isDirty = jest.fn().mockReturnValue(true);

      render(<TabsPro items={createSampleItems()} isDirty={isDirty} />);

      await waitForContent('Home content');

      await userEvent.click(screen.getByRole('tab', { name: 'Profile' }));

      await waitFor(
        () => {
          const dialog = screen.getByRole('dialog');
          expect(dialog).toHaveAttribute('aria-modal', 'true');
        },
        { timeout: 3000 }
      );
    });

    it('modal has aria-labelledby', async () => {
      const isDirty = jest.fn().mockReturnValue(true);

      render(<TabsPro items={createSampleItems()} isDirty={isDirty} />);

      await waitForContent('Home content');

      await userEvent.click(screen.getByRole('tab', { name: 'Profile' }));

      await waitFor(
        () => {
          const dialog = screen.getByRole('dialog');
          expect(dialog).toHaveAttribute('aria-labelledby', 'leave-confirm-title');
        },
        { timeout: 3000 }
      );
    });

    it('close button has accessible label', async () => {
      const isDirty = jest.fn().mockReturnValue(true);

      render(<TabsPro items={createSampleItems()} isDirty={isDirty} />);

      await waitForContent('Home content');

      await userEvent.click(screen.getByRole('tab', { name: 'Profile' }));

      await waitFor(
        () => {
          expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  // ===========================================================================
  // Keyboard Navigation
  // ===========================================================================

  describe('Keyboard Navigation', () => {
    it('tabs are keyboard navigable with arrow keys', async () => {
      render(<TabsPro items={createSampleItems()} />);

      await waitForContent('Home content');

      const homeTab = screen.getByRole('tab', { name: 'Home' });
      homeTab.focus();

      await userEvent.keyboard('{ArrowRight}');

      await waitFor(
        () => {
          expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute(
            'aria-selected',
            'true'
          );
        },
        { timeout: 3000 }
      );
    });

    it('disabled tabs are skipped during keyboard navigation', async () => {
      const items: TabsProItem[] = [
        { id: 'home', label: 'Home', content: <p>Home content</p> },
        { id: 'disabled', label: 'Disabled', content: <p>Disabled content</p>, disabled: true },
        { id: 'settings', label: 'Settings', content: <p>Settings content</p> },
      ];

      render(<TabsPro items={items} />);

      await waitForContent('Home content');

      const homeTab = screen.getByRole('tab', { name: 'Home' });
      homeTab.focus();

      await userEvent.keyboard('{ArrowRight}');

      await waitFor(
        () => {
          // Should skip disabled and go to settings
          expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute(
            'aria-selected',
            'true'
          );
        },
        { timeout: 3000 }
      );
    });
  });

  // ===========================================================================
  // Blocked State Accessibility
  // ===========================================================================

  describe('Blocked State Accessibility', () => {
    it('blocked state icon is hidden from screen readers', async () => {
      const guard = jest.fn().mockResolvedValue({ allowed: false, reason: 'Not authorized' });

      const items: TabsProItem[] = [
        {
          id: 'guarded',
          label: 'Guarded',
          guard,
          content: <p>Protected</p>,
        },
      ];

      const { container } = render(<TabsPro items={items} />);

      await waitFor(
        () => {
          expect(screen.getByText('Access Restricted')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('blocked state action button is keyboard accessible', async () => {
      const onAction = jest.fn();
      const guard = jest.fn().mockResolvedValue({
        allowed: false,
        actionLabel: 'Upgrade',
        onAction,
      });

      const items: TabsProItem[] = [
        {
          id: 'guarded',
          label: 'Guarded',
          guard,
          content: <p>Protected</p>,
        },
      ];

      render(<TabsPro items={items} />);

      await waitFor(
        () => {
          expect(screen.getByText('Upgrade')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const button = screen.getByText('Upgrade');
      button.focus();

      expect(document.activeElement).toBe(button);

      await userEvent.keyboard('{Enter}');

      expect(onAction).toHaveBeenCalled();
    });
  });
});
