import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{A as r,B as P,C as n,X as E,E as Vr,I as Gr}from"./Tabs-DTVVglNe.js";import{r as I}from"./iframe-CgsZvN4H.js";import"./preload-helper-Dp1pzeXC.js";const Mr=()=>e.jsxs(r,{variant:"info",children:["Visit our"," ",e.jsx(r.Link,{href:"https://example.com",target:"_blank",children:"secure external link"})," ",'(automatically adds rel="noopener noreferrer" for security).']}),_r=()=>e.jsxs(r,{variant:"warning",children:[e.jsx("strong",{children:"Security Protected:"})," Dangerous URLs like ",e.jsx("code",{children:"javascript:alert('XSS')"})," ","are automatically blocked and converted to safe fallback.",e.jsx(r.Link,{href:"javascript:alert('XSS')",children:"Click here (safe, blocked dangerous URL)"})]}),Or=()=>{const[i,s]=I.useState("idle"),t=async()=>{s("loading"),await new Promise(B=>setTimeout(B,1500)),s("success"),setTimeout(()=>s("idle"),3e3)};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs(r,{variant:i==="success"?"success":"info","aria-atomic":!0,role:"status","aria-live":"polite",icon:i==="success"?e.jsx(n,{}):void 0,children:[i==="idle"&&"Ready to save. Click button to start.",i==="loading"&&"Saving your changes...",i==="success"&&"Changes saved successfully!"]}),e.jsx(P,{variant:"primary",onClick:t,disabled:i==="loading",loading:i==="loading",children:"Save Changes"}),e.jsx("p",{style:{fontSize:"0.875rem",color:"#666"},children:'With aria-atomic="true", screen readers announce the complete alert content on updates.'})]})},Qr={title:"Components/Alert",component:r,parameters:{layout:"padded",docs:{description:{component:"A Bootstrap 5 alert component for displaying important messages with security hardening. Supports 8 color variants, dismissible functionality, compound components (Alert.Link, Alert.Heading), aria-live/aria-atomic for accessibility, and XSS-protected href validation."}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","success","danger","warning","info","light","dark"],description:"Alert color variant",table:{type:{summary:"AlertVariant"},defaultValue:{summary:"primary"}}},title:{control:"text",description:"Optional alert title",table:{type:{summary:"string"}}},dismissible:{control:"boolean",description:"Whether the alert can be dismissed",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},show:{control:"boolean",description:"Control alert visibility",table:{type:{summary:"boolean"},defaultValue:{summary:"true"}}},"aria-atomic":{control:"boolean",description:"Announces complete alert content on updates (for aria-live)",table:{type:{summary:"boolean"},defaultValue:{summary:"true"}}},children:{control:"text",description:"Alert content",table:{type:{summary:"ReactNode"}}}}},l={args:{variant:"primary",children:"A simple primary alert—check it out!"}},o={args:{variant:"secondary",children:"A simple secondary alert—check it out!"}},c={args:{variant:"success",children:"A simple success alert—check it out!"}},d={args:{variant:"danger",children:"A simple danger alert—check it out!"}},m={args:{variant:"warning",children:"A simple warning alert—check it out!"}},u={args:{variant:"info",children:"A simple info alert—check it out!"}},p={args:{variant:"light",children:"A simple light alert—check it out!"}},h={args:{variant:"dark",children:"A simple dark alert—check it out!"}},g={args:{variant:"success",title:"Well done!",children:"You successfully completed the task."}},v={render:()=>e.jsxs(r,{variant:"success",children:[e.jsx(r.Heading,{children:"Well done!"}),e.jsx("p",{children:"Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content."}),e.jsx("hr",{}),e.jsx("p",{className:"mb-0",children:"Whenever you need to, be sure to use margin utilities to keep things nice and tidy."})]})},x={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs(r,{variant:"primary",children:["A simple primary alert with ",e.jsx(r.Link,{href:"#",children:"an example link"}),". Give it a click if you like."]}),e.jsxs(r,{variant:"secondary",children:["A simple secondary alert with ",e.jsx(r.Link,{href:"#",children:"an example link"}),". Give it a click if you like."]}),e.jsxs(r,{variant:"success",children:["A simple success alert with ",e.jsx(r.Link,{href:"#",children:"an example link"}),". Give it a click if you like."]}),e.jsxs(r,{variant:"danger",children:["A simple danger alert with ",e.jsx(r.Link,{href:"#",children:"an example link"}),". Give it a click if you like."]})]})},A={render:function(){const[s,t]=I.useState(!0);return s?e.jsxs(r,{variant:"warning",dismissible:!0,onClose:()=>t(!1),children:[e.jsx("strong",{children:"Holy guacamole!"})," You should check in on some of those fields below."]}):e.jsx(P,{variant:"primary",onClick:()=>t(!0),children:"Show Alert"})}},y={render:function(){const[s,t]=I.useState([{id:1,variant:"success",message:"Success! Your changes have been saved."},{id:2,variant:"info",message:"Info: New features are available."},{id:3,variant:"warning",message:"Warning: Your session will expire soon."}]),B=a=>{t(s.filter(Ur=>Ur.id!==a))};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[s.map(a=>e.jsx(r,{variant:a.variant,dismissible:!0,onClose:()=>B(a.id),children:a.message},a.id)),s.length===0&&e.jsx("p",{className:"text-muted",children:"All alerts dismissed. Refresh to see them again."})]})}},f={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(r,{variant:"success",icon:e.jsx(n,{}),children:"Your changes have been saved successfully."}),e.jsx(r,{variant:"danger",icon:e.jsx(E,{}),children:"An error occurred. Please try again."}),e.jsx(r,{variant:"warning",icon:e.jsx(Vr,{}),children:"Please review your input before submitting."}),e.jsx(r,{variant:"info",icon:e.jsx(Gr,{}),children:"New features are available in this version."})]})},k={render:()=>e.jsx(Mr,{})},j={render:()=>e.jsx(_r,{})},S={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs(r,{variant:"success",icon:e.jsx(n,{}),children:[e.jsx("strong",{children:"Safe:"})," ",e.jsx(r.Link,{href:"https://example.com",children:"HTTPS link"})]}),e.jsxs(r,{variant:"success",icon:e.jsx(n,{}),children:[e.jsx("strong",{children:"Safe:"})," ",e.jsx(r.Link,{href:"/docs",children:"Relative link"})]}),e.jsxs(r,{variant:"success",icon:e.jsx(n,{}),children:[e.jsx("strong",{children:"Safe:"})," ",e.jsx(r.Link,{href:"mailto:test@example.com",children:"Email link"})]}),e.jsxs(r,{variant:"danger",icon:e.jsx(E,{}),children:[e.jsx("strong",{children:"Blocked:"})," ",e.jsx(r.Link,{href:"javascript:alert('XSS')",children:"javascript: protocol"})]}),e.jsxs(r,{variant:"danger",icon:e.jsx(E,{}),children:[e.jsx("strong",{children:"Blocked:"})," ",e.jsx(r.Link,{href:"data:text/html,<script>",children:"data: protocol"})]})]})},w={render:()=>e.jsx(Or,{})},b={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs(r,{variant:"danger","aria-atomic":!0,children:[e.jsx("strong",{children:"Critical:"}),' Uses role="alert" and aria-live="assertive" for immediate announcement.']}),e.jsxs(r,{variant:"warning","aria-atomic":!0,children:[e.jsx("strong",{children:"Warning:"}),' Uses role="alert" and aria-live="assertive".']}),e.jsxs(r,{variant:"success","aria-atomic":!0,children:[e.jsx("strong",{children:"Success:"}),' Uses role="status" and aria-live="polite" for non-urgent updates.']}),e.jsxs(r,{variant:"info","aria-atomic":!0,children:[e.jsx("strong",{children:"Info:"}),' Uses role="status" and aria-live="polite".']})]})},L={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs(r,{variant:"danger",children:[e.jsx(r.Heading,{as:"h5",children:"Please fix the following errors:"}),e.jsxs("ul",{className:"mb-0",children:[e.jsx("li",{children:"Email address is required"}),e.jsx("li",{children:"Password must be at least 8 characters"}),e.jsx("li",{children:"Please accept the terms and conditions"})]})]}),e.jsxs(r,{variant:"success",children:[e.jsx("strong",{children:"Form submitted successfully!"})," We'll be in touch soon."]})]})},D={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs(r,{variant:"info",children:[e.jsx("strong",{children:"Scheduled maintenance:"})," The system will be unavailable on Sunday from 2-4 AM EST."]}),e.jsxs(r,{variant:"warning",children:[e.jsx("strong",{children:"Session expiring:"})," Your session will expire in 5 minutes."," ",e.jsx(r.Link,{href:"#",children:"Extend session"})]}),e.jsxs(r,{variant:"danger",children:[e.jsx("strong",{children:"Connection lost:"})," Unable to connect to the server."," ",e.jsx(r.Link,{href:"#",children:"Retry"})]})]})},C={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(r,{variant:"primary",children:"A simple primary alert—check it out!"}),e.jsx(r,{variant:"secondary",children:"A simple secondary alert—check it out!"}),e.jsx(r,{variant:"success",children:"A simple success alert—check it out!"}),e.jsx(r,{variant:"danger",children:"A simple danger alert—check it out!"}),e.jsx(r,{variant:"warning",children:"A simple warning alert—check it out!"}),e.jsx(r,{variant:"info",children:"A simple info alert—check it out!"}),e.jsx(r,{variant:"light",children:"A simple light alert—check it out!"}),e.jsx(r,{variant:"dark",children:"A simple dark alert—check it out!"})]})},W={render:function(){const[s,t]=I.useState(!0);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Basic Variants"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(r,{variant:"primary",children:"Primary alert"}),e.jsx(r,{variant:"success",children:"Success alert"}),e.jsx(r,{variant:"danger",children:"Danger alert"}),e.jsx(r,{variant:"warning",children:"Warning alert"}),e.jsx(r,{variant:"info",children:"Info alert"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"With Heading"}),e.jsxs(r,{variant:"success",children:[e.jsx(r.Heading,{children:"Success!"}),e.jsx("p",{className:"mb-0",children:"Your operation completed successfully."})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"With Link"}),e.jsxs(r,{variant:"info",children:["Learn more in our ",e.jsx(r.Link,{href:"#",children:"documentation"}),"."]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Dismissible"}),s?e.jsx(r,{variant:"warning",dismissible:!0,onClose:()=>t(!1),children:"This alert can be dismissed."}):e.jsx(P,{size:"sm",onClick:()=>t(!0),children:"Show Alert"})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"With Icon"}),e.jsx(r,{variant:"success",icon:e.jsx(n,{}),children:"Operation completed successfully."})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Security Features"}),e.jsxs(r,{variant:"info",children:["Safe links:"," ",e.jsx(r.Link,{href:"https://example.com",target:"_blank",children:"external"})," ","and ",e.jsx(r.Link,{href:"/docs",children:"internal"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Accessibility"}),e.jsx(r,{variant:"success","aria-atomic":!0,children:"Complete alert content announced to screen readers with aria-atomic=true"})]})]})}};var F,H,T,R,N;l.parameters={...l.parameters,docs:{...(F=l.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'A simple primary alert—check it out!'
  }
}`,...(T=(H=l.parameters)==null?void 0:H.docs)==null?void 0:T.source},description:{story:"Primary alert - default variant",...(N=(R=l.parameters)==null?void 0:R.docs)==null?void 0:N.description}}};var X,Y,U,V,G;o.parameters={...o.parameters,docs:{...(X=o.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'A simple secondary alert—check it out!'
  }
}`,...(U=(Y=o.parameters)==null?void 0:Y.docs)==null?void 0:U.source},description:{story:"Secondary alert",...(G=(V=o.parameters)==null?void 0:V.docs)==null?void 0:G.description}}};var M,_,O,z,q;c.parameters={...c.parameters,docs:{...(M=c.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: 'A simple success alert—check it out!'
  }
}`,...(O=(_=c.parameters)==null?void 0:_.docs)==null?void 0:O.source},description:{story:"Success alert - use for positive feedback",...(q=(z=c.parameters)==null?void 0:z.docs)==null?void 0:q.description}}};var J,K,Q,Z,$;d.parameters={...d.parameters,docs:{...(J=d.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    children: 'A simple danger alert—check it out!'
  }
}`,...(Q=(K=d.parameters)==null?void 0:K.docs)==null?void 0:Q.source},description:{story:"Danger alert - use for errors or critical messages",...($=(Z=d.parameters)==null?void 0:Z.docs)==null?void 0:$.description}}};var ee,re,se,ie,te;m.parameters={...m.parameters,docs:{...(ee=m.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    children: 'A simple warning alert—check it out!'
  }
}`,...(se=(re=m.parameters)==null?void 0:re.docs)==null?void 0:se.source},description:{story:"Warning alert - use for warnings or caution",...(te=(ie=m.parameters)==null?void 0:ie.docs)==null?void 0:te.description}}};var ae,ne,le,oe,ce;u.parameters={...u.parameters,docs:{...(ae=u.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    children: 'A simple info alert—check it out!'
  }
}`,...(le=(ne=u.parameters)==null?void 0:ne.docs)==null?void 0:le.source},description:{story:"Info alert - use for informational content",...(ce=(oe=u.parameters)==null?void 0:oe.docs)==null?void 0:ce.description}}};var de,me,ue,pe,he;p.parameters={...p.parameters,docs:{...(de=p.parameters)==null?void 0:de.docs,source:{originalSource:`{
  args: {
    variant: 'light',
    children: 'A simple light alert—check it out!'
  }
}`,...(ue=(me=p.parameters)==null?void 0:me.docs)==null?void 0:ue.source},description:{story:"Light alert",...(he=(pe=p.parameters)==null?void 0:pe.docs)==null?void 0:he.description}}};var ge,ve,xe,Ae,ye;h.parameters={...h.parameters,docs:{...(ge=h.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  args: {
    variant: 'dark',
    children: 'A simple dark alert—check it out!'
  }
}`,...(xe=(ve=h.parameters)==null?void 0:ve.docs)==null?void 0:xe.source},description:{story:"Dark alert",...(ye=(Ae=h.parameters)==null?void 0:Ae.docs)==null?void 0:ye.description}}};var fe,ke,je,Se,we;g.parameters={...g.parameters,docs:{...(fe=g.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    title: 'Well done!',
    children: 'You successfully completed the task.'
  }
}`,...(je=(ke=g.parameters)==null?void 0:ke.docs)==null?void 0:je.source},description:{story:"Alert with title prop",...(we=(Se=g.parameters)==null?void 0:Se.docs)==null?void 0:we.description}}};var be,Le,De,Ce,We;v.parameters={...v.parameters,docs:{...(be=v.parameters)==null?void 0:be.docs,source:{originalSource:`{
  render: () => <Alert variant="success">
      <Alert.Heading>Well done!</Alert.Heading>
      <p>
        Aww yeah, you successfully read this important alert message. This example text is going to
        run a bit longer so that you can see how spacing within an alert works with this kind of
        content.
      </p>
      <hr />
      <p className="mb-0">
        Whenever you need to, be sure to use margin utilities to keep things nice and tidy.
      </p>
    </Alert>
}`,...(De=(Le=v.parameters)==null?void 0:Le.docs)==null?void 0:De.source},description:{story:"Alert with Alert.Heading compound component",...(We=(Ce=v.parameters)==null?void 0:Ce.docs)==null?void 0:We.description}}};var Ie,Be,Ee,Pe,Fe;x.parameters={...x.parameters,docs:{...(Ie=x.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <Alert variant="primary">
        A simple primary alert with <Alert.Link href="#">an example link</Alert.Link>. Give it a
        click if you like.
      </Alert>
      <Alert variant="secondary">
        A simple secondary alert with <Alert.Link href="#">an example link</Alert.Link>. Give it a
        click if you like.
      </Alert>
      <Alert variant="success">
        A simple success alert with <Alert.Link href="#">an example link</Alert.Link>. Give it a
        click if you like.
      </Alert>
      <Alert variant="danger">
        A simple danger alert with <Alert.Link href="#">an example link</Alert.Link>. Give it a
        click if you like.
      </Alert>
    </div>
}`,...(Ee=(Be=x.parameters)==null?void 0:Be.docs)==null?void 0:Ee.source},description:{story:"Alert with Alert.Link",...(Fe=(Pe=x.parameters)==null?void 0:Pe.docs)==null?void 0:Fe.description}}};var He,Te,Re,Ne,Xe;A.parameters={...A.parameters,docs:{...(He=A.parameters)==null?void 0:He.docs,source:{originalSource:`{
  render: function DismissibleAlert() {
    const [show, setShow] = useState(true);
    if (!show) {
      return <Button variant="primary" onClick={() => setShow(true)}>
          Show Alert
        </Button>;
    }
    return <Alert variant="warning" dismissible onClose={() => setShow(false)}>
        <strong>Holy guacamole!</strong> You should check in on some of those fields below.
      </Alert>;
  }
}`,...(Re=(Te=A.parameters)==null?void 0:Te.docs)==null?void 0:Re.source},description:{story:"Dismissible alert with close button",...(Xe=(Ne=A.parameters)==null?void 0:Ne.docs)==null?void 0:Xe.description}}};var Ye,Ue,Ve,Ge,Me;y.parameters={...y.parameters,docs:{...(Ye=y.parameters)==null?void 0:Ye.docs,source:{originalSource:`{
  render: function MultipleDismissibleAlerts() {
    const [alerts, setAlerts] = useState([{
      id: 1,
      variant: 'success' as const,
      message: 'Success! Your changes have been saved.'
    }, {
      id: 2,
      variant: 'info' as const,
      message: 'Info: New features are available.'
    }, {
      id: 3,
      variant: 'warning' as const,
      message: 'Warning: Your session will expire soon.'
    }]);
    const dismissAlert = (id: number) => {
      setAlerts(alerts.filter(alert => alert.id !== id));
    };
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
        {alerts.map(alert => <Alert key={alert.id} variant={alert.variant} dismissible onClose={() => dismissAlert(alert.id)}>
            {alert.message}
          </Alert>)}
        {alerts.length === 0 && <p className="text-muted">All alerts dismissed. Refresh to see them again.</p>}
      </div>;
  }
}`,...(Ve=(Ue=y.parameters)==null?void 0:Ue.docs)==null?void 0:Ve.source},description:{story:"Multiple dismissible alerts",...(Me=(Ge=y.parameters)==null?void 0:Ge.docs)==null?void 0:Me.description}}};var _e,Oe,ze,qe,Je;f.parameters={...f.parameters,docs:{...(_e=f.parameters)==null?void 0:_e.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <Alert variant="success" icon={<CheckCircleFillIcon />}>
        Your changes have been saved successfully.
      </Alert>
      <Alert variant="danger" icon={<XCircleFillIcon />}>
        An error occurred. Please try again.
      </Alert>
      <Alert variant="warning" icon={<ExclamationTriangleFillIcon />}>
        Please review your input before submitting.
      </Alert>
      <Alert variant="info" icon={<InfoCircleFillIcon />}>
        New features are available in this version.
      </Alert>
    </div>
}`,...(ze=(Oe=f.parameters)==null?void 0:Oe.docs)==null?void 0:ze.source},description:{story:"Alert with custom icon",...(Je=(qe=f.parameters)==null?void 0:qe.docs)==null?void 0:Je.description}}};var Ke,Qe,Ze,$e,er;k.parameters={...k.parameters,docs:{...(Ke=k.parameters)==null?void 0:Ke.docs,source:{originalSource:`{
  render: () => <SecureExternalLinkExample />
}`,...(Ze=(Qe=k.parameters)==null?void 0:Qe.docs)==null?void 0:Ze.source},description:{story:'Secure external links with automatic rel="noopener noreferrer"',...(er=($e=k.parameters)==null?void 0:$e.docs)==null?void 0:er.description}}};var rr,sr,ir,tr,ar;j.parameters={...j.parameters,docs:{...(rr=j.parameters)==null?void 0:rr.docs,source:{originalSource:`{
  render: () => <XSSPreventionExample />
}`,...(ir=(sr=j.parameters)==null?void 0:sr.docs)==null?void 0:ir.source},description:{story:"XSS Protection - dangerous URLs are automatically blocked",...(ar=(tr=j.parameters)==null?void 0:tr.docs)==null?void 0:ar.description}}};var nr,lr,or,cr,dr;S.parameters={...S.parameters,docs:{...(nr=S.parameters)==null?void 0:nr.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <Alert variant="success" icon={<CheckCircleFillIcon />}>
        <strong>Safe:</strong> <Alert.Link href="https://example.com">HTTPS link</Alert.Link>
      </Alert>
      <Alert variant="success" icon={<CheckCircleFillIcon />}>
        <strong>Safe:</strong> <Alert.Link href="/docs">Relative link</Alert.Link>
      </Alert>
      <Alert variant="success" icon={<CheckCircleFillIcon />}>
        <strong>Safe:</strong> <Alert.Link href="mailto:test@example.com">Email link</Alert.Link>
      </Alert>
      <Alert variant="danger" icon={<XCircleFillIcon />}>
        <strong>Blocked:</strong>{' '}
        <Alert.Link href="javascript:alert('XSS')">javascript: protocol</Alert.Link>
      </Alert>
      <Alert variant="danger" icon={<XCircleFillIcon />}>
        <strong>Blocked:</strong>{' '}
        <Alert.Link href="data:text/html,<script>">data: protocol</Alert.Link>
      </Alert>
    </div>
}`,...(or=(lr=S.parameters)==null?void 0:lr.docs)==null?void 0:or.source},description:{story:"Multiple security-hardened links",...(dr=(cr=S.parameters)==null?void 0:cr.docs)==null?void 0:dr.description}}};var mr,ur,pr,hr,gr;w.parameters={...w.parameters,docs:{...(mr=w.parameters)==null?void 0:mr.docs,source:{originalSource:`{
  render: () => <AriaAtomicExample />
}`,...(pr=(ur=w.parameters)==null?void 0:ur.docs)==null?void 0:pr.source},description:{story:"aria-atomic for complete announcements",...(gr=(hr=w.parameters)==null?void 0:hr.docs)==null?void 0:gr.description}}};var vr,xr,Ar,yr,fr;b.parameters={...b.parameters,docs:{...(vr=b.parameters)==null?void 0:vr.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <Alert variant="danger" aria-atomic={true}>
        <strong>Critical:</strong> Uses role="alert" and aria-live="assertive" for immediate
        announcement.
      </Alert>
      <Alert variant="warning" aria-atomic={true}>
        <strong>Warning:</strong> Uses role="alert" and aria-live="assertive".
      </Alert>
      <Alert variant="success" aria-atomic={true}>
        <strong>Success:</strong> Uses role="status" and aria-live="polite" for non-urgent updates.
      </Alert>
      <Alert variant="info" aria-atomic={true}>
        <strong>Info:</strong> Uses role="status" and aria-live="polite".
      </Alert>
    </div>
}`,...(Ar=(xr=b.parameters)==null?void 0:xr.docs)==null?void 0:Ar.source},description:{story:"Alert with appropriate aria-live for severity",...(fr=(yr=b.parameters)==null?void 0:yr.docs)==null?void 0:fr.description}}};var kr,jr,Sr,wr,br;L.parameters={...L.parameters,docs:{...(kr=L.parameters)==null?void 0:kr.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <Alert variant="danger">
        <Alert.Heading as="h5">Please fix the following errors:</Alert.Heading>
        <ul className="mb-0">
          <li>Email address is required</li>
          <li>Password must be at least 8 characters</li>
          <li>Please accept the terms and conditions</li>
        </ul>
      </Alert>
      <Alert variant="success">
        <strong>Form submitted successfully!</strong> We&apos;ll be in touch soon.
      </Alert>
    </div>
}`,...(Sr=(jr=L.parameters)==null?void 0:jr.docs)==null?void 0:Sr.source},description:{story:"Form validation alerts",...(br=(wr=L.parameters)==null?void 0:wr.docs)==null?void 0:br.description}}};var Lr,Dr,Cr,Wr,Ir;D.parameters={...D.parameters,docs:{...(Lr=D.parameters)==null?void 0:Lr.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <Alert variant="info">
        <strong>Scheduled maintenance:</strong> The system will be unavailable on Sunday from 2-4 AM
        EST.
      </Alert>
      <Alert variant="warning">
        <strong>Session expiring:</strong> Your session will expire in 5 minutes.{' '}
        <Alert.Link href="#">Extend session</Alert.Link>
      </Alert>
      <Alert variant="danger">
        <strong>Connection lost:</strong> Unable to connect to the server.{' '}
        <Alert.Link href="#">Retry</Alert.Link>
      </Alert>
    </div>
}`,...(Cr=(Dr=D.parameters)==null?void 0:Dr.docs)==null?void 0:Cr.source},description:{story:"System notifications",...(Ir=(Wr=D.parameters)==null?void 0:Wr.docs)==null?void 0:Ir.description}}};var Br,Er,Pr,Fr,Hr;C.parameters={...C.parameters,docs:{...(Br=C.parameters)==null?void 0:Br.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  }}>
      <Alert variant="primary">A simple primary alert—check it out!</Alert>
      <Alert variant="secondary">A simple secondary alert—check it out!</Alert>
      <Alert variant="success">A simple success alert—check it out!</Alert>
      <Alert variant="danger">A simple danger alert—check it out!</Alert>
      <Alert variant="warning">A simple warning alert—check it out!</Alert>
      <Alert variant="info">A simple info alert—check it out!</Alert>
      <Alert variant="light">A simple light alert—check it out!</Alert>
      <Alert variant="dark">A simple dark alert—check it out!</Alert>
    </div>
}`,...(Pr=(Er=C.parameters)==null?void 0:Er.docs)==null?void 0:Pr.source},description:{story:"All variants showcase",...(Hr=(Fr=C.parameters)==null?void 0:Fr.docs)==null?void 0:Hr.description}}};var Tr,Rr,Nr,Xr,Yr;W.parameters={...W.parameters,docs:{...(Tr=W.parameters)==null?void 0:Tr.docs,source:{originalSource:`{
  render: function CompleteShowcaseRender() {
    const [showDismissible, setShowDismissible] = useState(true);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
        {/* Basic Variants */}
        <div>
          <h4 style={{
          marginBottom: '0.5rem'
        }}>Basic Variants</h4>
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
            <Alert variant="primary">Primary alert</Alert>
            <Alert variant="success">Success alert</Alert>
            <Alert variant="danger">Danger alert</Alert>
            <Alert variant="warning">Warning alert</Alert>
            <Alert variant="info">Info alert</Alert>
          </div>
        </div>

        {/* With Heading */}
        <div>
          <h4 style={{
          marginBottom: '0.5rem'
        }}>With Heading</h4>
          <Alert variant="success">
            <Alert.Heading>Success!</Alert.Heading>
            <p className="mb-0">Your operation completed successfully.</p>
          </Alert>
        </div>

        {/* With Link */}
        <div>
          <h4 style={{
          marginBottom: '0.5rem'
        }}>With Link</h4>
          <Alert variant="info">
            Learn more in our <Alert.Link href="#">documentation</Alert.Link>.
          </Alert>
        </div>

        {/* Dismissible */}
        <div>
          <h4 style={{
          marginBottom: '0.5rem'
        }}>Dismissible</h4>
          {showDismissible ? <Alert variant="warning" dismissible onClose={() => setShowDismissible(false)}>
              This alert can be dismissed.
            </Alert> : <Button size="sm" onClick={() => setShowDismissible(true)}>
              Show Alert
            </Button>}
        </div>

        {/* With Icon */}
        <div>
          <h4 style={{
          marginBottom: '0.5rem'
        }}>With Icon</h4>
          <Alert variant="success" icon={<CheckCircleFillIcon />}>
            Operation completed successfully.
          </Alert>
        </div>

        {/* Security */}
        <div>
          <h4 style={{
          marginBottom: '0.5rem'
        }}>Security Features</h4>
          <Alert variant="info">
            Safe links:{' '}
            <Alert.Link href="https://example.com" target="_blank">
              external
            </Alert.Link>{' '}
            and <Alert.Link href="/docs">internal</Alert.Link>
          </Alert>
        </div>

        {/* Accessibility */}
        <div>
          <h4 style={{
          marginBottom: '0.5rem'
        }}>Accessibility</h4>
          <Alert variant="success" aria-atomic={true}>
            Complete alert content announced to screen readers with aria-atomic=true
          </Alert>
        </div>
      </div>;
  }
}`,...(Nr=(Rr=W.parameters)==null?void 0:Rr.docs)==null?void 0:Nr.source},description:{story:"Complete alert showcase",...(Yr=(Xr=W.parameters)==null?void 0:Xr.docs)==null?void 0:Yr.description}}};const Zr=["Primary","Secondary","Success","Danger","Warning","Info","Light","Dark","WithTitle","WithHeading","WithLink","Dismissible","MultipleDismissible","WithIcon","SecureExternalLinks","XSSPrevention","SecurityShowcase","AriaAtomic","AccessibilityRoles","FormValidation","SystemNotifications","AllVariants","CompleteShowcase"];export{b as AccessibilityRoles,C as AllVariants,w as AriaAtomic,W as CompleteShowcase,d as Danger,h as Dark,A as Dismissible,L as FormValidation,u as Info,p as Light,y as MultipleDismissible,l as Primary,o as Secondary,k as SecureExternalLinks,S as SecurityShowcase,c as Success,D as SystemNotifications,m as Warning,v as WithHeading,f as WithIcon,x as WithLink,g as WithTitle,j as XSSPrevention,Zr as __namedExportsOrder,Qr as default};
