/**
 * @file Tests for FigmaClient.postVariables()
 * @description Tests the POST /v1/files/:file_key/variables endpoint
 */

import { FigmaClient, createFigmaClient } from '../client.js';
import type {
  FigmaPostVariablesRequest,
  FigmaPostVariablesResponse,
} from '../types.js';
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
  mockPostVariablesResponse,
  mockPostVariablesResponseNoTempIds,
  error403Forbidden,
  error413PayloadTooLarge,
} from '../../test/fixtures/figma-api-responses.js';

describe('FigmaClient.postVariables', () => {
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

  describe('Request Formation', () => {
    it('sends a POST request to the correct endpoint', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.postVariables('file-key-123', {
        variables: [
          {
            action: 'CREATE',
            id: 'temp-var-1',
            name: 'colors/primary',
            variableCollectionId: 'VariableCollectionId:1:0',
            resolvedType: 'COLOR',
          },
        ],
      });

      expect(spy.calls).toHaveLength(1);
      expect(spy.calls[0].url).toContain('/files/file-key-123/variables');
      expect(spy.calls[0].url).not.toContain('/variables/local');
      expect(spy.calls[0].url).not.toContain('/variables/published');
      expect(spy.calls[0].options?.method).toBe('POST');
    });

    it('sends the request body as JSON', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      const request: FigmaPostVariablesRequest = {
        variableCollections: [
          { action: 'CREATE', id: 'temp-coll', name: 'My Collection' },
        ],
        variableModes: [
          { action: 'CREATE', id: 'temp-mode', name: 'Dark', variableCollectionId: 'temp-coll' },
        ],
        variables: [
          {
            action: 'CREATE',
            id: 'temp-var',
            name: 'spacing/sm',
            variableCollectionId: 'temp-coll',
            resolvedType: 'FLOAT',
          },
        ],
        variableModeValues: [
          { variableId: 'temp-var', modeId: 'temp-mode', value: 8 },
        ],
      };

      await client.postVariables('file-key', request);

      const body = JSON.parse(spy.calls[0].options?.body as string);
      expect(body.variableCollections).toHaveLength(1);
      expect(body.variableModes).toHaveLength(1);
      expect(body.variables).toHaveLength(1);
      expect(body.variableModeValues).toHaveLength(1);
    });
  });

  describe('Response Handling', () => {
    it('returns the temp ID to real ID mapping', async () => {
      const result = await client.postVariables('file-key', {
        variables: [
          {
            action: 'CREATE',
            id: 'temp-var-1',
            name: 'test',
            variableCollectionId: 'VariableCollectionId:1:0',
            resolvedType: 'STRING',
          },
        ],
      });

      expect(result.status).toBe(200);
      expect(result.error).toBe(false);
      expect(result.meta.tempIdToRealId).toBeDefined();
      expect(result.meta.tempIdToRealId['temp-var-1']).toBe('VariableID:99:1');
    });

    it('handles response with no temp IDs', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/variables': createSuccessResponse(mockPostVariablesResponseNoTempIds),
        }) as unknown as typeof fetch
      );

      const result = await client.postVariables('file-key', {
        variables: [
          {
            action: 'UPDATE',
            id: 'VariableID:1:1',
            description: 'Updated description',
          },
        ],
      });

      expect(result.meta.tempIdToRealId).toEqual({});
    });
  });

  describe('All Action Types', () => {
    it('supports CREATE action for collections', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.postVariables('file-key', {
        variableCollections: [
          { action: 'CREATE', id: 'temp-coll', name: 'New Collection' },
        ],
      });

      const body = JSON.parse(spy.calls[0].options?.body as string);
      expect(body.variableCollections[0].action).toBe('CREATE');
      expect(body.variableCollections[0].name).toBe('New Collection');
    });

    it('supports UPDATE action for variables', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.postVariables('file-key', {
        variables: [
          {
            action: 'UPDATE',
            id: 'VariableID:1:1',
            description: 'Updated via API',
            scopes: ['ALL_FILLS'],
          },
        ],
      });

      const body = JSON.parse(spy.calls[0].options?.body as string);
      expect(body.variables[0].action).toBe('UPDATE');
      expect(body.variables[0].id).toBe('VariableID:1:1');
    });

    it('supports DELETE action for variables', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.postVariables('file-key', {
        variables: [
          { action: 'DELETE', id: 'VariableID:1:1' },
        ],
      });

      const body = JSON.parse(spy.calls[0].options?.body as string);
      expect(body.variables[0].action).toBe('DELETE');
    });

    it('supports setting mode values with color', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.postVariables('file-key', {
        variableModeValues: [
          {
            variableId: 'VariableID:1:1',
            modeId: '1:0',
            value: { r: 0.2, g: 0.4, b: 0.8, a: 1 },
          },
        ],
      });

      const body = JSON.parse(spy.calls[0].options?.body as string);
      expect(body.variableModeValues[0].value).toEqual({ r: 0.2, g: 0.4, b: 0.8, a: 1 });
    });

    it('supports setting mode values with alias', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.postVariables('file-key', {
        variableModeValues: [
          {
            variableId: 'VariableID:2:1',
            modeId: '2:0',
            value: { type: 'VARIABLE_ALIAS', id: 'VariableID:1:1' },
          },
        ],
      });

      const body = JSON.parse(spy.calls[0].options?.body as string);
      expect(body.variableModeValues[0].value).toEqual({
        type: 'VARIABLE_ALIAS',
        id: 'VariableID:1:1',
      });
    });

    it('supports null value for removing overrides', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.postVariables('file-key', {
        variableModeValues: [
          {
            variableId: 'VariableID:2:1',
            modeId: 'VariableCollectionId:2:5/2:0',
            value: null,
          },
        ],
      });

      const body = JSON.parse(spy.calls[0].options?.body as string);
      expect(body.variableModeValues[0].value).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('throws on 403 with enterprise plan hint', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/variables': createErrorResponse(403, error403Forbidden),
        }) as unknown as typeof fetch
      );

      await expect(
        client.postVariables('file-key', {
          variables: [{ action: 'CREATE', id: 'x', name: 'test', variableCollectionId: 'c', resolvedType: 'STRING' }],
        })
      ).rejects.toThrow();
    });

    it('throws on 413 payload too large', async () => {
      setupFetchMock(
        createCustomMockFetch({
          '/variables': createErrorResponse(413, error413PayloadTooLarge),
        }) as unknown as typeof fetch
      );

      await expect(
        client.postVariables('file-key', {
          variables: [{ action: 'CREATE', id: 'x', name: 'test', variableCollectionId: 'c', resolvedType: 'STRING' }],
        })
      ).rejects.toThrow();
    });
  });

  describe('Empty Request', () => {
    it('sends an empty body when no changes provided', async () => {
      const spy = createFetchSpy(createDefaultMockFetch());
      setupFetchMock(spy.fetch as unknown as typeof fetch);

      await client.postVariables('file-key', {});

      const body = JSON.parse(spy.calls[0].options?.body as string);
      expect(body).toEqual({});
    });
  });
});
