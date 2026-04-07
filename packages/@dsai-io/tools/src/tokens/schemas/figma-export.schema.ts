/**
 * @fileoverview Zod schemas for Figma token export format
 * Validates the structure of tokens exported from Figma Variables API
 */

import { z } from 'zod';

/**
 * Figma color value (RGBA object)
 */
export const figmaColorSchema = z.object({
  r: z.number().min(0).max(1),
  g: z.number().min(0).max(1),
  b: z.number().min(0).max(1),
  a: z.number().min(0).max(1),
});

/**
 * Figma variable alias reference
 */
export const figmaAliasSchema = z.object({
  type: z.literal('VARIABLE_ALIAS'),
  id: z.string(),
});

/**
 * Figma variable value (can be primitive or alias)
 */
export const figmaVariableValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  figmaColorSchema,
  figmaAliasSchema,
]);

/**
 * Figma variable mode
 */
export const figmaModeSchema = z.object({
  modeId: z.string(),
  name: z.string(),
});

/**
 * Figma variable collection
 */
export const figmaCollectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  modes: z.array(figmaModeSchema),
  defaultModeId: z.string(),
  remote: z.boolean(),
  hiddenFromPublishing: z.boolean(),
  variableIds: z.array(z.string()),
});

/**
 * Figma variable resolved type
 */
export const figmaResolvedTypeSchema = z.enum(['BOOLEAN', 'FLOAT', 'STRING', 'COLOR']);

/**
 * Figma variable
 */
export const figmaVariableSchema = z.object({
  id: z.string(),
  name: z.string(),
  key: z.string().optional(),
  resolvedType: figmaResolvedTypeSchema,
  valuesByMode: z.record(z.string(), figmaVariableValueSchema),
  variableCollectionId: z.string(),
  remote: z.boolean(),
  description: z.string(),
  hiddenFromPublishing: z.boolean(),
  scopes: z.array(z.string()),
  codeSyntax: z.record(z.string(), z.string()),
});

/**
 * Figma style type
 */
export const figmaStyleTypeSchema = z.enum(['FILL', 'TEXT', 'EFFECT', 'GRID']);

/**
 * Figma style
 */
export const figmaStyleSchema = z.object({
  key: z.string(),
  name: z.string(),
  styleType: figmaStyleTypeSchema,
  description: z.string().optional(),
  remote: z.boolean().optional(),
  node_id: z.string().optional(),
});

/**
 * Figma node document (simplified - contains style data)
 */
export const figmaNodeDocumentSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    fills: z.array(z.unknown()).optional(),
    effects: z.array(z.unknown()).optional(),
    style: z.record(z.string(), z.unknown()).optional(),
  })
  .loose();

/**
 * Figma node (as returned by getFileNodes)
 */
export const figmaNodeSchema = z.object({
  document: figmaNodeDocumentSchema,
  components: z.record(z.string(), z.unknown()).optional(),
  schemaVersion: z.number().optional(),
  styles: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Figma file response
 */
export const figmaFileSchema = z
  .object({
    name: z.string(),
    lastModified: z.string(),
    thumbnailUrl: z.string().optional(),
    version: z.string(),
    role: z.string().optional(),
    editorType: z.string().optional(),
    linkAccess: z.string().optional(),
    document: z.record(z.string(), z.unknown()),
    components: z.record(z.string(), z.unknown()).optional(),
    componentSets: z.record(z.string(), z.unknown()).optional(),
    schemaVersion: z.number().optional(),
    styles: z.record(z.string(), figmaStyleSchema).optional(),
    mainFileKey: z.string().optional(),
    branches: z.array(z.unknown()).optional(),
  })
  .loose();

/**
 * Figma variables API response
 */
export const figmaVariablesResponseSchema = z.object({
  meta: z.object({
    variables: z.record(z.string(), figmaVariableSchema),
    variableCollections: z.record(z.string(), figmaCollectionSchema),
  }),
});

/**
 * Figma published variables response
 */
export const figmaPublishedVariablesResponseSchema = z.union([
  figmaVariablesResponseSchema,
  z.object({
    variables: z.record(z.string(), figmaVariableSchema),
    variableCollections: z.record(z.string(), figmaCollectionSchema),
  }),
]);

/**
 * Figma export format (as produced by @dsai-io/figma-tokens)
 * This is the format after exportTokens() processes the Figma API response
 */
export const figmaExportSchema = z.record(
  z.string(),
  z.union([
    z
      .object({
        modes: z.record(z.string(), z.record(z.string(), z.unknown())).optional(),
      })
      .loose(),
    z.record(z.string(), z.unknown()),
  ])
);

/**
 * Figma export with metadata
 */
export const figmaExportWithMetadataSchema = z
  .object({
    $schema: z.string().optional(),
    $description: z.string().optional(),
    $version: z.string().optional(),
    $source: z.string().optional(),
    $figmaFileKey: z.string().optional(),
    $exportedAt: z.string().optional(),
  })
  .catchall(
    z.union([
      z
        .object({
          modes: z.record(z.string(), z.record(z.string(), z.unknown())).optional(),
        })
        .loose(),
      z.record(z.string(), z.unknown()),
    ])
  );

export type FigmaColor = z.infer<typeof figmaColorSchema>;
export type FigmaAlias = z.infer<typeof figmaAliasSchema>;
export type FigmaVariableValue = z.infer<typeof figmaVariableValueSchema>;
export type FigmaMode = z.infer<typeof figmaModeSchema>;
export type FigmaCollection = z.infer<typeof figmaCollectionSchema>;
export type FigmaVariable = z.infer<typeof figmaVariableSchema>;
export type FigmaStyle = z.infer<typeof figmaStyleSchema>;
export type FigmaNode = z.infer<typeof figmaNodeSchema>;
export type FigmaFile = z.infer<typeof figmaFileSchema>;
export type FigmaVariablesResponse = z.infer<typeof figmaVariablesResponseSchema>;
export type FigmaExport = z.infer<typeof figmaExportSchema>;
export type FigmaExportWithMetadata = z.infer<typeof figmaExportWithMetadataSchema>;
