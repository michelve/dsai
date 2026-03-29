/**
 * @file Figma API Mock Response Fixtures
 * @description Comprehensive mock data for testing FigmaClient
 *
 * These fixtures replicate real Figma API responses for unit testing
 * without making actual API calls.
 */

import type {
  FigmaFile,
  FigmaVariablesResponse,
  FigmaVariable,
  FigmaVariableCollection,
  FigmaColor,
  FigmaApiError,
} from '../../src/types.js';

// ============================================================================
// Mock Colors
// ============================================================================

export const mockColors = {
  /** Pure red (rgba: 255, 0, 0, 1) */
  red: { r: 1, g: 0, b: 0, a: 1 } as FigmaColor,

  /** Pure green (rgba: 0, 255, 0, 1) */
  green: { r: 0, g: 1, b: 0, a: 1 } as FigmaColor,

  /** Pure blue (rgba: 0, 0, 255, 1) */
  blue: { r: 0, g: 0, b: 1, a: 1 } as FigmaColor,

  /** White (rgba: 255, 255, 255, 1) */
  white: { r: 1, g: 1, b: 1, a: 1 } as FigmaColor,

  /** Black (rgba: 0, 0, 0, 1) */
  black: { r: 0, g: 0, b: 0, a: 1 } as FigmaColor,

  /** Semi-transparent black (rgba: 0, 0, 0, 0.5) */
  semiTransparentBlack: { r: 0, g: 0, b: 0, a: 0.5 } as FigmaColor,

  /** Brand primary (custom blue) */
  brandPrimary: { r: 0.2, g: 0.4, b: 0.8, a: 1 } as FigmaColor,

  /** Brand secondary (custom purple) */
  brandSecondary: { r: 0.5, g: 0.2, b: 0.7, a: 1 } as FigmaColor,
} as const;

// ============================================================================
// Mock Variable Collections
// ============================================================================

export const mockVariableCollections: Record<string, FigmaVariableCollection> = {
  'VariableCollectionId:1:0': {
    id: 'VariableCollectionId:1:0',
    name: 'primitives',
    key: 'primitives-key',
    modes: [{ modeId: '1:0', name: 'Mode 1' }],
    defaultModeId: '1:0',
    remote: false,
    hiddenFromPublishing: false,
    variableIds: ['VariableID:1:1', 'VariableID:1:2', 'VariableID:1:3'],
  },
  'VariableCollectionId:2:0': {
    id: 'VariableCollectionId:2:0',
    name: 'semantic',
    key: 'semantic-key',
    modes: [
      { modeId: '2:0', name: 'light' },
      { modeId: '2:1', name: 'dark' },
    ],
    defaultModeId: '2:0',
    remote: false,
    hiddenFromPublishing: false,
    variableIds: ['VariableID:2:1', 'VariableID:2:2'],
  },
  'VariableCollectionId:3:0': {
    id: 'VariableCollectionId:3:0',
    name: 'typography',
    key: 'typography-key',
    modes: [{ modeId: '3:0', name: 'default' }],
    defaultModeId: '3:0',
    remote: false,
    hiddenFromPublishing: false,
    variableIds: ['VariableID:3:1', 'VariableID:3:2', 'VariableID:3:3'],
  },
};

// ============================================================================
// Mock Variables
// ============================================================================

export const mockVariables: Record<string, FigmaVariable> = {
  // Primitive color variables
  'VariableID:1:1': {
    id: 'VariableID:1:1',
    name: 'colors/blue/500',
    key: 'blue-500-key',
    variableCollectionId: 'VariableCollectionId:1:0',
    resolvedType: 'COLOR',
    description: 'Primary blue color',
    hiddenFromPublishing: false,
    valuesByMode: {
      '1:0': mockColors.brandPrimary,
    },
    scopes: ['ALL_FILLS'],
  },
  'VariableID:1:2': {
    id: 'VariableID:1:2',
    name: 'colors/gray/100',
    key: 'gray-100-key',
    variableCollectionId: 'VariableCollectionId:1:0',
    resolvedType: 'COLOR',
    description: 'Light gray background',
    hiddenFromPublishing: false,
    valuesByMode: {
      '1:0': { r: 0.96, g: 0.96, b: 0.96, a: 1 },
    },
    scopes: ['ALL_FILLS'],
  },
  'VariableID:1:3': {
    id: 'VariableID:1:3',
    name: 'spacing/base',
    key: 'spacing-base-key',
    variableCollectionId: 'VariableCollectionId:1:0',
    resolvedType: 'FLOAT',
    description: 'Base spacing unit (8px)',
    hiddenFromPublishing: false,
    valuesByMode: {
      '1:0': 8,
    },
    scopes: ['GAP', 'WIDTH_HEIGHT'],
  },

  // Semantic variables with aliases
  'VariableID:2:1': {
    id: 'VariableID:2:1',
    name: 'colors/background/primary',
    key: 'bg-primary-key',
    variableCollectionId: 'VariableCollectionId:2:0',
    resolvedType: 'COLOR',
    description: 'Primary background color',
    hiddenFromPublishing: false,
    valuesByMode: {
      '2:0': mockColors.white, // light mode
      '2:1': mockColors.black, // dark mode
    },
    scopes: ['FRAME_FILL'],
  },
  'VariableID:2:2': {
    id: 'VariableID:2:2',
    name: 'colors/text/primary',
    key: 'text-primary-key',
    variableCollectionId: 'VariableCollectionId:2:0',
    resolvedType: 'COLOR',
    description:
      'Primary text color\n\nDocs.Reference: https://design.dsai.io/colors • Docs.Section: Text Colors',
    hiddenFromPublishing: false,
    valuesByMode: {
      '2:0': { type: 'VARIABLE_ALIAS', id: 'VariableID:1:1' }, // alias to blue/500 in light
      '2:1': mockColors.white, // white in dark
    },
    scopes: ['TEXT_FILL'],
  },

  // Typography variables
  'VariableID:3:1': {
    id: 'VariableID:3:1',
    name: 'typography/font/family',
    key: 'font-family-key',
    variableCollectionId: 'VariableCollectionId:3:0',
    resolvedType: 'STRING',
    description: 'Default font family',
    hiddenFromPublishing: false,
    valuesByMode: {
      '3:0': 'Inter',
    },
    scopes: ['FONT_FAMILY'],
  },
  'VariableID:3:2': {
    id: 'VariableID:3:2',
    name: 'typography/font/weight',
    key: 'font-weight-key',
    variableCollectionId: 'VariableCollectionId:3:0',
    resolvedType: 'FLOAT',
    description: 'Default font weight',
    hiddenFromPublishing: false,
    valuesByMode: {
      '3:0': 400,
    },
    scopes: ['FONT_WEIGHT'],
  },
  'VariableID:3:3': {
    id: 'VariableID:3:3',
    name: 'typography/fontSize/base',
    key: 'font-size-key',
    variableCollectionId: 'VariableCollectionId:3:0',
    resolvedType: 'FLOAT',
    description: 'Base font size',
    hiddenFromPublishing: false,
    valuesByMode: {
      '3:0': 16,
    },
    scopes: ['FONT_SIZE'],
  },
};

// ============================================================================
// Mock API Responses
// ============================================================================

/**
 * Complete mock variables response matching Figma API format
 */
export const mockVariablesResponse: FigmaVariablesResponse = {
  variableCollections: mockVariableCollections,
  variables: mockVariables,
};

/**
 * Empty variables response
 */
export const emptyVariablesResponse: FigmaVariablesResponse = {
  variableCollections: {},
  variables: {},
};

/**
 * Mock Figma file response
 */
export const mockFigmaFile: FigmaFile = {
  name: 'Design System Tokens',
  lastModified: '2024-01-15T10:30:00Z',
  thumbnailUrl: 'https://example.com/thumbnail.png',
  version: '1234567890',
  role: 'owner',
  editorType: 'figma',
  document: {
    id: '0:0',
    name: 'Document',
    type: 'DOCUMENT',
    children: [
      {
        id: '1:0',
        name: 'Page 1',
        type: 'CANVAS',
        children: [],
      },
    ],
  },
  components: {
    'ComponentID:1:0': {
      key: 'component-key-1',
      name: 'Button',
      description: 'Primary button component',
      remote: false,
      documentationLinks: [],
    },
    'ComponentID:2:0': {
      key: 'component-key-2',
      name: 'Input',
      description: 'Text input component',
      remote: false,
      documentationLinks: [],
    },
  },
  componentSets: {},
  styles: {
    'StyleID:1:0': {
      key: 'style-key-1',
      name: 'colors/primary',
      description: 'Primary color style',
      remote: false,
      styleType: 'FILL',
    },
    'StyleID:2:0': {
      key: 'style-key-2',
      name: 'typography/heading-1',
      description: 'Heading 1 text style',
      remote: false,
      styleType: 'TEXT',
    },
    'StyleID:3:0': {
      key: 'style-key-3',
      name: 'shadows/elevation-1',
      description: 'Low elevation shadow',
      remote: false,
      styleType: 'EFFECT',
    },
  },
  schemaVersion: 0,
};

/**
 * Minimal mock file for simple tests
 */
export const minimalMockFile: FigmaFile = {
  name: 'Test File',
  lastModified: '2024-01-01T00:00:00Z',
  thumbnailUrl: 'https://example.com/test.png',
  version: '1',
  role: 'viewer',
  editorType: 'figma',
  document: {
    id: '0:0',
    name: 'Document',
    type: 'DOCUMENT',
    children: [],
  },
  components: {},
  componentSets: {},
  styles: {},
  schemaVersion: 0,
};

// ============================================================================
// Mock API Errors
// ============================================================================

/**
 * 403 Forbidden error (enterprise-only endpoint)
 */
export const error403Forbidden: FigmaApiError = {
  status: 403,
  err: 'Forbidden',
  code: 'ENTERPRISE_ONLY',
  requestId: 'req-403-test',
};

/**
 * 404 Not Found error
 */
export const error404NotFound: FigmaApiError = {
  status: 404,
  err: 'Not found',
  requestId: 'req-404-test',
};

/**
 * 429 Rate Limited error
 */
export const error429RateLimited: FigmaApiError = {
  status: 429,
  err: 'Rate limited',
  requestId: 'req-429-test',
};

/**
 * 500 Server Error
 */
export const error500ServerError: FigmaApiError = {
  status: 500,
  err: 'Internal server error',
  requestId: 'req-500-test',
};

/**
 * 401 Unauthorized error
 */
export const error401Unauthorized: FigmaApiError = {
  status: 401,
  err: 'Invalid token',
  requestId: 'req-401-test',
};

// ============================================================================
// Mock Style Nodes (for getStyles API)
// ============================================================================

export const mockStyleNodes = {
  nodes: {
    'StyleID:1:0': {
      document: {
        id: 'StyleID:1:0',
        name: 'colors/primary',
        type: 'RECTANGLE',
        fills: [
          {
            type: 'SOLID',
            visible: true,
            color: mockColors.brandPrimary,
            opacity: 1,
          },
        ],
      },
    },
    'StyleID:2:0': {
      document: {
        id: 'StyleID:2:0',
        name: 'typography/heading-1',
        type: 'TEXT',
        fontFamily: 'Inter',
        fontWeight: 700,
        fontSize: 32,
        lineHeight: { unit: 'PIXELS', value: 40 },
        letterSpacing: { unit: 'PIXELS', value: -0.5 },
        textCase: 'ORIGINAL',
        textDecoration: 'NONE',
      },
    },
    'StyleID:3:0': {
      document: {
        id: 'StyleID:3:0',
        name: 'shadows/elevation-1',
        type: 'RECTANGLE',
        effects: [
          {
            type: 'DROP_SHADOW',
            visible: true,
            color: mockColors.semiTransparentBlack,
            offset: { x: 0, y: 2 },
            radius: 4,
            spread: 0,
          },
        ],
      },
    },
  },
};

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create a custom mock variable
 */
export function createMockVariable(
  overrides: Partial<FigmaVariable> & { id: string; name: string }
): FigmaVariable {
  return {
    key: `${overrides.name}-key`,
    variableCollectionId: 'VariableCollectionId:1:0',
    resolvedType: 'COLOR',
    description: '',
    hiddenFromPublishing: false,
    valuesByMode: { '1:0': mockColors.blue },
    scopes: ['ALL_FILLS'],
    ...overrides,
  };
}

/**
 * Create a custom mock collection
 */
export function createMockCollection(
  overrides: Partial<FigmaVariableCollection> & { id: string; name: string }
): FigmaVariableCollection {
  return {
    key: `${overrides.name}-key`,
    modes: [{ modeId: '1:0', name: 'default' }],
    defaultModeId: '1:0',
    remote: false,
    hiddenFromPublishing: false,
    variableIds: [],
    ...overrides,
  };
}

/**
 * Create a mock variables response with custom collections and variables
 */
export function createMockVariablesResponse(
  collections: FigmaVariableCollection[],
  variables: FigmaVariable[]
): FigmaVariablesResponse {
  return {
    variableCollections: Object.fromEntries(collections.map((c) => [c.id, c])),
    variables: Object.fromEntries(variables.map((v) => [v.id, v])),
  };
}

// ============================================================================
// Test Constants
// ============================================================================

export const TEST_FILE_KEY = 'test-file-key-abc123';
export const TEST_ACCESS_TOKEN = 'figd_test_token_12345';
export const TEST_BASE_URL = 'https://api.figma.com';

/**
 * Standard test configuration for FigmaClient
 */
export const testClientConfig = {
  accessToken: TEST_ACCESS_TOKEN,
  timeout: 5000,
  retries: 1,
  cache: false,
};

// ============================================================================
// POST Variables Response Fixtures
// ============================================================================

/**
 * Successful POST variables response with temp ID mapping
 */
export const mockPostVariablesResponse = {
  status: 200,
  error: false,
  meta: {
    tempIdToRealId: {
      'temp-collection-1': 'VariableCollectionId:99:0',
      'temp-mode-1': '99:1',
      'temp-var-1': 'VariableID:99:1',
      'temp-var-2': 'VariableID:99:2',
    },
  },
};

/**
 * POST variables response with no temp IDs (all real IDs used)
 */
export const mockPostVariablesResponseNoTempIds = {
  status: 200,
  error: false,
  meta: {
    tempIdToRealId: {},
  },
};

/**
 * POST variables 413 error (payload too large)
 */
export const error413PayloadTooLarge = {
  status: 413,
  err: 'Request entity too large',
  code: 'PAYLOAD_TOO_LARGE',
  requestId: 'req-413-test',
};

// ============================================================================
// Library Analytics Response Fixtures
// ============================================================================

/** Component actions grouped by component */
export const mockComponentActionsByComponent = {
  rows: [
    {
      component_key: 'comp-key-1',
      week: '2026-03-23',
      detachments: 3,
      insertions: 15,
      component_name: 'Button',
      component_set_key: 'set-key-1',
      component_set_name: 'Button',
    },
    {
      component_key: 'comp-key-2',
      week: '2026-03-23',
      detachments: 0,
      insertions: 8,
      component_name: 'Card',
      component_set_key: 'set-key-2',
      component_set_name: 'Card',
    },
  ],
  cursor: 'cursor-page-2',
  next_page: true,
};

/** Component actions grouped by team */
export const mockComponentActionsByTeam = {
  rows: [
    {
      week: '2026-03-23',
      detachments: 5,
      insertions: 42,
      team_name: 'Design Systems',
      workspace_name: 'Acme Corp',
    },
  ],
  cursor: '',
  next_page: false,
};

/** Component usages grouped by component */
export const mockComponentUsagesByComponent = {
  rows: [
    {
      component_key: 'comp-key-1',
      usages: 234,
      teams_using: 5,
      files_using: 18,
      component_name: 'Button',
      component_set_key: 'set-key-1',
      component_set_name: 'Button',
    },
  ],
  cursor: '',
  next_page: false,
};

/** Component usages grouped by file */
export const mockComponentUsagesByFile = {
  rows: [
    {
      usages: 42,
      team_name: 'Design Systems',
      workspace_name: 'Acme Corp',
      file_name: 'Web App Designs',
    },
  ],
  cursor: '',
  next_page: false,
};

/** Style actions grouped by style */
export const mockStyleActionsByStyle = {
  rows: [
    {
      style_key: 'style-key-1',
      week: '2026-03-23',
      detachments: 1,
      insertions: 20,
      style_name: 'Brand/Primary',
      style_type: 'FILL',
    },
  ],
  cursor: '',
  next_page: false,
};

/** Style usages grouped by style */
export const mockStyleUsagesByStyle = {
  rows: [
    {
      style_key: 'style-key-1',
      usages: 150,
      teams_using: 4,
      files_using: 12,
      style_name: 'Brand/Primary',
      style_type: 'FILL',
    },
  ],
  cursor: '',
  next_page: false,
};

/** Variable actions grouped by variable */
export const mockVariableActionsByVariable = {
  rows: [
    {
      variable_key: 'var-key-1',
      week: '2026-03-23',
      detachments: 0,
      insertions: 10,
      variable_name: 'colors/primary',
      variable_type: 'COLOR',
      collection_key: 'coll-key-1',
      collection_name: 'primitives',
    },
  ],
  cursor: '',
  next_page: false,
};

/** Variable usages grouped by variable */
export const mockVariableUsagesByVariable = {
  rows: [
    {
      variable_key: 'var-key-1',
      usages: 88,
      teams_using: 3,
      files_using: 9,
      variable_name: 'colors/primary',
      variable_type: 'COLOR',
      collection_key: 'coll-key-1',
      collection_name: 'primitives',
    },
  ],
  cursor: '',
  next_page: false,
};

/** Actions grouped by team (shared shape for style and variable actions) */
export const mockActionsByTeam = {
  rows: [
    {
      week: '2026-03-23',
      detachments: 2,
      insertions: 30,
      team_name: 'Product',
      workspace_name: 'Acme Corp',
    },
  ],
  cursor: '',
  next_page: false,
};

/** Usages grouped by file (shared shape for style and variable usages) */
export const mockUsagesByFile = {
  rows: [
    {
      usages: 25,
      team_name: 'Product',
      workspace_name: 'Acme Corp',
      file_name: 'Dashboard',
    },
  ],
  cursor: '',
  next_page: false,
};
