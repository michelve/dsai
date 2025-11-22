# TASK-013: Configure Storybook 7

**Task ID:** TASK-013
**Title:** Configure Storybook 8
**Priority:** High
**Status:** ✅ COMPLETE
**Assigned To:** Developer
**Estimated Time:** 8 hours
**Actual Time:** 6 hours
**Completed:** November 21, 2025
**Phase:** Phase 1 - Token System (Weeks 3-6)

---

## Description

Set up Storybook 10 as the documentation and development environment for the component library. Configure Storybook with TypeScript, React 18+, MDX documentation, accessibility testing, and design token integration. This will serve as the single source of truth for component documentation and examples.

---

## Acceptance Criteria

### Storybook Installation

- [x] Storybook 8.6.14 installed in `@dsai/storybook` package
- [x] All required addons installed:
  - `@storybook/addon-essentials`
  - `@storybook/addon-a11y` (accessibility)
  - `@storybook/addon-interactions` (interaction testing)
  - `@storybook/addon-links`
  - `@storybook/addon-designs` (Figma integration)
- [x] Storybook runs successfully: `nx run storybook:storybook`
- [x] Storybook builds for production: `nx run storybook:build-storybook`

### TypeScript Configuration

- [x] Storybook configured to use TypeScript
- [x] Props auto-documentation from TypeScript types (`react-docgen-typescript`)
- [x] TypeScript errors shown in Storybook UI
- [x] IntelliSense works in story files

### Theme and Branding

- [x] Custom Storybook theme matching design system
- [x] Brand colors applied (#0ea5e9 cyan/teal primary)
- [x] Custom theme in `manager.ts`
- [x] Typography using Inter font family
- [x] Background colors and UI customization

### Design Token Integration

- [x] Design tokens imported into Storybook (CSS variables)
- [x] Token documentation pages created:
  - Colors with interactive swatches
  - Typography scale with examples
  - Spacing scale with visualizations
- [x] All foundation tokens displayed and documented
- [x] Components use tokens from `@dsai/tokens`

### Accessibility Features

- [x] `@storybook/addon-a11y` configured
- [x] Accessibility panel shows in each story
- [x] WCAG 2.1 AA violations highlighted automatically
- [x] Keyboard navigation testing enabled
- [x] Screen reader simulation available via addon

### Documentation Structure

- [x] Welcome/Introduction page (MDX)
- [x] Getting Started guide (MDX with installation, usage, theming)
- [x] Foundation section:
  - [x] Colors documentation (with all 121 colors + semantic)
  - [x] Typography documentation (fonts, sizes, weights, line-heights)
  - [x] Spacing documentation (scale 0-10 with examples)
  - [ ] Shadows documentation (defer to component phase)
  - [ ] Borders documentation (defer to component phase)
- [x] Components section (template created, ready for stories)
- [ ] Changelog page (defer to release phase)

### Story Configuration

- [x] Story template created (`ComponentTemplate.stories.tsx`)
- [x] Controls (args) configured for interactive props
- [x] Actions configured for event handlers
- [x] Docs page auto-generation enabled (`tags: ['autodocs']`)
- [x] Component source code display enabled

### Build and Deploy

- [x] Production build works: `nx run storybook:build-storybook`
- [x] Build output generated (storybook-static/)
- [x] Static files ready for deployment
- [ ] Build integrated into CI/CD pipeline (defer to deployment phase)

---

## Dependencies

### Requires:

- **TASK-001**: Nx Monorepo Structure (storybook package)
- **TASK-002**: TypeScript/ESLint Configuration
- **TASK-011**: Design JSON Token Structure (for token docs)
- **TASK-012**: Style Dictionary Pipeline (for generated tokens)

### Blocks:

- **TASK-014**: Create Base Component Template (needs Storybook for stories)
- **TASK-020**: Design Storybook Theme (refines this)
- All component tasks (use Storybook for documentation)

---

## Implementation Steps

### Step 1: Install Storybook (0.5 hours)

1. Navigate to monorepo root
2. Run Storybook init:
   ```bash
   npx storybook@latest init
   ```
3. Select React + Vite configuration
4. Let Storybook install dependencies
5. Verify installation: `pnpm storybook`

### Step 2: Configure Storybook Structure (1 hour)

1. Create Storybook package structure:
   ```
   packages/storybook/
   ├── .storybook/
   │   ├── main.ts
   │   ├── preview.ts
   │   └── manager.ts
   ├── stories/
   │   ├── Introduction.mdx
   │   ├── foundation/
   │   │   ├── Colors.mdx
   │   │   ├── Typography.mdx
   │   │   └── Spacing.mdx
   │   └── components/ (for component stories)
   └── package.json
   ```
2. Configure `main.ts` with stories glob pattern
3. Set up addons array
4. Configure framework (React + Vite)

### Step 3: Install and Configure Addons (1 hour)

1. Install addons:
   ```bash
   pnpm add -D @storybook/addon-essentials \
     @storybook/addon-a11y \
     @storybook/addon-interactions \
     @storybook/addon-links \
     @storybook/addon-designs
   ```
2. Register addons in `.storybook/main.ts`:
   ```typescript
   addons: [
     '@storybook/addon-essentials',
     '@storybook/addon-a11y',
     '@storybook/addon-interactions',
     '@storybook/addon-links',
     '@storybook/addon-designs',
   ];
   ```
3. Configure addon options (a11y rules, etc.)

### Step 4: Configure TypeScript (1 hour)

1. Create `.storybook/tsconfig.json`:
   ```json
   {
     "extends": "../../tsconfig.base.json",
     "compilerOptions": {
       "jsx": "react-jsx",
       "types": ["node", "@types/react"]
     }
   }
   ```
2. Configure prop types documentation
3. Set up type checking in Storybook
4. Test TypeScript integration with sample story

### Step 5: Create Custom Theme (1.5 hours)

1. Create `.storybook/theme.ts`:

   ```typescript
   import { create } from '@storybook/theming/create';

   export default create({
     base: 'light',
     brandTitle: 'YourOrg Design System',
     brandUrl: 'https://yourorg.com',
     brandImage: './logo.svg',

     colorPrimary: '#00a6b0', // teal-500
     colorSecondary: '#00464a', // teal-800

     // UI colors
     appBg: '#f4f5f5',
     appContentBg: '#ffffff',
     appBorderColor: '#00464a',
     appBorderRadius: 8,

     // Typography
     fontBase: '"Inter", sans-serif',
     fontCode: '"Fira Code", monospace',

     // Text colors
     textColor: '#002a2d',
     textInverseColor: '#ffffff',
   });
   ```

2. Apply theme in `.storybook/manager.ts`
3. Customize toolbar, sidebar, and panel styles
4. Add custom logo and favicon

### Step 6: Integrate Design Tokens (1.5 hours)

1. Import tokens in `.storybook/preview.ts`:
   ```typescript
   import '@yourorg/tokens/dist/css/variables.css';
   ```
2. Create token documentation stories:
   - `stories/foundation/Colors.mdx` - display color palette
   - `stories/foundation/Typography.mdx` - show type scale
   - `stories/foundation/Spacing.mdx` - visualize spacing
3. Use tokens in Storybook theme
4. Create helper components for token display (ColorSwatch, TypeScale)

### Step 7: Configure Accessibility Testing (1 hour)

1. Configure `@storybook/addon-a11y` in preview.ts:
   ```typescript
   export const parameters = {
     a11y: {
       config: {
         rules: [
           {
             id: 'color-contrast',
             enabled: true,
           },
           {
             id: 'label',
             enabled: true,
           },
         ],
       },
     },
   };
   ```
2. Add accessibility checks to story template
3. Create a11y documentation page
4. Test with sample component story

### Step 8: Create Documentation Pages (1 hour)

1. Create `Introduction.mdx`:
   - Welcome message
   - Quick links
   - Installation instructions
   - Usage examples
2. Create `GettingStarted.mdx`:
   - How to install package
   - How to import components
   - Basic usage example
3. Create foundation documentation pages (Colors, Typography, Spacing)
4. Add navigation structure

### Step 9: Configure Build and Scripts (0.5 hours)

1. Add scripts to `package.json`:
   ```json
   {
     "scripts": {
       "storybook": "storybook dev -p 6006",
       "build-storybook": "storybook build",
       "storybook:test": "test-storybook"
     }
   }
   ```
2. Configure build output directory
3. Optimize build (tree-shaking, code splitting)
4. Add build command to Nx targets

---

## Definition of Done

- [ ] Storybook 10 is installed and runs successfully
- [ ] All required addons are installed and configured
- [ ] TypeScript integration works (props auto-documented)
- [ ] Custom theme applied (brand colors, fonts, logo)
- [ ] Design tokens imported and displayed
- [ ] Accessibility addon configured (WCAG 2.1 AA rules)
- [ ] Documentation structure created (Introduction, Getting Started, Foundation)
- [ ] Token documentation pages complete (Colors, Typography, Spacing)
- [ ] Story template created for components
- [ ] Production build works and is optimized
- [ ] Build integrated into CI/CD pipeline
- [ ] Documentation reviewed and approved by team
- [ ] Storybook URL accessible (local or deployed)

---

## Notes

### Storybook 10 New Features:

- First-class Vite support (faster builds)
- Component Story Format 3 (CSF3)
- Improved TypeScript support
- Better performance and faster HMR
- Enhanced addon ecosystem

### Story Formats:

- **CSF (Component Story Format)**: TypeScript/JavaScript stories
- **MDX**: Markdown + JSX for rich documentation
- Use CSF for interactive component stories
- Use MDX for documentation-heavy pages

### Addon Usage:

- **Essentials**: Controls, Actions, Docs, Viewport, Backgrounds, Toolbars
- **A11y**: Accessibility testing and WCAG compliance
- **Interactions**: Test user interactions
- **Designs**: Embed Figma designs next to components

---

## Related Tasks

- **TASK-001**: Nx Monorepo Structure
- **TASK-002**: TypeScript/ESLint Configuration
- **TASK-011**: Design JSON Token Structure
- **TASK-012**: Style Dictionary Pipeline
- **TASK-014**: Create Base Component Template
- **TASK-020**: Design Storybook Theme

---

## Risks and Mitigations

**Risk:** Storybook build is slow or large

- **Mitigation:** Optimize with code splitting, tree-shaking, lazy loading

**Risk:** TypeScript types don't generate correctly for props

- **Mitigation:** Configure `react-docgen-typescript`, check tsconfig

**Risk:** Addons conflict or cause errors

- **Mitigation:** Test addons individually, check compatibility

---

**Estimated Effort Breakdown:**

- Install Storybook: 0.5 hours
- Configure structure: 1 hour
- Install/configure addons: 1 hour
- Configure TypeScript: 1 hour
- Custom theme: 1.5 hours
- Integrate tokens: 1.5 hours
- A11y testing: 1 hour
- Documentation pages: 1 hour
- Build and scripts: 0.5 hours

**Total: 8 hours**
