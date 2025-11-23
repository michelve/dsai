import{j as n}from"./jsx-runtime-D_zvdyIk.js";const M={title:"Foundation/Spacing",parameters:{docs:{description:{component:"Consistent spacing scale (0-10) for margins, padding, and gaps. Base unit: 4px, Bootstrap-compatible."}}}},s={render:()=>{const e=[{token:"0",value:"0px",rem:"0"},{token:"1",value:"4px",rem:"0.25rem"},{token:"2",value:"8px",rem:"0.5rem"},{token:"3",value:"16px",rem:"1rem"},{token:"4",value:"24px",rem:"1.5rem"},{token:"5",value:"32px",rem:"2rem"},{token:"6",value:"48px",rem:"3rem"},{token:"7",value:"64px",rem:"4rem"},{token:"8",value:"80px",rem:"5rem"},{token:"9",value:"96px",rem:"6rem"},{token:"10",value:"128px",rem:"8rem"}];return n.jsxs("div",{children:[n.jsx("h2",{children:"Spacing Scale"}),n.jsx("p",{children:"Base 4px scale for consistent spacing throughout the design system."}),n.jsx("div",{style:{marginTop:"24px"},children:e.map(({token:i,value:r,rem:a})=>n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"24px",marginBottom:"16px",padding:"12px",backgroundColor:"#f9fafb",borderRadius:"8px"},children:[n.jsxs("div",{style:{minWidth:"80px",fontWeight:600},children:["spacing-",i]}),n.jsx("div",{style:{width:r,height:"32px",backgroundColor:"#0ea5e9",borderRadius:"4px",border:"1px solid #0284c7"}}),n.jsxs("div",{style:{fontSize:"14px",color:"#6b7280"},children:[r," (",a,")"]}),n.jsxs("code",{style:{fontSize:"12px",color:"#9ca3af",marginLeft:"auto",backgroundColor:"#fff",padding:"4px 8px",borderRadius:"4px"},children:["var(--dsai-spacing-",i,")"]})]},i))})]})}},o={render:()=>{const e=[{name:"Small",token:"2",value:"8px"},{name:"Medium",token:"3",value:"16px"},{name:"Large",token:"4",value:"24px"},{name:"Extra Large",token:"6",value:"48px"}];return n.jsxs("div",{children:[n.jsx("h2",{children:"Padding Examples"}),n.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"16px",marginTop:"24px"},children:e.map(({name:i,token:r,value:a})=>n.jsxs("div",{children:[n.jsxs("div",{style:{fontSize:"14px",fontWeight:600,marginBottom:"8px"},children:[i," (spacing-",r,": ",a,")"]}),n.jsx("div",{style:{padding:a,backgroundColor:"#eff6ff",border:"2px dashed #0ea5e9",borderRadius:"8px"},children:n.jsxs("div",{style:{backgroundColor:"#0ea5e9",color:"white",padding:"12px",borderRadius:"4px",textAlign:"center"},children:["Content with ",a," padding"]})})]},r))})]})}},d={render:()=>n.jsxs("div",{children:[n.jsx("h2",{children:"Margin Examples"}),n.jsx("p",{children:"Consistent vertical rhythm using margin tokens."}),n.jsxs("div",{style:{marginTop:"24px",padding:"24px",backgroundColor:"#f9fafb",borderRadius:"8px"},children:[n.jsx("h3",{style:{margin:0},children:"Heading"}),n.jsx("p",{style:{marginTop:"8px",marginBottom:"0",color:"#6b7280"},children:"margin-top: spacing-2 (8px)"}),n.jsx("div",{style:{marginTop:"16px",padding:"16px",backgroundColor:"white",borderRadius:"8px",border:"1px solid #e5e7eb"},children:"Content block with spacing-3 (16px) top margin"}),n.jsx("div",{style:{marginTop:"24px",padding:"16px",backgroundColor:"white",borderRadius:"8px",border:"1px solid #e5e7eb"},children:"Content block with spacing-4 (24px) top margin"}),n.jsx("div",{style:{marginTop:"32px",padding:"16px",backgroundColor:"white",borderRadius:"8px",border:"1px solid #e5e7eb"},children:"Content block with spacing-5 (32px) top margin"})]})]})},t={render:()=>n.jsxs("div",{children:[n.jsx("h2",{children:"Gap Examples (Flexbox/Grid)"}),n.jsx("p",{children:"Using spacing tokens for gap in flex and grid layouts."}),n.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px",marginTop:"24px"},children:[n.jsxs("div",{children:[n.jsx("div",{style:{fontSize:"14px",fontWeight:600,marginBottom:"8px"},children:"Gap: spacing-2 (8px)"}),n.jsx("div",{style:{display:"flex",gap:"8px"},children:[1,2,3,4].map(e=>n.jsxs("div",{style:{flex:1,padding:"16px",backgroundColor:"#0ea5e9",color:"white",borderRadius:"8px",textAlign:"center"},children:["Item ",e]},e))})]}),n.jsxs("div",{children:[n.jsx("div",{style:{fontSize:"14px",fontWeight:600,marginBottom:"8px"},children:"Gap: spacing-4 (24px)"}),n.jsx("div",{style:{display:"flex",gap:"24px"},children:[1,2,3,4].map(e=>n.jsxs("div",{style:{flex:1,padding:"16px",backgroundColor:"#10b981",color:"white",borderRadius:"8px",textAlign:"center"},children:["Item ",e]},e))})]}),n.jsxs("div",{children:[n.jsx("div",{style:{fontSize:"14px",fontWeight:600,marginBottom:"8px"},children:"Gap: spacing-6 (48px)"}),n.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"48px"},children:[1,2,3].map(e=>n.jsxs("div",{style:{padding:"24px",backgroundColor:"#8b5cf6",color:"white",borderRadius:"8px",textAlign:"center"},children:["Grid Item ",e]},e))})]})]})]})},p={render:()=>n.jsxs("div",{style:{maxWidth:"800px"},children:[n.jsx("h2",{children:"Spacing Usage Guidelines"}),n.jsx("h3",{children:"CSS Variables"}),n.jsx("pre",{style:{backgroundColor:"#f3f4f6",padding:"16px",borderRadius:"8px",overflow:"auto"},children:`.card {
  padding: var(--dsai-spacing-4);
  margin-bottom: var(--dsai-spacing-3);
  gap: var(--dsai-spacing-2);
}

.section {
  padding-top: var(--dsai-spacing-6);
  padding-bottom: var(--dsai-spacing-6);
}`}),n.jsx("h3",{children:"JavaScript/TypeScript"}),n.jsx("pre",{style:{backgroundColor:"#f3f4f6",padding:"16px",borderRadius:"8px",overflow:"auto"},children:`import tokens from '@dsai/tokens';

const styles = {
  padding: tokens.spacing['4'],
  marginBottom: tokens.spacing['3'],
  gap: tokens.spacing['2'],
};`}),n.jsx("h3",{children:"Best Practices"}),n.jsxs("ul",{children:[n.jsxs("li",{children:[n.jsx("strong",{children:"Use spacing scale consistently:"})," Stick to the defined tokens for predictable layouts"]}),n.jsxs("li",{children:[n.jsx("strong",{children:"Smaller gaps for related content:"})," Use spacing-1 or spacing-2 within components"]}),n.jsxs("li",{children:[n.jsx("strong",{children:"Larger gaps for sections:"})," Use spacing-5 to spacing-8 between major sections"]}),n.jsxs("li",{children:[n.jsx("strong",{children:"Vertical rhythm:"})," Maintain consistent vertical spacing throughout the page"]}),n.jsxs("li",{children:[n.jsx("strong",{children:"Responsive spacing:"})," Consider adjusting spacing for different breakpoints"]})]}),n.jsx("h3",{children:"Bootstrap Compatibility"}),n.jsx("p",{children:"DSAi spacing tokens align with Bootstrap's spacing utilities:"}),n.jsxs("ul",{children:[n.jsxs("li",{children:[n.jsx("code",{children:"spacing-0"})," = Bootstrap ",n.jsx("code",{children:"$spacer * 0"})]}),n.jsxs("li",{children:[n.jsx("code",{children:"spacing-1"})," = Bootstrap ",n.jsx("code",{children:"$spacer * 0.25"})]}),n.jsxs("li",{children:[n.jsx("code",{children:"spacing-2"})," = Bootstrap ",n.jsx("code",{children:"$spacer * 0.5"})]}),n.jsxs("li",{children:[n.jsx("code",{children:"spacing-3"})," = Bootstrap ",n.jsx("code",{children:"$spacer * 1"})," (base 16px)"]}),n.jsxs("li",{children:[n.jsx("code",{children:"spacing-4"})," = Bootstrap ",n.jsx("code",{children:"$spacer * 1.5"})]}),n.jsxs("li",{children:[n.jsx("code",{children:"spacing-5"})," = Bootstrap ",n.jsx("code",{children:"$spacer * 2"})]})]})]})};var l,c,g,x,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => {
    const spacingValues = [{
      token: '0',
      value: '0px',
      rem: '0'
    }, {
      token: '1',
      value: '4px',
      rem: '0.25rem'
    }, {
      token: '2',
      value: '8px',
      rem: '0.5rem'
    }, {
      token: '3',
      value: '16px',
      rem: '1rem'
    }, {
      token: '4',
      value: '24px',
      rem: '1.5rem'
    }, {
      token: '5',
      value: '32px',
      rem: '2rem'
    }, {
      token: '6',
      value: '48px',
      rem: '3rem'
    }, {
      token: '7',
      value: '64px',
      rem: '4rem'
    }, {
      token: '8',
      value: '80px',
      rem: '5rem'
    }, {
      token: '9',
      value: '96px',
      rem: '6rem'
    }, {
      token: '10',
      value: '128px',
      rem: '8rem'
    }];
    return <div>
        <h2>Spacing Scale</h2>
        <p>Base 4px scale for consistent spacing throughout the design system.</p>
        <div style={{
        marginTop: '24px'
      }}>
          {spacingValues.map(({
          token,
          value,
          rem
        }) => <div key={token} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px'
        }}>
              <div style={{
            minWidth: '80px',
            fontWeight: 600
          }}>spacing-{token}</div>
              <div style={{
            width: value,
            height: '32px',
            backgroundColor: '#0ea5e9',
            borderRadius: '4px',
            border: '1px solid #0284c7'
          }} />
              <div style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
                {value} ({rem})
              </div>
              <code style={{
            fontSize: '12px',
            color: '#9ca3af',
            marginLeft: 'auto',
            backgroundColor: '#fff',
            padding: '4px 8px',
            borderRadius: '4px'
          }}>
                var(--dsai-spacing-{token})
              </code>
            </div>)}
        </div>
      </div>;
  }
}`,...(g=(c=s.parameters)==null?void 0:c.docs)==null?void 0:g.source},description:{story:"Spacing Scale",...(m=(x=s.parameters)==null?void 0:x.docs)==null?void 0:m.description}}};var h,u,v,f,b;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => {
    const paddingExamples = [{
      name: 'Small',
      token: '2',
      value: '8px'
    }, {
      name: 'Medium',
      token: '3',
      value: '16px'
    }, {
      name: 'Large',
      token: '4',
      value: '24px'
    }, {
      name: 'Extra Large',
      token: '6',
      value: '48px'
    }];
    return <div>
        <h2>Padding Examples</h2>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginTop: '24px'
      }}>
          {paddingExamples.map(({
          name,
          token,
          value
        }) => <div key={token}>
              <div style={{
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '8px'
          }}>
                {name} (spacing-{token}: {value})
              </div>
              <div style={{
            padding: value,
            backgroundColor: '#eff6ff',
            border: '2px dashed #0ea5e9',
            borderRadius: '8px'
          }}>
                <div style={{
              backgroundColor: '#0ea5e9',
              color: 'white',
              padding: '12px',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
                  Content with {value} padding
                </div>
              </div>
            </div>)}
        </div>
      </div>;
  }
}`,...(v=(u=o.parameters)==null?void 0:u.docs)==null?void 0:v.source},description:{story:"Padding Examples",...(b=(f=o.parameters)==null?void 0:f.docs)==null?void 0:b.description}}};var y,k,j,C,S;d.parameters={...d.parameters,docs:{...(y=d.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <div>
      <h2>Margin Examples</h2>
      <p>Consistent vertical rhythm using margin tokens.</p>
      <div style={{
      marginTop: '24px',
      padding: '24px',
      backgroundColor: '#f9fafb',
      borderRadius: '8px'
    }}>
        <h3 style={{
        margin: 0
      }}>Heading</h3>
        <p style={{
        marginTop: '8px',
        marginBottom: '0',
        color: '#6b7280'
      }}>
          margin-top: spacing-2 (8px)
        </p>

        <div style={{
        marginTop: '16px',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
          Content block with spacing-3 (16px) top margin
        </div>

        <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
          Content block with spacing-4 (24px) top margin
        </div>

        <div style={{
        marginTop: '32px',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
          Content block with spacing-5 (32px) top margin
        </div>
      </div>
    </div>
}`,...(j=(k=d.parameters)==null?void 0:k.docs)==null?void 0:j.source},description:{story:"Margin Examples",...(S=(C=d.parameters)==null?void 0:C.docs)==null?void 0:S.description}}};var B,w,R,E,T;t.parameters={...t.parameters,docs:{...(B=t.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => <div>
      <h2>Gap Examples (Flexbox/Grid)</h2>
      <p>Using spacing tokens for gap in flex and grid layouts.</p>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      marginTop: '24px'
    }}>
        <div>
          <div style={{
          fontSize: '14px',
          fontWeight: 600,
          marginBottom: '8px'
        }}>
            Gap: spacing-2 (8px)
          </div>
          <div style={{
          display: 'flex',
          gap: '8px'
        }}>
            {[1, 2, 3, 4].map(i => <div key={i} style={{
            flex: 1,
            padding: '16px',
            backgroundColor: '#0ea5e9',
            color: 'white',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
                Item {i}
              </div>)}
          </div>
        </div>

        <div>
          <div style={{
          fontSize: '14px',
          fontWeight: 600,
          marginBottom: '8px'
        }}>
            Gap: spacing-4 (24px)
          </div>
          <div style={{
          display: 'flex',
          gap: '24px'
        }}>
            {[1, 2, 3, 4].map(i => <div key={i} style={{
            flex: 1,
            padding: '16px',
            backgroundColor: '#10b981',
            color: 'white',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
                Item {i}
              </div>)}
          </div>
        </div>

        <div>
          <div style={{
          fontSize: '14px',
          fontWeight: 600,
          marginBottom: '8px'
        }}>
            Gap: spacing-6 (48px)
          </div>
          <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '48px'
        }}>
            {[1, 2, 3].map(i => <div key={i} style={{
            padding: '24px',
            backgroundColor: '#8b5cf6',
            color: 'white',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
                Grid Item {i}
              </div>)}
          </div>
        </div>
      </div>
    </div>
}`,...(R=(w=t.parameters)==null?void 0:w.docs)==null?void 0:R.source},description:{story:"Gap Examples (Flexbox/Grid)",...(T=(E=t.parameters)==null?void 0:E.docs)==null?void 0:T.description}}};var G,W,U,z,$;p.parameters={...p.parameters,docs:{...(G=p.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: '800px'
  }}>
      <h2>Spacing Usage Guidelines</h2>

      <h3>CSS Variables</h3>
      <pre style={{
      backgroundColor: '#f3f4f6',
      padding: '16px',
      borderRadius: '8px',
      overflow: 'auto'
    }}>
        {\`.card {
  padding: var(--dsai-spacing-4);
  margin-bottom: var(--dsai-spacing-3);
  gap: var(--dsai-spacing-2);
}

.section {
  padding-top: var(--dsai-spacing-6);
  padding-bottom: var(--dsai-spacing-6);
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
  padding: tokens.spacing['4'],
  marginBottom: tokens.spacing['3'],
  gap: tokens.spacing['2'],
};\`}
      </pre>

      <h3>Best Practices</h3>
      <ul>
        <li>
          <strong>Use spacing scale consistently:</strong> Stick to the defined tokens for
          predictable layouts
        </li>
        <li>
          <strong>Smaller gaps for related content:</strong> Use spacing-1 or spacing-2 within
          components
        </li>
        <li>
          <strong>Larger gaps for sections:</strong> Use spacing-5 to spacing-8 between major
          sections
        </li>
        <li>
          <strong>Vertical rhythm:</strong> Maintain consistent vertical spacing throughout the page
        </li>
        <li>
          <strong>Responsive spacing:</strong> Consider adjusting spacing for different breakpoints
        </li>
      </ul>

      <h3>Bootstrap Compatibility</h3>
      <p>DSAi spacing tokens align with Bootstrap's spacing utilities:</p>
      <ul>
        <li>
          <code>spacing-0</code> = Bootstrap <code>$spacer * 0</code>
        </li>
        <li>
          <code>spacing-1</code> = Bootstrap <code>$spacer * 0.25</code>
        </li>
        <li>
          <code>spacing-2</code> = Bootstrap <code>$spacer * 0.5</code>
        </li>
        <li>
          <code>spacing-3</code> = Bootstrap <code>$spacer * 1</code> (base 16px)
        </li>
        <li>
          <code>spacing-4</code> = Bootstrap <code>$spacer * 1.5</code>
        </li>
        <li>
          <code>spacing-5</code> = Bootstrap <code>$spacer * 2</code>
        </li>
      </ul>
    </div>
}`,...(U=(W=p.parameters)==null?void 0:W.docs)==null?void 0:U.source},description:{story:"Usage Guidelines",...($=(z=p.parameters)==null?void 0:z.docs)==null?void 0:$.description}}};const I=["SpacingScale","PaddingExamples","MarginExamples","GapExamples","Usage"];export{t as GapExamples,d as MarginExamples,o as PaddingExamples,s as SpacingScale,p as Usage,I as __namedExportsOrder,M as default};
