/**
 * @fileoverview Token schema validation
 * Exports Zod schemas and validation functions for token formats
 */

export * from './dtcg-token.schema.js';
export * from './figma-export.schema.js';
export * from './style-dictionary.schema.js';

import { z, type ZodError } from 'zod';

import {
  dtcgFileSchema,
  dtcgTokenCollectionSchema,
  type DTCGFile,
  type DTCGTokenCollection,
} from './dtcg-token.schema.js';
import {
  figmaExportSchema,
  figmaExportWithMetadataSchema,
  figmaVariablesResponseSchema,
  type FigmaExport,
  type FigmaExportWithMetadata,
  type FigmaVariablesResponse,
} from './figma-export.schema.js';
import {
  styleDictionaryInputSchema,
  styleDictionaryTokensSchema,
  type StyleDictionaryInput,
  type StyleDictionaryTokens,
} from './style-dictionary.schema.js';

/**
 * Validation error details
 */
export interface ValidationError {
  /** Path to the invalid token (e.g., "colors.primary.$value") */
  path: string;
  /** Error message */
  message: string;
  /** The invalid value */
  value?: unknown;
  /** Error code from Zod */
  code?: string;
}

/**
 * Validation result
 */
export interface ValidationResult<T = unknown> {
  /** Whether validation passed */
  valid: boolean;
  /** Validated and typed data (only if valid) */
  data?: T;
  /** Validation errors (only if invalid) */
  errors?: ValidationError[];
  /** Original Zod error (for debugging) */
  zodError?: ZodError;
}

/**
 * Validation options
 */
export interface ValidationOptions {
  /** Strict mode - treat warnings as errors */
  strict?: boolean;
  /** Abort after first error */
  abortEarly?: boolean;
}

/**
 * Format Zod errors into readable validation errors
 */
function formatZodErrors(zodError: ZodError): ValidationError[] {
  return zodError.errors.map((err) => ({
    path: err.path.join('.'),
    message: err.message,
    value: undefined,
    code: err.code,
  }));
}

/**
 * Validate DTCG token collection
 *
 * @param data - Data to validate
 * @param options - Validation options
 * @returns Validation result with typed data
 *
 * @example
 * ```ts
 * const result = validateDTCGTokens({
 *   colors: {
 *     primary: {
 *       $value: '#0066ff',
 *       $type: 'color',
 *     },
 *   },
 * });
 *
 * if (result.valid) {
 *   console.log('Valid tokens:', result.data);
 * } else {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export function validateDTCGTokens(
  data: unknown,
  _options: ValidationOptions = {}
): ValidationResult<DTCGTokenCollection> {
  try {
    const validated = dtcgTokenCollectionSchema.parse(data);
    return {
      valid: true,
      data: validated,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: formatZodErrors(error),
        zodError: error,
      };
    }
    return {
      valid: false,
      errors: [
        {
          path: '',
          message: error instanceof Error ? error.message : String(error),
        },
      ],
    };
  }
}

/**
 * Validate DTCG file format
 *
 * @param data - Data to validate
 * @param options - Validation options
 * @returns Validation result with typed data
 */
export function validateDTCGFile(
  data: unknown,
  _options: ValidationOptions = {}
): ValidationResult<DTCGFile> {
  try {
    const validated = dtcgFileSchema.parse(data);
    return {
      valid: true,
      data: validated,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: formatZodErrors(error),
        zodError: error,
      };
    }
    return {
      valid: false,
      errors: [
        {
          path: '',
          message: error instanceof Error ? error.message : String(error),
        },
      ],
    };
  }
}

/**
 * Validate Figma export format
 *
 * @param data - Data to validate
 * @param options - Validation options
 * @returns Validation result with typed data
 *
 * @example
 * ```ts
 * const result = validateFigmaExport(exportedData);
 * if (!result.valid) {
 *   console.error('Invalid Figma export:', result.errors);
 * }
 * ```
 */
export function validateFigmaExport(
  data: unknown,
  _options: ValidationOptions = {}
): ValidationResult<FigmaExport> {
  try {
    const validated = figmaExportSchema.parse(data);
    return {
      valid: true,
      data: validated,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: formatZodErrors(error),
        zodError: error,
      };
    }
    return {
      valid: false,
      errors: [
        {
          path: '',
          message: error instanceof Error ? error.message : String(error),
        },
      ],
    };
  }
}

/**
 * Validate Figma export with metadata
 *
 * @param data - Data to validate
 * @param options - Validation options
 * @returns Validation result with typed data
 */
export function validateFigmaExportWithMetadata(
  data: unknown,
  _options: ValidationOptions = {}
): ValidationResult<FigmaExportWithMetadata> {
  try {
    const validated = figmaExportWithMetadataSchema.parse(data);
    return {
      valid: true,
      data: validated,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: formatZodErrors(error),
        zodError: error,
      };
    }
    return {
      valid: false,
      errors: [
        {
          path: '',
          message: error instanceof Error ? error.message : String(error),
        },
      ],
    };
  }
}

/**
 * Validate Figma Variables API response
 *
 * @param data - Data to validate
 * @param options - Validation options
 * @returns Validation result with typed data
 */
export function validateFigmaVariablesResponse(
  data: unknown,
  _options: ValidationOptions = {}
): ValidationResult<FigmaVariablesResponse> {
  try {
    const validated = figmaVariablesResponseSchema.parse(data);
    return {
      valid: true,
      data: validated,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: formatZodErrors(error),
        zodError: error,
      };
    }
    return {
      valid: false,
      errors: [
        {
          path: '',
          message: error instanceof Error ? error.message : String(error),
        },
      ],
    };
  }
}

/**
 * Validate Style Dictionary input format
 *
 * @param data - Data to validate
 * @param options - Validation options
 * @returns Validation result with typed data
 *
 * @example
 * ```ts
 * const result = validateStyleDictionaryInput(tokens);
 * if (!result.valid) {
 *   throw new Error(`Invalid tokens: ${result.errors.map(e => e.message).join(', ')}`);
 * }
 * ```
 */
export function validateStyleDictionaryInput(
  data: unknown,
  _options: ValidationOptions = {}
): ValidationResult<StyleDictionaryInput> {
  try {
    const validated = styleDictionaryInputSchema.parse(data);
    return {
      valid: true,
      data: validated,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: formatZodErrors(error),
        zodError: error,
      };
    }
    return {
      valid: false,
      errors: [
        {
          path: '',
          message: error instanceof Error ? error.message : String(error),
        },
      ],
    };
  }
}

/**
 * Validate Style Dictionary tokens
 *
 * @param data - Data to validate
 * @param options - Validation options
 * @returns Validation result with typed data
 */
export function validateStyleDictionaryTokens(
  data: unknown,
  _options: ValidationOptions = {}
): ValidationResult<StyleDictionaryTokens> {
  try {
    const validated = styleDictionaryTokensSchema.parse(data);
    return {
      valid: true,
      data: validated,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: formatZodErrors(error),
        zodError: error,
      };
    }
    return {
      valid: false,
      errors: [
        {
          path: '',
          message: error instanceof Error ? error.message : String(error),
        },
      ],
    };
  }
}
