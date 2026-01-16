/**
 * Unit tests for SVG optimizer
 *
 * Tests cover:
 * - optimizeSVG function
 * - optimizeSVGFiles function
 * - skipOptimization function
 * - defaultSVGOConfig
 */

import {
  optimizeSVG,
  optimizeSVGFiles,
  skipOptimization,
  defaultSVGOConfig,
} from '../../../../src/icons/core/optimizer.js';

import type { ParsedSVG, RawSVGData } from '../../../../src/icons/types.js';

// ============================================================================
// Test Data
// ============================================================================

function createMockParsedSVG(overrides: Partial<ParsedSVG> = {}): ParsedSVG {
  return {
    fileName: 'icon.svg',
    componentName: 'IconIcon',
    viewBox: '0 0 24 24',
    width: 24,
    height: 24,
    innerContent: '<path d="M0 0h24v24H0z"/>',
    fullContent: '<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>',
    attributes: {},
    ...overrides,
  };
}

function createMockRawSVG(overrides: Partial<RawSVGData> = {}): RawSVGData {
  return {
    fileName: 'icon.svg',
    filePath: '/path/to/icon.svg',
    content: '<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>',
    originalSize: 60,
    ...overrides,
  };
}

// ============================================================================
// defaultSVGOConfig
// ============================================================================

describe('defaultSVGOConfig', () => {
  it('should have multipass enabled', () => {
    expect(defaultSVGOConfig.multipass).toBe(true);
  });

  it('should include preset-default plugin', () => {
    const hasPresetDefault = defaultSVGOConfig.plugins?.some((p) => p.name === 'preset-default');
    expect(hasPresetDefault).toBe(true);
  });

  it('should include removeXMLNS plugin', () => {
    const hasRemoveXMLNS = defaultSVGOConfig.plugins?.some((p) => p.name === 'removeXMLNS');
    expect(hasRemoveXMLNS).toBe(true);
  });

  it('should include removeDimensions plugin', () => {
    const hasRemoveDimensions = defaultSVGOConfig.plugins?.some(
      (p) => p.name === 'removeDimensions'
    );
    expect(hasRemoveDimensions).toBe(true);
  });

  it('should include addAttributesToSVGElement plugin', () => {
    const hasAddAttrs = defaultSVGOConfig.plugins?.some(
      (p) => p.name === 'addAttributesToSVGElement'
    );
    expect(hasAddAttrs).toBe(true);
  });

  it('should configure accessibility attributes', () => {
    const addAttrsPlugin = defaultSVGOConfig.plugins?.find(
      (p) => p.name === 'addAttributesToSVGElement'
    );
    expect(addAttrsPlugin?.params?.attributes).toEqual(
      expect.arrayContaining([{ 'aria-hidden': 'true' }, { focusable: 'false' }])
    );
  });
});

// ============================================================================
// skipOptimization
// ============================================================================

describe('skipOptimization', () => {
  it('should return optimized SVG without actual optimization', () => {
    const parsed = createMockParsedSVG();
    const raw = createMockRawSVG();

    const result = skipOptimization(parsed, raw);

    expect(result.optimizedSize).toBe(raw.originalSize);
    expect(result.sizeReduction).toBe(0);
  });

  it('should preserve parsed SVG properties', () => {
    const parsed = createMockParsedSVG({
      viewBox: '0 0 48 48',
      width: 48,
      height: 48,
    });
    const raw = createMockRawSVG();

    const result = skipOptimization(parsed, raw);

    expect(result.viewBox).toBe('0 0 48 48');
    expect(result.width).toBe(48);
    expect(result.height).toBe(48);
    expect(result.innerContent).toBe(parsed.innerContent);
  });

  it('should handle zero-size files', () => {
    const parsed = createMockParsedSVG();
    const raw = createMockRawSVG({ originalSize: 0 });

    const result = skipOptimization(parsed, raw);

    expect(result.optimizedSize).toBe(0);
    expect(result.sizeReduction).toBe(0);
  });

  it('should handle large files', () => {
    const parsed = createMockParsedSVG();
    const raw = createMockRawSVG({ originalSize: 1000000 });

    const result = skipOptimization(parsed, raw);

    expect(result.optimizedSize).toBe(1000000);
    expect(result.sizeReduction).toBe(0);
  });
});

// ============================================================================
// optimizeSVG
// ============================================================================

describe('optimizeSVG', () => {
  it('should optimize SVG content', async () => {
    const parsed = createMockParsedSVG({
      innerContent: '<path d="M0 0h24v24H0z"/><circle cx="12" cy="12" r="10"/>',
      fullContent:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/><circle cx="12" cy="12" r="10"/></svg>',
    });
    const raw = createMockRawSVG({
      content: parsed.fullContent,
      originalSize: Buffer.byteLength(parsed.fullContent, 'utf-8'),
    });

    const result = await optimizeSVG(parsed, raw);

    expect(result.optimizedSize).toBeDefined();
    expect(typeof result.sizeReduction).toBe('number');
    expect(result.fullContent).toBeDefined();
  });

  it('should handle SVG with whitespace', async () => {
    const content = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
    </svg>`;
    const parsed = createMockParsedSVG({ fullContent: content });
    const raw = createMockRawSVG({
      content,
      originalSize: Buffer.byteLength(content, 'utf-8'),
    });

    const result = await optimizeSVG(parsed, raw);

    expect(result.fullContent).toBeDefined();
    expect(result.optimizedSize).toBeLessThanOrEqual(raw.originalSize);
  });

  it('should use custom config when provided', async () => {
    const parsed = createMockParsedSVG();
    const raw = createMockRawSVG();

    const customConfig = {
      multipass: false,
      plugins: [{ name: 'preset-default' }],
    };

    const result = await optimizeSVG(parsed, raw, customConfig);

    expect(result.fullContent).toBeDefined();
  });

  it('should calculate size reduction correctly', async () => {
    const verboseSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon" style="fill: black" data-name="test">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
    </svg>`;
    const parsed = createMockParsedSVG({ fullContent: verboseSvg });
    const raw = createMockRawSVG({
      content: verboseSvg,
      originalSize: Buffer.byteLength(verboseSvg, 'utf-8'),
    });

    const result = await optimizeSVG(parsed, raw);

    expect(result.sizeReduction).toBeGreaterThanOrEqual(0);
  });

  it('should handle zero-size original', async () => {
    const parsed = createMockParsedSVG();
    const raw = createMockRawSVG({ originalSize: 0 });

    const result = await optimizeSVG(parsed, raw);

    expect(result.sizeReduction).toBe(0);
  });

  it('should extract viewBox from optimized content', async () => {
    const parsed = createMockParsedSVG({ viewBox: '0 0 24 24' });
    const raw = createMockRawSVG({
      content: '<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>',
    });

    const result = await optimizeSVG(parsed, raw);

    expect(result.viewBox).toBeDefined();
  });
});

// ============================================================================
// optimizeSVGFiles
// ============================================================================

describe('optimizeSVGFiles', () => {
  it('should optimize multiple SVG files', async () => {
    const parsedFiles = [
      createMockParsedSVG({ fileName: 'icon1.svg' }),
      createMockParsedSVG({ fileName: 'icon2.svg' }),
    ];
    const rawFiles = [
      createMockRawSVG({ fileName: 'icon1.svg' }),
      createMockRawSVG({ fileName: 'icon2.svg' }),
    ];

    const results = await optimizeSVGFiles(parsedFiles, rawFiles);

    expect(results).toHaveLength(2);
    expect(results[0].fileName).toBe('icon1.svg');
    expect(results[1].fileName).toBe('icon2.svg');
  });

  it('should throw error when raw file is missing', async () => {
    const parsedFiles = [createMockParsedSVG({ fileName: 'icon1.svg' })];
    const rawFiles: RawSVGData[] = [];

    await expect(optimizeSVGFiles(parsedFiles, rawFiles)).rejects.toThrow('Raw file not found');
  });

  it('should use custom config for all files', async () => {
    const parsedFiles = [createMockParsedSVG({ fileName: 'icon.svg' })];
    const rawFiles = [createMockRawSVG({ fileName: 'icon.svg' })];
    const customConfig = {
      multipass: false,
      plugins: [{ name: 'preset-default' }],
    };

    const results = await optimizeSVGFiles(parsedFiles, rawFiles, customConfig);

    expect(results).toHaveLength(1);
  });

  it('should handle empty arrays', async () => {
    const results = await optimizeSVGFiles([], []);

    expect(results).toEqual([]);
  });

  it('should preserve file order', async () => {
    const parsedFiles = [
      createMockParsedSVG({ fileName: 'a.svg' }),
      createMockParsedSVG({ fileName: 'b.svg' }),
      createMockParsedSVG({ fileName: 'c.svg' }),
    ];
    const rawFiles = [
      createMockRawSVG({ fileName: 'a.svg' }),
      createMockRawSVG({ fileName: 'b.svg' }),
      createMockRawSVG({ fileName: 'c.svg' }),
    ];

    const results = await optimizeSVGFiles(parsedFiles, rawFiles);

    expect(results.map((r) => r.fileName)).toEqual(['a.svg', 'b.svg', 'c.svg']);
  });
});
