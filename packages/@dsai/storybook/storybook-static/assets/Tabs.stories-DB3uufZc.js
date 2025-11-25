import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as We}from"./iframe-B8V5qLVE.js";import{T as a,g as Ee,h as f,i as N}from"./Tabs-DykXLldJ.js";import"./preload-helper-Dp1pzeXC.js";const Ke={title:"Components/Tabs",component:a,parameters:{layout:"padded",docs:{description:{component:"An accessible tabbed interface supporting multiple variants, orientations, and compound component patterns."}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["tabs","pills","underline"],description:"Visual variant",table:{type:{summary:"TabsVariant"},defaultValue:{summary:"tabs"}}},orientation:{control:"select",options:["horizontal","vertical"],description:"Tab orientation",table:{type:{summary:"TabsOrientation"},defaultValue:{summary:"horizontal"}}},fill:{control:"boolean",description:"Fill available width",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},justified:{control:"boolean",description:"Evenly justify tabs",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}}},s=[{id:"home",label:"Home",content:e.jsxs("div",{className:"p-3",children:[e.jsx("h5",{children:"Home"}),e.jsx("p",{children:"Welcome to the home tab. This is where you can find an overview of your dashboard."})]})},{id:"profile",label:"Profile",content:e.jsxs("div",{className:"p-3",children:[e.jsx("h5",{children:"Profile"}),e.jsx("p",{children:"Manage your profile settings and personal information here."})]})},{id:"settings",label:"Settings",content:e.jsxs("div",{className:"p-3",children:[e.jsx("h5",{children:"Settings"}),e.jsx("p",{children:"Configure your application preferences and account settings."})]})}],i={args:{items:s}},l={render:()=>e.jsxs(a,{defaultActiveTab:"home",children:[e.jsxs(Ee,{"aria-label":"Main navigation",children:[e.jsx(f,{id:"home",children:"Home"}),e.jsx(f,{id:"profile",children:"Profile"}),e.jsx(f,{id:"settings",children:"Settings"})]}),e.jsxs("div",{className:"tab-content mt-3",children:[e.jsx(N,{id:"home",children:e.jsxs("div",{className:"p-3 border rounded",children:[e.jsx("h5",{children:"Home Content"}),e.jsx("p",{children:"This is the home panel content using compound components."})]})}),e.jsx(N,{id:"profile",children:e.jsxs("div",{className:"p-3 border rounded",children:[e.jsx("h5",{children:"Profile Content"}),e.jsx("p",{children:"This is the profile panel content."})]})}),e.jsx(N,{id:"settings",children:e.jsxs("div",{className:"p-3 border rounded",children:[e.jsx("h5",{children:"Settings Content"}),e.jsx("p",{children:"This is the settings panel content."})]})})]})]})},r={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h6",{className:"mb-2",children:"Tabs (default)"}),e.jsx(a,{variant:"tabs",items:s})]}),e.jsxs("div",{children:[e.jsx("h6",{className:"mb-2",children:"Pills"}),e.jsx(a,{variant:"pills",items:s})]}),e.jsxs("div",{children:[e.jsx("h6",{className:"mb-2",children:"Underline"}),e.jsx(a,{variant:"underline",items:s})]})]})},n={args:{items:s,variant:"pills"}},c={args:{items:s,variant:"underline"}},o={args:{items:s,orientation:"vertical"}},d={args:{items:s,orientation:"vertical",variant:"pills"}},m={args:{items:s,fill:!0}},p={args:{items:s,justified:!0}},b={render:function(){const[t,j]=We.useState("home");return e.jsxs("div",{children:[e.jsx(a,{activeTab:t,onTabChange:j,items:s}),e.jsxs("p",{className:"mt-3 text-muted small",children:["Active tab: ",t]}),e.jsxs("div",{className:"btn-group mt-2",children:[e.jsx("button",{className:"btn btn-sm btn-outline-primary",onClick:()=>j("home"),children:"Go to Home"}),e.jsx("button",{className:"btn btn-sm btn-outline-primary",onClick:()=>j("profile"),children:"Go to Profile"}),e.jsx("button",{className:"btn btn-sm btn-outline-primary",onClick:()=>j("settings"),children:"Go to Settings"})]})]})}},h={args:{items:[{id:"home",label:"Home",content:e.jsx("div",{className:"p-3",children:"Home content"})},{id:"disabled",label:"Disabled",content:e.jsx("div",{className:"p-3",children:"Disabled content"}),disabled:!0},{id:"settings",label:"Settings",content:e.jsx("div",{className:"p-3",children:"Settings content"})}]}},v={args:{items:[{id:"home",label:"Home",icon:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"currentColor",children:e.jsx("path",{d:"M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"})}),content:e.jsx("div",{className:"p-3",children:"Home content with icon"})},{id:"profile",label:"Profile",icon:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"currentColor",children:e.jsx("path",{d:"M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"})}),content:e.jsx("div",{className:"p-3",children:"Profile content with icon"})},{id:"settings",label:"Settings",icon:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"currentColor",children:[e.jsx("path",{d:"M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"}),e.jsx("path",{d:"M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"})]}),content:e.jsx("div",{className:"p-3",children:"Settings content with icon"})}]}},u={render:()=>e.jsx("div",{className:"card",children:e.jsx("div",{className:"card-header",children:e.jsx(a,{variant:"tabs",defaultActiveTab:"overview",items:[{id:"overview",label:"Overview",content:e.jsxs("div",{className:"card-body",children:[e.jsx("h5",{className:"card-title",children:"Overview"}),e.jsx("p",{className:"card-text",children:"This is the overview content displayed in a card body."})]})},{id:"details",label:"Details",content:e.jsxs("div",{className:"card-body",children:[e.jsx("h5",{className:"card-title",children:"Details"}),e.jsx("p",{className:"card-text",children:"Detailed information about the item."})]})},{id:"history",label:"History",content:e.jsxs("div",{className:"card-body",children:[e.jsx("h5",{className:"card-title",children:"History"}),e.jsx("p",{className:"card-text",children:"Historical data and changes."})]})}]})})})},x={args:{items:Array.from({length:10},(Ge,t)=>({id:`tab-${t+1}`,label:`Tab ${t+1}`,content:e.jsxs("div",{className:"p-3",children:["Content for Tab ",t+1]})}))}},g={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"3rem"},children:[e.jsxs("section",{children:[e.jsx("h4",{className:"mb-3",children:"Variants"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1.5rem"},children:[e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Tabs"}),e.jsx(a,{variant:"tabs",items:s.slice(0,3)})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Pills"}),e.jsx(a,{variant:"pills",items:s.slice(0,3)})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Underline"}),e.jsx(a,{variant:"underline",items:s.slice(0,3)})]})]})]}),e.jsxs("section",{children:[e.jsx("h4",{className:"mb-3",children:"Vertical Orientation"}),e.jsx(a,{orientation:"vertical",variant:"pills",items:s.slice(0,3)})]}),e.jsxs("section",{children:[e.jsx("h4",{className:"mb-3",children:"Fill & Justified"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1.5rem"},children:[e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Fill"}),e.jsx(a,{fill:!0,items:s.slice(0,3)})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Justified"}),e.jsx(a,{justified:!0,items:s.slice(0,3)})]})]})]}),e.jsxs("section",{children:[e.jsx("h4",{className:"mb-3",children:"States"}),e.jsx(a,{items:[{id:"active",label:"Active",content:e.jsx("div",{className:"p-3",children:"Active tab"})},{id:"normal",label:"Normal",content:e.jsx("div",{className:"p-3",children:"Normal tab"})},{id:"disabled",label:"Disabled",content:e.jsx("div",{className:"p-3",children:"Disabled"}),disabled:!0}]})]})]})};var T,y,C,S,w;i.parameters={...i.parameters,docs:{...(T=i.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    items: sampleItems
  }
}`,...(C=(y=i.parameters)==null?void 0:y.docs)==null?void 0:C.source},description:{story:"Default tabs using items prop",...(w=(S=i.parameters)==null?void 0:S.docs)==null?void 0:w.description}}};var V,D,P,A,H;l.parameters={...l.parameters,docs:{...(V=l.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: () => <Tabs defaultActiveTab="home">
      <TabList aria-label="Main navigation">
        <Tab id="home">Home</Tab>
        <Tab id="profile">Profile</Tab>
        <Tab id="settings">Settings</Tab>
      </TabList>
      <div className="tab-content mt-3">
        <TabPanel id="home">
          <div className="p-3 border rounded">
            <h5>Home Content</h5>
            <p>This is the home panel content using compound components.</p>
          </div>
        </TabPanel>
        <TabPanel id="profile">
          <div className="p-3 border rounded">
            <h5>Profile Content</h5>
            <p>This is the profile panel content.</p>
          </div>
        </TabPanel>
        <TabPanel id="settings">
          <div className="p-3 border rounded">
            <h5>Settings Content</h5>
            <p>This is the settings panel content.</p>
          </div>
        </TabPanel>
      </div>
    </Tabs>
}`,...(P=(D=l.parameters)==null?void 0:D.docs)==null?void 0:P.source},description:{story:"Tabs using compound components",...(H=(A=l.parameters)==null?void 0:A.docs)==null?void 0:H.description}}};var I,M,k,Z,L;r.parameters={...r.parameters,docs:{...(I=r.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }}>
      <div>
        <h6 className="mb-2">Tabs (default)</h6>
        <Tabs variant="tabs" items={sampleItems} />
      </div>
      <div>
        <h6 className="mb-2">Pills</h6>
        <Tabs variant="pills" items={sampleItems} />
      </div>
      <div>
        <h6 className="mb-2">Underline</h6>
        <Tabs variant="underline" items={sampleItems} />
      </div>
    </div>
}`,...(k=(M=r.parameters)==null?void 0:M.docs)==null?void 0:k.source},description:{story:"Tab variants",...(L=(Z=r.parameters)==null?void 0:Z.docs)==null?void 0:L.description}}};var z,F,J,O,U;n.parameters={...n.parameters,docs:{...(z=n.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    items: sampleItems,
    variant: 'pills'
  }
}`,...(J=(F=n.parameters)==null?void 0:F.docs)==null?void 0:J.source},description:{story:"Pills variant",...(U=(O=n.parameters)==null?void 0:O.docs)==null?void 0:U.description}}};var B,G,W,E,_;c.parameters={...c.parameters,docs:{...(B=c.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    items: sampleItems,
    variant: 'underline'
  }
}`,...(W=(G=c.parameters)==null?void 0:G.docs)==null?void 0:W.source},description:{story:"Underline variant",...(_=(E=c.parameters)==null?void 0:E.docs)==null?void 0:_.description}}};var $,R,q,K,Q;o.parameters={...o.parameters,docs:{...($=o.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    items: sampleItems,
    orientation: 'vertical'
  }
}`,...(q=(R=o.parameters)==null?void 0:R.docs)==null?void 0:q.source},description:{story:"Vertical orientation",...(Q=(K=o.parameters)==null?void 0:K.docs)==null?void 0:Q.description}}};var X,Y,ee,se,ae;d.parameters={...d.parameters,docs:{...(X=d.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    items: sampleItems,
    orientation: 'vertical',
    variant: 'pills'
  }
}`,...(ee=(Y=d.parameters)==null?void 0:Y.docs)==null?void 0:ee.source},description:{story:"Vertical pills",...(ae=(se=d.parameters)==null?void 0:se.docs)==null?void 0:ae.description}}};var te,ie,le,re,ne;m.parameters={...m.parameters,docs:{...(te=m.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    items: sampleItems,
    fill: true
  }
}`,...(le=(ie=m.parameters)==null?void 0:ie.docs)==null?void 0:le.source},description:{story:"Fill tabs",...(ne=(re=m.parameters)==null?void 0:re.docs)==null?void 0:ne.description}}};var ce,oe,de,me,pe;p.parameters={...p.parameters,docs:{...(ce=p.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {
    items: sampleItems,
    justified: true
  }
}`,...(de=(oe=p.parameters)==null?void 0:oe.docs)==null?void 0:de.source},description:{story:"Justified tabs",...(pe=(me=p.parameters)==null?void 0:me.docs)==null?void 0:pe.description}}};var be,he,ve,ue,xe;b.parameters={...b.parameters,docs:{...(be=b.parameters)==null?void 0:be.docs,source:{originalSource:`{
  render: function ControlledTabs() {
    const [activeTab, setActiveTab] = useState('home');
    return <div>
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} items={sampleItems} />
        <p className="mt-3 text-muted small">Active tab: {activeTab}</p>
        <div className="btn-group mt-2">
          <button className="btn btn-sm btn-outline-primary" onClick={() => setActiveTab('home')}>
            Go to Home
          </button>
          <button className="btn btn-sm btn-outline-primary" onClick={() => setActiveTab('profile')}>
            Go to Profile
          </button>
          <button className="btn btn-sm btn-outline-primary" onClick={() => setActiveTab('settings')}>
            Go to Settings
          </button>
        </div>
      </div>;
  }
}`,...(ve=(he=b.parameters)==null?void 0:he.docs)==null?void 0:ve.source},description:{story:"Controlled tabs",...(xe=(ue=b.parameters)==null?void 0:ue.docs)==null?void 0:xe.description}}};var ge,je,fe,Ne,Te;h.parameters={...h.parameters,docs:{...(ge=h.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'home',
      label: 'Home',
      content: <div className="p-3">Home content</div>
    }, {
      id: 'disabled',
      label: 'Disabled',
      content: <div className="p-3">Disabled content</div>,
      disabled: true
    }, {
      id: 'settings',
      label: 'Settings',
      content: <div className="p-3">Settings content</div>
    }]
  }
}`,...(fe=(je=h.parameters)==null?void 0:je.docs)==null?void 0:fe.source},description:{story:"Disabled tabs",...(Te=(Ne=h.parameters)==null?void 0:Ne.docs)==null?void 0:Te.description}}};var ye,Ce,Se,we,Ve;v.parameters={...v.parameters,docs:{...(ye=v.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'home',
      label: 'Home',
      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
          </svg>,
      content: <div className="p-3">Home content with icon</div>
    }, {
      id: 'profile',
      label: 'Profile',
      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
          </svg>,
      content: <div className="p-3">Profile content with icon</div>
    }, {
      id: 'settings',
      label: 'Settings',
      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
          </svg>,
      content: <div className="p-3">Settings content with icon</div>
    }]
  }
}`,...(Se=(Ce=v.parameters)==null?void 0:Ce.docs)==null?void 0:Se.source},description:{story:"Tabs with icons",...(Ve=(we=v.parameters)==null?void 0:we.docs)==null?void 0:Ve.description}}};var De,Pe,Ae,He,Ie;u.parameters={...u.parameters,docs:{...(De=u.parameters)==null?void 0:De.docs,source:{originalSource:`{
  render: () => <div className="card">
      <div className="card-header">
        <Tabs variant="tabs" defaultActiveTab="overview" items={[{
        id: 'overview',
        label: 'Overview',
        content: <div className="card-body">
                  <h5 className="card-title">Overview</h5>
                  <p className="card-text">
                    This is the overview content displayed in a card body.
                  </p>
                </div>
      }, {
        id: 'details',
        label: 'Details',
        content: <div className="card-body">
                  <h5 className="card-title">Details</h5>
                  <p className="card-text">Detailed information about the item.</p>
                </div>
      }, {
        id: 'history',
        label: 'History',
        content: <div className="card-body">
                  <h5 className="card-title">History</h5>
                  <p className="card-text">Historical data and changes.</p>
                </div>
      }]} />
      </div>
    </div>
}`,...(Ae=(Pe=u.parameters)==null?void 0:Pe.docs)==null?void 0:Ae.source},description:{story:"Card with tabs",...(Ie=(He=u.parameters)==null?void 0:He.docs)==null?void 0:Ie.description}}};var Me,ke,Ze,Le,ze;x.parameters={...x.parameters,docs:{...(Me=x.parameters)==null?void 0:Me.docs,source:{originalSource:`{
  args: {
    items: Array.from({
      length: 10
    }, (_, i) => ({
      id: \`tab-\${i + 1}\`,
      label: \`Tab \${i + 1}\`,
      content: <div className="p-3">Content for Tab {i + 1}</div>
    }))
  }
}`,...(Ze=(ke=x.parameters)==null?void 0:ke.docs)==null?void 0:Ze.source},description:{story:"Many tabs (scrollable)",...(ze=(Le=x.parameters)==null?void 0:Le.docs)==null?void 0:ze.description}}};var Fe,Je,Oe,Ue,Be;g.parameters={...g.parameters,docs:{...(Fe=g.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '3rem'
  }}>
      {/* Variants */}
      <section>
        <h4 className="mb-3">Variants</h4>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
          <div>
            <small className="text-muted d-block mb-1">Tabs</small>
            <Tabs variant="tabs" items={sampleItems.slice(0, 3)} />
          </div>
          <div>
            <small className="text-muted d-block mb-1">Pills</small>
            <Tabs variant="pills" items={sampleItems.slice(0, 3)} />
          </div>
          <div>
            <small className="text-muted d-block mb-1">Underline</small>
            <Tabs variant="underline" items={sampleItems.slice(0, 3)} />
          </div>
        </div>
      </section>

      {/* Vertical */}
      <section>
        <h4 className="mb-3">Vertical Orientation</h4>
        <Tabs orientation="vertical" variant="pills" items={sampleItems.slice(0, 3)} />
      </section>

      {/* Fill and Justified */}
      <section>
        <h4 className="mb-3">Fill & Justified</h4>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
          <div>
            <small className="text-muted d-block mb-1">Fill</small>
            <Tabs fill items={sampleItems.slice(0, 3)} />
          </div>
          <div>
            <small className="text-muted d-block mb-1">Justified</small>
            <Tabs justified items={sampleItems.slice(0, 3)} />
          </div>
        </div>
      </section>

      {/* States */}
      <section>
        <h4 className="mb-3">States</h4>
        <Tabs items={[{
        id: 'active',
        label: 'Active',
        content: <div className="p-3">Active tab</div>
      }, {
        id: 'normal',
        label: 'Normal',
        content: <div className="p-3">Normal tab</div>
      }, {
        id: 'disabled',
        label: 'Disabled',
        content: <div className="p-3">Disabled</div>,
        disabled: true
      }]} />
      </section>
    </div>
}`,...(Oe=(Je=g.parameters)==null?void 0:Je.docs)==null?void 0:Oe.source},description:{story:"Complete tabs showcase",...(Be=(Ue=g.parameters)==null?void 0:Ue.docs)==null?void 0:Be.description}}};const Qe=["Default","CompoundComponents","Variants","Pills","Underline","Vertical","VerticalPills","Fill","Justified","Controlled","DisabledTabs","WithIcons","CardWithTabs","ManyTabs","CompleteShowcase"];export{u as CardWithTabs,g as CompleteShowcase,l as CompoundComponents,b as Controlled,i as Default,h as DisabledTabs,m as Fill,p as Justified,x as ManyTabs,n as Pills,c as Underline,r as Variants,o as Vertical,d as VerticalPills,v as WithIcons,Qe as __namedExportsOrder,Ke as default};
