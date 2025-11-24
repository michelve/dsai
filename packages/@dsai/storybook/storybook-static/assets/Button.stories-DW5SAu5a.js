import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as n}from"./iframe-Bfk6g-kH.js";import"./preload-helper-Dp1pzeXC.js";function o(...r){return r.filter(Boolean).join(" ")}function ae(r="dsai"){return`${r}-${Math.random().toString(36).substring(2,9)}`}var ss=({className:r})=>e.jsx("span",{className:o("spinner-border spinner-border-sm",r),role:"status","aria-hidden":"true"}),u=n.forwardRef(({children:r,className:s,variant:a="primary",size:t,type:i="button",fullWidth:l=!1,loading:d=!1,loadingText:c,leftIcon:m,rightIcon:y,active:f=!1,disabled:g,as:v="button",href:p,...b},N)=>{let x=g||d,j=o("btn",`btn-${a}`,t&&`btn-${t}`,l&&"w-100",f&&"active",x&&v==="a"&&"disabled",s),V=d?e.jsxs(e.Fragment,{children:[e.jsx(ss,{className:c||r?"me-2":void 0}),c||r]}):e.jsxs(e.Fragment,{children:[m&&e.jsx("span",{className:"me-2",children:m}),r,y&&e.jsx("span",{className:"ms-2",children:y})]});return v==="a"?e.jsx("a",{ref:N,href:p,className:j,role:"button","aria-disabled":x,tabIndex:x?-1:void 0,...b,children:V}):e.jsx("button",{ref:N,type:i,className:j,disabled:x,"aria-busy":d,"aria-pressed":f,...b,children:V})});u.displayName="Button";var ts=n.forwardRef(({children:r,className:s,size:a,vertical:t=!1,role:i="group",...l},d)=>{let c=o(t?"btn-group-vertical":"btn-group",a&&`btn-group-${a}`,s);return e.jsx("div",{ref:d,className:c,role:i,...l,children:r})});ts.displayName="ButtonGroup";var ns=n.forwardRef(({animation:r="border",size:s,variant:a,label:t="Loading...",className:i,...l},d)=>{let c=r==="grow"?"spinner-grow":"spinner-border",m=o(c,s&&`${c}-${s}`,a&&`text-${a}`,i);return e.jsx("span",{ref:d,className:m,role:"status",...l,children:e.jsx("span",{className:"visually-hidden",children:t})})});ns.displayName="Spinner";var re=n.forwardRef(({as:r="h4",className:s,...a},t)=>e.jsx(r,{ref:t,className:o("alert-heading",s),...a}));re.displayName="AlertHeading";var Br=n.forwardRef(({className:r,...s},a)=>e.jsx("a",{ref:a,className:o("alert-link",r),...s}));Br.displayName="AlertLink";var is=({onClick:r,"aria-label":s="Close"})=>e.jsx("button",{type:"button",className:"btn-close","aria-label":s,onClick:r}),Sr=n.forwardRef(({children:r,className:s,variant:a="primary",dismissible:t=!1,onClose:i,show:l,heading:d,role:c="alert",...m},y)=>{let[f,g]=n.useState(!0),v=l!==void 0,p=v?l:f,b=n.useCallback(()=>{v||g(!1),i==null||i()},[v,i]);if(!p)return null;let N=o("alert",`alert-${a}`,t&&"alert-dismissible fade show",s);return e.jsxs("div",{ref:y,className:N,role:c,...m,children:[d&&e.jsx(re,{children:d}),r,t&&e.jsx(is,{onClick:b})]})});Sr.displayName="Alert";Object.assign(Sr,{Heading:re,Link:Br});var os=n.forwardRef(({children:r,className:s,variant:a="primary",pill:t=!1,as:i="span",href:l,...d},c)=>{let m=o("badge",`text-bg-${a}`,t&&"rounded-pill",s);return i==="a"?e.jsx("a",{ref:c,href:l,className:m,...d,children:r}):i==="button"?e.jsx("button",{ref:c,type:"button",className:m,...d,children:r}):e.jsx("span",{ref:c,className:m,...d,children:r})});os.displayName="Badge";var wr=n.createContext({}),kr=n.forwardRef(({children:r,className:s,variant:a,bg:t,text:i,textAlign:l,...d},c)=>{let m=o("card",a&&`border-${a}`,t&&`bg-${t}`,i&&`text-${i}`,l&&`text-${l}`,s);return e.jsx(wr.Provider,{value:{variant:a},children:e.jsx("div",{ref:c,className:m,...d,children:r})})});kr.displayName="Card";var Cr=n.forwardRef(({as:r="div",className:s,...a},t)=>{let{variant:i}=n.useContext(wr);return e.jsx(r,{ref:t,className:o("card-header",i&&`bg-${i} text-white`,s),...a})});Cr.displayName="CardHeader";var Rr=n.forwardRef(({className:r,...s},a)=>e.jsx("div",{ref:a,className:o("card-body",r),...s}));Rr.displayName="CardBody";var Dr=n.forwardRef(({className:r,...s},a)=>e.jsx("div",{ref:a,className:o("card-footer",r),...s}));Dr.displayName="CardFooter";var Lr=n.forwardRef(({as:r="h5",className:s,...a},t)=>e.jsx(r,{ref:t,className:o("card-title",s),...a}));Lr.displayName="CardTitle";var Or=n.forwardRef(({as:r="h6",className:s,...a},t)=>e.jsx(r,{ref:t,className:o("card-subtitle mb-2 text-body-secondary",s),...a}));Or.displayName="CardSubtitle";var Ir=n.forwardRef(({className:r,...s},a)=>e.jsx("p",{ref:a,className:o("card-text",r),...s}));Ir.displayName="CardText";var zr=n.forwardRef(({className:r,...s},a)=>e.jsx("a",{ref:a,className:o("card-link",r),...s}));zr.displayName="CardLink";var Fr=n.forwardRef(({className:r,position:s,...a},t)=>e.jsx("img",{ref:t,className:o(s?`card-img-${s}`:"card-img",r),...a}));Fr.displayName="CardImg";var Wr=n.forwardRef(({className:r,...s},a)=>e.jsx("div",{ref:a,className:o("card-img-overlay",r),...s}));Wr.displayName="CardImgOverlay";var ls=n.forwardRef(({className:r,...s},a)=>e.jsx("div",{ref:a,className:o("card-group",r),...s}));ls.displayName="CardGroup";Object.assign(kr,{Header:Cr,Body:Rr,Footer:Dr,Title:Lr,Subtitle:Or,Text:Ir,Link:zr,Img:Fr,ImgOverlay:Wr});var se=n.forwardRef(({children:r,className:s,closeButton:a=!0,closeLabel:t="Close",onHide:i,...l},d)=>e.jsxs("div",{ref:d,className:o("modal-header",s),...l,children:[r,a&&e.jsx("button",{type:"button",className:"btn-close","aria-label":t,onClick:i})]}));se.displayName="ModalHeader";var $r=n.forwardRef(({as:r="h5",className:s,...a},t)=>e.jsx(r,{ref:t,className:o("modal-title",s),...a}));$r.displayName="ModalTitle";var Tr=n.forwardRef(({className:r,...s},a)=>e.jsx("div",{ref:a,className:o("modal-body",r),...s}));Tr.displayName="ModalBody";var Pr=n.forwardRef(({className:r,...s},a)=>e.jsx("div",{ref:a,className:o("modal-footer",r),...s}));Pr.displayName="ModalFooter";var Ar=n.forwardRef(({children:r,className:s,show:a,onHide:t,size:i,fullscreen:l,centered:d=!1,scrollable:c=!1,staticBackdrop:m=!1,backdrop:y=!0,keyboard:f=!0,animation:g=!0,"aria-labelledby":v,"aria-describedby":p,...b},N)=>{let x=n.useRef(null),j=n.useCallback(h=>{f&&h.key==="Escape"&&t()},[f,t]),V=n.useCallback(h=>{!m&&h.target===h.currentTarget&&t()},[m,t]);if(n.useEffect(()=>(a&&(document.addEventListener("keydown",j),document.body.classList.add("modal-open"),document.body.style.overflow="hidden",document.body.style.paddingRight="0px"),()=>{document.removeEventListener("keydown",j),document.body.classList.remove("modal-open"),document.body.style.overflow="",document.body.style.paddingRight=""}),[a,j]),n.useEffect(()=>{if(a&&x.current){let h=x.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');h.length>0&&h[0].focus()}},[a]),!a)return null;let Yr=l===!0?"modal-fullscreen":l?`modal-fullscreen-${l}`:"",es=o("modal-dialog",i&&`modal-${i}`,Yr,d&&"modal-dialog-centered",c&&"modal-dialog-scrollable"),as=o("modal",g&&"fade",a&&"show",s),rs=n.Children.map(r,h=>n.isValidElement(h)&&h.type===se?n.cloneElement(h,{onHide:t}):h);return e.jsxs(e.Fragment,{children:[y&&e.jsx("div",{className:o("modal-backdrop",g&&"fade",a&&"show"),onClick:m?void 0:t}),e.jsx("div",{ref:x,className:as,tabIndex:-1,role:"dialog","aria-modal":"true","aria-labelledby":v,"aria-describedby":p,style:{display:"block"},onClick:V,...b,children:e.jsx("div",{ref:N,className:es,children:e.jsx("div",{className:"modal-content",children:rs})})})]})});Ar.displayName="Modal";Object.assign(Ar,{Header:se,Title:$r,Body:Tr,Footer:Pr});var B=n.createContext({}),Mr=n.forwardRef(({className:r,validated:s,...a},t)=>e.jsx("form",{ref:t,className:o(s&&"was-validated",r),...a}));Mr.displayName="Form";var Er=n.forwardRef(({className:r,controlId:s,children:a,...t},i)=>{let l=s||ae("form");return e.jsx(B.Provider,{value:{controlId:l},children:e.jsx("div",{ref:i,className:o("mb-3",r),...t,children:a})})});Er.displayName="FormGroup";var Vr=n.forwardRef(({className:r,visuallyHidden:s,column:a,htmlFor:t,...i},l)=>{let{controlId:d}=n.useContext(B),c=a===!0?"col-form-label":a?`col-form-label col-form-label-${a}`:"";return e.jsx("label",{ref:l,htmlFor:t||d,className:o("form-label",c,s&&"visually-hidden",r),...i})});Vr.displayName="FormLabel";var Hr=n.forwardRef(({className:r,controlSize:s,plaintext:a,isValid:t,isInvalid:i,as:l="input",id:d,rows:c,...m},y)=>{let{controlId:f}=n.useContext(B),g=o(a?"form-control-plaintext":"form-control",s&&`form-control-${s}`,t&&"is-valid",i&&"is-invalid",r);return l==="textarea"?e.jsx("textarea",{ref:y,id:d||f,className:g,rows:c,...m}):e.jsx("input",{ref:y,id:d||f,className:g,...m})});Hr.displayName="FormControl";var Gr=n.forwardRef(({className:r,controlSize:s,isValid:a,isInvalid:t,htmlSize:i,id:l,...d},c)=>{let{controlId:m}=n.useContext(B);return e.jsx("select",{ref:c,id:l||m,size:i,className:o("form-select",s&&`form-select-${s}`,a&&"is-valid",t&&"is-invalid",r),...d})});Gr.displayName="FormSelect";var qr=n.forwardRef(({className:r,type:s="checkbox",label:a,inline:t,reverse:i,isValid:l,isInvalid:d,feedback:c,feedbackType:m,id:y,...f},g)=>{let{controlId:v}=n.useContext(B),p=y||v||ae("check"),b=o("form-check-input",l&&"is-valid",d&&"is-invalid");return e.jsxs("div",{className:o("form-check",s==="switch"&&"form-switch",t&&"form-check-inline",i&&"form-check-reverse",r),children:[e.jsx("input",{ref:g,type:s==="switch"?"checkbox":s,role:s==="switch"?"switch":void 0,id:p,className:b,...f}),a&&e.jsx("label",{className:"form-check-label",htmlFor:p,children:a}),c&&e.jsx("div",{className:`${m||"invalid"}-feedback`,children:c})]})});qr.displayName="FormCheck";var Ur=n.forwardRef(({className:r,muted:s=!0,...a},t)=>e.jsx("div",{ref:t,className:o("form-text",s&&"text-body-secondary",r),...a}));Ur.displayName="FormText";var Zr=n.forwardRef(({className:r,type:s="invalid",tooltip:a,...t},i)=>e.jsx("div",{ref:i,className:o(a?`${s}-tooltip`:`${s}-feedback`,r),...t}));Zr.displayName="FormFeedback";var _r=n.forwardRef(({className:r,label:s,controlId:a,children:t,...i},l)=>{let d=a||ae("floating");return e.jsx(B.Provider,{value:{controlId:d},children:e.jsxs("div",{ref:l,className:o("form-floating",r),...i,children:[t,e.jsx("label",{htmlFor:d,children:s})]})})});_r.displayName="FloatingLabel";var Jr=n.forwardRef(({className:r,size:s,hasValidation:a,...t},i)=>e.jsx("div",{ref:i,className:o("input-group",s&&`input-group-${s}`,a&&"has-validation",r),...t}));Jr.displayName="InputGroup";var Kr=n.forwardRef(({className:r,...s},a)=>e.jsx("span",{ref:a,className:o("input-group-text",r),...s}));Kr.displayName="InputGroupText";Object.assign(Mr,{Group:Er,Label:Vr,Control:Hr,Select:Gr,Check:qr,Text:Ur,Feedback:Zr,FloatingLabel:_r});Object.assign(Jr,{Text:Kr});var te=n.forwardRef(({children:r,className:s,closeButton:a=!0,closeLabel:t="Close",onClose:i,...l},d)=>e.jsxs("div",{ref:d,className:o("toast-header",s),...l,children:[r,a&&e.jsx("button",{type:"button",className:"btn-close","aria-label":t,onClick:i})]}));te.displayName="ToastHeader";var Qr=n.forwardRef(({className:r,...s},a)=>e.jsx("div",{ref:a,className:o("toast-body",r),...s}));Qr.displayName="ToastBody";var Xr=n.forwardRef(({children:r,className:s,show:a=!0,onClose:t,delay:i=5e3,autohide:l=!0,bg:d,animation:c=!0,role:m="alert",...y},f)=>{if(n.useEffect(()=>{if(a&&l&&i>0&&t){let p=setTimeout(t,i);return()=>clearTimeout(p)}},[a,l,i,t]),!a)return null;let g=o("toast",c&&"fade",a&&"show",d&&`text-bg-${d}`,s),v=n.Children.map(r,p=>n.isValidElement(p)&&p.type===te?n.cloneElement(p,{onClose:t}):p);return e.jsx("div",{ref:f,className:g,role:m,"aria-live":"assertive","aria-atomic":"true",...y,children:v})});Xr.displayName="Toast";var ds=n.forwardRef(({className:r,position:s,containerPosition:a="fixed",...t},i)=>{let l=s?`position-${a} ${cs(s)}`:"";return e.jsx("div",{ref:i,className:o("toast-container",l,r),...t})});ds.displayName="ToastContainer";function cs(r){return{"top-start":"top-0 start-0","top-center":"top-0 start-50 translate-middle-x","top-end":"top-0 end-0","middle-start":"top-50 start-0 translate-middle-y","middle-center":"top-50 start-50 translate-middle","middle-end":"top-50 end-0 translate-middle-y","bottom-start":"bottom-0 start-0","bottom-center":"bottom-0 start-50 translate-middle-x","bottom-end":"bottom-0 end-0"}[r]??""}Object.assign(Xr,{Header:te,Body:Qr});const fs={title:"Components/Button",component:u,parameters:{layout:"centered",docs:{description:{component:"A versatile button component with multiple variants, sizes, and states. Fully accessible (WCAG 2.2 AA compliant) with keyboard navigation, focus management, and proper color contrast ratios. Uses design tokens for consistent theming."}},backgrounds:{default:"light",values:[{name:"light",value:"#ffffff"},{name:"dark",value:"#1a1a1a"},{name:"gray",value:"#f5f5f5"}]}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","success","danger","warning","info","light","dark","outline-primary","outline-secondary","outline-success","outline-danger","outline-warning","outline-info","outline-light","outline-dark","link"],description:"Button visual style variant",table:{type:{summary:"ButtonVariant"},defaultValue:{summary:"primary"}}},size:{control:"select",options:["sm","md","lg"],description:"Button size",table:{type:{summary:"ButtonSize"},defaultValue:{summary:"md"}}},disabled:{control:"boolean",description:"Disabled state - prevents user interaction",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},fullWidth:{control:"boolean",description:"Makes button 100% width",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},type:{control:"select",options:["button","submit","reset"],description:"Button HTML type attribute",table:{type:{summary:"ButtonType"},defaultValue:{summary:"button"}}},onClick:{action:"clicked",description:"Click event handler",table:{type:{summary:"(event: MouseEvent) => void"}}},children:{control:"text",description:"Button content",table:{type:{summary:"ReactNode"}}}}},S={args:{variant:"primary",children:"Primary Button"}},w={args:{variant:"secondary",children:"Secondary Button"}},k={args:{variant:"success",children:"Success Button"}},C={args:{variant:"danger",children:"Danger Button"}},R={args:{variant:"warning",children:"Warning Button"}},D={args:{variant:"info",children:"Info Button"}},L={args:{variant:"light",children:"Light Button"},parameters:{backgrounds:{default:"dark"}}},O={args:{variant:"dark",children:"Dark Button"}},I={args:{variant:"outline-primary",children:"Outline Primary"}},H={args:{variant:"outline-secondary",children:"Outline Secondary"}},G={args:{variant:"outline-success",children:"Outline Success"}},q={args:{variant:"outline-danger",children:"Outline Danger"}},z={args:{variant:"link",children:"Link Button"}},F={args:{size:"sm",children:"Small Button"}},U={args:{size:"md",children:"Medium Button (Default)"}},Z={args:{size:"lg",children:"Large Button"}},W={args:{disabled:!0,children:"Disabled Button"}},_={args:{variant:"primary",disabled:!0,children:"Disabled Primary"}},J={args:{variant:"outline-primary",disabled:!0,children:"Disabled Outline"}},$={args:{variant:"primary",fullWidth:!0,children:"Full Width Button"},parameters:{layout:"padded"}},T={args:{type:"submit",variant:"success",children:"Submit Form"}},K={args:{type:"reset",variant:"secondary",children:"Reset Form"}},P={args:{variant:"primary",children:e.jsx(e.Fragment,{children:"✓ Save Changes"})}},Q={args:{variant:"primary",children:e.jsx(e.Fragment,{children:"Next →"})}},X={args:{variant:"primary",children:"×","aria-label":"Close"}},A={args:{variant:"primary",children:"×","aria-label":"Close dialog"}},Y={args:{variant:"secondary",children:"Toggle Menu ▼","aria-expanded":!1,"aria-controls":"menu"}},ee={args:{variant:"outline-primary",children:"Toggle Option","aria-pressed":!1}},M={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",alignItems:"flex-start"},children:[e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(u,{variant:"primary",children:"Primary"}),e.jsx(u,{variant:"secondary",children:"Secondary"}),e.jsx(u,{variant:"success",children:"Success"}),e.jsx(u,{variant:"danger",children:"Danger"}),e.jsx(u,{variant:"warning",children:"Warning"}),e.jsx(u,{variant:"info",children:"Info"}),e.jsx(u,{variant:"light",children:"Light"}),e.jsx(u,{variant:"dark",children:"Dark"})]}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(u,{variant:"outline-primary",children:"Outline Primary"}),e.jsx(u,{variant:"outline-secondary",children:"Outline Secondary"}),e.jsx(u,{variant:"outline-success",children:"Outline Success"}),e.jsx(u,{variant:"outline-danger",children:"Outline Danger"})]}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(u,{variant:"link",children:"Link"}),e.jsx(u,{variant:"primary",disabled:!0,children:"Disabled"})]})]}),parameters:{layout:"padded"}},E={render:()=>e.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[e.jsx(u,{variant:"primary",size:"sm",children:"Small"}),e.jsx(u,{variant:"primary",size:"md",children:"Medium"}),e.jsx(u,{variant:"primary",size:"lg",children:"Large"})]})};var ne,ie,oe,le,de;S.parameters={...S.parameters,docs:{...(ne=S.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Primary Button'
  }
}`,...(oe=(ie=S.parameters)==null?void 0:ie.docs)==null?void 0:oe.source},description:{story:"Primary button - use for main actions and call-to-action buttons",...(de=(le=S.parameters)==null?void 0:le.docs)==null?void 0:de.description}}};var ce,me,ue,pe,fe;w.parameters={...w.parameters,docs:{...(ce=w.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'Secondary Button'
  }
}`,...(ue=(me=w.parameters)==null?void 0:me.docs)==null?void 0:ue.source},description:{story:"Secondary button - use for secondary actions",...(fe=(pe=w.parameters)==null?void 0:pe.docs)==null?void 0:fe.description}}};var ye,ge,ve,he,be;k.parameters={...k.parameters,docs:{...(ye=k.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: 'Success Button'
  }
}`,...(ve=(ge=k.parameters)==null?void 0:ge.docs)==null?void 0:ve.source},description:{story:'Success button - use for positive actions (e.g., "Save", "Confirm")',...(be=(he=k.parameters)==null?void 0:he.docs)==null?void 0:be.description}}};var xe,Ne,je,Be,Se;C.parameters={...C.parameters,docs:{...(xe=C.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    children: 'Danger Button'
  }
}`,...(je=(Ne=C.parameters)==null?void 0:Ne.docs)==null?void 0:je.source},description:{story:'Danger button - use for destructive actions (e.g., "Delete", "Remove")',...(Se=(Be=C.parameters)==null?void 0:Be.docs)==null?void 0:Se.description}}};var we,ke,Ce,Re,De;R.parameters={...R.parameters,docs:{...(we=R.parameters)==null?void 0:we.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    children: 'Warning Button'
  }
}`,...(Ce=(ke=R.parameters)==null?void 0:ke.docs)==null?void 0:Ce.source},description:{story:"Warning button - use for actions that require caution",...(De=(Re=R.parameters)==null?void 0:Re.docs)==null?void 0:De.description}}};var Le,Oe,Ie,ze,Fe;D.parameters={...D.parameters,docs:{...(Le=D.parameters)==null?void 0:Le.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    children: 'Info Button'
  }
}`,...(Ie=(Oe=D.parameters)==null?void 0:Oe.docs)==null?void 0:Ie.source},description:{story:"Info button - use for informational actions",...(Fe=(ze=D.parameters)==null?void 0:ze.docs)==null?void 0:Fe.description}}};var We,$e,Te,Pe,Ae;L.parameters={...L.parameters,docs:{...(We=L.parameters)==null?void 0:We.docs,source:{originalSource:`{
  args: {
    variant: 'light',
    children: 'Light Button'
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...(Te=($e=L.parameters)==null?void 0:$e.docs)==null?void 0:Te.source},description:{story:"Light button - use on dark backgrounds",...(Ae=(Pe=L.parameters)==null?void 0:Pe.docs)==null?void 0:Ae.description}}};var Me,Ee,Ve,He,Ge;O.parameters={...O.parameters,docs:{...(Me=O.parameters)==null?void 0:Me.docs,source:{originalSource:`{
  args: {
    variant: 'dark',
    children: 'Dark Button'
  }
}`,...(Ve=(Ee=O.parameters)==null?void 0:Ee.docs)==null?void 0:Ve.source},description:{story:"Dark button - use on light backgrounds",...(Ge=(He=O.parameters)==null?void 0:He.docs)==null?void 0:Ge.description}}};var qe,Ue,Ze,_e,Je;I.parameters={...I.parameters,docs:{...(qe=I.parameters)==null?void 0:qe.docs,source:{originalSource:`{
  args: {
    variant: 'outline-primary',
    children: 'Outline Primary'
  }
}`,...(Ze=(Ue=I.parameters)==null?void 0:Ue.docs)==null?void 0:Ze.source},description:{story:"Outline buttons - lighter weight variants",...(Je=(_e=I.parameters)==null?void 0:_e.docs)==null?void 0:Je.description}}};var Ke,Qe,Xe;H.parameters={...H.parameters,docs:{...(Ke=H.parameters)==null?void 0:Ke.docs,source:{originalSource:`{
  args: {
    variant: 'outline-secondary',
    children: 'Outline Secondary'
  }
}`,...(Xe=(Qe=H.parameters)==null?void 0:Qe.docs)==null?void 0:Xe.source}}};var Ye,ea,aa;G.parameters={...G.parameters,docs:{...(Ye=G.parameters)==null?void 0:Ye.docs,source:{originalSource:`{
  args: {
    variant: 'outline-success',
    children: 'Outline Success'
  }
}`,...(aa=(ea=G.parameters)==null?void 0:ea.docs)==null?void 0:aa.source}}};var ra,sa,ta;q.parameters={...q.parameters,docs:{...(ra=q.parameters)==null?void 0:ra.docs,source:{originalSource:`{
  args: {
    variant: 'outline-danger',
    children: 'Outline Danger'
  }
}`,...(ta=(sa=q.parameters)==null?void 0:sa.docs)==null?void 0:ta.source}}};var na,ia,oa,la,da;z.parameters={...z.parameters,docs:{...(na=z.parameters)==null?void 0:na.docs,source:{originalSource:`{
  args: {
    variant: 'link',
    children: 'Link Button'
  }
}`,...(oa=(ia=z.parameters)==null?void 0:ia.docs)==null?void 0:oa.source},description:{story:"Link button - styled as a link but behaves as a button",...(da=(la=z.parameters)==null?void 0:la.docs)==null?void 0:da.description}}};var ca,ma,ua,pa,fa;F.parameters={...F.parameters,docs:{...(ca=F.parameters)==null?void 0:ca.docs,source:{originalSource:`{
  args: {
    size: 'sm',
    children: 'Small Button'
  }
}`,...(ua=(ma=F.parameters)==null?void 0:ma.docs)==null?void 0:ua.source},description:{story:"Button sizes",...(fa=(pa=F.parameters)==null?void 0:pa.docs)==null?void 0:fa.description}}};var ya,ga,va;U.parameters={...U.parameters,docs:{...(ya=U.parameters)==null?void 0:ya.docs,source:{originalSource:`{
  args: {
    size: 'md',
    children: 'Medium Button (Default)'
  }
}`,...(va=(ga=U.parameters)==null?void 0:ga.docs)==null?void 0:va.source}}};var ha,ba,xa;Z.parameters={...Z.parameters,docs:{...(ha=Z.parameters)==null?void 0:ha.docs,source:{originalSource:`{
  args: {
    size: 'lg',
    children: 'Large Button'
  }
}`,...(xa=(ba=Z.parameters)==null?void 0:ba.docs)==null?void 0:xa.source}}};var Na,ja,Ba,Sa,wa;W.parameters={...W.parameters,docs:{...(Na=W.parameters)==null?void 0:Na.docs,source:{originalSource:`{
  args: {
    disabled: true,
    children: 'Disabled Button'
    // Won't fire
  }
}`,...(Ba=(ja=W.parameters)==null?void 0:ja.docs)==null?void 0:Ba.source},description:{story:"Disabled state - prevents user interaction",...(wa=(Sa=W.parameters)==null?void 0:Sa.docs)==null?void 0:wa.description}}};var ka,Ca,Ra;_.parameters={..._.parameters,docs:{...(ka=_.parameters)==null?void 0:ka.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled Primary'
  }
}`,...(Ra=(Ca=_.parameters)==null?void 0:Ca.docs)==null?void 0:Ra.source}}};var Da,La,Oa;J.parameters={...J.parameters,docs:{...(Da=J.parameters)==null?void 0:Da.docs,source:{originalSource:`{
  args: {
    variant: 'outline-primary',
    disabled: true,
    children: 'Disabled Outline'
  }
}`,...(Oa=(La=J.parameters)==null?void 0:La.docs)==null?void 0:Oa.source}}};var Ia,za,Fa,Wa,$a;$.parameters={...$.parameters,docs:{...(Ia=$.parameters)==null?void 0:Ia.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    fullWidth: true,
    children: 'Full Width Button'
  },
  parameters: {
    layout: 'padded'
  }
}`,...(Fa=(za=$.parameters)==null?void 0:za.docs)==null?void 0:Fa.source},description:{story:"Full width button",...($a=(Wa=$.parameters)==null?void 0:Wa.docs)==null?void 0:$a.description}}};var Ta,Pa,Aa,Ma,Ea;T.parameters={...T.parameters,docs:{...(Ta=T.parameters)==null?void 0:Ta.docs,source:{originalSource:`{
  args: {
    type: 'submit',
    variant: 'success',
    children: 'Submit Form'
  }
}`,...(Aa=(Pa=T.parameters)==null?void 0:Pa.docs)==null?void 0:Aa.source},description:{story:"Button types for forms",...(Ea=(Ma=T.parameters)==null?void 0:Ma.docs)==null?void 0:Ea.description}}};var Va,Ha,Ga;K.parameters={...K.parameters,docs:{...(Va=K.parameters)==null?void 0:Va.docs,source:{originalSource:`{
  args: {
    type: 'reset',
    variant: 'secondary',
    children: 'Reset Form'
  }
}`,...(Ga=(Ha=K.parameters)==null?void 0:Ha.docs)==null?void 0:Ga.source}}};var qa,Ua,Za,_a,Ja;P.parameters={...P.parameters,docs:{...(qa=P.parameters)==null?void 0:qa.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: <>✓ Save Changes</>
  }
}`,...(Za=(Ua=P.parameters)==null?void 0:Ua.docs)==null?void 0:Za.source},description:{story:"Buttons with icons (example using emoji)",...(Ja=(_a=P.parameters)==null?void 0:_a.docs)==null?void 0:Ja.description}}};var Ka,Qa,Xa;Q.parameters={...Q.parameters,docs:{...(Ka=Q.parameters)==null?void 0:Ka.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: <>Next →</>
  }
}`,...(Xa=(Qa=Q.parameters)==null?void 0:Qa.docs)==null?void 0:Xa.source}}};var Ya,er,ar;X.parameters={...X.parameters,docs:{...(Ya=X.parameters)==null?void 0:Ya.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: '×',
    'aria-label': 'Close'
  }
}`,...(ar=(er=X.parameters)==null?void 0:er.docs)==null?void 0:ar.source}}};var rr,sr,tr,nr,ir;A.parameters={...A.parameters,docs:{...(rr=A.parameters)==null?void 0:rr.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: '×',
    'aria-label': 'Close dialog'
  }
}`,...(tr=(sr=A.parameters)==null?void 0:sr.docs)==null?void 0:tr.source},description:{story:"Accessibility examples",...(ir=(nr=A.parameters)==null?void 0:nr.docs)==null?void 0:ir.description}}};var or,lr,dr;Y.parameters={...Y.parameters,docs:{...(or=Y.parameters)==null?void 0:or.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'Toggle Menu ▼',
    'aria-expanded': false,
    'aria-controls': 'menu'
  }
}`,...(dr=(lr=Y.parameters)==null?void 0:lr.docs)==null?void 0:dr.source}}};var cr,mr,ur;ee.parameters={...ee.parameters,docs:{...(cr=ee.parameters)==null?void 0:cr.docs,source:{originalSource:`{
  args: {
    variant: 'outline-primary',
    children: 'Toggle Option',
    'aria-pressed': false
  }
}`,...(ur=(mr=ee.parameters)==null?void 0:mr.docs)==null?void 0:ur.source}}};var pr,fr,yr,gr,vr;M.parameters={...M.parameters,docs:{...(pr=M.parameters)==null?void 0:pr.docs,source:{originalSource:`{
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
}`,...(yr=(fr=M.parameters)==null?void 0:fr.docs)==null?void 0:yr.source},description:{story:"All variants showcase",...(vr=(gr=M.parameters)==null?void 0:gr.docs)==null?void 0:vr.description}}};var hr,br,xr,Nr,jr;E.parameters={...E.parameters,docs:{...(hr=E.parameters)==null?void 0:hr.docs,source:{originalSource:`{
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
}`,...(xr=(br=E.parameters)==null?void 0:br.docs)==null?void 0:xr.source},description:{story:"All sizes showcase",...(jr=(Nr=E.parameters)==null?void 0:Nr.docs)==null?void 0:jr.description}}};const ys=["Primary","Secondary","Success","Danger","Warning","Info","Light","Dark","OutlinePrimary","OutlineSecondary","OutlineSuccess","OutlineDanger","Link","SmallSize","MediumSize","LargeSize","Disabled","DisabledPrimary","DisabledOutline","FullWidth","SubmitButton","ResetButton","WithIconLeft","WithIconRight","IconOnly","WithAriaLabel","WithAriaExpanded","WithAriaPressed","AllVariants","AllSizes"];export{E as AllSizes,M as AllVariants,C as Danger,O as Dark,W as Disabled,J as DisabledOutline,_ as DisabledPrimary,$ as FullWidth,X as IconOnly,D as Info,Z as LargeSize,L as Light,z as Link,U as MediumSize,q as OutlineDanger,I as OutlinePrimary,H as OutlineSecondary,G as OutlineSuccess,S as Primary,K as ResetButton,w as Secondary,F as SmallSize,T as SubmitButton,k as Success,R as Warning,Y as WithAriaExpanded,A as WithAriaLabel,ee as WithAriaPressed,P as WithIconLeft,Q as WithIconRight,ys as __namedExportsOrder,fs as default};
