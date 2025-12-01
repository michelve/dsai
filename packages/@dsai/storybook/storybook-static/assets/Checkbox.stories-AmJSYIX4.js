import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{w as t,b as l,c as q}from"./Tabs-DTVVglNe.js";import{r as P}from"./iframe-CgsZvN4H.js";import"./preload-helper-Dp1pzeXC.js";const hr={title:"Components/Checkbox",component:t,parameters:{layout:"padded",docs:{description:{component:"A Bootstrap 5 checkbox component supporting controlled and uncontrolled modes, indeterminate state, switch styling, error states, and full accessibility."}}},tags:["autodocs"],argTypes:{label:{control:"text",description:"Checkbox label text",table:{type:{summary:"ReactNode"}}},checked:{control:"boolean",description:"Controlled checked state",table:{type:{summary:"boolean"}}},defaultChecked:{control:"boolean",description:"Initial checked state (uncontrolled)",table:{type:{summary:"boolean"}}},indeterminate:{control:"boolean",description:"Indeterminate (partial) state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},disabled:{control:"boolean",description:"Disabled state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},error:{control:"boolean",description:"Error state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},helperText:{control:"text",description:"Helper or error message",table:{type:{summary:"string"}}},inline:{control:"boolean",description:"Inline display",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},reverse:{control:"boolean",description:"Reverse label/checkbox order",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},switch:{control:"boolean",description:"Switch toggle style",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},required:{control:"boolean",description:"Required field",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}}},n={args:{label:"Accept terms and conditions"}},d={args:{label:"Remember me",defaultChecked:!0}},m={args:{"aria-label":"Select row"}},p={render:function(){const[r,a]=P.useState(!1);return e.jsxs("div",{children:[e.jsx(t,{checked:r,onChange:c=>a(c.target.checked),label:`Checkbox is ${r?"checked":"unchecked"}`}),e.jsxs("p",{className:"mt-2 small text-muted",children:["State: ",r?"true":"false"]})]})}},h={args:{indeterminate:!0,label:"Select all"}},u={render:function(){const[r,a]=P.useState([{id:1,label:"Item 1",checked:!1},{id:2,label:"Item 2",checked:!0},{id:3,label:"Item 3",checked:!1}]),c=r.every(s=>s.checked),lr=r.some(s=>s.checked)&&!c,cr=()=>{const s=!c;a(r.map(o=>({...o,checked:s})))},or=s=>{a(r.map(o=>o.id===s?{...o,checked:!o.checked}:o))};return e.jsxs("div",{children:[e.jsx(t,{indeterminate:lr,checked:c,onChange:cr,label:"Select all"}),e.jsx("div",{className:"ms-4 mt-2",children:r.map(s=>e.jsx(t,{checked:s.checked,onChange:()=>or(s.id),label:s.label},s.id))})]})}},b={args:{switch:!0,label:"Enable notifications"}},x={args:{switch:!0,label:"Dark mode",defaultChecked:!0}},k={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(t,{switch:!0,label:"Email notifications",defaultChecked:!0}),e.jsx(t,{switch:!0,label:"Push notifications"}),e.jsx(t,{switch:!0,label:"SMS notifications",disabled:!0})]})},y={args:{label:"Disabled checkbox",disabled:!0}},f={args:{label:"Disabled checked",disabled:!0,defaultChecked:!0}},g={args:{label:"I agree to the terms",error:!0,helperText:"You must accept the terms to continue"}},v={args:{label:"I accept the privacy policy",required:!0}},C={args:{label:"Subscribe to newsletter",helperText:"We'll send you updates about new features and promotions"}},j={args:{label:"Accept terms",error:!0,helperText:"This field is required"}},S={render:()=>e.jsxs("div",{children:[e.jsx(t,{inline:!0,label:"Option 1"}),e.jsx(t,{inline:!0,label:"Option 2"}),e.jsx(t,{inline:!0,label:"Option 3"})]})},w={args:{reverse:!0,label:"Label on the left"}},D={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.25rem"},children:[e.jsx(t,{label:"Option 1",defaultChecked:!0}),e.jsx(t,{label:"Option 2"}),e.jsx(t,{label:"Option 3"}),e.jsx(t,{label:"Option 4",disabled:!0})]})},T={render:function(){const[r,a]=P.useState({terms:!1,newsletter:!0,marketing:!1}),c=i=>{i.preventDefault(),alert(JSON.stringify(r,null,2))};return e.jsxs("form",{onSubmit:c,children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(t,{name:"terms",checked:r.terms,onChange:i=>a({...r,terms:i.target.checked}),label:"I accept the terms and conditions",required:!0}),e.jsx(t,{name:"newsletter",checked:r.newsletter,onChange:i=>a({...r,newsletter:i.target.checked}),label:"Subscribe to newsletter",helperText:"Get weekly updates about new features"}),e.jsx(t,{name:"marketing",checked:r.marketing,onChange:i=>a({...r,marketing:i.target.checked}),label:"Receive marketing emails"})]}),e.jsx("button",{type:"submit",className:"btn btn-primary mt-3",children:"Submit"})]})}},N={render:()=>e.jsxs("fieldset",{children:[e.jsx("legend",{className:"h6",children:"Select your interests"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.25rem"},children:[e.jsx(t,{name:"interests",value:"technology",label:"Technology"}),e.jsx(t,{name:"interests",value:"sports",label:"Sports"}),e.jsx(t,{name:"interests",value:"music",label:"Music"}),e.jsx(t,{name:"interests",value:"travel",label:"Travel"})]})]})},I={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Safe Attributes Allowed"}),e.jsx("p",{className:"text-muted small",children:"These standard form attributes are safely passed through:"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(t,{label:"With name attribute",name:"demo-1"}),e.jsx(t,{label:"With required",required:!0}),e.jsx(t,{label:"With title",title:"This is a tooltip"}),e.jsx(t,{label:"With aria-label","aria-label":"Custom accessible label"})]})]}),e.jsxs("div",{children:[e.jsx("h5",{children:"Dangerous Event Handlers Blocked"}),e.jsx("p",{className:"text-muted small",children:"Event handlers like onLoad, onError, etc. are automatically filtered out to prevent XSS attacks."})]})]})},A={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Protected Against Prop Injection"}),e.jsx("p",{className:"text-muted small",children:"Only safe HTML attributes are rendered to the DOM. Dangerous props are silently filtered."})]}),e.jsxs("div",{children:[e.jsx("h5",{children:"Whitelisted Categories"}),e.jsxs("ul",{className:"text-muted small",children:[e.jsxs("li",{children:[e.jsx(l,{size:14,className:"text-success me-1"}),"Standard HTML attributes (name, value, disabled, required, etc.)"]}),e.jsxs("li",{children:[e.jsx(l,{size:14,className:"text-success me-1"}),"All ARIA attributes (aria-label, aria-describedby, etc.)"]}),e.jsxs("li",{children:[e.jsx(l,{size:14,className:"text-success me-1"}),"Input-specific attributes (autoComplete, tabIndex, etc.)"]}),e.jsxs("li",{children:[e.jsx(q,{size:14,className:"text-danger me-1"}),"All event handlers (onClick, onLoad, onError, etc.)"]}),e.jsxs("li",{children:[e.jsx(q,{size:14,className:"text-danger me-1"}),"Dangerous properties (innerHTML, dangerouslySetInnerHTML, etc.)"]})]})]}),e.jsx("div",{children:e.jsx(t,{label:"Example: Safe and protected",name:"security-demo",title:"This checkbox is protected against prop injection attacks",required:!0})})]})},W={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Keyboard Navigation Demo"}),e.jsx("p",{className:"text-muted small",children:"Use Tab to navigate and Space to toggle. All checkboxes have proper keyboard support."})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(t,{label:"Focus here and press Space"}),e.jsx(t,{label:"Second checkbox"}),e.jsx(t,{label:"Third checkbox",error:!0,helperText:"Also fully keyboard accessible"}),e.jsx(t,{label:"Disabled checkbox (not in tab order)",disabled:!0})]})]})},M={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Screen Reader Friendly"}),e.jsx("p",{className:"text-muted small",children:"Semantic HTML and ARIA attributes provide full accessibility."})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(t,{label:"Basic checkbox"}),e.jsx(t,{label:"Required field",required:!0}),e.jsx(t,{label:"With helper text",helperText:"This field helps you understand context"}),e.jsx(t,{label:"With error",error:!0,helperText:"This field is required and has an error"}),e.jsx(t,{indeterminate:!0,label:"Indeterminate (aria-checked=mixed)"}),e.jsx(t,{"aria-label":"Checkbox without visible label"})]})]})},z={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Development-Time Accessibility Warnings"}),e.jsx("p",{className:"text-muted small",children:"The Checkbox component warns in development when accessibility best practices are not followed."})]}),e.jsxs("div",{className:"alert alert-warning small",children:[e.jsx("strong",{children:"⚠️ Dev Warning Example"}),e.jsx("p",{className:"mb-0 mt-2",children:"Open your browser's console. A checkbox without `label` or `aria-label` will log:"}),e.jsx("code",{className:"d-block mt-2 p-2 bg-dark text-light rounded",children:'[DSAi Checkbox] Missing accessible name. Provide either a "label" prop or an "aria-label" attribute for screen reader users.'})]}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:e.jsxs("div",{children:[e.jsxs("h6",{className:"text-success",children:[e.jsx(l,{size:14,className:"me-1"}),"Correct Usage"]}),e.jsx(t,{label:"With visible label"}),e.jsx(t,{"aria-label":"With aria-label for screen readers"})]})}),e.jsxs("div",{className:"alert alert-info small",children:[e.jsx("strong",{children:"Why This Matters:"}),e.jsxs("ul",{className:"mb-0 mt-2",children:[e.jsx("li",{children:"Screen readers need text to announce the checkbox purpose"}),e.jsx("li",{children:"WCAG 2.2 requires all form controls to have accessible names"}),e.jsx("li",{children:"Early warnings prevent accessibility issues in production"})]})]})]})},E={render:function(){const[r,a]=P.useState(0);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Memoization Performance Demo"}),e.jsx("p",{className:"text-muted small",children:"The checkboxes won't re-render unnecessarily when you increment the counter below. Check your browser DevTools to see component renders."})]}),e.jsxs("div",{children:[e.jsxs("button",{type:"button",className:"btn btn-sm btn-outline-primary",onClick:()=>a(r+1),children:["Increment Counter: ",r]}),e.jsxs("p",{className:"text-muted small mt-2",children:["Parent re-renders: ",r," times"]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(t,{label:"Memoized checkbox 1"}),e.jsx(t,{label:"Memoized checkbox 2"}),e.jsx(t,{label:"Memoized checkbox 3"}),e.jsx(t,{label:"With performance optimizations",helperText:"All class names are memoized"})]}),e.jsxs("div",{className:"alert alert-info small",children:[e.jsx("strong",{children:"Performance Benefits:"}),e.jsxs("ul",{className:"mb-0 mt-2",children:[e.jsxs("li",{children:[e.jsx(l,{size:14,className:"text-success me-1"}),"Component wrapped with React.memo"]}),e.jsxs("li",{children:[e.jsx(l,{size:14,className:"text-success me-1"}),"Class names memoized with useMemo"]}),e.jsxs("li",{children:[e.jsx(l,{size:14,className:"text-success me-1"}),"Helper text ID computed once and cached"]}),e.jsxs("li",{children:[e.jsx(l,{size:14,className:"text-success me-1"}),"Efficient re-render only when actual props change"]})]})]})]})}};var H,O,L,F,V;n.parameters={...n.parameters,docs:{...(H=n.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    label: 'Accept terms and conditions'
  }
}`,...(L=(O=n.parameters)==null?void 0:O.docs)==null?void 0:L.source},description:{story:"Default checkbox with label",...(V=(F=n.parameters)==null?void 0:F.docs)==null?void 0:V.description}}};var B,G,X,K,U;d.parameters={...d.parameters,docs:{...(B=d.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    label: 'Remember me',
    defaultChecked: true
  }
}`,...(X=(G=d.parameters)==null?void 0:G.docs)==null?void 0:X.source},description:{story:"Checkbox with default checked state",...(U=(K=d.parameters)==null?void 0:K.docs)==null?void 0:U.description}}};var J,Y,_,$,Q;m.parameters={...m.parameters,docs:{...(J=m.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Select row'
  }
}`,...(_=(Y=m.parameters)==null?void 0:Y.docs)==null?void 0:_.source},description:{story:"Checkbox without label (uses aria-label)",...(Q=($=m.parameters)==null?void 0:$.docs)==null?void 0:Q.description}}};var Z,ee,te,re,se;p.parameters={...p.parameters,docs:{...(Z=p.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: function ControlledCheckbox() {
    const [checked, setChecked] = useState(false);
    return <div>
        <Checkbox checked={checked} onChange={e => setChecked(e.target.checked)} label={\`Checkbox is \${checked ? 'checked' : 'unchecked'}\`} />
        <p className="mt-2 small text-muted">State: {checked ? 'true' : 'false'}</p>
      </div>;
  }
}`,...(te=(ee=p.parameters)==null?void 0:ee.docs)==null?void 0:te.source},description:{story:"Controlled checkbox with state",...(se=(re=p.parameters)==null?void 0:re.docs)==null?void 0:se.description}}};var ae,ie,le,ce,oe;h.parameters={...h.parameters,docs:{...(ae=h.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  args: {
    indeterminate: true,
    label: 'Select all'
  }
}`,...(le=(ie=h.parameters)==null?void 0:ie.docs)==null?void 0:le.source},description:{story:'Indeterminate state for parent checkboxes.\n\nWhen `indeterminate` is true:\n- The DOM `indeterminate` property is set via JavaScript (no HTML attribute exists)\n- `aria-checked="mixed"` is added for assistive technology support\n\nThis is commonly used for "select all" parent checkboxes.',...(oe=(ce=h.parameters)==null?void 0:ce.docs)==null?void 0:oe.description}}};var ne,de,me,pe,he;u.parameters={...u.parameters,docs:{...(ne=u.parameters)==null?void 0:ne.docs,source:{originalSource:`{
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
}`,...(me=(de=u.parameters)==null?void 0:de.docs)==null?void 0:me.source},description:{story:"Parent-child checkbox pattern",...(he=(pe=u.parameters)==null?void 0:pe.docs)==null?void 0:he.description}}};var ue,be,xe,ke,ye;b.parameters={...b.parameters,docs:{...(ue=b.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  args: {
    switch: true,
    label: 'Enable notifications'
  }
}`,...(xe=(be=b.parameters)==null?void 0:be.docs)==null?void 0:xe.source},description:{story:"Switch toggle style",...(ye=(ke=b.parameters)==null?void 0:ke.docs)==null?void 0:ye.description}}};var fe,ge,ve,Ce,je;x.parameters={...x.parameters,docs:{...(fe=x.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  args: {
    switch: true,
    label: 'Dark mode',
    defaultChecked: true
  }
}`,...(ve=(ge=x.parameters)==null?void 0:ge.docs)==null?void 0:ve.source},description:{story:"Switch with default checked",...(je=(Ce=x.parameters)==null?void 0:Ce.docs)==null?void 0:je.description}}};var Se,we,De,Te,Ne;k.parameters={...k.parameters,docs:{...(Se=k.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  }}>
      <Checkbox switch label="Email notifications" defaultChecked />
      <Checkbox switch label="Push notifications" />
      <Checkbox switch label="SMS notifications" disabled />
    </div>
}`,...(De=(we=k.parameters)==null?void 0:we.docs)==null?void 0:De.source},description:{story:"Multiple switches",...(Ne=(Te=k.parameters)==null?void 0:Te.docs)==null?void 0:Ne.description}}};var Ie,Ae,We,Me,ze;y.parameters={...y.parameters,docs:{...(Ie=y.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  args: {
    label: 'Disabled checkbox',
    disabled: true
  }
}`,...(We=(Ae=y.parameters)==null?void 0:Ae.docs)==null?void 0:We.source},description:{story:"Disabled checkbox",...(ze=(Me=y.parameters)==null?void 0:Me.docs)==null?void 0:ze.description}}};var Ee,Pe,Re,qe,He;f.parameters={...f.parameters,docs:{...(Ee=f.parameters)==null?void 0:Ee.docs,source:{originalSource:`{
  args: {
    label: 'Disabled checked',
    disabled: true,
    defaultChecked: true
  }
}`,...(Re=(Pe=f.parameters)==null?void 0:Pe.docs)==null?void 0:Re.source},description:{story:"Disabled and checked",...(He=(qe=f.parameters)==null?void 0:qe.docs)==null?void 0:He.description}}};var Oe,Le,Fe,Ve,Be;g.parameters={...g.parameters,docs:{...(Oe=g.parameters)==null?void 0:Oe.docs,source:{originalSource:`{
  args: {
    label: 'I agree to the terms',
    error: true,
    helperText: 'You must accept the terms to continue'
  }
}`,...(Fe=(Le=g.parameters)==null?void 0:Le.docs)==null?void 0:Fe.source},description:{story:"Error state",...(Be=(Ve=g.parameters)==null?void 0:Ve.docs)==null?void 0:Be.description}}};var Ge,Xe,Ke,Ue,Je;v.parameters={...v.parameters,docs:{...(Ge=v.parameters)==null?void 0:Ge.docs,source:{originalSource:`{
  args: {
    label: 'I accept the privacy policy',
    required: true
  }
}`,...(Ke=(Xe=v.parameters)==null?void 0:Xe.docs)==null?void 0:Ke.source},description:{story:"Required field",...(Je=(Ue=v.parameters)==null?void 0:Ue.docs)==null?void 0:Je.description}}};var Ye,_e,$e,Qe,Ze;C.parameters={...C.parameters,docs:{...(Ye=C.parameters)==null?void 0:Ye.docs,source:{originalSource:`{
  args: {
    label: 'Subscribe to newsletter',
    helperText: "We'll send you updates about new features and promotions"
  }
}`,...($e=(_e=C.parameters)==null?void 0:_e.docs)==null?void 0:$e.source},description:{story:"With helper text",...(Ze=(Qe=C.parameters)==null?void 0:Qe.docs)==null?void 0:Ze.description}}};var et,tt,rt,st,at;j.parameters={...j.parameters,docs:{...(et=j.parameters)==null?void 0:et.docs,source:{originalSource:`{
  args: {
    label: 'Accept terms',
    error: true,
    helperText: 'This field is required'
  }
}`,...(rt=(tt=j.parameters)==null?void 0:tt.docs)==null?void 0:rt.source},description:{story:"Error with helper text",...(at=(st=j.parameters)==null?void 0:st.docs)==null?void 0:at.description}}};var it,lt,ct,ot,nt;S.parameters={...S.parameters,docs:{...(it=S.parameters)==null?void 0:it.docs,source:{originalSource:`{
  render: () => <div>
      <Checkbox inline label="Option 1" />
      <Checkbox inline label="Option 2" />
      <Checkbox inline label="Option 3" />
    </div>
}`,...(ct=(lt=S.parameters)==null?void 0:lt.docs)==null?void 0:ct.source},description:{story:"Inline checkboxes",...(nt=(ot=S.parameters)==null?void 0:ot.docs)==null?void 0:nt.description}}};var dt,mt,pt,ht,ut;w.parameters={...w.parameters,docs:{...(dt=w.parameters)==null?void 0:dt.docs,source:{originalSource:`{
  args: {
    reverse: true,
    label: 'Label on the left'
  }
}`,...(pt=(mt=w.parameters)==null?void 0:mt.docs)==null?void 0:pt.source},description:{story:"Reverse layout (label on left)",...(ut=(ht=w.parameters)==null?void 0:ht.docs)==null?void 0:ut.description}}};var bt,xt,kt,yt,ft;D.parameters={...D.parameters,docs:{...(bt=D.parameters)==null?void 0:bt.docs,source:{originalSource:`{
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
}`,...(kt=(xt=D.parameters)==null?void 0:xt.docs)==null?void 0:kt.source},description:{story:"Stacked checkboxes",...(ft=(yt=D.parameters)==null?void 0:yt.docs)==null?void 0:ft.description}}};var gt,vt,Ct,jt,St;T.parameters={...T.parameters,docs:{...(gt=T.parameters)==null?void 0:gt.docs,source:{originalSource:`{
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
}`,...(Ct=(vt=T.parameters)==null?void 0:vt.docs)==null?void 0:Ct.source},description:{story:"Form with checkboxes",...(St=(jt=T.parameters)==null?void 0:jt.docs)==null?void 0:St.description}}};var wt,Dt,Tt,Nt,It;N.parameters={...N.parameters,docs:{...(wt=N.parameters)==null?void 0:wt.docs,source:{originalSource:`{
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
}`,...(Tt=(Dt=N.parameters)==null?void 0:Dt.docs)==null?void 0:Tt.source},description:{story:"Checkbox group with fieldset",...(It=(Nt=N.parameters)==null?void 0:Nt.docs)==null?void 0:It.description}}};var At,Wt,Mt,zt,Et;I.parameters={...I.parameters,docs:{...(At=I.parameters)==null?void 0:At.docs,source:{originalSource:`{
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
}`,...(Mt=(Wt=I.parameters)==null?void 0:Wt.docs)==null?void 0:Mt.source},description:{story:`Security: Event Handler Validation

The Checkbox component uses a whitelist of safe HTML attributes to prevent
dangerous event handlers from being injected via props. All dangerously
event handlers (onLoad, onError, etc.) are blocked at the input element level.

This protects against XSS vulnerabilities through prop spreading.`,...(Et=(zt=I.parameters)==null?void 0:zt.docs)==null?void 0:Et.description}}};var Pt,Rt,qt,Ht,Ot;A.parameters={...A.parameters,docs:{...(Pt=A.parameters)==null?void 0:Pt.docs,source:{originalSource:`{
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
        <Checkbox label="Example: Safe and protected" name="security-demo" title="This checkbox is protected against prop injection attacks" required />
      </div>
    </div>
}`,...(qt=(Rt=A.parameters)==null?void 0:Rt.docs)==null?void 0:qt.source},description:{story:`Security: Prop Whitelist Protection

Only explicitly whitelisted HTML attributes are allowed on the input element.
This prevents injection of dangerous attributes and event handlers through
the \`rest\` props parameter.`,...(Ot=(Ht=A.parameters)==null?void 0:Ht.docs)==null?void 0:Ot.description}}};var Lt,Ft,Vt,Bt,Gt;W.parameters={...W.parameters,docs:{...(Lt=W.parameters)==null?void 0:Lt.docs,source:{originalSource:`{
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
}`,...(Vt=(Ft=W.parameters)==null?void 0:Ft.docs)==null?void 0:Vt.source},description:{story:`Accessibility: Keyboard Navigation

The Checkbox component provides full keyboard support for all interactions:
- Tab/Shift+Tab: Navigate to/from checkbox
- Space: Toggle checkbox state
- All states remain accessible: disabled, error, indeterminate`,...(Gt=(Bt=W.parameters)==null?void 0:Bt.docs)==null?void 0:Gt.description}}};var Xt,Kt,Ut,Jt,Yt;M.parameters={...M.parameters,docs:{...(Xt=M.parameters)==null?void 0:Xt.docs,source:{originalSource:`{
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
        <Checkbox indeterminate label="Indeterminate (aria-checked=mixed)" />
        <Checkbox aria-label="Checkbox without visible label" />
      </div>
    </div>
}`,...(Ut=(Kt=M.parameters)==null?void 0:Kt.docs)==null?void 0:Ut.source},description:{story:'Accessibility: Screen Reader Support\n\nProper semantic markup and ARIA attributes ensure screen reader compatibility:\n- Native `<input type="checkbox">` for full semantic meaning\n- `<label>` properly associated via `htmlFor`\n- `aria-describedby` links to helper text\n- `aria-invalid` indicates error state\n- `aria-checked="mixed"` for indeterminate state\n- Error/helper messages associated with `id`',...(Yt=(Jt=M.parameters)==null?void 0:Jt.docs)==null?void 0:Yt.description}}};var _t,$t,Qt,Zt,er;z.parameters={...z.parameters,docs:{...(_t=z.parameters)==null?void 0:_t.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <div>
        <h5>Development-Time Accessibility Warnings</h5>
        <p className="text-muted small">
          The Checkbox component warns in development when accessibility best practices are not
          followed.
        </p>
      </div>

      <div className="alert alert-warning small">
        <strong>⚠️ Dev Warning Example</strong>
        <p className="mb-0 mt-2">
          Open your browser's console. A checkbox without \`label\` or \`aria-label\` will log:
        </p>
        <code className="d-block mt-2 p-2 bg-dark text-light rounded">
          [DSAi Checkbox] Missing accessible name. Provide either a "label" prop or an "aria-label"
          attribute for screen reader users.
        </code>
      </div>

      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
        <div>
          <h6 className="text-success">
            <CheckIcon size={14} className="me-1" />
            Correct Usage
          </h6>
          <Checkbox label="With visible label" />
          <Checkbox aria-label="With aria-label for screen readers" />
        </div>
      </div>

      <div className="alert alert-info small">
        <strong>Why This Matters:</strong>
        <ul className="mb-0 mt-2">
          <li>Screen readers need text to announce the checkbox purpose</li>
          <li>WCAG 2.2 requires all form controls to have accessible names</li>
          <li>Early warnings prevent accessibility issues in production</li>
        </ul>
      </div>
    </div>
}`,...(Qt=($t=z.parameters)==null?void 0:$t.docs)==null?void 0:Qt.source},description:{story:`Accessibility: Development Warnings

The Checkbox component includes development-time warnings to catch accessibility issues early:
- Warns when neither \`label\` nor \`aria-label\` is provided
- Warning only appears once per component instance
- Only in development mode (not in production builds)

This helps developers catch missing accessible names before deployment.`,...(er=(Zt=z.parameters)==null?void 0:Zt.docs)==null?void 0:er.description}}};var tr,rr,sr,ar,ir;E.parameters={...E.parameters,docs:{...(tr=E.parameters)==null?void 0:tr.docs,source:{originalSource:`{
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
              Helper text ID computed once and cached
            </li>
            <li>
              <CheckIcon size={14} className="text-success me-1" />
              Efficient re-render only when actual props change
            </li>
          </ul>
        </div>
      </div>;
  }
}`,...(sr=(rr=E.parameters)==null?void 0:rr.docs)==null?void 0:sr.source},description:{story:`Performance: Memoization

The Checkbox component is optimized with React.memo and useMemo:
- React.memo prevents re-renders when parent props don't change
- useMemo caches computed class names
- Helper text ID is memoized for stable references

This ensures efficient rendering in complex forms with many checkboxes.`,...(ir=(ar=E.parameters)==null?void 0:ar.docs)==null?void 0:ir.description}}};const ur=["Default","DefaultChecked","WithoutLabel","Controlled","Indeterminate","ParentChildPattern","Switch","SwitchChecked","MultipleSwitches","Disabled","DisabledChecked","ErrorState","Required","WithHelperText","ErrorWithHelperText","Inline","Reverse","Stacked","FormExample","CheckboxGroup","SecurityEventHandlerValidation","SecurityPropWhitelist","AccessibilityKeyboardNavigation","AccessibilityScreenReaderSupport","AccessibilityDevWarnings","PerformanceMemoization"];export{z as AccessibilityDevWarnings,W as AccessibilityKeyboardNavigation,M as AccessibilityScreenReaderSupport,N as CheckboxGroup,p as Controlled,n as Default,d as DefaultChecked,y as Disabled,f as DisabledChecked,g as ErrorState,j as ErrorWithHelperText,T as FormExample,h as Indeterminate,S as Inline,k as MultipleSwitches,u as ParentChildPattern,E as PerformanceMemoization,v as Required,w as Reverse,I as SecurityEventHandlerValidation,A as SecurityPropWhitelist,D as Stacked,b as Switch,x as SwitchChecked,C as WithHelperText,m as WithoutLabel,ur as __namedExportsOrder,hr as default};
