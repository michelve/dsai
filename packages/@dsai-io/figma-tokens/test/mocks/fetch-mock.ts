/**
 * @file Mock Fetch Utility for Testing
 * @description Provides fetch mocking utilities for FigmaClient tests
 */

import {
  mockFigmaFile,
  mockVariablesResponse,
  mockStyleNodes,
  mockPostVariablesResponse,
  mockComponentActionsByComponent,
  mockComponentUsagesByComponent,
  mockStyleActionsByStyle,
  mockStyleUsagesByStyle,
  mockVariableActionsByVariable,
  mockVariableUsagesByVariable,
  mockPublishedComponentsResponse,
  mockPublishedComponentSetsResponse,
  mockPublishedStylesResponse,
  mockSingleComponentResponse,
  mockSingleComponentSetResponse,
  mockSingleStyleResponse,
  mockVersionsResponse,
  mockFileMetadataResponse,
  mockMeResponse,
  error403Forbidden,
  error404NotFound,
  error429RateLimited,
  error500ServerError,
} from '../fixtures/figma-api-responses.js';

// ============================================================================
// Types
// ============================================================================

interface MockFetchResponse {
  ok: boolean;
  status: number;
  statusText: string;
  headers: Map<string, string>;
  json: () => Promise<unknown>;
}

type MockFetchHandler = (url: string, options?: RequestInit) => Promise<MockFetchResponse>;

// ============================================================================
// Mock Response Builders
// ============================================================================

/**
 * Create a successful mock response
 */
function createSuccessResponse(data: unknown, requestId?: string): MockFetchResponse {
  const headers = new Map<string, string>();
  if (requestId) {
    headers.set('x-request-id', requestId);
  }

  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: {
      ...headers,
      get: (key: string) => headers.get(key) ?? null,
    } as unknown as Map<string, string>,
    json: () => Promise.resolve(data),
  };
}

/**
 * Create an error mock response
 */
function createErrorResponse(
  status: number,
  error: { err: string; code?: string },
  requestId?: string
): MockFetchResponse {
  const headers = new Map<string, string>();
  if (requestId) {
    headers.set('x-request-id', requestId);
  }

  return {
    ok: false,
    status,
    statusText: error.err,
    headers: {
      ...headers,
      get: (key: string) => headers.get(key) ?? null,
    } as unknown as Map<string, string>,
    json: () => Promise.resolve(error),
  };
}

// ============================================================================
// Preset Mock Handlers
// ============================================================================

/**
 * Default mock handler that responds with appropriate test data
 */
export function createDefaultMockFetch(): MockFetchHandler {
  return (url: string, options?: RequestInit): Promise<MockFetchResponse> => {
    // User endpoint
    if (url.includes('/v1/me') || url.endsWith('/me')) {
      return Promise.resolve(createSuccessResponse(mockMeResponse, 'req-me'));
    }

    // Single component/component_set/style by key
    if (url.match(/\/components\/[^/]+$/) && !url.includes('/files/')) {
      return Promise.resolve(createSuccessResponse(mockSingleComponentResponse, 'req-comp'));
    }
    if (url.match(/\/component_sets\/[^/]+$/) && !url.includes('/files/')) {
      return Promise.resolve(createSuccessResponse(mockSingleComponentSetResponse, 'req-comp-set'));
    }
    if (url.match(/\/styles\/[^/]+$/) && !url.includes('/files/')) {
      return Promise.resolve(createSuccessResponse(mockSingleStyleResponse, 'req-style'));
    }

    // File-level library endpoints
    if (url.includes('/components') && !url.includes('/analytics') && !url.includes('/component_sets')) {
      return Promise.resolve(createSuccessResponse(mockPublishedComponentsResponse, 'req-pub-comps'));
    }
    if (url.includes('/component_sets')) {
      return Promise.resolve(createSuccessResponse(mockPublishedComponentSetsResponse, 'req-pub-sets'));
    }
    if (url.includes('/styles') && !url.includes('/analytics')) {
      return Promise.resolve(createSuccessResponse(mockPublishedStylesResponse, 'req-pub-styles'));
    }

    // Version history
    if (url.includes('/versions')) {
      return Promise.resolve(createSuccessResponse(mockVersionsResponse, 'req-versions'));
    }

    // File metadata
    if (url.includes('/meta')) {
      return Promise.resolve(createSuccessResponse(mockFileMetadataResponse, 'req-meta'));
    }

    // Analytics endpoints
    if (url.includes('/analytics/libraries/')) {
      if (url.includes('/component/actions')) {
        return Promise.resolve(createSuccessResponse(mockComponentActionsByComponent, 'req-comp-actions'));
      }
      if (url.includes('/component/usages')) {
        return Promise.resolve(createSuccessResponse(mockComponentUsagesByComponent, 'req-comp-usages'));
      }
      if (url.includes('/style/actions')) {
        return Promise.resolve(createSuccessResponse(mockStyleActionsByStyle, 'req-style-actions'));
      }
      if (url.includes('/style/usages')) {
        return Promise.resolve(createSuccessResponse(mockStyleUsagesByStyle, 'req-style-usages'));
      }
      if (url.includes('/variable/actions')) {
        return Promise.resolve(createSuccessResponse(mockVariableActionsByVariable, 'req-var-actions'));
      }
      if (url.includes('/variable/usages')) {
        return Promise.resolve(createSuccessResponse(mockVariableUsagesByVariable, 'req-var-usages'));
      }
    }

    // POST to variables endpoint
    if (url.includes('/variables') && options?.method === 'POST') {
      return Promise.resolve(createSuccessResponse(mockPostVariablesResponse, 'req-post-vars-test'));
    }

    // Match variables endpoint FIRST (more specific)
    if (url.includes('/variables/local')) {
      return Promise.resolve(createSuccessResponse(mockVariablesResponse, 'req-vars-test'));
    }

    // Match nodes endpoint (for styles)
    if (url.includes('/nodes')) {
      return Promise.resolve(createSuccessResponse(mockStyleNodes, 'req-nodes-test'));
    }

    // Match file endpoint (general)
    if (url.includes('/files/')) {
      return Promise.resolve(createSuccessResponse(mockFigmaFile, 'req-file-test'));
    }

    // Default: 404
    return Promise.resolve(createErrorResponse(404, { err: 'Not found' }, 'req-default-404'));
  };
}

/**
 * Mock handler that always returns 403 for variables endpoint
 */
export function createEnterpriseMockFetch(): MockFetchHandler {
  return (url: string): Promise<MockFetchResponse> => {
    if (url.includes('/variables/local')) {
      return Promise.resolve(
        createErrorResponse(403, error403Forbidden, error403Forbidden.requestId)
      );
    }

    // Other endpoints work normally
    return createDefaultMockFetch()(url);
  };
}

/**
 * Mock handler that returns 404 for file operations
 */
export function createNotFoundMockFetch(): MockFetchHandler {
  return (): Promise<MockFetchResponse> => {
    return Promise.resolve(createErrorResponse(404, error404NotFound, error404NotFound.requestId));
  };
}

/**
 * Mock handler that simulates rate limiting
 */
export function createRateLimitedMockFetch(): MockFetchHandler {
  return (): Promise<MockFetchResponse> => {
    return Promise.resolve(
      createErrorResponse(429, error429RateLimited, error429RateLimited.requestId)
    );
  };
}

/**
 * Mock handler that simulates server errors with retry behavior
 */
export function createRetryableMockFetch(failCount = 2): MockFetchHandler {
  let callCount = 0;

  return (url: string): Promise<MockFetchResponse> => {
    callCount++;

    if (callCount <= failCount) {
      return Promise.resolve(
        createErrorResponse(500, error500ServerError, `req-retry-${callCount}`)
      );
    }

    // After failCount failures, succeed
    return createDefaultMockFetch()(url);
  };
}

/**
 * Mock handler that times out
 */
export function createTimeoutMockFetch(): MockFetchHandler {
  return (): Promise<MockFetchResponse> => {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new DOMException('The operation was aborted', 'AbortError'));
      }, 100);
    });
  };
}

/**
 * Create a custom mock handler with specific responses
 */
export function createCustomMockFetch(
  handlers: Record<string, MockFetchResponse | (() => MockFetchResponse)>
): MockFetchHandler {
  return (url: string): Promise<MockFetchResponse> => {
    for (const [pattern, response] of Object.entries(handlers)) {
      if (url.includes(pattern)) {
        const result = typeof response === 'function' ? response() : response;
        return Promise.resolve(result);
      }
    }

    // Default fallback
    return Promise.resolve(
      createErrorResponse(404, { err: 'No handler for URL' }, 'req-no-handler')
    );
  };
}

// ============================================================================
// Mock Setup Utilities
// ============================================================================

/**
 * Setup global fetch mock
 */
export function setupFetchMock(handler: MockFetchHandler): void {
  globalThis.fetch = handler as unknown as typeof fetch;
}

/**
 * Reset fetch to original implementation
 */
export function resetFetchMock(originalFetch: typeof fetch): void {
  globalThis.fetch = originalFetch;
}

/**
 * Create a fetch spy that tracks calls
 */
export function createFetchSpy(handler: MockFetchHandler): {
  fetch: MockFetchHandler;
  calls: Array<{ url: string; options?: RequestInit }>;
  reset: () => void;
} {
  const calls: Array<{ url: string; options?: RequestInit }> = [];

  const fetch: MockFetchHandler = (url, options) => {
    calls.push({ url, options });
    return handler(url, options);
  };

  return {
    fetch,
    calls,
    reset: () => {
      calls.length = 0;
    },
  };
}

// ============================================================================
// Export helpers for creating responses
// ============================================================================

export { createSuccessResponse, createErrorResponse };
