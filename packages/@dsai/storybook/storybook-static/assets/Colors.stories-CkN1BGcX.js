import { j as e } from "./jsx-runtime-D_zvdyIk.js";
import { t as o } from "./tokens-grouped-BsvYVlf2.js";
const ve={title:"Foundation/Colors",parameters:{docs:{description:{component:"DSAi color system with 121 primitive colors (11 hues × 11 steps) and 88 semantic colors for consistent theming."}}}},M=({name:v,value:a,cssVariable:n,tokenPath:r,textColor:t="#000"})=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"stretch",gap:"8px",minWidth:"160px",flex:"0 0 auto"},children:[e.jsx("div",{style:{width:"100%",height:"80px",backgroundColor:a,borderRadius:"8px",border:"1px solid #e5e7eb",boxShadow:"0 1px 3px rgba(0, 0, 0, 0.1)",display:"flex",alignItems:"center",justifyContent:"center",color:t,fontWeight:600,fontSize:"14px"},children:v}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("div",{style:{fontSize:"11px",color:"#111827",fontFamily:"monospace",fontWeight:600},children:a}),n&&e.jsx("div",{style:{fontSize:"10px",color:"#6b7280",fontFamily:"monospace",wordBreak:"break-all"},children:n}),r&&e.jsx("div",{style:{fontSize:"10px",color:"#9ca3af",fontFamily:"monospace",fontStyle:"italic",wordBreak:"break-all"},children:r})]})]}),h={render:()=>{var a,n,r,t,u,m,p,c,i,d,f,y,s,C,V,j,S,w,W,P,T,U,A,I,B,$,z,D,G,N,E,R,_;const v=[{name:"50",value:((r=(n=(a=o.color)==null?void 0:a.blue)==null?void 0:n["50"])==null?void 0:r.value)||"#eff6ff",cssVar:"--dsai-color-blue-50",token:"color.blue.50"},{name:"100",value:((m=(u=(t=o.color)==null?void 0:t.blue)==null?void 0:u["100"])==null?void 0:m.value)||"#dbeafe",cssVar:"--dsai-color-blue-100",token:"color.blue.100"},{name:"200",value:((i=(c=(p=o.color)==null?void 0:p.blue)==null?void 0:c["200"])==null?void 0:i.value)||"#bfdbfe",cssVar:"--dsai-color-blue-200",token:"color.blue.200"},{name:"300",value:((y=(f=(d=o.color)==null?void 0:d.blue)==null?void 0:f["300"])==null?void 0:y.value)||"#93c5fd",cssVar:"--dsai-color-blue-300",token:"color.blue.300"},{name:"400",value:((V=(C=(s=o.color)==null?void 0:s.blue)==null?void 0:C["400"])==null?void 0:V.value)||"#60a5fa",cssVar:"--dsai-color-blue-400",token:"color.blue.400"},{name:"500",value:((w=(S=(j=o.color)==null?void 0:j.blue)==null?void 0:S["500"])==null?void 0:w.value)||"#3b82f6",cssVar:"--dsai-color-blue-500",token:"color.blue.500"},{name:"600",value:((T=(P=(W=o.color)==null?void 0:W.blue)==null?void 0:P["600"])==null?void 0:T.value)||"#2563eb",cssVar:"--dsai-color-blue-600",token:"color.blue.600"},{name:"700",value:((I=(A=(U=o.color)==null?void 0:U.blue)==null?void 0:A["700"])==null?void 0:I.value)||"#1d4ed8",cssVar:"--dsai-color-blue-700",token:"color.blue.700"},{name:"800",value:((z=($=(B=o.color)==null?void 0:B.blue)==null?void 0:$["800"])==null?void 0:z.value)||"#1e40af",cssVar:"--dsai-color-blue-800",token:"color.blue.800"},{name:"900",value:((N=(G=(D=o.color)==null?void 0:D.blue)==null?void 0:G["900"])==null?void 0:N.value)||"#1e3a8a",cssVar:"--dsai-color-blue-900",token:"color.blue.900"},{name:"950",value:((_=(R=(E=o.color)==null?void 0:E.blue)==null?void 0:R["950"])==null?void 0:_.value)||"#172554",cssVar:"--dsai-color-blue-950",token:"color.blue.950"}];return e.jsxs("div",{children:[e.jsx("h2",{children:"Brand Colors (Blue Scale)"}),e.jsx("p",{children:"Primary brand color scale used for buttons, links, and interactive elements."}),e.jsx("div",{style:{display:"flex",gap:"16px",flexWrap:"wrap",marginTop:"24px"},children:v.map(l=>e.jsx(M,{name:l.name,value:l.value,cssVariable:l.cssVar,tokenPath:l.token,textColor:parseInt(l.name)>=500?"#fff":"#000"},l.name))})]})}},x={render:()=>{var a,n,r,t,u,m,p,c,i,d,f,y;const v=[{name:"Primary",value:((n=(a=o.theme)==null?void 0:a.primary)==null?void 0:n.value)||"#0ea5e9",cssVar:"--dsai-theme-primary",token:"theme.primary",description:"Main brand color",textColor:"#fff"},{name:"Secondary",value:((t=(r=o.theme)==null?void 0:r.secondary)==null?void 0:t.value)||"#64748b",cssVar:"--dsai-theme-secondary",token:"theme.secondary",description:"Secondary actions",textColor:"#fff"},{name:"Success",value:((m=(u=o.theme)==null?void 0:u.success)==null?void 0:m.value)||"#10b981",cssVar:"--dsai-theme-success",token:"theme.success",description:"Success states",textColor:"#fff"},{name:"Danger",value:((c=(p=o.theme)==null?void 0:p.danger)==null?void 0:c.value)||"#ef4444",cssVar:"--dsai-theme-danger",token:"theme.danger",description:"Error states",textColor:"#fff"},{name:"Warning",value:((d=(i=o.theme)==null?void 0:i.warning)==null?void 0:d.value)||"#f59e0b",cssVar:"--dsai-theme-warning",token:"theme.warning",description:"Warning states",textColor:"#000"},{name:"Info",value:((y=(f=o.theme)==null?void 0:f.info)==null?void 0:y.value)||"#0ea5e9",cssVar:"--dsai-theme-info",token:"theme.info",description:"Informational",textColor:"#fff"}];return e.jsxs("div",{children:[e.jsx("h2",{children:"Semantic Colors"}),e.jsx("p",{children:"Contextual colors used for feedback, states, and semantic meaning."}),e.jsx("div",{style:{display:"flex",gap:"16px",flexWrap:"wrap",marginTop:"24px"},children:v.map(s=>e.jsxs("div",{style:{minWidth:"180px"},children:[e.jsx(M,{name:s.name,value:s.value,cssVariable:s.cssVar,tokenPath:s.token,textColor:s.textColor}),e.jsx("p",{style:{fontSize:"12px",color:"#6b7280",marginTop:"8px"},children:s.description})]},s.name))})]})}},b={render:()=>{var a,n,r,t,u,m,p,c,i,d,f,y,s,C,V,j,S,w,W,P,T,U,A,I,B,$,z,D,G,N,E,R,_;const v=[{name:"50",value:((r=(n=(a=o.color)==null?void 0:a.gray)==null?void 0:n["50"])==null?void 0:r.value)||"#f9fafb",cssVar:"--dsai-color-gray-50",token:"color.gray.50"},{name:"100",value:((m=(u=(t=o.color)==null?void 0:t.gray)==null?void 0:u["100"])==null?void 0:m.value)||"#f3f4f6",cssVar:"--dsai-color-gray-100",token:"color.gray.100"},{name:"200",value:((i=(c=(p=o.color)==null?void 0:p.gray)==null?void 0:c["200"])==null?void 0:i.value)||"#e5e7eb",cssVar:"--dsai-color-gray-200",token:"color.gray.200"},{name:"300",value:((y=(f=(d=o.color)==null?void 0:d.gray)==null?void 0:f["300"])==null?void 0:y.value)||"#d1d5db",cssVar:"--dsai-color-gray-300",token:"color.gray.300"},{name:"400",value:((V=(C=(s=o.color)==null?void 0:s.gray)==null?void 0:C["400"])==null?void 0:V.value)||"#9ca3af",cssVar:"--dsai-color-gray-400",token:"color.gray.400"},{name:"500",value:((w=(S=(j=o.color)==null?void 0:j.gray)==null?void 0:S["500"])==null?void 0:w.value)||"#6b7280",cssVar:"--dsai-color-gray-500",token:"color.gray.500"},{name:"600",value:((T=(P=(W=o.color)==null?void 0:W.gray)==null?void 0:P["600"])==null?void 0:T.value)||"#4b5563",cssVar:"--dsai-color-gray-600",token:"color.gray.600"},{name:"700",value:((I=(A=(U=o.color)==null?void 0:U.gray)==null?void 0:A["700"])==null?void 0:I.value)||"#374151",cssVar:"--dsai-color-gray-700",token:"color.gray.700"},{name:"800",value:((z=($=(B=o.color)==null?void 0:B.gray)==null?void 0:$["800"])==null?void 0:z.value)||"#1f2937",cssVar:"--dsai-color-gray-800",token:"color.gray.800"},{name:"900",value:((N=(G=(D=o.color)==null?void 0:D.gray)==null?void 0:G["900"])==null?void 0:N.value)||"#111827",cssVar:"--dsai-color-gray-900",token:"color.gray.900"},{name:"950",value:((_=(R=(E=o.color)==null?void 0:E.gray)==null?void 0:R["950"])==null?void 0:_.value)||"#030712",cssVar:"--dsai-color-gray-950",token:"color.gray.950"}];return e.jsxs("div",{children:[e.jsx("h2",{children:"Neutral Colors (Gray Scale)"}),e.jsx("p",{children:"Used for text, backgrounds, borders, and UI elements."}),e.jsx("div",{style:{display:"flex",gap:"16px",flexWrap:"wrap",marginTop:"24px"},children:v.map(l=>e.jsx(M,{name:l.name,value:l.value,cssVariable:l.cssVar,tokenPath:l.token,textColor:parseInt(l.name)>=500?"#fff":"#000"},l.name))})]})}},g={render:()=>{const v=["blue","cyan","gray","green","indigo","orange","pink","purple","red","teal","yellow"],a=["50","100","200","300","400","500","600","700","800","900","950"];return e.jsxs("div",{children:[e.jsx("h2",{children:"Complete Color Palette"}),e.jsx("p",{children:"All 11 hues × 11 steps = 121 primitive colors with CSS variables and token paths."}),e.jsx("div",{style:{marginTop:"24px",display:"flex",flexDirection:"column",gap:"32px"},children:v.map(n=>e.jsxs("div",{children:[e.jsx("h3",{style:{textTransform:"capitalize",marginBottom:"16px"},children:n}),e.jsx("div",{style:{display:"flex",gap:"12px",flexWrap:"wrap"},children:a.map(r=>{var c,i,d;const t=((d=(i=(c=o.color)==null?void 0:c[n])==null?void 0:i[r])==null?void 0:d.value)||"#cccccc",u=`--dsai-color-${n}-${r}`,m=`color.${n}.${r}`,p=parseInt(r);return e.jsx(M,{name:r,value:t,cssVariable:u,tokenPath:m,textColor:p>=500?"#fff":"#000"},`${n}-${r}`)})})]},n))})]})}},k={render:()=>e.jsxs("div",{style:{maxWidth:"800px"},children:[e.jsx("h2",{children:"Color Usage Guidelines"}),e.jsx("h3",{children:"CSS Variables"}),e.jsx("pre",{style:{backgroundColor:"#f3f4f6",padding:"16px",borderRadius:"8px",overflow:"auto"},children:`.my-button {
  background-color: var(--dsai-theme-primary);
  color: var(--dsai-neutral-white);
  border: 1px solid var(--dsai-color-blue-600);
}`}),e.jsx("h3",{children:"JavaScript/TypeScript"}),e.jsx("pre",{style:{backgroundColor:"#f3f4f6",padding:"16px",borderRadius:"8px",overflow:"auto"},children:`import tokens from '@dsai/tokens';

const styles = {
  backgroundColor: tokens.theme.primary,
  color: tokens.neutral.white,
  border: \`1px solid \${tokens.color.blue['600']}\`,
};`}),e.jsx("h3",{children:"Accessibility"}),e.jsxs("ul",{children:[e.jsx("li",{children:"All color combinations meet WCAG 2.1 AA contrast requirements (4.5:1 for text, 3:1 for UI)"}),e.jsx("li",{children:"Use semantic colors for consistent meaning across the application"}),e.jsx("li",{children:"Don't rely on color alone to convey information"}),e.jsx("li",{children:"Test with color blindness simulators"})]}),e.jsx("h3",{children:"Best Practices"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Use semantic colors first:"})," theme.primary instead of color.blue.500"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Maintain contrast:"})," Ensure text is readable on all backgrounds"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Be consistent:"})," Use the same color for the same purpose"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Consider dark mode:"})," Semantic tokens adapt automatically"]})]})]})};var F,H,O,q,J;h.parameters={...h.parameters,docs:{...(F=h.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => {
    const brandColors = [{
      name: '50',
      value: tokens.color?.blue?.['50']?.value || '#eff6ff',
      cssVar: '--dsai-color-blue-50',
      token: 'color.blue.50'
    }, {
      name: '100',
      value: tokens.color?.blue?.['100']?.value || '#dbeafe',
      cssVar: '--dsai-color-blue-100',
      token: 'color.blue.100'
    }, {
      name: '200',
      value: tokens.color?.blue?.['200']?.value || '#bfdbfe',
      cssVar: '--dsai-color-blue-200',
      token: 'color.blue.200'
    }, {
      name: '300',
      value: tokens.color?.blue?.['300']?.value || '#93c5fd',
      cssVar: '--dsai-color-blue-300',
      token: 'color.blue.300'
    }, {
      name: '400',
      value: tokens.color?.blue?.['400']?.value || '#60a5fa',
      cssVar: '--dsai-color-blue-400',
      token: 'color.blue.400'
    }, {
      name: '500',
      value: tokens.color?.blue?.['500']?.value || '#3b82f6',
      cssVar: '--dsai-color-blue-500',
      token: 'color.blue.500'
    }, {
      name: '600',
      value: tokens.color?.blue?.['600']?.value || '#2563eb',
      cssVar: '--dsai-color-blue-600',
      token: 'color.blue.600'
    }, {
      name: '700',
      value: tokens.color?.blue?.['700']?.value || '#1d4ed8',
      cssVar: '--dsai-color-blue-700',
      token: 'color.blue.700'
    }, {
      name: '800',
      value: tokens.color?.blue?.['800']?.value || '#1e40af',
      cssVar: '--dsai-color-blue-800',
      token: 'color.blue.800'
    }, {
      name: '900',
      value: tokens.color?.blue?.['900']?.value || '#1e3a8a',
      cssVar: '--dsai-color-blue-900',
      token: 'color.blue.900'
    }, {
      name: '950',
      value: tokens.color?.blue?.['950']?.value || '#172554',
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
          {brandColors.map(color => <ColorSwatch key={color.name} name={color.name} value={color.value} cssVariable={color.cssVar} tokenPath={color.token} textColor={parseInt(color.name) >= 500 ? '#fff' : '#000'} />)}
        </div>
      </div>;
  }
}`,...(O=(H=h.parameters)==null?void 0:H.docs)==null?void 0:O.source},description:{story:"Brand Colors - Primary teal colors for main interactive elements",...(J=(q=h.parameters)==null?void 0:q.docs)==null?void 0:J.description}}};var K,L,Q,X,Y;x.parameters={...x.parameters,docs:{...(K=x.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: () => {
    const semanticColors = [{
      name: 'Primary',
      value: tokens.theme?.primary?.value || '#0ea5e9',
      cssVar: '--dsai-theme-primary',
      token: 'theme.primary',
      description: 'Main brand color',
      textColor: '#fff'
    }, {
      name: 'Secondary',
      value: tokens.theme?.secondary?.value || '#64748b',
      cssVar: '--dsai-theme-secondary',
      token: 'theme.secondary',
      description: 'Secondary actions',
      textColor: '#111'
    }, {
      name: 'Success',
      value: tokens.theme?.success?.value || '#10b981',
      cssVar: '--dsai-theme-success',
      token: 'theme.success',
      description: 'Success states',
      textColor: '#fff'
    }, {
      name: 'Danger',
      value: tokens.theme?.danger?.value || '#ef4444',
      cssVar: '--dsai-theme-danger',
      token: 'theme.danger',
      description: 'Error states',
      textColor: '#fff'
    }, {
      name: 'Warning',
      value: tokens.theme?.warning?.value || '#f59e0b',
      cssVar: '--dsai-theme-warning',
      token: 'theme.warning',
      description: 'Warning states',
      textColor: '#000'
    }, {
      name: 'Info',
      value: tokens.theme?.info?.value || '#0ea5e9',
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
}`,...(Q=(L=x.parameters)==null?void 0:L.docs)==null?void 0:Q.source},description:{story:"Semantic Colors - Contextual colors with meaning",...(Y=(X=x.parameters)==null?void 0:X.docs)==null?void 0:Y.description}}};var Z,ee,oe,ne,re;b.parameters={...b.parameters,docs:{...(Z=b.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: () => {
    const neutralColors = [{
      name: '50',
      value: tokens.color?.gray?.['50']?.value || '#f9fafb',
      cssVar: '--dsai-color-gray-50',
      token: 'color.gray.50'
    }, {
      name: '100',
      value: tokens.color?.gray?.['100']?.value || '#f3f4f6',
      cssVar: '--dsai-color-gray-100',
      token: 'color.gray.100'
    }, {
      name: '200',
      value: tokens.color?.gray?.['200']?.value || '#e5e7eb',
      cssVar: '--dsai-color-gray-200',
      token: 'color.gray.200'
    }, {
      name: '300',
      value: tokens.color?.gray?.['300']?.value || '#d1d5db',
      cssVar: '--dsai-color-gray-300',
      token: 'color.gray.300'
    }, {
      name: '400',
      value: tokens.color?.gray?.['400']?.value || '#9ca3af',
      cssVar: '--dsai-color-gray-400',
      token: 'color.gray.400'
    }, {
      name: '500',
      value: tokens.color?.gray?.['500']?.value || '#6b7280',
      cssVar: '--dsai-color-gray-500',
      token: 'color.gray.500'
    }, {
      name: '600',
      value: tokens.color?.gray?.['600']?.value || '#4b5563',
      cssVar: '--dsai-color-gray-600',
      token: 'color.gray.600'
    }, {
      name: '700',
      value: tokens.color?.gray?.['700']?.value || '#374151',
      cssVar: '--dsai-color-gray-700',
      token: 'color.gray.700'
    }, {
      name: '800',
      value: tokens.color?.gray?.['800']?.value || '#1f2937',
      cssVar: '--dsai-color-gray-800',
      token: 'color.gray.800'
    }, {
      name: '900',
      value: tokens.color?.gray?.['900']?.value || '#111827',
      cssVar: '--dsai-color-gray-900',
      token: 'color.gray.900'
    }, {
      name: '950',
      value: tokens.color?.gray?.['950']?.value || '#030712',
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
          {neutralColors.map(color => <ColorSwatch key={color.name} name={color.name} value={color.value} cssVariable={color.cssVar} tokenPath={color.token} textColor={parseInt(color.name) >= 500 ? '#fff' : '#000'} />)}
        </div>
      </div>;
  }
}`,...(oe=(ee=b.parameters)==null?void 0:ee.docs)==null?void 0:oe.source},description:{story:"Neutral Colors - Gray scale for text, backgrounds, borders",...(re=(ne=b.parameters)==null?void 0:ne.docs)==null?void 0:re.description}}};var ae,se,le,te,ce;g.parameters={...g.parameters,docs:{...(ae=g.parameters)==null?void 0:ae.docs,source:{originalSource:`{
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
              const value = (tokens.color as any)?.[hue]?.[step]?.value || '#cccccc';
              const cssVar = \`--dsai-color-\${hue}-\${step}\`;
              const tokenPath = \`color.\${hue}.\${step}\`;
              const stepNum = parseInt(step);
              return <ColorSwatch key={\`\${hue}-\${step}\`} name={step} value={value} cssVariable={cssVar} tokenPath={tokenPath} textColor={stepNum >= 500 ? '#fff' : '#000'} />;
            })}
              </div>
            </div>)}
        </div>
      </div>;
  }
}`,...(le=(se=g.parameters)==null?void 0:se.docs)==null?void 0:le.source},description:{story:"All Color Hues - Complete color palette",...(ce=(te=g.parameters)==null?void 0:te.docs)==null?void 0:ce.description}}};var ie,de,ue,me,pe;k.parameters={...k.parameters,docs:{...(ie=k.parameters)==null?void 0:ie.docs,source:{originalSource:`{
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
        <li>All color combinations meet WCAG 2.1 AA contrast requirements (4.5:1 for text, 3:1 for UI)</li>
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
}`,...(ue=(de=k.parameters)==null?void 0:de.docs)==null?void 0:ue.source},description:{story:"Usage Guidelines",...(pe=(me=k.parameters)==null?void 0:me.docs)==null?void 0:pe.description}}};const fe=["BrandColors","SemanticColors","NeutralColors","AllColorHues","Usage"],xe=Object.freeze(Object.defineProperty({__proto__:null,AllColorHues:g,BrandColors:h,NeutralColors:b,SemanticColors:x,Usage:k,__namedExportsOrder:fe,default:ve},Symbol.toStringTag,{value:"Module"}));export { xe as C };

