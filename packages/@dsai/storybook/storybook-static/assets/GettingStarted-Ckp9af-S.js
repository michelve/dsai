import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as r}from"./index-BnGAkpn-.js";import{M as t}from"./WithTooltip-SK46ZJ2J-tJq7xeY-.js";import"./iframe-6amVX2Fk.js";import"./preload-helper-Dp1pzeXC.js";import"./index-CNvwhaR7.js";function i(s){const e={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",hr:"hr",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...r(),...s.components};return n.jsxs(n.Fragment,{children:[`
`,`
`,n.jsx(t,{title:"Guides/Getting Started"}),`
`,n.jsx(e.h1,{id:"getting-started",children:"Getting Started"}),`
`,n.jsx(e.p,{children:"This guide will help you get up and running with DSAi components in your React application."}),`
`,n.jsx(e.h2,{id:"installation",children:"Installation"}),`
`,n.jsx(e.h3,{id:"prerequisites",children:"Prerequisites"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Node.js 18+ or 20+"}),`
`,n.jsx(e.li,{children:"React 18+"}),`
`,n.jsx(e.li,{children:"TypeScript 5.0+ (recommended)"}),`
`]}),`
`,n.jsx(e.h3,{id:"install-packages",children:"Install Packages"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`# Using pnpm (recommended)
pnpm add @dsai/react @dsai/tokens

# Using npm
npm install @dsai/react @dsai/tokens

# Using yarn
yarn add @dsai/react @dsai/tokens
`})}),`
`,n.jsx(e.h2,{id:"basic-setup",children:"Basic Setup"}),`
`,n.jsx(e.h3,{id:"1-import-css-framework",children:"1. Import CSS Framework"}),`
`,n.jsxs(e.p,{children:["DSAi is a ",n.jsx(e.strong,{children:"Bootstrap-first design system"}),". Import the CSS at the root of your application:"]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Recommended: Bootstrap + DSAi Utilities"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// In your main entry file (e.g., main.tsx or App.tsx)

// Bootstrap 5.3 theme customized with DSAi design tokens
import '@dsai/tokens/dist/css/bootstrap.css';

// DSAi utilities for accessibility and semantic patterns
import '@dsai/tokens/dist/css/dsai.css';
`})}),`
`,n.jsxs(e.p,{children:["✅ ",n.jsx(e.strong,{children:"This gives you:"})]}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Full Bootstrap 5.3 component library with DSAi colors, typography, and spacing"}),`
`,n.jsx(e.li,{children:"All DSAi design tokens as CSS custom properties"}),`
`,n.jsxs(e.li,{children:["WCAG 2.2 AA accessibility utilities (",n.jsx(e.code,{children:".sr-only"}),", ",n.jsx(e.code,{children:".focus-ring"}),", ",n.jsx(e.code,{children:".skip-link"}),")"]}),`
`,n.jsxs(e.li,{children:["Semantic patterns (",n.jsx(e.code,{children:".container"}),", ",n.jsx(e.code,{children:".stack"}),", ",n.jsx(e.code,{children:".cluster"}),", ",n.jsx(e.code,{children:".status-success"}),")"]}),`
`,n.jsx(e.li,{children:"Consistent styling across all components"}),`
`]}),`
`,n.jsx(e.hr,{}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Alternative Options:"})}),`
`,n.jsxs(e.p,{children:[`| CSS File        | Size  | Use Case                                               |
| --------------- | ----- | ------------------------------------------------------ |
| `,n.jsx(e.code,{children:"bootstrap.css"}),` | 238KB | Full Bootstrap + DSAi tokens (required for components) |
| `,n.jsx(e.code,{children:"dsai.css"}),`      | 34KB  | DSAi utilities + accessibility (recommended addition)  |
| `,n.jsx(e.code,{children:"variables.css"})," | 16KB  | Just tokens, no utilities (minimal projects)           |"]}),`
`,n.jsxs(e.blockquote,{children:[`
`,n.jsxs(e.p,{children:["⚠️ ",n.jsx(e.strong,{children:"Important:"})," Always include ",n.jsx(e.code,{children:"bootstrap.css"})," when using DSAi React components to ensure proper styling and avoid CSS conflicts"]}),`
`]}),`
`,n.jsx(e.h3,{id:"2-use-components",children:"2. Use Components"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { Button } from '@dsai/react';

function App() {
  return (
    <Button variant="primary" size="md">
      Click Me
    </Button>
  );
}
`})}),`
`,n.jsx(e.h2,{id:"using-design-tokens",children:"Using Design Tokens"}),`
`,n.jsx(e.h3,{id:"css-variables",children:"CSS Variables"}),`
`,n.jsx(e.p,{children:"All design tokens are available as CSS custom properties:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-css",children:`.my-component {
  color: var(--dsai-theme-primary);
  padding: var(--dsai-spacing-3);
  border-radius: var(--dsai-border-radius-md);
  box-shadow: var(--dsai-shadow-default);
}
`})}),`
`,n.jsx(e.h3,{id:"javascripttypescript",children:"JavaScript/TypeScript"}),`
`,n.jsx(e.p,{children:"Import tokens directly in your code:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`import tokens from '@dsai/tokens';

const styles = {
  backgroundColor: tokens.theme.primary,
  padding: tokens.spacing['3'],
  borderRadius: tokens.border.radius.md,
};
`})}),`
`,n.jsx(e.h3,{id:"scss",children:"SCSS"}),`
`,n.jsx(e.p,{children:"For SCSS projects:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-scss",children:`@import '@dsai/tokens/dist/scss/variables';

.my-component {
  background-color: $theme-primary;
  padding: $spacing-3;
  border-radius: $border-radius-md;
}
`})}),`
`,n.jsx(e.h2,{id:"typescript-configuration",children:"TypeScript Configuration"}),`
`,n.jsxs(e.p,{children:["DSAi is built with TypeScript and provides full type definitions. Ensure your ",n.jsx(e.code,{children:"tsconfig.json"})," includes:"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-json",children:`{
  "compilerOptions": {
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true,
    "moduleResolution": "bundler"
  }
}
`})}),`
`,n.jsx(e.h2,{id:"tree-shaking",children:"Tree Shaking"}),`
`,n.jsx(e.p,{children:"DSAi supports tree shaking out of the box. Import only the components you need:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// Good - Only Button is bundled
import { Button } from '@dsai/react';

// Avoid - Entire library bundled
import * as DSAi from '@dsai/react';
`})}),`
`,n.jsx(e.h2,{id:"styling-approach",children:"Styling Approach"}),`
`,n.jsx(e.p,{children:"DSAi components use CSS-in-JS with design tokens. You can customize components in three ways:"}),`
`,n.jsx(e.h3,{id:"1-props-api-recommended",children:"1. Props API (Recommended)"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<Button variant="primary" size="lg" fullWidth>
  Full Width Button
</Button>
`})}),`
`,n.jsx(e.h3,{id:"2-css-variables-override",children:"2. CSS Variables Override"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-css",children:`.custom-button {
  --dsai-theme-primary: #ff6b6b;
  --dsai-border-radius-md: 12px;
}
`})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<Button className="custom-button">Custom Styled</Button>
`})}),`
`,n.jsx(e.h3,{id:"3-style-prop",children:"3. Style Prop"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<Button style={{ backgroundColor: 'purple', color: 'white' }}>Custom Button</Button>
`})}),`
`,n.jsx(e.h2,{id:"accessibility",children:"Accessibility"}),`
`,n.jsx(e.p,{children:"All DSAi components are WCAG 2.1 AA compliant. To maintain accessibility:"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Always provide labels"}),": Use ",n.jsx(e.code,{children:"aria-label"})," when text content isn't visible"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Keyboard navigation"}),": All interactive elements support keyboard"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Focus management"}),": Components handle focus states automatically"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Screen readers"}),": ARIA attributes are included"]}),`
`]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// Good
<Button aria-label="Close dialog">×</Button>

// Missing label
<Button>×</Button>
`})}),`
`,n.jsx(e.h2,{id:"dark-mode-support",children:"Dark Mode Support"}),`
`,n.jsx(e.p,{children:"DSAi includes built-in dark mode support. Toggle themes by adding a class:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// Add to root element
<div className="dark">
  {/* All components automatically adjust */}
  <Button variant="primary">Dark Mode Button</Button>
</div>
`})}),`
`,n.jsx(e.p,{children:"Or use CSS:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-css",children:`/* Dark mode via media query */
@media (prefers-color-scheme: dark) {
  :root {
    /* Tokens automatically adjust */
  }
}
`})}),`
`,n.jsx(e.h2,{id:"next-steps",children:"Next Steps"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["Explore ",n.jsx(e.a,{href:"/docs/components",children:"Component Examples"})]}),`
`,n.jsxs(e.li,{children:["Read about ",n.jsx(e.a,{href:"/docs/foundation-colors--docs",children:"Design Tokens"})]}),`
`,n.jsxs(e.li,{children:["Learn about ",n.jsx(e.a,{href:"/docs/guides-theming--docs",children:"Theming"})]}),`
`,n.jsxs(e.li,{children:["Check ",n.jsx(e.a,{href:"/docs/guides-accessibility--docs",children:"Accessibility Guidelines"})]}),`
`]}),`
`,n.jsx(e.h2,{id:"need-help",children:"Need Help?"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://github.com/michelve/dsai/issues",rel:"nofollow",children:"GitHub Issues"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://github.com/michelve/dsai/discussions",rel:"nofollow",children:"Discussions"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://github.com/michelve/dsai/blob/main/CONTRIBUTING.md",rel:"nofollow",children:"Contributing Guide"})}),`
`]})]})}function p(s={}){const{wrapper:e}={...r(),...s.components};return e?n.jsx(e,{...s,children:n.jsx(i,{...s})}):i(s)}export{p as default};
