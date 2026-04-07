/**
 * @fileoverview Zod schemas for Style Dictionary token format
 * @see https://amzn.github.io/style-dictionary/
 */

import { z } from 'zod';

/**
 * Style Dictionary token attributes
 */
export const styleDictionaryAttributesSchema = z
  .object({
    category: z.string().optional(),
    type: z.string().optional(),
    item: z.string().optional(),
    subitem: z.string().optional(),
    state: z.string().optional(),
  })
  .loose();

/**
 * Style Dictionary token (legacy format - uses "value" not "$value")
 */
export const styleDictionaryTokenSchema = z
  .object({
    value: z.unknown(),
    type: z.string().optional(),
    comment: z.string().optional(),
    themeable: z.boolean().optional(),
    attributes: styleDictionaryAttributesSchema.optional(),
    name: z.string().optional(),
    path: z.array(z.string()).optional(),
    original: z
      .object({
        value: z.unknown(),
      })
      .loose()
      .optional(),
    filePath: z.string().optional(),
    isSource: z.boolean().optional(),
  })
  .loose();

/**
 * Style Dictionary token or group (recursive)
 */
export const styleDictionaryTokenOrGroupSchema: z.ZodType<StyleDictionaryTokenOrGroup> = z.lazy(
  () =>
    z.union([styleDictionaryTokenSchema, z.record(z.string(), styleDictionaryTokenOrGroupSchema)])
);

export type StyleDictionaryTokenOrGroup =
  | z.infer<typeof styleDictionaryTokenSchema>
  | { [key: string]: StyleDictionaryTokenOrGroup };

/**
 * Style Dictionary tokens collection
 */
export const styleDictionaryTokensSchema = z.record(z.string(), styleDictionaryTokenOrGroupSchema);

export type StyleDictionaryTokens = z.infer<typeof styleDictionaryTokensSchema>;

/**
 * Style Dictionary config source
 */
export const styleDictionarySourceSchema = z.union([z.string(), z.array(z.string())]);

/**
 * Style Dictionary platform config
 */
export const styleDictionaryPlatformSchema = z
  .object({
    transformGroup: z.string().optional(),
    transforms: z.array(z.string()).optional(),
    buildPath: z.string().optional(),
    files: z
      .array(
        z
          .object({
            destination: z.string(),
            format: z.string(),
            filter: z.function().optional(),
            options: z.record(z.string(), z.unknown()).optional(),
          })
          .loose()
      )
      .optional(),
    actions: z.array(z.string()).optional(),
  })
  .loose();

/**
 * Style Dictionary config
 */
export const styleDictionaryConfigSchema = z
  .object({
    source: styleDictionarySourceSchema.optional(),
    include: styleDictionarySourceSchema.optional(),
    platforms: z.record(z.string(), styleDictionaryPlatformSchema).optional(),
    hooks: z
      .object({
        parsers: z.record(z.string(), z.function()).optional(),
        preprocessors: z.record(z.string(), z.function()).optional(),
        transformGroups: z.record(z.string(), z.array(z.string())).optional(),
        transforms: z.record(z.string(), z.function()).optional(),
        formats: z.record(z.string(), z.function()).optional(),
        filters: z.record(z.string(), z.function()).optional(),
        fileHeaders: z.record(z.string(), z.function()).optional(),
        actions: z.record(z.string(), z.function()).optional(),
      })
      .optional(),
    log: z
      .object({
        warnings: z.enum(['warn', 'error', 'disabled']).optional(),
        verbosity: z.enum(['default', 'silent', 'verbose']).optional(),
        errors: z
          .object({
            brokenReferences: z.enum(['throw', 'console']).optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .loose();

export type StyleDictionaryConfig = z.infer<typeof styleDictionaryConfigSchema>;

/**
 * Style Dictionary input file format
 */
export const styleDictionaryInputSchema = styleDictionaryTokensSchema;

export type StyleDictionaryInput = z.infer<typeof styleDictionaryInputSchema>;
