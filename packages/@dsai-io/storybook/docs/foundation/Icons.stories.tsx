import {
  ArrowClockwiseIcon,
  ArrowDownIcon,
  // Navigation & Arrows
  ArrowLeftIcon,
  ArrowRepeatIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  BellFillIcon,
  BellIcon,
  BookmarkFillIcon,
  BookmarkIcon,
  CalendarFillIcon,
  // Calendar & Time
  CalendarIcon,
  CaretLeftFillIcon,
  CaretRightFillIcon,
  ChatDotsFillIcon,
  ChatDotsIcon,
  ChatFillIcon,
  // Communication
  ChatIcon,
  CheckCircleFillIcon,
  // Actions
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ClipboardCheckIcon,
  // Edit & Tools
  ClipboardIcon,
  ClockFillIcon,
  ClockIcon,
  // Cloud & Download
  CloudFillIcon,
  DashCircleFillIcon,
  DashIcon,
  DownloadIcon,
  EnvelopeFillIcon,
  EnvelopeIcon,
  ExclamationCircleFillIcon,
  // Status & Alerts
  ExclamationTriangleFillIcon,
  EyeFillIcon,
  // Eye & View
  EyeIcon,
  EyeSlashIcon,
  FacebookIcon,
  FileFillIcon,
  // Files & Folders
  FileIcon,
  FileTextFillIcon,
  FileTextIcon,
  FilterIcon,
  Folder2Icon,
  Folder2OpenIcon,
  FolderFillIcon,
  FolderIcon,
  GearFillIcon,
  GearIcon,
  // Social & Brands
  GithubIcon,
  Heading,
  HeartFillIcon,
  HeartIcon,
  HouseFillIcon,
  HouseIcon,
  InfoCircleFillIcon,
  InstagramIcon,
  KeyFillIcon,
  KeyIcon,
  LinkedinIcon,
  LockFillIcon,
  // Lock & Security
  LockIcon,
  PauseFillIcon,
  PauseIcon,
  PersonFillIcon,
  PersonIcon,
  PlayFillIcon,
  // Media
  PlayIcon,
  PlusCircleFillIcon,
  PlusIcon,
  QuestionCircleFillIcon,
  // Common UI
  SearchIcon,
  ShareFillIcon,
  ShareIcon,
  ShieldCheckIcon,
  ShieldFillCheckIcon,
  ShieldFillIcon,
  ShieldIcon,
  SkipBackwardIcon,
  SkipForwardIcon,
  StarFillIcon,
  StarIcon,
  StopFillIcon,
  StopIcon,
  TelephoneFillIcon,
  TelephoneIcon,
  // Misc
  ThreeDotsIcon,
  ThreeDotsVerticalIcon,
  TwitterXIcon,
  UnlockFillIcon,
  UnlockIcon,
  UploadIcon,
  VolumeMuteFillIcon,
  VolumeMuteIcon,
  VolumeUpFillIcon,
  VolumeUpIcon,
  XCircleFillIcon,
  XIcon,
  YoutubeIcon,
} from '@dsai-io/react';
import { useId, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundation/Icons',
  parameters: {
    docs: {
      description: {
        component: `
DSAi Icon System - 2000+ Bootstrap Icons as React components.

## Features
- **Inline SVG** - No external dependencies, Figma-compatible
- **Accessible by default** - Decorative icons are automatically hidden from screen readers
- **Customizable** - Size, color, and all SVG attributes supported
- **Tree-shakeable** - Only import the icons you use
- **TypeScript** - Full type support with \`IconProps\`

## Usage

\`\`\`tsx
import { ArrowLeftIcon, CheckCircleFillIcon } from '@dsai-io/react';

// Decorative (inside buttons, next to text)
<Button startIcon={<ArrowLeftIcon />}>Back</Button>

// Semantic (standalone with meaning)
<ArrowLeftIcon aria-label="Go back" />

// Custom size and color
<CheckCircleFillIcon size={24} color="green" />
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// =============================================================================
// Helper Components
// =============================================================================

interface IconDisplayProps {
  icon: React.ReactNode;
  name: string;
  size?: number;
}

const IconDisplay = ({ icon, name, size = 24 }: IconDisplayProps) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 8px',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      backgroundColor: '#fafafa',
      minWidth: '100px',
      gap: '8px',
    }}
  >
    <div style={{ fontSize: size }}>{icon}</div>
    <span
      style={{
        fontSize: '11px',
        fontFamily: 'monospace',
        color: '#6b7280',
        textAlign: 'center',
        wordBreak: 'break-word',
      }}
    >
      {name}
    </span>
  </div>
);

interface IconGridProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const IconGrid = ({ children, title, description }: IconGridProps) => (
  <div style={{ marginBottom: '2rem' }}>
    {title && (
      <Heading level={3} style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
        {title}
      </Heading>
    )}
    {description && (
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>{description}</p>
    )}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: '12px',
      }}
    >
      {children}
    </div>
  </div>
);

// =============================================================================
// Default Story - Overview
// =============================================================================

/**
 * Overview of the icon system with commonly used icons organized by category.
 */
export const Overview: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <IconGrid
        title="Navigation & Arrows"
        description="Icons for navigation, directions, and flow control"
      >
        <IconDisplay icon={<ArrowLeftIcon size={24} />} name="ArrowLeftIcon" />
        <IconDisplay icon={<ArrowRightIcon size={24} />} name="ArrowRightIcon" />
        <IconDisplay icon={<ArrowUpIcon size={24} />} name="ArrowUpIcon" />
        <IconDisplay icon={<ArrowDownIcon size={24} />} name="ArrowDownIcon" />
        <IconDisplay icon={<ChevronLeftIcon size={24} />} name="ChevronLeftIcon" />
        <IconDisplay icon={<ChevronRightIcon size={24} />} name="ChevronRightIcon" />
        <IconDisplay icon={<ChevronUpIcon size={24} />} name="ChevronUpIcon" />
        <IconDisplay icon={<ChevronDownIcon size={24} />} name="ChevronDownIcon" />
        <IconDisplay icon={<CaretLeftFillIcon size={24} />} name="CaretLeftFillIcon" />
        <IconDisplay icon={<CaretRightFillIcon size={24} />} name="CaretRightFillIcon" />
        <IconDisplay icon={<ArrowClockwiseIcon size={24} />} name="ArrowClockwiseIcon" />
        <IconDisplay icon={<ArrowRepeatIcon size={24} />} name="ArrowRepeatIcon" />
      </IconGrid>

      <IconGrid title="Actions" description="Common action icons for user interactions">
        <IconDisplay icon={<CheckIcon size={24} />} name="CheckIcon" />
        <IconDisplay icon={<CheckCircleFillIcon size={24} />} name="CheckCircleFillIcon" />
        <IconDisplay icon={<XIcon size={24} />} name="XIcon" />
        <IconDisplay icon={<XCircleFillIcon size={24} />} name="XCircleFillIcon" />
        <IconDisplay icon={<PlusIcon size={24} />} name="PlusIcon" />
        <IconDisplay icon={<PlusCircleFillIcon size={24} />} name="PlusCircleFillIcon" />
        <IconDisplay icon={<DashIcon size={24} />} name="DashIcon" />
        <IconDisplay icon={<DashCircleFillIcon size={24} />} name="DashCircleFillIcon" />
      </IconGrid>

      <IconGrid title="Status & Alerts" description="Icons for feedback, warnings, and information">
        <IconDisplay icon={<ExclamationTriangleFillIcon size={24} />} name="ExclamationTriangle" />
        <IconDisplay icon={<ExclamationCircleFillIcon size={24} />} name="ExclamationCircle" />
        <IconDisplay icon={<InfoCircleFillIcon size={24} />} name="InfoCircleFillIcon" />
        <IconDisplay icon={<QuestionCircleFillIcon size={24} />} name="QuestionCircle" />
        <IconDisplay icon={<CheckCircleFillIcon size={24} />} name="CheckCircleFill" />
        <IconDisplay icon={<XCircleFillIcon size={24} />} name="XCircleFillIcon" />
      </IconGrid>

      <IconGrid title="Common UI" description="Frequently used interface icons">
        <IconDisplay icon={<SearchIcon size={24} />} name="SearchIcon" />
        <IconDisplay icon={<GearIcon size={24} />} name="GearIcon" />
        <IconDisplay icon={<HouseIcon size={24} />} name="HouseIcon" />
        <IconDisplay icon={<PersonIcon size={24} />} name="PersonIcon" />
        <IconDisplay icon={<EnvelopeIcon size={24} />} name="EnvelopeIcon" />
        <IconDisplay icon={<BellIcon size={24} />} name="BellIcon" />
        <IconDisplay icon={<HeartIcon size={24} />} name="HeartIcon" />
        <IconDisplay icon={<StarIcon size={24} />} name="StarIcon" />
        <IconDisplay icon={<BookmarkIcon size={24} />} name="BookmarkIcon" />
        <IconDisplay icon={<ThreeDotsIcon size={24} />} name="ThreeDotsIcon" />
        <IconDisplay icon={<ThreeDotsVerticalIcon size={24} />} name="ThreeDotsVertical" />
        <IconDisplay icon={<FilterIcon size={24} />} name="FilterIcon" />
      </IconGrid>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// =============================================================================
// Size Variations
// =============================================================================

/**
 * Icons can be rendered at different sizes using the `size` prop.
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <Heading level={3} style={{ marginBottom: '1rem' }}>
          Size prop (number = pixels)
        </Heading>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end' }}>
          <div style={{ textAlign: 'center' }}>
            <CheckCircleFillIcon size={12} />
            <p style={{ fontSize: '12px', marginTop: '8px' }}>12px</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <CheckCircleFillIcon size={16} />
            <p style={{ fontSize: '12px', marginTop: '8px' }}>16px (default)</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <CheckCircleFillIcon size={24} />
            <p style={{ fontSize: '12px', marginTop: '8px' }}>24px</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <CheckCircleFillIcon size={32} />
            <p style={{ fontSize: '12px', marginTop: '8px' }}>32px</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <CheckCircleFillIcon size={48} />
            <p style={{ fontSize: '12px', marginTop: '8px' }}>48px</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <CheckCircleFillIcon size={64} />
            <p style={{ fontSize: '12px', marginTop: '8px' }}>64px</p>
          </div>
        </div>
      </div>

      <div>
        <Heading level={3} style={{ marginBottom: '1rem' }}>
          Size prop (string = CSS value)
        </Heading>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end' }}>
          <div style={{ textAlign: 'center' }}>
            <CheckCircleFillIcon size="1rem" />
            <p style={{ fontSize: '12px', marginTop: '8px' }}>1rem</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <CheckCircleFillIcon size="1.5rem" />
            <p style={{ fontSize: '12px', marginTop: '8px' }}>1.5rem</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <CheckCircleFillIcon size="2rem" />
            <p style={{ fontSize: '12px', marginTop: '8px' }}>2rem</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <CheckCircleFillIcon size="2em" />
            <p style={{ fontSize: '12px', marginTop: '8px' }}>2em</p>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// =============================================================================
// Color Variations
// =============================================================================

/**
 * Icons use `currentColor` by default, inheriting text color. Use the `color` prop to override.
 */
export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <Heading level={3} style={{ marginBottom: '1rem' }}>
          Semantic Colors
        </Heading>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <CheckCircleFillIcon size={32} color="var(--bs-success)" />
            <p style={{ fontSize: '12px', marginTop: '8px' }}>Success</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <ExclamationTriangleFillIcon size={32} color="var(--bs-warning)" />
            <p style={{ fontSize: '12px', marginTop: '8px' }}>Warning</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <XCircleFillIcon size={32} color="var(--bs-danger)" />
            <p style={{ fontSize: '12px', marginTop: '8px' }}>Danger</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <InfoCircleFillIcon size={32} color="var(--bs-info)" />
            <p style={{ fontSize: '12px', marginTop: '8px' }}>Info</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <GearFillIcon size={32} color="var(--bs-secondary)" />
            <p style={{ fontSize: '12px', marginTop: '8px' }}>Secondary</p>
          </div>
        </div>
      </div>

      <div>
        <Heading level={3} style={{ marginBottom: '1rem' }}>
          Custom Colors
        </Heading>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <HeartFillIcon size={32} color="#e91e63" />
            <p style={{ fontSize: '12px', marginTop: '8px' }}>#e91e63</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <StarFillIcon size={32} color="#ffc107" />
            <p style={{ fontSize: '12px', marginTop: '8px' }}>#ffc107</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <CloudFillIcon size={32} color="#2196f3" />
            <p style={{ fontSize: '12px', marginTop: '8px' }}>#2196f3</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <GithubIcon size={32} color="#333" />
            <p style={{ fontSize: '12px', marginTop: '8px' }}>#333</p>
          </div>
        </div>
      </div>

      <div>
        <Heading level={3} style={{ marginBottom: '1rem' }}>
          Inheriting Text Color (default)
        </Heading>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ color: '#1f2937' }}>
            <SearchIcon size={24} /> Dark text
          </div>
          <div style={{ color: '#6b7280' }}>
            <SearchIcon size={24} /> Gray text
          </div>
          <div style={{ color: '#3b82f6' }}>
            <SearchIcon size={24} /> Blue text
          </div>
          <div style={{ color: '#10b981' }}>
            <SearchIcon size={24} /> Green text
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// =============================================================================
// Outline vs Fill Variants
// =============================================================================

/**
 * Most icons come in outline and fill variants for different visual emphasis.
 */
export const OutlineVsFill: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1rem',
        }}
      >
        {[
          { outline: <HeartIcon size={24} />, fill: <HeartFillIcon size={24} />, name: 'Heart' },
          { outline: <StarIcon size={24} />, fill: <StarFillIcon size={24} />, name: 'Star' },
          {
            outline: <BookmarkIcon size={24} />,
            fill: <BookmarkFillIcon size={24} />,
            name: 'Bookmark',
          },
          { outline: <BellIcon size={24} />, fill: <BellFillIcon size={24} />, name: 'Bell' },
          { outline: <GearIcon size={24} />, fill: <GearFillIcon size={24} />, name: 'Gear' },
          { outline: <HouseIcon size={24} />, fill: <HouseFillIcon size={24} />, name: 'House' },
          { outline: <PersonIcon size={24} />, fill: <PersonFillIcon size={24} />, name: 'Person' },
          {
            outline: <EnvelopeIcon size={24} />,
            fill: <EnvelopeFillIcon size={24} />,
            name: 'Envelope',
          },
          { outline: <LockIcon size={24} />, fill: <LockFillIcon size={24} />, name: 'Lock' },
          { outline: <EyeIcon size={24} />, fill: <EyeFillIcon size={24} />, name: 'Eye' },
          {
            outline: <CalendarIcon size={24} />,
            fill: <CalendarFillIcon size={24} />,
            name: 'Calendar',
          },
          { outline: <ClockIcon size={24} />, fill: <ClockFillIcon size={24} />, name: 'Clock' },
        ].map(({ outline, fill, name }) => (
          <div
            key={name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              {outline}
              {fill}
            </div>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// =============================================================================
// Accessibility
// =============================================================================

/**
 * Icons are accessible by default - decorative when no label, semantic when labeled.
 */
export const Accessibility: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div
        style={{
          padding: '1rem',
          backgroundColor: '#f0fdf4',
          borderRadius: '8px',
          border: '1px solid #bbf7d0',
        }}
      >
        <h3
          style={{
            marginBottom: '0.5rem',
            color: '#166534',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircleFillIcon size={18} /> Decorative Icons (Inside Buttons)
        </h3>
        <p style={{ fontSize: '14px', color: '#166534', marginBottom: '1rem' }}>
          When used inside buttons or next to text, icons should be decorative. The button text
          provides the accessible name.
        </p>
        <code
          style={{
            display: 'block',
            padding: '12px',
            backgroundColor: '#dcfce7',
            borderRadius: '4px',
            fontSize: '13px',
          }}
        >
          {`<Button startIcon={<ArrowLeftIcon />}>Go Back</Button>`}
        </code>
        <p style={{ fontSize: '12px', color: '#166534', marginTop: '8px' }}>
          The icon will have <code>aria-hidden=&quot;true&quot;</code> automatically.
        </p>
      </div>

      <div
        style={{
          padding: '1rem',
          backgroundColor: '#eff6ff',
          borderRadius: '8px',
          border: '1px solid #bfdbfe',
        }}
      >
        <h3
          style={{
            marginBottom: '0.5rem',
            color: '#1e40af',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <InfoCircleFillIcon size={18} /> Semantic Icons (Standalone)
        </h3>
        <p style={{ fontSize: '14px', color: '#1e40af', marginBottom: '1rem' }}>
          When an icon conveys meaning on its own, use <code>aria-label</code> to make it
          accessible.
        </p>
        <code
          style={{
            display: 'block',
            padding: '12px',
            backgroundColor: '#dbeafe',
            borderRadius: '4px',
            fontSize: '13px',
          }}
        >
          {`<CheckCircleFillIcon aria-label="Task completed" color="green" />`}
        </code>
        <p style={{ fontSize: '12px', color: '#1e40af', marginTop: '8px' }}>
          The icon will have <code>role=&quot;img&quot;</code> and the label will be announced.
        </p>
      </div>

      <div
        style={{
          padding: '1rem',
          backgroundColor: '#fef3c7',
          borderRadius: '8px',
          border: '1px solid #fde68a',
        }}
      >
        <h3
          style={{
            marginBottom: '0.5rem',
            color: '#92400e',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <ExclamationTriangleFillIcon size={18} /> Icon-Only Buttons
        </h3>
        <p style={{ fontSize: '14px', color: '#92400e', marginBottom: '1rem' }}>
          For icon-only buttons, always add <code>aria-label</code> to the Button, not the icon.
        </p>
        <code
          style={{
            display: 'block',
            padding: '12px',
            backgroundColor: '#fef9c3',
            borderRadius: '4px',
            fontSize: '13px',
          }}
        >
          {`<Button aria-label="Close dialog" startIcon={<XIcon />} />`}
        </code>
        <p style={{ fontSize: '12px', color: '#92400e', marginTop: '8px' }}>
          The button wrapper hides the icon; the button&apos;s <code>aria-label</code> provides the
          name.
        </p>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// =============================================================================
// Files & Folders
// =============================================================================

/**
 * Icons for file management and document types.
 */
export const FilesAndFolders: Story = {
  render: () => (
    <IconGrid title="Files & Folders" description="Document and folder management icons">
      <IconDisplay icon={<FileIcon size={24} />} name="FileIcon" />
      <IconDisplay icon={<FileFillIcon size={24} />} name="FileFillIcon" />
      <IconDisplay icon={<FileTextIcon size={24} />} name="FileTextIcon" />
      <IconDisplay icon={<FileTextFillIcon size={24} />} name="FileTextFillIcon" />
      <IconDisplay icon={<FolderIcon size={24} />} name="FolderIcon" />
      <IconDisplay icon={<FolderFillIcon size={24} />} name="FolderFillIcon" />
      <IconDisplay icon={<Folder2Icon size={24} />} name="Folder2Icon" />
      <IconDisplay icon={<Folder2OpenIcon size={24} />} name="Folder2OpenIcon" />
      <IconDisplay icon={<ClipboardIcon size={24} />} name="ClipboardIcon" />
      <IconDisplay icon={<ClipboardCheckIcon size={24} />} name="ClipboardCheckIcon" />
      <IconDisplay icon={<DownloadIcon size={24} />} name="DownloadIcon" />
      <IconDisplay icon={<UploadIcon size={24} />} name="UploadIcon" />
    </IconGrid>
  ),
  parameters: {
    layout: 'padded',
  },
};

// =============================================================================
// Media Controls
// =============================================================================

/**
 * Icons for media playback and audio controls.
 */
export const MediaControls: Story = {
  render: () => (
    <IconGrid title="Media Controls" description="Playback and audio control icons">
      <IconDisplay icon={<PlayIcon size={24} />} name="PlayIcon" />
      <IconDisplay icon={<PlayFillIcon size={24} />} name="PlayFillIcon" />
      <IconDisplay icon={<PauseIcon size={24} />} name="PauseIcon" />
      <IconDisplay icon={<PauseFillIcon size={24} />} name="PauseFillIcon" />
      <IconDisplay icon={<StopIcon size={24} />} name="StopIcon" />
      <IconDisplay icon={<StopFillIcon size={24} />} name="StopFillIcon" />
      <IconDisplay icon={<SkipBackwardIcon size={24} />} name="SkipBackwardIcon" />
      <IconDisplay icon={<SkipForwardIcon size={24} />} name="SkipForwardIcon" />
      <IconDisplay icon={<VolumeUpIcon size={24} />} name="VolumeUpIcon" />
      <IconDisplay icon={<VolumeUpFillIcon size={24} />} name="VolumeUpFillIcon" />
      <IconDisplay icon={<VolumeMuteIcon size={24} />} name="VolumeMuteIcon" />
      <IconDisplay icon={<VolumeMuteFillIcon size={24} />} name="VolumeMuteFillIcon" />
    </IconGrid>
  ),
  parameters: {
    layout: 'padded',
  },
};

// =============================================================================
// Communication
// =============================================================================

/**
 * Icons for messaging and communication features.
 */
export const Communication: Story = {
  render: () => (
    <IconGrid title="Communication" description="Messaging and contact icons">
      <IconDisplay icon={<ChatIcon size={24} />} name="ChatIcon" />
      <IconDisplay icon={<ChatFillIcon size={24} />} name="ChatFillIcon" />
      <IconDisplay icon={<ChatDotsIcon size={24} />} name="ChatDotsIcon" />
      <IconDisplay icon={<ChatDotsFillIcon size={24} />} name="ChatDotsFillIcon" />
      <IconDisplay icon={<EnvelopeIcon size={24} />} name="EnvelopeIcon" />
      <IconDisplay icon={<EnvelopeFillIcon size={24} />} name="EnvelopeFillIcon" />
      <IconDisplay icon={<TelephoneIcon size={24} />} name="TelephoneIcon" />
      <IconDisplay icon={<TelephoneFillIcon size={24} />} name="TelephoneFillIcon" />
      <IconDisplay icon={<BellIcon size={24} />} name="BellIcon" />
      <IconDisplay icon={<BellFillIcon size={24} />} name="BellFillIcon" />
      <IconDisplay icon={<ShareIcon size={24} />} name="ShareIcon" />
      <IconDisplay icon={<ShareFillIcon size={24} />} name="ShareFillIcon" />
    </IconGrid>
  ),
  parameters: {
    layout: 'padded',
  },
};

// =============================================================================
// Security
// =============================================================================

/**
 * Icons for security, privacy, and authentication.
 */
export const Security: Story = {
  render: () => (
    <IconGrid title="Security" description="Lock, shield, and privacy icons">
      <IconDisplay icon={<LockIcon size={24} />} name="LockIcon" />
      <IconDisplay icon={<LockFillIcon size={24} />} name="LockFillIcon" />
      <IconDisplay icon={<UnlockIcon size={24} />} name="UnlockIcon" />
      <IconDisplay icon={<UnlockFillIcon size={24} />} name="UnlockFillIcon" />
      <IconDisplay icon={<ShieldIcon size={24} />} name="ShieldIcon" />
      <IconDisplay icon={<ShieldFillIcon size={24} />} name="ShieldFillIcon" />
      <IconDisplay icon={<ShieldCheckIcon size={24} />} name="ShieldCheckIcon" />
      <IconDisplay icon={<ShieldFillCheckIcon size={24} />} name="ShieldFillCheckIcon" />
      <IconDisplay icon={<KeyIcon size={24} />} name="KeyIcon" />
      <IconDisplay icon={<KeyFillIcon size={24} />} name="KeyFillIcon" />
      <IconDisplay icon={<EyeIcon size={24} />} name="EyeIcon" />
      <IconDisplay icon={<EyeSlashIcon size={24} />} name="EyeSlashIcon" />
    </IconGrid>
  ),
  parameters: {
    layout: 'padded',
  },
};

// =============================================================================
// Social & Brands
// =============================================================================

/**
 * Brand and social media icons.
 */
export const SocialAndBrands: Story = {
  render: () => (
    <IconGrid title="Social & Brands" description="Brand and social media platform icons">
      <IconDisplay icon={<GithubIcon size={24} />} name="GithubIcon" />
      <IconDisplay icon={<TwitterXIcon size={24} />} name="TwitterXIcon" />
      <IconDisplay icon={<LinkedinIcon size={24} />} name="LinkedinIcon" />
      <IconDisplay icon={<FacebookIcon size={24} />} name="FacebookIcon" />
      <IconDisplay icon={<InstagramIcon size={24} />} name="InstagramIcon" />
      <IconDisplay icon={<YoutubeIcon size={24} />} name="YoutubeIcon" />
    </IconGrid>
  ),
  parameters: {
    layout: 'padded',
  },
};

// =============================================================================
// Interactive Demo
// =============================================================================

/**
 * Interactive demo to customize icon properties.
 */
export const InteractiveDemo: Story = {
  render: function InteractiveDemoStory() {
    const id = useId();
    const sizeId = `${id}-size`;
    const colorId = `${id}-color`;
    const [size, setSize] = useState(32);
    const [color, setColor] = useState('#0d6efd');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div
          style={{
            padding: '2rem',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '150px',
            backgroundColor: '#fafafa',
          }}
        >
          <StarFillIcon size={size} color={color} />
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label
              htmlFor={sizeId}
              style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}
            >
              Size: {size}px
            </label>
            <input
              id={sizeId}
              type="range"
              min="12"
              max="128"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ flex: '1 1 200px' }}>
            <label
              htmlFor={colorId}
              style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}
            >
              Color
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                id={colorId}
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{ width: '50px', height: '36px', border: 'none', cursor: 'pointer' }}
              />
              <code style={{ fontSize: '14px' }}>{color}</code>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '1rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '14px',
          }}
        >
          {`<StarFillIcon size={${size}} color="${color}" />`}
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};
