#!/usr/bin/env node
/**
 * DSAi Tools CLI entry point
 *
 * @packageDocumentation
 */

import { run } from '../dist/cli/index.js';

run().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
