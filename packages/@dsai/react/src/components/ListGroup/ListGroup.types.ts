import type { SemanticColorVariant } from '../../types';
import type { ReactNode } from 'react';

/**
 * ListGroup variant styling
 */
export type ListGroupVariant = 'default' | 'flush' | 'numbered';

/**
 * ListGroupItem color variant
 * @see SemanticColorVariant
 */
export type ListGroupItemVariant = SemanticColorVariant;

/**
 * ListGroupItem data for items prop
 */
export interface ListGroupItemData {
  /**
   * Unique identifier
   */
  id?: string;

  /**
   * Item content
   */
  content: ReactNode;

  /**
   * Color variant
   */
  variant?: ListGroupItemVariant;

  /**
   * Whether the item is active/selected
   * @default false
   */
  active?: boolean;

  /**
   * Whether the item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Badge content to display on the right
   */
  badge?: ReactNode;

  /**
   * Icon to display on the left
   */
  icon?: ReactNode;

  /**
   * URL for link items
   */
  href?: string;

  /**
   * Click handler
   */
  onClick?: () => void;
}

/**
 * ListGroupItem component props
 */
export interface ListGroupItemProps {
  /**
   * Item content
   */
  children: ReactNode;

  /**
   * Color variant
   */
  variant?: ListGroupItemVariant;

  /**
   * Whether the item is active/selected
   * @default false
   */
  active?: boolean;

  /**
   * Whether the item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Badge content to display on the right
   */
  badge?: ReactNode;

  /**
   * Icon to display on the left
   */
  icon?: ReactNode;

  /**
   * URL for link items
   */
  href?: string;

  /**
   * Click handler (makes item interactive)
   */
  onClick?: () => void;

  /**
   * Render as a specific element
   * @default 'li' (or 'a' if href, 'button' if onClick)
   */
  as?: 'li' | 'a' | 'button' | 'div';

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * Tab index for keyboard navigation
   */
  tabIndex?: number;
}

/**
 * ListGroup container props
 */
export interface ListGroupProps {
  /**
   * List items to render
   */
  items?: ListGroupItemData[];

  /**
   * Children (alternative to items prop)
   */
  children?: ReactNode;

  /**
   * List variant
   * @default 'default'
   */
  variant?: ListGroupVariant;

  /**
   * Horizontal layout
   * @default false
   */
  horizontal?: boolean | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

  /**
   * Render as ordered list (ol) instead of unordered (ul)
   * @default false
   */
  ordered?: boolean;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * ID attribute
   */
  id?: string;

  /**
   * Accessible label
   */
  'aria-label'?: string;

  /**
   * ID of element that labels this list
   */
  'aria-labelledby'?: string;
}
