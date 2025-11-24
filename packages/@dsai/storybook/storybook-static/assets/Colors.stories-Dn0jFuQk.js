import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{t as n}from"./iframe-Bfk6g-kH.js";import"./preload-helper-Dp1pzeXC.js";const Me={title:"Foundation/Colors",parameters:{docs:{description:{component:"DSAi color system with 121 primitive colors (11 hues × 11 steps) and 88 semantic colors for consistent theming."}},backgrounds:{default:"light",values:[{name:"light",value:"#ffffff"},{name:"dark",value:"#1a1a1a"},{name:"gray",value:"#f5f5f5"},{name:"brand",value:"#00b8a9"}]}}},M=({name:b,value:r,cssVariable:a,tokenPath:o,textColor:l="#000"})=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"stretch",gap:"8px",minWidth:"160px",flex:"0 0 auto"},children:[e.jsx("div",{style:{width:"100%",height:"80px",backgroundColor:r,borderRadius:"8px",border:"1px solid #e5e7eb",boxShadow:"0 1px 3px rgba(0, 0, 0, 0.1)",display:"flex",alignItems:"center",justifyContent:"center",color:l,fontWeight:600,fontSize:"14px"},children:b}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("div",{style:{fontSize:"11px",color:"#111827",fontFamily:"monospace",fontWeight:600},children:r}),a&&e.jsx("div",{style:{fontSize:"10px",color:"#111111",fontFamily:"monospace",wordBreak:"break-all"},children:a}),o&&e.jsx("div",{style:{fontSize:"10px",color:"#111111",fontFamily:"monospace",fontStyle:"italic",wordBreak:"break-all"},children:o})]})]}),z={render:()=>{var r,a,o,l,m,u,p,c,i,d,f,v,s,g,x,y,k,h,C,V,S,j,w,B,T,W,P,D,I,G,E,U,A;const b=[{name:"50",value:((o=(a=(r=n.color)==null?void 0:r.blue)==null?void 0:a[50])==null?void 0:o.value)||"#eff6ff",cssVar:"--dsai-color-blue-50",token:"color.blue.50"},{name:"100",value:((u=(m=(l=n.color)==null?void 0:l.blue)==null?void 0:m[100])==null?void 0:u.value)||"#dbeafe",cssVar:"--dsai-color-blue-100",token:"color.blue.100"},{name:"200",value:((i=(c=(p=n.color)==null?void 0:p.blue)==null?void 0:c[200])==null?void 0:i.value)||"#bfdbfe",cssVar:"--dsai-color-blue-200",token:"color.blue.200"},{name:"300",value:((v=(f=(d=n.color)==null?void 0:d.blue)==null?void 0:f[300])==null?void 0:v.value)||"#93c5fd",cssVar:"--dsai-color-blue-300",token:"color.blue.300"},{name:"400",value:((x=(g=(s=n.color)==null?void 0:s.blue)==null?void 0:g[400])==null?void 0:x.value)||"#60a5fa",cssVar:"--dsai-color-blue-400",token:"color.blue.400"},{name:"500",value:((h=(k=(y=n.color)==null?void 0:y.blue)==null?void 0:k[500])==null?void 0:h.value)||"#3b82f6",cssVar:"--dsai-color-blue-500",token:"color.blue.500"},{name:"600",value:((S=(V=(C=n.color)==null?void 0:C.blue)==null?void 0:V[600])==null?void 0:S.value)||"#2563eb",cssVar:"--dsai-color-blue-600",token:"color.blue.600"},{name:"700",value:((B=(w=(j=n.color)==null?void 0:j.blue)==null?void 0:w[700])==null?void 0:B.value)||"#1d4ed8",cssVar:"--dsai-color-blue-700",token:"color.blue.700"},{name:"800",value:((P=(W=(T=n.color)==null?void 0:T.blue)==null?void 0:W[800])==null?void 0:P.value)||"#1e40af",cssVar:"--dsai-color-blue-800",token:"color.blue.800"},{name:"900",value:((G=(I=(D=n.color)==null?void 0:D.blue)==null?void 0:I[900])==null?void 0:G.value)||"#1e3a8a",cssVar:"--dsai-color-blue-900",token:"color.blue.900"},{name:"950",value:((A=(U=(E=n.color)==null?void 0:E.blue)==null?void 0:U[950])==null?void 0:A.value)||"#172554",cssVar:"--dsai-color-blue-950",token:"color.blue.950"}];return e.jsxs("div",{children:[e.jsx("h2",{children:"Brand Colors (Blue Scale)"}),e.jsx("p",{children:"Primary brand color scale used for buttons, links, and interactive elements."}),e.jsx("div",{style:{display:"flex",gap:"16px",flexWrap:"wrap",marginTop:"24px"},children:b.map(t=>e.jsx(M,{name:t.name,value:t.value,cssVariable:t.cssVar,tokenPath:t.token,textColor:parseInt(t.name,10)>=500?"#fff":"#000"},t.name))})]})}},L={render:()=>{var r,a,o,l,m,u,p,c,i,d,f,v;const b=[{name:"Primary",value:((a=(r=n.theme)==null?void 0:r.primary)==null?void 0:a.value)||"#0ea5e9",cssVar:"--dsai-theme-primary",token:"theme.primary",description:"Main brand color",textColor:"#fff"},{name:"Secondary",value:((l=(o=n.theme)==null?void 0:o.secondary)==null?void 0:l.value)||"#64748b",cssVar:"--dsai-theme-secondary",token:"theme.secondary",description:"Secondary actions",textColor:"#111"},{name:"Success",value:((u=(m=n.theme)==null?void 0:m.success)==null?void 0:u.value)||"#10b981",cssVar:"--dsai-theme-success",token:"theme.success",description:"Success states",textColor:"#fff"},{name:"Danger",value:((c=(p=n.theme)==null?void 0:p.danger)==null?void 0:c.value)||"#ef4444",cssVar:"--dsai-theme-danger",token:"theme.danger",description:"Error states",textColor:"#fff"},{name:"Warning",value:((d=(i=n.theme)==null?void 0:i.warning)==null?void 0:d.value)||"#f59e0b",cssVar:"--dsai-theme-warning",token:"theme.warning",description:"Warning states",textColor:"#000"},{name:"Info",value:((v=(f=n.theme)==null?void 0:f.info)==null?void 0:v.value)||"#0ea5e9",cssVar:"--dsai-theme-info",token:"theme.info",description:"Informational",textColor:"#fff"}];return e.jsxs("div",{children:[e.jsx("h2",{children:"Semantic Colors"}),e.jsx("p",{children:"Contextual colors used for feedback, states, and semantic meaning."}),e.jsx("div",{style:{display:"flex",gap:"16px",flexWrap:"wrap",marginTop:"24px"},children:b.map(s=>e.jsxs("div",{style:{minWidth:"180px"},children:[e.jsx(M,{name:s.name,value:s.value,cssVariable:s.cssVar,tokenPath:s.token,textColor:s.textColor}),e.jsx("p",{style:{fontSize:"12px",color:"#6b7280",marginTop:"8px"},children:s.description})]},s.name))})]})}},N={render:()=>{var r,a,o,l,m,u,p,c,i,d,f,v,s,g,x,y,k,h,C,V,S,j,w,B,T,W,P,D,I,G,E,U,A,t,q,J,_,O,K,Q,X,Y,Z,ee,ne,ae,oe,re,se,te,le,ce;const b=[{category:"Body & Text",colors:[{name:"Body Text",value:((a=(r=n.semantic)==null?void 0:r["body-color"])==null?void 0:a.value)||"#212529",cssVar:"--dsai-semantic-body-color",token:"semantic.body-color",description:"Default body text color",textColor:"#fff"},{name:"Body Background",value:((l=(o=n.semantic)==null?void 0:o["body-bg"])==null?void 0:l.value)||"#ffffff",cssVar:"--dsai-semantic-body-bg",token:"semantic.body-bg",description:"Default body background",textColor:"#000"},{name:"Emphasis",value:((u=(m=n.semantic)==null?void 0:m["emphasis-color"])==null?void 0:u.value)||"#000000",cssVar:"--dsai-semantic-emphasis-color",token:"semantic.emphasis-color",description:"High contrast text",textColor:"#fff"},{name:"Secondary Text",value:((c=(p=n.semantic)==null?void 0:p["secondary-color"])==null?void 0:c.value)||"#6c757d",cssVar:"--dsai-semantic-secondary-color",token:"semantic.secondary-color",description:"Lighter text",textColor:"#111"},{name:"Tertiary Text",value:((d=(i=n.semantic)==null?void 0:i["tertiary-color"])==null?void 0:d.value)||"#a8adb7",cssVar:"--dsai-semantic-tertiary-color",token:"semantic.tertiary-color",description:"Lightest text",textColor:"#000"}]},{category:"Links",colors:[{name:"Link Default",value:((v=(f=n.semantic)==null?void 0:f["link-color"])==null?void 0:v.value)||"#0d6efd",cssVar:"--dsai-semantic-link-color",token:"semantic.link-color",description:"Default link color",textColor:"#fff"},{name:"Link Hover",value:((g=(s=n.semantic)==null?void 0:s["link-hover-color"])==null?void 0:g.value)||"#0a58ca",cssVar:"--dsai-semantic-link-hover-color",token:"semantic.link-hover-color",description:"Link hover state",textColor:"#fff"}]},{category:"Backgrounds",colors:[{name:"Secondary BG",value:((y=(x=n.semantic)==null?void 0:x["secondary-bg"])==null?void 0:y.value)||"#e9ecef",cssVar:"--dsai-semantic-secondary-bg",token:"semantic.secondary-bg",description:"Secondary surface",textColor:"#000"},{name:"Tertiary BG",value:((h=(k=n.semantic)==null?void 0:k["tertiary-bg"])==null?void 0:h.value)||"#f8f9fa",cssVar:"--dsai-semantic-tertiary-bg",token:"semantic.tertiary-bg",description:"Tertiary surface",textColor:"#000"}]},{category:"Borders",colors:[{name:"Border",value:((V=(C=n.semantic)==null?void 0:C["border-color"])==null?void 0:V.value)||"#dee2e6",cssVar:"--dsai-semantic-border-color",token:"semantic.border-color",description:"Default borders",textColor:"#000"},{name:"Border Translucent",value:((j=(S=n.semantic)==null?void 0:S["border-color-translucent"])==null?void 0:j.value)||"rgba(0,0,0,0.175)",cssVar:"--dsai-semantic-border-color-translucent",token:"semantic.border-color-translucent",description:"Translucent borders",textColor:"#fff"}]},{category:"Primary Variants",colors:[{name:"Text Emphasis",value:((B=(w=n.semantic)==null?void 0:w["primary-text-emphasis"])==null?void 0:B.value)||"#052c65",cssVar:"--dsai-semantic-primary-text-emphasis",token:"semantic.primary-text-emphasis",description:"Primary text emphasis",textColor:"#fff"},{name:"BG Subtle",value:((W=(T=n.semantic)==null?void 0:T["primary-bg-subtle"])==null?void 0:W.value)||"#cfe2ff",cssVar:"--dsai-semantic-primary-bg-subtle",token:"semantic.primary-bg-subtle",description:"Primary subtle background",textColor:"#000"},{name:"Border Subtle",value:((D=(P=n.semantic)==null?void 0:P["primary-border-subtle"])==null?void 0:D.value)||"#9ec5fe",cssVar:"--dsai-semantic-primary-border-subtle",token:"semantic.primary-border-subtle",description:"Primary subtle border",textColor:"#000"}]},{category:"Success Variants",colors:[{name:"Text Emphasis",value:((G=(I=n.semantic)==null?void 0:I["success-text-emphasis"])==null?void 0:G.value)||"#0a3622",cssVar:"--dsai-semantic-success-text-emphasis",token:"semantic.success-text-emphasis",description:"Success text emphasis",textColor:"#fff"},{name:"BG Subtle",value:((U=(E=n.semantic)==null?void 0:E["success-bg-subtle"])==null?void 0:U.value)||"#d1e7dd",cssVar:"--dsai-semantic-success-bg-subtle",token:"semantic.success-bg-subtle",description:"Success subtle background",textColor:"#000"},{name:"Border Subtle",value:((t=(A=n.semantic)==null?void 0:A["success-border-subtle"])==null?void 0:t.value)||"#a3cfbb",cssVar:"--dsai-semantic-success-border-subtle",token:"semantic.success-border-subtle",description:"Success subtle border",textColor:"#000"}]},{category:"Danger Variants",colors:[{name:"Text Emphasis",value:((J=(q=n.semantic)==null?void 0:q["danger-text-emphasis"])==null?void 0:J.value)||"#58151c",cssVar:"--dsai-semantic-danger-text-emphasis",token:"semantic.danger-text-emphasis",description:"Danger text emphasis",textColor:"#fff"},{name:"BG Subtle",value:((O=(_=n.semantic)==null?void 0:_["danger-bg-subtle"])==null?void 0:O.value)||"#f8d7da",cssVar:"--dsai-semantic-danger-bg-subtle",token:"semantic.danger-bg-subtle",description:"Danger subtle background",textColor:"#000"},{name:"Border Subtle",value:((Q=(K=n.semantic)==null?void 0:K["danger-border-subtle"])==null?void 0:Q.value)||"#f1aeb5",cssVar:"--dsai-semantic-danger-border-subtle",token:"semantic.danger-border-subtle",description:"Danger subtle border",textColor:"#000"}]},{category:"Warning Variants",colors:[{name:"Text Emphasis",value:((Y=(X=n.semantic)==null?void 0:X["warning-text-emphasis"])==null?void 0:Y.value)||"#664d03",cssVar:"--dsai-semantic-warning-text-emphasis",token:"semantic.warning-text-emphasis",description:"Warning text emphasis",textColor:"#fff"},{name:"BG Subtle",value:((ee=(Z=n.semantic)==null?void 0:Z["warning-bg-subtle"])==null?void 0:ee.value)||"#fff3cd",cssVar:"--dsai-semantic-warning-bg-subtle",token:"semantic.warning-bg-subtle",description:"Warning subtle background",textColor:"#000"},{name:"Border Subtle",value:((ae=(ne=n.semantic)==null?void 0:ne["warning-border-subtle"])==null?void 0:ae.value)||"#ffe69c",cssVar:"--dsai-semantic-warning-border-subtle",token:"semantic.warning-border-subtle",description:"Warning subtle border",textColor:"#000"}]},{category:"Info Variants",colors:[{name:"Text Emphasis",value:((re=(oe=n.semantic)==null?void 0:oe["info-text-emphasis"])==null?void 0:re.value)||"#055160",cssVar:"--dsai-semantic-info-text-emphasis",token:"semantic.info-text-emphasis",description:"Info text emphasis",textColor:"#fff"},{name:"BG Subtle",value:((te=(se=n.semantic)==null?void 0:se["info-bg-subtle"])==null?void 0:te.value)||"#cff4fc",cssVar:"--dsai-semantic-info-bg-subtle",token:"semantic.info-bg-subtle",description:"Info subtle background",textColor:"#000"},{name:"Border Subtle",value:((ce=(le=n.semantic)==null?void 0:le["info-border-subtle"])==null?void 0:ce.value)||"#9eeaf9",cssVar:"--dsai-semantic-info-border-subtle",token:"semantic.info-border-subtle",description:"Info subtle border",textColor:"#000"}]}];return e.jsxs("div",{children:[e.jsx("h2",{children:"Component Semantic Tokens"}),e.jsx("p",{children:"Bootstrap-compatible semantic tokens for body text, links, backgrounds, borders, and component variants. These 35 tokens provide consistent styling across all components."}),b.map(({category:ie,colors:Ne})=>e.jsxs("div",{style:{marginTop:"32px"},children:[e.jsx("h3",{style:{marginBottom:"16px",fontSize:"18px",fontWeight:600},children:ie}),e.jsx("div",{style:{display:"flex",gap:"16px",flexWrap:"wrap"},children:Ne.map($=>e.jsxs("div",{style:{minWidth:"180px"},children:[e.jsx(M,{name:$.name,value:$.value,cssVariable:$.cssVar,tokenPath:$.token,textColor:$.textColor}),e.jsx("p",{style:{fontSize:"12px",color:"#6b7280",marginTop:"8px"},children:$.description})]},$.name))})]},ie))]})}},H={render:()=>{var r,a,o,l,m,u,p,c,i,d,f,v,s,g,x,y,k,h,C,V,S,j,w,B,T,W,P,D,I,G,E,U,A;const b=[{name:"50",value:((o=(a=(r=n.color)==null?void 0:r.gray)==null?void 0:a[50])==null?void 0:o.value)||"#f9fafb",cssVar:"--dsai-color-gray-50",token:"color.gray.50"},{name:"100",value:((u=(m=(l=n.color)==null?void 0:l.gray)==null?void 0:m[100])==null?void 0:u.value)||"#f3f4f6",cssVar:"--dsai-color-gray-100",token:"color.gray.100"},{name:"200",value:((i=(c=(p=n.color)==null?void 0:p.gray)==null?void 0:c[200])==null?void 0:i.value)||"#e5e7eb",cssVar:"--dsai-color-gray-200",token:"color.gray.200"},{name:"300",value:((v=(f=(d=n.color)==null?void 0:d.gray)==null?void 0:f[300])==null?void 0:v.value)||"#d1d5db",cssVar:"--dsai-color-gray-300",token:"color.gray.300"},{name:"400",value:((x=(g=(s=n.color)==null?void 0:s.gray)==null?void 0:g[400])==null?void 0:x.value)||"#9ca3af",cssVar:"--dsai-color-gray-400",token:"color.gray.400"},{name:"500",value:((h=(k=(y=n.color)==null?void 0:y.gray)==null?void 0:k[500])==null?void 0:h.value)||"#6b7280",cssVar:"--dsai-color-gray-500",token:"color.gray.500"},{name:"600",value:((S=(V=(C=n.color)==null?void 0:C.gray)==null?void 0:V[600])==null?void 0:S.value)||"#4b5563",cssVar:"--dsai-color-gray-600",token:"color.gray.600"},{name:"700",value:((B=(w=(j=n.color)==null?void 0:j.gray)==null?void 0:w[700])==null?void 0:B.value)||"#374151",cssVar:"--dsai-color-gray-700",token:"color.gray.700"},{name:"800",value:((P=(W=(T=n.color)==null?void 0:T.gray)==null?void 0:W[800])==null?void 0:P.value)||"#1f2937",cssVar:"--dsai-color-gray-800",token:"color.gray.800"},{name:"900",value:((G=(I=(D=n.color)==null?void 0:D.gray)==null?void 0:I[900])==null?void 0:G.value)||"#111827",cssVar:"--dsai-color-gray-900",token:"color.gray.900"},{name:"950",value:((A=(U=(E=n.color)==null?void 0:E.gray)==null?void 0:U[950])==null?void 0:A.value)||"#030712",cssVar:"--dsai-color-gray-950",token:"color.gray.950"}];return e.jsxs("div",{children:[e.jsx("h2",{children:"Neutral Colors (Gray Scale)"}),e.jsx("p",{children:"Used for text, backgrounds, borders, and UI elements."}),e.jsx("div",{style:{display:"flex",gap:"16px",flexWrap:"wrap",marginTop:"24px"},children:b.map(t=>e.jsx(M,{name:t.name,value:t.value,cssVariable:t.cssVar,tokenPath:t.token,textColor:parseInt(t.name,10)>=500?"#fff":"#000"},t.name))})]})}},R={render:()=>{const b=["blue","cyan","gray","green","indigo","orange","pink","purple","red","teal","yellow"],r=["50","100","200","300","400","500","600","700","800","900","950"];return e.jsxs("div",{children:[e.jsx("h2",{children:"Complete Color Palette"}),e.jsx("p",{children:"All 11 hues × 11 steps = 121 primitive colors with CSS variables and token paths."}),e.jsx("div",{style:{marginTop:"24px",display:"flex",flexDirection:"column",gap:"32px"},children:b.map(a=>e.jsxs("div",{children:[e.jsx("h3",{style:{textTransform:"capitalize",marginBottom:"16px"},children:a}),e.jsx("div",{style:{display:"flex",gap:"12px",flexWrap:"wrap"},children:r.map(o=>{var c,i,d;const l=((d=(i=(c=n.color)==null?void 0:c[a])==null?void 0:i[o])==null?void 0:d.value)||"#cccccc",m=`--dsai-color-${a}-${o}`,u=`color.${a}.${o}`,p=parseInt(o,10);return e.jsx(M,{name:o,value:l,cssVariable:m,tokenPath:u,textColor:p>=500?"#fff":"#000"},`${a}-${o}`)})})]},a))})]})}},F={render:()=>e.jsxs("div",{style:{maxWidth:"800px"},children:[e.jsx("h2",{children:"Color Usage Guidelines"}),e.jsx("h3",{children:"CSS Variables"}),e.jsx("pre",{style:{backgroundColor:"#f3f4f6",padding:"16px",borderRadius:"8px",overflow:"auto"},children:`.my-button {
  background-color: var(--dsai-theme-primary);
  color: var(--dsai-neutral-white);
  border: 1px solid var(--dsai-color-blue-600);
}`}),e.jsx("h3",{children:"JavaScript/TypeScript"}),e.jsx("pre",{style:{backgroundColor:"#f3f4f6",padding:"16px",borderRadius:"8px",overflow:"auto"},children:`import tokens from '@dsai/tokens';

const styles = {
  backgroundColor: tokens.theme.primary,
  color: tokens.neutral.white,
  border: \`1px solid \${tokens.color.blue['600']}\`,
};`}),e.jsx("h3",{children:"Accessibility"}),e.jsxs("ul",{children:[e.jsx("li",{children:"All color combinations meet WCAG 2.1 AA contrast requirements (4.5:1 for text, 3:1 for UI)"}),e.jsx("li",{children:"Use semantic colors for consistent meaning across the application"}),e.jsx("li",{children:"Don't rely on color alone to convey information"}),e.jsx("li",{children:"Test with color blindness simulators"})]}),e.jsx("h3",{children:"Best Practices"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Use semantic colors first:"})," theme.primary instead of color.blue.500"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Maintain contrast:"})," Ensure text is readable on all backgrounds"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Be consistent:"})," Use the same color for the same purpose"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Consider dark mode:"})," Semantic tokens adapt automatically"]})]})]})};var de,me,ue,pe,be;z.parameters={...z.parameters,docs:{...(de=z.parameters)==null?void 0:de.docs,source:{originalSource:`{
  render: () => {
    const brandColors = [{
      name: '50',
      value: tokens.color?.['blue']?.[50]?.value || '#eff6ff',
      cssVar: '--dsai-color-blue-50',
      token: 'color.blue.50'
    }, {
      name: '100',
      value: tokens.color?.['blue']?.[100]?.value || '#dbeafe',
      cssVar: '--dsai-color-blue-100',
      token: 'color.blue.100'
    }, {
      name: '200',
      value: tokens.color?.['blue']?.[200]?.value || '#bfdbfe',
      cssVar: '--dsai-color-blue-200',
      token: 'color.blue.200'
    }, {
      name: '300',
      value: tokens.color?.['blue']?.[300]?.value || '#93c5fd',
      cssVar: '--dsai-color-blue-300',
      token: 'color.blue.300'
    }, {
      name: '400',
      value: tokens.color?.['blue']?.[400]?.value || '#60a5fa',
      cssVar: '--dsai-color-blue-400',
      token: 'color.blue.400'
    }, {
      name: '500',
      value: tokens.color?.['blue']?.[500]?.value || '#3b82f6',
      cssVar: '--dsai-color-blue-500',
      token: 'color.blue.500'
    }, {
      name: '600',
      value: tokens.color?.['blue']?.[600]?.value || '#2563eb',
      cssVar: '--dsai-color-blue-600',
      token: 'color.blue.600'
    }, {
      name: '700',
      value: tokens.color?.['blue']?.[700]?.value || '#1d4ed8',
      cssVar: '--dsai-color-blue-700',
      token: 'color.blue.700'
    }, {
      name: '800',
      value: tokens.color?.['blue']?.[800]?.value || '#1e40af',
      cssVar: '--dsai-color-blue-800',
      token: 'color.blue.800'
    }, {
      name: '900',
      value: tokens.color?.['blue']?.[900]?.value || '#1e3a8a',
      cssVar: '--dsai-color-blue-900',
      token: 'color.blue.900'
    }, {
      name: '950',
      value: tokens.color?.['blue']?.[950]?.value || '#172554',
      cssVar: '--dsai-color-blue-950',
      token: 'color.blue.950'
    }];
    return <div>
        <h2>Brand Colors (Blue Scale)</h2>
        <p>Primary brand color scale used for buttons, links, and interactive elements.</p>
        <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        marginTop: '24px'
      }}>
          {brandColors.map(color => <ColorSwatch key={color.name} name={color.name} value={color.value} cssVariable={color.cssVar} tokenPath={color.token} textColor={parseInt(color.name, 10) >= 500 ? '#fff' : '#000'} />)}
        </div>
      </div>;
  }
}`,...(ue=(me=z.parameters)==null?void 0:me.docs)==null?void 0:ue.source},description:{story:"Brand Colors - Primary teal colors for main interactive elements",...(be=(pe=z.parameters)==null?void 0:pe.docs)==null?void 0:be.description}}};var fe,ve,ge,xe,ye;L.parameters={...L.parameters,docs:{...(fe=L.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  render: () => {
    const semanticColors = [{
      name: 'Primary',
      value: tokens.theme?.['primary']?.value || '#0ea5e9',
      cssVar: '--dsai-theme-primary',
      token: 'theme.primary',
      description: 'Main brand color',
      textColor: '#fff'
    }, {
      name: 'Secondary',
      value: tokens.theme?.['secondary']?.value || '#64748b',
      cssVar: '--dsai-theme-secondary',
      token: 'theme.secondary',
      description: 'Secondary actions',
      textColor: '#111'
    }, {
      name: 'Success',
      value: tokens.theme?.['success']?.value || '#10b981',
      cssVar: '--dsai-theme-success',
      token: 'theme.success',
      description: 'Success states',
      textColor: '#fff'
    }, {
      name: 'Danger',
      value: tokens.theme?.['danger']?.value || '#ef4444',
      cssVar: '--dsai-theme-danger',
      token: 'theme.danger',
      description: 'Error states',
      textColor: '#fff'
    }, {
      name: 'Warning',
      value: tokens.theme?.['warning']?.value || '#f59e0b',
      cssVar: '--dsai-theme-warning',
      token: 'theme.warning',
      description: 'Warning states',
      textColor: '#000'
    }, {
      name: 'Info',
      value: tokens.theme?.['info']?.value || '#0ea5e9',
      cssVar: '--dsai-theme-info',
      token: 'theme.info',
      description: 'Informational',
      textColor: '#fff'
    }];
    return <div>
        <h2>Semantic Colors</h2>
        <p>Contextual colors used for feedback, states, and semantic meaning.</p>
        <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        marginTop: '24px'
      }}>
          {semanticColors.map(color => <div key={color.name} style={{
          minWidth: '180px'
        }}>
              <ColorSwatch name={color.name} value={color.value} cssVariable={color.cssVar} tokenPath={color.token} textColor={color.textColor} />
              <p style={{
            fontSize: '12px',
            color: '#6b7280',
            marginTop: '8px'
          }}>
                {color.description}
              </p>
            </div>)}
        </div>
      </div>;
  }
}`,...(ge=(ve=L.parameters)==null?void 0:ve.docs)==null?void 0:ge.source},description:{story:"Semantic Colors - Contextual colors with meaning",...(ye=(xe=L.parameters)==null?void 0:xe.docs)==null?void 0:ye.description}}};var ke,he,Ce,Ve,Se;N.parameters={...N.parameters,docs:{...(ke=N.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  render: () => {
    const componentSemanticColors = [{
      category: 'Body & Text',
      colors: [{
        name: 'Body Text',
        value: tokens.semantic?.['body-color']?.value || '#212529',
        cssVar: '--dsai-semantic-body-color',
        token: 'semantic.body-color',
        description: 'Default body text color',
        textColor: '#fff'
      }, {
        name: 'Body Background',
        value: tokens.semantic?.['body-bg']?.value || '#ffffff',
        cssVar: '--dsai-semantic-body-bg',
        token: 'semantic.body-bg',
        description: 'Default body background',
        textColor: '#000'
      }, {
        name: 'Emphasis',
        value: tokens.semantic?.['emphasis-color']?.value || '#000000',
        cssVar: '--dsai-semantic-emphasis-color',
        token: 'semantic.emphasis-color',
        description: 'High contrast text',
        textColor: '#fff'
      }, {
        name: 'Secondary Text',
        value: tokens.semantic?.['secondary-color']?.value || '#6c757d',
        cssVar: '--dsai-semantic-secondary-color',
        token: 'semantic.secondary-color',
        description: 'Lighter text',
        textColor: '#111'
      }, {
        name: 'Tertiary Text',
        value: tokens.semantic?.['tertiary-color']?.value || '#a8adb7',
        cssVar: '--dsai-semantic-tertiary-color',
        token: 'semantic.tertiary-color',
        description: 'Lightest text',
        textColor: '#000'
      }]
    }, {
      category: 'Links',
      colors: [{
        name: 'Link Default',
        value: tokens.semantic?.['link-color']?.value || '#0d6efd',
        cssVar: '--dsai-semantic-link-color',
        token: 'semantic.link-color',
        description: 'Default link color',
        textColor: '#fff'
      }, {
        name: 'Link Hover',
        value: tokens.semantic?.['link-hover-color']?.value || '#0a58ca',
        cssVar: '--dsai-semantic-link-hover-color',
        token: 'semantic.link-hover-color',
        description: 'Link hover state',
        textColor: '#fff'
      }]
    }, {
      category: 'Backgrounds',
      colors: [{
        name: 'Secondary BG',
        value: tokens.semantic?.['secondary-bg']?.value || '#e9ecef',
        cssVar: '--dsai-semantic-secondary-bg',
        token: 'semantic.secondary-bg',
        description: 'Secondary surface',
        textColor: '#000'
      }, {
        name: 'Tertiary BG',
        value: tokens.semantic?.['tertiary-bg']?.value || '#f8f9fa',
        cssVar: '--dsai-semantic-tertiary-bg',
        token: 'semantic.tertiary-bg',
        description: 'Tertiary surface',
        textColor: '#000'
      }]
    }, {
      category: 'Borders',
      colors: [{
        name: 'Border',
        value: tokens.semantic?.['border-color']?.value || '#dee2e6',
        cssVar: '--dsai-semantic-border-color',
        token: 'semantic.border-color',
        description: 'Default borders',
        textColor: '#000'
      }, {
        name: 'Border Translucent',
        value: tokens.semantic?.['border-color-translucent']?.value || 'rgba(0,0,0,0.175)',
        cssVar: '--dsai-semantic-border-color-translucent',
        token: 'semantic.border-color-translucent',
        description: 'Translucent borders',
        textColor: '#fff'
      }]
    }, {
      category: 'Primary Variants',
      colors: [{
        name: 'Text Emphasis',
        value: tokens.semantic?.['primary-text-emphasis']?.value || '#052c65',
        cssVar: '--dsai-semantic-primary-text-emphasis',
        token: 'semantic.primary-text-emphasis',
        description: 'Primary text emphasis',
        textColor: '#fff'
      }, {
        name: 'BG Subtle',
        value: tokens.semantic?.['primary-bg-subtle']?.value || '#cfe2ff',
        cssVar: '--dsai-semantic-primary-bg-subtle',
        token: 'semantic.primary-bg-subtle',
        description: 'Primary subtle background',
        textColor: '#000'
      }, {
        name: 'Border Subtle',
        value: tokens.semantic?.['primary-border-subtle']?.value || '#9ec5fe',
        cssVar: '--dsai-semantic-primary-border-subtle',
        token: 'semantic.primary-border-subtle',
        description: 'Primary subtle border',
        textColor: '#000'
      }]
    }, {
      category: 'Success Variants',
      colors: [{
        name: 'Text Emphasis',
        value: tokens.semantic?.['success-text-emphasis']?.value || '#0a3622',
        cssVar: '--dsai-semantic-success-text-emphasis',
        token: 'semantic.success-text-emphasis',
        description: 'Success text emphasis',
        textColor: '#fff'
      }, {
        name: 'BG Subtle',
        value: tokens.semantic?.['success-bg-subtle']?.value || '#d1e7dd',
        cssVar: '--dsai-semantic-success-bg-subtle',
        token: 'semantic.success-bg-subtle',
        description: 'Success subtle background',
        textColor: '#000'
      }, {
        name: 'Border Subtle',
        value: tokens.semantic?.['success-border-subtle']?.value || '#a3cfbb',
        cssVar: '--dsai-semantic-success-border-subtle',
        token: 'semantic.success-border-subtle',
        description: 'Success subtle border',
        textColor: '#000'
      }]
    }, {
      category: 'Danger Variants',
      colors: [{
        name: 'Text Emphasis',
        value: tokens.semantic?.['danger-text-emphasis']?.value || '#58151c',
        cssVar: '--dsai-semantic-danger-text-emphasis',
        token: 'semantic.danger-text-emphasis',
        description: 'Danger text emphasis',
        textColor: '#fff'
      }, {
        name: 'BG Subtle',
        value: tokens.semantic?.['danger-bg-subtle']?.value || '#f8d7da',
        cssVar: '--dsai-semantic-danger-bg-subtle',
        token: 'semantic.danger-bg-subtle',
        description: 'Danger subtle background',
        textColor: '#000'
      }, {
        name: 'Border Subtle',
        value: tokens.semantic?.['danger-border-subtle']?.value || '#f1aeb5',
        cssVar: '--dsai-semantic-danger-border-subtle',
        token: 'semantic.danger-border-subtle',
        description: 'Danger subtle border',
        textColor: '#000'
      }]
    }, {
      category: 'Warning Variants',
      colors: [{
        name: 'Text Emphasis',
        value: tokens.semantic?.['warning-text-emphasis']?.value || '#664d03',
        cssVar: '--dsai-semantic-warning-text-emphasis',
        token: 'semantic.warning-text-emphasis',
        description: 'Warning text emphasis',
        textColor: '#fff'
      }, {
        name: 'BG Subtle',
        value: tokens.semantic?.['warning-bg-subtle']?.value || '#fff3cd',
        cssVar: '--dsai-semantic-warning-bg-subtle',
        token: 'semantic.warning-bg-subtle',
        description: 'Warning subtle background',
        textColor: '#000'
      }, {
        name: 'Border Subtle',
        value: tokens.semantic?.['warning-border-subtle']?.value || '#ffe69c',
        cssVar: '--dsai-semantic-warning-border-subtle',
        token: 'semantic.warning-border-subtle',
        description: 'Warning subtle border',
        textColor: '#000'
      }]
    }, {
      category: 'Info Variants',
      colors: [{
        name: 'Text Emphasis',
        value: tokens.semantic?.['info-text-emphasis']?.value || '#055160',
        cssVar: '--dsai-semantic-info-text-emphasis',
        token: 'semantic.info-text-emphasis',
        description: 'Info text emphasis',
        textColor: '#fff'
      }, {
        name: 'BG Subtle',
        value: tokens.semantic?.['info-bg-subtle']?.value || '#cff4fc',
        cssVar: '--dsai-semantic-info-bg-subtle',
        token: 'semantic.info-bg-subtle',
        description: 'Info subtle background',
        textColor: '#000'
      }, {
        name: 'Border Subtle',
        value: tokens.semantic?.['info-border-subtle']?.value || '#9eeaf9',
        cssVar: '--dsai-semantic-info-border-subtle',
        token: 'semantic.info-border-subtle',
        description: 'Info subtle border',
        textColor: '#000'
      }]
    }];
    return <div>
        <h2>Component Semantic Tokens</h2>
        <p>
          Bootstrap-compatible semantic tokens for body text, links, backgrounds, borders, and
          component variants. These 35 tokens provide consistent styling across all components.
        </p>
        {componentSemanticColors.map(({
        category,
        colors
      }) => <div key={category} style={{
        marginTop: '32px'
      }}>
            <h3 style={{
          marginBottom: '16px',
          fontSize: '18px',
          fontWeight: 600
        }}>{category}</h3>
            <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
              {colors.map(color => <div key={color.name} style={{
            minWidth: '180px'
          }}>
                  <ColorSwatch name={color.name} value={color.value} cssVariable={color.cssVar} tokenPath={color.token} textColor={color.textColor} />
                  <p style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '8px'
            }}>
                    {color.description}
                  </p>
                </div>)}
            </div>
          </div>)}
      </div>;
  }
}`,...(Ce=(he=N.parameters)==null?void 0:he.docs)==null?void 0:Ce.source},description:{story:"Component Semantic Colors - Bootstrap-compatible semantic tokens",...(Se=(Ve=N.parameters)==null?void 0:Ve.docs)==null?void 0:Se.description}}};var je,we,Be,Te,We;H.parameters={...H.parameters,docs:{...(je=H.parameters)==null?void 0:je.docs,source:{originalSource:`{
  render: () => {
    const neutralColors = [{
      name: '50',
      value: tokens.color?.['gray']?.[50]?.value || '#f9fafb',
      cssVar: '--dsai-color-gray-50',
      token: 'color.gray.50'
    }, {
      name: '100',
      value: tokens.color?.['gray']?.[100]?.value || '#f3f4f6',
      cssVar: '--dsai-color-gray-100',
      token: 'color.gray.100'
    }, {
      name: '200',
      value: tokens.color?.['gray']?.[200]?.value || '#e5e7eb',
      cssVar: '--dsai-color-gray-200',
      token: 'color.gray.200'
    }, {
      name: '300',
      value: tokens.color?.['gray']?.[300]?.value || '#d1d5db',
      cssVar: '--dsai-color-gray-300',
      token: 'color.gray.300'
    }, {
      name: '400',
      value: tokens.color?.['gray']?.[400]?.value || '#9ca3af',
      cssVar: '--dsai-color-gray-400',
      token: 'color.gray.400'
    }, {
      name: '500',
      value: tokens.color?.['gray']?.[500]?.value || '#6b7280',
      cssVar: '--dsai-color-gray-500',
      token: 'color.gray.500'
    }, {
      name: '600',
      value: tokens.color?.['gray']?.[600]?.value || '#4b5563',
      cssVar: '--dsai-color-gray-600',
      token: 'color.gray.600'
    }, {
      name: '700',
      value: tokens.color?.['gray']?.[700]?.value || '#374151',
      cssVar: '--dsai-color-gray-700',
      token: 'color.gray.700'
    }, {
      name: '800',
      value: tokens.color?.['gray']?.[800]?.value || '#1f2937',
      cssVar: '--dsai-color-gray-800',
      token: 'color.gray.800'
    }, {
      name: '900',
      value: tokens.color?.['gray']?.[900]?.value || '#111827',
      cssVar: '--dsai-color-gray-900',
      token: 'color.gray.900'
    }, {
      name: '950',
      value: tokens.color?.['gray']?.[950]?.value || '#030712',
      cssVar: '--dsai-color-gray-950',
      token: 'color.gray.950'
    }];
    return <div>
        <h2>Neutral Colors (Gray Scale)</h2>
        <p>Used for text, backgrounds, borders, and UI elements.</p>
        <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        marginTop: '24px'
      }}>
          {neutralColors.map(color => <ColorSwatch key={color.name} name={color.name} value={color.value} cssVariable={color.cssVar} tokenPath={color.token} textColor={parseInt(color.name, 10) >= 500 ? '#fff' : '#000'} />)}
        </div>
      </div>;
  }
}`,...(Be=(we=H.parameters)==null?void 0:we.docs)==null?void 0:Be.source},description:{story:"Neutral Colors - Gray scale for text, backgrounds, borders",...(We=(Te=H.parameters)==null?void 0:Te.docs)==null?void 0:We.description}}};var Pe,De,Ie,Ge,Ee;R.parameters={...R.parameters,docs:{...(Pe=R.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
  render: () => {
    const hues = ['blue', 'cyan', 'gray', 'green', 'indigo', 'orange', 'pink', 'purple', 'red', 'teal', 'yellow'];
    const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
    return <div>
        <h2>Complete Color Palette</h2>
        <p>All 11 hues × 11 steps = 121 primitive colors with CSS variables and token paths.</p>
        <div style={{
        marginTop: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
      }}>
          {hues.map(hue => <div key={hue}>
              <h3 style={{
            textTransform: 'capitalize',
            marginBottom: '16px'
          }}>{hue}</h3>
              <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
                {steps.map(step => {
              const value = tokens.color?.[hue]?.[step]?.value || '#cccccc';
              const cssVar = \`--dsai-color-\${hue}-\${step}\`;
              const tokenPath = \`color.\${hue}.\${step}\`;
              const stepNum = parseInt(step, 10);
              return <ColorSwatch key={\`\${hue}-\${step}\`} name={step} value={value} cssVariable={cssVar} tokenPath={tokenPath} textColor={stepNum >= 500 ? '#fff' : '#000'} />;
            })}
              </div>
            </div>)}
        </div>
      </div>;
  }
}`,...(Ie=(De=R.parameters)==null?void 0:De.docs)==null?void 0:Ie.source},description:{story:"All Color Hues - Complete color palette",...(Ee=(Ge=R.parameters)==null?void 0:Ge.docs)==null?void 0:Ee.description}}};var Ue,Ae,$e,ze,Le;F.parameters={...F.parameters,docs:{...(Ue=F.parameters)==null?void 0:Ue.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: '800px'
  }}>
      <h2>Color Usage Guidelines</h2>

      <h3>CSS Variables</h3>
      <pre style={{
      backgroundColor: '#f3f4f6',
      padding: '16px',
      borderRadius: '8px',
      overflow: 'auto'
    }}>
        {\`.my-button {
  background-color: var(--dsai-theme-primary);
  color: var(--dsai-neutral-white);
  border: 1px solid var(--dsai-color-blue-600);
}\`}
      </pre>

      <h3>JavaScript/TypeScript</h3>
      <pre style={{
      backgroundColor: '#f3f4f6',
      padding: '16px',
      borderRadius: '8px',
      overflow: 'auto'
    }}>
        {\`import tokens from '@dsai/tokens';

const styles = {
  backgroundColor: tokens.theme.primary,
  color: tokens.neutral.white,
  border: \\\`1px solid \\\${tokens.color.blue['600']}\\\`,
};\`}
      </pre>

      <h3>Accessibility</h3>
      <ul>
        <li>
          All color combinations meet WCAG 2.1 AA contrast requirements (4.5:1 for text, 3:1 for UI)
        </li>
        <li>Use semantic colors for consistent meaning across the application</li>
        <li>Don't rely on color alone to convey information</li>
        <li>Test with color blindness simulators</li>
      </ul>

      <h3>Best Practices</h3>
      <ul>
        <li>
          <strong>Use semantic colors first:</strong> theme.primary instead of color.blue.500
        </li>
        <li>
          <strong>Maintain contrast:</strong> Ensure text is readable on all backgrounds
        </li>
        <li>
          <strong>Be consistent:</strong> Use the same color for the same purpose
        </li>
        <li>
          <strong>Consider dark mode:</strong> Semantic tokens adapt automatically
        </li>
      </ul>
    </div>
}`,...($e=(Ae=F.parameters)==null?void 0:Ae.docs)==null?void 0:$e.source},description:{story:"Usage Guidelines",...(Le=(ze=F.parameters)==null?void 0:ze.docs)==null?void 0:Le.description}}};const qe=["BrandColors","SemanticColors","ComponentSemanticColors","NeutralColors","AllColorHues","Usage"];export{R as AllColorHues,z as BrandColors,N as ComponentSemanticColors,H as NeutralColors,L as SemanticColors,F as Usage,qe as __namedExportsOrder,Me as default};
