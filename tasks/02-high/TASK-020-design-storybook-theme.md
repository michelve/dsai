# TASK-020: Design Storybook Theme

**Task ID:** TASK-020
**Title:** Design Storybook Theme
**Priority:** High
**Status:** Not Started
**Assigned To:** Developer + Designer
**Estimated Time:** 6 hours
**Phase:** Phase 1 - Token System (Weeks 3-6)

---

## Description

Create a custom Storybook theme that uses the design system tokens, providing a branded documentation experience that matches the component library's visual identity. The theme should include custom colors, typography, branding, and layout improvements.

---

## Acceptance Criteria

### Theme Configuration
- [ ] Custom theme file created: `.storybook/theme.js`
- [ ] Theme uses design tokens from `@yourorg/tokens`
- [ ] Theme applied to both manager (sidebar) and preview (canvas)
- [ ] Light and Dark theme variants created

### Branding
- [ ] Brand logo added to sidebar
- [ ] Brand name: "DSAi Component Library"
- [ ] Brand URL links to documentation homepage
- [ ] Favicon updated to brand icon

### Color Customization
- [ ] Primary color: Teal 500 (`color-teal-500`)
- [ ] Secondary color: Gray 700 (`color-gray-700`)
- [ ] Background colors use semantic tokens
- [ ] Text colors use semantic tokens
- [ ] Border colors use semantic tokens

### Typography
- [ ] Headings use Poppins font (`typography-font-family-heading`)
- [ ] Body text uses Inter font (`typography-font-family-body`)
- [ ] Font sizes match design system scale
- [ ] Code blocks use monospace font (JetBrains Mono or similar)

### Layout Improvements
- [ ] Sidebar width optimized (280px)
- [ ] Story panel padding increased for readability
- [ ] Toolbar customized (relevant addons only)
- [ ] Grid overlay available for layout testing

### Documentation Pages
- [ ] Welcome page with brand colors and typography
- [ ] Getting Started page styled
- [ ] Token documentation pages (colors, typography, spacing) styled
- [ ] Component documentation template styled

---

## Dependencies

### Requires:
- **TASK-013**: Configure Storybook 7 (Storybook setup)
- **TASK-015**: Token to CSS Variable Generation (CSS variables)
- **TASK-019**: Create Semantic Token Definitions (semantic tokens)

### Enhances:
- All component Storybook stories (TASK-021-045)

---

## Implementation Steps

### Step 1: Create Custom Theme File (1.5 hours)
Create `.storybook/theme.js`:
```javascript
import { create } from '@storybook/theming/create';
import tokens from '@yourorg/tokens/dist/js/tokens.js';

export const lightTheme = create({
  base: 'light',
  
  // Brand
  brandTitle: 'DSAi Component Library',
  brandUrl: 'https://dsai.yourorg.com',
  brandImage: '/logo.svg',
  brandTarget: '_self',
  
  // Colors
  colorPrimary: tokens.color.teal['500'],
  colorSecondary: tokens.color.teal['600'],
  
  // UI
  appBg: tokens.color.gray['50'],
  appContentBg: tokens.color.white,
  appBorderColor: tokens.color.gray['200'],
  appBorderRadius: 4,
  
  // Typography
  fontBase: tokens.typography.fontFamily.body,
  fontCode: '"JetBrains Mono", monospace',
  
  // Text colors
  textColor: tokens.color.teal['950'],
  textInverseColor: tokens.color.white,
  textMutedColor: tokens.color.gray['700'],
  
  // Toolbar
  barTextColor: tokens.color.gray['700'],
  barSelectedColor: tokens.color.teal['500'],
  barBg: tokens.color.white,
  
  // Form colors
  inputBg: tokens.color.white,
  inputBorder: tokens.color.gray['300'],
  inputTextColor: tokens.color.teal['950'],
  inputBorderRadius: 4,
});

export const darkTheme = create({
  base: 'dark',
  
  // Brand
  brandTitle: 'DSAi Component Library',
  brandUrl: 'https://dsai.yourorg.com',
  brandImage: '/logo-white.svg',
  brandTarget: '_self',
  
  // Colors
  colorPrimary: tokens.color.teal['400'],
  colorSecondary: tokens.color.teal['500'],
  
  // UI
  appBg: tokens.color.gray['900'],
  appContentBg: tokens.color.gray['800'],
  appBorderColor: tokens.color.gray['700'],
  appBorderRadius: 4,
  
  // Typography
  fontBase: tokens.typography.fontFamily.body,
  fontCode: '"JetBrains Mono", monospace',
  
  // Text colors
  textColor: tokens.color.gray['50'],
  textInverseColor: tokens.color.gray['900'],
  textMutedColor: tokens.color.gray['400'],
  
  // Toolbar
  barTextColor: tokens.color.gray['300'],
  barSelectedColor: tokens.color.teal['400'],
  barBg: tokens.color.gray['800'],
  
  // Form colors
  inputBg: tokens.color.gray['700'],
  inputBorder: tokens.color.gray['600'],
  inputTextColor: tokens.color.gray['50'],
  inputBorderRadius: 4,
});
```

### Step 2: Apply Theme to Storybook Config (1 hour)
Update `.storybook/manager.js`:
```javascript
import { addons } from '@storybook/manager-api';
import { lightTheme, darkTheme } from './theme';

addons.setConfig({
  theme: lightTheme,
  // Optionally allow theme switching
  sidebar: {
    showRoots: true,
    collapsedRoots: ['other'],
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: true },
    copy: { hidden: true },
    fullscreen: { hidden: false },
  },
});
```

Update `.storybook/preview.js`:
```javascript
import { lightTheme } from './theme';
import '@yourorg/tokens/dist/css/variables.css';

export const parameters = {
  docs: {
    theme: lightTheme,
  },
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: '#ffffff' },
      { name: 'gray', value: '#f4f5f5' },
      { name: 'dark', value: '#002a2d' },
    ],
  },
};
```

### Step 3: Add Brand Assets (0.5 hours)
1. Add logo files to `.storybook/public/`:
   - `logo.svg` (for light theme)
   - `logo-white.svg` (for dark theme)
   - `favicon.ico`
2. Update `.storybook/main.js` to serve static files:
```javascript
module.exports = {
  staticDirs: ['./public'],
};
```

### Step 4: Customize Documentation Pages (2 hours)
Create `.storybook/pages/Welcome.mdx`:
```mdx
import { Meta } from '@storybook/blocks';

<Meta title="Introduction/Welcome" />

<div style={{ 
  fontFamily: 'var(--typography-font-family-heading)',
  color: 'var(--color-teal-950)',
  padding: '2rem'
}}>
  <h1 style={{ 
    fontSize: '48px', 
    fontWeight: 700,
    marginBottom: '1rem' 
  }}>
    DSAi Component Library
  </h1>
  
  <p style={{ 
    fontSize: '18px', 
    lineHeight: '1.75',
    color: 'var(--color-gray-700)',
    maxWidth: '600px'
  }}>
    A comprehensive React component library built with TypeScript, 
    following WCAG 2.1 AA accessibility standards and powered by 
    design tokens.
  </p>
  
  <div style={{ marginTop: '2rem' }}>
    <a 
      href="?path=/docs/getting-started-installation--docs"
      style={{
        backgroundColor: 'var(--color-teal-500)',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '4px',
        textDecoration: 'none',
        display: 'inline-block',
        fontWeight: 600
      }}
    >
      Get Started
    </a>
  </div>
</div>
```

Create `.storybook/pages/GettingStarted.mdx`:
```mdx
import { Meta } from '@storybook/blocks';

<Meta title="Getting Started/Installation" />

# Installation

Install the component library and tokens:

\`\`\`bash
pnpm add @yourorg/components @yourorg/tokens
\`\`\`

# Usage

Import components and styles:

\`\`\`javascript
import { Button } from '@yourorg/components';
import '@yourorg/tokens/dist/css/variables.css';

function App() {
  return <Button variant="primary">Click Me</Button>;
}
\`\`\`
```

### Step 5: Add Global Styles (0.5 hours)
Create `.storybook/preview-head.html`:
```html
<style>
  /* Apply design system fonts */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;600;700&display=swap');
  
  /* Global styles */
  body {
    font-family: var(--typography-font-family-body);
    color: var(--color-teal-950);
  }
  
  /* Story canvas improvements */
  .sb-show-main {
    padding: 2rem;
  }
</style>
```

### Step 6: Test Theme (0.5 hours)
1. Start Storybook: `pnpm storybook`
2. Verify:
   - Logo appears in sidebar
   - Brand colors applied
   - Typography uses design system fonts
   - Documentation pages styled correctly
   - Light/dark theme toggle works (if implemented)

### Step 7: Documentation (0.5 hours)
Create `docs/storybook/theming.md`:
```markdown
# Storybook Theme

## Overview
The Storybook theme uses design tokens for consistency
with the component library.

## Customization
To modify the theme, edit `.storybook/theme.js`.

## Brand Assets
- Logo: `.storybook/public/logo.svg`
- Dark logo: `.storybook/public/logo-white.svg`
- Favicon: `.storybook/public/favicon.ico`

## Theme Tokens
The theme uses semantic tokens:
- Primary color: `color-teal-500`
- Typography: `typography-font-family-heading` and `body`
```

---

## Definition of Done

- [ ] Custom theme file created (`.storybook/theme.js`)
- [ ] Light theme configured with brand colors
- [ ] Dark theme configured (optional)
- [ ] Brand logo and favicon added
- [ ] Theme applied to manager and preview
- [ ] Typography uses design system fonts
- [ ] Welcome page styled
- [ ] Getting Started page styled
- [ ] Global styles added for story canvas
- [ ] Theme tested in Storybook
- [ ] Documentation created
- [ ] Design team approved theme

---

## Testing Requirements

### Visual Testing:
- [ ] Logo displays correctly in sidebar
- [ ] Brand colors applied throughout UI
- [ ] Typography renders with correct fonts
- [ ] Spacing and layout look polished
- [ ] Dark theme works (if implemented)

### Functional Testing:
- [ ] Theme loads without errors
- [ ] Links in sidebar work
- [ ] Documentation pages load correctly
- [ ] Toolbar customizations work

---

## Notes

### Theme API:
- Storybook theming uses `@storybook/theming/create`
- Theme can be applied to manager (sidebar) and docs (pages)
- Full theme API: https://storybook.js.org/docs/react/configure/theming

### Design Token Integration:
- Import tokens from `@yourorg/tokens`
- Use token values in theme configuration
- Ensures Storybook matches component library

### Best Practices:
- Keep theme simple and focused
- Use semantic tokens, not primitive tokens
- Test both light and dark themes
- Ensure accessibility (contrast ratios)

---

## Related Tasks

- **TASK-013**: Configure Storybook 7
- **TASK-015**: Token to CSS Variable Generation
- **TASK-019**: Create Semantic Token Definitions
- **TASK-021-045**: Component stories (benefit from theme)

---

## Effort Breakdown

- Custom theme file: 1.5 hours
- Apply theme to config: 1 hour
- Brand assets: 0.5 hours
- Documentation pages: 2 hours
- Global styles: 0.5 hours
- Testing: 0.5 hours
- Documentation: 0.5 hours

**Total:** 6 hours
