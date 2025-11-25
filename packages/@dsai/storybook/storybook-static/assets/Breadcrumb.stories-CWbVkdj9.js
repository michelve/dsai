import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as Ce}from"./iframe-DUsD1aoV.js";import{b as r,c as s}from"./Tabs-B_l4R8lH.js";import"./preload-helper-Dp1pzeXC.js";const Ne={title:"Components/Breadcrumb",component:r,parameters:{layout:"padded",docs:{description:{component:"An accessible breadcrumb navigation component supporting custom separators, collapsible items for long paths, and router integration."}}},tags:["autodocs"],argTypes:{separator:{control:"text",description:"Custom separator between items",table:{type:{summary:"ReactNode"},defaultValue:{summary:"/"}}},maxItems:{control:"number",description:"Maximum items before collapse",table:{type:{summary:"number"}}},itemsBeforeCollapse:{control:"number",description:"Items to show before ellipsis",table:{type:{summary:"number"},defaultValue:{summary:"1"}}},itemsAfterCollapse:{control:"number",description:"Items to show after ellipsis",table:{type:{summary:"number"},defaultValue:{summary:"1"}}}}},a=[{id:"home",label:"Home",href:"#"},{id:"library",label:"Library",href:"#"},{id:"data",label:"Data",active:!0}],g=[{id:"home",label:"Home",href:"#"},{id:"products",label:"Products",href:"#"},{id:"electronics",label:"Electronics",href:"#"},{id:"computers",label:"Computers",href:"#"},{id:"laptops",label:"Laptops",href:"#"},{id:"gaming",label:"Gaming Laptops",active:!0}],t={args:{items:a}},l={render:()=>e.jsxs(r,{children:[e.jsx(s,{href:"#",children:"Home"}),e.jsx(s,{href:"#",children:"Library"}),e.jsx(s,{active:!0,children:"Data"})]})},i={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Default (/)"}),e.jsx(r,{items:a})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Arrow (>)"}),e.jsx(r,{items:a,separator:">"})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Chevron (›)"}),e.jsx(r,{items:a,separator:"›"})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Bullet (•)"}),e.jsx(r,{items:a,separator:"•"})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Pipe (|)"}),e.jsx(r,{items:a,separator:"|"})]})]})},o={args:{items:g,maxItems:4,itemsBeforeCollapse:1,itemsAfterCollapse:2}},c={render:function(){const[h,f]=Ce.useState(!1);return e.jsxs("div",{children:[e.jsx(r,{items:g,maxItems:4,expanded:h,onExpand:()=>f(!0)}),h&&e.jsx("button",{className:"btn btn-sm btn-link mt-2",onClick:()=>f(!1),children:"Collapse"})]})}},m={args:{items:[{id:"home",label:"Home",href:"#",icon:e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"currentColor",children:e.jsx("path",{d:"M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"})})},{id:"settings",label:"Settings",href:"#",icon:e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"currentColor",children:[e.jsx("path",{d:"M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"}),e.jsx("path",{d:"M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"})]})},{id:"profile",label:"Profile",active:!0}]}},n={render:()=>{const x=h=>()=>{alert(`Navigating to ${h}`)};return e.jsx(r,{items:[{id:"home",label:"Home",onClick:x("Home")},{id:"products",label:"Products",onClick:x("Products")},{id:"current",label:"Current Page",active:!0}]})}},d={render:()=>e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-header bg-light",children:e.jsx(r,{items:[{id:"dashboard",label:"Dashboard",href:"#"},{id:"users",label:"Users",href:"#"},{id:"profile",label:"User Profile",active:!0}]})}),e.jsxs("div",{className:"card-body",children:[e.jsx("h5",{className:"card-title",children:"User Profile"}),e.jsx("p",{className:"card-text",children:"This is the user profile page content."})]})]})},p={args:{items:[{id:"1",label:"Home",href:"#"},{id:"2",label:"This is a very long category name",href:"#"},{id:"3",label:"Another extremely long subcategory name",href:"#"},{id:"4",label:"Current Page with Long Title",active:!0}]}},u={args:{items:[{id:"home",label:"Home",active:!0}]}},b={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"Basic"}),e.jsx(r,{items:a})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"Custom Separators"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(r,{items:a,separator:">"}),e.jsx(r,{items:a,separator:"›"}),e.jsx(r,{items:a,separator:"•"})]})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"Collapsible (click ellipsis to expand)"}),e.jsx(r,{items:g,maxItems:4})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"With Icons"}),e.jsx(r,{items:[{id:"home",label:"Home",href:"#",icon:e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"currentColor",children:e.jsx("path",{d:"M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"})})},{id:"library",label:"Library",href:"#"},{id:"data",label:"Data",active:!0}]})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"Compound Components"}),e.jsxs(r,{children:[e.jsx(s,{href:"#",children:"Home"}),e.jsx(s,{href:"#",children:"Products"}),e.jsx(s,{active:!0,children:"Current"})]})]})]})};var v,C,j,y,B;t.parameters={...t.parameters,docs:{...(v=t.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    items: basicItems
  }
}`,...(j=(C=t.parameters)==null?void 0:C.docs)==null?void 0:j.source},description:{story:"Default breadcrumb using items prop",...(B=(y=t.parameters)==null?void 0:y.docs)==null?void 0:B.description}}};var I,N,L,k,w;l.parameters={...l.parameters,docs:{...(I=l.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <Breadcrumb>
      <BreadcrumbItem href="#">Home</BreadcrumbItem>
      <BreadcrumbItem href="#">Library</BreadcrumbItem>
      <BreadcrumbItem active>Data</BreadcrumbItem>
    </Breadcrumb>
}`,...(L=(N=l.parameters)==null?void 0:N.docs)==null?void 0:L.source},description:{story:"Breadcrumb using compound components",...(w=(k=l.parameters)==null?void 0:k.docs)==null?void 0:w.description}}};var S,P,V,H,D;i.parameters={...i.parameters,docs:{...(S=i.parameters)==null?void 0:S.docs,source:{originalSource:`{
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
}`,...(V=(P=i.parameters)==null?void 0:P.docs)==null?void 0:V.source},description:{story:"Custom separators",...(D=(H=i.parameters)==null?void 0:H.docs)==null?void 0:D.description}}};var A,M,E,z,Z;o.parameters={...o.parameters,docs:{...(A=o.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    items: longPathItems,
    maxItems: 4,
    itemsBeforeCollapse: 1,
    itemsAfterCollapse: 2
  }
}`,...(E=(M=o.parameters)==null?void 0:M.docs)==null?void 0:E.source},description:{story:"Collapsible breadcrumb for long paths",...(Z=(z=o.parameters)==null?void 0:z.docs)==null?void 0:Z.description}}};var T,W,U,R,_;c.parameters={...c.parameters,docs:{...(T=c.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: function CollapsibleBreadcrumb() {
    const [expanded, setExpanded] = useState(false);
    return <div>
        <Breadcrumb items={longPathItems} maxItems={4} expanded={expanded} onExpand={() => setExpanded(true)} />
        {expanded && <button className="btn btn-sm btn-link mt-2" onClick={() => setExpanded(false)}>
            Collapse
          </button>}
      </div>;
  }
}`,...(U=(W=c.parameters)==null?void 0:W.docs)==null?void 0:U.source},description:{story:"Collapsible with expand interaction",...(_=(R=c.parameters)==null?void 0:R.docs)==null?void 0:_.description}}};var $,G,O,q,F;m.parameters={...m.parameters,docs:{...($=m.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'home',
      label: 'Home',
      href: '#',
      icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
          </svg>
    }, {
      id: 'settings',
      label: 'Settings',
      href: '#',
      icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
          </svg>
    }, {
      id: 'profile',
      label: 'Profile',
      active: true
    }]
  }
}`,...(O=(G=m.parameters)==null?void 0:G.docs)==null?void 0:O.source},description:{story:"Breadcrumb with icons",...(F=(q=m.parameters)==null?void 0:q.docs)==null?void 0:F.description}}};var J,K,Q,X,Y;n.parameters={...n.parameters,docs:{...(J=n.parameters)==null?void 0:J.docs,source:{originalSource:`{
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
}`,...(Q=(K=n.parameters)==null?void 0:K.docs)==null?void 0:Q.source},description:{story:"Breadcrumb with click handlers",...(Y=(X=n.parameters)==null?void 0:X.docs)==null?void 0:Y.description}}};var ee,re,ae,se,te;d.parameters={...d.parameters,docs:{...(ee=d.parameters)==null?void 0:ee.docs,source:{originalSource:`{
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
}`,...(ae=(re=d.parameters)==null?void 0:re.docs)==null?void 0:ae.source},description:{story:"Breadcrumb in a card header",...(te=(se=d.parameters)==null?void 0:se.docs)==null?void 0:te.description}}};var le,ie,oe,ce,me;p.parameters={...p.parameters,docs:{...(le=p.parameters)==null?void 0:le.docs,source:{originalSource:`{
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
}`,...(oe=(ie=p.parameters)==null?void 0:ie.docs)==null?void 0:oe.source},description:{story:"Breadcrumb with long labels",...(me=(ce=p.parameters)==null?void 0:ce.docs)==null?void 0:me.description}}};var ne,de,pe,ue,be;u.parameters={...u.parameters,docs:{...(ne=u.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'home',
      label: 'Home',
      active: true
    }]
  }
}`,...(pe=(de=u.parameters)==null?void 0:de.docs)==null?void 0:pe.source},description:{story:"Single item breadcrumb",...(be=(ue=u.parameters)==null?void 0:ue.docs)==null?void 0:be.description}}};var he,xe,ge,fe,ve;b.parameters={...b.parameters,docs:{...(he=b.parameters)==null?void 0:he.docs,source:{originalSource:`{
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
        icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
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
}`,...(ge=(xe=b.parameters)==null?void 0:xe.docs)==null?void 0:ge.source},description:{story:"Complete breadcrumb showcase",...(ve=(fe=b.parameters)==null?void 0:fe.docs)==null?void 0:ve.description}}};const Le=["Default","CompoundComponents","CustomSeparators","Collapsible","CollapsibleInteractive","WithIcons","WithClickHandlers","InCardHeader","LongLabels","SingleItem","CompleteShowcase"];export{o as Collapsible,c as CollapsibleInteractive,b as CompleteShowcase,l as CompoundComponents,i as CustomSeparators,t as Default,d as InCardHeader,p as LongLabels,u as SingleItem,n as WithClickHandlers,m as WithIcons,Le as __namedExportsOrder,Ne as default};
