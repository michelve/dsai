import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{y as a,b as i,c as F}from"./Tabs-Fap5R-zB.js";import{r as o}from"./iframe-6amVX2Fk.js";import"./preload-helper-Dp1pzeXC.js";const{screen:l}=__STORYBOOK_MODULE_TEST__,Tt={title:"Components/Input",component:a,parameters:{layout:"padded",docs:{description:{component:"A flexible text input component built with Bootstrap 5 classes. Supports multiple types, sizes, validation states, and addons."}}},tags:["autodocs"],argTypes:{type:{control:"select",options:["text","email","password","number","tel","url","search"],description:"Input type",table:{type:{summary:"InputType"},defaultValue:{summary:"text"}}},size:{control:"select",options:["sm","md","lg"],description:"Input size",table:{type:{summary:"InputSize"},defaultValue:{summary:"md"}}},label:{control:"text",description:"Input label",table:{type:{summary:"ReactNode"}}},helperText:{control:"text",description:"Helper or error message",table:{type:{summary:"string"}}},error:{control:"boolean",description:"Error state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},success:{control:"boolean",description:"Success state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},disabled:{control:"boolean",description:"Disabled state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},readOnly:{control:"boolean",description:"Read-only state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},required:{control:"boolean",description:"Required field",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},clearable:{control:"boolean",description:"Show clear button",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},showCount:{control:"boolean",description:"Show character counter",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},floating:{control:"boolean",description:"Floating label style",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},plaintext:{control:"boolean",description:"Plaintext style",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}}},d={args:{label:"Email address",type:"email",placeholder:"Enter your email"},play:async({userEvent:r})=>{const t=l.getByLabelText("Email address");await r.type(t,"user@example.com")}},u={args:{"aria-label":"Search",placeholder:"Search...",type:"search"},play:async({userEvent:r})=>{const t=l.getByLabelText("Search");await r.type(t,"storybook")}},m={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:"400px"},children:[e.jsx(a,{label:"Text",type:"text",placeholder:"Enter text"}),e.jsx(a,{label:"Email",type:"email",placeholder:"name@example.com"}),e.jsx(a,{label:"Password",type:"password",placeholder:"Enter password"}),e.jsx(a,{label:"Number",type:"number",placeholder:"0"}),e.jsx(a,{label:"Phone",type:"tel",placeholder:"+1 (555) 123-4567"}),e.jsx(a,{label:"URL",type:"url",placeholder:"https://example.com"}),e.jsx(a,{label:"Search",type:"search",placeholder:"Search..."})]})},h={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:"400px"},children:[e.jsx(a,{label:"Small",size:"sm",placeholder:"Small input"}),e.jsx(a,{label:"Medium (default)",size:"md",placeholder:"Medium input"}),e.jsx(a,{label:"Large",size:"lg",placeholder:"Large input"})]})},y={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:"400px"},children:[e.jsx(a,{label:"Default",placeholder:"Default state"}),e.jsx(a,{label:"Error",error:!0,helperText:"This field is required"}),e.jsx(a,{label:"Success",success:!0,helperText:"Looks good!",defaultValue:"Valid input"}),e.jsx(a,{label:"Disabled",disabled:!0,placeholder:"Disabled input"}),e.jsx(a,{label:"Read Only",readOnly:!0,defaultValue:"Read-only value"})]})},x={args:{label:"Email",type:"email",error:!0,helperText:"Please enter a valid email address",defaultValue:"invalid-email"}},b={args:{label:"Username",success:!0,helperText:"Username is available",defaultValue:"johndoe"}},f={args:{label:"Price",type:"number",prefix:"$",placeholder:"0.00"},play:async({userEvent:r})=>{const t=l.getByLabelText("Price");await r.type(t,"99.99")}},g={args:{label:"Email",suffix:"@company.com",placeholder:"username"},play:async({userEvent:r})=>{const t=l.getByLabelText("Email");await r.type(t,"john.doe")}},v={args:{label:"Amount",type:"number",prefix:"$",suffix:".00",placeholder:"0"},play:async({userEvent:r})=>{const t=l.getByLabelText("Amount");await r.type(t,"150")}},w={render:()=>{const r=()=>e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",viewBox:"0 0 16 16",children:e.jsx("path",{d:"M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"})});return e.jsx(a,{label:"Search",type:"search",prefix:e.jsx(r,{}),placeholder:"Search..."})},play:async({userEvent:r})=>{const t=l.getByLabelText("Search");await r.type(t,"components")}},S={render:function(){const[t,s]=o.useState("Hello World");return e.jsx(a,{label:"Clearable Input",value:t,onChange:n=>s(n.target.value),clearable:!0,onClear:()=>s(""),helperText:"Click the X to clear"})},play:async({userEvent:r})=>{const t=l.getByRole("button");await r.click(t)}},j={args:{label:"Bio",maxLength:150,showCount:!0,helperText:"Brief description about yourself",placeholder:"Tell us about yourself..."},play:async({userEvent:r})=>{const t=l.getByPlaceholderText("Tell us about yourself...");await r.type(t,"I am a developer interested in design systems and component libraries.")}},I={args:{label:"Tweet",maxLength:280,showCount:!0,defaultValue:"Just shipped a new feature!"}},E={args:{label:"Email address",floating:!0,placeholder:"name@example.com",type:"email"},play:async({userEvent:r})=>{const t=l.getByPlaceholderText("name@example.com");await r.type(t,"user@example.com")}},T={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:"400px"},children:[e.jsx(a,{label:"Email address",floating:!0,placeholder:"name@example.com",type:"email"}),e.jsx(a,{label:"Password",floating:!0,placeholder:"Password",type:"password"}),e.jsx(a,{label:"Username",floating:!0,placeholder:"Username"})]})},C={args:{label:"Email",plaintext:!0,readOnly:!0,defaultValue:"email@example.com"}},P={args:{label:"Email",type:"email",required:!0,placeholder:"Required field"},play:async({userEvent:r})=>{const t=l.getByLabelText("Email");await r.type(t,"required@example.com")}},D={args:{label:"Password",type:"password",helperText:"Must be at least 8 characters long"},play:async({userEvent:r})=>{const t=l.getByLabelText("Password");await r.type(t,"SecurePassword123")}},L={render:function(){const[t,s]=o.useState("");return e.jsxs("div",{children:[e.jsx(a,{label:"Controlled Input",value:t,onChange:n=>s(n.target.value),placeholder:"Type something..."}),e.jsxs("p",{className:"mt-2 text-muted small",children:["Value: ",t||"(empty)"]})]})},play:async({userEvent:r})=>{const t=l.getByPlaceholderText("Type something...");await r.type(t,"Controlled component")}},N={render:function(){const[t,s]=o.useState(""),[n,R]=o.useState(""),[V,vt]=o.useState({}),wt=p=>{p.preventDefault();const c={};t?/\S+@\S+\.\S+/.test(t)||(c.email="Please enter a valid email"):c.email="Email is required",n?n.length<8&&(c.password="Password must be at least 8 characters"):c.password="Password is required",vt(c),Object.keys(c).length===0&&alert("Form submitted successfully!")};return e.jsx("form",{onSubmit:wt,style:{maxWidth:"400px"},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(a,{label:"Email",type:"email",value:t,onChange:p=>s(p.target.value),error:!!V.email,helperText:V.email,required:!0}),e.jsx(a,{label:"Password",type:"password",value:n,onChange:p=>R(p.target.value),error:!!V.password,helperText:V.password||"Must be at least 8 characters",required:!0}),e.jsx("button",{type:"submit",className:"btn btn-primary",children:"Sign In"})]})})},play:async({userEvent:r})=>{const t=l.getAllByDisplayValue(""),s=t[0],n=t[1];await r.type(s,"user@example.com"),await r.type(n,"password123")}},z={render:function(){return e.jsx("form",{style:{maxWidth:"400px"},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{style:{display:"flex",gap:"1rem"},children:[e.jsx(a,{label:"First Name",required:!0}),e.jsx(a,{label:"Last Name",required:!0})]}),e.jsx(a,{label:"Email",type:"email",required:!0}),e.jsx(a,{label:"Phone",type:"tel",helperText:"Optional"}),e.jsx(a,{label:"Password",type:"password",required:!0,helperText:"At least 8 characters with a number"}),e.jsx(a,{label:"Confirm Password",type:"password",required:!0}),e.jsx("button",{type:"submit",className:"btn btn-primary",children:"Create Account"})]})})}},W={render:function(){const[t,s]=o.useState(""),n=()=>e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",viewBox:"0 0 16 16",children:e.jsx("path",{d:"M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"})});return e.jsx(a,{type:"search","aria-label":"Search",prefix:e.jsx(n,{}),placeholder:"Search...",value:t,onChange:R=>s(R.target.value),clearable:!0,onClear:()=>s("")})}},q={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Safe Attributes Allowed"}),e.jsx("p",{className:"text-muted small",children:"These standard form attributes are safely passed through:"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(a,{label:"With name attribute",name:"demo-1"}),e.jsx(a,{label:"With required",required:!0}),e.jsx(a,{label:"With title",title:"This is a tooltip"}),e.jsx(a,{label:"With aria-label","aria-label":"Custom accessible label"})]})]}),e.jsxs("div",{children:[e.jsx("h5",{children:"Dangerous Event Handlers Blocked"}),e.jsx("p",{className:"text-muted small",children:"Event handlers like onLoad, onError, etc. are automatically filtered out to prevent XSS attacks."})]})]})},A={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Protected Against Prop Injection"}),e.jsx("p",{className:"text-muted small",children:"Only safe HTML attributes are rendered to the DOM. Dangerous props are silently filtered."})]}),e.jsxs("div",{children:[e.jsx("h5",{children:"Whitelisted Categories"}),e.jsxs("ul",{className:"text-muted small",children:[e.jsxs("li",{children:[e.jsx(i,{size:14,className:"text-success me-1"}),"Standard HTML attributes (name, value, disabled, required, etc.)"]}),e.jsxs("li",{children:[e.jsx(i,{size:14,className:"text-success me-1"}),"All ARIA attributes (aria-label, aria-describedby, etc.)"]}),e.jsxs("li",{children:[e.jsx(i,{size:14,className:"text-success me-1"}),"Input-specific attributes (autoComplete, tabIndex, etc.)"]}),e.jsxs("li",{children:[e.jsx(F,{size:14,className:"text-danger me-1"}),"All event handlers (onClick, onLoad, onError, etc.)"]}),e.jsxs("li",{children:[e.jsx(F,{size:14,className:"text-danger me-1"}),"Dangerous properties (innerHTML, dangerouslySetInnerHTML, etc.)"]})]})]}),e.jsx("div",{children:e.jsx(a,{label:"Example: Safe and protected",name:"security-demo",title:"This input is protected against prop injection attacks",required:!0})})]})},M={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Keyboard Navigation Demo"}),e.jsx("p",{className:"text-muted small",children:"Use Tab to navigate and type to enter text. All inputs have proper keyboard support."})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(a,{label:"Focus here and type"}),e.jsx(a,{label:"Second input"}),e.jsx(a,{label:"With error",error:!0,helperText:"Also fully keyboard accessible"}),e.jsx(a,{label:"Disabled input (not in tab order)",disabled:!0})]})]})},B={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Screen Reader Friendly"}),e.jsx("p",{className:"text-muted small",children:"Semantic HTML and ARIA attributes provide full accessibility."})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(a,{label:"Basic input"}),e.jsx(a,{label:"Required field",required:!0}),e.jsx(a,{label:"With helper text",helperText:"This field helps you understand context"}),e.jsx(a,{label:"With error",error:!0,helperText:"This field is required and has an error"}),e.jsx(a,{"aria-label":"Input without visible label"})]})]})},k={render:function(){const[t,s]=o.useState(0);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Memoization Performance Demo"}),e.jsx("p",{className:"text-muted small",children:"The inputs won't re-render unnecessarily when you increment the counter below. Check your browser DevTools to see component renders."})]}),e.jsxs("div",{children:[e.jsxs("button",{type:"button",className:"btn btn-sm btn-outline-primary",onClick:()=>s(t+1),children:["Increment Counter: ",t]}),e.jsxs("p",{className:"text-muted small mt-2",children:["Parent re-renders: ",t," times"]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(a,{label:"Memoized input 1",placeholder:"Stays efficient"}),e.jsx(a,{label:"Memoized input 2",placeholder:"No unnecessary renders"}),e.jsx(a,{label:"With performance optimizations",helperText:"All class names and event handlers are memoized"})]}),e.jsxs("div",{className:"alert alert-info small",children:[e.jsx("strong",{children:"Performance Benefits:"}),e.jsxs("ul",{className:"mb-0 mt-2",children:[e.jsxs("li",{children:[e.jsx(i,{size:14,className:"text-success me-1"}),"Component wrapped with React.memo"]}),e.jsxs("li",{children:[e.jsx(i,{size:14,className:"text-success me-1"}),"Class names memoized with useMemo"]}),e.jsxs("li",{children:[e.jsx(i,{size:14,className:"text-success me-1"}),"Event handlers memoized with useCallback"]}),e.jsxs("li",{children:[e.jsx(i,{size:14,className:"text-success me-1"}),"Computed values cached for efficient rendering"]}),e.jsxs("li",{children:[e.jsx(i,{size:14,className:"text-success me-1"}),"Efficient re-render only when actual props change"]})]})]})]})}};var H,O,U,X,_;d.parameters={...d.parameters,docs:{...(H=d.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    label: 'Email address',
    type: 'email',
    placeholder: 'Enter your email'
  },
  play: async ({
    userEvent
  }) => {
    const input = screen.getByLabelText('Email address');
    await userEvent.type(input, 'user@example.com');
  }
}`,...(U=(O=d.parameters)==null?void 0:O.docs)==null?void 0:U.source},description:{story:"Default text input with label",...(_=(X=d.parameters)==null?void 0:X.docs)==null?void 0:_.description}}};var K,J,Q,$,Y;u.parameters={...u.parameters,docs:{...(K=u.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Search',
    placeholder: 'Search...',
    type: 'search'
  },
  play: async ({
    userEvent
  }) => {
    const input = screen.getByLabelText('Search');
    await userEvent.type(input, 'storybook');
  }
}`,...(Q=(J=u.parameters)==null?void 0:J.docs)==null?void 0:Q.source},description:{story:"Input without label (uses aria-label)",...(Y=($=u.parameters)==null?void 0:$.docs)==null?void 0:Y.description}}};var G,Z,ee,ae,te;m.parameters={...m.parameters,docs:{...(G=m.parameters)==null?void 0:G.docs,source:{originalSource:`{
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
}`,...(ee=(Z=m.parameters)==null?void 0:Z.docs)==null?void 0:ee.source},description:{story:"All input types",...(te=(ae=m.parameters)==null?void 0:ae.docs)==null?void 0:te.description}}};var re,se,le,ne,ie;h.parameters={...h.parameters,docs:{...(re=h.parameters)==null?void 0:re.docs,source:{originalSource:`{
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
}`,...(le=(se=h.parameters)==null?void 0:se.docs)==null?void 0:le.source},description:{story:"Input sizes",...(ie=(ne=h.parameters)==null?void 0:ne.docs)==null?void 0:ie.description}}};var oe,ce,pe,de,ue;y.parameters={...y.parameters,docs:{...(oe=y.parameters)==null?void 0:oe.docs,source:{originalSource:`{
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
}`,...(pe=(ce=y.parameters)==null?void 0:ce.docs)==null?void 0:pe.source},description:{story:"Validation states",...(ue=(de=y.parameters)==null?void 0:de.docs)==null?void 0:ue.description}}};var me,he,ye,xe,be;x.parameters={...x.parameters,docs:{...(me=x.parameters)==null?void 0:me.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    type: 'email',
    error: true,
    helperText: 'Please enter a valid email address',
    defaultValue: 'invalid-email'
  }
}`,...(ye=(he=x.parameters)==null?void 0:he.docs)==null?void 0:ye.source},description:{story:"Error state with message",...(be=(xe=x.parameters)==null?void 0:xe.docs)==null?void 0:be.description}}};var fe,ge,ve,we,Se;b.parameters={...b.parameters,docs:{...(fe=b.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  args: {
    label: 'Username',
    success: true,
    helperText: 'Username is available',
    defaultValue: 'johndoe'
  }
}`,...(ve=(ge=b.parameters)==null?void 0:ge.docs)==null?void 0:ve.source},description:{story:"Success state",...(Se=(we=b.parameters)==null?void 0:we.docs)==null?void 0:Se.description}}};var je,Ie,Ee,Te,Ce;f.parameters={...f.parameters,docs:{...(je=f.parameters)==null?void 0:je.docs,source:{originalSource:`{
  args: {
    label: 'Price',
    type: 'number',
    prefix: '$',
    placeholder: '0.00'
  },
  play: async ({
    userEvent
  }) => {
    const input = screen.getByLabelText('Price');
    await userEvent.type(input, '99.99');
  }
}`,...(Ee=(Ie=f.parameters)==null?void 0:Ie.docs)==null?void 0:Ee.source},description:{story:"Input with prefix",...(Ce=(Te=f.parameters)==null?void 0:Te.docs)==null?void 0:Ce.description}}};var Pe,De,Le,Ne,ze;g.parameters={...g.parameters,docs:{...(Pe=g.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    suffix: '@company.com',
    placeholder: 'username'
  },
  play: async ({
    userEvent
  }) => {
    const input = screen.getByLabelText('Email');
    await userEvent.type(input, 'john.doe');
  }
}`,...(Le=(De=g.parameters)==null?void 0:De.docs)==null?void 0:Le.source},description:{story:"Input with suffix",...(ze=(Ne=g.parameters)==null?void 0:Ne.docs)==null?void 0:ze.description}}};var We,qe,Ae,Me,Be;v.parameters={...v.parameters,docs:{...(We=v.parameters)==null?void 0:We.docs,source:{originalSource:`{
  args: {
    label: 'Amount',
    type: 'number',
    prefix: '$',
    suffix: '.00',
    placeholder: '0'
  },
  play: async ({
    userEvent
  }) => {
    const input = screen.getByLabelText('Amount');
    await userEvent.type(input, '150');
  }
}`,...(Ae=(qe=v.parameters)==null?void 0:qe.docs)==null?void 0:Ae.source},description:{story:"Input with both prefix and suffix",...(Be=(Me=v.parameters)==null?void 0:Me.docs)==null?void 0:Be.description}}};var ke,Ve,Re,Fe,He;w.parameters={...w.parameters,docs:{...(ke=w.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  render: () => {
    const SearchIcon = (): React.JSX.Element => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
      </svg>;
    return <Input label="Search" type="search" prefix={<SearchIcon />} placeholder="Search..." />;
  },
  play: async ({
    userEvent
  }) => {
    const input = screen.getByLabelText('Search');
    await userEvent.type(input, 'components');
  }
}`,...(Re=(Ve=w.parameters)==null?void 0:Ve.docs)==null?void 0:Re.source},description:{story:"Input with icon prefix",...(He=(Fe=w.parameters)==null?void 0:Fe.docs)==null?void 0:He.description}}};var Oe,Ue,Xe,_e,Ke;S.parameters={...S.parameters,docs:{...(Oe=S.parameters)==null?void 0:Oe.docs,source:{originalSource:`{
  render: function ClearableInput() {
    const [value, setValue] = useState('Hello World');
    return <Input label="Clearable Input" value={value} onChange={e => setValue(e.target.value)} clearable onClear={() => setValue('')} helperText="Click the X to clear" />;
  },
  play: async ({
    userEvent
  }) => {
    const clearButton = screen.getByRole('button');
    await userEvent.click(clearButton);
  }
}`,...(Xe=(Ue=S.parameters)==null?void 0:Ue.docs)==null?void 0:Xe.source},description:{story:"Clearable input",...(Ke=(_e=S.parameters)==null?void 0:_e.docs)==null?void 0:Ke.description}}};var Je,Qe,$e,Ye,Ge;j.parameters={...j.parameters,docs:{...(Je=j.parameters)==null?void 0:Je.docs,source:{originalSource:`{
  args: {
    label: 'Bio',
    maxLength: 150,
    showCount: true,
    helperText: 'Brief description about yourself',
    placeholder: 'Tell us about yourself...'
  },
  play: async ({
    userEvent
  }) => {
    const input = screen.getByPlaceholderText('Tell us about yourself...');
    await userEvent.type(input, 'I am a developer interested in design systems and component libraries.');
  }
}`,...($e=(Qe=j.parameters)==null?void 0:Qe.docs)==null?void 0:$e.source},description:{story:"Input with character counter",...(Ge=(Ye=j.parameters)==null?void 0:Ye.docs)==null?void 0:Ge.description}}};var Ze,ea,aa,ta,ra;I.parameters={...I.parameters,docs:{...(Ze=I.parameters)==null?void 0:Ze.docs,source:{originalSource:`{
  args: {
    label: 'Tweet',
    maxLength: 280,
    showCount: true,
    defaultValue: 'Just shipped a new feature!'
  }
}`,...(aa=(ea=I.parameters)==null?void 0:ea.docs)==null?void 0:aa.source},description:{story:"Character counter with initial value",...(ra=(ta=I.parameters)==null?void 0:ta.docs)==null?void 0:ra.description}}};var sa,la,na,ia,oa;E.parameters={...E.parameters,docs:{...(sa=E.parameters)==null?void 0:sa.docs,source:{originalSource:`{
  args: {
    label: 'Email address',
    floating: true,
    placeholder: 'name@example.com',
    type: 'email'
  },
  play: async ({
    userEvent
  }) => {
    const input = screen.getByPlaceholderText('name@example.com');
    await userEvent.type(input, 'user@example.com');
  }
}`,...(na=(la=E.parameters)==null?void 0:la.docs)==null?void 0:na.source},description:{story:"Floating label input",...(oa=(ia=E.parameters)==null?void 0:ia.docs)==null?void 0:oa.description}}};var ca,pa,da,ua,ma;T.parameters={...T.parameters,docs:{...(ca=T.parameters)==null?void 0:ca.docs,source:{originalSource:`{
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
}`,...(da=(pa=T.parameters)==null?void 0:pa.docs)==null?void 0:da.source},description:{story:"Floating labels showcase",...(ma=(ua=T.parameters)==null?void 0:ua.docs)==null?void 0:ma.description}}};var ha,ya,xa,ba,fa;C.parameters={...C.parameters,docs:{...(ha=C.parameters)==null?void 0:ha.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    plaintext: true,
    readOnly: true,
    defaultValue: 'email@example.com'
  }
}`,...(xa=(ya=C.parameters)==null?void 0:ya.docs)==null?void 0:xa.source},description:{story:"Plaintext readonly input",...(fa=(ba=C.parameters)==null?void 0:ba.docs)==null?void 0:fa.description}}};var ga,va,wa,Sa,ja;P.parameters={...P.parameters,docs:{...(ga=P.parameters)==null?void 0:ga.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'Required field'
  },
  play: async ({
    userEvent
  }) => {
    const input = screen.getByLabelText('Email');
    await userEvent.type(input, 'required@example.com');
  }
}`,...(wa=(va=P.parameters)==null?void 0:va.docs)==null?void 0:wa.source},description:{story:"Required field",...(ja=(Sa=P.parameters)==null?void 0:Sa.docs)==null?void 0:ja.description}}};var Ia,Ea,Ta,Ca,Pa;D.parameters={...D.parameters,docs:{...(Ia=D.parameters)==null?void 0:Ia.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    type: 'password',
    helperText: 'Must be at least 8 characters long'
  },
  play: async ({
    userEvent
  }) => {
    const input = screen.getByLabelText('Password');
    await userEvent.type(input, 'SecurePassword123');
  }
}`,...(Ta=(Ea=D.parameters)==null?void 0:Ea.docs)==null?void 0:Ta.source},description:{story:"Input with helper text",...(Pa=(Ca=D.parameters)==null?void 0:Ca.docs)==null?void 0:Pa.description}}};var Da,La,Na,za,Wa;L.parameters={...L.parameters,docs:{...(Da=L.parameters)==null?void 0:Da.docs,source:{originalSource:`{
  render: function ControlledInput() {
    const [value, setValue] = useState('');
    return <div>
        <Input label="Controlled Input" value={value} onChange={e => setValue(e.target.value)} placeholder="Type something..." />
        <p className="mt-2 text-muted small">Value: {value || '(empty)'}</p>
      </div>;
  },
  play: async ({
    userEvent
  }) => {
    const input = screen.getByPlaceholderText('Type something...');
    await userEvent.type(input, 'Controlled component');
  }
}`,...(Na=(La=L.parameters)==null?void 0:La.docs)==null?void 0:Na.source},description:{story:"Controlled input",...(Wa=(za=L.parameters)==null?void 0:za.docs)==null?void 0:Wa.description}}};var qa,Aa,Ma,Ba,ka;N.parameters={...N.parameters,docs:{...(qa=N.parameters)==null?void 0:qa.docs,source:{originalSource:`{
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
  },
  play: async ({
    userEvent
  }) => {
    const emailInputs = screen.getAllByDisplayValue('');
    const emailInput = emailInputs[0] as HTMLInputElement;
    const passwordInput = emailInputs[1] as HTMLInputElement;
    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'password123');
  }
}`,...(Ma=(Aa=N.parameters)==null?void 0:Aa.docs)==null?void 0:Ma.source},description:{story:"Login form example",...(ka=(Ba=N.parameters)==null?void 0:Ba.docs)==null?void 0:ka.description}}};var Va,Ra,Fa,Ha,Oa;z.parameters={...z.parameters,docs:{...(Va=z.parameters)==null?void 0:Va.docs,source:{originalSource:`{
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
}`,...(Fa=(Ra=z.parameters)==null?void 0:Ra.docs)==null?void 0:Fa.source},description:{story:"Registration form example",...(Oa=(Ha=z.parameters)==null?void 0:Ha.docs)==null?void 0:Oa.description}}};var Ua,Xa,_a,Ka,Ja;W.parameters={...W.parameters,docs:{...(Ua=W.parameters)==null?void 0:Ua.docs,source:{originalSource:`{
  render: function SearchInputExample() {
    const [query, setQuery] = useState('');
    const SearchIcon = (): React.JSX.Element => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
      </svg>;
    return <Input type="search" aria-label="Search" prefix={<SearchIcon />} placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} clearable onClear={() => setQuery('')} />;
  }
}`,...(_a=(Xa=W.parameters)==null?void 0:Xa.docs)==null?void 0:_a.source},description:{story:"Search input pattern",...(Ja=(Ka=W.parameters)==null?void 0:Ka.docs)==null?void 0:Ja.description}}};var Qa,$a,Ya,Ga,Za;q.parameters={...q.parameters,docs:{...(Qa=q.parameters)==null?void 0:Qa.docs,source:{originalSource:`{
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
          Event handlers like onLoad, onError, etc. are automatically filtered out to prevent XSS
          attacks.
        </p>
      </div>
    </div>
}`,...(Ya=($a=q.parameters)==null?void 0:$a.docs)==null?void 0:Ya.source},description:{story:`Security: Event Handler Validation

The Input component uses a whitelist of safe HTML attributes to prevent
dangerous event handlers from being injected via props. All dangerously
event handlers (onLoad, onError, etc.) are blocked at the input element level.

This protects against XSS vulnerabilities through prop spreading.`,...(Za=(Ga=q.parameters)==null?void 0:Ga.docs)==null?void 0:Za.description}}};var et,at,tt,rt,st;A.parameters={...A.parameters,docs:{...(et=A.parameters)==null?void 0:et.docs,source:{originalSource:`{
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
          <li>
            <CheckIcon size={14} className="text-success me-1" />
            Standard HTML attributes (name, value, disabled, required, etc.)
          </li>
          <li>
            <CheckIcon size={14} className="text-success me-1" />
            All ARIA attributes (aria-label, aria-describedby, etc.)
          </li>
          <li>
            <CheckIcon size={14} className="text-success me-1" />
            Input-specific attributes (autoComplete, tabIndex, etc.)
          </li>
          <li>
            <XLgIcon size={14} className="text-danger me-1" />
            All event handlers (onClick, onLoad, onError, etc.)
          </li>
          <li>
            <XLgIcon size={14} className="text-danger me-1" />
            Dangerous properties (innerHTML, dangerouslySetInnerHTML, etc.)
          </li>
        </ul>
      </div>
      <div>
        <Input label="Example: Safe and protected" name="security-demo" title="This input is protected against prop injection attacks" required />
      </div>
    </div>
}`,...(tt=(at=A.parameters)==null?void 0:at.docs)==null?void 0:tt.source},description:{story:`Security: Prop Whitelist Protection

Only explicitly whitelisted HTML attributes are allowed on the input element.
This prevents injection of dangerous attributes and event handlers through
the \`rest\` props parameter.`,...(st=(rt=A.parameters)==null?void 0:rt.docs)==null?void 0:st.description}}};var lt,nt,it,ot,ct;M.parameters={...M.parameters,docs:{...(lt=M.parameters)==null?void 0:lt.docs,source:{originalSource:`{
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
}`,...(it=(nt=M.parameters)==null?void 0:nt.docs)==null?void 0:it.source},description:{story:`Accessibility: Full Keyboard Support

The Input component provides full keyboard support for all interactions:
- Tab/Shift+Tab: Navigate to/from input
- Type: Enter text into input
- All states remain accessible: disabled, error, clearable`,...(ct=(ot=M.parameters)==null?void 0:ot.docs)==null?void 0:ct.description}}};var pt,dt,ut,mt,ht;B.parameters={...B.parameters,docs:{...(pt=B.parameters)==null?void 0:pt.docs,source:{originalSource:`{
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
}`,...(ut=(dt=B.parameters)==null?void 0:dt.docs)==null?void 0:ut.source},description:{story:"Accessibility: Screen Reader Support\n\nProper semantic markup and ARIA attributes ensure screen reader compatibility:\n- Native `<input>` element for full semantic meaning\n- `<label>` properly associated via `htmlFor`\n- `aria-describedby` links to helper text and error messages\n- `aria-invalid` indicates error state\n- Error/helper messages associated with `id`",...(ht=(mt=B.parameters)==null?void 0:mt.docs)==null?void 0:ht.description}}};var yt,xt,bt,ft,gt;k.parameters={...k.parameters,docs:{...(yt=k.parameters)==null?void 0:yt.docs,source:{originalSource:`{
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
            The inputs won't re-render unnecessarily when you increment the counter below. Check
            your browser DevTools to see component renders.
          </p>
        </div>

        <div>
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setCounter(counter + 1)}>
            Increment Counter: {counter}
          </button>
          <p className="text-muted small mt-2">Parent re-renders: {counter} times</p>
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
            <li>
              <CheckIcon size={14} className="text-success me-1" />
              Component wrapped with React.memo
            </li>
            <li>
              <CheckIcon size={14} className="text-success me-1" />
              Class names memoized with useMemo
            </li>
            <li>
              <CheckIcon size={14} className="text-success me-1" />
              Event handlers memoized with useCallback
            </li>
            <li>
              <CheckIcon size={14} className="text-success me-1" />
              Computed values cached for efficient rendering
            </li>
            <li>
              <CheckIcon size={14} className="text-success me-1" />
              Efficient re-render only when actual props change
            </li>
          </ul>
        </div>
      </div>;
  }
}`,...(bt=(xt=k.parameters)==null?void 0:xt.docs)==null?void 0:bt.source},description:{story:`Performance: Memoization

The Input component is optimized with React.memo and useMemo:
- React.memo prevents re-renders when parent props don't change
- useMemo caches computed class names
- useCallback memoizes event handlers
- Computed values (hasPrefix, hasSuffix, etc.) are memoized

This ensures efficient rendering in complex forms with many inputs.`,...(gt=(ft=k.parameters)==null?void 0:ft.docs)==null?void 0:gt.description}}};const Ct=["Default","WithoutLabel","InputTypes","Sizes","ValidationStates","ErrorState","Success","WithPrefix","WithSuffix","WithPrefixAndSuffix","WithIconPrefix","Clearable","CharacterCounter","CharacterCounterWithValue","FloatingLabel","FloatingLabels","Plaintext","Required","WithHelperText","Controlled","LoginForm","RegistrationForm","SearchInput","SecurityEventHandlerValidation","SecurityPropWhitelist","AccessibilityKeyboardNavigation","AccessibilityScreenReaderSupport","PerformanceMemoization"];export{M as AccessibilityKeyboardNavigation,B as AccessibilityScreenReaderSupport,j as CharacterCounter,I as CharacterCounterWithValue,S as Clearable,L as Controlled,d as Default,x as ErrorState,E as FloatingLabel,T as FloatingLabels,m as InputTypes,N as LoginForm,k as PerformanceMemoization,C as Plaintext,z as RegistrationForm,P as Required,W as SearchInput,q as SecurityEventHandlerValidation,A as SecurityPropWhitelist,h as Sizes,b as Success,y as ValidationStates,D as WithHelperText,w as WithIconPrefix,f as WithPrefix,v as WithPrefixAndSuffix,g as WithSuffix,u as WithoutLabel,Ct as __namedExportsOrder,Tt as default};
