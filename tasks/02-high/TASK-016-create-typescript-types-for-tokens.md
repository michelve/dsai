# TASK-016: Create TypeScript Types for Tokens

**Task ID:** TASK-016
**Title:** Create TypeScript Types for Tokens
**Priority:** Medium
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 4 hours
**Phase:** Phase 1 - Token System (Weeks 3-6)

---

## Description

Generate TypeScript type definitions for all design tokens to enable type-safe token access in components. This includes creating type definitions for token names, values, and categories, as well as providing IntelliSense support for token consumption in TypeScript/React components.

---

## Acceptance Criteria

### TypeScript Type Generation
- [ ] Type definitions generated for all token categories
- [ ] Token names available as string literal types
- [ ] Token values typed correctly (string, number, etc.)
- [ ] Category-specific types (ColorToken, SpacingToken, etc.)

### Type Structure
```typescript
// Example generated types
export type ColorToken = 
  | 'color.teal.50'
  | 'color.teal.100'
  | 'color.primary.500'
  | 'color.button.primary.background';

export type SpacingToken =
  | 'spacing.0'
  | 'spacing.4'
  | 'spacing.8';

export type TypographyFontSizeToken =
  | 'typography.fontSize.h1'
  | 'typography.fontSize.body';

export interface Tokens {
  color: Record<string, string>;
  spacing: Record<string, string>;
  typography: {
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
  };
}
```

### Utility Functions
- [ ] Type-safe token getter: `getToken(category, name)`
- [ ] Token value lookup with TypeScript types
- [ ] IntelliSense support for token names

### Integration
- [ ] Types exported from `@yourorg/tokens` package
- [ ] Types available in component development
- [ ] Types work with styled-components/Emotion (if used)
- [ ] Types integrated with Storybook controls

### Documentation
- [ ] Type usage examples in README
- [ ] JSDoc comments on exported types
- [ ] Migration guide for adding new token types

---

## Dependencies

### Requires:
- **TASK-011**: Design JSON Token Structure
- **TASK-012**: Setup Style Dictionary Pipeline

### Enhances:
- **TASK-014**: Base Component Template (type-safe token access)
- All component tasks (type safety in components)

---

## Implementation Steps

### Step 1: Configure TypeScript Output in Style Dictionary (1 hour)
```javascript
// style-dictionary.config.js
module.exports = {
  platforms: {
    ts: {
      transformGroup: 'js',
      buildPath: 'dist/ts/',
      files: [
        {
          destination: 'tokens.ts',
          format: 'typescript/es6-declarations',
          options: {
            outputStringLiterals: true
          }
        }
      ]
    }
  }
};
```

### Step 2: Create Custom TypeScript Format (1.5 hours)
```javascript
StyleDictionary.registerFormat({
  name: 'typescript/token-types',
  formatter: ({ dictionary }) => {
    const categories = {};
    
    dictionary.allTokens.forEach(token => {
      const [category] = token.path;
      if (!categories[category]) categories[category] = [];
      categories[category].push(token.path.join('.'));
    });
    
    let output = '// Auto-generated token types\n\n';
    
    // Generate string literal types
    Object.keys(categories).forEach(category => {
      const typeName = `${capitalize(category)}Token`;
      output += `export type ${typeName} =\n`;
      output += categories[category].map(t => `  | '${t}'`).join('\n');
      output += ';\n\n';
    });
    
    // Generate token values object type
    output += 'export interface Tokens {\n';
    output += '  // Token values\n';
    output += '}\n';
    
    return output;
  }
});
```

### Step 3: Generate Token Value Types (1 hour)
```typescript
// tokens.ts (generated)
export interface TokenValues {
  color: {
    teal: {
      50: string;
      100: string;
      // ... all teal values
    };
    primary: {
      500: string;
    };
  };
  spacing: {
    0: string;
    4: string;
    // ... all spacing values
  };
}
```

### Step 4: Create Utility Functions (0.5 hours)
```typescript
// token-utils.ts
import { Tokens, ColorToken, SpacingToken } from './tokens';

export function getColorToken(token: ColorToken): string {
  // Implementation
}

export function getSpacingToken(token: SpacingToken): string {
  // Implementation
}

// Generic getter with type safety
export function getToken<T extends keyof Tokens>(
  category: T,
  path: string
): Tokens[T] {
  // Implementation
}
```

### Step 5: Test Type Generation (0.5 hours)
1. Build tokens: `pnpm build:tokens`
2. Verify types are generated in `dist/ts/`
3. Test IntelliSense in IDE
4. Create test file using token types

### Step 6: Documentation (0.5 hours)
```markdown
# Using Token Types

## Import Types
\`\`\`typescript
import { ColorToken, SpacingToken, Tokens } from '@yourorg/tokens';
\`\`\`

## Type-Safe Token Access
\`\`\`typescript
import { getColorToken } from '@yourorg/tokens';

const color: string = getColorToken('color.primary.500');
\`\`\`

## IntelliSense Support
Token names autocomplete in your IDE.
```

---

## Definition of Done

- [ ] TypeScript types generated for all token categories
- [ ] String literal types for token names
- [ ] Token value types (Tokens interface)
- [ ] Utility functions with type safety
- [ ] Types exported from `@yourorg/tokens`
- [ ] IntelliSense works in IDE
- [ ] Types tested with sample component
- [ ] Documentation complete with examples

---

## Notes

### TypeScript Benefits:
- Catch token name typos at compile time
- IntelliSense for token discovery
- Refactoring safety (rename tokens)
- Self-documenting code

### Type Generation Strategy:
- Auto-generate from JSON tokens
- Sync with Style Dictionary build
- Keep types up-to-date automatically

---

## Related Tasks

- **TASK-011**: Design JSON Token Structure
- **TASK-012**: Setup Style Dictionary Pipeline
- **TASK-014**: Base Component Template
- **TASK-015**: Token-to-CSS Variable Generation

---

**Estimated Effort:** 4 hours
