/**
 * Hand-curated metadata for all DSAi components, hooks, and utilities.
 * The registry builder uses this to know what to scan and how to label items.
 * @module @dsai-io/tools/registry/component-map
 */

import type { RegistryItemType } from './types.js';

// ---------------------------------------------------------------------------
// Registry type constants (S1192)
// ---------------------------------------------------------------------------

const TYPE_UI: RegistryItemType = 'registry:ui';
const TYPE_HOOK: RegistryItemType = 'registry:hook';
const TYPE_UTIL: RegistryItemType = 'registry:util';

// ---------------------------------------------------------------------------
// Category constants (S1192)
// ---------------------------------------------------------------------------

const CAT_DATA_DISPLAY = 'data-display';
const CAT_NAVIGATION = 'navigation';
const CAT_FORMS = 'forms';
const CAT_FEEDBACK = 'feedback';
const CAT_DISCLOSURE = 'disclosure';
const CAT_LAYOUT = 'layout';
const CAT_ACTIONS = 'actions';
const CAT_DOM = 'dom';
const CAT_STATE = 'state';
const CAT_A11Y = 'a11y';
const CAT_TIMING = 'timing';
const CAT_STORAGE = 'storage';
const CAT_PLATFORM = 'platform';
const CAT_FORMATTING = 'formatting';
const CAT_STYLING = 'styling';
const CAT_DATA = 'data';

// ---------------------------------------------------------------------------
// NPM dependency constants (S1192)
// ---------------------------------------------------------------------------

const DEP_FLOATING_UI = '@floating-ui/react';

export interface ComponentMeta {
  type: RegistryItemType;
  title: string;
  description: string;
  categories?: string[];
  npmDependencies?: string[];
}

// ---------------------------------------------------------------------------
// Shared Constants (S1192)
// ---------------------------------------------------------------------------

const TYPE_UI: RegistryItemType = 'registry:ui';
const TYPE_HOOK: RegistryItemType = 'registry:hook';
const TYPE_UTIL: RegistryItemType = 'registry:util';
const FLOATING_UI_REACT = '@floating-ui/react';
const CAT_DATA_DISPLAY = 'data-display';

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

export const componentMap: Record<string, ComponentMeta> = {
  accordion: {
    type: TYPE_UI,
    title: 'Accordion',
    description: 'Collapsible content panels for presenting information in a limited space.',
    categories: [CAT_DISCLOSURE, CAT_LAYOUT],
  },
  alert: {
    type: TYPE_UI,
    title: 'Alert',
    description: 'Contextual feedback messages for user actions.',
    categories: [CAT_FEEDBACK],
  },
  avatar: {
    type: TYPE_UI,
    title: 'Avatar',
    description: 'Graphical representation of a user or entity.',
    categories: [CAT_DATA_DISPLAY],
  },
  badge: {
    type: TYPE_UI,
    title: 'Badge',
    description: 'Small count or status indicator, typically displayed on other elements.',
    categories: [CAT_DATA_DISPLAY],
  },
  breadcrumb: {
    type: TYPE_UI,
    title: 'Breadcrumb',
    description: 'Navigation aid showing the current page location within a hierarchy.',
    categories: [CAT_NAVIGATION],
  },
  button: {
    type: TYPE_UI,
    title: 'Button',
    description: 'Trigger for actions and events.',
    categories: [CAT_ACTIONS],
  },
  card: {
    type: TYPE_UI,
    title: 'Card',
    description: 'Flexible container for grouping related content and actions.',
    categories: ['layout', CAT_DATA_DISPLAY],
  },
  'card-list': {
    type: TYPE_UI,
    title: 'CardList',
    description: 'Responsive list of selectable cards with keyboard navigation.',
    categories: ['layout', CAT_DATA_DISPLAY],
  },
  carousel: {
    type: TYPE_UI,
    title: 'Carousel',
    description: 'Slideshow component for cycling through content.',
    categories: [CAT_DATA_DISPLAY],
  },
  checkbox: {
    type: TYPE_UI,
    title: 'Checkbox',
    description: 'Toggle control for boolean selections.',
    categories: [CAT_FORMS],
  },
  'checkbox-group': {
    type: TYPE_UI,
    title: 'CheckboxGroup',
    description: 'Managed group of checkboxes with shared state.',
    categories: [CAT_FORMS],
  },
  dropdown: {
    type: TYPE_UI,
    title: 'Dropdown',
    description: 'Toggleable overlay menu for displaying a list of actions.',
    categories: ['navigation', 'actions'],
    npmDependencies: [FLOATING_UI_REACT],
  },
  icon: {
    type: TYPE_UI,
    title: 'Icon',
    description: 'Scalable vector icon component with accessibility support.',
    categories: [CAT_DATA_DISPLAY],
  },
  input: {
    type: TYPE_UI,
    title: 'Input',
    description: 'Text input field with validation and formatting support.',
    categories: [CAT_FORMS],
  },
  'list-group': {
    type: TYPE_UI,
    title: 'ListGroup',
    description: 'Flexible component for displaying a series of items.',
    categories: [CAT_DATA_DISPLAY, 'navigation'],
  },
  modal: {
    type: TYPE_UI,
    title: 'Modal',
    description: 'Dialog overlay for focused content and user interactions.',
    categories: [CAT_FEEDBACK, CAT_DISCLOSURE],
  },
  navbar: {
    type: TYPE_UI,
    title: 'Navbar',
    description: 'Responsive navigation header with branding and links.',
    categories: [CAT_NAVIGATION],
  },
  pagination: {
    type: TYPE_UI,
    title: 'Pagination',
    description: 'Navigation controls for paged content.',
    categories: [CAT_NAVIGATION],
  },
  popover: {
    type: TYPE_UI,
    title: 'Popover',
    description: 'Floating content panel anchored to a trigger element.',
    categories: ['disclosure'],
    npmDependencies: [FLOATING_UI_REACT],
  },
  progress: {
    type: TYPE_UI,
    title: 'Progress',
    description: 'Visual indicator of task completion.',
    categories: [CAT_FEEDBACK],
  },
  radio: {
    type: TYPE_UI,
    title: 'Radio',
    description: 'Single-select control within a group of options.',
    categories: [CAT_FORMS],
  },
  scrollspy: {
    type: TYPE_UI,
    title: 'Scrollspy',
    description: 'Automatically highlights navigation links based on scroll position.',
    categories: [CAT_NAVIGATION],
  },
  select: {
    type: TYPE_UI,
    title: 'Select',
    description: 'Dropdown selector for choosing from a list of options.',
    categories: ['forms'],
    npmDependencies: [FLOATING_UI_REACT],
  },
  'selectable-card': {
    type: TYPE_UI,
    title: 'SelectableCard',
    description: 'Card variant that acts as a selectable option.',
    categories: ['forms', CAT_DATA_DISPLAY],
  },
  sheet: {
    type: TYPE_UI,
    title: 'Sheet',
    description: 'Sliding panel overlay from screen edges.',
    categories: [CAT_DISCLOSURE, CAT_LAYOUT],
  },
  spinner: {
    type: TYPE_UI,
    title: 'Spinner',
    description: 'Loading indicator for asynchronous operations.',
    categories: [CAT_FEEDBACK],
  },
  switch: {
    type: TYPE_UI,
    title: 'Switch',
    description: 'Toggle control for binary on/off states.',
    categories: [CAT_FORMS],
  },
  table: {
    type: TYPE_UI,
    title: 'Table',
    description: 'Data table with sorting, selection, and responsive layout.',
    categories: [CAT_DATA_DISPLAY],
  },
  tabs: {
    type: TYPE_UI,
    title: 'Tabs',
    description: 'Tabbed interface for switching between content panels.',
    categories: [CAT_NAVIGATION, CAT_LAYOUT],
  },
  'tabs-pro': {
    type: TYPE_UI,
    title: 'TabsPro',
    description: 'Advanced tabbed interface with closable, sortable, and overflow support.',
    categories: [CAT_NAVIGATION, CAT_LAYOUT],
  },
  toast: {
    type: TYPE_UI,
    title: 'Toast',
    description: 'Brief notification messages that auto-dismiss.',
    categories: [CAT_FEEDBACK],
  },
  tooltip: {
    type: TYPE_UI,
    title: 'Tooltip',
    description: 'Informational popup displayed on hover or focus.',
    categories: [CAT_DATA_DISPLAY],
    npmDependencies: [FLOATING_UI_REACT],
  },
  typography: {
    type: TYPE_UI,
    title: 'Typography',
    description: 'Text rendering primitives with semantic variants.',
    categories: [CAT_DATA_DISPLAY],
  },
};

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export const hookMap: Record<string, ComponentMeta> = {
  'use-async': {
    type: TYPE_HOOK,
    title: 'useAsync',
    description: 'Manages async operation lifecycle (loading, error, data states).',
    categories: [CAT_STATE],
  },
  'use-callback-ref': {
    type: TYPE_HOOK,
    title: 'useCallbackRef',
    description: 'Stable callback reference that always points to the latest function.',
    categories: ['refs'],
  },
  'use-click-outside': {
    type: TYPE_HOOK,
    title: 'useClickOutside',
    description: 'Detects clicks outside of a target element.',
    categories: [CAT_DOM],
  },
  'use-controllable-state': {
    type: TYPE_HOOK,
    title: 'useControllableState',
    description: 'Manages state that can be either controlled or uncontrolled.',
    categories: [CAT_STATE],
  },
  'use-dark-mode': {
    type: TYPE_HOOK,
    title: 'useDarkMode',
    description: 'Detects and toggles dark mode preference.',
    categories: ['theme'],
  },
  'use-debounce': {
    type: TYPE_HOOK,
    title: 'useDebounce',
    description: 'Debounces a value or callback over a specified delay.',
    categories: [CAT_TIMING],
  },
  'use-field': {
    type: TYPE_HOOK,
    title: 'useField',
    description: 'Form field state management with validation.',
    categories: [CAT_FORMS],
  },
  'use-focus-trap': {
    type: TYPE_HOOK,
    title: 'useFocusTrap',
    description: 'Traps keyboard focus within a container for modal-like experiences.',
    categories: [CAT_A11Y],
  },
  'use-form': {
    type: TYPE_HOOK,
    title: 'useForm',
    description: 'Comprehensive form state management with validation.',
    categories: [CAT_FORMS],
  },
  'use-hover': {
    type: TYPE_HOOK,
    title: 'useHover',
    description: 'Tracks hover state of an element with enter/leave delays.',
    categories: [CAT_DOM],
  },
  'use-id': {
    type: TYPE_HOOK,
    title: 'useId',
    description: 'Generates stable unique identifiers for accessibility attributes.',
    categories: [CAT_A11Y],
  },
  'use-intersection-observer': {
    type: TYPE_HOOK,
    title: 'useIntersectionObserver',
    description: 'Observes element visibility within the viewport.',
    categories: [CAT_DOM],
  },
  'use-key-press': {
    type: TYPE_HOOK,
    title: 'useKeyPress',
    description: 'Listens for specific keyboard key presses.',
    categories: [CAT_DOM],
  },
  'use-local-storage': {
    type: TYPE_HOOK,
    title: 'useLocalStorage',
    description: 'Persists state to localStorage with serialization.',
    categories: [CAT_STATE, CAT_STORAGE],
  },
  'use-media-query': {
    type: TYPE_HOOK,
    title: 'useMediaQuery',
    description: 'Matches CSS media queries and provides responsive breakpoint helpers.',
    categories: ['responsive'],
  },
  'use-mounted': {
    type: TYPE_HOOK,
    title: 'useMounted',
    description: 'Tracks whether the component is currently mounted.',
    categories: ['lifecycle'],
  },
  'use-previous': {
    type: TYPE_HOOK,
    title: 'usePrevious',
    description: 'Returns the previous value of a variable across renders.',
    categories: [CAT_STATE],
  },
  'use-reduced-motion': {
    type: TYPE_HOOK,
    title: 'useReducedMotion',
    description: 'Detects user preference for reduced motion.',
    categories: [CAT_A11Y],
  },
  'use-resize-observer': {
    type: TYPE_HOOK,
    title: 'useResizeObserver',
    description: 'Observes element size changes via ResizeObserver.',
    categories: [CAT_DOM],
  },
  'use-roving-focus': {
    type: TYPE_HOOK,
    title: 'useRovingFocus',
    description: 'Implements roving tabindex pattern for composite widgets.',
    categories: [CAT_A11Y],
  },
  'use-scroll-lock': {
    type: TYPE_HOOK,
    title: 'useScrollLock',
    description: 'Prevents body scrolling while active (for modals/overlays).',
    categories: [CAT_DOM],
  },
  'use-session-storage': {
    type: TYPE_HOOK,
    title: 'useSessionStorage',
    description: 'Persists state to sessionStorage with serialization.',
    categories: [CAT_STATE, CAT_STORAGE],
  },
  'use-throttle': {
    type: TYPE_HOOK,
    title: 'useThrottle',
    description: 'Throttles a value or callback to fire at most once per interval.',
    categories: [CAT_TIMING],
  },
};

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

export const utilMap: Record<string, ComponentMeta> = {
  cn: {
    type: TYPE_UTIL,
    title: 'cn',
    description: 'Conditional class name composition utility.',
    categories: [CAT_STYLING],
  },
  a11y: {
    type: TYPE_UTIL,
    title: 'a11y',
    description: 'Accessibility utilities including screen reader announcements and ARIA helpers.',
    categories: [CAT_A11Y],
  },
  async: {
    type: TYPE_UTIL,
    title: 'async',
    description: 'Async operation utilities: abortable tasks, queues, exponential backoff.',
    categories: ['async'],
  },
  browser: {
    type: TYPE_UTIL,
    title: 'browser',
    description: 'Browser environment detection and feature checks.',
    categories: [CAT_PLATFORM],
  },
  collections: {
    type: TYPE_UTIL,
    title: 'collections',
    description: 'Collection utilities: chunk, paginate, memoize, selectors.',
    categories: [CAT_DATA],
  },
  color: {
    type: TYPE_UTIL,
    title: 'color',
    description: 'Color manipulation utilities: contrast, luminance, hex/rgb conversion.',
    categories: [CAT_STYLING],
  },
  date: {
    type: TYPE_UTIL,
    title: 'date',
    description: 'Date formatting and relative time utilities.',
    categories: [CAT_FORMATTING],
  },
  'merge-refs': {
    type: TYPE_UTIL,
    title: 'mergeRefs',
    description: 'Merges multiple React refs into a single callback ref.',
    categories: ['refs'],
  },
  dx: {
    type: TYPE_UTIL,
    title: 'dx',
    description: 'Developer experience helpers: component creation, context factories, polymorphic patterns.',
    categories: ['dx'],
  },
  forms: {
    type: TYPE_UTIL,
    title: 'forms',
    description: 'Form utilities: validators, field error extraction, dirty checking.',
    categories: [CAT_FORMS],
  },
  keyboard: {
    type: TYPE_UTIL,
    title: 'keyboard',
    description: 'Keyboard event helpers for detecting specific keys.',
    categories: [CAT_DOM],
  },
  layout: {
    type: TYPE_UTIL,
    title: 'layout',
    description: 'Layout measurement utilities: element bounds, viewport size, resize observation.',
    categories: [CAT_DOM],
  },
  misc: {
    type: TYPE_UTIL,
    title: 'misc',
    description: 'Miscellaneous utilities: clear icon, safe input props, event helpers.',
    categories: ['misc'],
  },
  motion: {
    type: TYPE_UTIL,
    title: 'motion',
    description: 'Animation utilities: spring physics, easing functions, distance calculations.',
    categories: ['animation'],
  },
  number: {
    type: TYPE_UTIL,
    title: 'number',
    description: 'Number formatting and clamping utilities.',
    categories: [CAT_FORMATTING],
  },
  object: {
    type: TYPE_UTIL,
    title: 'object',
    description: 'Object manipulation utilities: deep merge, pick, omit.',
    categories: [CAT_DATA],
  },
  platform: {
    type: TYPE_UTIL,
    title: 'platform',
    description: 'Platform detection utilities: browser, OS, device pixel ratio, text direction.',
    categories: [CAT_PLATFORM],
  },
  responsive: {
    type: TYPE_UTIL,
    title: 'responsive',
    description: 'Responsive design utilities.',
    categories: ['responsive'],
  },
  safety: {
    type: TYPE_UTIL,
    title: 'safety',
    description: 'Security utilities: clipboard access, crypto ID generation, token generation.',
    categories: ['security'],
  },
  string: {
    type: TYPE_UTIL,
    title: 'string',
    description: 'String manipulation utilities: capitalize, slugify, variant classes.',
    categories: [CAT_FORMATTING],
  },
  telemetry: {
    type: TYPE_UTIL,
    title: 'telemetry',
    description: 'Telemetry utilities: error catching, performance measurement, timing.',
    categories: ['observability'],
  },
  timing: {
    type: TYPE_UTIL,
    title: 'timing',
    description: 'Timing utilities: debounce and throttle functions.',
    categories: [CAT_TIMING],
  },
  types: {
    type: TYPE_UTIL,
    title: 'types',
    description: 'Shared type guards and type utilities.',
    categories: ['types'],
  },
  validation: {
    type: TYPE_UTIL,
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
