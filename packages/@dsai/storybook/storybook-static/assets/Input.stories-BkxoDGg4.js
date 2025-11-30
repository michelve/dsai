import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{y as t,b as o,c as H}from"./Tabs-B7LjS1vO.js";import{r as i}from"./iframe-5yFzSrCk.js";import"./preload-helper-Dp1pzeXC.js";const{screen:l}=__STORYBOOK_MODULE_TEST__,za={title:"Components/Input",component:t,parameters:{layout:"padded",docs:{description:{component:"A flexible text input component built with Bootstrap 5 classes. Supports multiple types, sizes, validation states, and addons."}}},tags:["autodocs"],argTypes:{type:{control:"select",options:["text","email","password","number","tel","url","search"],description:"Input type",table:{type:{summary:"InputType"},defaultValue:{summary:"text"}}},size:{control:"select",options:["sm","md","lg"],description:"Input size",table:{type:{summary:"InputSize"},defaultValue:{summary:"md"}}},label:{control:"text",description:"Input label",table:{type:{summary:"ReactNode"}}},helperText:{control:"text",description:"Helper or error message",table:{type:{summary:"string"}}},error:{control:"boolean",description:"Error state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},success:{control:"boolean",description:"Success state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},disabled:{control:"boolean",description:"Disabled state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},readOnly:{control:"boolean",description:"Read-only state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},required:{control:"boolean",description:"Required field",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},clearable:{control:"boolean",description:"Show clear button",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},showCount:{control:"boolean",description:"Show character counter",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},floating:{control:"boolean",description:"Floating label style",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},plaintext:{control:"boolean",description:"Plaintext style",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}}},p={args:{label:"Email address",type:"email",placeholder:"Enter your email"},play:async({userEvent:r})=>{const a=l.getByLabelText("Email address");await r.type(a,"user@example.com")}},u={args:{"aria-label":"Search",placeholder:"Search...",type:"search"},play:async({userEvent:r})=>{const a=l.getByLabelText("Search");await r.type(a,"storybook")}},m={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:"400px"},children:[e.jsx(t,{label:"Text",type:"text",placeholder:"Enter text"}),e.jsx(t,{label:"Email",type:"email",placeholder:"name@example.com"}),e.jsx(t,{label:"Password",type:"password",placeholder:"Enter password"}),e.jsx(t,{label:"Number",type:"number",placeholder:"0"}),e.jsx(t,{label:"Phone",type:"tel",placeholder:"+1 (555) 123-4567"}),e.jsx(t,{label:"URL",type:"url",placeholder:"https://example.com"}),e.jsx(t,{label:"Search",type:"search",placeholder:"Search..."})]})},h={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:"400px"},children:[e.jsx(t,{label:"Small",size:"sm",placeholder:"Small input"}),e.jsx(t,{label:"Medium (default)",size:"md",placeholder:"Medium input"}),e.jsx(t,{label:"Large",size:"lg",placeholder:"Large input"})]})},x={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:"400px"},children:[e.jsx(t,{label:"Default",placeholder:"Default state"}),e.jsx(t,{label:"Error",error:!0,helperText:"This field is required"}),e.jsx(t,{label:"Success",success:!0,helperText:"Looks good!",defaultValue:"Valid input"}),e.jsx(t,{label:"Disabled",disabled:!0,placeholder:"Disabled input"}),e.jsx(t,{label:"Read Only",readOnly:!0,defaultValue:"Read-only value"})]})},y={args:{label:"Email",type:"email",error:!0,helperText:"Please enter a valid email address",defaultValue:"invalid-email"}},b={args:{label:"Username",success:!0,helperText:"Username is available",defaultValue:"johndoe"}},f={args:{label:"Price",type:"number",prefix:"$",placeholder:"0.00"},play:async({userEvent:r})=>{const a=l.getByLabelText("Price");await r.type(a,"99.99")}},g={args:{label:"Email",suffix:"@company.com",placeholder:"username"},play:async({userEvent:r})=>{const a=l.getByLabelText("Email");await r.type(a,"john.doe")}},v={args:{label:"Amount",type:"number",prefix:"$",suffix:".00",placeholder:"0"},play:async({userEvent:r})=>{const a=l.getByLabelText("Amount");await r.type(a,"150")}},w={render:()=>{const r=()=>e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",viewBox:"0 0 16 16",children:e.jsx("path",{d:"M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"})});return e.jsx(t,{label:"Search",type:"search",prefix:e.jsx(r,{}),placeholder:"Search..."})},play:async({userEvent:r})=>{const a=l.getByLabelText("Search");await r.type(a,"components")}},S={render:function(){const[a,s]=i.useState("Hello World");return e.jsx(t,{label:"Clearable Input",value:a,onChange:n=>s(n.target.value),clearable:!0,onClear:()=>s(""),helperText:"Click the X to clear"})},play:async({userEvent:r})=>{const a=l.getByRole("button");await r.click(a)}},j={args:{label:"Bio",maxLength:150,showCount:!0,helperText:"Brief description about yourself",placeholder:"Tell us about yourself..."},play:async({userEvent:r})=>{const a=l.getByPlaceholderText("Tell us about yourself...");await r.type(a,"I am a developer interested in design systems and component libraries.")}},I={args:{label:"Tweet",maxLength:280,showCount:!0,defaultValue:"Just shipped a new feature!"}},T={args:{label:"Email address",floating:!0,placeholder:"name@example.com",type:"email"},play:async({userEvent:r})=>{const a=l.getByPlaceholderText("name@example.com");await r.type(a,"user@example.com")}},E={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:"400px"},children:[e.jsx(t,{label:"Email address",floating:!0,placeholder:"name@example.com",type:"email"}),e.jsx(t,{label:"Password",floating:!0,placeholder:"Password",type:"password"}),e.jsx(t,{label:"Username",floating:!0,placeholder:"Username"})]})},C={args:{label:"Email",plaintext:!0,readOnly:!0,defaultValue:"email@example.com"}},P={args:{label:"Email",type:"email",required:!0,placeholder:"Required field"},play:async({userEvent:r})=>{const a=l.getByLabelText("Email");await r.type(a,"required@example.com")}},N={args:{label:"Password",type:"password",helperText:"Must be at least 8 characters long"},play:async({userEvent:r})=>{const a=l.getByLabelText("Password");await r.type(a,"SecurePassword123")}},D={render:function(){const[a,s]=i.useState("");return e.jsxs("div",{children:[e.jsx(t,{label:"Controlled Input",value:a,onChange:n=>s(n.target.value),placeholder:"Type something..."}),e.jsxs("p",{className:"mt-2 text-muted small",children:["Value: ",a||"(empty)"]})]})},play:async({userEvent:r})=>{const a=l.getByPlaceholderText("Type something...");await r.type(a,"Controlled component")}},L={render:function(){const[a,s]=i.useState(""),[n,F]=i.useState(""),[R,Ea]=i.useState({}),Ca=d=>{d.preventDefault();const c={};a?/\S+@\S+\.\S+/.test(a)||(c.email="Please enter a valid email"):c.email="Email is required",n?n.length<8&&(c.password="Password must be at least 8 characters"):c.password="Password is required",Ea(c),Object.keys(c).length===0&&alert("Form submitted successfully!")};return e.jsx("form",{onSubmit:Ca,style:{maxWidth:"400px"},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(t,{label:"Email",type:"email",value:a,onChange:d=>s(d.target.value),error:!!R.email,helperText:R.email,required:!0}),e.jsx(t,{label:"Password",type:"password",value:n,onChange:d=>F(d.target.value),error:!!R.password,helperText:R.password||"Must be at least 8 characters",required:!0}),e.jsx("button",{type:"submit",className:"btn btn-primary",children:"Sign In"})]})})},play:async({userEvent:r})=>{const a=l.getAllByDisplayValue(""),s=a[0],n=a[1];await r.type(s,"user@example.com"),await r.type(n,"password123")}},z={render:function(){return e.jsx("form",{style:{maxWidth:"400px"},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{style:{display:"flex",gap:"1rem"},children:[e.jsx(t,{label:"First Name",required:!0}),e.jsx(t,{label:"Last Name",required:!0})]}),e.jsx(t,{label:"Email",type:"email",required:!0}),e.jsx(t,{label:"Phone",type:"tel",helperText:"Optional"}),e.jsx(t,{label:"Password",type:"password",required:!0,helperText:"At least 8 characters with a number"}),e.jsx(t,{label:"Confirm Password",type:"password",required:!0}),e.jsx("button",{type:"submit",className:"btn btn-primary",children:"Create Account"})]})})}},A={render:function(){const[a,s]=i.useState(""),n=()=>e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",viewBox:"0 0 16 16",children:e.jsx("path",{d:"M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"})});return e.jsx(t,{type:"search","aria-label":"Search",prefix:e.jsx(n,{}),placeholder:"Search...",value:a,onChange:F=>s(F.target.value),clearable:!0,onClear:()=>s("")})}},W={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Focus State with data-focused Attribute"}),e.jsxs("p",{className:"text-muted small",children:["Click on the input below to see the focus state. The ",e.jsx("code",{children:"data-focused"})," attribute is set to ",e.jsx("code",{children:"true"})," when focused."]})]}),e.jsx(t,{label:"Focus me",placeholder:"Click to focus...",helperText:"Watch the data-focused attribute change"}),e.jsxs("div",{className:"alert alert-info small",children:[e.jsx("strong",{children:"Custom Focus Styling:"}),e.jsx("pre",{className:"mb-0 mt-2",children:`input[data-focused='true'] {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}`})]})]})},k={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Safe Attributes Allowed"}),e.jsx("p",{className:"text-muted small",children:"These standard form attributes are safely passed through:"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(t,{label:"With name attribute",name:"demo-1"}),e.jsx(t,{label:"With required",required:!0}),e.jsx(t,{label:"With title",title:"This is a tooltip"}),e.jsx(t,{label:"With aria-label","aria-label":"Custom accessible label"})]})]}),e.jsxs("div",{children:[e.jsx("h5",{children:"Dangerous Event Handlers Blocked"}),e.jsx("p",{className:"text-muted small",children:"Event handlers like onLoad, onError, etc. are automatically filtered out to prevent XSS attacks."})]})]})},q={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Protected Against Prop Injection"}),e.jsx("p",{className:"text-muted small",children:"Only safe HTML attributes are rendered to the DOM. Dangerous props are silently filtered."})]}),e.jsxs("div",{children:[e.jsx("h5",{children:"Whitelisted Categories"}),e.jsxs("ul",{className:"text-muted small",children:[e.jsxs("li",{children:[e.jsx(o,{size:14,className:"text-success me-1"}),"Standard HTML attributes (name, value, disabled, required, etc.)"]}),e.jsxs("li",{children:[e.jsx(o,{size:14,className:"text-success me-1"}),"All ARIA attributes (aria-label, aria-describedby, etc.)"]}),e.jsxs("li",{children:[e.jsx(o,{size:14,className:"text-success me-1"}),"Input-specific attributes (autoComplete, tabIndex, etc.)"]}),e.jsxs("li",{children:[e.jsx(H,{size:14,className:"text-danger me-1"}),"All event handlers (onClick, onLoad, onError, etc.)"]}),e.jsxs("li",{children:[e.jsx(H,{size:14,className:"text-danger me-1"}),"Dangerous properties (innerHTML, dangerouslySetInnerHTML, etc.)"]})]})]}),e.jsx("div",{children:e.jsx(t,{label:"Example: Safe and protected",name:"security-demo",title:"This input is protected against prop injection attacks",required:!0})})]})},M={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Keyboard Navigation Demo"}),e.jsx("p",{className:"text-muted small",children:"Use Tab to navigate and type to enter text. All inputs have proper keyboard support."})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(t,{label:"Focus here and type"}),e.jsx(t,{label:"Second input"}),e.jsx(t,{label:"With error",error:!0,helperText:"Also fully keyboard accessible"}),e.jsx(t,{label:"Disabled input (not in tab order)",disabled:!0})]})]})},B={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Screen Reader Friendly"}),e.jsx("p",{className:"text-muted small",children:"Semantic HTML and ARIA attributes provide full accessibility."})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(t,{label:"Basic input"}),e.jsx(t,{label:"Required field",required:!0}),e.jsx(t,{label:"With helper text",helperText:"This field helps you understand context"}),e.jsx(t,{label:"With error",error:!0,helperText:"This field is required and has an error"}),e.jsx(t,{"aria-label":"Input without visible label"})]})]})},V={render:function(){const[a,s]=i.useState(0);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Memoization Performance Demo"}),e.jsx("p",{className:"text-muted small",children:"The inputs won't re-render unnecessarily when you increment the counter below. Check your browser DevTools to see component renders."})]}),e.jsxs("div",{children:[e.jsxs("button",{type:"button",className:"btn btn-sm btn-outline-primary",onClick:()=>s(a+1),children:["Increment Counter: ",a]}),e.jsxs("p",{className:"text-muted small mt-2",children:["Parent re-renders: ",a," times"]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(t,{label:"Memoized input 1",placeholder:"Stays efficient"}),e.jsx(t,{label:"Memoized input 2",placeholder:"No unnecessary renders"}),e.jsx(t,{label:"With performance optimizations",helperText:"All class names and event handlers are memoized"})]}),e.jsxs("div",{className:"alert alert-info small",children:[e.jsx("strong",{children:"Performance Benefits:"}),e.jsxs("ul",{className:"mb-0 mt-2",children:[e.jsxs("li",{children:[e.jsx(o,{size:14,className:"text-success me-1"}),"Component wrapped with React.memo"]}),e.jsxs("li",{children:[e.jsx(o,{size:14,className:"text-success me-1"}),"Class names memoized with useMemo"]}),e.jsxs("li",{children:[e.jsx(o,{size:14,className:"text-success me-1"}),"Event handlers memoized with useCallback"]}),e.jsxs("li",{children:[e.jsx(o,{size:14,className:"text-success me-1"}),"Computed values cached for efficient rendering"]}),e.jsxs("li",{children:[e.jsx(o,{size:14,className:"text-success me-1"}),"Efficient re-render only when actual props change"]})]})]})]})}};var O,U,X,_,K;p.parameters={...p.parameters,docs:{...(O=p.parameters)==null?void 0:O.docs,source:{originalSource:`{
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
}`,...(X=(U=p.parameters)==null?void 0:U.docs)==null?void 0:X.source},description:{story:"Default text input with label",...(K=(_=p.parameters)==null?void 0:_.docs)==null?void 0:K.description}}};var J,Q,$,Y,G;u.parameters={...u.parameters,docs:{...(J=u.parameters)==null?void 0:J.docs,source:{originalSource:`{
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
}`,...($=(Q=u.parameters)==null?void 0:Q.docs)==null?void 0:$.source},description:{story:"Input without label (uses aria-label)",...(G=(Y=u.parameters)==null?void 0:Y.docs)==null?void 0:G.description}}};var Z,ee,te,ae,re;m.parameters={...m.parameters,docs:{...(Z=m.parameters)==null?void 0:Z.docs,source:{originalSource:`{
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
}`,...(te=(ee=m.parameters)==null?void 0:ee.docs)==null?void 0:te.source},description:{story:"All input types",...(re=(ae=m.parameters)==null?void 0:ae.docs)==null?void 0:re.description}}};var se,le,ne,oe,ie;h.parameters={...h.parameters,docs:{...(se=h.parameters)==null?void 0:se.docs,source:{originalSource:`{
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
}`,...(ne=(le=h.parameters)==null?void 0:le.docs)==null?void 0:ne.source},description:{story:"Input sizes",...(ie=(oe=h.parameters)==null?void 0:oe.docs)==null?void 0:ie.description}}};var ce,de,pe,ue,me;x.parameters={...x.parameters,docs:{...(ce=x.parameters)==null?void 0:ce.docs,source:{originalSource:`{
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
}`,...(pe=(de=x.parameters)==null?void 0:de.docs)==null?void 0:pe.source},description:{story:"Validation states",...(me=(ue=x.parameters)==null?void 0:ue.docs)==null?void 0:me.description}}};var he,xe,ye,be,fe;y.parameters={...y.parameters,docs:{...(he=y.parameters)==null?void 0:he.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    type: 'email',
    error: true,
    helperText: 'Please enter a valid email address',
    defaultValue: 'invalid-email'
  }
}`,...(ye=(xe=y.parameters)==null?void 0:xe.docs)==null?void 0:ye.source},description:{story:"Error state with message",...(fe=(be=y.parameters)==null?void 0:be.docs)==null?void 0:fe.description}}};var ge,ve,we,Se,je;b.parameters={...b.parameters,docs:{...(ge=b.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  args: {
    label: 'Username',
    success: true,
    helperText: 'Username is available',
    defaultValue: 'johndoe'
  }
}`,...(we=(ve=b.parameters)==null?void 0:ve.docs)==null?void 0:we.source},description:{story:"Success state",...(je=(Se=b.parameters)==null?void 0:Se.docs)==null?void 0:je.description}}};var Ie,Te,Ee,Ce,Pe;f.parameters={...f.parameters,docs:{...(Ie=f.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
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
}`,...(Ee=(Te=f.parameters)==null?void 0:Te.docs)==null?void 0:Ee.source},description:{story:"Input with prefix",...(Pe=(Ce=f.parameters)==null?void 0:Ce.docs)==null?void 0:Pe.description}}};var Ne,De,Le,ze,Ae;g.parameters={...g.parameters,docs:{...(Ne=g.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
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
}`,...(Le=(De=g.parameters)==null?void 0:De.docs)==null?void 0:Le.source},description:{story:"Input with suffix",...(Ae=(ze=g.parameters)==null?void 0:ze.docs)==null?void 0:Ae.description}}};var We,ke,qe,Me,Be;v.parameters={...v.parameters,docs:{...(We=v.parameters)==null?void 0:We.docs,source:{originalSource:`{
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
}`,...(qe=(ke=v.parameters)==null?void 0:ke.docs)==null?void 0:qe.source},description:{story:"Input with both prefix and suffix",...(Be=(Me=v.parameters)==null?void 0:Me.docs)==null?void 0:Be.description}}};var Ve,Re,Fe,He,Oe;w.parameters={...w.parameters,docs:{...(Ve=w.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
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
}`,...(Fe=(Re=w.parameters)==null?void 0:Re.docs)==null?void 0:Fe.source},description:{story:"Input with icon prefix",...(Oe=(He=w.parameters)==null?void 0:He.docs)==null?void 0:Oe.description}}};var Ue,Xe,_e,Ke,Je;S.parameters={...S.parameters,docs:{...(Ue=S.parameters)==null?void 0:Ue.docs,source:{originalSource:`{
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
}`,...(_e=(Xe=S.parameters)==null?void 0:Xe.docs)==null?void 0:_e.source},description:{story:"Clearable input",...(Je=(Ke=S.parameters)==null?void 0:Ke.docs)==null?void 0:Je.description}}};var Qe,$e,Ye,Ge,Ze;j.parameters={...j.parameters,docs:{...(Qe=j.parameters)==null?void 0:Qe.docs,source:{originalSource:`{
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
}`,...(Ye=($e=j.parameters)==null?void 0:$e.docs)==null?void 0:Ye.source},description:{story:"Input with character counter",...(Ze=(Ge=j.parameters)==null?void 0:Ge.docs)==null?void 0:Ze.description}}};var et,tt,at,rt,st;I.parameters={...I.parameters,docs:{...(et=I.parameters)==null?void 0:et.docs,source:{originalSource:`{
  args: {
    label: 'Tweet',
    maxLength: 280,
    showCount: true,
    defaultValue: 'Just shipped a new feature!'
  }
}`,...(at=(tt=I.parameters)==null?void 0:tt.docs)==null?void 0:at.source},description:{story:"Character counter with initial value",...(st=(rt=I.parameters)==null?void 0:rt.docs)==null?void 0:st.description}}};var lt,nt,ot,it,ct;T.parameters={...T.parameters,docs:{...(lt=T.parameters)==null?void 0:lt.docs,source:{originalSource:`{
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
}`,...(ot=(nt=T.parameters)==null?void 0:nt.docs)==null?void 0:ot.source},description:{story:"Floating label input",...(ct=(it=T.parameters)==null?void 0:it.docs)==null?void 0:ct.description}}};var dt,pt,ut,mt,ht;E.parameters={...E.parameters,docs:{...(dt=E.parameters)==null?void 0:dt.docs,source:{originalSource:`{
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
}`,...(ut=(pt=E.parameters)==null?void 0:pt.docs)==null?void 0:ut.source},description:{story:"Floating labels showcase",...(ht=(mt=E.parameters)==null?void 0:mt.docs)==null?void 0:ht.description}}};var xt,yt,bt,ft,gt;C.parameters={...C.parameters,docs:{...(xt=C.parameters)==null?void 0:xt.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    plaintext: true,
    readOnly: true,
    defaultValue: 'email@example.com'
  }
}`,...(bt=(yt=C.parameters)==null?void 0:yt.docs)==null?void 0:bt.source},description:{story:"Plaintext readonly input",...(gt=(ft=C.parameters)==null?void 0:ft.docs)==null?void 0:gt.description}}};var vt,wt,St,jt,It;P.parameters={...P.parameters,docs:{...(vt=P.parameters)==null?void 0:vt.docs,source:{originalSource:`{
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
}`,...(St=(wt=P.parameters)==null?void 0:wt.docs)==null?void 0:St.source},description:{story:"Required field",...(It=(jt=P.parameters)==null?void 0:jt.docs)==null?void 0:It.description}}};var Tt,Et,Ct,Pt,Nt;N.parameters={...N.parameters,docs:{...(Tt=N.parameters)==null?void 0:Tt.docs,source:{originalSource:`{
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
}`,...(Ct=(Et=N.parameters)==null?void 0:Et.docs)==null?void 0:Ct.source},description:{story:"Input with helper text",...(Nt=(Pt=N.parameters)==null?void 0:Pt.docs)==null?void 0:Nt.description}}};var Dt,Lt,zt,At,Wt;D.parameters={...D.parameters,docs:{...(Dt=D.parameters)==null?void 0:Dt.docs,source:{originalSource:`{
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
}`,...(zt=(Lt=D.parameters)==null?void 0:Lt.docs)==null?void 0:zt.source},description:{story:"Controlled input",...(Wt=(At=D.parameters)==null?void 0:At.docs)==null?void 0:Wt.description}}};var kt,qt,Mt,Bt,Vt;L.parameters={...L.parameters,docs:{...(kt=L.parameters)==null?void 0:kt.docs,source:{originalSource:`{
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
}`,...(Mt=(qt=L.parameters)==null?void 0:qt.docs)==null?void 0:Mt.source},description:{story:"Login form example",...(Vt=(Bt=L.parameters)==null?void 0:Bt.docs)==null?void 0:Vt.description}}};var Rt,Ft,Ht,Ot,Ut;z.parameters={...z.parameters,docs:{...(Rt=z.parameters)==null?void 0:Rt.docs,source:{originalSource:`{
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
}`,...(Ht=(Ft=z.parameters)==null?void 0:Ft.docs)==null?void 0:Ht.source},description:{story:"Registration form example",...(Ut=(Ot=z.parameters)==null?void 0:Ot.docs)==null?void 0:Ut.description}}};var Xt,_t,Kt,Jt,Qt;A.parameters={...A.parameters,docs:{...(Xt=A.parameters)==null?void 0:Xt.docs,source:{originalSource:`{
  render: function SearchInputExample() {
    const [query, setQuery] = useState('');
    const SearchIcon = (): React.JSX.Element => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
      </svg>;
    return <Input type="search" aria-label="Search" prefix={<SearchIcon />} placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} clearable onClear={() => setQuery('')} />;
  }
}`,...(Kt=(_t=A.parameters)==null?void 0:_t.docs)==null?void 0:Kt.source},description:{story:"Search input pattern",...(Qt=(Jt=A.parameters)==null?void 0:Jt.docs)==null?void 0:Qt.description}}};var $t,Yt,Gt,Zt,ea;W.parameters={...W.parameters,docs:{...($t=W.parameters)==null?void 0:$t.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <div>
        <h5>Focus State with data-focused Attribute</h5>
        <p className="text-muted small">
          Click on the input below to see the focus state. The <code>data-focused</code> attribute
          is set to <code>true</code> when focused.
        </p>
      </div>
      <Input label="Focus me" placeholder="Click to focus..." helperText="Watch the data-focused attribute change" />
      <div className="alert alert-info small">
        <strong>Custom Focus Styling:</strong>
        <pre className="mb-0 mt-2">
          {\`input[data-focused='true'] {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}\`}
        </pre>
      </div>
    </div>
}`,...(Gt=(Yt=W.parameters)==null?void 0:Yt.docs)==null?void 0:Gt.source},description:{story:`Focus State: data-focused Attribute

The Input component exposes a \`data-focused\` attribute on the input element
when it has focus. This enables custom CSS styling for focus states beyond
the default browser outline.

The attribute is:
- \`data-focused="true"\` when the input is focused
- Removed (undefined) when the input loses focus`,...(ea=(Zt=W.parameters)==null?void 0:Zt.docs)==null?void 0:ea.description}}};var ta,aa,ra,sa,la;k.parameters={...k.parameters,docs:{...(ta=k.parameters)==null?void 0:ta.docs,source:{originalSource:`{
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
}`,...(ra=(aa=k.parameters)==null?void 0:aa.docs)==null?void 0:ra.source},description:{story:`Security: Event Handler Validation

The Input component uses a whitelist of safe HTML attributes to prevent
dangerous event handlers from being injected via props. All dangerously
event handlers (onLoad, onError, etc.) are blocked at the input element level.

This protects against XSS vulnerabilities through prop spreading.`,...(la=(sa=k.parameters)==null?void 0:sa.docs)==null?void 0:la.description}}};var na,oa,ia,ca,da;q.parameters={...q.parameters,docs:{...(na=q.parameters)==null?void 0:na.docs,source:{originalSource:`{
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
}`,...(ia=(oa=q.parameters)==null?void 0:oa.docs)==null?void 0:ia.source},description:{story:`Security: Prop Whitelist Protection

Only explicitly whitelisted HTML attributes are allowed on the input element.
This prevents injection of dangerous attributes and event handlers through
the \`rest\` props parameter.`,...(da=(ca=q.parameters)==null?void 0:ca.docs)==null?void 0:da.description}}};var pa,ua,ma,ha,xa;M.parameters={...M.parameters,docs:{...(pa=M.parameters)==null?void 0:pa.docs,source:{originalSource:`{
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
}`,...(ma=(ua=M.parameters)==null?void 0:ua.docs)==null?void 0:ma.source},description:{story:`Accessibility: Full Keyboard Support

The Input component provides full keyboard support for all interactions:
- Tab/Shift+Tab: Navigate to/from input
- Type: Enter text into input
- All states remain accessible: disabled, error, clearable`,...(xa=(ha=M.parameters)==null?void 0:ha.docs)==null?void 0:xa.description}}};var ya,ba,fa,ga,va;B.parameters={...B.parameters,docs:{...(ya=B.parameters)==null?void 0:ya.docs,source:{originalSource:`{
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
}`,...(fa=(ba=B.parameters)==null?void 0:ba.docs)==null?void 0:fa.source},description:{story:"Accessibility: Screen Reader Support\n\nProper semantic markup and ARIA attributes ensure screen reader compatibility:\n- Native `<input>` element for full semantic meaning\n- `<label>` properly associated via `htmlFor`\n- `aria-describedby` links to helper text and error messages\n- `aria-invalid` indicates error state\n- Error/helper messages associated with `id`",...(va=(ga=B.parameters)==null?void 0:ga.docs)==null?void 0:va.description}}};var wa,Sa,ja,Ia,Ta;V.parameters={...V.parameters,docs:{...(wa=V.parameters)==null?void 0:wa.docs,source:{originalSource:`{
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
}`,...(ja=(Sa=V.parameters)==null?void 0:Sa.docs)==null?void 0:ja.source},description:{story:`Performance: Memoization

The Input component is optimized with React.memo and useMemo:
- React.memo prevents re-renders when parent props don't change
- useMemo caches computed class names
- useCallback memoizes event handlers
- Computed values (hasPrefix, hasSuffix, etc.) are memoized

This ensures efficient rendering in complex forms with many inputs.`,...(Ta=(Ia=V.parameters)==null?void 0:Ia.docs)==null?void 0:Ta.description}}};const Aa=["Default","WithoutLabel","InputTypes","Sizes","ValidationStates","ErrorState","Success","WithPrefix","WithSuffix","WithPrefixAndSuffix","WithIconPrefix","Clearable","CharacterCounter","CharacterCounterWithValue","FloatingLabel","FloatingLabels","Plaintext","Required","WithHelperText","Controlled","LoginForm","RegistrationForm","SearchInput","FocusState","SecurityEventHandlerValidation","SecurityPropWhitelist","AccessibilityKeyboardNavigation","AccessibilityScreenReaderSupport","PerformanceMemoization"];export{M as AccessibilityKeyboardNavigation,B as AccessibilityScreenReaderSupport,j as CharacterCounter,I as CharacterCounterWithValue,S as Clearable,D as Controlled,p as Default,y as ErrorState,T as FloatingLabel,E as FloatingLabels,W as FocusState,m as InputTypes,L as LoginForm,V as PerformanceMemoization,C as Plaintext,z as RegistrationForm,P as Required,A as SearchInput,k as SecurityEventHandlerValidation,q as SecurityPropWhitelist,h as Sizes,b as Success,x as ValidationStates,N as WithHelperText,w as WithIconPrefix,f as WithPrefix,v as WithPrefixAndSuffix,g as WithSuffix,u as WithoutLabel,Aa as __namedExportsOrder,za as default};
