import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as o}from"./iframe-DMCq_6Z-.js";import{p as t}from"./Tabs-BxuCsZ_y.js";import"./preload-helper-Dp1pzeXC.js";const ct={title:"Components/Switch",component:t,parameters:{layout:"padded",docs:{description:{component:"A toggle switch component for binary on/off states. Supports sizes, labels, loading state, and smooth animations."}}},tags:["autodocs"],argTypes:{size:{control:"select",options:["sm","md","lg"],description:"Switch size",table:{type:{summary:"SwitchSize"},defaultValue:{summary:"md"}}},checked:{control:"boolean",description:"Controlled checked state",table:{type:{summary:"boolean"}}},defaultChecked:{control:"boolean",description:"Initial checked state (uncontrolled)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},disabled:{control:"boolean",description:"Disabled state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},loading:{control:"boolean",description:"Loading state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},error:{control:"boolean",description:"Error state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},required:{control:"boolean",description:"Required field",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},labelPosition:{control:"select",options:["start","end"],description:"Label position",table:{type:{summary:"'start' | 'end'"},defaultValue:{summary:"end"}}}}},n={args:{label:"Enable notifications"}},c={args:{"aria-label":"Toggle feature"}},d={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(t,{size:"sm",label:"Small"}),e.jsx(t,{size:"md",label:"Medium (default)"}),e.jsx(t,{size:"lg",label:"Large"})]})},m={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(t,{label:"Default (off)"}),e.jsx(t,{label:"Default (on)",defaultChecked:!0}),e.jsx(t,{label:"Disabled (off)",disabled:!0}),e.jsx(t,{label:"Disabled (on)",disabled:!0,defaultChecked:!0}),e.jsx(t,{label:"Loading",loading:!0}),e.jsx(t,{label:"Error",error:!0,helperText:"This setting is required"})]})},u={args:{label:"Unavailable feature",disabled:!0}},h={args:{label:"Saving...",loading:!0}},p={args:{label:"Required setting",error:!0,helperText:"This setting must be enabled"}},f={render:function(){const[a,s]=o.useState(!1);return e.jsxs("div",{children:[e.jsx(t,{label:"Dark mode",checked:a,onChange:s}),e.jsxs("p",{className:"mt-2 text-muted small",children:["Status: ",a?"ON":"OFF"]})]})}},g={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(t,{label:"Label at end (default)",labelPosition:"end"}),e.jsx(t,{label:"Label at start",labelPosition:"start"})]})},b={render:function(){const[a,s]=o.useState(!1);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(t,{label:"Status",onText:"ON",offText:"OFF",checked:a,onChange:s}),e.jsx(t,{label:"Active",size:"lg",onText:"YES",offText:"NO",checked:a,onChange:s})]})}},x={render:function(){const[a,s]=o.useState(!1),r=()=>e.jsx("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"currentColor",children:e.jsx("path",{d:"M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"})}),i=()=>e.jsx("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"currentColor",children:e.jsx("path",{d:"M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"})});return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(t,{label:"With icons",onIcon:e.jsx(r,{}),offIcon:e.jsx(i,{}),checked:a,onChange:s}),e.jsx(t,{label:"Large with icons",size:"lg",onIcon:e.jsx(r,{}),offIcon:e.jsx(i,{}),checked:a,onChange:s})]})}},S={args:{label:"Email notifications",helperText:"Receive updates about your account"}},y={args:{label:"Accept terms and conditions",required:!0}},v={render:function(){const[a,s]=o.useState(!1),[r,i]=o.useState(!1),C=async D=>{i(!0),await new Promise(rt=>setTimeout(rt,1e3)),s(D),i(!1)};return e.jsxs("div",{children:[e.jsx(t,{label:"Auto-save",checked:a,loading:r,onChange:C}),e.jsx("p",{className:"mt-2 text-muted small",children:r?"Saving...":`Auto-save is ${a?"enabled":"disabled"}`})]})}},w={render:function(){const[a,s]=o.useState({notifications:!0,darkMode:!1,autoSave:!0,analytics:!1}),r=i=>C=>{s(D=>({...D,[i]:C}))};return e.jsxs("div",{className:"card p-4",style:{maxWidth:"400px",display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx("h5",{className:"mb-3",children:"Settings"}),e.jsx(t,{label:"Push notifications",checked:a.notifications,onChange:r("notifications"),helperText:"Receive push notifications"}),e.jsx(t,{label:"Dark mode",checked:a.darkMode,onChange:r("darkMode"),helperText:"Use dark theme"}),e.jsx(t,{label:"Auto-save",checked:a.autoSave,onChange:r("autoSave"),helperText:"Automatically save changes"}),e.jsx(t,{label:"Analytics",checked:a.analytics,onChange:r("analytics"),helperText:"Help us improve with usage data"})]})}},k={render:function(){const a=s=>{s.preventDefault();const r=new FormData(s.currentTarget),i=Object.fromEntries(r);alert(JSON.stringify(i,null,2))};return e.jsx("form",{onSubmit:a,style:{maxWidth:"400px"},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(t,{name:"marketing",label:"Marketing emails",defaultChecked:!0}),e.jsx(t,{name:"updates",label:"Product updates"}),e.jsx(t,{name:"newsletter",label:"Weekly newsletter",defaultChecked:!0}),e.jsx("button",{type:"submit",className:"btn btn-primary mt-2",children:"Save Preferences"})]})})}},j={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem",maxWidth:"500px"},children:[e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Basic Switch"}),e.jsx(t,{label:"Enable feature"})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Sizes"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(t,{size:"sm",label:"Small"}),e.jsx(t,{size:"md",label:"Medium"}),e.jsx(t,{size:"lg",label:"Large"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"States"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(t,{label:"Disabled",disabled:!0}),e.jsx(t,{label:"Loading",loading:!0}),e.jsx(t,{label:"Error",error:!0,helperText:"Required"}),e.jsx(t,{label:"Required",required:!0})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Features"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(t,{label:"With on/off text",onText:"ON",offText:"OFF"}),e.jsx(t,{label:"Label at start",labelPosition:"start"}),e.jsx(t,{label:"With helper",helperText:"Additional information"})]})]})]})};var T,L,E,z,O;n.parameters={...n.parameters,docs:{...(T=n.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    label: 'Enable notifications'
  }
}`,...(E=(L=n.parameters)==null?void 0:L.docs)==null?void 0:E.source},description:{story:"Default switch with label",...(O=(z=n.parameters)==null?void 0:z.docs)==null?void 0:O.description}}};var F,A,P,I,W;c.parameters={...c.parameters,docs:{...(F=c.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Toggle feature'
  }
}`,...(P=(A=c.parameters)==null?void 0:A.docs)==null?void 0:P.source},description:{story:"Switch without label (uses aria-label)",...(W=(I=c.parameters)==null?void 0:I.docs)==null?void 0:W.description}}};var N,R,q,M,B;d.parameters={...d.parameters,docs:{...(N=d.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <Switch size="sm" label="Small" />
      <Switch size="md" label="Medium (default)" />
      <Switch size="lg" label="Large" />
    </div>
}`,...(q=(R=d.parameters)==null?void 0:R.docs)==null?void 0:q.source},description:{story:"Switch sizes",...(B=(M=d.parameters)==null?void 0:M.docs)==null?void 0:B.description}}};var V,X,H,J,U;m.parameters={...m.parameters,docs:{...(V=m.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <Switch label="Default (off)" />
      <Switch label="Default (on)" defaultChecked />
      <Switch label="Disabled (off)" disabled />
      <Switch label="Disabled (on)" disabled defaultChecked />
      <Switch label="Loading" loading />
      <Switch label="Error" error helperText="This setting is required" />
    </div>
}`,...(H=(X=m.parameters)==null?void 0:X.docs)==null?void 0:H.source},description:{story:"Switch states",...(U=(J=m.parameters)==null?void 0:J.docs)==null?void 0:U.description}}};var Y,Z,_,$,G;u.parameters={...u.parameters,docs:{...(Y=u.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    label: 'Unavailable feature',
    disabled: true
  }
}`,...(_=(Z=u.parameters)==null?void 0:Z.docs)==null?void 0:_.source},description:{story:"Disabled state",...(G=($=u.parameters)==null?void 0:$.docs)==null?void 0:G.description}}};var K,Q,ee,te,ae;h.parameters={...h.parameters,docs:{...(K=h.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    label: 'Saving...',
    loading: true
  }
}`,...(ee=(Q=h.parameters)==null?void 0:Q.docs)==null?void 0:ee.source},description:{story:"Loading state",...(ae=(te=h.parameters)==null?void 0:te.docs)==null?void 0:ae.description}}};var se,re,ie,oe,le;p.parameters={...p.parameters,docs:{...(se=p.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    label: 'Required setting',
    error: true,
    helperText: 'This setting must be enabled'
  }
}`,...(ie=(re=p.parameters)==null?void 0:re.docs)==null?void 0:ie.source},description:{story:"Error state",...(le=(oe=p.parameters)==null?void 0:oe.docs)==null?void 0:le.description}}};var ne,ce,de,me,ue;f.parameters={...f.parameters,docs:{...(ne=f.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: function ControlledSwitch() {
    const [checked, setChecked] = useState(false);
    return <div>
        <Switch label="Dark mode" checked={checked} onChange={setChecked} />
        <p className="mt-2 text-muted small">Status: {checked ? 'ON' : 'OFF'}</p>
      </div>;
  }
}`,...(de=(ce=f.parameters)==null?void 0:ce.docs)==null?void 0:de.source},description:{story:"Controlled switch",...(ue=(me=f.parameters)==null?void 0:me.docs)==null?void 0:ue.description}}};var he,pe,fe,ge,be;g.parameters={...g.parameters,docs:{...(he=g.parameters)==null?void 0:he.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <Switch label="Label at end (default)" labelPosition="end" />
      <Switch label="Label at start" labelPosition="start" />
    </div>
}`,...(fe=(pe=g.parameters)==null?void 0:pe.docs)==null?void 0:fe.source},description:{story:"Label positions",...(be=(ge=g.parameters)==null?void 0:ge.docs)==null?void 0:be.description}}};var xe,Se,ye,ve,we;b.parameters={...b.parameters,docs:{...(xe=b.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  render: function OnOffTextSwitch() {
    const [checked, setChecked] = useState(false);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
        <Switch label="Status" onText="ON" offText="OFF" checked={checked} onChange={setChecked} />
        <Switch label="Active" size="lg" onText="YES" offText="NO" checked={checked} onChange={setChecked} />
      </div>;
  }
}`,...(ye=(Se=b.parameters)==null?void 0:Se.docs)==null?void 0:ye.source},description:{story:"Switch with on/off text",...(we=(ve=b.parameters)==null?void 0:ve.docs)==null?void 0:we.description}}};var ke,je,Ce,De,Te;x.parameters={...x.parameters,docs:{...(ke=x.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  render: function IconSwitch() {
    const [checked, setChecked] = useState(false);
    const CheckIcon = (): React.JSX.Element => <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
      </svg>;
    const XIcon = (): React.JSX.Element => <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
      </svg>;
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
        <Switch label="With icons" onIcon={<CheckIcon />} offIcon={<XIcon />} checked={checked} onChange={setChecked} />
        <Switch label="Large with icons" size="lg" onIcon={<CheckIcon />} offIcon={<XIcon />} checked={checked} onChange={setChecked} />
      </div>;
  }
}`,...(Ce=(je=x.parameters)==null?void 0:je.docs)==null?void 0:Ce.source},description:{story:"Switch with icons",...(Te=(De=x.parameters)==null?void 0:De.docs)==null?void 0:Te.description}}};var Le,Ee,ze,Oe,Fe;S.parameters={...S.parameters,docs:{...(Le=S.parameters)==null?void 0:Le.docs,source:{originalSource:`{
  args: {
    label: 'Email notifications',
    helperText: 'Receive updates about your account'
  }
}`,...(ze=(Ee=S.parameters)==null?void 0:Ee.docs)==null?void 0:ze.source},description:{story:"Switch with helper text",...(Fe=(Oe=S.parameters)==null?void 0:Oe.docs)==null?void 0:Fe.description}}};var Ae,Pe,Ie,We,Ne;y.parameters={...y.parameters,docs:{...(Ae=y.parameters)==null?void 0:Ae.docs,source:{originalSource:`{
  args: {
    label: 'Accept terms and conditions',
    required: true
  }
}`,...(Ie=(Pe=y.parameters)==null?void 0:Pe.docs)==null?void 0:Ie.source},description:{story:"Required switch",...(Ne=(We=y.parameters)==null?void 0:We.docs)==null?void 0:Ne.description}}};var Re,qe,Me,Be,Ve;v.parameters={...v.parameters,docs:{...(Re=v.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  render: function AsyncSwitch() {
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleChange = async (newChecked: boolean): Promise<void> => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setChecked(newChecked);
      setLoading(false);
    };
    return <div>
        <Switch label="Auto-save" checked={checked} loading={loading} onChange={handleChange} />
        <p className="mt-2 text-muted small">
          {loading ? 'Saving...' : \`Auto-save is \${checked ? 'enabled' : 'disabled'}\`}
        </p>
      </div>;
  }
}`,...(Me=(qe=v.parameters)==null?void 0:qe.docs)==null?void 0:Me.source},description:{story:"Async toggle with loading state",...(Ve=(Be=v.parameters)==null?void 0:Be.docs)==null?void 0:Ve.description}}};var Xe,He,Je,Ue,Ye;w.parameters={...w.parameters,docs:{...(Xe=w.parameters)==null?void 0:Xe.docs,source:{originalSource:`{
  render: function SettingsPanelExample() {
    const [settings, setSettings] = useState({
      notifications: true,
      darkMode: false,
      autoSave: true,
      analytics: false
    });
    const updateSetting = (key: keyof typeof settings) => (value: boolean) => {
      setSettings(prev => ({
        ...prev,
        [key]: value
      }));
    };
    return <div className="card p-4" style={{
      maxWidth: '400px',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
        <h5 className="mb-3">Settings</h5>
        <Switch label="Push notifications" checked={settings.notifications} onChange={updateSetting('notifications')} helperText="Receive push notifications" />
        <Switch label="Dark mode" checked={settings.darkMode} onChange={updateSetting('darkMode')} helperText="Use dark theme" />
        <Switch label="Auto-save" checked={settings.autoSave} onChange={updateSetting('autoSave')} helperText="Automatically save changes" />
        <Switch label="Analytics" checked={settings.analytics} onChange={updateSetting('analytics')} helperText="Help us improve with usage data" />
      </div>;
  }
}`,...(Je=(He=w.parameters)==null?void 0:He.docs)==null?void 0:Je.source},description:{story:"Settings panel example",...(Ye=(Ue=w.parameters)==null?void 0:Ue.docs)==null?void 0:Ye.description}}};var Ze,_e,$e,Ge,Ke;k.parameters={...k.parameters,docs:{...(Ze=k.parameters)==null?void 0:Ze.docs,source:{originalSource:`{
  render: function FormSwitches() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData);
      alert(JSON.stringify(data, null, 2));
    };
    return <form onSubmit={handleSubmit} style={{
      maxWidth: '400px'
    }}>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
          <Switch name="marketing" label="Marketing emails" defaultChecked />
          <Switch name="updates" label="Product updates" />
          <Switch name="newsletter" label="Weekly newsletter" defaultChecked />
          <button type="submit" className="btn btn-primary mt-2">
            Save Preferences
          </button>
        </div>
      </form>;
  }
}`,...($e=(_e=k.parameters)==null?void 0:_e.docs)==null?void 0:$e.source},description:{story:"Form with switches",...(Ke=(Ge=k.parameters)==null?void 0:Ge.docs)==null?void 0:Ke.description}}};var Qe,et,tt,at,st;j.parameters={...j.parameters,docs:{...(Qe=j.parameters)==null?void 0:Qe.docs,source:{originalSource:`{
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
      }}>Basic Switch</h4>
        <Switch label="Enable feature" />
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
          <Switch size="sm" label="Small" />
          <Switch size="md" label="Medium" />
          <Switch size="lg" label="Large" />
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
          <Switch label="Disabled" disabled />
          <Switch label="Loading" loading />
          <Switch label="Error" error helperText="Required" />
          <Switch label="Required" required />
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
          <Switch label="With on/off text" onText="ON" offText="OFF" />
          <Switch label="Label at start" labelPosition="start" />
          <Switch label="With helper" helperText="Additional information" />
        </div>
      </div>
    </div>
}`,...(tt=(et=j.parameters)==null?void 0:et.docs)==null?void 0:tt.source},description:{story:"Complete switch showcase",...(st=(at=j.parameters)==null?void 0:at.docs)==null?void 0:st.description}}};const dt=["Default","WithoutLabel","Sizes","States","Disabled","Loading","Error","Controlled","LabelPositions","WithOnOffText","WithIcons","WithHelperText","Required","AsyncToggle","SettingsPanel","FormExample","CompleteShowcase"];export{v as AsyncToggle,j as CompleteShowcase,f as Controlled,n as Default,u as Disabled,p as Error,k as FormExample,g as LabelPositions,h as Loading,y as Required,w as SettingsPanel,d as Sizes,m as States,S as WithHelperText,x as WithIcons,b as WithOnOffText,c as WithoutLabel,dt as __namedExportsOrder,ct as default};
