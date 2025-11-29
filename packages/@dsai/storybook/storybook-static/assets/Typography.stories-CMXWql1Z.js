import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{t as h}from"./iframe-6amVX2Fk.js";import"./preload-helper-Dp1pzeXC.js";const $={title:"Foundation/Typography",parameters:{docs:{description:{component:"Typography system with font families, sizes, weights, and line heights for consistent text styling."}},backgrounds:{default:"light",values:[{name:"light",value:"#ffffff"},{name:"dark",value:"#1a1a1a"},{name:"gray",value:"#f5f5f5"}]},viewport:{defaultViewport:"responsive"}}},s={render:()=>{var o,i,n,t;return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsxs("div",{children:[e.jsx("h3",{children:"Base Font (Inter)"}),e.jsx("p",{style:{fontFamily:((i=(o=h.typography)==null?void 0:o.fontFamily)==null?void 0:i.base)||"Inter, sans-serif",fontSize:"16px",marginTop:"8px"},children:"The quick brown fox jumps over the lazy dog. 0123456789"}),e.jsx("code",{style:{fontSize:"12px",color:"#6b7280"},children:"var(--dsai-typography-font-family-base)"})]}),e.jsxs("div",{children:[e.jsx("h3",{children:"Monospace Font (Fira Code)"}),e.jsx("p",{style:{fontFamily:((t=(n=h.typography)==null?void 0:n.fontFamily)==null?void 0:t.monospace)||'"Fira Code", monospace',fontSize:"16px",marginTop:"8px"},children:'const greeting = "Hello, World!"; // Code example'}),e.jsx("code",{style:{fontSize:"12px",color:"#6b7280"},children:"var(--dsai-typography-font-family-monospace)"})]})]})}},a={render:()=>{const o=[{name:"Extra Small",token:"xs",size:"12px"},{name:"Small",token:"sm",size:"14px"},{name:"Base",token:"base",size:"16px"},{name:"Large",token:"lg",size:"18px"},{name:"Extra Large",token:"xl",size:"20px"},{name:"2X Large",token:"2xl",size:"24px"},{name:"3X Large",token:"3xl",size:"30px"}];return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx("h2",{children:"Font Size Scale"}),o.map(({name:i,token:n,size:t})=>e.jsxs("div",{style:{display:"flex",alignItems:"baseline",gap:"16px"},children:[e.jsx("div",{style:{minWidth:"120px",fontSize:"14px",color:"#6b7280"},children:i}),e.jsx("div",{style:{fontSize:t},children:"The quick brown fox jumps over the lazy dog"}),e.jsx("code",{style:{fontSize:"12px",color:"#9ca3af",marginLeft:"auto"},children:t})]},n))]})}},r={render:()=>{const o=[{name:"Display 1",token:"display1",size:"80px",weight:"300",usage:"Hero headings, landing pages"},{name:"Display 2",token:"display2",size:"72px",weight:"300",usage:"Large marketing headers"},{name:"Display 3",token:"display3",size:"64px",weight:"300",usage:"Section heroes"},{name:"Display 4",token:"display4",size:"56px",weight:"300",usage:"Feature announcements"},{name:"Display 5",token:"display5",size:"48px",weight:"300",usage:"Page titles"},{name:"Display 6",token:"display6",size:"40px",weight:"300",usage:"Section headers"}];return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"40px"},children:[e.jsxs("div",{children:[e.jsx("h2",{children:"Display Typography Scale"}),e.jsx("p",{style:{color:"#6b7280",marginTop:"8px"},children:"Large, attention-grabbing typography for hero sections, landing pages, and marketing content. Uses lighter font weight (300) for elegant, modern appearance."})]}),o.map(({name:i,token:n,size:t,weight:c,usage:_})=>e.jsxs("div",{style:{borderTop:"1px solid #e5e7eb",paddingTop:"24px"},children:[e.jsxs("div",{style:{marginBottom:"16px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",marginBottom:"4px"},children:[e.jsx("span",{style:{fontSize:"14px",fontWeight:600,color:"#111827"},children:i}),e.jsx("code",{style:{fontSize:"12px",color:"#6b7280"},children:t}),e.jsxs("span",{style:{fontSize:"12px",color:"#9ca3af"},children:["· Weight ",c]})]}),e.jsx("div",{style:{fontSize:"12px",color:"#6b7280",fontStyle:"italic"},children:_})]}),e.jsx("div",{style:{fontSize:t,fontWeight:c,lineHeight:"1.2",letterSpacing:"-0.02em"},children:"The quick brown fox"}),e.jsxs("code",{style:{fontSize:"11px",color:"#9ca3af",marginTop:"8px",display:"block",fontFamily:"monospace"},children:["var(--dsai-typography-display-",n,"-font-size)"]})]},n)),e.jsxs("div",{style:{backgroundColor:"#f0f9ff",padding:"20px",borderRadius:"8px",borderLeft:"4px solid #0ea5e9",marginTop:"24px"},children:[e.jsx("h3",{style:{fontSize:"16px",fontWeight:600,margin:"0 0 8px 0"},children:"Usage Tips"}),e.jsxs("ul",{style:{margin:0,paddingLeft:"20px",color:"#0c4a6e"},children:[e.jsx("li",{children:"Use display typography sparingly for maximum impact"}),e.jsx("li",{children:"Pair with generous white space for breathing room"}),e.jsx("li",{children:"Apply negative letter-spacing (-0.02em) for better visual balance"}),e.jsx("li",{children:"Consider responsive scaling on smaller screens"}),e.jsx("li",{children:"Use line-height of 1.1-1.2 for tighter, more impactful presentation"})]})]})]})}},l={render:()=>{const o=[{tag:"h1",size:"48px",weight:"700"},{tag:"h2",size:"40px",weight:"700"},{tag:"h3",size:"32px",weight:"600"},{tag:"h4",size:"24px",weight:"600"},{tag:"h5",size:"20px",weight:"600"},{tag:"h6",size:"16px",weight:"600"}];return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsx("h2",{children:"Heading Scale"}),o.map(({tag:i,size:n,weight:t})=>{const c=i;return e.jsxs("div",{children:[e.jsxs(c,{style:{fontSize:n,fontWeight:t,margin:0},children:[i.toUpperCase(),": The quick brown fox"]}),e.jsxs("div",{style:{fontSize:"12px",color:"#6b7280",marginTop:"4px"},children:[n," · Font Weight ",t]})]},i)})]})}},p={render:()=>{const o=[{name:"Regular",value:"400"},{name:"Medium",value:"500"},{name:"Semibold",value:"600"},{name:"Bold",value:"700"}];return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx("h2",{children:"Font Weights"}),o.map(({name:i,value:n})=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"24px"},children:[e.jsx("div",{style:{minWidth:"120px",fontSize:"14px",color:"#6b7280"},children:i}),e.jsx("div",{style:{fontSize:"18px",fontWeight:n},children:"The quick brown fox jumps over the lazy dog"}),e.jsx("code",{style:{fontSize:"12px",color:"#9ca3af",marginLeft:"auto"},children:n})]},n))]})}},d={render:()=>{const o=[{name:"Tight",value:"1.25",description:"For headings and short text"},{name:"Normal",value:"1.5",description:"Default for body text"},{name:"Relaxed",value:"1.75",description:"For comfortable reading"},{name:"Loose",value:"2",description:"For spacious layouts"}];return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"32px"},children:[e.jsx("h2",{children:"Line Height Scale"}),o.map(({name:i,value:n,description:t})=>e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px",marginBottom:"8px"},children:[e.jsx("strong",{children:i}),e.jsx("code",{style:{fontSize:"12px",color:"#6b7280"},children:n}),e.jsxs("span",{style:{fontSize:"14px",color:"#6b7280"},children:["· ",t]})]}),e.jsx("p",{style:{lineHeight:n,fontSize:"16px",backgroundColor:"#f3f4f6",padding:"16px",borderRadius:"8px",margin:0},children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."})]},n))]})}},g={render:()=>e.jsxs("div",{style:{maxWidth:"800px"},children:[e.jsx("h2",{children:"Typography Usage"}),e.jsx("h3",{children:"CSS Variables"}),e.jsx("pre",{style:{backgroundColor:"#f3f4f6",padding:"16px",borderRadius:"8px",overflow:"auto"},children:`.heading {
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
};`}),e.jsx("h3",{children:"Best Practices"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Use semantic HTML:"})," Use proper heading hierarchy (h1-h6)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Maintain contrast:"})," Ensure text meets WCAG 2.1 AA standards (4.5:1 for body, 3:1 for headings)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Optimize line length:"})," Keep lines between 45-75 characters for readability"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Use relative units:"})," Typography tokens use rem for scalability"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Consider context:"})," Use tighter line-height for headings, relaxed for body text"]})]})]})};var y,m,x,f,u;s.parameters={...s.parameters,docs:{...(y=s.parameters)==null?void 0:y.docs,source:{originalSource:`{
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
}`,...(x=(m=s.parameters)==null?void 0:m.docs)==null?void 0:x.source},description:{story:"Font Families",...(u=(f=s.parameters)==null?void 0:f.docs)==null?void 0:u.description}}};var v,z,b,S,j;a.parameters={...a.parameters,docs:{...(v=a.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
}`,...(b=(z=a.parameters)==null?void 0:z.docs)==null?void 0:b.source},description:{story:"Font Sizes",...(j=(S=a.parameters)==null?void 0:S.docs)==null?void 0:j.description}}};var k,w,F,T,W;r.parameters={...r.parameters,docs:{...(k=r.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => {
    const displays = [{
      name: 'Display 1',
      token: 'display1',
      size: '80px',
      weight: '300',
      usage: 'Hero headings, landing pages'
    }, {
      name: 'Display 2',
      token: 'display2',
      size: '72px',
      weight: '300',
      usage: 'Large marketing headers'
    }, {
      name: 'Display 3',
      token: 'display3',
      size: '64px',
      weight: '300',
      usage: 'Section heroes'
    }, {
      name: 'Display 4',
      token: 'display4',
      size: '56px',
      weight: '300',
      usage: 'Feature announcements'
    }, {
      name: 'Display 5',
      token: 'display5',
      size: '48px',
      weight: '300',
      usage: 'Page titles'
    }, {
      name: 'Display 6',
      token: 'display6',
      size: '40px',
      weight: '300',
      usage: 'Section headers'
    }];
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '40px'
    }}>
        <div>
          <h2>Display Typography Scale</h2>
          <p style={{
          color: '#6b7280',
          marginTop: '8px'
        }}>
            Large, attention-grabbing typography for hero sections, landing pages, and marketing
            content. Uses lighter font weight (300) for elegant, modern appearance.
          </p>
        </div>
        {displays.map(({
        name,
        token,
        size,
        weight,
        usage
      }) => <div key={token} style={{
        borderTop: '1px solid #e5e7eb',
        paddingTop: '24px'
      }}>
            <div style={{
          marginBottom: '16px'
        }}>
              <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '4px'
          }}>
                <span style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#111827'
            }}>{name}</span>
                <code style={{
              fontSize: '12px',
              color: '#6b7280'
            }}>{size}</code>
                <span style={{
              fontSize: '12px',
              color: '#9ca3af'
            }}>· Weight {weight}</span>
              </div>
              <div style={{
            fontSize: '12px',
            color: '#6b7280',
            fontStyle: 'italic'
          }}>{usage}</div>
            </div>
            <div style={{
          fontSize: size,
          fontWeight: weight,
          lineHeight: '1.2',
          letterSpacing: '-0.02em'
        }}>
              The quick brown fox
            </div>
            <code style={{
          fontSize: '11px',
          color: '#9ca3af',
          marginTop: '8px',
          display: 'block',
          fontFamily: 'monospace'
        }}>
              var(--dsai-typography-display-{token}-font-size)
            </code>
          </div>)}
        <div style={{
        backgroundColor: '#f0f9ff',
        padding: '20px',
        borderRadius: '8px',
        borderLeft: '4px solid #0ea5e9',
        marginTop: '24px'
      }}>
          <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          margin: '0 0 8px 0'
        }}>Usage Tips</h3>
          <ul style={{
          margin: 0,
          paddingLeft: '20px',
          color: '#0c4a6e'
        }}>
            <li>Use display typography sparingly for maximum impact</li>
            <li>Pair with generous white space for breathing room</li>
            <li>Apply negative letter-spacing (-0.02em) for better visual balance</li>
            <li>Consider responsive scaling on smaller screens</li>
            <li>Use line-height of 1.1-1.2 for tighter, more impactful presentation</li>
          </ul>
        </div>
      </div>;
  }
}`,...(F=(w=r.parameters)==null?void 0:w.docs)==null?void 0:F.source},description:{story:"Display Typography - Large, attention-grabbing text for hero sections",...(W=(T=r.parameters)==null?void 0:T.docs)==null?void 0:W.description}}};var L,D,H,U,C;l.parameters={...l.parameters,docs:{...(L=l.parameters)==null?void 0:L.docs,source:{originalSource:`{
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
}`,...(H=(D=l.parameters)==null?void 0:D.docs)==null?void 0:H.source},description:{story:"Headings",...(C=(U=l.parameters)==null?void 0:U.docs)==null?void 0:C.description}}};var q,B,I,R,E;p.parameters={...p.parameters,docs:{...(q=p.parameters)==null?void 0:q.docs,source:{originalSource:`{
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
}`,...(I=(B=p.parameters)==null?void 0:B.docs)==null?void 0:I.source},description:{story:"Font Weights",...(E=(R=p.parameters)==null?void 0:R.docs)==null?void 0:E.description}}};var A,M,P,X,J;d.parameters={...d.parameters,docs:{...(A=d.parameters)==null?void 0:A.docs,source:{originalSource:`{
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>)}
      </div>;
  }
}`,...(P=(M=d.parameters)==null?void 0:M.docs)==null?void 0:P.source},description:{story:"Line Heights",...(J=(X=d.parameters)==null?void 0:X.docs)==null?void 0:J.description}}};var O,V,G,K,N;g.parameters={...g.parameters,docs:{...(O=g.parameters)==null?void 0:O.docs,source:{originalSource:`{
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
          <strong>Maintain contrast:</strong> Ensure text meets WCAG 2.1 AA standards (4.5:1 for
          body, 3:1 for headings)
        </li>
        <li>
          <strong>Optimize line length:</strong> Keep lines between 45-75 characters for readability
        </li>
        <li>
          <strong>Use relative units:</strong> Typography tokens use rem for scalability
        </li>
        <li>
          <strong>Consider context:</strong> Use tighter line-height for headings, relaxed for body
          text
        </li>
      </ul>
    </div>
}`,...(G=(V=g.parameters)==null?void 0:V.docs)==null?void 0:G.source},description:{story:"Usage Examples",...(N=(K=g.parameters)==null?void 0:K.docs)==null?void 0:N.description}}};const ee=["FontFamilies","FontSizes","DisplayTypography","Headings","FontWeights","LineHeights","Usage"];export{r as DisplayTypography,s as FontFamilies,a as FontSizes,p as FontWeights,l as Headings,d as LineHeights,g as Usage,ee as __namedExportsOrder,$ as default};
