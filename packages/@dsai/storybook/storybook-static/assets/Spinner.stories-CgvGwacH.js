import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{S as e,B as a}from"./Progress-n23qFfnJ.js";import"./iframe-DkN6Y3DY.js";import"./preload-helper-Dp1pzeXC.js";const ee={title:"Components/Spinner",component:e,parameters:{layout:"centered",docs:{description:{component:"A Bootstrap 5 spinner component for indicating loading states. Fully accessible with proper ARIA attributes and respects reduced motion preferences."}}},tags:["autodocs"],argTypes:{animation:{control:"select",options:["border","grow"],description:"Spinner animation type",table:{type:{summary:"SpinnerAnimation"},defaultValue:{summary:"border"}}},size:{control:"select",options:["sm","md"],description:"Spinner size",table:{type:{summary:"SpinnerSize"},defaultValue:{summary:"md"}}},variant:{control:"select",options:[void 0,"primary","secondary","success","danger","warning","info","light","dark"],description:"Spinner color variant",table:{type:{summary:"SpinnerVariant"},defaultValue:{summary:"undefined"}}},label:{control:"text",description:"Accessible label for screen readers",table:{type:{summary:"string"},defaultValue:{summary:"Loading..."}}},as:{control:"select",options:["div","span"],description:"Element to render as",table:{type:{summary:"div | span"},defaultValue:{summary:"div"}}}}},s={args:{}},n={args:{animation:"border"}},i={args:{animation:"grow"}},t={args:{size:"sm"}},o={args:{animation:"grow",size:"sm"}},d={args:{variant:"primary"}},c={args:{variant:"secondary"}},p={args:{variant:"success"}},m={args:{variant:"danger"}},l={render:()=>r.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:[r.jsx(e,{variant:"primary"}),r.jsx(e,{variant:"secondary"}),r.jsx(e,{variant:"success"}),r.jsx(e,{variant:"danger"}),r.jsx(e,{variant:"warning"}),r.jsx(e,{variant:"info"}),r.jsx(e,{variant:"light"}),r.jsx(e,{variant:"dark"})]})},u={render:()=>r.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:[r.jsx(e,{animation:"grow",variant:"primary"}),r.jsx(e,{animation:"grow",variant:"secondary"}),r.jsx(e,{animation:"grow",variant:"success"}),r.jsx(e,{animation:"grow",variant:"danger"}),r.jsx(e,{animation:"grow",variant:"warning"}),r.jsx(e,{animation:"grow",variant:"info"}),r.jsx(e,{animation:"grow",variant:"light"}),r.jsx(e,{animation:"grow",variant:"dark"})]})},g={render:()=>r.jsxs(a,{variant:"primary",disabled:!0,children:[r.jsx(e,{as:"span",size:"sm",className:"me-2",label:"Loading"}),"Loading..."]})},y={render:()=>r.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:[r.jsxs(a,{variant:"primary",disabled:!0,children:[r.jsx(e,{as:"span",size:"sm",className:"me-2"}),"Primary"]}),r.jsxs(a,{variant:"secondary",disabled:!0,children:[r.jsx(e,{as:"span",size:"sm",className:"me-2"}),"Secondary"]}),r.jsxs(a,{variant:"success",disabled:!0,children:[r.jsx(e,{as:"span",size:"sm",className:"me-2"}),"Success"]}),r.jsxs(a,{variant:"danger",disabled:!0,children:[r.jsx(e,{as:"span",size:"sm",className:"me-2"}),"Danger"]})]})},v={render:()=>r.jsxs("div",{style:{display:"flex",gap:"1rem"},children:[r.jsx(a,{variant:"primary",disabled:!0,"aria-label":"Loading",children:r.jsx(e,{as:"span",size:"sm",label:"Loading"})}),r.jsx(a,{variant:"outline-primary",disabled:!0,"aria-label":"Loading",children:r.jsx(e,{as:"span",size:"sm",label:"Loading"})})]})},S={render:()=>r.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[r.jsx(e,{style:{width:"1rem",height:"1rem"}}),r.jsx(e,{style:{width:"2rem",height:"2rem"}}),r.jsx(e,{style:{width:"3rem",height:"3rem"}}),r.jsx(e,{style:{width:"4rem",height:"4rem"}})]})},x={render:()=>r.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"1rem",padding:"2rem"},children:[r.jsx(e,{variant:"primary"}),r.jsx("span",{children:"Loading content..."})]}),parameters:{layout:"padded"}},w={render:()=>r.jsx("div",{className:"d-flex justify-content-center",style:{width:"200px"},children:r.jsx(e,{variant:"primary"})})};var f,j,h,b,B;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {}
}`,...(h=(j=s.parameters)==null?void 0:j.docs)==null?void 0:h.source},description:{story:"Default border spinner",...(B=(b=s.parameters)==null?void 0:b.docs)==null?void 0:B.description}}};var z,L,A,N,C;n.parameters={...n.parameters,docs:{...(z=n.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    animation: 'border'
  }
}`,...(A=(L=n.parameters)==null?void 0:L.docs)==null?void 0:A.source},description:{story:"Border spinner - rotating border animation",...(C=(N=n.parameters)==null?void 0:N.docs)==null?void 0:C.description}}};var D,I,V,G,W;i.parameters={...i.parameters,docs:{...(D=i.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    animation: 'grow'
  }
}`,...(V=(I=i.parameters)==null?void 0:I.docs)==null?void 0:V.source},description:{story:"Growing spinner - pulsing animation",...(W=(G=i.parameters)==null?void 0:G.docs)==null?void 0:W.description}}};var k,P,F,E,O;t.parameters={...t.parameters,docs:{...(k=t.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    size: 'sm'
  }
}`,...(F=(P=t.parameters)==null?void 0:P.docs)==null?void 0:F.source},description:{story:"Small spinner - useful for buttons and inline loading",...(O=(E=t.parameters)==null?void 0:E.docs)==null?void 0:O.description}}};var R,_,T,q,H;o.parameters={...o.parameters,docs:{...(R=o.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    animation: 'grow',
    size: 'sm'
  }
}`,...(T=(_=o.parameters)==null?void 0:_.docs)==null?void 0:T.source},description:{story:"Small growing spinner",...(H=(q=o.parameters)==null?void 0:q.docs)==null?void 0:H.description}}};var J,K,M,Q,U;d.parameters={...d.parameters,docs:{...(J=d.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    variant: 'primary'
  }
}`,...(M=(K=d.parameters)==null?void 0:K.docs)==null?void 0:M.source},description:{story:"Primary colored spinner",...(U=(Q=d.parameters)==null?void 0:Q.docs)==null?void 0:U.description}}};var X,Y,Z,$,rr;c.parameters={...c.parameters,docs:{...(X=c.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    variant: 'secondary'
  }
}`,...(Z=(Y=c.parameters)==null?void 0:Y.docs)==null?void 0:Z.source},description:{story:"Secondary colored spinner",...(rr=($=c.parameters)==null?void 0:$.docs)==null?void 0:rr.description}}};var er,ar,sr,nr,ir;p.parameters={...p.parameters,docs:{...(er=p.parameters)==null?void 0:er.docs,source:{originalSource:`{
  args: {
    variant: 'success'
  }
}`,...(sr=(ar=p.parameters)==null?void 0:ar.docs)==null?void 0:sr.source},description:{story:"Success colored spinner",...(ir=(nr=p.parameters)==null?void 0:nr.docs)==null?void 0:ir.description}}};var tr,or,dr,cr,pr;m.parameters={...m.parameters,docs:{...(tr=m.parameters)==null?void 0:tr.docs,source:{originalSource:`{
  args: {
    variant: 'danger'
  }
}`,...(dr=(or=m.parameters)==null?void 0:or.docs)==null?void 0:dr.source},description:{story:"Danger colored spinner",...(pr=(cr=m.parameters)==null?void 0:cr.docs)==null?void 0:pr.description}}};var mr,lr,ur,gr,yr;l.parameters={...l.parameters,docs:{...(mr=l.parameters)==null?void 0:mr.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  }}>
      <Spinner variant="primary" />
      <Spinner variant="secondary" />
      <Spinner variant="success" />
      <Spinner variant="danger" />
      <Spinner variant="warning" />
      <Spinner variant="info" />
      <Spinner variant="light" />
      <Spinner variant="dark" />
    </div>
}`,...(ur=(lr=l.parameters)==null?void 0:lr.docs)==null?void 0:ur.source},description:{story:"All color variants",...(yr=(gr=l.parameters)==null?void 0:gr.docs)==null?void 0:yr.description}}};var vr,Sr,xr,wr,fr;u.parameters={...u.parameters,docs:{...(vr=u.parameters)==null?void 0:vr.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  }}>
      <Spinner animation="grow" variant="primary" />
      <Spinner animation="grow" variant="secondary" />
      <Spinner animation="grow" variant="success" />
      <Spinner animation="grow" variant="danger" />
      <Spinner animation="grow" variant="warning" />
      <Spinner animation="grow" variant="info" />
      <Spinner animation="grow" variant="light" />
      <Spinner animation="grow" variant="dark" />
    </div>
}`,...(xr=(Sr=u.parameters)==null?void 0:Sr.docs)==null?void 0:xr.source},description:{story:"All grow color variants",...(fr=(wr=u.parameters)==null?void 0:wr.docs)==null?void 0:fr.description}}};var jr,hr,br,Br,zr;g.parameters={...g.parameters,docs:{...(jr=g.parameters)==null?void 0:jr.docs,source:{originalSource:`{
  render: () => <Button variant="primary" disabled>
      <Spinner as="span" size="sm" className="me-2" label="Loading" />
      Loading...
    </Button>
}`,...(br=(hr=g.parameters)==null?void 0:hr.docs)==null?void 0:br.source},description:{story:"Spinner inside a button - loading state",...(zr=(Br=g.parameters)==null?void 0:Br.docs)==null?void 0:zr.description}}};var Lr,Ar,Nr,Cr,Dr;y.parameters={...y.parameters,docs:{...(Lr=y.parameters)==null?void 0:Lr.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  }}>
      <Button variant="primary" disabled>
        <Spinner as="span" size="sm" className="me-2" />
        Primary
      </Button>
      <Button variant="secondary" disabled>
        <Spinner as="span" size="sm" className="me-2" />
        Secondary
      </Button>
      <Button variant="success" disabled>
        <Spinner as="span" size="sm" className="me-2" />
        Success
      </Button>
      <Button variant="danger" disabled>
        <Spinner as="span" size="sm" className="me-2" />
        Danger
      </Button>
    </div>
}`,...(Nr=(Ar=y.parameters)==null?void 0:Ar.docs)==null?void 0:Nr.source},description:{story:"Spinner inside different button variants",...(Dr=(Cr=y.parameters)==null?void 0:Cr.docs)==null?void 0:Dr.description}}};var Ir,Vr,Gr,Wr,kr;v.parameters={...v.parameters,docs:{...(Ir=v.parameters)==null?void 0:Ir.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '1rem'
  }}>
      <Button variant="primary" disabled aria-label="Loading">
        <Spinner as="span" size="sm" label="Loading" />
      </Button>
      <Button variant="outline-primary" disabled aria-label="Loading">
        <Spinner as="span" size="sm" label="Loading" />
      </Button>
    </div>
}`,...(Gr=(Vr=v.parameters)==null?void 0:Vr.docs)==null?void 0:Gr.source},description:{story:"Spinner only button (no text)",...(kr=(Wr=v.parameters)==null?void 0:Wr.docs)==null?void 0:kr.description}}};var Pr,Fr,Er,Or,Rr;S.parameters={...S.parameters,docs:{...(Pr=S.parameters)==null?void 0:Pr.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  }}>
      <Spinner style={{
      width: '1rem',
      height: '1rem'
    }} />
      <Spinner style={{
      width: '2rem',
      height: '2rem'
    }} />
      <Spinner style={{
      width: '3rem',
      height: '3rem'
    }} />
      <Spinner style={{
      width: '4rem',
      height: '4rem'
    }} />
    </div>
}`,...(Er=(Fr=S.parameters)==null?void 0:Fr.docs)==null?void 0:Er.source},description:{story:"Custom sized spinner using inline styles",...(Rr=(Or=S.parameters)==null?void 0:Or.docs)==null?void 0:Rr.description}}};var _r,Tr,qr,Hr,Jr;x.parameters={...x.parameters,docs:{...(_r=x.parameters)==null?void 0:_r.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '2rem'
  }}>
      <Spinner variant="primary" />
      <span>Loading content...</span>
    </div>,
  parameters: {
    layout: 'padded'
  }
}`,...(qr=(Tr=x.parameters)==null?void 0:Tr.docs)==null?void 0:qr.source},description:{story:"Centered loading state pattern",...(Jr=(Hr=x.parameters)==null?void 0:Hr.docs)==null?void 0:Jr.description}}};var Kr,Mr,Qr,Ur,Xr;w.parameters={...w.parameters,docs:{...(Kr=w.parameters)==null?void 0:Kr.docs,source:{originalSource:`{
  render: () => <div className="d-flex justify-content-center" style={{
    width: '200px'
  }}>
      <Spinner variant="primary" />
    </div>
}`,...(Qr=(Mr=w.parameters)==null?void 0:Mr.docs)==null?void 0:Qr.source},description:{story:"Flex utilities for alignment",...(Xr=(Ur=w.parameters)==null?void 0:Ur.docs)==null?void 0:Xr.description}}};const ae=["Default","Border","Grow","Small","SmallGrow","Primary","Secondary","Success","Danger","AllColors","AllGrowColors","InButton","InButtonVariants","SpinnerOnlyButton","CustomSize","CenteredLoading","FlexAlignment"];export{l as AllColors,u as AllGrowColors,n as Border,x as CenteredLoading,S as CustomSize,m as Danger,s as Default,w as FlexAlignment,i as Grow,g as InButton,y as InButtonVariants,d as Primary,c as Secondary,t as Small,o as SmallGrow,v as SpinnerOnlyButton,p as Success,ae as __namedExportsOrder,ee as default};
