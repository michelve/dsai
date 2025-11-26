import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{b as r,c as t}from"./Tabs-CHAWmy3D.js";import{r as Oe}from"./iframe-BdiDpM7d.js";import"./preload-helper-Dp1pzeXC.js";const Je={title:"Components/Breadcrumb",component:r,parameters:{layout:"padded",docs:{description:{component:"An accessible breadcrumb navigation component supporting custom separators, collapsible items for long paths, and router integration. Features automatic security validation, performance optimizations, and WCAG 2.2 AA compliance."}}},tags:["autodocs"],argTypes:{separator:{control:"text",description:"Custom separator between items",table:{type:{summary:"ReactNode"},defaultValue:{summary:"/"}}},maxItems:{control:"number",description:"Maximum items before collapse",table:{type:{summary:"number"}}},itemsBeforeCollapse:{control:"number",description:"Items to show before ellipsis",table:{type:{summary:"number"},defaultValue:{summary:"1"}}},itemsAfterCollapse:{control:"number",description:"Items to show after ellipsis",table:{type:{summary:"number"},defaultValue:{summary:"1"}}}}},a=[{id:"home",label:"Home",href:"#"},{id:"library",label:"Library",href:"#"},{id:"data",label:"Data",active:!0}],C=[{id:"home",label:"Home",href:"#"},{id:"products",label:"Products",href:"#"},{id:"electronics",label:"Electronics",href:"#"},{id:"computers",label:"Computers",href:"#"},{id:"laptops",label:"Laptops",href:"#"},{id:"gaming",label:"Gaming Laptops",active:!0}],l={args:{items:a}},i={render:()=>e.jsxs(r,{children:[e.jsx(t,{href:"#",children:"Home"}),e.jsx(t,{href:"#",children:"Library"}),e.jsx(t,{active:!0,children:"Data"})]})},o={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Default (/)"}),e.jsx(r,{items:a})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Arrow (>)"}),e.jsx(r,{items:a,separator:">"})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Chevron (›)"}),e.jsx(r,{items:a,separator:"›"})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Bullet (•)"}),e.jsx(r,{items:a,separator:"•"})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Pipe (|)"}),e.jsx(r,{items:a,separator:"|"})]})]})},c={args:{items:C,maxItems:4,itemsBeforeCollapse:1,itemsAfterCollapse:2}},n={render:function(){const[s,y]=Oe.useState(!1);return e.jsxs("div",{children:[e.jsx(r,{items:C,maxItems:4,expanded:s,onExpand:()=>y(!0)}),s&&e.jsx("button",{type:"button",className:"btn btn-sm btn-link mt-2",onClick:()=>y(!1),children:"Collapse"})]})}},d={args:{items:[{id:"home",label:"Home",href:"#",icon:e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"currentColor","aria-hidden":"true",children:[e.jsx("title",{children:"Home"}),e.jsx("path",{d:"M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"})]})},{id:"settings",label:"Settings",href:"#",icon:e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"currentColor","aria-hidden":"true",children:[e.jsx("title",{children:"Settings"}),e.jsx("path",{d:"M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"}),e.jsx("path",{d:"M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"})]})},{id:"profile",label:"Profile",active:!0}]}},m={render:()=>{const j=s=>()=>{alert(`Navigating to ${s}`)};return e.jsx(r,{items:[{id:"home",label:"Home",onClick:j("Home")},{id:"products",label:"Products",onClick:j("Products")},{id:"current",label:"Current Page",active:!0}]})}},u={render:()=>e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-header bg-light",children:e.jsx(r,{items:[{id:"dashboard",label:"Dashboard",href:"#"},{id:"users",label:"Users",href:"#"},{id:"profile",label:"User Profile",active:!0}]})}),e.jsxs("div",{className:"card-body",children:[e.jsx("h5",{className:"card-title",children:"User Profile"}),e.jsx("p",{className:"card-text",children:"This is the user profile page content."})]})]})},p={args:{items:[{id:"1",label:"Home",href:"#"},{id:"2",label:"This is a very long category name",href:"#"},{id:"3",label:"Another extremely long subcategory name",href:"#"},{id:"4",label:"Current Page with Long Title",active:!0}]}},b={args:{items:[{id:"home",label:"Home",active:!0}]}},h={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"✅ Safe: HTTP/HTTPS links and internal paths work"}),e.jsx(r,{items:[{id:"home",label:"Home",href:"/"},{id:"external",label:"External Site",href:"https://example.com"},{id:"current",label:"Current",active:!0}]})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"🛡️ Blocked: Dangerous protocols (javascript:, data:, vbscript:) are safely converted to '#'"}),e.jsx(r,{items:[{id:"home",label:"Home",href:"/"},{id:"danger1",label:"javascript: (blocked)",href:"#"},{id:"danger2",label:"data: (blocked)",href:"#"},{id:"safe",label:"Safe",active:!0}]})]})]})},x={render:()=>e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-2",children:'External links automatically get rel="noopener noreferrer" for security'}),e.jsx(r,{items:[{id:"home",label:"Home",href:"#"},{id:"docs",label:"Documentation",href:"https://docs.example.com"},{id:"api",label:"API Reference",href:"https://api.example.com"},{id:"current",label:"Current Page",active:!0}]}),e.jsx("div",{className:"alert alert-info mt-3 mb-0",children:e.jsxs("small",{children:[e.jsx("strong",{children:"Security:"}),' All external links include rel="noopener noreferrer" to prevent:',e.jsxs("ul",{className:"mb-0 mt-1",children:[e.jsx("li",{children:"window.opener access from target page"}),e.jsx("li",{children:"Referrer information leakage"}),e.jsx("li",{children:"Performance issues from noopener"})]})]})})]})},f={render:()=>e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-2",children:'Icons are visually displayed but hidden from screen readers (aria-hidden="true")'}),e.jsx(r,{items:[{id:"home",label:"Home",href:"#",icon:"🏠"},{id:"products",label:"Products",href:"#",icon:"📦"},{id:"details",label:"Product Details",href:"#",icon:"🔍"},{id:"reviews",label:"Customer Reviews",active:!0,icon:"⭐"}]}),e.jsx("div",{className:"alert alert-info mt-3 mb-0",children:e.jsxs("small",{children:[e.jsx("strong",{children:"Accessibility:"})," Screen readers announce only text labels, not icons. Icons enhance visual hierarchy without affecting assistive technology."]})})]})},v={render:function(){const[s,y]=Oe.useState(0);return e.jsxs("div",{children:[e.jsxs("small",{className:"text-muted d-block mb-2",children:["Component re-renders: ",s,e.jsx("br",{}),"Breadcrumb uses React.memo + useMemo to prevent unnecessary renders"]}),e.jsx(r,{items:[{id:"home",label:"Home",href:"/"},{id:"products",label:"Products",href:"/products"},{id:"current",label:"Current Page",active:!0}]}),e.jsxs("button",{type:"button",className:"btn btn-sm btn-outline-primary mt-3",onClick:()=>y(s+1),children:["Force Parent Re-render (",s,")"]}),e.jsx("div",{className:"alert alert-info mt-3 mb-0",children:e.jsxs("small",{children:[e.jsx("strong",{children:"Performance:"})," The breadcrumb component uses React.memo and useMemo hooks to:",e.jsxs("ul",{className:"mb-0 mt-1",children:[e.jsx("li",{children:"Skip re-renders when props haven't changed"}),e.jsx("li",{children:"Cache className and style computations"}),e.jsx("li",{children:"Memoize render functions with useCallback"}),e.jsx("li",{children:"Optimize for re-render-heavy parent components"})]})]})})]})}},g={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"Basic"}),e.jsx(r,{items:a})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"Custom Separators"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(r,{items:a,separator:">"}),e.jsx(r,{items:a,separator:"›"}),e.jsx(r,{items:a,separator:"•"})]})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"Collapsible (click ellipsis to expand)"}),e.jsx(r,{items:C,maxItems:4})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"With Icons"}),e.jsx(r,{items:[{id:"home",label:"Home",href:"#",icon:e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"currentColor","aria-hidden":"true",children:[e.jsx("title",{children:"Home"}),e.jsx("path",{d:"M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"})]})},{id:"library",label:"Library",href:"#"},{id:"data",label:"Data",active:!0}]})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"Compound Components"}),e.jsxs(r,{children:[e.jsx(t,{href:"#",children:"Home"}),e.jsx(t,{href:"#",children:"Products"}),e.jsx(t,{active:!0,children:"Current"})]})]})]})};var k,B,N,I,S;l.parameters={...l.parameters,docs:{...(k=l.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    items: basicItems
  }
}`,...(N=(B=l.parameters)==null?void 0:B.docs)==null?void 0:N.source},description:{story:"Default breadcrumb using items prop",...(S=(I=l.parameters)==null?void 0:I.docs)==null?void 0:S.description}}};var P,w,H,L,D;i.parameters={...i.parameters,docs:{...(P=i.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => <Breadcrumb>
      <BreadcrumbItem href="#">Home</BreadcrumbItem>
      <BreadcrumbItem href="#">Library</BreadcrumbItem>
      <BreadcrumbItem active>Data</BreadcrumbItem>
    </Breadcrumb>
}`,...(H=(w=i.parameters)==null?void 0:w.docs)==null?void 0:H.source},description:{story:"Breadcrumb using compound components",...(D=(L=i.parameters)==null?void 0:L.docs)==null?void 0:D.description}}};var A,V,M,E,z;o.parameters={...o.parameters,docs:{...(A=o.parameters)==null?void 0:A.docs,source:{originalSource:`{
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
}`,...(M=(V=o.parameters)==null?void 0:V.docs)==null?void 0:M.source},description:{story:"Custom separators",...(z=(E=o.parameters)==null?void 0:E.docs)==null?void 0:z.description}}};var T,R,W,Z,U;c.parameters={...c.parameters,docs:{...(T=c.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    items: longPathItems,
    maxItems: 4,
    itemsBeforeCollapse: 1,
    itemsAfterCollapse: 2
  }
}`,...(W=(R=c.parameters)==null?void 0:R.docs)==null?void 0:W.source},description:{story:"Collapsible breadcrumb for long paths",...(U=(Z=c.parameters)==null?void 0:Z.docs)==null?void 0:U.description}}};var F,O,G,_,$;n.parameters={...n.parameters,docs:{...(F=n.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: function CollapsibleBreadcrumb() {
    const [expanded, setExpanded] = useState(false);
    return <div>
        <Breadcrumb items={longPathItems} maxItems={4} expanded={expanded} onExpand={() => setExpanded(true)} />
        {expanded && <button type="button" className="btn btn-sm btn-link mt-2" onClick={() => setExpanded(false)}>
            Collapse
          </button>}
      </div>;
  }
}`,...(G=(O=n.parameters)==null?void 0:O.docs)==null?void 0:G.source},description:{story:"Collapsible with expand interaction",...($=(_=n.parameters)==null?void 0:_.docs)==null?void 0:$.description}}};var q,J,K,Q,X;d.parameters={...d.parameters,docs:{...(q=d.parameters)==null?void 0:q.docs,source:{originalSource:`{
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
}`,...(K=(J=d.parameters)==null?void 0:J.docs)==null?void 0:K.source},description:{story:"Breadcrumb with icons",...(X=(Q=d.parameters)==null?void 0:Q.docs)==null?void 0:X.description}}};var Y,ee,re,ae,se;m.parameters={...m.parameters,docs:{...(Y=m.parameters)==null?void 0:Y.docs,source:{originalSource:`{
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
}`,...(re=(ee=m.parameters)==null?void 0:ee.docs)==null?void 0:re.source},description:{story:"Breadcrumb with click handlers",...(se=(ae=m.parameters)==null?void 0:ae.docs)==null?void 0:se.description}}};var te,le,ie,oe,ce;u.parameters={...u.parameters,docs:{...(te=u.parameters)==null?void 0:te.docs,source:{originalSource:`{
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
}`,...(ie=(le=u.parameters)==null?void 0:le.docs)==null?void 0:ie.source},description:{story:"Breadcrumb in a card header",...(ce=(oe=u.parameters)==null?void 0:oe.docs)==null?void 0:ce.description}}};var ne,de,me,ue,pe;p.parameters={...p.parameters,docs:{...(ne=p.parameters)==null?void 0:ne.docs,source:{originalSource:`{
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
}`,...(me=(de=p.parameters)==null?void 0:de.docs)==null?void 0:me.source},description:{story:"Breadcrumb with long labels",...(pe=(ue=p.parameters)==null?void 0:ue.docs)==null?void 0:pe.description}}};var be,he,xe,fe,ve;b.parameters={...b.parameters,docs:{...(be=b.parameters)==null?void 0:be.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'home',
      label: 'Home',
      active: true
    }]
  }
}`,...(xe=(he=b.parameters)==null?void 0:he.docs)==null?void 0:xe.source},description:{story:"Single item breadcrumb",...(ve=(fe=b.parameters)==null?void 0:fe.docs)==null?void 0:ve.description}}};var ge,je,ye,Ce,ke;h.parameters={...h.parameters,docs:{...(ge=h.parameters)==null?void 0:ge.docs,source:{originalSource:`{
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
}`,...(ye=(je=h.parameters)==null?void 0:je.docs)==null?void 0:ye.source},description:{story:`Demonstrates security validation - dangerous protocols are blocked
and converted to safe '#' fallback`,...(ke=(Ce=h.parameters)==null?void 0:Ce.docs)==null?void 0:ke.description}}};var Be,Ne,Ie,Se,Pe;x.parameters={...x.parameters,docs:{...(Be=x.parameters)==null?void 0:Be.docs,source:{originalSource:`{
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
}`,...(Ie=(Ne=x.parameters)==null?void 0:Ne.docs)==null?void 0:Ie.source},description:{story:"Demonstrates automatic rel attribute for external links",...(Pe=(Se=x.parameters)==null?void 0:Se.docs)==null?void 0:Pe.description}}};var we,He,Le,De,Ae;f.parameters={...f.parameters,docs:{...(we=f.parameters)==null?void 0:we.docs,source:{originalSource:`{
  render: () => <div>
      <small className="text-muted d-block mb-2">
        Icons are visually displayed but hidden from screen readers (aria-hidden="true")
      </small>
      <Breadcrumb items={[{
      id: 'home',
      label: 'Home',
      href: '#',
      icon: '🏠'
    }, {
      id: 'products',
      label: 'Products',
      href: '#',
      icon: '📦'
    }, {
      id: 'details',
      label: 'Product Details',
      href: '#',
      icon: '🔍'
    }, {
      id: 'reviews',
      label: 'Customer Reviews',
      active: true,
      icon: '⭐'
    }]} />
      <div className="alert alert-info mt-3 mb-0">
        <small>
          <strong>Accessibility:</strong> Screen readers announce only text labels, not icons. Icons
          enhance visual hierarchy without affecting assistive technology.
        </small>
      </div>
    </div>
}`,...(Le=(He=f.parameters)==null?void 0:He.docs)==null?void 0:Le.source},description:{story:"Demonstrates icon accessibility - icons are hidden from screen readers",...(Ae=(De=f.parameters)==null?void 0:De.docs)==null?void 0:Ae.description}}};var Ve,Me,Ee,ze,Te;v.parameters={...v.parameters,docs:{...(Ve=v.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
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
}`,...(Ee=(Me=v.parameters)==null?void 0:Me.docs)==null?void 0:Ee.source},description:{story:`Demonstrates performance optimizations through memoization
In real usage, parent re-renders won't trigger child re-renders`,...(Te=(ze=v.parameters)==null?void 0:ze.docs)==null?void 0:Te.description}}};var Re,We,Ze,Ue,Fe;g.parameters={...g.parameters,docs:{...(Re=g.parameters)==null?void 0:Re.docs,source:{originalSource:`{
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
}`,...(Ze=(We=g.parameters)==null?void 0:We.docs)==null?void 0:Ze.source},description:{story:"Complete breadcrumb showcase",...(Fe=(Ue=g.parameters)==null?void 0:Ue.docs)==null?void 0:Fe.description}}};const Ke=["Default","CompoundComponents","CustomSeparators","Collapsible","CollapsibleInteractive","WithIcons","WithClickHandlers","InCardHeader","LongLabels","SingleItem","SecurityHREFValidation","SecurityExternalLinks","AccessibilityIcons","PerformanceMemoization","CompleteShowcase"];export{f as AccessibilityIcons,c as Collapsible,n as CollapsibleInteractive,g as CompleteShowcase,i as CompoundComponents,o as CustomSeparators,l as Default,u as InCardHeader,p as LongLabels,v as PerformanceMemoization,x as SecurityExternalLinks,h as SecurityHREFValidation,b as SingleItem,m as WithClickHandlers,d as WithIcons,Ke as __namedExportsOrder,Je as default};
