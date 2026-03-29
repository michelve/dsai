/**
 * @file Tests for FigmaClient library analytics methods
 * @description Tests the 6 Library Analytics API endpoints
 */

import {
  mockComponentActionsByTeam,
  mockComponentUsagesByFile,
  mockActionsByTeam,
  mockUsagesByFile,
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
import { createFigmaClient } from '../client.js';

import type { FigmaClient } from '../client.js';

describe('FigmaClient Library Analytics', () => {
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
  // Component Actions
  // ========================================================================

  describe('getComponentActions', () => {
    it('sends GET to the correct endpoint with group_by=component', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getComponentActions('lib-key', 'component');

      expect(spy.calls).toHaveLength(1);
      expect(spy.calls[0].url).toContain('/analytics/libraries/lib-key/component/actions');
      expect(spy.calls[0].url).toContain('group_by=component');
    });

    it('sends GET with group_by=team', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getComponentActions('lib-key', 'team');

      expect(spy.calls[0].url).toContain('group_by=team');
    });

    it('includes optional date range params', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getComponentActions('lib-key', 'component', {
        startDate: '2026-01-01',
        endDate: '2026-03-29',
      });

      expect(spy.calls[0].url).toContain('start_date=2026-01-01');
      expect(spy.calls[0].url).toContain('end_date=2026-03-29');
    });

    it('includes cursor param for pagination', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getComponentActions('lib-key', 'component', {
        cursor: 'cursor-page-2',
      });

      expect(spy.calls[0].url).toContain('cursor=cursor-page-2');
    });

    it('returns paginated response with rows', async () => {
      const result = await client.getComponentActions('lib-key', 'component');

      expect(result.rows).toBeDefined();
      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.next_page).toBeDefined();
      expect(typeof result.cursor).toBe('string');
    });

    it('returns component-grouped rows with correct fields', async () => {
      const result = await client.getComponentActions('lib-key', 'component');

      const row = result.rows[0];
      expect(row).toHaveProperty('component_key');
      expect(row).toHaveProperty('week');
      expect(row).toHaveProperty('detachments');
      expect(row).toHaveProperty('insertions');
      expect(row).toHaveProperty('component_name');
    });

    it('returns team-grouped rows when group_by=team', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/component/actions': createSuccessResponse(mockComponentActionsByTeam),
        }) as unknown as typeof fetch
      );

      const result = await client.getComponentActions('lib-key', 'team');

      const row = result.rows[0];
      expect(row).toHaveProperty('team_name');
      expect(row).toHaveProperty('workspace_name');
      expect(row).toHaveProperty('insertions');
    });

    it('does not include date params when not provided', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getComponentActions('lib-key', 'component');

      expect(spy.calls[0].url).not.toContain('start_date');
      expect(spy.calls[0].url).not.toContain('end_date');
    });
  });

  // ========================================================================
  // Component Usages
  // ========================================================================

  describe('getComponentUsages', () => {
    it('sends GET to the correct endpoint with group_by=component', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getComponentUsages('lib-key', 'component');

      expect(spy.calls).toHaveLength(1);
      expect(spy.calls[0].url).toContain('/analytics/libraries/lib-key/component/usages');
      expect(spy.calls[0].url).toContain('group_by=component');
    });

    it('sends GET with group_by=file', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getComponentUsages('lib-key', 'file');

      expect(spy.calls[0].url).toContain('group_by=file');
    });

    it('includes cursor param for pagination', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getComponentUsages('lib-key', 'component', { cursor: 'abc' });

      expect(spy.calls[0].url).toContain('cursor=abc');
    });

    it('returns component-grouped rows with usage counts', async () => {
      const result = await client.getComponentUsages('lib-key', 'component');

      const row = result.rows[0];
      expect(row).toHaveProperty('component_key');
      expect(row).toHaveProperty('usages');
      expect(row).toHaveProperty('teams_using');
      expect(row).toHaveProperty('files_using');
    });

    it('returns file-grouped rows when group_by=file', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/component/usages': createSuccessResponse(mockComponentUsagesByFile),
        }) as unknown as typeof fetch
      );

      const result = await client.getComponentUsages('lib-key', 'file');

      const row = result.rows[0];
      expect(row).toHaveProperty('file_name');
      expect(row).toHaveProperty('team_name');
      expect(row).toHaveProperty('usages');
    });
  });

  // ========================================================================
  // Style Actions
  // ========================================================================

  describe('getStyleActions', () => {
    it('sends GET to the correct endpoint', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getStyleActions('lib-key', 'style');

      expect(spy.calls[0].url).toContain('/analytics/libraries/lib-key/style/actions');
      expect(spy.calls[0].url).toContain('group_by=style');
    });

    it('includes date range and cursor params', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getStyleActions('lib-key', 'team', {
        startDate: '2026-01-01',
        endDate: '2026-03-29',
        cursor: 'next',
      });

      expect(spy.calls[0].url).toContain('group_by=team');
      expect(spy.calls[0].url).toContain('start_date=2026-01-01');
      expect(spy.calls[0].url).toContain('end_date=2026-03-29');
      expect(spy.calls[0].url).toContain('cursor=next');
    });

    it('returns style-grouped rows', async () => {
      const result = await client.getStyleActions('lib-key', 'style');

      const row = result.rows[0];
      expect(row).toHaveProperty('style_key');
      expect(row).toHaveProperty('style_name');
      expect(row).toHaveProperty('style_type');
      expect(row).toHaveProperty('insertions');
    });

    it('returns team-grouped rows when group_by=team', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/style/actions': createSuccessResponse(mockActionsByTeam),
        }) as unknown as typeof fetch
      );

      const result = await client.getStyleActions('lib-key', 'team');

      const row = result.rows[0];
      expect(row).toHaveProperty('team_name');
      expect(row).toHaveProperty('workspace_name');
    });
  });

  // ========================================================================
  // Style Usages
  // ========================================================================

  describe('getStyleUsages', () => {
    it('sends GET to the correct endpoint', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getStyleUsages('lib-key', 'style');

      expect(spy.calls[0].url).toContain('/analytics/libraries/lib-key/style/usages');
      expect(spy.calls[0].url).toContain('group_by=style');
    });

    it('returns style-grouped rows with usage counts', async () => {
      const result = await client.getStyleUsages('lib-key', 'style');

      const row = result.rows[0];
      expect(row).toHaveProperty('style_key');
      expect(row).toHaveProperty('usages');
      expect(row).toHaveProperty('teams_using');
      expect(row).toHaveProperty('files_using');
    });

    it('returns file-grouped rows when group_by=file', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/style/usages': createSuccessResponse(mockUsagesByFile),
        }) as unknown as typeof fetch
      );

      const result = await client.getStyleUsages('lib-key', 'file');

      const row = result.rows[0];
      expect(row).toHaveProperty('file_name');
      expect(row).toHaveProperty('usages');
    });
  });

  // ========================================================================
  // Variable Actions
  // ========================================================================

  describe('getVariableActions', () => {
    it('sends GET to the correct endpoint', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getVariableActions('lib-key', 'variable');

      expect(spy.calls[0].url).toContain('/analytics/libraries/lib-key/variable/actions');
      expect(spy.calls[0].url).toContain('group_by=variable');
    });

    it('includes date range params', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getVariableActions('lib-key', 'variable', {
        startDate: '2025-06-01',
        endDate: '2026-03-29',
      });

      expect(spy.calls[0].url).toContain('start_date=2025-06-01');
      expect(spy.calls[0].url).toContain('end_date=2026-03-29');
    });

    it('returns variable-grouped rows', async () => {
      const result = await client.getVariableActions('lib-key', 'variable');

      const row = result.rows[0];
      expect(row).toHaveProperty('variable_key');
      expect(row).toHaveProperty('variable_name');
      expect(row).toHaveProperty('variable_type');
      expect(row).toHaveProperty('collection_key');
      expect(row).toHaveProperty('collection_name');
      expect(row).toHaveProperty('insertions');
      expect(row).toHaveProperty('detachments');
    });

    it('returns team-grouped rows when group_by=team', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/variable/actions': createSuccessResponse(mockActionsByTeam),
        }) as unknown as typeof fetch
      );

      const result = await client.getVariableActions('lib-key', 'team');

      const row = result.rows[0];
      expect(row).toHaveProperty('team_name');
    });
  });

  // ========================================================================
  // Variable Usages
  // ========================================================================

  describe('getVariableUsages', () => {
    it('sends GET to the correct endpoint', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getVariableUsages('lib-key', 'variable');

      expect(spy.calls[0].url).toContain('/analytics/libraries/lib-key/variable/usages');
      expect(spy.calls[0].url).toContain('group_by=variable');
    });

    it('returns variable-grouped rows with usage counts', async () => {
      const result = await client.getVariableUsages('lib-key', 'variable');

      const row = result.rows[0];
      expect(row).toHaveProperty('variable_key');
      expect(row).toHaveProperty('usages');
      expect(row).toHaveProperty('teams_using');
      expect(row).toHaveProperty('files_using');
    });

    it('returns file-grouped rows when group_by=file', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/variable/usages': createSuccessResponse(mockUsagesByFile),
        }) as unknown as typeof fetch
      );

      const result = await client.getVariableUsages('lib-key', 'file');

      const row = result.rows[0];
      expect(row).toHaveProperty('file_name');
    });
  });

  // ========================================================================
  // Shared Behavior
  // ========================================================================

  describe('Shared behavior', () => {
    it('throws on 403 for analytics endpoints', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/analytics/': createErrorResponse(403, error403Forbidden),
        }) as unknown as typeof fetch
      );

      await expect(
        client.getComponentActions('lib-key', 'component')
      ).rejects.toThrow();
    });

    it('does not include cursor param when not provided', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.getComponentActions('lib-key', 'component');

      expect(spy.calls[0].url).not.toContain('cursor');
    });

    it('pagination: next_page indicates more data', async () => {
      const result = await client.getComponentActions('lib-key', 'component');

      expect(result.next_page).toBe(true);
      expect(result.cursor).toBe('cursor-page-2');
    });
  });
});
