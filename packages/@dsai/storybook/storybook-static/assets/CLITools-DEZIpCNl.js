import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as o}from"./index-B7UvNbjS.js";import{M as t}from"./WithTooltip-SK46ZJ2J-DVAUvauA.js";import"./iframe-CgsZvN4H.js";import"./preload-helper-Dp1pzeXC.js";import"./index-B46ixqos.js";function i(s){const e={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...o(),...s.components};return n.jsxs(n.Fragment,{children:[`
`,`
`,n.jsx(t,{title:"Guides/CLI Tools"}),`
`,n.jsx(e.h1,{id:"cli-tools-guide",children:"CLI Tools Guide"}),`
`,n.jsx(e.p,{children:"DSAi provides command-line tools to help maintain code quality, accessibility compliance, and design consistency across your project."}),`
`,n.jsx(e.h2,{id:"button-usage-analyzer",children:"Button Usage Analyzer"}),`
`,n.jsx(e.p,{children:"The Button Usage Analyzer scans your codebase for Button component usage and validates accessibility patterns, FSM usage, and best practices."}),`
`,n.jsx(e.h3,{id:"installation",children:"Installation"}),`
`,n.jsx(e.p,{children:"The analyzer is included in the DSAi monorepo. No additional installation needed."}),`
`,n.jsx(e.h3,{id:"quick-start",children:"Quick Start"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`# From workspace root
pnpm analyze:buttons

# Or run directly
node tools/scripts/analysis/analyze-button-usage.js
`})}),`
`,n.jsx(e.h3,{id:"usage",children:"Usage"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`# Scan all packages (default)
pnpm analyze:buttons

# Scan specific directory
pnpm analyze:buttons packages/@dsai/react

# Scan specific file
pnpm analyze:buttons src/components/MyComponent.tsx

# Output as JSON
pnpm analyze:buttons --json

# Verbose mode (show all files scanned)
pnpm analyze:buttons --verbose
`})}),`
`,n.jsx(e.h3,{id:"what-it-checks",children:"What It Checks"}),`
`,n.jsx(e.p,{children:"The analyzer validates several categories of Button usage:"}),`
`,n.jsx(e.h4,{id:"-errors-must-fix",children:"🔴 Errors (Must Fix)"}),`
`,n.jsxs(e.p,{children:[`| Rule                         | Description                              | Example                                                        |
| ---------------------------- | ---------------------------------------- | -------------------------------------------------------------- |
| Icon-only missing aria-label | Icon-only buttons must have `,n.jsx(e.code,{children:"aria-label"})," | ",n.jsx(e.code,{children:"<Button>×</Button>"})," → ",n.jsx(e.code,{children:'<Button aria-label="Close">×</Button>'})," |"]}),`
`,n.jsx(e.h4,{id:"-warnings-should-fix",children:"🟡 Warnings (Should Fix)"}),`
`,n.jsxs(e.p,{children:[`| Rule                                | Description                                           |
| ----------------------------------- | ----------------------------------------------------- |
| `,n.jsx(e.code,{children:"onError"})," without error handler     | Using ",n.jsx(e.code,{children:"onError"}),` callback but not handling error state |
| `,n.jsx(e.code,{children:"onLoadingComplete"}),` without loading | Using completion callback without loading state       |
| `,n.jsx(e.code,{children:"onClick"})," on disabled               | Passing event handler to disabled button              |"]}),`
`,n.jsx(e.h4,{id:"-info-suggestions",children:"🔵 Info (Suggestions)"}),`
`,n.jsxs(e.p,{children:[`| Rule                                    | Description                                      |
| --------------------------------------- | ------------------------------------------------ |
| `,n.jsx(e.code,{children:"aria-expanded"})," without ",n.jsx(e.code,{children:"aria-controls"}),` | Toggle buttons should link to controlled element |
| Missing loading state                   | Async operations should show loading feedback    |`]}),`
`,n.jsx(e.h3,{id:"output-example",children:"Output Example"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-plaintext",children:`🔍 Button Usage Analyzer
═══════════════════════════════════════════════════════

Scanning: packages/@dsai

📊 Results
───────────────────────────────────────────────────────
Files scanned:  22
Buttons found:  227
Total issues:   52

Issue Summary:
  ● Errors:     0 (must fix)
  ● Warnings:   14 (should fix)
  ● Info:       38 (suggestions)

By Category:
  ● Accessibility:  0
  ● FSM Pattern:    14
  ● Best Practice:  38

═══════════════════════════════════════════════════════
`})}),`
`,n.jsx(e.h3,{id:"issue-details",children:"Issue Details"}),`
`,n.jsx(e.p,{children:"When issues are found, you'll see detailed output:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-plaintext",children:`⚠  WARNING in packages/@dsai/storybook/docs/components/Button.stories.tsx
   Line 142: FSM Pattern - Button has onLoadingComplete but verify loading
   state is being used

   Context: <Button onLoadingComplete={() => setStatus('success')}>

ℹ  INFO in packages/@dsai/react/src/Button/Button.tsx
   Line 89: Best Practice - Button has aria-expanded without aria-controls

   Context: <Button aria-expanded={isOpen}>Toggle</Button>
`})}),`
`,n.jsx(e.h3,{id:"fixing-issues",children:"Fixing Issues"}),`
`,n.jsx(e.h4,{id:"icon-only-buttons",children:"Icon-Only Buttons"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ❌ Before - Error
<Button variant="outline-secondary">×</Button>

// ✅ After - Fixed
<Button variant="outline-secondary" aria-label="Close dialog">×</Button>
`})}),`
`,n.jsx(e.h4,{id:"fsm-pattern-warnings",children:"FSM Pattern Warnings"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ❌ Before - Warning (onLoadingComplete without loading)
<Button onLoadingComplete={() => toast('Done!')}>
  Submit
</Button>

// ✅ After - Fixed
<Button
  loading={isLoading}
  onLoadingComplete={() => toast('Done!')}
>
  Submit
</Button>
`})}),`
`,n.jsx(e.h4,{id:"aria-best-practices",children:"ARIA Best Practices"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ❌ Before - Info (aria-expanded without aria-controls)
<Button aria-expanded={isOpen}>Menu</Button>

// ✅ After - Fixed
<Button aria-expanded={isOpen} aria-controls="menu-panel">
  Menu
</Button>
`})}),`
`,n.jsx(e.h3,{id:"ci-integration",children:"CI Integration"}),`
`,n.jsx(e.p,{children:"Add the analyzer to your CI pipeline:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-yaml",children:`# .github/workflows/ci.yml
jobs:
  lint:
    steps:
      - name: Analyze Button Usage
        run: pnpm analyze:buttons --json > button-report.json

      - name: Check for Errors
        run: |
          errors=$(jq '.summary.errors' button-report.json)
          if [ "$errors" -gt 0 ]; then
            echo "❌ Found $errors button accessibility errors"
            exit 1
          fi
`})}),`
`,n.jsx(e.h3,{id:"configuration",children:"Configuration"}),`
`,n.jsx(e.p,{children:"The analyzer respects these patterns:"}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Scanned:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:".tsx"}),", ",n.jsx(e.code,{children:".jsx"}),", ",n.jsx(e.code,{children:".ts"}),", ",n.jsx(e.code,{children:".js"})," files"]}),`
`,n.jsxs(e.li,{children:["Files importing ",n.jsx(e.code,{children:"Button"})," from ",n.jsx(e.code,{children:"@dsai/react"})]}),`
`]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Skipped:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.code,{children:"node_modules/"})}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"*.test.tsx"}),", ",n.jsx(e.code,{children:"*.spec.tsx"})]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"*.d.ts"})," (type definitions)"]}),`
`,n.jsxs(e.li,{children:["JSDoc comment blocks (",n.jsx(e.code,{children:"/** */"}),")"]}),`
`]}),`
`,n.jsx(e.h3,{id:"meaningful-short-words",children:"Meaningful Short Words"}),`
`,n.jsx(e.p,{children:"The analyzer recognizes these short words as valid button content (not icon-only):"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"Go"}),", ",n.jsx(e.code,{children:"OK"}),", ",n.jsx(e.code,{children:"No"}),", ",n.jsx(e.code,{children:"Yes"})]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"On"}),", ",n.jsx(e.code,{children:"Off"})]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"Add"}),", ",n.jsx(e.code,{children:"New"}),", ",n.jsx(e.code,{children:"Edit"}),", ",n.jsx(e.code,{children:"Save"}),", ",n.jsx(e.code,{children:"Send"}),", ",n.jsx(e.code,{children:"Copy"}),", ",n.jsx(e.code,{children:"Cut"}),", ",n.jsx(e.code,{children:"Run"})]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"Log"}),", ",n.jsx(e.code,{children:"Map"}),", ",n.jsx(e.code,{children:"Set"}),", ",n.jsx(e.code,{children:"Get"}),", ",n.jsx(e.code,{children:"Put"}),", ",n.jsx(e.code,{children:"Zip"})]}),`
`]}),`
`,n.jsx(e.h2,{id:"token-scripts",children:"Token Scripts"}),`
`,n.jsx(e.p,{children:"DSAi includes several scripts for managing design tokens:"}),`
`,n.jsx(e.h3,{id:"transform-tokens",children:"Transform Tokens"}),`
`,n.jsx(e.p,{children:"Convert Figma exports to DTCG format:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`pnpm tokens:transform
`})}),`
`,n.jsx(e.h3,{id:"validate-tokens",children:"Validate Tokens"}),`
`,n.jsx(e.p,{children:"Check token structure and values:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`pnpm tokens:validate
`})}),`
`,n.jsx(e.h3,{id:"build-tokens",children:"Build Tokens"}),`
`,n.jsx(e.p,{children:"Transform and validate in one step:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`pnpm tokens:build
`})}),`
`,n.jsx(e.h2,{id:"script-locations",children:"Script Locations"}),`
`,n.jsxs(e.p,{children:["All scripts are organized in ",n.jsx(e.code,{children:"tools/scripts/"}),":"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-plaintext",children:`tools/scripts/
├── analysis/           # Code analysis tools
│   └── analyze-button-usage.js
├── github/             # GitHub automation
│   ├── export-tasks-to-github-csv.js
│   └── update-issue-labels.js
├── storybook/          # Storybook utilities
│   ├── kill-storybook.sh
│   └── verify-storybook.sh
└── tokens/             # Token transformation
    ├── transform-figma-tokens.js
    ├── validate-tokens.js
    └── ... (more utilities)
`})}),`
`,n.jsx(e.h2,{id:"npm-scripts-reference",children:"NPM Scripts Reference"}),`
`,n.jsx(e.h3,{id:"root-workspace",children:"Root Workspace"}),`
`,n.jsxs(e.p,{children:[`| Script                  | Description                 |
| ----------------------- | --------------------------- |
| `,n.jsx(e.code,{children:"pnpm analyze:buttons"}),`  | Run Button usage analyzer   |
| `,n.jsx(e.code,{children:"pnpm tokens:transform"}),` | Transform Figma tokens      |
| `,n.jsx(e.code,{children:"pnpm tokens:validate"}),`  | Validate token structure    |
| `,n.jsx(e.code,{children:"pnpm tokens:build"}),"     | Transform + validate tokens |"]}),`
`,n.jsx(e.h3,{id:"dsaitokens",children:"@dsai/tokens"}),`
`,n.jsxs(e.p,{children:[`| Script                                             | Description            |
| -------------------------------------------------- | ---------------------- |
| `,n.jsx(e.code,{children:"pnpm --filter @dsai/tokens tokens:validate:figma"}),` | Validate Figma exports |
| `,n.jsx(e.code,{children:"pnpm --filter @dsai/tokens tokens:build"}),"          | Full token build       |"]}),`
`,n.jsx(e.h3,{id:"dsaistorybook",children:"@dsai/storybook"}),`
`,n.jsxs(e.p,{children:[`| Script                                 | Description              |
| -------------------------------------- | ------------------------ |
| `,n.jsx(e.code,{children:"pnpm --filter @dsai/storybook kill"}),`   | Kill Storybook processes |
| `,n.jsx(e.code,{children:"pnpm --filter @dsai/storybook verify"})," | Verify Storybook build   |"]}),`
`,n.jsx(e.h2,{id:"related",children:"Related"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"/docs/guides-button-component--docs",children:"Button Component Guide"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"/docs/guides-getting-started--docs",children:"Getting Started"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"/docs/foundation-colors--docs",children:"Design Tokens"})}),`
`]})]})}function u(s={}){const{wrapper:e}={...o(),...s.components};return e?n.jsx(e,{...s,children:n.jsx(i,{...s})}):i(s)}export{u as default};
