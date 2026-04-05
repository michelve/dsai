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
// Shared Fixture Constants (S1192)
// ============================================================================

const VAR_COLLECTION_ID_1 = 'VariableCollectionId:1:0';
const VAR_COLLECTION_ID_2 = 'VariableCollectionId:2:0';
const VAR_COLLECTION_ID_3 = 'VariableCollectionId:3:0';
const RESOLVED_TYPE_COLOR = 'COLOR';
const MODE_ID_1 = '1:0';
const STYLE_KEY_1 = 'style-key-1';
const COLORS_PRIMARY = 'colors/primary';
const COMP_KEY_1 = 'comp-key-1';
const MOCK_WEEK = '2026-03-23';
const BRAND_PRIMARY = 'Brand/Primary';
const MOCK_UPDATED_AT = '2026-03-20T10:00:00Z';
const MOCK_CREATED_AT = '2025-01-01T00:00:00Z';
const PRIMARY_BUTTON_DESCRIPTION = 'Primary button component';
const BUTTON_NAME = 'Button';
const FILE_KEY_ABC = 'file-abc';
const STYLE_TYPE_FILL = 'FILL';
const SET_KEY_1 = 'set-key-1';
const WORKSPACE_ACME = 'Acme Corp';
const RESOLVED_TYPE_FLOAT = 'FLOAT';
const SCOPE_ALL_FILLS = 'ALL_FILLS';
const EDITOR_TYPE_FIGMA = 'figma';
const VAR_TYPE_COLOR = 'COLOR';
const COLLECTION_NAME_PRIMITIVES = 'primitives';
const CONTAINING_FRAME_LIBRARY = { nodeId: '0:1', name: 'Components', pageName: 'Library' };
const BUTTON_VARIANT_SET_DESC = 'Button variant set';
const PRIMARY_BRAND_COLOR_DESC = 'Primary brand color';

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
// Mock IDs
// ============================================================================

const COLLECTION_PRIMITIVES_ID = 'VariableCollectionId:1:0';
const COLLECTION_SEMANTIC_ID = 'VariableCollectionId:2:0';
const COLLECTION_TYPOGRAPHY_ID = 'VariableCollectionId:3:0';

const VAR_BLUE_500_ID = 'VariableID:1:1';
const VAR_GRAY_100_ID = 'VariableID:1:2';
const VAR_SPACING_BASE_ID = 'VariableID:1:3';
const VAR_BG_PRIMARY_ID = 'VariableID:2:1';
const VAR_TEXT_PRIMARY_ID = 'VariableID:2:2';
const VAR_FONT_FAMILY_ID = 'VariableID:3:1';
const VAR_FONT_SIZE_ID = 'VariableID:3:2';
const VAR_LINE_HEIGHT_ID = 'VariableID:3:3';

// ============================================================================
// Mock Variable Collections
// ============================================================================

export const mockVariableCollections: Record<string, FigmaVariableCollection> = {
  [VAR_COLLECTION_ID_1]: {
    id: VAR_COLLECTION_ID_1,
    name: COLLECTION_NAME_PRIMITIVES,
    key: 'primitives-key',
    modes: [{ modeId: MODE_ID_1, name: 'Mode 1' }],
    defaultModeId: MODE_ID_1,
    remote: false,
    hiddenFromPublishing: false,
    variableIds: [VAR_BLUE_500_ID, VAR_GRAY_100_ID, VAR_SPACING_BASE_ID],
  },
  [VAR_COLLECTION_ID_2]: {
    id: VAR_COLLECTION_ID_2,
    name: 'semantic',
    key: 'semantic-key',
    modes: [
      { modeId: '2:0', name: 'light' },
      { modeId: '2:1', name: 'dark' },
    ],
    defaultModeId: '2:0',
    remote: false,
    hiddenFromPublishing: false,
    variableIds: [VAR_BG_PRIMARY_ID, VAR_TEXT_PRIMARY_ID],
  },
  [VAR_COLLECTION_ID_3]: {
    id: VAR_COLLECTION_ID_3,
    name: 'typography',
    key: 'typography-key',
    modes: [{ modeId: '3:0', name: 'default' }],
    defaultModeId: '3:0',
    remote: false,
    hiddenFromPublishing: false,
    variableIds: [VAR_FONT_FAMILY_ID, VAR_FONT_SIZE_ID, VAR_LINE_HEIGHT_ID],
  },
};

// ============================================================================
// Mock Variables
// ============================================================================

export const mockVariables: Record<string, FigmaVariable> = {
  // Primitive color variables
  [VAR_BLUE_500_ID]: {
    id: VAR_BLUE_500_ID,
    name: 'colors/blue/500',
    key: 'blue-500-key',
    variableCollectionId: VAR_COLLECTION_ID_1,
    resolvedType: RESOLVED_TYPE_COLOR,
    description: 'Primary blue color',
    hiddenFromPublishing: false,
    valuesByMode: {
      [MODE_ID_1]: mockColors.brandPrimary,
    },
    scopes: [SCOPE_ALL_FILLS],
  },
  [VAR_GRAY_100_ID]: {
    id: VAR_GRAY_100_ID,
    name: 'colors/gray/100',
    key: 'gray-100-key',
    variableCollectionId: VAR_COLLECTION_ID_1,
    resolvedType: RESOLVED_TYPE_COLOR,
    description: 'Light gray background',
    hiddenFromPublishing: false,
    valuesByMode: {
      [MODE_ID_1]: { r: 0.96, g: 0.96, b: 0.96, a: 1 },
    },
    scopes: [SCOPE_ALL_FILLS],
  },
  [VAR_SPACING_BASE_ID]: {
    id: VAR_SPACING_BASE_ID,
    name: 'spacing/base',
    key: 'spacing-base-key',
    variableCollectionId: VAR_COLLECTION_ID_1,
    resolvedType: RESOLVED_TYPE_FLOAT,
    description: 'Base spacing unit (8px)',
    hiddenFromPublishing: false,
    valuesByMode: {
      [MODE_ID_1]: 8,
    },
    scopes: ['GAP', 'WIDTH_HEIGHT'],
  },

  // Semantic variables with aliases
  [VAR_BG_PRIMARY_ID]: {
    id: VAR_BG_PRIMARY_ID,
    name: 'colors/background/primary',
    key: 'bg-primary-key',
    variableCollectionId: VAR_COLLECTION_ID_2,
    resolvedType: RESOLVED_TYPE_COLOR,
    description: 'Primary background color',
    hiddenFromPublishing: false,
    valuesByMode: {
      '2:0': mockColors.white, // light mode
      '2:1': mockColors.black, // dark mode
    },
    scopes: ['FRAME_FILL'],
  },
  [VAR_TEXT_PRIMARY_ID]: {
    id: VAR_TEXT_PRIMARY_ID,
    name: 'colors/text/primary',
    key: 'text-primary-key',
    variableCollectionId: VAR_COLLECTION_ID_2,
    resolvedType: RESOLVED_TYPE_COLOR,
    description:
      'Primary text color\n\nDocs.Reference: https://design.dsai.io/colors • Docs.Section: Text Colors',
    hiddenFromPublishing: false,
    valuesByMode: {
      '2:0': { type: 'VARIABLE_ALIAS', id: VAR_BLUE_500_ID }, // alias to blue/500 in light
      '2:1': mockColors.white, // white in dark
    },
    scopes: ['TEXT_FILL'],
  },

  // Typography variables
  [VAR_FONT_FAMILY_ID]: {
    id: VAR_FONT_FAMILY_ID,
    name: 'typography/font/family',
    key: 'font-family-key',
    variableCollectionId: VAR_COLLECTION_ID_3,
    resolvedType: 'STRING',
    description: 'Default font family',
    hiddenFromPublishing: false,
    valuesByMode: {
      '3:0': 'Inter',
    },
    scopes: ['FONT_FAMILY'],
  },
  [VAR_FONT_SIZE_ID]: {
    id: VAR_FONT_SIZE_ID,
    name: 'typography/font/weight',
    key: 'font-weight-key',
    variableCollectionId: VAR_COLLECTION_ID_3,
    resolvedType: RESOLVED_TYPE_FLOAT,
    description: 'Default font weight',
    hiddenFromPublishing: false,
    valuesByMode: {
      '3:0': 400,
    },
    scopes: ['FONT_WEIGHT'],
  },
  [VAR_LINE_HEIGHT_ID]: {
    id: VAR_LINE_HEIGHT_ID,
    name: 'typography/fontSize/base',
    key: 'font-size-key',
    variableCollectionId: VAR_COLLECTION_ID_3,
    resolvedType: RESOLVED_TYPE_FLOAT,
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
  editorType: EDITOR_TYPE_FIGMA,
  document: {
    id: '0:0',
    name: 'Document',
    type: 'DOCUMENT',
    children: [
      {
        id: MODE_ID_1,
        name: 'Page 1',
        type: 'CANVAS',
        children: [],
      },
    ],
  },
  components: {
    'ComponentID:1:0': {
      key: 'component-key-1',
      name: BUTTON_NAME,
      description: PRIMARY_BUTTON_DESCRIPTION,
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
      key: STYLE_KEY_1,
      name: COLORS_PRIMARY,
      description: 'Primary color style',
      remote: false,
      styleType: STYLE_TYPE_FILL,
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
  editorType: EDITOR_TYPE_FIGMA,
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
        name: COLORS_PRIMARY,
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
    variableCollectionId: VAR_COLLECTION_ID_1,
    resolvedType: RESOLVED_TYPE_COLOR,
    description: '',
    hiddenFromPublishing: false,
    valuesByMode: { [MODE_ID_1]: mockColors.blue },
    scopes: [SCOPE_ALL_FILLS],
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
    modes: [{ modeId: MODE_ID_1, name: 'default' }],
    defaultModeId: MODE_ID_1,
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
      component_key: COMP_KEY_1,
      week: MOCK_WEEK,
      detachments: 3,
      insertions: 15,
      component_name: BUTTON_NAME,
      component_set_key: SET_KEY_1,
      component_set_name: BUTTON_NAME,
    },
    {
      component_key: 'comp-key-2',
      week: MOCK_WEEK,
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
      week: MOCK_WEEK,
      detachments: 5,
      insertions: 42,
      team_name: 'Design Systems',
      workspace_name: WORKSPACE_ACME,
    },
  ],
  cursor: '',
  next_page: false,
};

/** Component usages grouped by component */
export const mockComponentUsagesByComponent = {
  rows: [
    {
      component_key: COMP_KEY_1,
      usages: 234,
      teams_using: 5,
      files_using: 18,
      component_name: BUTTON_NAME,
      component_set_key: SET_KEY_1,
      component_set_name: BUTTON_NAME,
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
      workspace_name: WORKSPACE_ACME,
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
      style_key: STYLE_KEY_1,
      week: MOCK_WEEK,
      detachments: 1,
      insertions: 20,
      style_name: BRAND_PRIMARY,
      style_type: STYLE_TYPE_FILL,
    },
  ],
  cursor: '',
  next_page: false,
};

/** Style usages grouped by style */
export const mockStyleUsagesByStyle = {
  rows: [
    {
      style_key: STYLE_KEY_1,
      usages: 150,
      teams_using: 4,
      files_using: 12,
      style_name: BRAND_PRIMARY,
      style_type: STYLE_TYPE_FILL,
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
      week: MOCK_WEEK,
      detachments: 0,
      insertions: 10,
      variable_name: COLORS_PRIMARY,
      variable_type: VAR_TYPE_COLOR,
      collection_key: 'coll-key-1',
      collection_name: COLLECTION_NAME_PRIMITIVES,
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
      variable_name: COLORS_PRIMARY,
      variable_type: VAR_TYPE_COLOR,
      collection_key: 'coll-key-1',
      collection_name: COLLECTION_NAME_PRIMITIVES,
    },
  ],
  cursor: '',
  next_page: false,
};

/** Actions grouped by team (shared shape for style and variable actions) */
export const mockActionsByTeam = {
  rows: [
    {
      week: MOCK_WEEK,
      detachments: 2,
      insertions: 30,
      team_name: 'Product',
      workspace_name: WORKSPACE_ACME,
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
      workspace_name: WORKSPACE_ACME,
      file_name: 'Dashboard',
    },
  ],
  cursor: '',
  next_page: false,
};

// ============================================================================
// Shared User Fixture
// ============================================================================

export const mockUser = {
  id: 'user-1',
  handle: 'Jane Designer',
  img_url: 'https://example.com/avatar.png',
};

// ============================================================================
// Published Library Response Fixtures
// ============================================================================

export const mockPublishedComponentsResponse = {
  status: 200,
  error: false,
  meta: {
    components: [
      {
        key: COMP_KEY_1,
        file_key: FILE_KEY_ABC,
        node_id: '1:2',
        thumbnail_url: 'https://example.com/thumb1.png',
        name: BUTTON_NAME,
        description: PRIMARY_BUTTON_DESCRIPTION,
        updated_at: MOCK_UPDATED_AT,
        created_at: MOCK_CREATED_AT,
        user: mockUser,
        containing_frame: CONTAINING_FRAME_LIBRARY,
      },
    ],
  },
};

export const mockPublishedComponentSetsResponse = {
  status: 200,
  error: false,
  meta: {
    component_sets: [
      {
        key: SET_KEY_1,
        file_key: FILE_KEY_ABC,
        node_id: '1:10',
        thumbnail_url: 'https://example.com/set-thumb.png',
        name: BUTTON_NAME,
        description: BUTTON_VARIANT_SET_DESC,
        updated_at: MOCK_UPDATED_AT,
        created_at: MOCK_CREATED_AT,
        user: mockUser,
        containing_frame: CONTAINING_FRAME_LIBRARY,
      },
    ],
  },
};

export const mockPublishedStylesResponse = {
  status: 200,
  error: false,
  meta: {
    styles: [
      {
        key: STYLE_KEY_1,
        file_key: FILE_KEY_ABC,
        node_id: '2:1',
        style_type: STYLE_TYPE_FILL,
        thumbnail_url: 'https://example.com/style-thumb.png',
        name: BRAND_PRIMARY,
        description: PRIMARY_BRAND_COLOR_DESC,
        updated_at: MOCK_UPDATED_AT,
        created_at: MOCK_CREATED_AT,
        sort_position: 'a',
        user: mockUser,
      },
    ],
  },
};

export const mockSingleComponentResponse = {
  status: 200,
  error: false,
  meta: {
    key: COMP_KEY_1,
    file_key: FILE_KEY_ABC,
    node_id: '1:2',
    thumbnail_url: 'https://example.com/thumb1.png',
    name: BUTTON_NAME,
    description: PRIMARY_BUTTON_DESCRIPTION,
    updated_at: MOCK_UPDATED_AT,
    created_at: MOCK_CREATED_AT,
    user: mockUser,
    containing_frame: CONTAINING_FRAME_LIBRARY,
  },
};

export const mockSingleComponentSetResponse = {
  status: 200,
  error: false,
  meta: {
    key: SET_KEY_1,
    file_key: FILE_KEY_ABC,
    node_id: '1:10',
    thumbnail_url: 'https://example.com/set-thumb.png',
    name: BUTTON_NAME,
    description: BUTTON_VARIANT_SET_DESC,
    updated_at: MOCK_UPDATED_AT,
    created_at: MOCK_CREATED_AT,
    user: mockUser,
    containing_frame: CONTAINING_FRAME_LIBRARY,
  },
};

export const mockSingleStyleResponse = {
  status: 200,
  error: false,
  meta: {
    key: STYLE_KEY_1,
    file_key: FILE_KEY_ABC,
    node_id: '2:1',
    style_type: STYLE_TYPE_FILL,
    thumbnail_url: 'https://example.com/style-thumb.png',
    name: BRAND_PRIMARY,
    description: PRIMARY_BRAND_COLOR_DESC,
    updated_at: MOCK_UPDATED_AT,
    created_at: MOCK_CREATED_AT,
    sort_position: 'a',
    user: mockUser,
  },
};

// ============================================================================
// Version History Fixtures
// ============================================================================

export const mockVersionsResponse = {
  versions: [
    {
      id: 'ver-1',
      created_at: '2026-03-28T12:00:00Z',
      label: 'v2.0 Release',
      description: 'Major update',
      user: mockUser,
    },
    {
      id: 'ver-2',
      created_at: '2026-03-20T08:00:00Z',
      label: '',
      description: '',
      user: mockUser,
    },
  ],
  pagination: {
    prev_page: '',
    next_page: 'https://api.figma.com/v1/files/abc/versions?after=ver-2',
  },
};

// ============================================================================
// File Metadata Fixtures
// ============================================================================

export const mockFileMetadataResponse = {
  file: {
    name: 'Design System Library',
    folder_name: 'Libraries',
    last_touched_at: '2026-03-29T10:00:00Z',
    creator: mockUser,
    last_touched_by: mockUser,
    thumbnail_url: 'https://example.com/file-thumb.png',
    editorType: EDITOR_TYPE_FIGMA,
    version: '123456',
    role: 'editor',
    link_access: 'org_view',
    url: 'https://www.figma.com/design/abc/Design-System-Library',
  },
};

// ============================================================================
// User (Me) Fixtures
// ============================================================================

export const mockMeResponse = {
  id: 'user-1',
  handle: 'Jane Designer',
  img_url: 'https://example.com/avatar.png',
  email: 'jane@example.com',
};
