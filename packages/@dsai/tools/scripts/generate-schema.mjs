#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Generate JSON Schema from Zod schemas
 *
 * This script generates a JSON Schema file from the Zod configuration schemas
 * for IDE autocomplete and validation support.
 *
 * Usage:
 *   pnpm run generate-schema
 *   node scripts/generate-schema.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { zodToJsonSchema } from 'zod-to-json-schema';

import { dsaiConfigSchema } from '../dist/index.js';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Output paths
const TEMPLATES_DIR = path.resolve(__dirname, '../templates');
const SCHEMA_OUTPUT = path.resolve(TEMPLATES_DIR, 'dsai-config.schema.json');

/**
 * Generate JSON Schema from Zod schema
 * @returns {void}
 */
function generateSchema() {
  console.log('Generating JSON Schema from Zod schemas...\n');

  // Convert Zod schema to JSON Schema
  const jsonSchema = zodToJsonSchema(dsaiConfigSchema, {
    name: 'DsaiConfig',
    $refStrategy: 'none',
    errorMessages: true,
  });

  // Add metadata
  const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://dsai.dev/schemas/dsai-config.schema.json',
    title: 'DSAI Configuration',
    description: 'Configuration schema for @dsai/tools - Design System AI toolkit',
    ...jsonSchema,
  };

  // Remove the generated name wrapper if present
  if (schema.definitions?.DsaiConfig) {
    Object.assign(schema, schema.definitions.DsaiConfig);
    delete schema.definitions;
    delete schema.$ref;
  }

  // Allow $schema property in config files
  if (schema.properties) {
    schema.properties.$schema = {
      type: 'string',
      description: 'JSON Schema reference',
    };
  }

  // Write schema file
  fs.writeFileSync(SCHEMA_OUTPUT, JSON.stringify(schema, null, '\t'), 'utf-8');

  console.log(`✓ Generated: ${path.relative(process.cwd(), SCHEMA_OUTPUT)}`);
  console.log('\nSchema generation complete!');
}

// Run if executed directly
generateSchema();
