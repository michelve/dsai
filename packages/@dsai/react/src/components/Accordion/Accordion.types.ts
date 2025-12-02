import type { CSSProperties, KeyboardEvent, MouseEvent, ReactNode } from 'react';

/**
 * Accordion selection mode
 * - 'single': Only one item can be expanded at a time (default Bootstrap behavior)
 * - 'multiple': Multiple items can be expanded simultaneously ("Always open" in Bootstrap)
 */
export type AccordionSelectionMode = 'single' | 'multiple';

/**
 * Accordion flush variant
 * - false: Default accordion with borders and rounded corners
 * - true: Flush accordion that renders edge-to-edge with parent container
 */
export type AccordionFlush = boolean;

/**
 * Safe HTML attributes that can be spread onto accordion elements
 * SECURITY: This whitelist prevents injection of dangerous attributes or event handlers
 */
export interface SafeAccordionHTMLAttributes {
  /** Additional CSS class names */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** ID attribute */
  id?: string;
  /** Data attribute for testing */
  'data-testid'?: string;
  /** Data attribute for testing */
  'data-test'?: string;
}

/**
 * Accordion component props
 *
 * The main container component that manages accordion state and coordinates
 * item expansion/collapse behavior.
 *
 * ACCESSIBILITY FEATURES (WCAG 2.2 AA):
 * - Each accordion button is a `<button>` element
 * - aria-expanded on buttons indicates current state
 * - aria-controls links button to its panel
 * - Panel has role="region" and aria-labelledby
 * - Keyboard navigation (Tab, Enter, Space)
 *
 * SECURITY FEATURES:
 * - Prop whitelisting (no unrestricted spread)
 * - Explicit event handlers only
 *
 * @example
 * ```tsx
 * // Basic accordion (single mode - one at a time)
 * <Accordion>
 *   <Accordion.Item eventKey="0">
 *     <Accordion.Button>Section 1</Accordion.Button>
 *     <Accordion.Panel>Content for section 1</Accordion.Panel>
 *   </Accordion.Item>
 *   <Accordion.Item eventKey="1">
 *     <Accordion.Button>Section 2</Accordion.Button>
 *     <Accordion.Panel>Content for section 2</Accordion.Panel>
 *   </Accordion.Item>
 * </Accordion>
 *
 * // Multiple mode (multiple panels can be open)
 * <Accordion selectionMode="multiple" defaultActiveKeys={['0', '1']}>
 *   <Accordion.Item eventKey="0">
 *     <Accordion.Button>Section 1</Accordion.Button>
 *     <Accordion.Panel>Content for section 1</Accordion.Panel>
 *   </Accordion.Item>
 *   <Accordion.Item eventKey="1">
 *     <Accordion.Button>Section 2</Accordion.Button>
 *     <Accordion.Panel>Content for section 2</Accordion.Panel>
 *   </Accordion.Item>
 * </Accordion>
 *
 * // Controlled accordion
 * const [activeKeys, setActiveKeys] = useState<string[]>(['0']);
 * <Accordion activeKeys={activeKeys} onActiveKeysChange={setActiveKeys}>
 *   ...
 * </Accordion>
 * ```
 */
export interface AccordionProps extends SafeAccordionHTMLAttributes {
  /**
   * Accordion items (AccordionItem components)
   */
  children: ReactNode;

  /**
   * Selection mode for the accordion
   * - 'single': Only one item can be expanded at a time (default)
   * - 'multiple': Multiple items can be expanded simultaneously
   * @default 'single'
   */
  selectionMode?: AccordionSelectionMode;

  /**
   * Controlled active keys
   * Array of eventKey values for currently expanded items
   * If provided, accordion becomes controlled
   */
  activeKeys?: string[];

  /**
   * Callback when active keys change
   * Required when activeKeys is provided (controlled mode)
   */
  onActiveKeysChange?: (activeKeys: string[]) => void;

  /**
   * Default active keys for uncontrolled mode
   * Array of eventKey values for initially expanded items
   * @default []
   */
  defaultActiveKeys?: string[];

  /**
   * Whether to render in flush mode (edge-to-edge)
   * Removes borders and rounded corners
   * @default false
   */
  flush?: AccordionFlush;

  /**
   * Callback when an item is expanded
   * @param eventKey - The eventKey of the expanded item
   */
  onItemExpand?: (eventKey: string) => void;

  /**
   * Callback when an item is collapsed
   * @param eventKey - The eventKey of the collapsed item
   */
  onItemCollapse?: (eventKey: string) => void;
}

/**
 * Accordion.Item component props
 *
 * Container for an individual accordion section containing a button and panel.
 *
 * @example
 * ```tsx
 * <Accordion.Item eventKey="0">
 *   <Accordion.Button>Section Title</Accordion.Button>
 *   <Accordion.Panel>Section Content</Accordion.Panel>
 * </Accordion.Item>
 * ```
 */
export interface AccordionItemProps extends SafeAccordionHTMLAttributes {
  /**
   * Item content (AccordionButton and AccordionPanel)
   */
  children: ReactNode;

  /**
   * Unique identifier for this item
   * Used to track which items are expanded
   */
  eventKey: string;

  /**
   * Whether this item is disabled
   * Disabled items cannot be expanded/collapsed
   * @default false
   */
  disabled?: boolean;
}

/**
 * Accordion.Button component props
 *
 * The clickable header/trigger that expands/collapses the accordion panel.
 * Renders as a semantic `<button>` element with proper ARIA attributes.
 *
 * @example
 * ```tsx
 * // Basic button
 * <Accordion.Button>Section Title</Accordion.Button>
 *
 * // Button with custom content
 * <Accordion.Button>
 *   <span>Title</span>
 *   <Badge>3</Badge>
 * </Accordion.Button>
 * ```
 */
export interface AccordionButtonProps extends SafeAccordionHTMLAttributes {
  /**
   * Button content (typically text or a header)
   */
  children: ReactNode;

  /**
   * Click event handler
   * Called when the button is clicked (after internal toggle logic)
   */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;

  /**
   * Keyboard event handler
   * Called when a key is pressed on the button
   */
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

/**
 * Accordion.Panel component props
 *
 * The collapsible content area of an accordion item.
 * Uses CSS transitions for smooth expand/collapse animations.
 *
 * @example
 * ```tsx
 * <Accordion.Panel>
 *   <p>This is the content that will be shown/hidden.</p>
 *   <p>It can contain any React content.</p>
 * </Accordion.Panel>
 * ```
 */
export interface AccordionPanelProps extends SafeAccordionHTMLAttributes {
  /**
   * Panel content
   */
  children: ReactNode;
}

/**
 * Accordion context value for sharing state between components
 */
export interface AccordionContextValue {
  /** Array of currently active (expanded) eventKeys */
  activeKeys: string[];
  /** Toggle an item's expanded state */
  toggleItem: (eventKey: string) => void;
  /** Selection mode */
  selectionMode: AccordionSelectionMode;
  /** Whether accordion is in flush mode */
  flush: boolean;
}

/**
 * AccordionItem context value for sharing item-level state
 */
export interface AccordionItemContextValue {
  /** This item's eventKey */
  eventKey: string;
  /** Whether this item is currently expanded */
  isExpanded: boolean;
  /** Whether this item is disabled */
  disabled: boolean;
  /** Generated button ID for aria-labelledby */
  buttonId: string;
  /** Generated panel ID for aria-controls */
  panelId: string;
}

/**
 * Visual state for FSM and data-visual-state attribute
 */
export type AccordionItemVisualState = 'collapsed' | 'expanding' | 'expanded' | 'collapsing';
