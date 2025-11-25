import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as r}from"./index-BPAWFAba.js";import{M as i}from"./WithTooltip-SK46ZJ2J-rv19Di4P.js";import"./iframe-BNA8zzi1.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Dlj8U34d.js";function o(s){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",hr:"hr",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...r(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(i,{title:"Foundation/TypeScript Types"}),`
`,e.jsx(n.h1,{id:"typescript-types-reference",children:"TypeScript Types Reference"}),`
`,e.jsx(n.p,{children:"DSAi design tokens provide full TypeScript support with type-safe access, IntelliSense, and compile-time validation."}),`
`,e.jsx(n.h2,{id:"installation",children:"Installation"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`pnpm add @dsai/tokens
`})}),`
`,e.jsx(n.h2,{id:"import-patterns",children:"Import Patterns"}),`
`,e.jsx(n.h3,{id:"flat-token-imports-recommended",children:"Flat Token Imports (Recommended)"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { colorBlue500, spacing4, themePrimary } from '@dsai/tokens';

const styles = {
  color: colorBlue500,
  padding: spacing4,
  backgroundColor: themePrimary,
};
`})}),`
`,e.jsx(n.h3,{id:"grouped-token-access",children:"Grouped Token Access"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { tokens } from '@dsai/tokens';

const blue = tokens.color.blue['500'].value;
const primary = tokens.theme.primary.value;
`})}),`
`,e.jsx(n.h3,{id:"type-safe-utilities",children:"Type-Safe Utilities"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { getToken, cssVar, getColorToken } from '@dsai/tokens';

const blue = getToken('colorBlue500');
const ref = cssVar('themePrimary');
const red = getColorToken('red', '500');
`})}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"string-literal-types",children:"String Literal Types"}),`
`,e.jsx(n.p,{children:"All token names are available as string literal types for compile-time validation:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import type { ColorTokenName, TokenName } from '@dsai/tokens/types';

function useToken(name: ColorTokenName) {
  // Only valid color token names allowed
}

useToken('color.blue.500'); // Valid
`})}),`
`,e.jsx(n.h3,{id:"available-type-literals",children:"Available Type Literals"}),`
`,e.jsxs(n.p,{children:[`| Type | Description | Example Values |
|------|-------------|----------------|
| `,e.jsx(n.code,{children:"ColorTokenName"})," | All color tokens | ",e.jsx(n.code,{children:"color.blue.500"}),` |
| `,e.jsx(n.code,{children:"SpacingTokenName"})," | Spacing scale | ",e.jsx(n.code,{children:"spacing.4"}),` |
| `,e.jsx(n.code,{children:"TypographyTokenName"})," | Typography tokens | ",e.jsx(n.code,{children:"typography.font-size.base"}),` |
| `,e.jsx(n.code,{children:"ThemeTokenName"})," | Theme colors | ",e.jsx(n.code,{children:"theme.primary"}),` |
| `,e.jsx(n.code,{children:"BorderTokenName"})," | Border tokens | ",e.jsx(n.code,{children:"border.radius.md"}),` |
| `,e.jsx(n.code,{children:"LayoutTokenName"})," | Layout tokens | ",e.jsx(n.code,{children:"layout.breakpoints.md"}),` |
| `,e.jsx(n.code,{children:"TokenName"})," | All tokens | Any valid token name |"]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"utility-functions",children:"Utility Functions"}),`
`,e.jsx(n.h3,{id:"gettokenname",children:"getToken(name)"}),`
`,e.jsx(n.p,{children:"Get a token value by its camelCase name."}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { getToken } from '@dsai/tokens';

const blue = getToken('colorBlue500');
const spacing = getToken('spacing4');
const weight = getToken('typographyFontWeightBold');
`})}),`
`,e.jsx(n.h3,{id:"gettokeninfoname",children:"getTokenInfo(name)"}),`
`,e.jsx(n.p,{children:"Get full token info including CSS variable reference."}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { getTokenInfo } from '@dsai/tokens';

const info = getTokenInfo('colorBlue500');
// Returns: { value, cssVar, cssVarRef }
`})}),`
`,e.jsx(n.h3,{id:"cssvarname",children:"cssVar(name)"}),`
`,e.jsx(n.p,{children:"Get CSS variable reference string."}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { cssVar } from '@dsai/tokens';

const ref = cssVar('themePrimary');
// Returns: "var(--dsai-theme-primary)"
`})}),`
`,e.jsx(n.h3,{id:"category-specific-getters",children:"Category-Specific Getters"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { getColorToken, getSpacingToken, getThemeToken } from '@dsai/tokens';

getColorToken('blue', '500');
getSpacingToken('4');
getThemeToken('primary');
getBorderRadiusToken('md');
`})}),`
`,e.jsx(n.h3,{id:"validation-functions",children:"Validation Functions"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { isValidToken, getAllTokenNames, getTokensByCategory } from '@dsai/tokens';

isValidToken('colorBlue500');
getAllTokenNames();
getTokensByCategory('color');
`})}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"nested-interface",children:"Nested Interface"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"DesignTokens"})," interface provides full type information for nested access:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import type { DesignTokens } from '@dsai/tokens/types';

// Full nested structure with proper types
// color.blue["50"]: string
// spacing["0"]: string
// typography["font-weight"].bold: number
`})}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"intellisense-support",children:"IntelliSense Support"}),`
`,e.jsx(n.p,{children:"All token imports provide full IntelliSense in VS Code and other TypeScript-aware editors:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Autocomplete"}),": Type ",e.jsx(n.code,{children:"color"})," and see all color tokens"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Hover Info"}),": See token values and descriptions"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Go to Definition"}),": Jump to token source"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Rename Symbol"}),": Safely rename tokens across codebase"]}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"migration-guide",children:"Migration Guide"}),`
`,e.jsx(n.h3,{id:"adding-new-tokens",children:"Adding New Tokens"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:["Add token to JSON in ",e.jsx(n.code,{children:"packages/@dsai/tokens/collections/"})]}),`
`,e.jsxs(n.li,{children:["Run ",e.jsx(n.code,{children:"pnpm build:tokens"})," to regenerate types"]}),`
`,e.jsx(n.li,{children:"Import new token in your code"}),`
`]}),`
`,e.jsx(n.h3,{id:"renaming-tokens",children:"Renaming Tokens"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:"Update token name in JSON source"}),`
`,e.jsxs(n.li,{children:["Run ",e.jsx(n.code,{children:"pnpm build:tokens"})]}),`
`,e.jsx(n.li,{children:"TypeScript will show errors for old token names"}),`
`,e.jsx(n.li,{children:"Update all usages"}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"related-resources",children:"Related Resources"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/docs/foundation-css-variables--docs",children:"CSS Variables"})," - CSS custom properties reference"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/docs/foundation-colors--docs",children:"Colors"})," - Color palette documentation"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/docs/guides-getting-started--docs",children:"Getting Started"})," - Setup guide"]}),`
`]})]})}function h(s={}){const{wrapper:n}={...r(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(o,{...s})}):o(s)}export{h as default};
