import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{B as r,b as P,h as o,c,i as Ka,j as Ua,G as Xa,T as qa,P as _a,k as Ja,l as Qa}from"./Tabs-Fap5R-zB.js";import{r as se}from"./iframe-6amVX2Fk.js";import"./preload-helper-Dp1pzeXC.js";const Ya=()=>e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",loading:!0,children:"Saving"}),e.jsx(r,{variant:"success",loading:!0,children:"Processing"}),e.jsx(r,{variant:"danger",loading:!0,children:"Deleting"}),e.jsx(r,{variant:"warning",loading:!0,children:"Loading"})]}),Za=()=>e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",startIcon:e.jsx(Ua,{}),children:"Previous"}),e.jsx(r,{variant:"primary",endIcon:e.jsx(o,{}),children:"Next"}),e.jsx(r,{variant:"primary",startIcon:e.jsx(P,{}),endIcon:e.jsx(o,{}),children:"Confirm & Continue"}),e.jsx(r,{variant:"outline-secondary","aria-label":"Close dialog",children:e.jsx(c,{})})]}),$a=()=>{const[t,a]=se.useState(!1),s=()=>{a(!0),setTimeout(()=>a(!1),2e3)};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(r,{variant:"primary",loading:t,loadingText:"Saving...",announceText:t?"Saving your changes":"Changes saved successfully",announce:!0,onClick:s,disabled:t,children:t?"Saving...":"Save Changes"}),e.jsx("p",{style:{fontSize:"0.875rem",color:"#666"},children:"Click the button and watch the screen reader announcement region"})]})},en=()=>{const[t,a]=se.useState("idle"),s=async()=>{a("loading"),await new Promise(n=>setTimeout(n,1500)),a("success"),setTimeout(()=>a("idle"),3e3)},i=async()=>{a("loading"),await new Promise(n=>setTimeout(n,1500)),a("error"),setTimeout(()=>a("idle"),3e3)},M={idle:"",loading:"Operation in progress...",success:"Operation completed successfully",error:"Operation failed. Please try again."};return e.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"success",loading:t==="loading",announceText:M[t],announce:!0,onClick:s,disabled:t==="loading",children:t==="loading"?"Saving...":t==="success"?e.jsxs(e.Fragment,{children:[e.jsx(P,{size:14})," Saved"]}):"Save"}),e.jsx(r,{variant:"danger",loading:t==="loading",announceText:M[t],announce:!0,onClick:i,disabled:t==="loading",children:t==="loading"?"Deleting...":t==="error"?e.jsxs(e.Fragment,{children:[e.jsx(c,{size:14})," Failed"]}):"Delete"})]})},sn={title:"Components/Button",component:r,parameters:{layout:"centered",docs:{description:{component:"A versatile button component with multiple variants, sizes, and states. Fully accessible (WCAG 2.2 AA compliant) with keyboard navigation, focus management, and proper color contrast ratios. Uses design tokens for consistent theming. **Test Coverage:** 151 tests across 4 test files ensuring reliability and accessibility."}},backgrounds:{default:"light",values:[{name:"light",value:"#ffffff"},{name:"dark",value:"#1a1a1a"},{name:"gray",value:"#f5f5f5"}]}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","success","danger","warning","info","light","dark","outline-primary","outline-secondary","outline-success","outline-danger","outline-warning","outline-info","outline-light","outline-dark","link"],description:"Button visual style variant",table:{type:{summary:"ButtonVariant"},defaultValue:{summary:"primary"}}},size:{control:"select",options:["sm","md","lg"],description:"Button size",table:{type:{summary:"ButtonSize"},defaultValue:{summary:"md"}}},disabled:{control:"boolean",description:"Disabled state - prevents user interaction",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},fullWidth:{control:"boolean",description:"Makes button 100% width",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},type:{control:"select",options:["button","submit","reset"],description:"Button HTML type attribute",table:{type:{summary:"ButtonType"},defaultValue:{summary:"button"}}},onClick:{action:"clicked",description:"Click event handler",table:{type:{summary:"(event: MouseEvent) => void"}}},children:{control:"text",description:"Button content",table:{type:{summary:"ReactNode"}}},loading:{control:"boolean",description:"Loading state - shows spinner and disables button",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},loadingText:{control:"text",description:"Text to show while loading (replaces children)",table:{type:{summary:"string"}}},startIcon:{control:!1,description:"Icon to display before button text (decorative, aria-hidden)",table:{type:{summary:"ReactNode"}}},endIcon:{control:!1,description:"Icon to display after button text (decorative, aria-hidden)",table:{type:{summary:"ReactNode"}}},announceText:{control:"text",description:'Announcement text for screen readers (aria-live="polite")',table:{type:{summary:"string"}}},announce:{control:"boolean",description:"Enable/disable announcements",table:{type:{summary:"boolean"},defaultValue:{summary:"true (when announceText provided)"}}}}},l={args:{variant:"primary",children:"Primary Button"}},d={args:{variant:"secondary",children:"Secondary Button"}},u={args:{variant:"success",children:"Success Button"}},m={args:{variant:"danger",children:"Danger Button"}},p={args:{variant:"warning",children:"Warning Button"}},g={args:{variant:"info",children:"Info Button"}},h={args:{variant:"light",children:"Light Button"},parameters:{backgrounds:{default:"dark"}}},y={args:{variant:"dark",children:"Dark Button"}},v={args:{variant:"outline-primary",children:"Outline Primary"}},R={args:{variant:"outline-secondary",children:"Outline Secondary"}},N={args:{variant:"outline-success",children:"Outline Success"}},V={args:{variant:"outline-danger",children:"Outline Danger"}},f={args:{variant:"link",children:"Link Button"}},b={args:{size:"sm",children:"Small Button"}},H={args:{size:"md",children:"Medium Button (Default)"}},G={args:{size:"lg",children:"Large Button"}},x={args:{disabled:!0,children:"Disabled Button"}},K={args:{variant:"primary",disabled:!0,children:"Disabled Primary"}},U={args:{variant:"outline-primary",disabled:!0,children:"Disabled Outline"}},S={args:{variant:"primary",fullWidth:!0,children:"Full Width Button"},parameters:{layout:"padded"}},B={args:{type:"submit",variant:"success",children:"Submit Form"}},X={args:{type:"reset",variant:"secondary",children:"Reset Form"}},j={args:{variant:"primary",startIcon:e.jsx(P,{}),children:"Save Changes"}},q={args:{variant:"primary",endIcon:e.jsx(o,{}),children:"Next"}},_={args:{variant:"primary",startIcon:e.jsx(c,{}),children:"","aria-label":"Close"}},I={args:{variant:"primary",startIcon:e.jsx(c,{}),children:"","aria-label":"Close dialog"}},J={args:{variant:"secondary",endIcon:e.jsx(Ka,{}),children:"Toggle Menu","aria-expanded":!1,"aria-controls":"menu"}},Q={args:{variant:"outline-primary",children:"Toggle Option","aria-pressed":!1}},w={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",alignItems:"flex-start"},children:[e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",children:"Primary"}),e.jsx(r,{variant:"secondary",children:"Secondary"}),e.jsx(r,{variant:"success",children:"Success"}),e.jsx(r,{variant:"danger",children:"Danger"}),e.jsx(r,{variant:"warning",children:"Warning"}),e.jsx(r,{variant:"info",children:"Info"}),e.jsx(r,{variant:"light",children:"Light"}),e.jsx(r,{variant:"dark",children:"Dark"})]}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"outline-primary",children:"Outline Primary"}),e.jsx(r,{variant:"outline-secondary",children:"Outline Secondary"}),e.jsx(r,{variant:"outline-success",children:"Outline Success"}),e.jsx(r,{variant:"outline-danger",children:"Outline Danger"})]}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"link",children:"Link"}),e.jsx(r,{variant:"primary",disabled:!0,children:"Disabled"})]})]}),parameters:{layout:"padded"}},k={args:{variant:"primary",children:"Saving...",loading:!0}},Y={args:{variant:"primary",children:"Save Changes",loading:!0,loadingText:"Saving your changes..."}},Z={render:()=>e.jsx(Ya,{})},D={args:{variant:"primary",startIcon:e.jsx(Ua,{}),children:"Previous"}},$={args:{variant:"primary",endIcon:e.jsx(o,{}),children:"Next"}},ee={args:{variant:"primary",startIcon:e.jsx(P,{}),endIcon:e.jsx(o,{}),children:"Confirm & Continue"}},re={args:{variant:"outline-secondary",startIcon:e.jsx(c,{}),children:"","aria-label":"Close dialog"}},te={render:()=>e.jsx(Za,{})},z={render:()=>e.jsx($a,{})},ae={render:()=>e.jsx(en,{})},T={render:()=>e.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[e.jsx(r,{variant:"primary",size:"sm",children:"Small"}),e.jsx(r,{variant:"primary",size:"md",children:"Medium"}),e.jsx(r,{variant:"primary",size:"lg",children:"Large"})]})},A={args:{variant:"danger",children:"Error State",error:!0}},ne={render:()=>{const[t,a]=se.useState(!1),s=async()=>{a(!0),await new Promise(i=>setTimeout(i,2e3)),a(!1)};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(r,{variant:"primary",error:t,onClick:s,disabled:t,children:t?"Error - Retry":"Click Me"}),e.jsx("p",{style:{fontSize:"0.875rem",color:"#666"},children:"Click the button to trigger error state. After 2 seconds, error clears automatically."})]})}},L={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{fontSize:"0.875rem",fontWeight:"bold",marginBottom:"0.5rem"},children:"Idle State (default)"}),e.jsx(r,{variant:"primary",children:"Idle State"})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{fontSize:"0.875rem",fontWeight:"bold",marginBottom:"0.5rem"},children:"Loading State (prop-driven)"}),e.jsx(r,{variant:"primary",loading:!0,children:"Loading..."}),e.jsx("p",{style:{fontSize:"0.75rem",color:"#666",marginTop:"0.5rem"},children:"Loading overrides interactive states. FSM ignores hover/press/focus events."})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{fontSize:"0.875rem",fontWeight:"bold",marginBottom:"0.5rem"},children:"Error State (prop-driven)"}),e.jsx(r,{variant:"danger",error:!0,children:"Error Occurred"}),e.jsx("p",{style:{fontSize:"0.75rem",color:"#666",marginTop:"0.5rem"},children:"Error state visually indicates a problem. FSM prevents interaction."})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{fontSize:"0.875rem",fontWeight:"bold",marginBottom:"0.5rem"},children:"Disabled State (highest priority)"}),e.jsx(r,{variant:"primary",disabled:!0,children:"Disabled State"}),e.jsx("p",{style:{fontSize:"0.75rem",color:"#666",marginTop:"0.5rem"},children:"Disabled takes precedence over all other states. No interaction possible."})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{fontSize:"0.875rem",fontWeight:"bold",marginBottom:"0.5rem"},children:"Disabled Loading (disabled wins)"}),e.jsx(r,{variant:"primary",disabled:!0,loading:!0,children:"Disabled & Loading"}),e.jsx("p",{style:{fontSize:"0.75rem",color:"#666",marginTop:"0.5rem"},children:"When both disabled and loading, disabled takes precedence (FSM priority rule)."})]})]})},W={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{fontSize:"0.875rem",fontWeight:"bold",marginBottom:"0.5rem"},children:"Interactive States Demo"}),e.jsx("p",{style:{fontSize:"0.75rem",color:"#666",marginBottom:"1rem"},children:"Try these interactions and observe the button behavior:"}),e.jsxs("ul",{style:{fontSize:"0.75rem",color:"#666",marginBottom:"1rem",paddingLeft:"1.5rem"},children:[e.jsx("li",{children:"Hover over the button → hovered state"}),e.jsx("li",{children:"Focus with keyboard (Tab) → focused state"}),e.jsx("li",{children:"Press mouse down → pressed state"}),e.jsx("li",{children:"Release → returns to previous state (idle, hovered, or focused)"}),e.jsx("li",{children:"Blur (click away) → idle state"})]})]}),e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:"1rem"},children:[e.jsx(r,{variant:"primary",children:"Primary Button"}),e.jsx(r,{variant:"success",children:"Success Button"}),e.jsx(r,{variant:"outline-secondary",children:"Outline Button"})]}),e.jsx("div",{children:e.jsxs("p",{style:{fontSize:"0.75rem",color:"#666",marginTop:"1rem"},children:[e.jsx("strong",{children:"FSM State Tracking:"})," The button element includes a"," ",e.jsx("code",{children:"data-visual-state"})," attribute that changes as you interact with it. Open browser DevTools Inspector to see the attribute updates in real-time."]})})]})},C={render:()=>{const[t,a]=se.useState({success:{isLoading:!1,isError:!1},failure:{isLoading:!1,isError:!1},mixed:{isLoading:!1,isError:!1}}),s=async(i,M)=>{a(n=>({...n,[i]:{isLoading:!0,isError:!1}})),await new Promise(n=>setTimeout(n,2e3)),a(n=>({...n,[i]:{isLoading:!1,isError:M}})),setTimeout(()=>{a(n=>({...n,[i]:{isLoading:!1,isError:!1}}))},2e3)};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{fontSize:"0.875rem",fontWeight:"bold",marginBottom:"1rem"},children:"Successful Operation"}),e.jsx(r,{variant:"success",loading:t.success.isLoading,onClick:()=>s("success",!1),children:t.success.isLoading?"Processing...":"Save Successfully"})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{fontSize:"0.875rem",fontWeight:"bold",marginBottom:"1rem"},children:"Failed Operation"}),e.jsx(r,{variant:"danger",error:t.failure.isError,loading:t.failure.isLoading,onClick:()=>s("failure",!0),children:t.failure.isLoading?"Processing...":t.failure.isError?"Failed - Retry":"Delete Item"})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{fontSize:"0.875rem",fontWeight:"bold",marginBottom:"1rem"},children:"Confirm Action Flow"}),e.jsx(r,{variant:"warning",loading:t.mixed.isLoading,error:t.mixed.isError,onClick:()=>s("mixed",!1),children:t.mixed.isLoading?"Processing...":"Confirm Action"})]}),e.jsxs("div",{style:{backgroundColor:"#f5f5f5",padding:"1rem",borderRadius:"4px"},children:[e.jsx("p",{style:{fontSize:"0.75rem",color:"#666",margin:0},children:e.jsx("strong",{children:"FSM Transition Flow:"})}),e.jsx("p",{style:{fontSize:"0.75rem",color:"#666",margin:"0.5rem 0 0 0"},children:"idle → loading → (success: idle) or (error: error state)"}),e.jsx("p",{style:{fontSize:"0.75rem",color:"#666",margin:"0.5rem 0 0 0"},children:"Each button manages its own FSM state independently."})]})]})}},E={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{fontSize:"0.875rem",fontWeight:"bold",marginBottom:"0.5rem"},children:"✅ Accessible Icon-only Buttons"}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem"},children:[e.jsx(r,{variant:"outline-secondary","aria-label":"Close dialog",startIcon:e.jsx(c,{}),children:""}),e.jsx(r,{variant:"outline-primary","aria-label":"Settings",startIcon:e.jsx(Xa,{}),children:""}),e.jsx(r,{variant:"outline-danger","aria-label":"Delete item",startIcon:e.jsx(qa,{}),children:""}),e.jsx(r,{variant:"outline-success","aria-label":"Add item",startIcon:e.jsx(_a,{}),children:""})]}),e.jsxs("p",{style:{fontSize:"0.75rem",color:"#666",marginTop:"0.5rem"},children:["Each icon-only button has an ",e.jsx("code",{children:"aria-label"})," for screen readers."]})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{fontSize:"0.875rem",fontWeight:"bold",marginBottom:"0.5rem"},children:"✅ Icon + Text (no aria-label needed)"}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem"},children:[e.jsx(r,{variant:"primary",startIcon:e.jsx(Ja,{}),children:"Save"}),e.jsx(r,{variant:"success",startIcon:e.jsx(P,{}),children:"Confirm"}),e.jsx(r,{variant:"secondary",endIcon:e.jsx(o,{}),children:"Next"})]}),e.jsx("p",{style:{fontSize:"0.75rem",color:"#666",marginTop:"0.5rem"},children:"Buttons with visible text content automatically have accessible names."})]}),e.jsx("div",{style:{backgroundColor:"#fff3cd",padding:"1rem",borderRadius:"4px",border:"1px solid #ffc107"},children:e.jsxs("p",{style:{fontSize:"0.75rem",color:"#856404",margin:0},children:[e.jsxs("strong",{children:[e.jsx(Qa,{size:14,style:{marginRight:"4px"}}),"Accessibility Note:"]})," ","Icon-only buttons without ",e.jsx("code",{children:"aria-label"})," will fail WCAG 2.2 AA compliance. Our test suite includes guards that verify this requirement."]})})]})},O={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{fontSize:"0.875rem",fontWeight:"bold",marginBottom:"1rem"},children:"Keyboard Navigation Test"}),e.jsx("p",{style:{fontSize:"0.75rem",color:"#666",marginBottom:"1rem"},children:"Use Tab to navigate between buttons. Press Enter or Space to activate."}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",children:"First Button"}),e.jsx(r,{variant:"secondary",children:"Second Button"}),e.jsx(r,{variant:"success",disabled:!0,children:"Disabled (Skip)"}),e.jsx(r,{variant:"info",children:"Third Button"})]})]}),e.jsxs("div",{style:{backgroundColor:"#d1ecf1",padding:"1rem",borderRadius:"4px",border:"1px solid #bee5eb"},children:[e.jsxs("p",{style:{fontSize:"0.75rem",color:"#0c5460",margin:0},children:[e.jsx("strong",{children:"Test Coverage:"})," The Button.a11y.test.tsx file includes 6 keyboard interaction tests verifying:"]}),e.jsxs("ul",{style:{fontSize:"0.75rem",color:"#0c5460",marginTop:"0.5rem",paddingLeft:"1rem"},children:[e.jsx("li",{children:"Enter key triggers onClick"}),e.jsx("li",{children:"Space key triggers onClick"}),e.jsx("li",{children:"Disabled buttons block keyboard interaction"}),e.jsx("li",{children:"Loading buttons block keyboard interaction"}),e.jsx("li",{children:"Tab navigation works between buttons"}),e.jsx("li",{children:"Disabled buttons are not focusable via Tab"})]})]})]})},F={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{fontSize:"0.875rem",fontWeight:"bold",marginBottom:"0.5rem"},children:"aria-expanded (Expandable)"}),e.jsx(r,{variant:"outline-secondary","aria-expanded":!1,"aria-controls":"dropdown-menu",endIcon:e.jsx(Ka,{}),children:"Dropdown Menu"})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{fontSize:"0.875rem",fontWeight:"bold",marginBottom:"0.5rem"},children:"aria-pressed (Toggle)"}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem"},children:[e.jsx(r,{variant:"outline-primary","aria-pressed":!1,children:"Off"}),e.jsx(r,{variant:"primary","aria-pressed":!0,children:"On"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{fontSize:"0.875rem",fontWeight:"bold",marginBottom:"0.5rem"},children:"aria-describedby (Additional description)"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"1rem"},children:[e.jsx(r,{variant:"danger","aria-label":"Delete Account - This action cannot be undone",children:"Delete Account"}),e.jsx("span",{style:{fontSize:"0.75rem",color:"#dc3545"},children:"This action cannot be undone."})]})]}),e.jsx("div",{style:{backgroundColor:"#e7f3e7",padding:"1rem",borderRadius:"4px",border:"1px solid #28a745"},children:e.jsxs("p",{style:{fontSize:"0.75rem",color:"#155724",margin:0},children:[e.jsx("strong",{children:"✅ All ARIA attributes tested:"})," aria-label, aria-describedby, aria-controls, aria-expanded, aria-pressed, aria-busy"]})})]})};var ie,oe,ce,le,de;l.parameters={...l.parameters,docs:{...(ie=l.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Primary Button'
  }
}`,...(ce=(oe=l.parameters)==null?void 0:oe.docs)==null?void 0:ce.source},description:{story:"Primary button - use for main actions and call-to-action buttons",...(de=(le=l.parameters)==null?void 0:le.docs)==null?void 0:de.description}}};var ue,me,pe,ge,he;d.parameters={...d.parameters,docs:{...(ue=d.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'Secondary Button'
  }
}`,...(pe=(me=d.parameters)==null?void 0:me.docs)==null?void 0:pe.source},description:{story:"Secondary button - use for secondary actions",...(he=(ge=d.parameters)==null?void 0:ge.docs)==null?void 0:he.description}}};var ye,ve,fe,be,xe;u.parameters={...u.parameters,docs:{...(ye=u.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: 'Success Button'
  }
}`,...(fe=(ve=u.parameters)==null?void 0:ve.docs)==null?void 0:fe.source},description:{story:'Success button - use for positive actions (e.g., "Save", "Confirm")',...(xe=(be=u.parameters)==null?void 0:be.docs)==null?void 0:xe.description}}};var Se,Be,je,Ie,we;m.parameters={...m.parameters,docs:{...(Se=m.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    children: 'Danger Button'
  }
}`,...(je=(Be=m.parameters)==null?void 0:Be.docs)==null?void 0:je.source},description:{story:'Danger button - use for destructive actions (e.g., "Delete", "Remove")',...(we=(Ie=m.parameters)==null?void 0:Ie.docs)==null?void 0:we.description}}};var ke,De,ze,Te,Ae;p.parameters={...p.parameters,docs:{...(ke=p.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    children: 'Warning Button'
  }
}`,...(ze=(De=p.parameters)==null?void 0:De.docs)==null?void 0:ze.source},description:{story:"Warning button - use for actions that require caution",...(Ae=(Te=p.parameters)==null?void 0:Te.docs)==null?void 0:Ae.description}}};var Le,We,Ce,Ee,Oe;g.parameters={...g.parameters,docs:{...(Le=g.parameters)==null?void 0:Le.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    children: 'Info Button'
  }
}`,...(Ce=(We=g.parameters)==null?void 0:We.docs)==null?void 0:Ce.source},description:{story:"Info button - use for informational actions",...(Oe=(Ee=g.parameters)==null?void 0:Ee.docs)==null?void 0:Oe.description}}};var Fe,Pe,Me,Re,Ne;h.parameters={...h.parameters,docs:{...(Fe=h.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
  args: {
    variant: 'light',
    children: 'Light Button'
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...(Me=(Pe=h.parameters)==null?void 0:Pe.docs)==null?void 0:Me.source},description:{story:"Light button - use on dark backgrounds",...(Ne=(Re=h.parameters)==null?void 0:Re.docs)==null?void 0:Ne.description}}};var Ve,He,Ge,Ke,Ue;y.parameters={...y.parameters,docs:{...(Ve=y.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  args: {
    variant: 'dark',
    children: 'Dark Button'
  }
}`,...(Ge=(He=y.parameters)==null?void 0:He.docs)==null?void 0:Ge.source},description:{story:"Dark button - use on light backgrounds",...(Ue=(Ke=y.parameters)==null?void 0:Ke.docs)==null?void 0:Ue.description}}};var Xe,qe,_e,Je,Qe;v.parameters={...v.parameters,docs:{...(Xe=v.parameters)==null?void 0:Xe.docs,source:{originalSource:`{
  args: {
    variant: 'outline-primary',
    children: 'Outline Primary'
  }
}`,...(_e=(qe=v.parameters)==null?void 0:qe.docs)==null?void 0:_e.source},description:{story:"Outline buttons - lighter weight variants",...(Qe=(Je=v.parameters)==null?void 0:Je.docs)==null?void 0:Qe.description}}};var Ye,Ze,$e;R.parameters={...R.parameters,docs:{...(Ye=R.parameters)==null?void 0:Ye.docs,source:{originalSource:`{
  args: {
    variant: 'outline-secondary',
    children: 'Outline Secondary'
  }
}`,...($e=(Ze=R.parameters)==null?void 0:Ze.docs)==null?void 0:$e.source}}};var er,rr,tr;N.parameters={...N.parameters,docs:{...(er=N.parameters)==null?void 0:er.docs,source:{originalSource:`{
  args: {
    variant: 'outline-success',
    children: 'Outline Success'
  }
}`,...(tr=(rr=N.parameters)==null?void 0:rr.docs)==null?void 0:tr.source}}};var ar,nr,sr;V.parameters={...V.parameters,docs:{...(ar=V.parameters)==null?void 0:ar.docs,source:{originalSource:`{
  args: {
    variant: 'outline-danger',
    children: 'Outline Danger'
  }
}`,...(sr=(nr=V.parameters)==null?void 0:nr.docs)==null?void 0:sr.source}}};var ir,or,cr,lr,dr;f.parameters={...f.parameters,docs:{...(ir=f.parameters)==null?void 0:ir.docs,source:{originalSource:`{
  args: {
    variant: 'link',
    children: 'Link Button'
  }
}`,...(cr=(or=f.parameters)==null?void 0:or.docs)==null?void 0:cr.source},description:{story:"Link button - styled as a link but behaves as a button",...(dr=(lr=f.parameters)==null?void 0:lr.docs)==null?void 0:dr.description}}};var ur,mr,pr,gr,hr;b.parameters={...b.parameters,docs:{...(ur=b.parameters)==null?void 0:ur.docs,source:{originalSource:`{
  args: {
    size: 'sm',
    children: 'Small Button'
  }
}`,...(pr=(mr=b.parameters)==null?void 0:mr.docs)==null?void 0:pr.source},description:{story:"Button sizes",...(hr=(gr=b.parameters)==null?void 0:gr.docs)==null?void 0:hr.description}}};var yr,vr,fr;H.parameters={...H.parameters,docs:{...(yr=H.parameters)==null?void 0:yr.docs,source:{originalSource:`{
  args: {
    size: 'md',
    children: 'Medium Button (Default)'
  }
}`,...(fr=(vr=H.parameters)==null?void 0:vr.docs)==null?void 0:fr.source}}};var br,xr,Sr;G.parameters={...G.parameters,docs:{...(br=G.parameters)==null?void 0:br.docs,source:{originalSource:`{
  args: {
    size: 'lg',
    children: 'Large Button'
  }
}`,...(Sr=(xr=G.parameters)==null?void 0:xr.docs)==null?void 0:Sr.source}}};var Br,jr,Ir,wr,kr;x.parameters={...x.parameters,docs:{...(Br=x.parameters)==null?void 0:Br.docs,source:{originalSource:`{
  args: {
    disabled: true,
    children: 'Disabled Button'
    // Won't fire
  }
}`,...(Ir=(jr=x.parameters)==null?void 0:jr.docs)==null?void 0:Ir.source},description:{story:"Disabled state - prevents user interaction",...(kr=(wr=x.parameters)==null?void 0:wr.docs)==null?void 0:kr.description}}};var Dr,zr,Tr;K.parameters={...K.parameters,docs:{...(Dr=K.parameters)==null?void 0:Dr.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled Primary'
  }
}`,...(Tr=(zr=K.parameters)==null?void 0:zr.docs)==null?void 0:Tr.source}}};var Ar,Lr,Wr;U.parameters={...U.parameters,docs:{...(Ar=U.parameters)==null?void 0:Ar.docs,source:{originalSource:`{
  args: {
    variant: 'outline-primary',
    disabled: true,
    children: 'Disabled Outline'
  }
}`,...(Wr=(Lr=U.parameters)==null?void 0:Lr.docs)==null?void 0:Wr.source}}};var Cr,Er,Or,Fr,Pr;S.parameters={...S.parameters,docs:{...(Cr=S.parameters)==null?void 0:Cr.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    fullWidth: true,
    children: 'Full Width Button'
  },
  parameters: {
    layout: 'padded'
  }
}`,...(Or=(Er=S.parameters)==null?void 0:Er.docs)==null?void 0:Or.source},description:{story:"Full width button",...(Pr=(Fr=S.parameters)==null?void 0:Fr.docs)==null?void 0:Pr.description}}};var Mr,Rr,Nr,Vr,Hr;B.parameters={...B.parameters,docs:{...(Mr=B.parameters)==null?void 0:Mr.docs,source:{originalSource:`{
  args: {
    type: 'submit',
    variant: 'success',
    children: 'Submit Form'
  }
}`,...(Nr=(Rr=B.parameters)==null?void 0:Rr.docs)==null?void 0:Nr.source},description:{story:"Button types for forms",...(Hr=(Vr=B.parameters)==null?void 0:Vr.docs)==null?void 0:Hr.description}}};var Gr,Kr,Ur;X.parameters={...X.parameters,docs:{...(Gr=X.parameters)==null?void 0:Gr.docs,source:{originalSource:`{
  args: {
    type: 'reset',
    variant: 'secondary',
    children: 'Reset Form'
  }
}`,...(Ur=(Kr=X.parameters)==null?void 0:Kr.docs)==null?void 0:Ur.source}}};var Xr,qr,_r,Jr,Qr;j.parameters={...j.parameters,docs:{...(Xr=j.parameters)==null?void 0:Xr.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    startIcon: <CheckIcon />,
    children: 'Save Changes'
  }
}`,...(_r=(qr=j.parameters)==null?void 0:qr.docs)==null?void 0:_r.source},description:{story:"Buttons with icons",...(Qr=(Jr=j.parameters)==null?void 0:Jr.docs)==null?void 0:Qr.description}}};var Yr,Zr,$r;q.parameters={...q.parameters,docs:{...(Yr=q.parameters)==null?void 0:Yr.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    endIcon: <ArrowRightIcon />,
    children: 'Next'
  }
}`,...($r=(Zr=q.parameters)==null?void 0:Zr.docs)==null?void 0:$r.source}}};var et,rt,tt;_.parameters={..._.parameters,docs:{...(et=_.parameters)==null?void 0:et.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    startIcon: <XLgIcon />,
    children: '',
    'aria-label': 'Close'
  }
}`,...(tt=(rt=_.parameters)==null?void 0:rt.docs)==null?void 0:tt.source}}};var at,nt,st,it,ot;I.parameters={...I.parameters,docs:{...(at=I.parameters)==null?void 0:at.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    startIcon: <XLgIcon />,
    children: '',
    'aria-label': 'Close dialog'
  }
}`,...(st=(nt=I.parameters)==null?void 0:nt.docs)==null?void 0:st.source},description:{story:"Accessibility examples",...(ot=(it=I.parameters)==null?void 0:it.docs)==null?void 0:ot.description}}};var ct,lt,dt;J.parameters={...J.parameters,docs:{...(ct=J.parameters)==null?void 0:ct.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    endIcon: <ChevronDownIcon />,
    children: 'Toggle Menu',
    'aria-expanded': false,
    'aria-controls': 'menu'
  }
}`,...(dt=(lt=J.parameters)==null?void 0:lt.docs)==null?void 0:dt.source}}};var ut,mt,pt;Q.parameters={...Q.parameters,docs:{...(ut=Q.parameters)==null?void 0:ut.docs,source:{originalSource:`{
  args: {
    variant: 'outline-primary',
    children: 'Toggle Option',
    'aria-pressed': false
  }
}`,...(pt=(mt=Q.parameters)==null?void 0:mt.docs)==null?void 0:pt.source}}};var gt,ht,yt,vt,ft;w.parameters={...w.parameters,docs:{...(gt=w.parameters)==null?void 0:gt.docs,source:{originalSource:`{
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
}`,...(yt=(ht=w.parameters)==null?void 0:ht.docs)==null?void 0:yt.source},description:{story:"All variants showcase",...(ft=(vt=w.parameters)==null?void 0:vt.docs)==null?void 0:ft.description}}};var bt,xt,St,Bt,jt;k.parameters={...k.parameters,docs:{...(bt=k.parameters)==null?void 0:bt.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Saving...',
    loading: true
  }
}`,...(St=(xt=k.parameters)==null?void 0:xt.docs)==null?void 0:St.source},description:{story:"Loading states showcase",...(jt=(Bt=k.parameters)==null?void 0:Bt.docs)==null?void 0:jt.description}}};var It,wt,kt;Y.parameters={...Y.parameters,docs:{...(It=Y.parameters)==null?void 0:It.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Save Changes',
    loading: true,
    loadingText: 'Saving your changes...'
  }
}`,...(kt=(wt=Y.parameters)==null?void 0:wt.docs)==null?void 0:kt.source}}};var Dt,zt,Tt;Z.parameters={...Z.parameters,docs:{...(Dt=Z.parameters)==null?void 0:Dt.docs,source:{originalSource:`{
  render: () => <LoadingVariantsShowcase />
}`,...(Tt=(zt=Z.parameters)==null?void 0:zt.docs)==null?void 0:Tt.source}}};var At,Lt,Wt,Ct,Et;D.parameters={...D.parameters,docs:{...(At=D.parameters)==null?void 0:At.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    startIcon: <ArrowLeftIcon />,
    children: 'Previous'
  }
}`,...(Wt=(Lt=D.parameters)==null?void 0:Lt.docs)==null?void 0:Wt.source},description:{story:"Icon support with new props",...(Et=(Ct=D.parameters)==null?void 0:Ct.docs)==null?void 0:Et.description}}};var Ot,Ft,Pt;$.parameters={...$.parameters,docs:{...(Ot=$.parameters)==null?void 0:Ot.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    endIcon: <ArrowRightIcon />,
    children: 'Next'
  }
}`,...(Pt=(Ft=$.parameters)==null?void 0:Ft.docs)==null?void 0:Pt.source}}};var Mt,Rt,Nt;ee.parameters={...ee.parameters,docs:{...(Mt=ee.parameters)==null?void 0:Mt.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    startIcon: <CheckIcon />,
    endIcon: <ArrowRightIcon />,
    children: 'Confirm & Continue'
  }
}`,...(Nt=(Rt=ee.parameters)==null?void 0:Rt.docs)==null?void 0:Nt.source}}};var Vt,Ht,Gt;re.parameters={...re.parameters,docs:{...(Vt=re.parameters)==null?void 0:Vt.docs,source:{originalSource:`{
  args: {
    variant: 'outline-secondary',
    startIcon: <XLgIcon />,
    children: '',
    'aria-label': 'Close dialog'
  }
}`,...(Gt=(Ht=re.parameters)==null?void 0:Ht.docs)==null?void 0:Gt.source}}};var Kt,Ut,Xt;te.parameters={...te.parameters,docs:{...(Kt=te.parameters)==null?void 0:Kt.docs,source:{originalSource:`{
  render: () => <IconsShowcase />
}`,...(Xt=(Ut=te.parameters)==null?void 0:Ut.docs)==null?void 0:Xt.source}}};var qt,_t,Jt,Qt,Yt;z.parameters={...z.parameters,docs:{...(qt=z.parameters)==null?void 0:qt.docs,source:{originalSource:`{
  render: () => <AnnouncementDemo />
}`,...(Jt=(_t=z.parameters)==null?void 0:_t.docs)==null?void 0:Jt.source},description:{story:"Aria-live announcements for dynamic state changes",...(Yt=(Qt=z.parameters)==null?void 0:Qt.docs)==null?void 0:Yt.description}}};var Zt,$t,ea;ae.parameters={...ae.parameters,docs:{...(Zt=ae.parameters)==null?void 0:Zt.docs,source:{originalSource:`{
  render: () => <MultiStateAnnouncementDemo />
}`,...(ea=($t=ae.parameters)==null?void 0:$t.docs)==null?void 0:ea.source}}};var ra,ta,aa,na,sa;T.parameters={...T.parameters,docs:{...(ra=T.parameters)==null?void 0:ra.docs,source:{originalSource:`{
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
}`,...(aa=(ta=T.parameters)==null?void 0:ta.docs)==null?void 0:aa.source},description:{story:"All sizes showcase",...(sa=(na=T.parameters)==null?void 0:na.docs)==null?void 0:sa.description}}};var ia,oa,ca,la,da;A.parameters={...A.parameters,docs:{...(ia=A.parameters)==null?void 0:ia.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    children: 'Error State',
    error: true
  }
}`,...(ca=(oa=A.parameters)==null?void 0:oa.docs)==null?void 0:ca.source},description:{story:`FSM Visual States Showcase

The Button component uses a Finite State Machine (FSM) to manage visual states.
These stories demonstrate the FSM behavior and state transitions.

FSM States:
- idle: default state, no interaction
- hovered: mouse over the button (auto via CSS :hover)
- focused: keyboard focus (auto via CSS :focus-visible)
- pressed: mouse down state
- disabled: disabled prop = true (prop-driven)
- loading: loading prop = true (prop-driven)
- error: error prop = true (prop-driven)
Error State - New FSM capability
Demonstrates the error visual state (red tint, alert styling)`,...(da=(la=A.parameters)==null?void 0:la.docs)==null?void 0:da.description}}};var ua,ma,pa;ne.parameters={...ne.parameters,docs:{...(ua=ne.parameters)==null?void 0:ua.docs,source:{originalSource:`{
  render: () => {
    const [hasError, setHasError] = useState(false);
    const handleClick = async () => {
      setHasError(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setHasError(false);
    };
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
        <Button variant="primary" error={hasError} onClick={handleClick} disabled={hasError}>
          {hasError ? 'Error - Retry' : 'Click Me'}
        </Button>
        <p style={{
        fontSize: '0.875rem',
        color: '#666'
      }}>
          Click the button to trigger error state. After 2 seconds, error clears automatically.
        </p>
      </div>;
  }
}`,...(pa=(ma=ne.parameters)==null?void 0:ma.docs)==null?void 0:pa.source}}};var ga,ha,ya,va,fa;L.parameters={...L.parameters,docs:{...(ga=L.parameters)==null?void 0:ga.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }}>
      <div>
        <h3 style={{
        fontSize: '0.875rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem'
      }}>
          Idle State (default)
        </h3>
        <Button variant="primary">Idle State</Button>
      </div>

      <div>
        <h3 style={{
        fontSize: '0.875rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem'
      }}>
          Loading State (prop-driven)
        </h3>
        <Button variant="primary" loading>
          Loading...
        </Button>
        <p style={{
        fontSize: '0.75rem',
        color: '#666',
        marginTop: '0.5rem'
      }}>
          Loading overrides interactive states. FSM ignores hover/press/focus events.
        </p>
      </div>

      <div>
        <h3 style={{
        fontSize: '0.875rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem'
      }}>
          Error State (prop-driven)
        </h3>
        <Button variant="danger" error>
          Error Occurred
        </Button>
        <p style={{
        fontSize: '0.75rem',
        color: '#666',
        marginTop: '0.5rem'
      }}>
          Error state visually indicates a problem. FSM prevents interaction.
        </p>
      </div>

      <div>
        <h3 style={{
        fontSize: '0.875rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem'
      }}>
          Disabled State (highest priority)
        </h3>
        <Button variant="primary" disabled>
          Disabled State
        </Button>
        <p style={{
        fontSize: '0.75rem',
        color: '#666',
        marginTop: '0.5rem'
      }}>
          Disabled takes precedence over all other states. No interaction possible.
        </p>
      </div>

      <div>
        <h3 style={{
        fontSize: '0.875rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem'
      }}>
          Disabled Loading (disabled wins)
        </h3>
        <Button variant="primary" disabled loading>
          Disabled & Loading
        </Button>
        <p style={{
        fontSize: '0.75rem',
        color: '#666',
        marginTop: '0.5rem'
      }}>
          When both disabled and loading, disabled takes precedence (FSM priority rule).
        </p>
      </div>
    </div>
}`,...(ya=(ha=L.parameters)==null?void 0:ha.docs)==null?void 0:ya.source},description:{story:`FSM State Priority Demonstration

Shows how FSM handles state precedence:
disabled > loading > error > interactive states`,...(fa=(va=L.parameters)==null?void 0:va.docs)==null?void 0:fa.description}}};var ba,xa,Sa,Ba,ja;W.parameters={...W.parameters,docs:{...(ba=W.parameters)==null?void 0:ba.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }}>
      <div>
        <h3 style={{
        fontSize: '0.875rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem'
      }}>
          Interactive States Demo
        </h3>
        <p style={{
        fontSize: '0.75rem',
        color: '#666',
        marginBottom: '1rem'
      }}>
          Try these interactions and observe the button behavior:
        </p>
        <ul style={{
        fontSize: '0.75rem',
        color: '#666',
        marginBottom: '1rem',
        paddingLeft: '1.5rem'
      }}>
          <li>Hover over the button → hovered state</li>
          <li>Focus with keyboard (Tab) → focused state</li>
          <li>Press mouse down → pressed state</li>
          <li>Release → returns to previous state (idle, hovered, or focused)</li>
          <li>Blur (click away) → idle state</li>
        </ul>
      </div>

      <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
        <Button variant="primary">Primary Button</Button>
        <Button variant="success">Success Button</Button>
        <Button variant="outline-secondary">Outline Button</Button>
      </div>

      <div>
        <p style={{
        fontSize: '0.75rem',
        color: '#666',
        marginTop: '1rem'
      }}>
          <strong>FSM State Tracking:</strong> The button element includes a{' '}
          <code>data-visual-state</code> attribute that changes as you interact with it. Open
          browser DevTools Inspector to see the attribute updates in real-time.
        </p>
      </div>
    </div>
}`,...(Sa=(xa=W.parameters)==null?void 0:xa.docs)==null?void 0:Sa.source},description:{story:`FSM Interactive States with Focus/Hover

Demonstrates FSM state transitions during user interaction.
Try hovering, focusing, or pressing the button to see state changes
reflected in the data-visual-state attribute.`,...(ja=(Ba=W.parameters)==null?void 0:Ba.docs)==null?void 0:ja.description}}};var Ia,wa,ka,Da,za;C.parameters={...C.parameters,docs:{...(Ia=C.parameters)==null?void 0:Ia.docs,source:{originalSource:`{
  render: () => {
    const [states, setStates] = useState<Record<string, {
      isLoading: boolean;
      isError: boolean;
    }>>({
      success: {
        isLoading: false,
        isError: false
      },
      failure: {
        isLoading: false,
        isError: false
      },
      mixed: {
        isLoading: false,
        isError: false
      }
    });
    const handleAsyncOperation = async (key: string, shouldFail: boolean) => {
      setStates(prev => ({
        ...prev,
        [key]: {
          isLoading: true,
          isError: false
        }
      }));
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStates(prev => ({
        ...prev,
        [key]: {
          isLoading: false,
          isError: shouldFail
        }
      }));
      setTimeout(() => {
        setStates(prev => ({
          ...prev,
          [key]: {
            isLoading: false,
            isError: false
          }
        }));
      }, 2000);
    };
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
        <div>
          <h3 style={{
          fontSize: '0.875rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>
            Successful Operation
          </h3>
          <Button variant="success" loading={states.success.isLoading} onClick={() => handleAsyncOperation('success', false)}>
            {states.success.isLoading ? 'Processing...' : 'Save Successfully'}
          </Button>
        </div>

        <div>
          <h3 style={{
          fontSize: '0.875rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>
            Failed Operation
          </h3>
          <Button variant="danger" error={states.failure.isError} loading={states.failure.isLoading} onClick={() => handleAsyncOperation('failure', true)}>
            {states.failure.isLoading ? 'Processing...' : states.failure.isError ? 'Failed - Retry' : 'Delete Item'}
          </Button>
        </div>

        <div>
          <h3 style={{
          fontSize: '0.875rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>
            Confirm Action Flow
          </h3>
          <Button variant="warning" loading={states.mixed.isLoading} error={states.mixed.isError} onClick={() => handleAsyncOperation('mixed', false)}>
            {states.mixed.isLoading ? 'Processing...' : 'Confirm Action'}
          </Button>
        </div>

        <div style={{
        backgroundColor: '#f5f5f5',
        padding: '1rem',
        borderRadius: '4px'
      }}>
          <p style={{
          fontSize: '0.75rem',
          color: '#666',
          margin: 0
        }}>
            <strong>FSM Transition Flow:</strong>
          </p>
          <p style={{
          fontSize: '0.75rem',
          color: '#666',
          margin: '0.5rem 0 0 0'
        }}>
            idle → loading → (success: idle) or (error: error state)
          </p>
          <p style={{
          fontSize: '0.75rem',
          color: '#666',
          margin: '0.5rem 0 0 0'
        }}>
            Each button manages its own FSM state independently.
          </p>
        </div>
      </div>;
  }
}`,...(ka=(wa=C.parameters)==null?void 0:wa.docs)==null?void 0:ka.source},description:{story:`FSM State Transitions Under Async Operations

Shows realistic use case: button transitions between idle → loading → error/success`,...(za=(Da=C.parameters)==null?void 0:Da.docs)==null?void 0:za.description}}};var Ta,Aa,La,Wa,Ca;E.parameters={...E.parameters,docs:{...(Ta=E.parameters)==null?void 0:Ta.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }}>
      <div>
        <h3 style={{
        fontSize: '0.875rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem'
      }}>
          ✅ Accessible Icon-only Buttons
        </h3>
        <div style={{
        display: 'flex',
        gap: '0.5rem'
      }}>
          <Button variant="outline-secondary" aria-label="Close dialog" startIcon={<XLgIcon />}>
            {''}
          </Button>
          <Button variant="outline-primary" aria-label="Settings" startIcon={<GearIcon />}>
            {''}
          </Button>
          <Button variant="outline-danger" aria-label="Delete item" startIcon={<Trash3Icon />}>
            {''}
          </Button>
          <Button variant="outline-success" aria-label="Add item" startIcon={<PlusIcon />}>
            {''}
          </Button>
        </div>
        <p style={{
        fontSize: '0.75rem',
        color: '#666',
        marginTop: '0.5rem'
      }}>
          Each icon-only button has an <code>aria-label</code> for screen readers.
        </p>
      </div>

      <div>
        <h3 style={{
        fontSize: '0.875rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem'
      }}>
          ✅ Icon + Text (no aria-label needed)
        </h3>
        <div style={{
        display: 'flex',
        gap: '0.5rem'
      }}>
          <Button variant="primary" startIcon={<SaveIcon />}>
            Save
          </Button>
          <Button variant="success" startIcon={<CheckIcon />}>
            Confirm
          </Button>
          <Button variant="secondary" endIcon={<ArrowRightIcon />}>
            Next
          </Button>
        </div>
        <p style={{
        fontSize: '0.75rem',
        color: '#666',
        marginTop: '0.5rem'
      }}>
          Buttons with visible text content automatically have accessible names.
        </p>
      </div>

      <div style={{
      backgroundColor: '#fff3cd',
      padding: '1rem',
      borderRadius: '4px',
      border: '1px solid #ffc107'
    }}>
        <p style={{
        fontSize: '0.75rem',
        color: '#856404',
        margin: 0
      }}>
          <strong>
            <ExclamationTriangleIcon size={14} style={{
            marginRight: '4px'
          }} />
            Accessibility Note:
          </strong>{' '}
          Icon-only buttons without <code>aria-label</code> will fail WCAG 2.2 AA compliance. Our
          test suite includes guards that verify this requirement.
        </p>
      </div>
    </div>
}`,...(La=(Aa=E.parameters)==null?void 0:Aa.docs)==null?void 0:La.source},description:{story:`Accessibility Features Showcase

The Button component is fully WCAG 2.2 AA compliant with comprehensive
accessibility features tested by 24 dedicated accessibility tests.

Features demonstrated:
- Proper ARIA attributes (aria-label, aria-describedby, aria-controls, etc.)
- Keyboard navigation (Tab, Enter, Space)
- Screen reader support
- Icon-only button accessibility guards
- Focus visibility
Icon-only buttons MUST have aria-label for accessibility`,...(Ca=(Wa=E.parameters)==null?void 0:Wa.docs)==null?void 0:Ca.description}}};var Ea,Oa,Fa,Pa,Ma;O.parameters={...O.parameters,docs:{...(Ea=O.parameters)==null?void 0:Ea.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }}>
      <div>
        <h3 style={{
        fontSize: '0.875rem',
        fontWeight: 'bold',
        marginBottom: '1rem'
      }}>
          Keyboard Navigation Test
        </h3>
        <p style={{
        fontSize: '0.75rem',
        color: '#666',
        marginBottom: '1rem'
      }}>
          Use Tab to navigate between buttons. Press Enter or Space to activate.
        </p>
        <div style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
          <Button variant="primary">First Button</Button>
          <Button variant="secondary">Second Button</Button>
          <Button variant="success" disabled>
            Disabled (Skip)
          </Button>
          <Button variant="info">Third Button</Button>
        </div>
      </div>

      <div style={{
      backgroundColor: '#d1ecf1',
      padding: '1rem',
      borderRadius: '4px',
      border: '1px solid #bee5eb'
    }}>
        <p style={{
        fontSize: '0.75rem',
        color: '#0c5460',
        margin: 0
      }}>
          <strong>Test Coverage:</strong> The Button.a11y.test.tsx file includes 6 keyboard
          interaction tests verifying:
        </p>
        <ul style={{
        fontSize: '0.75rem',
        color: '#0c5460',
        marginTop: '0.5rem',
        paddingLeft: '1rem'
      }}>
          <li>Enter key triggers onClick</li>
          <li>Space key triggers onClick</li>
          <li>Disabled buttons block keyboard interaction</li>
          <li>Loading buttons block keyboard interaction</li>
          <li>Tab navigation works between buttons</li>
          <li>Disabled buttons are not focusable via Tab</li>
        </ul>
      </div>
    </div>
}`,...(Fa=(Oa=O.parameters)==null?void 0:Oa.docs)==null?void 0:Fa.source},description:{story:`Keyboard Navigation Demo
Tests verify Enter, Space, Tab navigation work correctly`,...(Ma=(Pa=O.parameters)==null?void 0:Pa.docs)==null?void 0:Ma.description}}};var Ra,Na,Va,Ha,Ga;F.parameters={...F.parameters,docs:{...(Ra=F.parameters)==null?void 0:Ra.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }}>
      <div>
        <h3 style={{
        fontSize: '0.875rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem'
      }}>
          aria-expanded (Expandable)
        </h3>
        <Button variant="outline-secondary" aria-expanded={false} aria-controls="dropdown-menu" endIcon={<ChevronDownIcon />}>
          Dropdown Menu
        </Button>
      </div>

      <div>
        <h3 style={{
        fontSize: '0.875rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem'
      }}>
          aria-pressed (Toggle)
        </h3>
        <div style={{
        display: 'flex',
        gap: '0.5rem'
      }}>
          <Button variant="outline-primary" aria-pressed={false}>
            Off
          </Button>
          <Button variant="primary" aria-pressed={true}>
            On
          </Button>
        </div>
      </div>

      <div>
        <h3 style={{
        fontSize: '0.875rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem'
      }}>
          aria-describedby (Additional description)
        </h3>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
          <Button variant="danger" aria-label="Delete Account - This action cannot be undone">
            Delete Account
          </Button>
          <span style={{
          fontSize: '0.75rem',
          color: '#dc3545'
        }}>
            This action cannot be undone.
          </span>
        </div>
      </div>

      <div style={{
      backgroundColor: '#e7f3e7',
      padding: '1rem',
      borderRadius: '4px',
      border: '1px solid #28a745'
    }}>
        <p style={{
        fontSize: '0.75rem',
        color: '#155724',
        margin: 0
      }}>
          <strong>✅ All ARIA attributes tested:</strong> aria-label, aria-describedby,
          aria-controls, aria-expanded, aria-pressed, aria-busy
        </p>
      </div>
    </div>
}`,...(Va=(Na=F.parameters)==null?void 0:Na.docs)==null?void 0:Va.source},description:{story:`ARIA Attributes Demo
Shows all supported ARIA attributes for accessibility`,...(Ga=(Ha=F.parameters)==null?void 0:Ha.docs)==null?void 0:Ga.description}}};const on=["Primary","Secondary","Success","Danger","Warning","Info","Light","Dark","OutlinePrimary","OutlineSecondary","OutlineSuccess","OutlineDanger","Link","SmallSize","MediumSize","LargeSize","Disabled","DisabledPrimary","DisabledOutline","FullWidth","SubmitButton","ResetButton","WithIconLeft","WithIconRight","IconOnly","WithAriaLabel","WithAriaExpanded","WithAriaPressed","AllVariants","Loading","LoadingWithText","LoadingDifferentVariants","WithStartIcon","WithEndIcon","WithBothIcons","IconOnlyButton","AllIconsShowcase","WithAnnouncement","AnnounceDifferentStates","AllSizes","ErrorState","ErrorWithRecovery","FSMStatePriority","FSMInteractiveStates","FSMAsyncOperations","AccessibleIconOnlyButton","KeyboardNavigationDemo","ARIAAttributesDemo"];export{F as ARIAAttributesDemo,E as AccessibleIconOnlyButton,te as AllIconsShowcase,T as AllSizes,w as AllVariants,ae as AnnounceDifferentStates,m as Danger,y as Dark,x as Disabled,U as DisabledOutline,K as DisabledPrimary,A as ErrorState,ne as ErrorWithRecovery,C as FSMAsyncOperations,W as FSMInteractiveStates,L as FSMStatePriority,S as FullWidth,_ as IconOnly,re as IconOnlyButton,g as Info,O as KeyboardNavigationDemo,G as LargeSize,h as Light,f as Link,k as Loading,Z as LoadingDifferentVariants,Y as LoadingWithText,H as MediumSize,V as OutlineDanger,v as OutlinePrimary,R as OutlineSecondary,N as OutlineSuccess,l as Primary,X as ResetButton,d as Secondary,b as SmallSize,B as SubmitButton,u as Success,p as Warning,z as WithAnnouncement,J as WithAriaExpanded,I as WithAriaLabel,Q as WithAriaPressed,ee as WithBothIcons,$ as WithEndIcon,j as WithIconLeft,q as WithIconRight,D as WithStartIcon,on as __namedExportsOrder,sn as default};
