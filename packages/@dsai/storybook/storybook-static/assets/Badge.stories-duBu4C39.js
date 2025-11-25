import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{a as r,B as e}from"./Switch-dAW61mlP.js";import"./iframe-Bvuztdny.js";import"./preload-helper-Dp1pzeXC.js";const Nr={title:"Components/Badge",component:r,parameters:{layout:"centered",docs:{description:{component:"A Bootstrap 5 badge component for displaying labels, status indicators, and counts. Supports 8 color variants, pill shape, dot indicators, and icons. Fully accessible with WCAG 2.2 AA compliance."}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","success","danger","warning","info","light","dark"],description:"Badge color variant",table:{type:{summary:"BadgeVariant"},defaultValue:{summary:"primary"}}},pill:{control:"boolean",description:"Pill shape (fully rounded)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},dot:{control:"boolean",description:"Show dot indicator",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},children:{control:"text",description:"Badge content",table:{type:{summary:"ReactNode"}}}}},s={args:{variant:"primary",children:"Primary"}},n={args:{variant:"secondary",children:"Secondary"}},i={args:{variant:"success",children:"Success"}},t={args:{variant:"danger",children:"Danger"}},d={args:{variant:"warning",children:"Warning"}},o={args:{variant:"info",children:"Info"}},c={args:{variant:"light",children:"Light"},parameters:{backgrounds:{default:"dark"}}},l={args:{variant:"dark",children:"Dark"}},p={args:{variant:"primary",pill:!0,children:"Pill Badge"}},g={render:()=>a.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[a.jsx(r,{variant:"primary",pill:!0,children:"Primary"}),a.jsx(r,{variant:"secondary",pill:!0,children:"Secondary"}),a.jsx(r,{variant:"success",pill:!0,children:"Success"}),a.jsx(r,{variant:"danger",pill:!0,children:"Danger"}),a.jsx(r,{variant:"warning",pill:!0,children:"Warning"}),a.jsx(r,{variant:"info",pill:!0,children:"Info"})]})},m={args:{variant:"success",dot:!0,children:"Online"}},u={args:{variant:"success",dot:!0,"aria-label":"Online status"}},v={render:()=>a.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:[a.jsx(r,{variant:"success",dot:!0,children:"Online"}),a.jsx(r,{variant:"warning",dot:!0,children:"Away"}),a.jsx(r,{variant:"danger",dot:!0,children:"Busy"}),a.jsx(r,{variant:"secondary",dot:!0,children:"Offline"})]})},y={args:{variant:"primary",icon:a.jsx("span",{children:"★"}),children:"Featured"}},h={render:()=>a.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[a.jsx(r,{variant:"primary",icon:a.jsx("span",{children:"★"}),children:"Featured"}),a.jsx(r,{variant:"success",icon:a.jsx("span",{children:"✓"}),children:"Verified"}),a.jsx(r,{variant:"danger",icon:a.jsx("span",{children:"!"}),children:"Alert"}),a.jsx(r,{variant:"info",icon:a.jsx("span",{children:"ℹ"}),children:"Info"})]})},x={render:()=>a.jsxs("div",{children:[a.jsxs("h1",{children:["Example heading ",a.jsx(r,{variant:"secondary",children:"New"})]}),a.jsxs("h2",{children:["Example heading ",a.jsx(r,{variant:"secondary",children:"New"})]}),a.jsxs("h3",{children:["Example heading ",a.jsx(r,{variant:"secondary",children:"New"})]})]}),parameters:{layout:"padded"}},B={render:()=>a.jsxs(e,{variant:"primary",className:"position-relative",children:["Inbox",a.jsx(r,{variant:"danger",pill:!0,className:"position-absolute top-0 start-100 translate-middle",children:"99+"})]})},f={render:()=>a.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[a.jsxs(e,{variant:"outline-primary",className:"position-relative",children:["Messages",a.jsx(r,{variant:"primary",pill:!0,className:"ms-2",children:"4"})]}),a.jsxs(e,{variant:"outline-secondary",className:"position-relative",children:["Notifications",a.jsx(r,{variant:"danger",pill:!0,className:"ms-2",children:"12"})]})]})},j={render:()=>a.jsxs(e,{variant:"primary",className:"position-relative",children:["Inbox",a.jsx(r,{variant:"danger",pill:!0,className:"position-absolute top-0 start-100 translate-middle p-2 border border-light","aria-label":"New notifications"})]})},S={render:()=>a.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[a.jsx(r,{variant:"primary",children:"Primary"}),a.jsx(r,{variant:"secondary",children:"Secondary"}),a.jsx(r,{variant:"success",children:"Success"}),a.jsx(r,{variant:"danger",children:"Danger"}),a.jsx(r,{variant:"warning",children:"Warning"}),a.jsx(r,{variant:"info",children:"Info"}),a.jsx(r,{variant:"light",children:"Light"}),a.jsx(r,{variant:"dark",children:"Dark"})]})},w={render:()=>a.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[a.jsxs("div",{children:[a.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Variants"}),a.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[a.jsx(r,{variant:"primary",children:"Primary"}),a.jsx(r,{variant:"secondary",children:"Secondary"}),a.jsx(r,{variant:"success",children:"Success"}),a.jsx(r,{variant:"danger",children:"Danger"}),a.jsx(r,{variant:"warning",children:"Warning"}),a.jsx(r,{variant:"info",children:"Info"})]})]}),a.jsxs("div",{children:[a.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Pill Shape"}),a.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[a.jsx(r,{variant:"primary",pill:!0,children:"Primary"}),a.jsx(r,{variant:"secondary",pill:!0,children:"Secondary"}),a.jsx(r,{variant:"success",pill:!0,children:"Success"}),a.jsx(r,{variant:"danger",pill:!0,children:"Danger"})]})]}),a.jsxs("div",{children:[a.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Status Indicators"}),a.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:[a.jsx(r,{variant:"success",dot:!0,children:"Online"}),a.jsx(r,{variant:"warning",dot:!0,children:"Away"}),a.jsx(r,{variant:"danger",dot:!0,children:"Busy"}),a.jsx(r,{variant:"secondary",dot:!0,children:"Offline"})]})]}),a.jsxs("div",{children:[a.jsx("h4",{style:{marginBottom:"0.5rem"},children:"With Icons"}),a.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[a.jsx(r,{variant:"primary",icon:a.jsx("span",{children:"★"}),children:"Featured"}),a.jsx(r,{variant:"success",icon:a.jsx("span",{children:"✓"}),children:"Verified"}),a.jsx(r,{variant:"danger",icon:a.jsx("span",{children:"!"}),children:"Alert"})]})]}),a.jsxs("div",{children:[a.jsx("h4",{style:{marginBottom:"0.5rem"},children:"On Buttons"}),a.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:[a.jsxs(e,{variant:"primary",className:"position-relative",children:["Inbox",a.jsx(r,{variant:"light",pill:!0,className:"ms-2",children:"4"})]}),a.jsxs(e,{variant:"outline-primary",className:"position-relative",children:["Notifications",a.jsx(r,{variant:"danger",pill:!0,className:"position-absolute top-0 start-100 translate-middle",children:"99+"})]})]})]})]}),parameters:{layout:"padded"}};var b,N,W,I,D;s.parameters={...s.parameters,docs:{...(b=s.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Primary'
  }
}`,...(W=(N=s.parameters)==null?void 0:N.docs)==null?void 0:W.source},description:{story:"Primary badge - default variant",...(D=(I=s.parameters)==null?void 0:I.docs)==null?void 0:D.description}}};var P,A,k,O,V;n.parameters={...n.parameters,docs:{...(P=n.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'Secondary'
  }
}`,...(k=(A=n.parameters)==null?void 0:A.docs)==null?void 0:k.source},description:{story:"Secondary badge",...(V=(O=n.parameters)==null?void 0:O.docs)==null?void 0:V.description}}};var E,C,F,L,H;i.parameters={...i.parameters,docs:{...(E=i.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: 'Success'
  }
}`,...(F=(C=i.parameters)==null?void 0:C.docs)==null?void 0:F.source},description:{story:"Success badge - use for positive status",...(H=(L=i.parameters)==null?void 0:L.docs)==null?void 0:H.description}}};var M,R,_,G,T;t.parameters={...t.parameters,docs:{...(M=t.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    children: 'Danger'
  }
}`,...(_=(R=t.parameters)==null?void 0:R.docs)==null?void 0:_.source},description:{story:"Danger badge - use for errors or critical status",...(T=(G=t.parameters)==null?void 0:G.docs)==null?void 0:T.description}}};var q,z,J,K,Q;d.parameters={...d.parameters,docs:{...(q=d.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    children: 'Warning'
  }
}`,...(J=(z=d.parameters)==null?void 0:z.docs)==null?void 0:J.source},description:{story:"Warning badge - use for warnings or caution",...(Q=(K=d.parameters)==null?void 0:K.docs)==null?void 0:Q.description}}};var U,X,Y,Z,$;o.parameters={...o.parameters,docs:{...(U=o.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    children: 'Info'
  }
}`,...(Y=(X=o.parameters)==null?void 0:X.docs)==null?void 0:Y.source},description:{story:"Info badge - use for informational content",...($=(Z=o.parameters)==null?void 0:Z.docs)==null?void 0:$.description}}};var aa,ra,ea,sa,na;c.parameters={...c.parameters,docs:{...(aa=c.parameters)==null?void 0:aa.docs,source:{originalSource:`{
  args: {
    variant: 'light',
    children: 'Light'
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...(ea=(ra=c.parameters)==null?void 0:ra.docs)==null?void 0:ea.source},description:{story:"Light badge - use on dark backgrounds",...(na=(sa=c.parameters)==null?void 0:sa.docs)==null?void 0:na.description}}};var ia,ta,da,oa,ca;l.parameters={...l.parameters,docs:{...(ia=l.parameters)==null?void 0:ia.docs,source:{originalSource:`{
  args: {
    variant: 'dark',
    children: 'Dark'
  }
}`,...(da=(ta=l.parameters)==null?void 0:ta.docs)==null?void 0:da.source},description:{story:"Dark badge - use on light backgrounds",...(ca=(oa=l.parameters)==null?void 0:oa.docs)==null?void 0:ca.description}}};var la,pa,ga,ma,ua;p.parameters={...p.parameters,docs:{...(la=p.parameters)==null?void 0:la.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    pill: true,
    children: 'Pill Badge'
  }
}`,...(ga=(pa=p.parameters)==null?void 0:pa.docs)==null?void 0:ga.source},description:{story:"Pill badge - fully rounded",...(ua=(ma=p.parameters)==null?void 0:ma.docs)==null?void 0:ua.description}}};var va,ya,ha,xa,Ba;g.parameters={...g.parameters,docs:{...(va=g.parameters)==null?void 0:va.docs,source:{originalSource:`{
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
}`,...(ha=(ya=g.parameters)==null?void 0:ya.docs)==null?void 0:ha.source},description:{story:"All pill variants",...(Ba=(xa=g.parameters)==null?void 0:xa.docs)==null?void 0:Ba.description}}};var fa,ja,Sa,wa,ba;m.parameters={...m.parameters,docs:{...(fa=m.parameters)==null?void 0:fa.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    dot: true,
    children: 'Online'
  }
}`,...(Sa=(ja=m.parameters)==null?void 0:ja.docs)==null?void 0:Sa.source},description:{story:"Badge with dot indicator",...(ba=(wa=m.parameters)==null?void 0:wa.docs)==null?void 0:ba.description}}};var Na,Wa,Ia,Da,Pa;u.parameters={...u.parameters,docs:{...(Na=u.parameters)==null?void 0:Na.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    dot: true,
    'aria-label': 'Online status'
  }
}`,...(Ia=(Wa=u.parameters)==null?void 0:Wa.docs)==null?void 0:Ia.source},description:{story:"Dot-only badge (status indicator)",...(Pa=(Da=u.parameters)==null?void 0:Da.docs)==null?void 0:Pa.description}}};var Aa,ka,Oa,Va,Ea;v.parameters={...v.parameters,docs:{...(Aa=v.parameters)==null?void 0:Aa.docs,source:{originalSource:`{
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
}`,...(Oa=(ka=v.parameters)==null?void 0:ka.docs)==null?void 0:Oa.source},description:{story:"Status indicators with dots",...(Ea=(Va=v.parameters)==null?void 0:Va.docs)==null?void 0:Ea.description}}};var Ca,Fa,La,Ha,Ma;y.parameters={...y.parameters,docs:{...(Ca=y.parameters)==null?void 0:Ca.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    icon: <span>★</span>,
    children: 'Featured'
  }
}`,...(La=(Fa=y.parameters)==null?void 0:Fa.docs)==null?void 0:La.source},description:{story:"Badge with icon",...(Ma=(Ha=y.parameters)==null?void 0:Ha.docs)==null?void 0:Ma.description}}};var Ra,_a,Ga,Ta,qa;h.parameters={...h.parameters,docs:{...(Ra=h.parameters)==null?void 0:Ra.docs,source:{originalSource:`{
  render: () => <div style={{
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
      <Badge variant="info" icon={<span>ℹ</span>}>
        Info
      </Badge>
    </div>
}`,...(Ga=(_a=h.parameters)==null?void 0:_a.docs)==null?void 0:Ga.source},description:{story:"Various icon badges",...(qa=(Ta=h.parameters)==null?void 0:Ta.docs)==null?void 0:qa.description}}};var za,Ja,Ka,Qa,Ua;x.parameters={...x.parameters,docs:{...(za=x.parameters)==null?void 0:za.docs,source:{originalSource:`{
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
}`,...(Ka=(Ja=x.parameters)==null?void 0:Ja.docs)==null?void 0:Ka.source},description:{story:"Badge in heading",...(Ua=(Qa=x.parameters)==null?void 0:Qa.docs)==null?void 0:Ua.description}}};var Xa,Ya,Za,$a,ar;B.parameters={...B.parameters,docs:{...(Xa=B.parameters)==null?void 0:Xa.docs,source:{originalSource:`{
  render: () => <Button variant="primary" className="position-relative">
      Inbox
      <Badge variant="danger" pill className="position-absolute top-0 start-100 translate-middle">
        99+
      </Badge>
    </Button>
}`,...(Za=(Ya=B.parameters)==null?void 0:Ya.docs)==null?void 0:Za.source},description:{story:"Notification badge on button",...(ar=($a=B.parameters)==null?void 0:$a.docs)==null?void 0:ar.description}}};var rr,er,sr,nr,ir;f.parameters={...f.parameters,docs:{...(rr=f.parameters)==null?void 0:rr.docs,source:{originalSource:`{
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
}`,...(sr=(er=f.parameters)==null?void 0:er.docs)==null?void 0:sr.source},description:{story:"Badge as counter",...(ir=(nr=f.parameters)==null?void 0:nr.docs)==null?void 0:ir.description}}};var tr,dr,or,cr,lr;j.parameters={...j.parameters,docs:{...(tr=j.parameters)==null?void 0:tr.docs,source:{originalSource:`{
  render: () => <Button variant="primary" className="position-relative">
      Inbox
      <Badge variant="danger" pill className="position-absolute top-0 start-100 translate-middle p-2 border border-light" aria-label="New notifications" />
    </Button>
}`,...(or=(dr=j.parameters)==null?void 0:dr.docs)==null?void 0:or.source},description:{story:"Empty state indicator",...(lr=(cr=j.parameters)==null?void 0:cr.docs)==null?void 0:lr.description}}};var pr,gr,mr,ur,vr;S.parameters={...S.parameters,docs:{...(pr=S.parameters)==null?void 0:pr.docs,source:{originalSource:`{
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
}`,...(mr=(gr=S.parameters)==null?void 0:gr.docs)==null?void 0:mr.source},description:{story:"All variants showcase",...(vr=(ur=S.parameters)==null?void 0:ur.docs)==null?void 0:vr.description}}};var yr,hr,xr,Br,fr;w.parameters={...w.parameters,docs:{...(yr=w.parameters)==null?void 0:yr.docs,source:{originalSource:`{
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
    </div>,
  parameters: {
    layout: 'padded'
  }
}`,...(xr=(hr=w.parameters)==null?void 0:hr.docs)==null?void 0:xr.source},description:{story:"Complete badge showcase",...(fr=(Br=w.parameters)==null?void 0:Br.docs)==null?void 0:fr.description}}};const Wr=["Primary","Secondary","Success","Danger","Warning","Info","Light","Dark","Pill","AllPillVariants","WithDot","DotOnly","StatusIndicators","WithIcon","IconExamples","InHeading","NotificationBadge","AsCounter","EmptyIndicator","AllVariants","CompleteShowcase"];export{g as AllPillVariants,S as AllVariants,f as AsCounter,w as CompleteShowcase,t as Danger,l as Dark,u as DotOnly,j as EmptyIndicator,h as IconExamples,x as InHeading,o as Info,c as Light,B as NotificationBadge,p as Pill,s as Primary,n as Secondary,v as StatusIndicators,i as Success,d as Warning,m as WithDot,y as WithIcon,Wr as __namedExportsOrder,Nr as default};
