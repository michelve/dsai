import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as mt}from"./iframe-5yFzSrCk.js";import{L as s,z as t,a as G,C as S,X as N}from"./Tabs-B7LjS1vO.js";import"./preload-helper-Dp1pzeXC.js";const vt={title:"Components/ListGroup",component:s,parameters:{layout:"padded",docs:{description:{component:"An accessible list group component supporting variants, interactive items, badges, and icons."}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","flush","numbered"],description:"List variant",table:{type:{summary:"'default' | 'flush' | 'numbered'"},defaultValue:{summary:"default"}}},horizontal:{control:"select",options:[!1,!0,"sm","md","lg","xl","xxl"],description:"Horizontal layout",table:{type:{summary:"boolean | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'"},defaultValue:{summary:"false"}}},ordered:{control:"boolean",description:"Render as ordered list",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}}},k=[{id:"1",content:"An item"},{id:"2",content:"A second item"},{id:"3",content:"A third item"},{id:"4",content:"A fourth item"},{id:"5",content:"And a fifth one"}],a={args:{items:k}},n={render:()=>e.jsxs(s,{children:[e.jsx(t,{children:"An item"}),e.jsx(t,{children:"A second item"}),e.jsx(t,{children:"A third item"}),e.jsx(t,{children:"A fourth item"}),e.jsx(t,{children:"And a fifth one"})]})},o={render:()=>e.jsxs(s,{children:[e.jsx(t,{active:!0,children:"Active item"}),e.jsx(t,{children:"Normal item"}),e.jsx(t,{disabled:!0,children:"Disabled item"}),e.jsx(t,{children:"Another item"})]})},l={args:{items:k,variant:"flush"}},c={args:{items:k,variant:"numbered"}},m={render:()=>e.jsxs(s,{children:[e.jsx(t,{children:"Default item"}),e.jsx(t,{variant:"primary",children:"Primary item"}),e.jsx(t,{variant:"secondary",children:"Secondary item"}),e.jsx(t,{variant:"success",children:"Success item"}),e.jsx(t,{variant:"danger",children:"Danger item"}),e.jsx(t,{variant:"warning",children:"Warning item"}),e.jsx(t,{variant:"info",children:"Info item"}),e.jsx(t,{variant:"light",children:"Light item"}),e.jsx(t,{variant:"dark",children:"Dark item"})]})},d={render:function(){const[r,i]=mt.useState(null);return e.jsx(s,{children:["Item 1","Item 2","Item 3","Item 4"].map(y=>e.jsx(t,{active:r===y,onClick:()=>i(y),children:y},y))})}},p={render:()=>e.jsxs(s,{children:[e.jsx(t,{href:"#",active:!0,children:"Active link"}),e.jsx(t,{href:"#",children:"Link item"}),e.jsx(t,{href:"#",children:"Another link"}),e.jsx(t,{href:"#",disabled:!0,children:"Disabled link"})]})},u={render:()=>e.jsxs(s,{children:[e.jsx(t,{badge:e.jsx(G,{variant:"primary",pill:!0,children:"14"}),children:"Inbox"}),e.jsx(t,{badge:e.jsx(G,{variant:"primary",pill:!0,children:"3"}),children:"Drafts"}),e.jsx(t,{badge:e.jsx(G,{variant:"primary",pill:!0,children:"99+"}),children:"Spam"})]})},h={render:()=>e.jsxs(s,{children:[e.jsx(t,{icon:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"currentColor",children:e.jsx("path",{d:"M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"})}),children:"Inbox"}),e.jsx(t,{icon:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"currentColor",children:e.jsx("path",{d:"M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"})}),children:"Starred"}),e.jsx(t,{icon:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"currentColor",children:[e.jsx("path",{d:"M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"}),e.jsx("path",{d:"M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"})]}),children:"Trash"})]})},x={args:{items:[{id:"1",content:"Item 1"},{id:"2",content:"Item 2"},{id:"3",content:"Item 3"}],horizontal:!0}},v={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:'horizontal="sm"'}),e.jsx(s,{horizontal:"sm",items:[{id:"1",content:"Item 1"},{id:"2",content:"Item 2"},{id:"3",content:"Item 3"}]})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:'horizontal="md"'}),e.jsx(s,{horizontal:"md",items:[{id:"1",content:"Item 1"},{id:"2",content:"Item 2"},{id:"3",content:"Item 3"}]})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:'horizontal="lg"'}),e.jsx(s,{horizontal:"lg",items:[{id:"1",content:"Item 1"},{id:"2",content:"Item 2"},{id:"3",content:"Item 3"}]})]})]})},I={render:()=>e.jsxs(s,{children:[e.jsxs(t,{href:"#",active:!0,children:[e.jsxs("div",{className:"d-flex w-100 justify-content-between",children:[e.jsx("h5",{className:"mb-1",children:"List group item heading"}),e.jsx("small",{children:"3 days ago"})]}),e.jsx("p",{className:"mb-1",children:"Some placeholder content in a paragraph."}),e.jsx("small",{children:"And some small print."})]}),e.jsxs(t,{href:"#",children:[e.jsxs("div",{className:"d-flex w-100 justify-content-between",children:[e.jsx("h5",{className:"mb-1",children:"List group item heading"}),e.jsx("small",{className:"text-body-secondary",children:"3 days ago"})]}),e.jsx("p",{className:"mb-1",children:"Some placeholder content in a paragraph."}),e.jsx("small",{className:"text-body-secondary",children:"And some muted small print."})]}),e.jsxs(t,{href:"#",children:[e.jsxs("div",{className:"d-flex w-100 justify-content-between",children:[e.jsx("h5",{className:"mb-1",children:"List group item heading"}),e.jsx("small",{className:"text-body-secondary",children:"3 days ago"})]}),e.jsx("p",{className:"mb-1",children:"Some placeholder content in a paragraph."}),e.jsx("small",{className:"text-body-secondary",children:"And some muted small print."})]})]})},L={render:()=>e.jsxs("div",{className:"card",style:{width:"18rem"},children:[e.jsx("div",{className:"card-header",children:"Featured"}),e.jsxs(s,{variant:"flush",children:[e.jsx(t,{children:"An item"}),e.jsx(t,{children:"A second item"}),e.jsx(t,{children:"A third item"})]})]})},g={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"Basic"}),e.jsx(s,{items:k})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"States"}),e.jsxs(s,{children:[e.jsx(t,{active:!0,children:"Active"}),e.jsx(t,{children:"Normal"}),e.jsx(t,{disabled:!0,children:"Disabled"})]})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"Variants"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Default"}),e.jsx(s,{items:[{id:"1",content:"Item 1"},{id:"2",content:"Item 2"}]})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Flush"}),e.jsx(s,{variant:"flush",items:[{id:"1",content:"Item 1"},{id:"2",content:"Item 2"}]})]}),e.jsxs("div",{children:[e.jsx("small",{className:"text-muted d-block mb-1",children:"Numbered"}),e.jsx(s,{variant:"numbered",items:[{id:"1",content:"Item 1"},{id:"2",content:"Item 2"}]})]})]})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"With Badges"}),e.jsxs(s,{children:[e.jsx(t,{badge:e.jsx(G,{variant:"primary",pill:!0,children:"14"}),children:"Inbox"}),e.jsx(t,{badge:e.jsx(G,{variant:"primary",pill:!0,children:"3"}),children:"Drafts"})]})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-2",children:"Horizontal"}),e.jsx(s,{horizontal:!0,items:[{id:"1",content:"Item 1"},{id:"2",content:"Item 2"},{id:"3",content:"Item 3"}]})]})]})},j={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Href Sanitization"}),e.jsx("p",{className:"text-muted small",children:"Dangerous URL protocols are automatically blocked and replaced with #."})]}),e.jsxs(s,{children:[e.jsxs(t,{href:"https://example.com",children:[e.jsx(S,{className:"text-success me-2",size:16}),"Safe: HTTPS link"]}),e.jsxs(t,{href:"/internal/path",children:[e.jsx(S,{className:"text-success me-2",size:16}),"Safe: Relative link"]}),e.jsxs(t,{href:"mailto:test@example.com",children:[e.jsx(S,{className:"text-success me-2",size:16}),"Safe: Email link"]}),e.jsxs(t,{href:"javascript:alert('XSS')",children:[e.jsx(N,{className:"text-danger me-2",size:16}),"Blocked: javascript: protocol (renders as #)"]}),e.jsxs(t,{href:"data:text/html,<script>alert('XSS')<\/script>",children:[e.jsx(N,{className:"text-danger me-2",size:16}),"Blocked: data: protocol (renders as #)"]})]})]})},b={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"External Link Protection"}),e.jsx("p",{className:"text-muted small",children:'External links (http:// and https://) automatically get rel="noopener noreferrer".'})]}),e.jsxs(s,{children:[e.jsx(t,{href:"https://external.com",children:'External HTTPS link (has rel="noopener noreferrer")'}),e.jsx(t,{href:"http://external.com",children:'External HTTP link (has rel="noopener noreferrer")'}),e.jsx(t,{href:"/internal",children:"Internal link (no rel attribute)"}),e.jsx(t,{href:"#section",children:"Anchor link (no rel attribute)"})]}),e.jsxs("div",{className:"alert alert-info small",children:[e.jsx("strong",{children:"Why this matters:"})," The ",e.jsx("code",{children:'rel="noopener noreferrer"'})," attribute prevents the linked page from accessing ",e.jsx("code",{children:"window.opener"}),", protecting against tabnabbing attacks and preventing referrer information leakage."]})]})},f={render:function(){const[r,i]=mt.useState(null);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Interactive Div with Keyboard Support"}),e.jsx("p",{className:"text-muted small",children:'Use Tab to navigate and Enter/Space to activate. The div has role="button".'})]}),e.jsxs(s,{children:[e.jsx(t,{as:"div",onClick:()=>i("Item 1"),active:r==="Item 1",children:"Div Item 1 (click or press Enter/Space)"}),e.jsx(t,{as:"div",onClick:()=>i("Item 2"),active:r==="Item 2",children:"Div Item 2 (click or press Enter/Space)"}),e.jsx(t,{as:"div",onClick:()=>i("Item 3"),disabled:!0,children:"Disabled Div Item (not focusable)"})]}),r&&e.jsxs("p",{className:"text-muted small",children:["Last clicked: ",r]})]})}};var C,A,D,z,w;a.parameters={...a.parameters,docs:{...(C=a.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    items: basicItems
  }
}`,...(D=(A=a.parameters)==null?void 0:A.docs)==null?void 0:D.source},description:{story:"Default list group using items prop",...(w=(z=a.parameters)==null?void 0:z.docs)==null?void 0:w.description}}};var V,H,B,E,T;n.parameters={...n.parameters,docs:{...(V=n.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: () => <ListGroup>
      <ListGroupItem>An item</ListGroupItem>
      <ListGroupItem>A second item</ListGroupItem>
      <ListGroupItem>A third item</ListGroupItem>
      <ListGroupItem>A fourth item</ListGroupItem>
      <ListGroupItem>And a fifth one</ListGroupItem>
    </ListGroup>
}`,...(B=(H=n.parameters)==null?void 0:H.docs)==null?void 0:B.source},description:{story:"List group using compound components",...(T=(E=n.parameters)==null?void 0:E.docs)==null?void 0:T.description}}};var Z,F,M,W,P;o.parameters={...o.parameters,docs:{...(Z=o.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: () => <ListGroup>
      <ListGroupItem active>Active item</ListGroupItem>
      <ListGroupItem>Normal item</ListGroupItem>
      <ListGroupItem disabled>Disabled item</ListGroupItem>
      <ListGroupItem>Another item</ListGroupItem>
    </ListGroup>
}`,...(M=(F=o.parameters)==null?void 0:F.docs)==null?void 0:M.source},description:{story:"Active and disabled states",...(P=(W=o.parameters)==null?void 0:W.docs)==null?void 0:P.description}}};var R,X,U,K,_;l.parameters={...l.parameters,docs:{...(R=l.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    variant: 'flush'
  }
}`,...(U=(X=l.parameters)==null?void 0:X.docs)==null?void 0:U.source},description:{story:"Flush variant (no borders on sides)",...(_=(K=l.parameters)==null?void 0:K.docs)==null?void 0:_.description}}};var O,q,J,Q,Y;c.parameters={...c.parameters,docs:{...(O=c.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    variant: 'numbered'
  }
}`,...(J=(q=c.parameters)==null?void 0:q.docs)==null?void 0:J.source},description:{story:"Numbered variant",...(Y=(Q=c.parameters)==null?void 0:Q.docs)==null?void 0:Y.description}}};var $,ee,te,se,re;m.parameters={...m.parameters,docs:{...($=m.parameters)==null?void 0:$.docs,source:{originalSource:`{
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
}`,...(te=(ee=m.parameters)==null?void 0:ee.docs)==null?void 0:te.source},description:{story:"Item color variants",...(re=(se=m.parameters)==null?void 0:se.docs)==null?void 0:re.description}}};var ie,ae,ne,oe,le;d.parameters={...d.parameters,docs:{...(ie=d.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  render: function ClickableExample() {
    const [selected, setSelected] = useState<string | null>(null);
    return <ListGroup>
        {['Item 1', 'Item 2', 'Item 3', 'Item 4'].map(item => <ListGroupItem key={item} active={selected === item} onClick={() => setSelected(item)}>
            {item}
          </ListGroupItem>)}
      </ListGroup>;
  }
}`,...(ne=(ae=d.parameters)==null?void 0:ae.docs)==null?void 0:ne.source},description:{story:"Clickable items",...(le=(oe=d.parameters)==null?void 0:oe.docs)==null?void 0:le.description}}};var ce,me,de,pe,ue;p.parameters={...p.parameters,docs:{...(ce=p.parameters)==null?void 0:ce.docs,source:{originalSource:`{
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
}`,...(de=(me=p.parameters)==null?void 0:me.docs)==null?void 0:de.source},description:{story:"Link items",...(ue=(pe=p.parameters)==null?void 0:pe.docs)==null?void 0:ue.description}}};var he,xe,ve,Ie,Le;u.parameters={...u.parameters,docs:{...(he=u.parameters)==null?void 0:he.docs,source:{originalSource:`{
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
}`,...(ve=(xe=u.parameters)==null?void 0:xe.docs)==null?void 0:ve.source},description:{story:"Items with badges",...(Le=(Ie=u.parameters)==null?void 0:Ie.docs)==null?void 0:Le.description}}};var ge,je,be,fe,Ge;h.parameters={...h.parameters,docs:{...(ge=h.parameters)==null?void 0:ge.docs,source:{originalSource:`{
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
}`,...(be=(je=h.parameters)==null?void 0:je.docs)==null?void 0:be.source},description:{story:"Items with icons",...(Ge=(fe=h.parameters)==null?void 0:fe.docs)==null?void 0:Ge.description}}};var ye,ke,Se,Ne,Ce;x.parameters={...x.parameters,docs:{...(ye=x.parameters)==null?void 0:ye.docs,source:{originalSource:`{
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
}`,...(Se=(ke=x.parameters)==null?void 0:ke.docs)==null?void 0:Se.source},description:{story:"Horizontal list group",...(Ce=(Ne=x.parameters)==null?void 0:Ne.docs)==null?void 0:Ce.description}}};var Ae,De,ze,we,Ve;v.parameters={...v.parameters,docs:{...(Ae=v.parameters)==null?void 0:Ae.docs,source:{originalSource:`{
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
}`,...(ze=(De=v.parameters)==null?void 0:De.docs)==null?void 0:ze.source},description:{story:"Responsive horizontal layout",...(Ve=(we=v.parameters)==null?void 0:we.docs)==null?void 0:Ve.description}}};var He,Be,Ee,Te,Ze;I.parameters={...I.parameters,docs:{...(He=I.parameters)==null?void 0:He.docs,source:{originalSource:`{
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
}`,...(Ee=(Be=I.parameters)==null?void 0:Be.docs)==null?void 0:Ee.source},description:{story:"Rich content items",...(Ze=(Te=I.parameters)==null?void 0:Te.docs)==null?void 0:Ze.description}}};var Fe,Me,We,Pe,Re;L.parameters={...L.parameters,docs:{...(Fe=L.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
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
}`,...(We=(Me=L.parameters)==null?void 0:Me.docs)==null?void 0:We.source},description:{story:"List group in a card",...(Re=(Pe=L.parameters)==null?void 0:Pe.docs)==null?void 0:Re.description}}};var Xe,Ue,Ke,_e,Oe;g.parameters={...g.parameters,docs:{...(Xe=g.parameters)==null?void 0:Xe.docs,source:{originalSource:`{
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
}`,...(Ke=(Ue=g.parameters)==null?void 0:Ue.docs)==null?void 0:Ke.source},description:{story:"Complete list group showcase",...(Oe=(_e=g.parameters)==null?void 0:_e.docs)==null?void 0:Oe.description}}};var qe,Je,Qe,Ye,$e;j.parameters={...j.parameters,docs:{...(qe=j.parameters)==null?void 0:qe.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <div>
        <h5>Href Sanitization</h5>
        <p className="text-muted small">
          Dangerous URL protocols are automatically blocked and replaced with #.
        </p>
      </div>
      <ListGroup>
        <ListGroupItem href="https://example.com">
          <CheckCircleFillIcon className="text-success me-2" size={16} />
          Safe: HTTPS link
        </ListGroupItem>
        <ListGroupItem href="/internal/path">
          <CheckCircleFillIcon className="text-success me-2" size={16} />
          Safe: Relative link
        </ListGroupItem>
        <ListGroupItem href="mailto:test@example.com">
          <CheckCircleFillIcon className="text-success me-2" size={16} />
          Safe: Email link
        </ListGroupItem>
        <ListGroupItem href="javascript:alert('XSS')">
          <XCircleFillIcon className="text-danger me-2" size={16} />
          Blocked: javascript: protocol (renders as #)
        </ListGroupItem>
        <ListGroupItem href="data:text/html,<script>alert('XSS')<\/script>">
          <XCircleFillIcon className="text-danger me-2" size={16} />
          Blocked: data: protocol (renders as #)
        </ListGroupItem>
      </ListGroup>
    </div>
}`,...(Qe=(Je=j.parameters)==null?void 0:Je.docs)==null?void 0:Qe.source},description:{story:`Security: Href Sanitization

The ListGroup component blocks dangerous URL protocols to prevent XSS attacks.
Dangerous protocols (javascript:, data:, vbscript:, file:) are replaced with #.`,...($e=(Ye=j.parameters)==null?void 0:Ye.docs)==null?void 0:$e.description}}};var et,tt,st,rt,it;b.parameters={...b.parameters,docs:{...(et=b.parameters)==null?void 0:et.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <div>
        <h5>External Link Protection</h5>
        <p className="text-muted small">
          External links (http:// and https://) automatically get rel="noopener noreferrer".
        </p>
      </div>
      <ListGroup>
        <ListGroupItem href="https://external.com">
          External HTTPS link (has rel="noopener noreferrer")
        </ListGroupItem>
        <ListGroupItem href="http://external.com">
          External HTTP link (has rel="noopener noreferrer")
        </ListGroupItem>
        <ListGroupItem href="/internal">
          Internal link (no rel attribute)
        </ListGroupItem>
        <ListGroupItem href="#section">
          Anchor link (no rel attribute)
        </ListGroupItem>
      </ListGroup>
      <div className="alert alert-info small">
        <strong>Why this matters:</strong> The <code>rel="noopener noreferrer"</code> attribute
        prevents the linked page from accessing <code>window.opener</code>, protecting against
        tabnabbing attacks and preventing referrer information leakage.
      </div>
    </div>
}`,...(st=(tt=b.parameters)==null?void 0:tt.docs)==null?void 0:st.source},description:{story:`Security: External Link Protection

External links automatically receive rel="noopener noreferrer" to prevent
tabnabbing attacks and referrer leakage.`,...(it=(rt=b.parameters)==null?void 0:rt.docs)==null?void 0:it.description}}};var at,nt,ot,lt,ct;f.parameters={...f.parameters,docs:{...(at=f.parameters)==null?void 0:at.docs,source:{originalSource:`{
  render: function InteractiveDivExample() {
    const [clicked, setClicked] = useState<string | null>(null);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
        <div>
          <h5>Interactive Div with Keyboard Support</h5>
          <p className="text-muted small">
            Use Tab to navigate and Enter/Space to activate. The div has role="button".
          </p>
        </div>
        <ListGroup>
          <ListGroupItem as="div" onClick={() => setClicked('Item 1')} active={clicked === 'Item 1'}>
            Div Item 1 (click or press Enter/Space)
          </ListGroupItem>
          <ListGroupItem as="div" onClick={() => setClicked('Item 2')} active={clicked === 'Item 2'}>
            Div Item 2 (click or press Enter/Space)
          </ListGroupItem>
          <ListGroupItem as="div" onClick={() => setClicked('Item 3')} disabled>
            Disabled Div Item (not focusable)
          </ListGroupItem>
        </ListGroup>
        {clicked && <p className="text-muted small">Last clicked: {clicked}</p>}
      </div>;
  }
}`,...(ot=(nt=f.parameters)==null?void 0:nt.docs)==null?void 0:ot.source},description:{story:`Accessibility: Interactive Div with Keyboard Support

When using as="div" with onClick, the component provides full keyboard
accessibility with role="button", tabIndex, and Enter/Space key support.`,...(ct=(lt=f.parameters)==null?void 0:lt.docs)==null?void 0:ct.description}}};const It=["Default","CompoundComponents","ActiveAndDisabled","FlushVariant","NumberedVariant","ColorVariants","ClickableItems","LinkItems","WithBadges","WithIcons","Horizontal","ResponsiveHorizontal","CustomContent","InCard","CompleteShowcase","SecurityHrefSanitization","SecurityExternalLinks","AccessibilityInteractiveDiv"];export{f as AccessibilityInteractiveDiv,o as ActiveAndDisabled,d as ClickableItems,m as ColorVariants,g as CompleteShowcase,n as CompoundComponents,I as CustomContent,a as Default,l as FlushVariant,x as Horizontal,L as InCard,p as LinkItems,c as NumberedVariant,v as ResponsiveHorizontal,b as SecurityExternalLinks,j as SecurityHrefSanitization,u as WithBadges,h as WithIcons,It as __namedExportsOrder,vt as default};
