/**
 * Zod schemas for registry validation.
 * @module @dsai-io/tools/registry/schema
 */

import { z } from 'zod';

export const registryItemTypeSchema = z.enum([
  'registry:ui',
  'registry:hook',
  'registry:util',
  'registry:lib',
  'registry:component',
  'registry:style',
  'registry:type',
]);

export const registryFileSchema = z.object({
  path: z.string().min(1, 'File path is required'),
  type: registryItemTypeSchema,
  content: z.string(),
  target: z.string().optional(),
});

export const registryItemSchema = z.object({
  name: z.string().min(1, 'Registry item name is required'),
  type: registryItemTypeSchema,
  title: z.string().min(1, 'Title is required'),
  description: z.string().default(''),
  dependencies: z.array(z.string()).default([]),
  devDependencies: z.array(z.string()).default([]),
  registryDependencies: z.array(z.string()).default([]),
  files: z.array(registryFileSchema).min(1, 'At least one file is required'),
  cssVars: z
    .object({
      light: z.record(z.string(), z.string()).optional(),
      dark: z.record(z.string(), z.string()).optional(),
    })
    .optional(),
  categories: z.array(z.string()).optional(),
});

export const registryIndexEntrySchema = z.object({
  name: z.string(),
  type: registryItemTypeSchema,
  title: z.string(),
  description: z.string(),
  dependencies: z.array(z.string()),
  registryDependencies: z.array(z.string()),
  categories: z.array(z.string()).optional(),
});

export const registryIndexSchema = z.object({
  version: z.string(),
  count: z.number(),
  items: z.array(registryIndexEntrySchema),
});

export type RegistryItemFromSchema = z.infer<typeof registryItemSchema>;
export type RegistryIndexFromSchema = z.infer<typeof registryIndexSchema>;
