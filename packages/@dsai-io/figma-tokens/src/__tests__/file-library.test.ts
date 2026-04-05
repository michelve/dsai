/**
 * @file Tests for FigmaClient file, library, version, and metadata methods
 * @description Tests for published components/styles, version history, user, and file metadata
 */

import {
  error403Forbidden,
} from '../../test/fixtures/figma-api-responses.js';
import {
  createDefaultMockFetch,
  createCustomMockFetch,
  createFetchSpy,
  createErrorResponse,
  setupFetchMock,
  resetFetchMock,
} from '../../test/mocks/fetch-mock.js';
import { createFigmaClient } from '../client.js';

import type { FigmaClient } from '../client.js';

// ============================================================================
// HTTP Status Code Constants
// ============================================================================

const HTTP_FORBIDDEN = 403;

describe('FigmaClient File & Library', () => {
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
  // Published Components
  // ========================================================================

  describe('getPublishedComponents', () => {
    it('sends GET to the correct endpoint', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getPublishedComponents('file-key');

      expect(spy.calls).toHaveLength(1);
      expect(spy.calls[0].url).toContain('/files/file-key/components');
    });

    it('returns array of published components', async () => {
      const result = await client.getPublishedComponents('file-key');

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('key');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('file_key');
      expect(result[0]).toHaveProperty('user');
      expect(result[0]).toHaveProperty('containing_frame');
    });
  });

  // ========================================================================
  // Published Component Sets
  // ========================================================================

  describe('getPublishedComponentSets', () => {
    it('sends GET to the correct endpoint', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getPublishedComponentSets('file-key');

      expect(spy.calls[0].url).toContain('/files/file-key/component_sets');
    });

    it('returns array of published component sets', async () => {
      const result = await client.getPublishedComponentSets('file-key');

      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toHaveProperty('key');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('containing_frame');
    });
  });

  // ========================================================================
  // Published Styles
  // ========================================================================

  describe('getPublishedStyles', () => {
    it('sends GET to the correct endpoint', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getPublishedStyles('file-key');

      expect(spy.calls[0].url).toContain('/files/file-key/styles');
    });

    it('returns array of published styles', async () => {
      const result = await client.getPublishedStyles('file-key');

      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toHaveProperty('key');
      expect(result[0]).toHaveProperty('style_type');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('sort_position');
    });
  });

  // ========================================================================
  // Single Component Lookup
  // ========================================================================

  describe('getComponent', () => {
    it('sends GET to /v1/components/:key', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getComponent('comp-key-1');

      expect(spy.calls[0].url).toContain('/components/comp-key-1');
      expect(spy.calls[0].url).not.toContain('/files/');
    });

    it('returns component metadata', async () => {
      const result = await client.getComponent('comp-key-1');

      expect(result).toHaveProperty('key');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('user');
    });
  });

  // ========================================================================
  // Single Component Set Lookup
  // ========================================================================

  describe('getComponentSet', () => {
    it('sends GET to /v1/component_sets/:key', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getComponentSet('set-key-1');

      expect(spy.calls[0].url).toContain('/component_sets/set-key-1');
      expect(spy.calls[0].url).not.toContain('/files/');
    });

    it('returns component set metadata', async () => {
      const result = await client.getComponentSet('set-key-1');

      expect(result).toHaveProperty('key');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('containing_frame');
    });
  });

  // ========================================================================
  // Single Style Lookup
  // ========================================================================

  describe('getStyle', () => {
    it('sends GET to /v1/styles/:key', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getStyle('style-key-1');

      expect(spy.calls[0].url).toContain('/styles/style-key-1');
      expect(spy.calls[0].url).not.toContain('/files/');
    });

    it('returns style metadata', async () => {
      const result = await client.getStyle('style-key-1');

      expect(result).toHaveProperty('key');
      expect(result).toHaveProperty('style_type');
      expect(result).toHaveProperty('name');
    });
  });

  // ========================================================================
  // Version History
  // ========================================================================

  describe('getVersionHistory', () => {
    it('sends GET to the correct endpoint', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getVersionHistory('file-key');

      expect(spy.calls[0].url).toContain('/files/file-key/versions');
    });

    it('returns versions array with pagination', async () => {
      const result = await client.getVersionHistory('file-key');

      expect(result.versions).toBeInstanceOf(Array);
      expect(result.versions.length).toBeGreaterThan(0);
      expect(result.versions[0]).toHaveProperty('id');
      expect(result.versions[0]).toHaveProperty('created_at');
      expect(result.versions[0]).toHaveProperty('label');
      expect(result.versions[0]).toHaveProperty('user');
      expect(result.pagination).toBeDefined();
    });

    it('returns pagination cursors', async () => {
      const result = await client.getVersionHistory('file-key');

      expect(result.pagination).toHaveProperty('prev_page');
      expect(result.pagination).toHaveProperty('next_page');
      expect(result.pagination.next_page).toContain('after=ver-2');
    });
  });

  // ========================================================================
  // File Metadata
  // ========================================================================

  describe('getFileMetadata', () => {
    it('sends GET to /v1/files/:key/meta', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getFileMetadata('file-key');

      expect(spy.calls[0].url).toContain('/files/file-key/meta');
    });

    it('returns file metadata', async () => {
      const result = await client.getFileMetadata('file-key');

      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('last_touched_at');
      expect(result).toHaveProperty('creator');
      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('version');
    });
  });

  // ========================================================================
  // Authenticated User
  // ========================================================================

  describe('getMe', () => {
    it('sends GET to /v1/me', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getMe();

      expect(spy.calls[0].url).toContain('/me');
    });

    it('returns user info with email', async () => {
      const result = await client.getMe();

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('handle');
      expect(result).toHaveProperty('img_url');
      expect(result).toHaveProperty('email');
    });
  });

  // ========================================================================
  // Error Handling
  // ========================================================================

  describe('Error handling', () => {
    it('throws on 403 for library endpoints', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/components': createErrorResponse(HTTP_FORBIDDEN, error403Forbidden),
        }) as unknown as typeof fetch
      );

      await expect(client.getPublishedComponents('file-key')).rejects.toThrow();
    });

    it('throws on 403 for version history', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/versions': createErrorResponse(HTTP_FORBIDDEN, error403Forbidden),
        }) as unknown as typeof fetch
      );

      await expect(client.getVersionHistory('file-key')).rejects.toThrow();
    });
  });
});
