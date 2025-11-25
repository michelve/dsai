import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as i}from"./iframe-B8V5qLVE.js";import{I as r}from"./Tabs-DykXLldJ.js";import"./preload-helper-Dp1pzeXC.js";const Zr={title:"Components/Input",component:r,parameters:{layout:"padded",docs:{description:{component:"A flexible text input component built with Bootstrap 5 classes. Supports multiple types, sizes, validation states, and addons."}}},tags:["autodocs"],argTypes:{type:{control:"select",options:["text","email","password","number","tel","url","search"],description:"Input type",table:{type:{summary:"InputType"},defaultValue:{summary:"text"}}},size:{control:"select",options:["sm","md","lg"],description:"Input size",table:{type:{summary:"InputSize"},defaultValue:{summary:"md"}}},label:{control:"text",description:"Input label",table:{type:{summary:"ReactNode"}}},helperText:{control:"text",description:"Helper or error message",table:{type:{summary:"string"}}},error:{control:"boolean",description:"Error state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},success:{control:"boolean",description:"Success state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},disabled:{control:"boolean",description:"Disabled state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},readOnly:{control:"boolean",description:"Read-only state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},required:{control:"boolean",description:"Required field",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},clearable:{control:"boolean",description:"Show clear button",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},showCount:{control:"boolean",description:"Show character counter",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},floating:{control:"boolean",description:"Floating label style",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},plaintext:{control:"boolean",description:"Plaintext style",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}}},p={args:{label:"Email address",type:"email",placeholder:"Enter your email"}},c={args:{"aria-label":"Search",placeholder:"Search...",type:"search"}},d={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:"400px"},children:[e.jsx(r,{label:"Text",type:"text",placeholder:"Enter text"}),e.jsx(r,{label:"Email",type:"email",placeholder:"name@example.com"}),e.jsx(r,{label:"Password",type:"password",placeholder:"Enter password"}),e.jsx(r,{label:"Number",type:"number",placeholder:"0"}),e.jsx(r,{label:"Phone",type:"tel",placeholder:"+1 (555) 123-4567"}),e.jsx(r,{label:"URL",type:"url",placeholder:"https://example.com"}),e.jsx(r,{label:"Search",type:"search",placeholder:"Search..."})]})},u={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:"400px"},children:[e.jsx(r,{label:"Small",size:"sm",placeholder:"Small input"}),e.jsx(r,{label:"Medium (default)",size:"md",placeholder:"Medium input"}),e.jsx(r,{label:"Large",size:"lg",placeholder:"Large input"})]})},m={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:"400px"},children:[e.jsx(r,{label:"Default",placeholder:"Default state"}),e.jsx(r,{label:"Error",error:!0,helperText:"This field is required"}),e.jsx(r,{label:"Success",success:!0,helperText:"Looks good!",defaultValue:"Valid input"}),e.jsx(r,{label:"Disabled",disabled:!0,placeholder:"Disabled input"}),e.jsx(r,{label:"Read Only",readOnly:!0,defaultValue:"Read-only value"})]})},h={args:{label:"Email",type:"email",error:!0,helperText:"Please enter a valid email address",defaultValue:"invalid-email"}},x={args:{label:"Username",success:!0,helperText:"Username is available",defaultValue:"johndoe"}},b={args:{label:"Price",type:"number",prefix:"$",placeholder:"0.00"}},y={args:{label:"Email",suffix:"@company.com",placeholder:"username"}},f={args:{label:"Amount",type:"number",prefix:"$",suffix:".00",placeholder:"0"}},g={render:()=>{const s=()=>e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",viewBox:"0 0 16 16",children:e.jsx("path",{d:"M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"})});return e.jsx(r,{label:"Search",type:"search",prefix:e.jsx(s,{}),placeholder:"Search..."})}},S={render:function(){const[a,t]=i.useState("Hello World");return e.jsx(r,{label:"Clearable Input",value:a,onChange:l=>t(l.target.value),clearable:!0,onClear:()=>t(""),helperText:"Click the X to clear"})}},w={args:{label:"Bio",maxLength:150,showCount:!0,helperText:"Brief description about yourself",placeholder:"Tell us about yourself..."}},v={args:{label:"Tweet",maxLength:280,showCount:!0,defaultValue:"Just shipped a new feature! 🚀"}},I={args:{label:"Email address",floating:!0,placeholder:"name@example.com",type:"email"}},j={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:"400px"},children:[e.jsx(r,{label:"Email address",floating:!0,placeholder:"name@example.com",type:"email"}),e.jsx(r,{label:"Password",floating:!0,placeholder:"Password",type:"password"}),e.jsx(r,{label:"Username",floating:!0,placeholder:"Username"})]})},C={args:{label:"Email",plaintext:!0,readOnly:!0,defaultValue:"email@example.com"}},E={args:{label:"Email",type:"email",required:!0,placeholder:"Required field"}},V={args:{label:"Password",type:"password",helperText:"Must be at least 8 characters long"}},P={render:function(){const[a,t]=i.useState("");return e.jsxs("div",{children:[e.jsx(r,{label:"Controlled Input",value:a,onChange:l=>t(l.target.value),placeholder:"Type something..."}),e.jsxs("p",{className:"mt-2 text-muted small",children:["Value: ",a||"(empty)"]})]})}},T={render:function(){const[a,t]=i.useState(""),[l,W]=i.useState(""),[z,Qr]=i.useState({}),Xr=n=>{n.preventDefault();const o={};a?/\S+@\S+\.\S+/.test(a)||(o.email="Please enter a valid email"):o.email="Email is required",l?l.length<8&&(o.password="Password must be at least 8 characters"):o.password="Password is required",Qr(o),Object.keys(o).length===0&&alert("Form submitted successfully!")};return e.jsx("form",{onSubmit:Xr,style:{maxWidth:"400px"},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(r,{label:"Email",type:"email",value:a,onChange:n=>t(n.target.value),error:!!z.email,helperText:z.email,required:!0}),e.jsx(r,{label:"Password",type:"password",value:l,onChange:n=>W(n.target.value),error:!!z.password,helperText:z.password||"Must be at least 8 characters",required:!0}),e.jsx("button",{type:"submit",className:"btn btn-primary",children:"Sign In"})]})})}},D={render:function(){return e.jsx("form",{style:{maxWidth:"400px"},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{style:{display:"flex",gap:"1rem"},children:[e.jsx(r,{label:"First Name",required:!0}),e.jsx(r,{label:"Last Name",required:!0})]}),e.jsx(r,{label:"Email",type:"email",required:!0}),e.jsx(r,{label:"Phone",type:"tel",helperText:"Optional"}),e.jsx(r,{label:"Password",type:"password",required:!0,helperText:"At least 8 characters with a number"}),e.jsx(r,{label:"Confirm Password",type:"password",required:!0}),e.jsx("button",{type:"submit",className:"btn btn-primary",children:"Create Account"})]})})}},q={render:function(){const[a,t]=i.useState(""),l=()=>e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",viewBox:"0 0 16 16",children:e.jsx("path",{d:"M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"})});return e.jsx(r,{type:"search","aria-label":"Search",prefix:e.jsx(l,{}),placeholder:"Search...",value:a,onChange:W=>t(W.target.value),clearable:!0,onClear:()=>t("")})}},L={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem",maxWidth:"500px"},children:[e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Basic Input"}),e.jsx(r,{label:"Name",placeholder:"Enter your name"})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Sizes"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(r,{size:"sm","aria-label":"Small",placeholder:"Small"}),e.jsx(r,{size:"md","aria-label":"Medium",placeholder:"Medium"}),e.jsx(r,{size:"lg","aria-label":"Large",placeholder:"Large"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"States"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(r,{label:"Error",error:!0,helperText:"This field has an error"}),e.jsx(r,{label:"Success",success:!0,defaultValue:"Valid"}),e.jsx(r,{label:"Disabled",disabled:!0,placeholder:"Disabled"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Addons"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(r,{label:"Price",prefix:"$",type:"number",placeholder:"0.00"}),e.jsx(r,{label:"Domain",suffix:".com",placeholder:"example"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Features"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(r,{label:"Clearable",clearable:!0,defaultValue:"Clear me"}),e.jsx(r,{label:"Character Count",maxLength:50,showCount:!0}),e.jsx(r,{label:"Floating Label",floating:!0,placeholder:"Floating"}),e.jsx(r,{label:"Required",required:!0,placeholder:"Required field"})]})]})]})};var F,R,B,M,N;p.parameters={...p.parameters,docs:{...(F=p.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    label: 'Email address',
    type: 'email',
    placeholder: 'Enter your email'
  }
}`,...(B=(R=p.parameters)==null?void 0:R.docs)==null?void 0:B.source},description:{story:"Default text input with label",...(N=(M=p.parameters)==null?void 0:M.docs)==null?void 0:N.description}}};var A,O,U,k,$;c.parameters={...c.parameters,docs:{...(A=c.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Search',
    placeholder: 'Search...',
    type: 'search'
  }
}`,...(U=(O=c.parameters)==null?void 0:O.docs)==null?void 0:U.source},description:{story:"Input without label (uses aria-label)",...($=(k=c.parameters)==null?void 0:k.docs)==null?void 0:$.description}}};var H,J,Q,X,_;d.parameters={...d.parameters,docs:{...(H=d.parameters)==null?void 0:H.docs,source:{originalSource:`{
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
}`,...(Q=(J=d.parameters)==null?void 0:J.docs)==null?void 0:Q.source},description:{story:"All input types",...(_=(X=d.parameters)==null?void 0:X.docs)==null?void 0:_.description}}};var G,K,Y,Z,ee;u.parameters={...u.parameters,docs:{...(G=u.parameters)==null?void 0:G.docs,source:{originalSource:`{
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
}`,...(Y=(K=u.parameters)==null?void 0:K.docs)==null?void 0:Y.source},description:{story:"Input sizes",...(ee=(Z=u.parameters)==null?void 0:Z.docs)==null?void 0:ee.description}}};var re,ae,te,le,se;m.parameters={...m.parameters,docs:{...(re=m.parameters)==null?void 0:re.docs,source:{originalSource:`{
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
}`,...(te=(ae=m.parameters)==null?void 0:ae.docs)==null?void 0:te.source},description:{story:"Validation states",...(se=(le=m.parameters)==null?void 0:le.docs)==null?void 0:se.description}}};var oe,ie,ne,pe,ce;h.parameters={...h.parameters,docs:{...(oe=h.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    type: 'email',
    error: true,
    helperText: 'Please enter a valid email address',
    defaultValue: 'invalid-email'
  }
}`,...(ne=(ie=h.parameters)==null?void 0:ie.docs)==null?void 0:ne.source},description:{story:"Error state with message",...(ce=(pe=h.parameters)==null?void 0:pe.docs)==null?void 0:ce.description}}};var de,ue,me,he,xe;x.parameters={...x.parameters,docs:{...(de=x.parameters)==null?void 0:de.docs,source:{originalSource:`{
  args: {
    label: 'Username',
    success: true,
    helperText: 'Username is available',
    defaultValue: 'johndoe'
  }
}`,...(me=(ue=x.parameters)==null?void 0:ue.docs)==null?void 0:me.source},description:{story:"Success state",...(xe=(he=x.parameters)==null?void 0:he.docs)==null?void 0:xe.description}}};var be,ye,fe,ge,Se;b.parameters={...b.parameters,docs:{...(be=b.parameters)==null?void 0:be.docs,source:{originalSource:`{
  args: {
    label: 'Price',
    type: 'number',
    prefix: '$',
    placeholder: '0.00'
  }
}`,...(fe=(ye=b.parameters)==null?void 0:ye.docs)==null?void 0:fe.source},description:{story:"Input with prefix",...(Se=(ge=b.parameters)==null?void 0:ge.docs)==null?void 0:Se.description}}};var we,ve,Ie,je,Ce;y.parameters={...y.parameters,docs:{...(we=y.parameters)==null?void 0:we.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    suffix: '@company.com',
    placeholder: 'username'
  }
}`,...(Ie=(ve=y.parameters)==null?void 0:ve.docs)==null?void 0:Ie.source},description:{story:"Input with suffix",...(Ce=(je=y.parameters)==null?void 0:je.docs)==null?void 0:Ce.description}}};var Ee,Ve,Pe,Te,De;f.parameters={...f.parameters,docs:{...(Ee=f.parameters)==null?void 0:Ee.docs,source:{originalSource:`{
  args: {
    label: 'Amount',
    type: 'number',
    prefix: '$',
    suffix: '.00',
    placeholder: '0'
  }
}`,...(Pe=(Ve=f.parameters)==null?void 0:Ve.docs)==null?void 0:Pe.source},description:{story:"Input with both prefix and suffix",...(De=(Te=f.parameters)==null?void 0:Te.docs)==null?void 0:De.description}}};var qe,Le,ze,We,Fe;g.parameters={...g.parameters,docs:{...(qe=g.parameters)==null?void 0:qe.docs,source:{originalSource:`{
  render: () => {
    const SearchIcon = (): React.JSX.Element => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
      </svg>;
    return <Input label="Search" type="search" prefix={<SearchIcon />} placeholder="Search..." />;
  }
}`,...(ze=(Le=g.parameters)==null?void 0:Le.docs)==null?void 0:ze.source},description:{story:"Input with icon prefix",...(Fe=(We=g.parameters)==null?void 0:We.docs)==null?void 0:Fe.description}}};var Re,Be,Me,Ne,Ae;S.parameters={...S.parameters,docs:{...(Re=S.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  render: function ClearableInput() {
    const [value, setValue] = useState('Hello World');
    return <Input label="Clearable Input" value={value} onChange={e => setValue(e.target.value)} clearable onClear={() => setValue('')} helperText="Click the X to clear" />;
  }
}`,...(Me=(Be=S.parameters)==null?void 0:Be.docs)==null?void 0:Me.source},description:{story:"Clearable input",...(Ae=(Ne=S.parameters)==null?void 0:Ne.docs)==null?void 0:Ae.description}}};var Oe,Ue,ke,$e,He;w.parameters={...w.parameters,docs:{...(Oe=w.parameters)==null?void 0:Oe.docs,source:{originalSource:`{
  args: {
    label: 'Bio',
    maxLength: 150,
    showCount: true,
    helperText: 'Brief description about yourself',
    placeholder: 'Tell us about yourself...'
  }
}`,...(ke=(Ue=w.parameters)==null?void 0:Ue.docs)==null?void 0:ke.source},description:{story:"Input with character counter",...(He=($e=w.parameters)==null?void 0:$e.docs)==null?void 0:He.description}}};var Je,Qe,Xe,_e,Ge;v.parameters={...v.parameters,docs:{...(Je=v.parameters)==null?void 0:Je.docs,source:{originalSource:`{
  args: {
    label: 'Tweet',
    maxLength: 280,
    showCount: true,
    defaultValue: 'Just shipped a new feature! 🚀'
  }
}`,...(Xe=(Qe=v.parameters)==null?void 0:Qe.docs)==null?void 0:Xe.source},description:{story:"Character counter with initial value",...(Ge=(_e=v.parameters)==null?void 0:_e.docs)==null?void 0:Ge.description}}};var Ke,Ye,Ze,er,rr;I.parameters={...I.parameters,docs:{...(Ke=I.parameters)==null?void 0:Ke.docs,source:{originalSource:`{
  args: {
    label: 'Email address',
    floating: true,
    placeholder: 'name@example.com',
    type: 'email'
  }
}`,...(Ze=(Ye=I.parameters)==null?void 0:Ye.docs)==null?void 0:Ze.source},description:{story:"Floating label input",...(rr=(er=I.parameters)==null?void 0:er.docs)==null?void 0:rr.description}}};var ar,tr,lr,sr,or;j.parameters={...j.parameters,docs:{...(ar=j.parameters)==null?void 0:ar.docs,source:{originalSource:`{
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
}`,...(lr=(tr=j.parameters)==null?void 0:tr.docs)==null?void 0:lr.source},description:{story:"Floating labels showcase",...(or=(sr=j.parameters)==null?void 0:sr.docs)==null?void 0:or.description}}};var ir,nr,pr,cr,dr;C.parameters={...C.parameters,docs:{...(ir=C.parameters)==null?void 0:ir.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    plaintext: true,
    readOnly: true,
    defaultValue: 'email@example.com'
  }
}`,...(pr=(nr=C.parameters)==null?void 0:nr.docs)==null?void 0:pr.source},description:{story:"Plaintext readonly input",...(dr=(cr=C.parameters)==null?void 0:cr.docs)==null?void 0:dr.description}}};var ur,mr,hr,xr,br;E.parameters={...E.parameters,docs:{...(ur=E.parameters)==null?void 0:ur.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'Required field'
  }
}`,...(hr=(mr=E.parameters)==null?void 0:mr.docs)==null?void 0:hr.source},description:{story:"Required field",...(br=(xr=E.parameters)==null?void 0:xr.docs)==null?void 0:br.description}}};var yr,fr,gr,Sr,wr;V.parameters={...V.parameters,docs:{...(yr=V.parameters)==null?void 0:yr.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    type: 'password',
    helperText: 'Must be at least 8 characters long'
  }
}`,...(gr=(fr=V.parameters)==null?void 0:fr.docs)==null?void 0:gr.source},description:{story:"Input with helper text",...(wr=(Sr=V.parameters)==null?void 0:Sr.docs)==null?void 0:wr.description}}};var vr,Ir,jr,Cr,Er;P.parameters={...P.parameters,docs:{...(vr=P.parameters)==null?void 0:vr.docs,source:{originalSource:`{
  render: function ControlledInput() {
    const [value, setValue] = useState('');
    return <div>
        <Input label="Controlled Input" value={value} onChange={e => setValue(e.target.value)} placeholder="Type something..." />
        <p className="mt-2 text-muted small">Value: {value || '(empty)'}</p>
      </div>;
  }
}`,...(jr=(Ir=P.parameters)==null?void 0:Ir.docs)==null?void 0:jr.source},description:{story:"Controlled input",...(Er=(Cr=P.parameters)==null?void 0:Cr.docs)==null?void 0:Er.description}}};var Vr,Pr,Tr,Dr,qr;T.parameters={...T.parameters,docs:{...(Vr=T.parameters)==null?void 0:Vr.docs,source:{originalSource:`{
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
}`,...(Tr=(Pr=T.parameters)==null?void 0:Pr.docs)==null?void 0:Tr.source},description:{story:"Login form example",...(qr=(Dr=T.parameters)==null?void 0:Dr.docs)==null?void 0:qr.description}}};var Lr,zr,Wr,Fr,Rr;D.parameters={...D.parameters,docs:{...(Lr=D.parameters)==null?void 0:Lr.docs,source:{originalSource:`{
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
}`,...(Wr=(zr=D.parameters)==null?void 0:zr.docs)==null?void 0:Wr.source},description:{story:"Registration form example",...(Rr=(Fr=D.parameters)==null?void 0:Fr.docs)==null?void 0:Rr.description}}};var Br,Mr,Nr,Ar,Or;q.parameters={...q.parameters,docs:{...(Br=q.parameters)==null?void 0:Br.docs,source:{originalSource:`{
  render: function SearchInputExample() {
    const [query, setQuery] = useState('');
    const SearchIcon = (): React.JSX.Element => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
      </svg>;
    return <Input type="search" aria-label="Search" prefix={<SearchIcon />} placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} clearable onClear={() => setQuery('')} />;
  }
}`,...(Nr=(Mr=q.parameters)==null?void 0:Mr.docs)==null?void 0:Nr.source},description:{story:"Search input pattern",...(Or=(Ar=q.parameters)==null?void 0:Ar.docs)==null?void 0:Or.description}}};var Ur,kr,$r,Hr,Jr;L.parameters={...L.parameters,docs:{...(Ur=L.parameters)==null?void 0:Ur.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    maxWidth: '500px'
  }}>
      {/* Basic */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>Basic Input</h4>
        <Input label="Name" placeholder="Enter your name" />
      </div>

      {/* Sizes */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>Sizes</h4>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
          <Input size="sm" aria-label="Small" placeholder="Small" />
          <Input size="md" aria-label="Medium" placeholder="Medium" />
          <Input size="lg" aria-label="Large" placeholder="Large" />
        </div>
      </div>

      {/* States */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>States</h4>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
          <Input label="Error" error helperText="This field has an error" />
          <Input label="Success" success defaultValue="Valid" />
          <Input label="Disabled" disabled placeholder="Disabled" />
        </div>
      </div>

      {/* Addons */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>Addons</h4>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
          <Input label="Price" prefix="$" type="number" placeholder="0.00" />
          <Input label="Domain" suffix=".com" placeholder="example" />
        </div>
      </div>

      {/* Features */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>Features</h4>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
          <Input label="Clearable" clearable defaultValue="Clear me" />
          <Input label="Character Count" maxLength={50} showCount />
          <Input label="Floating Label" floating placeholder="Floating" />
          <Input label="Required" required placeholder="Required field" />
        </div>
      </div>
    </div>
}`,...($r=(kr=L.parameters)==null?void 0:kr.docs)==null?void 0:$r.source},description:{story:"Complete input showcase",...(Jr=(Hr=L.parameters)==null?void 0:Hr.docs)==null?void 0:Jr.description}}};const ea=["Default","WithoutLabel","InputTypes","Sizes","ValidationStates","Error","Success","WithPrefix","WithSuffix","WithPrefixAndSuffix","WithIconPrefix","Clearable","CharacterCounter","CharacterCounterWithValue","FloatingLabel","FloatingLabels","Plaintext","Required","WithHelperText","Controlled","LoginForm","RegistrationForm","SearchInput","CompleteShowcase"];export{w as CharacterCounter,v as CharacterCounterWithValue,S as Clearable,L as CompleteShowcase,P as Controlled,p as Default,h as Error,I as FloatingLabel,j as FloatingLabels,d as InputTypes,T as LoginForm,C as Plaintext,D as RegistrationForm,E as Required,q as SearchInput,u as Sizes,x as Success,m as ValidationStates,V as WithHelperText,g as WithIconPrefix,b as WithPrefix,f as WithPrefixAndSuffix,y as WithSuffix,c as WithoutLabel,ea as __namedExportsOrder,Zr as default};
