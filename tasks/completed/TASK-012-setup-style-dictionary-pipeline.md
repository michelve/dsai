# TASK-012: Setup Style Dictionary Pipeline

**Task ID:** TASK-012
**Title:** Setup Style Dictionary Pipeline
**Priority:** High
**Status:** ✅ **COMPLETE**
**Assigned To:** Developer
**Estimated Time:** 6 hours (100% complete)
**Actual Time:** 6 hours
**Completion Date:** November 21, 2024
**Phase:** Phase 1 - Token System (Weeks 3-6)

---

## Description

Set up Style Dictionary to transform design tokens from JSON format into multiple output formats (CSS variables, JavaScript, TypeScript, SCSS). This pipeline will be the core of the token distribution system, ensuring design tokens are available in all necessary formats for consumption by components.

---

## Acceptance Criteria

### Style Dictionary Installation and Configuration

- [x] Style Dictionary installed in `@dsai/tokens` package (v5.1.1)
- [x] `sd.config.mjs` created with complete ES Module configuration
- [x] Build script configured in `package.json`
- [x] Output directories configured for different formats

### Output Formats

- [x] **CSS Variables** output (`dist/css/variables.css`)
  - All tokens as CSS custom properties
  - Organized by category
  - Includes light mode (dark mode in future task)
- [x] **JavaScript/ES6** output (`dist/js/tokens.js`)
  - Tokens as JavaScript object
  - Tree-shakeable exports
- [x] **TypeScript** output (`dist/ts/tokens.ts`)
  - Tokens with TypeScript types
  - IntelliSense support
- [x] **SCSS Variables** output (`dist/scss/_variables.scss`)
  - For SCSS-based projects
- [x] **JSON** output (`dist/json/tokens.json`)
  - Flattened token structure
  - For documentation or tooling

### Token Transformations

- [x] Color transforms:
  - Hex colors preserved
  - Token references resolved
  - CSS color format applied
- [x] Size transforms:
  - px to rem conversion (base 16px)
  - Dimension transforms applied
- [x] Name transforms:
  - kebab-case for CSS variables
  - camelCase for JavaScript exports
  - Token path to CSS variable name

### Build Process

- [x] Build command: `pnpm build:tokens`
- [x] Watch mode: `pnpm tokens:watch` (rebuild on change)
- [x] Clean command: `pnpm tokens:clean` (remove dist)
- [x] Build is integrated into main monorepo build
- [x] Build output is gitignored (generated files)

### Validation and Testing

- [x] Token validation runs before build
- [x] Build fails on invalid tokens or circular references
- [x] Generated CSS is valid (no syntax errors) - 304 variables
- [x] Generated TypeScript compiles without errors
- [x] Token references resolve correctly

### Documentation

- [x] README in `@dsai/tokens` explains:
  - How to build tokens
  - How to add new tokens
  - How to consume tokens in different formats
  - Token naming conventions
- [x] Examples provided for each output format (CSS, React, JS, SCSS, Styled Components)

---

## Dependencies

### Requires:

- **TASK-001**: Nx Monorepo Structure (tokens package)
- **TASK-002**: TypeScript/ESLint Configuration (for TS output)
- **TASK-011**: Design JSON Token Structure (tokens to transform)

### Blocks:

- **TASK-014**: Create Base Component Template (needs tokens)
- **TASK-015**: Token-to-CSS Variable Generation (uses this pipeline)
- **TASK-016**: TypeScript Types for Tokens (builds on this)
- All component tasks (consume generated tokens)

---

## Implementation Steps

### Step 1: Install Style Dictionary (0.5 hours)

1. Navigate to `packages/tokens`
2. Install Style Dictionary:
   ```bash
   pnpm add -D style-dictionary
   ```
3. Verify installation: `pnpm style-dictionary --version`

### Step 2: Create Configuration File (1.5 hours)

1. Create `style-dictionary.config.js`:
   ```javascript
   module.exports = {
     source: ['tokens/**/*.json'],
     platforms: {
       css: {
         transformGroup: 'css',
         buildPath: 'dist/css/',
         files: [
           {
             destination: 'variables.css',
             format: 'css/variables',
           },
         ],
       },
       js: {
         transformGroup: 'js',
         buildPath: 'dist/js/',
         files: [
           {
             destination: 'tokens.js',
             format: 'javascript/es6',
           },
         ],
       },
     },
   };
   ```
2. Configure all 5 output formats (CSS, JS, TS, SCSS, JSON)
3. Set up token filtering if needed (e.g., exclude internal tokens)
4. Configure custom naming conventions

### Step 3: Create Custom Transforms (1.5 hours)

1. Create custom transforms for px to rem:
   ```javascript
   StyleDictionary.registerTransform({
     name: 'size/pxToRem',
     type: 'value',
     matcher: (token) => token.type === 'dimension',
     transformer: (token) => {
       const val = parseFloat(token.value);
       return `${val / 16}rem`;
     },
   });
   ```
2. Create transform for kebab-case naming
3. Create transform for color contrast checks
4. Register all custom transforms

### Step 4: Configure Build Scripts (1 hour)

1. Add scripts to `packages/tokens/package.json`:
   ```json
   {
     "scripts": {
       "build": "style-dictionary build",
       "build:watch": "style-dictionary build --watch",
       "clean": "rimraf dist"
     }
   }
   ```
2. Integrate with Nx: update `project.json` with build target
3. Add tokens build to root-level build command
4. Set up watch mode for development

### Step 5: Test Token Generation (1 hour)

1. Run build: `pnpm build:tokens`
2. Verify all output files are generated:
   - `dist/css/variables.css`
   - `dist/js/tokens.js`
   - `dist/ts/tokens.ts`
   - `dist/scss/_variables.scss`
   - `dist/json/tokens.json`
3. Inspect CSS output for correct CSS variables
4. Inspect TS output for correct types
5. Test importing tokens in a test file

### Step 6: Add Validation (0.5 hours)

1. Create pre-build validation script
2. Check for:
   - Invalid JSON syntax
   - Missing required properties
   - Unresolved token references
   - Circular references
3. Add validation to build process
4. Ensure build fails on validation errors

### Step 7: Documentation (1 hour)

1. Create comprehensive README:
   - Project overview
   - How to build tokens
   - How to add new tokens
   - Token consumption examples
   - Output format descriptions
2. Add inline code comments
3. Create migration guide (if updating existing tokens)

---

## Definition of Done

- [ ] Style Dictionary installed and configured
- [ ] All 5 output formats generate correctly (CSS, JS, TS, SCSS, JSON)
- [ ] Custom transforms implemented (px to rem, naming, color checks)
- [ ] Build scripts work (`build`, `watch`, `clean`)
- [ ] Token generation is integrated into Nx build
- [ ] Validation runs before build and catches errors
- [ ] Generated CSS is valid and usable
- [ ] Generated TypeScript compiles without errors
- [ ] Documentation is complete and clear
- [ ] Build process reviewed and approved by team
- [ ] Tokens can be imported and used in test component

---

## Notes

### Style Dictionary Benefits:

- Single source of truth (JSON tokens)
- Multiple output formats from one source
- Consistent naming and values across platforms
- Extensible with custom transforms and formats

### Output Format Usage:

- **CSS Variables**: For vanilla CSS and CSS Modules
- **JavaScript**: For styled-components, Emotion
- **TypeScript**: For type-safe token access
- **SCSS**: For legacy SCSS projects
- **JSON**: For documentation or third-party tools

### Transform Pipeline:

1. Parse JSON tokens
2. Apply transforms (px→rem, camelCase→kebab-case)
3. Resolve references ({color.teal.500})
4. Generate output files
5. Validate output

---

## Related Tasks

- **TASK-001**: Nx Monorepo Structure
- **TASK-002**: TypeScript/ESLint Configuration
- **TASK-011**: Design JSON Token Structure
- **TASK-015**: Token-to-CSS Variable Generation
- **TASK-016**: TypeScript Types for Tokens

---

## Risks and Mitigations

**Risk:** Style Dictionary doesn't support needed output format

- **Mitigation:** Create custom format (Style Dictionary is extensible)

**Risk:** Token transformations produce incorrect values

- **Mitigation:** Write tests for transforms, validate output

**Risk:** Build is slow with many tokens

- **Mitigation:** Optimize transforms, use watch mode during development

---

**Estimated Effort Breakdown:**

- Install Style Dictionary: 0.5 hours
- Configuration file: 1.5 hours
- Custom transforms: 1.5 hours
- Build scripts: 1 hour
- Testing: 1 hour
- Validation: 0.5 hours
- Documentation: 1 hour

**Total: 6 hours**
