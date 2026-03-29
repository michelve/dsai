/**
 * @file Figma API Type Definitions
 * @description Type definitions for Figma REST API integration and token synchronization.
 *
 * These types are designed to work with:
 * - Figma REST API v1
 * - Figma Variables API
 * - Figma Code Connect
 * - Tokens Studio plugin exports
 *
 * @see https://www.figma.com/developers/api
 * @packageDocumentation
 */

// ============================================================================
// Client Configuration
// ============================================================================

/**
 * Configuration options for the Figma API client
 */
export interface FigmaClientConfig {
  /** Figma personal access token or OAuth token */
  accessToken: string;

  /** Base URL for Figma API (default: https://api.figma.com) */
  baseUrl?: string;

  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;

  /** Number of retry attempts for failed requests (default: 3) */
  retries?: number;

  /** Whether to enable request caching (default: true) */
  cache?: boolean;

  /** Custom headers to include in requests */
  headers?: Record<string, string>;
}

// ============================================================================
// Figma File Types
// ============================================================================

/**
 * Figma file metadata and structure
 */
export interface FigmaFile {
  /** File name */
  name: string;

  /** Last modified timestamp */
  lastModified: string;

  /** Thumbnail URL */
  thumbnailUrl: string;

  /** File version */
  version: string;

  /** Document role (owner, editor, viewer) */
  role: 'owner' | 'editor' | 'viewer';

  /** Editor type */
  editorType: 'figma' | 'figjam';

  /** Root document node */
  document: FigmaNode;

  /** Component definitions */
  components: Record<string, FigmaComponent>;

  /** Component sets (variants) */
  componentSets: Record<string, FigmaComponentSet>;

  /** Styles defined in the file */
  styles: Record<string, FigmaStyle>;

  /** Schema version */
  schemaVersion: number;
}

/**
 * Base Figma node structure
 */
export interface FigmaNode {
  /** Unique node identifier */
  id: string;

  /** Node name */
  name: string;

  /** Node type */
  type: FigmaNodeType;

  /** Whether the node is visible */
  visible?: boolean;

  /** Child nodes */
  children?: FigmaNode[];

  /** Plugin data stored on the node */
  pluginData?: Record<string, unknown>;

  /** Shared plugin data */
  sharedPluginData?: Record<string, Record<string, unknown>>;
}

/**
 * Figma node types
 */
export type FigmaNodeType =
  | 'DOCUMENT'
  | 'CANVAS'
  | 'FRAME'
  | 'GROUP'
  | 'VECTOR'
  | 'BOOLEAN_OPERATION'
  | 'STAR'
  | 'LINE'
  | 'ELLIPSE'
  | 'REGULAR_POLYGON'
  | 'RECTANGLE'
  | 'TEXT'
  | 'SLICE'
  | 'COMPONENT'
  | 'COMPONENT_SET'
  | 'INSTANCE'
  | 'STICKY'
  | 'SHAPE_WITH_TEXT'
  | 'CONNECTOR'
  | 'SECTION';

// ============================================================================
// Component Types
// ============================================================================

/**
 * Figma component definition
 */
export interface FigmaComponent {
  /** Component key (unique across files) */
  key: string;

  /** Component name */
  name: string;

  /** Component description */
  description: string;

  /** Whether this is a remote component */
  remote: boolean;

  /** Documentation links */
  documentationLinks: FigmaDocumentationLink[];

  /** Component set ID (if part of a variant set) */
  componentSetId?: string;
}

/**
 * Figma component set (variants container)
 */
export interface FigmaComponentSet {
  /** Component set key */
  key: string;

  /** Component set name */
  name: string;

  /** Component set description */
  description: string;

  /** Whether this is a remote component set */
  remote: boolean;

  /** Documentation links */
  documentationLinks: FigmaDocumentationLink[];
}

/**
 * Documentation link
 */
export interface FigmaDocumentationLink {
  /** Link URI */
  uri: string;
}

// ============================================================================
// Style Types
// ============================================================================

/**
 * Figma style definition
 */
export interface FigmaStyle {
  /** Style key (unique across files) */
  key: string;

  /** Style name */
  name: string;

  /** Style description */
  description: string;

  /** Whether this is a remote style */
  remote: boolean;

  /** Style type */
  styleType: FigmaStyleType;
}

/**
 * Figma style types
 */
export type FigmaStyleType = 'FILL' | 'TEXT' | 'EFFECT' | 'GRID';

// ============================================================================
// Variables API Types
// ============================================================================

/**
 * Figma variable
 */
export interface FigmaVariable {
  /** Variable ID */
  id: string;

  /** Variable name */
  name: string;

  /** Variable key (for referencing) */
  key: string;

  /** Variable collection ID */
  variableCollectionId: string;

  /** Variable type */
  resolvedType: FigmaVariableType;

  /** Description */
  description: string;

  /** Whether the variable is hidden from publishing */
  hiddenFromPublishing: boolean;

  /** Values per mode */
  valuesByMode: Record<string, FigmaVariableValue>;

  /** Scopes where this variable can be used */
  scopes: FigmaVariableScope[];

  /** Code syntax hints */
  codeSyntax?: FigmaCodeSyntax;
}

/**
 * Figma variable types
 */
export type FigmaVariableType = 'BOOLEAN' | 'FLOAT' | 'STRING' | 'COLOR';

/**
 * Figma variable value (can be literal or alias)
 */
export type FigmaVariableValue = boolean | number | string | FigmaColor | FigmaVariableAlias;

/**
 * Figma color value
 */
export interface FigmaColor {
  /** Red channel (0-1) */
  r: number;

  /** Green channel (0-1) */
  g: number;

  /** Blue channel (0-1) */
  b: number;

  /** Alpha channel (0-1) */
  a: number;
}

/**
 * Alias to another variable
 */
export interface FigmaVariableAlias {
  /** Alias type marker */
  type: 'VARIABLE_ALIAS';

  /** Referenced variable ID */
  id: string;
}

/**
 * Variable scopes
 */
export type FigmaVariableScope =
  | 'ALL_SCOPES'
  | 'ALL_FILLS'
  | 'FRAME_FILL'
  | 'SHAPE_FILL'
  | 'TEXT_FILL'
  | 'STROKE_COLOR'
  | 'EFFECT_COLOR'
  | 'CORNER_RADIUS'
  | 'WIDTH_HEIGHT'
  | 'GAP'
  | 'FONT_FAMILY'
  | 'FONT_STYLE'
  | 'FONT_WEIGHT'
  | 'FONT_SIZE'
  | 'LINE_HEIGHT'
  | 'LETTER_SPACING'
  | 'PARAGRAPH_SPACING'
  | 'PARAGRAPH_INDENT'
  | 'OPACITY';

/**
 * Code syntax hints for variables
 */
export interface FigmaCodeSyntax {
  /** Web/CSS syntax */
  WEB?: string;

  /** Android syntax */
  ANDROID?: string;

  /** iOS syntax */
  iOS?: string;
}

/**
 * Figma variable collection
 */
export interface FigmaVariableCollection {
  /** Collection ID */
  id: string;

  /** Collection name */
  name: string;

  /** Collection key */
  key: string;

  /** Modes in this collection */
  modes: FigmaVariableMode[];

  /** Default mode ID */
  defaultModeId: string;

  /** Whether the collection is remote */
  remote: boolean;

  /** Whether the collection is hidden from publishing */
  hiddenFromPublishing: boolean;

  /** Variable IDs in this collection */
  variableIds: string[];
}

/**
 * Figma variable mode
 */
export interface FigmaVariableMode {
  /** Mode ID */
  modeId: string;

  /** Mode name */
  name: string;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Figma API error response
 */
export interface FigmaApiError {
  /** HTTP status code */
  status: number;

  /** Error message */
  err: string;

  /** Error code */
  code?: string;

  /** Request ID for debugging */
  requestId?: string;
}

/**
 * Variables API response
 */
export interface FigmaVariablesResponse {
  /** Variable collections */
  variableCollections: Record<string, FigmaVariableCollection>;

  /** Variables */
  variables: Record<string, FigmaVariable>;
}

// ============================================================================
// POST Variables API Types (Write Endpoint)
// ============================================================================

/**
 * Action type for variable mutations
 */
export type FigmaVariableAction = 'CREATE' | 'UPDATE' | 'DELETE';

/**
 * Change to a variable collection
 */
export interface FigmaVariableCollectionChange {
  /** Action to perform */
  action: FigmaVariableAction;

  /**
   * Collection ID.
   * Required for UPDATE/DELETE.
   * Optional for CREATE — use a temporary ID to reference in the same request.
   */
  id?: string;

  /** Collection name (required for CREATE) */
  name?: string;

  /** Parent collection ID for extended collections */
  parentVariableCollectionId?: string;

  /**
   * Temporary ID for the initial mode created with the collection.
   * Cannot be used with parentVariableCollectionId.
   */
  initialModeId?: string;

  /** Maps initial mode temporary IDs to parent mode IDs (for extended collections) */
  initialModeIdToParentModeIdMapping?: Record<string, string>;

  /** Whether to hide the collection from publishing */
  hiddenFromPublishing?: boolean;
}

/**
 * Change to a variable mode
 */
export interface FigmaVariableModeChange {
  /** Action to perform */
  action: FigmaVariableAction;

  /**
   * Mode ID.
   * Required for UPDATE/DELETE.
   * Optional for CREATE — use a temporary ID to reference in the same request.
   */
  id?: string;

  /** Mode name (required for CREATE; max 40 characters) */
  name?: string;

  /** Collection this mode belongs to (required; can reference temporary IDs) */
  variableCollectionId: string;
}

/**
 * Change to a variable
 */
export interface FigmaVariableChange {
  /** Action to perform */
  action: FigmaVariableAction;

  /**
   * Variable ID.
   * Required for UPDATE/DELETE.
   * Optional for CREATE — use a temporary ID to reference in the same request.
   */
  id?: string;

  /** Variable name (required for CREATE; must be unique in collection; no `.`, `{`, `}`) */
  name?: string;

  /** Collection this variable belongs to (required for CREATE; can reference temporary IDs) */
  variableCollectionId?: string;

  /** Variable type (required for CREATE) */
  resolvedType?: FigmaVariableType;

  /** Variable description */
  description?: string;

  /** Whether to hide the variable from publishing */
  hiddenFromPublishing?: boolean;

  /** Scopes where this variable can be used */
  scopes?: FigmaVariableScope[];

  /** Code syntax hints per platform */
  codeSyntax?: FigmaCodeSyntax;
}

/**
 * A mode value assignment for a variable
 */
export interface FigmaVariableModeValue {
  /** Variable ID (can be a temporary ID from the same request) */
  variableId: string;

  /** Mode ID (original format updates root; extended format creates override) */
  modeId: string;

  /** The value to set. null removes an override in extended collections. */
  value: FigmaVariableValue | null;
}

/**
 * Request body for POST /v1/files/:file_key/variables
 *
 * All four arrays are optional. They are applied in order:
 * variableCollections -> variableModes -> variables -> variableModeValues
 *
 * The entire request is atomic — validation failure rolls back all changes.
 *
 * @see https://developers.figma.com/docs/rest-api/variables-endpoints/
 */
export interface FigmaPostVariablesRequest {
  /** Collection create/update/delete operations */
  variableCollections?: FigmaVariableCollectionChange[];

  /** Mode create/update/delete operations */
  variableModes?: FigmaVariableModeChange[];

  /** Variable create/update/delete operations */
  variables?: FigmaVariableChange[];

  /** Mode value assignments */
  variableModeValues?: FigmaVariableModeValue[];
}

/**
 * Response from POST /v1/files/:file_key/variables
 */
export interface FigmaPostVariablesResponse {
  /** HTTP status code */
  status: number;

  /** Whether an error occurred */
  error: boolean;

  /** Response metadata */
  meta: {
    /** Maps temporary IDs from the request to real Figma IDs */
    tempIdToRealId: Record<string, string>;
  };
}

// ============================================================================
// Library Analytics API Types
// ============================================================================

/**
 * Cursor-based paginated response from Figma Analytics API
 */
export interface FigmaPaginatedResponse<T> {
  /** Rows of analytics data */
  rows: T[];

  /** Cursor for fetching the next page (pass as `cursor` query param) */
  cursor: string;

  /** Whether more pages are available */
  next_page: boolean;
}

// ---------------------------------------------------------------------------
// Component Analytics
// ---------------------------------------------------------------------------

/**
 * Component action row grouped by component
 */
export interface FigmaComponentActionByComponent {
  /** Component key */
  component_key: string;

  /** Week the data covers (ISO 8601 date) */
  week: string;

  /** Number of detachments */
  detachments: number;

  /** Number of insertions */
  insertions: number;

  /** Component name */
  component_name: string;

  /** Parent component set key (for variants) */
  component_set_key: string;

  /** Parent component set name */
  component_set_name: string;
}

/**
 * Component action row grouped by team
 */
export interface FigmaActionByTeam {
  /** Week the data covers (ISO 8601 date) */
  week: string;

  /** Number of detachments */
  detachments: number;

  /** Number of insertions */
  insertions: number;

  /** Team name */
  team_name: string;

  /** Workspace name */
  workspace_name: string;
}

/**
 * Component usage row grouped by component
 */
export interface FigmaComponentUsageByComponent {
  /** Component key */
  component_key: string;

  /** Total number of usages */
  usages: number;

  /** Number of teams using this component */
  teams_using: number;

  /** Number of files using this component */
  files_using: number;

  /** Component name */
  component_name: string;

  /** Parent component set key */
  component_set_key: string;

  /** Parent component set name */
  component_set_name: string;
}

/**
 * Usage row grouped by file (shared by component, style, and variable usages)
 */
export interface FigmaUsageByFile {
  /** Total number of usages */
  usages: number;

  /** Team name */
  team_name: string;

  /** Workspace name */
  workspace_name: string;

  /** File name (may be "File not visible" if no access) */
  file_name: string;
}

// ---------------------------------------------------------------------------
// Style Analytics
// ---------------------------------------------------------------------------

/**
 * Style action row grouped by style
 */
export interface FigmaStyleActionByStyle {
  /** Style key */
  style_key: string;

  /** Week the data covers (ISO 8601 date) */
  week: string;

  /** Number of detachments */
  detachments: number;

  /** Number of insertions */
  insertions: number;

  /** Style name */
  style_name: string;

  /** Style type (FILL, TEXT, EFFECT, GRID) */
  style_type: string;
}

/**
 * Style usage row grouped by style
 */
export interface FigmaStyleUsageByStyle {
  /** Style key */
  style_key: string;

  /** Total number of usages */
  usages: number;

  /** Number of teams using this style */
  teams_using: number;

  /** Number of files using this style */
  files_using: number;

  /** Style name */
  style_name: string;

  /** Style type (FILL, TEXT, EFFECT, GRID) */
  style_type: string;
}

// ---------------------------------------------------------------------------
// Variable Analytics
// ---------------------------------------------------------------------------

/**
 * Variable action row grouped by variable
 */
export interface FigmaVariableActionByVariable {
  /** Variable key */
  variable_key: string;

  /** Week the data covers (ISO 8601 date) */
  week: string;

  /** Number of detachments */
  detachments: number;

  /** Number of insertions */
  insertions: number;

  /** Variable name */
  variable_name: string;

  /** Variable type (BOOLEAN, FLOAT, STRING, COLOR) */
  variable_type: string;

  /** Collection key */
  collection_key: string;

  /** Collection name */
  collection_name: string;
}

/**
 * Variable usage row grouped by variable
 */
export interface FigmaVariableUsageByVariable {
  /** Variable key */
  variable_key: string;

  /** Total number of usages */
  usages: number;

  /** Number of teams using this variable */
  teams_using: number;

  /** Number of files using this variable */
  files_using: number;

  /** Variable name */
  variable_name: string;

  /** Variable type (BOOLEAN, FLOAT, STRING, COLOR) */
  variable_type: string;

  /** Collection key */
  collection_key: string;

  /** Collection name */
  collection_name: string;
}

// ---------------------------------------------------------------------------
// Analytics Query Options
// ---------------------------------------------------------------------------

/**
 * Options for action analytics endpoints (component/style/variable actions)
 */
export interface FigmaAnalyticsActionsOptions {
  /** Start date (ISO 8601 YYYY-MM-DD; rounded back to previous week start) */
  startDate?: string;

  /** End date (ISO 8601 YYYY-MM-DD; rounded forward to week end) */
  endDate?: string;

  /** Cursor for pagination (from previous response) */
  cursor?: string;
}

/**
 * Options for usage analytics endpoints (component/style/variable usages)
 */
export interface FigmaAnalyticsUsagesOptions {
  /** Cursor for pagination (from previous response) */
  cursor?: string;
}

// ============================================================================
// Shared API Types
// ============================================================================

/**
 * Figma user object
 */
export interface FigmaUser {
  /** Unique stable user ID */
  id: string;

  /** User display name */
  handle: string;

  /** URL to user's profile image */
  img_url: string;

  /** Email (only present on /v1/me endpoint) */
  email?: string;
}

/**
 * Frame information for component containment
 */
export interface FigmaContainingFrame {
  /** Node ID of the containing frame */
  nodeId?: string;

  /** Name of the containing frame */
  name?: string;

  /** Background color of the frame */
  backgroundColor?: string;

  /** Page ID containing the frame */
  pageId?: string;

  /** Page name */
  pageName?: string;
}

// ============================================================================
// Published Library Types
// ============================================================================

/**
 * Published component metadata from library endpoints
 */
export interface FigmaPublishedComponent {
  /** Component key (unique across files) */
  key: string;

  /** File key where component lives */
  file_key: string;

  /** Node ID within the file */
  node_id: string;

  /** URL to component thumbnail */
  thumbnail_url: string;

  /** Component name */
  name: string;

  /** Component description */
  description: string;

  /** Last updated timestamp (ISO 8601) */
  updated_at: string;

  /** Created timestamp (ISO 8601) */
  created_at: string;

  /** User who last updated the component */
  user: FigmaUser;

  /** Frame containing this component */
  containing_frame: FigmaContainingFrame;
}

/**
 * Published component set metadata (variant groups)
 */
export interface FigmaPublishedComponentSet {
  /** Component set key */
  key: string;

  /** File key */
  file_key: string;

  /** Node ID */
  node_id: string;

  /** Thumbnail URL */
  thumbnail_url: string;

  /** Component set name */
  name: string;

  /** Description */
  description: string;

  /** Last updated (ISO 8601) */
  updated_at: string;

  /** Created (ISO 8601) */
  created_at: string;

  /** User who last updated */
  user: FigmaUser;

  /** Containing frame */
  containing_frame: FigmaContainingFrame;
}

/**
 * Published style metadata from library endpoints
 */
export interface FigmaPublishedStyle {
  /** Style key */
  key: string;

  /** File key */
  file_key: string;

  /** Node ID */
  node_id: string;

  /** Style type */
  style_type: FigmaStyleType;

  /** Thumbnail URL */
  thumbnail_url: string;

  /** Style name */
  name: string;

  /** Description */
  description: string;

  /** Last updated (ISO 8601) */
  updated_at: string;

  /** Created (ISO 8601) */
  created_at: string;

  /** Sort position */
  sort_position: string;

  /** User who last updated */
  user: FigmaUser;
}

// ============================================================================
// Version History Types
// ============================================================================

/**
 * File version from version history
 */
export interface FigmaVersion {
  /** Unique version identifier */
  id: string;

  /** Created timestamp (UTC ISO 8601) */
  created_at: string;

  /** Version label (set by user in editor) */
  label: string;

  /** Version description */
  description: string;

  /** User who created this version */
  user: FigmaUser;
}

/**
 * Version history response with URL-based pagination
 */
export interface FigmaVersionsResponse {
  /** List of versions */
  versions: FigmaVersion[];

  /** Pagination cursors */
  pagination: {
    /** URL for previous page (empty string if none) */
    prev_page: string;

    /** URL for next page (empty string if none) */
    next_page: string;
  };
}

// ============================================================================
// File Metadata Types
// ============================================================================

/**
 * Lightweight file metadata (from /v1/files/:key/meta)
 */
export interface FigmaFileMetadata {
  /** File name */
  name: string;

  /** Folder name */
  folder_name: string;

  /** Last touched timestamp */
  last_touched_at: string;

  /** User who created the file */
  creator: FigmaUser;

  /** User who last touched the file */
  last_touched_by: FigmaUser;

  /** Thumbnail URL */
  thumbnail_url: string;

  /** Editor type */
  editorType: 'figma' | 'figjam';

  /** File version */
  version: string;

  /** User role */
  role: string;

  /** Link access level */
  link_access: string;

  /** Figma URL for the file */
  url: string;
}

// ============================================================================
// Export/Sync Options
// ============================================================================

/**
 * Options for exporting tokens from Figma
 */
export interface ExportTokensOptions {
  /** Figma file key */
  fileKey: string;

  /** Output directory for exported tokens */
  outputDir: string;

  /** Specific collections to export (exports all if not specified) */
  collections?: string[];

  /** Specific modes to export (exports all if not specified) */
  modes?: string[];

  /** Output format */
  format?: 'dtcg' | 'tokens-studio' | 'style-dictionary';

  /** Whether to include descriptions */
  includeDescriptions?: boolean;

  /** Whether to resolve aliases to values */
  resolveAliases?: boolean;

  /** Whether to group by collection */
  groupByCollection?: boolean;
}

/**
 * Result of exporting tokens from Figma
 */
export interface ExportTokensResult {
  /** Whether export was successful */
  success: boolean;

  /** Exported files */
  files: ExportedFile[];

  /** Total token count */
  tokenCount: number;

  /** Total collection count */
  collectionCount: number;

  /** Errors encountered */
  errors: string[];

  /** Warnings */
  warnings: string[];
}

/**
 * Exported file metadata
 */
export interface ExportedFile {
  /** File path */
  path: string;

  /** Collection name */
  collection: string;

  /** Mode name (if applicable) */
  mode?: string;

  /** Token count in file */
  tokenCount: number;
}

/**
 * Options for syncing tokens with Figma
 */
export interface SyncFigmaOptions {
  /** Figma file key */
  fileKey: string;

  /** Local tokens directory */
  tokensDir: string;

  /** Sync direction */
  direction: 'pull' | 'push' | 'both';

  /** Conflict resolution strategy */
  conflictResolution?: 'local' | 'remote' | 'manual';

  /** Whether to perform a dry run */
  dryRun?: boolean;

  /** Whether to create backups before sync */
  backup?: boolean;
}

/**
 * Result of syncing tokens with Figma
 */
export interface SyncFigmaResult {
  /** Whether sync was successful */
  success: boolean;

  /** Sync direction performed */
  direction: 'pull' | 'push' | 'both';

  /** Tokens added */
  added: string[];

  /** Tokens updated */
  updated: string[];

  /** Tokens removed */
  removed: string[];

  /** Conflicts encountered */
  conflicts: SyncConflict[];

  /** Errors */
  errors: string[];
}

/**
 * Sync conflict
 */
export interface SyncConflict {
  /** Token path */
  path: string;

  /** Local value */
  localValue: unknown;

  /** Remote value */
  remoteValue: unknown;

  /** Resolution (if resolved) */
  resolution?: 'local' | 'remote';
}

// ============================================================================
// Code Connect Types
// ============================================================================

/**
 * Code Connect configuration
 */
export interface CodeConnectConfig {
  /** Parser to use */
  parser: 'react' | 'html' | 'swift' | 'compose';

  /** Include patterns */
  include: string[];

  /** Exclude patterns */
  exclude?: string[];

  /** Component mappings */
  components: Record<string, CodeConnectComponent>;
}

/**
 * Code Connect component mapping
 */
export interface CodeConnectComponent {
  /** Figma component key or URL */
  figma: string;

  /** Local file path */
  file: string;

  /** Props mapping */
  props?: Record<string, CodeConnectProp>;

  /** Example code */
  example?: string;
}

/**
 * Code Connect prop mapping
 */
export interface CodeConnectProp {
  /** Figma property name */
  figma: string;

  /** Prop type */
  type?: 'boolean' | 'enum' | 'string' | 'instance';

  /** Enum value mappings */
  values?: Record<string, unknown>;
}

// ============================================================================
// Styles API Response Types
// ============================================================================

/**
 * Figma effect style (shadows, blurs, etc.)
 */
export interface FigmaEffectStyle {
  /** Style key */
  key: string;

  /** Style name */
  name: string;

  /** Style description */
  description: string;

  /** Style type (always 'EFFECT' for effects) */
  styleType: 'EFFECT';

  /** Effects in this style */
  effects: FigmaEffect[];
}

/**
 * Figma effect (shadow, blur, etc.)
 */
export interface FigmaEffect {
  /** Effect type */
  type: 'DROP_SHADOW' | 'INNER_SHADOW' | 'LAYER_BLUR' | 'BACKGROUND_BLUR';

  /** Whether the effect is visible */
  visible: boolean;

  /** Blend mode */
  blendMode?: string;

  /** Effect color (for shadows) */
  color?: FigmaColor;

  /** X offset (for shadows) */
  offset?: { x: number; y: number };

  /** Blur radius */
  radius?: number;

  /** Spread (for shadows) */
  spread?: number;

  /** Bound variables */
  boundVariables?: Record<string, FigmaVariableAlias>;
}

/**
 * Figma paint style (fills, strokes)
 */
export interface FigmaPaintStyle {
  /** Style key */
  key: string;

  /** Style name */
  name: string;

  /** Style description */
  description: string;

  /** Style type (always 'FILL' for paints) */
  styleType: 'FILL';

  /** Paints in this style */
  paints: FigmaPaint[];
}

/**
 * Figma paint (solid, gradient, image)
 */
export interface FigmaPaint {
  /** Paint type */
  type:
    | 'SOLID'
    | 'GRADIENT_LINEAR'
    | 'GRADIENT_RADIAL'
    | 'GRADIENT_ANGULAR'
    | 'GRADIENT_DIAMOND'
    | 'IMAGE'
    | 'EMOJI';

  /** Whether the paint is visible */
  visible: boolean;

  /** Opacity (0-1) */
  opacity?: number;

  /** Solid color */
  color?: FigmaColor;

  /** Gradient stops */
  gradientStops?: FigmaGradientStop[];

  /** Bound variables */
  boundVariables?: Record<string, FigmaVariableAlias>;
}

/**
 * Figma gradient stop
 */
export interface FigmaGradientStop {
  /** Position (0-1) */
  position: number;

  /** Color at this stop */
  color: FigmaColor;
}

/**
 * Figma text style
 */
export interface FigmaTextStyle {
  /** Style key */
  key: string;

  /** Style name */
  name: string;

  /** Style description */
  description: string;

  /** Style type (always 'TEXT' for text) */
  styleType: 'TEXT';

  /** Font family */
  fontFamily: string;

  /** Font weight */
  fontWeight: number;

  /** Font size */
  fontSize: number;

  /** Line height */
  lineHeight: FigmaLineHeight;

  /** Letter spacing */
  letterSpacing: FigmaLetterSpacing;

  /** Text case */
  textCase?: 'ORIGINAL' | 'UPPER' | 'LOWER' | 'TITLE';

  /** Text decoration */
  textDecoration?: 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH';

  /** Bound variables */
  boundVariables?: Record<string, FigmaVariableAlias>;
}

/**
 * Figma line height
 */
export interface FigmaLineHeight {
  /** Line height unit */
  unit: 'PIXELS' | 'PERCENT' | 'AUTO';

  /** Line height value */
  value?: number;
}

/**
 * Figma letter spacing
 */
export interface FigmaLetterSpacing {
  /** Letter spacing unit */
  unit: 'PIXELS' | 'PERCENT';

  /** Letter spacing value */
  value: number;
}

/**
 * Token category hints for special types
 */
export type TokenCategory =
  | 'fontWeight'
  | 'fontFamily'
  | 'fontSize'
  | 'lineHeight'
  | 'letterSpacing'
  | 'color'
  | 'dimension'
  | 'shadow';

/**
 * Token extensions following DTCG spec
 * Contains only parsed metadata from descriptions (docs, platform, etc.)
 */
export interface TokenExtensions {
  /** Documentation metadata parsed from description */
  docs?: Record<string, string>;

  /** Platform-specific metadata parsed from description */
  platform?: Record<string, string>;

  /** Allow additional parsed metadata categories */
  [key: string]: unknown;
}

/**
 * Extended export options with styles support
 */
export interface ExtendedExportOptions extends ExportTokensOptions {
  /** Whether to include effect styles (shadows, blurs) */
  includeEffects?: boolean;

  /** Whether to include paint styles (fills) */
  includePaints?: boolean;

  /** Whether to include text styles (typography) */
  includeTextStyles?: boolean;

  /**
   * Output structure for token files:
   * - 'separate': One file per mode (e.g., color.light.json, color.dark.json) - default
   * - 'combined': Single file with Collection > modes > ModeName structure
   */
  outputStructure?: 'separate' | 'combined';
}
