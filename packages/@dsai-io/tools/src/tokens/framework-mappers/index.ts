/**
 * Framework Mappers
 *
 * Maps Figma/DTCG token names to framework-specific variable names.
 * Supports Bootstrap, shadcn/ui, Tailwind, MUI, and custom mappings.
 *
 * @packageDocumentation
 */

export {
  bootstrapMapper,
  BOOTSTRAP_MAPPINGS,
  BOOTSTRAP_PATTERNS,
  mapToBootstrapName,
} from './bootstrap.js';
export { shadcnMapper, SHADCN_MAPPINGS, mapToShadcnName } from './shadcn.js';
export {
  createFrameworkMapper,
  getFrameworkMapper,
  applyNameMapping,
  type FrameworkMapper,
  type FrameworkMapperWithConfig,
} from './mapper.js';
export type {
  FrameworkTarget,
  FrameworkMappingConfig,
  FrameworkMappingPattern,
} from '../../config/types.js';
