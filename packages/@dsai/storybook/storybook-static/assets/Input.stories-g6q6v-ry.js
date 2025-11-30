import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{y as a,b as i,c as O}from"./Tabs-DTVVglNe.js";import{r as c}from"./iframe-CgsZvN4H.js";import"./preload-helper-Dp1pzeXC.js";const{userEvent:l,within:n}=__STORYBOOK_MODULE_TEST__,At={title:"Components/Input",component:a,parameters:{layout:"padded",docs:{description:{component:"A flexible text input component built with Bootstrap 5 classes. Supports multiple types, sizes, validation states, and addons."}}},tags:["autodocs"],argTypes:{type:{control:"select",options:["text","email","password","number","tel","url","search"],description:"Input type",table:{type:{summary:"InputType"},defaultValue:{summary:"text"}}},size:{control:"select",options:["sm","md","lg"],description:"Input size",table:{type:{summary:"InputSize"},defaultValue:{summary:"md"}}},label:{control:"text",description:"Input label",table:{type:{summary:"ReactNode"}}},helperText:{control:"text",description:"Helper or error message",table:{type:{summary:"string"}}},error:{control:"boolean",description:"Error state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},success:{control:"boolean",description:"Success state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},disabled:{control:"boolean",description:"Disabled state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},readOnly:{control:"boolean",description:"Read-only state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},required:{control:"boolean",description:"Required field",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},clearable:{control:"boolean",description:"Show clear button",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},showCount:{control:"boolean",description:"Show character counter",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},floating:{control:"boolean",description:"Floating label style",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},plaintext:{control:"boolean",description:"Plaintext style",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}}},m={args:{label:"Email address",type:"email",placeholder:"Enter your email"},play:async({canvasElement:s})=>{const t=n(s).getByLabelText("Email address");await l.type(t,"user@example.com")}},h={args:{"aria-label":"Search",placeholder:"Search...",type:"search"},play:async({canvasElement:s})=>{const t=n(s).getByLabelText("Search");await l.type(t,"storybook")}},x={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:"400px"},children:[e.jsx(a,{label:"Text",type:"text",placeholder:"Enter text"}),e.jsx(a,{label:"Email",type:"email",placeholder:"name@example.com"}),e.jsx(a,{label:"Password",type:"password",placeholder:"Enter password"}),e.jsx(a,{label:"Number",type:"number",placeholder:"0"}),e.jsx(a,{label:"Phone",type:"tel",placeholder:"+1 (555) 123-4567"}),e.jsx(a,{label:"URL",type:"url",placeholder:"https://example.com"}),e.jsx(a,{label:"Search",type:"search",placeholder:"Search..."})]})},y={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:"400px"},children:[e.jsx(a,{label:"Small",size:"sm",placeholder:"Small input"}),e.jsx(a,{label:"Medium (default)",size:"md",placeholder:"Medium input"}),e.jsx(a,{label:"Large",size:"lg",placeholder:"Large input"})]})},b={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:"400px"},children:[e.jsx(a,{label:"Default",placeholder:"Default state"}),e.jsx(a,{label:"Error",error:!0,helperText:"This field is required"}),e.jsx(a,{label:"Success",success:!0,helperText:"Looks good!",defaultValue:"Valid input"}),e.jsx(a,{label:"Disabled",disabled:!0,placeholder:"Disabled input"}),e.jsx(a,{label:"Read Only",readOnly:!0,defaultValue:"Read-only value"})]})},f={args:{label:"Email",type:"email",error:!0,helperText:"Please enter a valid email address",defaultValue:"invalid-email"}},v={args:{label:"Username",success:!0,helperText:"Username is available",defaultValue:"johndoe"}},g={args:{label:"Price",type:"number",prefix:"$",placeholder:"0.00"},play:async({canvasElement:s})=>{const t=n(s).getByLabelText("Price");await l.type(t,"99.99")}},w={args:{label:"Email",suffix:"@company.com",placeholder:"username"},play:async({canvasElement:s})=>{const t=n(s).getByLabelText("Email");await l.type(t,"john.doe")}},S={args:{label:"Amount",type:"number",prefix:"$",suffix:".00",placeholder:"0"},play:async({canvasElement:s})=>{const t=n(s).getByLabelText("Amount");await l.type(t,"150")}},j={render:()=>{const s=()=>e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",viewBox:"0 0 16 16",children:e.jsx("path",{d:"M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"})});return e.jsx(a,{label:"Search",type:"search",prefix:e.jsx(s,{}),placeholder:"Search..."})},play:async({canvasElement:s})=>{const t=n(s).getByLabelText("Search");await l.type(t,"components")}},I={render:function(){const[r,t]=c.useState("Hello World");return e.jsx(a,{label:"Clearable Input",value:r,onChange:o=>t(o.target.value),clearable:!0,onClear:()=>t(""),helperText:"Click the X to clear"})},play:async({canvasElement:s})=>{const t=n(s).getByRole("button");await l.click(t)}},E={args:{label:"Bio",maxLength:150,showCount:!0,helperText:"Brief description about yourself",placeholder:"Tell us about yourself..."},play:async({canvasElement:s})=>{const t=n(s).getByPlaceholderText("Tell us about yourself...");await l.type(t,"I am a developer interested in design systems and component libraries.")}},T={args:{label:"Tweet",maxLength:280,showCount:!0,defaultValue:"Just shipped a new feature!"}},C={args:{label:"Email address",floating:!0,placeholder:"name@example.com",type:"email"},play:async({canvasElement:s})=>{const t=n(s).getByPlaceholderText("name@example.com");await l.type(t,"user@example.com")}},P={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:"400px"},children:[e.jsx(a,{label:"Email address",floating:!0,placeholder:"name@example.com",type:"email"}),e.jsx(a,{label:"Password",floating:!0,placeholder:"Password",type:"password"}),e.jsx(a,{label:"Username",floating:!0,placeholder:"Username"})]})},N={args:{label:"Email",plaintext:!0,readOnly:!0,defaultValue:"email@example.com"}},D={args:{label:"Email",type:"email",required:!0,placeholder:"Required field"},play:async({canvasElement:s})=>{const t=n(s).getByLabelText(/Email/i);await l.type(t,"required@example.com")}},L={args:{label:"Password",type:"password",helperText:"Must be at least 8 characters long"},play:async({canvasElement:s})=>{const t=n(s).getByLabelText("Password");await l.type(t,"SecurePassword123")}},z={render:function(){const[r,t]=c.useState("");return e.jsxs("div",{children:[e.jsx(a,{label:"Controlled Input",value:r,onChange:o=>t(o.target.value),placeholder:"Type something..."}),e.jsxs("p",{className:"mt-2 text-muted small",children:["Value: ",r||"(empty)"]})]})},play:async({canvasElement:s})=>{const t=n(s).getByPlaceholderText("Type something...");await l.type(t,"Controlled component")}},A={render:function(){const[r,t]=c.useState(""),[o,p]=c.useState(""),[H,Ct]=c.useState({}),Pt=u=>{u.preventDefault();const d={};r?/\S+@\S+\.\S+/.test(r)||(d.email="Please enter a valid email"):d.email="Email is required",o?o.length<8&&(d.password="Password must be at least 8 characters"):d.password="Password is required",Ct(d),Object.keys(d).length===0&&alert("Form submitted successfully!")};return e.jsx("form",{onSubmit:Pt,style:{maxWidth:"400px"},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(a,{label:"Email",type:"email",value:r,onChange:u=>t(u.target.value),error:!!H.email,helperText:H.email,required:!0}),e.jsx(a,{label:"Password",type:"password",value:o,onChange:u=>p(u.target.value),error:!!H.password,helperText:H.password||"Must be at least 8 characters",required:!0}),e.jsx("button",{type:"submit",className:"btn btn-primary",children:"Sign In"})]})})},play:async({canvasElement:s})=>{const t=n(s).getAllByDisplayValue(""),o=t[0],p=t[1];await l.type(o,"user@example.com"),await l.type(p,"password123")}},W={render:function(){return e.jsx("form",{style:{maxWidth:"400px"},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{style:{display:"flex",gap:"1rem"},children:[e.jsx(a,{label:"First Name",required:!0}),e.jsx(a,{label:"Last Name",required:!0})]}),e.jsx(a,{label:"Email",type:"email",required:!0}),e.jsx(a,{label:"Phone",type:"tel",helperText:"Optional"}),e.jsx(a,{label:"Password",type:"password",required:!0,helperText:"At least 8 characters with a number"}),e.jsx(a,{label:"Confirm Password",type:"password",required:!0}),e.jsx("button",{type:"submit",className:"btn btn-primary",children:"Create Account"})]})})}},k={render:function(){const[r,t]=c.useState(""),o=()=>e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",viewBox:"0 0 16 16",children:e.jsx("path",{d:"M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"})});return e.jsx(a,{type:"search","aria-label":"Search",prefix:e.jsx(o,{}),placeholder:"Search...",value:r,onChange:p=>t(p.target.value),clearable:!0,onClear:()=>t("")})}},q={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Focus State with data-focused Attribute"}),e.jsxs("p",{className:"text-muted small",children:["Click on the input below to see the focus state. The ",e.jsx("code",{children:"data-focused"})," attribute is set to ",e.jsx("code",{children:"true"})," when focused."]})]}),e.jsx(a,{label:"Focus me",placeholder:"Click to focus...",helperText:"Watch the data-focused attribute change"}),e.jsxs("div",{className:"alert alert-info small",children:[e.jsx("strong",{children:"Custom Focus Styling:"}),e.jsx("pre",{className:"mb-0 mt-2",children:`input[data-focused='true'] {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}`})]})]})},M={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Safe Attributes Allowed"}),e.jsx("p",{className:"text-muted small",children:"These standard form attributes are safely passed through:"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(a,{label:"With name attribute",name:"demo-1"}),e.jsx(a,{label:"With required",required:!0}),e.jsx(a,{label:"With title",title:"This is a tooltip"}),e.jsx(a,{label:"With aria-label","aria-label":"Custom accessible label"})]})]}),e.jsxs("div",{children:[e.jsx("h5",{children:"Dangerous Event Handlers Blocked"}),e.jsx("p",{className:"text-muted small",children:"Event handlers like onLoad, onError, etc. are automatically filtered out to prevent XSS attacks."})]})]})},B={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Protected Against Prop Injection"}),e.jsx("p",{className:"text-muted small",children:"Only safe HTML attributes are rendered to the DOM. Dangerous props are silently filtered."})]}),e.jsxs("div",{children:[e.jsx("h5",{children:"Whitelisted Categories"}),e.jsxs("ul",{className:"text-muted small",children:[e.jsxs("li",{children:[e.jsx(i,{size:14,className:"text-success me-1"}),"Standard HTML attributes (name, value, disabled, required, etc.)"]}),e.jsxs("li",{children:[e.jsx(i,{size:14,className:"text-success me-1"}),"All ARIA attributes (aria-label, aria-describedby, etc.)"]}),e.jsxs("li",{children:[e.jsx(i,{size:14,className:"text-success me-1"}),"Input-specific attributes (autoComplete, tabIndex, etc.)"]}),e.jsxs("li",{children:[e.jsx(O,{size:14,className:"text-danger me-1"}),"All event handlers (onClick, onLoad, onError, etc.)"]}),e.jsxs("li",{children:[e.jsx(O,{size:14,className:"text-danger me-1"}),"Dangerous properties (innerHTML, dangerouslySetInnerHTML, etc.)"]})]})]}),e.jsx("div",{children:e.jsx(a,{label:"Example: Safe and protected",name:"security-demo",title:"This input is protected against prop injection attacks",required:!0})})]})},V={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Keyboard Navigation Demo"}),e.jsx("p",{className:"text-muted small",children:"Use Tab to navigate and type to enter text. All inputs have proper keyboard support."})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(a,{label:"Focus here and type"}),e.jsx(a,{label:"Second input"}),e.jsx(a,{label:"With error",error:!0,helperText:"Also fully keyboard accessible"}),e.jsx(a,{label:"Disabled input (not in tab order)",disabled:!0})]})]})},R={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Screen Reader Friendly"}),e.jsx("p",{className:"text-muted small",children:"Semantic HTML and ARIA attributes provide full accessibility."})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(a,{label:"Basic input"}),e.jsx(a,{label:"Required field",required:!0}),e.jsx(a,{label:"With helper text",helperText:"This field helps you understand context"}),e.jsx(a,{label:"With error",error:!0,helperText:"This field is required and has an error"}),e.jsx(a,{"aria-label":"Input without visible label"})]})]})},F={render:function(){const[r,t]=c.useState(0);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Memoization Performance Demo"}),e.jsx("p",{className:"text-muted small",children:"The inputs won't re-render unnecessarily when you increment the counter below. Check your browser DevTools to see component renders."})]}),e.jsxs("div",{children:[e.jsxs("button",{type:"button",className:"btn btn-sm btn-outline-primary",onClick:()=>t(r+1),children:["Increment Counter: ",r]}),e.jsxs("p",{className:"text-muted small mt-2",children:["Parent re-renders: ",r," times"]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(a,{label:"Memoized input 1",placeholder:"Stays efficient"}),e.jsx(a,{label:"Memoized input 2",placeholder:"No unnecessary renders"}),e.jsx(a,{label:"With performance optimizations",helperText:"All class names and event handlers are memoized"})]}),e.jsxs("div",{className:"alert alert-info small",children:[e.jsx("strong",{children:"Performance Benefits:"}),e.jsxs("ul",{className:"mb-0 mt-2",children:[e.jsxs("li",{children:[e.jsx(i,{size:14,className:"text-success me-1"}),"Component wrapped with React.memo"]}),e.jsxs("li",{children:[e.jsx(i,{size:14,className:"text-success me-1"}),"Class names memoized with useMemo"]}),e.jsxs("li",{children:[e.jsx(i,{size:14,className:"text-success me-1"}),"Event handlers memoized with useCallback"]}),e.jsxs("li",{children:[e.jsx(i,{size:14,className:"text-success me-1"}),"Computed values cached for efficient rendering"]}),e.jsxs("li",{children:[e.jsx(i,{size:14,className:"text-success me-1"}),"Efficient re-render only when actual props change"]})]})]})]})}};var U,X,_,K,J;m.parameters={...m.parameters,docs:{...(U=m.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    label: 'Email address',
    type: 'email',
    placeholder: 'Enter your email'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Email address');
    await userEvent.type(input, 'user@example.com');
  }
}`,...(_=(X=m.parameters)==null?void 0:X.docs)==null?void 0:_.source},description:{story:"Default text input with label",...(J=(K=m.parameters)==null?void 0:K.docs)==null?void 0:J.description}}};var Q,$,Y,G,Z;h.parameters={...h.parameters,docs:{...(Q=h.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Search',
    placeholder: 'Search...',
    type: 'search'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Search');
    await userEvent.type(input, 'storybook');
  }
}`,...(Y=($=h.parameters)==null?void 0:$.docs)==null?void 0:Y.source},description:{story:"Input without label (uses aria-label)",...(Z=(G=h.parameters)==null?void 0:G.docs)==null?void 0:Z.description}}};var ee,ae,te,se,re;x.parameters={...x.parameters,docs:{...(ee=x.parameters)==null?void 0:ee.docs,source:{originalSource:`{
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
}`,...(te=(ae=x.parameters)==null?void 0:ae.docs)==null?void 0:te.source},description:{story:"All input types",...(re=(se=x.parameters)==null?void 0:se.docs)==null?void 0:re.description}}};var le,ne,oe,ie,ce;y.parameters={...y.parameters,docs:{...(le=y.parameters)==null?void 0:le.docs,source:{originalSource:`{
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
}`,...(oe=(ne=y.parameters)==null?void 0:ne.docs)==null?void 0:oe.source},description:{story:"Input sizes",...(ce=(ie=y.parameters)==null?void 0:ie.docs)==null?void 0:ce.description}}};var de,pe,ue,me,he;b.parameters={...b.parameters,docs:{...(de=b.parameters)==null?void 0:de.docs,source:{originalSource:`{
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
}`,...(ue=(pe=b.parameters)==null?void 0:pe.docs)==null?void 0:ue.source},description:{story:"Validation states",...(he=(me=b.parameters)==null?void 0:me.docs)==null?void 0:he.description}}};var xe,ye,be,fe,ve;f.parameters={...f.parameters,docs:{...(xe=f.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    type: 'email',
    error: true,
    helperText: 'Please enter a valid email address',
    defaultValue: 'invalid-email'
  }
}`,...(be=(ye=f.parameters)==null?void 0:ye.docs)==null?void 0:be.source},description:{story:"Error state with message",...(ve=(fe=f.parameters)==null?void 0:fe.docs)==null?void 0:ve.description}}};var ge,we,Se,je,Ie;v.parameters={...v.parameters,docs:{...(ge=v.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  args: {
    label: 'Username',
    success: true,
    helperText: 'Username is available',
    defaultValue: 'johndoe'
  }
}`,...(Se=(we=v.parameters)==null?void 0:we.docs)==null?void 0:Se.source},description:{story:"Success state",...(Ie=(je=v.parameters)==null?void 0:je.docs)==null?void 0:Ie.description}}};var Ee,Te,Ce,Pe,Ne;g.parameters={...g.parameters,docs:{...(Ee=g.parameters)==null?void 0:Ee.docs,source:{originalSource:`{
  args: {
    label: 'Price',
    type: 'number',
    prefix: '$',
    placeholder: '0.00'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Price');
    await userEvent.type(input, '99.99');
  }
}`,...(Ce=(Te=g.parameters)==null?void 0:Te.docs)==null?void 0:Ce.source},description:{story:"Input with prefix",...(Ne=(Pe=g.parameters)==null?void 0:Pe.docs)==null?void 0:Ne.description}}};var De,Le,ze,Ae,We;w.parameters={...w.parameters,docs:{...(De=w.parameters)==null?void 0:De.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    suffix: '@company.com',
    placeholder: 'username'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Email');
    await userEvent.type(input, 'john.doe');
  }
}`,...(ze=(Le=w.parameters)==null?void 0:Le.docs)==null?void 0:ze.source},description:{story:"Input with suffix",...(We=(Ae=w.parameters)==null?void 0:Ae.docs)==null?void 0:We.description}}};var ke,qe,Me,Be,Ve;S.parameters={...S.parameters,docs:{...(ke=S.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  args: {
    label: 'Amount',
    type: 'number',
    prefix: '$',
    suffix: '.00',
    placeholder: '0'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Amount');
    await userEvent.type(input, '150');
  }
}`,...(Me=(qe=S.parameters)==null?void 0:qe.docs)==null?void 0:Me.source},description:{story:"Input with both prefix and suffix",...(Ve=(Be=S.parameters)==null?void 0:Be.docs)==null?void 0:Ve.description}}};var Re,Fe,He,Oe,Ue;j.parameters={...j.parameters,docs:{...(Re=j.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  render: () => {
    const SearchIcon = (): React.JSX.Element => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
      </svg>;
    return <Input label="Search" type="search" prefix={<SearchIcon />} placeholder="Search..." />;
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Search');
    await userEvent.type(input, 'components');
  }
}`,...(He=(Fe=j.parameters)==null?void 0:Fe.docs)==null?void 0:He.source},description:{story:"Input with icon prefix",...(Ue=(Oe=j.parameters)==null?void 0:Oe.docs)==null?void 0:Ue.description}}};var Xe,_e,Ke,Je,Qe;I.parameters={...I.parameters,docs:{...(Xe=I.parameters)==null?void 0:Xe.docs,source:{originalSource:`{
  render: function ClearableInput() {
    const [value, setValue] = useState('Hello World');
    return <Input label="Clearable Input" value={value} onChange={e => setValue(e.target.value)} clearable onClear={() => setValue('')} helperText="Click the X to clear" />;
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const clearButton = canvas.getByRole('button');
    await userEvent.click(clearButton);
  }
}`,...(Ke=(_e=I.parameters)==null?void 0:_e.docs)==null?void 0:Ke.source},description:{story:"Clearable input",...(Qe=(Je=I.parameters)==null?void 0:Je.docs)==null?void 0:Qe.description}}};var $e,Ye,Ge,Ze,ea;E.parameters={...E.parameters,docs:{...($e=E.parameters)==null?void 0:$e.docs,source:{originalSource:`{
  args: {
    label: 'Bio',
    maxLength: 150,
    showCount: true,
    helperText: 'Brief description about yourself',
    placeholder: 'Tell us about yourself...'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Tell us about yourself...');
    await userEvent.type(input, 'I am a developer interested in design systems and component libraries.');
  }
}`,...(Ge=(Ye=E.parameters)==null?void 0:Ye.docs)==null?void 0:Ge.source},description:{story:"Input with character counter",...(ea=(Ze=E.parameters)==null?void 0:Ze.docs)==null?void 0:ea.description}}};var aa,ta,sa,ra,la;T.parameters={...T.parameters,docs:{...(aa=T.parameters)==null?void 0:aa.docs,source:{originalSource:`{
  args: {
    label: 'Tweet',
    maxLength: 280,
    showCount: true,
    defaultValue: 'Just shipped a new feature!'
  }
}`,...(sa=(ta=T.parameters)==null?void 0:ta.docs)==null?void 0:sa.source},description:{story:"Character counter with initial value",...(la=(ra=T.parameters)==null?void 0:ra.docs)==null?void 0:la.description}}};var na,oa,ia,ca,da;C.parameters={...C.parameters,docs:{...(na=C.parameters)==null?void 0:na.docs,source:{originalSource:`{
  args: {
    label: 'Email address',
    floating: true,
    placeholder: 'name@example.com',
    type: 'email'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('name@example.com');
    await userEvent.type(input, 'user@example.com');
  }
}`,...(ia=(oa=C.parameters)==null?void 0:oa.docs)==null?void 0:ia.source},description:{story:"Floating label input",...(da=(ca=C.parameters)==null?void 0:ca.docs)==null?void 0:da.description}}};var pa,ua,ma,ha,xa;P.parameters={...P.parameters,docs:{...(pa=P.parameters)==null?void 0:pa.docs,source:{originalSource:`{
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
}`,...(ma=(ua=P.parameters)==null?void 0:ua.docs)==null?void 0:ma.source},description:{story:"Floating labels showcase",...(xa=(ha=P.parameters)==null?void 0:ha.docs)==null?void 0:xa.description}}};var ya,ba,fa,va,ga;N.parameters={...N.parameters,docs:{...(ya=N.parameters)==null?void 0:ya.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    plaintext: true,
    readOnly: true,
    defaultValue: 'email@example.com'
  }
}`,...(fa=(ba=N.parameters)==null?void 0:ba.docs)==null?void 0:fa.source},description:{story:"Plaintext readonly input",...(ga=(va=N.parameters)==null?void 0:va.docs)==null?void 0:ga.description}}};var wa,Sa,ja,Ia,Ea;D.parameters={...D.parameters,docs:{...(wa=D.parameters)==null?void 0:wa.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'Required field'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(/Email/i);
    await userEvent.type(input, 'required@example.com');
  }
}`,...(ja=(Sa=D.parameters)==null?void 0:Sa.docs)==null?void 0:ja.source},description:{story:"Required field",...(Ea=(Ia=D.parameters)==null?void 0:Ia.docs)==null?void 0:Ea.description}}};var Ta,Ca,Pa,Na,Da;L.parameters={...L.parameters,docs:{...(Ta=L.parameters)==null?void 0:Ta.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    type: 'password',
    helperText: 'Must be at least 8 characters long'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Password');
    await userEvent.type(input, 'SecurePassword123');
  }
}`,...(Pa=(Ca=L.parameters)==null?void 0:Ca.docs)==null?void 0:Pa.source},description:{story:"Input with helper text",...(Da=(Na=L.parameters)==null?void 0:Na.docs)==null?void 0:Da.description}}};var La,za,Aa,Wa,ka;z.parameters={...z.parameters,docs:{...(La=z.parameters)==null?void 0:La.docs,source:{originalSource:`{
  render: function ControlledInput() {
    const [value, setValue] = useState('');
    return <div>
        <Input label="Controlled Input" value={value} onChange={e => setValue(e.target.value)} placeholder="Type something..." />
        <p className="mt-2 text-muted small">Value: {value || '(empty)'}</p>
      </div>;
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Type something...');
    await userEvent.type(input, 'Controlled component');
  }
}`,...(Aa=(za=z.parameters)==null?void 0:za.docs)==null?void 0:Aa.source},description:{story:"Controlled input",...(ka=(Wa=z.parameters)==null?void 0:Wa.docs)==null?void 0:ka.description}}};var qa,Ma,Ba,Va,Ra;A.parameters={...A.parameters,docs:{...(qa=A.parameters)==null?void 0:qa.docs,source:{originalSource:`{
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
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const emailInputs = canvas.getAllByDisplayValue('');
    const emailInput = emailInputs[0] as HTMLInputElement;
    const passwordInput = emailInputs[1] as HTMLInputElement;
    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'password123');
  }
}`,...(Ba=(Ma=A.parameters)==null?void 0:Ma.docs)==null?void 0:Ba.source},description:{story:"Login form example",...(Ra=(Va=A.parameters)==null?void 0:Va.docs)==null?void 0:Ra.description}}};var Fa,Ha,Oa,Ua,Xa;W.parameters={...W.parameters,docs:{...(Fa=W.parameters)==null?void 0:Fa.docs,source:{originalSource:`{
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
}`,...(Oa=(Ha=W.parameters)==null?void 0:Ha.docs)==null?void 0:Oa.source},description:{story:"Registration form example",...(Xa=(Ua=W.parameters)==null?void 0:Ua.docs)==null?void 0:Xa.description}}};var _a,Ka,Ja,Qa,$a;k.parameters={...k.parameters,docs:{...(_a=k.parameters)==null?void 0:_a.docs,source:{originalSource:`{
  render: function SearchInputExample() {
    const [query, setQuery] = useState('');
    const SearchIcon = (): React.JSX.Element => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
      </svg>;
    return <Input type="search" aria-label="Search" prefix={<SearchIcon />} placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} clearable onClear={() => setQuery('')} />;
  }
}`,...(Ja=(Ka=k.parameters)==null?void 0:Ka.docs)==null?void 0:Ja.source},description:{story:"Search input pattern",...($a=(Qa=k.parameters)==null?void 0:Qa.docs)==null?void 0:$a.description}}};var Ya,Ga,Za,et,at;q.parameters={...q.parameters,docs:{...(Ya=q.parameters)==null?void 0:Ya.docs,source:{originalSource:`{
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
}`,...(Za=(Ga=q.parameters)==null?void 0:Ga.docs)==null?void 0:Za.source},description:{story:`Focus State: data-focused Attribute

The Input component exposes a \`data-focused\` attribute on the input element
when it has focus. This enables custom CSS styling for focus states beyond
the default browser outline.

The attribute is:
- \`data-focused="true"\` when the input is focused
- Removed (undefined) when the input loses focus`,...(at=(et=q.parameters)==null?void 0:et.docs)==null?void 0:at.description}}};var tt,st,rt,lt,nt;M.parameters={...M.parameters,docs:{...(tt=M.parameters)==null?void 0:tt.docs,source:{originalSource:`{
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
}`,...(rt=(st=M.parameters)==null?void 0:st.docs)==null?void 0:rt.source},description:{story:`Security: Event Handler Validation

The Input component uses a whitelist of safe HTML attributes to prevent
dangerous event handlers from being injected via props. All dangerously
event handlers (onLoad, onError, etc.) are blocked at the input element level.

This protects against XSS vulnerabilities through prop spreading.`,...(nt=(lt=M.parameters)==null?void 0:lt.docs)==null?void 0:nt.description}}};var ot,it,ct,dt,pt;B.parameters={...B.parameters,docs:{...(ot=B.parameters)==null?void 0:ot.docs,source:{originalSource:`{
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
}`,...(ct=(it=B.parameters)==null?void 0:it.docs)==null?void 0:ct.source},description:{story:`Security: Prop Whitelist Protection

Only explicitly whitelisted HTML attributes are allowed on the input element.
This prevents injection of dangerous attributes and event handlers through
the \`rest\` props parameter.`,...(pt=(dt=B.parameters)==null?void 0:dt.docs)==null?void 0:pt.description}}};var ut,mt,ht,xt,yt;V.parameters={...V.parameters,docs:{...(ut=V.parameters)==null?void 0:ut.docs,source:{originalSource:`{
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
}`,...(ht=(mt=V.parameters)==null?void 0:mt.docs)==null?void 0:ht.source},description:{story:`Accessibility: Full Keyboard Support

The Input component provides full keyboard support for all interactions:
- Tab/Shift+Tab: Navigate to/from input
- Type: Enter text into input
- All states remain accessible: disabled, error, clearable`,...(yt=(xt=V.parameters)==null?void 0:xt.docs)==null?void 0:yt.description}}};var bt,ft,vt,gt,wt;R.parameters={...R.parameters,docs:{...(bt=R.parameters)==null?void 0:bt.docs,source:{originalSource:`{
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
}`,...(vt=(ft=R.parameters)==null?void 0:ft.docs)==null?void 0:vt.source},description:{story:"Accessibility: Screen Reader Support\n\nProper semantic markup and ARIA attributes ensure screen reader compatibility:\n- Native `<input>` element for full semantic meaning\n- `<label>` properly associated via `htmlFor`\n- `aria-describedby` links to helper text and error messages\n- `aria-invalid` indicates error state\n- Error/helper messages associated with `id`",...(wt=(gt=R.parameters)==null?void 0:gt.docs)==null?void 0:wt.description}}};var St,jt,It,Et,Tt;F.parameters={...F.parameters,docs:{...(St=F.parameters)==null?void 0:St.docs,source:{originalSource:`{
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
}`,...(It=(jt=F.parameters)==null?void 0:jt.docs)==null?void 0:It.source},description:{story:`Performance: Memoization

The Input component is optimized with React.memo and useMemo:
- React.memo prevents re-renders when parent props don't change
- useMemo caches computed class names
- useCallback memoizes event handlers
- Computed values (hasPrefix, hasSuffix, etc.) are memoized

This ensures efficient rendering in complex forms with many inputs.`,...(Tt=(Et=F.parameters)==null?void 0:Et.docs)==null?void 0:Tt.description}}};const Wt=["Default","WithoutLabel","InputTypes","Sizes","ValidationStates","ErrorState","Success","WithPrefix","WithSuffix","WithPrefixAndSuffix","WithIconPrefix","Clearable","CharacterCounter","CharacterCounterWithValue","FloatingLabel","FloatingLabels","Plaintext","Required","WithHelperText","Controlled","LoginForm","RegistrationForm","SearchInput","FocusState","SecurityEventHandlerValidation","SecurityPropWhitelist","AccessibilityKeyboardNavigation","AccessibilityScreenReaderSupport","PerformanceMemoization"];export{V as AccessibilityKeyboardNavigation,R as AccessibilityScreenReaderSupport,E as CharacterCounter,T as CharacterCounterWithValue,I as Clearable,z as Controlled,m as Default,f as ErrorState,C as FloatingLabel,P as FloatingLabels,q as FocusState,x as InputTypes,A as LoginForm,F as PerformanceMemoization,N as Plaintext,W as RegistrationForm,D as Required,k as SearchInput,M as SecurityEventHandlerValidation,B as SecurityPropWhitelist,y as Sizes,v as Success,b as ValidationStates,L as WithHelperText,j as WithIconPrefix,g as WithPrefix,S as WithPrefixAndSuffix,w as WithSuffix,h as WithoutLabel,Wt as __namedExportsOrder,At as default};
