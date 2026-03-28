/**
 * Hand-curated metadata for all DSAi components, hooks, and utilities.
 * The registry builder uses this to know what to scan and how to label items.
 * @module @dsai-io/tools/registry/component-map
 */

import type { RegistryItemType } from './types.js';

export interface ComponentMeta {
  type: RegistryItemType;
  title: string;
  description: string;
  categories?: string[];
  npmDependencies?: string[];
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

export const componentMap: Record<string, ComponentMeta> = {
  accordion: {
    type: 'registry:ui',
    title: 'Accordion',
    description: 'Collapsible content panels for presenting information in a limited space.',
    categories: ['disclosure', 'layout'],
  },
  alert: {
    type: 'registry:ui',
    title: 'Alert',
    description: 'Contextual feedback messages for user actions.',
    categories: ['feedback'],
  },
  avatar: {
    type: 'registry:ui',
    title: 'Avatar',
    description: 'Graphical representation of a user or entity.',
    categories: ['data-display'],
  },
  badge: {
    type: 'registry:ui',
    title: 'Badge',
    description: 'Small count or status indicator, typically displayed on other elements.',
    categories: ['data-display'],
  },
  breadcrumb: {
    type: 'registry:ui',
    title: 'Breadcrumb',
    description: 'Navigation aid showing the current page location within a hierarchy.',
    categories: ['navigation'],
  },
  button: {
    type: 'registry:ui',
    title: 'Button',
    description: 'Trigger for actions and events.',
    categories: ['actions'],
  },
  card: {
    type: 'registry:ui',
    title: 'Card',
    description: 'Flexible container for grouping related content and actions.',
    categories: ['layout', 'data-display'],
  },
  'card-list': {
    type: 'registry:ui',
    title: 'CardList',
    description: 'Responsive list of selectable cards with keyboard navigation.',
    categories: ['layout', 'data-display'],
  },
  carousel: {
    type: 'registry:ui',
    title: 'Carousel',
    description: 'Slideshow component for cycling through content.',
    categories: ['data-display'],
  },
  checkbox: {
    type: 'registry:ui',
    title: 'Checkbox',
    description: 'Toggle control for boolean selections.',
    categories: ['forms'],
  },
  'checkbox-group': {
    type: 'registry:ui',
    title: 'CheckboxGroup',
    description: 'Managed group of checkboxes with shared state.',
    categories: ['forms'],
  },
  dropdown: {
    type: 'registry:ui',
    title: 'Dropdown',
    description: 'Toggleable overlay menu for displaying a list of actions.',
    categories: ['navigation', 'actions'],
    npmDependencies: ['@floating-ui/react'],
  },
  icon: {
    type: 'registry:ui',
    title: 'Icon',
    description: 'Scalable vector icon component with accessibility support.',
    categories: ['data-display'],
  },
  input: {
    type: 'registry:ui',
    title: 'Input',
    description: 'Text input field with validation and formatting support.',
    categories: ['forms'],
  },
  'list-group': {
    type: 'registry:ui',
    title: 'ListGroup',
    description: 'Flexible component for displaying a series of items.',
    categories: ['data-display', 'navigation'],
  },
  modal: {
    type: 'registry:ui',
    title: 'Modal',
    description: 'Dialog overlay for focused content and user interactions.',
    categories: ['feedback', 'disclosure'],
  },
  navbar: {
    type: 'registry:ui',
    title: 'Navbar',
    description: 'Responsive navigation header with branding and links.',
    categories: ['navigation'],
  },
  pagination: {
    type: 'registry:ui',
    title: 'Pagination',
    description: 'Navigation controls for paged content.',
    categories: ['navigation'],
  },
  popover: {
    type: 'registry:ui',
    title: 'Popover',
    description: 'Floating content panel anchored to a trigger element.',
    categories: ['disclosure'],
    npmDependencies: ['@floating-ui/react'],
  },
  progress: {
    type: 'registry:ui',
    title: 'Progress',
    description: 'Visual indicator of task completion.',
    categories: ['feedback'],
  },
  radio: {
    type: 'registry:ui',
    title: 'Radio',
    description: 'Single-select control within a group of options.',
    categories: ['forms'],
  },
  scrollspy: {
    type: 'registry:ui',
    title: 'Scrollspy',
    description: 'Automatically highlights navigation links based on scroll position.',
    categories: ['navigation'],
  },
  select: {
    type: 'registry:ui',
    title: 'Select',
    description: 'Dropdown selector for choosing from a list of options.',
    categories: ['forms'],
    npmDependencies: ['@floating-ui/react'],
  },
  'selectable-card': {
    type: 'registry:ui',
    title: 'SelectableCard',
    description: 'Card variant that acts as a selectable option.',
    categories: ['forms', 'data-display'],
  },
  sheet: {
    type: 'registry:ui',
    title: 'Sheet',
    description: 'Sliding panel overlay from screen edges.',
    categories: ['disclosure', 'layout'],
  },
  spinner: {
    type: 'registry:ui',
    title: 'Spinner',
    description: 'Loading indicator for asynchronous operations.',
    categories: ['feedback'],
  },
  switch: {
    type: 'registry:ui',
    title: 'Switch',
    description: 'Toggle control for binary on/off states.',
    categories: ['forms'],
  },
  table: {
    type: 'registry:ui',
    title: 'Table',
    description: 'Data table with sorting, selection, and responsive layout.',
    categories: ['data-display'],
  },
  tabs: {
    type: 'registry:ui',
    title: 'Tabs',
    description: 'Tabbed interface for switching between content panels.',
    categories: ['navigation', 'layout'],
  },
  'tabs-pro': {
    type: 'registry:ui',
    title: 'TabsPro',
    description: 'Advanced tabbed interface with closable, sortable, and overflow support.',
    categories: ['navigation', 'layout'],
  },
  toast: {
    type: 'registry:ui',
    title: 'Toast',
    description: 'Brief notification messages that auto-dismiss.',
    categories: ['feedback'],
  },
  tooltip: {
    type: 'registry:ui',
    title: 'Tooltip',
    description: 'Informational popup displayed on hover or focus.',
    categories: ['data-display'],
    npmDependencies: ['@floating-ui/react'],
  },
  typography: {
    type: 'registry:ui',
    title: 'Typography',
    description: 'Text rendering primitives with semantic variants.',
    categories: ['data-display'],
  },
};

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export const hookMap: Record<string, ComponentMeta> = {
  'use-async': {
    type: 'registry:hook',
    title: 'useAsync',
    description: 'Manages async operation lifecycle (loading, error, data states).',
    categories: ['state'],
  },
  'use-callback-ref': {
    type: 'registry:hook',
    title: 'useCallbackRef',
    description: 'Stable callback reference that always points to the latest function.',
    categories: ['refs'],
  },
  'use-click-outside': {
    type: 'registry:hook',
    title: 'useClickOutside',
    description: 'Detects clicks outside of a target element.',
    categories: ['dom'],
  },
  'use-controllable-state': {
    type: 'registry:hook',
    title: 'useControllableState',
    description: 'Manages state that can be either controlled or uncontrolled.',
    categories: ['state'],
  },
  'use-dark-mode': {
    type: 'registry:hook',
    title: 'useDarkMode',
    description: 'Detects and toggles dark mode preference.',
    categories: ['theme'],
  },
  'use-debounce': {
    type: 'registry:hook',
    title: 'useDebounce',
    description: 'Debounces a value or callback over a specified delay.',
    categories: ['timing'],
  },
  'use-field': {
    type: 'registry:hook',
    title: 'useField',
    description: 'Form field state management with validation.',
    categories: ['forms'],
  },
  'use-focus-trap': {
    type: 'registry:hook',
    title: 'useFocusTrap',
    description: 'Traps keyboard focus within a container for modal-like experiences.',
    categories: ['a11y'],
  },
  'use-form': {
    type: 'registry:hook',
    title: 'useForm',
    description: 'Comprehensive form state management with validation.',
    categories: ['forms'],
  },
  'use-hover': {
    type: 'registry:hook',
    title: 'useHover',
    description: 'Tracks hover state of an element with enter/leave delays.',
    categories: ['dom'],
  },
  'use-id': {
    type: 'registry:hook',
    title: 'useId',
    description: 'Generates stable unique identifiers for accessibility attributes.',
    categories: ['a11y'],
  },
  'use-intersection-observer': {
    type: 'registry:hook',
    title: 'useIntersectionObserver',
    description: 'Observes element visibility within the viewport.',
    categories: ['dom'],
  },
  'use-key-press': {
    type: 'registry:hook',
    title: 'useKeyPress',
    description: 'Listens for specific keyboard key presses.',
    categories: ['dom'],
  },
  'use-local-storage': {
    type: 'registry:hook',
    title: 'useLocalStorage',
    description: 'Persists state to localStorage with serialization.',
    categories: ['state', 'storage'],
  },
  'use-media-query': {
    type: 'registry:hook',
    title: 'useMediaQuery',
    description: 'Matches CSS media queries and provides responsive breakpoint helpers.',
    categories: ['responsive'],
  },
  'use-mounted': {
    type: 'registry:hook',
    title: 'useMounted',
    description: 'Tracks whether the component is currently mounted.',
    categories: ['lifecycle'],
  },
  'use-previous': {
    type: 'registry:hook',
    title: 'usePrevious',
    description: 'Returns the previous value of a variable across renders.',
    categories: ['state'],
  },
  'use-reduced-motion': {
    type: 'registry:hook',
    title: 'useReducedMotion',
    description: 'Detects user preference for reduced motion.',
    categories: ['a11y'],
  },
  'use-resize-observer': {
    type: 'registry:hook',
    title: 'useResizeObserver',
    description: 'Observes element size changes via ResizeObserver.',
    categories: ['dom'],
  },
  'use-roving-focus': {
    type: 'registry:hook',
    title: 'useRovingFocus',
    description: 'Implements roving tabindex pattern for composite widgets.',
    categories: ['a11y'],
  },
  'use-scroll-lock': {
    type: 'registry:hook',
    title: 'useScrollLock',
    description: 'Prevents body scrolling while active (for modals/overlays).',
    categories: ['dom'],
  },
  'use-session-storage': {
    type: 'registry:hook',
    title: 'useSessionStorage',
    description: 'Persists state to sessionStorage with serialization.',
    categories: ['state', 'storage'],
  },
  'use-throttle': {
    type: 'registry:hook',
    title: 'useThrottle',
    description: 'Throttles a value or callback to fire at most once per interval.',
    categories: ['timing'],
  },
};

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

export const utilMap: Record<string, ComponentMeta> = {
  cn: {
    type: 'registry:util',
    title: 'cn',
    description: 'Conditional class name composition utility.',
    categories: ['styling'],
  },
  a11y: {
    type: 'registry:util',
    title: 'a11y',
    description: 'Accessibility utilities including screen reader announcements and ARIA helpers.',
    categories: ['a11y'],
  },
  async: {
    type: 'registry:util',
    title: 'async',
    description: 'Async operation utilities: abortable tasks, queues, exponential backoff.',
    categories: ['async'],
  },
  browser: {
    type: 'registry:util',
    title: 'browser',
    description: 'Browser environment detection and feature checks.',
    categories: ['platform'],
  },
  collections: {
    type: 'registry:util',
    title: 'collections',
    description: 'Collection utilities: chunk, paginate, memoize, selectors.',
    categories: ['data'],
  },
  color: {
    type: 'registry:util',
    title: 'color',
    description: 'Color manipulation utilities: contrast, luminance, hex/rgb conversion.',
    categories: ['styling'],
  },
  date: {
    type: 'registry:util',
    title: 'date',
    description: 'Date formatting and relative time utilities.',
    categories: ['formatting'],
  },
  'merge-refs': {
    type: 'registry:util',
    title: 'mergeRefs',
    description: 'Merges multiple React refs into a single callback ref.',
    categories: ['refs'],
  },
  dx: {
    type: 'registry:util',
    title: 'dx',
    description: 'Developer experience helpers: component creation, context factories, polymorphic patterns.',
    categories: ['dx'],
  },
  forms: {
    type: 'registry:util',
    title: 'forms',
    description: 'Form utilities: validators, field error extraction, dirty checking.',
    categories: ['forms'],
  },
  keyboard: {
    type: 'registry:util',
    title: 'keyboard',
    description: 'Keyboard event helpers for detecting specific keys.',
    categories: ['dom'],
  },
  layout: {
    type: 'registry:util',
    title: 'layout',
    description: 'Layout measurement utilities: element bounds, viewport size, resize observation.',
    categories: ['dom'],
  },
  misc: {
    type: 'registry:util',
    title: 'misc',
    description: 'Miscellaneous utilities: clear icon, safe input props, event helpers.',
    categories: ['misc'],
  },
  motion: {
    type: 'registry:util',
    title: 'motion',
    description: 'Animation utilities: spring physics, easing functions, distance calculations.',
    categories: ['animation'],
  },
  number: {
    type: 'registry:util',
    title: 'number',
    description: 'Number formatting and clamping utilities.',
    categories: ['formatting'],
  },
  object: {
    type: 'registry:util',
    title: 'object',
    description: 'Object manipulation utilities: deep merge, pick, omit.',
    categories: ['data'],
  },
  platform: {
    type: 'registry:util',
    title: 'platform',
    description: 'Platform detection utilities: browser, OS, device pixel ratio, text direction.',
    categories: ['platform'],
  },
  responsive: {
    type: 'registry:util',
    title: 'responsive',
    description: 'Responsive design utilities.',
    categories: ['responsive'],
  },
  safety: {
    type: 'registry:util',
    title: 'safety',
    description: 'Security utilities: clipboard access, crypto ID generation, token generation.',
    categories: ['security'],
  },
  string: {
    type: 'registry:util',
    title: 'string',
    description: 'String manipulation utilities: capitalize, slugify, variant classes.',
    categories: ['formatting'],
  },
  telemetry: {
    type: 'registry:util',
    title: 'telemetry',
    description: 'Telemetry utilities: error catching, performance measurement, timing.',
    categories: ['observability'],
  },
  timing: {
    type: 'registry:util',
    title: 'timing',
    description: 'Timing utilities: debounce and throttle functions.',
    categories: ['timing'],
  },
  types: {
    type: 'registry:util',
    title: 'types',
    description: 'Shared type guards and type utilities.',
    categories: ['types'],
  },
  validation: {
    type: 'registry:util',
    title: 'validation',
    description: 'Input validation utilities: email, URL, href safety checks.',
    categories: ['validation'],
  },
};

// ---------------------------------------------------------------------------
// Directory name -> registry name mappings
// ---------------------------------------------------------------------------

/** Maps PascalCase component directory names to kebab-case registry names. */
export const directoryToRegistryName: Record<string, string> = {
  Accordion: 'accordion',
  Alert: 'alert',
  Avatar: 'avatar',
  Badge: 'badge',
  Breadcrumb: 'breadcrumb',
  Button: 'button',
  Card: 'card',
  CardList: 'card-list',
  Carousel: 'carousel',
  Checkbox: 'checkbox',
  CheckboxGroup: 'checkbox-group',
  Dropdown: 'dropdown',
  Icon: 'icon',
  Input: 'input',
  ListGroup: 'list-group',
  Modal: 'modal',
  Navbar: 'navbar',
  Pagination: 'pagination',
  Popover: 'popover',
  Progress: 'progress',
  Radio: 'radio',
  Scrollspy: 'scrollspy',
  Select: 'select',
  SelectableCard: 'selectable-card',
  Sheet: 'sheet',
  Spinner: 'spinner',
  Switch: 'switch',
  Table: 'table',
  Tabs: 'tabs',
  TabsPro: 'tabs-pro',
  Toast: 'toast',
  Tooltip: 'tooltip',
  Typography: 'typography',
};

/** Maps hook directory names (camelCase) to kebab-case registry names. */
export const hookDirectoryToRegistryName: Record<string, string> = {
  useAsync: 'use-async',
  useCallbackRef: 'use-callback-ref',
  useClickOutside: 'use-click-outside',
  useControllableState: 'use-controllable-state',
  useDarkMode: 'use-dark-mode',
  useDebounce: 'use-debounce',
  useField: 'use-field',
  useFocusTrap: 'use-focus-trap',
  useForm: 'use-form',
  useHover: 'use-hover',
  useId: 'use-id',
  useIntersectionObserver: 'use-intersection-observer',
  useKeyPress: 'use-key-press',
  useLocalStorage: 'use-local-storage',
  useMediaQuery: 'use-media-query',
  useMounted: 'use-mounted',
  usePrevious: 'use-previous',
  useReducedMotion: 'use-reduced-motion',
  useResizeObserver: 'use-resize-observer',
  useRovingFocus: 'use-roving-focus',
  useScrollLock: 'use-scroll-lock',
  useSessionStorage: 'use-session-storage',
  useThrottle: 'use-throttle',
};
