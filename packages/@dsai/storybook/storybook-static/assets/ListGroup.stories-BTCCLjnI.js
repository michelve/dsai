import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as _e}from"./iframe-CyugwH-p.js";import{L as s,z as t,a as v}from"./Tabs-KsVJ-pPQ.js";import"./preload-helper-Dp1pzeXC.js";const Ue={title:"Components/ListGroup",component:s,parameters:{layout:"padded",docs:{description:{component:"An accessible list group component supporting variants, interactive items, badges, and icons."}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","flush","numbered"],description:"List variant",table:{type:{summary:"'default' | 'flush' | 'numbered'"},defaultValue:{summary:"default"}}},horizontal:{control:"select",options:[!1,!0,"sm","md","lg","xl","xxl"],description:"Horizontal layout",table:{type:{summary:"boolean | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'"},defaultValue:{summary:"false"}}},ordered:{control:"boolean",description:"Render as ordered list",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}}},b=[{id:"1",content:"An item"},{id:"2",content:"A second item"},{id:"3",content:"A third item"},{id:"4",content:"A fourth item"},{id:"5",content:"And a fifth one"}],r={args:{items:b}},i={render:()=>e.jsxs(s,{children:[e.jsx(t,{children:"An item"}),e.jsx(t,{children:"A second item"}),e.jsx(t,{children:"A third item"}),e.jsx(t,{children:"A fourth item"}),e.jsx(t,{children:"And a fifth one"})]})},a={render:()=>e.jsxs(s,{children:[e.jsx(t,{active:!0,children:"Active item"}),e.jsx(t,{children:"Normal item"}),e.jsx(t,{disabled:!0,children:"Disabled item"}),e.jsx(t,{children:"Another item"})]})},n={args:{items:b,variant:"flush"}},o={args:{items:b,variant:"numbered"}},m={render:()=>e.jsxs(s,{children:[e.jsx(t,{children:"Default item"}),e.jsx(t,{variant:"primary",children:"Primary item"}),e.jsx(t,{variant:"secondary",children:"Secondary item"}),e.jsx(t,{variant:"success",children:"Success item"}),e.jsx(t,{variant:"danger",children:"Danger item"}),e.jsx(t,{variant:"warning",children:"Warning item"}),e.jsx(t,{variant:"info",children:"Info item"}),e.jsx(t,{variant:"light",children:"Light item"}),e.jsx(t,{variant:"dark",children:"Dark item"})]})},d={render:function(){const[Te,Pe]=_e.useState(null);return e.jsx(s,{children:["Item 1","Item 2","Item 3","Item 4"].map(g=>e.jsx(t,{active:Te===g,onClick:()=>Pe(g),children:g},g))})}},c={render:()=>e.jsxs(s,{children:[e.jsx(t,{href:"#",active:!0,children:"Active link"}),e.jsx(t,{href:"#",children:"Link item"}),e.jsx(t,{href:"#",children:"Another link"}),e.jsx(t,{href:"#",disabled:!0,children:"Disabled link"})]})},l={render:()=>e.jsxs(s,{children:[e.jsx(t,{badge:e.jsx(v,{variant:"primary",pill:!0,children:"14"}),children:"Inbox"}),e.jsx(t,{badge:e.jsx(v,{variant:"primary",pill:!0,children:"3"}),children:"Drafts"}),e.jsx(t,{badge:e.jsx(v,{variant:"primary",pill:!0,children:"99+"}),children:"Spam"})]})},p={render:()=>e.jsxs(s,{children:[e.jsx(t,{icon:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"currentColor",children:e.jsx("path",{d:"M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"})}),children:"Inbox"}),e.jsx(t,{icon:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"currentColor",children:e.jsx("path",{d:"M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"})}),children:"Starred"}),e.jsx(t,{icon:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"currentColor",children:[e.jsx("path",{d:"M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"}),e.jsx("path",{d:"M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"})]}),children:"Trash"})]})},u={args:{items:[{id:"1",content:"Item 1"},{id:"2",content:"Item 2"},{id:"3",content:"Item 3"}],horizontal:!0}},h={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:'horizontal="sm"'}),e.jsx(s,{horizontal:"sm",items:[{id:"1",content:"Item 1"},{id:"2",content:"Item 2"},{id:"3",content:"Item 3"}]})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:'horizontal="md"'}),e.jsx(s,{horizontal:"md",items:[{id:"1",content:"Item 1"},{id:"2",content:"Item 2"},{id:"3",content:"Item 3"}]})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:'horizontal="lg"'}),e.jsx(s,{horizontal:"lg",items:[{id:"1",content:"Item 1"},{id:"2",content:"Item 2"},{id:"3",content:"Item 3"}]})]})]})},x={render:()=>e.jsxs(s,{children:[e.jsxs(t,{href:"#",active:!0,children:[e.jsxs("div",{className:"d-flex w-100 justify-content-between",children:[e.jsx("h5",{className:"mb-1",children:"List group item heading"}),e.jsx("small",{children:"3 days ago"})]}),e.jsx("p",{className:"mb-1",children:"Some placeholder content in a paragraph."}),e.jsx("small",{children:"And some small print."})]}),e.jsxs(t,{href:"#",children:[e.jsxs("div",{className:"d-flex w-100 justify-content-between",children:[e.jsx("h5",{className:"mb-1",children:"List group item heading"}),e.jsx("small",{className:"text-body-secondary",children:"3 days ago"})]}),e.jsx("p",{className:"mb-1",children:"Some placeholder content in a paragraph."}),e.jsx("small",{className:"text-body-secondary",children:"And some muted small print."})]}),e.jsxs(t,{href:"#",children:[e.jsxs("div",{className:"d-flex w-100 justify-content-between",children:[e.jsx("h5",{className:"mb-1",children:"List group item heading"}),e.jsx("small",{className:"text-body-secondary",children:"3 days ago"})]}),e.jsx("p",{className:"mb-1",children:"Some placeholder content in a paragraph."}),e.jsx("small",{className:"text-body-secondary",children:"And some muted small print."})]})]})},I={render:()=>e.jsxs("div",{className:"card",style:{width:"18rem"},children:[e.jsx("div",{className:"card-header",children:"Featured"}),e.jsxs(s,{variant:"flush",children:[e.jsx(t,{children:"An item"}),e.jsx(t,{children:"A second item"}),e.jsx(t,{children:"A third item"})]})]})},L={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"Basic"}),e.jsx(s,{items:b})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"States"}),e.jsxs(s,{children:[e.jsx(t,{active:!0,children:"Active"}),e.jsx(t,{children:"Normal"}),e.jsx(t,{disabled:!0,children:"Disabled"})]})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"Variants"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Default"}),e.jsx(s,{items:[{id:"1",content:"Item 1"},{id:"2",content:"Item 2"}]})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Flush"}),e.jsx(s,{variant:"flush",items:[{id:"1",content:"Item 1"},{id:"2",content:"Item 2"}]})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Numbered"}),e.jsx(s,{variant:"numbered",items:[{id:"1",content:"Item 1"},{id:"2",content:"Item 2"}]})]})]})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"With Badges"}),e.jsxs(s,{children:[e.jsx(t,{badge:e.jsx(v,{variant:"primary",pill:!0,children:"14"}),children:"Inbox"}),e.jsx(t,{badge:e.jsx(v,{variant:"primary",pill:!0,children:"3"}),children:"Drafts"})]})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"Horizontal"}),e.jsx(s,{horizontal:!0,items:[{id:"1",content:"Item 1"},{id:"2",content:"Item 2"},{id:"3",content:"Item 3"}]})]})]})};var j,G,f,y,N;r.parameters={...r.parameters,docs:{...(j=r.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    items: basicItems
  }
}`,...(f=(G=r.parameters)==null?void 0:G.docs)==null?void 0:f.source},description:{story:"Default list group using items prop",...(N=(y=r.parameters)==null?void 0:y.docs)==null?void 0:N.description}}};var A,S,k,V,w;i.parameters={...i.parameters,docs:{...(A=i.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => <ListGroup>
      <ListGroupItem>An item</ListGroupItem>
      <ListGroupItem>A second item</ListGroupItem>
      <ListGroupItem>A third item</ListGroupItem>
      <ListGroupItem>A fourth item</ListGroupItem>
      <ListGroupItem>And a fifth one</ListGroupItem>
    </ListGroup>
}`,...(k=(S=i.parameters)==null?void 0:S.docs)==null?void 0:k.source},description:{story:"List group using compound components",...(w=(V=i.parameters)==null?void 0:V.docs)==null?void 0:w.description}}};var z,C,D,B,Z;a.parameters={...a.parameters,docs:{...(z=a.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: () => <ListGroup>
      <ListGroupItem active>Active item</ListGroupItem>
      <ListGroupItem>Normal item</ListGroupItem>
      <ListGroupItem disabled>Disabled item</ListGroupItem>
      <ListGroupItem>Another item</ListGroupItem>
    </ListGroup>
}`,...(D=(C=a.parameters)==null?void 0:C.docs)==null?void 0:D.source},description:{story:"Active and disabled states",...(Z=(B=a.parameters)==null?void 0:B.docs)==null?void 0:Z.description}}};var H,M,W,F,R;n.parameters={...n.parameters,docs:{...(H=n.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    variant: 'flush'
  }
}`,...(W=(M=n.parameters)==null?void 0:M.docs)==null?void 0:W.source},description:{story:"Flush variant (no borders on sides)",...(R=(F=n.parameters)==null?void 0:F.docs)==null?void 0:R.description}}};var E,T,P,_,O;o.parameters={...o.parameters,docs:{...(E=o.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    variant: 'numbered'
  }
}`,...(P=(T=o.parameters)==null?void 0:T.docs)==null?void 0:P.source},description:{story:"Numbered variant",...(O=(_=o.parameters)==null?void 0:_.docs)==null?void 0:O.description}}};var q,J,K,Q,U;m.parameters={...m.parameters,docs:{...(q=m.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <ListGroup>
      <ListGroupItem>Default item</ListGroupItem>
      <ListGroupItem variant="primary">Primary item</ListGroupItem>
      <ListGroupItem variant="secondary">Secondary item</ListGroupItem>
      <ListGroupItem variant="success">Success item</ListGroupItem>
      <ListGroupItem variant="danger">Danger item</ListGroupItem>
      <ListGroupItem variant="warning">Warning item</ListGroupItem>
      <ListGroupItem variant="info">Info item</ListGroupItem>
      <ListGroupItem variant="light">Light item</ListGroupItem>
      <ListGroupItem variant="dark">Dark item</ListGroupItem>
    </ListGroup>
}`,...(K=(J=m.parameters)==null?void 0:J.docs)==null?void 0:K.source},description:{story:"Item color variants",...(U=(Q=m.parameters)==null?void 0:Q.docs)==null?void 0:U.description}}};var X,Y,$,ee,te;d.parameters={...d.parameters,docs:{...(X=d.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: function ClickableExample() {
    const [selected, setSelected] = useState<string | null>(null);
    return <ListGroup>
        {['Item 1', 'Item 2', 'Item 3', 'Item 4'].map(item => <ListGroupItem key={item} active={selected === item} onClick={() => setSelected(item)}>
            {item}
          </ListGroupItem>)}
      </ListGroup>;
  }
}`,...($=(Y=d.parameters)==null?void 0:Y.docs)==null?void 0:$.source},description:{story:"Clickable items",...(te=(ee=d.parameters)==null?void 0:ee.docs)==null?void 0:te.description}}};var se,re,ie,ae,ne;c.parameters={...c.parameters,docs:{...(se=c.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: () => <ListGroup>
      <ListGroupItem href="#" active>
        Active link
      </ListGroupItem>
      <ListGroupItem href="#">Link item</ListGroupItem>
      <ListGroupItem href="#">Another link</ListGroupItem>
      <ListGroupItem href="#" disabled>
        Disabled link
      </ListGroupItem>
    </ListGroup>
}`,...(ie=(re=c.parameters)==null?void 0:re.docs)==null?void 0:ie.source},description:{story:"Link items",...(ne=(ae=c.parameters)==null?void 0:ae.docs)==null?void 0:ne.description}}};var oe,me,de,ce,le;l.parameters={...l.parameters,docs:{...(oe=l.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  render: () => <ListGroup>
      <ListGroupItem badge={<Badge variant="primary" pill>14</Badge>}>
        Inbox
      </ListGroupItem>
      <ListGroupItem badge={<Badge variant="primary" pill>3</Badge>}>
        Drafts
      </ListGroupItem>
      <ListGroupItem badge={<Badge variant="primary" pill>99+</Badge>}>
        Spam
      </ListGroupItem>
    </ListGroup>
}`,...(de=(me=l.parameters)==null?void 0:me.docs)==null?void 0:de.source},description:{story:"Items with badges",...(le=(ce=l.parameters)==null?void 0:ce.docs)==null?void 0:le.description}}};var pe,ue,he,xe,Ie;p.parameters={...p.parameters,docs:{...(pe=p.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  render: () => <ListGroup>
      <ListGroupItem icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
          </svg>}>
        Inbox
      </ListGroupItem>
      <ListGroupItem icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
          </svg>}>
        Starred
      </ListGroupItem>
      <ListGroupItem icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
          </svg>}>
        Trash
      </ListGroupItem>
    </ListGroup>
}`,...(he=(ue=p.parameters)==null?void 0:ue.docs)==null?void 0:he.source},description:{story:"Items with icons",...(Ie=(xe=p.parameters)==null?void 0:xe.docs)==null?void 0:Ie.description}}};var Le,ve,ge,be,je;u.parameters={...u.parameters,docs:{...(Le=u.parameters)==null?void 0:Le.docs,source:{originalSource:`{
  args: {
    items: [{
      id: '1',
      content: 'Item 1'
    }, {
      id: '2',
      content: 'Item 2'
    }, {
      id: '3',
      content: 'Item 3'
    }],
    horizontal: true
  }
}`,...(ge=(ve=u.parameters)==null?void 0:ve.docs)==null?void 0:ge.source},description:{story:"Horizontal list group",...(je=(be=u.parameters)==null?void 0:be.docs)==null?void 0:je.description}}};var Ge,fe,ye,Ne,Ae;h.parameters={...h.parameters,docs:{...(Ge=h.parameters)==null?void 0:Ge.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <div>
        <small className="text-muted d-block mb-1">horizontal="sm"</small>
        <ListGroup horizontal="sm" items={[{
        id: '1',
        content: 'Item 1'
      }, {
        id: '2',
        content: 'Item 2'
      }, {
        id: '3',
        content: 'Item 3'
      }]} />
      </div>
      <div>
        <small className="text-muted d-block mb-1">horizontal="md"</small>
        <ListGroup horizontal="md" items={[{
        id: '1',
        content: 'Item 1'
      }, {
        id: '2',
        content: 'Item 2'
      }, {
        id: '3',
        content: 'Item 3'
      }]} />
      </div>
      <div>
        <small className="text-muted d-block mb-1">horizontal="lg"</small>
        <ListGroup horizontal="lg" items={[{
        id: '1',
        content: 'Item 1'
      }, {
        id: '2',
        content: 'Item 2'
      }, {
        id: '3',
        content: 'Item 3'
      }]} />
      </div>
    </div>
}`,...(ye=(fe=h.parameters)==null?void 0:fe.docs)==null?void 0:ye.source},description:{story:"Responsive horizontal layout",...(Ae=(Ne=h.parameters)==null?void 0:Ne.docs)==null?void 0:Ae.description}}};var Se,ke,Ve,we,ze;x.parameters={...x.parameters,docs:{...(Se=x.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  render: () => <ListGroup>
      <ListGroupItem href="#" active>
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1">List group item heading</h5>
          <small>3 days ago</small>
        </div>
        <p className="mb-1">Some placeholder content in a paragraph.</p>
        <small>And some small print.</small>
      </ListGroupItem>
      <ListGroupItem href="#">
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1">List group item heading</h5>
          <small className="text-body-secondary">3 days ago</small>
        </div>
        <p className="mb-1">Some placeholder content in a paragraph.</p>
        <small className="text-body-secondary">And some muted small print.</small>
      </ListGroupItem>
      <ListGroupItem href="#">
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1">List group item heading</h5>
          <small className="text-body-secondary">3 days ago</small>
        </div>
        <p className="mb-1">Some placeholder content in a paragraph.</p>
        <small className="text-body-secondary">And some muted small print.</small>
      </ListGroupItem>
    </ListGroup>
}`,...(Ve=(ke=x.parameters)==null?void 0:ke.docs)==null?void 0:Ve.source},description:{story:"Rich content items",...(ze=(we=x.parameters)==null?void 0:we.docs)==null?void 0:ze.description}}};var Ce,De,Be,Ze,He;I.parameters={...I.parameters,docs:{...(Ce=I.parameters)==null?void 0:Ce.docs,source:{originalSource:`{
  render: () => <div className="card" style={{
    width: '18rem'
  }}>
      <div className="card-header">Featured</div>
      <ListGroup variant="flush">
        <ListGroupItem>An item</ListGroupItem>
        <ListGroupItem>A second item</ListGroupItem>
        <ListGroupItem>A third item</ListGroupItem>
      </ListGroup>
    </div>
}`,...(Be=(De=I.parameters)==null?void 0:De.docs)==null?void 0:Be.source},description:{story:"List group in a card",...(He=(Ze=I.parameters)==null?void 0:Ze.docs)==null?void 0:He.description}}};var Me,We,Fe,Re,Ee;L.parameters={...L.parameters,docs:{...(Me=L.parameters)==null?void 0:Me.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }}>
      {/* Basic */}
      <section>
        <h5 className="mb-2">Basic</h5>
        <ListGroup items={basicItems} />
      </section>

      {/* States */}
      <section>
        <h5 className="mb-2">States</h5>
        <ListGroup>
          <ListGroupItem active>Active</ListGroupItem>
          <ListGroupItem>Normal</ListGroupItem>
          <ListGroupItem disabled>Disabled</ListGroupItem>
        </ListGroup>
      </section>

      {/* Variants */}
      <section>
        <h5 className="mb-2">Variants</h5>
        <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem'
      }}>
          <div>
            <small className="text-muted d-block mb-1">Default</small>
            <ListGroup items={[{
            id: '1',
            content: 'Item 1'
          }, {
            id: '2',
            content: 'Item 2'
          }]} />
          </div>
          <div>
            <small className="text-muted d-block mb-1">Flush</small>
            <ListGroup variant="flush" items={[{
            id: '1',
            content: 'Item 1'
          }, {
            id: '2',
            content: 'Item 2'
          }]} />
          </div>
          <div>
            <small className="text-muted d-block mb-1">Numbered</small>
            <ListGroup variant="numbered" items={[{
            id: '1',
            content: 'Item 1'
          }, {
            id: '2',
            content: 'Item 2'
          }]} />
          </div>
        </div>
      </section>

      {/* With Badges */}
      <section>
        <h5 className="mb-2">With Badges</h5>
        <ListGroup>
          <ListGroupItem badge={<Badge variant="primary" pill>14</Badge>}>
            Inbox
          </ListGroupItem>
          <ListGroupItem badge={<Badge variant="primary" pill>3</Badge>}>
            Drafts
          </ListGroupItem>
        </ListGroup>
      </section>

      {/* Horizontal */}
      <section>
        <h5 className="mb-2">Horizontal</h5>
        <ListGroup horizontal items={[{
        id: '1',
        content: 'Item 1'
      }, {
        id: '2',
        content: 'Item 2'
      }, {
        id: '3',
        content: 'Item 3'
      }]} />
      </section>
    </div>
}`,...(Fe=(We=L.parameters)==null?void 0:We.docs)==null?void 0:Fe.source},description:{story:"Complete list group showcase",...(Ee=(Re=L.parameters)==null?void 0:Re.docs)==null?void 0:Ee.description}}};const Xe=["Default","CompoundComponents","ActiveAndDisabled","FlushVariant","NumberedVariant","ColorVariants","ClickableItems","LinkItems","WithBadges","WithIcons","Horizontal","ResponsiveHorizontal","CustomContent","InCard","CompleteShowcase"];export{a as ActiveAndDisabled,d as ClickableItems,m as ColorVariants,L as CompleteShowcase,i as CompoundComponents,x as CustomContent,r as Default,n as FlushVariant,u as Horizontal,I as InCard,c as LinkItems,o as NumberedVariant,h as ResponsiveHorizontal,l as WithBadges,p as WithIcons,Xe as __namedExportsOrder,Ue as default};
