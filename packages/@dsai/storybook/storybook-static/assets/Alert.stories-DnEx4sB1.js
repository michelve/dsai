import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as j}from"./iframe-DkN6Y3DY.js";import{A as r,B as lr}from"./Progress-n23qFfnJ.js";import"./preload-helper-Dp1pzeXC.js";const hr={title:"Components/Alert",component:r,parameters:{layout:"padded",docs:{description:{component:"A Bootstrap 5 alert component for displaying important messages. Supports 8 color variants, dismissible functionality, compound components (Alert.Link, Alert.Heading), and proper ARIA attributes for accessibility."}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","success","danger","warning","info","light","dark"],description:"Alert color variant",table:{type:{summary:"AlertVariant"},defaultValue:{summary:"primary"}}},title:{control:"text",description:"Optional alert title",table:{type:{summary:"string"}}},dismissible:{control:"boolean",description:"Whether the alert can be dismissed",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},show:{control:"boolean",description:"Control alert visibility",table:{type:{summary:"boolean"},defaultValue:{summary:"true"}}},children:{control:"text",description:"Alert content",table:{type:{summary:"ReactNode"}}}}},a={args:{variant:"primary",children:"A simple primary alert—check it out!"}},n={args:{variant:"secondary",children:"A simple secondary alert—check it out!"}},l={args:{variant:"success",children:"A simple success alert—check it out!"}},o={args:{variant:"danger",children:"A simple danger alert—check it out!"}},c={args:{variant:"warning",children:"A simple warning alert—check it out!"}},d={args:{variant:"info",children:"A simple info alert—check it out!"}},m={args:{variant:"light",children:"A simple light alert—check it out!"}},p={args:{variant:"dark",children:"A simple dark alert—check it out!"}},u={args:{variant:"success",title:"Well done!",children:"You successfully completed the task."}},h={render:()=>e.jsxs(r,{variant:"success",children:[e.jsx(r.Heading,{children:"Well done!"}),e.jsx("p",{children:"Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content."}),e.jsx("hr",{}),e.jsx("p",{className:"mb-0",children:"Whenever you need to, be sure to use margin utilities to keep things nice and tidy."})]})},g={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs(r,{variant:"primary",children:["A simple primary alert with ",e.jsx(r.Link,{href:"#",children:"an example link"}),". Give it a click if you like."]}),e.jsxs(r,{variant:"secondary",children:["A simple secondary alert with ",e.jsx(r.Link,{href:"#",children:"an example link"}),". Give it a click if you like."]}),e.jsxs(r,{variant:"success",children:["A simple success alert with ",e.jsx(r.Link,{href:"#",children:"an example link"}),". Give it a click if you like."]}),e.jsxs(r,{variant:"danger",children:["A simple danger alert with ",e.jsx(r.Link,{href:"#",children:"an example link"}),". Give it a click if you like."]})]})},y={render:function(){const[s,i]=j.useState(!0);return s?e.jsxs(r,{variant:"warning",dismissible:!0,onClose:()=>i(!1),children:[e.jsx("strong",{children:"Holy guacamole!"})," You should check in on some of those fields below."]}):e.jsx(lr,{variant:"primary",onClick:()=>i(!0),children:"Show Alert"})}},v={render:function(){const[s,i]=j.useState([{id:1,variant:"success",message:"Success! Your changes have been saved."},{id:2,variant:"info",message:"Info: New features are available."},{id:3,variant:"warning",message:"Warning: Your session will expire soon."}]),or=t=>{i(s.filter(cr=>cr.id!==t))};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[s.map(t=>e.jsx(r,{variant:t.variant,dismissible:!0,onClose:()=>or(t.id),children:t.message},t.id)),s.length===0&&e.jsx("p",{className:"text-muted",children:"All alerts dismissed. Refresh to see them again."})]})}},A={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(r,{variant:"success",icon:e.jsx("span",{style:{fontSize:"1.25rem"},children:"✓"}),children:"Your changes have been saved successfully."}),e.jsx(r,{variant:"danger",icon:e.jsx("span",{style:{fontSize:"1.25rem"},children:"✕"}),children:"An error occurred. Please try again."}),e.jsx(r,{variant:"warning",icon:e.jsx("span",{style:{fontSize:"1.25rem"},children:"⚠"}),children:"Please review your input before submitting."}),e.jsx(r,{variant:"info",icon:e.jsx("span",{style:{fontSize:"1.25rem"},children:"ℹ"}),children:"New features are available in this version."})]})},f={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs(r,{variant:"danger",children:[e.jsx(r.Heading,{as:"h5",children:"Please fix the following errors:"}),e.jsxs("ul",{className:"mb-0",children:[e.jsx("li",{children:"Email address is required"}),e.jsx("li",{children:"Password must be at least 8 characters"}),e.jsx("li",{children:"Please accept the terms and conditions"})]})]}),e.jsxs(r,{variant:"success",children:[e.jsx("strong",{children:"Form submitted successfully!"})," We'll be in touch soon."]})]})},x={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs(r,{variant:"info",children:[e.jsx("strong",{children:"Scheduled maintenance:"})," The system will be unavailable on Sunday from 2-4 AM EST."]}),e.jsxs(r,{variant:"warning",children:[e.jsx("strong",{children:"Session expiring:"})," Your session will expire in 5 minutes."," ",e.jsx(r.Link,{href:"#",children:"Extend session"})]}),e.jsxs(r,{variant:"danger",children:[e.jsx("strong",{children:"Connection lost:"})," Unable to connect to the server."," ",e.jsx(r.Link,{href:"#",children:"Retry"})]})]})},k={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(r,{variant:"primary",children:"A simple primary alert—check it out!"}),e.jsx(r,{variant:"secondary",children:"A simple secondary alert—check it out!"}),e.jsx(r,{variant:"success",children:"A simple success alert—check it out!"}),e.jsx(r,{variant:"danger",children:"A simple danger alert—check it out!"}),e.jsx(r,{variant:"warning",children:"A simple warning alert—check it out!"}),e.jsx(r,{variant:"info",children:"A simple info alert—check it out!"}),e.jsx(r,{variant:"light",children:"A simple light alert—check it out!"}),e.jsx(r,{variant:"dark",children:"A simple dark alert—check it out!"})]})},w={render:function(){const[s,i]=j.useState(!0);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Basic Variants"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(r,{variant:"primary",children:"Primary alert"}),e.jsx(r,{variant:"success",children:"Success alert"}),e.jsx(r,{variant:"danger",children:"Danger alert"}),e.jsx(r,{variant:"warning",children:"Warning alert"}),e.jsx(r,{variant:"info",children:"Info alert"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"With Heading"}),e.jsxs(r,{variant:"success",children:[e.jsx(r.Heading,{children:"Success!"}),e.jsx("p",{className:"mb-0",children:"Your operation completed successfully."})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"With Link"}),e.jsxs(r,{variant:"info",children:["Learn more in our ",e.jsx(r.Link,{href:"#",children:"documentation"}),"."]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Dismissible"}),s?e.jsx(r,{variant:"warning",dismissible:!0,onClose:()=>i(!1),children:"This alert can be dismissed."}):e.jsx(lr,{size:"sm",onClick:()=>i(!0),children:"Show Alert"})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"With Icon"}),e.jsx(r,{variant:"success",icon:e.jsx("span",{children:"✓"}),children:"Operation completed successfully."})]})]})}};var S,D,L,W,B;a.parameters={...a.parameters,docs:{...(S=a.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'A simple primary alert—check it out!'
  }
}`,...(L=(D=a.parameters)==null?void 0:D.docs)==null?void 0:L.source},description:{story:"Primary alert - default variant",...(B=(W=a.parameters)==null?void 0:W.docs)==null?void 0:B.description}}};var C,H,N,P,Y;n.parameters={...n.parameters,docs:{...(C=n.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'A simple secondary alert—check it out!'
  }
}`,...(N=(H=n.parameters)==null?void 0:H.docs)==null?void 0:N.source},description:{story:"Secondary alert",...(Y=(P=n.parameters)==null?void 0:P.docs)==null?void 0:Y.description}}};var I,T,V,z,E;l.parameters={...l.parameters,docs:{...(I=l.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: 'A simple success alert—check it out!'
  }
}`,...(V=(T=l.parameters)==null?void 0:T.docs)==null?void 0:V.source},description:{story:"Success alert - use for positive feedback",...(E=(z=l.parameters)==null?void 0:z.docs)==null?void 0:E.description}}};var R,G,M,F,O;o.parameters={...o.parameters,docs:{...(R=o.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    children: 'A simple danger alert—check it out!'
  }
}`,...(M=(G=o.parameters)==null?void 0:G.docs)==null?void 0:M.source},description:{story:"Danger alert - use for errors or critical messages",...(O=(F=o.parameters)==null?void 0:F.docs)==null?void 0:O.description}}};var q,U,_,J,K;c.parameters={...c.parameters,docs:{...(q=c.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    children: 'A simple warning alert—check it out!'
  }
}`,...(_=(U=c.parameters)==null?void 0:U.docs)==null?void 0:_.source},description:{story:"Warning alert - use for warnings or caution",...(K=(J=c.parameters)==null?void 0:J.docs)==null?void 0:K.description}}};var Q,X,Z,$,ee;d.parameters={...d.parameters,docs:{...(Q=d.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    children: 'A simple info alert—check it out!'
  }
}`,...(Z=(X=d.parameters)==null?void 0:X.docs)==null?void 0:Z.source},description:{story:"Info alert - use for informational content",...(ee=($=d.parameters)==null?void 0:$.docs)==null?void 0:ee.description}}};var re,se,ie,te,ae;m.parameters={...m.parameters,docs:{...(re=m.parameters)==null?void 0:re.docs,source:{originalSource:`{
  args: {
    variant: 'light',
    children: 'A simple light alert—check it out!'
  }
}`,...(ie=(se=m.parameters)==null?void 0:se.docs)==null?void 0:ie.source},description:{story:"Light alert",...(ae=(te=m.parameters)==null?void 0:te.docs)==null?void 0:ae.description}}};var ne,le,oe,ce,de;p.parameters={...p.parameters,docs:{...(ne=p.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    variant: 'dark',
    children: 'A simple dark alert—check it out!'
  }
}`,...(oe=(le=p.parameters)==null?void 0:le.docs)==null?void 0:oe.source},description:{story:"Dark alert",...(de=(ce=p.parameters)==null?void 0:ce.docs)==null?void 0:de.description}}};var me,pe,ue,he,ge;u.parameters={...u.parameters,docs:{...(me=u.parameters)==null?void 0:me.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    title: 'Well done!',
    children: 'You successfully completed the task.'
  }
}`,...(ue=(pe=u.parameters)==null?void 0:pe.docs)==null?void 0:ue.source},description:{story:"Alert with title prop",...(ge=(he=u.parameters)==null?void 0:he.docs)==null?void 0:ge.description}}};var ye,ve,Ae,fe,xe;h.parameters={...h.parameters,docs:{...(ye=h.parameters)==null?void 0:ye.docs,source:{originalSource:`{
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
}`,...(Ae=(ve=h.parameters)==null?void 0:ve.docs)==null?void 0:Ae.source},description:{story:"Alert with Alert.Heading compound component",...(xe=(fe=h.parameters)==null?void 0:fe.docs)==null?void 0:xe.description}}};var ke,we,je,be,Se;g.parameters={...g.parameters,docs:{...(ke=g.parameters)==null?void 0:ke.docs,source:{originalSource:`{
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
}`,...(je=(we=g.parameters)==null?void 0:we.docs)==null?void 0:je.source},description:{story:"Alert with Alert.Link",...(Se=(be=g.parameters)==null?void 0:be.docs)==null?void 0:Se.description}}};var De,Le,We,Be,Ce;y.parameters={...y.parameters,docs:{...(De=y.parameters)==null?void 0:De.docs,source:{originalSource:`{
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
}`,...(We=(Le=y.parameters)==null?void 0:Le.docs)==null?void 0:We.source},description:{story:"Dismissible alert with close button",...(Ce=(Be=y.parameters)==null?void 0:Be.docs)==null?void 0:Ce.description}}};var He,Ne,Pe,Ye,Ie;v.parameters={...v.parameters,docs:{...(He=v.parameters)==null?void 0:He.docs,source:{originalSource:`{
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
}`,...(Pe=(Ne=v.parameters)==null?void 0:Ne.docs)==null?void 0:Pe.source},description:{story:"Multiple dismissible alerts",...(Ie=(Ye=v.parameters)==null?void 0:Ye.docs)==null?void 0:Ie.description}}};var Te,Ve,ze,Ee,Re;A.parameters={...A.parameters,docs:{...(Te=A.parameters)==null?void 0:Te.docs,source:{originalSource:`{
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
}`,...(ze=(Ve=A.parameters)==null?void 0:Ve.docs)==null?void 0:ze.source},description:{story:"Alert with custom icon",...(Re=(Ee=A.parameters)==null?void 0:Ee.docs)==null?void 0:Re.description}}};var Ge,Me,Fe,Oe,qe;f.parameters={...f.parameters,docs:{...(Ge=f.parameters)==null?void 0:Ge.docs,source:{originalSource:`{
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
}`,...(Fe=(Me=f.parameters)==null?void 0:Me.docs)==null?void 0:Fe.source},description:{story:"Form validation alerts",...(qe=(Oe=f.parameters)==null?void 0:Oe.docs)==null?void 0:qe.description}}};var Ue,_e,Je,Ke,Qe;x.parameters={...x.parameters,docs:{...(Ue=x.parameters)==null?void 0:Ue.docs,source:{originalSource:`{
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
}`,...(Je=(_e=x.parameters)==null?void 0:_e.docs)==null?void 0:Je.source},description:{story:"System notifications",...(Qe=(Ke=x.parameters)==null?void 0:Ke.docs)==null?void 0:Qe.description}}};var Xe,Ze,$e,er,rr;k.parameters={...k.parameters,docs:{...(Xe=k.parameters)==null?void 0:Xe.docs,source:{originalSource:`{
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
}`,...($e=(Ze=k.parameters)==null?void 0:Ze.docs)==null?void 0:$e.source},description:{story:"All variants showcase",...(rr=(er=k.parameters)==null?void 0:er.docs)==null?void 0:rr.description}}};var sr,ir,tr,ar,nr;w.parameters={...w.parameters,docs:{...(sr=w.parameters)==null?void 0:sr.docs,source:{originalSource:`{
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
      </div>;
  }
}`,...(tr=(ir=w.parameters)==null?void 0:ir.docs)==null?void 0:tr.source},description:{story:"Complete alert showcase",...(nr=(ar=w.parameters)==null?void 0:ar.docs)==null?void 0:nr.description}}};const gr=["Primary","Secondary","Success","Danger","Warning","Info","Light","Dark","WithTitle","WithHeading","WithLink","Dismissible","MultipleDismissible","WithIcon","FormValidation","SystemNotifications","AllVariants","CompleteShowcase"];export{k as AllVariants,w as CompleteShowcase,o as Danger,p as Dark,y as Dismissible,f as FormValidation,d as Info,m as Light,v as MultipleDismissible,a as Primary,n as Secondary,l as Success,x as SystemNotifications,c as Warning,h as WithHeading,A as WithIcon,g as WithLink,u as WithTitle,gr as __namedExportsOrder,hr as default};
