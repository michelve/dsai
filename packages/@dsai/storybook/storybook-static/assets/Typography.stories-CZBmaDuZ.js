import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{t as c}from"./tokens-grouped-BsvYVlf2.js";const K={title:"Foundation/Typography",parameters:{docs:{description:{component:"Typography system with font families, sizes, weights, and line heights for consistent text styling."}}}},s={render:()=>{var t,i,n,o;return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsxs("div",{children:[e.jsx("h3",{children:"Base Font (Inter)"}),e.jsx("p",{style:{fontFamily:((i=(t=c.typography)==null?void 0:t.fontFamily)==null?void 0:i.base)||"Inter, sans-serif",fontSize:"16px",marginTop:"8px"},children:"The quick brown fox jumps over the lazy dog. 0123456789"}),e.jsx("code",{style:{fontSize:"12px",color:"#6b7280"},children:"var(--dsai-typography-font-family-base)"})]}),e.jsxs("div",{children:[e.jsx("h3",{children:"Monospace Font (Fira Code)"}),e.jsx("p",{style:{fontFamily:((o=(n=c.typography)==null?void 0:n.fontFamily)==null?void 0:o.monospace)||'"Fira Code", monospace',fontSize:"16px",marginTop:"8px"},children:'const greeting = "Hello, World!"; // Code example'}),e.jsx("code",{style:{fontSize:"12px",color:"#6b7280"},children:"var(--dsai-typography-font-family-monospace)"})]})]})}},a={render:()=>{const t=[{name:"Extra Small",token:"xs",size:"12px"},{name:"Small",token:"sm",size:"14px"},{name:"Base",token:"base",size:"16px"},{name:"Large",token:"lg",size:"18px"},{name:"Extra Large",token:"xl",size:"20px"},{name:"2X Large",token:"2xl",size:"24px"},{name:"3X Large",token:"3xl",size:"30px"}];return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx("h2",{children:"Font Size Scale"}),t.map(({name:i,token:n,size:o})=>e.jsxs("div",{style:{display:"flex",alignItems:"baseline",gap:"16px"},children:[e.jsx("div",{style:{minWidth:"120px",fontSize:"14px",color:"#6b7280"},children:i}),e.jsx("div",{style:{fontSize:o},children:"The quick brown fox jumps over the lazy dog"}),e.jsx("code",{style:{fontSize:"12px",color:"#9ca3af",marginLeft:"auto"},children:o})]},n))]})}},r={render:()=>{const t=[{tag:"h1",size:"48px",weight:"700"},{tag:"h2",size:"40px",weight:"700"},{tag:"h3",size:"32px",weight:"600"},{tag:"h4",size:"24px",weight:"600"},{tag:"h5",size:"20px",weight:"600"},{tag:"h6",size:"16px",weight:"600"}];return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsx("h2",{children:"Heading Scale"}),t.map(({tag:i,size:n,weight:o})=>{const J=i;return e.jsxs("div",{children:[e.jsxs(J,{style:{fontSize:n,fontWeight:o,margin:0},children:[i.toUpperCase(),": The quick brown fox"]}),e.jsxs("div",{style:{fontSize:"12px",color:"#6b7280",marginTop:"4px"},children:[n," · Font Weight ",o]})]},i)})]})}},l={render:()=>{const t=[{name:"Regular",value:"400"},{name:"Medium",value:"500"},{name:"Semibold",value:"600"},{name:"Bold",value:"700"}];return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx("h2",{children:"Font Weights"}),t.map(({name:i,value:n})=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"24px"},children:[e.jsx("div",{style:{minWidth:"120px",fontSize:"14px",color:"#6b7280"},children:i}),e.jsx("div",{style:{fontSize:"18px",fontWeight:n},children:"The quick brown fox jumps over the lazy dog"}),e.jsx("code",{style:{fontSize:"12px",color:"#9ca3af",marginLeft:"auto"},children:n})]},n))]})}},d={render:()=>{const t=[{name:"Tight",value:"1.25",description:"For headings and short text"},{name:"Normal",value:"1.5",description:"Default for body text"},{name:"Relaxed",value:"1.75",description:"For comfortable reading"},{name:"Loose",value:"2",description:"For spacious layouts"}];return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"32px"},children:[e.jsx("h2",{children:"Line Height Scale"}),t.map(({name:i,value:n,description:o})=>e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px",marginBottom:"8px"},children:[e.jsx("strong",{children:i}),e.jsx("code",{style:{fontSize:"12px",color:"#6b7280"},children:n}),e.jsxs("span",{style:{fontSize:"14px",color:"#6b7280"},children:["· ",o]})]}),e.jsx("p",{style:{lineHeight:n,fontSize:"16px",backgroundColor:"#f3f4f6",padding:"16px",borderRadius:"8px",margin:0},children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."})]},n))]})}},p={render:()=>e.jsxs("div",{style:{maxWidth:"800px"},children:[e.jsx("h2",{children:"Typography Usage"}),e.jsx("h3",{children:"CSS Variables"}),e.jsx("pre",{style:{backgroundColor:"#f3f4f6",padding:"16px",borderRadius:"8px",overflow:"auto"},children:`.heading {
  font-family: var(--dsai-typography-font-family-base);
  font-size: var(--dsai-typography-font-size-2xl);
  font-weight: var(--dsai-typography-font-weight-bold);
  line-height: var(--dsai-typography-line-height-tight);
}

.body-text {
  font-size: var(--dsai-typography-font-size-base);
  line-height: var(--dsai-typography-line-height-normal);
}

.code {
  font-family: var(--dsai-typography-font-family-monospace);
  font-size: var(--dsai-typography-font-size-sm);
}`}),e.jsx("h3",{children:"JavaScript/TypeScript"}),e.jsx("pre",{style:{backgroundColor:"#f3f4f6",padding:"16px",borderRadius:"8px",overflow:"auto"},children:`import tokens from '@dsai/tokens';

const styles = {
  fontFamily: tokens.typography.fontFamily.base,
  fontSize: tokens.typography.fontSize.base,
  fontWeight: tokens.typography.fontWeight.semibold,
  lineHeight: tokens.typography.lineHeight.normal,
};`}),e.jsx("h3",{children:"Best Practices"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Use semantic HTML:"})," Use proper heading hierarchy (h1-h6)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Maintain contrast:"})," Ensure text meets WCAG 2.1 AA standards (4.5:1 for body, 3:1 for headings)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Optimize line length:"})," Keep lines between 45-75 characters for readability"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Use relative units:"})," Typography tokens use rem for scalability"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Consider context:"})," Use tighter line-height for headings, relaxed for body text"]})]})]})};var h,g,m,x,y;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  }}>
      <div>
        <h3>Base Font (Inter)</h3>
        <p style={{
        fontFamily: tokens.typography?.fontFamily?.base || 'Inter, sans-serif',
        fontSize: '16px',
        marginTop: '8px'
      }}>
          The quick brown fox jumps over the lazy dog. 0123456789
        </p>
        <code style={{
        fontSize: '12px',
        color: '#6b7280'
      }}>
          var(--dsai-typography-font-family-base)
        </code>
      </div>

      <div>
        <h3>Monospace Font (Fira Code)</h3>
        <p style={{
        fontFamily: tokens.typography?.fontFamily?.monospace || '"Fira Code", monospace',
        fontSize: '16px',
        marginTop: '8px'
      }}>
          const greeting = "Hello, World!"; // Code example
        </p>
        <code style={{
        fontSize: '12px',
        color: '#6b7280'
      }}>
          var(--dsai-typography-font-family-monospace)
        </code>
      </div>
    </div>
}`,...(m=(g=s.parameters)==null?void 0:g.docs)==null?void 0:m.source},description:{story:"Font Families",...(y=(x=s.parameters)==null?void 0:x.docs)==null?void 0:y.description}}};var f,u,v,z,b;a.parameters={...a.parameters,docs:{...(f=a.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => {
    const sizes = [{
      name: 'Extra Small',
      token: 'xs',
      size: '12px'
    }, {
      name: 'Small',
      token: 'sm',
      size: '14px'
    }, {
      name: 'Base',
      token: 'base',
      size: '16px'
    }, {
      name: 'Large',
      token: 'lg',
      size: '18px'
    }, {
      name: 'Extra Large',
      token: 'xl',
      size: '20px'
    }, {
      name: '2X Large',
      token: '2xl',
      size: '24px'
    }, {
      name: '3X Large',
      token: '3xl',
      size: '30px'
    }];
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
        <h2>Font Size Scale</h2>
        {sizes.map(({
        name,
        token,
        size
      }) => <div key={token} style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '16px'
      }}>
            <div style={{
          minWidth: '120px',
          fontSize: '14px',
          color: '#6b7280'
        }}>{name}</div>
            <div style={{
          fontSize: size
        }}>The quick brown fox jumps over the lazy dog</div>
            <code style={{
          fontSize: '12px',
          color: '#9ca3af',
          marginLeft: 'auto'
        }}>{size}</code>
          </div>)}
      </div>;
  }
}`,...(v=(u=a.parameters)==null?void 0:u.docs)==null?void 0:v.source},description:{story:"Font Sizes",...(b=(z=a.parameters)==null?void 0:z.docs)==null?void 0:b.description}}};var S,j,k,F,w;r.parameters={...r.parameters,docs:{...(S=r.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => {
    const headings = [{
      tag: 'h1',
      size: '48px',
      weight: '700'
    }, {
      tag: 'h2',
      size: '40px',
      weight: '700'
    }, {
      tag: 'h3',
      size: '32px',
      weight: '600'
    }, {
      tag: 'h4',
      size: '24px',
      weight: '600'
    }, {
      tag: 'h5',
      size: '20px',
      weight: '600'
    }, {
      tag: 'h6',
      size: '16px',
      weight: '600'
    }];
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
        <h2>Heading Scale</h2>
        {headings.map(({
        tag,
        size,
        weight
      }) => {
        const Tag = tag as keyof JSX.IntrinsicElements;
        return <div key={tag}>
              <Tag style={{
            fontSize: size,
            fontWeight: weight,
            margin: 0
          }}>
                {tag.toUpperCase()}: The quick brown fox
              </Tag>
              <div style={{
            fontSize: '12px',
            color: '#6b7280',
            marginTop: '4px'
          }}>
                {size} · Font Weight {weight}
              </div>
            </div>;
      })}
      </div>;
  }
}`,...(k=(j=r.parameters)==null?void 0:j.docs)==null?void 0:k.source},description:{story:"Headings",...(w=(F=r.parameters)==null?void 0:F.docs)==null?void 0:w.description}}};var T,W,H,L,C;l.parameters={...l.parameters,docs:{...(T=l.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => {
    const weights = [{
      name: 'Regular',
      value: '400'
    }, {
      name: 'Medium',
      value: '500'
    }, {
      name: 'Semibold',
      value: '600'
    }, {
      name: 'Bold',
      value: '700'
    }];
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
        <h2>Font Weights</h2>
        {weights.map(({
        name,
        value
      }) => <div key={value} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px'
      }}>
            <div style={{
          minWidth: '120px',
          fontSize: '14px',
          color: '#6b7280'
        }}>{name}</div>
            <div style={{
          fontSize: '18px',
          fontWeight: value
        }}>
              The quick brown fox jumps over the lazy dog
            </div>
            <code style={{
          fontSize: '12px',
          color: '#9ca3af',
          marginLeft: 'auto'
        }}>{value}</code>
          </div>)}
      </div>;
  }
}`,...(H=(W=l.parameters)==null?void 0:W.docs)==null?void 0:H.source},description:{story:"Font Weights",...(C=(L=l.parameters)==null?void 0:L.docs)==null?void 0:C.description}}};var U,q,D,I,R;d.parameters={...d.parameters,docs:{...(U=d.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => {
    const lineHeights = [{
      name: 'Tight',
      value: '1.25',
      description: 'For headings and short text'
    }, {
      name: 'Normal',
      value: '1.5',
      description: 'Default for body text'
    }, {
      name: 'Relaxed',
      value: '1.75',
      description: 'For comfortable reading'
    }, {
      name: 'Loose',
      value: '2',
      description: 'For spacious layouts'
    }];
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '32px'
    }}>
        <h2>Line Height Scale</h2>
        {lineHeights.map(({
        name,
        value,
        description
      }) => <div key={value}>
            <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '8px'
        }}>
              <strong>{name}</strong>
              <code style={{
            fontSize: '12px',
            color: '#6b7280'
          }}>{value}</code>
              <span style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>· {description}</span>
            </div>
            <p style={{
          lineHeight: value,
          fontSize: '16px',
          backgroundColor: '#f3f4f6',
          padding: '16px',
          borderRadius: '8px',
          margin: 0
        }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
              ex ea commodo consequat.
            </p>
          </div>)}
      </div>;
  }
}`,...(D=(q=d.parameters)==null?void 0:q.docs)==null?void 0:D.source},description:{story:"Line Heights",...(R=(I=d.parameters)==null?void 0:I.docs)==null?void 0:R.description}}};var B,E,M,A,X;p.parameters={...p.parameters,docs:{...(B=p.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: '800px'
  }}>
      <h2>Typography Usage</h2>

      <h3>CSS Variables</h3>
      <pre style={{
      backgroundColor: '#f3f4f6',
      padding: '16px',
      borderRadius: '8px',
      overflow: 'auto'
    }}>
        {\`.heading {
  font-family: var(--dsai-typography-font-family-base);
  font-size: var(--dsai-typography-font-size-2xl);
  font-weight: var(--dsai-typography-font-weight-bold);
  line-height: var(--dsai-typography-line-height-tight);
}

.body-text {
  font-size: var(--dsai-typography-font-size-base);
  line-height: var(--dsai-typography-line-height-normal);
}

.code {
  font-family: var(--dsai-typography-font-family-monospace);
  font-size: var(--dsai-typography-font-size-sm);
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
  fontFamily: tokens.typography.fontFamily.base,
  fontSize: tokens.typography.fontSize.base,
  fontWeight: tokens.typography.fontWeight.semibold,
  lineHeight: tokens.typography.lineHeight.normal,
};\`}
      </pre>

      <h3>Best Practices</h3>
      <ul>
        <li>
          <strong>Use semantic HTML:</strong> Use proper heading hierarchy (h1-h6)
        </li>
        <li>
          <strong>Maintain contrast:</strong> Ensure text meets WCAG 2.1 AA standards (4.5:1 for body, 3:1 for
          headings)
        </li>
        <li>
          <strong>Optimize line length:</strong> Keep lines between 45-75 characters for readability
        </li>
        <li>
          <strong>Use relative units:</strong> Typography tokens use rem for scalability
        </li>
        <li>
          <strong>Consider context:</strong> Use tighter line-height for headings, relaxed for body text
        </li>
      </ul>
    </div>
}`,...(M=(E=p.parameters)==null?void 0:E.docs)==null?void 0:M.source},description:{story:"Usage Examples",...(X=(A=p.parameters)==null?void 0:A.docs)==null?void 0:X.description}}};const N=["FontFamilies","FontSizes","Headings","FontWeights","LineHeights","Usage"];export{s as FontFamilies,a as FontSizes,l as FontWeights,r as Headings,d as LineHeights,p as Usage,N as __namedExportsOrder,K as default};
