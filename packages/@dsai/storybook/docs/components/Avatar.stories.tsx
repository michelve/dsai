import { Avatar, AvatarGroup, Heading, PersonFillIcon } from '@dsai/react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { JSX } from 'react';

/**
 * Avatar component for displaying user profile images, initials, or icons.
 * Built with Bootstrap 5 design tokens and full WCAG 2.2 AA compliance.
 *
 * Features:
 * - Image with graceful fallback chain: image → initials → icon → built-in person icon
 * - Deterministic background colors based on name hash
 * - Presence status indicators (online, busy, away, offline, dnd)
 * - Notification badges with count or dot
 * - Interactive mode with focus ring and selection state
 * - Multiple sizes (xs, sm, md, lg, xl, 2xl) and shapes (circle, rounded, square)
 * - AvatarGroup for stacked/inline avatar layouts with overflow chip
 *
 * @see https://getbootstrap.com/docs/5.3/components/
 */

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component:
          'A versatile avatar component for displaying user identities through images, initials, or icons with optional status indicators and notification badges.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Size of the avatar',
    },
    shape: {
      control: 'select',
      options: ['circle', 'rounded', 'square'],
      description: 'Shape of the avatar',
    },
    tone: {
      control: 'select',
      options: [
        'neutral',
        'brand',
        'accent',
        'success',
        'warning',
        'danger',
        'info',
        'muted',
        'inverse',
      ],
      description: 'Background color tone (auto-derived from name if not specified)',
    },
    status: {
      control: 'select',
      options: [undefined, 'online', 'busy', 'away', 'offline', 'dnd', 'unknown'],
      description: 'Presence status indicator',
    },
    statusPosition: {
      control: 'select',
      options: ['bottom-right', 'bottom-left'],
      description: 'Position of the status indicator',
    },
    name: {
      control: 'text',
      description: 'User name for initials and deterministic color',
    },
    src: {
      control: 'text',
      description: 'Image source URL',
    },
    alt: {
      control: 'text',
      description: 'Alt text for image',
    },
    initials: {
      control: 'text',
      description: 'Explicit initials (overrides name-derived initials)',
    },
    interactive: {
      control: 'boolean',
      description: 'Enable interactive mode with focus ring',
    },
    selected: {
      control: 'boolean',
      description: 'Show selection state (for interactive mode)',
    },
    badgeCount: {
      control: 'number',
      description: 'Notification badge count',
    },
    badgeDot: {
      control: 'boolean',
      description: 'Show notification dot (ignored if badgeCount is set)',
    },
    isLoading: {
      control: 'boolean',
      description: 'Show loading skeleton',
    },
    decorative: {
      control: 'boolean',
      description: 'Hide from screen readers (purely decorative)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

// =============================================================================
// Basic Examples
// =============================================================================

/**
 * Default avatar with name-derived initials and deterministic background color.
 */
export const Default: Story = {
  args: {
    name: 'John Doe',
    size: 'md',
    shape: 'circle',
  },
};

/**
 * Avatar with profile image.
 */
export const WithImage: Story = {
  args: {
    name: 'Jane Smith',
    src: 'https://i.pravatar.cc/150?u=jane',
    alt: 'Jane Smith',
    size: 'lg',
  },
};

/**
 * Avatar with explicit initials.
 */
export const WithInitials: Story = {
  args: {
    initials: 'JS',
    tone: 'brand',
    size: 'lg',
  },
};

/**
 * Avatar with custom icon.
 */
export const WithIcon: Story = {
  args: {
    icon: <PersonFillIcon size={24} />,
    tone: 'neutral',
    size: 'lg',
  },
};

// =============================================================================
// Sizes
// =============================================================================

const SizesExample = (): JSX.Element => (
  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
    <Avatar name="Extra Small" size="xs" />
    <Avatar name="Small Size" size="sm" />
    <Avatar name="Medium Size" size="md" />
    <Avatar name="Large Size" size="lg" />
    <Avatar name="Extra Large" size="xl" />
    <Avatar name="2X Large" size="2xl" />
  </div>
);

/**
 * Avatar supports 6 sizes from xs (24px) to 2xl (80px).
 */
export const Sizes: Story = {
  render: SizesExample,
  parameters: {
    docs: {
      description: {
        story:
          'Available sizes: xs (24px), sm (32px), md (40px), lg (48px), xl (64px), 2xl (80px).',
      },
    },
  },
};

// =============================================================================
// Shapes
// =============================================================================

const ShapesExample = (): JSX.Element => (
  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
    <Avatar name="Circle Shape" shape="circle" size="lg" />
    <Avatar name="Rounded Shape" shape="rounded" size="lg" />
    <Avatar name="Square Shape" shape="square" size="lg" />
  </div>
);

/**
 * Avatar can be rendered as circle, rounded square, or square.
 */
export const Shapes: Story = {
  render: ShapesExample,
  parameters: {
    docs: {
      description: {
        story:
          'The shape prop controls the border radius: circle (50%), rounded (8px), square (0).',
      },
    },
  },
};

// =============================================================================
// Tones (Color Variants)
// =============================================================================

const TonesExample = (): JSX.Element => (
  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
    <Avatar name="Neutral" tone="neutral" />
    <Avatar name="Brand" tone="brand" />
    <Avatar name="Accent" tone="accent" />
    <Avatar name="Success" tone="success" />
    <Avatar name="Warning" tone="warning" />
    <Avatar name="Danger" tone="danger" />
    <Avatar name="Info" tone="info" />
    <Avatar name="Muted" tone="muted" />
    <Avatar name="Inverse" tone="inverse" />
  </div>
);

/**
 * Explicit tone colors for avatar backgrounds.
 */
export const Tones: Story = {
  render: TonesExample,
  parameters: {
    docs: {
      description: {
        story:
          'When no tone is specified, a deterministic color is derived from the name hash, ensuring consistent colors across the app.',
      },
    },
  },
};

// =============================================================================
// Deterministic Colors
// =============================================================================

const DeterministicColorsExample = (): JSX.Element => (
  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
    <Avatar name="Alice Johnson" />
    <Avatar name="Bob Smith" />
    <Avatar name="Charlie Brown" />
    <Avatar name="Diana Prince" />
    <Avatar name="Edward Norton" />
    <Avatar name="Fiona Green" />
  </div>
);

/**
 * Without explicit tone, colors are derived from name for consistency.
 */
export const DeterministicColors: Story = {
  render: DeterministicColorsExample,
  parameters: {
    docs: {
      description: {
        story:
          'Each name generates a consistent color hash, so the same user always appears with the same background color across the application.',
      },
    },
  },
};

// =============================================================================
// Status Indicators
// =============================================================================

const StatusIndicatorsExample = (): JSX.Element => (
  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
    <div style={{ textAlign: 'center' }}>
      <Avatar name="Online User" status="online" size="lg" />
      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Online</div>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar name="Busy User" status="busy" size="lg" />
      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Busy</div>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar name="Away User" status="away" size="lg" />
      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Away</div>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar name="Offline User" status="offline" size="lg" />
      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Offline</div>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar name="DND User" status="dnd" size="lg" />
      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Do Not Disturb</div>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar name="Unknown Status" status="unknown" size="lg" />
      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Unknown</div>
    </div>
  </div>
);

/**
 * Status indicators show user presence state.
 */
export const StatusIndicators: Story = {
  render: StatusIndicatorsExample,
  parameters: {
    docs: {
      description: {
        story:
          'Status indicators are positioned at the bottom corner and announce to screen readers (e.g., "John Doe, Online").',
      },
    },
  },
};

// =============================================================================
// Notification Badges
// =============================================================================

const NotificationBadgesExample = (): JSX.Element => (
  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
    <div style={{ textAlign: 'center' }}>
      <Avatar name="Three Notifications" badgeCount={3} size="lg" />
      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Count: 3</div>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar name="Many Notifications" badgeCount={99} size="lg" />
      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Count: 99</div>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar name="Overflow Notifications" badgeCount={150} size="lg" />
      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Count: 99+</div>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar name="Dot Badge" badgeDot size="lg" />
      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Dot</div>
    </div>
  </div>
);

/**
 * Notification badges for unread counts or activity indicators.
 */
export const NotificationBadges: Story = {
  render: NotificationBadgesExample,
  parameters: {
    docs: {
      description: {
        story:
          'Badge counts over 99 are displayed as "99+". The count badge takes priority over the dot badge if both are specified.',
      },
    },
  },
};

// =============================================================================
// Image Fallback Chain
// =============================================================================

const FallbackChainExample = (): JSX.Element => (
  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
    <div style={{ textAlign: 'center' }}>
      <Avatar name="With Image" src="https://i.pravatar.cc/150?u=test1" size="lg" />
      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Has Image</div>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar
        name="With Broken Image"
        src="https://invalid-url-that-will-fail.example/image.jpg"
        size="lg"
      />
      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Falls to Initials</div>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar name="John Smith" size="lg" />
      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Name → Initials</div>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar icon={<PersonFillIcon size={24} />} tone="neutral" size="lg" />
      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Custom Icon</div>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar tone="muted" size="lg" />
      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Default Icon</div>
    </div>
  </div>
);

/**
 * Graceful fallback when image fails: image → initials → icon → default.
 */
export const FallbackChain: Story = {
  render: FallbackChainExample,
  parameters: {
    docs: {
      description: {
        story:
          'The fallback chain ensures users always see something meaningful: 1) Image, 2) Initials from name, 3) Custom icon, 4) Default user icon.',
      },
    },
  },
};

// =============================================================================
// Interactive Mode
// =============================================================================

const InteractiveModeExample = (): JSX.Element => (
  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
    <Avatar name="Click Me" size="lg" interactive onClick={() => alert('Avatar clicked!')} />
    <Avatar name="Selected" size="lg" interactive selected />
    <Avatar as="button" name="Button Element" size="lg" onClick={() => alert('Button avatar!')} />
    <Avatar as="a" name="Link Avatar" href="https://example.com" size="lg" />
  </div>
);

/**
 * Interactive avatars can be clicked and support keyboard navigation.
 */
export const InteractiveMode: Story = {
  render: InteractiveModeExample,
  parameters: {
    docs: {
      description: {
        story:
          'Interactive avatars are focusable, have focus rings, and support Enter/Space activation. Use `as="button"` for semantic buttons or `as="a"` for links.',
      },
    },
  },
};

// =============================================================================
// Loading State
// =============================================================================

const LoadingStateExample = (): JSX.Element => (
  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
    <Avatar name="Loading XS" size="xs" isLoading />
    <Avatar name="Loading SM" size="sm" isLoading />
    <Avatar name="Loading MD" size="md" isLoading />
    <Avatar name="Loading LG" size="lg" isLoading />
    <Avatar name="Loading XL" size="xl" isLoading />
    <Avatar name="Loading 2XL" size="2xl" isLoading />
  </div>
);

/**
 * Skeleton loading state for async operations.
 */
export const LoadingState: Story = {
  render: LoadingStateExample,
  parameters: {
    docs: {
      description: {
        story:
          'The loading state displays a skeleton placeholder while user data is being fetched. Sets aria-busy for screen readers.',
      },
    },
  },
};

// =============================================================================
// AvatarGroup - Basic
// =============================================================================

const AvatarGroupExample = (): JSX.Element => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        Stacked Layout (Default)
      </Heading>
      <AvatarGroup>
        <Avatar name="Alice Johnson" />
        <Avatar name="Bob Smith" />
        <Avatar name="Charlie Brown" />
        <Avatar name="Diana Prince" />
      </AvatarGroup>
    </div>

    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        Inline Layout
      </Heading>
      <AvatarGroup layout="inline">
        <Avatar name="Alice Johnson" />
        <Avatar name="Bob Smith" />
        <Avatar name="Charlie Brown" />
        <Avatar name="Diana Prince" />
      </AvatarGroup>
    </div>
  </div>
);

/**
 * AvatarGroup arranges multiple avatars in stacked or inline layouts.
 */
export const GroupBasic: Story = {
  render: AvatarGroupExample,
  name: 'AvatarGroup: Basic',
  parameters: {
    docs: {
      description: {
        story:
          'Use `layout="stacked"` for overlapping avatars or `layout="inline"` for side-by-side with gaps.',
      },
    },
  },
};

// =============================================================================
// AvatarGroup - With Overflow
// =============================================================================

const AvatarGroupOverflowExample = (): JSX.Element => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        Max 3 Visible
      </Heading>
      <AvatarGroup maxVisible={3}>
        <Avatar name="Alice Johnson" />
        <Avatar name="Bob Smith" />
        <Avatar name="Charlie Brown" />
        <Avatar name="Diana Prince" />
        <Avatar name="Edward Norton" />
        <Avatar name="Fiona Green" />
      </AvatarGroup>
    </div>

    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        Max 5 Visible
      </Heading>
      <AvatarGroup maxVisible={5}>
        <Avatar name="Alice Johnson" />
        <Avatar name="Bob Smith" />
        <Avatar name="Charlie Brown" />
        <Avatar name="Diana Prince" />
        <Avatar name="Edward Norton" />
        <Avatar name="Fiona Green" />
        <Avatar name="George Wilson" />
        <Avatar name="Helen Troy" />
      </AvatarGroup>
    </div>
  </div>
);

/**
 * Limit visible avatars with overflow chip showing remaining count.
 */
export const GroupOverflow: Story = {
  render: AvatarGroupOverflowExample,
  name: 'AvatarGroup: Overflow',
  parameters: {
    docs: {
      description: {
        story:
          'Set `maxVisible` to limit displayed avatars. The overflow chip shows the count of hidden avatars and lists their names in a title tooltip.',
      },
    },
  },
};

// =============================================================================
// AvatarGroup - Spacing
// =============================================================================

const AvatarGroupSpacingExample = (): JSX.Element => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        Compact Spacing
      </Heading>
      <AvatarGroup spacing="compact">
        <Avatar name="Alice" />
        <Avatar name="Bob" />
        <Avatar name="Charlie" />
        <Avatar name="Diana" />
      </AvatarGroup>
    </div>

    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        Normal Spacing (Default)
      </Heading>
      <AvatarGroup spacing="normal">
        <Avatar name="Alice" />
        <Avatar name="Bob" />
        <Avatar name="Charlie" />
        <Avatar name="Diana" />
      </AvatarGroup>
    </div>

    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        Loose Spacing
      </Heading>
      <AvatarGroup spacing="loose">
        <Avatar name="Alice" />
        <Avatar name="Bob" />
        <Avatar name="Charlie" />
        <Avatar name="Diana" />
      </AvatarGroup>
    </div>
  </div>
);

/**
 * Control overlap/gap spacing between grouped avatars.
 */
export const GroupSpacing: Story = {
  render: AvatarGroupSpacingExample,
  name: 'AvatarGroup: Spacing',
  parameters: {
    docs: {
      description: {
        story: 'Spacing controls the overlap (stacked) or gap (inline): compact, normal, or loose.',
      },
    },
  },
};

// =============================================================================
// AvatarGroup - Inherited Props
// =============================================================================

const AvatarGroupInheritedExample = (): JSX.Element => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        Large Size, Rounded Shape
      </Heading>
      <AvatarGroup size="lg" shape="rounded">
        <Avatar name="Alice" />
        <Avatar name="Bob" />
        <Avatar name="Charlie" />
      </AvatarGroup>
    </div>

    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        Small Size, Square Shape
      </Heading>
      <AvatarGroup size="sm" shape="square">
        <Avatar name="Diana" />
        <Avatar name="Edward" />
        <Avatar name="Fiona" />
      </AvatarGroup>
    </div>

    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        Override: Child Props Take Priority
      </Heading>
      <AvatarGroup size="md" shape="circle">
        <Avatar name="Group Size" />
        <Avatar name="Large Override" size="lg" />
        <Avatar name="Square Override" shape="square" />
      </AvatarGroup>
    </div>
  </div>
);

/**
 * Group-level props are inherited by children, but child props take priority.
 */
export const GroupInherited: Story = {
  render: AvatarGroupInheritedExample,
  name: 'AvatarGroup: Inherited Props',
  parameters: {
    docs: {
      description: {
        story:
          'Set `size` and `shape` on AvatarGroup to apply to all children. Individual Avatar props override group defaults.',
      },
    },
  },
};

// =============================================================================
// Accessibility Example
// =============================================================================

const AccessibilityExample = (): JSX.Element => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        Semantic Labeling
      </Heading>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Avatar name="John Doe" status="online" />
        <span style={{ fontSize: '0.875rem', color: '#666' }}>
          Announces: &quot;John Doe, Online&quot;
        </span>
      </div>
    </div>

    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        Custom ARIA Label
      </Heading>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Avatar name="Jane Smith" aria-label="Jane Smith, Team Lead, Available" />
        <span style={{ fontSize: '0.875rem', color: '#666' }}>Custom label overrides default</span>
      </div>
    </div>

    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        Decorative Avatar
      </Heading>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Avatar name="Hidden from SR" decorative />
        <span style={{ fontSize: '0.875rem', color: '#666' }}>
          Hidden from screen readers (aria-hidden=true)
        </span>
      </div>
    </div>

    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        Interactive with Button Role
      </Heading>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Avatar name="Interactive User" interactive onClick={() => alert('Clicked!')} />
        <span style={{ fontSize: '0.875rem', color: '#666' }}>
          Focusable, activates with Enter/Space
        </span>
      </div>
    </div>

    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        Group Accessibility
      </Heading>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <AvatarGroup maxVisible={2} aria-label="Project team members">
          <Avatar name="Alice" />
          <Avatar name="Bob" />
          <Avatar name="Charlie" />
        </AvatarGroup>
        <span style={{ fontSize: '0.875rem', color: '#666' }}>
          Group with role=&quot;group&quot; and aria-label
        </span>
      </div>
    </div>
  </div>
);

/**
 * Accessibility features for WCAG 2.2 AA compliance.
 */
export const Accessibility: Story = {
  render: AccessibilityExample,
  parameters: {
    docs: {
      description: {
        story: `
Avatar is built with accessibility in mind:
- **role="img"** on span containers with aria-label
- **Status announcements** are included in aria-label
- **Interactive mode** adds button semantics and keyboard support
- **Decorative mode** hides avatars from screen readers
- **AvatarGroup** uses role="group" with descriptive aria-label
        `,
      },
    },
  },
};
