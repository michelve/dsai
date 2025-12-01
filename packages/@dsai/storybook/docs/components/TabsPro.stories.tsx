import { TabsPro } from '@dsai/react';
import { useCallback, useId, useState } from 'react';

import type { GuardResult, TabsProItem } from '@dsai/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * TabsPro - Advanced tabs with FSM-based state management.
 *
 * Features:
 * - **Async lazy loading** with loading states
 * - **Permission/guard gating** with blocked states
 * - **Error states** with retry functionality
 * - **Dirty state handling** with leave confirmation
 * - **Analytics hooks** for tracking tab interactions
 *
 * Security Guardrails:
 * - Tab IDs must match `/^[A-Za-z0-9._:-]+$/`; invalid IDs are ignored before reaching the DOM
 * - All per-tab state writes run through a sanitizer that clones the tab map and blocks prototype
 *   pollution / object-injection attempts
 *
 * Built on top of the base Tabs component with Bootstrap 5 styling and WCAG 2.2 AA compliance.
 */
const meta: Meta<typeof TabsPro> = {
  title: 'Components/TabsPro',
  component: TabsPro,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Advanced tab system with FSM-based async loading, permission gating, ' +
          'error handling, and analytics hooks. Tab IDs must use safe characters ' +
          '(letters, numbers, dot, underscore, colon, or hyphen) so the FSM can ' +
          'enforce the new state sanitization guardrails.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['tabs', 'pills', 'underline'],
      description: 'Visual variant',
      table: {
        type: { summary: 'TabsVariant' },
        defaultValue: { summary: 'tabs' },
      },
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Tab orientation',
      table: {
        type: { summary: 'TabsOrientation' },
        defaultValue: { summary: 'horizontal' },
      },
    },
    fill: {
      control: 'boolean',
      description: 'Fill available width',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    justified: {
      control: 'boolean',
      description: 'Evenly justify tabs',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    keepMounted: {
      control: 'boolean',
      description: 'Keep inactive panels mounted',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// Helper Functions
// =============================================================================

/** Simulates an async operation with configurable delay */
const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** Simulates a failing async operation */
const failAfterDelay = (ms: number, message: string): Promise<never> =>
  new Promise<never>((_, reject) => setTimeout(() => reject(new Error(message)), ms));

// =============================================================================
// Basic Examples
// =============================================================================

/**
 * Default TabsPro with static content
 */
export const Default: Story = {
  args: {
    items: [
      {
        id: 'home',
        label: 'Home',
        content: (
          <div className="p-3">
            <h5>Home</h5>
            <p>
              Welcome to the home tab. This is where you can find an overview of your dashboard.
            </p>
          </div>
        ),
      },
      {
        id: 'profile',
        label: 'Profile',
        content: (
          <div className="p-3">
            <h5>Profile</h5>
            <p>Manage your profile settings and personal information here.</p>
          </div>
        ),
      },
      {
        id: 'settings',
        label: 'Settings',
        content: (
          <div className="p-3">
            <h5>Settings</h5>
            <p>Configure your application preferences and account settings.</p>
          </div>
        ),
      },
    ],
  },
};

// =============================================================================
// Async Loading
// =============================================================================

/**
 * Tabs with async content loading.
 * Content is loaded when the tab is first activated, showing a loading spinner.
 */
export const AsyncLoading: Story = {
  render: () => {
    const items: TabsProItem[] = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        loadContent: async () => {
          await delay(1500);
          return (
            <div className="p-3">
              <h5>Dashboard</h5>
              <p>Dashboard content loaded asynchronously after 1.5 seconds.</p>
              <div className="row">
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="card-title">Users</h6>
                      <p className="card-text display-6">1,234</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="card-title">Revenue</h6>
                      <p className="card-text display-6">$45K</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="card-title">Orders</h6>
                      <p className="card-text display-6">567</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        },
        onViewed: () => console.warn('[Analytics] Dashboard viewed'),
      },
      {
        id: 'reports',
        label: 'Reports',
        loadContent: async () => {
          await delay(2000);
          return (
            <div className="p-3">
              <h5>Reports</h5>
              <p>Reports loaded after 2 seconds.</p>
              <table className="table">
                <thead>
                  <tr>
                    <th>Report</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Monthly Sales</td>
                    <td>Nov 2025</td>
                    <td>
                      <span className="badge bg-success">Complete</span>
                    </td>
                  </tr>
                  <tr>
                    <td>User Analytics</td>
                    <td>Nov 2025</td>
                    <td>
                      <span className="badge bg-warning">Pending</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        },
        onViewed: () => console.warn('[Analytics] Reports viewed'),
      },
      {
        id: 'analytics',
        label: 'Analytics',
        loadContent: async () => {
          await delay(1000);
          return (
            <div className="p-3">
              <h5>Analytics</h5>
              <p>Analytics content loaded after 1 second.</p>
              <div className="progress mb-3">
                <div className="progress-bar" style={{ width: '75%' }}>
                  75%
                </div>
              </div>
              <div className="progress">
                <div className="progress-bar bg-success" style={{ width: '50%' }}>
                  50%
                </div>
              </div>
            </div>
          );
        },
        onViewed: () => console.warn('[Analytics] Analytics tab viewed'),
      },
    ];

    return <TabsPro items={items} />;
  },
};

/**
 * Custom loading indicator
 */
export const CustomLoadingIndicator: Story = {
  render: () => {
    const customLoader = (
      <div className="p-4 text-center">
        <div className="spinner-grow text-primary me-2" aria-live="polite" aria-busy="true">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="spinner-grow text-secondary me-2" aria-live="polite" aria-busy="true">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="spinner-grow text-success" aria-live="polite" aria-busy="true">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Fetching data from server...</p>
      </div>
    );

    const items: TabsProItem[] = [
      {
        id: 'data',
        label: 'Data',
        loadingFallback: customLoader,
        loadContent: async () => {
          await delay(3000);
          return (
            <div className="p-3">
              <h5>Data Loaded!</h5>
              <p>Custom loading indicator was shown for 3 seconds.</p>
            </div>
          );
        },
      },
      {
        id: 'static',
        label: 'Static',
        content: <div className="p-3">This tab has static content with no loading.</div>,
      },
    ];

    return <TabsPro items={items} />;
  },
};

// =============================================================================
// Permission Gating
// =============================================================================

/**
 * Permission-gated tabs with guard functions.
 * Guards check permissions before showing content.
 */
export const PermissionGating: Story = {
  render: function PermissionGatingStory() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isPremium, setIsPremium] = useState(false);
    const adminToggleId = useId();
    const premiumToggleId = useId();

    const items: TabsProItem[] = [
      {
        id: 'public',
        label: 'Public',
        content: (
          <div className="p-3">
            <h5>Public Content</h5>
            <p>This tab is accessible to everyone.</p>
          </div>
        ),
      },
      {
        id: 'admin',
        label: 'Admin',
        guard: async (): Promise<GuardResult> => {
          await delay(500); // Simulate permission check
          return {
            allowed: isAdmin,
            reason: 'admin-required',
            actionLabel: 'Request Access',
            onAction: () => alert('Access request submitted!'),
          };
        },
        loadContent: async () => {
          await delay(1000);
          return (
            <div className="p-3">
              <h5>Admin Panel</h5>
              <p>Welcome, Administrator! You have full access.</p>
              <div className="alert alert-info">
                <strong>Admin Actions:</strong> Manage users, configure settings, view logs.
              </div>
            </div>
          );
        },
        onGuardFail: ({ reason }) => console.warn(`Admin access denied: ${reason}`),
      },
      {
        id: 'premium',
        label: 'Premium',
        guard: async (): Promise<GuardResult> => {
          await delay(300);
          return {
            allowed: isPremium,
            reason: 'upgrade-required',
            actionLabel: 'Upgrade to Premium',
            onAction: () => alert('Redirecting to upgrade page...'),
          };
        },
        loadContent: async () => {
          await delay(800);
          return (
            <div className="p-3">
              <h5>Premium Features</h5>
              <p>Exclusive content for premium subscribers.</p>
              <ul>
                <li>Advanced analytics</li>
                <li>Priority support</li>
                <li>Custom integrations</li>
              </ul>
            </div>
          );
        },
        onGuardFail: ({ reason }) => console.warn(`Premium access denied: ${reason}`),
      },
    ];

    return (
      <div>
        <div className="mb-3 p-3 bg-light rounded">
          <strong>Toggle Permissions:</strong>
          <div className="form-check form-check-inline ms-3">
            <input
              type="checkbox"
              className="form-check-input"
              id={adminToggleId}
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            <label className="form-check-label" htmlFor={adminToggleId}>
              Admin Access
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="checkbox"
              className="form-check-input"
              id={premiumToggleId}
              checked={isPremium}
              onChange={(e) => setIsPremium(e.target.checked)}
            />
            <label className="form-check-label" htmlFor={premiumToggleId}>
              Premium Access
            </label>
          </div>
          <small className="text-muted d-block mt-2">
            Toggle permissions and click the tabs to see guard behavior.
          </small>
        </div>
        <TabsPro items={items} />
      </div>
    );
  },
};

/**
 * Custom blocked fallback
 */
export const CustomBlockedFallback: Story = {
  render: () => {
    const items: TabsProItem[] = [
      {
        id: 'free',
        label: 'Free Tier',
        content: (
          <div className="p-3">
            <h5>Free Features</h5>
            <p>Basic features available to all users.</p>
          </div>
        ),
      },
      {
        id: 'enterprise',
        label: 'Enterprise',
        guard: async () => ({ allowed: false, reason: 'enterprise-only' }),
        blockedFallback: (
          <div className="p-4 text-center">
            <div className="mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                fill="currentColor"
                className="text-primary"
                viewBox="0 0 16 16"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
              </svg>
            </div>
            <h4 className="text-primary">Enterprise Feature</h4>
            <p className="text-muted mb-4">
              This feature requires an Enterprise subscription.
              <br />
              Contact our sales team to learn more.
            </p>
            <button type="button" className="btn btn-primary me-2">
              Contact Sales
            </button>
            <button type="button" className="btn btn-outline-secondary">
              View Plans
            </button>
          </div>
        ),
      },
    ];

    return <TabsPro items={items} />;
  },
};

// =============================================================================
// Error Handling
// =============================================================================

/**
 * Error handling with retry functionality.
 * Demonstrates error states and the retry mechanism.
 */
export const ErrorHandling: Story = {
  render: function ErrorHandlingStory() {
    const [failureCount, setFailureCount] = useState(0);

    const items: TabsProItem[] = [
      {
        id: 'stable',
        label: 'Stable',
        content: (
          <div className="p-3">
            <h5>Stable Content</h5>
            <p>This tab always loads successfully.</p>
          </div>
        ),
      },
      {
        id: 'unstable',
        label: 'Unstable (fails twice)',
        loadContent: async () => {
          await delay(1000);
          if (failureCount < 2) {
            setFailureCount((c) => c + 1);
            throw new Error(`Load failed! Attempt ${failureCount + 1} of 2`);
          }
          return (
            <div className="p-3">
              <div className="alert alert-success">
                <h5 className="alert-heading">Success!</h5>
                <p>Content loaded successfully after {failureCount} retries.</p>
              </div>
            </div>
          );
        },
        onError: (error) => console.error('Tab load error:', error),
      },
      {
        id: 'always-fails',
        label: 'Always Fails',
        loadContent: () => failAfterDelay(1000, 'Network error: Server unreachable'),
        onError: (error) => console.error('Always fails error:', error),
      },
    ];

    return (
      <div>
        <div className="mb-3">
          <small className="text-muted">
            &ldquo;Unstable&rdquo; tab fails twice before succeeding. &ldquo;Always Fails&rdquo;
            never succeeds.
          </small>
        </div>
        <TabsPro items={items} />
      </div>
    );
  },
};

/**
 * Custom error fallback
 */
export const CustomErrorFallback: Story = {
  render: () => {
    const items: TabsProItem[] = [
      {
        id: 'working',
        label: 'Working',
        content: <div className="p-3">This tab works fine.</div>,
      },
      {
        id: 'broken',
        label: 'Broken',
        loadContent: () => failAfterDelay(1000, 'Database connection failed'),
        errorFallback: (error, retry) => (
          <div className="p-4">
            <div className="alert alert-danger">
              <h5 className="alert-heading">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="me-2"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
                Connection Error
              </h5>
              <p className="mb-0">
                {error instanceof Error ? error.message : 'An unknown error occurred'}
              </p>
            </div>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-danger" onClick={retry}>
                Retry Connection
              </button>
              <button type="button" className="btn btn-outline-secondary">
                Report Issue
              </button>
            </div>
          </div>
        ),
      },
    ];

    return <TabsPro items={items} />;
  },
};

// =============================================================================
// Dirty State / Unsaved Changes
// =============================================================================

/**
 * Dirty state handling with leave confirmation.
 * Shows a confirmation dialog when switching away from a tab with unsaved changes.
 */
export const DirtyStateHandling: Story = {
  render: function DirtyStateStory() {
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [savedData, setSavedData] = useState({ name: '', email: '' });
    const nameInputId = useId();
    const emailInputId = useId();

    const isDirty = useCallback(
      (tabId: string) => {
        if (tabId === 'form') {
          return formData.name !== savedData.name || formData.email !== savedData.email;
        }
        return false;
      },
      [formData, savedData]
    );

    const items: TabsProItem[] = [
      {
        id: 'form',
        label: 'Edit Profile',
        content: (
          <div className="p-3">
            <h5>Edit Profile</h5>
            <form>
              <div className="mb-3">
                <label htmlFor={nameInputId} className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={nameInputId}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor={emailInputId} className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id={emailInputId}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSavedData(formData)}
              >
                Save Changes
              </button>
            </form>
            {isDirty('form') && (
              <div className="alert alert-warning mt-3 mb-0">You have unsaved changes!</div>
            )}
          </div>
        ),
      },
      {
        id: 'preview',
        label: 'Preview',
        content: (
          <div className="p-3">
            <h5>Profile Preview</h5>
            <p>
              <strong>Name:</strong> {savedData.name || '(not set)'}
            </p>
            <p>
              <strong>Email:</strong> {savedData.email || '(not set)'}
            </p>
          </div>
        ),
      },
      {
        id: 'settings',
        label: 'Settings',
        content: (
          <div className="p-3">
            <h5>Account Settings</h5>
            <p>Configure your account preferences here.</p>
          </div>
        ),
      },
    ];

    return (
      <div>
        <div className="mb-3">
          <small className="text-muted">
            Make changes in the form, then try switching tabs without saving.
          </small>
        </div>
        <TabsPro
          items={items}
          isDirty={isDirty}
          dirtyConfirmMessage="You have unsaved profile changes. Leave without saving?"
          onDirtyLeave={(from, to) => console.warn(`Left dirty tab ${from} for ${to}`)}
          onDirtyStay={(tabId) => console.warn(`Stayed on dirty tab ${tabId}`)}
        />
      </div>
    );
  },
};

// =============================================================================
// Analytics Integration
// =============================================================================

/**
 * Analytics hooks for tracking tab interactions.
 * Check the browser console to see analytics events.
 */
export const AnalyticsHooks: Story = {
  render: () => {
    const items: TabsProItem[] = [
      {
        id: 'overview',
        label: 'Overview',
        content: <div className="p-3">Overview content</div>,
        onActivate: () => console.warn('[Analytics] Tab activation started: overview'),
        onViewed: () => console.warn('[Analytics] Tab viewed: overview'),
      },
      {
        id: 'metrics',
        label: 'Metrics',
        loadContent: async () => {
          await delay(1000);
          return <div className="p-3">Metrics data loaded</div>;
        },
        onActivate: () => console.warn('[Analytics] Tab activation started: metrics'),
        onViewed: () => console.warn('[Analytics] Tab viewed after load: metrics'),
        onError: (error) => console.warn('[Analytics] Tab error: metrics', error),
      },
      {
        id: 'restricted',
        label: 'Restricted',
        guard: async () => ({ allowed: false, reason: 'subscription-required' }),
        content: <div className="p-3">Restricted content</div>,
        onActivate: () => console.warn('[Analytics] Tab activation started: restricted'),
        onGuardFail: ({ reason }) => console.warn(`[Analytics] Guard failed: ${reason}`),
      },
    ];

    return (
      <div>
        <div className="alert alert-info mb-3">
          <strong>Open browser console</strong> to see analytics events being logged.
        </div>
        <TabsPro items={items} />
      </div>
    );
  },
};

// =============================================================================
// Variants and Styling
// =============================================================================

/**
 * Different visual variants
 */
export const Variants: Story = {
  render: () => {
    const items: TabsProItem[] = [
      { id: 'home', label: 'Home', content: <div className="p-3">Home content</div> },
      { id: 'profile', label: 'Profile', content: <div className="p-3">Profile content</div> },
      { id: 'settings', label: 'Settings', content: <div className="p-3">Settings content</div> },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h6 className="mb-2">Tabs (default)</h6>
          <TabsPro variant="tabs" items={items} />
        </div>
        <div>
          <h6 className="mb-2">Pills</h6>
          <TabsPro variant="pills" items={items} />
        </div>
        <div>
          <h6 className="mb-2">Underline</h6>
          <TabsPro variant="underline" items={items} />
        </div>
      </div>
    );
  },
};

/**
 * Vertical orientation
 */
export const VerticalOrientation: Story = {
  render: () => {
    const items: TabsProItem[] = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        loadContent: async () => {
          await delay(1000);
          return <div className="p-3">Dashboard loaded</div>;
        },
      },
      {
        id: 'users',
        label: 'Users',
        loadContent: async () => {
          await delay(800);
          return <div className="p-3">Users loaded</div>;
        },
      },
      {
        id: 'settings',
        label: 'Settings',
        content: <div className="p-3">Settings (static)</div>,
      },
    ];

    return <TabsPro items={items} orientation="vertical" variant="pills" />;
  },
};

// =============================================================================
// Controlled Mode
// =============================================================================

/**
 * Controlled mode with external state management
 */
export const ControlledMode: Story = {
  render: function ControlledStory() {
    const [activeId, setActiveId] = useState<string | null>('home');

    const items: TabsProItem[] = [
      {
        id: 'home',
        label: 'Home',
        loadContent: async () => {
          await delay(500);
          return <div className="p-3">Home content loaded</div>;
        },
      },
      {
        id: 'profile',
        label: 'Profile',
        loadContent: async () => {
          await delay(500);
          return <div className="p-3">Profile content loaded</div>;
        },
      },
      {
        id: 'settings',
        label: 'Settings',
        loadContent: async () => {
          await delay(500);
          return <div className="p-3">Settings content loaded</div>;
        },
      },
    ];

    return (
      <div>
        <TabsPro
          items={items}
          activeId={activeId ?? undefined}
          onActiveChange={(id) => setActiveId(id)}
        />
        <div className="mt-3 p-3 bg-light rounded">
          <strong>Current tab:</strong> {activeId}
          <div className="btn-group ms-3">
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => setActiveId('home')}
            >
              Go to Home
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => setActiveId('profile')}
            >
              Go to Profile
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => setActiveId('settings')}
            >
              Go to Settings
            </button>
          </div>
        </div>
      </div>
    );
  },
};

// =============================================================================
// Disabled Tabs
// =============================================================================

/**
 * Tabs with disabled state
 */
export const DisabledTabs: Story = {
  args: {
    items: [
      {
        id: 'home',
        label: 'Home',
        content: <div className="p-3">Home content - always accessible</div>,
      },
      {
        id: 'disabled',
        label: 'Disabled Tab',
        content: <div className="p-3">This content cannot be accessed</div>,
        disabled: true,
      },
      {
        id: 'settings',
        label: 'Settings',
        content: <div className="p-3">Settings content</div>,
      },
    ],
  },
};

// =============================================================================
// Complete Showcase
// =============================================================================

/**
 * Complete feature showcase combining multiple capabilities
 */
export const CompleteShowcase: Story = {
  render: function ShowcaseStory() {
    const [hasPermission, setHasPermission] = useState(false);
    const permissionToggleId = useId();

    const items: TabsProItem[] = [
      {
        id: 'overview',
        label: 'Overview',
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <title>Overview icon</title>
            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
          </svg>
        ),
        content: (
          <div className="p-3">
            <h5>Welcome to TabsPro</h5>
            <p>This showcase demonstrates all the advanced features of TabsPro:</p>
            <ul>
              <li>
                <strong>Static content</strong> - This tab
              </li>
              <li>
                <strong>Async loading</strong> - Data tab
              </li>
              <li>
                <strong>Permission gating</strong> - Admin tab
              </li>
              <li>
                <strong>Error handling</strong> - Flaky tab
              </li>
            </ul>
          </div>
        ),
        onViewed: () => console.warn('Overview viewed'),
      },
      {
        id: 'data',
        label: 'Data',
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <title>Data icon</title>
            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z" />
          </svg>
        ),
        loadContent: async () => {
          await delay(2000);
          return (
            <div className="p-3">
              <h5>Data Dashboard</h5>
              <div className="row g-3">
                {['Sales', 'Orders', 'Users'].map((metric) => (
                  <div className="col-md-4" key={metric}>
                    <div className="card">
                      <div className="card-body text-center">
                        <h6>{metric}</h6>
                        <div className="display-6 text-primary">
                          {Math.floor(Math.random() * 1000)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        },
        onViewed: () => console.warn('Data viewed'),
      },
      {
        id: 'admin',
        label: 'Admin',
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <title>Admin icon</title>
            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
          </svg>
        ),
        guard: async () => {
          await delay(500);
          return {
            allowed: hasPermission,
            reason: 'admin-only',
            actionLabel: 'Request Access',
            onAction: () => setHasPermission(true),
          };
        },
        loadContent: async () => {
          await delay(1000);
          return (
            <div className="p-3">
              <h5>Admin Panel</h5>
              <div className="alert alert-success">Access granted!</div>
            </div>
          );
        },
        onGuardFail: () => console.warn('Admin guard failed'),
      },
      {
        id: 'flaky',
        label: 'Flaky',
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <title>Warning icon</title>
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </svg>
        ),
        loadContent: () => failAfterDelay(1500, 'Random network failure'),
        onError: (error) => console.warn('Flaky tab error:', error),
      },
    ];

    return (
      <div>
        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id={permissionToggleId}
              checked={hasPermission}
              onChange={(e) => setHasPermission(e.target.checked)}
            />
            <label className="form-check-label" htmlFor={permissionToggleId}>
              Grant admin permission
            </label>
          </div>
        </div>
        <TabsPro items={items} />
      </div>
    );
  },
};
