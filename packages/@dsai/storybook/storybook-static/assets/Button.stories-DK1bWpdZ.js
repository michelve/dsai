import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{r as ba}from"./iframe-Bu7yg2lj.js";import"./preload-helper-Dp1pzeXC.js";var e=ba.forwardRef(({children:Ye,variant:Ze="primary",size:P="md",disabled:A=!1,onClick:ra,className:ea="",type:aa="button",fullWidth:na=!1,style:ta,id:sa,name:ia,value:oa,tabIndex:ca,autoFocus:da=!1,"aria-label":la,"aria-describedby":ua,"aria-controls":pa,"aria-expanded":ma,"aria-pressed":ga,...ya},ha)=>{let va=["btn",`btn-${Ze}`,P==="sm"&&"btn-sm",P==="lg"&&"btn-lg",na&&"w-100",ea].filter(Boolean).join(" ");return r.jsx("button",{ref:ha,type:aa,className:va,disabled:A,onClick:ra,style:ta,id:sa,name:ia,value:oa,tabIndex:ca,autoFocus:da,"aria-label":la,"aria-describedby":ua,"aria-controls":pa,"aria-expanded":ma,"aria-pressed":ga,"aria-disabled":A,...ya,children:Ye})});e.displayName="Button";const xa={title:"Components/Button",component:e,parameters:{layout:"centered",docs:{description:{component:"A versatile button component with multiple variants, sizes, and states. Fully accessible (WCAG 2.2 AA compliant) with keyboard navigation, focus management, and proper color contrast ratios. Uses design tokens for consistent theming."}},backgrounds:{default:"light",values:[{name:"light",value:"#ffffff"},{name:"dark",value:"#1a1a1a"},{name:"gray",value:"#f5f5f5"}]}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","success","danger","warning","info","light","dark","outline-primary","outline-secondary","outline-success","outline-danger","outline-warning","outline-info","outline-light","outline-dark","link"],description:"Button visual style variant",table:{type:{summary:"ButtonVariant"},defaultValue:{summary:"primary"}}},size:{control:"select",options:["sm","md","lg"],description:"Button size",table:{type:{summary:"ButtonSize"},defaultValue:{summary:"md"}}},disabled:{control:"boolean",description:"Disabled state - prevents user interaction",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},fullWidth:{control:"boolean",description:"Makes button 100% width",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},type:{control:"select",options:["button","submit","reset"],description:"Button HTML type attribute",table:{type:{summary:"ButtonType"},defaultValue:{summary:"button"}}},onClick:{action:"clicked",description:"Click event handler",table:{type:{summary:"(event: MouseEvent) => void"}}},children:{control:"text",description:"Button content",table:{type:{summary:"ReactNode"}}}}},a={args:{variant:"primary",children:"Primary Button"}},n={args:{variant:"secondary",children:"Secondary Button"}},t={args:{variant:"success",children:"Success Button"}},s={args:{variant:"danger",children:"Danger Button"}},i={args:{variant:"warning",children:"Warning Button"}},o={args:{variant:"info",children:"Info Button"}},c={args:{variant:"light",children:"Light Button"},parameters:{backgrounds:{default:"dark"}}},d={args:{variant:"dark",children:"Dark Button"}},l={args:{variant:"outline-primary",children:"Outline Primary"}},B={args:{variant:"outline-secondary",children:"Outline Secondary"}},S={args:{variant:"outline-success",children:"Outline Success"}},x={args:{variant:"outline-danger",children:"Outline Danger"}},u={args:{variant:"link",children:"Link Button"}},p={args:{size:"sm",children:"Small Button"}},k={args:{size:"md",children:"Medium Button (Default)"}},D={args:{size:"lg",children:"Large Button"}},m={args:{disabled:!0,children:"Disabled Button"}},O={args:{variant:"primary",disabled:!0,children:"Disabled Primary"}},W={args:{variant:"outline-primary",disabled:!0,children:"Disabled Outline"}},g={args:{variant:"primary",fullWidth:!0,children:"Full Width Button"},parameters:{layout:"padded"}},y={args:{type:"submit",variant:"success",children:"Submit Form"}},j={args:{type:"reset",variant:"secondary",children:"Reset Form"}},h={args:{variant:"primary",children:r.jsx(r.Fragment,{children:"✓ Save Changes"})}},z={args:{variant:"primary",children:r.jsx(r.Fragment,{children:"Next →"})}},L={args:{variant:"primary",children:"×","aria-label":"Close"}},v={args:{variant:"primary",children:"×","aria-label":"Close dialog"}},w={args:{variant:"secondary",children:"Toggle Menu ▼","aria-expanded":!1,"aria-controls":"menu"}},I={args:{variant:"outline-primary",children:"Toggle Option","aria-pressed":!1}},b={render:()=>r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",alignItems:"flex-start"},children:[r.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[r.jsx(e,{variant:"primary",children:"Primary"}),r.jsx(e,{variant:"secondary",children:"Secondary"}),r.jsx(e,{variant:"success",children:"Success"}),r.jsx(e,{variant:"danger",children:"Danger"}),r.jsx(e,{variant:"warning",children:"Warning"}),r.jsx(e,{variant:"info",children:"Info"}),r.jsx(e,{variant:"light",children:"Light"}),r.jsx(e,{variant:"dark",children:"Dark"})]}),r.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[r.jsx(e,{variant:"outline-primary",children:"Outline Primary"}),r.jsx(e,{variant:"outline-secondary",children:"Outline Secondary"}),r.jsx(e,{variant:"outline-success",children:"Outline Success"}),r.jsx(e,{variant:"outline-danger",children:"Outline Danger"})]}),r.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[r.jsx(e,{variant:"link",children:"Link"}),r.jsx(e,{variant:"primary",disabled:!0,children:"Disabled"})]})]}),parameters:{layout:"padded"}},f={render:()=>r.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[r.jsx(e,{variant:"primary",size:"sm",children:"Small"}),r.jsx(e,{variant:"primary",size:"md",children:"Medium"}),r.jsx(e,{variant:"primary",size:"lg",children:"Large"})]})};var F,C,M,R,V;a.parameters={...a.parameters,docs:{...(F=a.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Primary Button'
  }
}`,...(M=(C=a.parameters)==null?void 0:C.docs)==null?void 0:M.source},description:{story:"Primary button - use for main actions and call-to-action buttons",...(V=(R=a.parameters)==null?void 0:R.docs)==null?void 0:V.description}}};var T,E,N,_,q;n.parameters={...n.parameters,docs:{...(T=n.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'Secondary Button'
  }
}`,...(N=(E=n.parameters)==null?void 0:E.docs)==null?void 0:N.source},description:{story:"Secondary button - use for secondary actions",...(q=(_=n.parameters)==null?void 0:_.docs)==null?void 0:q.description}}};var G,H,U,$,J;t.parameters={...t.parameters,docs:{...(G=t.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: 'Success Button'
  }
}`,...(U=(H=t.parameters)==null?void 0:H.docs)==null?void 0:U.source},description:{story:'Success button - use for positive actions (e.g., "Save", "Confirm")',...(J=($=t.parameters)==null?void 0:$.docs)==null?void 0:J.description}}};var K,Q,X,Y,Z;s.parameters={...s.parameters,docs:{...(K=s.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    children: 'Danger Button'
  }
}`,...(X=(Q=s.parameters)==null?void 0:Q.docs)==null?void 0:X.source},description:{story:'Danger button - use for destructive actions (e.g., "Delete", "Remove")',...(Z=(Y=s.parameters)==null?void 0:Y.docs)==null?void 0:Z.description}}};var rr,er,ar,nr,tr;i.parameters={...i.parameters,docs:{...(rr=i.parameters)==null?void 0:rr.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    children: 'Warning Button'
  }
}`,...(ar=(er=i.parameters)==null?void 0:er.docs)==null?void 0:ar.source},description:{story:"Warning button - use for actions that require caution",...(tr=(nr=i.parameters)==null?void 0:nr.docs)==null?void 0:tr.description}}};var sr,ir,or,cr,dr;o.parameters={...o.parameters,docs:{...(sr=o.parameters)==null?void 0:sr.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    children: 'Info Button'
  }
}`,...(or=(ir=o.parameters)==null?void 0:ir.docs)==null?void 0:or.source},description:{story:"Info button - use for informational actions",...(dr=(cr=o.parameters)==null?void 0:cr.docs)==null?void 0:dr.description}}};var lr,ur,pr,mr,gr;c.parameters={...c.parameters,docs:{...(lr=c.parameters)==null?void 0:lr.docs,source:{originalSource:`{
  args: {
    variant: 'light',
    children: 'Light Button'
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...(pr=(ur=c.parameters)==null?void 0:ur.docs)==null?void 0:pr.source},description:{story:"Light button - use on dark backgrounds",...(gr=(mr=c.parameters)==null?void 0:mr.docs)==null?void 0:gr.description}}};var yr,hr,vr,br,fr;d.parameters={...d.parameters,docs:{...(yr=d.parameters)==null?void 0:yr.docs,source:{originalSource:`{
  args: {
    variant: 'dark',
    children: 'Dark Button'
  }
}`,...(vr=(hr=d.parameters)==null?void 0:hr.docs)==null?void 0:vr.source},description:{story:"Dark button - use on light backgrounds",...(fr=(br=d.parameters)==null?void 0:br.docs)==null?void 0:fr.description}}};var Br,Sr,xr,kr,Dr;l.parameters={...l.parameters,docs:{...(Br=l.parameters)==null?void 0:Br.docs,source:{originalSource:`{
  args: {
    variant: 'outline-primary',
    children: 'Outline Primary'
  }
}`,...(xr=(Sr=l.parameters)==null?void 0:Sr.docs)==null?void 0:xr.source},description:{story:"Outline buttons - lighter weight variants",...(Dr=(kr=l.parameters)==null?void 0:kr.docs)==null?void 0:Dr.description}}};var Or,Wr,jr;B.parameters={...B.parameters,docs:{...(Or=B.parameters)==null?void 0:Or.docs,source:{originalSource:`{
  args: {
    variant: 'outline-secondary',
    children: 'Outline Secondary'
  }
}`,...(jr=(Wr=B.parameters)==null?void 0:Wr.docs)==null?void 0:jr.source}}};var zr,Lr,wr;S.parameters={...S.parameters,docs:{...(zr=S.parameters)==null?void 0:zr.docs,source:{originalSource:`{
  args: {
    variant: 'outline-success',
    children: 'Outline Success'
  }
}`,...(wr=(Lr=S.parameters)==null?void 0:Lr.docs)==null?void 0:wr.source}}};var Ir,Pr,Ar;x.parameters={...x.parameters,docs:{...(Ir=x.parameters)==null?void 0:Ir.docs,source:{originalSource:`{
  args: {
    variant: 'outline-danger',
    children: 'Outline Danger'
  }
}`,...(Ar=(Pr=x.parameters)==null?void 0:Pr.docs)==null?void 0:Ar.source}}};var Fr,Cr,Mr,Rr,Vr;u.parameters={...u.parameters,docs:{...(Fr=u.parameters)==null?void 0:Fr.docs,source:{originalSource:`{
  args: {
    variant: 'link',
    children: 'Link Button'
  }
}`,...(Mr=(Cr=u.parameters)==null?void 0:Cr.docs)==null?void 0:Mr.source},description:{story:"Link button - styled as a link but behaves as a button",...(Vr=(Rr=u.parameters)==null?void 0:Rr.docs)==null?void 0:Vr.description}}};var Tr,Er,Nr,_r,qr;p.parameters={...p.parameters,docs:{...(Tr=p.parameters)==null?void 0:Tr.docs,source:{originalSource:`{
  args: {
    size: 'sm',
    children: 'Small Button'
  }
}`,...(Nr=(Er=p.parameters)==null?void 0:Er.docs)==null?void 0:Nr.source},description:{story:"Button sizes",...(qr=(_r=p.parameters)==null?void 0:_r.docs)==null?void 0:qr.description}}};var Gr,Hr,Ur;k.parameters={...k.parameters,docs:{...(Gr=k.parameters)==null?void 0:Gr.docs,source:{originalSource:`{
  args: {
    size: 'md',
    children: 'Medium Button (Default)'
  }
}`,...(Ur=(Hr=k.parameters)==null?void 0:Hr.docs)==null?void 0:Ur.source}}};var $r,Jr,Kr;D.parameters={...D.parameters,docs:{...($r=D.parameters)==null?void 0:$r.docs,source:{originalSource:`{
  args: {
    size: 'lg',
    children: 'Large Button'
  }
}`,...(Kr=(Jr=D.parameters)==null?void 0:Jr.docs)==null?void 0:Kr.source}}};var Qr,Xr,Yr,Zr,re;m.parameters={...m.parameters,docs:{...(Qr=m.parameters)==null?void 0:Qr.docs,source:{originalSource:`{
  args: {
    disabled: true,
    children: 'Disabled Button'
    // Won't fire
  }
}`,...(Yr=(Xr=m.parameters)==null?void 0:Xr.docs)==null?void 0:Yr.source},description:{story:"Disabled state - prevents user interaction",...(re=(Zr=m.parameters)==null?void 0:Zr.docs)==null?void 0:re.description}}};var ee,ae,ne;O.parameters={...O.parameters,docs:{...(ee=O.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled Primary'
  }
}`,...(ne=(ae=O.parameters)==null?void 0:ae.docs)==null?void 0:ne.source}}};var te,se,ie;W.parameters={...W.parameters,docs:{...(te=W.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    variant: 'outline-primary',
    disabled: true,
    children: 'Disabled Outline'
  }
}`,...(ie=(se=W.parameters)==null?void 0:se.docs)==null?void 0:ie.source}}};var oe,ce,de,le,ue;g.parameters={...g.parameters,docs:{...(oe=g.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    fullWidth: true,
    children: 'Full Width Button'
  },
  parameters: {
    layout: 'padded'
  }
}`,...(de=(ce=g.parameters)==null?void 0:ce.docs)==null?void 0:de.source},description:{story:"Full width button",...(ue=(le=g.parameters)==null?void 0:le.docs)==null?void 0:ue.description}}};var pe,me,ge,ye,he;y.parameters={...y.parameters,docs:{...(pe=y.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  args: {
    type: 'submit',
    variant: 'success',
    children: 'Submit Form'
  }
}`,...(ge=(me=y.parameters)==null?void 0:me.docs)==null?void 0:ge.source},description:{story:"Button types for forms",...(he=(ye=y.parameters)==null?void 0:ye.docs)==null?void 0:he.description}}};var ve,be,fe;j.parameters={...j.parameters,docs:{...(ve=j.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  args: {
    type: 'reset',
    variant: 'secondary',
    children: 'Reset Form'
  }
}`,...(fe=(be=j.parameters)==null?void 0:be.docs)==null?void 0:fe.source}}};var Be,Se,xe,ke,De;h.parameters={...h.parameters,docs:{...(Be=h.parameters)==null?void 0:Be.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: <>✓ Save Changes</>
  }
}`,...(xe=(Se=h.parameters)==null?void 0:Se.docs)==null?void 0:xe.source},description:{story:"Buttons with icons (example using emoji)",...(De=(ke=h.parameters)==null?void 0:ke.docs)==null?void 0:De.description}}};var Oe,We,je;z.parameters={...z.parameters,docs:{...(Oe=z.parameters)==null?void 0:Oe.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: <>Next →</>
  }
}`,...(je=(We=z.parameters)==null?void 0:We.docs)==null?void 0:je.source}}};var ze,Le,we;L.parameters={...L.parameters,docs:{...(ze=L.parameters)==null?void 0:ze.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: '×',
    'aria-label': 'Close'
  }
}`,...(we=(Le=L.parameters)==null?void 0:Le.docs)==null?void 0:we.source}}};var Ie,Pe,Ae,Fe,Ce;v.parameters={...v.parameters,docs:{...(Ie=v.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: '×',
    'aria-label': 'Close dialog'
  }
}`,...(Ae=(Pe=v.parameters)==null?void 0:Pe.docs)==null?void 0:Ae.source},description:{story:"Accessibility examples",...(Ce=(Fe=v.parameters)==null?void 0:Fe.docs)==null?void 0:Ce.description}}};var Me,Re,Ve;w.parameters={...w.parameters,docs:{...(Me=w.parameters)==null?void 0:Me.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'Toggle Menu ▼',
    'aria-expanded': false,
    'aria-controls': 'menu'
  }
}`,...(Ve=(Re=w.parameters)==null?void 0:Re.docs)==null?void 0:Ve.source}}};var Te,Ee,Ne;I.parameters={...I.parameters,docs:{...(Te=I.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  args: {
    variant: 'outline-primary',
    children: 'Toggle Option',
    'aria-pressed': false
  }
}`,...(Ne=(Ee=I.parameters)==null?void 0:Ee.docs)==null?void 0:Ne.source}}};var _e,qe,Ge,He,Ue;b.parameters={...b.parameters,docs:{...(_e=b.parameters)==null?void 0:_e.docs,source:{originalSource:`{
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
}`,...(Ge=(qe=b.parameters)==null?void 0:qe.docs)==null?void 0:Ge.source},description:{story:"All variants showcase",...(Ue=(He=b.parameters)==null?void 0:He.docs)==null?void 0:Ue.description}}};var $e,Je,Ke,Qe,Xe;f.parameters={...f.parameters,docs:{...($e=f.parameters)==null?void 0:$e.docs,source:{originalSource:`{
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
}`,...(Ke=(Je=f.parameters)==null?void 0:Je.docs)==null?void 0:Ke.source},description:{story:"All sizes showcase",...(Xe=(Qe=f.parameters)==null?void 0:Qe.docs)==null?void 0:Xe.description}}};const ka=["Primary","Secondary","Success","Danger","Warning","Info","Light","Dark","OutlinePrimary","OutlineSecondary","OutlineSuccess","OutlineDanger","Link","SmallSize","MediumSize","LargeSize","Disabled","DisabledPrimary","DisabledOutline","FullWidth","SubmitButton","ResetButton","WithIconLeft","WithIconRight","IconOnly","WithAriaLabel","WithAriaExpanded","WithAriaPressed","AllVariants","AllSizes"];export{f as AllSizes,b as AllVariants,s as Danger,d as Dark,m as Disabled,W as DisabledOutline,O as DisabledPrimary,g as FullWidth,L as IconOnly,o as Info,D as LargeSize,c as Light,u as Link,k as MediumSize,x as OutlineDanger,l as OutlinePrimary,B as OutlineSecondary,S as OutlineSuccess,a as Primary,j as ResetButton,n as Secondary,p as SmallSize,y as SubmitButton,t as Success,i as Warning,w as WithAriaExpanded,v as WithAriaLabel,I as WithAriaPressed,h as WithIconLeft,z as WithIconRight,ka as __namedExportsOrder,xa as default};
