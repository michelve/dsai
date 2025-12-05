import {
  BuildingFillIcon,
  Button,
  DatabaseFillIcon,
  ExclamationTriangleFillIcon,
  Heading,
  HouseFillIcon,
  Input,
  ShieldLockFillIcon,
  Spinner,
  Switch,
  TabsPro,
  Text,
} from '@dsai/react';
import { useCallback, useState } from 'react';

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

// Deterministic metric value generator for showcase cards (avoids random in stories)
const metricValueFromName = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const value = Math.abs(hash % 900);
  return 100 + value; // 100-999
};

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
            <Heading level={5} className="mb-1">
              Home
            </Heading>
            <Text as="p">
              Welcome to the home tab. This is where you can find an overview of your dashboard.
            </Text>
          </div>
        ),
      },
      {
        id: 'profile',
        label: 'Profile',
        content: (
          <div className="p-3">
            <Heading level={5} className="mb-1">
              Profile
            </Heading>
            <Text as="p">Manage your profile settings and personal information here.</Text>
          </div>
        ),
      },
      {
        id: 'settings',
        label: 'Settings',
        content: (
          <div className="p-3">
            <Heading level={5} className="mb-1">
              Settings
            </Heading>
            <Text as="p">Configure your application preferences and account settings.</Text>
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
              <Heading level={5} className="mb-1">
                Dashboard
              </Heading>
              <Text as="p">Dashboard content loaded asynchronously after 1.5 seconds.</Text>
              <div className="row">
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body">
                      <Heading level={6} className="card-title">
                        Users
                      </Heading>
                      <Heading level={3} className="card-text display-6" visualSize="h4">
                        1,234
                      </Heading>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body">
                      <Heading level={6} className="card-title">
                        Revenue
                      </Heading>
                      <Heading level={3} className="card-text display-6" visualSize="h4">
                        $45K
                      </Heading>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body">
                      <Heading level={6} className="card-title">
                        Orders
                      </Heading>
                      <Heading level={3} className="card-text display-6" visualSize="h4">
                        567
                      </Heading>
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
              <Heading level={5} className="mb-1">
                Reports
              </Heading>
              <Text as="p">Reports loaded after 2 seconds.</Text>
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
              <Heading level={5} className="mb-1">
                Analytics
              </Heading>
              <Text as="p">Analytics content loaded after 1 second.</Text>
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
        <Spinner
          animation="grow"
          variant="primary"
          className="me-2"
          as="span"
          label="Loading dashboards"
        />
        <Spinner
          animation="grow"
          variant="secondary"
          className="me-2"
          as="span"
          label="Loading reports"
        />
        <Spinner animation="grow" variant="success" as="span" label="Loading analytics" />
        <Text as="p" size="sm" color="muted" className="mt-3">
          Fetching data from server...
        </Text>
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
              <Heading level={5} className="mb-1">
                Data Loaded!
              </Heading>
              <Text as="p">Custom loading indicator was shown for 3 seconds.</Text>
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

    const items: TabsProItem[] = [
      {
        id: 'public',
        label: 'Public',
        content: (
          <div className="p-3">
            <Heading level={5} className="mb-1">
              Public Content
            </Heading>
            <Text as="p">This tab is accessible to everyone.</Text>
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
              <Heading level={5} className="mb-1">
                Admin Panel
              </Heading>
              <Text as="p">Welcome, Administrator! You have full access.</Text>
              <div className="alert alert-info">
                <Text as="span" weight="semibold" className="me-1">
                  Admin Actions:
                </Text>
                <Text as="span">Manage users, configure settings, view logs.</Text>
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
              <Heading level={5} className="mb-1">
                Premium Features
              </Heading>
              <Text as="p">Exclusive content for premium subscribers.</Text>
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
          <Heading level={6} className="mb-1">
            Toggle Permissions:
          </Heading>
          <div className="d-flex gap-3 mt-2">
            <Switch label="Admin Access" checked={isAdmin} onChange={setIsAdmin} />
            <Switch label="Premium Access" checked={isPremium} onChange={setIsPremium} />
          </div>
          <Text as="span" size="sm" color="muted" className="d-block mt-2">
            Toggle permissions and click the tabs to see guard behavior.
          </Text>
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
            <Heading level={5} className="mb-1">
              Free Features
            </Heading>
            <Text as="p">Basic features available to all users.</Text>
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
              <BuildingFillIcon size={64} className="text-primary" aria-hidden />
            </div>
            <Heading level={4} className="text-primary">
              Enterprise Feature
            </Heading>
            <Text as="p" color="muted" className="mb-4">
              This feature requires an Enterprise subscription.
              <br />
              Contact our sales team to learn more.
            </Text>
            <Button variant="primary" className="me-2">
              Contact Sales
            </Button>
            <Button variant="outline-secondary">View Plans</Button>
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
            <Heading level={5} className="mb-1">
              Stable Content
            </Heading>
            <Text as="p">This tab always loads successfully.</Text>
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
                <Heading level={5} className="alert-heading mb-1">
                  Success!
                </Heading>
                <Text as="p">Content loaded successfully after {failureCount} retries.</Text>
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
          <Text as="span" size="sm" color="muted">
            &ldquo;Unstable&rdquo; tab fails twice before succeeding. &ldquo;Always Fails&rdquo;
            never succeeds.
          </Text>
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
              <Heading level={5} className="alert-heading">
                <ExclamationTriangleFillIcon size={20} className="me-2" aria-hidden />
                Connection Error
              </Heading>
              <Text as="p">
                {error instanceof Error ? error.message : 'An unknown error occurred'}
              </Text>
            </div>
            <div className="d-flex gap-2">
              <Button variant="danger" onClick={retry}>
                Retry Connection
              </Button>
              <Button variant="outline-secondary">Report Issue</Button>
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
            <Heading level={5} className="mb-2">
              Edit Profile
            </Heading>
            <form>
              <div className="mb-3">
                <Input
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <Button variant="primary" onClick={() => setSavedData(formData)}>
                Save Changes
              </Button>
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
            <Heading level={5} className="mb-2">
              Profile Preview
            </Heading>
            <Text as="p">
              <strong>Name:</strong> {savedData.name || '(not set)'}
            </Text>
            <Text as="p">
              <strong>Email:</strong> {savedData.email || '(not set)'}
            </Text>
          </div>
        ),
      },
      {
        id: 'settings',
        label: 'Settings',
        content: (
          <div className="p-3">
            <Heading level={5} className="mb-1">
              Account Settings
            </Heading>
            <Text as="p">Configure your account preferences here.</Text>
          </div>
        ),
      },
    ];

    return (
      <div>
        <div className="mb-3">
          <Text as="span" size="sm" color="muted">
            Make changes in the form, then try switching tabs without saving.
          </Text>
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
          <Heading level={6} className="mb-2">
            Tabs (default)
          </Heading>
          <TabsPro variant="tabs" items={items} />
        </div>
        <div>
          <Heading level={6} className="mb-2">
            Pills
          </Heading>
          <TabsPro variant="pills" items={items} />
        </div>
        <div>
          <Heading level={6} className="mb-2">
            Underline
          </Heading>
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
            <Button size="sm" variant="outline-primary" onClick={() => setActiveId('home')}>
              Go to Home
            </Button>
            <Button size="sm" variant="outline-primary" onClick={() => setActiveId('profile')}>
              Go to Profile
            </Button>
            <Button size="sm" variant="outline-primary" onClick={() => setActiveId('settings')}>
              Go to Settings
            </Button>
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

    const items: TabsProItem[] = [
      {
        id: 'overview',
        label: 'Overview',
        icon: <HouseFillIcon aria-hidden />,
        content: (
          <div className="p-3">
            <Heading level={5} className="mb-1">
              Welcome to TabsPro
            </Heading>
            <Text as="p">This showcase demonstrates all the advanced features of TabsPro:</Text>
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
        icon: <DatabaseFillIcon aria-hidden />,
        loadContent: async () => {
          await delay(2000);
          return (
            <div className="p-3">
              <Heading level={5} className="mb-2">
                Data Dashboard
              </Heading>
              <div className="row g-3">
                {['Sales', 'Orders', 'Users'].map((metric) => (
                  <div className="col-md-4" key={metric}>
                    <div className="card">
                      <div className="card-body text-center">
                        <Heading level={6} className="mb-1">
                          {metric}
                        </Heading>
                        <Heading level={3} className="display-6 text-primary" visualSize="h4">
                          {metricValueFromName(metric)}
                        </Heading>
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
        icon: <ShieldLockFillIcon aria-hidden />,
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
              <Heading level={5} className="mb-1">
                Admin Panel
              </Heading>
              <div className="alert alert-success">Access granted!</div>
            </div>
          );
        },
        onGuardFail: () => console.warn('Admin guard failed'),
      },
      {
        id: 'flaky',
        label: 'Flaky',
        icon: <ExclamationTriangleFillIcon aria-hidden />,
        loadContent: () => failAfterDelay(1500, 'Random network failure'),
        onError: (error) => console.warn('Flaky tab error:', error),
      },
    ];

    return (
      <div>
        <div className="mb-3">
          <Switch
            label="Grant admin permission"
            checked={hasPermission}
            onChange={setHasPermission}
          />
        </div>
        <TabsPro items={items} />
      </div>
    );
  },
};
