import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{C as r,d as t,e as a,f as d,B as T,g as i,h as Se,i as We,j as He,k as w}from"./Tabs-Ct9YirVA.js";import"./iframe-BooCaz94.js";import"./preload-helper-Dp1pzeXC.js";const Ge={title:"Components/Card",component:r,parameters:{layout:"padded",docs:{description:{component:"A flexible content container with multiple subcomponents (Header, Body, Footer, Image) supporting various layouts and interactions."}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["elevated","outlined","ghost"],description:"Card variant",table:{type:{summary:"'elevated' | 'outlined' | 'ghost'"},defaultValue:{summary:"elevated"}}},color:{control:"select",options:[void 0,"primary","secondary","success","danger","warning","info","light","dark"],description:"Background color variant",table:{type:{summary:"CardColor"}}},horizontal:{control:"boolean",description:"Horizontal layout",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}}},o="/assets/card-sample.jpg",l={render:()=>e.jsx(r,{style:{width:"18rem"},children:e.jsxs(t,{children:[e.jsx(a,{children:"Card Title"}),e.jsx(d,{children:"Some quick example text to build on the card title and make up the bulk of the card's content."}),e.jsx(T,{variant:"primary",children:"Go somewhere"})]})})},n={render:()=>e.jsxs(r,{style:{width:"18rem"},children:[e.jsx(i,{src:o,alt:"Colorful gradient background"}),e.jsxs(t,{children:[e.jsx(a,{children:"Card Title"}),e.jsx(d,{children:"Some quick example text to build on the card title and make up the bulk of the card's content."}),e.jsx(T,{variant:"primary",children:"Go somewhere"})]})]})},c={render:()=>e.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"elevated",style:{width:"16rem"},children:e.jsxs(t,{children:[e.jsx(a,{children:"Elevated"}),e.jsx(d,{children:"Card with shadow (default)"})]})}),e.jsx(r,{variant:"outlined",style:{width:"16rem"},children:e.jsxs(t,{children:[e.jsx(a,{children:"Outlined"}),e.jsx(d,{children:"Card with border"})]})}),e.jsx(r,{variant:"ghost",style:{width:"16rem"},children:e.jsxs(t,{children:[e.jsx(a,{children:"Ghost"}),e.jsx(d,{children:"Transparent background"})]})})]})},m={render:()=>e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:"1rem"},children:["primary","secondary","success","danger","warning","info","light","dark"].map(s=>e.jsx(r,{color:s,children:e.jsxs(t,{children:[e.jsx(a,{children:s.charAt(0).toUpperCase()+s.slice(1)}),e.jsxs(d,{children:["Card with ",s," background"]})]})},s))})},C={render:()=>e.jsxs(r,{style:{width:"18rem"},children:[e.jsx(Se,{children:"Featured"}),e.jsxs(t,{children:[e.jsx(a,{children:"Special title treatment"}),e.jsx(d,{children:"With supporting text below as a natural lead-in to additional content."}),e.jsx(T,{variant:"primary",children:"Go somewhere"})]}),e.jsx(We,{className:"text-body-secondary",children:"2 days ago"})]})},h={render:()=>e.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:[e.jsx(r,{href:"#",style:{width:"16rem"},children:e.jsxs(t,{children:[e.jsx(a,{children:"Link Card"}),e.jsx(d,{children:"Click to navigate"})]})}),e.jsx(r,{onClick:()=>alert("Card clicked!"),style:{width:"16rem"},children:e.jsxs(t,{children:[e.jsx(a,{children:"Clickable Card"}),e.jsx(d,{children:"Click to trigger action"})]})})]})},p={render:()=>e.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:[e.jsxs(r,{style:{width:"16rem"},children:[e.jsx(i,{src:o,alt:"Top image",position:"top"}),e.jsxs(t,{children:[e.jsx(a,{children:"Image Top"}),e.jsx(d,{children:"Default position"})]})]}),e.jsxs(r,{style:{width:"16rem"},children:[e.jsxs(t,{children:[e.jsx(a,{children:"Image Bottom"}),e.jsx(d,{children:"Image below content"})]}),e.jsx(i,{src:o,alt:"Bottom image",position:"bottom"})]})]})},x={render:()=>e.jsxs(r,{style:{width:"20rem"},children:[e.jsx(i,{src:o,alt:"Card background",position:"overlay",height:"200px"}),e.jsxs(He,{className:"d-flex flex-column justify-content-end text-white",children:[e.jsx(a,{children:"Card Title"}),e.jsx(d,{children:"This is a wider card with supporting text below."}),e.jsx(d,{muted:!0,children:"Last updated 3 mins ago"})]})]})},y={render:()=>e.jsxs(r,{horizontal:!0,style:{maxWidth:"540px"},children:[e.jsx(i,{src:o,alt:"Side image",style:{width:"180px",objectFit:"cover"}}),e.jsxs(t,{children:[e.jsx(a,{children:"Horizontal Card"}),e.jsx(d,{children:"This is a horizontal card with content beside the image."}),e.jsx(d,{muted:!0,children:"Last updated 3 mins ago"})]})]})},u={render:()=>e.jsx(r,{style:{width:"18rem"},children:e.jsxs(t,{children:[e.jsx(a,{children:"Card Title"}),e.jsx(d,{children:"Some example text to build on the card title."}),e.jsx(w,{href:"#",children:"Card link"}),e.jsx(w,{href:"#",children:"Another link"})]})})},g={render:()=>e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"1rem"},children:[1,2,3].map(s=>e.jsxs(r,{children:[e.jsx(i,{src:o,alt:`Card ${s} image`}),e.jsxs(t,{children:[e.jsxs(a,{children:["Card ",s]}),e.jsx(d,{children:"Some quick example text."}),e.jsx(T,{variant:"primary",size:"sm",children:"View"})]})]},s))})},j={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"Basic Card"}),e.jsx(r,{style:{width:"18rem"},children:e.jsxs(t,{children:[e.jsx(a,{children:"Card Title"}),e.jsx(d,{children:"Card content goes here."})]})})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"Variants"}),e.jsxs("div",{style:{display:"flex",gap:"1rem"},children:[e.jsx(r,{variant:"elevated",style:{width:"14rem"},children:e.jsx(t,{children:e.jsx(a,{children:"Elevated"})})}),e.jsx(r,{variant:"outlined",style:{width:"14rem"},children:e.jsx(t,{children:e.jsx(a,{children:"Outlined"})})}),e.jsx(r,{variant:"ghost",style:{width:"14rem"},children:e.jsx(t,{children:e.jsx(a,{children:"Ghost"})})})]})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"With Header and Footer"}),e.jsxs(r,{style:{width:"18rem"},children:[e.jsx(Se,{children:"Header"}),e.jsxs(t,{children:[e.jsx(a,{children:"Title"}),e.jsx(d,{children:"Content"})]}),e.jsx(We,{children:"Footer"})]})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"Color Variants"}),e.jsx("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:["primary","success","danger","warning"].map(s=>e.jsx(r,{color:s,style:{width:"10rem"},children:e.jsx(t,{children:e.jsx(a,{children:s})})},s))})]})]})};var v,f,B,k,b;l.parameters={...l.parameters,docs:{...(v=l.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <Card style={{
    width: '18rem'
  }}>
      <CardBody>
        <CardTitle>Card Title</CardTitle>
        <CardText>Some quick example text to build on the card title and make up the bulk of the card&apos;s content.</CardText>
        <Button variant="primary">Go somewhere</Button>
      </CardBody>
    </Card>
}`,...(B=(f=l.parameters)==null?void 0:f.docs)==null?void 0:B.source},description:{story:"Basic card with body content",...(b=(k=l.parameters)==null?void 0:k.docs)==null?void 0:b.description}}};var I,S,W,H,F;n.parameters={...n.parameters,docs:{...(I=n.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <Card style={{
    width: '18rem'
  }}>
      <CardImage src={sampleImage} alt="Colorful gradient background" />
      <CardBody>
        <CardTitle>Card Title</CardTitle>
        <CardText>Some quick example text to build on the card title and make up the bulk of the card&apos;s content.</CardText>
        <Button variant="primary">Go somewhere</Button>
      </CardBody>
    </Card>
}`,...(W=(S=n.parameters)==null?void 0:S.docs)==null?void 0:W.source},description:{story:"Card with image",...(F=(H=n.parameters)==null?void 0:H.docs)==null?void 0:F.description}}};var z,L,V,G,N;c.parameters={...c.parameters,docs:{...(z=c.parameters)==null?void 0:z.docs,source:{originalSource:`{
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
}`,...(V=(L=c.parameters)==null?void 0:L.docs)==null?void 0:V.source},description:{story:"Card variants",...(N=(G=c.parameters)==null?void 0:G.docs)==null?void 0:N.description}}};var O,A,q,D,E;m.parameters={...m.parameters,docs:{...(O=m.parameters)==null?void 0:O.docs,source:{originalSource:`{
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
}`,...(q=(A=m.parameters)==null?void 0:A.docs)==null?void 0:q.source},description:{story:"Card color variants",...(E=(D=m.parameters)==null?void 0:D.docs)==null?void 0:E.description}}};var P,U,_,$,M;C.parameters={...C.parameters,docs:{...(P=C.parameters)==null?void 0:P.docs,source:{originalSource:`{
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
}`,...(_=(U=C.parameters)==null?void 0:U.docs)==null?void 0:_.source},description:{story:"Card with header and footer",...(M=($=C.parameters)==null?void 0:$.docs)==null?void 0:M.description}}};var R,J,K,Q,X;h.parameters={...h.parameters,docs:{...(R=h.parameters)==null?void 0:R.docs,source:{originalSource:`{
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
}`,...(K=(J=h.parameters)==null?void 0:J.docs)==null?void 0:K.source},description:{story:"Interactive (clickable) cards",...(X=(Q=h.parameters)==null?void 0:Q.docs)==null?void 0:X.description}}};var Y,Z,ee,re,ae;p.parameters={...p.parameters,docs:{...(Y=p.parameters)==null?void 0:Y.docs,source:{originalSource:`{
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
}`,...(ee=(Z=p.parameters)==null?void 0:Z.docs)==null?void 0:ee.source},description:{story:"Card image positions",...(ae=(re=p.parameters)==null?void 0:re.docs)==null?void 0:ae.description}}};var te,de,se,ie,oe;x.parameters={...x.parameters,docs:{...(te=x.parameters)==null?void 0:te.docs,source:{originalSource:`{
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
}`,...(se=(de=x.parameters)==null?void 0:de.docs)==null?void 0:se.source},description:{story:"Card with image overlay",...(oe=(ie=x.parameters)==null?void 0:ie.docs)==null?void 0:oe.description}}};var le,ne,ce,me,Ce;y.parameters={...y.parameters,docs:{...(le=y.parameters)==null?void 0:le.docs,source:{originalSource:`{
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
}`,...(ce=(ne=y.parameters)==null?void 0:ne.docs)==null?void 0:ce.source},description:{story:"Horizontal card layout",...(Ce=(me=y.parameters)==null?void 0:me.docs)==null?void 0:Ce.description}}};var he,pe,xe,ye,ue;u.parameters={...u.parameters,docs:{...(he=u.parameters)==null?void 0:he.docs,source:{originalSource:`{
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
}`,...(xe=(pe=u.parameters)==null?void 0:pe.docs)==null?void 0:xe.source},description:{story:"Card with links",...(ue=(ye=u.parameters)==null?void 0:ye.docs)==null?void 0:ue.description}}};var ge,je,Te,we,ve;g.parameters={...g.parameters,docs:{...(ge=g.parameters)==null?void 0:ge.docs,source:{originalSource:`{
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
}`,...(Te=(je=g.parameters)==null?void 0:je.docs)==null?void 0:Te.source},description:{story:"Multiple cards in a grid",...(ve=(we=g.parameters)==null?void 0:we.docs)==null?void 0:ve.description}}};var fe,Be,ke,be,Ie;j.parameters={...j.parameters,docs:{...(fe=j.parameters)==null?void 0:fe.docs,source:{originalSource:`{
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
}`,...(ke=(Be=j.parameters)==null?void 0:Be.docs)==null?void 0:ke.source},description:{story:"Complete card showcase",...(Ie=(be=j.parameters)==null?void 0:be.docs)==null?void 0:Ie.description}}};const Ne=["Default","WithImage","Variants","ColorVariants","WithHeaderAndFooter","Interactive","ImagePositions","ImageOverlay","Horizontal","WithLinks","CardGrid","CompleteShowcase"];export{g as CardGrid,m as ColorVariants,j as CompleteShowcase,l as Default,y as Horizontal,x as ImageOverlay,p as ImagePositions,h as Interactive,c as Variants,C as WithHeaderAndFooter,n as WithImage,u as WithLinks,Ne as __namedExportsOrder,Ge as default};
