import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{A as r,B as P}from"./Tabs-Ct9YirVA.js";import{r as B}from"./iframe-BooCaz94.js";import"./preload-helper-Dp1pzeXC.js";const Vr=()=>e.jsxs(r,{variant:"info",children:["Visit our"," ",e.jsx(r.Link,{href:"https://example.com",target:"_blank",children:"secure external link"})," ",'(automatically adds rel="noopener noreferrer" for security).']}),zr=()=>e.jsxs(r,{variant:"warning",children:[e.jsx("strong",{children:"Security Protected:"})," Dangerous URLs like ",e.jsx("code",{children:"javascript:alert('XSS')"})," ","are automatically blocked and converted to safe fallback.",e.jsx(r.Link,{href:"javascript:alert('XSS')",children:"Click here (safe, blocked dangerous URL)"})]}),Xr=()=>{const[i,s]=B.useState("idle"),t=async()=>{s("loading"),await new Promise(C=>setTimeout(C,1500)),s("success"),setTimeout(()=>s("idle"),3e3)};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs(r,{variant:i==="success"?"success":"info","aria-atomic":!0,role:"status","aria-live":"polite",children:[i==="idle"&&"Ready to save. Click button to start.",i==="loading"&&"Saving your changes...",i==="success"&&"✓ Changes saved successfully!"]}),e.jsx(P,{variant:"primary",onClick:t,disabled:i==="loading",loading:i==="loading",children:"Save Changes"}),e.jsx("p",{style:{fontSize:"0.875rem",color:"#666"},children:'With aria-atomic="true", screen readers announce the complete alert content on updates.'})]})},Or={title:"Components/Alert",component:r,parameters:{layout:"padded",docs:{description:{component:"A Bootstrap 5 alert component for displaying important messages with security hardening. Supports 8 color variants, dismissible functionality, compound components (Alert.Link, Alert.Heading), aria-live/aria-atomic for accessibility, and XSS-protected href validation."}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","success","danger","warning","info","light","dark"],description:"Alert color variant",table:{type:{summary:"AlertVariant"},defaultValue:{summary:"primary"}}},title:{control:"text",description:"Optional alert title",table:{type:{summary:"string"}}},dismissible:{control:"boolean",description:"Whether the alert can be dismissed",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},show:{control:"boolean",description:"Control alert visibility",table:{type:{summary:"boolean"},defaultValue:{summary:"true"}}},"aria-atomic":{control:"boolean",description:"Announces complete alert content on updates (for aria-live)",table:{type:{summary:"boolean"},defaultValue:{summary:"true"}}},children:{control:"text",description:"Alert content",table:{type:{summary:"ReactNode"}}}}},n={args:{variant:"primary",children:"A simple primary alert—check it out!"}},l={args:{variant:"secondary",children:"A simple secondary alert—check it out!"}},o={args:{variant:"success",children:"A simple success alert—check it out!"}},c={args:{variant:"danger",children:"A simple danger alert—check it out!"}},d={args:{variant:"warning",children:"A simple warning alert—check it out!"}},m={args:{variant:"info",children:"A simple info alert—check it out!"}},p={args:{variant:"light",children:"A simple light alert—check it out!"}},u={args:{variant:"dark",children:"A simple dark alert—check it out!"}},h={args:{variant:"success",title:"Well done!",children:"You successfully completed the task."}},g={render:()=>e.jsxs(r,{variant:"success",children:[e.jsx(r.Heading,{children:"Well done!"}),e.jsx("p",{children:"Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content."}),e.jsx("hr",{}),e.jsx("p",{className:"mb-0",children:"Whenever you need to, be sure to use margin utilities to keep things nice and tidy."})]})},v={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs(r,{variant:"primary",children:["A simple primary alert with ",e.jsx(r.Link,{href:"#",children:"an example link"}),". Give it a click if you like."]}),e.jsxs(r,{variant:"secondary",children:["A simple secondary alert with ",e.jsx(r.Link,{href:"#",children:"an example link"}),". Give it a click if you like."]}),e.jsxs(r,{variant:"success",children:["A simple success alert with ",e.jsx(r.Link,{href:"#",children:"an example link"}),". Give it a click if you like."]}),e.jsxs(r,{variant:"danger",children:["A simple danger alert with ",e.jsx(r.Link,{href:"#",children:"an example link"}),". Give it a click if you like."]})]})},x={render:function(){const[s,t]=B.useState(!0);return s?e.jsxs(r,{variant:"warning",dismissible:!0,onClose:()=>t(!1),children:[e.jsx("strong",{children:"Holy guacamole!"})," You should check in on some of those fields below."]}):e.jsx(P,{variant:"primary",onClick:()=>t(!0),children:"Show Alert"})}},y={render:function(){const[s,t]=B.useState([{id:1,variant:"success",message:"Success! Your changes have been saved."},{id:2,variant:"info",message:"Info: New features are available."},{id:3,variant:"warning",message:"Warning: Your session will expire soon."}]),C=a=>{t(s.filter(Ur=>Ur.id!==a))};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[s.map(a=>e.jsx(r,{variant:a.variant,dismissible:!0,onClose:()=>C(a.id),children:a.message},a.id)),s.length===0&&e.jsx("p",{className:"text-muted",children:"All alerts dismissed. Refresh to see them again."})]})}},A={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(r,{variant:"success",icon:e.jsx("span",{style:{fontSize:"1.25rem"},children:"✓"}),children:"Your changes have been saved successfully."}),e.jsx(r,{variant:"danger",icon:e.jsx("span",{style:{fontSize:"1.25rem"},children:"✕"}),children:"An error occurred. Please try again."}),e.jsx(r,{variant:"warning",icon:e.jsx("span",{style:{fontSize:"1.25rem"},children:"⚠"}),children:"Please review your input before submitting."}),e.jsx(r,{variant:"info",icon:e.jsx("span",{style:{fontSize:"1.25rem"},children:"ℹ"}),children:"New features are available in this version."})]})},f={render:()=>e.jsx(Vr,{})},k={render:()=>e.jsx(zr,{})},j={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs(r,{variant:"success",children:[e.jsx("strong",{children:"✓ Safe:"})," ",e.jsx(r.Link,{href:"https://example.com",children:"HTTPS link"})]}),e.jsxs(r,{variant:"success",children:[e.jsx("strong",{children:"✓ Safe:"})," ",e.jsx(r.Link,{href:"/docs",children:"Relative link"})]}),e.jsxs(r,{variant:"success",children:[e.jsx("strong",{children:"✓ Safe:"})," ",e.jsx(r.Link,{href:"mailto:test@example.com",children:"Email link"})]}),e.jsxs(r,{variant:"danger",children:[e.jsx("strong",{children:"✗ Blocked:"})," ",e.jsx(r.Link,{href:"javascript:alert('XSS')",children:"javascript: protocol"})]}),e.jsxs(r,{variant:"danger",children:[e.jsx("strong",{children:"✗ Blocked:"})," ",e.jsx(r.Link,{href:"data:text/html,<script>",children:"data: protocol"})]})]})},S={render:()=>e.jsx(Xr,{})},w={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs(r,{variant:"danger","aria-atomic":!0,children:[e.jsx("strong",{children:"Critical:"}),' Uses role="alert" and aria-live="assertive" for immediate announcement.']}),e.jsxs(r,{variant:"warning","aria-atomic":!0,children:[e.jsx("strong",{children:"Warning:"}),' Uses role="alert" and aria-live="assertive".']}),e.jsxs(r,{variant:"success","aria-atomic":!0,children:[e.jsx("strong",{children:"Success:"}),' Uses role="status" and aria-live="polite" for non-urgent updates.']}),e.jsxs(r,{variant:"info","aria-atomic":!0,children:[e.jsx("strong",{children:"Info:"}),' Uses role="status" and aria-live="polite".']})]})},b={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs(r,{variant:"danger",children:[e.jsx(r.Heading,{as:"h5",children:"Please fix the following errors:"}),e.jsxs("ul",{className:"mb-0",children:[e.jsx("li",{children:"Email address is required"}),e.jsx("li",{children:"Password must be at least 8 characters"}),e.jsx("li",{children:"Please accept the terms and conditions"})]})]}),e.jsxs(r,{variant:"success",children:[e.jsx("strong",{children:"Form submitted successfully!"})," We'll be in touch soon."]})]})},L={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs(r,{variant:"info",children:[e.jsx("strong",{children:"Scheduled maintenance:"})," The system will be unavailable on Sunday from 2-4 AM EST."]}),e.jsxs(r,{variant:"warning",children:[e.jsx("strong",{children:"Session expiring:"})," Your session will expire in 5 minutes."," ",e.jsx(r.Link,{href:"#",children:"Extend session"})]}),e.jsxs(r,{variant:"danger",children:[e.jsx("strong",{children:"Connection lost:"})," Unable to connect to the server."," ",e.jsx(r.Link,{href:"#",children:"Retry"})]})]})},D={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(r,{variant:"primary",children:"A simple primary alert—check it out!"}),e.jsx(r,{variant:"secondary",children:"A simple secondary alert—check it out!"}),e.jsx(r,{variant:"success",children:"A simple success alert—check it out!"}),e.jsx(r,{variant:"danger",children:"A simple danger alert—check it out!"}),e.jsx(r,{variant:"warning",children:"A simple warning alert—check it out!"}),e.jsx(r,{variant:"info",children:"A simple info alert—check it out!"}),e.jsx(r,{variant:"light",children:"A simple light alert—check it out!"}),e.jsx(r,{variant:"dark",children:"A simple dark alert—check it out!"})]})},W={render:function(){const[s,t]=B.useState(!0);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Basic Variants"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(r,{variant:"primary",children:"Primary alert"}),e.jsx(r,{variant:"success",children:"Success alert"}),e.jsx(r,{variant:"danger",children:"Danger alert"}),e.jsx(r,{variant:"warning",children:"Warning alert"}),e.jsx(r,{variant:"info",children:"Info alert"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"With Heading"}),e.jsxs(r,{variant:"success",children:[e.jsx(r.Heading,{children:"Success!"}),e.jsx("p",{className:"mb-0",children:"Your operation completed successfully."})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"With Link"}),e.jsxs(r,{variant:"info",children:["Learn more in our ",e.jsx(r.Link,{href:"#",children:"documentation"}),"."]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Dismissible"}),s?e.jsx(r,{variant:"warning",dismissible:!0,onClose:()=>t(!1),children:"This alert can be dismissed."}):e.jsx(P,{size:"sm",onClick:()=>t(!0),children:"Show Alert"})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"With Icon"}),e.jsx(r,{variant:"success",icon:e.jsx("span",{children:"✓"}),children:"Operation completed successfully."})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Security Features"}),e.jsxs(r,{variant:"info",children:["Safe links:"," ",e.jsx(r.Link,{href:"https://example.com",target:"_blank",children:"external"})," ","and ",e.jsx(r.Link,{href:"/docs",children:"internal"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Accessibility"}),e.jsx(r,{variant:"success","aria-atomic":!0,children:"Complete alert content announced to screen readers with aria-atomic=true"})]})]})}};var E,H,T,R,N;n.parameters={...n.parameters,docs:{...(E=n.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'A simple primary alert—check it out!'
  }
}`,...(T=(H=n.parameters)==null?void 0:H.docs)==null?void 0:T.source},description:{story:"Primary alert - default variant",...(N=(R=n.parameters)==null?void 0:R.docs)==null?void 0:N.description}}};var I,Y,U,V,z;l.parameters={...l.parameters,docs:{...(I=l.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'A simple secondary alert—check it out!'
  }
}`,...(U=(Y=l.parameters)==null?void 0:Y.docs)==null?void 0:U.source},description:{story:"Secondary alert",...(z=(V=l.parameters)==null?void 0:V.docs)==null?void 0:z.description}}};var X,G,M,F,_;o.parameters={...o.parameters,docs:{...(X=o.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: 'A simple success alert—check it out!'
  }
}`,...(M=(G=o.parameters)==null?void 0:G.docs)==null?void 0:M.source},description:{story:"Success alert - use for positive feedback",...(_=(F=o.parameters)==null?void 0:F.docs)==null?void 0:_.description}}};var O,q,J,K,Q;c.parameters={...c.parameters,docs:{...(O=c.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    children: 'A simple danger alert—check it out!'
  }
}`,...(J=(q=c.parameters)==null?void 0:q.docs)==null?void 0:J.source},description:{story:"Danger alert - use for errors or critical messages",...(Q=(K=c.parameters)==null?void 0:K.docs)==null?void 0:Q.description}}};var Z,$,ee,re,se;d.parameters={...d.parameters,docs:{...(Z=d.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    children: 'A simple warning alert—check it out!'
  }
}`,...(ee=($=d.parameters)==null?void 0:$.docs)==null?void 0:ee.source},description:{story:"Warning alert - use for warnings or caution",...(se=(re=d.parameters)==null?void 0:re.docs)==null?void 0:se.description}}};var ie,te,ae,ne,le;m.parameters={...m.parameters,docs:{...(ie=m.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    children: 'A simple info alert—check it out!'
  }
}`,...(ae=(te=m.parameters)==null?void 0:te.docs)==null?void 0:ae.source},description:{story:"Info alert - use for informational content",...(le=(ne=m.parameters)==null?void 0:ne.docs)==null?void 0:le.description}}};var oe,ce,de,me,pe;p.parameters={...p.parameters,docs:{...(oe=p.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  args: {
    variant: 'light',
    children: 'A simple light alert—check it out!'
  }
}`,...(de=(ce=p.parameters)==null?void 0:ce.docs)==null?void 0:de.source},description:{story:"Light alert",...(pe=(me=p.parameters)==null?void 0:me.docs)==null?void 0:pe.description}}};var ue,he,ge,ve,xe;u.parameters={...u.parameters,docs:{...(ue=u.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  args: {
    variant: 'dark',
    children: 'A simple dark alert—check it out!'
  }
}`,...(ge=(he=u.parameters)==null?void 0:he.docs)==null?void 0:ge.source},description:{story:"Dark alert",...(xe=(ve=u.parameters)==null?void 0:ve.docs)==null?void 0:xe.description}}};var ye,Ae,fe,ke,je;h.parameters={...h.parameters,docs:{...(ye=h.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    title: 'Well done!',
    children: 'You successfully completed the task.'
  }
}`,...(fe=(Ae=h.parameters)==null?void 0:Ae.docs)==null?void 0:fe.source},description:{story:"Alert with title prop",...(je=(ke=h.parameters)==null?void 0:ke.docs)==null?void 0:je.description}}};var Se,we,be,Le,De;g.parameters={...g.parameters,docs:{...(Se=g.parameters)==null?void 0:Se.docs,source:{originalSource:`{
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
}`,...(be=(we=g.parameters)==null?void 0:we.docs)==null?void 0:be.source},description:{story:"Alert with Alert.Heading compound component",...(De=(Le=g.parameters)==null?void 0:Le.docs)==null?void 0:De.description}}};var We,Be,Ce,Pe,Ee;v.parameters={...v.parameters,docs:{...(We=v.parameters)==null?void 0:We.docs,source:{originalSource:`{
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
}`,...(Ce=(Be=v.parameters)==null?void 0:Be.docs)==null?void 0:Ce.source},description:{story:"Alert with Alert.Link",...(Ee=(Pe=v.parameters)==null?void 0:Pe.docs)==null?void 0:Ee.description}}};var He,Te,Re,Ne,Ie;x.parameters={...x.parameters,docs:{...(He=x.parameters)==null?void 0:He.docs,source:{originalSource:`{
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
}`,...(Re=(Te=x.parameters)==null?void 0:Te.docs)==null?void 0:Re.source},description:{story:"Dismissible alert with close button",...(Ie=(Ne=x.parameters)==null?void 0:Ne.docs)==null?void 0:Ie.description}}};var Ye,Ue,Ve,ze,Xe;y.parameters={...y.parameters,docs:{...(Ye=y.parameters)==null?void 0:Ye.docs,source:{originalSource:`{
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
}`,...(Ve=(Ue=y.parameters)==null?void 0:Ue.docs)==null?void 0:Ve.source},description:{story:"Multiple dismissible alerts",...(Xe=(ze=y.parameters)==null?void 0:ze.docs)==null?void 0:Xe.description}}};var Ge,Me,Fe,_e,Oe;A.parameters={...A.parameters,docs:{...(Ge=A.parameters)==null?void 0:Ge.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <Alert variant="success" icon={<span style={{
      fontSize: '1.25rem'
    }}>✓</span>}>
        Your changes have been saved successfully.
      </Alert>
      <Alert variant="danger" icon={<span style={{
      fontSize: '1.25rem'
    }}>✕</span>}>
        An error occurred. Please try again.
      </Alert>
      <Alert variant="warning" icon={<span style={{
      fontSize: '1.25rem'
    }}>⚠</span>}>
        Please review your input before submitting.
      </Alert>
      <Alert variant="info" icon={<span style={{
      fontSize: '1.25rem'
    }}>ℹ</span>}>
        New features are available in this version.
      </Alert>
    </div>
}`,...(Fe=(Me=A.parameters)==null?void 0:Me.docs)==null?void 0:Fe.source},description:{story:"Alert with custom icon",...(Oe=(_e=A.parameters)==null?void 0:_e.docs)==null?void 0:Oe.description}}};var qe,Je,Ke,Qe,Ze;f.parameters={...f.parameters,docs:{...(qe=f.parameters)==null?void 0:qe.docs,source:{originalSource:`{
  render: () => <SecureExternalLinkExample />
}`,...(Ke=(Je=f.parameters)==null?void 0:Je.docs)==null?void 0:Ke.source},description:{story:'Secure external links with automatic rel="noopener noreferrer"',...(Ze=(Qe=f.parameters)==null?void 0:Qe.docs)==null?void 0:Ze.description}}};var $e,er,rr,sr,ir;k.parameters={...k.parameters,docs:{...($e=k.parameters)==null?void 0:$e.docs,source:{originalSource:`{
  render: () => <XSSPreventionExample />
}`,...(rr=(er=k.parameters)==null?void 0:er.docs)==null?void 0:rr.source},description:{story:"XSS Protection - dangerous URLs are automatically blocked",...(ir=(sr=k.parameters)==null?void 0:sr.docs)==null?void 0:ir.description}}};var tr,ar,nr,lr,or;j.parameters={...j.parameters,docs:{...(tr=j.parameters)==null?void 0:tr.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <Alert variant="success">
        <strong>✓ Safe:</strong> <Alert.Link href="https://example.com">HTTPS link</Alert.Link>
      </Alert>
      <Alert variant="success">
        <strong>✓ Safe:</strong> <Alert.Link href="/docs">Relative link</Alert.Link>
      </Alert>
      <Alert variant="success">
        <strong>✓ Safe:</strong> <Alert.Link href="mailto:test@example.com">Email link</Alert.Link>
      </Alert>
      <Alert variant="danger">
        <strong>✗ Blocked:</strong>{' '}
        <Alert.Link href="javascript:alert('XSS')">javascript: protocol</Alert.Link>
      </Alert>
      <Alert variant="danger">
        <strong>✗ Blocked:</strong>{' '}
        <Alert.Link href="data:text/html,<script>">data: protocol</Alert.Link>
      </Alert>
    </div>
}`,...(nr=(ar=j.parameters)==null?void 0:ar.docs)==null?void 0:nr.source},description:{story:"Multiple security-hardened links",...(or=(lr=j.parameters)==null?void 0:lr.docs)==null?void 0:or.description}}};var cr,dr,mr,pr,ur;S.parameters={...S.parameters,docs:{...(cr=S.parameters)==null?void 0:cr.docs,source:{originalSource:`{
  render: () => <AriaAtomicExample />
}`,...(mr=(dr=S.parameters)==null?void 0:dr.docs)==null?void 0:mr.source},description:{story:"aria-atomic for complete announcements",...(ur=(pr=S.parameters)==null?void 0:pr.docs)==null?void 0:ur.description}}};var hr,gr,vr,xr,yr;w.parameters={...w.parameters,docs:{...(hr=w.parameters)==null?void 0:hr.docs,source:{originalSource:`{
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
}`,...(vr=(gr=w.parameters)==null?void 0:gr.docs)==null?void 0:vr.source},description:{story:"Alert with appropriate aria-live for severity",...(yr=(xr=w.parameters)==null?void 0:xr.docs)==null?void 0:yr.description}}};var Ar,fr,kr,jr,Sr;b.parameters={...b.parameters,docs:{...(Ar=b.parameters)==null?void 0:Ar.docs,source:{originalSource:`{
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
}`,...(kr=(fr=b.parameters)==null?void 0:fr.docs)==null?void 0:kr.source},description:{story:"Form validation alerts",...(Sr=(jr=b.parameters)==null?void 0:jr.docs)==null?void 0:Sr.description}}};var wr,br,Lr,Dr,Wr;L.parameters={...L.parameters,docs:{...(wr=L.parameters)==null?void 0:wr.docs,source:{originalSource:`{
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
}`,...(Lr=(br=L.parameters)==null?void 0:br.docs)==null?void 0:Lr.source},description:{story:"System notifications",...(Wr=(Dr=L.parameters)==null?void 0:Dr.docs)==null?void 0:Wr.description}}};var Br,Cr,Pr,Er,Hr;D.parameters={...D.parameters,docs:{...(Br=D.parameters)==null?void 0:Br.docs,source:{originalSource:`{
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
}`,...(Pr=(Cr=D.parameters)==null?void 0:Cr.docs)==null?void 0:Pr.source},description:{story:"All variants showcase",...(Hr=(Er=D.parameters)==null?void 0:Er.docs)==null?void 0:Hr.description}}};var Tr,Rr,Nr,Ir,Yr;W.parameters={...W.parameters,docs:{...(Tr=W.parameters)==null?void 0:Tr.docs,source:{originalSource:`{
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
          <Alert variant="success" icon={<span>✓</span>}>
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
}`,...(Nr=(Rr=W.parameters)==null?void 0:Rr.docs)==null?void 0:Nr.source},description:{story:"Complete alert showcase",...(Yr=(Ir=W.parameters)==null?void 0:Ir.docs)==null?void 0:Yr.description}}};const qr=["Primary","Secondary","Success","Danger","Warning","Info","Light","Dark","WithTitle","WithHeading","WithLink","Dismissible","MultipleDismissible","WithIcon","SecureExternalLinks","XSSPrevention","SecurityShowcase","AriaAtomic","AccessibilityRoles","FormValidation","SystemNotifications","AllVariants","CompleteShowcase"];export{w as AccessibilityRoles,D as AllVariants,S as AriaAtomic,W as CompleteShowcase,c as Danger,u as Dark,x as Dismissible,b as FormValidation,m as Info,p as Light,y as MultipleDismissible,n as Primary,l as Secondary,f as SecureExternalLinks,j as SecurityShowcase,o as Success,L as SystemNotifications,d as Warning,g as WithHeading,A as WithIcon,v as WithLink,h as WithTitle,k as XSSPrevention,qr as __namedExportsOrder,Or as default};
