import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{a as r,B as a}from"./Tabs-Ct9YirVA.js";import{r as Mr}from"./iframe-BooCaz94.js";import"./preload-helper-Dp1pzeXC.js";const qr=()=>e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",icon:e.jsx("span",{children:"★"}),children:"Featured"}),e.jsx(r,{variant:"success",icon:e.jsx("span",{children:"✓"}),children:"Verified"}),e.jsx(r,{variant:"danger",icon:e.jsx("span",{children:"!"}),children:"Alert"}),e.jsx(r,{variant:"info",icon:e.jsx("span",{children:"ℹ"}),children:"Info"})]}),Tr=()=>e.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap",alignItems:"center"},children:[e.jsxs("div",{children:[e.jsx("p",{style:{fontSize:"0.875rem",marginBottom:"0.5rem"},children:"✓ Dot-only (requires aria-label):"}),e.jsx(r,{variant:"success",dot:!0,"aria-label":"Online status"})]}),e.jsxs("div",{children:[e.jsx("p",{style:{fontSize:"0.875rem",marginBottom:"0.5rem"},children:"✓ Dot + content:"}),e.jsx(r,{variant:"success",dot:!0,children:"Online"})]}),e.jsxs("div",{children:[e.jsx("p",{style:{fontSize:"0.875rem",marginBottom:"0.5rem"},children:"Status variants:"}),e.jsxs("div",{style:{display:"flex",gap:"1rem"},children:[e.jsx(r,{variant:"success",dot:!0,"aria-label":"Available"}),e.jsx(r,{variant:"warning",dot:!0,"aria-label":"Away"}),e.jsx(r,{variant:"danger",dot:!0,"aria-label":"Busy"})]})]})]}),Hr=()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Icon Accessibility"}),e.jsx("p",{style:{fontSize:"0.875rem",color:"#666",marginBottom:"0.5rem"},children:'Icons are hidden from screen readers (aria-hidden="true"), preventing redundant announcements:'}),e.jsx(qr,{})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Dot Indicator Accessibility"}),e.jsx("p",{style:{fontSize:"0.875rem",color:"#666",marginBottom:"0.5rem"},children:"Dots are hidden when badge has content, but visible to screen readers when dot-only:"}),e.jsx(Tr,{})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Dev Warning Example"}),e.jsx("p",{style:{fontSize:"0.875rem",color:"#666",marginBottom:"0.5rem"},children:"Check browser console - dot-only without aria-label shows a helpful warning in development:"}),e.jsx(r,{variant:"danger",dot:!0,children:"This works because it has content"})]})]}),Ur=()=>{const[N,Gr]=Mr.useState(0);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx("p",{style:{fontSize:"0.875rem",color:"#666"},children:"Badges are wrapped with React.memo and internally memoized for maximum performance. Memoized class construction and component prevent unnecessary re-renders even in large lists."}),e.jsxs("div",{children:[e.jsx("p",{style:{marginBottom:"0.5rem"},children:"Click to trigger parent re-render (badge stays optimized):"}),e.jsxs(a,{variant:"outline-primary",onClick:()=>Gr(N+1),children:["Render Parent (",N," times)"]}),e.jsxs("div",{style:{marginTop:"1rem",display:"flex",gap:"0.5rem"},children:[e.jsx(r,{variant:"primary",children:"Optimized"}),e.jsxs(r,{variant:"success",pill:!0,children:["Count: ",N]}),e.jsx(r,{variant:"info",dot:!0,"aria-label":"Active",children:"Active"})]})]})]})},Xr={title:"Components/Badge",component:r,parameters:{layout:"centered",docs:{description:{component:"A Bootstrap 5 badge component for displaying labels, status indicators, and counts. Supports 8 color variants, pill shape, dot indicators, and icons. Fully accessible with WCAG 2.2 AA compliance and performance optimizations."}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","success","danger","warning","info","light","dark"],description:"Badge color variant",table:{type:{summary:"BadgeVariant"},defaultValue:{summary:"primary"}}},pill:{control:"boolean",description:"Pill shape (fully rounded)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},dot:{control:"boolean",description:"Show dot indicator (requires aria-label when dot-only)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},children:{control:"text",description:"Badge content",table:{type:{summary:"ReactNode"}}},"aria-label":{control:"text",description:"ARIA label (required for dot-only badges)",table:{type:{summary:"string"}}}}},s={args:{variant:"primary",children:"Primary"}},i={args:{variant:"secondary",children:"Secondary"}},n={args:{variant:"success",children:"Success"}},t={args:{variant:"danger",children:"Danger"}},o={args:{variant:"warning",children:"Warning"}},d={args:{variant:"info",children:"Info"}},c={args:{variant:"light",children:"Light"},parameters:{backgrounds:{default:"dark"}}},l={args:{variant:"dark",children:"Dark"}},p={args:{variant:"primary",pill:!0,children:"Pill Badge"}},m={render:()=>e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",pill:!0,children:"Primary"}),e.jsx(r,{variant:"secondary",pill:!0,children:"Secondary"}),e.jsx(r,{variant:"success",pill:!0,children:"Success"}),e.jsx(r,{variant:"danger",pill:!0,children:"Danger"}),e.jsx(r,{variant:"warning",pill:!0,children:"Warning"}),e.jsx(r,{variant:"info",pill:!0,children:"Info"})]})},g={args:{variant:"success",dot:!0,children:"Online"}},u={args:{variant:"success",dot:!0,"aria-label":"Online status"}},y={render:()=>e.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"success",dot:!0,children:"Online"}),e.jsx(r,{variant:"warning",dot:!0,children:"Away"}),e.jsx(r,{variant:"danger",dot:!0,children:"Busy"}),e.jsx(r,{variant:"secondary",dot:!0,children:"Offline"})]})},h={args:{variant:"primary",icon:e.jsx("span",{children:"★"}),children:"Featured"}},v={render:()=>e.jsx(qr,{})},x={render:()=>e.jsx(Hr,{}),parameters:{layout:"padded"}},B={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("p",{style:{fontSize:"0.875rem",marginBottom:"0.5rem"},children:"✓ Correct: Dot-only with aria-label"}),e.jsx(r,{variant:"success",dot:!0,"aria-label":"Online"})]}),e.jsxs("div",{children:[e.jsx("p",{style:{fontSize:"0.875rem",marginBottom:"0.5rem"},children:"✗ Incorrect: Dot-only without aria-label (check console for warning)"}),e.jsx(r,{variant:"danger",dot:!0})]})]}),parameters:{layout:"padded"}},f={render:()=>e.jsx(Ur,{}),parameters:{layout:"padded"}},j={render:()=>e.jsxs("div",{children:[e.jsxs("h1",{children:["Example heading ",e.jsx(r,{variant:"secondary",children:"New"})]}),e.jsxs("h2",{children:["Example heading ",e.jsx(r,{variant:"secondary",children:"New"})]}),e.jsxs("h3",{children:["Example heading ",e.jsx(r,{variant:"secondary",children:"New"})]})]}),parameters:{layout:"padded"}},b={render:()=>e.jsxs(a,{variant:"primary",className:"position-relative",children:["Inbox",e.jsx(r,{variant:"danger",pill:!0,className:"position-absolute top-0 start-100 translate-middle",children:"99+"})]})},S={render:()=>e.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[e.jsxs(a,{variant:"outline-primary",className:"position-relative",children:["Messages",e.jsx(r,{variant:"primary",pill:!0,className:"ms-2",children:"4"})]}),e.jsxs(a,{variant:"outline-secondary",className:"position-relative",children:["Notifications",e.jsx(r,{variant:"danger",pill:!0,className:"ms-2",children:"12"})]})]})},w={render:()=>e.jsxs(a,{variant:"primary",className:"position-relative",children:["Inbox",e.jsx(r,{variant:"danger",pill:!0,className:"position-absolute top-0 start-100 translate-middle p-2 border border-light","aria-label":"New notifications"})]})},D={render:()=>e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",children:"Primary"}),e.jsx(r,{variant:"secondary",children:"Secondary"}),e.jsx(r,{variant:"success",children:"Success"}),e.jsx(r,{variant:"danger",children:"Danger"}),e.jsx(r,{variant:"warning",children:"Warning"}),e.jsx(r,{variant:"info",children:"Info"}),e.jsx(r,{variant:"light",children:"Light"}),e.jsx(r,{variant:"dark",children:"Dark"})]})},I={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Variants"}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",children:"Primary"}),e.jsx(r,{variant:"secondary",children:"Secondary"}),e.jsx(r,{variant:"success",children:"Success"}),e.jsx(r,{variant:"danger",children:"Danger"}),e.jsx(r,{variant:"warning",children:"Warning"}),e.jsx(r,{variant:"info",children:"Info"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Pill Shape"}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",pill:!0,children:"Primary"}),e.jsx(r,{variant:"secondary",pill:!0,children:"Secondary"}),e.jsx(r,{variant:"success",pill:!0,children:"Success"}),e.jsx(r,{variant:"danger",pill:!0,children:"Danger"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Status Indicators"}),e.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"success",dot:!0,children:"Online"}),e.jsx(r,{variant:"warning",dot:!0,children:"Away"}),e.jsx(r,{variant:"danger",dot:!0,children:"Busy"}),e.jsx(r,{variant:"secondary",dot:!0,children:"Offline"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"With Icons"}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",icon:e.jsx("span",{children:"★"}),children:"Featured"}),e.jsx(r,{variant:"success",icon:e.jsx("span",{children:"✓"}),children:"Verified"}),e.jsx(r,{variant:"danger",icon:e.jsx("span",{children:"!"}),children:"Alert"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"On Buttons"}),e.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:[e.jsxs(a,{variant:"primary",className:"position-relative",children:["Inbox",e.jsx(r,{variant:"light",pill:!0,className:"ms-2",children:"4"})]}),e.jsxs(a,{variant:"outline-primary",className:"position-relative",children:["Notifications",e.jsx(r,{variant:"danger",pill:!0,className:"position-absolute top-0 start-100 translate-middle",children:"99+"})]})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Accessibility & Performance (A Grade)"}),e.jsx("p",{style:{fontSize:"0.875rem",color:"#666",marginBottom:"0.5rem"},children:"Icons are hidden from screen readers. Dots are smart: hidden when content exists, but visible for dot-only indicators. Component uses React.memo + memoized class construction for optimal performance in lists and high-frequency re-renders."})]})]}),parameters:{layout:"padded"}};var A,W,P,k,O;s.parameters={...s.parameters,docs:{...(A=s.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Primary'
  }
}`,...(P=(W=s.parameters)==null?void 0:W.docs)==null?void 0:P.source},description:{story:"Primary badge - default variant",...(O=(k=s.parameters)==null?void 0:k.docs)==null?void 0:O.description}}};var E,z,C,V,L;i.parameters={...i.parameters,docs:{...(E=i.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'Secondary'
  }
}`,...(C=(z=i.parameters)==null?void 0:z.docs)==null?void 0:C.source},description:{story:"Secondary badge",...(L=(V=i.parameters)==null?void 0:V.docs)==null?void 0:L.description}}};var R,F,q,G,M;n.parameters={...n.parameters,docs:{...(R=n.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: 'Success'
  }
}`,...(q=(F=n.parameters)==null?void 0:F.docs)==null?void 0:q.source},description:{story:"Success badge - use for positive status",...(M=(G=n.parameters)==null?void 0:G.docs)==null?void 0:M.description}}};var T,H,U,_,J;t.parameters={...t.parameters,docs:{...(T=t.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    children: 'Danger'
  }
}`,...(U=(H=t.parameters)==null?void 0:H.docs)==null?void 0:U.source},description:{story:"Danger badge - use for errors or critical status",...(J=(_=t.parameters)==null?void 0:_.docs)==null?void 0:J.description}}};var K,Q,X,Y,Z;o.parameters={...o.parameters,docs:{...(K=o.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    children: 'Warning'
  }
}`,...(X=(Q=o.parameters)==null?void 0:Q.docs)==null?void 0:X.source},description:{story:"Warning badge - use for warnings or caution",...(Z=(Y=o.parameters)==null?void 0:Y.docs)==null?void 0:Z.description}}};var $,ee,re,ae,se;d.parameters={...d.parameters,docs:{...($=d.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    children: 'Info'
  }
}`,...(re=(ee=d.parameters)==null?void 0:ee.docs)==null?void 0:re.source},description:{story:"Info badge - use for informational content",...(se=(ae=d.parameters)==null?void 0:ae.docs)==null?void 0:se.description}}};var ie,ne,te,oe,de;c.parameters={...c.parameters,docs:{...(ie=c.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  args: {
    variant: 'light',
    children: 'Light'
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...(te=(ne=c.parameters)==null?void 0:ne.docs)==null?void 0:te.source},description:{story:"Light badge - use on dark backgrounds",...(de=(oe=c.parameters)==null?void 0:oe.docs)==null?void 0:de.description}}};var ce,le,pe,me,ge;l.parameters={...l.parameters,docs:{...(ce=l.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {
    variant: 'dark',
    children: 'Dark'
  }
}`,...(pe=(le=l.parameters)==null?void 0:le.docs)==null?void 0:pe.source},description:{story:"Dark badge - use on light backgrounds",...(ge=(me=l.parameters)==null?void 0:me.docs)==null?void 0:ge.description}}};var ue,ye,he,ve,xe;p.parameters={...p.parameters,docs:{...(ue=p.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    pill: true,
    children: 'Pill Badge'
  }
}`,...(he=(ye=p.parameters)==null?void 0:ye.docs)==null?void 0:he.source},description:{story:"Pill badge - fully rounded",...(xe=(ve=p.parameters)==null?void 0:ve.docs)==null?void 0:xe.description}}};var Be,fe,je,be,Se;m.parameters={...m.parameters,docs:{...(Be=m.parameters)==null?void 0:Be.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  }}>
      <Badge variant="primary" pill>
        Primary
      </Badge>
      <Badge variant="secondary" pill>
        Secondary
      </Badge>
      <Badge variant="success" pill>
        Success
      </Badge>
      <Badge variant="danger" pill>
        Danger
      </Badge>
      <Badge variant="warning" pill>
        Warning
      </Badge>
      <Badge variant="info" pill>
        Info
      </Badge>
    </div>
}`,...(je=(fe=m.parameters)==null?void 0:fe.docs)==null?void 0:je.source},description:{story:"All pill variants",...(Se=(be=m.parameters)==null?void 0:be.docs)==null?void 0:Se.description}}};var we,De,Ie,Ne,Ae;g.parameters={...g.parameters,docs:{...(we=g.parameters)==null?void 0:we.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    dot: true,
    children: 'Online'
  }
}`,...(Ie=(De=g.parameters)==null?void 0:De.docs)==null?void 0:Ie.source},description:{story:"Badge with dot indicator",...(Ae=(Ne=g.parameters)==null?void 0:Ne.docs)==null?void 0:Ae.description}}};var We,Pe,ke,Oe,Ee;u.parameters={...u.parameters,docs:{...(We=u.parameters)==null?void 0:We.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    dot: true,
    'aria-label': 'Online status'
  }
}`,...(ke=(Pe=u.parameters)==null?void 0:Pe.docs)==null?void 0:ke.source},description:{story:"Dot-only badge (status indicator)",...(Ee=(Oe=u.parameters)==null?void 0:Oe.docs)==null?void 0:Ee.description}}};var ze,Ce,Ve,Le,Re;y.parameters={...y.parameters,docs:{...(ze=y.parameters)==null?void 0:ze.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  }}>
      <Badge variant="success" dot>
        Online
      </Badge>
      <Badge variant="warning" dot>
        Away
      </Badge>
      <Badge variant="danger" dot>
        Busy
      </Badge>
      <Badge variant="secondary" dot>
        Offline
      </Badge>
    </div>
}`,...(Ve=(Ce=y.parameters)==null?void 0:Ce.docs)==null?void 0:Ve.source},description:{story:"Status indicators with dots",...(Re=(Le=y.parameters)==null?void 0:Le.docs)==null?void 0:Re.description}}};var Fe,qe,Ge,Me,Te;h.parameters={...h.parameters,docs:{...(Fe=h.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    icon: <span>★</span>,
    children: 'Featured'
  }
}`,...(Ge=(qe=h.parameters)==null?void 0:qe.docs)==null?void 0:Ge.source},description:{story:"Badge with icon",...(Te=(Me=h.parameters)==null?void 0:Me.docs)==null?void 0:Te.description}}};var He,Ue,_e,Je,Ke;v.parameters={...v.parameters,docs:{...(He=v.parameters)==null?void 0:He.docs,source:{originalSource:`{
  render: () => <IconBadgeExample />
}`,...(_e=(Ue=v.parameters)==null?void 0:Ue.docs)==null?void 0:_e.source},description:{story:"Various icon badges - icons automatically hidden from screen readers",...(Ke=(Je=v.parameters)==null?void 0:Je.docs)==null?void 0:Ke.description}}};var Qe,Xe,Ye,Ze,$e;x.parameters={...x.parameters,docs:{...(Qe=x.parameters)==null?void 0:Qe.docs,source:{originalSource:`{
  render: () => <AccessibilityShowcaseExample />,
  parameters: {
    layout: 'padded'
  }
}`,...(Ye=(Xe=x.parameters)==null?void 0:Xe.docs)==null?void 0:Ye.source},description:{story:"Accessibility showcase - demonstrates all accessibility features",...($e=(Ze=x.parameters)==null?void 0:Ze.docs)==null?void 0:$e.description}}};var er,rr,ar,sr,ir;B.parameters={...B.parameters,docs:{...(er=B.parameters)==null?void 0:er.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <div>
        <p style={{
        fontSize: '0.875rem',
        marginBottom: '0.5rem'
      }}>
          ✓ Correct: Dot-only with aria-label
        </p>
        <Badge variant="success" dot aria-label="Online" />
      </div>
      <div>
        <p style={{
        fontSize: '0.875rem',
        marginBottom: '0.5rem'
      }}>
          ✗ Incorrect: Dot-only without aria-label (check console for warning)
        </p>
        <Badge variant="danger" dot />
      </div>
    </div>,
  parameters: {
    layout: 'padded'
  }
}`,...(ar=(rr=B.parameters)==null?void 0:rr.docs)==null?void 0:ar.source},description:{story:"Proper dot-only usage with aria-label",...(ir=(sr=B.parameters)==null?void 0:sr.docs)==null?void 0:ir.description}}};var nr,tr,or,dr,cr;f.parameters={...f.parameters,docs:{...(nr=f.parameters)==null?void 0:nr.docs,source:{originalSource:`{
  render: () => <PerformanceShowcaseExample />,
  parameters: {
    layout: 'padded'
  }
}`,...(or=(tr=f.parameters)==null?void 0:tr.docs)==null?void 0:or.source},description:{story:"Performance - memoized component and class construction",...(cr=(dr=f.parameters)==null?void 0:dr.docs)==null?void 0:cr.description}}};var lr,pr,mr,gr,ur;j.parameters={...j.parameters,docs:{...(lr=j.parameters)==null?void 0:lr.docs,source:{originalSource:`{
  render: () => <div>
      <h1>
        Example heading <Badge variant="secondary">New</Badge>
      </h1>
      <h2>
        Example heading <Badge variant="secondary">New</Badge>
      </h2>
      <h3>
        Example heading <Badge variant="secondary">New</Badge>
      </h3>
    </div>,
  parameters: {
    layout: 'padded'
  }
}`,...(mr=(pr=j.parameters)==null?void 0:pr.docs)==null?void 0:mr.source},description:{story:"Badge in heading",...(ur=(gr=j.parameters)==null?void 0:gr.docs)==null?void 0:ur.description}}};var yr,hr,vr,xr,Br;b.parameters={...b.parameters,docs:{...(yr=b.parameters)==null?void 0:yr.docs,source:{originalSource:`{
  render: () => <Button variant="primary" className="position-relative">
      Inbox
      <Badge variant="danger" pill className="position-absolute top-0 start-100 translate-middle">
        99+
      </Badge>
    </Button>
}`,...(vr=(hr=b.parameters)==null?void 0:hr.docs)==null?void 0:vr.source},description:{story:"Notification badge on button",...(Br=(xr=b.parameters)==null?void 0:xr.docs)==null?void 0:Br.description}}};var fr,jr,br,Sr,wr;S.parameters={...S.parameters,docs:{...(fr=S.parameters)==null?void 0:fr.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  }}>
      <Button variant="outline-primary" className="position-relative">
        Messages
        <Badge variant="primary" pill className="ms-2">
          4
        </Badge>
      </Button>
      <Button variant="outline-secondary" className="position-relative">
        Notifications
        <Badge variant="danger" pill className="ms-2">
          12
        </Badge>
      </Button>
    </div>
}`,...(br=(jr=S.parameters)==null?void 0:jr.docs)==null?void 0:br.source},description:{story:"Badge as counter",...(wr=(Sr=S.parameters)==null?void 0:Sr.docs)==null?void 0:wr.description}}};var Dr,Ir,Nr,Ar,Wr;w.parameters={...w.parameters,docs:{...(Dr=w.parameters)==null?void 0:Dr.docs,source:{originalSource:`{
  render: () => <Button variant="primary" className="position-relative">
      Inbox
      <Badge variant="danger" pill className="position-absolute top-0 start-100 translate-middle p-2 border border-light" aria-label="New notifications" />
    </Button>
}`,...(Nr=(Ir=w.parameters)==null?void 0:Ir.docs)==null?void 0:Nr.source},description:{story:"Empty state indicator",...(Wr=(Ar=w.parameters)==null?void 0:Ar.docs)==null?void 0:Wr.description}}};var Pr,kr,Or,Er,zr;D.parameters={...D.parameters,docs:{...(Pr=D.parameters)==null?void 0:Pr.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  }}>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="light">Light</Badge>
      <Badge variant="dark">Dark</Badge>
    </div>
}`,...(Or=(kr=D.parameters)==null?void 0:kr.docs)==null?void 0:Or.source},description:{story:"All variants showcase",...(zr=(Er=D.parameters)==null?void 0:Er.docs)==null?void 0:zr.description}}};var Cr,Vr,Lr,Rr,Fr;I.parameters={...I.parameters,docs:{...(Cr=I.parameters)==null?void 0:Cr.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }}>
      {/* Variants */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>Variants</h4>
        <div style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </div>

      {/* Pill */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>Pill Shape</h4>
        <div style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
          <Badge variant="primary" pill>
            Primary
          </Badge>
          <Badge variant="secondary" pill>
            Secondary
          </Badge>
          <Badge variant="success" pill>
            Success
          </Badge>
          <Badge variant="danger" pill>
            Danger
          </Badge>
        </div>
      </div>

      {/* Dot */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>Status Indicators</h4>
        <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
          <Badge variant="success" dot>
            Online
          </Badge>
          <Badge variant="warning" dot>
            Away
          </Badge>
          <Badge variant="danger" dot>
            Busy
          </Badge>
          <Badge variant="secondary" dot>
            Offline
          </Badge>
        </div>
      </div>

      {/* With Icons */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>With Icons</h4>
        <div style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
          <Badge variant="primary" icon={<span>★</span>}>
            Featured
          </Badge>
          <Badge variant="success" icon={<span>✓</span>}>
            Verified
          </Badge>
          <Badge variant="danger" icon={<span>!</span>}>
            Alert
          </Badge>
        </div>
      </div>

      {/* On Buttons */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>On Buttons</h4>
        <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
          <Button variant="primary" className="position-relative">
            Inbox
            <Badge variant="light" pill className="ms-2">
              4
            </Badge>
          </Button>
          <Button variant="outline-primary" className="position-relative">
            Notifications
            <Badge variant="danger" pill className="position-absolute top-0 start-100 translate-middle">
              99+
            </Badge>
          </Button>
        </div>
      </div>

      {/* Accessibility */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>Accessibility & Performance (A Grade)</h4>
        <p style={{
        fontSize: '0.875rem',
        color: '#666',
        marginBottom: '0.5rem'
      }}>
          Icons are hidden from screen readers. Dots are smart: hidden when content exists, but
          visible for dot-only indicators. Component uses React.memo + memoized class construction
          for optimal performance in lists and high-frequency re-renders.
        </p>
      </div>
    </div>,
  parameters: {
    layout: 'padded'
  }
}`,...(Lr=(Vr=I.parameters)==null?void 0:Vr.docs)==null?void 0:Lr.source},description:{story:"Complete badge showcase",...(Fr=(Rr=I.parameters)==null?void 0:Rr.docs)==null?void 0:Fr.description}}};const Yr=["Primary","Secondary","Success","Danger","Warning","Info","Light","Dark","Pill","AllPillVariants","WithDot","DotOnly","StatusIndicators","WithIcon","IconExamples","AccessibilityShowcase","ProperDotOnlyUsage","PerformanceDemo","InHeading","NotificationBadge","AsCounter","EmptyIndicator","AllVariants","CompleteShowcase"];export{x as AccessibilityShowcase,m as AllPillVariants,D as AllVariants,S as AsCounter,I as CompleteShowcase,t as Danger,l as Dark,u as DotOnly,w as EmptyIndicator,v as IconExamples,j as InHeading,d as Info,c as Light,b as NotificationBadge,f as PerformanceDemo,p as Pill,s as Primary,B as ProperDotOnlyUsage,i as Secondary,y as StatusIndicators,n as Success,o as Warning,g as WithDot,h as WithIcon,Yr as __namedExportsOrder,Xr as default};
