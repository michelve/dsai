// packages/@dsai-io/react/src/components/Avatar/avatarUtils.ts

/**
 * Avatar Utility Functions
 *
 * Shared helpers for Avatar and AvatarGroup components.
 * Uses Reflect.get() for safe dynamic property access per security policy.
 *
 * @packageDocumentation
 */

import {
  AVATAR_FONT_SIZE_MAP,
  AVATAR_HASH_COLORS,
  AVATAR_SIZE_MAP,
  AVATAR_STATUS_COLOR_MAP,
  AVATAR_STATUS_LABEL_MAP,
  AVATAR_STATUS_SIZE_MAP,
  AVATAR_TONE_MAP,
  AVATAR_GROUP_GAP_MAP,
  AVATAR_GROUP_OVERLAP_MAP,
} from './Avatar.types';

import type {
  AvatarGroupSpacing,
  AvatarProps,
  AvatarSize,
  AvatarStatus,
  AvatarTone,
} from './Avatar.types';

// =============================================================================
// Safe Lookup
// =============================================================================

const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Safe property lookup that blocks prototype pollution keys.
 * Uses Reflect.get() per CLAUDE.md security rules.
 */
export function safeLookup<T>(
  map: Readonly<Record<string, T>>,
  key: string,
  fallback: T
): T {
  if (BLOCKED_KEYS.has(key)) {
    return fallback;
  }
  const value = Reflect.get(map, key) as T | undefined;
  return value !== undefined ? value : fallback;
}

// =============================================================================
// Numeric fallbacks for calculations
// =============================================================================

const AVATAR_SIZE_FALLBACK_NUMBERS: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  '2xl': 80,
  xxl: 96,
};

// =============================================================================
// Avatar Lookups
// =============================================================================

export function getNumericSize(size: AvatarSize): number {
  return safeLookup(AVATAR_SIZE_FALLBACK_NUMBERS, size, 40);
}

export function getSizeValue(size: AvatarSize): string {
  return safeLookup(AVATAR_SIZE_MAP, size, AVATAR_SIZE_MAP.md);
}

export function getFontSize(size: AvatarSize): string {
  return safeLookup(AVATAR_FONT_SIZE_MAP, size, AVATAR_FONT_SIZE_MAP.md);
}

export function getStatusSize(size: AvatarSize): string {
  return safeLookup(AVATAR_STATUS_SIZE_MAP, size, AVATAR_STATUS_SIZE_MAP.md);
}

export function getToneClasses(tone: AvatarTone): { bg: string; text: string } {
  return safeLookup(AVATAR_TONE_MAP, tone, AVATAR_TONE_MAP.neutral);
}

export function getStatusLabel(status: AvatarStatus): string {
  return safeLookup(AVATAR_STATUS_LABEL_MAP, status, AVATAR_STATUS_LABEL_MAP.unknown);
}

export function getStatusColor(status: AvatarStatus): string {
  return safeLookup(AVATAR_STATUS_COLOR_MAP, status, AVATAR_STATUS_COLOR_MAP.unknown);
}

// =============================================================================
// AvatarGroup Lookups
// =============================================================================

export function resolveOverlap(spacing: AvatarGroupSpacing): string {
  return safeLookup(AVATAR_GROUP_OVERLAP_MAP, spacing, AVATAR_GROUP_OVERLAP_MAP.normal);
}

export function resolveInlineGap(spacing: AvatarGroupSpacing): string {
  return safeLookup(AVATAR_GROUP_GAP_MAP, spacing, AVATAR_GROUP_GAP_MAP.normal);
}

// =============================================================================
// Name Utilities
// =============================================================================

/**
 * Generates a simple hash from a string.
 * Used for deterministic color selection based on name.
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Gets deterministic tone based on name hash.
 */
export function getToneFromName(name: string): AvatarTone {
  const hash = hashString(name);
  const index = hash % AVATAR_HASH_COLORS.length;
  return AVATAR_HASH_COLORS[index] ?? 'brand';
}

/**
 * Extracts initials from a name string.
 * Returns up to 2 characters (first letter of first and last name).
 */
export function getInitialsFromName(name: string): string {
  if (!name || typeof name !== 'string') {
    return '';
  }

  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '';
  }

  const [firstPart = ''] = parts;

  if (parts.length === 1) {
    return firstPart.substring(0, 2).toUpperCase();
  }

  const lastPart = parts[parts.length - 1] ?? firstPart;
  const first = firstPart[0] ?? '';
  const last = lastPart[0] ?? '';
  return (first + last).toUpperCase();
}

/**
 * Gets shape class based on shape prop.
 */
export function getShapeClass(shape: AvatarProps['shape']): string {
  if (shape === 'square') {
    return '';
  }
  if (shape === 'rounded') {
    return 'rounded-3';
  }
  return 'rounded-circle';
}
