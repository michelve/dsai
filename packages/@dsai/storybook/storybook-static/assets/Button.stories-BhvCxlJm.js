import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{B as e}from"./Button-CxkFRh1i.js";import"./iframe-AU4p8I_m.js";import"./preload-helper-Dp1pzeXC.js";const ra={title:"Components/Button",component:e,parameters:{layout:"centered",docs:{description:{component:"A versatile button component with multiple variants, sizes, and states. Fully accessible (WCAG 2.2 AA compliant) with keyboard navigation, focus management, and proper color contrast ratios. Uses design tokens for consistent theming."}},backgrounds:{default:"light",values:[{name:"light",value:"#ffffff"},{name:"dark",value:"#1a1a1a"},{name:"gray",value:"#f5f5f5"}]}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","success","danger","warning","info","light","dark","outline-primary","outline-secondary","outline-success","outline-danger","outline-warning","outline-info","outline-light","outline-dark","link"],description:"Button visual style variant",table:{type:{summary:"ButtonVariant"},defaultValue:{summary:"primary"}}},size:{control:"select",options:["sm","md","lg"],description:"Button size",table:{type:{summary:"ButtonSize"},defaultValue:{summary:"md"}}},disabled:{control:"boolean",description:"Disabled state - prevents user interaction",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},fullWidth:{control:"boolean",description:"Makes button 100% width",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},type:{control:"select",options:["button","submit","reset"],description:"Button HTML type attribute",table:{type:{summary:"ButtonType"},defaultValue:{summary:"button"}}},onClick:{action:"clicked",description:"Click event handler",table:{type:{summary:"(event: MouseEvent) => void"}}},children:{control:"text",description:"Button content",table:{type:{summary:"ReactNode"}}}}},a={args:{variant:"primary",children:"Primary Button"}},n={args:{variant:"secondary",children:"Secondary Button"}},t={args:{variant:"success",children:"Success Button"}},s={args:{variant:"danger",children:"Danger Button"}},i={args:{variant:"warning",children:"Warning Button"}},o={args:{variant:"info",children:"Info Button"}},c={args:{variant:"light",children:"Light Button"},parameters:{backgrounds:{default:"dark"}}},d={args:{variant:"dark",children:"Dark Button"}},l={args:{variant:"outline-primary",children:"Outline Primary"}},S={args:{variant:"outline-secondary",children:"Outline Secondary"}},b={args:{variant:"outline-success",children:"Outline Success"}},x={args:{variant:"outline-danger",children:"Outline Danger"}},u={args:{variant:"link",children:"Link Button"}},p={args:{size:"sm",children:"Small Button"}},k={args:{size:"md",children:"Medium Button (Default)"}},D={args:{size:"lg",children:"Large Button"}},m={args:{disabled:!0,children:"Disabled Button"}},O={args:{variant:"primary",disabled:!0,children:"Disabled Primary"}},W={args:{variant:"outline-primary",disabled:!0,children:"Disabled Outline"}},g={args:{variant:"primary",fullWidth:!0,children:"Full Width Button"},parameters:{layout:"padded"}},y={args:{type:"submit",variant:"success",children:"Submit Form"}},j={args:{type:"reset",variant:"secondary",children:"Reset Form"}},h={args:{variant:"primary",children:r.jsx(r.Fragment,{children:"✓ Save Changes"})}},z={args:{variant:"primary",children:r.jsx(r.Fragment,{children:"Next →"})}},L={args:{variant:"primary",children:"×","aria-label":"Close"}},v={args:{variant:"primary",children:"×","aria-label":"Close dialog"}},w={args:{variant:"secondary",children:"Toggle Menu ▼","aria-expanded":!1,"aria-controls":"menu"}},P={args:{variant:"outline-primary",children:"Toggle Option","aria-pressed":!1}},f={render:()=>r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",alignItems:"flex-start"},children:[r.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[r.jsx(e,{variant:"primary",children:"Primary"}),r.jsx(e,{variant:"secondary",children:"Secondary"}),r.jsx(e,{variant:"success",children:"Success"}),r.jsx(e,{variant:"danger",children:"Danger"}),r.jsx(e,{variant:"warning",children:"Warning"}),r.jsx(e,{variant:"info",children:"Info"}),r.jsx(e,{variant:"light",children:"Light"}),r.jsx(e,{variant:"dark",children:"Dark"})]}),r.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[r.jsx(e,{variant:"outline-primary",children:"Outline Primary"}),r.jsx(e,{variant:"outline-secondary",children:"Outline Secondary"}),r.jsx(e,{variant:"outline-success",children:"Outline Success"}),r.jsx(e,{variant:"outline-danger",children:"Outline Danger"})]}),r.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[r.jsx(e,{variant:"link",children:"Link"}),r.jsx(e,{variant:"primary",disabled:!0,children:"Disabled"})]})]}),parameters:{layout:"padded"}},B={render:()=>r.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[r.jsx(e,{variant:"primary",size:"sm",children:"Small"}),r.jsx(e,{variant:"primary",size:"md",children:"Medium"}),r.jsx(e,{variant:"primary",size:"lg",children:"Large"})]})};var A,I,F,C,M;a.parameters={...a.parameters,docs:{...(A=a.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Primary Button'
  }
}`,...(F=(I=a.parameters)==null?void 0:I.docs)==null?void 0:F.source},description:{story:"Primary button - use for main actions and call-to-action buttons",...(M=(C=a.parameters)==null?void 0:C.docs)==null?void 0:M.description}}};var R,V,T,E,N;n.parameters={...n.parameters,docs:{...(R=n.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'Secondary Button'
  }
}`,...(T=(V=n.parameters)==null?void 0:V.docs)==null?void 0:T.source},description:{story:"Secondary button - use for secondary actions",...(N=(E=n.parameters)==null?void 0:E.docs)==null?void 0:N.description}}};var _,q,G,H,U;t.parameters={...t.parameters,docs:{...(_=t.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: 'Success Button'
  }
}`,...(G=(q=t.parameters)==null?void 0:q.docs)==null?void 0:G.source},description:{story:'Success button - use for positive actions (e.g., "Save", "Confirm")',...(U=(H=t.parameters)==null?void 0:H.docs)==null?void 0:U.description}}};var J,K,Q,X,Y;s.parameters={...s.parameters,docs:{...(J=s.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    children: 'Danger Button'
  }
}`,...(Q=(K=s.parameters)==null?void 0:K.docs)==null?void 0:Q.source},description:{story:'Danger button - use for destructive actions (e.g., "Delete", "Remove")',...(Y=(X=s.parameters)==null?void 0:X.docs)==null?void 0:Y.description}}};var Z,$,rr,er,ar;i.parameters={...i.parameters,docs:{...(Z=i.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    children: 'Warning Button'
  }
}`,...(rr=($=i.parameters)==null?void 0:$.docs)==null?void 0:rr.source},description:{story:"Warning button - use for actions that require caution",...(ar=(er=i.parameters)==null?void 0:er.docs)==null?void 0:ar.description}}};var nr,tr,sr,ir,or;o.parameters={...o.parameters,docs:{...(nr=o.parameters)==null?void 0:nr.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    children: 'Info Button'
  }
}`,...(sr=(tr=o.parameters)==null?void 0:tr.docs)==null?void 0:sr.source},description:{story:"Info button - use for informational actions",...(or=(ir=o.parameters)==null?void 0:ir.docs)==null?void 0:or.description}}};var cr,dr,lr,ur,pr;c.parameters={...c.parameters,docs:{...(cr=c.parameters)==null?void 0:cr.docs,source:{originalSource:`{
  args: {
    variant: 'light',
    children: 'Light Button'
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...(lr=(dr=c.parameters)==null?void 0:dr.docs)==null?void 0:lr.source},description:{story:"Light button - use on dark backgrounds",...(pr=(ur=c.parameters)==null?void 0:ur.docs)==null?void 0:pr.description}}};var mr,gr,yr,hr,vr;d.parameters={...d.parameters,docs:{...(mr=d.parameters)==null?void 0:mr.docs,source:{originalSource:`{
  args: {
    variant: 'dark',
    children: 'Dark Button'
  }
}`,...(yr=(gr=d.parameters)==null?void 0:gr.docs)==null?void 0:yr.source},description:{story:"Dark button - use on light backgrounds",...(vr=(hr=d.parameters)==null?void 0:hr.docs)==null?void 0:vr.description}}};var fr,Br,Sr,br,xr;l.parameters={...l.parameters,docs:{...(fr=l.parameters)==null?void 0:fr.docs,source:{originalSource:`{
  args: {
    variant: 'outline-primary',
    children: 'Outline Primary'
  }
}`,...(Sr=(Br=l.parameters)==null?void 0:Br.docs)==null?void 0:Sr.source},description:{story:"Outline buttons - lighter weight variants",...(xr=(br=l.parameters)==null?void 0:br.docs)==null?void 0:xr.description}}};var kr,Dr,Or;S.parameters={...S.parameters,docs:{...(kr=S.parameters)==null?void 0:kr.docs,source:{originalSource:`{
  args: {
    variant: 'outline-secondary',
    children: 'Outline Secondary'
  }
}`,...(Or=(Dr=S.parameters)==null?void 0:Dr.docs)==null?void 0:Or.source}}};var Wr,jr,zr;b.parameters={...b.parameters,docs:{...(Wr=b.parameters)==null?void 0:Wr.docs,source:{originalSource:`{
  args: {
    variant: 'outline-success',
    children: 'Outline Success'
  }
}`,...(zr=(jr=b.parameters)==null?void 0:jr.docs)==null?void 0:zr.source}}};var Lr,wr,Pr;x.parameters={...x.parameters,docs:{...(Lr=x.parameters)==null?void 0:Lr.docs,source:{originalSource:`{
  args: {
    variant: 'outline-danger',
    children: 'Outline Danger'
  }
}`,...(Pr=(wr=x.parameters)==null?void 0:wr.docs)==null?void 0:Pr.source}}};var Ar,Ir,Fr,Cr,Mr;u.parameters={...u.parameters,docs:{...(Ar=u.parameters)==null?void 0:Ar.docs,source:{originalSource:`{
  args: {
    variant: 'link',
    children: 'Link Button'
  }
}`,...(Fr=(Ir=u.parameters)==null?void 0:Ir.docs)==null?void 0:Fr.source},description:{story:"Link button - styled as a link but behaves as a button",...(Mr=(Cr=u.parameters)==null?void 0:Cr.docs)==null?void 0:Mr.description}}};var Rr,Vr,Tr,Er,Nr;p.parameters={...p.parameters,docs:{...(Rr=p.parameters)==null?void 0:Rr.docs,source:{originalSource:`{
  args: {
    size: 'sm',
    children: 'Small Button'
  }
}`,...(Tr=(Vr=p.parameters)==null?void 0:Vr.docs)==null?void 0:Tr.source},description:{story:"Button sizes",...(Nr=(Er=p.parameters)==null?void 0:Er.docs)==null?void 0:Nr.description}}};var _r,qr,Gr;k.parameters={...k.parameters,docs:{...(_r=k.parameters)==null?void 0:_r.docs,source:{originalSource:`{
  args: {
    size: 'md',
    children: 'Medium Button (Default)'
  }
}`,...(Gr=(qr=k.parameters)==null?void 0:qr.docs)==null?void 0:Gr.source}}};var Hr,Ur,Jr;D.parameters={...D.parameters,docs:{...(Hr=D.parameters)==null?void 0:Hr.docs,source:{originalSource:`{
  args: {
    size: 'lg',
    children: 'Large Button'
  }
}`,...(Jr=(Ur=D.parameters)==null?void 0:Ur.docs)==null?void 0:Jr.source}}};var Kr,Qr,Xr,Yr,Zr;m.parameters={...m.parameters,docs:{...(Kr=m.parameters)==null?void 0:Kr.docs,source:{originalSource:`{
  args: {
    disabled: true,
    children: 'Disabled Button'
    // Won't fire
  }
}`,...(Xr=(Qr=m.parameters)==null?void 0:Qr.docs)==null?void 0:Xr.source},description:{story:"Disabled state - prevents user interaction",...(Zr=(Yr=m.parameters)==null?void 0:Yr.docs)==null?void 0:Zr.description}}};var $r,re,ee;O.parameters={...O.parameters,docs:{...($r=O.parameters)==null?void 0:$r.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled Primary'
  }
}`,...(ee=(re=O.parameters)==null?void 0:re.docs)==null?void 0:ee.source}}};var ae,ne,te;W.parameters={...W.parameters,docs:{...(ae=W.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  args: {
    variant: 'outline-primary',
    disabled: true,
    children: 'Disabled Outline'
  }
}`,...(te=(ne=W.parameters)==null?void 0:ne.docs)==null?void 0:te.source}}};var se,ie,oe,ce,de;g.parameters={...g.parameters,docs:{...(se=g.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    fullWidth: true,
    children: 'Full Width Button'
  },
  parameters: {
    layout: 'padded'
  }
}`,...(oe=(ie=g.parameters)==null?void 0:ie.docs)==null?void 0:oe.source},description:{story:"Full width button",...(de=(ce=g.parameters)==null?void 0:ce.docs)==null?void 0:de.description}}};var le,ue,pe,me,ge;y.parameters={...y.parameters,docs:{...(le=y.parameters)==null?void 0:le.docs,source:{originalSource:`{
  args: {
    type: 'submit',
    variant: 'success',
    children: 'Submit Form'
  }
}`,...(pe=(ue=y.parameters)==null?void 0:ue.docs)==null?void 0:pe.source},description:{story:"Button types for forms",...(ge=(me=y.parameters)==null?void 0:me.docs)==null?void 0:ge.description}}};var ye,he,ve;j.parameters={...j.parameters,docs:{...(ye=j.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  args: {
    type: 'reset',
    variant: 'secondary',
    children: 'Reset Form'
  }
}`,...(ve=(he=j.parameters)==null?void 0:he.docs)==null?void 0:ve.source}}};var fe,Be,Se,be,xe;h.parameters={...h.parameters,docs:{...(fe=h.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: <>✓ Save Changes</>
  }
}`,...(Se=(Be=h.parameters)==null?void 0:Be.docs)==null?void 0:Se.source},description:{story:"Buttons with icons (example using emoji)",...(xe=(be=h.parameters)==null?void 0:be.docs)==null?void 0:xe.description}}};var ke,De,Oe;z.parameters={...z.parameters,docs:{...(ke=z.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: <>Next →</>
  }
}`,...(Oe=(De=z.parameters)==null?void 0:De.docs)==null?void 0:Oe.source}}};var We,je,ze;L.parameters={...L.parameters,docs:{...(We=L.parameters)==null?void 0:We.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: '×',
    'aria-label': 'Close'
  }
}`,...(ze=(je=L.parameters)==null?void 0:je.docs)==null?void 0:ze.source}}};var Le,we,Pe,Ae,Ie;v.parameters={...v.parameters,docs:{...(Le=v.parameters)==null?void 0:Le.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: '×',
    'aria-label': 'Close dialog'
  }
}`,...(Pe=(we=v.parameters)==null?void 0:we.docs)==null?void 0:Pe.source},description:{story:"Accessibility examples",...(Ie=(Ae=v.parameters)==null?void 0:Ae.docs)==null?void 0:Ie.description}}};var Fe,Ce,Me;w.parameters={...w.parameters,docs:{...(Fe=w.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'Toggle Menu ▼',
    'aria-expanded': false,
    'aria-controls': 'menu'
  }
}`,...(Me=(Ce=w.parameters)==null?void 0:Ce.docs)==null?void 0:Me.source}}};var Re,Ve,Te;P.parameters={...P.parameters,docs:{...(Re=P.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  args: {
    variant: 'outline-primary',
    children: 'Toggle Option',
    'aria-pressed': false
  }
}`,...(Te=(Ve=P.parameters)==null?void 0:Ve.docs)==null?void 0:Te.source}}};var Ee,Ne,_e,qe,Ge;f.parameters={...f.parameters,docs:{...(Ee=f.parameters)==null?void 0:Ee.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'flex-start'
  }}>
      <div style={{
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap'
    }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="success">Success</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="warning">Warning</Button>
        <Button variant="info">Info</Button>
        <Button variant="light">Light</Button>
        <Button variant="dark">Dark</Button>
      </div>
      <div style={{
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap'
    }}>
        <Button variant="outline-primary">Outline Primary</Button>
        <Button variant="outline-secondary">Outline Secondary</Button>
        <Button variant="outline-success">Outline Success</Button>
        <Button variant="outline-danger">Outline Danger</Button>
      </div>
      <div style={{
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap'
    }}>
        <Button variant="link">Link</Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
      </div>
    </div>,
  parameters: {
    layout: 'padded'
  }
}`,...(_e=(Ne=f.parameters)==null?void 0:Ne.docs)==null?void 0:_e.source},description:{story:"All variants showcase",...(Ge=(qe=f.parameters)==null?void 0:qe.docs)==null?void 0:Ge.description}}};var He,Ue,Je,Ke,Qe;B.parameters={...B.parameters,docs:{...(He=B.parameters)==null?void 0:He.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  }}>
      <Button variant="primary" size="sm">
        Small
      </Button>
      <Button variant="primary" size="md">
        Medium
      </Button>
      <Button variant="primary" size="lg">
        Large
      </Button>
    </div>
}`,...(Je=(Ue=B.parameters)==null?void 0:Ue.docs)==null?void 0:Je.source},description:{story:"All sizes showcase",...(Qe=(Ke=B.parameters)==null?void 0:Ke.docs)==null?void 0:Qe.description}}};const ea=["Primary","Secondary","Success","Danger","Warning","Info","Light","Dark","OutlinePrimary","OutlineSecondary","OutlineSuccess","OutlineDanger","Link","SmallSize","MediumSize","LargeSize","Disabled","DisabledPrimary","DisabledOutline","FullWidth","SubmitButton","ResetButton","WithIconLeft","WithIconRight","IconOnly","WithAriaLabel","WithAriaExpanded","WithAriaPressed","AllVariants","AllSizes"];export{B as AllSizes,f as AllVariants,s as Danger,d as Dark,m as Disabled,W as DisabledOutline,O as DisabledPrimary,g as FullWidth,L as IconOnly,o as Info,D as LargeSize,c as Light,u as Link,k as MediumSize,x as OutlineDanger,l as OutlinePrimary,S as OutlineSecondary,b as OutlineSuccess,a as Primary,j as ResetButton,n as Secondary,p as SmallSize,y as SubmitButton,t as Success,i as Warning,w as WithAriaExpanded,v as WithAriaLabel,P as WithAriaPressed,h as WithIconLeft,z as WithIconRight,ea as __namedExportsOrder,ra as default};
