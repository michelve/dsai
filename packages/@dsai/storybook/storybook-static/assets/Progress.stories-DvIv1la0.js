import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as w}from"./iframe-BNA8zzi1.js";import{P as a}from"./Tabs-B3lUOMiJ.js";import"./preload-helper-Dp1pzeXC.js";const Pa={title:"Components/Progress",component:a,parameters:{layout:"padded",docs:{description:{component:"A Bootstrap 5 progress bar component for showing progress or loading states. Supports determinate (with value) and indeterminate (loading) modes, multiple variants, sizes, striped/animated patterns, and stacked bars."}}},tags:["autodocs"],argTypes:{value:{control:{type:"range",min:0,max:100,step:1},description:"Progress value (0-100)",table:{type:{summary:"number"},defaultValue:{summary:"0"}}},variant:{control:"select",options:["primary","secondary","success","danger","warning","info","dark"],description:"Progress bar color variant",table:{type:{summary:"ProgressVariant"},defaultValue:{summary:"primary"}}},size:{control:"select",options:["sm","md","lg"],description:"Progress bar height",table:{type:{summary:"ProgressSize"},defaultValue:{summary:"md"}}},label:{control:"text",description:"Label displayed above the progress bar",table:{type:{summary:"string"}}},showValue:{control:"boolean",description:"Show percentage value",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},indeterminate:{control:"boolean",description:"Indeterminate loading mode",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},striped:{control:"boolean",description:"Striped pattern",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},animated:{control:"boolean",description:"Animated stripes",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}}},i={args:{value:25,"aria-label":"Default progress"}},l={args:{value:0,"aria-label":"Empty progress"}},o={args:{value:100,"aria-label":"Complete progress"}},n={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(a,{value:20,variant:"primary","aria-label":"Primary"}),e.jsx(a,{value:35,variant:"secondary","aria-label":"Secondary"}),e.jsx(a,{value:50,variant:"success","aria-label":"Success"}),e.jsx(a,{value:65,variant:"danger","aria-label":"Danger"}),e.jsx(a,{value:80,variant:"warning","aria-label":"Warning"}),e.jsx(a,{value:90,variant:"info","aria-label":"Info"}),e.jsx(a,{value:100,variant:"dark","aria-label":"Dark"})]})},d={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("p",{className:"small text-muted mb-1",children:"Small (8px)"}),e.jsx(a,{value:50,size:"sm","aria-label":"Small progress"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"small text-muted mb-1",children:"Medium (16px) - Default"}),e.jsx(a,{value:50,size:"md","aria-label":"Medium progress"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"small text-muted mb-1",children:"Large (24px)"}),e.jsx(a,{value:50,size:"lg","aria-label":"Large progress"})]})]})},c={args:{value:65,label:"Uploading files...","aria-label":"File upload progress"}},u={args:{value:75,showValue:!0,"aria-label":"Progress with value"}},p={args:{value:45,label:"Processing...",showValue:!0,"aria-label":"Processing progress"}},m={args:{value:75,showValue:!0,valueText:"3 of 4 complete","aria-label":"Task progress"}},g={args:{indeterminate:!0,"aria-label":"Loading"}},v={args:{indeterminate:!0,label:"Loading data...",variant:"info","aria-label":"Loading data"}},b={args:{value:60,striped:!0,"aria-label":"Striped progress"}},x={args:{value:60,striped:!0,animated:!0,"aria-label":"Animated progress"}},y={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(a,{value:20,variant:"primary",striped:!0,animated:!0,"aria-label":"Primary"}),e.jsx(a,{value:40,variant:"success",striped:!0,animated:!0,"aria-label":"Success"}),e.jsx(a,{value:60,variant:"warning",striped:!0,animated:!0,"aria-label":"Warning"}),e.jsx(a,{value:80,variant:"danger",striped:!0,animated:!0,"aria-label":"Danger"}),e.jsx(a,{value:100,variant:"info",striped:!0,animated:!0,"aria-label":"Info"})]})},h={render:()=>e.jsxs(a,{"aria-label":"Multi-part progress",children:[e.jsx(a.Bar,{value:15,variant:"success"}),e.jsx(a.Bar,{value:30,variant:"warning"}),e.jsx(a.Bar,{value:20,variant:"danger"})]})},f={render:()=>e.jsxs(a,{"aria-label":"Multi-part progress with values",children:[e.jsx(a.Bar,{value:15,variant:"success",showValue:!0}),e.jsx(a.Bar,{value:30,variant:"warning",showValue:!0}),e.jsx(a.Bar,{value:20,variant:"danger",showValue:!0})]})},P={render:function(){const[s,V]=w.useState(0);return w.useEffect(()=>{const r=setInterval(()=>{V(t=>t>=100?0:t+5)},500);return()=>clearInterval(r)},[]),e.jsx(a,{value:s,label:"Auto-incrementing progress",showValue:!0,variant:"success","aria-label":"Auto progress"})}},j={render:function(){const[s,V]=w.useState(0),[r,t]=w.useState("idle");w.useEffect(()=>{if(r==="uploading"&&s<100){const va=setTimeout(()=>{V(ba=>Math.min(ba+Math.random()*15,100))},300);return()=>clearTimeout(va)}else s>=100&&t("complete")},[r,s]);const B=()=>{V(0),t("uploading")};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[r==="idle"&&e.jsx("button",{className:"btn btn-primary",onClick:B,children:"Start Upload"}),r==="uploading"&&e.jsx(a,{value:Math.round(s),label:"Uploading document.pdf...",showValue:!0,variant:"primary",striped:!0,animated:!0,"aria-label":"File upload progress"}),r==="complete"&&e.jsxs("div",{className:"d-flex flex-column gap-2",children:[e.jsx(a,{value:100,variant:"success","aria-label":"Upload complete"}),e.jsxs("div",{className:"d-flex align-items-center gap-2",children:[e.jsx("span",{className:"text-success",children:"✓"}),e.jsx("span",{children:"Upload complete!"}),e.jsx("button",{className:"btn btn-sm btn-outline-primary ms-auto",onClick:B,children:"Upload Another"})]})]})]})}},S={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Basic Progress"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(a,{value:25,"aria-label":"25%"}),e.jsx(a,{value:50,"aria-label":"50%"}),e.jsx(a,{value:75,"aria-label":"75%"}),e.jsx(a,{value:100,"aria-label":"100%"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Color Variants"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(a,{value:50,variant:"primary","aria-label":"Primary"}),e.jsx(a,{value:50,variant:"success","aria-label":"Success"}),e.jsx(a,{value:50,variant:"warning","aria-label":"Warning"}),e.jsx(a,{value:50,variant:"danger","aria-label":"Danger"}),e.jsx(a,{value:50,variant:"info","aria-label":"Info"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"With Labels"}),e.jsx(a,{value:65,label:"Downloading update...",showValue:!0,variant:"info","aria-label":"Download progress"})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Striped & Animated"}),e.jsx(a,{value:75,striped:!0,animated:!0,variant:"success","aria-label":"Animated progress"})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Stacked Bars"}),e.jsxs(a,{"aria-label":"Multi-part progress",children:[e.jsx(a.Bar,{value:20,variant:"success"}),e.jsx(a.Bar,{value:15,variant:"warning"}),e.jsx(a.Bar,{value:10,variant:"danger"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Indeterminate (Loading)"}),e.jsx(a,{indeterminate:!0,variant:"primary","aria-label":"Loading"})]})]})};var D,A,L,k,I;i.parameters={...i.parameters,docs:{...(D=i.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    value: 25,
    'aria-label': 'Default progress'
  }
}`,...(L=(A=i.parameters)==null?void 0:A.docs)==null?void 0:L.source},description:{story:"Basic progress bar with 25% value",...(I=(k=i.parameters)==null?void 0:k.docs)==null?void 0:I.description}}};var U,W,M,C,N;l.parameters={...l.parameters,docs:{...(U=l.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    value: 0,
    'aria-label': 'Empty progress'
  }
}`,...(M=(W=l.parameters)==null?void 0:W.docs)==null?void 0:M.source},description:{story:"Progress bar at 0%",...(N=(C=l.parameters)==null?void 0:C.docs)==null?void 0:N.description}}};var z,E,T,F,R;o.parameters={...o.parameters,docs:{...(z=o.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    value: 100,
    'aria-label': 'Complete progress'
  }
}`,...(T=(E=o.parameters)==null?void 0:E.docs)==null?void 0:T.source},description:{story:"Progress bar at 100%",...(R=(F=o.parameters)==null?void 0:F.docs)==null?void 0:R.description}}};var _,O,q,G,H;n.parameters={...n.parameters,docs:{...(_=n.parameters)==null?void 0:_.docs,source:{originalSource:`{
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
}`,...(q=(O=n.parameters)==null?void 0:O.docs)==null?void 0:q.source},description:{story:"All color variants",...(H=(G=n.parameters)==null?void 0:G.docs)==null?void 0:H.description}}};var J,K,Q,X,Y;d.parameters={...d.parameters,docs:{...(J=d.parameters)==null?void 0:J.docs,source:{originalSource:`{
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
}`,...(Q=(K=d.parameters)==null?void 0:K.docs)==null?void 0:Q.source},description:{story:"Different progress bar sizes",...(Y=(X=d.parameters)==null?void 0:X.docs)==null?void 0:Y.description}}};var Z,$,ee,ae,re;c.parameters={...c.parameters,docs:{...(Z=c.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    value: 65,
    label: 'Uploading files...',
    'aria-label': 'File upload progress'
  }
}`,...(ee=($=c.parameters)==null?void 0:$.docs)==null?void 0:ee.source},description:{story:"Progress bar with label",...(re=(ae=c.parameters)==null?void 0:ae.docs)==null?void 0:re.description}}};var se,te,ie,le,oe;u.parameters={...u.parameters,docs:{...(se=u.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    value: 75,
    showValue: true,
    'aria-label': 'Progress with value'
  }
}`,...(ie=(te=u.parameters)==null?void 0:te.docs)==null?void 0:ie.source},description:{story:"Progress bar showing percentage value",...(oe=(le=u.parameters)==null?void 0:le.docs)==null?void 0:oe.description}}};var ne,de,ce,ue,pe;p.parameters={...p.parameters,docs:{...(ne=p.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    value: 45,
    label: 'Processing...',
    showValue: true,
    'aria-label': 'Processing progress'
  }
}`,...(ce=(de=p.parameters)==null?void 0:de.docs)==null?void 0:ce.source},description:{story:"Progress bar with label and value",...(pe=(ue=p.parameters)==null?void 0:ue.docs)==null?void 0:pe.description}}};var me,ge,ve,be,xe;m.parameters={...m.parameters,docs:{...(me=m.parameters)==null?void 0:me.docs,source:{originalSource:`{
  args: {
    value: 75,
    showValue: true,
    valueText: '3 of 4 complete',
    'aria-label': 'Task progress'
  }
}`,...(ve=(ge=m.parameters)==null?void 0:ge.docs)==null?void 0:ve.source},description:{story:"Progress bar with custom value text",...(xe=(be=m.parameters)==null?void 0:be.docs)==null?void 0:xe.description}}};var ye,he,fe,Pe,je;g.parameters={...g.parameters,docs:{...(ye=g.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  args: {
    indeterminate: true,
    'aria-label': 'Loading'
  }
}`,...(fe=(he=g.parameters)==null?void 0:he.docs)==null?void 0:fe.source},description:{story:"Indeterminate loading state",...(je=(Pe=g.parameters)==null?void 0:Pe.docs)==null?void 0:je.description}}};var Se,we,Ve,Be,De;v.parameters={...v.parameters,docs:{...(Se=v.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  args: {
    indeterminate: true,
    label: 'Loading data...',
    variant: 'info',
    'aria-label': 'Loading data'
  }
}`,...(Ve=(we=v.parameters)==null?void 0:we.docs)==null?void 0:Ve.source},description:{story:"Indeterminate with label",...(De=(Be=v.parameters)==null?void 0:Be.docs)==null?void 0:De.description}}};var Ae,Le,ke,Ie,Ue;b.parameters={...b.parameters,docs:{...(Ae=b.parameters)==null?void 0:Ae.docs,source:{originalSource:`{
  args: {
    value: 60,
    striped: true,
    'aria-label': 'Striped progress'
  }
}`,...(ke=(Le=b.parameters)==null?void 0:Le.docs)==null?void 0:ke.source},description:{story:"Striped progress bar",...(Ue=(Ie=b.parameters)==null?void 0:Ie.docs)==null?void 0:Ue.description}}};var We,Me,Ce,Ne,ze;x.parameters={...x.parameters,docs:{...(We=x.parameters)==null?void 0:We.docs,source:{originalSource:`{
  args: {
    value: 60,
    striped: true,
    animated: true,
    'aria-label': 'Animated progress'
  }
}`,...(Ce=(Me=x.parameters)==null?void 0:Me.docs)==null?void 0:Ce.source},description:{story:"Animated striped progress bar",...(ze=(Ne=x.parameters)==null?void 0:Ne.docs)==null?void 0:ze.description}}};var Ee,Te,Fe,Re,_e;y.parameters={...y.parameters,docs:{...(Ee=y.parameters)==null?void 0:Ee.docs,source:{originalSource:`{
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
}`,...(Fe=(Te=y.parameters)==null?void 0:Te.docs)==null?void 0:Fe.source},description:{story:"All striped variants",...(_e=(Re=y.parameters)==null?void 0:Re.docs)==null?void 0:_e.description}}};var Oe,qe,Ge,He,Je;h.parameters={...h.parameters,docs:{...(Oe=h.parameters)==null?void 0:Oe.docs,source:{originalSource:`{
  render: () => <Progress aria-label="Multi-part progress">
      <Progress.Bar value={15} variant="success" />
      <Progress.Bar value={30} variant="warning" />
      <Progress.Bar value={20} variant="danger" />
    </Progress>
}`,...(Ge=(qe=h.parameters)==null?void 0:qe.docs)==null?void 0:Ge.source},description:{story:"Multiple stacked progress bars",...(Je=(He=h.parameters)==null?void 0:He.docs)==null?void 0:Je.description}}};var Ke,Qe,Xe,Ye,Ze;f.parameters={...f.parameters,docs:{...(Ke=f.parameters)==null?void 0:Ke.docs,source:{originalSource:`{
  render: () => <Progress aria-label="Multi-part progress with values">
      <Progress.Bar value={15} variant="success" showValue />
      <Progress.Bar value={30} variant="warning" showValue />
      <Progress.Bar value={20} variant="danger" showValue />
    </Progress>
}`,...(Xe=(Qe=f.parameters)==null?void 0:Qe.docs)==null?void 0:Xe.source},description:{story:"Stacked with values shown",...(Ze=(Ye=f.parameters)==null?void 0:Ye.docs)==null?void 0:Ze.description}}};var $e,ea,aa,ra,sa;P.parameters={...P.parameters,docs:{...($e=P.parameters)==null?void 0:$e.docs,source:{originalSource:`{
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
}`,...(aa=(ea=P.parameters)==null?void 0:ea.docs)==null?void 0:aa.source},description:{story:"Animated progress simulation",...(sa=(ra=P.parameters)==null?void 0:ra.docs)==null?void 0:sa.description}}};var ta,ia,la,oa,na;j.parameters={...j.parameters,docs:{...(ta=j.parameters)==null?void 0:ta.docs,source:{originalSource:`{
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
        {status === 'idle' && <button className="btn btn-primary" onClick={startUpload}>
            Start Upload
          </button>}

        {status === 'uploading' && <Progress value={Math.round(progress)} label="Uploading document.pdf..." showValue variant="primary" striped animated aria-label="File upload progress" />}

        {status === 'complete' && <div className="d-flex flex-column gap-2">
            <Progress value={100} variant="success" aria-label="Upload complete" />
            <div className="d-flex align-items-center gap-2">
              <span className="text-success">✓</span>
              <span>Upload complete!</span>
              <button className="btn btn-sm btn-outline-primary ms-auto" onClick={startUpload}>
                Upload Another
              </button>
            </div>
          </div>}
      </div>;
  }
}`,...(la=(ia=j.parameters)==null?void 0:ia.docs)==null?void 0:la.source},description:{story:"File upload simulation",...(na=(oa=j.parameters)==null?void 0:oa.docs)==null?void 0:na.description}}};var da,ca,ua,pa,ma;S.parameters={...S.parameters,docs:{...(da=S.parameters)==null?void 0:da.docs,source:{originalSource:`{
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
}`,...(ua=(ca=S.parameters)==null?void 0:ca.docs)==null?void 0:ua.source},description:{story:"Complete progress bar showcase",...(ma=(pa=S.parameters)==null?void 0:pa.docs)==null?void 0:ma.description}}};const ja=["Default","Empty","Complete","Variants","Sizes","WithLabel","WithValue","WithLabelAndValue","CustomValueText","Indeterminate","IndeterminateWithLabel","Striped","Animated","StripedVariants","Stacked","StackedWithValues","AnimatedProgress","FileUploadSimulation","CompleteShowcase"];export{x as Animated,P as AnimatedProgress,o as Complete,S as CompleteShowcase,m as CustomValueText,i as Default,l as Empty,j as FileUploadSimulation,g as Indeterminate,v as IndeterminateWithLabel,d as Sizes,h as Stacked,f as StackedWithValues,b as Striped,y as StripedVariants,n as Variants,c as WithLabel,p as WithLabelAndValue,u as WithValue,ja as __namedExportsOrder,Pa as default};
