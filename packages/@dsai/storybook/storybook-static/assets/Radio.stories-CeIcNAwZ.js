import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as j}from"./iframe-D9LIu1Tf.js";import{R as a,b as l}from"./Tabs-C_aTPi4v.js";import"./preload-helper-Dp1pzeXC.js";const Me={title:"Components/Radio",component:l,subcomponents:{Radio:a},parameters:{layout:"padded",docs:{description:{component:"Bootstrap 5 radio button components for single-selection inputs. Use RadioGroup to manage state and accessibility for a group of Radio buttons."}}},tags:["autodocs"],argTypes:{name:{control:"text",description:"Shared form field name",table:{type:{summary:"string"}}},label:{control:"text",description:"Group label",table:{type:{summary:"ReactNode"}}},value:{control:"text",description:"Controlled value",table:{type:{summary:"string"}}},defaultValue:{control:"text",description:"Initial value (uncontrolled)",table:{type:{summary:"string"}}},disabled:{control:"boolean",description:"Disable all radios",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},error:{control:"boolean",description:"Error state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},helperText:{control:"text",description:"Helper or error message",table:{type:{summary:"string"}}},inline:{control:"boolean",description:"Inline layout",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},required:{control:"boolean",description:"Required field",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}}},n={args:{name:"default",label:"Select an option",defaultValue:"option1",children:void 0},render:s=>e.jsxs(l,{...s,children:[e.jsx(a,{value:"option1",label:"Option 1"}),e.jsx(a,{value:"option2",label:"Option 2"}),e.jsx(a,{value:"option3",label:"Option 3"})]})},d={render:()=>e.jsxs(l,{name:"no-default",label:"Choose your preference",children:[e.jsx(a,{value:"a",label:"Choice A"}),e.jsx(a,{value:"b",label:"Choice B"}),e.jsx(a,{value:"c",label:"Choice C"})]})},u={render:function(){const[r,t]=j.useState("medium");return e.jsxs("div",{children:[e.jsxs(l,{name:"controlled",label:"Select size",value:r,onChange:i=>t(i.target.value),children:[e.jsx(a,{value:"small",label:"Small"}),e.jsx(a,{value:"medium",label:"Medium"}),e.jsx(a,{value:"large",label:"Large"})]}),e.jsxs("p",{className:"mt-3 small text-muted",children:["Selected: ",r]})]})}},c={render:()=>e.jsxs(l,{name:"inline",label:"Alignment",inline:!0,defaultValue:"center",children:[e.jsx(a,{value:"left",label:"Left"}),e.jsx(a,{value:"center",label:"Center"}),e.jsx(a,{value:"right",label:"Right"})]})},p={render:()=>e.jsxs(l,{name:"stacked",label:"Notification preferences",defaultValue:"email",children:[e.jsx(a,{value:"email",label:"Email notifications"}),e.jsx(a,{value:"sms",label:"SMS notifications"}),e.jsx(a,{value:"push",label:"Push notifications"}),e.jsx(a,{value:"none",label:"No notifications"})]})},m={render:()=>e.jsxs(l,{name:"disabled",label:"Disabled group",disabled:!0,defaultValue:"1",children:[e.jsx(a,{value:"1",label:"Option 1"}),e.jsx(a,{value:"2",label:"Option 2"}),e.jsx(a,{value:"3",label:"Option 3"})]})},b={render:()=>e.jsxs(l,{name:"partial",label:"Availability",defaultValue:"available",children:[e.jsx(a,{value:"available",label:"Available"}),e.jsx(a,{value:"limited",label:"Limited availability"}),e.jsx(a,{value:"unavailable",label:"Unavailable",disabled:!0})]})},v={render:()=>e.jsxs(l,{name:"error",label:"Terms and conditions",error:!0,helperText:"Please select an option to continue",children:[e.jsx(a,{value:"accept",label:"I accept the terms"}),e.jsx(a,{value:"decline",label:"I decline the terms"})]})},h={render:()=>e.jsxs(l,{name:"required",label:"Payment method",required:!0,children:[e.jsx(a,{value:"card",label:"Credit card"}),e.jsx(a,{value:"paypal",label:"PayPal"}),e.jsx(a,{value:"bank",label:"Bank transfer"})]})},x={render:()=>e.jsxs(l,{name:"helper",label:"Subscription plan",helperText:"You can change your plan at any time",defaultValue:"monthly",children:[e.jsx(a,{value:"monthly",label:"Monthly ($9.99/month)"}),e.jsx(a,{value:"yearly",label:"Yearly ($99/year - Save 17%)"})]})},g={render:function(){const[r,t]=j.useState({size:"medium",color:"blue",shipping:"standard"}),i=o=>{o.preventDefault(),alert(JSON.stringify(r,null,2))};return e.jsxs("form",{onSubmit:i,children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1.5rem"},children:[e.jsxs(l,{name:"size",label:"Size",value:r.size,onChange:o=>t({...r,size:o.target.value}),children:[e.jsx(a,{value:"small",label:"Small"}),e.jsx(a,{value:"medium",label:"Medium"}),e.jsx(a,{value:"large",label:"Large"})]}),e.jsxs(l,{name:"color",label:"Color",inline:!0,value:r.color,onChange:o=>t({...r,color:o.target.value}),children:[e.jsx(a,{value:"red",label:"Red"}),e.jsx(a,{value:"blue",label:"Blue"}),e.jsx(a,{value:"green",label:"Green"})]}),e.jsxs(l,{name:"shipping",label:"Shipping",value:r.shipping,onChange:o=>t({...r,shipping:o.target.value}),helperText:"Estimated delivery times may vary",children:[e.jsx(a,{value:"standard",label:"Standard (5-7 days)"}),e.jsx(a,{value:"express",label:"Express (2-3 days)"}),e.jsx(a,{value:"overnight",label:"Overnight"})]})]}),e.jsx("button",{type:"submit",className:"btn btn-primary mt-4",children:"Submit Order"})]})}},y={render:function(){const[r,t]=j.useState();return e.jsxs("div",{className:"card p-4",style:{maxWidth:"500px"},children:[e.jsxs(l,{name:"satisfaction",label:"How satisfied are you with our service?",value:r,onChange:i=>t(i.target.value),required:!0,children:[e.jsx(a,{value:"5",label:"Very satisfied"}),e.jsx(a,{value:"4",label:"Satisfied"}),e.jsx(a,{value:"3",label:"Neutral"}),e.jsx(a,{value:"2",label:"Dissatisfied"}),e.jsx(a,{value:"1",label:"Very dissatisfied"})]}),e.jsx("button",{className:"btn btn-primary mt-3",disabled:!r,onClick:()=>alert(`You selected: ${r}`),children:"Submit"})]})}},R={render:function(){const[r,t]=j.useState("system"),[i,o]=j.useState("en");return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem",maxWidth:"400px"},children:[e.jsxs(l,{name:"theme",label:"Theme",value:r,onChange:S=>t(S.target.value),children:[e.jsx(a,{value:"light",label:"Light"}),e.jsx(a,{value:"dark",label:"Dark"}),e.jsx(a,{value:"system",label:"System default"})]}),e.jsxs(l,{name:"language",label:"Language",value:i,onChange:S=>o(S.target.value),children:[e.jsx(a,{value:"en",label:"English"}),e.jsx(a,{value:"es",label:"Español"}),e.jsx(a,{value:"fr",label:"Français"}),e.jsx(a,{value:"de",label:"Deutsch"})]})]})}},f={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Basic Radio Group"}),e.jsxs(l,{name:"basic",label:"Select option",defaultValue:"1",children:[e.jsx(a,{value:"1",label:"Option 1"}),e.jsx(a,{value:"2",label:"Option 2"}),e.jsx(a,{value:"3",label:"Option 3"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Inline Layout"}),e.jsxs(l,{name:"inline-showcase",inline:!0,defaultValue:"b",children:[e.jsx(a,{value:"a",label:"A"}),e.jsx(a,{value:"b",label:"B"}),e.jsx(a,{value:"c",label:"C"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"States"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs(l,{name:"disabled-showcase",label:"Disabled",disabled:!0,defaultValue:"1",children:[e.jsx(a,{value:"1",label:"Option 1"}),e.jsx(a,{value:"2",label:"Option 2"})]}),e.jsxs(l,{name:"error-showcase",label:"With Error",error:!0,helperText:"Please make a selection",children:[e.jsx(a,{value:"1",label:"Option 1"}),e.jsx(a,{value:"2",label:"Option 2"})]}),e.jsxs(l,{name:"required-showcase",label:"Required",required:!0,children:[e.jsx(a,{value:"1",label:"Option 1"}),e.jsx(a,{value:"2",label:"Option 2"})]})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"With Helper Text"}),e.jsxs(l,{name:"helper-showcase",label:"Delivery speed",helperText:"Additional fees may apply for express shipping",defaultValue:"standard",children:[e.jsx(a,{value:"standard",label:"Standard (Free)"}),e.jsx(a,{value:"express",label:"Express ($9.99)"})]})]})]})};var G,D,C,O,V;n.parameters={...n.parameters,docs:{...(G=n.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    name: 'default',
    label: 'Select an option',
    defaultValue: 'option1',
    children: undefined
  },
  render: args => <RadioGroup {...args}>
      <Radio value="option1" label="Option 1" />
      <Radio value="option2" label="Option 2" />
      <Radio value="option3" label="Option 3" />
    </RadioGroup>
}`,...(C=(D=n.parameters)==null?void 0:D.docs)==null?void 0:C.source},description:{story:"Default radio group with stacked layout",...(V=(O=n.parameters)==null?void 0:O.docs)==null?void 0:V.description}}};var w,E,T,B,N;d.parameters={...d.parameters,docs:{...(w=d.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <RadioGroup name="no-default" label="Choose your preference">
      <Radio value="a" label="Choice A" />
      <Radio value="b" label="Choice B" />
      <Radio value="c" label="Choice C" />
    </RadioGroup>
}`,...(T=(E=d.parameters)==null?void 0:E.docs)==null?void 0:T.source},description:{story:"Radio group without default selection",...(N=(B=d.parameters)==null?void 0:B.docs)==null?void 0:N.description}}};var k,q,L,P,A;u.parameters={...u.parameters,docs:{...(k=u.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: function ControlledRadioGroup() {
    const [value, setValue] = useState('medium');
    return <div>
        <RadioGroup name="controlled" label="Select size" value={value} onChange={e => setValue(e.target.value)}>
          <Radio value="small" label="Small" />
          <Radio value="medium" label="Medium" />
          <Radio value="large" label="Large" />
        </RadioGroup>
        <p className="mt-3 small text-muted">Selected: {value}</p>
      </div>;
  }
}`,...(L=(q=u.parameters)==null?void 0:q.docs)==null?void 0:L.source},description:{story:"Controlled radio group with state",...(A=(P=u.parameters)==null?void 0:P.docs)==null?void 0:A.description}}};var F,I,z,W,H;c.parameters={...c.parameters,docs:{...(F=c.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <RadioGroup name="inline" label="Alignment" inline defaultValue="center">
      <Radio value="left" label="Left" />
      <Radio value="center" label="Center" />
      <Radio value="right" label="Right" />
    </RadioGroup>
}`,...(z=(I=c.parameters)==null?void 0:I.docs)==null?void 0:z.source},description:{story:"Inline radio layout",...(H=(W=c.parameters)==null?void 0:W.docs)==null?void 0:H.description}}};var M,$,Y,U,J;p.parameters={...p.parameters,docs:{...(M=p.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <RadioGroup name="stacked" label="Notification preferences" defaultValue="email">
      <Radio value="email" label="Email notifications" />
      <Radio value="sms" label="SMS notifications" />
      <Radio value="push" label="Push notifications" />
      <Radio value="none" label="No notifications" />
    </RadioGroup>
}`,...(Y=($=p.parameters)==null?void 0:$.docs)==null?void 0:Y.source},description:{story:"Stacked layout (default)",...(J=(U=p.parameters)==null?void 0:U.docs)==null?void 0:J.description}}};var Q,_,K,X,Z;m.parameters={...m.parameters,docs:{...(Q=m.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => <RadioGroup name="disabled" label="Disabled group" disabled defaultValue="1">
      <Radio value="1" label="Option 1" />
      <Radio value="2" label="Option 2" />
      <Radio value="3" label="Option 3" />
    </RadioGroup>
}`,...(K=(_=m.parameters)==null?void 0:_.docs)==null?void 0:K.source},description:{story:"Disabled radio group",...(Z=(X=m.parameters)==null?void 0:X.docs)==null?void 0:Z.description}}};var ee,ae,le,re,te;b.parameters={...b.parameters,docs:{...(ee=b.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => <RadioGroup name="partial" label="Availability" defaultValue="available">
      <Radio value="available" label="Available" />
      <Radio value="limited" label="Limited availability" />
      <Radio value="unavailable" label="Unavailable" disabled />
    </RadioGroup>
}`,...(le=(ae=b.parameters)==null?void 0:ae.docs)==null?void 0:le.source},description:{story:"Individual disabled option",...(te=(re=b.parameters)==null?void 0:re.docs)==null?void 0:te.description}}};var oe,ie,se,ne,de;v.parameters={...v.parameters,docs:{...(oe=v.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  render: () => <RadioGroup name="error" label="Terms and conditions" error helperText="Please select an option to continue">
      <Radio value="accept" label="I accept the terms" />
      <Radio value="decline" label="I decline the terms" />
    </RadioGroup>
}`,...(se=(ie=v.parameters)==null?void 0:ie.docs)==null?void 0:se.source},description:{story:"Error state",...(de=(ne=v.parameters)==null?void 0:ne.docs)==null?void 0:de.description}}};var ue,ce,pe,me,be;h.parameters={...h.parameters,docs:{...(ue=h.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  render: () => <RadioGroup name="required" label="Payment method" required>
      <Radio value="card" label="Credit card" />
      <Radio value="paypal" label="PayPal" />
      <Radio value="bank" label="Bank transfer" />
    </RadioGroup>
}`,...(pe=(ce=h.parameters)==null?void 0:ce.docs)==null?void 0:pe.source},description:{story:"Required field",...(be=(me=h.parameters)==null?void 0:me.docs)==null?void 0:be.description}}};var ve,he,xe,ge,ye;x.parameters={...x.parameters,docs:{...(ve=x.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  render: () => <RadioGroup name="helper" label="Subscription plan" helperText="You can change your plan at any time" defaultValue="monthly">
      <Radio value="monthly" label="Monthly ($9.99/month)" />
      <Radio value="yearly" label="Yearly ($99/year - Save 17%)" />
    </RadioGroup>
}`,...(xe=(he=x.parameters)==null?void 0:he.docs)==null?void 0:xe.source},description:{story:"With helper text",...(ye=(ge=x.parameters)==null?void 0:ge.docs)==null?void 0:ye.description}}};var Re,fe,je,Se,Ge;g.parameters={...g.parameters,docs:{...(Re=g.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  render: function FormRadios() {
    const [formData, setFormData] = useState({
      size: 'medium',
      color: 'blue',
      shipping: 'standard'
    });
    const handleSubmit = (e: React.FormEvent): void => {
      e.preventDefault();
      alert(JSON.stringify(formData, null, 2));
    };
    return <form onSubmit={handleSubmit}>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
          <RadioGroup name="size" label="Size" value={formData.size} onChange={e => setFormData({
          ...formData,
          size: e.target.value
        })}>
            <Radio value="small" label="Small" />
            <Radio value="medium" label="Medium" />
            <Radio value="large" label="Large" />
          </RadioGroup>

          <RadioGroup name="color" label="Color" inline value={formData.color} onChange={e => setFormData({
          ...formData,
          color: e.target.value
        })}>
            <Radio value="red" label="Red" />
            <Radio value="blue" label="Blue" />
            <Radio value="green" label="Green" />
          </RadioGroup>

          <RadioGroup name="shipping" label="Shipping" value={formData.shipping} onChange={e => setFormData({
          ...formData,
          shipping: e.target.value
        })} helperText="Estimated delivery times may vary">
            <Radio value="standard" label="Standard (5-7 days)" />
            <Radio value="express" label="Express (2-3 days)" />
            <Radio value="overnight" label="Overnight" />
          </RadioGroup>
        </div>

        <button type="submit" className="btn btn-primary mt-4">
          Submit Order
        </button>
      </form>;
  }
}`,...(je=(fe=g.parameters)==null?void 0:fe.docs)==null?void 0:je.source},description:{story:"Form with radio groups",...(Ge=(Se=g.parameters)==null?void 0:Se.docs)==null?void 0:Ge.description}}};var De,Ce,Oe,Ve,we;y.parameters={...y.parameters,docs:{...(De=y.parameters)==null?void 0:De.docs,source:{originalSource:`{
  render: function Survey() {
    const [answer, setAnswer] = useState<string | undefined>();
    return <div className="card p-4" style={{
      maxWidth: '500px'
    }}>
        <RadioGroup name="satisfaction" label="How satisfied are you with our service?" value={answer} onChange={e => setAnswer(e.target.value)} required>
          <Radio value="5" label="Very satisfied" />
          <Radio value="4" label="Satisfied" />
          <Radio value="3" label="Neutral" />
          <Radio value="2" label="Dissatisfied" />
          <Radio value="1" label="Very dissatisfied" />
        </RadioGroup>
        <button className="btn btn-primary mt-3" disabled={!answer} onClick={() => alert(\`You selected: \${answer}\`)}>
          Submit
        </button>
      </div>;
  }
}`,...(Oe=(Ce=y.parameters)==null?void 0:Ce.docs)==null?void 0:Oe.source},description:{story:"Survey question pattern",...(we=(Ve=y.parameters)==null?void 0:Ve.docs)==null?void 0:we.description}}};var Ee,Te,Be,Ne,ke;R.parameters={...R.parameters,docs:{...(Ee=R.parameters)==null?void 0:Ee.docs,source:{originalSource:`{
  render: function Settings() {
    const [theme, setTheme] = useState('system');
    const [language, setLanguage] = useState('en');
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      maxWidth: '400px'
    }}>
        <RadioGroup name="theme" label="Theme" value={theme} onChange={e => setTheme(e.target.value)}>
          <Radio value="light" label="Light" />
          <Radio value="dark" label="Dark" />
          <Radio value="system" label="System default" />
        </RadioGroup>

        <RadioGroup name="language" label="Language" value={language} onChange={e => setLanguage(e.target.value)}>
          <Radio value="en" label="English" />
          <Radio value="es" label="Español" />
          <Radio value="fr" label="Français" />
          <Radio value="de" label="Deutsch" />
        </RadioGroup>
      </div>;
  }
}`,...(Be=(Te=R.parameters)==null?void 0:Te.docs)==null?void 0:Be.source},description:{story:"Settings panel pattern",...(ke=(Ne=R.parameters)==null?void 0:Ne.docs)==null?void 0:ke.description}}};var qe,Le,Pe,Ae,Fe;f.parameters={...f.parameters,docs:{...(qe=f.parameters)==null?void 0:qe.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }}>
      {/* Basic */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>Basic Radio Group</h4>
        <RadioGroup name="basic" label="Select option" defaultValue="1">
          <Radio value="1" label="Option 1" />
          <Radio value="2" label="Option 2" />
          <Radio value="3" label="Option 3" />
        </RadioGroup>
      </div>

      {/* Inline */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>Inline Layout</h4>
        <RadioGroup name="inline-showcase" inline defaultValue="b">
          <Radio value="a" label="A" />
          <Radio value="b" label="B" />
          <Radio value="c" label="C" />
        </RadioGroup>
      </div>

      {/* States */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>States</h4>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
          <RadioGroup name="disabled-showcase" label="Disabled" disabled defaultValue="1">
            <Radio value="1" label="Option 1" />
            <Radio value="2" label="Option 2" />
          </RadioGroup>

          <RadioGroup name="error-showcase" label="With Error" error helperText="Please make a selection">
            <Radio value="1" label="Option 1" />
            <Radio value="2" label="Option 2" />
          </RadioGroup>

          <RadioGroup name="required-showcase" label="Required" required>
            <Radio value="1" label="Option 1" />
            <Radio value="2" label="Option 2" />
          </RadioGroup>
        </div>
      </div>

      {/* With Helper */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>With Helper Text</h4>
        <RadioGroup name="helper-showcase" label="Delivery speed" helperText="Additional fees may apply for express shipping" defaultValue="standard">
          <Radio value="standard" label="Standard (Free)" />
          <Radio value="express" label="Express ($9.99)" />
        </RadioGroup>
      </div>
    </div>
}`,...(Pe=(Le=f.parameters)==null?void 0:Le.docs)==null?void 0:Pe.source},description:{story:"Complete radio showcase",...(Fe=(Ae=f.parameters)==null?void 0:Ae.docs)==null?void 0:Fe.description}}};const $e=["Default","NoDefaultSelection","Controlled","Inline","Stacked","Disabled","PartiallyDisabled","Error","Required","WithHelperText","FormExample","SurveyQuestion","SettingsPanel","CompleteShowcase"];export{f as CompleteShowcase,u as Controlled,n as Default,m as Disabled,v as Error,g as FormExample,c as Inline,d as NoDefaultSelection,b as PartiallyDisabled,h as Required,R as SettingsPanel,p as Stacked,y as SurveyQuestion,x as WithHelperText,$e as __namedExportsOrder,Me as default};
