/**
 * Core icon processing exports
 *
 * @packageDocumentation
 */

export { readSVGFile, scanSVGFiles } from './scanner.js';
export { cleanSVGForReact, extractViewBox, parseSVG, parseSVGFiles } from './parser.js';
export {
  defaultSVGOConfig,
  optimizeSVG,
  optimizeSVGFiles,
  skipOptimization,
} from './optimizer.js';
