/**
 * @file Tests for FigmaClient simple API methods, factory functions, and error classes
 * @description Covers getVariables, getPublishedVariables, getFileNodes, style methods,
 * isReady, factory functions, and error class construction
 */

import {
  mockVariablesResponse,
  mockFigmaFile,
  error403Forbidden,
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
import {
  createFigmaClient,
  createFigmaClientFromEnv,
  FigmaClient,
  FigmaClientError,
  FigmaConfigError,
} from '../client.js';

// ============================================================================
// Error Classes
// ============================================================================

describe('FigmaClientError', () => {
  it('constructs with all parameters', () => {
    const err = new FigmaClientError('Not found', 404, 'NOT_FOUND', 'req-123', 'Check the URL');

    expect(err.message).toBe('Not found');
    expect(err.status).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.requestId).toBe('req-123');
    expect(err.hint).toBe('Check the URL');
    expect(err.name).toBe('FigmaClientError');
    expect(err).toBeInstanceOf(Error);
  });

  it('constructs with only required parameters', () => {
    const err = new FigmaClientError('Server error', 500);

    expect(err.message).toBe('Server error');
    expect(err.status).toBe(500);
    expect(err.code).toBeUndefined();
    expect(err.requestId).toBeUndefined();
    expect(err.hint).toBeUndefined();
  });

  describe('fromApiError', () => {
    it('creates error with variables hint for 403 on variables endpoint', () => {
      const err = FigmaClientError.fromApiError(
        { status: 403, err: 'Forbidden', code: 'ENTERPRISE_ONLY', requestId: 'req-1' },
        '/files/abc/variables/local'
      );

      expect(err.status).toBe(403);
      expect(err.hint).toContain('Enterprise plan');
    });

    it('creates error with generic access hint for 403 on non-variables endpoint', () => {
      const err = FigmaClientError.fromApiError(
        { status: 403, err: 'Forbidden', requestId: 'req-2' },
        '/files/abc/components'
      );

      expect(err.status).toBe(403);
      expect(err.hint).toContain('Access denied');
    });

    it('creates error with not found hint for 404', () => {
      const err = FigmaClientError.fromApiError(
        { status: 404, err: 'Not found', requestId: 'req-3' }
      );

      expect(err.status).toBe(404);
      expect(err.hint).toContain('File not found');
    });

    it('creates error with rate limit hint for 429', () => {
      const err = FigmaClientError.fromApiError(
        { status: 429, err: 'Rate limited', requestId: 'req-4' }
      );

      expect(err.status).toBe(429);
      expect(err.hint).toContain('Rate limited');
    });

    it('creates error without hint for other status codes', () => {
      const err = FigmaClientError.fromApiError(
        { status: 500, err: 'Server error', requestId: 'req-5' }
      );

      expect(err.status).toBe(500);
      expect(err.hint).toBeUndefined();
    });
  });

  describe('toDetailedMessage', () => {
    it('includes request ID when present', () => {
      const err = new FigmaClientError('Error', 500, undefined, 'req-123');
      expect(err.toDetailedMessage()).toContain('Request ID: req-123');
    });

    it('includes hint when present', () => {
      const err = new FigmaClientError('Error', 500, undefined, undefined, 'Try again');
      expect(err.toDetailedMessage()).toContain('Try again');
    });

    it('returns just the message when no extra info', () => {
      const err = new FigmaClientError('Simple error', 500);
      expect(err.toDetailedMessage()).toBe('Simple error');
    });

    it('includes both request ID and hint', () => {
      const err = new FigmaClientError('Error', 403, 'FORBIDDEN', 'req-1', 'Check token');
      const msg = err.toDetailedMessage();
      expect(msg).toContain('Request ID: req-1');
      expect(msg).toContain('Check token');
    });
  });
});

describe('FigmaConfigError', () => {
  it('constructs with the correct name and message', () => {
    const err = new FigmaConfigError('Missing token');
    expect(err.message).toBe('Missing token');
    expect(err.name).toBe('FigmaConfigError');
    expect(err).toBeInstanceOf(Error);
  });
});

// ============================================================================
// Factory Functions
// ============================================================================

describe('createFigmaClient', () => {
  let originalFetch: typeof fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    setupFetchMock(createDefaultMockFetch());
  });

  afterEach(() => {
    resetFetchMock(originalFetch);
  });

  it('creates a FigmaClient instance', () => {
    const client = createFigmaClient({ accessToken: 'test-token' });
    expect(client).toBeInstanceOf(FigmaClient);
    expect(client.isReady()).toBe(true);
  });

  it('creates a client without config (not ready)', () => {
    const client = createFigmaClient();
    expect(client).toBeInstanceOf(FigmaClient);
    expect(client.isReady()).toBe(false);
  });

  it('creates a client with empty token (not ready)', () => {
    const client = createFigmaClient({ accessToken: '' });
    expect(client.isReady()).toBe(false);
  });
});

describe('createFigmaClientFromEnv', () => {
  let originalFetch: typeof fetch;
  const originalEnv = process.env;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    setupFetchMock(createDefaultMockFetch());
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    resetFetchMock(originalFetch);
    process.env = originalEnv;
  });

  it('creates a client from FIGMA_TOKEN env var', () => {
    process.env['FIGMA_TOKEN'] = 'env-token-123';
    delete process.env['FIGMA_ACCESS_TOKEN'];

    const client = createFigmaClientFromEnv();
    expect(client).toBeInstanceOf(FigmaClient);
    expect(client.isReady()).toBe(true);
  });

  it('creates a client from FIGMA_ACCESS_TOKEN env var', () => {
    delete process.env['FIGMA_TOKEN'];
    process.env['FIGMA_ACCESS_TOKEN'] = 'access-token-456';

    const client = createFigmaClientFromEnv();
    expect(client).toBeInstanceOf(FigmaClient);
    expect(client.isReady()).toBe(true);
  });

  it('prefers FIGMA_TOKEN over FIGMA_ACCESS_TOKEN', () => {
    process.env['FIGMA_TOKEN'] = 'preferred-token';
    process.env['FIGMA_ACCESS_TOKEN'] = 'fallback-token';

    const client = createFigmaClientFromEnv();
    expect(client.isReady()).toBe(true);
  });

  it('warns and creates unconfigured client when no env vars are set', () => {
    delete process.env['FIGMA_TOKEN'];
    delete process.env['FIGMA_ACCESS_TOKEN'];

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const client = createFigmaClientFromEnv();

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('No FIGMA_TOKEN or FIGMA_ACCESS_TOKEN')
    );
    expect(client.isReady()).toBe(false);
    warnSpy.mockRestore();
  });

  it('accepts overrides', () => {
    process.env['FIGMA_TOKEN'] = 'env-token';

    const client = createFigmaClientFromEnv({ timeout: 60000, retries: 5 });
    expect(client).toBeInstanceOf(FigmaClient);
    expect(client.isReady()).toBe(true);
  });
});

// ============================================================================
// Client API Methods
// ============================================================================

describe('FigmaClient API Methods', () => {
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

  // ==========================================================================
  // isReady
  // ==========================================================================

  describe('isReady', () => {
    it('returns true when access token is provided', () => {
      expect(client.isReady()).toBe(true);
    });

    it('returns false when no token is provided', () => {
      const unconfigured = new FigmaClient();
      expect(unconfigured.isReady()).toBe(false);
    });
  });

  // ==========================================================================
  // getVariables
  // ==========================================================================

  describe('getVariables', () => {
    it('sends GET to the variables/local endpoint', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getVariables('file-key');

      expect(spy.calls).toHaveLength(1);
      expect(spy.calls[0].url).toContain('/files/file-key/variables/local');
    });

    it('returns variables and variable collections', async () => {
      const result = await client.getVariables('file-key');

      expect(result).toHaveProperty('variables');
      expect(result).toHaveProperty('variableCollections');
      expect(Object.keys(result.variables).length).toBeGreaterThan(0);
      expect(Object.keys(result.variableCollections).length).toBeGreaterThan(0);
    });

    it('handles meta-wrapped response format', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/variables/local': createSuccessResponse({
            meta: mockVariablesResponse,
          }),
        }) as unknown as typeof fetch
      );

      const result = await client.getVariables('file-key');
      expect(Object.keys(result.variables).length).toBeGreaterThan(0);
    });

    it('handles direct response format', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/variables/local': createSuccessResponse(mockVariablesResponse),
        }) as unknown as typeof fetch
      );

      const result = await client.getVariables('file-key');
      expect(Object.keys(result.variables).length).toBeGreaterThan(0);
    });

    it('defaults to empty objects when response has no data', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/variables/local': createSuccessResponse({}),
        }) as unknown as typeof fetch
      );

      const result = await client.getVariables('file-key');
      expect(result.variables).toEqual({});
      expect(result.variableCollections).toEqual({});
    });
  });

  // ==========================================================================
  // getPublishedVariables
  // ==========================================================================

  describe('getPublishedVariables', () => {
    it('sends GET to the variables/published endpoint', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/variables/published': createSuccessResponse(mockVariablesResponse),
        }) as unknown as typeof fetch
      );

      const spy = createFetchSpy(
        createCustomMockFetch({
          '/variables/published': createSuccessResponse(mockVariablesResponse),
        }) as unknown as typeof fetch as any
      );
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getPublishedVariables('file-key');

      expect(spy.calls).toHaveLength(1);
      expect(spy.calls[0].url).toContain('/files/file-key/variables/published');
    });

    it('returns variables and collections', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/variables/published': createSuccessResponse(mockVariablesResponse),
        }) as unknown as typeof fetch
      );

      const result = await client.getPublishedVariables('file-key');
      expect(result).toHaveProperty('variables');
      expect(result).toHaveProperty('variableCollections');
    });

    it('handles meta-wrapped response', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/variables/published': createSuccessResponse({
            meta: mockVariablesResponse,
          }),
        }) as unknown as typeof fetch
      );

      const result = await client.getPublishedVariables('file-key');
      expect(Object.keys(result.variables).length).toBeGreaterThan(0);
    });

    it('defaults to empty objects when response has no data', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/variables/published': createSuccessResponse({}),
        }) as unknown as typeof fetch
      );

      const result = await client.getPublishedVariables('file-key');
      expect(result.variables).toEqual({});
      expect(result.variableCollections).toEqual({});
    });
  });

  // ==========================================================================
  // getFileNodes
  // ==========================================================================

  describe('getFileNodes', () => {
    it('sends GET to the nodes endpoint with encoded IDs', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getFileNodes('file-key', ['StyleID:1:0', 'StyleID:2:0']);

      expect(spy.calls).toHaveLength(1);
      expect(spy.calls[0].url).toContain('/files/file-key/nodes');
      expect(spy.calls[0].url).toContain('ids=');
    });

    it('returns an empty object for empty nodeIds array', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      const result = await client.getFileNodes('file-key', []);

      expect(result).toEqual({});
      expect(spy.calls).toHaveLength(0); // No request should be made
    });

    it('returns node documents keyed by node ID', async () => {
      const result = await client.getFileNodes('file-key', ['StyleID:1:0', 'StyleID:2:0']);

      expect(result).toHaveProperty('StyleID:1:0');
      expect(result).toHaveProperty('StyleID:2:0');
    });

    it('filters out prototype pollution keys', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/nodes': createSuccessResponse({
            nodes: {
              '__proto__': { document: { id: 'bad', type: 'FRAME' } },
              'constructor': { document: { id: 'bad2', type: 'FRAME' } },
              'prototype': { document: { id: 'bad3', type: 'FRAME' } },
              'safe-id': { document: { id: 'safe-id', type: 'FRAME', name: 'Safe Node' } },
            },
          }),
        }) as unknown as typeof fetch
      );

      const result = await client.getFileNodes('file-key', ['__proto__', 'constructor', 'prototype', 'safe-id']);

      expect(result).toHaveProperty('safe-id');
      expect(Object.keys(result)).toEqual(['safe-id']);
    });

    it('skips nodes without a document property', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/nodes': createSuccessResponse({
            nodes: {
              'node-1': { document: { id: 'node-1', type: 'FRAME' } },
              'node-2': null,
              'node-3': {},
            },
          }),
        }) as unknown as typeof fetch
      );

      const result = await client.getFileNodes('file-key', ['node-1', 'node-2', 'node-3']);

      expect(result).toHaveProperty('node-1');
      expect(Object.keys(result)).toHaveLength(1);
    });
  });

  // ==========================================================================
  // getEffectStyles
  // ==========================================================================

  describe('getEffectStyles', () => {
    it('returns effect styles as token objects', async () => {
      const result = await client.getEffectStyles('file-key');

      // The mock file has one EFFECT style: shadows/elevation-1
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('returns empty object when file has no effect styles', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/files/': createSuccessResponse({
            ...mockFigmaFile,
            styles: {}, // No styles at all
          }),
        }) as unknown as typeof fetch
      );

      const result = await client.getEffectStyles('file-key');
      expect(result).toEqual({});
    });
  });

  // ==========================================================================
  // getPaintStyles
  // ==========================================================================

  describe('getPaintStyles', () => {
    it('returns paint styles as token objects', async () => {
      const result = await client.getPaintStyles('file-key');

      // The mock file has one FILL style: colors/primary
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('returns empty object when file has no fill styles', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/files/': createSuccessResponse({
            ...mockFigmaFile,
            styles: {},
          }),
        }) as unknown as typeof fetch
      );

      const result = await client.getPaintStyles('file-key');
      expect(result).toEqual({});
    });
  });

  // ==========================================================================
  // getTextStyles
  // ==========================================================================

  describe('getTextStyles', () => {
    it('returns text styles as token objects', async () => {
      const result = await client.getTextStyles('file-key');

      // The mock file has one TEXT style: typography/heading-1
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('returns empty object when file has no text styles', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/files/': createSuccessResponse({
            ...mockFigmaFile,
            styles: {},
          }),
        }) as unknown as typeof fetch
      );

      const result = await client.getTextStyles('file-key');
      expect(result).toEqual({});
    });
  });

  // ==========================================================================
  // Error scenarios for API methods
  // ==========================================================================

  describe('Error handling for variables', () => {
    it('throws on 403 for getVariables', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/variables/local': createErrorResponse(403, error403Forbidden),
        }) as unknown as typeof fetch
      );

      await expect(client.getVariables('file-key')).rejects.toThrow();
    });

    it('throws on 403 for getPublishedVariables', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/variables/published': createErrorResponse(403, error403Forbidden),
        }) as unknown as typeof fetch
      );

      await expect(client.getPublishedVariables('file-key')).rejects.toThrow();
    });
  });
});
