import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as t}from"./index-VxI6AVLR.js";import"./iframe-CbxEB9Gc.js";import"./preload-helper-Dp1pzeXC.js";function r(s){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...t(),...s.components},{Meta:i}=n;return i||o("Meta"),e.jsxs(e.Fragment,{children:[e.jsx(i,{title:"Guides/Getting Started"}),`
`,e.jsx(n.h1,{id:"getting-started",children:"Getting Started"}),`
`,e.jsx(n.p,{children:"This guide will help you get up and running with DSAi components in your React application."}),`
`,e.jsx(n.h2,{id:"installation",children:"Installation"}),`
`,e.jsx(n.h3,{id:"prerequisites",children:"Prerequisites"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Node.js 18+ or 20+"}),`
`,e.jsx(n.li,{children:"React 18+"}),`
`,e.jsx(n.li,{children:"TypeScript 5.0+ (recommended)"}),`
`]}),`
`,e.jsx(n.h3,{id:"install-packages",children:"Install Packages"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`# Using pnpm (recommended)
pnpm add @dsai/react @dsai/tokens

# Using npm
npm install @dsai/react @dsai/tokens

# Using yarn
yarn add @dsai/react @dsai/tokens
`})}),`
`,e.jsx(n.h2,{id:"basic-setup",children:"Basic Setup"}),`
`,e.jsx(n.h3,{id:"1-import-design-tokens",children:"1. Import Design Tokens"}),`
`,e.jsx(n.p,{children:"Import the CSS variables at the root of your application:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`// In your main entry file (e.g., main.tsx or App.tsx)
import '@dsai/tokens/dist/css/variables.css';
`})}),`
`,e.jsx(n.h3,{id:"2-use-components",children:"2. Use Components"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { Button } from '@dsai/react';

function App() {
  return (
    <Button variant="primary" size="md">
      Click Me
    </Button>
  );
}
`})}),`
`,e.jsx(n.h2,{id:"using-design-tokens",children:"Using Design Tokens"}),`
`,e.jsx(n.h3,{id:"css-variables",children:"CSS Variables"}),`
`,e.jsx(n.p,{children:"All design tokens are available as CSS custom properties:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`.my-component {
  color: var(--dsai-theme-primary);
  padding: var(--dsai-spacing-3);
  border-radius: var(--dsai-border-radius-md);
  box-shadow: var(--dsai-shadow-default);
}
`})}),`
`,e.jsx(n.h3,{id:"javascripttypescript",children:"JavaScript/TypeScript"}),`
`,e.jsx(n.p,{children:"Import tokens directly in your code:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import tokens from '@dsai/tokens';

const styles = {
  backgroundColor: tokens.theme.primary,
  padding: tokens.spacing['3'],
  borderRadius: tokens.border.radius.md,
};
`})}),`
`,e.jsx(n.h3,{id:"scss",children:"SCSS"}),`
`,e.jsx(n.p,{children:"For SCSS projects:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-scss",children:`@import '@dsai/tokens/dist/scss/variables';

.my-component {
  background-color: $theme-primary;
  padding: $spacing-3;
  border-radius: $border-radius-md;
}
`})}),`
`,e.jsx(n.h2,{id:"typescript-configuration",children:"TypeScript Configuration"}),`
`,e.jsxs(n.p,{children:["DSAi is built with TypeScript and provides full type definitions. Ensure your ",e.jsx(n.code,{children:"tsconfig.json"})," includes:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-json",children:`{
  "compilerOptions": {
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true,
    "moduleResolution": "bundler"
  }
}
`})}),`
`,e.jsx(n.h2,{id:"tree-shaking",children:"Tree Shaking"}),`
`,e.jsx(n.p,{children:"DSAi supports tree shaking out of the box. Import only the components you need:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`// Good - Only Button is bundled
import { Button } from '@dsai/react';

// Avoid - Entire library bundled
import * as DSAi from '@dsai/react';
`})}),`
`,e.jsx(n.h2,{id:"styling-approach",children:"Styling Approach"}),`
`,e.jsx(n.p,{children:"DSAi components use CSS-in-JS with design tokens. You can customize components in three ways:"}),`
`,e.jsx(n.h3,{id:"1-props-api-recommended",children:"1. Props API (Recommended)"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`<Button variant="primary" size="lg" fullWidth>
  Full Width Button
</Button>
`})}),`
`,e.jsx(n.h3,{id:"2-css-variables-override",children:"2. CSS Variables Override"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`.custom-button {
  --dsai-theme-primary: #ff6b6b;
  --dsai-border-radius-md: 12px;
}
`})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`<Button className="custom-button">Custom Styled</Button>
`})}),`
`,e.jsx(n.h3,{id:"3-style-prop",children:"3. Style Prop"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`<Button style={{ backgroundColor: 'purple', color: 'white' }}>Custom Button</Button>
`})}),`
`,e.jsx(n.h2,{id:"accessibility",children:"Accessibility"}),`
`,e.jsx(n.p,{children:"All DSAi components are WCAG 2.1 AA compliant. To maintain accessibility:"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Always provide labels"}),": Use ",e.jsx(n.code,{children:"aria-label"})," when text content isn't visible"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Keyboard navigation"}),": All interactive elements support keyboard"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Focus management"}),": Components handle focus states automatically"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Screen readers"}),": ARIA attributes are included"]}),`
`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`// Good
<Button aria-label="Close dialog">×</Button>

// Missing label
<Button>×</Button>
`})}),`
`,e.jsx(n.h2,{id:"dark-mode-support",children:"Dark Mode Support"}),`
`,e.jsx(n.p,{children:"DSAi includes built-in dark mode support. Toggle themes by adding a class:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`// Add to root element
<div className="dark">
  {/* All components automatically adjust */}
  <Button variant="primary">Dark Mode Button</Button>
</div>
`})}),`
`,e.jsx(n.p,{children:"Or use CSS:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`/* Dark mode via media query */
@media (prefers-color-scheme: dark) {
  :root {
    /* Tokens automatically adjust */
  }
}
`})}),`
`,e.jsx(n.h2,{id:"next-steps",children:"Next Steps"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Explore ",e.jsx(n.a,{href:"/docs/components",children:"Component Examples"})]}),`
`,e.jsxs(n.li,{children:["Read about ",e.jsx(n.a,{href:"/docs/foundation-colors--docs",children:"Design Tokens"})]}),`
`,e.jsxs(n.li,{children:["Learn about ",e.jsx(n.a,{href:"/docs/guides-theming--docs",children:"Theming"})]}),`
`,e.jsxs(n.li,{children:["Check ",e.jsx(n.a,{href:"/docs/guides-accessibility--docs",children:"Accessibility Guidelines"})]}),`
`]}),`
`,e.jsx(n.h2,{id:"need-help",children:"Need Help?"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://github.com/yourusername/dsai/issues",rel:"nofollow",children:"GitHub Issues"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://github.com/yourusername/dsai/discussions",rel:"nofollow",children:"Discussions"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://github.com/yourusername/dsai/blob/main/CONTRIBUTING.md",rel:"nofollow",children:"Contributing Guide"})}),`
`]})]})}function h(s={}){const{wrapper:n}={...t(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(r,{...s})}):r(s)}function o(s,n){throw new Error("Expected component `"+s+"` to be defined: you likely forgot to import, pass, or provide it.")}export{h as default};
