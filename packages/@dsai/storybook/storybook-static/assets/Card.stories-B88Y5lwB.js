import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{m as r,n as t,o as a,p as s,B as b,q as i,r as Ze,s as er,t as ar,u as B}from"./Tabs-Fap5R-zB.js";import{r as tr}from"./iframe-6amVX2Fk.js";import"./preload-helper-Dp1pzeXC.js";const or={title:"Components/Card",component:r,parameters:{layout:"padded",docs:{description:{component:"A flexible content container with multiple subcomponents (Header, Body, Footer, Image) supporting various layouts and interactions. Features automatic security validation, performance optimizations, and WCAG 2.2 AA compliance."}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["elevated","outlined","ghost"],description:"Card variant",table:{type:{summary:"'elevated' | 'outlined' | 'ghost'"},defaultValue:{summary:"elevated"}}},color:{control:"select",options:[void 0,"primary","secondary","success","danger","warning","info","light","dark"],description:"Background color variant",table:{type:{summary:"CardColor"}}},horizontal:{control:"boolean",description:"Horizontal layout",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}}},l="/assets/card-sample.jpg",o={render:()=>e.jsx(r,{style:{width:"18rem"},children:e.jsxs(t,{children:[e.jsx(a,{children:"Card Title"}),e.jsx(s,{children:"Some quick example text to build on the card title and make up the bulk of the card's content."}),e.jsx(b,{variant:"primary",children:"Go somewhere"})]})})},n={render:()=>e.jsxs(r,{style:{width:"18rem"},children:[e.jsx(i,{src:l,alt:"Colorful gradient background"}),e.jsxs(t,{children:[e.jsx(a,{children:"Card Title"}),e.jsx(s,{children:"Some quick example text to build on the card title and make up the bulk of the card's content."}),e.jsx(b,{variant:"primary",children:"Go somewhere"})]})]})},c={render:()=>e.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"elevated",style:{width:"16rem"},children:e.jsxs(t,{children:[e.jsx(a,{children:"Elevated"}),e.jsx(s,{children:"Card with shadow (default)"})]})}),e.jsx(r,{variant:"outlined",style:{width:"16rem"},children:e.jsxs(t,{children:[e.jsx(a,{children:"Outlined"}),e.jsx(s,{children:"Card with border"})]})}),e.jsx(r,{variant:"ghost",style:{width:"16rem"},children:e.jsxs(t,{children:[e.jsx(a,{children:"Ghost"}),e.jsx(s,{children:"Transparent background"})]})})]})},m={render:()=>e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:"1rem"},children:["primary","secondary","success","danger","warning","info","light","dark"].map(d=>e.jsx(r,{color:d,children:e.jsxs(t,{children:[e.jsx(a,{children:d.charAt(0).toUpperCase()+d.slice(1)}),e.jsxs(s,{children:["Card with ",d," background"]})]})},d))})},p={render:()=>e.jsxs(r,{style:{width:"18rem"},children:[e.jsx(Ze,{children:"Featured"}),e.jsxs(t,{children:[e.jsx(a,{children:"Special title treatment"}),e.jsx(s,{children:"With supporting text below as a natural lead-in to additional content."}),e.jsx(b,{variant:"primary",children:"Go somewhere"})]}),e.jsx(er,{className:"text-body-secondary",children:"2 days ago"})]})},h={render:()=>e.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:[e.jsx(r,{href:"#",style:{width:"16rem"},children:e.jsxs(t,{children:[e.jsx(a,{children:"Link Card"}),e.jsx(s,{children:"Click to navigate"})]})}),e.jsx(r,{onClick:()=>alert("Card clicked!"),style:{width:"16rem"},children:e.jsxs(t,{children:[e.jsx(a,{children:"Clickable Card"}),e.jsx(s,{children:"Click to trigger action"})]})})]})},C={render:()=>e.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:[e.jsxs(r,{style:{width:"16rem"},children:[e.jsx(i,{src:l,alt:"Top image",position:"top"}),e.jsxs(t,{children:[e.jsx(a,{children:"Image Top"}),e.jsx(s,{children:"Default position"})]})]}),e.jsxs(r,{style:{width:"16rem"},children:[e.jsxs(t,{children:[e.jsx(a,{children:"Image Bottom"}),e.jsx(s,{children:"Image below content"})]}),e.jsx(i,{src:l,alt:"Bottom image",position:"bottom"})]})]})},x={render:()=>e.jsxs(r,{style:{width:"20rem"},children:[e.jsx(i,{src:l,alt:"Card background",position:"overlay",height:"200px"}),e.jsxs(ar,{className:"d-flex flex-column justify-content-end text-white",children:[e.jsx(a,{children:"Card Title"}),e.jsx(s,{children:"This is a wider card with supporting text below."}),e.jsx(s,{muted:!0,children:"Last updated 3 mins ago"})]})]})},u={render:()=>e.jsxs(r,{horizontal:!0,style:{maxWidth:"540px"},children:[e.jsx(i,{src:l,alt:"Side image",style:{width:"180px",objectFit:"cover"}}),e.jsxs(t,{children:[e.jsx(a,{children:"Horizontal Card"}),e.jsx(s,{children:"This is a horizontal card with content beside the image."}),e.jsx(s,{muted:!0,children:"Last updated 3 mins ago"})]})]})},y={render:()=>e.jsx(r,{style:{width:"18rem"},children:e.jsxs(t,{children:[e.jsx(a,{children:"Card Title"}),e.jsx(s,{children:"Some example text to build on the card title."}),e.jsx(B,{href:"#",children:"Card link"}),e.jsx(B,{href:"#",children:"Another link"})]})})},j={render:()=>e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"1rem"},children:[1,2,3].map(d=>e.jsxs(r,{children:[e.jsx(i,{src:l,alt:`Card ${d} image`}),e.jsxs(t,{children:[e.jsxs(a,{children:["Card ",d]}),e.jsx(s,{children:"Some quick example text."}),e.jsx(b,{variant:"primary",size:"sm",children:"View"})]})]},d))})},g={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"✅ Safe: HTTP/HTTPS links and internal paths work"}),e.jsx(r,{href:"https://example.com",style:{width:"18rem"},children:e.jsxs(t,{children:[e.jsx(a,{children:"External Link"}),e.jsx(s,{children:"This is a safe external link."})]})})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"🛡️ Blocked: Dangerous protocols (javascript:, data:, vbscript:) are safely converted to '#'"}),e.jsx(r,{href:"#",style:{width:"18rem"},children:e.jsxs(t,{children:[e.jsx(a,{children:"Dangerous Protocol Blocked"}),e.jsx(s,{children:"javascript:, data:, vbscript: protocols are blocked for security."})]})})]})]})},T={render:()=>e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-2",children:'External links automatically get rel="noopener noreferrer" for security'}),e.jsxs("div",{style:{display:"flex",gap:"1rem"},children:[e.jsx(r,{href:"https://external.com",style:{width:"18rem"},children:e.jsxs(t,{children:[e.jsx(a,{children:"External Site"}),e.jsx(s,{children:"Opens external link safely with rel attribute."})]})}),e.jsx(r,{href:"/internal",style:{width:"18rem"},children:e.jsxs(t,{children:[e.jsx(a,{children:"Internal Link"}),e.jsx(s,{children:"Internal links don't get rel attribute."})]})})]}),e.jsx("div",{className:"alert alert-info mt-3",children:e.jsxs("small",{children:[e.jsx("strong",{children:"Security:"}),' All external links automatically include rel="noopener noreferrer" to prevent:',e.jsxs("ul",{className:"mb-0 mt-1",children:[e.jsx("li",{children:"window.opener access from target page"}),e.jsx("li",{children:"Referrer information leakage"}),e.jsx("li",{children:"Performance issues"})]})]})})]})},v={render:()=>e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-2",children:"Interactive cards render as semantic buttons with full keyboard support"}),e.jsx(r,{interactive:!0,onClick:()=>alert("Card clicked!"),style:{width:"18rem"},children:e.jsxs(t,{children:[e.jsx(a,{children:"Interactive Card"}),e.jsx(s,{children:"Click me or press Enter/Space. Renders as <button> not <div>."})]})}),e.jsx("div",{className:"alert alert-info mt-3",children:e.jsxs("small",{children:[e.jsx("strong",{children:"Accessibility:"})," Interactive cards without href:",e.jsxs("ul",{className:"mb-0 mt-1",children:[e.jsx("li",{children:"Render as semantic <button> elements"}),e.jsx("li",{children:"Support keyboard navigation (Enter/Space keys)"}),e.jsx("li",{children:"Properly announced by screen readers"}),e.jsx("li",{children:"Full WCAG 2.2 AA compliance"})]})]})})]})},f={render:function(){const[k,rr]=tr.useState(0);return e.jsxs("div",{children:[e.jsxs("small",{className:"text-muted d-block mb-2",children:["Component re-renders: ",k,e.jsx("br",{}),"Card and subcomponents use React.memo + useMemo to prevent unnecessary renders"]}),e.jsx(r,{style:{width:"18rem"},children:e.jsxs(t,{children:[e.jsx(a,{children:"Optimized Card"}),e.jsx(s,{children:"This card uses memoization for performance."}),e.jsxs(b,{variant:"primary",onClick:()=>rr(k+1),children:["Force Parent Re-render (",k,")"]})]})}),e.jsx("div",{className:"alert alert-info mt-3",children:e.jsxs("small",{children:[e.jsx("strong",{children:"Performance:"})," The card component uses React.memo and useMemo hooks to:",e.jsxs("ul",{className:"mb-0 mt-1",children:[e.jsx("li",{children:"Skip re-renders when props haven't changed"}),e.jsx("li",{children:"Cache className and style computations"}),e.jsx("li",{children:"Memoize render functions with useCallback"}),e.jsx("li",{children:"All 9 subcomponents memoized for optimal performance"})]})]})})]})}},w={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"Basic Card"}),e.jsx(r,{style:{width:"18rem"},children:e.jsxs(t,{children:[e.jsx(a,{children:"Card Title"}),e.jsx(s,{children:"Card content goes here."})]})})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"Variants"}),e.jsxs("div",{style:{display:"flex",gap:"1rem"},children:[e.jsx(r,{variant:"elevated",style:{width:"14rem"},children:e.jsx(t,{children:e.jsx(a,{children:"Elevated"})})}),e.jsx(r,{variant:"outlined",style:{width:"14rem"},children:e.jsx(t,{children:e.jsx(a,{children:"Outlined"})})}),e.jsx(r,{variant:"ghost",style:{width:"14rem"},children:e.jsx(t,{children:e.jsx(a,{children:"Ghost"})})})]})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"With Header and Footer"}),e.jsxs(r,{style:{width:"18rem"},children:[e.jsx(Ze,{children:"Header"}),e.jsxs(t,{children:[e.jsx(a,{children:"Title"}),e.jsx(s,{children:"Content"})]}),e.jsx(er,{children:"Footer"})]})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"Color Variants"}),e.jsx("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:["primary","success","danger","warning"].map(d=>e.jsx(r,{color:d,style:{width:"10rem"},children:e.jsx(t,{children:e.jsx(a,{children:d})})},d))})]})]})};var S,I,N,z,H;o.parameters={...o.parameters,docs:{...(S=o.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => <Card style={{
    width: '18rem'
  }}>
      <CardBody>
        <CardTitle>Card Title</CardTitle>
        <CardText>
          Some quick example text to build on the card title and make up the bulk of the card&apos;s
          content.
        </CardText>
        <Button variant="primary">Go somewhere</Button>
      </CardBody>
    </Card>
}`,...(N=(I=o.parameters)==null?void 0:I.docs)==null?void 0:N.source},description:{story:"Basic card with body content",...(H=(z=o.parameters)==null?void 0:z.docs)==null?void 0:H.description}}};var A,F,W,E,P;n.parameters={...n.parameters,docs:{...(A=n.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => <Card style={{
    width: '18rem'
  }}>
      <CardImage src={sampleImage} alt="Colorful gradient background" />
      <CardBody>
        <CardTitle>Card Title</CardTitle>
        <CardText>
          Some quick example text to build on the card title and make up the bulk of the card&apos;s
          content.
        </CardText>
        <Button variant="primary">Go somewhere</Button>
      </CardBody>
    </Card>
}`,...(W=(F=n.parameters)==null?void 0:F.docs)==null?void 0:W.source},description:{story:"Card with image",...(P=(E=n.parameters)==null?void 0:E.docs)==null?void 0:P.description}}};var L,D,G,R,V;c.parameters={...c.parameters,docs:{...(L=c.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  }}>
      <Card variant="elevated" style={{
      width: '16rem'
    }}>
        <CardBody>
          <CardTitle>Elevated</CardTitle>
          <CardText>Card with shadow (default)</CardText>
        </CardBody>
      </Card>
      <Card variant="outlined" style={{
      width: '16rem'
    }}>
        <CardBody>
          <CardTitle>Outlined</CardTitle>
          <CardText>Card with border</CardText>
        </CardBody>
      </Card>
      <Card variant="ghost" style={{
      width: '16rem'
    }}>
        <CardBody>
          <CardTitle>Ghost</CardTitle>
          <CardText>Transparent background</CardText>
        </CardBody>
      </Card>
    </div>
}`,...(G=(D=c.parameters)==null?void 0:D.docs)==null?void 0:G.source},description:{story:"Card variants",...(V=(R=c.parameters)==null?void 0:R.docs)==null?void 0:V.description}}};var O,M,q,U,_;m.parameters={...m.parameters,docs:{...(O=m.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem'
  }}>
      {(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] as const).map(color => <Card key={color} color={color}>
          <CardBody>
            <CardTitle>{color.charAt(0).toUpperCase() + color.slice(1)}</CardTitle>
            <CardText>Card with {color} background</CardText>
          </CardBody>
        </Card>)}
    </div>
}`,...(q=(M=m.parameters)==null?void 0:M.docs)==null?void 0:q.source},description:{story:"Card color variants",...(_=(U=m.parameters)==null?void 0:U.docs)==null?void 0:_.description}}};var $,J,K,Q,X;p.parameters={...p.parameters,docs:{...($=p.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => <Card style={{
    width: '18rem'
  }}>
      <CardHeader>Featured</CardHeader>
      <CardBody>
        <CardTitle>Special title treatment</CardTitle>
        <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
        <Button variant="primary">Go somewhere</Button>
      </CardBody>
      <CardFooter className="text-body-secondary">2 days ago</CardFooter>
    </Card>
}`,...(K=(J=p.parameters)==null?void 0:J.docs)==null?void 0:K.source},description:{story:"Card with header and footer",...(X=(Q=p.parameters)==null?void 0:Q.docs)==null?void 0:X.description}}};var Y,Z,ee,re,ae;h.parameters={...h.parameters,docs:{...(Y=h.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  }}>
      <Card href="#" style={{
      width: '16rem'
    }}>
        <CardBody>
          <CardTitle>Link Card</CardTitle>
          <CardText>Click to navigate</CardText>
        </CardBody>
      </Card>
      <Card onClick={() => alert('Card clicked!')} style={{
      width: '16rem'
    }}>
        <CardBody>
          <CardTitle>Clickable Card</CardTitle>
          <CardText>Click to trigger action</CardText>
        </CardBody>
      </Card>
    </div>
}`,...(ee=(Z=h.parameters)==null?void 0:Z.docs)==null?void 0:ee.source},description:{story:"Interactive (clickable) cards",...(ae=(re=h.parameters)==null?void 0:re.docs)==null?void 0:ae.description}}};var te,se,de,ie,le;C.parameters={...C.parameters,docs:{...(te=C.parameters)==null?void 0:te.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  }}>
      <Card style={{
      width: '16rem'
    }}>
        <CardImage src={sampleImage} alt="Top image" position="top" />
        <CardBody>
          <CardTitle>Image Top</CardTitle>
          <CardText>Default position</CardText>
        </CardBody>
      </Card>
      <Card style={{
      width: '16rem'
    }}>
        <CardBody>
          <CardTitle>Image Bottom</CardTitle>
          <CardText>Image below content</CardText>
        </CardBody>
        <CardImage src={sampleImage} alt="Bottom image" position="bottom" />
      </Card>
    </div>
}`,...(de=(se=C.parameters)==null?void 0:se.docs)==null?void 0:de.source},description:{story:"Card image positions",...(le=(ie=C.parameters)==null?void 0:ie.docs)==null?void 0:le.description}}};var oe,ne,ce,me,pe;x.parameters={...x.parameters,docs:{...(oe=x.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  render: () => <Card style={{
    width: '20rem'
  }}>
      <CardImage src={sampleImage} alt="Card background" position="overlay" height="200px" />
      <CardImgOverlay className="d-flex flex-column justify-content-end text-white">
        <CardTitle>Card Title</CardTitle>
        <CardText>This is a wider card with supporting text below.</CardText>
        <CardText muted>Last updated 3 mins ago</CardText>
      </CardImgOverlay>
    </Card>
}`,...(ce=(ne=x.parameters)==null?void 0:ne.docs)==null?void 0:ce.source},description:{story:"Card with image overlay",...(pe=(me=x.parameters)==null?void 0:me.docs)==null?void 0:pe.description}}};var he,Ce,xe,ue,ye;u.parameters={...u.parameters,docs:{...(he=u.parameters)==null?void 0:he.docs,source:{originalSource:`{
  render: () => <Card horizontal style={{
    maxWidth: '540px'
  }}>
      <CardImage src={sampleImage} alt="Side image" style={{
      width: '180px',
      objectFit: 'cover'
    }} />
      <CardBody>
        <CardTitle>Horizontal Card</CardTitle>
        <CardText>This is a horizontal card with content beside the image.</CardText>
        <CardText muted>Last updated 3 mins ago</CardText>
      </CardBody>
    </Card>
}`,...(xe=(Ce=u.parameters)==null?void 0:Ce.docs)==null?void 0:xe.source},description:{story:"Horizontal card layout",...(ye=(ue=u.parameters)==null?void 0:ue.docs)==null?void 0:ye.description}}};var je,ge,Te,ve,fe;y.parameters={...y.parameters,docs:{...(je=y.parameters)==null?void 0:je.docs,source:{originalSource:`{
  render: () => <Card style={{
    width: '18rem'
  }}>
      <CardBody>
        <CardTitle>Card Title</CardTitle>
        <CardText>Some example text to build on the card title.</CardText>
        <CardLink href="#">Card link</CardLink>
        <CardLink href="#">Another link</CardLink>
      </CardBody>
    </Card>
}`,...(Te=(ge=y.parameters)==null?void 0:ge.docs)==null?void 0:Te.source},description:{story:"Card with links",...(fe=(ve=y.parameters)==null?void 0:ve.docs)==null?void 0:fe.description}}};var we,be,ke,Be,Se;j.parameters={...j.parameters,docs:{...(we=j.parameters)==null?void 0:we.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem'
  }}>
      {[1, 2, 3].map(i => <Card key={i}>
          <CardImage src={sampleImage} alt={\`Card \${i} image\`} />
          <CardBody>
            <CardTitle>Card {i}</CardTitle>
            <CardText>Some quick example text.</CardText>
            <Button variant="primary" size="sm">
              View
            </Button>
          </CardBody>
        </Card>)}
    </div>
}`,...(ke=(be=j.parameters)==null?void 0:be.docs)==null?void 0:ke.source},description:{story:"Multiple cards in a grid",...(Se=(Be=j.parameters)==null?void 0:Be.docs)==null?void 0:Se.description}}};var Ie,Ne,ze,He,Ae;g.parameters={...g.parameters,docs:{...(Ie=g.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <div>
        <small className="text-muted d-block mb-1">
          ✅ Safe: HTTP/HTTPS links and internal paths work
        </small>
        <Card href="https://example.com" style={{
        width: '18rem'
      }}>
          <CardBody>
            <CardTitle>External Link</CardTitle>
            <CardText>This is a safe external link.</CardText>
          </CardBody>
        </Card>
      </div>
      <div>
        <small className="text-muted d-block mb-1">
          🛡️ Blocked: Dangerous protocols (javascript:, data:, vbscript:) are safely converted to
          '#'
        </small>
        <Card href="#" style={{
        width: '18rem'
      }}>
          <CardBody>
            <CardTitle>Dangerous Protocol Blocked</CardTitle>
            <CardText>javascript:, data:, vbscript: protocols are blocked for security.</CardText>
          </CardBody>
        </Card>
      </div>
    </div>
}`,...(ze=(Ne=g.parameters)==null?void 0:Ne.docs)==null?void 0:ze.source},description:{story:`Demonstrates security validation - dangerous protocols are blocked
and converted to safe '#' fallback`,...(Ae=(He=g.parameters)==null?void 0:He.docs)==null?void 0:Ae.description}}};var Fe,We,Ee,Pe,Le;T.parameters={...T.parameters,docs:{...(Fe=T.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
  render: () => <div>
      <small className="text-muted d-block mb-2">
        External links automatically get rel="noopener noreferrer" for security
      </small>
      <div style={{
      display: 'flex',
      gap: '1rem'
    }}>
        <Card href="https://external.com" style={{
        width: '18rem'
      }}>
          <CardBody>
            <CardTitle>External Site</CardTitle>
            <CardText>Opens external link safely with rel attribute.</CardText>
          </CardBody>
        </Card>
        <Card href="/internal" style={{
        width: '18rem'
      }}>
          <CardBody>
            <CardTitle>Internal Link</CardTitle>
            <CardText>Internal links don&apos;t get rel attribute.</CardText>
          </CardBody>
        </Card>
      </div>
      <div className="alert alert-info mt-3">
        <small>
          <strong>Security:</strong> All external links automatically include rel="noopener
          noreferrer" to prevent:
          <ul className="mb-0 mt-1">
            <li>window.opener access from target page</li>
            <li>Referrer information leakage</li>
            <li>Performance issues</li>
          </ul>
        </small>
      </div>
    </div>
}`,...(Ee=(We=T.parameters)==null?void 0:We.docs)==null?void 0:Ee.source},description:{story:"Demonstrates automatic rel attribute for external links",...(Le=(Pe=T.parameters)==null?void 0:Pe.docs)==null?void 0:Le.description}}};var De,Ge,Re,Ve,Oe;v.parameters={...v.parameters,docs:{...(De=v.parameters)==null?void 0:De.docs,source:{originalSource:`{
  render: () => <div>
      <small className="text-muted d-block mb-2">
        Interactive cards render as semantic buttons with full keyboard support
      </small>
      <Card interactive onClick={() => alert('Card clicked!')} style={{
      width: '18rem'
    }}>
        <CardBody>
          <CardTitle>Interactive Card</CardTitle>
          <CardText>
            Click me or press Enter/Space. Renders as &lt;button&gt; not &lt;div&gt;.
          </CardText>
        </CardBody>
      </Card>
      <div className="alert alert-info mt-3">
        <small>
          <strong>Accessibility:</strong> Interactive cards without href:
          <ul className="mb-0 mt-1">
            <li>Render as semantic &lt;button&gt; elements</li>
            <li>Support keyboard navigation (Enter/Space keys)</li>
            <li>Properly announced by screen readers</li>
            <li>Full WCAG 2.2 AA compliance</li>
          </ul>
        </small>
      </div>
    </div>
}`,...(Re=(Ge=v.parameters)==null?void 0:Ge.docs)==null?void 0:Re.source},description:{story:"Demonstrates interactive cards with keyboard support",...(Oe=(Ve=v.parameters)==null?void 0:Ve.docs)==null?void 0:Oe.description}}};var Me,qe,Ue,_e,$e;f.parameters={...f.parameters,docs:{...(Me=f.parameters)==null?void 0:Me.docs,source:{originalSource:`{
  render: function PerformanceCard() {
    const [counter, setCounter] = useState(0);
    return <div>
        <small className="text-muted d-block mb-2">
          Component re-renders: {counter}
          <br />
          Card and subcomponents use React.memo + useMemo to prevent unnecessary renders
        </small>
        <Card style={{
        width: '18rem'
      }}>
          <CardBody>
            <CardTitle>Optimized Card</CardTitle>
            <CardText>This card uses memoization for performance.</CardText>
            <Button variant="primary" onClick={() => setCounter(counter + 1)}>
              Force Parent Re-render ({counter})
            </Button>
          </CardBody>
        </Card>
        <div className="alert alert-info mt-3">
          <small>
            <strong>Performance:</strong> The card component uses React.memo and useMemo hooks to:
            <ul className="mb-0 mt-1">
              <li>Skip re-renders when props haven&apos;t changed</li>
              <li>Cache className and style computations</li>
              <li>Memoize render functions with useCallback</li>
              <li>All 9 subcomponents memoized for optimal performance</li>
            </ul>
          </small>
        </div>
      </div>;
  }
}`,...(Ue=(qe=f.parameters)==null?void 0:qe.docs)==null?void 0:Ue.source},description:{story:"Demonstrates performance optimizations through memoization",...($e=(_e=f.parameters)==null?void 0:_e.docs)==null?void 0:$e.description}}};var Je,Ke,Qe,Xe,Ye;w.parameters={...w.parameters,docs:{...(Je=w.parameters)==null?void 0:Je.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }}>
      {/* Basic */}
      <section>
        <h5 className="mb-2">Basic Card</h5>
        <Card style={{
        width: '18rem'
      }}>
          <CardBody>
            <CardTitle>Card Title</CardTitle>
            <CardText>Card content goes here.</CardText>
          </CardBody>
        </Card>
      </section>

      {/* Variants */}
      <section>
        <h5 className="mb-2">Variants</h5>
        <div style={{
        display: 'flex',
        gap: '1rem'
      }}>
          <Card variant="elevated" style={{
          width: '14rem'
        }}>
            <CardBody>
              <CardTitle>Elevated</CardTitle>
            </CardBody>
          </Card>
          <Card variant="outlined" style={{
          width: '14rem'
        }}>
            <CardBody>
              <CardTitle>Outlined</CardTitle>
            </CardBody>
          </Card>
          <Card variant="ghost" style={{
          width: '14rem'
        }}>
            <CardBody>
              <CardTitle>Ghost</CardTitle>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* With Header/Footer */}
      <section>
        <h5 className="mb-2">With Header and Footer</h5>
        <Card style={{
        width: '18rem'
      }}>
          <CardHeader>Header</CardHeader>
          <CardBody>
            <CardTitle>Title</CardTitle>
            <CardText>Content</CardText>
          </CardBody>
          <CardFooter>Footer</CardFooter>
        </Card>
      </section>

      {/* Colors */}
      <section>
        <h5 className="mb-2">Color Variants</h5>
        <div style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
          {(['primary', 'success', 'danger', 'warning'] as const).map(color => <Card key={color} color={color} style={{
          width: '10rem'
        }}>
              <CardBody>
                <CardTitle>{color}</CardTitle>
              </CardBody>
            </Card>)}
        </div>
      </section>
    </div>
}`,...(Qe=(Ke=w.parameters)==null?void 0:Ke.docs)==null?void 0:Qe.source},description:{story:"Complete card showcase",...(Ye=(Xe=w.parameters)==null?void 0:Xe.docs)==null?void 0:Ye.description}}};const nr=["Default","WithImage","Variants","ColorVariants","WithHeaderAndFooter","Interactive","ImagePositions","ImageOverlay","Horizontal","WithLinks","CardGrid","SecurityHREFValidation","SecurityExternalLinks","AccessibilityInteractive","PerformanceMemoization","CompleteShowcase"];export{v as AccessibilityInteractive,j as CardGrid,m as ColorVariants,w as CompleteShowcase,o as Default,u as Horizontal,x as ImageOverlay,C as ImagePositions,h as Interactive,f as PerformanceMemoization,T as SecurityExternalLinks,g as SecurityHREFValidation,c as Variants,p as WithHeaderAndFooter,n as WithImage,y as WithLinks,nr as __namedExportsOrder,or as default};
