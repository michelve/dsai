import { BadgeBase } from './Badge';
import { BadgeWrapper } from './BadgeWrapper';

/**
 * Badge compound component with Wrapper sub-component.
 *
 * @example
 * ```tsx
 * <Badge variant="primary">New</Badge>
 *
 * <Badge.Wrapper>
 *   <MailIcon />
 *   <Badge variant="danger" pill>4</Badge>
 * </Badge.Wrapper>
 * ```
 */
export const Badge = Object.assign(BadgeBase, {
  Wrapper: BadgeWrapper,
});

export { BadgeWrapper } from './BadgeWrapper';
export type {
  BadgeAppearance,
  BadgeOverlap,
  BadgePlacement,
  BadgeProps,
  BadgeSize,
  BadgeVariant,
  BadgeWrapperProps,
} from './Badge.types';
