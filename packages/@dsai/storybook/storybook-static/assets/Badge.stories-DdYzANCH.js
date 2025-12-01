import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{a as r,S as A,b as z,c as Xr,B as a,C as Gr,E as Mr,I as _r}from"./Tabs-DTVVglNe.js";import{r as Jr}from"./iframe-CgsZvN4H.js";import"./preload-helper-Dp1pzeXC.js";const Hr=()=>e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",icon:e.jsx(A,{size:12}),children:"Featured"}),e.jsx(r,{variant:"success",icon:e.jsx(Gr,{size:12}),children:"Verified"}),e.jsx(r,{variant:"danger",icon:e.jsx(Mr,{size:12}),children:"Alert"}),e.jsx(r,{variant:"info",icon:e.jsx(_r,{size:12}),children:"Info"})]}),Kr=()=>e.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap",alignItems:"center"},children:[e.jsxs("div",{children:[e.jsxs("p",{style:{fontSize:"0.875rem",marginBottom:"0.5rem"},children:[e.jsx(z,{size:14,className:"text-success me-1"}),"Dot-only (requires aria-label):"]}),e.jsx(r,{variant:"success",dot:!0,"aria-label":"Online status"})]}),e.jsxs("div",{children:[e.jsxs("p",{style:{fontSize:"0.875rem",marginBottom:"0.5rem"},children:[e.jsx(z,{size:14,className:"text-success me-1"}),"Dot + content:"]}),e.jsx(r,{variant:"success",dot:!0,children:"Online"})]}),e.jsxs("div",{children:[e.jsx("p",{style:{fontSize:"0.875rem",marginBottom:"0.5rem"},children:"Status variants:"}),e.jsxs("div",{style:{display:"flex",gap:"1rem"},children:[e.jsx(r,{variant:"success",dot:!0,"aria-label":"Available"}),e.jsx(r,{variant:"warning",dot:!0,"aria-label":"Away"}),e.jsx(r,{variant:"danger",dot:!0,"aria-label":"Busy"})]})]})]}),Qr=()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Icon Accessibility"}),e.jsx("p",{style:{fontSize:"0.875rem",color:"#666",marginBottom:"0.5rem"},children:'Icons are hidden from screen readers (aria-hidden="true"), preventing redundant announcements:'}),e.jsx(Hr,{})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Dot Indicator Accessibility"}),e.jsx("p",{style:{fontSize:"0.875rem",color:"#666",marginBottom:"0.5rem"},children:"Dots are hidden when badge has content, but visible to screen readers when dot-only:"}),e.jsx(Kr,{})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Dev Warning Example"}),e.jsx("p",{style:{fontSize:"0.875rem",color:"#666",marginBottom:"0.5rem"},children:"Check browser console - dot-only without aria-label shows a helpful warning in development:"}),e.jsx(r,{variant:"danger",dot:!0,children:"This works because it has content"})]})]}),Yr=()=>{const[N,Ur]=Jr.useState(0);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx("p",{style:{fontSize:"0.875rem",color:"#666"},children:"Badges are wrapped with React.memo and internally memoized for maximum performance. Memoized class construction and component prevent unnecessary re-renders even in large lists."}),e.jsxs("div",{children:[e.jsx("p",{style:{marginBottom:"0.5rem"},children:"Click to trigger parent re-render (badge stays optimized):"}),e.jsxs(a,{variant:"outline-primary",onClick:()=>Ur(N+1),children:["Render Parent (",N," times)"]}),e.jsxs("div",{style:{marginTop:"1rem",display:"flex",gap:"0.5rem"},children:[e.jsx(r,{variant:"primary",children:"Optimized"}),e.jsxs(r,{variant:"success",pill:!0,children:["Count: ",N]}),e.jsx(r,{variant:"info",dot:!0,"aria-label":"Active",children:"Active"})]})]})]})},aa={title:"Components/Badge",component:r,parameters:{layout:"centered",docs:{description:{component:"A Bootstrap 5 badge component for displaying labels, status indicators, and counts. Supports 8 color variants, pill shape, dot indicators, and icons. Fully accessible with WCAG 2.2 AA compliance and performance optimizations."}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","success","danger","warning","info","light","dark"],description:"Badge color variant",table:{type:{summary:"BadgeVariant"},defaultValue:{summary:"primary"}}},pill:{control:"boolean",description:"Pill shape (fully rounded)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},dot:{control:"boolean",description:"Show dot indicator (requires aria-label when dot-only)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},children:{control:"text",description:"Badge content",table:{type:{summary:"ReactNode"}}},"aria-label":{control:"text",description:"ARIA label (required for dot-only badges)",table:{type:{summary:"string"}}}}},s={args:{variant:"primary",children:"Primary"}},i={args:{variant:"secondary",children:"Secondary"}},n={args:{variant:"success",children:"Success"}},t={args:{variant:"danger",children:"Danger"}},o={args:{variant:"warning",children:"Warning"}},d={args:{variant:"info",children:"Info"}},c={args:{variant:"light",children:"Light"},parameters:{backgrounds:{default:"dark"}}},l={args:{variant:"dark",children:"Dark"}},p={args:{variant:"primary",pill:!0,children:"Pill Badge"}},m={render:()=>e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",pill:!0,children:"Primary"}),e.jsx(r,{variant:"secondary",pill:!0,children:"Secondary"}),e.jsx(r,{variant:"success",pill:!0,children:"Success"}),e.jsx(r,{variant:"danger",pill:!0,children:"Danger"}),e.jsx(r,{variant:"warning",pill:!0,children:"Warning"}),e.jsx(r,{variant:"info",pill:!0,children:"Info"})]})},g={args:{variant:"success",dot:!0,children:"Online"}},u={args:{variant:"success",dot:!0,"aria-label":"Online status"}},y={render:()=>e.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"success",dot:!0,children:"Online"}),e.jsx(r,{variant:"warning",dot:!0,children:"Away"}),e.jsx(r,{variant:"danger",dot:!0,children:"Busy"}),e.jsx(r,{variant:"secondary",dot:!0,children:"Offline"})]})},h={args:{variant:"primary",icon:e.jsx(A,{size:12}),children:"Featured"}},v={render:()=>e.jsx(Hr,{})},x={render:()=>e.jsx(Qr,{}),parameters:{layout:"padded"}},f={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsxs("p",{style:{fontSize:"0.875rem",marginBottom:"0.5rem"},children:[e.jsx(z,{size:14,className:"text-success me-1"}),"Correct: Dot-only with aria-label"]}),e.jsx(r,{variant:"success",dot:!0,"aria-label":"Online"})]}),e.jsxs("div",{children:[e.jsxs("p",{style:{fontSize:"0.875rem",marginBottom:"0.5rem"},children:[e.jsx(Xr,{size:14,className:"text-danger me-1"}),"Incorrect: Dot-only without aria-label (check console for warning)"]}),e.jsx(r,{variant:"danger",dot:!0})]})]}),parameters:{layout:"padded"}},B={render:()=>e.jsx(Yr,{}),parameters:{layout:"padded"}},j={render:()=>e.jsxs("div",{children:[e.jsxs("h1",{children:["Example heading ",e.jsx(r,{variant:"secondary",children:"New"})]}),e.jsxs("h2",{children:["Example heading ",e.jsx(r,{variant:"secondary",children:"New"})]}),e.jsxs("h3",{children:["Example heading ",e.jsx(r,{variant:"secondary",children:"New"})]})]}),parameters:{layout:"padded"}},b={render:()=>e.jsxs(a,{variant:"primary",className:"position-relative",children:["Inbox",e.jsx(r,{variant:"danger",pill:!0,className:"position-absolute top-0 start-100 translate-middle",children:"99+"})]})},S={render:()=>e.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[e.jsxs(a,{variant:"outline-primary",className:"position-relative",children:["Messages",e.jsx(r,{variant:"primary",pill:!0,className:"ms-2",children:"4"})]}),e.jsxs(a,{variant:"outline-secondary",className:"position-relative",children:["Notifications",e.jsx(r,{variant:"danger",pill:!0,className:"ms-2",children:"12"})]})]})},w={render:()=>e.jsxs(a,{variant:"primary",className:"position-relative",children:["Inbox",e.jsx(r,{variant:"danger",pill:!0,className:"position-absolute top-0 start-100 translate-middle p-2 border border-light","aria-label":"New notifications"})]})},I={render:()=>e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",children:"Primary"}),e.jsx(r,{variant:"secondary",children:"Secondary"}),e.jsx(r,{variant:"success",children:"Success"}),e.jsx(r,{variant:"danger",children:"Danger"}),e.jsx(r,{variant:"warning",children:"Warning"}),e.jsx(r,{variant:"info",children:"Info"}),e.jsx(r,{variant:"light",children:"Light"}),e.jsx(r,{variant:"dark",children:"Dark"})]})},D={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Variants"}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",children:"Primary"}),e.jsx(r,{variant:"secondary",children:"Secondary"}),e.jsx(r,{variant:"success",children:"Success"}),e.jsx(r,{variant:"danger",children:"Danger"}),e.jsx(r,{variant:"warning",children:"Warning"}),e.jsx(r,{variant:"info",children:"Info"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Pill Shape"}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",pill:!0,children:"Primary"}),e.jsx(r,{variant:"secondary",pill:!0,children:"Secondary"}),e.jsx(r,{variant:"success",pill:!0,children:"Success"}),e.jsx(r,{variant:"danger",pill:!0,children:"Danger"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Status Indicators"}),e.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"success",dot:!0,children:"Online"}),e.jsx(r,{variant:"warning",dot:!0,children:"Away"}),e.jsx(r,{variant:"danger",dot:!0,children:"Busy"}),e.jsx(r,{variant:"secondary",dot:!0,children:"Offline"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"With Icons"}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",icon:e.jsx(A,{size:12}),children:"Featured"}),e.jsx(r,{variant:"success",icon:e.jsx(Gr,{size:12}),children:"Verified"}),e.jsx(r,{variant:"danger",icon:e.jsx(Mr,{size:12}),children:"Alert"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"On Buttons"}),e.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:[e.jsxs(a,{variant:"primary",className:"position-relative",children:["Inbox",e.jsx(r,{variant:"light",pill:!0,className:"ms-2",children:"4"})]}),e.jsxs(a,{variant:"outline-primary",className:"position-relative",children:["Notifications",e.jsx(r,{variant:"danger",pill:!0,className:"position-absolute top-0 start-100 translate-middle",children:"99+"})]})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Accessibility & Performance (A Grade)"}),e.jsx("p",{style:{fontSize:"0.875rem",color:"#666",marginBottom:"0.5rem"},children:"Icons are hidden from screen readers. Dots are smart: hidden when content exists, but visible for dot-only indicators. Component uses React.memo + memoized class construction for optimal performance in lists and high-frequency re-renders."})]})]}),parameters:{layout:"padded"}};var W,P,k,E,O;s.parameters={...s.parameters,docs:{...(W=s.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Primary'
  }
}`,...(k=(P=s.parameters)==null?void 0:P.docs)==null?void 0:k.source},description:{story:"Primary badge - default variant",...(O=(E=s.parameters)==null?void 0:E.docs)==null?void 0:O.description}}};var C,V,F,L,R;i.parameters={...i.parameters,docs:{...(C=i.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'Secondary'
  }
}`,...(F=(V=i.parameters)==null?void 0:V.docs)==null?void 0:F.source},description:{story:"Secondary badge",...(R=(L=i.parameters)==null?void 0:L.docs)==null?void 0:R.description}}};var q,T,G,M,H;n.parameters={...n.parameters,docs:{...(q=n.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: 'Success'
  }
}`,...(G=(T=n.parameters)==null?void 0:T.docs)==null?void 0:G.source},description:{story:"Success badge - use for positive status",...(H=(M=n.parameters)==null?void 0:M.docs)==null?void 0:H.description}}};var U,X,_,J,K;t.parameters={...t.parameters,docs:{...(U=t.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    children: 'Danger'
  }
}`,...(_=(X=t.parameters)==null?void 0:X.docs)==null?void 0:_.source},description:{story:"Danger badge - use for errors or critical status",...(K=(J=t.parameters)==null?void 0:J.docs)==null?void 0:K.description}}};var Q,Y,Z,$,ee;o.parameters={...o.parameters,docs:{...(Q=o.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    children: 'Warning'
  }
}`,...(Z=(Y=o.parameters)==null?void 0:Y.docs)==null?void 0:Z.source},description:{story:"Warning badge - use for warnings or caution",...(ee=($=o.parameters)==null?void 0:$.docs)==null?void 0:ee.description}}};var re,ae,se,ie,ne;d.parameters={...d.parameters,docs:{...(re=d.parameters)==null?void 0:re.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    children: 'Info'
  }
}`,...(se=(ae=d.parameters)==null?void 0:ae.docs)==null?void 0:se.source},description:{story:"Info badge - use for informational content",...(ne=(ie=d.parameters)==null?void 0:ie.docs)==null?void 0:ne.description}}};var te,oe,de,ce,le;c.parameters={...c.parameters,docs:{...(te=c.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    variant: 'light',
    children: 'Light'
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...(de=(oe=c.parameters)==null?void 0:oe.docs)==null?void 0:de.source},description:{story:"Light badge - use on dark backgrounds",...(le=(ce=c.parameters)==null?void 0:ce.docs)==null?void 0:le.description}}};var pe,me,ge,ue,ye;l.parameters={...l.parameters,docs:{...(pe=l.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  args: {
    variant: 'dark',
    children: 'Dark'
  }
}`,...(ge=(me=l.parameters)==null?void 0:me.docs)==null?void 0:ge.source},description:{story:"Dark badge - use on light backgrounds",...(ye=(ue=l.parameters)==null?void 0:ue.docs)==null?void 0:ye.description}}};var he,ve,xe,fe,Be;p.parameters={...p.parameters,docs:{...(he=p.parameters)==null?void 0:he.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    pill: true,
    children: 'Pill Badge'
  }
}`,...(xe=(ve=p.parameters)==null?void 0:ve.docs)==null?void 0:xe.source},description:{story:"Pill badge - fully rounded",...(Be=(fe=p.parameters)==null?void 0:fe.docs)==null?void 0:Be.description}}};var je,be,Se,we,Ie;m.parameters={...m.parameters,docs:{...(je=m.parameters)==null?void 0:je.docs,source:{originalSource:`{
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
}`,...(Se=(be=m.parameters)==null?void 0:be.docs)==null?void 0:Se.source},description:{story:"All pill variants",...(Ie=(we=m.parameters)==null?void 0:we.docs)==null?void 0:Ie.description}}};var De,Ne,ze,Ae,We;g.parameters={...g.parameters,docs:{...(De=g.parameters)==null?void 0:De.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    dot: true,
    children: 'Online'
  }
}`,...(ze=(Ne=g.parameters)==null?void 0:Ne.docs)==null?void 0:ze.source},description:{story:"Badge with dot indicator",...(We=(Ae=g.parameters)==null?void 0:Ae.docs)==null?void 0:We.description}}};var Pe,ke,Ee,Oe,Ce;u.parameters={...u.parameters,docs:{...(Pe=u.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    dot: true,
    'aria-label': 'Online status'
  }
}`,...(Ee=(ke=u.parameters)==null?void 0:ke.docs)==null?void 0:Ee.source},description:{story:"Dot-only badge (status indicator)",...(Ce=(Oe=u.parameters)==null?void 0:Oe.docs)==null?void 0:Ce.description}}};var Ve,Fe,Le,Re,qe;y.parameters={...y.parameters,docs:{...(Ve=y.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
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
}`,...(Le=(Fe=y.parameters)==null?void 0:Fe.docs)==null?void 0:Le.source},description:{story:"Status indicators with dots",...(qe=(Re=y.parameters)==null?void 0:Re.docs)==null?void 0:qe.description}}};var Te,Ge,Me,He,Ue;h.parameters={...h.parameters,docs:{...(Te=h.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    icon: <StarFillIcon size={12} />,
    children: 'Featured'
  }
}`,...(Me=(Ge=h.parameters)==null?void 0:Ge.docs)==null?void 0:Me.source},description:{story:"Badge with icon",...(Ue=(He=h.parameters)==null?void 0:He.docs)==null?void 0:Ue.description}}};var Xe,_e,Je,Ke,Qe;v.parameters={...v.parameters,docs:{...(Xe=v.parameters)==null?void 0:Xe.docs,source:{originalSource:`{
  render: () => <IconBadgeExample />
}`,...(Je=(_e=v.parameters)==null?void 0:_e.docs)==null?void 0:Je.source},description:{story:"Various icon badges - icons automatically hidden from screen readers",...(Qe=(Ke=v.parameters)==null?void 0:Ke.docs)==null?void 0:Qe.description}}};var Ye,Ze,$e,er,rr;x.parameters={...x.parameters,docs:{...(Ye=x.parameters)==null?void 0:Ye.docs,source:{originalSource:`{
  render: () => <AccessibilityShowcaseExample />,
  parameters: {
    layout: 'padded'
  }
}`,...($e=(Ze=x.parameters)==null?void 0:Ze.docs)==null?void 0:$e.source},description:{story:"Accessibility showcase - demonstrates all accessibility features",...(rr=(er=x.parameters)==null?void 0:er.docs)==null?void 0:rr.description}}};var ar,sr,ir,nr,tr;f.parameters={...f.parameters,docs:{...(ar=f.parameters)==null?void 0:ar.docs,source:{originalSource:`{
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
          <CheckIcon size={14} className="text-success me-1" />
          Correct: Dot-only with aria-label
        </p>
        <Badge variant="success" dot aria-label="Online" />
      </div>
      <div>
        <p style={{
        fontSize: '0.875rem',
        marginBottom: '0.5rem'
      }}>
          <XLgIcon size={14} className="text-danger me-1" />
          Incorrect: Dot-only without aria-label (check console for warning)
        </p>
        <Badge variant="danger" dot />
      </div>
    </div>,
  parameters: {
    layout: 'padded'
  }
}`,...(ir=(sr=f.parameters)==null?void 0:sr.docs)==null?void 0:ir.source},description:{story:"Proper dot-only usage with aria-label",...(tr=(nr=f.parameters)==null?void 0:nr.docs)==null?void 0:tr.description}}};var or,dr,cr,lr,pr;B.parameters={...B.parameters,docs:{...(or=B.parameters)==null?void 0:or.docs,source:{originalSource:`{
  render: () => <PerformanceShowcaseExample />,
  parameters: {
    layout: 'padded'
  }
}`,...(cr=(dr=B.parameters)==null?void 0:dr.docs)==null?void 0:cr.source},description:{story:"Performance - memoized component and class construction",...(pr=(lr=B.parameters)==null?void 0:lr.docs)==null?void 0:pr.description}}};var mr,gr,ur,yr,hr;j.parameters={...j.parameters,docs:{...(mr=j.parameters)==null?void 0:mr.docs,source:{originalSource:`{
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
}`,...(ur=(gr=j.parameters)==null?void 0:gr.docs)==null?void 0:ur.source},description:{story:"Badge in heading",...(hr=(yr=j.parameters)==null?void 0:yr.docs)==null?void 0:hr.description}}};var vr,xr,fr,Br,jr;b.parameters={...b.parameters,docs:{...(vr=b.parameters)==null?void 0:vr.docs,source:{originalSource:`{
  render: () => <Button variant="primary" className="position-relative">
      Inbox
      <Badge variant="danger" pill className="position-absolute top-0 start-100 translate-middle">
        99+
      </Badge>
    </Button>
}`,...(fr=(xr=b.parameters)==null?void 0:xr.docs)==null?void 0:fr.source},description:{story:"Notification badge on button",...(jr=(Br=b.parameters)==null?void 0:Br.docs)==null?void 0:jr.description}}};var br,Sr,wr,Ir,Dr;S.parameters={...S.parameters,docs:{...(br=S.parameters)==null?void 0:br.docs,source:{originalSource:`{
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
}`,...(wr=(Sr=S.parameters)==null?void 0:Sr.docs)==null?void 0:wr.source},description:{story:"Badge as counter",...(Dr=(Ir=S.parameters)==null?void 0:Ir.docs)==null?void 0:Dr.description}}};var Nr,zr,Ar,Wr,Pr;w.parameters={...w.parameters,docs:{...(Nr=w.parameters)==null?void 0:Nr.docs,source:{originalSource:`{
  render: () => <Button variant="primary" className="position-relative">
      Inbox
      <Badge variant="danger" pill className="position-absolute top-0 start-100 translate-middle p-2 border border-light" aria-label="New notifications" />
    </Button>
}`,...(Ar=(zr=w.parameters)==null?void 0:zr.docs)==null?void 0:Ar.source},description:{story:"Empty state indicator",...(Pr=(Wr=w.parameters)==null?void 0:Wr.docs)==null?void 0:Pr.description}}};var kr,Er,Or,Cr,Vr;I.parameters={...I.parameters,docs:{...(kr=I.parameters)==null?void 0:kr.docs,source:{originalSource:`{
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
}`,...(Or=(Er=I.parameters)==null?void 0:Er.docs)==null?void 0:Or.source},description:{story:"All variants showcase",...(Vr=(Cr=I.parameters)==null?void 0:Cr.docs)==null?void 0:Vr.description}}};var Fr,Lr,Rr,qr,Tr;D.parameters={...D.parameters,docs:{...(Fr=D.parameters)==null?void 0:Fr.docs,source:{originalSource:`{
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
          <Badge variant="primary" icon={<StarFillIcon size={12} />}>
            Featured
          </Badge>
          <Badge variant="success" icon={<CheckCircleFillIcon size={12} />}>
            Verified
          </Badge>
          <Badge variant="danger" icon={<ExclamationTriangleFillIcon size={12} />}>
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
}`,...(Rr=(Lr=D.parameters)==null?void 0:Lr.docs)==null?void 0:Rr.source},description:{story:"Complete badge showcase",...(Tr=(qr=D.parameters)==null?void 0:qr.docs)==null?void 0:Tr.description}}};const sa=["Primary","Secondary","Success","Danger","Warning","Info","Light","Dark","Pill","AllPillVariants","WithDot","DotOnly","StatusIndicators","WithIcon","IconExamples","AccessibilityShowcase","ProperDotOnlyUsage","PerformanceDemo","InHeading","NotificationBadge","AsCounter","EmptyIndicator","AllVariants","CompleteShowcase"];export{x as AccessibilityShowcase,m as AllPillVariants,I as AllVariants,S as AsCounter,D as CompleteShowcase,t as Danger,l as Dark,u as DotOnly,w as EmptyIndicator,v as IconExamples,j as InHeading,d as Info,c as Light,b as NotificationBadge,B as PerformanceDemo,p as Pill,s as Primary,f as ProperDotOnlyUsage,i as Secondary,y as StatusIndicators,n as Success,o as Warning,g as WithDot,h as WithIcon,sa as __namedExportsOrder,aa as default};
