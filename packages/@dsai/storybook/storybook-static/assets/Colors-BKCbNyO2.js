import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as i}from"./index-B22UpuWR.js";import{M as o}from"./index-BH194Iit.js";import{C as l}from"./Colors.stories-CkN1BGcX.js";import"./index-Dz3UJJSw.js";import"./_commonjsHelpers-CqkleIqs.js";import"./iframe-DVW8g2gA.js";import"./index-fUCaa9pg.js";import"./index-DgH-xKnr.js";import"./index-DrFu-skq.js";import"./tokens-grouped-BsvYVlf2.js";function r(s){const e={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...i(),...s.components};return n.jsxs(n.Fragment,{children:[n.jsx(o,{of:l}),`
`,n.jsx(e.h1,{id:"color-system",children:"Color System"}),`
`,n.jsx(e.p,{children:"The DSAi color system is built on a foundation of primitive colors (11 hues × 11 steps) and semantic tokens for consistent theming across the design system."}),`
`,n.jsx(e.h2,{id:"design-principles",children:"Design Principles"}),`
`,n.jsx(e.h3,{id:"token-first-architecture",children:"Token-First Architecture"}),`
`,n.jsx(e.p,{children:"All colors are defined as design tokens and transformed into multiple formats:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"CSS Variables"})," (",n.jsx(e.code,{children:"--dsai-color-blue-500"}),")"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"JavaScript/TypeScript"})," (",n.jsx(e.code,{children:"tokens.color.blue[500]"}),")"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"SCSS Variables"})," (",n.jsx(e.code,{children:"$dsai-color-blue-500"}),")"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"JSON"})," (for tooling and documentation)"]}),`
`]}),`
`,n.jsx(e.h3,{id:"wcag-21-aa-compliance",children:"WCAG 2.1 AA Compliance"}),`
`,n.jsx(e.p,{children:"All color combinations meet or exceed WCAG 2.1 AA contrast requirements:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Minimum 4.5:1 for normal text"}),`
`,n.jsx(e.li,{children:"Minimum 3:1 for large text and UI components"}),`
`,n.jsx(e.li,{children:"Target 7:1 for AAA compliance"}),`
`]}),`
`,n.jsx(e.h3,{id:"semantic-naming",children:"Semantic Naming"}),`
`,n.jsx(e.p,{children:"Colors are named by their purpose, not their appearance:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["✅ ",n.jsx(e.code,{children:"theme.primary"})," (semantic - can change)"]}),`
`,n.jsxs(e.li,{children:["❌ ",n.jsx(e.code,{children:"blue-500"})," (literal - locked to appearance)"]}),`
`]}),`
`,n.jsx(e.h2,{id:"color-scales",children:"Color Scales"}),`
`,n.jsx(e.h3,{id:"eleven-step-scale",children:"Eleven-Step Scale"}),`
`,n.jsx(e.p,{children:"Each hue uses an eleven-step scale from 50 (lightest) to 950 (darkest):"}),`
`,n.jsxs(e.p,{children:[`| Step        | Usage                    | Examples                       |
| ----------- | ------------------------ | ------------------------------ |
| `,n.jsx(e.strong,{children:"50"}),`      | Ultra-light backgrounds  | Hover states, glass morphism   |
| `,n.jsx(e.strong,{children:"100-200"}),` | Light backgrounds        | Cards, panels, secondary UI    |
| `,n.jsx(e.strong,{children:"300-400"}),` | Borders, disabled states | Dividers, inactive elements    |
| `,n.jsx(e.strong,{children:"500"}),`     | Default color            | Primary usage for each hue     |
| `,n.jsx(e.strong,{children:"600-700"}),` | Hover/active states      | Interactive elements           |
| `,n.jsx(e.strong,{children:"800-900"}),` | High contrast text       | Body text, headings            |
| `,n.jsx(e.strong,{children:"950"}),"     | Maximum contrast         | Deep shadows, maximum emphasis |"]}),`
`,n.jsx(e.h2,{id:"available-hues",children:"Available Hues"}),`
`,n.jsx(e.h3,{id:"brand-colors-8-hues",children:"Brand Colors (8 Hues)"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Blue"})," - Primary brand color"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Cyan"})," - Secondary accents"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Green"})," - Success states"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Red"})," - Error states"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Orange"})," - Warning states"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Yellow"})," - Caution alerts"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Purple"})," - Premium features"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Pink"})," - Special highlights"]}),`
`]}),`
`,n.jsx(e.h3,{id:"neutral-colors",children:"Neutral Colors"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Gray"})," - Text, backgrounds, borders"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Indigo"})," - Alternative neutral with blue undertone"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Teal"})," - Alternative neutral with green undertone"]}),`
`]}),`
`,n.jsx(e.h2,{id:"usage-examples",children:"Usage Examples"}),`
`,n.jsx(e.h3,{id:"in-css",children:"In CSS"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-css",children:`.button-primary {
  /* Semantic token - recommended */
  background-color: var(--dsai-theme-primary);
  color: var(--dsai-neutral-white);

  /* Primitive token - use when semantic doesn't fit */
  border: 1px solid var(--dsai-color-blue-600);
}

.button-primary:hover {
  background-color: var(--dsai-theme-primary-hover);
}

.text-danger {
  color: var(--dsai-theme-danger);
}
`})}),`
`,n.jsx(e.h3,{id:"in-javascripttypescript",children:"In JavaScript/TypeScript"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`import tokens from '@dsai/tokens';

const ButtonStyles = {
  primary: {
    backgroundColor: tokens.theme.primary.value,
    color: tokens.neutral.white.value,
    '&:hover': {
      backgroundColor: tokens.color.blue['600'].value,
    },
  },
};
`})}),`
`,n.jsx(e.h3,{id:"in-react-components",children:"In React Components"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import tokens from '@dsai/tokens';

export const Alert = ({ variant = 'info' }) => {
  const colors = {
    info: tokens.theme.info.value,
    success: tokens.theme.success.value,
    warning: tokens.theme.warning.value,
    danger: tokens.theme.danger.value,
  };

  return <div style={{ backgroundColor: colors[variant] }}>Alert content</div>;
};
`})}),`
`,n.jsx(e.h2,{id:"accessibility-guidelines",children:"Accessibility Guidelines"}),`
`,n.jsx(e.h3,{id:"contrast-ratios",children:"Contrast Ratios"}),`
`,n.jsx(e.p,{children:"Always verify contrast ratios when combining colors:"}),`
`,n.jsx(e.p,{children:`| Text Size                              | WCAG AA | WCAG AAA |
| -------------------------------------- | ------- | -------- |
| Normal text (less than 18px)           | 4.5:1   | 7:1      |
| Large text (18px or larger, 14px bold) | 3:1     | 4.5:1    |
| UI components                          | 3:1     | -        |`}),`
`,n.jsx(e.h3,{id:"safe-combinations",children:"Safe Combinations"}),`
`,n.jsx(e.p,{children:"Pre-tested color combinations with WCAG AA compliance:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-css",children:`/* Text on Light Backgrounds */
.text-on-light {
  color: var(--dsai-color-gray-900); /* AAA */
  background: var(--dsai-color-gray-50);
}

/* Text on Dark Backgrounds */
.text-on-dark {
  color: var(--dsai-neutral-white); /* AAA */
  background: var(--dsai-color-gray-900);
}

/* Interactive Elements */
.button-primary {
  color: var(--dsai-neutral-white); /* AA */
  background: var(--dsai-color-blue-600);
}
`})}),`
`,n.jsx(e.h3,{id:"color-blindness-considerations",children:"Color Blindness Considerations"}),`
`,n.jsx(e.p,{children:"Our palette is tested for:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Protanopia"})," (red-blind)"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Deuteranopia"})," (green-blind)"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Tritanopia"})," (blue-blind)"]}),`
`]}),`
`,n.jsx(e.p,{children:"Guidelines:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Never rely on color alone to convey information"}),`
`,n.jsx(e.li,{children:"Use icons, text labels, or patterns as additional cues"}),`
`,n.jsx(e.li,{children:"Ensure sufficient contrast in all color vision modes"}),`
`]}),`
`,n.jsx(e.h2,{id:"dark-mode-support",children:"Dark Mode Support"}),`
`,n.jsx(e.p,{children:"Semantic tokens automatically adapt to dark mode:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-css",children:`/* Light mode (default) */
--dsai-theme-primary: #0ea5e9; /* cyan-500 */
--dsai-background-primary: #ffffff; /* white */
--dsai-text-primary: #111827; /* gray-900 */

/* Dark mode (auto-switches) */
--dsai-theme-primary: #06b6d4; /* cyan-400 */
--dsai-background-primary: #111827; /* gray-900 */
--dsai-text-primary: #f9fafb; /* gray-50 */
`})}),`
`,n.jsx(e.p,{children:"Primitive tokens remain constant; semantic tokens change values."}),`
`,n.jsx(e.h2,{id:"best-practices",children:"Best Practices"}),`
`,n.jsx(e.h3,{id:"-do",children:"✅ Do"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["Use semantic tokens (",n.jsx(e.code,{children:"theme.primary"}),") for component styling"]}),`
`,n.jsx(e.li,{children:"Maintain consistent color usage across similar components"}),`
`,n.jsx(e.li,{children:"Test all color combinations with accessibility tools"}),`
`,n.jsx(e.li,{children:"Document color choices in component stories"}),`
`,n.jsx(e.li,{children:"Use primitive tokens for custom one-off needs"}),`
`]}),`
`,n.jsx(e.h3,{id:"-dont",children:"❌ Don't"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Hardcode hex values in component styles"}),`
`,n.jsx(e.li,{children:"Use different colors for the same purpose"}),`
`,n.jsx(e.li,{children:"Create new color tokens without design approval"}),`
`,n.jsx(e.li,{children:"Skip contrast ratio testing"}),`
`,n.jsx(e.li,{children:"Override semantic tokens with primitives unless necessary"}),`
`]}),`
`,n.jsx(e.h2,{id:"token-structure",children:"Token Structure"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`color/
├── primitive.json      # Brand colors (11 hues × 11 steps)
├── semantic.json       # Theme colors (primary, success, etc.)
├── component.json      # Component-level tokens
├── neutral.json        # Gray scale + white/black
├── background.json     # Background tokens
├── opacity.json        # Opacity values
└── border/
    └── color.json      # Border colors
`})}),`
`,n.jsx(e.h2,{id:"related-documentation",children:"Related Documentation"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.a,{href:"/docs/foundation-typography--docs",children:"Typography System"})," - Text styles and scales"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.a,{href:"/docs/foundation-spacing--docs",children:"Spacing System"})," - Layout spacing tokens"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.a,{href:"/docs/components-button--docs",children:"Component Library"})," - How components use colors"]}),`
`]}),`
`,n.jsx(e.h2,{id:"resources",children:"Resources"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://www.w3.org/WAI/WCAG21/quickref/",rel:"nofollow",children:"WCAG 2.1 Guidelines"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://webaim.org/resources/contrastchecker/",rel:"nofollow",children:"WebAIM Contrast Checker"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://www.color-blindness.com/coblis-color-blindness-simulator/",rel:"nofollow",children:"Color Blindness Simulator"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://amzn.github.io/style-dictionary/",rel:"nofollow",children:"Style Dictionary Documentation"})}),`
`]}),`
`,n.jsx(e.hr,{}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Last Updated:"}),` November 21, 2025
`,n.jsx(e.strong,{children:"Token Version:"}),` 1.0.0
`,n.jsx(e.strong,{children:"Design System:"})," DSAi Component Library"]})]})}function y(s={}){const{wrapper:e}={...i(),...s.components};return e?n.jsx(e,{...s,children:n.jsx(r,{...s})}):r(s)}export{y as default};
