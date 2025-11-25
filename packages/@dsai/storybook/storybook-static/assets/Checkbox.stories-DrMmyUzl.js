import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as T}from"./iframe-DYCjOLB1.js";import{C as t}from"./Input-CZySCis-.js";import"./preload-helper-Dp1pzeXC.js";const Pt={title:"Components/Checkbox",component:t,parameters:{layout:"padded",docs:{description:{component:"A Bootstrap 5 checkbox component supporting controlled and uncontrolled modes, indeterminate state, switch styling, error states, and full accessibility."}}},tags:["autodocs"],argTypes:{label:{control:"text",description:"Checkbox label text",table:{type:{summary:"ReactNode"}}},checked:{control:"boolean",description:"Controlled checked state",table:{type:{summary:"boolean"}}},defaultChecked:{control:"boolean",description:"Initial checked state (uncontrolled)",table:{type:{summary:"boolean"}}},indeterminate:{control:"boolean",description:"Indeterminate (partial) state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},disabled:{control:"boolean",description:"Disabled state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},error:{control:"boolean",description:"Error state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},helperText:{control:"text",description:"Helper or error message",table:{type:{summary:"string"}}},inline:{control:"boolean",description:"Inline display",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},reverse:{control:"boolean",description:"Reverse label/checkbox order",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},switch:{control:"boolean",description:"Switch toggle style",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},required:{control:"boolean",description:"Required field",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}}},i={args:{label:"Accept terms and conditions"}},n={args:{label:"Remember me",defaultChecked:!0}},d={args:{"aria-label":"Select row"}},m={render:function(){const[r,s]=T.useState(!1);return e.jsxs("div",{children:[e.jsx(t,{checked:r,onChange:o=>s(o.target.checked),label:`Checkbox is ${r?"checked":"unchecked"}`}),e.jsxs("p",{className:"mt-2 small text-muted",children:["State: ",r?"true":"false"]})]})}},h={args:{indeterminate:!0,label:"Select all"}},p={render:function(){const[r,s]=T.useState([{id:1,label:"Item 1",checked:!1},{id:2,label:"Item 2",checked:!0},{id:3,label:"Item 3",checked:!1}]),o=r.every(a=>a.checked),Ot=r.some(a=>a.checked)&&!o,Tt=()=>{const a=!o;s(r.map(c=>({...c,checked:a})))},Et=a=>{s(r.map(c=>c.id===a?{...c,checked:!c.checked}:c))};return e.jsxs("div",{children:[e.jsx(t,{indeterminate:Ot,checked:o,onChange:Tt,label:"Select all"}),e.jsx("div",{className:"ms-4 mt-2",children:r.map(a=>e.jsx(t,{checked:a.checked,onChange:()=>Et(a.id),label:a.label},a.id))})]})}},u={args:{switch:!0,label:"Enable notifications"}},b={args:{switch:!0,label:"Dark mode",defaultChecked:!0}},x={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(t,{switch:!0,label:"Email notifications",defaultChecked:!0}),e.jsx(t,{switch:!0,label:"Push notifications"}),e.jsx(t,{switch:!0,label:"SMS notifications",disabled:!0})]})},k={args:{label:"Disabled checkbox",disabled:!0}},f={args:{label:"Disabled checked",disabled:!0,defaultChecked:!0}},g={args:{label:"I agree to the terms",error:!0,helperText:"You must accept the terms to continue"}},y={args:{label:"I accept the privacy policy",required:!0}},C={args:{label:"Subscribe to newsletter",helperText:"We'll send you updates about new features and promotions"}},S={args:{label:"Accept terms",error:!0,helperText:"This field is required"}},v={render:()=>e.jsxs("div",{children:[e.jsx(t,{inline:!0,label:"Option 1"}),e.jsx(t,{inline:!0,label:"Option 2"}),e.jsx(t,{inline:!0,label:"Option 3"})]})},w={args:{reverse:!0,label:"Label on the left"}},j={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.25rem"},children:[e.jsx(t,{label:"Option 1",defaultChecked:!0}),e.jsx(t,{label:"Option 2"}),e.jsx(t,{label:"Option 3"}),e.jsx(t,{label:"Option 4",disabled:!0})]})},D={render:function(){const[r,s]=T.useState({terms:!1,newsletter:!0,marketing:!1}),o=l=>{l.preventDefault(),alert(JSON.stringify(r,null,2))};return e.jsxs("form",{onSubmit:o,children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(t,{name:"terms",checked:r.terms,onChange:l=>s({...r,terms:l.target.checked}),label:"I accept the terms and conditions",required:!0}),e.jsx(t,{name:"newsletter",checked:r.newsletter,onChange:l=>s({...r,newsletter:l.target.checked}),label:"Subscribe to newsletter",helperText:"Get weekly updates about new features"}),e.jsx(t,{name:"marketing",checked:r.marketing,onChange:l=>s({...r,marketing:l.target.checked}),label:"Receive marketing emails"})]}),e.jsx("button",{type:"submit",className:"btn btn-primary mt-3",children:"Submit"})]})}},I={render:()=>e.jsxs("fieldset",{children:[e.jsx("legend",{className:"h6",children:"Select your interests"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.25rem"},children:[e.jsx(t,{name:"interests",value:"technology",label:"Technology"}),e.jsx(t,{name:"interests",value:"sports",label:"Sports"}),e.jsx(t,{name:"interests",value:"music",label:"Music"}),e.jsx(t,{name:"interests",value:"travel",label:"Travel"})]})]})},O={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Basic States"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(t,{label:"Unchecked"}),e.jsx(t,{label:"Checked",defaultChecked:!0}),e.jsx(t,{label:"Indeterminate",indeterminate:!0}),e.jsx(t,{label:"Disabled",disabled:!0}),e.jsx(t,{label:"Disabled checked",disabled:!0,defaultChecked:!0})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Switch Style"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(t,{switch:!0,label:"Off"}),e.jsx(t,{switch:!0,label:"On",defaultChecked:!0}),e.jsx(t,{switch:!0,label:"Disabled",disabled:!0})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Validation"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(t,{label:"Required field",required:!0}),e.jsx(t,{label:"With error",error:!0,helperText:"This field is required"}),e.jsx(t,{label:"With helper",helperText:"Optional helper text"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Inline Layout"}),e.jsxs("div",{children:[e.jsx(t,{inline:!0,label:"Option A"}),e.jsx(t,{inline:!0,label:"Option B"}),e.jsx(t,{inline:!0,label:"Option C"})]})]})]})};var q,R,B,W,P;i.parameters={...i.parameters,docs:{...(q=i.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    label: 'Accept terms and conditions'
  }
}`,...(B=(R=i.parameters)==null?void 0:R.docs)==null?void 0:B.source},description:{story:"Default checkbox with label",...(P=(W=i.parameters)==null?void 0:W.docs)==null?void 0:P.description}}};var F,N,V,A,L;n.parameters={...n.parameters,docs:{...(F=n.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    label: 'Remember me',
    defaultChecked: true
  }
}`,...(V=(N=n.parameters)==null?void 0:N.docs)==null?void 0:V.source},description:{story:"Checkbox with default checked state",...(L=(A=n.parameters)==null?void 0:A.docs)==null?void 0:L.description}}};var M,H,G,J,U;d.parameters={...d.parameters,docs:{...(M=d.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Select row'
  }
}`,...(G=(H=d.parameters)==null?void 0:H.docs)==null?void 0:G.source},description:{story:"Checkbox without label (uses aria-label)",...(U=(J=d.parameters)==null?void 0:J.docs)==null?void 0:U.description}}};var Y,_,$,z,K;m.parameters={...m.parameters,docs:{...(Y=m.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: function ControlledCheckbox() {
    const [checked, setChecked] = useState(false);
    return <div>
        <Checkbox checked={checked} onChange={e => setChecked(e.target.checked)} label={\`Checkbox is \${checked ? 'checked' : 'unchecked'}\`} />
        <p className="mt-2 small text-muted">State: {checked ? 'true' : 'false'}</p>
      </div>;
  }
}`,...($=(_=m.parameters)==null?void 0:_.docs)==null?void 0:$.source},description:{story:"Controlled checkbox with state",...(K=(z=m.parameters)==null?void 0:z.docs)==null?void 0:K.description}}};var Q,X,Z,ee,te;h.parameters={...h.parameters,docs:{...(Q=h.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    indeterminate: true,
    label: 'Select all'
  }
}`,...(Z=(X=h.parameters)==null?void 0:X.docs)==null?void 0:Z.source},description:{story:"Indeterminate state for parent checkboxes",...(te=(ee=h.parameters)==null?void 0:ee.docs)==null?void 0:te.description}}};var re,ae,se,le,oe;p.parameters={...p.parameters,docs:{...(re=p.parameters)==null?void 0:re.docs,source:{originalSource:`{
  render: function ParentChild() {
    const [items, setItems] = useState([{
      id: 1,
      label: 'Item 1',
      checked: false
    }, {
      id: 2,
      label: 'Item 2',
      checked: true
    }, {
      id: 3,
      label: 'Item 3',
      checked: false
    }]);
    const allChecked = items.every(item => item.checked);
    const someChecked = items.some(item => item.checked);
    const isIndeterminate = someChecked && !allChecked;
    const handleParentChange = () => {
      const newChecked = !allChecked;
      setItems(items.map(item => ({
        ...item,
        checked: newChecked
      })));
    };
    const handleChildChange = (id: number) => {
      setItems(items.map(item => item.id === id ? {
        ...item,
        checked: !item.checked
      } : item));
    };
    return <div>
        <Checkbox indeterminate={isIndeterminate} checked={allChecked} onChange={handleParentChange} label="Select all" />
        <div className="ms-4 mt-2">
          {items.map(item => <Checkbox key={item.id} checked={item.checked} onChange={() => handleChildChange(item.id)} label={item.label} />)}
        </div>
      </div>;
  }
}`,...(se=(ae=p.parameters)==null?void 0:ae.docs)==null?void 0:se.source},description:{story:"Parent-child checkbox pattern",...(oe=(le=p.parameters)==null?void 0:le.docs)==null?void 0:oe.description}}};var ce,ie,ne,de,me;u.parameters={...u.parameters,docs:{...(ce=u.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {
    switch: true,
    label: 'Enable notifications'
  }
}`,...(ne=(ie=u.parameters)==null?void 0:ie.docs)==null?void 0:ne.source},description:{story:"Switch toggle style",...(me=(de=u.parameters)==null?void 0:de.docs)==null?void 0:me.description}}};var he,pe,ue,be,xe;b.parameters={...b.parameters,docs:{...(he=b.parameters)==null?void 0:he.docs,source:{originalSource:`{
  args: {
    switch: true,
    label: 'Dark mode',
    defaultChecked: true
  }
}`,...(ue=(pe=b.parameters)==null?void 0:pe.docs)==null?void 0:ue.source},description:{story:"Switch with default checked",...(xe=(be=b.parameters)==null?void 0:be.docs)==null?void 0:xe.description}}};var ke,fe,ge,ye,Ce;x.parameters={...x.parameters,docs:{...(ke=x.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  }}>
      <Checkbox switch label="Email notifications" defaultChecked />
      <Checkbox switch label="Push notifications" />
      <Checkbox switch label="SMS notifications" disabled />
    </div>
}`,...(ge=(fe=x.parameters)==null?void 0:fe.docs)==null?void 0:ge.source},description:{story:"Multiple switches",...(Ce=(ye=x.parameters)==null?void 0:ye.docs)==null?void 0:Ce.description}}};var Se,ve,we,je,De;k.parameters={...k.parameters,docs:{...(Se=k.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  args: {
    label: 'Disabled checkbox',
    disabled: true
  }
}`,...(we=(ve=k.parameters)==null?void 0:ve.docs)==null?void 0:we.source},description:{story:"Disabled checkbox",...(De=(je=k.parameters)==null?void 0:je.docs)==null?void 0:De.description}}};var Ie,Oe,Te,Ee,qe;f.parameters={...f.parameters,docs:{...(Ie=f.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  args: {
    label: 'Disabled checked',
    disabled: true,
    defaultChecked: true
  }
}`,...(Te=(Oe=f.parameters)==null?void 0:Oe.docs)==null?void 0:Te.source},description:{story:"Disabled and checked",...(qe=(Ee=f.parameters)==null?void 0:Ee.docs)==null?void 0:qe.description}}};var Re,Be,We,Pe,Fe;g.parameters={...g.parameters,docs:{...(Re=g.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  args: {
    label: 'I agree to the terms',
    error: true,
    helperText: 'You must accept the terms to continue'
  }
}`,...(We=(Be=g.parameters)==null?void 0:Be.docs)==null?void 0:We.source},description:{story:"Error state",...(Fe=(Pe=g.parameters)==null?void 0:Pe.docs)==null?void 0:Fe.description}}};var Ne,Ve,Ae,Le,Me;y.parameters={...y.parameters,docs:{...(Ne=y.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  args: {
    label: 'I accept the privacy policy',
    required: true
  }
}`,...(Ae=(Ve=y.parameters)==null?void 0:Ve.docs)==null?void 0:Ae.source},description:{story:"Required field",...(Me=(Le=y.parameters)==null?void 0:Le.docs)==null?void 0:Me.description}}};var He,Ge,Je,Ue,Ye;C.parameters={...C.parameters,docs:{...(He=C.parameters)==null?void 0:He.docs,source:{originalSource:`{
  args: {
    label: 'Subscribe to newsletter',
    helperText: "We'll send you updates about new features and promotions"
  }
}`,...(Je=(Ge=C.parameters)==null?void 0:Ge.docs)==null?void 0:Je.source},description:{story:"With helper text",...(Ye=(Ue=C.parameters)==null?void 0:Ue.docs)==null?void 0:Ye.description}}};var _e,$e,ze,Ke,Qe;S.parameters={...S.parameters,docs:{...(_e=S.parameters)==null?void 0:_e.docs,source:{originalSource:`{
  args: {
    label: 'Accept terms',
    error: true,
    helperText: 'This field is required'
  }
}`,...(ze=($e=S.parameters)==null?void 0:$e.docs)==null?void 0:ze.source},description:{story:"Error with helper text",...(Qe=(Ke=S.parameters)==null?void 0:Ke.docs)==null?void 0:Qe.description}}};var Xe,Ze,et,tt,rt;v.parameters={...v.parameters,docs:{...(Xe=v.parameters)==null?void 0:Xe.docs,source:{originalSource:`{
  render: () => <div>
      <Checkbox inline label="Option 1" />
      <Checkbox inline label="Option 2" />
      <Checkbox inline label="Option 3" />
    </div>
}`,...(et=(Ze=v.parameters)==null?void 0:Ze.docs)==null?void 0:et.source},description:{story:"Inline checkboxes",...(rt=(tt=v.parameters)==null?void 0:tt.docs)==null?void 0:rt.description}}};var at,st,lt,ot,ct;w.parameters={...w.parameters,docs:{...(at=w.parameters)==null?void 0:at.docs,source:{originalSource:`{
  args: {
    reverse: true,
    label: 'Label on the left'
  }
}`,...(lt=(st=w.parameters)==null?void 0:st.docs)==null?void 0:lt.source},description:{story:"Reverse layout (label on left)",...(ct=(ot=w.parameters)==null?void 0:ot.docs)==null?void 0:ct.description}}};var it,nt,dt,mt,ht;j.parameters={...j.parameters,docs:{...(it=j.parameters)==null?void 0:it.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  }}>
      <Checkbox label="Option 1" defaultChecked />
      <Checkbox label="Option 2" />
      <Checkbox label="Option 3" />
      <Checkbox label="Option 4" disabled />
    </div>
}`,...(dt=(nt=j.parameters)==null?void 0:nt.docs)==null?void 0:dt.source},description:{story:"Stacked checkboxes",...(ht=(mt=j.parameters)==null?void 0:mt.docs)==null?void 0:ht.description}}};var pt,ut,bt,xt,kt;D.parameters={...D.parameters,docs:{...(pt=D.parameters)==null?void 0:pt.docs,source:{originalSource:`{
  render: function FormCheckboxes() {
    const [formData, setFormData] = useState({
      terms: false,
      newsletter: true,
      marketing: false
    });
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert(JSON.stringify(formData, null, 2));
    };
    return <form onSubmit={handleSubmit}>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
          <Checkbox name="terms" checked={formData.terms} onChange={e => setFormData({
          ...formData,
          terms: e.target.checked
        })} label="I accept the terms and conditions" required />
          <Checkbox name="newsletter" checked={formData.newsletter} onChange={e => setFormData({
          ...formData,
          newsletter: e.target.checked
        })} label="Subscribe to newsletter" helperText="Get weekly updates about new features" />
          <Checkbox name="marketing" checked={formData.marketing} onChange={e => setFormData({
          ...formData,
          marketing: e.target.checked
        })} label="Receive marketing emails" />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Submit
        </button>
      </form>;
  }
}`,...(bt=(ut=D.parameters)==null?void 0:ut.docs)==null?void 0:bt.source},description:{story:"Form with checkboxes",...(kt=(xt=D.parameters)==null?void 0:xt.docs)==null?void 0:kt.description}}};var ft,gt,yt,Ct,St;I.parameters={...I.parameters,docs:{...(ft=I.parameters)==null?void 0:ft.docs,source:{originalSource:`{
  render: () => <fieldset>
      <legend className="h6">Select your interests</legend>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem'
    }}>
        <Checkbox name="interests" value="technology" label="Technology" />
        <Checkbox name="interests" value="sports" label="Sports" />
        <Checkbox name="interests" value="music" label="Music" />
        <Checkbox name="interests" value="travel" label="Travel" />
      </div>
    </fieldset>
}`,...(yt=(gt=I.parameters)==null?void 0:gt.docs)==null?void 0:yt.source},description:{story:"Checkbox group with fieldset",...(St=(Ct=I.parameters)==null?void 0:Ct.docs)==null?void 0:St.description}}};var vt,wt,jt,Dt,It;O.parameters={...O.parameters,docs:{...(vt=O.parameters)==null?void 0:vt.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }}>
      {/* Basic States */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>Basic States</h4>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
          <Checkbox label="Unchecked" />
          <Checkbox label="Checked" defaultChecked />
          <Checkbox label="Indeterminate" indeterminate />
          <Checkbox label="Disabled" disabled />
          <Checkbox label="Disabled checked" disabled defaultChecked />
        </div>
      </div>

      {/* Switch Style */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>Switch Style</h4>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
          <Checkbox switch label="Off" />
          <Checkbox switch label="On" defaultChecked />
          <Checkbox switch label="Disabled" disabled />
        </div>
      </div>

      {/* Error States */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>Validation</h4>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
          <Checkbox label="Required field" required />
          <Checkbox label="With error" error helperText="This field is required" />
          <Checkbox label="With helper" helperText="Optional helper text" />
        </div>
      </div>

      {/* Layout Options */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>Inline Layout</h4>
        <div>
          <Checkbox inline label="Option A" />
          <Checkbox inline label="Option B" />
          <Checkbox inline label="Option C" />
        </div>
      </div>
    </div>
}`,...(jt=(wt=O.parameters)==null?void 0:wt.docs)==null?void 0:jt.source},description:{story:"Complete checkbox showcase",...(It=(Dt=O.parameters)==null?void 0:Dt.docs)==null?void 0:It.description}}};const Ft=["Default","DefaultChecked","WithoutLabel","Controlled","Indeterminate","ParentChildPattern","Switch","SwitchChecked","MultipleSwitches","Disabled","DisabledChecked","Error","Required","WithHelperText","ErrorWithHelperText","Inline","Reverse","Stacked","FormExample","CheckboxGroup","CompleteShowcase"];export{I as CheckboxGroup,O as CompleteShowcase,m as Controlled,i as Default,n as DefaultChecked,k as Disabled,f as DisabledChecked,g as Error,S as ErrorWithHelperText,D as FormExample,h as Indeterminate,v as Inline,x as MultipleSwitches,p as ParentChildPattern,y as Required,w as Reverse,j as Stacked,u as Switch,b as SwitchChecked,C as WithHelperText,d as WithoutLabel,Ft as __namedExportsOrder,Pt as default};
