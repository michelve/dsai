import{j as r}from"./jsx-runtime-D_zvdyIk.js";import"./tokens-grouped-DE5ovhxs.js";import{r as fa}from"./iframe-BTcHudin.js";import"./preload-helper-Dp1pzeXC.js";var a={},e=fa.forwardRef(({children:Ye,variant:Ze="primary",size:ra="md",disabled:A=!1,onClick:ea,className:aa="",type:na="button",fullWidth:ta=!1,style:sa,id:ia,name:oa,value:ca,tabIndex:da,autoFocus:la=!1,"aria-label":ua,"aria-describedby":pa,"aria-controls":ma,"aria-expanded":ga,"aria-pressed":ya,...ha},va)=>{let ba=[a.button,a[`button--${Ze}`],a[`button--${ra}`],ta&&a["button--full-width"],A&&a["button--disabled"],aa].filter(Boolean).join(" ");return r.jsx("button",{ref:va,type:na,className:ba,disabled:A,onClick:ea,style:sa,id:ia,name:oa,value:ca,tabIndex:da,autoFocus:la,"aria-label":ua,"aria-describedby":pa,"aria-controls":ma,"aria-expanded":ga,"aria-pressed":ya,"aria-disabled":A,...ha,children:Ye})});e.displayName="Button";const Da={title:"Components/Button",component:e,parameters:{layout:"centered",docs:{description:{component:"A versatile button component with multiple variants, sizes, and states. Fully accessible (WCAG 2.2 AA compliant) with keyboard navigation, focus management, and proper color contrast ratios. Uses design tokens for consistent theming."}},backgrounds:{default:"light",values:[{name:"light",value:"#ffffff"},{name:"dark",value:"#1a1a1a"},{name:"gray",value:"#f5f5f5"}]}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","success","danger","warning","info","light","dark","outline-primary","outline-secondary","outline-success","outline-danger","outline-warning","outline-info","outline-light","outline-dark","link"],description:"Button visual style variant",table:{type:{summary:"ButtonVariant"},defaultValue:{summary:"primary"}}},size:{control:"select",options:["sm","md","lg"],description:"Button size",table:{type:{summary:"ButtonSize"},defaultValue:{summary:"md"}}},disabled:{control:"boolean",description:"Disabled state - prevents user interaction",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},fullWidth:{control:"boolean",description:"Makes button 100% width",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},type:{control:"select",options:["button","submit","reset"],description:"Button HTML type attribute",table:{type:{summary:"ButtonType"},defaultValue:{summary:"button"}}},onClick:{action:"clicked",description:"Click event handler",table:{type:{summary:"(event: MouseEvent) => void"}}},children:{control:"text",description:"Button content",table:{type:{summary:"ReactNode"}}}}},n={args:{variant:"primary",children:"Primary Button"}},t={args:{variant:"secondary",children:"Secondary Button"}},s={args:{variant:"success",children:"Success Button"}},i={args:{variant:"danger",children:"Danger Button"}},o={args:{variant:"warning",children:"Warning Button"}},c={args:{variant:"info",children:"Info Button"}},d={args:{variant:"light",children:"Light Button"},parameters:{backgrounds:{default:"dark"}}},l={args:{variant:"dark",children:"Dark Button"}},u={args:{variant:"outline-primary",children:"Outline Primary"}},S={args:{variant:"outline-secondary",children:"Outline Secondary"}},x={args:{variant:"outline-success",children:"Outline Success"}},k={args:{variant:"outline-danger",children:"Outline Danger"}},p={args:{variant:"link",children:"Link Button"}},m={args:{size:"sm",children:"Small Button"}},D={args:{size:"md",children:"Medium Button (Default)"}},O={args:{size:"lg",children:"Large Button"}},g={args:{disabled:!0,children:"Disabled Button"}},W={args:{variant:"primary",disabled:!0,children:"Disabled Primary"}},j={args:{variant:"outline-primary",disabled:!0,children:"Disabled Outline"}},y={args:{variant:"primary",fullWidth:!0,children:"Full Width Button"},parameters:{layout:"padded"}},h={args:{type:"submit",variant:"success",children:"Submit Form"}},z={args:{type:"reset",variant:"secondary",children:"Reset Form"}},v={args:{variant:"primary",children:r.jsx(r.Fragment,{children:"✓ Save Changes"})}},L={args:{variant:"primary",children:r.jsx(r.Fragment,{children:"Next →"})}},w={args:{variant:"primary",children:"×","aria-label":"Close"}},b={args:{variant:"primary",children:"×","aria-label":"Close dialog"}},I={args:{variant:"secondary",children:"Toggle Menu ▼","aria-expanded":!1,"aria-controls":"menu"}},P={args:{variant:"outline-primary",children:"Toggle Option","aria-pressed":!1}},f={render:()=>r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",alignItems:"flex-start"},children:[r.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[r.jsx(e,{variant:"primary",children:"Primary"}),r.jsx(e,{variant:"secondary",children:"Secondary"}),r.jsx(e,{variant:"success",children:"Success"}),r.jsx(e,{variant:"danger",children:"Danger"}),r.jsx(e,{variant:"warning",children:"Warning"}),r.jsx(e,{variant:"info",children:"Info"}),r.jsx(e,{variant:"light",children:"Light"}),r.jsx(e,{variant:"dark",children:"Dark"})]}),r.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[r.jsx(e,{variant:"outline-primary",children:"Outline Primary"}),r.jsx(e,{variant:"outline-secondary",children:"Outline Secondary"}),r.jsx(e,{variant:"outline-success",children:"Outline Success"}),r.jsx(e,{variant:"outline-danger",children:"Outline Danger"})]}),r.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[r.jsx(e,{variant:"link",children:"Link"}),r.jsx(e,{variant:"primary",disabled:!0,children:"Disabled"})]})]}),parameters:{layout:"padded"}},B={render:()=>r.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[r.jsx(e,{variant:"primary",size:"sm",children:"Small"}),r.jsx(e,{variant:"primary",size:"md",children:"Medium"}),r.jsx(e,{variant:"primary",size:"lg",children:"Large"})]})};var F,C,M,R,V;n.parameters={...n.parameters,docs:{...(F=n.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Primary Button'
  }
}`,...(M=(C=n.parameters)==null?void 0:C.docs)==null?void 0:M.source},description:{story:"Primary button - use for main actions and call-to-action buttons",...(V=(R=n.parameters)==null?void 0:R.docs)==null?void 0:V.description}}};var T,E,N,_,$;t.parameters={...t.parameters,docs:{...(T=t.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'Secondary Button'
  }
}`,...(N=(E=t.parameters)==null?void 0:E.docs)==null?void 0:N.source},description:{story:"Secondary button - use for secondary actions",...($=(_=t.parameters)==null?void 0:_.docs)==null?void 0:$.description}}};var q,G,H,U,J;s.parameters={...s.parameters,docs:{...(q=s.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: 'Success Button'
  }
}`,...(H=(G=s.parameters)==null?void 0:G.docs)==null?void 0:H.source},description:{story:'Success button - use for positive actions (e.g., "Save", "Confirm")',...(J=(U=s.parameters)==null?void 0:U.docs)==null?void 0:J.description}}};var K,Q,X,Y,Z;i.parameters={...i.parameters,docs:{...(K=i.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    children: 'Danger Button'
  }
}`,...(X=(Q=i.parameters)==null?void 0:Q.docs)==null?void 0:X.source},description:{story:'Danger button - use for destructive actions (e.g., "Delete", "Remove")',...(Z=(Y=i.parameters)==null?void 0:Y.docs)==null?void 0:Z.description}}};var rr,er,ar,nr,tr;o.parameters={...o.parameters,docs:{...(rr=o.parameters)==null?void 0:rr.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    children: 'Warning Button'
  }
}`,...(ar=(er=o.parameters)==null?void 0:er.docs)==null?void 0:ar.source},description:{story:"Warning button - use for actions that require caution",...(tr=(nr=o.parameters)==null?void 0:nr.docs)==null?void 0:tr.description}}};var sr,ir,or,cr,dr;c.parameters={...c.parameters,docs:{...(sr=c.parameters)==null?void 0:sr.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    children: 'Info Button'
  }
}`,...(or=(ir=c.parameters)==null?void 0:ir.docs)==null?void 0:or.source},description:{story:"Info button - use for informational actions",...(dr=(cr=c.parameters)==null?void 0:cr.docs)==null?void 0:dr.description}}};var lr,ur,pr,mr,gr;d.parameters={...d.parameters,docs:{...(lr=d.parameters)==null?void 0:lr.docs,source:{originalSource:`{
  args: {
    variant: 'light',
    children: 'Light Button'
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...(pr=(ur=d.parameters)==null?void 0:ur.docs)==null?void 0:pr.source},description:{story:"Light button - use on dark backgrounds",...(gr=(mr=d.parameters)==null?void 0:mr.docs)==null?void 0:gr.description}}};var yr,hr,vr,br,fr;l.parameters={...l.parameters,docs:{...(yr=l.parameters)==null?void 0:yr.docs,source:{originalSource:`{
  args: {
    variant: 'dark',
    children: 'Dark Button'
  }
}`,...(vr=(hr=l.parameters)==null?void 0:hr.docs)==null?void 0:vr.source},description:{story:"Dark button - use on light backgrounds",...(fr=(br=l.parameters)==null?void 0:br.docs)==null?void 0:fr.description}}};var Br,Sr,xr,kr,Dr;u.parameters={...u.parameters,docs:{...(Br=u.parameters)==null?void 0:Br.docs,source:{originalSource:`{
  args: {
    variant: 'outline-primary',
    children: 'Outline Primary'
  }
}`,...(xr=(Sr=u.parameters)==null?void 0:Sr.docs)==null?void 0:xr.source},description:{story:"Outline buttons - lighter weight variants",...(Dr=(kr=u.parameters)==null?void 0:kr.docs)==null?void 0:Dr.description}}};var Or,Wr,jr;S.parameters={...S.parameters,docs:{...(Or=S.parameters)==null?void 0:Or.docs,source:{originalSource:`{
  args: {
    variant: 'outline-secondary',
    children: 'Outline Secondary'
  }
}`,...(jr=(Wr=S.parameters)==null?void 0:Wr.docs)==null?void 0:jr.source}}};var zr,Lr,wr;x.parameters={...x.parameters,docs:{...(zr=x.parameters)==null?void 0:zr.docs,source:{originalSource:`{
  args: {
    variant: 'outline-success',
    children: 'Outline Success'
  }
}`,...(wr=(Lr=x.parameters)==null?void 0:Lr.docs)==null?void 0:wr.source}}};var Ir,Pr,Ar;k.parameters={...k.parameters,docs:{...(Ir=k.parameters)==null?void 0:Ir.docs,source:{originalSource:`{
  args: {
    variant: 'outline-danger',
    children: 'Outline Danger'
  }
}`,...(Ar=(Pr=k.parameters)==null?void 0:Pr.docs)==null?void 0:Ar.source}}};var Fr,Cr,Mr,Rr,Vr;p.parameters={...p.parameters,docs:{...(Fr=p.parameters)==null?void 0:Fr.docs,source:{originalSource:`{
  args: {
    variant: 'link',
    children: 'Link Button'
  }
}`,...(Mr=(Cr=p.parameters)==null?void 0:Cr.docs)==null?void 0:Mr.source},description:{story:"Link button - styled as a link but behaves as a button",...(Vr=(Rr=p.parameters)==null?void 0:Rr.docs)==null?void 0:Vr.description}}};var Tr,Er,Nr,_r,$r;m.parameters={...m.parameters,docs:{...(Tr=m.parameters)==null?void 0:Tr.docs,source:{originalSource:`{
  args: {
    size: 'sm',
    children: 'Small Button'
  }
}`,...(Nr=(Er=m.parameters)==null?void 0:Er.docs)==null?void 0:Nr.source},description:{story:"Button sizes",...($r=(_r=m.parameters)==null?void 0:_r.docs)==null?void 0:$r.description}}};var qr,Gr,Hr;D.parameters={...D.parameters,docs:{...(qr=D.parameters)==null?void 0:qr.docs,source:{originalSource:`{
  args: {
    size: 'md',
    children: 'Medium Button (Default)'
  }
}`,...(Hr=(Gr=D.parameters)==null?void 0:Gr.docs)==null?void 0:Hr.source}}};var Ur,Jr,Kr;O.parameters={...O.parameters,docs:{...(Ur=O.parameters)==null?void 0:Ur.docs,source:{originalSource:`{
  args: {
    size: 'lg',
    children: 'Large Button'
  }
}`,...(Kr=(Jr=O.parameters)==null?void 0:Jr.docs)==null?void 0:Kr.source}}};var Qr,Xr,Yr,Zr,re;g.parameters={...g.parameters,docs:{...(Qr=g.parameters)==null?void 0:Qr.docs,source:{originalSource:`{
  args: {
    disabled: true,
    children: 'Disabled Button'
    // Won't fire
  }
}`,...(Yr=(Xr=g.parameters)==null?void 0:Xr.docs)==null?void 0:Yr.source},description:{story:"Disabled state - prevents user interaction",...(re=(Zr=g.parameters)==null?void 0:Zr.docs)==null?void 0:re.description}}};var ee,ae,ne;W.parameters={...W.parameters,docs:{...(ee=W.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled Primary'
  }
}`,...(ne=(ae=W.parameters)==null?void 0:ae.docs)==null?void 0:ne.source}}};var te,se,ie;j.parameters={...j.parameters,docs:{...(te=j.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    variant: 'outline-primary',
    disabled: true,
    children: 'Disabled Outline'
  }
}`,...(ie=(se=j.parameters)==null?void 0:se.docs)==null?void 0:ie.source}}};var oe,ce,de,le,ue;y.parameters={...y.parameters,docs:{...(oe=y.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    fullWidth: true,
    children: 'Full Width Button'
  },
  parameters: {
    layout: 'padded'
  }
}`,...(de=(ce=y.parameters)==null?void 0:ce.docs)==null?void 0:de.source},description:{story:"Full width button",...(ue=(le=y.parameters)==null?void 0:le.docs)==null?void 0:ue.description}}};var pe,me,ge,ye,he;h.parameters={...h.parameters,docs:{...(pe=h.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  args: {
    type: 'submit',
    variant: 'success',
    children: 'Submit Form'
  }
}`,...(ge=(me=h.parameters)==null?void 0:me.docs)==null?void 0:ge.source},description:{story:"Button types for forms",...(he=(ye=h.parameters)==null?void 0:ye.docs)==null?void 0:he.description}}};var ve,be,fe;z.parameters={...z.parameters,docs:{...(ve=z.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  args: {
    type: 'reset',
    variant: 'secondary',
    children: 'Reset Form'
  }
}`,...(fe=(be=z.parameters)==null?void 0:be.docs)==null?void 0:fe.source}}};var Be,Se,xe,ke,De;v.parameters={...v.parameters,docs:{...(Be=v.parameters)==null?void 0:Be.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: <>✓ Save Changes</>
  }
}`,...(xe=(Se=v.parameters)==null?void 0:Se.docs)==null?void 0:xe.source},description:{story:"Buttons with icons (example using emoji)",...(De=(ke=v.parameters)==null?void 0:ke.docs)==null?void 0:De.description}}};var Oe,We,je;L.parameters={...L.parameters,docs:{...(Oe=L.parameters)==null?void 0:Oe.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: <>Next →</>
  }
}`,...(je=(We=L.parameters)==null?void 0:We.docs)==null?void 0:je.source}}};var ze,Le,we;w.parameters={...w.parameters,docs:{...(ze=w.parameters)==null?void 0:ze.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: '×',
    'aria-label': 'Close'
  }
}`,...(we=(Le=w.parameters)==null?void 0:Le.docs)==null?void 0:we.source}}};var Ie,Pe,Ae,Fe,Ce;b.parameters={...b.parameters,docs:{...(Ie=b.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: '×',
    'aria-label': 'Close dialog'
  }
}`,...(Ae=(Pe=b.parameters)==null?void 0:Pe.docs)==null?void 0:Ae.source},description:{story:"Accessibility examples",...(Ce=(Fe=b.parameters)==null?void 0:Fe.docs)==null?void 0:Ce.description}}};var Me,Re,Ve;I.parameters={...I.parameters,docs:{...(Me=I.parameters)==null?void 0:Me.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'Toggle Menu ▼',
    'aria-expanded': false,
    'aria-controls': 'menu'
  }
}`,...(Ve=(Re=I.parameters)==null?void 0:Re.docs)==null?void 0:Ve.source}}};var Te,Ee,Ne;P.parameters={...P.parameters,docs:{...(Te=P.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  args: {
    variant: 'outline-primary',
    children: 'Toggle Option',
    'aria-pressed': false
  }
}`,...(Ne=(Ee=P.parameters)==null?void 0:Ee.docs)==null?void 0:Ne.source}}};var _e,$e,qe,Ge,He;f.parameters={...f.parameters,docs:{...(_e=f.parameters)==null?void 0:_e.docs,source:{originalSource:`{
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
}`,...(qe=($e=f.parameters)==null?void 0:$e.docs)==null?void 0:qe.source},description:{story:"All variants showcase",...(He=(Ge=f.parameters)==null?void 0:Ge.docs)==null?void 0:He.description}}};var Ue,Je,Ke,Qe,Xe;B.parameters={...B.parameters,docs:{...(Ue=B.parameters)==null?void 0:Ue.docs,source:{originalSource:`{
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
}`,...(Ke=(Je=B.parameters)==null?void 0:Je.docs)==null?void 0:Ke.source},description:{story:"All sizes showcase",...(Xe=(Qe=B.parameters)==null?void 0:Qe.docs)==null?void 0:Xe.description}}};const Oa=["Primary","Secondary","Success","Danger","Warning","Info","Light","Dark","OutlinePrimary","OutlineSecondary","OutlineSuccess","OutlineDanger","Link","SmallSize","MediumSize","LargeSize","Disabled","DisabledPrimary","DisabledOutline","FullWidth","SubmitButton","ResetButton","WithIconLeft","WithIconRight","IconOnly","WithAriaLabel","WithAriaExpanded","WithAriaPressed","AllVariants","AllSizes"];export{B as AllSizes,f as AllVariants,i as Danger,l as Dark,g as Disabled,j as DisabledOutline,W as DisabledPrimary,y as FullWidth,w as IconOnly,c as Info,O as LargeSize,d as Light,p as Link,D as MediumSize,k as OutlineDanger,u as OutlinePrimary,S as OutlineSecondary,x as OutlineSuccess,n as Primary,z as ResetButton,t as Secondary,m as SmallSize,h as SubmitButton,s as Success,o as Warning,I as WithAriaExpanded,b as WithAriaLabel,P as WithAriaPressed,v as WithIconLeft,L as WithIconRight,Oa as __namedExportsOrder,Da as default};
