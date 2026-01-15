/**
 * DSAi React - Centralized Type System
 *
 * Shared type primitives for component development.
 * Reduces duplication and ensures consistency across the design system.
 *
 * This module provides core type definitions that are used across multiple
 * components, eliminating duplication and establishing a single source of truth
 * for design system primitives.
 *
 * @module @dsai-io/react/types
 *
 * @example
 * ```typescript
 * // Import from types module
 * import type { SemanticColorVariant, ComponentSize } from '@dsai-io/react/types';
 *
 * // Or from main package (after export updates)
 * import type { SemanticColorVariant } from '@dsai-io/react';
 *
 * // Use in component types
 * interface AlertProps {
 *   variant?: SemanticColorVariant;
 *   size?: ComponentSize;
 * }
 * ```
 */

// =============================================================================
// Core Primitives
// =============================================================================

export type {
  Alignment,
  ComponentSize,
  ExtendedSize,
  FeedbackVariant,
  Orientation,
  SemanticColorVariant,
} from './primitives';

// =============================================================================
// Accessibility & Security
// =============================================================================

export type { ARIAProps, SafeHTMLAttributes } from './accessibility';

// =============================================================================
// State Machines
// =============================================================================

export type { FSMConfig, FSMEventBase, FSMReducer, FSMStateBase, VisualStateBase } from './fsm';

// =============================================================================
// Polymorphic Components
// =============================================================================

export type { PolymorphicComponentProps, PolymorphicProps, PolymorphicRef } from './polymorphic';

// =============================================================================
// Responsive Values
// =============================================================================

export type { Breakpoint, ResponsiveProp, ResponsiveValue } from './responsive';

/**
 * @deprecated Import runtime helpers from `@dsai-io/react/utils/responsive` to keep the types barrel type-only.
 */
export { getResponsiveValue, isResponsiveValue } from './responsive';
