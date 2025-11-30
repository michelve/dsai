import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{D as a,B as A,b as Ca}from"./Tabs-DTVVglNe.js";import{r as V}from"./iframe-CgsZvN4H.js";import"./preload-helper-Dp1pzeXC.js";const Ua={title:"Components/Progress",component:a,parameters:{layout:"padded",docs:{description:{component:"A Bootstrap 5 progress bar component for showing progress or loading states. Supports determinate (with value) and indeterminate (loading) modes, multiple variants, sizes, striped/animated patterns, and stacked bars."}}},tags:["autodocs"],argTypes:{value:{control:{type:"range",min:0,max:100,step:1},description:"Progress value (0-100)",table:{type:{summary:"number"},defaultValue:{summary:"0"}}},variant:{control:"select",options:["primary","secondary","success","danger","warning","info","dark"],description:"Progress bar color variant",table:{type:{summary:"ProgressVariant"},defaultValue:{summary:"primary"}}},size:{control:"select",options:["sm","md","lg"],description:"Progress bar height",table:{type:{summary:"ProgressSize"},defaultValue:{summary:"md"}}},label:{control:"text",description:"Label displayed above the progress bar",table:{type:{summary:"string"}}},showValue:{control:"boolean",description:"Show percentage value",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},indeterminate:{control:"boolean",description:"Indeterminate loading mode",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},striped:{control:"boolean",description:"Striped pattern",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},animated:{control:"boolean",description:"Animated stripes",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}}},i={args:{value:25,"aria-label":"Default progress"}},l={args:{value:0,"aria-label":"Empty progress"}},o={args:{value:100,"aria-label":"Complete progress"}},n={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(a,{value:20,variant:"primary","aria-label":"Primary"}),e.jsx(a,{value:35,variant:"secondary","aria-label":"Secondary"}),e.jsx(a,{value:50,variant:"success","aria-label":"Success"}),e.jsx(a,{value:65,variant:"danger","aria-label":"Danger"}),e.jsx(a,{value:80,variant:"warning","aria-label":"Warning"}),e.jsx(a,{value:90,variant:"info","aria-label":"Info"}),e.jsx(a,{value:100,variant:"dark","aria-label":"Dark"})]})},d={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("p",{className:"small text-muted mb-1",children:"Small (8px)"}),e.jsx(a,{value:50,size:"sm","aria-label":"Small progress"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"small text-muted mb-1",children:"Medium (16px) - Default"}),e.jsx(a,{value:50,size:"md","aria-label":"Medium progress"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"small text-muted mb-1",children:"Large (24px)"}),e.jsx(a,{value:50,size:"lg","aria-label":"Large progress"})]})]})},c={args:{value:65,label:"Uploading files...","aria-label":"File upload progress"}},u={args:{value:75,showValue:!0,"aria-label":"Progress with value"}},p={args:{value:45,label:"Processing...",showValue:!0,"aria-label":"Processing progress"}},m={args:{value:75,showValue:!0,valueText:"3 of 4 complete","aria-label":"Task progress"}},g={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("p",{className:"text-muted small",children:[e.jsx("code",{children:"min"})," and ",e.jsx("code",{children:"max"})," control ARIA semantics only. The visual width is always 0-100%."]}),e.jsxs("div",{children:[e.jsx("p",{className:"small mb-1",children:"Temperature: 15°C (min: 10°C, max: 20°C) - Visual: 15% width"}),e.jsx(a,{value:15,min:10,max:20,variant:"info","aria-label":"Temperature reading"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"small mb-1",children:"Steps: 3 of 5 complete - Visual: 60% width"}),e.jsx(a,{value:60,min:0,max:5,showValue:!0,valueText:"Step 3 of 5",variant:"primary","aria-label":"Wizard progress"})]})]})},v={args:{indeterminate:!0,"aria-label":"Loading"}},b={args:{indeterminate:!0,label:"Loading data...",variant:"info","aria-label":"Loading data"}},x={args:{value:60,striped:!0,"aria-label":"Striped progress"}},h={args:{value:60,striped:!0,animated:!0,"aria-label":"Animated progress"}},y={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(a,{value:20,variant:"primary",striped:!0,animated:!0,"aria-label":"Primary"}),e.jsx(a,{value:40,variant:"success",striped:!0,animated:!0,"aria-label":"Success"}),e.jsx(a,{value:60,variant:"warning",striped:!0,animated:!0,"aria-label":"Warning"}),e.jsx(a,{value:80,variant:"danger",striped:!0,animated:!0,"aria-label":"Danger"}),e.jsx(a,{value:100,variant:"info",striped:!0,animated:!0,"aria-label":"Info"})]})},f={render:()=>e.jsxs(a,{"aria-label":"Multi-part progress",children:[e.jsx(a.Bar,{value:15,variant:"success","aria-label":"Completed tasks"}),e.jsx(a.Bar,{value:30,variant:"warning","aria-label":"In progress tasks"}),e.jsx(a.Bar,{value:20,variant:"danger","aria-label":"Blocked tasks"})]})},P={render:()=>e.jsxs(a,{"aria-label":"Multi-part progress with values",children:[e.jsx(a.Bar,{value:15,variant:"success",showValue:!0,"aria-label":"Success portion"}),e.jsx(a.Bar,{value:30,variant:"warning",showValue:!0,"aria-label":"Warning portion"}),e.jsx(a.Bar,{value:20,variant:"danger",showValue:!0,"aria-label":"Danger portion"})]})},j={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("p",{className:"text-muted small",children:["Use ",e.jsx("code",{children:"aria-hidden"})," on Progress.Bar for purely decorative stacked bars where the parent provides the accessible label."]}),e.jsxs(a,{"aria-label":"Project status: 65% complete (15% done, 30% in progress, 20% blocked)",children:[e.jsx(a.Bar,{value:15,variant:"success","aria-hidden":!0}),e.jsx(a.Bar,{value:30,variant:"warning","aria-hidden":!0}),e.jsx(a.Bar,{value:20,variant:"danger","aria-hidden":!0})]})]})},S={render:function(){const[s,D]=V.useState(0);return V.useEffect(()=>{const r=setInterval(()=>{D(t=>t>=100?0:t+5)},500);return()=>clearInterval(r)},[]),e.jsx(a,{value:s,label:"Auto-incrementing progress",showValue:!0,variant:"success","aria-label":"Auto progress"})}},w={render:function(){const[s,D]=V.useState(0),[r,t]=V.useState("idle");V.useEffect(()=>{if(r==="uploading"&&s<100){const ka=setTimeout(()=>{D(Aa=>Math.min(Aa+Math.random()*15,100))},300);return()=>clearTimeout(ka)}else s>=100&&t("complete")},[r,s]);const k=()=>{D(0),t("uploading")};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[r==="idle"&&e.jsx(A,{variant:"primary",onClick:k,children:"Start Upload"}),r==="uploading"&&e.jsx(a,{value:Math.round(s),label:"Uploading document.pdf...",showValue:!0,variant:"primary",striped:!0,animated:!0,"aria-label":"File upload progress"}),r==="complete"&&e.jsxs("div",{className:"d-flex flex-column gap-2",children:[e.jsx(a,{value:100,variant:"success","aria-label":"Upload complete"}),e.jsxs("div",{className:"d-flex align-items-center gap-2",children:[e.jsx(Ca,{className:"text-success",size:16}),e.jsx("span",{children:"Upload complete!"}),e.jsx(A,{size:"sm",variant:"outline-primary",className:"ms-auto",onClick:k,children:"Upload Another"})]})]})]})}},B={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Basic Progress"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(a,{value:25,"aria-label":"25%"}),e.jsx(a,{value:50,"aria-label":"50%"}),e.jsx(a,{value:75,"aria-label":"75%"}),e.jsx(a,{value:100,"aria-label":"100%"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Color Variants"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(a,{value:50,variant:"primary","aria-label":"Primary"}),e.jsx(a,{value:50,variant:"success","aria-label":"Success"}),e.jsx(a,{value:50,variant:"warning","aria-label":"Warning"}),e.jsx(a,{value:50,variant:"danger","aria-label":"Danger"}),e.jsx(a,{value:50,variant:"info","aria-label":"Info"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"With Labels"}),e.jsx(a,{value:65,label:"Downloading update...",showValue:!0,variant:"info","aria-label":"Download progress"})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Striped & Animated"}),e.jsx(a,{value:75,striped:!0,animated:!0,variant:"success","aria-label":"Animated progress"})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Stacked Bars"}),e.jsxs(a,{"aria-label":"Multi-part progress",children:[e.jsx(a.Bar,{value:20,variant:"success"}),e.jsx(a.Bar,{value:15,variant:"warning"}),e.jsx(a.Bar,{value:10,variant:"danger"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Indeterminate (Loading)"}),e.jsx(a,{indeterminate:!0,variant:"primary","aria-label":"Loading"})]})]})};var C,I,L,W,N;i.parameters={...i.parameters,docs:{...(C=i.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    value: 25,
    'aria-label': 'Default progress'
  }
}`,...(L=(I=i.parameters)==null?void 0:I.docs)==null?void 0:L.source},description:{story:"Basic progress bar with 25% value",...(N=(W=i.parameters)==null?void 0:W.docs)==null?void 0:N.description}}};var U,M,T,z,E;l.parameters={...l.parameters,docs:{...(U=l.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    value: 0,
    'aria-label': 'Empty progress'
  }
}`,...(T=(M=l.parameters)==null?void 0:M.docs)==null?void 0:T.source},description:{story:"Progress bar at 0%",...(E=(z=l.parameters)==null?void 0:z.docs)==null?void 0:E.description}}};var F,R,_,O,q;o.parameters={...o.parameters,docs:{...(F=o.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    value: 100,
    'aria-label': 'Complete progress'
  }
}`,...(_=(R=o.parameters)==null?void 0:R.docs)==null?void 0:_.source},description:{story:"Progress bar at 100%",...(q=(O=o.parameters)==null?void 0:O.docs)==null?void 0:q.description}}};var G,H,J,K,Q;n.parameters={...n.parameters,docs:{...(G=n.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <Progress value={20} variant="primary" aria-label="Primary" />
      <Progress value={35} variant="secondary" aria-label="Secondary" />
      <Progress value={50} variant="success" aria-label="Success" />
      <Progress value={65} variant="danger" aria-label="Danger" />
      <Progress value={80} variant="warning" aria-label="Warning" />
      <Progress value={90} variant="info" aria-label="Info" />
      <Progress value={100} variant="dark" aria-label="Dark" />
    </div>
}`,...(J=(H=n.parameters)==null?void 0:H.docs)==null?void 0:J.source},description:{story:"All color variants",...(Q=(K=n.parameters)==null?void 0:K.docs)==null?void 0:Q.description}}};var X,Y,Z,$,ee;d.parameters={...d.parameters,docs:{...(X=d.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <div>
        <p className="small text-muted mb-1">Small (8px)</p>
        <Progress value={50} size="sm" aria-label="Small progress" />
      </div>
      <div>
        <p className="small text-muted mb-1">Medium (16px) - Default</p>
        <Progress value={50} size="md" aria-label="Medium progress" />
      </div>
      <div>
        <p className="small text-muted mb-1">Large (24px)</p>
        <Progress value={50} size="lg" aria-label="Large progress" />
      </div>
    </div>
}`,...(Z=(Y=d.parameters)==null?void 0:Y.docs)==null?void 0:Z.source},description:{story:"Different progress bar sizes",...(ee=($=d.parameters)==null?void 0:$.docs)==null?void 0:ee.description}}};var ae,re,se,te,ie;c.parameters={...c.parameters,docs:{...(ae=c.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  args: {
    value: 65,
    label: 'Uploading files...',
    'aria-label': 'File upload progress'
  }
}`,...(se=(re=c.parameters)==null?void 0:re.docs)==null?void 0:se.source},description:{story:"Progress bar with label",...(ie=(te=c.parameters)==null?void 0:te.docs)==null?void 0:ie.description}}};var le,oe,ne,de,ce;u.parameters={...u.parameters,docs:{...(le=u.parameters)==null?void 0:le.docs,source:{originalSource:`{
  args: {
    value: 75,
    showValue: true,
    'aria-label': 'Progress with value'
  }
}`,...(ne=(oe=u.parameters)==null?void 0:oe.docs)==null?void 0:ne.source},description:{story:"Progress bar showing percentage value",...(ce=(de=u.parameters)==null?void 0:de.docs)==null?void 0:ce.description}}};var ue,pe,me,ge,ve;p.parameters={...p.parameters,docs:{...(ue=p.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  args: {
    value: 45,
    label: 'Processing...',
    showValue: true,
    'aria-label': 'Processing progress'
  }
}`,...(me=(pe=p.parameters)==null?void 0:pe.docs)==null?void 0:me.source},description:{story:"Progress bar with label and value",...(ve=(ge=p.parameters)==null?void 0:ge.docs)==null?void 0:ve.description}}};var be,xe,he,ye,fe;m.parameters={...m.parameters,docs:{...(be=m.parameters)==null?void 0:be.docs,source:{originalSource:`{
  args: {
    value: 75,
    showValue: true,
    valueText: '3 of 4 complete',
    'aria-label': 'Task progress'
  }
}`,...(he=(xe=m.parameters)==null?void 0:xe.docs)==null?void 0:he.source},description:{story:"Progress bar with custom value text",...(fe=(ye=m.parameters)==null?void 0:ye.docs)==null?void 0:fe.description}}};var Pe,je,Se,we,Be;g.parameters={...g.parameters,docs:{...(Pe=g.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <p className="text-muted small">
        <code>min</code> and <code>max</code> control ARIA semantics only. The visual width is
        always 0-100%.
      </p>
      <div>
        <p className="small mb-1">Temperature: 15°C (min: 10°C, max: 20°C) - Visual: 15% width</p>
        <Progress value={15} min={10} max={20} variant="info" aria-label="Temperature reading" />
      </div>
      <div>
        <p className="small mb-1">Steps: 3 of 5 complete - Visual: 60% width</p>
        <Progress value={60} min={0} max={5} showValue valueText="Step 3 of 5" variant="primary" aria-label="Wizard progress" />
      </div>
    </div>
}`,...(Se=(je=g.parameters)==null?void 0:je.docs)==null?void 0:Se.source},description:{story:"Custom min/max for ARIA semantics.\n\n**Note:** `min` and `max` control ARIA semantics only, not the visual range.\nThe visual width is always calculated as a percentage (0-100).\n\nFor example, with `min=10, max=20, value=15`:\n- Visual width = 15% (value is used directly as percentage)\n- `aria-valuenow=15`, `aria-valuemin=10`, `aria-valuemax=20`",...(Be=(we=g.parameters)==null?void 0:we.docs)==null?void 0:Be.description}}};var Ve,De,ke,Ae,Ce;v.parameters={...v.parameters,docs:{...(Ve=v.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  args: {
    indeterminate: true,
    'aria-label': 'Loading'
  }
}`,...(ke=(De=v.parameters)==null?void 0:De.docs)==null?void 0:ke.source},description:{story:"Indeterminate loading state",...(Ce=(Ae=v.parameters)==null?void 0:Ae.docs)==null?void 0:Ce.description}}};var Ie,Le,We,Ne,Ue;b.parameters={...b.parameters,docs:{...(Ie=b.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  args: {
    indeterminate: true,
    label: 'Loading data...',
    variant: 'info',
    'aria-label': 'Loading data'
  }
}`,...(We=(Le=b.parameters)==null?void 0:Le.docs)==null?void 0:We.source},description:{story:"Indeterminate with label",...(Ue=(Ne=b.parameters)==null?void 0:Ne.docs)==null?void 0:Ue.description}}};var Me,Te,ze,Ee,Fe;x.parameters={...x.parameters,docs:{...(Me=x.parameters)==null?void 0:Me.docs,source:{originalSource:`{
  args: {
    value: 60,
    striped: true,
    'aria-label': 'Striped progress'
  }
}`,...(ze=(Te=x.parameters)==null?void 0:Te.docs)==null?void 0:ze.source},description:{story:"Striped progress bar",...(Fe=(Ee=x.parameters)==null?void 0:Ee.docs)==null?void 0:Fe.description}}};var Re,_e,Oe,qe,Ge;h.parameters={...h.parameters,docs:{...(Re=h.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  args: {
    value: 60,
    striped: true,
    animated: true,
    'aria-label': 'Animated progress'
  }
}`,...(Oe=(_e=h.parameters)==null?void 0:_e.docs)==null?void 0:Oe.source},description:{story:"Animated striped progress bar",...(Ge=(qe=h.parameters)==null?void 0:qe.docs)==null?void 0:Ge.description}}};var He,Je,Ke,Qe,Xe;y.parameters={...y.parameters,docs:{...(He=y.parameters)==null?void 0:He.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <Progress value={20} variant="primary" striped animated aria-label="Primary" />
      <Progress value={40} variant="success" striped animated aria-label="Success" />
      <Progress value={60} variant="warning" striped animated aria-label="Warning" />
      <Progress value={80} variant="danger" striped animated aria-label="Danger" />
      <Progress value={100} variant="info" striped animated aria-label="Info" />
    </div>
}`,...(Ke=(Je=y.parameters)==null?void 0:Je.docs)==null?void 0:Ke.source},description:{story:"All striped variants",...(Xe=(Qe=y.parameters)==null?void 0:Qe.docs)==null?void 0:Xe.description}}};var Ye,Ze,$e,ea,aa;f.parameters={...f.parameters,docs:{...(Ye=f.parameters)==null?void 0:Ye.docs,source:{originalSource:`{
  render: () => <Progress aria-label="Multi-part progress">
      <Progress.Bar value={15} variant="success" aria-label="Completed tasks" />
      <Progress.Bar value={30} variant="warning" aria-label="In progress tasks" />
      <Progress.Bar value={20} variant="danger" aria-label="Blocked tasks" />
    </Progress>
}`,...($e=(Ze=f.parameters)==null?void 0:Ze.docs)==null?void 0:$e.source},description:{story:"Multiple stacked progress bars",...(aa=(ea=f.parameters)==null?void 0:ea.docs)==null?void 0:aa.description}}};var ra,sa,ta,ia,la;P.parameters={...P.parameters,docs:{...(ra=P.parameters)==null?void 0:ra.docs,source:{originalSource:`{
  render: () => <Progress aria-label="Multi-part progress with values">
      <Progress.Bar value={15} variant="success" showValue aria-label="Success portion" />
      <Progress.Bar value={30} variant="warning" showValue aria-label="Warning portion" />
      <Progress.Bar value={20} variant="danger" showValue aria-label="Danger portion" />
    </Progress>
}`,...(ta=(sa=P.parameters)==null?void 0:sa.docs)==null?void 0:ta.source},description:{story:"Stacked with values shown",...(la=(ia=P.parameters)==null?void 0:ia.docs)==null?void 0:la.description}}};var oa,na,da,ca,ua;j.parameters={...j.parameters,docs:{...(oa=j.parameters)==null?void 0:oa.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
      <p className="text-muted small">
        Use <code>aria-hidden</code> on Progress.Bar for purely decorative stacked bars where the
        parent provides the accessible label.
      </p>
      <Progress aria-label="Project status: 65% complete (15% done, 30% in progress, 20% blocked)">
        <Progress.Bar value={15} variant="success" aria-hidden />
        <Progress.Bar value={30} variant="warning" aria-hidden />
        <Progress.Bar value={20} variant="danger" aria-hidden />
      </Progress>
    </div>
}`,...(da=(na=j.parameters)==null?void 0:na.docs)==null?void 0:da.source},description:{story:`Decorative stacked bars using aria-hidden.
When the parent Progress provides the full accessible description,
individual bars can be marked as decorative to avoid repetitive announcements.`,...(ua=(ca=j.parameters)==null?void 0:ca.docs)==null?void 0:ua.description}}};var pa,ma,ga,va,ba;S.parameters={...S.parameters,docs:{...(pa=S.parameters)==null?void 0:pa.docs,source:{originalSource:`{
  render: function AnimatedProgressRender() {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 5;
        });
      }, 500);
      return () => clearInterval(interval);
    }, []);
    return <Progress value={progress} label="Auto-incrementing progress" showValue variant="success" aria-label="Auto progress" />;
  }
}`,...(ga=(ma=S.parameters)==null?void 0:ma.docs)==null?void 0:ga.source},description:{story:"Animated progress simulation",...(ba=(va=S.parameters)==null?void 0:va.docs)==null?void 0:ba.description}}};var xa,ha,ya,fa,Pa;w.parameters={...w.parameters,docs:{...(xa=w.parameters)==null?void 0:xa.docs,source:{originalSource:`{
  render: function FileUploadRender() {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'complete'>('idle');
    useEffect(() => {
      if (status === 'uploading' && progress < 100) {
        const timeout = setTimeout(() => {
          setProgress(prev => Math.min(prev + Math.random() * 15, 100));
        }, 300);
        return () => clearTimeout(timeout);
      } else if (progress >= 100) {
        setStatus('complete');
      }
    }, [status, progress]);
    const startUpload = () => {
      setProgress(0);
      setStatus('uploading');
    };
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
        {status === 'idle' && <Button variant="primary" onClick={startUpload}>
            Start Upload
          </Button>}

        {status === 'uploading' && <Progress value={Math.round(progress)} label="Uploading document.pdf..." showValue variant="primary" striped animated aria-label="File upload progress" />}

        {status === 'complete' && <div className="d-flex flex-column gap-2">
            <Progress value={100} variant="success" aria-label="Upload complete" />
            <div className="d-flex align-items-center gap-2">
              <CheckIcon className="text-success" size={16} />
              <span>Upload complete!</span>
              <Button size="sm" variant="outline-primary" className="ms-auto" onClick={startUpload}>
                Upload Another
              </Button>
            </div>
          </div>}
      </div>;
  }
}`,...(ya=(ha=w.parameters)==null?void 0:ha.docs)==null?void 0:ya.source},description:{story:"File upload simulation",...(Pa=(fa=w.parameters)==null?void 0:fa.docs)==null?void 0:Pa.description}}};var ja,Sa,wa,Ba,Va;B.parameters={...B.parameters,docs:{...(ja=B.parameters)==null?void 0:ja.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }}>
      {/* Basic */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>Basic Progress</h4>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
          <Progress value={25} aria-label="25%" />
          <Progress value={50} aria-label="50%" />
          <Progress value={75} aria-label="75%" />
          <Progress value={100} aria-label="100%" />
        </div>
      </div>

      {/* Variants */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>Color Variants</h4>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
          <Progress value={50} variant="primary" aria-label="Primary" />
          <Progress value={50} variant="success" aria-label="Success" />
          <Progress value={50} variant="warning" aria-label="Warning" />
          <Progress value={50} variant="danger" aria-label="Danger" />
          <Progress value={50} variant="info" aria-label="Info" />
        </div>
      </div>

      {/* With Labels */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>With Labels</h4>
        <Progress value={65} label="Downloading update..." showValue variant="info" aria-label="Download progress" />
      </div>

      {/* Striped & Animated */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>Striped & Animated</h4>
        <Progress value={75} striped animated variant="success" aria-label="Animated progress" />
      </div>

      {/* Stacked */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>Stacked Bars</h4>
        <Progress aria-label="Multi-part progress">
          <Progress.Bar value={20} variant="success" />
          <Progress.Bar value={15} variant="warning" />
          <Progress.Bar value={10} variant="danger" />
        </Progress>
      </div>

      {/* Indeterminate */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>Indeterminate (Loading)</h4>
        <Progress indeterminate variant="primary" aria-label="Loading" />
      </div>
    </div>
}`,...(wa=(Sa=B.parameters)==null?void 0:Sa.docs)==null?void 0:wa.source},description:{story:"Complete progress bar showcase",...(Va=(Ba=B.parameters)==null?void 0:Ba.docs)==null?void 0:Va.description}}};const Ma=["Default","Empty","Complete","Variants","Sizes","WithLabel","WithValue","WithLabelAndValue","CustomValueText","CustomMinMax","Indeterminate","IndeterminateWithLabel","Striped","Animated","StripedVariants","Stacked","StackedWithValues","DecorativeStackedBars","AnimatedProgress","FileUploadSimulation","CompleteShowcase"];export{h as Animated,S as AnimatedProgress,o as Complete,B as CompleteShowcase,g as CustomMinMax,m as CustomValueText,j as DecorativeStackedBars,i as Default,l as Empty,w as FileUploadSimulation,v as Indeterminate,b as IndeterminateWithLabel,d as Sizes,f as Stacked,P as StackedWithValues,x as Striped,y as StripedVariants,n as Variants,c as WithLabel,p as WithLabelAndValue,u as WithValue,Ma as __namedExportsOrder,Ua as default};
