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
// HTTP Status Code Constants
// ============================================================================

const HTTP_OK = 200;
const HTTP_FORBIDDEN = 403;
const HTTP_NOT_FOUND = 404;
const HTTP_TOO_MANY_REQUESTS = 429;
const HTTP_SERVER_ERROR = 500;

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
    status: HTTP_OK,
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

// ============================================================================
// Per-Route Handlers
// ============================================================================

/** Handle /v1/me user endpoint */
function handleUserRoute(url: string): MockFetchResponse | null {
  if (url.includes('/v1/me') || url.endsWith('/me')) {
    return createSuccessResponse(mockMeResponse, 'req-me');
  }
  return null;
}

/** Handle single component/component_set/style by key (not file-level) */
function handleSingleResourceRoute(url: string): MockFetchResponse | null {
  if (/\/components\/[^/]+$/.exec(url) && !url.includes('/files/')) {
    return createSuccessResponse(mockSingleComponentResponse, 'req-comp');
  }
  if (/\/component_sets\/[^/]+$/.exec(url) && !url.includes('/files/')) {
    return createSuccessResponse(mockSingleComponentSetResponse, 'req-comp-set');
  }
  if (/\/styles\/[^/]+$/.exec(url) && !url.includes('/files/')) {
    return createSuccessResponse(mockSingleStyleResponse, 'req-style');
  }
  return null;
}

/** Handle file-level library endpoints (components, component_sets, styles) */
function handleLibraryRoute(url: string): MockFetchResponse | null {
  if (url.includes('/components') && !url.includes('/analytics') && !url.includes('/component_sets')) {
    return createSuccessResponse(mockPublishedComponentsResponse, 'req-pub-comps');
  }
  if (url.includes('/component_sets')) {
    return createSuccessResponse(mockPublishedComponentSetsResponse, 'req-pub-sets');
  }
  if (url.includes('/styles') && !url.includes('/analytics')) {
    return createSuccessResponse(mockPublishedStylesResponse, 'req-pub-styles');
  }
  return null;
}

/** Handle version history and file metadata */
function handleFileMetaRoute(url: string): MockFetchResponse | null {
  if (url.includes('/versions')) {
    return createSuccessResponse(mockVersionsResponse, 'req-versions');
  }
  if (url.includes('/meta')) {
    return createSuccessResponse(mockFileMetadataResponse, 'req-meta');
  }
  return null;
}

/** Handle analytics library endpoints */
function handleAnalyticsRoute(url: string): MockFetchResponse | null {
  if (!url.includes('/analytics/libraries/')) {return null;}

  const analyticsRoutes: Array<[string, unknown, string]> = [
    ['/component/actions', mockComponentActionsByComponent, 'req-comp-actions'],
    ['/component/usages', mockComponentUsagesByComponent, 'req-comp-usages'],
    ['/style/actions', mockStyleActionsByStyle, 'req-style-actions'],
    ['/style/usages', mockStyleUsagesByStyle, 'req-style-usages'],
    ['/variable/actions', mockVariableActionsByVariable, 'req-var-actions'],
    ['/variable/usages', mockVariableUsagesByVariable, 'req-var-usages'],
  ];

  for (const [path, data, requestId] of analyticsRoutes) {
    if (url.includes(path)) {
      return createSuccessResponse(data, requestId);
    }
  }
  return null;
}

/** Handle variables, nodes, and general file endpoints */
function handleDataRoute(url: string, options?: RequestInit): MockFetchResponse | null {
  if (url.includes('/variables') && options?.method === 'POST') {
    return createSuccessResponse(mockPostVariablesResponse, 'req-post-vars-test');
  }
  if (url.includes('/variables/local')) {
    return createSuccessResponse(mockVariablesResponse, 'req-vars-test');
  }
  if (url.includes('/nodes')) {
    return createSuccessResponse(mockStyleNodes, 'req-nodes-test');
  }
  if (url.includes('/files/')) {
    return createSuccessResponse(mockFigmaFile, 'req-file-test');
  }
  return null;
}

/**
 * Default mock handler that responds with appropriate test data
 */
export function createDefaultMockFetch(): MockFetchHandler {
  const routeHandlers: Array<(url: string, options?: RequestInit) => MockFetchResponse | null> = [
    handleUserRoute,
    handleSingleResourceRoute,
    handleLibraryRoute,
    handleFileMetaRoute,
    handleAnalyticsRoute,
    handleDataRoute,
  ];

  return (url: string, options?: RequestInit): Promise<MockFetchResponse> => {
    for (const handler of routeHandlers) {
      const response = handler(url, options);
      if (response) {
        return Promise.resolve(response);
      }
    }

    return Promise.resolve(createErrorResponse(HTTP_NOT_FOUND, { err: 'Not found' }, 'req-default-404'));
  };
}

/**
 * Mock handler that always returns 403 for variables endpoint
 */
export function createEnterpriseMockFetch(): MockFetchHandler {
  return (url: string): Promise<MockFetchResponse> => {
    if (url.includes('/variables/local')) {
      return Promise.resolve(
        createErrorResponse(HTTP_FORBIDDEN, error403Forbidden, error403Forbidden.requestId)
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
    return Promise.resolve(createErrorResponse(HTTP_NOT_FOUND, error404NotFound, error404NotFound.requestId));
  };
}

/**
 * Mock handler that simulates rate limiting
 */
export function createRateLimitedMockFetch(): MockFetchHandler {
  return (): Promise<MockFetchResponse> => {
    return Promise.resolve(
      createErrorResponse(HTTP_TOO_MANY_REQUESTS, error429RateLimited, error429RateLimited.requestId)
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
        createErrorResponse(HTTP_SERVER_ERROR, error500ServerError, `req-retry-${callCount}`)
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
      createErrorResponse(HTTP_NOT_FOUND, { err: 'No handler for URL' }, 'req-no-handler')
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
