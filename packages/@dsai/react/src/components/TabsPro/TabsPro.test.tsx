/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';

import { TabsPro } from './TabsPro';

import type { GuardResult, TabsProItem } from './TabsPro.types';

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
// Tests
// =============================================================================

describe('TabsPro', () => {
  // ===========================================================================
  // Basic Rendering
  // ===========================================================================

  describe('Basic Rendering', () => {
    it('renders tabs with items prop', () => {
      render(<TabsPro items={createSampleItems()} />);

      expect(screen.getByRole('tab', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Profile' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Settings' })).toBeInTheDocument();
    });

    it('renders first tab as active by default', () => {
      render(<TabsPro items={createSampleItems()} />);

      expect(screen.getByRole('tab', { name: 'Home' })).toHaveAttribute('aria-selected', 'true');
    });

    it('renders defaultActiveId tab as active', async () => {
      render(<TabsPro items={createSampleItems()} defaultActiveId="profile" />);

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

    it('renders static content after FSM transitions', async () => {
      render(<TabsPro items={createSampleItems()} />);

      await waitForContent('Home content');
    });
  });

  // ===========================================================================
  // Variants
  // ===========================================================================

  describe('Variants', () => {
    it('renders tabs variant by default', () => {
      const { container } = render(<TabsPro items={createSampleItems()} />);
      expect(container.querySelector('.nav-tabs')).toBeInTheDocument();
    });

    it('renders pills variant', () => {
      const { container } = render(<TabsPro items={createSampleItems()} variant="pills" />);
      expect(container.querySelector('.nav-pills')).toBeInTheDocument();
    });

    it('renders underline variant', () => {
      const { container } = render(<TabsPro items={createSampleItems()} variant="underline" />);
      expect(container.querySelector('.nav-underline')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Orientation
  // ===========================================================================

  describe('Orientation', () => {
    it('renders horizontal orientation by default', () => {
      const { container } = render(<TabsPro items={createSampleItems()} />);
      expect(container.querySelector('.flex-column')).not.toBeInTheDocument();
    });

    it('renders vertical orientation', () => {
      const { container } = render(<TabsPro items={createSampleItems()} orientation="vertical" />);
      expect(container.querySelector('.flex-column')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Controlled Mode
  // ===========================================================================

  describe('Controlled Mode', () => {
    it('respects controlled activeId', () => {
      render(<TabsPro items={createSampleItems()} activeId="profile" />);

      expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true');
    });

    it('calls onActiveChange when tab is clicked', async () => {
      const handleChange = jest.fn();
      render(<TabsPro items={createSampleItems()} activeId="home" onActiveChange={handleChange} />);

      await userEvent.click(screen.getByRole('tab', { name: 'Profile' }));

      expect(handleChange).toHaveBeenCalledWith('profile');
    });
  });

  // ===========================================================================
  // Uncontrolled Mode
  // ===========================================================================

  describe('Uncontrolled Mode', () => {
    it('changes tab when clicked in uncontrolled mode', async () => {
      render(<TabsPro items={createSampleItems()} />);

      await userEvent.click(screen.getByRole('tab', { name: 'Profile' }));

      expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true');
    });

    it('calls onActiveChange in uncontrolled mode', async () => {
      const handleChange = jest.fn();
      render(<TabsPro items={createSampleItems()} onActiveChange={handleChange} />);

      await userEvent.click(screen.getByRole('tab', { name: 'Profile' }));

      expect(handleChange).toHaveBeenCalledWith('profile');
    });
  });

  // ===========================================================================
  // Async Loading
  // ===========================================================================

  describe('Async Loading', () => {
    it('shows loading state while content is loading', async () => {
      const loadContent = jest.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(<p>Loaded content</p>), 100);
          })
      );

      const items: TabsProItem[] = [{ id: 'async', label: 'Async', loadContent }];

      render(<TabsPro items={items} />);

      // Should show loading state
      await waitFor(
        () => {
          expect(screen.getByRole('status')).toBeInTheDocument();
          expect(screen.getByText('Loading...')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('shows loaded content after async load completes', async () => {
      const loadContent = jest.fn().mockResolvedValue(<p>Loaded content</p>);

      const items: TabsProItem[] = [{ id: 'async', label: 'Async', loadContent }];

      render(<TabsPro items={items} />);

      await waitFor(
        () => {
          expect(screen.getByText('Loaded content')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('uses custom loadingFallback when provided', async () => {
      const loadContent = jest.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(<p>Content</p>), 100);
          })
      );

      const items: TabsProItem[] = [
        {
          id: 'async',
          label: 'Async',
          loadContent,
          loadingFallback: <div data-testid="custom-loader">Custom Loading</div>,
        },
      ];

      render(<TabsPro items={items} />);

      await waitFor(
        () => {
          expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('uses defaultLoadingFallback when no item fallback provided', async () => {
      const loadContent = jest.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(<p>Content</p>), 100);
          })
      );

      const items: TabsProItem[] = [{ id: 'async', label: 'Async', loadContent }];

      render(
        <TabsPro
          items={items}
          defaultLoadingFallback={<div data-testid="default-loader">Default Loading</div>}
        />
      );

      await waitFor(
        () => {
          expect(screen.getByTestId('default-loader')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('calls onViewed callback when content loads', async () => {
      const onViewed = jest.fn();
      const loadContent = jest.fn().mockResolvedValue(<p>Content</p>);

      const items: TabsProItem[] = [{ id: 'async', label: 'Async', loadContent, onViewed }];

      render(<TabsPro items={items} />);

      await waitFor(
        () => {
          expect(onViewed).toHaveBeenCalled();
        },
        { timeout: 3000 }
      );
    });
  });

  // ===========================================================================
  // Error Handling
  // ===========================================================================

  describe('Error Handling', () => {
    it('shows error state when loading fails', async () => {
      const loadContent = jest.fn().mockRejectedValue(new Error('Network error'));

      const items: TabsProItem[] = [{ id: 'error', label: 'Error', loadContent }];

      render(<TabsPro items={items} />);

      await waitFor(
        () => {
          expect(screen.getByRole('alert')).toBeInTheDocument();
          expect(screen.getByText('Something went wrong')).toBeInTheDocument();
          expect(screen.getByText('Network error')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('allows retry on error', async () => {
      let attempts = 0;
      const loadContent = jest.fn().mockImplementation(() => {
        attempts++;
        if (attempts === 1) {
          return Promise.reject(new Error('First attempt failed'));
        }
        return Promise.resolve(<p>Success on retry</p>);
      });

      const items: TabsProItem[] = [{ id: 'error', label: 'Error', loadContent }];

      render(<TabsPro items={items} />);

      // Wait for error state
      await waitFor(
        () => {
          expect(screen.getByText('Try again')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Click retry button
      await userEvent.click(screen.getByText('Try again'));

      // Should show success content
      await waitFor(
        () => {
          expect(screen.getByText('Success on retry')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('uses custom errorFallback when provided', async () => {
      const loadContent = jest.fn().mockRejectedValue(new Error('Failed'));

      const items: TabsProItem[] = [
        {
          id: 'error',
          label: 'Error',
          loadContent,
          errorFallback: (error, retry) => (
            <div data-testid="custom-error">
              <p>Custom Error: {(error as Error).message}</p>
              <button type="button" onClick={retry}>
                Custom Retry
              </button>
            </div>
          ),
        },
      ];

      render(<TabsPro items={items} />);

      await waitFor(
        () => {
          expect(screen.getByTestId('custom-error')).toBeInTheDocument();
          expect(screen.getByText('Custom Error: Failed')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('calls onError callback when loading fails', async () => {
      const onError = jest.fn();
      const error = new Error('Load failed');
      const loadContent = jest.fn().mockRejectedValue(error);

      const items: TabsProItem[] = [{ id: 'error', label: 'Error', loadContent, onError }];

      render(<TabsPro items={items} />);

      await waitFor(
        () => {
          expect(onError).toHaveBeenCalledWith(error);
        },
        { timeout: 3000 }
      );
    });
  });

  // ===========================================================================
  // Guard / Permission Gating
  // ===========================================================================

  describe('Guard / Permission Gating', () => {
    it('shows blocked state when guard returns false', async () => {
      const guard = jest.fn().mockResolvedValue({ allowed: false, reason: 'Not authorized' });

      const items: TabsProItem[] = [
        {
          id: 'guarded',
          label: 'Guarded',
          guard,
          content: <p>Protected content</p>,
        },
      ];

      render(<TabsPro items={items} />);

      await waitFor(
        () => {
          expect(screen.getByText('Access Restricted')).toBeInTheDocument();
          expect(screen.getByText('Not authorized')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('shows content when guard returns true', async () => {
      const guard = jest.fn().mockResolvedValue({ allowed: true });

      const items: TabsProItem[] = [
        {
          id: 'guarded',
          label: 'Guarded',
          guard,
          content: <p>Protected content</p>,
        },
      ];

      render(<TabsPro items={items} />);

      await waitFor(
        () => {
          expect(screen.getByText('Protected content')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('shows blocked state with action button', async () => {
      const onAction = jest.fn();
      const guard = jest.fn().mockResolvedValue({
        allowed: false,
        reason: 'Upgrade required',
        actionLabel: 'Upgrade Now',
        onAction,
      } as GuardResult);

      const items: TabsProItem[] = [
        {
          id: 'guarded',
          label: 'Guarded',
          guard,
          content: <p>Content</p>,
        },
      ];

      render(<TabsPro items={items} />);

      await waitFor(
        () => {
          expect(screen.getByText('Upgrade Now')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      await userEvent.click(screen.getByText('Upgrade Now'));

      expect(onAction).toHaveBeenCalled();
    });

    it('uses custom blockedFallback when provided', async () => {
      const guard = jest.fn().mockResolvedValue({ allowed: false });

      const items: TabsProItem[] = [
        {
          id: 'guarded',
          label: 'Guarded',
          guard,
          blockedFallback: <div data-testid="custom-blocked">Custom Blocked</div>,
        },
      ];

      render(<TabsPro items={items} />);

      await waitFor(
        () => {
          expect(screen.getByTestId('custom-blocked')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('calls onGuardFail callback when guard fails', async () => {
      const onGuardFail = jest.fn();
      const guard = jest.fn().mockResolvedValue({ allowed: false, reason: 'no-permission' });

      const items: TabsProItem[] = [
        {
          id: 'guarded',
          label: 'Guarded',
          guard,
          onGuardFail,
          content: <p>Content</p>,
        },
      ];

      render(<TabsPro items={items} />);

      await waitFor(
        () => {
          expect(onGuardFail).toHaveBeenCalledWith({ id: 'guarded', reason: 'no-permission' });
        },
        { timeout: 3000 }
      );
    });

    it('handles guard throwing error', async () => {
      const guard = jest.fn().mockRejectedValue(new Error('Guard error'));

      const items: TabsProItem[] = [
        {
          id: 'guarded',
          label: 'Guarded',
          guard,
          content: <p>Content</p>,
        },
      ];

      render(<TabsPro items={items} />);

      // Should show blocked state for guard error
      await waitFor(
        () => {
          expect(screen.getByText('Access Restricted')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  // ===========================================================================
  // Dirty / Leave Confirmation
  // ===========================================================================

  describe('Dirty / Leave Confirmation', () => {
    it('shows confirmation dialog when leaving dirty tab', async () => {
      const isDirty = jest.fn().mockReturnValue(true);

      const items = createSampleItems();

      render(<TabsPro items={items} isDirty={isDirty} />);

      // Wait for initial load
      await waitForContent('Home content');

      // Try to switch tabs
      await userEvent.click(screen.getByRole('tab', { name: 'Profile' }));

      // Should show confirmation dialog
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Unsaved Changes')).toBeInTheDocument();
      });
    });

    it('stays on current tab when cancel is clicked', async () => {
      const isDirty = jest.fn().mockReturnValue(true);

      const items = createSampleItems();

      render(<TabsPro items={items} isDirty={isDirty} />);

      await waitForContent('Home content');

      await userEvent.click(screen.getByRole('tab', { name: 'Profile' }));

      await waitFor(
        () => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Click Stay button
      await userEvent.click(screen.getByRole('button', { name: 'Stay' }));

      // Should still be on Home tab
      expect(screen.getByRole('tab', { name: 'Home' })).toHaveAttribute('aria-selected', 'true');
    });

    it('switches tab when leave is confirmed', async () => {
      const isDirty = jest.fn().mockReturnValue(true);

      const items = createSampleItems();

      render(<TabsPro items={items} isDirty={isDirty} />);

      await waitForContent('Home content');

      await userEvent.click(screen.getByRole('tab', { name: 'Profile' }));

      await waitFor(
        () => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Click Leave button
      await userEvent.click(screen.getByRole('button', { name: 'Leave' }));

      // Should switch to Profile tab
      await waitFor(() => {
        expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute(
          'aria-selected',
          'true'
        );
      });
    });

    it('uses custom dirtyConfirmMessage', async () => {
      const isDirty = jest.fn().mockReturnValue(true);
      const customMessage = 'Are you sure you want to leave?';

      render(
        <TabsPro
          items={createSampleItems()}
          isDirty={isDirty}
          dirtyConfirmMessage={customMessage}
        />
      );

      await waitForContent('Home content');

      await userEvent.click(screen.getByRole('tab', { name: 'Profile' }));

      await waitFor(
        () => {
          expect(screen.getByText(customMessage)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('calls onDirtyLeave when user confirms leave', async () => {
      const isDirty = jest.fn().mockReturnValue(true);
      const onDirtyLeave = jest.fn();

      render(<TabsPro items={createSampleItems()} isDirty={isDirty} onDirtyLeave={onDirtyLeave} />);

      await waitForContent('Home content');

      await userEvent.click(screen.getByRole('tab', { name: 'Profile' }));

      await waitFor(
        () => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      await userEvent.click(screen.getByRole('button', { name: 'Leave' }));

      expect(onDirtyLeave).toHaveBeenCalledWith('home', 'profile');
    });

    it('calls onDirtyStay when user cancels leave', async () => {
      const isDirty = jest.fn().mockReturnValue(true);
      const onDirtyStay = jest.fn();

      render(<TabsPro items={createSampleItems()} isDirty={isDirty} onDirtyStay={onDirtyStay} />);

      await waitForContent('Home content');

      await userEvent.click(screen.getByRole('tab', { name: 'Profile' }));

      await waitFor(
        () => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      await userEvent.click(screen.getByRole('button', { name: 'Stay' }));

      expect(onDirtyStay).toHaveBeenCalledWith('home');
    });

    it('can close modal with X button', async () => {
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

      // Click close button
      await userEvent.click(screen.getByRole('button', { name: 'Close' }));

      // Modal should close and stay on Home
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Home' })).toHaveAttribute('aria-selected', 'true');
    });
  });

  // ===========================================================================
  // Analytics Callbacks
  // ===========================================================================

  describe('Analytics Callbacks', () => {
    it('calls onActivate when tab is activated', async () => {
      const onActivate = jest.fn();

      const items: TabsProItem[] = [
        { id: 'home', label: 'Home', content: <p>Home</p> },
        { id: 'profile', label: 'Profile', content: <p>Profile</p>, onActivate },
      ];

      render(<TabsPro items={items} />);

      await userEvent.click(screen.getByRole('tab', { name: 'Profile' }));

      expect(onActivate).toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // Disabled Tabs
  // ===========================================================================

  describe('Disabled Tabs', () => {
    it('renders disabled tab', () => {
      const items: TabsProItem[] = [
        { id: 'home', label: 'Home', content: <p>Home</p> },
        { id: 'disabled', label: 'Disabled', content: <p>Disabled</p>, disabled: true },
      ];

      render(<TabsPro items={items} />);

      const disabledTab = screen.getByRole('tab', { name: 'Disabled' });
      expect(disabledTab).toBeDisabled();
    });
  });

  // ===========================================================================
  // Icons
  // ===========================================================================

  describe('Icons', () => {
    it('renders tabs with icons', () => {
      const items: TabsProItem[] = [
        {
          id: 'home',
          label: 'Home',
          content: <p>Home</p>,
          icon: <span data-testid="home-icon">🏠</span>,
        },
      ];

      render(<TabsPro items={items} />);

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Ref Forwarding
  // ===========================================================================

  describe('Ref Forwarding', () => {
    it('forwards ref to container', () => {
      const ref = createRef<HTMLDivElement>();
      render(<TabsPro ref={ref} items={createSampleItems()} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  // ===========================================================================
  // Custom Styling
  // ===========================================================================

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      const { container } = render(<TabsPro items={createSampleItems()} className="custom-tabs" />);
      expect(container.querySelector('.custom-tabs')).toBeInTheDocument();
    });

    it('accepts custom id', () => {
      render(<TabsPro items={createSampleItems()} id="my-tabs" />);
      expect(document.getElementById('my-tabs')).toBeInTheDocument();
    });

    it('accepts inline styles', () => {
      const { container } = render(
        <TabsPro items={createSampleItems()} style={{ marginTop: '10px' }} />
      );
      expect(container.firstChild).toHaveStyle({ marginTop: '10px' });
    });
  });

  // ===========================================================================
  // Fill and Justified
  // ===========================================================================

  describe('Fill and Justified', () => {
    it('renders fill tabs', () => {
      const { container } = render(<TabsPro items={createSampleItems()} fill />);
      expect(container.querySelector('.nav-fill')).toBeInTheDocument();
    });

    it('renders justified tabs', () => {
      const { container } = render(<TabsPro items={createSampleItems()} justified />);
      expect(container.querySelector('.nav-justified')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Display Name
  // ===========================================================================

  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(TabsPro.displayName).toBe('TabsPro');
    });
  });
});
