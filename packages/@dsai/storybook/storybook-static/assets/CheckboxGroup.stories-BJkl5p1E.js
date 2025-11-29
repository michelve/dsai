import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{x as s,b as c,c as Bt}from"./Tabs-Fap5R-zB.js";import{r}from"./iframe-6amVX2Fk.js";import"./preload-helper-Dp1pzeXC.js";const _t={title:"Components/CheckboxGroup",component:s,parameters:{layout:"padded",docs:{description:{component:"A high-level component managing multiple checkboxes with tri-state selection, optional select-all, and full accessibility via fieldset/legend."}}},tags:["autodocs"],argTypes:{label:{control:"text",description:"Group label rendered as legend",table:{type:{summary:"ReactNode"}}},options:{control:"object",description:"Array of checkbox options",table:{type:{summary:"CheckboxGroupOption[]"}}},value:{control:"object",description:"Controlled selected values",table:{type:{summary:"string[]"}}},defaultValue:{control:"object",description:"Initial values (uncontrolled)",table:{type:{summary:"string[]"}}},showSelectAll:{control:"boolean",description:"Show select all checkbox",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},selectAllLabel:{control:"text",description:"Label for select all checkbox",table:{type:{summary:"ReactNode"},defaultValue:{summary:'"Select all"'}}},disabled:{control:"boolean",description:"Disable all checkboxes",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},error:{control:"boolean",description:"Error state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},errorMessage:{control:"text",description:"Error message",table:{type:{summary:"ReactNode"}}},helperText:{control:"text",description:"Helper text",table:{type:{summary:"ReactNode"}}},required:{control:"boolean",description:"Required field",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},orientation:{control:"select",options:["vertical","horizontal"],description:"Layout orientation",table:{type:{summary:"'vertical' | 'horizontal'"},defaultValue:{summary:"'vertical'"}}}}},l=[{value:"email",label:"Email notifications"},{value:"sms",label:"SMS notifications"},{value:"push",label:"Push notifications"}],i=[{value:"technology",label:"Technology"},{value:"sports",label:"Sports"},{value:"music",label:"Music"},{value:"travel",label:"Travel"},{value:"food",label:"Food & Dining"}],$t=[{value:"read",label:"Read"},{value:"write",label:"Write"},{value:"delete",label:"Delete",disabled:!0},{value:"admin",label:"Admin"}],u={args:{label:"Notification Preferences",options:l}},m={args:{label:"Notification Preferences",options:l,defaultValue:["email","push"]}},p={args:{label:"Notification Preferences",options:l,helperText:"Choose how you want to receive updates"}},b={args:{label:"Your Interests",options:i,showSelectAll:!0,defaultValue:[]}},h={args:{label:"Your Interests",options:i,showSelectAll:!0,defaultValue:["technology","music"]}},g={args:{label:"Your Interests",options:i,showSelectAll:!0,defaultValue:["technology","sports","music","travel","food"]}},v={args:{label:"Your Interests",options:i,showSelectAll:!0,selectAllLabel:"Check all interests"}},x={render:function(){const[t,a]=r.useState(["technology"]);return e.jsxs("div",{children:[e.jsx(s,{label:"Your Interests",options:i,showSelectAll:!0,value:t,onChange:a}),e.jsxs("div",{className:"mt-3",children:[e.jsx("strong",{children:"Selected values:"}),e.jsx("pre",{className:"mt-2 p-2 bg-light rounded",children:JSON.stringify(t,null,2)})]})]})}},S={render:function(){const[t,a]=r.useState(["email"]);return e.jsxs("div",{children:[e.jsx(s,{label:"Notification Preferences",options:l,value:t,onChange:a}),e.jsxs("div",{className:"mt-3",children:[e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary me-2",onClick:()=>a([]),children:"Clear All"}),e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-primary",onClick:()=>a(["email","sms","push"]),children:"Select All"})]}),e.jsxs("p",{className:"mt-2 text-muted small",children:["Selected: ",t.length>0?t.join(", "):"None"]})]})}},f={args:{label:"Notification Preferences",options:l,defaultValue:["email"],disabled:!0}},y={args:{label:"File Permissions",options:$t,showSelectAll:!0,helperText:"Delete permission requires admin approval"}},N={render:function(){const[t,a]=r.useState(["read"]);return e.jsxs("div",{children:[e.jsx(s,{label:"File Permissions",options:$t,showSelectAll:!0,value:t,onChange:a}),e.jsxs("div",{className:"alert alert-info mt-3 small",children:[e.jsx("strong",{children:"Note:"}),` The "Delete" option is disabled and won't be affected by "Select all". Select all will toggle: Read, Write, Admin.`]}),e.jsxs("p",{className:"text-muted small",children:["Selected: ",t.length>0?t.join(", "):"None"]})]})}},j={args:{label:"Required Selection",options:l,error:!0,errorMessage:"Please select at least one notification method"}},C={args:{label:"Terms and Conditions",options:[{value:"terms",label:"I accept the terms and conditions"},{value:"privacy",label:"I accept the privacy policy"}],required:!0}},A={args:{label:"Quick Filters",options:[{value:"active",label:"Active"},{value:"pending",label:"Pending"},{value:"archived",label:"Archived"}],orientation:"horizontal"}},k={render:function(){const[t,a]=r.useState([]),n=t.length===0?"none":t.length===i.length?"all":"some";return e.jsxs("div",{children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("h5",{children:"FSM State Machine"}),e.jsxs("div",{className:"d-flex gap-3 align-items-center mb-3",children:[e.jsxs("div",{className:`p-2 rounded ${n==="none"?"bg-warning text-dark":"bg-light"}`,style:{minWidth:"80px",textAlign:"center"},children:[e.jsx("strong",{children:"none"}),e.jsx("div",{className:"small",children:"No items"})]}),e.jsx("div",{className:"text-muted",children:"→"}),e.jsxs("div",{className:`p-2 rounded ${n==="some"?"bg-info text-dark":"bg-light"}`,style:{minWidth:"80px",textAlign:"center"},children:[e.jsx("strong",{children:"some"}),e.jsx("div",{className:"small",children:"Partial"})]}),e.jsx("div",{className:"text-muted",children:"→"}),e.jsxs("div",{className:`p-2 rounded ${n==="all"?"bg-success text-white":"bg-light"}`,style:{minWidth:"80px",textAlign:"center"},children:[e.jsx("strong",{children:"all"}),e.jsx("div",{className:"small",children:"All items"})]})]}),e.jsxs("p",{className:"text-muted small",children:["Current state: ",e.jsx("code",{children:n})," | Selected: ",t.length,"/",i.length]})]}),e.jsx(s,{label:"Your Interests",options:i,showSelectAll:!0,value:t,onChange:a})]})}},w={render:function(){const[t,a]=r.useState(["email"]),[o,n]=r.useState([]),[T,O]=r.useState(!1),qt=Yt=>{Yt.preventDefault(),O(!0)};return e.jsxs("form",{onSubmit:qt,children:[e.jsx("div",{className:"mb-4",children:e.jsx(s,{label:"Notification Preferences",options:l,value:t,onChange:a,name:"notifications",required:!0})}),e.jsx("div",{className:"mb-4",children:e.jsx(s,{label:"Your Interests",options:i,showSelectAll:!0,value:o,onChange:n,name:"interests",helperText:"Select topics you're interested in"})}),e.jsx("button",{type:"submit",className:"btn btn-primary",children:"Submit"}),T&&e.jsxs("div",{className:"alert alert-success mt-3",children:[e.jsx("strong",{children:"Form Submitted!"}),e.jsx("pre",{className:"mb-0 mt-2",children:JSON.stringify({notifications:t,interests:o},null,2)})]})]})}},P={render:()=>e.jsxs("div",{className:"d-flex flex-column gap-4",children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Semantic HTML Structure"}),e.jsx("p",{className:"text-muted small",children:"CheckboxGroup renders as fieldset/legend for proper screen reader support."})]}),e.jsx(s,{label:"Notification Preferences",options:l,helperText:"Choose your preferred notification methods"}),e.jsxs("div",{className:"alert alert-info small",children:[e.jsx("strong",{children:"HTML Structure:"}),e.jsx("pre",{className:"mb-0 mt-2",children:`<fieldset aria-describedby="...">
  <legend>Notification Preferences</legend>
  <div id="...">Choose your preferred...</div>
  <input type="checkbox" ... />
  ...
</fieldset>`})]})]})},D={render:()=>e.jsxs("div",{className:"d-flex flex-column gap-4",children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Screen Reader Features"}),e.jsxs("ul",{className:"text-muted small",children:[e.jsxs("li",{children:[e.jsx(c,{size:14,className:"text-success me-1"}),"Group label announced as fieldset legend"]}),e.jsxs("li",{children:[e.jsx(c,{size:14,className:"text-success me-1"}),"Helper text linked via aria-describedby"]}),e.jsxs("li",{children:[e.jsx(c,{size:14,className:"text-success me-1"}),"Error state announced via aria-invalid"]}),e.jsxs("li",{children:[e.jsx(c,{size:14,className:"text-success me-1"}),'Select all announces "mixed" when indeterminate']})]})]}),e.jsx(s,{label:"With Helper Text",options:l,helperText:"Helper text is announced by screen readers",showSelectAll:!0,defaultValue:["email"]}),e.jsx(s,{label:"With Error State",options:l,error:!0,errorMessage:"Error message is announced when focused"})]})},W={render:()=>e.jsxs("div",{className:"d-flex flex-column gap-4",children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Development-Time Accessibility Warnings"}),e.jsx("p",{className:"text-muted small",children:"Open browser console to see warnings for missing accessible names."})]}),e.jsxs("div",{className:"alert alert-warning small",children:[e.jsx("strong",{children:"⚠️ Dev Warning"}),e.jsx("p",{className:"mb-0 mt-2",children:"A CheckboxGroup without `label` or `aria-label` will log:"}),e.jsx("code",{className:"d-block mt-2 p-2 bg-dark text-light rounded",children:'[DSAi CheckboxGroup] Missing accessible label. Provide either a "label" prop or an "aria-label" attribute.'})]}),e.jsxs("div",{children:[e.jsxs("h6",{className:"text-success",children:[e.jsx(c,{size:14,className:"me-1"}),"Correct Usage"]}),e.jsx(s,{label:"With visible label",options:l}),e.jsx(s,{"aria-label":"With aria-label",options:l})]})]})},F={render:()=>e.jsxs("div",{className:"d-flex flex-column gap-4",children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Security Features"}),e.jsx("p",{className:"text-muted small",children:"CheckboxGroup inherits security features from the Checkbox component."})]}),e.jsxs("ul",{className:"small",children:[e.jsxs("li",{children:[e.jsx(c,{size:14,className:"text-success me-1"}),"Safe attribute whitelist on input elements"]}),e.jsxs("li",{children:[e.jsx(c,{size:14,className:"text-success me-1"}),"Dangerous event handlers filtered (onLoad, onError, etc.)"]}),e.jsxs("li",{children:[e.jsx(Bt,{size:14,className:"text-danger me-1"}),"No unrestricted prop spreading"]})]}),e.jsx(s,{label:"Secure Checkbox Group",options:l,name:"secure-group"})]})},I={render:function(){const[t,a]=r.useState(["important","digest"]),[o,n]=r.useState(["profile"]);return e.jsxs("div",{className:"card",style:{maxWidth:"500px"},children:[e.jsx("div",{className:"card-header",children:e.jsx("h5",{className:"mb-0",children:"Account Settings"})}),e.jsxs("div",{className:"card-body",children:[e.jsx("div",{className:"mb-4",children:e.jsx(s,{label:"Email Notifications",options:[{value:"important",label:"Important updates"},{value:"digest",label:"Weekly digest"},{value:"marketing",label:"Marketing emails"},{value:"product",label:"Product announcements"}],showSelectAll:!0,value:t,onChange:a})}),e.jsx("hr",{}),e.jsx("div",{className:"mb-4",children:e.jsx(s,{label:"Privacy Settings",options:[{value:"profile",label:"Show my profile publicly"},{value:"activity",label:"Show my activity"},{value:"search",label:"Allow search engines to index"}],value:o,onChange:n,helperText:"Control who can see your information"})})]}),e.jsx("div",{className:"card-footer",children:e.jsx("button",{type:"button",className:"btn btn-primary",children:"Save Settings"})})]})}},G={render:function(){const[t,a]=r.useState([]),[o,n]=r.useState(["active"]),[T,O]=r.useState([]);return e.jsxs("div",{className:"card",style:{maxWidth:"280px"},children:[e.jsx("div",{className:"card-header",children:e.jsx("strong",{children:"Filters"})}),e.jsxs("div",{className:"card-body",children:[e.jsx("div",{className:"mb-3",children:e.jsx(s,{label:"Category",options:[{value:"electronics",label:"Electronics"},{value:"clothing",label:"Clothing"},{value:"books",label:"Books"},{value:"home",label:"Home & Garden"}],showSelectAll:!0,selectAllLabel:"All categories",value:t,onChange:a})}),e.jsx("hr",{}),e.jsx("div",{className:"mb-3",children:e.jsx(s,{label:"Status",options:[{value:"active",label:"In Stock"},{value:"backorder",label:"Backorder"},{value:"discontinued",label:"Discontinued",disabled:!0}],value:o,onChange:n})}),e.jsx("hr",{}),e.jsx("div",{className:"mb-3",children:e.jsx(s,{label:"Price Range",options:[{value:"under25",label:"Under $25"},{value:"25to50",label:"$25 - $50"},{value:"50to100",label:"$50 - $100"},{value:"over100",label:"Over $100"}],value:T,onChange:O})})]}),e.jsx("div",{className:"card-footer",children:e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary",onClick:()=>{a([]),n(["active"]),O([])},children:"Reset Filters"})})]})}};var E,R,M,z,V;u.parameters={...u.parameters,docs:{...(E=u.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    label: 'Notification Preferences',
    options: defaultOptions
  }
}`,...(M=(R=u.parameters)==null?void 0:R.docs)==null?void 0:M.source},description:{story:"Default CheckboxGroup with label and options",...(V=(z=u.parameters)==null?void 0:z.docs)==null?void 0:V.description}}};var L,H,$,q,Y;m.parameters={...m.parameters,docs:{...(L=m.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    label: 'Notification Preferences',
    options: defaultOptions,
    defaultValue: ['email', 'push']
  }
}`,...($=(H=m.parameters)==null?void 0:H.docs)==null?void 0:$.source},description:{story:"With default values selected",...(Y=(q=m.parameters)==null?void 0:q.docs)==null?void 0:Y.description}}};var B,J,U,Q,X;p.parameters={...p.parameters,docs:{...(B=p.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    label: 'Notification Preferences',
    options: defaultOptions,
    helperText: 'Choose how you want to receive updates'
  }
}`,...(U=(J=p.parameters)==null?void 0:J.docs)==null?void 0:U.source},description:{story:"With helper text",...(X=(Q=p.parameters)==null?void 0:Q.docs)==null?void 0:X.description}}};var _,K,Z,ee,te;b.parameters={...b.parameters,docs:{...(_=b.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    label: 'Your Interests',
    options: interestOptions,
    showSelectAll: true,
    defaultValue: []
  }
}`,...(Z=(K=b.parameters)==null?void 0:K.docs)==null?void 0:Z.source},description:{story:"With select all checkbox - shows none selected state",...(te=(ee=b.parameters)==null?void 0:ee.docs)==null?void 0:te.description}}};var se,ae,le,re,ne;h.parameters={...h.parameters,docs:{...(se=h.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    label: 'Your Interests',
    options: interestOptions,
    showSelectAll: true,
    defaultValue: ['technology', 'music']
  }
}`,...(le=(ae=h.parameters)==null?void 0:ae.docs)==null?void 0:le.source},description:{story:"With select all checkbox - shows some selected (indeterminate) state",...(ne=(re=h.parameters)==null?void 0:re.docs)==null?void 0:ne.description}}};var ie,oe,ce,de,ue;g.parameters={...g.parameters,docs:{...(ie=g.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  args: {
    label: 'Your Interests',
    options: interestOptions,
    showSelectAll: true,
    defaultValue: ['technology', 'sports', 'music', 'travel', 'food']
  }
}`,...(ce=(oe=g.parameters)==null?void 0:oe.docs)==null?void 0:ce.source},description:{story:"With select all checkbox - shows all selected state",...(ue=(de=g.parameters)==null?void 0:de.docs)==null?void 0:ue.description}}};var me,pe,be,he,ge;v.parameters={...v.parameters,docs:{...(me=v.parameters)==null?void 0:me.docs,source:{originalSource:`{
  args: {
    label: 'Your Interests',
    options: interestOptions,
    showSelectAll: true,
    selectAllLabel: 'Check all interests'
  }
}`,...(be=(pe=v.parameters)==null?void 0:pe.docs)==null?void 0:be.source},description:{story:"Custom select all label",...(ge=(he=v.parameters)==null?void 0:he.docs)==null?void 0:ge.description}}};var ve,xe,Se,fe,ye;x.parameters={...x.parameters,docs:{...(ve=x.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  render: function SelectAllDemo() {
    const [selected, setSelected] = useState<string[]>(['technology']);
    return <div>
        <CheckboxGroup label="Your Interests" options={interestOptions} showSelectAll value={selected} onChange={setSelected} />
        <div className="mt-3">
          <strong>Selected values:</strong>
          <pre className="mt-2 p-2 bg-light rounded">{JSON.stringify(selected, null, 2)}</pre>
        </div>
      </div>;
  }
}`,...(Se=(xe=x.parameters)==null?void 0:xe.docs)==null?void 0:Se.source},description:{story:"Interactive select all demo",...(ye=(fe=x.parameters)==null?void 0:fe.docs)==null?void 0:ye.description}}};var Ne,je,Ce,Ae,ke;S.parameters={...S.parameters,docs:{...(Ne=S.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  render: function ControlledGroup() {
    const [selected, setSelected] = useState<string[]>(['email']);
    return <div>
        <CheckboxGroup label="Notification Preferences" options={defaultOptions} value={selected} onChange={setSelected} />
        <div className="mt-3">
          <button type="button" className="btn btn-sm btn-outline-secondary me-2" onClick={() => setSelected([])}>
            Clear All
          </button>
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setSelected(['email', 'sms', 'push'])}>
            Select All
          </button>
        </div>
        <p className="mt-2 text-muted small">
          Selected: {selected.length > 0 ? selected.join(', ') : 'None'}
        </p>
      </div>;
  }
}`,...(Ce=(je=S.parameters)==null?void 0:je.docs)==null?void 0:Ce.source},description:{story:"Fully controlled with state",...(ke=(Ae=S.parameters)==null?void 0:Ae.docs)==null?void 0:ke.description}}};var we,Pe,De,We,Fe;f.parameters={...f.parameters,docs:{...(we=f.parameters)==null?void 0:we.docs,source:{originalSource:`{
  args: {
    label: 'Notification Preferences',
    options: defaultOptions,
    defaultValue: ['email'],
    disabled: true
  }
}`,...(De=(Pe=f.parameters)==null?void 0:Pe.docs)==null?void 0:De.source},description:{story:"Entire group disabled",...(Fe=(We=f.parameters)==null?void 0:We.docs)==null?void 0:Fe.description}}};var Ie,Ge,Oe,Te,Ee;y.parameters={...y.parameters,docs:{...(Ie=y.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  args: {
    label: 'File Permissions',
    options: permissionOptions,
    showSelectAll: true,
    helperText: 'Delete permission requires admin approval'
  }
}`,...(Oe=(Ge=y.parameters)==null?void 0:Ge.docs)==null?void 0:Oe.source},description:{story:"Individual options disabled",...(Ee=(Te=y.parameters)==null?void 0:Te.docs)==null?void 0:Ee.description}}};var Re,Me,ze,Ve,Le;N.parameters={...N.parameters,docs:{...(Re=N.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  render: function SelectAllDisabledDemo() {
    const [selected, setSelected] = useState<string[]>(['read']);
    return <div>
        <CheckboxGroup label="File Permissions" options={permissionOptions} showSelectAll value={selected} onChange={setSelected} />
        <div className="alert alert-info mt-3 small">
          <strong>Note:</strong> The "Delete" option is disabled and won't be affected by "Select
          all". Select all will toggle: Read, Write, Admin.
        </div>
        <p className="text-muted small">
          Selected: {selected.length > 0 ? selected.join(', ') : 'None'}
        </p>
      </div>;
  }
}`,...(ze=(Me=N.parameters)==null?void 0:Me.docs)==null?void 0:ze.source},description:{story:`Select all with disabled options

When some options are disabled:
- Select all only toggles enabled items
- Disabled items are excluded from the count`,...(Le=(Ve=N.parameters)==null?void 0:Ve.docs)==null?void 0:Le.description}}};var He,$e,qe,Ye,Be;j.parameters={...j.parameters,docs:{...(He=j.parameters)==null?void 0:He.docs,source:{originalSource:`{
  args: {
    label: 'Required Selection',
    options: defaultOptions,
    error: true,
    errorMessage: 'Please select at least one notification method'
  }
}`,...(qe=($e=j.parameters)==null?void 0:$e.docs)==null?void 0:qe.source},description:{story:"Error state with message",...(Be=(Ye=j.parameters)==null?void 0:Ye.docs)==null?void 0:Be.description}}};var Je,Ue,Qe,Xe,_e;C.parameters={...C.parameters,docs:{...(Je=C.parameters)==null?void 0:Je.docs,source:{originalSource:`{
  args: {
    label: 'Terms and Conditions',
    options: [{
      value: 'terms',
      label: 'I accept the terms and conditions'
    }, {
      value: 'privacy',
      label: 'I accept the privacy policy'
    }],
    required: true
  }
}`,...(Qe=(Ue=C.parameters)==null?void 0:Ue.docs)==null?void 0:Qe.source},description:{story:"Required field",...(_e=(Xe=C.parameters)==null?void 0:Xe.docs)==null?void 0:_e.description}}};var Ke,Ze,et,tt,st;A.parameters={...A.parameters,docs:{...(Ke=A.parameters)==null?void 0:Ke.docs,source:{originalSource:`{
  args: {
    label: 'Quick Filters',
    options: [{
      value: 'active',
      label: 'Active'
    }, {
      value: 'pending',
      label: 'Pending'
    }, {
      value: 'archived',
      label: 'Archived'
    }],
    orientation: 'horizontal'
  }
}`,...(et=(Ze=A.parameters)==null?void 0:Ze.docs)==null?void 0:et.source},description:{story:"Horizontal layout",...(st=(tt=A.parameters)==null?void 0:tt.docs)==null?void 0:st.description}}};var at,lt,rt,nt,it;k.parameters={...k.parameters,docs:{...(at=k.parameters)==null?void 0:at.docs,source:{originalSource:`{
  render: function FSMDemo() {
    const [selected, setSelected] = useState<string[]>([]);
    const getState = () => {
      if (selected.length === 0) return 'none';
      if (selected.length === interestOptions.length) return 'all';
      return 'some';
    };
    const state = getState();
    return <div>
        <div className="mb-4">
          <h5>FSM State Machine</h5>
          <div className="d-flex gap-3 align-items-center mb-3">
            <div className={\`p-2 rounded \${state === 'none' ? 'bg-warning text-dark' : 'bg-light'}\`} style={{
            minWidth: '80px',
            textAlign: 'center'
          }}>
              <strong>none</strong>
              <div className="small">No items</div>
            </div>
            <div className="text-muted">→</div>
            <div className={\`p-2 rounded \${state === 'some' ? 'bg-info text-dark' : 'bg-light'}\`} style={{
            minWidth: '80px',
            textAlign: 'center'
          }}>
              <strong>some</strong>
              <div className="small">Partial</div>
            </div>
            <div className="text-muted">→</div>
            <div className={\`p-2 rounded \${state === 'all' ? 'bg-success text-white' : 'bg-light'}\`} style={{
            minWidth: '80px',
            textAlign: 'center'
          }}>
              <strong>all</strong>
              <div className="small">All items</div>
            </div>
          </div>
          <p className="text-muted small">
            Current state: <code>{state}</code> | Selected: {selected.length}/
            {interestOptions.length}
          </p>
        </div>

        <CheckboxGroup label="Your Interests" options={interestOptions} showSelectAll value={selected} onChange={setSelected} />
      </div>;
  }
}`,...(rt=(lt=k.parameters)==null?void 0:lt.docs)==null?void 0:rt.source},description:{story:`FSM State Diagram

The CheckboxGroup uses a Finite State Machine (FSM) to manage selection state.
This demo visualizes the current FSM state.`,...(it=(nt=k.parameters)==null?void 0:nt.docs)==null?void 0:it.description}}};var ot,ct,dt,ut,mt;w.parameters={...w.parameters,docs:{...(ot=w.parameters)==null?void 0:ot.docs,source:{originalSource:`{
  render: function FormDemo() {
    const [notifications, setNotifications] = useState<string[]>(['email']);
    const [interests, setInterests] = useState<string[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
    };
    return <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <CheckboxGroup label="Notification Preferences" options={defaultOptions} value={notifications} onChange={setNotifications} name="notifications" required />
        </div>

        <div className="mb-4">
          <CheckboxGroup label="Your Interests" options={interestOptions} showSelectAll value={interests} onChange={setInterests} name="interests" helperText="Select topics you're interested in" />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>

        {submitted && <div className="alert alert-success mt-3">
            <strong>Form Submitted!</strong>
            <pre className="mb-0 mt-2">{JSON.stringify({
            notifications,
            interests
          }, null, 2)}</pre>
          </div>}
      </form>;
  }
}`,...(dt=(ct=w.parameters)==null?void 0:ct.docs)==null?void 0:dt.source},description:{story:"Form submission example",...(mt=(ut=w.parameters)==null?void 0:ut.docs)==null?void 0:mt.description}}};var pt,bt,ht,gt,vt;P.parameters={...P.parameters,docs:{...(pt=P.parameters)==null?void 0:pt.docs,source:{originalSource:`{
  render: () => <div className="d-flex flex-column gap-4">
      <div>
        <h5>Semantic HTML Structure</h5>
        <p className="text-muted small">
          CheckboxGroup renders as fieldset/legend for proper screen reader support.
        </p>
      </div>

      <CheckboxGroup label="Notification Preferences" options={defaultOptions} helperText="Choose your preferred notification methods" />

      <div className="alert alert-info small">
        <strong>HTML Structure:</strong>
        <pre className="mb-0 mt-2">{\`<fieldset aria-describedby="...">
  <legend>Notification Preferences</legend>
  <div id="...">Choose your preferred...</div>
  <input type="checkbox" ... />
  ...
</fieldset>\`}</pre>
      </div>
    </div>
}`,...(ht=(bt=P.parameters)==null?void 0:bt.docs)==null?void 0:ht.source},description:{story:"Accessibility: Fieldset/Legend Pattern\n\nThe CheckboxGroup uses semantic HTML for accessibility:\n- `<fieldset>` groups related checkboxes\n- `<legend>` provides the group label\n- `aria-describedby` links to helper/error text\n- `aria-invalid` for error state\n- Native `required` on checkbox inputs when `required` prop is set",...(vt=(gt=P.parameters)==null?void 0:gt.docs)==null?void 0:vt.description}}};var xt,St,ft,yt,Nt;D.parameters={...D.parameters,docs:{...(xt=D.parameters)==null?void 0:xt.docs,source:{originalSource:`{
  render: () => <div className="d-flex flex-column gap-4">
      <div>
        <h5>Screen Reader Features</h5>
        <ul className="text-muted small">
          <li>
            <CheckIcon size={14} className="text-success me-1" />
            Group label announced as fieldset legend
          </li>
          <li>
            <CheckIcon size={14} className="text-success me-1" />
            Helper text linked via aria-describedby
          </li>
          <li>
            <CheckIcon size={14} className="text-success me-1" />
            Error state announced via aria-invalid
          </li>
          <li>
            <CheckIcon size={14} className="text-success me-1" />
            Select all announces "mixed" when indeterminate
          </li>
        </ul>
      </div>

      <CheckboxGroup label="With Helper Text" options={defaultOptions} helperText="Helper text is announced by screen readers" showSelectAll defaultValue={['email']} />

      <CheckboxGroup label="With Error State" options={defaultOptions} error errorMessage="Error message is announced when focused" />
    </div>
}`,...(ft=(St=D.parameters)==null?void 0:St.docs)==null?void 0:ft.source},description:{story:`Accessibility: Screen Reader Support

Proper ARIA attributes ensure screen reader compatibility:
- Group announced with label
- Individual checkboxes properly labeled
- Error/helper text associated via aria-describedby
- Select all announces "mixed" state when indeterminate`,...(Nt=(yt=D.parameters)==null?void 0:yt.docs)==null?void 0:Nt.description}}};var jt,Ct,At,kt,wt;W.parameters={...W.parameters,docs:{...(jt=W.parameters)==null?void 0:jt.docs,source:{originalSource:`{
  render: () => <div className="d-flex flex-column gap-4">
      <div>
        <h5>Development-Time Accessibility Warnings</h5>
        <p className="text-muted small">
          Open browser console to see warnings for missing accessible names.
        </p>
      </div>

      <div className="alert alert-warning small">
        <strong>⚠️ Dev Warning</strong>
        <p className="mb-0 mt-2">A CheckboxGroup without \`label\` or \`aria-label\` will log:</p>
        <code className="d-block mt-2 p-2 bg-dark text-light rounded">
          [DSAi CheckboxGroup] Missing accessible label. Provide either a "label" prop or an
          "aria-label" attribute.
        </code>
      </div>

      <div>
        <h6 className="text-success">
          <CheckIcon size={14} className="me-1" />
          Correct Usage
        </h6>
        <CheckboxGroup label="With visible label" options={defaultOptions} />
        <CheckboxGroup aria-label="With aria-label" options={defaultOptions} />
      </div>
    </div>
}`,...(At=(Ct=W.parameters)==null?void 0:Ct.docs)==null?void 0:At.source},description:{story:"Accessibility: Development Warnings\n\nThe component warns in development when accessibility best practices aren't followed:\n- Warns when no `label` or `aria-label` is provided\n- Warning only appears once per component instance",...(wt=(kt=W.parameters)==null?void 0:kt.docs)==null?void 0:wt.description}}};var Pt,Dt,Wt,Ft,It;F.parameters={...F.parameters,docs:{...(Pt=F.parameters)==null?void 0:Pt.docs,source:{originalSource:`{
  render: () => <div className="d-flex flex-column gap-4">
      <div>
        <h5>Security Features</h5>
        <p className="text-muted small">
          CheckboxGroup inherits security features from the Checkbox component.
        </p>
      </div>

      <ul className="small">
        <li>
          <CheckIcon size={14} className="text-success me-1" />
          Safe attribute whitelist on input elements
        </li>
        <li>
          <CheckIcon size={14} className="text-success me-1" />
          Dangerous event handlers filtered (onLoad, onError, etc.)
        </li>
        <li>
          <XLgIcon size={14} className="text-danger me-1" />
          No unrestricted prop spreading
        </li>
      </ul>

      <CheckboxGroup label="Secure Checkbox Group" options={defaultOptions} name="secure-group" />
    </div>
}`,...(Wt=(Dt=F.parameters)==null?void 0:Dt.docs)==null?void 0:Wt.source},description:{story:`Security: Safe Attribute Handling

The underlying Checkbox components use a whitelist of safe HTML attributes.
This prevents dangerous event handlers from being injected.`,...(It=(Ft=F.parameters)==null?void 0:Ft.docs)==null?void 0:It.description}}};var Gt,Ot,Tt,Et,Rt;I.parameters={...I.parameters,docs:{...(Gt=I.parameters)==null?void 0:Gt.docs,source:{originalSource:`{
  render: function SettingsPage() {
    const [emailSettings, setEmailSettings] = useState(['important', 'digest']);
    const [privacySettings, setPrivacySettings] = useState(['profile']);
    return <div className="card" style={{
      maxWidth: '500px'
    }}>
        <div className="card-header">
          <h5 className="mb-0">Account Settings</h5>
        </div>
        <div className="card-body">
          <div className="mb-4">
            <CheckboxGroup label="Email Notifications" options={[{
            value: 'important',
            label: 'Important updates'
          }, {
            value: 'digest',
            label: 'Weekly digest'
          }, {
            value: 'marketing',
            label: 'Marketing emails'
          }, {
            value: 'product',
            label: 'Product announcements'
          }]} showSelectAll value={emailSettings} onChange={setEmailSettings} />
          </div>

          <hr />

          <div className="mb-4">
            <CheckboxGroup label="Privacy Settings" options={[{
            value: 'profile',
            label: 'Show my profile publicly'
          }, {
            value: 'activity',
            label: 'Show my activity'
          }, {
            value: 'search',
            label: 'Allow search engines to index'
          }]} value={privacySettings} onChange={setPrivacySettings} helperText="Control who can see your information" />
          </div>
        </div>
        <div className="card-footer">
          <button type="button" className="btn btn-primary">
            Save Settings
          </button>
        </div>
      </div>;
  }
}`,...(Tt=(Ot=I.parameters)==null?void 0:Ot.docs)==null?void 0:Tt.source},description:{story:"Settings page example",...(Rt=(Et=I.parameters)==null?void 0:Et.docs)==null?void 0:Rt.description}}};var Mt,zt,Vt,Lt,Ht;G.parameters={...G.parameters,docs:{...(Mt=G.parameters)==null?void 0:Mt.docs,source:{originalSource:`{
  render: function FilterPanel() {
    const [categories, setCategories] = useState<string[]>([]);
    const [status, setStatus] = useState<string[]>(['active']);
    const [priceRange, setPriceRange] = useState<string[]>([]);
    return <div className="card" style={{
      maxWidth: '280px'
    }}>
        <div className="card-header">
          <strong>Filters</strong>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <CheckboxGroup label="Category" options={[{
            value: 'electronics',
            label: 'Electronics'
          }, {
            value: 'clothing',
            label: 'Clothing'
          }, {
            value: 'books',
            label: 'Books'
          }, {
            value: 'home',
            label: 'Home & Garden'
          }]} showSelectAll selectAllLabel="All categories" value={categories} onChange={setCategories} />
          </div>

          <hr />

          <div className="mb-3">
            <CheckboxGroup label="Status" options={[{
            value: 'active',
            label: 'In Stock'
          }, {
            value: 'backorder',
            label: 'Backorder'
          }, {
            value: 'discontinued',
            label: 'Discontinued',
            disabled: true
          }]} value={status} onChange={setStatus} />
          </div>

          <hr />

          <div className="mb-3">
            <CheckboxGroup label="Price Range" options={[{
            value: 'under25',
            label: 'Under $25'
          }, {
            value: '25to50',
            label: '$25 - $50'
          }, {
            value: '50to100',
            label: '$50 - $100'
          }, {
            value: 'over100',
            label: 'Over $100'
          }]} value={priceRange} onChange={setPriceRange} />
          </div>
        </div>
        <div className="card-footer">
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => {
          setCategories([]);
          setStatus(['active']);
          setPriceRange([]);
        }}>
            Reset Filters
          </button>
        </div>
      </div>;
  }
}`,...(Vt=(zt=G.parameters)==null?void 0:zt.docs)==null?void 0:Vt.source},description:{story:"Filter panel example",...(Ht=(Lt=G.parameters)==null?void 0:Lt.docs)==null?void 0:Ht.description}}};const Kt=["Default","WithDefaultValues","WithHelperText","SelectAllNone","SelectAllSome","SelectAllAll","CustomSelectAllLabel","SelectAllInteractive","Controlled","Disabled","DisabledOptions","SelectAllWithDisabled","ErrorState","Required","Horizontal","FSMStateVisualization","FormExample","AccessibilityFieldsetLegend","AccessibilityScreenReader","AccessibilityDevWarnings","SecuritySafeAttributes","SettingsPageExample","FilterPanelExample"];export{W as AccessibilityDevWarnings,P as AccessibilityFieldsetLegend,D as AccessibilityScreenReader,S as Controlled,v as CustomSelectAllLabel,u as Default,f as Disabled,y as DisabledOptions,j as ErrorState,k as FSMStateVisualization,G as FilterPanelExample,w as FormExample,A as Horizontal,C as Required,F as SecuritySafeAttributes,g as SelectAllAll,x as SelectAllInteractive,b as SelectAllNone,h as SelectAllSome,N as SelectAllWithDisabled,I as SettingsPageExample,m as WithDefaultValues,p as WithHelperText,Kt as __namedExportsOrder,_t as default};
