import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{l as t}from"./Tabs-CHAWmy3D.js";import{r as P}from"./iframe-BdiDpM7d.js";import"./preload-helper-Dp1pzeXC.js";const lr={title:"Components/Checkbox",component:t,parameters:{layout:"padded",docs:{description:{component:"A Bootstrap 5 checkbox component supporting controlled and uncontrolled modes, indeterminate state, switch styling, error states, and full accessibility."}}},tags:["autodocs"],argTypes:{label:{control:"text",description:"Checkbox label text",table:{type:{summary:"ReactNode"}}},checked:{control:"boolean",description:"Controlled checked state",table:{type:{summary:"boolean"}}},defaultChecked:{control:"boolean",description:"Initial checked state (uncontrolled)",table:{type:{summary:"boolean"}}},indeterminate:{control:"boolean",description:"Indeterminate (partial) state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},disabled:{control:"boolean",description:"Disabled state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},error:{control:"boolean",description:"Error state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},helperText:{control:"text",description:"Helper or error message",table:{type:{summary:"string"}}},inline:{control:"boolean",description:"Inline display",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},reverse:{control:"boolean",description:"Reverse label/checkbox order",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},switch:{control:"boolean",description:"Switch toggle style",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},required:{control:"boolean",description:"Required field",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}}},c={args:{label:"Accept terms and conditions"}},n={args:{label:"Remember me",defaultChecked:!0}},d={args:{"aria-label":"Select row"}},m={render:function(){const[r,s]=P.useState(!1);return e.jsxs("div",{children:[e.jsx(t,{checked:r,onChange:o=>s(o.target.checked),label:`Checkbox is ${r?"checked":"unchecked"}`}),e.jsxs("p",{className:"mt-2 small text-muted",children:["State: ",r?"true":"false"]})]})}},p={args:{indeterminate:!0,label:"Select all"}},h={render:function(){const[r,s]=P.useState([{id:1,label:"Item 1",checked:!1},{id:2,label:"Item 2",checked:!0},{id:3,label:"Item 3",checked:!1}]),o=r.every(a=>a.checked),Qt=r.some(a=>a.checked)&&!o,Zt=()=>{const a=!o;s(r.map(i=>({...i,checked:a})))},er=a=>{s(r.map(i=>i.id===a?{...i,checked:!i.checked}:i))};return e.jsxs("div",{children:[e.jsx(t,{indeterminate:Qt,checked:o,onChange:Zt,label:"Select all"}),e.jsx("div",{className:"ms-4 mt-2",children:r.map(a=>e.jsx(t,{checked:a.checked,onChange:()=>er(a.id),label:a.label},a.id))})]})}},u={args:{switch:!0,label:"Enable notifications"}},b={args:{switch:!0,label:"Dark mode",defaultChecked:!0}},x={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(t,{switch:!0,label:"Email notifications",defaultChecked:!0}),e.jsx(t,{switch:!0,label:"Push notifications"}),e.jsx(t,{switch:!0,label:"SMS notifications",disabled:!0})]})},k={args:{label:"Disabled checkbox",disabled:!0}},f={args:{label:"Disabled checked",disabled:!0,defaultChecked:!0}},y={args:{label:"I agree to the terms",error:!0,helperText:"You must accept the terms to continue"}},g={args:{label:"I accept the privacy policy",required:!0}},v={args:{label:"Subscribe to newsletter",helperText:"We'll send you updates about new features and promotions"}},C={args:{label:"Accept terms",error:!0,helperText:"This field is required"}},S={render:()=>e.jsxs("div",{children:[e.jsx(t,{inline:!0,label:"Option 1"}),e.jsx(t,{inline:!0,label:"Option 2"}),e.jsx(t,{inline:!0,label:"Option 3"})]})},j={args:{reverse:!0,label:"Label on the left"}},D={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.25rem"},children:[e.jsx(t,{label:"Option 1",defaultChecked:!0}),e.jsx(t,{label:"Option 2"}),e.jsx(t,{label:"Option 3"}),e.jsx(t,{label:"Option 4",disabled:!0})]})},w={render:function(){const[r,s]=P.useState({terms:!1,newsletter:!0,marketing:!1}),o=l=>{l.preventDefault(),alert(JSON.stringify(r,null,2))};return e.jsxs("form",{onSubmit:o,children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(t,{name:"terms",checked:r.terms,onChange:l=>s({...r,terms:l.target.checked}),label:"I accept the terms and conditions",required:!0}),e.jsx(t,{name:"newsletter",checked:r.newsletter,onChange:l=>s({...r,newsletter:l.target.checked}),label:"Subscribe to newsletter",helperText:"Get weekly updates about new features"}),e.jsx(t,{name:"marketing",checked:r.marketing,onChange:l=>s({...r,marketing:l.target.checked}),label:"Receive marketing emails"})]}),e.jsx("button",{type:"submit",className:"btn btn-primary mt-3",children:"Submit"})]})}},T={render:()=>e.jsxs("fieldset",{children:[e.jsx("legend",{className:"h6",children:"Select your interests"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.25rem"},children:[e.jsx(t,{name:"interests",value:"technology",label:"Technology"}),e.jsx(t,{name:"interests",value:"sports",label:"Sports"}),e.jsx(t,{name:"interests",value:"music",label:"Music"}),e.jsx(t,{name:"interests",value:"travel",label:"Travel"})]})]})},I={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Safe Attributes Allowed"}),e.jsx("p",{className:"text-muted small",children:"These standard form attributes are safely passed through:"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(t,{label:"With name attribute",name:"demo-1"}),e.jsx(t,{label:"With required",required:!0}),e.jsx(t,{label:"With title",title:"This is a tooltip"}),e.jsx(t,{label:"With aria-label","aria-label":"Custom accessible label"})]})]}),e.jsxs("div",{children:[e.jsx("h5",{children:"Dangerous Event Handlers Blocked"}),e.jsx("p",{className:"text-muted small",children:"Event handlers like onLoad, onError, etc. are automatically filtered out to prevent XSS attacks."})]})]})},N={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Protected Against Prop Injection"}),e.jsx("p",{className:"text-muted small",children:"Only safe HTML attributes are rendered to the DOM. Dangerous props are silently filtered."})]}),e.jsxs("div",{children:[e.jsx("h5",{children:"Whitelisted Categories"}),e.jsxs("ul",{className:"text-muted small",children:[e.jsx("li",{children:"✓ Standard HTML attributes (name, value, disabled, required, etc.)"}),e.jsx("li",{children:"✓ All ARIA attributes (aria-label, aria-describedby, etc.)"}),e.jsx("li",{children:"✓ Input-specific attributes (autoComplete, tabIndex, etc.)"}),e.jsx("li",{children:"✗ All event handlers (onClick, onLoad, onError, etc.)"}),e.jsx("li",{children:"✗ Dangerous properties (innerHTML, dangerouslySetInnerHTML, etc.)"})]})]}),e.jsx("div",{children:e.jsx(t,{label:"Example: Safe and protected",name:"security-demo",title:"This checkbox is protected against prop injection attacks",required:!0})})]})},A={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Keyboard Navigation Demo"}),e.jsx("p",{className:"text-muted small",children:"Use Tab to navigate and Space to toggle. All checkboxes have proper keyboard support."})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(t,{label:"Focus here and press Space"}),e.jsx(t,{label:"Second checkbox"}),e.jsx(t,{label:"Third checkbox",error:!0,helperText:"Also fully keyboard accessible"}),e.jsx(t,{label:"Disabled checkbox (not in tab order)",disabled:!0})]})]})},M={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Screen Reader Friendly"}),e.jsx("p",{className:"text-muted small",children:"Semantic HTML and ARIA attributes provide full accessibility."})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(t,{label:"Basic checkbox"}),e.jsx(t,{label:"Required field",required:!0}),e.jsx(t,{label:"With helper text",helperText:"This field helps you understand context"}),e.jsx(t,{label:"With error",error:!0,helperText:"This field is required and has an error"}),e.jsx(t,{"aria-label":"Checkbox without visible label"})]})]})},E={render:function(){const[r,s]=P.useState(0);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Memoization Performance Demo"}),e.jsx("p",{className:"text-muted small",children:"The checkboxes won't re-render unnecessarily when you increment the counter below. Check your browser DevTools to see component renders."})]}),e.jsxs("div",{children:[e.jsxs("button",{type:"button",className:"btn btn-sm btn-outline-primary",onClick:()=>s(r+1),children:["Increment Counter: ",r]}),e.jsxs("p",{className:"text-muted small mt-2",children:["Parent re-renders: ",r," times"]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(t,{label:"Memoized checkbox 1"}),e.jsx(t,{label:"Memoized checkbox 2"}),e.jsx(t,{label:"Memoized checkbox 3"}),e.jsx(t,{label:"With performance optimizations",helperText:"All class names are memoized"})]}),e.jsxs("div",{className:"alert alert-info small",children:[e.jsx("strong",{children:"Performance Benefits:"}),e.jsxs("ul",{className:"mb-0 mt-2",children:[e.jsx("li",{children:"✓ Component wrapped with React.memo"}),e.jsx("li",{children:"✓ Class names memoized with useMemo"}),e.jsx("li",{children:"✓ Helper text ID computed once and cached"}),e.jsx("li",{children:"✓ Efficient re-render only when actual props change"})]})]})]})}};var W,q,H,O,L;c.parameters={...c.parameters,docs:{...(W=c.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    label: 'Accept terms and conditions'
  }
}`,...(H=(q=c.parameters)==null?void 0:q.docs)==null?void 0:H.source},description:{story:"Default checkbox with label",...(L=(O=c.parameters)==null?void 0:O.docs)==null?void 0:L.description}}};var z,F,V,B,K;n.parameters={...n.parameters,docs:{...(z=n.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    label: 'Remember me',
    defaultChecked: true
  }
}`,...(V=(F=n.parameters)==null?void 0:F.docs)==null?void 0:V.source},description:{story:"Checkbox with default checked state",...(K=(B=n.parameters)==null?void 0:B.docs)==null?void 0:K.description}}};var G,X,J,U,Y;d.parameters={...d.parameters,docs:{...(G=d.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Select row'
  }
}`,...(J=(X=d.parameters)==null?void 0:X.docs)==null?void 0:J.source},description:{story:"Checkbox without label (uses aria-label)",...(Y=(U=d.parameters)==null?void 0:U.docs)==null?void 0:Y.description}}};var _,$,Q,Z,ee;m.parameters={...m.parameters,docs:{...(_=m.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: function ControlledCheckbox() {
    const [checked, setChecked] = useState(false);
    return <div>
        <Checkbox checked={checked} onChange={e => setChecked(e.target.checked)} label={\`Checkbox is \${checked ? 'checked' : 'unchecked'}\`} />
        <p className="mt-2 small text-muted">State: {checked ? 'true' : 'false'}</p>
      </div>;
  }
}`,...(Q=($=m.parameters)==null?void 0:$.docs)==null?void 0:Q.source},description:{story:"Controlled checkbox with state",...(ee=(Z=m.parameters)==null?void 0:Z.docs)==null?void 0:ee.description}}};var te,re,ae,se,le;p.parameters={...p.parameters,docs:{...(te=p.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    indeterminate: true,
    label: 'Select all'
  }
}`,...(ae=(re=p.parameters)==null?void 0:re.docs)==null?void 0:ae.source},description:{story:"Indeterminate state for parent checkboxes",...(le=(se=p.parameters)==null?void 0:se.docs)==null?void 0:le.description}}};var oe,ie,ce,ne,de;h.parameters={...h.parameters,docs:{...(oe=h.parameters)==null?void 0:oe.docs,source:{originalSource:`{
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
}`,...(ce=(ie=h.parameters)==null?void 0:ie.docs)==null?void 0:ce.source},description:{story:"Parent-child checkbox pattern",...(de=(ne=h.parameters)==null?void 0:ne.docs)==null?void 0:de.description}}};var me,pe,he,ue,be;u.parameters={...u.parameters,docs:{...(me=u.parameters)==null?void 0:me.docs,source:{originalSource:`{
  args: {
    switch: true,
    label: 'Enable notifications'
  }
}`,...(he=(pe=u.parameters)==null?void 0:pe.docs)==null?void 0:he.source},description:{story:"Switch toggle style",...(be=(ue=u.parameters)==null?void 0:ue.docs)==null?void 0:be.description}}};var xe,ke,fe,ye,ge;b.parameters={...b.parameters,docs:{...(xe=b.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  args: {
    switch: true,
    label: 'Dark mode',
    defaultChecked: true
  }
}`,...(fe=(ke=b.parameters)==null?void 0:ke.docs)==null?void 0:fe.source},description:{story:"Switch with default checked",...(ge=(ye=b.parameters)==null?void 0:ye.docs)==null?void 0:ge.description}}};var ve,Ce,Se,je,De;x.parameters={...x.parameters,docs:{...(ve=x.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  }}>
      <Checkbox switch label="Email notifications" defaultChecked />
      <Checkbox switch label="Push notifications" />
      <Checkbox switch label="SMS notifications" disabled />
    </div>
}`,...(Se=(Ce=x.parameters)==null?void 0:Ce.docs)==null?void 0:Se.source},description:{story:"Multiple switches",...(De=(je=x.parameters)==null?void 0:je.docs)==null?void 0:De.description}}};var we,Te,Ie,Ne,Ae;k.parameters={...k.parameters,docs:{...(we=k.parameters)==null?void 0:we.docs,source:{originalSource:`{
  args: {
    label: 'Disabled checkbox',
    disabled: true
  }
}`,...(Ie=(Te=k.parameters)==null?void 0:Te.docs)==null?void 0:Ie.source},description:{story:"Disabled checkbox",...(Ae=(Ne=k.parameters)==null?void 0:Ne.docs)==null?void 0:Ae.description}}};var Me,Ee,Pe,Re,We;f.parameters={...f.parameters,docs:{...(Me=f.parameters)==null?void 0:Me.docs,source:{originalSource:`{
  args: {
    label: 'Disabled checked',
    disabled: true,
    defaultChecked: true
  }
}`,...(Pe=(Ee=f.parameters)==null?void 0:Ee.docs)==null?void 0:Pe.source},description:{story:"Disabled and checked",...(We=(Re=f.parameters)==null?void 0:Re.docs)==null?void 0:We.description}}};var qe,He,Oe,Le,ze;y.parameters={...y.parameters,docs:{...(qe=y.parameters)==null?void 0:qe.docs,source:{originalSource:`{
  args: {
    label: 'I agree to the terms',
    error: true,
    helperText: 'You must accept the terms to continue'
  }
}`,...(Oe=(He=y.parameters)==null?void 0:He.docs)==null?void 0:Oe.source},description:{story:"Error state",...(ze=(Le=y.parameters)==null?void 0:Le.docs)==null?void 0:ze.description}}};var Fe,Ve,Be,Ke,Ge;g.parameters={...g.parameters,docs:{...(Fe=g.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
  args: {
    label: 'I accept the privacy policy',
    required: true
  }
}`,...(Be=(Ve=g.parameters)==null?void 0:Ve.docs)==null?void 0:Be.source},description:{story:"Required field",...(Ge=(Ke=g.parameters)==null?void 0:Ke.docs)==null?void 0:Ge.description}}};var Xe,Je,Ue,Ye,_e;v.parameters={...v.parameters,docs:{...(Xe=v.parameters)==null?void 0:Xe.docs,source:{originalSource:`{
  args: {
    label: 'Subscribe to newsletter',
    helperText: "We'll send you updates about new features and promotions"
  }
}`,...(Ue=(Je=v.parameters)==null?void 0:Je.docs)==null?void 0:Ue.source},description:{story:"With helper text",...(_e=(Ye=v.parameters)==null?void 0:Ye.docs)==null?void 0:_e.description}}};var $e,Qe,Ze,et,tt;C.parameters={...C.parameters,docs:{...($e=C.parameters)==null?void 0:$e.docs,source:{originalSource:`{
  args: {
    label: 'Accept terms',
    error: true,
    helperText: 'This field is required'
  }
}`,...(Ze=(Qe=C.parameters)==null?void 0:Qe.docs)==null?void 0:Ze.source},description:{story:"Error with helper text",...(tt=(et=C.parameters)==null?void 0:et.docs)==null?void 0:tt.description}}};var rt,at,st,lt,ot;S.parameters={...S.parameters,docs:{...(rt=S.parameters)==null?void 0:rt.docs,source:{originalSource:`{
  render: () => <div>
      <Checkbox inline label="Option 1" />
      <Checkbox inline label="Option 2" />
      <Checkbox inline label="Option 3" />
    </div>
}`,...(st=(at=S.parameters)==null?void 0:at.docs)==null?void 0:st.source},description:{story:"Inline checkboxes",...(ot=(lt=S.parameters)==null?void 0:lt.docs)==null?void 0:ot.description}}};var it,ct,nt,dt,mt;j.parameters={...j.parameters,docs:{...(it=j.parameters)==null?void 0:it.docs,source:{originalSource:`{
  args: {
    reverse: true,
    label: 'Label on the left'
  }
}`,...(nt=(ct=j.parameters)==null?void 0:ct.docs)==null?void 0:nt.source},description:{story:"Reverse layout (label on left)",...(mt=(dt=j.parameters)==null?void 0:dt.docs)==null?void 0:mt.description}}};var pt,ht,ut,bt,xt;D.parameters={...D.parameters,docs:{...(pt=D.parameters)==null?void 0:pt.docs,source:{originalSource:`{
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
}`,...(ut=(ht=D.parameters)==null?void 0:ht.docs)==null?void 0:ut.source},description:{story:"Stacked checkboxes",...(xt=(bt=D.parameters)==null?void 0:bt.docs)==null?void 0:xt.description}}};var kt,ft,yt,gt,vt;w.parameters={...w.parameters,docs:{...(kt=w.parameters)==null?void 0:kt.docs,source:{originalSource:`{
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
}`,...(yt=(ft=w.parameters)==null?void 0:ft.docs)==null?void 0:yt.source},description:{story:"Form with checkboxes",...(vt=(gt=w.parameters)==null?void 0:gt.docs)==null?void 0:vt.description}}};var Ct,St,jt,Dt,wt;T.parameters={...T.parameters,docs:{...(Ct=T.parameters)==null?void 0:Ct.docs,source:{originalSource:`{
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
}`,...(jt=(St=T.parameters)==null?void 0:St.docs)==null?void 0:jt.source},description:{story:"Checkbox group with fieldset",...(wt=(Dt=T.parameters)==null?void 0:Dt.docs)==null?void 0:wt.description}}};var Tt,It,Nt,At,Mt;I.parameters={...I.parameters,docs:{...(Tt=I.parameters)==null?void 0:Tt.docs,source:{originalSource:`{
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
          <Checkbox label="With name attribute" name="demo-1" />
          <Checkbox label="With required" required />
          <Checkbox label="With title" title="This is a tooltip" />
          <Checkbox label="With aria-label" aria-label="Custom accessible label" />
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
}`,...(Nt=(It=I.parameters)==null?void 0:It.docs)==null?void 0:Nt.source},description:{story:`Security: Event Handler Validation

The Checkbox component uses a whitelist of safe HTML attributes to prevent
dangerous event handlers from being injected via props. All dangerously
event handlers (onLoad, onError, etc.) are blocked at the input element level.

This protects against XSS vulnerabilities through prop spreading.`,...(Mt=(At=I.parameters)==null?void 0:At.docs)==null?void 0:Mt.description}}};var Et,Pt,Rt,Wt,qt;N.parameters={...N.parameters,docs:{...(Et=N.parameters)==null?void 0:Et.docs,source:{originalSource:`{
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
        <Checkbox label="Example: Safe and protected" name="security-demo" title="This checkbox is protected against prop injection attacks" required />
      </div>
    </div>
}`,...(Rt=(Pt=N.parameters)==null?void 0:Pt.docs)==null?void 0:Rt.source},description:{story:`Security: Prop Whitelist Protection

Only explicitly whitelisted HTML attributes are allowed on the input element.
This prevents injection of dangerous attributes and event handlers through
the \`rest\` props parameter.`,...(qt=(Wt=N.parameters)==null?void 0:Wt.docs)==null?void 0:qt.description}}};var Ht,Ot,Lt,zt,Ft;A.parameters={...A.parameters,docs:{...(Ht=A.parameters)==null?void 0:Ht.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <div>
        <h5>Keyboard Navigation Demo</h5>
        <p className="text-muted small">
          Use Tab to navigate and Space to toggle. All checkboxes have proper keyboard support.
        </p>
      </div>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
        <Checkbox label="Focus here and press Space" />
        <Checkbox label="Second checkbox" />
        <Checkbox label="Third checkbox" error helperText="Also fully keyboard accessible" />
        <Checkbox label="Disabled checkbox (not in tab order)" disabled />
      </div>
    </div>
}`,...(Lt=(Ot=A.parameters)==null?void 0:Ot.docs)==null?void 0:Lt.source},description:{story:`Accessibility: Keyboard Navigation

The Checkbox component provides full keyboard support for all interactions:
- Tab/Shift+Tab: Navigate to/from checkbox
- Space: Toggle checkbox state
- All states remain accessible: disabled, error, indeterminate`,...(Ft=(zt=A.parameters)==null?void 0:zt.docs)==null?void 0:Ft.description}}};var Vt,Bt,Kt,Gt,Xt;M.parameters={...M.parameters,docs:{...(Vt=M.parameters)==null?void 0:Vt.docs,source:{originalSource:`{
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
        <Checkbox label="Basic checkbox" />
        <Checkbox label="Required field" required />
        <Checkbox label="With helper text" helperText="This field helps you understand context" />
        <Checkbox label="With error" error helperText="This field is required and has an error" />
        <Checkbox aria-label="Checkbox without visible label" />
      </div>
    </div>
}`,...(Kt=(Bt=M.parameters)==null?void 0:Bt.docs)==null?void 0:Kt.source},description:{story:'Accessibility: Screen Reader Support\n\nProper semantic markup and ARIA attributes ensure screen reader compatibility:\n- Native `<input type="checkbox">` for full semantic meaning\n- `<label>` properly associated via `htmlFor`\n- `aria-describedby` links to helper text\n- `aria-invalid` indicates error state\n- Error/helper messages associated with `id`',...(Xt=(Gt=M.parameters)==null?void 0:Gt.docs)==null?void 0:Xt.description}}};var Jt,Ut,Yt,_t,$t;E.parameters={...E.parameters,docs:{...(Jt=E.parameters)==null?void 0:Jt.docs,source:{originalSource:`{
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
            The checkboxes won't re-render unnecessarily when you increment the counter below. Check
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
          <Checkbox label="Memoized checkbox 1" />
          <Checkbox label="Memoized checkbox 2" />
          <Checkbox label="Memoized checkbox 3" />
          <Checkbox label="With performance optimizations" helperText="All class names are memoized" />
        </div>

        <div className="alert alert-info small">
          <strong>Performance Benefits:</strong>
          <ul className="mb-0 mt-2">
            <li>✓ Component wrapped with React.memo</li>
            <li>✓ Class names memoized with useMemo</li>
            <li>✓ Helper text ID computed once and cached</li>
            <li>✓ Efficient re-render only when actual props change</li>
          </ul>
        </div>
      </div>;
  }
}`,...(Yt=(Ut=E.parameters)==null?void 0:Ut.docs)==null?void 0:Yt.source},description:{story:`Performance: Memoization

The Checkbox component is optimized with React.memo and useMemo:
- React.memo prevents re-renders when parent props don't change
- useMemo caches computed class names
- Helper text ID is memoized for stable references

This ensures efficient rendering in complex forms with many checkboxes.`,...($t=(_t=E.parameters)==null?void 0:_t.docs)==null?void 0:$t.description}}};const or=["Default","DefaultChecked","WithoutLabel","Controlled","Indeterminate","ParentChildPattern","Switch","SwitchChecked","MultipleSwitches","Disabled","DisabledChecked","ErrorState","Required","WithHelperText","ErrorWithHelperText","Inline","Reverse","Stacked","FormExample","CheckboxGroup","SecurityEventHandlerValidation","SecurityPropWhitelist","AccessibilityKeyboardNavigation","AccessibilityScreenReaderSupport","PerformanceMemoization"];export{A as AccessibilityKeyboardNavigation,M as AccessibilityScreenReaderSupport,T as CheckboxGroup,m as Controlled,c as Default,n as DefaultChecked,k as Disabled,f as DisabledChecked,y as ErrorState,C as ErrorWithHelperText,w as FormExample,p as Indeterminate,S as Inline,x as MultipleSwitches,h as ParentChildPattern,E as PerformanceMemoization,g as Required,j as Reverse,I as SecurityEventHandlerValidation,N as SecurityPropWhitelist,D as Stacked,u as Switch,b as SwitchChecked,v as WithHelperText,d as WithoutLabel,or as __namedExportsOrder,lr as default};
