/**
 * Figma Code Connect - Avatar Component
 *
 * Maps the DSAi Avatar Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module Avatar/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { Avatar } from './Avatar';
import { AvatarGroup } from './AvatarGroup';

/**
 * DSAi Avatar - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_AVATAR>` substitution variable defined in figma.config.json.
 *
 * Accessibility goals:
 * - Prefer visible name for aria-label generation
 * - Support decorative mode for purely visual avatars
 * - Include status in aria-label announcements
 */
figma.connect(Avatar, '<FIGMA_DSAI_AVATAR>', {
  props: {
    /**
     * User name for initials and aria-label
     */
    name: figma.string('Name'),

    /**
     * Explicit initials (overrides name-derived)
     */
    initials: figma.string('Initials'),

    /**
     * Image source URL
     */
    src: figma.string('Image URL'),

    /**
     * Alt text for image
     */
    alt: figma.string('Alt Text'),

    /**
     * Size variant
     */
    size: figma.enum('Size', {
      'Extra Small': 'xs',
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
      'Extra Large': 'xl',
      '2X Large': '2xl',
    }),

    /**
     * Shape variant
     */
    shape: figma.enum('Shape', {
      Circle: 'circle',
      Rounded: 'rounded',
      Square: 'square',
    }),

    /**
     * Color tone
     */
    tone: figma.enum('Tone', {
      Neutral: 'neutral',
      Brand: 'brand',
      Accent: 'accent',
      Success: 'success',
      Warning: 'warning',
      Danger: 'danger',
      Info: 'info',
      Muted: 'muted',
      Inverse: 'inverse',
    }),

    /**
     * Presence status indicator
     */
    status: figma.enum('Status', {
      None: undefined,
      Online: 'online',
      Busy: 'busy',
      Away: 'away',
      Offline: 'offline',
      'Do Not Disturb': 'dnd',
      Unknown: 'unknown',
    }),

    /**
     * Status indicator position
     */
    statusPosition: figma.enum('Status Position', {
      'Bottom Right': 'bottom-right',
      'Bottom Left': 'bottom-left',
    }),

    /**
     * Notification badge count (string from Figma, parsed to number)
     */
    badgeCount: figma.string('Badge Count'),

    /**
     * Show notification dot
     */
    badgeDot: figma.boolean('Badge Dot'),

    /**
     * Interactive mode (focusable, clickable)
     */
    interactive: figma.boolean('Interactive'),

    /**
     * Selection state
     */
    selected: figma.boolean('Selected'),

    /**
     * Loading skeleton
     */
    isLoading: figma.boolean('Loading'),

    /**
     * Decorative (hidden from screen readers)
     */
    decorative: figma.boolean('Decorative'),
  },
  example: (props) => (
    <Avatar
      name={props.name}
      initials={props.initials}
      src={props.src}
      alt={props.alt}
      size={props.size}
      shape={props.shape}
      tone={props.tone}
      status={props.status}
      statusPosition={props.statusPosition}
      badgeCount={props.badgeCount ? Number.parseInt(props.badgeCount, 10) : undefined}
      badgeDot={props.badgeDot}
      interactive={props.interactive}
      selected={props.selected}
      isLoading={props.isLoading}
      decorative={props.decorative}
    />
  ),
});

/**
 * DSAi AvatarGroup - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_AVATAR_GROUP>` substitution variable.
 */
figma.connect(AvatarGroup, '<FIGMA_DSAI_AVATAR_GROUP>', {
  props: {
    /**
     * Maximum visible avatars before overflow (string from Figma, parsed to number)
     */
    maxVisible: figma.string('Max Visible'),

    /**
     * Layout mode
     */
    layout: figma.enum('Layout', {
      Stacked: 'stacked',
      Inline: 'inline',
    }),

    /**
     * Spacing between avatars
     */
    spacing: figma.enum('Spacing', {
      Compact: 'compact',
      Normal: 'normal',
      Loose: 'loose',
    }),

    /**
     * Size for all child avatars
     */
    size: figma.enum('Size', {
      'Extra Small': 'xs',
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
      'Extra Large': 'xl',
      '2X Large': '2xl',
    }),

    /**
     * Shape for all child avatars
     */
    shape: figma.enum('Shape', {
      Circle: 'circle',
      Rounded: 'rounded',
      Square: 'square',
    }),

    /**
     * Custom aria-label for the group
     */
    ariaLabel: figma.string('Aria Label'),
  },
  example: (props) => (
    <AvatarGroup
      maxVisible={props.maxVisible ? Number.parseInt(props.maxVisible, 10) : undefined}
      layout={props.layout}
      spacing={props.spacing}
      size={props.size}
      shape={props.shape}
      aria-label={props.ariaLabel}
    >
      <Avatar name="User 1" />
      <Avatar name="User 2" />
      <Avatar name="User 3" />
    </AvatarGroup>
  ),
});
