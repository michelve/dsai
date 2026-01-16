/**
 * SVG optimizer (SVGO integration)
 *
 * Optimizes SVG files using SVGO for smaller file sizes.
 *
 * @packageDocumentation
 */

import type { OptimizedSVG, ParsedSVG, RawSVGData, SVGOConfig } from '../types.js';

/**
 * Default SVGO configuration
 *
 * Provides sensible defaults for icon optimization.
 */
export const defaultSVGOConfig: SVGOConfig = {
  multipass: true,
  plugins: [
    { name: 'preset-default' },
    { name: 'removeXMLNS' },
    { name: 'removeDimensions' },
    { name: 'removeStyleElement' },
    { name: 'removeScriptElement' },
    {
      name: 'removeAttrs',
      params: {
        attrs: ['class', 'style', 'data-name', 'xmlns:xlink'],
      },
    },
    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [{ 'aria-hidden': 'true' }, { focusable: 'false' }],
      },
    },
    {
      name: 'sortAttrs',
      params: {
        xmlnsOrder: 'alphabetical',
      },
    },
  ],
};

/**
 * Optimize a single SVG
 *
 * @param parsed - Parsed SVG data
 * @param raw - Raw SVG data (for size comparison)
 * @param config - SVGO configuration
 * @returns Optimized SVG data
 */
export async function optimizeSVG(
  parsed: ParsedSVG,
  raw: RawSVGData,
  config: SVGOConfig = defaultSVGOConfig
): Promise<OptimizedSVG> {
  // Dynamic import of SVGO
  const svgo = await import('svgo');

  // Merge plugins with defaults if provided
  const plugins = config.plugins ?? defaultSVGOConfig.plugins ?? [];

  // Convert our plugin format to SVGO's expected format
  const svgoPlugins = plugins.map((p) => ({
    name: p.name,
    ...(p.params ? { params: p.params } : {}),
  }));

  // Run SVGO optimization
  const result = svgo.optimize(raw.content, {
    multipass: config.multipass ?? true,
    plugins: svgoPlugins as NonNullable<Parameters<typeof svgo.optimize>[1]>['plugins'],
  });

  const optimizedContent = result.data;
  const optimizedSize = Buffer.byteLength(optimizedContent, 'utf-8');
  const sizeReduction =
    raw.originalSize > 0 ? ((raw.originalSize - optimizedSize) / raw.originalSize) * 100 : 0;

  // Re-parse optimized content to get updated inner content
  const innerContentMatch = optimizedContent.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  const innerContent = innerContentMatch?.[1]?.trim() ?? parsed.innerContent;

  // Extract updated viewBox
  const viewBoxMatch = optimizedContent.match(/viewBox=["']([^"']*)["']/i);
  const viewBox = viewBoxMatch?.[1] ?? parsed.viewBox;

  return {
    ...parsed,
    innerContent,
    fullContent: optimizedContent,
    viewBox,
    optimizedSize,
    sizeReduction,
  };
}

/**
 * Optimize multiple SVGs
 *
 * @param parsedFiles - Array of parsed SVG data
 * @param rawFiles - Array of raw SVG data
 * @param config - SVGO configuration
 * @returns Array of optimized SVG data
 */
export async function optimizeSVGFiles(
  parsedFiles: ParsedSVG[],
  rawFiles: RawSVGData[],
  config: SVGOConfig = defaultSVGOConfig
): Promise<OptimizedSVG[]> {
  const results: OptimizedSVG[] = [];

  for (const parsed of parsedFiles) {
    const raw = rawFiles.find((r) => r.fileName === parsed.fileName);
    if (!raw) {
      throw new Error(`Raw file not found for ${parsed.fileName}`);
    }
    const optimized = await optimizeSVG(parsed, raw, config);
    results.push(optimized);
  }

  return results;
}

/**
 * Skip optimization and just add size metadata
 *
 * Useful when SVGO is not needed but the type structure is required.
 *
 * @param parsed - Parsed SVG data
 * @param raw - Raw SVG data
 * @returns Optimized SVG data (without actual optimization)
 */
export function skipOptimization(parsed: ParsedSVG, raw: RawSVGData): OptimizedSVG {
  return {
    ...parsed,
    optimizedSize: raw.originalSize,
    sizeReduction: 0,
  };
}
