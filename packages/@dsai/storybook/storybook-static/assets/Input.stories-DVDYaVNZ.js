import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as i}from"./iframe-BdiDpM7d.js";import{I as r}from"./Tabs-CHAWmy3D.js";import"./preload-helper-Dp1pzeXC.js";const ja={title:"Components/Input",component:r,parameters:{layout:"padded",docs:{description:{component:"A flexible text input component built with Bootstrap 5 classes. Supports multiple types, sizes, validation states, and addons."}}},tags:["autodocs"],argTypes:{type:{control:"select",options:["text","email","password","number","tel","url","search"],description:"Input type",table:{type:{summary:"InputType"},defaultValue:{summary:"text"}}},size:{control:"select",options:["sm","md","lg"],description:"Input size",table:{type:{summary:"InputSize"},defaultValue:{summary:"md"}}},label:{control:"text",description:"Input label",table:{type:{summary:"ReactNode"}}},helperText:{control:"text",description:"Helper or error message",table:{type:{summary:"string"}}},error:{control:"boolean",description:"Error state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},success:{control:"boolean",description:"Success state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},disabled:{control:"boolean",description:"Disabled state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},readOnly:{control:"boolean",description:"Read-only state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},required:{control:"boolean",description:"Required field",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},clearable:{control:"boolean",description:"Show clear button",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},showCount:{control:"boolean",description:"Show character counter",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},floating:{control:"boolean",description:"Floating label style",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},plaintext:{control:"boolean",description:"Plaintext style",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}}},d={args:{label:"Email address",type:"email",placeholder:"Enter your email"}},c={args:{"aria-label":"Search",placeholder:"Search...",type:"search"}},p={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:"400px"},children:[e.jsx(r,{label:"Text",type:"text",placeholder:"Enter text"}),e.jsx(r,{label:"Email",type:"email",placeholder:"name@example.com"}),e.jsx(r,{label:"Password",type:"password",placeholder:"Enter password"}),e.jsx(r,{label:"Number",type:"number",placeholder:"0"}),e.jsx(r,{label:"Phone",type:"tel",placeholder:"+1 (555) 123-4567"}),e.jsx(r,{label:"URL",type:"url",placeholder:"https://example.com"}),e.jsx(r,{label:"Search",type:"search",placeholder:"Search..."})]})},u={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:"400px"},children:[e.jsx(r,{label:"Small",size:"sm",placeholder:"Small input"}),e.jsx(r,{label:"Medium (default)",size:"md",placeholder:"Medium input"}),e.jsx(r,{label:"Large",size:"lg",placeholder:"Large input"})]})},m={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:"400px"},children:[e.jsx(r,{label:"Default",placeholder:"Default state"}),e.jsx(r,{label:"Error",error:!0,helperText:"This field is required"}),e.jsx(r,{label:"Success",success:!0,helperText:"Looks good!",defaultValue:"Valid input"}),e.jsx(r,{label:"Disabled",disabled:!0,placeholder:"Disabled input"}),e.jsx(r,{label:"Read Only",readOnly:!0,defaultValue:"Read-only value"})]})},h={args:{label:"Email",type:"email",error:!0,helperText:"Please enter a valid email address",defaultValue:"invalid-email"}},x={args:{label:"Username",success:!0,helperText:"Username is available",defaultValue:"johndoe"}},b={args:{label:"Price",type:"number",prefix:"$",placeholder:"0.00"}},y={args:{label:"Email",suffix:"@company.com",placeholder:"username"}},f={args:{label:"Amount",type:"number",prefix:"$",suffix:".00",placeholder:"0"}},g={render:()=>{const l=()=>e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",viewBox:"0 0 16 16",children:e.jsx("path",{d:"M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"})});return e.jsx(r,{label:"Search",type:"search",prefix:e.jsx(l,{}),placeholder:"Search..."})}},v={render:function(){const[a,t]=i.useState("Hello World");return e.jsx(r,{label:"Clearable Input",value:a,onChange:s=>t(s.target.value),clearable:!0,onClear:()=>t(""),helperText:"Click the X to clear"})}},S={args:{label:"Bio",maxLength:150,showCount:!0,helperText:"Brief description about yourself",placeholder:"Tell us about yourself..."}},w={args:{label:"Tweet",maxLength:280,showCount:!0,defaultValue:"Just shipped a new feature! 🚀"}},j={args:{label:"Email address",floating:!0,placeholder:"name@example.com",type:"email"}},I={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:"400px"},children:[e.jsx(r,{label:"Email address",floating:!0,placeholder:"name@example.com",type:"email"}),e.jsx(r,{label:"Password",floating:!0,placeholder:"Password",type:"password"}),e.jsx(r,{label:"Username",floating:!0,placeholder:"Username"})]})},T={args:{label:"Email",plaintext:!0,readOnly:!0,defaultValue:"email@example.com"}},C={args:{label:"Email",type:"email",required:!0,placeholder:"Required field"}},E={args:{label:"Password",type:"password",helperText:"Must be at least 8 characters long"}},D={render:function(){const[a,t]=i.useState("");return e.jsxs("div",{children:[e.jsx(r,{label:"Controlled Input",value:a,onChange:s=>t(s.target.value),placeholder:"Type something..."}),e.jsxs("p",{className:"mt-2 text-muted small",children:["Value: ",a||"(empty)"]})]})}},P={render:function(){const[a,t]=i.useState(""),[s,R]=i.useState(""),[z,ya]=i.useState({}),fa=n=>{n.preventDefault();const o={};a?/\S+@\S+\.\S+/.test(a)||(o.email="Please enter a valid email"):o.email="Email is required",s?s.length<8&&(o.password="Password must be at least 8 characters"):o.password="Password is required",ya(o),Object.keys(o).length===0&&alert("Form submitted successfully!")};return e.jsx("form",{onSubmit:fa,style:{maxWidth:"400px"},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(r,{label:"Email",type:"email",value:a,onChange:n=>t(n.target.value),error:!!z.email,helperText:z.email,required:!0}),e.jsx(r,{label:"Password",type:"password",value:s,onChange:n=>R(n.target.value),error:!!z.password,helperText:z.password||"Must be at least 8 characters",required:!0}),e.jsx("button",{type:"submit",className:"btn btn-primary",children:"Sign In"})]})})}},W={render:function(){return e.jsx("form",{style:{maxWidth:"400px"},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{style:{display:"flex",gap:"1rem"},children:[e.jsx(r,{label:"First Name",required:!0}),e.jsx(r,{label:"Last Name",required:!0})]}),e.jsx(r,{label:"Email",type:"email",required:!0}),e.jsx(r,{label:"Phone",type:"tel",helperText:"Optional"}),e.jsx(r,{label:"Password",type:"password",required:!0,helperText:"At least 8 characters with a number"}),e.jsx(r,{label:"Confirm Password",type:"password",required:!0}),e.jsx("button",{type:"submit",className:"btn btn-primary",children:"Create Account"})]})})}},q={render:function(){const[a,t]=i.useState(""),s=()=>e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",viewBox:"0 0 16 16",children:e.jsx("path",{d:"M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"})});return e.jsx(r,{type:"search","aria-label":"Search",prefix:e.jsx(s,{}),placeholder:"Search...",value:a,onChange:R=>t(R.target.value),clearable:!0,onClear:()=>t("")})}},A={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Safe Attributes Allowed"}),e.jsx("p",{className:"text-muted small",children:"These standard form attributes are safely passed through:"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(r,{label:"With name attribute",name:"demo-1"}),e.jsx(r,{label:"With required",required:!0}),e.jsx(r,{label:"With title",title:"This is a tooltip"}),e.jsx(r,{label:"With aria-label","aria-label":"Custom accessible label"})]})]}),e.jsxs("div",{children:[e.jsx("h5",{children:"Dangerous Event Handlers Blocked"}),e.jsx("p",{className:"text-muted small",children:"Event handlers like onLoad, onError, etc. are automatically filtered out to prevent XSS attacks."})]})]})},M={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Protected Against Prop Injection"}),e.jsx("p",{className:"text-muted small",children:"Only safe HTML attributes are rendered to the DOM. Dangerous props are silently filtered."})]}),e.jsxs("div",{children:[e.jsx("h5",{children:"Whitelisted Categories"}),e.jsxs("ul",{className:"text-muted small",children:[e.jsx("li",{children:"✓ Standard HTML attributes (name, value, disabled, required, etc.)"}),e.jsx("li",{children:"✓ All ARIA attributes (aria-label, aria-describedby, etc.)"}),e.jsx("li",{children:"✓ Input-specific attributes (autoComplete, tabIndex, etc.)"}),e.jsx("li",{children:"✗ All event handlers (onClick, onLoad, onError, etc.)"}),e.jsx("li",{children:"✗ Dangerous properties (innerHTML, dangerouslySetInnerHTML, etc.)"})]})]}),e.jsx("div",{children:e.jsx(r,{label:"Example: Safe and protected",name:"security-demo",title:"This input is protected against prop injection attacks",required:!0})})]})},N={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Keyboard Navigation Demo"}),e.jsx("p",{className:"text-muted small",children:"Use Tab to navigate and type to enter text. All inputs have proper keyboard support."})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(r,{label:"Focus here and type"}),e.jsx(r,{label:"Second input"}),e.jsx(r,{label:"With error",error:!0,helperText:"Also fully keyboard accessible"}),e.jsx(r,{label:"Disabled input (not in tab order)",disabled:!0})]})]})},L={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Screen Reader Friendly"}),e.jsx("p",{className:"text-muted small",children:"Semantic HTML and ARIA attributes provide full accessibility."})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(r,{label:"Basic input"}),e.jsx(r,{label:"Required field",required:!0}),e.jsx(r,{label:"With helper text",helperText:"This field helps you understand context"}),e.jsx(r,{label:"With error",error:!0,helperText:"This field is required and has an error"}),e.jsx(r,{"aria-label":"Input without visible label"})]})]})},V={render:function(){const[a,t]=i.useState(0);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Memoization Performance Demo"}),e.jsx("p",{className:"text-muted small",children:"The inputs won't re-render unnecessarily when you increment the counter below. Check your browser DevTools to see component renders."})]}),e.jsxs("div",{children:[e.jsxs("button",{type:"button",className:"btn btn-sm btn-outline-primary",onClick:()=>t(a+1),children:["Increment Counter: ",a]}),e.jsxs("p",{className:"text-muted small mt-2",children:["Parent re-renders: ",a," times"]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(r,{label:"Memoized input 1",placeholder:"Stays efficient"}),e.jsx(r,{label:"Memoized input 2",placeholder:"No unnecessary renders"}),e.jsx(r,{label:"With performance optimizations",helperText:"All class names and event handlers are memoized"})]}),e.jsxs("div",{className:"alert alert-info small",children:[e.jsx("strong",{children:"Performance Benefits:"}),e.jsxs("ul",{className:"mb-0 mt-2",children:[e.jsx("li",{children:"✓ Component wrapped with React.memo"}),e.jsx("li",{children:"✓ Class names memoized with useMemo"}),e.jsx("li",{children:"✓ Event handlers memoized with useCallback"}),e.jsx("li",{children:"✓ Computed values cached for efficient rendering"}),e.jsx("li",{children:"✓ Efficient re-render only when actual props change"})]})]})]})}};var k,F,H,O,B;d.parameters={...d.parameters,docs:{...(k=d.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    label: 'Email address',
    type: 'email',
    placeholder: 'Enter your email'
  }
}`,...(H=(F=d.parameters)==null?void 0:F.docs)==null?void 0:H.source},description:{story:"Default text input with label",...(B=(O=d.parameters)==null?void 0:O.docs)==null?void 0:B.description}}};var U,X,K,J,Q;c.parameters={...c.parameters,docs:{...(U=c.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Search',
    placeholder: 'Search...',
    type: 'search'
  }
}`,...(K=(X=c.parameters)==null?void 0:X.docs)==null?void 0:K.source},description:{story:"Input without label (uses aria-label)",...(Q=(J=c.parameters)==null?void 0:J.docs)==null?void 0:Q.description}}};var $,_,G,Y,Z;p.parameters={...p.parameters,docs:{...($=p.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '400px'
  }}>
      <Input label="Text" type="text" placeholder="Enter text" />
      <Input label="Email" type="email" placeholder="name@example.com" />
      <Input label="Password" type="password" placeholder="Enter password" />
      <Input label="Number" type="number" placeholder="0" />
      <Input label="Phone" type="tel" placeholder="+1 (555) 123-4567" />
      <Input label="URL" type="url" placeholder="https://example.com" />
      <Input label="Search" type="search" placeholder="Search..." />
    </div>
}`,...(G=(_=p.parameters)==null?void 0:_.docs)==null?void 0:G.source},description:{story:"All input types",...(Z=(Y=p.parameters)==null?void 0:Y.docs)==null?void 0:Z.description}}};var ee,re,ae,te,se;u.parameters={...u.parameters,docs:{...(ee=u.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '400px'
  }}>
      <Input label="Small" size="sm" placeholder="Small input" />
      <Input label="Medium (default)" size="md" placeholder="Medium input" />
      <Input label="Large" size="lg" placeholder="Large input" />
    </div>
}`,...(ae=(re=u.parameters)==null?void 0:re.docs)==null?void 0:ae.source},description:{story:"Input sizes",...(se=(te=u.parameters)==null?void 0:te.docs)==null?void 0:se.description}}};var le,ie,oe,ne,de;m.parameters={...m.parameters,docs:{...(le=m.parameters)==null?void 0:le.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '400px'
  }}>
      <Input label="Default" placeholder="Default state" />
      <Input label="Error" error helperText="This field is required" />
      <Input label="Success" success helperText="Looks good!" defaultValue="Valid input" />
      <Input label="Disabled" disabled placeholder="Disabled input" />
      <Input label="Read Only" readOnly defaultValue="Read-only value" />
    </div>
}`,...(oe=(ie=m.parameters)==null?void 0:ie.docs)==null?void 0:oe.source},description:{story:"Validation states",...(de=(ne=m.parameters)==null?void 0:ne.docs)==null?void 0:de.description}}};var ce,pe,ue,me,he;h.parameters={...h.parameters,docs:{...(ce=h.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    type: 'email',
    error: true,
    helperText: 'Please enter a valid email address',
    defaultValue: 'invalid-email'
  }
}`,...(ue=(pe=h.parameters)==null?void 0:pe.docs)==null?void 0:ue.source},description:{story:"Error state with message",...(he=(me=h.parameters)==null?void 0:me.docs)==null?void 0:he.description}}};var xe,be,ye,fe,ge;x.parameters={...x.parameters,docs:{...(xe=x.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  args: {
    label: 'Username',
    success: true,
    helperText: 'Username is available',
    defaultValue: 'johndoe'
  }
}`,...(ye=(be=x.parameters)==null?void 0:be.docs)==null?void 0:ye.source},description:{story:"Success state",...(ge=(fe=x.parameters)==null?void 0:fe.docs)==null?void 0:ge.description}}};var ve,Se,we,je,Ie;b.parameters={...b.parameters,docs:{...(ve=b.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  args: {
    label: 'Price',
    type: 'number',
    prefix: '$',
    placeholder: '0.00'
  }
}`,...(we=(Se=b.parameters)==null?void 0:Se.docs)==null?void 0:we.source},description:{story:"Input with prefix",...(Ie=(je=b.parameters)==null?void 0:je.docs)==null?void 0:Ie.description}}};var Te,Ce,Ee,De,Pe;y.parameters={...y.parameters,docs:{...(Te=y.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    suffix: '@company.com',
    placeholder: 'username'
  }
}`,...(Ee=(Ce=y.parameters)==null?void 0:Ce.docs)==null?void 0:Ee.source},description:{story:"Input with suffix",...(Pe=(De=y.parameters)==null?void 0:De.docs)==null?void 0:Pe.description}}};var We,qe,Ae,Me,Ne;f.parameters={...f.parameters,docs:{...(We=f.parameters)==null?void 0:We.docs,source:{originalSource:`{
  args: {
    label: 'Amount',
    type: 'number',
    prefix: '$',
    suffix: '.00',
    placeholder: '0'
  }
}`,...(Ae=(qe=f.parameters)==null?void 0:qe.docs)==null?void 0:Ae.source},description:{story:"Input with both prefix and suffix",...(Ne=(Me=f.parameters)==null?void 0:Me.docs)==null?void 0:Ne.description}}};var Le,Ve,ze,Re,ke;g.parameters={...g.parameters,docs:{...(Le=g.parameters)==null?void 0:Le.docs,source:{originalSource:`{
  render: () => {
    const SearchIcon = (): React.JSX.Element => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
      </svg>;
    return <Input label="Search" type="search" prefix={<SearchIcon />} placeholder="Search..." />;
  }
}`,...(ze=(Ve=g.parameters)==null?void 0:Ve.docs)==null?void 0:ze.source},description:{story:"Input with icon prefix",...(ke=(Re=g.parameters)==null?void 0:Re.docs)==null?void 0:ke.description}}};var Fe,He,Oe,Be,Ue;v.parameters={...v.parameters,docs:{...(Fe=v.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
  render: function ClearableInput() {
    const [value, setValue] = useState('Hello World');
    return <Input label="Clearable Input" value={value} onChange={e => setValue(e.target.value)} clearable onClear={() => setValue('')} helperText="Click the X to clear" />;
  }
}`,...(Oe=(He=v.parameters)==null?void 0:He.docs)==null?void 0:Oe.source},description:{story:"Clearable input",...(Ue=(Be=v.parameters)==null?void 0:Be.docs)==null?void 0:Ue.description}}};var Xe,Ke,Je,Qe,$e;S.parameters={...S.parameters,docs:{...(Xe=S.parameters)==null?void 0:Xe.docs,source:{originalSource:`{
  args: {
    label: 'Bio',
    maxLength: 150,
    showCount: true,
    helperText: 'Brief description about yourself',
    placeholder: 'Tell us about yourself...'
  }
}`,...(Je=(Ke=S.parameters)==null?void 0:Ke.docs)==null?void 0:Je.source},description:{story:"Input with character counter",...($e=(Qe=S.parameters)==null?void 0:Qe.docs)==null?void 0:$e.description}}};var _e,Ge,Ye,Ze,er;w.parameters={...w.parameters,docs:{...(_e=w.parameters)==null?void 0:_e.docs,source:{originalSource:`{
  args: {
    label: 'Tweet',
    maxLength: 280,
    showCount: true,
    defaultValue: 'Just shipped a new feature! 🚀'
  }
}`,...(Ye=(Ge=w.parameters)==null?void 0:Ge.docs)==null?void 0:Ye.source},description:{story:"Character counter with initial value",...(er=(Ze=w.parameters)==null?void 0:Ze.docs)==null?void 0:er.description}}};var rr,ar,tr,sr,lr;j.parameters={...j.parameters,docs:{...(rr=j.parameters)==null?void 0:rr.docs,source:{originalSource:`{
  args: {
    label: 'Email address',
    floating: true,
    placeholder: 'name@example.com',
    type: 'email'
  }
}`,...(tr=(ar=j.parameters)==null?void 0:ar.docs)==null?void 0:tr.source},description:{story:"Floating label input",...(lr=(sr=j.parameters)==null?void 0:sr.docs)==null?void 0:lr.description}}};var ir,or,nr,dr,cr;I.parameters={...I.parameters,docs:{...(ir=I.parameters)==null?void 0:ir.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '400px'
  }}>
      <Input label="Email address" floating placeholder="name@example.com" type="email" />
      <Input label="Password" floating placeholder="Password" type="password" />
      <Input label="Username" floating placeholder="Username" />
    </div>
}`,...(nr=(or=I.parameters)==null?void 0:or.docs)==null?void 0:nr.source},description:{story:"Floating labels showcase",...(cr=(dr=I.parameters)==null?void 0:dr.docs)==null?void 0:cr.description}}};var pr,ur,mr,hr,xr;T.parameters={...T.parameters,docs:{...(pr=T.parameters)==null?void 0:pr.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    plaintext: true,
    readOnly: true,
    defaultValue: 'email@example.com'
  }
}`,...(mr=(ur=T.parameters)==null?void 0:ur.docs)==null?void 0:mr.source},description:{story:"Plaintext readonly input",...(xr=(hr=T.parameters)==null?void 0:hr.docs)==null?void 0:xr.description}}};var br,yr,fr,gr,vr;C.parameters={...C.parameters,docs:{...(br=C.parameters)==null?void 0:br.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'Required field'
  }
}`,...(fr=(yr=C.parameters)==null?void 0:yr.docs)==null?void 0:fr.source},description:{story:"Required field",...(vr=(gr=C.parameters)==null?void 0:gr.docs)==null?void 0:vr.description}}};var Sr,wr,jr,Ir,Tr;E.parameters={...E.parameters,docs:{...(Sr=E.parameters)==null?void 0:Sr.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    type: 'password',
    helperText: 'Must be at least 8 characters long'
  }
}`,...(jr=(wr=E.parameters)==null?void 0:wr.docs)==null?void 0:jr.source},description:{story:"Input with helper text",...(Tr=(Ir=E.parameters)==null?void 0:Ir.docs)==null?void 0:Tr.description}}};var Cr,Er,Dr,Pr,Wr;D.parameters={...D.parameters,docs:{...(Cr=D.parameters)==null?void 0:Cr.docs,source:{originalSource:`{
  render: function ControlledInput() {
    const [value, setValue] = useState('');
    return <div>
        <Input label="Controlled Input" value={value} onChange={e => setValue(e.target.value)} placeholder="Type something..." />
        <p className="mt-2 text-muted small">Value: {value || '(empty)'}</p>
      </div>;
  }
}`,...(Dr=(Er=D.parameters)==null?void 0:Er.docs)==null?void 0:Dr.source},description:{story:"Controlled input",...(Wr=(Pr=D.parameters)==null?void 0:Pr.docs)==null?void 0:Wr.description}}};var qr,Ar,Mr,Nr,Lr;P.parameters={...P.parameters,docs:{...(qr=P.parameters)==null?void 0:qr.docs,source:{originalSource:`{
  render: function LoginFormExample() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{
      email?: string;
      password?: string;
    }>({});
    const handleSubmit = (e: React.FormEvent): void => {
      e.preventDefault();
      const newErrors: {
        email?: string;
        password?: string;
      } = {};
      if (!email) {
        newErrors.email = 'Email is required';
      } else if (!/\\S+@\\S+\\.\\S+/.test(email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (!password) {
        newErrors.password = 'Password is required';
      } else if (password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        alert('Form submitted successfully!');
      }
    };
    return <form onSubmit={handleSubmit} style={{
      maxWidth: '400px'
    }}>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} error={!!errors.email} helperText={errors.email} required />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} error={!!errors.password} helperText={errors.password || 'Must be at least 8 characters'} required />
          <button type="submit" className="btn btn-primary">
            Sign In
          </button>
        </div>
      </form>;
  }
}`,...(Mr=(Ar=P.parameters)==null?void 0:Ar.docs)==null?void 0:Mr.source},description:{story:"Login form example",...(Lr=(Nr=P.parameters)==null?void 0:Nr.docs)==null?void 0:Lr.description}}};var Vr,zr,Rr,kr,Fr;W.parameters={...W.parameters,docs:{...(Vr=W.parameters)==null?void 0:Vr.docs,source:{originalSource:`{
  render: function RegistrationFormExample() {
    return <form style={{
      maxWidth: '400px'
    }}>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
          <div style={{
          display: 'flex',
          gap: '1rem'
        }}>
            <Input label="First Name" required />
            <Input label="Last Name" required />
          </div>
          <Input label="Email" type="email" required />
          <Input label="Phone" type="tel" helperText="Optional" />
          <Input label="Password" type="password" required helperText="At least 8 characters with a number" />
          <Input label="Confirm Password" type="password" required />
          <button type="submit" className="btn btn-primary">
            Create Account
          </button>
        </div>
      </form>;
  }
}`,...(Rr=(zr=W.parameters)==null?void 0:zr.docs)==null?void 0:Rr.source},description:{story:"Registration form example",...(Fr=(kr=W.parameters)==null?void 0:kr.docs)==null?void 0:Fr.description}}};var Hr,Or,Br,Ur,Xr;q.parameters={...q.parameters,docs:{...(Hr=q.parameters)==null?void 0:Hr.docs,source:{originalSource:`{
  render: function SearchInputExample() {
    const [query, setQuery] = useState('');
    const SearchIcon = (): React.JSX.Element => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
      </svg>;
    return <Input type="search" aria-label="Search" prefix={<SearchIcon />} placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} clearable onClear={() => setQuery('')} />;
  }
}`,...(Br=(Or=q.parameters)==null?void 0:Or.docs)==null?void 0:Br.source},description:{story:"Search input pattern",...(Xr=(Ur=q.parameters)==null?void 0:Ur.docs)==null?void 0:Xr.description}}};var Kr,Jr,Qr,$r,_r;A.parameters={...A.parameters,docs:{...(Kr=A.parameters)==null?void 0:Kr.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <div>
        <h5>Safe Attributes Allowed</h5>
        <p className="text-muted small">
          These standard form attributes are safely passed through:
        </p>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
          <Input label="With name attribute" name="demo-1" />
          <Input label="With required" required />
          <Input label="With title" title="This is a tooltip" />
          <Input label="With aria-label" aria-label="Custom accessible label" />
        </div>
      </div>
      <div>
        <h5>Dangerous Event Handlers Blocked</h5>
        <p className="text-muted small">
          Event handlers like onLoad, onError, etc. are automatically filtered out
          to prevent XSS attacks.
        </p>
      </div>
    </div>
}`,...(Qr=(Jr=A.parameters)==null?void 0:Jr.docs)==null?void 0:Qr.source},description:{story:`Security: Event Handler Validation

The Input component uses a whitelist of safe HTML attributes to prevent
dangerous event handlers from being injected via props. All dangerously
event handlers (onLoad, onError, etc.) are blocked at the input element level.

This protects against XSS vulnerabilities through prop spreading.`,...(_r=($r=A.parameters)==null?void 0:$r.docs)==null?void 0:_r.description}}};var Gr,Yr,Zr,ea,ra;M.parameters={...M.parameters,docs:{...(Gr=M.parameters)==null?void 0:Gr.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <div>
        <h5>Protected Against Prop Injection</h5>
        <p className="text-muted small">
          Only safe HTML attributes are rendered to the DOM. Dangerous props are silently filtered.
        </p>
      </div>
      <div>
        <h5>Whitelisted Categories</h5>
        <ul className="text-muted small">
          <li>✓ Standard HTML attributes (name, value, disabled, required, etc.)</li>
          <li>✓ All ARIA attributes (aria-label, aria-describedby, etc.)</li>
          <li>✓ Input-specific attributes (autoComplete, tabIndex, etc.)</li>
          <li>✗ All event handlers (onClick, onLoad, onError, etc.)</li>
          <li>✗ Dangerous properties (innerHTML, dangerouslySetInnerHTML, etc.)</li>
        </ul>
      </div>
      <div>
        <Input label="Example: Safe and protected" name="security-demo" title="This input is protected against prop injection attacks" required />
      </div>
    </div>
}`,...(Zr=(Yr=M.parameters)==null?void 0:Yr.docs)==null?void 0:Zr.source},description:{story:`Security: Prop Whitelist Protection

Only explicitly whitelisted HTML attributes are allowed on the input element.
This prevents injection of dangerous attributes and event handlers through
the \`rest\` props parameter.`,...(ra=(ea=M.parameters)==null?void 0:ea.docs)==null?void 0:ra.description}}};var aa,ta,sa,la,ia;N.parameters={...N.parameters,docs:{...(aa=N.parameters)==null?void 0:aa.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <div>
        <h5>Keyboard Navigation Demo</h5>
        <p className="text-muted small">
          Use Tab to navigate and type to enter text. All inputs have proper keyboard support.
        </p>
      </div>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
        <Input label="Focus here and type" />
        <Input label="Second input" />
        <Input label="With error" error helperText="Also fully keyboard accessible" />
        <Input label="Disabled input (not in tab order)" disabled />
      </div>
    </div>
}`,...(sa=(ta=N.parameters)==null?void 0:ta.docs)==null?void 0:sa.source},description:{story:`Accessibility: Full Keyboard Support

The Input component provides full keyboard support for all interactions:
- Tab/Shift+Tab: Navigate to/from input
- Type: Enter text into input
- All states remain accessible: disabled, error, clearable`,...(ia=(la=N.parameters)==null?void 0:la.docs)==null?void 0:ia.description}}};var oa,na,da,ca,pa;L.parameters={...L.parameters,docs:{...(oa=L.parameters)==null?void 0:oa.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <div>
        <h5>Screen Reader Friendly</h5>
        <p className="text-muted small">
          Semantic HTML and ARIA attributes provide full accessibility.
        </p>
      </div>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
        <Input label="Basic input" />
        <Input label="Required field" required />
        <Input label="With helper text" helperText="This field helps you understand context" />
        <Input label="With error" error helperText="This field is required and has an error" />
        <Input aria-label="Input without visible label" />
      </div>
    </div>
}`,...(da=(na=L.parameters)==null?void 0:na.docs)==null?void 0:da.source},description:{story:"Accessibility: Screen Reader Support\n\nProper semantic markup and ARIA attributes ensure screen reader compatibility:\n- Native `<input>` element for full semantic meaning\n- `<label>` properly associated via `htmlFor`\n- `aria-describedby` links to helper text and error messages\n- `aria-invalid` indicates error state\n- Error/helper messages associated with `id`",...(pa=(ca=L.parameters)==null?void 0:ca.docs)==null?void 0:pa.description}}};var ua,ma,ha,xa,ba;V.parameters={...V.parameters,docs:{...(ua=V.parameters)==null?void 0:ua.docs,source:{originalSource:`{
  render: function PerformanceDemo() {
    const [counter, setCounter] = useState(0);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
        <div>
          <h5>Memoization Performance Demo</h5>
          <p className="text-muted small">
            The inputs won't re-render unnecessarily when you increment the counter below.
            Check your browser DevTools to see component renders.
          </p>
        </div>

        <div>
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setCounter(counter + 1)}>
            Increment Counter: {counter}
          </button>
          <p className="text-muted small mt-2">
            Parent re-renders: {counter} times
          </p>
        </div>

        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
          <Input label="Memoized input 1" placeholder="Stays efficient" />
          <Input label="Memoized input 2" placeholder="No unnecessary renders" />
          <Input label="With performance optimizations" helperText="All class names and event handlers are memoized" />
        </div>

        <div className="alert alert-info small">
          <strong>Performance Benefits:</strong>
          <ul className="mb-0 mt-2">
            <li>✓ Component wrapped with React.memo</li>
            <li>✓ Class names memoized with useMemo</li>
            <li>✓ Event handlers memoized with useCallback</li>
            <li>✓ Computed values cached for efficient rendering</li>
            <li>✓ Efficient re-render only when actual props change</li>
          </ul>
        </div>
      </div>;
  }
}`,...(ha=(ma=V.parameters)==null?void 0:ma.docs)==null?void 0:ha.source},description:{story:`Performance: Memoization

The Input component is optimized with React.memo and useMemo:
- React.memo prevents re-renders when parent props don't change
- useMemo caches computed class names
- useCallback memoizes event handlers
- Computed values (hasPrefix, hasSuffix, etc.) are memoized

This ensures efficient rendering in complex forms with many inputs.`,...(ba=(xa=V.parameters)==null?void 0:xa.docs)==null?void 0:ba.description}}};const Ia=["Default","WithoutLabel","InputTypes","Sizes","ValidationStates","ErrorState","Success","WithPrefix","WithSuffix","WithPrefixAndSuffix","WithIconPrefix","Clearable","CharacterCounter","CharacterCounterWithValue","FloatingLabel","FloatingLabels","Plaintext","Required","WithHelperText","Controlled","LoginForm","RegistrationForm","SearchInput","SecurityEventHandlerValidation","SecurityPropWhitelist","AccessibilityKeyboardNavigation","AccessibilityScreenReaderSupport","PerformanceMemoization"];export{N as AccessibilityKeyboardNavigation,L as AccessibilityScreenReaderSupport,S as CharacterCounter,w as CharacterCounterWithValue,v as Clearable,D as Controlled,d as Default,h as ErrorState,j as FloatingLabel,I as FloatingLabels,p as InputTypes,P as LoginForm,V as PerformanceMemoization,T as Plaintext,W as RegistrationForm,C as Required,q as SearchInput,A as SecurityEventHandlerValidation,M as SecurityPropWhitelist,u as Sizes,x as Success,m as ValidationStates,E as WithHelperText,g as WithIconPrefix,b as WithPrefix,f as WithPrefixAndSuffix,y as WithSuffix,c as WithoutLabel,Ia as __namedExportsOrder,ja as default};
