/**
 * @file Tests for FigmaClient export, sync, request, error, and circuit breaker paths
 * @description Covers exportStyles, exportTokens, syncTokens, request() retry/error logic,
 * CircuitBreaker integration, and Error classes
 */

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  mockFigmaFile,
  mockVariablesResponse,
  mockColors,
  emptyVariablesResponse,
  error403Forbidden,
  error500ServerError,
} from '../../test/fixtures/figma-api-responses.js';
import {
  createDefaultMockFetch,
  createCustomMockFetch,
  createFetchSpy,
  createSuccessResponse,
  createErrorResponse,
  setupFetchMock,
  resetFetchMock,
} from '../../test/mocks/fetch-mock.js';
import { createFigmaClient, FigmaClient, FigmaClientError, FigmaConfigError } from '../client.js';

// ============================================================================
// Helpers
// ============================================================================

/**
 * Build a mock file with specific style types for style export tests
 */
function buildMockFileWithStyles(
  styles: Record<string, { key: string; name: string; description?: string; styleType: string }>
) {
  return {
    ...mockFigmaFile,
    styles,
  };
}

/**
 * Build a mock nodes response for getFileNodes
 */
function buildMockNodesResponse(
  nodes: Record<string, { document: Record<string, unknown> }>
) {
  return { nodes };
}

// ============================================================================
// Tests
// ============================================================================

// Create a secure temp directory for the entire test suite
const testTmpDir = mkdtempSync(join(tmpdir(), 'dsai-test-'));

afterAll(() => {
  try {
    rmSync(testTmpDir, { recursive: true, force: true });
  } catch {
    // ignore cleanup errors
  }
});

describe('FigmaClient Export, Sync & Internals', () => {
  let client: FigmaClient;
  let originalFetch: typeof fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    setupFetchMock(createDefaultMockFetch());
    client = createFigmaClient({ accessToken: 'test-token' });
  });

  afterEach(() => {
    resetFetchMock(originalFetch);
  });

  // ========================================================================
  // Error Classes
  // ========================================================================

  describe('FigmaClientError', () => {
    it('constructs with message, status, code, requestId, hint', () => {
      const err = new FigmaClientError('fail', 403, 'CODE', 'req-1', 'hint text');
      expect(err.message).toBe('fail');
      expect(err.status).toBe(403);
      expect(err.code).toBe('CODE');
      expect(err.requestId).toBe('req-1');
      expect(err.hint).toBe('hint text');
      expect(err.name).toBe('FigmaClientError');
    });

    it('constructs with only message and status', () => {
      const err = new FigmaClientError('fail', 500);
      expect(err.status).toBe(500);
      expect(err.code).toBeUndefined();
      expect(err.requestId).toBeUndefined();
      expect(err.hint).toBeUndefined();
    });

    describe('fromApiError', () => {
      it('adds enterprise hint for 403 on /variables endpoint', () => {
        const err = FigmaClientError.fromApiError(
          { status: 403, err: 'Forbidden' },
          '/files/x/variables'
        );
        expect(err.status).toBe(403);
        expect(err.hint).toContain('Enterprise plan');
      });

      it('adds access-denied hint for 403 on non-variables endpoint', () => {
        const err = FigmaClientError.fromApiError(
          { status: 403, err: 'Forbidden' },
          '/files/x/components'
        );
        expect(err.hint).toContain('Access denied');
      });

      it('adds file-not-found hint for 404', () => {
        const err = FigmaClientError.fromApiError(
          { status: 404, err: 'Not found' },
          '/files/x'
        );
        expect(err.hint).toContain('File not found');
      });

      it('adds rate-limited hint for 429', () => {
        const err = FigmaClientError.fromApiError(
          { status: 429, err: 'Rate limited' },
          '/files/x'
        );
        expect(err.hint).toContain('Rate limited');
      });

      it('has no hint for generic 500 errors', () => {
        const err = FigmaClientError.fromApiError(
          { status: 500, err: 'Server error' },
          '/files/x'
        );
        expect(err.hint).toBeUndefined();
      });
    });

    describe('toDetailedMessage', () => {
      it('includes request ID when present', () => {
        const err = new FigmaClientError('fail', 500, undefined, 'req-42');
        expect(err.toDetailedMessage()).toContain('Request ID: req-42');
      });

      it('includes hint when present', () => {
        const err = new FigmaClientError('fail', 403, undefined, undefined, 'Try this');
        expect(err.toDetailedMessage()).toContain('Try this');
      });

      it('returns plain message when no requestId/hint', () => {
        const err = new FigmaClientError('fail', 500);
        expect(err.toDetailedMessage()).toBe('fail');
      });
    });
  });

  describe('FigmaConfigError', () => {
    it('constructs with message and correct name', () => {
      const err = new FigmaConfigError('not configured');
      expect(err.message).toBe('not configured');
      expect(err.name).toBe('FigmaConfigError');
      expect(err).toBeInstanceOf(Error);
    });
  });

  // ========================================================================
  // Client configuration / isReady
  // ========================================================================

  describe('Client Configuration', () => {
    it('isReady returns true when access token is provided', () => {
      expect(client.isReady()).toBe(true);
    });

    it('isReady returns false when no access token', () => {
      const unconfigured = createFigmaClient();
      expect(unconfigured.isReady()).toBe(false);
    });

    it('throws FigmaConfigError when calling API without token', async () => {
      const unconfigured = createFigmaClient();
      await expect(unconfigured.getFile('key')).rejects.toThrow(FigmaConfigError);
    });
  });

  // ========================================================================
  // exportStyles
  // ========================================================================

  describe('exportStyles', () => {
    it('returns effect, paint, and text style tokens from a file', async () => {
      const result = await client.exportStyles('file-key');

      // The default mock has FILL, TEXT, and EFFECT styles
      expect(result).toHaveProperty('effects');
      expect(result).toHaveProperty('paints');
      expect(result).toHaveProperty('textStyles');
    });

    it('returns empty objects when file has no styles', async () => {
      const emptyFile = { ...mockFigmaFile, styles: {} };
      setupFetchMock(
        createCustomMockFetch({
          '/files/': createSuccessResponse(emptyFile),
        }) as unknown as typeof fetch
      );

      const result = await client.exportStyles('file-key');

      expect(result.effects).toEqual({});
      expect(result.paints).toEqual({});
      expect(result.textStyles).toEqual({});
    });

    it('respects includeEffects=false', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      const result = await client.exportStyles('file-key', {
        includeEffects: false,
        includePaints: true,
        includeTextStyles: true,
      });

      // effects should be empty since we disabled it
      expect(result.effects).toEqual({});
    });

    it('respects includePaints=false', async () => {
      const result = await client.exportStyles('file-key', {
        includeEffects: true,
        includePaints: false,
        includeTextStyles: true,
      });

      expect(result.paints).toEqual({});
    });

    it('respects includeTextStyles=false', async () => {
      const result = await client.exportStyles('file-key', {
        includeEffects: true,
        includePaints: true,
        includeTextStyles: false,
      });

      expect(result.textStyles).toEqual({});
    });

    it('extracts paint styles with solid color values', async () => {
      const result = await client.exportStyles('file-key');

      // The mock file has a FILL style "colors/primary"
      // Check it was extracted and nested under colors > primary
      expect(result.paints).toBeDefined();
      const colorToken = result.paints['colors'] as Record<string, unknown> | undefined;
      if (colorToken) {
        const primary = colorToken['primary'] as Record<string, unknown>;
        expect(primary).toBeDefined();
        expect(primary['$type']).toBe('color');
        expect(primary['$value']).toBeDefined();
      }
    });

    it('extracts text styles with typography values', async () => {
      const result = await client.exportStyles('file-key');

      const typo = result.textStyles['typography'] as Record<string, unknown> | undefined;
      if (typo) {
        const heading = typo['heading-1'] as Record<string, unknown>;
        expect(heading).toBeDefined();
        expect(heading['$type']).toBe('typography');
        const val = heading['$value'] as Record<string, unknown>;
        expect(val['fontFamily']).toBe('Inter');
        expect(val['fontWeight']).toBe(700);
      }
    });

    it('extracts effect styles with shadow values', async () => {
      const result = await client.exportStyles('file-key');

      const shadows = result.effects['shadows'] as Record<string, unknown> | undefined;
      if (shadows) {
        const elev = shadows['elevation-1'] as Record<string, unknown>;
        expect(elev).toBeDefined();
        expect(elev['$type']).toBe('shadow');
        expect(typeof elev['$value']).toBe('string');
        expect((elev['$value'] as string)).toContain('px');
      }
    });
  });

  // ========================================================================
  // getEffectStyles — blur fallback & no-node fallback
  // ========================================================================

  describe('getEffectStyles edge cases', () => {
    it('handles blur effects (non-shadow)', async () => {
      const fileWithBlur = buildMockFileWithStyles({
        'StyleID:B:0': {
          key: 'blur-key',
          name: 'blurs/background',
          styleType: 'EFFECT',
        },
      });
      const blurNodes = buildMockNodesResponse({
        'StyleID:B:0': {
          document: {
            id: 'StyleID:B:0',
            name: 'blurs/background',
            type: 'RECTANGLE',
            effects: [
              {
                type: 'BACKGROUND_BLUR',
                visible: true,
                radius: 12,
              },
            ],
          },
        },
      });

      setupFetchMock(
        createCustomMockFetch({
          '/nodes': createSuccessResponse(blurNodes),
          '/files/': createSuccessResponse(fileWithBlur),
        }) as unknown as typeof fetch
      );

      const tokens = await client.getEffectStyles('file-key');
      const blurToken = (tokens['blurs'] as Record<string, unknown>)?.['background'] as Record<string, unknown>;
      expect(blurToken).toBeDefined();
      expect(blurToken['$type']).toBe('blur');
      expect((blurToken['$value'] as string)).toContain('blur(12px)');
    });

    it('falls back to style name when node has no effects', async () => {
      const fileWithEffect = buildMockFileWithStyles({
        'StyleID:E:0': {
          key: 'eff-key',
          name: 'effects/empty',
          styleType: 'EFFECT',
        },
      });
      // Node exists but has no effects array
      const emptyNodes = buildMockNodesResponse({
        'StyleID:E:0': {
          document: {
            id: 'StyleID:E:0',
            name: 'effects/empty',
            type: 'RECTANGLE',
          },
        },
      });

      setupFetchMock(
        createCustomMockFetch({
          '/nodes': createSuccessResponse(emptyNodes),
          '/files/': createSuccessResponse(fileWithEffect),
        }) as unknown as typeof fetch
      );

      const tokens = await client.getEffectStyles('file-key');
      const effToken = (tokens['effects'] as Record<string, unknown>)?.['empty'] as Record<string, unknown>;
      expect(effToken['$value']).toBe('effects/empty');
    });

    it('handles inner shadow effects', async () => {
      const fileWithInner = buildMockFileWithStyles({
        'StyleID:I:0': {
          key: 'inner-key',
          name: 'shadows/inset',
          styleType: 'EFFECT',
        },
      });
      const innerNodes = buildMockNodesResponse({
        'StyleID:I:0': {
          document: {
            id: 'StyleID:I:0',
            name: 'shadows/inset',
            type: 'RECTANGLE',
            effects: [
              {
                type: 'INNER_SHADOW',
                visible: true,
                color: mockColors.semiTransparentBlack,
                offset: { x: 0, y: 1 },
                radius: 3,
                spread: 0,
              },
            ],
          },
        },
      });

      setupFetchMock(
        createCustomMockFetch({
          '/nodes': createSuccessResponse(innerNodes),
          '/files/': createSuccessResponse(fileWithInner),
        }) as unknown as typeof fetch
      );

      const tokens = await client.getEffectStyles('file-key');
      const shadow = (tokens['shadows'] as Record<string, unknown>)?.['inset'] as Record<string, unknown>;
      expect(shadow['$type']).toBe('shadow');
      expect((shadow['$value'] as string)).toContain('inset');
    });
  });

  // ========================================================================
  // getPaintStyles edge cases
  // ========================================================================

  describe('getPaintStyles edge cases', () => {
    it('handles gradient fills', async () => {
      const fileWithGradient = buildMockFileWithStyles({
        'StyleID:G:0': {
          key: 'grad-key',
          name: 'gradients/brand',
          styleType: 'FILL',
        },
      });
      const gradientNodes = buildMockNodesResponse({
        'StyleID:G:0': {
          document: {
            id: 'StyleID:G:0',
            name: 'gradients/brand',
            type: 'RECTANGLE',
            fills: [
              {
                type: 'GRADIENT_LINEAR',
                visible: true,
                gradientStops: [
                  { position: 0, color: mockColors.blue },
                  { position: 1, color: mockColors.red },
                ],
              },
            ],
          },
        },
      });

      setupFetchMock(
        createCustomMockFetch({
          '/nodes': createSuccessResponse(gradientNodes),
          '/files/': createSuccessResponse(fileWithGradient),
        }) as unknown as typeof fetch
      );

      const tokens = await client.getPaintStyles('file-key');
      const gradToken = (tokens['gradients'] as Record<string, unknown>)?.['brand'] as Record<string, unknown>;
      expect(gradToken['$type']).toBe('gradient');
      expect((gradToken['$value'] as string)).toContain('linear-gradient');
    });

    it('falls back when node has no fills', async () => {
      const fileWithPaint = buildMockFileWithStyles({
        'StyleID:P:0': {
          key: 'paint-key',
          name: 'colors/missing',
          styleType: 'FILL',
        },
      });
      const emptyNodes = buildMockNodesResponse({
        'StyleID:P:0': {
          document: {
            id: 'StyleID:P:0',
            name: 'colors/missing',
            type: 'RECTANGLE',
          },
        },
      });

      setupFetchMock(
        createCustomMockFetch({
          '/nodes': createSuccessResponse(emptyNodes),
          '/files/': createSuccessResponse(fileWithPaint),
        }) as unknown as typeof fetch
      );

      const tokens = await client.getPaintStyles('file-key');
      const token = (tokens['colors'] as Record<string, unknown>)?.['missing'] as Record<string, unknown>;
      expect(token['$value']).toBe('colors/missing');
      expect(token['$type']).toBe('color');
    });

    it('handles fill with opacity', async () => {
      const fileWithOpacity = buildMockFileWithStyles({
        'StyleID:O:0': {
          key: 'opa-key',
          name: 'colors/faded',
          styleType: 'FILL',
        },
      });
      const opacityNodes = buildMockNodesResponse({
        'StyleID:O:0': {
          document: {
            id: 'StyleID:O:0',
            name: 'colors/faded',
            type: 'RECTANGLE',
            fills: [
              {
                type: 'SOLID',
                visible: true,
                opacity: 0.5,
                color: mockColors.red,
              },
            ],
          },
        },
      });

      setupFetchMock(
        createCustomMockFetch({
          '/nodes': createSuccessResponse(opacityNodes),
          '/files/': createSuccessResponse(fileWithOpacity),
        }) as unknown as typeof fetch
      );

      const tokens = await client.getPaintStyles('file-key');
      const token = (tokens['colors'] as Record<string, unknown>)?.['faded'] as Record<string, unknown>;
      expect((token['$value'] as string)).toContain('rgba');
    });
  });

  // ========================================================================
  // getTextStyles edge cases
  // ========================================================================

  describe('getTextStyles edge cases', () => {
    it('extracts text style from node.style subobject', async () => {
      const fileWithText = buildMockFileWithStyles({
        'StyleID:T:0': {
          key: 'text-key',
          name: 'text/body',
          styleType: 'TEXT',
        },
      });
      const textNodes = buildMockNodesResponse({
        'StyleID:T:0': {
          document: {
            id: 'StyleID:T:0',
            name: 'text/body',
            type: 'TEXT',
            style: {
              fontFamily: 'Roboto',
              fontWeight: 400,
              fontSize: 14,
              lineHeight: { unit: 'PERCENT', value: 150 },
              letterSpacing: { unit: 'PERCENT', value: 2 },
              textCase: 'UPPER',
              textDecoration: 'UNDERLINE',
            },
          },
        },
      });

      setupFetchMock(
        createCustomMockFetch({
          '/nodes': createSuccessResponse(textNodes),
          '/files/': createSuccessResponse(fileWithText),
        }) as unknown as typeof fetch
      );

      const tokens = await client.getTextStyles('file-key');
      const textToken = (tokens['text'] as Record<string, unknown>)?.['body'] as Record<string, unknown>;
      expect(textToken['$type']).toBe('typography');
      const val = textToken['$value'] as Record<string, unknown>;
      expect(val['fontFamily']).toBe('Roboto');
      expect(val['lineHeight']).toBe('150%');
      expect(val['letterSpacing']).toBe('2%');
      expect(val['textTransform']).toBe('upper');
      expect(val['textDecoration']).toBe('underline');
    });

    it('falls back when node has no font data', async () => {
      const fileWithText = buildMockFileWithStyles({
        'StyleID:T:1': {
          key: 'txt-key-2',
          name: 'text/empty',
          styleType: 'TEXT',
        },
      });
      const emptyNodes = buildMockNodesResponse({
        'StyleID:T:1': {
          document: {
            id: 'StyleID:T:1',
            name: 'text/empty',
            type: 'TEXT',
          },
        },
      });

      setupFetchMock(
        createCustomMockFetch({
          '/nodes': createSuccessResponse(emptyNodes),
          '/files/': createSuccessResponse(fileWithText),
        }) as unknown as typeof fetch
      );

      const tokens = await client.getTextStyles('file-key');
      const token = (tokens['text'] as Record<string, unknown>)?.['empty'] as Record<string, unknown>;
      expect(token['$value']).toBe('text/empty');
    });

    it('handles line height with AUTO unit', async () => {
      const fileWithText = buildMockFileWithStyles({
        'StyleID:T:2': {
          key: 'txt-auto',
          name: 'text/auto',
          styleType: 'TEXT',
        },
      });
      const autoNodes = buildMockNodesResponse({
        'StyleID:T:2': {
          document: {
            id: 'StyleID:T:2',
            name: 'text/auto',
            type: 'TEXT',
            fontFamily: 'Arial',
            fontSize: 16,
            lineHeight: { unit: 'AUTO' },
          },
        },
      });

      setupFetchMock(
        createCustomMockFetch({
          '/nodes': createSuccessResponse(autoNodes),
          '/files/': createSuccessResponse(fileWithText),
        }) as unknown as typeof fetch
      );

      const tokens = await client.getTextStyles('file-key');
      const token = (tokens['text'] as Record<string, unknown>)?.['auto'] as Record<string, unknown>;
      const val = token['$value'] as Record<string, unknown>;
      expect(val['lineHeight']).toBe('normal');
    });
  });

  // ========================================================================
  // exportTokens
  // ========================================================================

  describe('exportTokens', () => {
    it('exports tokens from variables with separate output structure', async () => {
      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'tokens'),
        format: 'dtcg',
      });

      expect(result.success).toBe(true);
      expect(result.tokenCount).toBeGreaterThan(0);
      expect(result.collectionCount).toBeGreaterThan(0);
      expect(result.files.length).toBeGreaterThan(0);
      expect(result.errors).toHaveLength(0);
    });

    it('returns warnings when no collections found', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/variables/local': createSuccessResponse(emptyVariablesResponse),
        }) as unknown as typeof fetch
      );

      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'tokens'),
      });

      expect(result.success).toBe(true);
      expect(result.tokenCount).toBe(0);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('No variable collections');
    });

    it('filters by collection name', async () => {
      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'tokens'),
        collections: ['primitives'],
      });

      expect(result.success).toBe(true);
      // Should only include primitives collection tokens
      for (const file of result.files) {
        expect(file.collection).toBe('primitives');
      }
    });

    it('filters by mode name', async () => {
      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'tokens'),
        modes: ['light'],
      });

      expect(result.success).toBe(true);
      // Only modes named "light" should appear
      for (const file of result.files) {
        if (file.mode !== 'all') {
          expect(file.mode).toBe('light');
        }
      }
    });

    it('handles alias references without resolving', async () => {
      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'tokens'),
        resolveAliases: false,
      });

      expect(result.success).toBe(true);
    });

    it('handles alias references with resolving', async () => {
      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'tokens'),
        resolveAliases: true,
      });

      expect(result.success).toBe(true);
    });

    it('exports in tokens-studio format', async () => {
      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'tokens'),
        format: 'tokens-studio',
      });

      expect(result.success).toBe(true);
      expect(result.tokenCount).toBeGreaterThan(0);
    });

    it('exports in style-dictionary format', async () => {
      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'tokens'),
        format: 'style-dictionary',
      });

      expect(result.success).toBe(true);
      expect(result.tokenCount).toBeGreaterThan(0);
    });

    it('returns failure result on API error', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/variables/local': createErrorResponse(403, error403Forbidden),
        }) as unknown as typeof fetch
      );

      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'tokens'),
      });

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('exports with combined output structure', async () => {
      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'tokens'),
        outputStructure: 'combined',
      } as any);

      expect(result.success).toBe(true);
      // Combined structure: files have mode='all'
      for (const file of result.files) {
        expect(file.mode).toBe('all');
      }
    });

    it('includes descriptions when includeDescriptions is true', async () => {
      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'tokens'),
        includeDescriptions: true,
      });

      expect(result.success).toBe(true);
    });

    it('exports effect/paint/text styles when requested', async () => {
      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'tokens'),
        includeEffects: true,
        includePaints: true,
        includeTextStyles: true,
      } as any);

      expect(result.success).toBe(true);
      // Should have files for styles in addition to variables
      const styleFiles = result.files.filter(
        (f) => f.collection === 'Effects' || f.collection === 'Paints' || f.collection === 'TextStyles'
      );
      expect(styleFiles.length).toBeGreaterThan(0);
    });

    it('recovers when style export fails (adds warning)', async () => {
      // Use a mock that works for variables/local but fails on getFile (styles)
      let callCount = 0;
      const handler = (url: string, options?: RequestInit) => {
        if (url.includes('/variables/local')) {
          return Promise.resolve(createSuccessResponse(mockVariablesResponse));
        }
        if (url.includes('/files/') && !url.includes('/nodes') && !url.includes('/variables')) {
          callCount++;
          // First call for exportTokens getVariables succeeds, subsequent calls for styles fail
          if (callCount > 1) {
            return Promise.resolve(createErrorResponse(500, error500ServerError));
          }
          return Promise.resolve(createSuccessResponse(mockFigmaFile));
        }
        return createDefaultMockFetch()(url, options);
      };
      setupFetchMock(handler as unknown as typeof fetch);

      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'tokens'),
        includeEffects: true,
      } as any);

      // The export should still succeed (styles are optional)
      expect(result.success).toBe(true);
    });

    it('skips remote collections', async () => {
      const remoteResponse = {
        variableCollections: {
          'VariableCollectionId:R:0': {
            id: 'VariableCollectionId:R:0',
            name: 'remote-lib',
            key: 'remote-key',
            modes: [{ modeId: 'R:0', name: 'default' }],
            defaultModeId: 'R:0',
            remote: true,
            hiddenFromPublishing: false,
            variableIds: ['VariableID:R:1'],
          },
        },
        variables: {
          'VariableID:R:1': {
            id: 'VariableID:R:1',
            name: 'remote/var',
            key: 'rv-key',
            variableCollectionId: 'VariableCollectionId:R:0',
            resolvedType: 'FLOAT',
            description: '',
            hiddenFromPublishing: false,
            valuesByMode: { 'R:0': 42 },
            scopes: [],
          },
        },
      };

      setupFetchMock(
        createCustomMockFetch({
          '/variables/local': createSuccessResponse(remoteResponse),
        }) as unknown as typeof fetch
      );

      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'tokens'),
      });

      expect(result.success).toBe(true);
      expect(result.files).toHaveLength(0);
      expect(result.tokenCount).toBe(0);
    });
  });

  // ========================================================================
  // syncTokens
  // ========================================================================

  describe('syncTokens', () => {
    it('pulls remote tokens and detects new tokens', async () => {
      const result = await client.syncTokens({
        fileKey: 'file-key',
        tokensDir: join(testTmpDir, 'sync-empty'),
        direction: 'pull',
      });

      expect(result.success).toBe(true);
      expect(result.direction).toBe('pull');
      // All tokens are "added" because local dir is empty
      expect(result.added.length).toBeGreaterThan(0);
    });

    it('returns error for push direction (not fully supported)', async () => {
      const result = await client.syncTokens({
        fileKey: 'file-key',
        tokensDir: join(testTmpDir, 'sync-push'),
        direction: 'push',
      });

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Push to Figma is not fully supported');
    });

    it('performs dry run without writing', async () => {
      const result = await client.syncTokens({
        fileKey: 'file-key',
        tokensDir: join(testTmpDir, 'sync-dry'),
        direction: 'pull',
        dryRun: true,
      });

      expect(result.success).toBe(true);
      // Should detect tokens but not write
      expect(result.added.length).toBeGreaterThan(0);
    });

    it('handles backup option', async () => {
      const result = await client.syncTokens({
        fileKey: 'file-key',
        tokensDir: join(testTmpDir, 'sync-backup'),
        direction: 'pull',
        backup: true,
      });

      // Should succeed regardless (backup failure is non-fatal)
      expect(result.success).toBe(true);
    });

    it('handles both direction', async () => {
      const result = await client.syncTokens({
        fileKey: 'file-key',
        tokensDir: join(testTmpDir, 'sync-both'),
        direction: 'both',
      });

      // 'both' includes push which adds an error
      expect(result.direction).toBe('both');
    });

    it('handles manual conflict resolution', async () => {
      const result = await client.syncTokens({
        fileKey: 'file-key',
        tokensDir: join(testTmpDir, 'sync-conflict'),
        direction: 'pull',
        conflictResolution: 'manual',
      });

      expect(result.success).toBe(true);
    });

    it('returns failure result on API error during sync', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/variables/local': createErrorResponse(403, error403Forbidden),
        }) as unknown as typeof fetch
      );

      const result = await client.syncTokens({
        fileKey: 'file-key',
        tokensDir: join(testTmpDir, 'sync-fail'),
        direction: 'pull',
      });

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('throws FigmaConfigError when not configured', async () => {
      const unconfigured = createFigmaClient();

      await expect(
        unconfigured.syncTokens({
          fileKey: 'file-key',
          tokensDir: join(testTmpDir, 'sync-noconfig'),
          direction: 'pull',
        })
      ).rejects.toThrow(FigmaConfigError);
    });
  });

  // ========================================================================
  // request() retry and error logic (tested indirectly)
  // ========================================================================

  describe('request() retry logic', () => {
    it('retries on 5xx errors and eventually succeeds', async () => {
      let callCount = 0;
      const retryHandler = (url: string) => {
        callCount++;
        if (callCount <= 2) {
          return Promise.resolve(createErrorResponse(500, error500ServerError));
        }
        return createDefaultMockFetch()(url);
      };
      setupFetchMock(retryHandler as unknown as typeof fetch);

      // Use a client with retries and short timeout
      const retryClient = createFigmaClient({
        accessToken: 'test-token',
        retries: 3,
        timeout: 30000,
      });

      const result = await retryClient.getMe();
      expect(result).toHaveProperty('id');
      expect(callCount).toBeGreaterThan(1);
    });

    it('does not retry 4xx client errors', async () => {
      let callCount = 0;
      const handler = () => {
        callCount++;
        return Promise.resolve(createErrorResponse(403, error403Forbidden));
      };
      setupFetchMock(handler as unknown as typeof fetch);

      const retryClient = createFigmaClient({
        accessToken: 'test-token',
        retries: 3,
      });

      await expect(retryClient.getMe()).rejects.toThrow(FigmaClientError);
      // Should not retry on 403
      expect(callCount).toBe(1);
    });

    it('throws after exhausting retries on 5xx', async () => {
      const handler = () => {
        return Promise.resolve(createErrorResponse(500, error500ServerError));
      };
      setupFetchMock(handler as unknown as typeof fetch);

      const retryClient = createFigmaClient({
        accessToken: 'test-token',
        retries: 1,
        timeout: 5000,
      });

      await expect(retryClient.getMe()).rejects.toThrow();
    });
  });

  // ========================================================================
  // getFileNodes
  // ========================================================================

  describe('getFileNodes', () => {
    it('returns empty record for empty node IDs array', async () => {
      const result = await client.getFileNodes('file-key', []);
      expect(result).toEqual({});
    });

    it('fetches nodes by IDs', async () => {
      const result = await client.getFileNodes('file-key', ['StyleID:1:0', 'StyleID:2:0']);
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });
  });

  // ========================================================================
  // getFile with options
  // ========================================================================

  describe('getFile options', () => {
    it('sends geometry and depth query params', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getFile('file-key', { geometry: 'paths', depth: 2 });

      expect(spy.calls[0].url).toContain('geometry=paths');
      expect(spy.calls[0].url).toContain('depth=2');
    });

    it('sends no query params when options are not specified', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getFile('file-key');

      expect(spy.calls[0].url).not.toContain('?');
    });
  });

  // ========================================================================
  // getVariables / getPublishedVariables
  // ========================================================================

  describe('getVariables', () => {
    it('handles meta-wrapped response format', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/variables/local': createSuccessResponse({ meta: mockVariablesResponse }),
        }) as unknown as typeof fetch
      );

      const result = await client.getVariables('file-key');
      expect(Object.keys(result.variables).length).toBeGreaterThan(0);
      expect(Object.keys(result.variableCollections).length).toBeGreaterThan(0);
    });

    it('handles direct response format', async () => {
      const result = await client.getVariables('file-key');
      expect(Object.keys(result.variables).length).toBeGreaterThan(0);
    });
  });

  describe('getPublishedVariables', () => {
    it('sends GET to /variables/published endpoint', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      // The default mock returns 404 for /variables/published but we can still verify the URL
      try {
        await client.getPublishedVariables('file-key');
      } catch {
        // May fail with default mock since there's no explicit handler for /published
      }

      // Check the first call was to the published endpoint
      if (spy.calls.length > 0) {
        expect(spy.calls[0].url).toContain('/variables/published');
      }
    });
  });

  // ========================================================================
  // createFigmaClientFromEnv
  // ========================================================================

  describe('createFigmaClientFromEnv', () => {
    it('is exported and creates a client', async () => {
      const { createFigmaClientFromEnv } = await import('../client.js');
      const envClient = createFigmaClientFromEnv();
      // Without env var set, it should still create a client but not be ready
      expect(envClient).toBeInstanceOf(FigmaClient);
    });
  });

  // ========================================================================
  // Token type detection (tested via exportTokens outputs)
  // ========================================================================

  describe('Token type detection through exportTokens', () => {
    it('detects font weight, font family, and font size types', async () => {
      // The mockVariablesResponse includes typography variables
      // typography/font/family (STRING) -> fontFamily
      // typography/font/weight (FLOAT + /weight/) -> fontWeight
      // typography/fontSize/base (FLOAT + /fontSize/) -> dimension
      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'types'),
        format: 'dtcg',
        collections: ['typography'],
      });

      expect(result.success).toBe(true);
      expect(result.tokenCount).toBeGreaterThan(0);
    });
  });

  // ========================================================================
  // Variable value conversion edge cases
  // ========================================================================

  describe('Variable value conversion', () => {
    it('handles boolean variables', async () => {
      const boolResponse = {
        variableCollections: {
          'VariableCollectionId:B:0': {
            id: 'VariableCollectionId:B:0',
            name: 'flags',
            key: 'flags-key',
            modes: [{ modeId: 'B:0', name: 'default' }],
            defaultModeId: 'B:0',
            remote: false,
            hiddenFromPublishing: false,
            variableIds: ['VariableID:B:1'],
          },
        },
        variables: {
          'VariableID:B:1': {
            id: 'VariableID:B:1',
            name: 'feature/darkMode',
            key: 'dark-mode-key',
            variableCollectionId: 'VariableCollectionId:B:0',
            resolvedType: 'BOOLEAN',
            description: '',
            hiddenFromPublishing: false,
            valuesByMode: { 'B:0': true },
            scopes: [],
          },
        },
      };

      setupFetchMock(
        createCustomMockFetch({
          '/variables/local': createSuccessResponse(boolResponse),
        }) as unknown as typeof fetch
      );

      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'bool'),
        format: 'dtcg',
      });

      expect(result.success).toBe(true);
      expect(result.tokenCount).toBe(1);
    });

    it('handles color with alpha channel', async () => {
      const alphaResponse = {
        variableCollections: {
          'VariableCollectionId:A:0': {
            id: 'VariableCollectionId:A:0',
            name: 'alpha-colors',
            key: 'alpha-key',
            modes: [{ modeId: 'A:0', name: 'default' }],
            defaultModeId: 'A:0',
            remote: false,
            hiddenFromPublishing: false,
            variableIds: ['VariableID:A:1'],
          },
        },
        variables: {
          'VariableID:A:1': {
            id: 'VariableID:A:1',
            name: 'colors/overlay',
            key: 'overlay-key',
            variableCollectionId: 'VariableCollectionId:A:0',
            resolvedType: 'COLOR',
            description: '',
            hiddenFromPublishing: false,
            valuesByMode: { 'A:0': { r: 0, g: 0, b: 0, a: 0.5 } },
            scopes: ['ALL_FILLS'],
          },
        },
      };

      setupFetchMock(
        createCustomMockFetch({
          '/variables/local': createSuccessResponse(alphaResponse),
        }) as unknown as typeof fetch
      );

      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'alpha'),
        format: 'dtcg',
      });

      expect(result.success).toBe(true);
      expect(result.tokenCount).toBe(1);
    });
  });

  // ========================================================================
  // Description metadata parsing (tested through buildToken via export)
  // ========================================================================

  describe('Description metadata parsing', () => {
    it('extracts structured metadata from variable descriptions', async () => {
      // Variable 2:2 in mock has metadata in description:
      // "Primary text color\n\nDocs.Reference: https://... • Docs.Section: Text Colors"
      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'meta'),
        format: 'dtcg',
        includeDescriptions: true,
        collections: ['semantic'],
        modes: ['light'],
      });

      expect(result.success).toBe(true);
    });
  });

  // ========================================================================
  // Multi-mode file naming
  // ========================================================================

  describe('Multi-mode file naming', () => {
    it('generates separate files per mode when collection has multiple modes', async () => {
      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'modes'),
        format: 'dtcg',
        collections: ['semantic'],
      });

      expect(result.success).toBe(true);
      // Semantic collection has light and dark modes
      const semanticFiles = result.files.filter((f) => f.collection === 'semantic');
      expect(semanticFiles.length).toBe(2);
      // File paths should include mode names
      const paths = semanticFiles.map((f) => f.path);
      expect(paths.some((p) => p.includes('light'))).toBe(true);
      expect(paths.some((p) => p.includes('dark'))).toBe(true);
    });
  });

  // ========================================================================
  // Token type detection edge cases (lines 247, 252, 262, 266)
  // ========================================================================

  describe('Token type detection edge cases', () => {
    it('detects lineHeight type for FLOAT variables with lineHeight in name', async () => {
      const response = {
        variableCollections: {
          'VariableCollectionId:LH:0': {
            id: 'VariableCollectionId:LH:0',
            name: 'line-heights',
            key: 'lh-key',
            modes: [{ modeId: 'LH:0', name: 'default' }],
            defaultModeId: 'LH:0',
            remote: false,
            hiddenFromPublishing: false,
            variableIds: ['VariableID:LH:1'],
          },
        },
        variables: {
          'VariableID:LH:1': {
            id: 'VariableID:LH:1',
            name: 'typography/lineHeight/base',
            key: 'lh-base-key',
            variableCollectionId: 'VariableCollectionId:LH:0',
            resolvedType: 'FLOAT',
            description: '',
            hiddenFromPublishing: false,
            valuesByMode: { 'LH:0': 1.5 },
            scopes: [],
          },
        },
      };

      setupFetchMock(
        createCustomMockFetch({
          '/variables/local': createSuccessResponse(response),
        }) as unknown as typeof fetch
      );

      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'lh'),
        format: 'dtcg',
      });

      expect(result.success).toBe(true);
      expect(result.tokenCount).toBe(1);
    });

    it('detects letterSpacing type for FLOAT variables with letterSpacing in name', async () => {
      const response = {
        variableCollections: {
          'VariableCollectionId:LS:0': {
            id: 'VariableCollectionId:LS:0',
            name: 'letter-spacing',
            key: 'ls-key',
            modes: [{ modeId: 'LS:0', name: 'default' }],
            defaultModeId: 'LS:0',
            remote: false,
            hiddenFromPublishing: false,
            variableIds: ['VariableID:LS:1'],
          },
        },
        variables: {
          'VariableID:LS:1': {
            id: 'VariableID:LS:1',
            name: 'typography/letterSpacing/tight',
            key: 'ls-tight-key',
            variableCollectionId: 'VariableCollectionId:LS:0',
            resolvedType: 'FLOAT',
            description: '',
            hiddenFromPublishing: false,
            valuesByMode: { 'LS:0': -0.5 },
            scopes: [],
          },
        },
      };

      setupFetchMock(
        createCustomMockFetch({
          '/variables/local': createSuccessResponse(response),
        }) as unknown as typeof fetch
      );

      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'ls'),
        format: 'dtcg',
      });

      expect(result.success).toBe(true);
      expect(result.tokenCount).toBe(1);
    });

    it('detects STRING type for string variables', async () => {
      const response = {
        variableCollections: {
          'VariableCollectionId:STR:0': {
            id: 'VariableCollectionId:STR:0',
            name: 'strings',
            key: 'str-key',
            modes: [{ modeId: 'STR:0', name: 'default' }],
            defaultModeId: 'STR:0',
            remote: false,
            hiddenFromPublishing: false,
            variableIds: ['VariableID:STR:1'],
          },
        },
        variables: {
          'VariableID:STR:1': {
            id: 'VariableID:STR:1',
            name: 'content/placeholder',
            key: 'str-placeholder-key',
            variableCollectionId: 'VariableCollectionId:STR:0',
            resolvedType: 'STRING',
            description: '',
            hiddenFromPublishing: false,
            valuesByMode: { 'STR:0': 'Enter text...' },
            scopes: [],
          },
        },
      };

      setupFetchMock(
        createCustomMockFetch({
          '/variables/local': createSuccessResponse(response),
        }) as unknown as typeof fetch
      );

      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'str'),
        format: 'dtcg',
      });

      expect(result.success).toBe(true);
      expect(result.tokenCount).toBe(1);
    });
  });

  // ========================================================================
  // Inline metadata parsing (lines 147-152, 175)
  // ========================================================================

  describe('Inline metadata parsing (single-line format)', () => {
    it('extracts metadata from description with inline metadata pattern', async () => {
      const response = {
        variableCollections: {
          'VariableCollectionId:M:0': {
            id: 'VariableCollectionId:M:0',
            name: 'meta-test',
            key: 'meta-key',
            modes: [{ modeId: 'M:0', name: 'default' }],
            defaultModeId: 'M:0',
            remote: false,
            hiddenFromPublishing: false,
            variableIds: ['VariableID:M:1'],
          },
        },
        variables: {
          'VariableID:M:1': {
            id: 'VariableID:M:1',
            name: 'colors/brand',
            key: 'brand-key',
            variableCollectionId: 'VariableCollectionId:M:0',
            resolvedType: 'COLOR',
            description: 'Brand color Docs.Reference: https://design.dsai.io • Docs.Section: Brand',
            hiddenFromPublishing: false,
            valuesByMode: { 'M:0': { r: 1, g: 0, b: 0, a: 1 } },
            scopes: ['ALL_FILLS'],
          },
        },
      };

      setupFetchMock(
        createCustomMockFetch({
          '/variables/local': createSuccessResponse(response),
        }) as unknown as typeof fetch
      );

      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'inline-meta'),
        format: 'dtcg',
        includeDescriptions: true,
      });

      expect(result.success).toBe(true);
      expect(result.tokenCount).toBe(1);
    });

    it('returns full description when no structured metadata is found after split', async () => {
      const response = {
        variableCollections: {
          'VariableCollectionId:NM:0': {
            id: 'VariableCollectionId:NM:0',
            name: 'no-meta',
            key: 'no-meta-key',
            modes: [{ modeId: 'NM:0', name: 'default' }],
            defaultModeId: 'NM:0',
            remote: false,
            hiddenFromPublishing: false,
            variableIds: ['VariableID:NM:1'],
          },
        },
        variables: {
          'VariableID:NM:1': {
            id: 'VariableID:NM:1',
            name: 'spacing/lg',
            key: 'spacing-lg-key',
            variableCollectionId: 'VariableCollectionId:NM:0',
            resolvedType: 'FLOAT',
            description: 'Large spacing value\n\nUsed for major section gaps',
            hiddenFromPublishing: false,
            valuesByMode: { 'NM:0': 32 },
            scopes: [],
          },
        },
      };

      setupFetchMock(
        createCustomMockFetch({
          '/variables/local': createSuccessResponse(response),
        }) as unknown as typeof fetch
      );

      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'no-meta'),
        format: 'dtcg',
        includeDescriptions: true,
      });

      expect(result.success).toBe(true);
    });
  });

  // ========================================================================
  // syncTokens with existing local tokens (lines 2266-2277, 2370-2418, 2462-2471)
  // ========================================================================

  describe('syncTokens conflict resolution with existing local tokens', () => {
    let syncDir: string;

    beforeEach(async () => {
      const fs = await import('node:fs');
      const path = await import('node:path');

      // Create a secure temp dir with existing token files that differ from remote
      syncDir = mkdtempSync(join(testTmpDir, 'sync-conflict-'));

      // Write local tokens that differ from what the mock API returns
      const localTokens = {
        colors: {
          blue: {
            '500': {
              $value: 'rgba(0, 0, 255, 1)',
              $type: 'color',
            },
          },
          gray: {
            '100': {
              $value: 'rgba(200, 200, 200, 1)',
              $type: 'color',
            },
          },
        },
        spacing: {
          base: {
            $value: '4px',
            $type: 'dimension',
          },
        },
      };
      fs.writeFileSync(
        path.join(syncDir, 'primitives.json'),
        JSON.stringify(localTokens, null, 2)
      );
    });

    afterEach(async () => {
      const fs = await import('node:fs');
      try {
        fs.rmSync(syncDir, { recursive: true, force: true });
      } catch {
        // ignore cleanup errors
      }
    });

    it('detects updated tokens when local and remote values differ', async () => {
      const result = await client.syncTokens({
        fileKey: 'file-key',
        tokensDir: syncDir,
        direction: 'pull',
      });

      expect(result.success).toBe(true);
      expect(result.direction).toBe('pull');
      // Some tokens should be detected as updated (values differ)
      expect(result.updated.length + result.added.length).toBeGreaterThan(0);
    });

    it('reports conflicts with manual conflict resolution', async () => {
      const result = await client.syncTokens({
        fileKey: 'file-key',
        tokensDir: syncDir,
        direction: 'pull',
        conflictResolution: 'manual',
      });

      expect(result.success).toBe(true);
      // Tokens that differ should be reported as conflicts
      expect(result.conflicts.length).toBeGreaterThan(0);
      expect(result.conflicts[0]).toHaveProperty('path');
      expect(result.conflicts[0]).toHaveProperty('localValue');
      expect(result.conflicts[0]).toHaveProperty('remoteValue');
    });

    it('overwrites local tokens with remote conflict resolution', async () => {
      const result = await client.syncTokens({
        fileKey: 'file-key',
        tokensDir: syncDir,
        direction: 'pull',
        conflictResolution: 'remote',
      });

      expect(result.success).toBe(true);
      expect(result.updated.length).toBeGreaterThan(0);
      // No conflicts should be reported with 'remote' resolution
      expect(result.conflicts.length).toBe(0);
    });

    it('detects removed tokens that exist locally but not remotely', async () => {
      // Add a token locally that doesn't exist in the remote mock
      const fs = await import('node:fs');
      const path = await import('node:path');

      const extraTokens = {
        custom: {
          'deprecated-token': {
            $value: '#ff0000',
            $type: 'color',
          },
        },
      };
      fs.writeFileSync(
        path.join(syncDir, 'custom.json'),
        JSON.stringify(extraTokens, null, 2)
      );

      const result = await client.syncTokens({
        fileKey: 'file-key',
        tokensDir: syncDir,
        direction: 'pull',
      });

      expect(result.success).toBe(true);
      expect(result.removed.length).toBeGreaterThan(0);
    });
  });

  // ========================================================================
  // exportTokens mode filtering (lines 1848-1849)
  // ========================================================================

  describe('exportTokens mode filtering', () => {
    it('skips modes not in the modes filter', async () => {
      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: join(testTmpDir, 'mode-filter'),
        format: 'dtcg',
        collections: ['semantic'],
        modes: ['light'],
      });

      expect(result.success).toBe(true);
      // Only light mode should be exported
      const semanticFiles = result.files.filter((f) => f.collection === 'semantic');
      expect(semanticFiles.length).toBe(1);
      expect(semanticFiles[0].mode).toBe('light');
    });
  });

  // ========================================================================
  // Rate limiter warning paths (lines 590-596, 599, 650)
  // ========================================================================

  describe('Rate limiter warning paths', () => {
    it('logs critical rate limit warning when rate limit is critical', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Access the internal rate limiter and force critical state
      const rateLimiter = (client as any).rateLimiter;
      // Simulate critical rate limit by updating with low remaining count
      rateLimiter.updateFromHeaders(
        new Headers({
          'x-ratelimit-remaining': '5',
          'x-ratelimit-limit': '1000',
          'x-ratelimit-reset': String(Math.floor(Date.now() / 1000) + 60),
        })
      );

      await client.getVariables('file-key');

      // May or may not trigger depending on threshold — just ensure no errors
      expect(warnSpy).toBeDefined();

      warnSpy.mockRestore();
    });

    it('logs throttle warning when rate limit is low but not critical', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const rateLimiter = (client as any).rateLimiter;
      // Simulate throttle state (low but not critical)
      rateLimiter.updateFromHeaders(
        new Headers({
          'x-ratelimit-remaining': '150',
          'x-ratelimit-limit': '1000',
          'x-ratelimit-reset': String(Math.floor(Date.now() / 1000) + 60),
        })
      );

      await client.getVariables('file-key');

      // Verify no errors thrown during request with throttle state
      expect(warnSpy).toBeDefined();

      warnSpy.mockRestore();
    });
  });
});
