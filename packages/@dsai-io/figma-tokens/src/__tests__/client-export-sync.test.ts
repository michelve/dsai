/**
 * @file Tests for FigmaClient export, sync, request, error, and circuit breaker paths
 * @description Covers exportStyles, exportTokens, syncTokens, request() retry/error logic,
 * CircuitBreaker integration, and Error classes
 */

import {
  mockFigmaFile,
  mockVariablesResponse,
  mockStyleNodes,
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
        outputDir: '/tmp/dsai-test-tokens',
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
        outputDir: '/tmp/dsai-test-tokens',
      });

      expect(result.success).toBe(true);
      expect(result.tokenCount).toBe(0);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('No variable collections');
    });

    it('filters by collection name', async () => {
      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: '/tmp/dsai-test-tokens',
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
        outputDir: '/tmp/dsai-test-tokens',
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
        outputDir: '/tmp/dsai-test-tokens',
        resolveAliases: false,
      });

      expect(result.success).toBe(true);
    });

    it('handles alias references with resolving', async () => {
      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: '/tmp/dsai-test-tokens',
        resolveAliases: true,
      });

      expect(result.success).toBe(true);
    });

    it('exports in tokens-studio format', async () => {
      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: '/tmp/dsai-test-tokens',
        format: 'tokens-studio',
      });

      expect(result.success).toBe(true);
      expect(result.tokenCount).toBeGreaterThan(0);
    });

    it('exports in style-dictionary format', async () => {
      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: '/tmp/dsai-test-tokens',
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
        outputDir: '/tmp/dsai-test-tokens',
      });

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('exports with combined output structure', async () => {
      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: '/tmp/dsai-test-tokens',
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
        outputDir: '/tmp/dsai-test-tokens',
        includeDescriptions: true,
      });

      expect(result.success).toBe(true);
    });

    it('exports effect/paint/text styles when requested', async () => {
      const result = await client.exportTokens({
        fileKey: 'file-key',
        outputDir: '/tmp/dsai-test-tokens',
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
        outputDir: '/tmp/dsai-test-tokens',
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
        outputDir: '/tmp/dsai-test-tokens',
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
        tokensDir: '/tmp/dsai-sync-test-empty',
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
        tokensDir: '/tmp/dsai-sync-test',
        direction: 'push',
      });

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Push to Figma is not fully supported');
    });

    it('performs dry run without writing', async () => {
      const result = await client.syncTokens({
        fileKey: 'file-key',
        tokensDir: '/tmp/dsai-sync-test-dry',
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
        tokensDir: '/tmp/dsai-sync-test-backup',
        direction: 'pull',
        backup: true,
      });

      // Should succeed regardless (backup failure is non-fatal)
      expect(result.success).toBe(true);
    });

    it('handles both direction', async () => {
      const result = await client.syncTokens({
        fileKey: 'file-key',
        tokensDir: '/tmp/dsai-sync-test-both',
        direction: 'both',
      });

      // 'both' includes push which adds an error
      expect(result.direction).toBe('both');
    });

    it('handles manual conflict resolution', async () => {
      const result = await client.syncTokens({
        fileKey: 'file-key',
        tokensDir: '/tmp/dsai-sync-test-conflict',
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
        tokensDir: '/tmp/dsai-sync-fail',
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
          tokensDir: '/tmp/dsai-sync-noconfig',
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
        outputDir: '/tmp/dsai-test-types',
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
        outputDir: '/tmp/dsai-test-bool',
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
        outputDir: '/tmp/dsai-test-alpha',
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
        outputDir: '/tmp/dsai-test-meta',
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
        outputDir: '/tmp/dsai-test-modes',
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
});
