import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{d as r,e as o,H as er,f as rr,g as sr,S as ar}from"./Tabs-KsVJ-pPQ.js";import{r as N}from"./iframe-CyugwH-p.js";import"./preload-helper-Dp1pzeXC.js";const ir={title:"Components/Breadcrumb",component:r,parameters:{layout:"padded",docs:{description:{component:"An accessible breadcrumb navigation component supporting custom separators, collapsible items for long paths, and router integration. Uses a finite state machine (FSM) for expand/collapse behavior. Features automatic security validation, performance optimizations, and WCAG 2.2 AA compliance."}}},tags:["autodocs"],argTypes:{separator:{control:"text",description:"Custom separator between items",table:{type:{summary:"ReactNode"},defaultValue:{summary:"/"}}},maxItems:{control:"number",description:"Maximum items before collapse",table:{type:{summary:"number"}}},itemsBeforeCollapse:{control:"number",description:"Items to show before ellipsis",table:{type:{summary:"number"},defaultValue:{summary:"1"}}},itemsAfterCollapse:{control:"number",description:"Items to show after ellipsis",table:{type:{summary:"number"},defaultValue:{summary:"1"}}},expanded:{control:"boolean",description:"Controlled expanded state (triggers FSM RESET_FROM_PROPS event)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}}},t=[{id:"home",label:"Home",href:"#"},{id:"library",label:"Library",href:"#"},{id:"data",label:"Data",active:!0}],k=[{id:"home",label:"Home",href:"#"},{id:"products",label:"Products",href:"#"},{id:"electronics",label:"Electronics",href:"#"},{id:"computers",label:"Computers",href:"#"},{id:"laptops",label:"Laptops",href:"#"},{id:"gaming",label:"Gaming Laptops",active:!0}],i={args:{items:t}},c={render:()=>e.jsxs(r,{children:[e.jsx(o,{href:"#",children:"Home"}),e.jsx(o,{href:"#",children:"Library"}),e.jsx(o,{active:!0,children:"Data"})]})},d={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Default (/)"}),e.jsx(r,{items:t})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Arrow (>)"}),e.jsx(r,{items:t,separator:">"})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Chevron (›)"}),e.jsx(r,{items:t,separator:"›"})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Bullet (•)"}),e.jsx(r,{items:t,separator:"•"})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Pipe (|)"}),e.jsx(r,{items:t,separator:"|"})]})]})},m={args:{items:k,maxItems:4,itemsBeforeCollapse:1,itemsAfterCollapse:2}},u={render:function(){const[s,a]=N.useState(!1);return e.jsxs("div",{children:[e.jsx(r,{items:k,maxItems:4,expanded:s,onExpand:()=>a(!0)}),e.jsxs("div",{className:"mt-2 d-flex gap-2 align-items-center",children:[e.jsxs("span",{className:"badge bg-secondary",children:["FSM State: ",s?"expanded":"collapsed"]}),s&&e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary",onClick:()=>a(!1),children:"Collapse"})]})]})}},p={render:function(){const[s,a]=N.useState(!1),[l,B]=N.useState("uncontrolled"),Ye=N.useCallback(()=>{l==="controlled"&&a(!0)},[l]);return e.jsxs("div",{children:[e.jsx("div",{className:"mb-3",children:e.jsxs("div",{className:"btn-group",role:"group","aria-label":"Mode selection",children:[e.jsx("button",{type:"button",className:`btn btn-sm ${l==="uncontrolled"?"btn-primary":"btn-outline-primary"}`,onClick:()=>{B("uncontrolled"),a(!1)},children:"Uncontrolled"}),e.jsx("button",{type:"button",className:`btn btn-sm ${l==="controlled"?"btn-primary":"btn-outline-primary"}`,onClick:()=>{B("controlled"),a(!1)},children:"Controlled"})]})}),e.jsx(r,{items:k,maxItems:4,expanded:l==="controlled"?s:void 0,onExpand:Ye}),e.jsxs("div",{className:"mt-3 p-3 bg-light rounded",children:[e.jsx("h6",{className:"mb-2",children:"FSM State Debug"}),e.jsxs("div",{className:"d-flex flex-column gap-1",children:[e.jsxs("small",{children:[e.jsx("strong",{children:"Mode:"})," ",l]}),e.jsxs("small",{children:[e.jsx("strong",{children:"Controlled expanded prop:"})," ",l==="controlled"?String(s):"undefined (uncontrolled)"]}),e.jsxs("small",{children:[e.jsx("code",{children:"data-visual-state"})," attribute shows current FSM state"]})]}),l==="controlled"&&e.jsxs("div",{className:"mt-2",children:[e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-primary me-2",onClick:()=>a(!0),children:"Set expanded=true"}),e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary",onClick:()=>a(!1),children:"Set expanded=false"})]})]}),e.jsx("div",{className:"alert alert-info mt-3 mb-0",children:e.jsxs("small",{children:[e.jsx("strong",{children:"FSM State Machine:"}),e.jsxs("ul",{className:"mb-0 mt-1",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"States:"})," ",e.jsx("code",{children:"collapsed"})," | ",e.jsx("code",{children:"expanded"})]}),e.jsxs("li",{children:[e.jsx("strong",{children:"EXPAND event:"})," Ellipsis click (only works in uncontrolled mode)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"RESET_FROM_PROPS event:"})," Syncs with controlled ",e.jsx("code",{children:"expanded"})," ","prop"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"data-visual-state:"})," Attribute on nav for testing/styling"]})]})]})})]})}},b={args:{items:[{id:"home",label:"Home",href:"#",icon:e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"currentColor","aria-hidden":"true",children:[e.jsx("title",{children:"Home"}),e.jsx("path",{d:"M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"})]})},{id:"settings",label:"Settings",href:"#",icon:e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"currentColor","aria-hidden":"true",children:[e.jsx("title",{children:"Settings"}),e.jsx("path",{d:"M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"}),e.jsx("path",{d:"M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"})]})},{id:"profile",label:"Profile",active:!0}]}},h={render:()=>{const n=s=>()=>{alert(`Navigating to ${s}`)};return e.jsx(r,{items:[{id:"home",label:"Home",onClick:n("Home")},{id:"products",label:"Products",onClick:n("Products")},{id:"current",label:"Current Page",active:!0}]})}},x={render:()=>e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-header bg-light",children:e.jsx(r,{items:[{id:"dashboard",label:"Dashboard",href:"#"},{id:"users",label:"Users",href:"#"},{id:"profile",label:"User Profile",active:!0}]})}),e.jsxs("div",{className:"card-body",children:[e.jsx("h5",{className:"card-title",children:"User Profile"}),e.jsx("p",{className:"card-text",children:"This is the user profile page content."})]})]})},f={args:{items:[{id:"1",label:"Home",href:"#"},{id:"2",label:"This is a very long category name",href:"#"},{id:"3",label:"Another extremely long subcategory name",href:"#"},{id:"4",label:"Current Page with Long Title",active:!0}]}},g={args:{items:[{id:"home",label:"Home",active:!0}]}},v={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"✅ Safe: HTTP/HTTPS links and internal paths work"}),e.jsx(r,{items:[{id:"home",label:"Home",href:"/"},{id:"external",label:"External Site",href:"https://example.com"},{id:"current",label:"Current",active:!0}]})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"🛡️ Blocked: Dangerous protocols (javascript:, data:, vbscript:) are safely converted to '#'"}),e.jsx(r,{items:[{id:"home",label:"Home",href:"/"},{id:"danger1",label:"javascript: (blocked)",href:"#"},{id:"danger2",label:"data: (blocked)",href:"#"},{id:"safe",label:"Safe",active:!0}]})]})]})},j={render:()=>e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-2",children:'External links automatically get rel="noopener noreferrer" for security'}),e.jsx(r,{items:[{id:"home",label:"Home",href:"#"},{id:"docs",label:"Documentation",href:"https://docs.example.com"},{id:"api",label:"API Reference",href:"https://api.example.com"},{id:"current",label:"Current Page",active:!0}]}),e.jsx("div",{className:"alert alert-info mt-3 mb-0",children:e.jsxs("small",{children:[e.jsx("strong",{children:"Security:"}),' All external links include rel="noopener noreferrer" to prevent:',e.jsxs("ul",{className:"mb-0 mt-1",children:[e.jsx("li",{children:"window.opener access from target page"}),e.jsx("li",{children:"Referrer information leakage"}),e.jsx("li",{children:"Performance issues from noopener"})]})]})})]})},y={render:()=>e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-2",children:'Icons are visually displayed but hidden from screen readers (aria-hidden="true")'}),e.jsx(r,{items:[{id:"home",label:"Home",href:"#",icon:e.jsx(er,{size:16})},{id:"products",label:"Products",href:"#",icon:e.jsx(rr,{size:16})},{id:"details",label:"Product Details",href:"#",icon:e.jsx(sr,{size:16})},{id:"reviews",label:"Customer Reviews",active:!0,icon:e.jsx(ar,{size:16})}]}),e.jsx("div",{className:"alert alert-info mt-3 mb-0",children:e.jsxs("small",{children:[e.jsx("strong",{children:"Accessibility:"})," Screen readers announce only text labels, not icons. Icons enhance visual hierarchy without affecting assistive technology."]})})]})},C={render:function(){const[s,a]=N.useState(0);return e.jsxs("div",{children:[e.jsxs("small",{className:"text-muted d-block mb-2",children:["Component re-renders: ",s,e.jsx("br",{}),"Breadcrumb uses React.memo + useMemo to prevent unnecessary renders"]}),e.jsx(r,{items:[{id:"home",label:"Home",href:"/"},{id:"products",label:"Products",href:"/products"},{id:"current",label:"Current Page",active:!0}]}),e.jsxs("button",{type:"button",className:"btn btn-sm btn-outline-primary mt-3",onClick:()=>a(s+1),children:["Force Parent Re-render (",s,")"]}),e.jsx("div",{className:"alert alert-info mt-3 mb-0",children:e.jsxs("small",{children:[e.jsx("strong",{children:"Performance:"})," The breadcrumb component uses React.memo and useMemo hooks to:",e.jsxs("ul",{className:"mb-0 mt-1",children:[e.jsx("li",{children:"Skip re-renders when props haven't changed"}),e.jsx("li",{children:"Cache className and style computations"}),e.jsx("li",{children:"Memoize render functions with useCallback"}),e.jsx("li",{children:"Optimize for re-render-heavy parent components"})]})]})})]})}},S={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"Basic"}),e.jsx(r,{items:t})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"Custom Separators"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(r,{items:t,separator:">"}),e.jsx(r,{items:t,separator:"›"}),e.jsx(r,{items:t,separator:"•"})]})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"Collapsible (click ellipsis to expand)"}),e.jsx(r,{items:k,maxItems:4})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"With Icons"}),e.jsx(r,{items:[{id:"home",label:"Home",href:"#",icon:e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"currentColor","aria-hidden":"true",children:[e.jsx("title",{children:"Home"}),e.jsx("path",{d:"M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"})]})},{id:"library",label:"Library",href:"#"},{id:"data",label:"Data",active:!0}]})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"Compound Components"}),e.jsxs(r,{children:[e.jsx(o,{href:"#",children:"Home"}),e.jsx(o,{href:"#",children:"Products"}),e.jsx(o,{active:!0,children:"Current"})]})]})]})};var I,P,M,w,H;i.parameters={...i.parameters,docs:{...(I=i.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    items: basicItems
  }
}`,...(M=(P=i.parameters)==null?void 0:P.docs)==null?void 0:M.source},description:{story:"Default breadcrumb using items prop",...(H=(w=i.parameters)==null?void 0:w.docs)==null?void 0:H.description}}};var E,D,A,L,F;c.parameters={...c.parameters,docs:{...(E=c.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <Breadcrumb>
      <BreadcrumbItem href="#">Home</BreadcrumbItem>
      <BreadcrumbItem href="#">Library</BreadcrumbItem>
      <BreadcrumbItem active>Data</BreadcrumbItem>
    </Breadcrumb>
}`,...(A=(D=c.parameters)==null?void 0:D.docs)==null?void 0:A.source},description:{story:"Breadcrumb using compound components",...(F=(L=c.parameters)==null?void 0:L.docs)==null?void 0:F.description}}};var V,z,R,T,O;d.parameters={...d.parameters,docs:{...(V=d.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <div>
        <small className="text-muted d-block mb-1">Default (/)</small>
        <Breadcrumb items={basicItems} />
      </div>
      <div>
        <small className="text-muted d-block mb-1">Arrow (&gt;)</small>
        <Breadcrumb items={basicItems} separator=">" />
      </div>
      <div>
        <small className="text-muted d-block mb-1">Chevron (›)</small>
        <Breadcrumb items={basicItems} separator="›" />
      </div>
      <div>
        <small className="text-muted d-block mb-1">Bullet (•)</small>
        <Breadcrumb items={basicItems} separator="•" />
      </div>
      <div>
        <small className="text-muted d-block mb-1">Pipe (|)</small>
        <Breadcrumb items={basicItems} separator="|" />
      </div>
    </div>
}`,...(R=(z=d.parameters)==null?void 0:z.docs)==null?void 0:R.source},description:{story:"Custom separators",...(O=(T=d.parameters)==null?void 0:T.docs)==null?void 0:O.description}}};var U,W,Z,_,$;m.parameters={...m.parameters,docs:{...(U=m.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    items: longPathItems,
    maxItems: 4,
    itemsBeforeCollapse: 1,
    itemsAfterCollapse: 2
  }
}`,...(Z=(W=m.parameters)==null?void 0:W.docs)==null?void 0:Z.source},description:{story:"Collapsible breadcrumb for long paths",...($=(_=m.parameters)==null?void 0:_.docs)==null?void 0:$.description}}};var G,X,q,J,K;u.parameters={...u.parameters,docs:{...(G=u.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: function CollapsibleBreadcrumb() {
    const [expanded, setExpanded] = useState(false);
    return <div>
        <Breadcrumb items={longPathItems} maxItems={4} expanded={expanded} onExpand={() => setExpanded(true)} />
        <div className="mt-2 d-flex gap-2 align-items-center">
          <span className="badge bg-secondary">
            FSM State: {expanded ? 'expanded' : 'collapsed'}
          </span>
          {expanded && <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setExpanded(false)}>
              Collapse
            </button>}
        </div>
      </div>;
  }
}`,...(q=(X=u.parameters)==null?void 0:X.docs)==null?void 0:q.source},description:{story:"Collapsible with expand interaction",...(K=(J=u.parameters)==null?void 0:J.docs)==null?void 0:K.description}}};var Q,Y,ee,re,se;p.parameters={...p.parameters,docs:{...(Q=p.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: function FSMBreadcrumb() {
    const [expanded, setExpanded] = useState(false);
    const [mode, setMode] = useState<'uncontrolled' | 'controlled'>('uncontrolled');
    const handleExpand = useCallback(() => {
      if (mode === 'controlled') {
        setExpanded(true);
      }
      // In uncontrolled mode, FSM handles state internally
    }, [mode]);
    return <div>
        <div className="mb-3">
          <div className="btn-group" role="group" aria-label="Mode selection">
            <button type="button" className={\`btn btn-sm \${mode === 'uncontrolled' ? 'btn-primary' : 'btn-outline-primary'}\`} onClick={() => {
            setMode('uncontrolled');
            setExpanded(false);
          }}>
              Uncontrolled
            </button>
            <button type="button" className={\`btn btn-sm \${mode === 'controlled' ? 'btn-primary' : 'btn-outline-primary'}\`} onClick={() => {
            setMode('controlled');
            setExpanded(false);
          }}>
              Controlled
            </button>
          </div>
        </div>

        <Breadcrumb items={longPathItems} maxItems={4} expanded={mode === 'controlled' ? expanded : undefined} onExpand={handleExpand} />

        <div className="mt-3 p-3 bg-light rounded">
          <h6 className="mb-2">FSM State Debug</h6>
          <div className="d-flex flex-column gap-1">
            <small>
              <strong>Mode:</strong> {mode}
            </small>
            <small>
              <strong>Controlled expanded prop:</strong>{' '}
              {mode === 'controlled' ? String(expanded) : 'undefined (uncontrolled)'}
            </small>
            <small>
              <code>data-visual-state</code> attribute shows current FSM state
            </small>
          </div>
          {mode === 'controlled' && <div className="mt-2">
              <button type="button" className="btn btn-sm btn-outline-primary me-2" onClick={() => setExpanded(true)}>
                Set expanded=true
              </button>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setExpanded(false)}>
                Set expanded=false
              </button>
            </div>}
        </div>

        <div className="alert alert-info mt-3 mb-0">
          <small>
            <strong>FSM State Machine:</strong>
            <ul className="mb-0 mt-1">
              <li>
                <strong>States:</strong> <code>collapsed</code> | <code>expanded</code>
              </li>
              <li>
                <strong>EXPAND event:</strong> Ellipsis click (only works in uncontrolled mode)
              </li>
              <li>
                <strong>RESET_FROM_PROPS event:</strong> Syncs with controlled <code>expanded</code>{' '}
                prop
              </li>
              <li>
                <strong>data-visual-state:</strong> Attribute on nav for testing/styling
              </li>
            </ul>
          </small>
        </div>
      </div>;
  }
}`,...(ee=(Y=p.parameters)==null?void 0:Y.docs)==null?void 0:ee.source},description:{story:"Demonstrates the FSM-based expand/collapse behavior.\nThe `data-visual-state` attribute reflects the current FSM state.",...(se=(re=p.parameters)==null?void 0:re.docs)==null?void 0:se.description}}};var ae,te,le,oe,ne;b.parameters={...b.parameters,docs:{...(ae=b.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'home',
      label: 'Home',
      href: '#',
      icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <title>Home</title>
            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
          </svg>
    }, {
      id: 'settings',
      label: 'Settings',
      href: '#',
      icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <title>Settings</title>
            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
          </svg>
    }, {
      id: 'profile',
      label: 'Profile',
      active: true
    }]
  }
}`,...(le=(te=b.parameters)==null?void 0:te.docs)==null?void 0:le.source},description:{story:"Breadcrumb with icons",...(ne=(oe=b.parameters)==null?void 0:oe.docs)==null?void 0:ne.description}}};var ie,ce,de,me,ue;h.parameters={...h.parameters,docs:{...(ie=h.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  render: () => {
    const handleClick = (page: string) => (): void => {
      alert(\`Navigating to \${page}\`);
    };
    return <Breadcrumb items={[{
      id: 'home',
      label: 'Home',
      onClick: handleClick('Home')
    }, {
      id: 'products',
      label: 'Products',
      onClick: handleClick('Products')
    }, {
      id: 'current',
      label: 'Current Page',
      active: true
    }]} />;
  }
}`,...(de=(ce=h.parameters)==null?void 0:ce.docs)==null?void 0:de.source},description:{story:"Breadcrumb with click handlers",...(ue=(me=h.parameters)==null?void 0:me.docs)==null?void 0:ue.description}}};var pe,be,he,xe,fe;x.parameters={...x.parameters,docs:{...(pe=x.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  render: () => <div className="card">
      <div className="card-header bg-light">
        <Breadcrumb items={[{
        id: 'dashboard',
        label: 'Dashboard',
        href: '#'
      }, {
        id: 'users',
        label: 'Users',
        href: '#'
      }, {
        id: 'profile',
        label: 'User Profile',
        active: true
      }]} />
      </div>
      <div className="card-body">
        <h5 className="card-title">User Profile</h5>
        <p className="card-text">This is the user profile page content.</p>
      </div>
    </div>
}`,...(he=(be=x.parameters)==null?void 0:be.docs)==null?void 0:he.source},description:{story:"Breadcrumb in a card header",...(fe=(xe=x.parameters)==null?void 0:xe.docs)==null?void 0:fe.description}}};var ge,ve,je,ye,Ce;f.parameters={...f.parameters,docs:{...(ge=f.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  args: {
    items: [{
      id: '1',
      label: 'Home',
      href: '#'
    }, {
      id: '2',
      label: 'This is a very long category name',
      href: '#'
    }, {
      id: '3',
      label: 'Another extremely long subcategory name',
      href: '#'
    }, {
      id: '4',
      label: 'Current Page with Long Title',
      active: true
    }]
  }
}`,...(je=(ve=f.parameters)==null?void 0:ve.docs)==null?void 0:je.source},description:{story:"Breadcrumb with long labels",...(Ce=(ye=f.parameters)==null?void 0:ye.docs)==null?void 0:Ce.description}}};var Se,Ne,ke,Be,Ie;g.parameters={...g.parameters,docs:{...(Se=g.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'home',
      label: 'Home',
      active: true
    }]
  }
}`,...(ke=(Ne=g.parameters)==null?void 0:Ne.docs)==null?void 0:ke.source},description:{story:"Single item breadcrumb",...(Ie=(Be=g.parameters)==null?void 0:Be.docs)==null?void 0:Ie.description}}};var Pe,Me,we,He,Ee;v.parameters={...v.parameters,docs:{...(Pe=v.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <div>
        <small className="text-muted d-block mb-1">
          ✅ Safe: HTTP/HTTPS links and internal paths work
        </small>
        <Breadcrumb items={[{
        id: 'home',
        label: 'Home',
        href: '/'
      }, {
        id: 'external',
        label: 'External Site',
        href: 'https://example.com'
      }, {
        id: 'current',
        label: 'Current',
        active: true
      }]} />
      </div>
      <div>
        <small className="text-muted d-block mb-1">
          🛡️ Blocked: Dangerous protocols (javascript:, data:, vbscript:) are safely converted to
          '#'
        </small>
        <Breadcrumb items={[{
        id: 'home',
        label: 'Home',
        href: '/'
      }, {
        id: 'danger1',
        label: 'javascript: (blocked)',
        href: '#'
      }, {
        id: 'danger2',
        label: 'data: (blocked)',
        href: '#'
      }, {
        id: 'safe',
        label: 'Safe',
        active: true
      }]} />
      </div>
    </div>
}`,...(we=(Me=v.parameters)==null?void 0:Me.docs)==null?void 0:we.source},description:{story:`Demonstrates security validation - dangerous protocols are blocked
and converted to safe '#' fallback`,...(Ee=(He=v.parameters)==null?void 0:He.docs)==null?void 0:Ee.description}}};var De,Ae,Le,Fe,Ve;j.parameters={...j.parameters,docs:{...(De=j.parameters)==null?void 0:De.docs,source:{originalSource:`{
  render: () => <div>
      <small className="text-muted d-block mb-2">
        External links automatically get rel="noopener noreferrer" for security
      </small>
      <Breadcrumb items={[{
      id: 'home',
      label: 'Home',
      href: '#'
    }, {
      id: 'docs',
      label: 'Documentation',
      href: 'https://docs.example.com'
    }, {
      id: 'api',
      label: 'API Reference',
      href: 'https://api.example.com'
    }, {
      id: 'current',
      label: 'Current Page',
      active: true
    }]} />
      <div className="alert alert-info mt-3 mb-0">
        <small>
          <strong>Security:</strong> All external links include rel="noopener noreferrer" to
          prevent:
          <ul className="mb-0 mt-1">
            <li>window.opener access from target page</li>
            <li>Referrer information leakage</li>
            <li>Performance issues from noopener</li>
          </ul>
        </small>
      </div>
    </div>
}`,...(Le=(Ae=j.parameters)==null?void 0:Ae.docs)==null?void 0:Le.source},description:{story:"Demonstrates automatic rel attribute for external links",...(Ve=(Fe=j.parameters)==null?void 0:Fe.docs)==null?void 0:Ve.description}}};var ze,Re,Te,Oe,Ue;y.parameters={...y.parameters,docs:{...(ze=y.parameters)==null?void 0:ze.docs,source:{originalSource:`{
  render: () => <div>
      <small className="text-muted d-block mb-2">
        Icons are visually displayed but hidden from screen readers (aria-hidden="true")
      </small>
      <Breadcrumb items={[{
      id: 'home',
      label: 'Home',
      href: '#',
      icon: <HouseIcon size={16} />
    }, {
      id: 'products',
      label: 'Products',
      href: '#',
      icon: <BoxIcon size={16} />
    }, {
      id: 'details',
      label: 'Product Details',
      href: '#',
      icon: <SearchIcon size={16} />
    }, {
      id: 'reviews',
      label: 'Customer Reviews',
      active: true,
      icon: <StarFillIcon size={16} />
    }]} />
      <div className="alert alert-info mt-3 mb-0">
        <small>
          <strong>Accessibility:</strong> Screen readers announce only text labels, not icons. Icons
          enhance visual hierarchy without affecting assistive technology.
        </small>
      </div>
    </div>
}`,...(Te=(Re=y.parameters)==null?void 0:Re.docs)==null?void 0:Te.source},description:{story:"Demonstrates icon accessibility - icons are hidden from screen readers",...(Ue=(Oe=y.parameters)==null?void 0:Oe.docs)==null?void 0:Ue.description}}};var We,Ze,_e,$e,Ge;C.parameters={...C.parameters,docs:{...(We=C.parameters)==null?void 0:We.docs,source:{originalSource:`{
  render: function PerformanceBreadcrumb() {
    const [counter, setCounter] = useState(0);
    return <div>
        <small className="text-muted d-block mb-2">
          Component re-renders: {counter}
          <br />
          Breadcrumb uses React.memo + useMemo to prevent unnecessary renders
        </small>
        <Breadcrumb items={[{
        id: 'home',
        label: 'Home',
        href: '/'
      }, {
        id: 'products',
        label: 'Products',
        href: '/products'
      }, {
        id: 'current',
        label: 'Current Page',
        active: true
      }]} />
        <button type="button" className="btn btn-sm btn-outline-primary mt-3" onClick={() => setCounter(counter + 1)}>
          Force Parent Re-render ({counter})
        </button>
        <div className="alert alert-info mt-3 mb-0">
          <small>
            <strong>Performance:</strong> The breadcrumb component uses React.memo and useMemo hooks
            to:
            <ul className="mb-0 mt-1">
              <li>Skip re-renders when props haven't changed</li>
              <li>Cache className and style computations</li>
              <li>Memoize render functions with useCallback</li>
              <li>Optimize for re-render-heavy parent components</li>
            </ul>
          </small>
        </div>
      </div>;
  }
}`,...(_e=(Ze=C.parameters)==null?void 0:Ze.docs)==null?void 0:_e.source},description:{story:`Demonstrates performance optimizations through memoization
In real usage, parent re-renders won't trigger child re-renders`,...(Ge=($e=C.parameters)==null?void 0:$e.docs)==null?void 0:Ge.description}}};var Xe,qe,Je,Ke,Qe;S.parameters={...S.parameters,docs:{...(Xe=S.parameters)==null?void 0:Xe.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }}>
      {/* Basic */}
      <section>
        <h5 className="mb-2">Basic</h5>
        <Breadcrumb items={basicItems} />
      </section>

      {/* Separators */}
      <section>
        <h5 className="mb-2">Custom Separators</h5>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
          <Breadcrumb items={basicItems} separator=">" />
          <Breadcrumb items={basicItems} separator="›" />
          <Breadcrumb items={basicItems} separator="•" />
        </div>
      </section>

      {/* Collapsible */}
      <section>
        <h5 className="mb-2">Collapsible (click ellipsis to expand)</h5>
        <Breadcrumb items={longPathItems} maxItems={4} />
      </section>

      {/* With Icons */}
      <section>
        <h5 className="mb-2">With Icons</h5>
        <Breadcrumb items={[{
        id: 'home',
        label: 'Home',
        href: '#',
        icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <title>Home</title>
                  <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
                </svg>
      }, {
        id: 'library',
        label: 'Library',
        href: '#'
      }, {
        id: 'data',
        label: 'Data',
        active: true
      }]} />
      </section>

      {/* Compound Components */}
      <section>
        <h5 className="mb-2">Compound Components</h5>
        <Breadcrumb>
          <BreadcrumbItem href="#">Home</BreadcrumbItem>
          <BreadcrumbItem href="#">Products</BreadcrumbItem>
          <BreadcrumbItem active>Current</BreadcrumbItem>
        </Breadcrumb>
      </section>
    </div>
}`,...(Je=(qe=S.parameters)==null?void 0:qe.docs)==null?void 0:Je.source},description:{story:"Complete breadcrumb showcase",...(Qe=(Ke=S.parameters)==null?void 0:Ke.docs)==null?void 0:Qe.description}}};const cr=["Default","CompoundComponents","CustomSeparators","Collapsible","CollapsibleInteractive","FSMStateMachine","WithIcons","WithClickHandlers","InCardHeader","LongLabels","SingleItem","SecurityHREFValidation","SecurityExternalLinks","AccessibilityIcons","PerformanceMemoization","CompleteShowcase"];export{y as AccessibilityIcons,m as Collapsible,u as CollapsibleInteractive,S as CompleteShowcase,c as CompoundComponents,d as CustomSeparators,i as Default,p as FSMStateMachine,x as InCardHeader,f as LongLabels,C as PerformanceMemoization,j as SecurityExternalLinks,v as SecurityHREFValidation,g as SingleItem,h as WithClickHandlers,b as WithIcons,cr as __namedExportsOrder,ir as default};
