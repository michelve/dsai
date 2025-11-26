import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{B as r}from"./Tabs-Ct9YirVA.js";import{r as Ja}from"./iframe-BooCaz94.js";import"./preload-helper-Dp1pzeXC.js";const Qa=()=>e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",loading:!0,children:"Saving"}),e.jsx(r,{variant:"success",loading:!0,children:"Processing"}),e.jsx(r,{variant:"danger",loading:!0,children:"Deleting"}),e.jsx(r,{variant:"warning",loading:!0,children:"Loading"})]}),Xa=()=>e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",startIcon:"⬅",children:"Previous"}),e.jsx(r,{variant:"primary",endIcon:"➡",children:"Next"}),e.jsx(r,{variant:"primary",startIcon:"✓",endIcon:"→",children:"Confirm & Continue"}),e.jsx(r,{variant:"outline-secondary","aria-label":"Close dialog",children:"×"})]}),Ya=()=>{const[a,n]=Ja.useState(!1),G=()=>{n(!0),setTimeout(()=>n(!1),2e3)};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(r,{variant:"primary",loading:a,loadingText:"Saving...",announceText:a?"Saving your changes":"Changes saved successfully",announce:!0,onClick:G,disabled:a,children:a?"Saving...":"Save Changes"}),e.jsx("p",{style:{fontSize:"0.875rem",color:"#666"},children:"Click the button and watch the screen reader announcement region"})]})},Za=()=>{const[a,n]=Ja.useState("idle"),G=async()=>{n("loading"),await new Promise(H=>setTimeout(H,1500)),n("success"),setTimeout(()=>n("idle"),3e3)},Ka=async()=>{n("loading"),await new Promise(H=>setTimeout(H,1500)),n("error"),setTimeout(()=>n("idle"),3e3)},U={idle:"",loading:"Operation in progress...",success:"✓ Operation completed successfully",error:"⚠ Operation failed. Please try again."};return e.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"success",loading:a==="loading",announceText:U[a],announce:!0,onClick:G,disabled:a==="loading",children:a==="loading"?"Saving...":a==="success"?"✓ Saved":"Save"}),e.jsx(r,{variant:"danger",loading:a==="loading",announceText:U[a],announce:!0,onClick:Ka,disabled:a==="loading",children:a==="loading"?"Deleting...":a==="error"?"✗ Failed":"Delete"})]})},nn={title:"Components/Button",component:r,parameters:{layout:"centered",docs:{description:{component:"A versatile button component with multiple variants, sizes, and states. Fully accessible (WCAG 2.2 AA compliant) with keyboard navigation, focus management, and proper color contrast ratios. Uses design tokens for consistent theming."}},backgrounds:{default:"light",values:[{name:"light",value:"#ffffff"},{name:"dark",value:"#1a1a1a"},{name:"gray",value:"#f5f5f5"}]}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","success","danger","warning","info","light","dark","outline-primary","outline-secondary","outline-success","outline-danger","outline-warning","outline-info","outline-light","outline-dark","link"],description:"Button visual style variant",table:{type:{summary:"ButtonVariant"},defaultValue:{summary:"primary"}}},size:{control:"select",options:["sm","md","lg"],description:"Button size",table:{type:{summary:"ButtonSize"},defaultValue:{summary:"md"}}},disabled:{control:"boolean",description:"Disabled state - prevents user interaction",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},fullWidth:{control:"boolean",description:"Makes button 100% width",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},type:{control:"select",options:["button","submit","reset"],description:"Button HTML type attribute",table:{type:{summary:"ButtonType"},defaultValue:{summary:"button"}}},onClick:{action:"clicked",description:"Click event handler",table:{type:{summary:"(event: MouseEvent) => void"}}},children:{control:"text",description:"Button content",table:{type:{summary:"ReactNode"}}},loading:{control:"boolean",description:"Loading state - shows spinner and disables button",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},loadingText:{control:"text",description:"Text to show while loading (replaces children)",table:{type:{summary:"string"}}},startIcon:{control:!1,description:"Icon to display before button text (decorative, aria-hidden)",table:{type:{summary:"ReactNode"}}},endIcon:{control:!1,description:"Icon to display after button text (decorative, aria-hidden)",table:{type:{summary:"ReactNode"}}},announceText:{control:"text",description:'Announcement text for screen readers (aria-live="polite")',table:{type:{summary:"string"}}},announce:{control:"boolean",description:"Enable/disable announcements",table:{type:{summary:"boolean"},defaultValue:{summary:"true (when announceText provided)"}}}}},t={args:{variant:"primary",children:"Primary Button"}},s={args:{variant:"secondary",children:"Secondary Button"}},i={args:{variant:"success",children:"Success Button"}},o={args:{variant:"danger",children:"Danger Button"}},c={args:{variant:"warning",children:"Warning Button"}},d={args:{variant:"info",children:"Info Button"}},l={args:{variant:"light",children:"Light Button"},parameters:{backgrounds:{default:"dark"}}},u={args:{variant:"dark",children:"Dark Button"}},p={args:{variant:"outline-primary",children:"Outline Primary"}},I={args:{variant:"outline-secondary",children:"Outline Secondary"}},k={args:{variant:"outline-success",children:"Outline Success"}},W={args:{variant:"outline-danger",children:"Outline Danger"}},m={args:{variant:"link",children:"Link Button"}},g={args:{size:"sm",children:"Small Button"}},w={args:{size:"md",children:"Medium Button (Default)"}},O={args:{size:"lg",children:"Large Button"}},y={args:{disabled:!0,children:"Disabled Button"}},L={args:{variant:"primary",disabled:!0,children:"Disabled Primary"}},A={args:{variant:"outline-primary",disabled:!0,children:"Disabled Outline"}},h={args:{variant:"primary",fullWidth:!0,children:"Full Width Button"},parameters:{layout:"padded"}},v={args:{type:"submit",variant:"success",children:"Submit Form"}},C={args:{type:"reset",variant:"secondary",children:"Reset Form"}},S={args:{variant:"primary",children:e.jsx(e.Fragment,{children:"✓ Save Changes"})}},z={args:{variant:"primary",children:e.jsx(e.Fragment,{children:"Next →"})}},P={args:{variant:"primary",children:"×","aria-label":"Close"}},f={args:{variant:"primary",children:"×","aria-label":"Close dialog"}},T={args:{variant:"secondary",children:"Toggle Menu ▼","aria-expanded":!1,"aria-controls":"menu"}},V={args:{variant:"outline-primary",children:"Toggle Option","aria-pressed":!1}},x={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",alignItems:"flex-start"},children:[e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",children:"Primary"}),e.jsx(r,{variant:"secondary",children:"Secondary"}),e.jsx(r,{variant:"success",children:"Success"}),e.jsx(r,{variant:"danger",children:"Danger"}),e.jsx(r,{variant:"warning",children:"Warning"}),e.jsx(r,{variant:"info",children:"Info"}),e.jsx(r,{variant:"light",children:"Light"}),e.jsx(r,{variant:"dark",children:"Dark"})]}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"outline-primary",children:"Outline Primary"}),e.jsx(r,{variant:"outline-secondary",children:"Outline Secondary"}),e.jsx(r,{variant:"outline-success",children:"Outline Success"}),e.jsx(r,{variant:"outline-danger",children:"Outline Danger"})]}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"link",children:"Link"}),e.jsx(r,{variant:"primary",disabled:!0,children:"Disabled"})]})]}),parameters:{layout:"padded"}},b={args:{variant:"primary",children:"Saving...",loading:!0}},F={args:{variant:"primary",children:"Save Changes",loading:!0,loadingText:"Saving your changes..."}},M={render:()=>e.jsx(Qa,{})},B={args:{variant:"primary",startIcon:"⬅",children:"Previous"}},R={args:{variant:"primary",endIcon:"➡",children:"Next"}},E={args:{variant:"primary",startIcon:"✓",endIcon:"→",children:"Confirm & Continue"}},N={args:{variant:"outline-secondary",children:"×","aria-label":"Close dialog"}},_={render:()=>e.jsx(Xa,{})},D={render:()=>e.jsx(Ya,{})},q={render:()=>e.jsx(Za,{})},j={render:()=>e.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[e.jsx(r,{variant:"primary",size:"sm",children:"Small"}),e.jsx(r,{variant:"primary",size:"md",children:"Medium"}),e.jsx(r,{variant:"primary",size:"lg",children:"Large"})]})};var J,K,Q,X,Y;t.parameters={...t.parameters,docs:{...(J=t.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Primary Button'
  }
}`,...(Q=(K=t.parameters)==null?void 0:K.docs)==null?void 0:Q.source},description:{story:"Primary button - use for main actions and call-to-action buttons",...(Y=(X=t.parameters)==null?void 0:X.docs)==null?void 0:Y.description}}};var Z,$,ee,re,ae;s.parameters={...s.parameters,docs:{...(Z=s.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'Secondary Button'
  }
}`,...(ee=($=s.parameters)==null?void 0:$.docs)==null?void 0:ee.source},description:{story:"Secondary button - use for secondary actions",...(ae=(re=s.parameters)==null?void 0:re.docs)==null?void 0:ae.description}}};var ne,te,se,ie,oe;i.parameters={...i.parameters,docs:{...(ne=i.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: 'Success Button'
  }
}`,...(se=(te=i.parameters)==null?void 0:te.docs)==null?void 0:se.source},description:{story:'Success button - use for positive actions (e.g., "Save", "Confirm")',...(oe=(ie=i.parameters)==null?void 0:ie.docs)==null?void 0:oe.description}}};var ce,de,le,ue,pe;o.parameters={...o.parameters,docs:{...(ce=o.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    children: 'Danger Button'
  }
}`,...(le=(de=o.parameters)==null?void 0:de.docs)==null?void 0:le.source},description:{story:'Danger button - use for destructive actions (e.g., "Delete", "Remove")',...(pe=(ue=o.parameters)==null?void 0:ue.docs)==null?void 0:pe.description}}};var me,ge,ye,he,ve;c.parameters={...c.parameters,docs:{...(me=c.parameters)==null?void 0:me.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    children: 'Warning Button'
  }
}`,...(ye=(ge=c.parameters)==null?void 0:ge.docs)==null?void 0:ye.source},description:{story:"Warning button - use for actions that require caution",...(ve=(he=c.parameters)==null?void 0:he.docs)==null?void 0:ve.description}}};var Se,fe,xe,be,Be;d.parameters={...d.parameters,docs:{...(Se=d.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    children: 'Info Button'
  }
}`,...(xe=(fe=d.parameters)==null?void 0:fe.docs)==null?void 0:xe.source},description:{story:"Info button - use for informational actions",...(Be=(be=d.parameters)==null?void 0:be.docs)==null?void 0:Be.description}}};var De,je,Ie,ke,We;l.parameters={...l.parameters,docs:{...(De=l.parameters)==null?void 0:De.docs,source:{originalSource:`{
  args: {
    variant: 'light',
    children: 'Light Button'
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...(Ie=(je=l.parameters)==null?void 0:je.docs)==null?void 0:Ie.source},description:{story:"Light button - use on dark backgrounds",...(We=(ke=l.parameters)==null?void 0:ke.docs)==null?void 0:We.description}}};var we,Oe,Le,Ae,Ce;u.parameters={...u.parameters,docs:{...(we=u.parameters)==null?void 0:we.docs,source:{originalSource:`{
  args: {
    variant: 'dark',
    children: 'Dark Button'
  }
}`,...(Le=(Oe=u.parameters)==null?void 0:Oe.docs)==null?void 0:Le.source},description:{story:"Dark button - use on light backgrounds",...(Ce=(Ae=u.parameters)==null?void 0:Ae.docs)==null?void 0:Ce.description}}};var ze,Pe,Te,Ve,Fe;p.parameters={...p.parameters,docs:{...(ze=p.parameters)==null?void 0:ze.docs,source:{originalSource:`{
  args: {
    variant: 'outline-primary',
    children: 'Outline Primary'
  }
}`,...(Te=(Pe=p.parameters)==null?void 0:Pe.docs)==null?void 0:Te.source},description:{story:"Outline buttons - lighter weight variants",...(Fe=(Ve=p.parameters)==null?void 0:Ve.docs)==null?void 0:Fe.description}}};var Me,Re,Ee;I.parameters={...I.parameters,docs:{...(Me=I.parameters)==null?void 0:Me.docs,source:{originalSource:`{
  args: {
    variant: 'outline-secondary',
    children: 'Outline Secondary'
  }
}`,...(Ee=(Re=I.parameters)==null?void 0:Re.docs)==null?void 0:Ee.source}}};var Ne,_e,qe;k.parameters={...k.parameters,docs:{...(Ne=k.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  args: {
    variant: 'outline-success',
    children: 'Outline Success'
  }
}`,...(qe=(_e=k.parameters)==null?void 0:_e.docs)==null?void 0:qe.source}}};var Ge,He,Ue;W.parameters={...W.parameters,docs:{...(Ge=W.parameters)==null?void 0:Ge.docs,source:{originalSource:`{
  args: {
    variant: 'outline-danger',
    children: 'Outline Danger'
  }
}`,...(Ue=(He=W.parameters)==null?void 0:He.docs)==null?void 0:Ue.source}}};var Je,Ke,Qe,Xe,Ye;m.parameters={...m.parameters,docs:{...(Je=m.parameters)==null?void 0:Je.docs,source:{originalSource:`{
  args: {
    variant: 'link',
    children: 'Link Button'
  }
}`,...(Qe=(Ke=m.parameters)==null?void 0:Ke.docs)==null?void 0:Qe.source},description:{story:"Link button - styled as a link but behaves as a button",...(Ye=(Xe=m.parameters)==null?void 0:Xe.docs)==null?void 0:Ye.description}}};var Ze,$e,er,rr,ar;g.parameters={...g.parameters,docs:{...(Ze=g.parameters)==null?void 0:Ze.docs,source:{originalSource:`{
  args: {
    size: 'sm',
    children: 'Small Button'
  }
}`,...(er=($e=g.parameters)==null?void 0:$e.docs)==null?void 0:er.source},description:{story:"Button sizes",...(ar=(rr=g.parameters)==null?void 0:rr.docs)==null?void 0:ar.description}}};var nr,tr,sr;w.parameters={...w.parameters,docs:{...(nr=w.parameters)==null?void 0:nr.docs,source:{originalSource:`{
  args: {
    size: 'md',
    children: 'Medium Button (Default)'
  }
}`,...(sr=(tr=w.parameters)==null?void 0:tr.docs)==null?void 0:sr.source}}};var ir,or,cr;O.parameters={...O.parameters,docs:{...(ir=O.parameters)==null?void 0:ir.docs,source:{originalSource:`{
  args: {
    size: 'lg',
    children: 'Large Button'
  }
}`,...(cr=(or=O.parameters)==null?void 0:or.docs)==null?void 0:cr.source}}};var dr,lr,ur,pr,mr;y.parameters={...y.parameters,docs:{...(dr=y.parameters)==null?void 0:dr.docs,source:{originalSource:`{
  args: {
    disabled: true,
    children: 'Disabled Button'
    // Won't fire
  }
}`,...(ur=(lr=y.parameters)==null?void 0:lr.docs)==null?void 0:ur.source},description:{story:"Disabled state - prevents user interaction",...(mr=(pr=y.parameters)==null?void 0:pr.docs)==null?void 0:mr.description}}};var gr,yr,hr;L.parameters={...L.parameters,docs:{...(gr=L.parameters)==null?void 0:gr.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled Primary'
  }
}`,...(hr=(yr=L.parameters)==null?void 0:yr.docs)==null?void 0:hr.source}}};var vr,Sr,fr;A.parameters={...A.parameters,docs:{...(vr=A.parameters)==null?void 0:vr.docs,source:{originalSource:`{
  args: {
    variant: 'outline-primary',
    disabled: true,
    children: 'Disabled Outline'
  }
}`,...(fr=(Sr=A.parameters)==null?void 0:Sr.docs)==null?void 0:fr.source}}};var xr,br,Br,Dr,jr;h.parameters={...h.parameters,docs:{...(xr=h.parameters)==null?void 0:xr.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    fullWidth: true,
    children: 'Full Width Button'
  },
  parameters: {
    layout: 'padded'
  }
}`,...(Br=(br=h.parameters)==null?void 0:br.docs)==null?void 0:Br.source},description:{story:"Full width button",...(jr=(Dr=h.parameters)==null?void 0:Dr.docs)==null?void 0:jr.description}}};var Ir,kr,Wr,wr,Or;v.parameters={...v.parameters,docs:{...(Ir=v.parameters)==null?void 0:Ir.docs,source:{originalSource:`{
  args: {
    type: 'submit',
    variant: 'success',
    children: 'Submit Form'
  }
}`,...(Wr=(kr=v.parameters)==null?void 0:kr.docs)==null?void 0:Wr.source},description:{story:"Button types for forms",...(Or=(wr=v.parameters)==null?void 0:wr.docs)==null?void 0:Or.description}}};var Lr,Ar,Cr;C.parameters={...C.parameters,docs:{...(Lr=C.parameters)==null?void 0:Lr.docs,source:{originalSource:`{
  args: {
    type: 'reset',
    variant: 'secondary',
    children: 'Reset Form'
  }
}`,...(Cr=(Ar=C.parameters)==null?void 0:Ar.docs)==null?void 0:Cr.source}}};var zr,Pr,Tr,Vr,Fr;S.parameters={...S.parameters,docs:{...(zr=S.parameters)==null?void 0:zr.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: <>✓ Save Changes</>
  }
}`,...(Tr=(Pr=S.parameters)==null?void 0:Pr.docs)==null?void 0:Tr.source},description:{story:"Buttons with icons (example using emoji)",...(Fr=(Vr=S.parameters)==null?void 0:Vr.docs)==null?void 0:Fr.description}}};var Mr,Rr,Er;z.parameters={...z.parameters,docs:{...(Mr=z.parameters)==null?void 0:Mr.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: <>Next →</>
  }
}`,...(Er=(Rr=z.parameters)==null?void 0:Rr.docs)==null?void 0:Er.source}}};var Nr,_r,qr;P.parameters={...P.parameters,docs:{...(Nr=P.parameters)==null?void 0:Nr.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: '×',
    'aria-label': 'Close'
  }
}`,...(qr=(_r=P.parameters)==null?void 0:_r.docs)==null?void 0:qr.source}}};var Gr,Hr,Ur,Jr,Kr;f.parameters={...f.parameters,docs:{...(Gr=f.parameters)==null?void 0:Gr.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: '×',
    'aria-label': 'Close dialog'
  }
}`,...(Ur=(Hr=f.parameters)==null?void 0:Hr.docs)==null?void 0:Ur.source},description:{story:"Accessibility examples",...(Kr=(Jr=f.parameters)==null?void 0:Jr.docs)==null?void 0:Kr.description}}};var Qr,Xr,Yr;T.parameters={...T.parameters,docs:{...(Qr=T.parameters)==null?void 0:Qr.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'Toggle Menu ▼',
    'aria-expanded': false,
    'aria-controls': 'menu'
  }
}`,...(Yr=(Xr=T.parameters)==null?void 0:Xr.docs)==null?void 0:Yr.source}}};var Zr,$r,ea;V.parameters={...V.parameters,docs:{...(Zr=V.parameters)==null?void 0:Zr.docs,source:{originalSource:`{
  args: {
    variant: 'outline-primary',
    children: 'Toggle Option',
    'aria-pressed': false
  }
}`,...(ea=($r=V.parameters)==null?void 0:$r.docs)==null?void 0:ea.source}}};var ra,aa,na,ta,sa;x.parameters={...x.parameters,docs:{...(ra=x.parameters)==null?void 0:ra.docs,source:{originalSource:`{
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
}`,...(na=(aa=x.parameters)==null?void 0:aa.docs)==null?void 0:na.source},description:{story:"All variants showcase",...(sa=(ta=x.parameters)==null?void 0:ta.docs)==null?void 0:sa.description}}};var ia,oa,ca,da,la;b.parameters={...b.parameters,docs:{...(ia=b.parameters)==null?void 0:ia.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Saving...',
    loading: true
  }
}`,...(ca=(oa=b.parameters)==null?void 0:oa.docs)==null?void 0:ca.source},description:{story:"Loading states showcase",...(la=(da=b.parameters)==null?void 0:da.docs)==null?void 0:la.description}}};var ua,pa,ma;F.parameters={...F.parameters,docs:{...(ua=F.parameters)==null?void 0:ua.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Save Changes',
    loading: true,
    loadingText: 'Saving your changes...'
  }
}`,...(ma=(pa=F.parameters)==null?void 0:pa.docs)==null?void 0:ma.source}}};var ga,ya,ha;M.parameters={...M.parameters,docs:{...(ga=M.parameters)==null?void 0:ga.docs,source:{originalSource:`{
  render: () => <LoadingVariantsShowcase />
}`,...(ha=(ya=M.parameters)==null?void 0:ya.docs)==null?void 0:ha.source}}};var va,Sa,fa,xa,ba;B.parameters={...B.parameters,docs:{...(va=B.parameters)==null?void 0:va.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    startIcon: '⬅',
    children: 'Previous'
  }
}`,...(fa=(Sa=B.parameters)==null?void 0:Sa.docs)==null?void 0:fa.source},description:{story:"Icon support with new props",...(ba=(xa=B.parameters)==null?void 0:xa.docs)==null?void 0:ba.description}}};var Ba,Da,ja;R.parameters={...R.parameters,docs:{...(Ba=R.parameters)==null?void 0:Ba.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    endIcon: '➡',
    children: 'Next'
  }
}`,...(ja=(Da=R.parameters)==null?void 0:Da.docs)==null?void 0:ja.source}}};var Ia,ka,Wa;E.parameters={...E.parameters,docs:{...(Ia=E.parameters)==null?void 0:Ia.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    startIcon: '✓',
    endIcon: '→',
    children: 'Confirm & Continue'
  }
}`,...(Wa=(ka=E.parameters)==null?void 0:ka.docs)==null?void 0:Wa.source}}};var wa,Oa,La;N.parameters={...N.parameters,docs:{...(wa=N.parameters)==null?void 0:wa.docs,source:{originalSource:`{
  args: {
    variant: 'outline-secondary',
    children: '×',
    'aria-label': 'Close dialog'
  }
}`,...(La=(Oa=N.parameters)==null?void 0:Oa.docs)==null?void 0:La.source}}};var Aa,Ca,za;_.parameters={..._.parameters,docs:{...(Aa=_.parameters)==null?void 0:Aa.docs,source:{originalSource:`{
  render: () => <IconsShowcase />
}`,...(za=(Ca=_.parameters)==null?void 0:Ca.docs)==null?void 0:za.source}}};var Pa,Ta,Va,Fa,Ma;D.parameters={...D.parameters,docs:{...(Pa=D.parameters)==null?void 0:Pa.docs,source:{originalSource:`{
  render: () => <AnnouncementDemo />
}`,...(Va=(Ta=D.parameters)==null?void 0:Ta.docs)==null?void 0:Va.source},description:{story:"Aria-live announcements for dynamic state changes",...(Ma=(Fa=D.parameters)==null?void 0:Fa.docs)==null?void 0:Ma.description}}};var Ra,Ea,Na;q.parameters={...q.parameters,docs:{...(Ra=q.parameters)==null?void 0:Ra.docs,source:{originalSource:`{
  render: () => <MultiStateAnnouncementDemo />
}`,...(Na=(Ea=q.parameters)==null?void 0:Ea.docs)==null?void 0:Na.source}}};var _a,qa,Ga,Ha,Ua;j.parameters={...j.parameters,docs:{...(_a=j.parameters)==null?void 0:_a.docs,source:{originalSource:`{
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
}`,...(Ga=(qa=j.parameters)==null?void 0:qa.docs)==null?void 0:Ga.source},description:{story:"All sizes showcase",...(Ua=(Ha=j.parameters)==null?void 0:Ha.docs)==null?void 0:Ua.description}}};const tn=["Primary","Secondary","Success","Danger","Warning","Info","Light","Dark","OutlinePrimary","OutlineSecondary","OutlineSuccess","OutlineDanger","Link","SmallSize","MediumSize","LargeSize","Disabled","DisabledPrimary","DisabledOutline","FullWidth","SubmitButton","ResetButton","WithIconLeft","WithIconRight","IconOnly","WithAriaLabel","WithAriaExpanded","WithAriaPressed","AllVariants","Loading","LoadingWithText","LoadingDifferentVariants","WithStartIcon","WithEndIcon","WithBothIcons","IconOnlyButton","AllIconsShowcase","WithAnnouncement","AnnounceDifferentStates","AllSizes"];export{_ as AllIconsShowcase,j as AllSizes,x as AllVariants,q as AnnounceDifferentStates,o as Danger,u as Dark,y as Disabled,A as DisabledOutline,L as DisabledPrimary,h as FullWidth,P as IconOnly,N as IconOnlyButton,d as Info,O as LargeSize,l as Light,m as Link,b as Loading,M as LoadingDifferentVariants,F as LoadingWithText,w as MediumSize,W as OutlineDanger,p as OutlinePrimary,I as OutlineSecondary,k as OutlineSuccess,t as Primary,C as ResetButton,s as Secondary,g as SmallSize,v as SubmitButton,i as Success,c as Warning,D as WithAnnouncement,T as WithAriaExpanded,f as WithAriaLabel,V as WithAriaPressed,E as WithBothIcons,R as WithEndIcon,S as WithIconLeft,z as WithIconRight,B as WithStartIcon,tn as __namedExportsOrder,nn as default};
