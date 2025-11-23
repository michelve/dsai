import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as ae}from"./index-B_ctDfMz.js";import{M as oe,T as le,S as he,D as de,d as te,P as ce,b as pe,c as ge}from"./WithTooltip-SK46ZJ2J-Cwt34nM8.js";import{T as xe}from"./Typography.stories-DQADLTWc.js";import{t as s}from"./tokens-grouped-oym7BSzC.js";import"./iframe-CpVjLMaJ.js";import"./preload-helper-Dp1pzeXC.js";import"./index-K_3Px3xn.js";function re(i){var t,r,a,o,l,h,d,c,p,g,x,y,j,m,f,u,b,S,v,z,k,w,T,H,D,F,C,N,M,W,L,U,A,I,B,O,R,$,q,E,G,P,V,X,_,J,K,Q,Y,Z,ee,ne,se,ie;const n={a:"a",br:"br",code:"code",h2:"h2",h3:"h3",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...ae(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(oe,{of:xe}),`
`,e.jsx(le,{}),`
`,e.jsx(he,{children:e.jsx(n.p,{children:`Comprehensive typography system with display scales, headings, font families, sizes, weights, and
line heights for consistent text styling.`})}),`
`,e.jsx(de,{children:e.jsx(n.p,{children:`The DSAi typography system provides a complete set of typographic tokens based on Bootstrap 5.3
standards, ensuring consistent, accessible, and beautiful text across all platforms.`})}),`
`,e.jsx(n.h2,{id:"overview",children:"Overview"}),`
`,e.jsx(n.p,{children:"Our typography system includes:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Display Typography"})," (Display 1-6): Large, attention-grabbing text for hero sections"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Headings"})," (H1-H6): Semantic heading hierarchy for content structure"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Font Families"}),": System font stacks for base and monospace"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Font Sizes"}),": Modular scale from 12px to 80px"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Font Weights"}),": From light (300) to bolder (900)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Line Heights"}),": Contextual line heights for optimal readability"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Letter Spacing"}),": Fine-tuning for different text sizes and purposes"]}),`
`]}),`
`,e.jsx(n.h2,{id:"display-typography",children:"Display Typography"}),`
`,e.jsx(n.p,{children:"Display typography is designed for hero sections, landing pages, and marketing content. It features:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Larger sizes"}),": 40px to 80px (2.5rem to 5rem)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Lighter weight"}),": 300 (light) for elegant, modern appearance"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Tighter line-height"}),": 1.2 for visual impact"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Negative letter-spacing"}),": -0.02em for better balance at large sizes"]}),`
`]}),`
`,e.jsx(te,{fontSizes:[Number.parseInt(((o=(a=(r=(t=s.typography)==null?void 0:t.display)==null?void 0:r.display1)==null?void 0:a.fontSize)==null?void 0:o.value)||"80"),Number.parseInt(((c=(d=(h=(l=s.typography)==null?void 0:l.display)==null?void 0:h.display2)==null?void 0:d.fontSize)==null?void 0:c.value)||"72"),Number.parseInt(((y=(x=(g=(p=s.typography)==null?void 0:p.display)==null?void 0:g.display3)==null?void 0:x.fontSize)==null?void 0:y.value)||"64"),Number.parseInt(((u=(f=(m=(j=s.typography)==null?void 0:j.display)==null?void 0:m.display4)==null?void 0:f.fontSize)==null?void 0:u.value)||"56"),Number.parseInt(((z=(v=(S=(b=s.typography)==null?void 0:b.display)==null?void 0:S.display5)==null?void 0:v.fontSize)==null?void 0:z.value)||"48"),Number.parseInt(((H=(T=(w=(k=s.typography)==null?void 0:k.display)==null?void 0:w.display6)==null?void 0:T.fontSize)==null?void 0:H.value)||"40")],fontWeight:300,sampleText:"The quick brown fox jumps over the lazy dog",fontFamily:((C=(F=(D=s.typography)==null?void 0:D.fontFamily)==null?void 0:F.base)==null?void 0:C.value)||"system-ui, sans-serif"}),`
`,e.jsx(n.h3,{id:"display-scale",children:"Display Scale"}),`
`,e.jsxs(n.p,{children:[`| Display       | Size          | Usage                        |
| ------------- | ------------- | ---------------------------- |
| `,e.jsx(n.strong,{children:"Display 1"}),` | 80px (5rem)   | Hero headings, landing pages |
| `,e.jsx(n.strong,{children:"Display 2"}),` | 72px (4.5rem) | Large marketing headers      |
| `,e.jsx(n.strong,{children:"Display 3"}),` | 64px (4rem)   | Section heroes               |
| `,e.jsx(n.strong,{children:"Display 4"}),` | 56px (3.5rem) | Feature announcements        |
| `,e.jsx(n.strong,{children:"Display 5"}),` | 48px (3rem)   | Page titles                  |
| `,e.jsx(n.strong,{children:"Display 6"})," | 40px (2.5rem) | Section headers              |"]}),`
`,e.jsx(n.h3,{id:"usage-example",children:"Usage Example"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`.hero-title {
  font-size: var(--dsai-typography-display-display1-font-size); /* 80px */
  font-weight: var(--dsai-typography-display-font-weight); /* 300 */
  line-height: var(--dsai-typography-display-line-height); /* 1.2 */
  letter-spacing: -0.02em;
}
`})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import tokens from '@dsai/tokens';

const heroStyles = {
  fontSize: tokens.typography.display.display1.fontSize.value, // '80px'
  fontWeight: tokens.typography.display.fontWeight.value, // '300'
  lineHeight: tokens.typography.display.lineHeight.value,
  letterSpacing: '-0.02em',
};
`})}),`
`,e.jsx(n.h2,{id:"heading-typography",children:"Heading Typography"}),`
`,e.jsx(n.p,{children:"Semantic heading hierarchy (H1-H6) for content structure:"}),`
`,e.jsx(te,{fontSizes:[Number.parseInt(((L=(W=(M=(N=s.typography)==null?void 0:N.headings)==null?void 0:M.h1)==null?void 0:W.fontSize)==null?void 0:L.value)||"40"),Number.parseInt(((B=(I=(A=(U=s.typography)==null?void 0:U.headings)==null?void 0:A.h2)==null?void 0:I.fontSize)==null?void 0:B.value)||"32"),Number.parseInt(((q=($=(R=(O=s.typography)==null?void 0:O.headings)==null?void 0:R.h3)==null?void 0:$.fontSize)==null?void 0:q.value)||"28"),Number.parseInt(((V=(P=(G=(E=s.typography)==null?void 0:E.headings)==null?void 0:G.h4)==null?void 0:P.fontSize)==null?void 0:V.value)||"24"),Number.parseInt(((K=(J=(_=(X=s.typography)==null?void 0:X.headings)==null?void 0:_.h5)==null?void 0:J.fontSize)==null?void 0:K.value)||"20"),Number.parseInt(((ee=(Z=(Y=(Q=s.typography)==null?void 0:Q.headings)==null?void 0:Y.h6)==null?void 0:Z.fontSize)==null?void 0:ee.value)||"16")],fontWeight:500,sampleText:"The quick brown fox jumps over the lazy dog",fontFamily:((ie=(se=(ne=s.typography)==null?void 0:ne.fontFamily)==null?void 0:se.base)==null?void 0:ie.value)||"system-ui, sans-serif"}),`
`,e.jsx(n.h3,{id:"heading-scale",children:"Heading Scale"}),`
`,e.jsxs(n.p,{children:[`| Heading | Size           | Weight | Line Height | Usage                    |
| ------- | -------------- | ------ | ----------- | ------------------------ |
| `,e.jsx(n.strong,{children:"H1"}),`  | 40px (2.5rem)  | 500    | 1.2         | Page title, main heading |
| `,e.jsx(n.strong,{children:"H2"}),`  | 32px (2rem)    | 500    | 1.2         | Section heading          |
| `,e.jsx(n.strong,{children:"H3"}),`  | 28px (1.75rem) | 500    | 1.2         | Subsection heading       |
| `,e.jsx(n.strong,{children:"H4"}),`  | 24px (1.5rem)  | 500    | 1.2         | Component heading        |
| `,e.jsx(n.strong,{children:"H5"}),`  | 20px (1.25rem) | 500    | 1.2         | Small heading            |
| `,e.jsx(n.strong,{children:"H6"}),"  | 16px (1rem)    | 500    | 1.2         | Micro heading            |"]}),`
`,e.jsx(n.h3,{id:"best-practices",children:"Best Practices"}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"DO:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Use proper semantic HTML (",e.jsx(n.code,{children:"<h1>"}),", ",e.jsx(n.code,{children:"<h2>"}),", etc.)"]}),`
`,e.jsx(n.li,{children:"Maintain heading hierarchy (don't skip levels)"}),`
`,e.jsxs(n.li,{children:["One ",e.jsx(n.code,{children:"<h1>"})," per page for SEO and accessibility"]}),`
`,e.jsx(n.li,{children:"Use headings for structure, not just styling"}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"DON'T:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Don't use display typography for semantic headings"}),`
`]}),`
`,e.jsx(n.h2,{id:"font-families",children:"Font Families"}),`
`,e.jsx(n.h3,{id:"base-font-family",children:"Base Font Family"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`font-family: var(--dsai-typography-font-family-base);
/* System font stack: system-ui, -apple-system, "Segoe UI", Roboto, etc. */
`})}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Benefits:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Native OS fonts for optimal performance"}),`
`,e.jsx(n.li,{children:"No font downloads required"}),`
`,e.jsx(n.li,{children:"Familiar to users on each platform"}),`
`,e.jsx(n.li,{children:"Excellent readability across all devices"}),`
`]}),`
`,e.jsx(n.h3,{id:"monospace-font-family",children:"Monospace Font Family"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`font-family: var(--dsai-typography-font-family-monospace);
/* Monospace stack: SFMono-Regular, Menlo, Monaco, Consolas, etc. */
`})}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Use for:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Code snippets and examples"}),`
`,e.jsx(n.li,{children:"Technical documentation"}),`
`,e.jsx(n.li,{children:"Terminal/console output"}),`
`,e.jsx(n.li,{children:"Data tables with aligned columns"}),`
`]}),`
`,e.jsx(n.h2,{id:"font-size-scale",children:"Font Size Scale"}),`
`,e.jsxs(n.p,{children:[`| Token    | Size            | Usage                  |
| -------- | --------------- | ---------------------- |
| `,e.jsx(n.strong,{children:"xs"}),`   | 12px (0.75rem)  | Fine print, captions   |
| `,e.jsx(n.strong,{children:"sm"}),`   | 14px (0.875rem) | Secondary text, labels |
| `,e.jsx(n.strong,{children:"base"}),` | 16px (1rem)     | Body text (default)    |
| `,e.jsx(n.strong,{children:"lg"}),`   | 18px (1.125rem) | Emphasized body text   |
| `,e.jsx(n.strong,{children:"xl"}),`   | 20px (1.25rem)  | Lead paragraphs        |
| `,e.jsx(n.strong,{children:"2xl"}),`  | 24px (1.5rem)   | Large text             |
| `,e.jsx(n.strong,{children:"3xl"}),"  | 30px (1.875rem) | Extra large text       |"]}),`
`,e.jsx(n.h2,{id:"font-weight-scale",children:"Font Weight Scale"}),`
`,e.jsxs(n.p,{children:[`| Token        | Value | Usage                         |
| ------------ | ----- | ----------------------------- |
| `,e.jsx(n.strong,{children:"lighter"}),`  | 100   | Rarely used                   |
| `,e.jsx(n.strong,{children:"light"}),`    | 300   | Display typography, lead text |
| `,e.jsx(n.strong,{children:"normal"}),`   | 400   | Body text (default)           |
| `,e.jsx(n.strong,{children:"medium"}),`   | 500   | Headings, emphasized text     |
| `,e.jsx(n.strong,{children:"semibold"}),` | 600   | Strong emphasis, subheadings  |
| `,e.jsx(n.strong,{children:"bold"}),`     | 700   | Bold text, CTAs               |
| `,e.jsx(n.strong,{children:"bolder"}),"   | 900   | Maximum emphasis              |"]}),`
`,e.jsx(n.h2,{id:"line-height-scale",children:"Line Height Scale"}),`
`,e.jsxs(n.p,{children:[`| Token             | Ratio | Usage                         |
| ----------------- | ----- | ----------------------------- |
| `,e.jsx(n.strong,{children:"xs"}),`            | 1.0   | Compact UI, tags, badges      |
| `,e.jsx(n.strong,{children:"sm / tight"}),`    | 1.25  | Headings, display text        |
| `,e.jsx(n.strong,{children:"base / normal"}),` | 1.5   | Body text (WCAG AA compliant) |
| `,e.jsx(n.strong,{children:"relaxed"}),`       | 1.75  | Long-form content, articles   |
| `,e.jsx(n.strong,{children:"lg / loose"}),`    | 2.0   | Spacious layouts              |
| `,e.jsx(n.strong,{children:"display-sm"}),`    | 1.2   | Small display text (40px)     |
| `,e.jsx(n.strong,{children:"display-md"}),`    | 1.2   | Medium display text (48-56px) |
| `,e.jsx(n.strong,{children:"display-lg"}),"    | 1.2   | Large display text (64px+)    |"]}),`
`,e.jsx(n.h3,{id:"accessibility-note",children:"Accessibility Note"}),`
`,e.jsxs(n.p,{children:["WCAG 2.1 requires a minimum line-height of ",e.jsx(n.strong,{children:"1.5"})," for body text. Our ",e.jsx(n.code,{children:"base"})," token meets this requirement."]}),`
`,e.jsx(n.h2,{id:"letter-spacing",children:"Letter Spacing"}),`
`,e.jsxs(n.p,{children:[`| Token       | Value    | Usage                         |
| ----------- | -------- | ----------------------------- |
| `,e.jsx(n.strong,{children:"tighter"}),` | -0.05em  | Large headings, display text  |
| `,e.jsx(n.strong,{children:"tight"}),`   | -0.025em | Headings                      |
| `,e.jsx(n.strong,{children:"normal"}),`  | 0        | Body text (default)           |
| `,e.jsx(n.strong,{children:"wide"}),`    | 0.025em  | Small text, uppercase         |
| `,e.jsx(n.strong,{children:"wider"}),`   | 0.05em   | All-caps, labels, buttons     |
| `,e.jsx(n.strong,{children:"widest"}),"  | 0.1em    | Decorative, all-caps headings |"]}),`
`,e.jsx(n.h2,{id:"responsive-typography",children:"Responsive Typography"}),`
`,e.jsx(n.h3,{id:"mobile-first-approach",children:"Mobile-First Approach"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`/* Mobile (default) */
.hero-title {
  font-size: var(--dsai-typography-display-display5-font-size); /* 48px */
}

/* Tablet */
@media (min-width: 768px) {
  .hero-title {
    font-size: var(--dsai-typography-display-display3-font-size); /* 64px */
  }
}

/* Desktop */
@media (min-width: 1200px) {
  .hero-title {
    font-size: var(--dsai-typography-display-display1-font-size); /* 80px */
  }
}
`})}),`
`,e.jsx(n.h3,{id:"fluid-typography",children:"Fluid Typography"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`.hero-title {
  /* Scales between 48px and 80px based on viewport width */
  font-size: clamp(48px, 5vw + 1rem, 80px);
}
`})}),`
`,e.jsx(n.h2,{id:"accessibility-guidelines",children:"Accessibility Guidelines"}),`
`,e.jsx(n.h3,{id:"contrast-requirements-wcag-21-aa",children:"Contrast Requirements (WCAG 2.1 AA)"}),`
`,e.jsx(n.p,{children:`| Text Size                        | Minimum Contrast | Example                  |
| -------------------------------- | ---------------- | ------------------------ |
| Normal text (< 18px)             | 4.5:1            | Body text on backgrounds |
| Large text (≥ 18px or 14px bold) | 3:1              | Headings, display text   |
| UI components                    | 3:1              | Buttons, form controls   |`}),`
`,e.jsx(n.h3,{id:"best-practices-1",children:"Best Practices"}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"DO:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Use minimum 16px for body text"}),`
`,e.jsx(n.li,{children:"Maintain 1.5 line-height for body text"}),`
`,e.jsx(n.li,{children:"Keep lines between 45-75 characters for readability"}),`
`,e.jsx(n.li,{children:"Use relative units (rem, em) for scalability"}),`
`,e.jsx(n.li,{children:"Test with browser zoom at 200%"}),`
`,e.jsx(n.li,{children:"Provide sufficient color contrast"}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"DON'T:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Use text smaller than 12px (except in rare cases)"}),`
`,e.jsx(n.li,{children:"Set line-height below 1.25 for body text"}),`
`,e.jsx(n.li,{children:"Use all-caps for long text (reduces readability)"}),`
`,e.jsx(n.li,{children:"Justify text (creates uneven spacing)"}),`
`,e.jsx(n.li,{children:"Use pure black (#000) on pure white (too harsh)"}),`
`]}),`
`,e.jsx(n.h2,{id:"usage-examples",children:"Usage Examples"}),`
`,e.jsx(n.h3,{id:"css-variables",children:"CSS Variables"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-css",children:`.article-title {
  font-family: var(--dsai-typography-font-family-base);
  font-size: var(--dsai-typography-headings-h1-font-size);
  font-weight: var(--dsai-typography-headings-font-weight);
  line-height: var(--dsai-typography-headings-line-height);
  letter-spacing: var(--dsai-typography-letter-spacing-tight);
}

.body-text {
  font-size: var(--dsai-typography-font-size-base);
  line-height: var(--dsai-typography-line-height-base);
  letter-spacing: var(--dsai-typography-letter-spacing-normal);
}

.lead-paragraph {
  font-size: var(--dsai-typography-lead-font-size);
  font-weight: var(--dsai-typography-lead-font-weight);
}

.code-block {
  font-family: var(--dsai-typography-font-family-monospace);
  font-size: var(--dsai-typography-font-size-sm);
}
`})}),`
`,e.jsx(n.h3,{id:"typescriptreact",children:"TypeScript/React"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import tokens from '@dsai/tokens';

const typographyStyles = {
  heroTitle: {
    fontFamily: tokens.typography.fontFamily.base.value,
    fontSize: tokens.typography.display.display1.fontSize.value,
    fontWeight: tokens.typography.display.fontWeight.value,
    lineHeight: tokens.typography.display.lineHeight.value,
    letterSpacing: '-0.02em',
  },
  heading: {
    fontSize: tokens.typography.headings.h1.fontSize.value,
    fontWeight: tokens.typography.headings.fontWeight.value,
    lineHeight: tokens.typography.headings.lineHeight.value,
  },
  body: {
    fontSize: tokens.typography.fontSize.base.value,
    fontWeight: tokens.typography.fontWeight.normal.value,
    lineHeight: tokens.typography.lineHeight.base.value,
  },
  code: {
    fontFamily: tokens.typography.fontFamily.monospace.value,
    fontSize: tokens.typography.fontSize.sm.value,
  },
};
`})}),`
`,e.jsx(n.h2,{id:"bootstrap-compatibility",children:"Bootstrap Compatibility"}),`
`,e.jsx(n.p,{children:"Our typography tokens map directly to Bootstrap 5.3 variables:"}),`
`,e.jsxs(n.p,{children:[`| DSAi Token                       | Bootstrap Variable    |
| -------------------------------- | --------------------- |
| `,e.jsx(n.code,{children:"typography.fontSize.base"}),"       | ",e.jsx(n.code,{children:"$font-size-base"}),`     |
| `,e.jsx(n.code,{children:"typography.fontSize.sm"}),"         | ",e.jsx(n.code,{children:"$font-size-sm"}),`       |
| `,e.jsx(n.code,{children:"typography.fontSize.lg"}),"         | ",e.jsx(n.code,{children:"$font-size-lg"}),`       |
| `,e.jsx(n.code,{children:"typography.fontWeight.*"}),"        | ",e.jsx(n.code,{children:"$font-weight-*"}),`      |
| `,e.jsx(n.code,{children:"typography.lineHeight.base"}),"     | ",e.jsx(n.code,{children:"$line-height-base"}),`   |
| `,e.jsx(n.code,{children:"typography.headings.*.fontSize"})," | ",e.jsx(n.code,{children:"$h*-font-size"}),`       |
| `,e.jsx(n.code,{children:"typography.display.*.fontSize"}),"  | ",e.jsx(n.code,{children:"$display-font-sizes"}),` |
| `,e.jsx(n.code,{children:"typography.lead.fontSize"}),"       | ",e.jsx(n.code,{children:"$lead-font-size"}),`     |
| `,e.jsx(n.code,{children:"typography.small.fontSize"}),"      | ",e.jsx(n.code,{children:"$small-font-size"}),"    |"]}),`
`,e.jsx(n.h2,{id:"related-documentation",children:"Related Documentation"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/docs/foundation-colors--docs",children:"Colors System"})," - Color tokens for text and backgrounds"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/docs/foundation-spacing--docs",children:"Spacing System"})," - Spacing tokens for margins and padding"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/docs/components-button--docs",children:"Component Library"})," - How components use typography"]}),`
`]}),`
`,e.jsx(n.h2,{id:"resources",children:"Resources"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://www.w3.org/WAI/WCAG21/quickref/",rel:"nofollow",children:"WCAG 2.1 Guidelines"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://webaim.org/resources/contrastchecker/",rel:"nofollow",children:"WebAIM Contrast Checker"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://www.modularscale.com/",rel:"nofollow",children:"Modular Scale Calculator"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://getbootstrap.com/docs/5.3/content/typography/",rel:"nofollow",children:"Bootstrap Typography"})}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Last Updated:"})," November 22, 2025",e.jsx(n.br,{}),`
`,e.jsx(n.strong,{children:"Token Version:"})," 1.0.0",e.jsx(n.br,{}),`
`,e.jsx(n.strong,{children:"Design System:"})," DSAi Component Library"]}),`
`,e.jsx(n.h2,{id:"interactive-stories",children:"Interactive Stories"}),`
`,e.jsx(ce,{}),`
`,e.jsx(pe,{}),`
`,e.jsx(ge,{})]})}function ze(i={}){const{wrapper:n}={...ae(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(re,{...i})}):re(i)}export{ze as default};
