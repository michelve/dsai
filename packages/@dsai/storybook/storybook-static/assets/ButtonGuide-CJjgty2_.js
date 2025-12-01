import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as i}from"./index-B7UvNbjS.js";import"./Tabs-DTVVglNe.js";import{M as a}from"./WithTooltip-SK46ZJ2J-DVAUvauA.js";import"./iframe-CgsZvN4H.js";import"./preload-helper-Dp1pzeXC.js";import"./index-B46ixqos.js";function s(t){const e={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...i(),...t.components};return n.jsxs(n.Fragment,{children:[`
`,`
`,n.jsx(a,{title:"Guides/Button Component"}),`
`,n.jsx(e.h1,{id:"button-component-guide",children:"Button Component Guide"}),`
`,n.jsxs(e.p,{children:["The DSAi Button is a powerful, accessible button component with ",n.jsx(e.strong,{children:"Finite State Machine (FSM)"})," driven visual state management. This guide covers best practices, accessibility patterns, and advanced usage."]}),`
`,n.jsx(e.h2,{id:"core-concepts",children:"Core Concepts"}),`
`,n.jsx(e.h3,{id:"finite-state-machine-fsm",children:"Finite State Machine (FSM)"}),`
`,n.jsx(e.p,{children:"The Button uses an FSM to manage visual states consistently:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`States: idle → hovered → focused → pressed → disabled → loading → error
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Benefits:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"✅ Predictable state transitions"}),`
`,n.jsx(e.li,{children:"✅ No conflicting visual states"}),`
`,n.jsx(e.li,{children:"✅ Consistent across all interactions"}),`
`,n.jsx(e.li,{children:"✅ Fully testable (36 dedicated FSM tests)"}),`
`]}),`
`,n.jsx(e.h3,{id:"state-diagram",children:"State Diagram"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-plaintext",children:`                    ┌──────────────────────────────────────┐
                    │              disabled                │
                    └──────────────────────────────────────┘
                           ↑              ↓
    ┌──────┐  ENTER   ┌─────────┐  LEAVE   ┌──────┐
    │ idle │ ───────→ │ hovered │ ───────→ │ idle │
    └──────┘          └─────────┘          └──────┘
       ↓                   ↓
    ┌─────────┐       ┌─────────┐
    │ focused │       │ pressed │
    └─────────┘       └─────────┘
                           ↓
                    ┌──────────────────────────────────────┐
                    │          loading / error             │
                    └──────────────────────────────────────┘
`})}),`
`,n.jsx(e.h2,{id:"basic-usage",children:"Basic Usage"}),`
`,n.jsx(e.h3,{id:"variants",children:"Variants"}),`
`,n.jsx(e.p,{children:"DSAi Button supports 17 Bootstrap-compatible variants:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { Button } from '@dsai/react';

// Solid variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>
<Button variant="warning">Warning</Button>
<Button variant="info">Info</Button>
<Button variant="light">Light</Button>
<Button variant="dark">Dark</Button>

// Outline variants
<Button variant="outline-primary">Outline Primary</Button>
<Button variant="outline-secondary">Outline Secondary</Button>
// ... and more

// Link variant
<Button variant="link">Link Button</Button>
`})}),`
`,n.jsx(e.h3,{id:"sizes",children:"Sizes"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
`})}),`
`,n.jsx(e.h2,{id:"loading-states",children:"Loading States"}),`
`,n.jsx(e.h3,{id:"basic-loading",children:"Basic Loading"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`const [isLoading, setIsLoading] = useState(false);

<Button
  loading={isLoading}
  onClick={() => {
    setIsLoading(true);
    // ... async operation
    setIsLoading(false);
  }}
>
  Submit
</Button>;
`})}),`
`,n.jsx(e.h3,{id:"with-loading-text",children:"With Loading Text"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<Button loading={isLoading} loadingText="Saving...">
  Save Changes
</Button>
`})}),`
`,n.jsx(e.h3,{id:"loading-state-callbacks",children:"Loading State Callbacks"}),`
`,n.jsx(e.p,{children:"Handle async operation lifecycle with FSM callbacks:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<Button
  loading={isLoading}
  onLoadingComplete={() => {
    // Called when loading completes
    showToast('Operation successful!');
  }}
  onError={() => {
    // Called on error state
    showToast('Something went wrong');
  }}
>
  Process Data
</Button>
`})}),`
`,n.jsx(e.h2,{id:"accessibility",children:"Accessibility"}),`
`,n.jsx(e.h3,{id:"icon-only-buttons",children:"Icon-Only Buttons"}),`
`,n.jsx(e.p,{children:n.jsxs(e.strong,{children:["Always provide ",n.jsx(e.code,{children:"aria-label"})," for icon-only buttons:"]})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Good - has aria-label
<Button aria-label="Close dialog" variant="outline-secondary">
  ×
</Button>

// ✅ Good - has aria-label for icon
<Button aria-label="Go to next page" startIcon="→" />

// ❌ Bad - missing accessible name
<Button variant="outline-secondary">×</Button>
`})}),`
`,n.jsx(e.h3,{id:"screen-reader-announcements",children:"Screen Reader Announcements"}),`
`,n.jsxs(e.p,{children:["Use ",n.jsx(e.code,{children:"announce"})," and ",n.jsx(e.code,{children:"announceText"})," for dynamic state announcements:"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<Button
  loading={isLoading}
  announce={true}
  announceText={isLoading ? 'Saving your changes' : 'Changes saved'}
>
  Save
</Button>
`})}),`
`,n.jsx(e.h3,{id:"keyboard-navigation",children:"Keyboard Navigation"}),`
`,n.jsx(e.p,{children:"All buttons support full keyboard navigation:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"Enter"})," / ",n.jsx(e.code,{children:"Space"})," - Activate button"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"Tab"})," - Move focus to next element"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"Shift + Tab"})," - Move focus to previous element"]}),`
`]}),`
`,n.jsx(e.h3,{id:"aria-attributes",children:"ARIA Attributes"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// Toggle button
<Button
  aria-pressed={isActive}
  aria-expanded={isOpen}
  aria-controls="menu-panel"
>
  Toggle Menu
</Button>

// Loading state (auto-managed)
<Button loading>
  {/* aria-busy="true" and aria-disabled="true" are auto-applied */}
  Processing
</Button>
`})}),`
`,n.jsx(e.h2,{id:"icons",children:"Icons"}),`
`,n.jsx(e.h3,{id:"start-and-end-icons",children:"Start and End Icons"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<Button startIcon="⬅">Previous</Button>
<Button endIcon="➡">Next</Button>
<Button startIcon="✓" endIcon="→">Confirm & Continue</Button>
`})}),`
`,n.jsx(e.h3,{id:"icon-only-with-accessibility",children:"Icon-Only with Accessibility"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<Button aria-label="Delete item" variant="danger" startIcon="🗑" />
`})}),`
`,n.jsx(e.h2,{id:"error-states",children:"Error States"}),`
`,n.jsx(e.p,{children:"Handle operation failures gracefully:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

<Button
  loading={status === 'loading'}
  error={status === 'error'}
  errorText="Failed to save"
  onError={() => {
    // Log error, show notification, etc.
  }}
  onClick={async () => {
    setStatus('loading');
    try {
      await saveData();
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  }}
>
  Save Changes
</Button>;
`})}),`
`,n.jsx(e.h2,{id:"full-width-buttons",children:"Full Width Buttons"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<Button fullWidth variant="primary">
  Full Width Button
</Button>
`})}),`
`,n.jsx(e.h2,{id:"disabled-state",children:"Disabled State"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// Static disabled
<Button disabled>Cannot Click</Button>

// Conditional disabled
<Button disabled={!isValid || isLoading}>
  Submit Form
</Button>
`})}),`
`,n.jsxs(e.blockquote,{children:[`
`,n.jsxs(e.p,{children:["⚠️ ",n.jsx(e.strong,{children:"Note:"})," Avoid passing ",n.jsx(e.code,{children:"onClick"})," to disabled buttons. The CLI analyzer will warn you about this pattern."]}),`
`]}),`
`,n.jsx(e.h2,{id:"form-integration",children:"Form Integration"}),`
`,n.jsx(e.h3,{id:"as-submit-button",children:"As Submit Button"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<form onSubmit={handleSubmit}>
  <Button type="submit" loading={isSubmitting}>
    Submit
  </Button>
</form>
`})}),`
`,n.jsx(e.h3,{id:"with-form-validation",children:"With Form Validation"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<Button type="submit" disabled={!formIsValid} loading={isSubmitting}>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</Button>
`})}),`
`,n.jsx(e.h2,{id:"best-practices",children:"Best Practices"}),`
`,n.jsx(e.h3,{id:"dos-",children:"Do's ✅"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Always provide accessible names for icon-only buttons"})}),`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Use loading states for async operations"})}),`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Handle error states gracefully"})}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Use semantic button types"})," (",n.jsx(e.code,{children:"button"}),", ",n.jsx(e.code,{children:"submit"}),", ",n.jsx(e.code,{children:"reset"}),")"]}),`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Keep button text concise and action-oriented"})}),`
`]}),`
`,n.jsx(e.h3,{id:"donts-",children:"Don'ts ❌"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Don't use buttons for navigation"})," (use links instead)"]}),`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Don't disable buttons without explanation"})}),`
`,n.jsx(e.li,{children:n.jsxs(e.strong,{children:["Don't use icon-only buttons without ",n.jsx(e.code,{children:"aria-label"})]})}),`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Don't pass onClick to disabled buttons"})}),`
`]}),`
`,n.jsx(e.h2,{id:"testing",children:"Testing"}),`
`,n.jsx(e.p,{children:"The Button component has comprehensive test coverage:"}),`
`,n.jsxs(e.p,{children:[`| Test File                   | Tests   | Coverage            |
| --------------------------- | ------- | ------------------- |
| Button.test.tsx             | 85      | Core unit tests     |
| Button.a11y.test.tsx        | 24      | Accessibility tests |
| Button.fsm.test.ts          | 36      | FSM reducer tests   |
| Button.integration.test.tsx | 6       | Integration tests   |
| `,n.jsx(e.strong,{children:"Total"}),"                   | ",n.jsx(e.strong,{children:"151"})," | Full coverage       |"]}),`
`,n.jsx(e.h2,{id:"cli-analysis",children:"CLI Analysis"}),`
`,n.jsx(e.p,{children:"Use the Button Usage Analyzer to validate your Button usage:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`pnpm analyze:buttons
`})}),`
`,n.jsxs(e.p,{children:["See the ",n.jsx(e.a,{href:"/docs/guides-cli-tools--docs",children:"CLI Tools Guide"})," for more details."]}),`
`,n.jsx(e.h2,{id:"related",children:"Related"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"/docs/components-button--docs",children:"Button API Documentation"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"/docs/guides-cli-tools--docs",children:"CLI Tools Guide"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"/docs/guides-accessibility--docs",children:"Accessibility Guidelines"})}),`
`]})]})}function x(t={}){const{wrapper:e}={...i(),...t.components};return e?n.jsx(e,{...t,children:n.jsx(s,{...t})}):s(t)}export{x as default};
