/**
 * Typography Component
 *
 * A comprehensive typography system with semantic heading, display,
 * and text components following Bootstrap 5 design tokens.
 *
 * @example
 * ```tsx
 * import { Typography, Heading, Display, Text } from '@dsai-io/react';
 *
 * // Using namespace
 * <Typography.Heading level={1}>Title</Typography.Heading>
 * <Typography.Display size={2}>Hero</Typography.Display>
 * <Typography.Text variant="lead">Lead text</Typography.Text>
 *
 * // Or import directly
 * <Heading level={1}>Title</Heading>
 * <Display size={2}>Hero</Display>
 * <Text variant="lead">Lead text</Text>
 * ```
 *
 * @module Typography
 */

// Components
export { Display, Heading, Text, Typography } from './Typography';

// Types
export type {
  DisplayProps,
  DisplaySize,
  FontWeight,
  HeadingLevel,
  HeadingProps,
  HeadingSize,
  TextAlign,
  TextColor,
  TextProps,
  TextSize,
  TextTransform,
  TextVariant,
  TextWrap,
  TypographyNamespace,
  TypographySafeHTMLAttributes,
} from './Typography.types';
