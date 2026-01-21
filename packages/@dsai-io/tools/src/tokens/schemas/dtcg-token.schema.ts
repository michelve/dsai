/**
 * @fileoverview Zod schemas for DTCG (Design Tokens Community Group) token format
 * @see https://design-tokens.github.io/community-group/format/
 */

import { z } from 'zod';

/**
 * DTCG token types as specified in the DTCG specification
 */
export const tokenTypeSchema = z.enum([
  'color',
  'dimension',
  'fontFamily',
  'fontWeight',
  'duration',
  'cubicBezier',
  'number',
  'string',
  'shadow',
  'typography',
  'transition',
  'strokeStyle',
  'border',
  'gradient',
]);

export type TokenType = z.infer<typeof tokenTypeSchema>;

/**
 * DTCG color value (can be hex string or object)
 */
export const colorValueSchema = z.union([
  z.string().regex(/^#[0-9A-Fa-f]{3,8}$/),
  z.string().regex(/^rgba?\(/),
  z.string().regex(/^hsla?\(/),
  z.object({
    r: z.number().min(0).max(1),
    g: z.number().min(0).max(1),
    b: z.number().min(0).max(1),
    a: z.number().min(0).max(1).optional(),
  }),
]);

/**
 * DTCG dimension value (number with unit)
 */
export const dimensionValueSchema = z.union([
  z.string().regex(/^-?\d+\.?\d*px$/),
  z.string().regex(/^-?\d+\.?\d*rem$/),
  z.string().regex(/^-?\d+\.?\d*em$/),
  z.string().regex(/^-?\d+\.?\d*%$/),
  z.string().regex(/^-?\d+\.?\d*vh$/),
  z.string().regex(/^-?\d+\.?\d*vw$/),
  z.string().regex(/^-?\d+\.?\d*pt$/),
  z.number(),
]);

/**
 * DTCG duration value (time with unit)
 */
export const durationValueSchema = z.union([
  z.string().regex(/^\d+\.?\d*ms$/),
  z.string().regex(/^\d+\.?\d*s$/),
]);

/**
 * DTCG cubic bezier value
 */
export const cubicBezierValueSchema = z.tuple([
  z.number().min(0).max(1),
  z.number(),
  z.number().min(0).max(1),
  z.number(),
]);

/**
 * DTCG shadow value
 */
export const shadowValueSchema = z.object({
  color: colorValueSchema,
  offsetX: dimensionValueSchema,
  offsetY: dimensionValueSchema,
  blur: dimensionValueSchema,
  spread: dimensionValueSchema.optional(),
  inset: z.boolean().optional(),
});

/**
 * DTCG typography value
 */
export const typographyValueSchema = z.object({
  fontFamily: z.union([z.string(), z.array(z.string())]),
  fontSize: dimensionValueSchema,
  fontWeight: z.union([z.number().int().min(1).max(1000), z.string()]),
  lineHeight: z.union([dimensionValueSchema, z.number()]),
  letterSpacing: dimensionValueSchema.optional(),
  textTransform: z.enum(['none', 'uppercase', 'lowercase', 'capitalize']).optional(),
  textDecoration: z.enum(['none', 'underline', 'overline', 'line-through']).optional(),
});

/**
 * DTCG stroke style value
 */
export const strokeStyleValueSchema = z.union([
  z.enum(['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset']),
  z.object({
    dashArray: z.array(dimensionValueSchema),
    lineCap: z.enum(['round', 'butt', 'square']).optional(),
  }),
]);

/**
 * DTCG border value
 */
export const borderValueSchema = z.object({
  color: colorValueSchema,
  width: dimensionValueSchema,
  style: strokeStyleValueSchema,
});

/**
 * DTCG gradient stop
 */
export const gradientStopSchema = z.object({
  color: colorValueSchema,
  position: z.number().min(0).max(1),
});

/**
 * DTCG gradient value
 */
export const gradientValueSchema = z.array(gradientStopSchema);

/**
 * Token alias/reference (e.g., "{colors.primary}")
 */
export const tokenReferenceSchema = z.string().regex(/^\{[^}]+\}$/);

/**
 * Base DTCG token structure
 */
export const dtcgTokenBaseSchema = z.object({
  $value: z.unknown(),
  $type: tokenTypeSchema.optional(),
  $description: z.string().optional(),
  $extensions: z.record(z.string(), z.unknown()).optional(),
});

export type DTCGTokenBase = z.infer<typeof dtcgTokenBaseSchema>;

/**
 * DTCG color token
 */
export const dtcgColorTokenSchema = dtcgTokenBaseSchema.extend({
  $type: z.literal('color').optional(),
  $value: z.union([colorValueSchema, tokenReferenceSchema]),
});

/**
 * DTCG dimension token
 */
export const dtcgDimensionTokenSchema = dtcgTokenBaseSchema.extend({
  $type: z.literal('dimension').optional(),
  $value: z.union([dimensionValueSchema, tokenReferenceSchema]),
});

/**
 * DTCG font family token
 */
export const dtcgFontFamilyTokenSchema = dtcgTokenBaseSchema.extend({
  $type: z.literal('fontFamily').optional(),
  $value: z.union([z.string(), z.array(z.string()), tokenReferenceSchema]),
});

/**
 * DTCG font weight token
 */
export const dtcgFontWeightTokenSchema = dtcgTokenBaseSchema.extend({
  $type: z.literal('fontWeight').optional(),
  $value: z.union([
    z.number().int().min(1).max(1000),
    z.enum(['thin', 'light', 'regular', 'medium', 'semibold', 'bold', 'extrabold', 'black']),
    tokenReferenceSchema,
  ]),
});

/**
 * DTCG duration token
 */
export const dtcgDurationTokenSchema = dtcgTokenBaseSchema.extend({
  $type: z.literal('duration').optional(),
  $value: z.union([durationValueSchema, tokenReferenceSchema]),
});

/**
 * DTCG cubic bezier token
 */
export const dtcgCubicBezierTokenSchema = dtcgTokenBaseSchema.extend({
  $type: z.literal('cubicBezier').optional(),
  $value: z.union([cubicBezierValueSchema, tokenReferenceSchema]),
});

/**
 * DTCG number token
 */
export const dtcgNumberTokenSchema = dtcgTokenBaseSchema.extend({
  $type: z.literal('number').optional(),
  $value: z.union([z.number(), tokenReferenceSchema]),
});

/**
 * DTCG string token
 */
export const dtcgStringTokenSchema = dtcgTokenBaseSchema.extend({
  $type: z.literal('string').optional(),
  $value: z.union([z.string(), tokenReferenceSchema]),
});

/**
 * DTCG shadow token
 */
export const dtcgShadowTokenSchema = dtcgTokenBaseSchema.extend({
  $type: z.literal('shadow').optional(),
  $value: z.union([
    shadowValueSchema,
    z.array(shadowValueSchema), // Multiple shadows
    tokenReferenceSchema,
  ]),
});

/**
 * DTCG typography token
 */
export const dtcgTypographyTokenSchema = dtcgTokenBaseSchema.extend({
  $type: z.literal('typography').optional(),
  $value: z.union([typographyValueSchema, tokenReferenceSchema]),
});

/**
 * DTCG stroke style token
 */
export const dtcgStrokeStyleTokenSchema = dtcgTokenBaseSchema.extend({
  $type: z.literal('strokeStyle').optional(),
  $value: z.union([strokeStyleValueSchema, tokenReferenceSchema]),
});

/**
 * DTCG border token
 */
export const dtcgBorderTokenSchema = dtcgTokenBaseSchema.extend({
  $type: z.literal('border').optional(),
  $value: z.union([borderValueSchema, tokenReferenceSchema]),
});

/**
 * DTCG gradient token
 */
export const dtcgGradientTokenSchema = dtcgTokenBaseSchema.extend({
  $type: z.literal('gradient').optional(),
  $value: z.union([gradientValueSchema, tokenReferenceSchema]),
});

/**
 * Union of all specific DTCG token schemas
 */
export const dtcgTypedTokenSchema = z.union([
  dtcgColorTokenSchema,
  dtcgDimensionTokenSchema,
  dtcgFontFamilyTokenSchema,
  dtcgFontWeightTokenSchema,
  dtcgDurationTokenSchema,
  dtcgCubicBezierTokenSchema,
  dtcgNumberTokenSchema,
  dtcgStringTokenSchema,
  dtcgShadowTokenSchema,
  dtcgTypographyTokenSchema,
  dtcgStrokeStyleTokenSchema,
  dtcgBorderTokenSchema,
  dtcgGradientTokenSchema,
]);

/**
 * Generic DTCG token (allows any token or group)
 */
export const dtcgTokenSchema: z.ZodType<DTCGTokenOrGroup> = z.lazy(() =>
  z.union([dtcgTokenBaseSchema, z.record(z.string(), dtcgTokenSchema)])
);

export type DTCGTokenOrGroup = DTCGTokenBase | { [key: string]: DTCGTokenOrGroup };

/**
 * DTCG token collection (root level)
 */
export const dtcgTokenCollectionSchema = z.record(z.string(), dtcgTokenSchema);

export type DTCGTokenCollection = z.infer<typeof dtcgTokenCollectionSchema>;

/**
 * DTCG file format with optional metadata
 */
export const dtcgFileSchema = z
  .object({
    $schema: z.string().optional(),
    $description: z.string().optional(),
    $extensions: z.record(z.string(), z.unknown()).optional(),
  })
  .catchall(dtcgTokenSchema);

export type DTCGFile = z.infer<typeof dtcgFileSchema>;
