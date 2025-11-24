import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as r}from"./index-YucmmfQ9.js";import{M as i}from"./WithTooltip-SK46ZJ2J-B89a_V1M.js";import"./iframe-AU4p8I_m.js";import"./preload-helper-Dp1pzeXC.js";import"./index-D8AO78QX.js";function a(s){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...r(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(i,{title:"Foundation/CSS Variables"}),`
`,e.jsx(n.h1,{id:"css-variables-reference",children:"CSS Variables Reference"}),`
`,e.jsx(n.p,{children:"DSAi design tokens are available as CSS custom properties (CSS variables) for use in your stylesheets."}),`
`,e.jsx(n.h2,{id:"import",children:"Import"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`// Import CSS variables
import '@dsai/tokens/dist/css/variables.css';

// Or use the full Bootstrap theme (recommended)
import '@dsai/tokens/dist/css/bootstrap.css';
`})}),`
`,e.jsx(n.h2,{id:"naming-convention",children:"Naming Convention"}),`
`,e.jsx(n.p,{children:"All CSS variables follow the pattern:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`--dsai-{category}-{subcategory}-{property}
`})}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Examples:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"--dsai-color-blue-500"})," - Primitive color"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"--dsai-spacing-4"})," - Spacing value"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"--dsai-typography-font-size-lg"})," - Typography property"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"--dsai-border-radius-md"})," - Border radius"]}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"color-variables",children:"Color Variables"}),`
`,e.jsx(n.h3,{id:"primitive-colors",children:"Primitive Colors"}),`
`,e.jsx(n.p,{children:"Full color palette with 11 shades (50-950) for each color:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`/* Blue scale */
--dsai-color-blue-50: #ebf3fc;
--dsai-color-blue-100: #d7e6f9;
--dsai-color-blue-200: #aeccf3;
--dsai-color-blue-300: #86b3ed;
--dsai-color-blue-400: #5d99e7;
--dsai-color-blue-500: #0a58ca;  /* Base */
--dsai-color-blue-600: #084298;
--dsai-color-blue-700: #063166;
--dsai-color-blue-800: #042144;
--dsai-color-blue-900: #021022;
--dsai-color-blue-950: #010811;

/* Available color scales: */
/* blue, indigo, purple, pink, red, orange, yellow, green, teal, cyan */
`})}),`
`,e.jsx(n.h3,{id:"neutral-colors-gray",children:"Neutral Colors (Gray)"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`--dsai-neutral-gray-50: #f8f9fa;
--dsai-neutral-gray-100: #e9ecef;
--dsai-neutral-gray-200: #dee2e6;
--dsai-neutral-gray-300: #ced4da;
--dsai-neutral-gray-400: #adb5bd;
--dsai-neutral-gray-500: #6c757d;  /* Base */
--dsai-neutral-gray-600: #495057;
--dsai-neutral-gray-700: #343a40;
--dsai-neutral-gray-800: #212529;
--dsai-neutral-gray-900: #181c20;
--dsai-neutral-gray-950: #0f1113;
`})}),`
`,e.jsx(n.h3,{id:"semantic-colors",children:"Semantic Colors"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`/* Theme colors */
--dsai-theme-primary: #0d6efd;
--dsai-theme-secondary: #6c757d;
--dsai-theme-success: #198754;
--dsai-theme-danger: #dc3545;
--dsai-theme-warning: #ffc107;
--dsai-theme-info: #0dcaf0;
--dsai-theme-light: #f8f9fa;
--dsai-theme-dark: #212529;

/* Semantic link colors */
--dsai-semantic-link-color: #0d6efd;
--dsai-semantic-link-hover-color: #0a58ca;
`})}),`
`,e.jsx(n.h3,{id:"background-colors",children:"Background Colors"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`--dsai-background-white: #ffffff;
--dsai-background-black: #000000;
--dsai-background-body: #ffffff;
--dsai-background-body-secondary: #e9ecef;
--dsai-background-body-tertiary: #f8f9fa;
`})}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"typography-variables",children:"Typography Variables"}),`
`,e.jsx(n.h3,{id:"font-families",children:"Font Families"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`--dsai-typography-font-family-base: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--dsai-typography-font-family-monospace: Roboto Mono, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
`})}),`
`,e.jsx(n.h3,{id:"font-sizes",children:"Font Sizes"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`--dsai-typography-font-size-base: 1rem;     /* 16px */
--dsai-typography-font-size-sm: 0.875rem;   /* 14px */
--dsai-typography-font-size-lg: 1.25rem;    /* 20px */
`})}),`
`,e.jsx(n.h3,{id:"font-weights",children:"Font Weights"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`--dsai-typography-font-weight-lighter: 100;
--dsai-typography-font-weight-light: 300;
--dsai-typography-font-weight-normal: 400;
--dsai-typography-font-weight-medium: 500;
--dsai-typography-font-weight-semibold: 600;
--dsai-typography-font-weight-bold: 700;
--dsai-typography-font-weight-bolder: 900;
`})}),`
`,e.jsx(n.h3,{id:"line-heights-unitless",children:"Line Heights (Unitless)"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`--dsai-typography-line-height-xs: 1;
--dsai-typography-line-height-sm: 1.25;
--dsai-typography-line-height-tight: 1.25;
--dsai-typography-line-height-base: 1.5;
--dsai-typography-line-height-relaxed: 1.75;
--dsai-typography-line-height-lg: 2;
`})}),`
`,e.jsx(n.h3,{id:"letter-spacing",children:"Letter Spacing"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`--dsai-typography-letter-spacing-tighter: -0.05em;
--dsai-typography-letter-spacing-tight: -0.025em;
--dsai-typography-letter-spacing-normal: 0;
--dsai-typography-letter-spacing-wide: 0.025em;
--dsai-typography-letter-spacing-wider: 0.05em;
--dsai-typography-letter-spacing-widest: 0.1em;
`})}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"spacing-variables",children:"Spacing Variables"}),`
`,e.jsx(n.p,{children:"All spacing values use rem units for accessibility:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`--dsai-spacing-0: 0;
--dsai-spacing-1: 0.25rem;   /* 4px */
--dsai-spacing-2: 0.5rem;    /* 8px */
--dsai-spacing-3: 1rem;      /* 16px */
--dsai-spacing-4: 1.5rem;    /* 24px */
--dsai-spacing-5: 2rem;      /* 32px */
--dsai-spacing-6: 3rem;      /* 48px */
--dsai-spacing-7: 4rem;      /* 64px */
--dsai-spacing-8: 6rem;      /* 96px */
--dsai-spacing-9: 8rem;      /* 128px */
--dsai-spacing-10: 10rem;    /* 160px */
`})}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"border-variables",children:"Border Variables"}),`
`,e.jsx(n.h3,{id:"border-radius",children:"Border Radius"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`--dsai-border-radius-none: 0;
--dsai-border-radius-sm: 0.25rem;    /* 4px */
--dsai-border-radius-md: 0.5rem;     /* 8px */
--dsai-border-radius-lg: 1rem;       /* 16px */
--dsai-border-radius-xl: 1.5rem;     /* 24px */
--dsai-border-radius-xxl: 2rem;      /* 32px */
--dsai-border-radius-circle: 50%;
--dsai-border-radius-pill: 624.9375rem;
`})}),`
`,e.jsx(n.h3,{id:"border-colors",children:"Border Colors"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`--dsai-border-color-default: #dfe1e5;
`})}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"layout-variables",children:"Layout Variables"}),`
`,e.jsx(n.h3,{id:"breakpoints",children:"Breakpoints"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`--dsai-layout-breakpoints-xs: 0;
--dsai-layout-breakpoints-sm: 36rem;     /* 576px */
--dsai-layout-breakpoints-md: 48rem;     /* 768px */
--dsai-layout-breakpoints-lg: 62rem;     /* 992px */
--dsai-layout-breakpoints-xl: 75rem;     /* 1200px */
--dsai-layout-breakpoints-xxl: 87.5rem;  /* 1400px */
`})}),`
`,e.jsx(n.h3,{id:"container-max-widths",children:"Container Max Widths"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`--dsai-layout-container-max-width-sm: 33.75rem;  /* 540px */
--dsai-layout-container-max-width-md: 45rem;     /* 720px */
--dsai-layout-container-max-width-lg: 60rem;     /* 960px */
--dsai-layout-container-max-width-xl: 71.25rem;  /* 1140px */
--dsai-layout-container-max-width-xxl: 82.5rem;  /* 1320px */
`})}),`
`,e.jsx(n.h3,{id:"grid",children:"Grid"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`--dsai-layout-grid-columns: 12;
--dsai-layout-grid-gutter-width: 1.5rem;  /* 24px */
--dsai-layout-grid-row-columns: 6;
`})}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"usage-examples",children:"Usage Examples"}),`
`,e.jsx(n.h3,{id:"in-cssscss",children:"In CSS/SCSS"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`.card {
  background: var(--dsai-background-white);
  border-radius: var(--dsai-border-radius-md);
  padding: var(--dsai-spacing-4);
  box-shadow: var(--dsai-shadow-default);
}

.card-title {
  font-size: var(--dsai-typography-font-size-lg);
  font-weight: var(--dsai-typography-font-weight-bold);
  line-height: var(--dsai-typography-line-height-tight);
  color: var(--dsai-theme-dark);
}

.button-primary {
  background-color: var(--dsai-theme-primary);
  color: var(--dsai-background-white);
  padding: var(--dsai-spacing-2) var(--dsai-spacing-4);
  border-radius: var(--dsai-border-radius-md);
}
`})}),`
`,e.jsx(n.h3,{id:"in-react-inline-styles",children:"In React Inline Styles"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const cardStyle = {
  backgroundColor: 'var(--dsai-background-white)',
  borderRadius: 'var(--dsai-border-radius-md)',
  padding: 'var(--dsai-spacing-4)',
};

function Card({ children }) {
  return <div style={cardStyle}>{children}</div>;
}
`})}),`
`,e.jsx(n.h3,{id:"theming-with-css-variables",children:"Theming with CSS Variables"}),`
`,e.jsx(n.p,{children:"Override variables at any level:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`/* Global override */
:root {
  --dsai-theme-primary: #ff6b6b;
}

/* Scoped override */
.dark-theme {
  --dsai-background-body: #212529;
  --dsai-theme-primary: #6ea8fe;
}

/* Component-level override */
.special-button {
  --dsai-theme-primary: #9c27b0;
}
`})}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"browser-support",children:"Browser Support"}),`
`,e.jsx(n.p,{children:"CSS custom properties are supported in all modern browsers:"}),`
`,e.jsx(n.p,{children:`| Browser | Version |
|---------|---------|
| Chrome | 49+ |
| Firefox | 31+ |
| Safari | 9.1+ |
| Edge | 15+ |`}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["⚠️ ",e.jsx(n.strong,{children:"IE11"}),": Not supported. Use a polyfill if needed."]}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"related-resources",children:"Related Resources"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/docs/foundation-colors--docs",children:"Colors"})," - Full color palette documentation"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/docs/foundation-typography--docs",children:"Typography"})," - Typography scale documentation"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/docs/foundation-spacing--docs",children:"Spacing"})," - Spacing scale documentation"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/docs/guides-getting-started--docs",children:"Getting Started"})," - Setup guide"]}),`
`]})]})}function p(s={}){const{wrapper:n}={...r(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(a,{...s})}):a(s)}export{p as default};
