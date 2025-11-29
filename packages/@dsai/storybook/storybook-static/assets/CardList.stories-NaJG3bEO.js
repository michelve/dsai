import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{v as s,b as u,c as bt}from"./Tabs-Fap5R-zB.js";import{r as o}from"./iframe-6amVX2Fk.js";import"./preload-helper-Dp1pzeXC.js";const Ct={title:"Components/CardList",component:s,parameters:{layout:"padded",docs:{description:{component:"A high-level component managing multiple selectable cards with FSM-based state, three selection modes (none/single/multiple), and full accessibility via fieldset/legend."}}},tags:["autodocs"],argTypes:{selectionMode:{control:"select",options:["none","single","multiple"],description:"Selection mode for the CardList",table:{type:{summary:"'none' | 'single' | 'multiple'"},defaultValue:{summary:"'none'"}}},label:{control:"text",description:"Group label rendered as legend",table:{type:{summary:"string"}}},variant:{control:"select",options:["elevated","outlined","ghost"],description:"Card variant for all cards",table:{type:{summary:"'elevated' | 'outlined' | 'ghost'"},defaultValue:{summary:"'outlined'"}}},selectedColor:{control:"select",options:[void 0,"primary","secondary","success","danger","warning","info","light","dark"],description:"Color when card is selected",table:{type:{summary:"CardColor"}}},orientation:{control:"select",options:["vertical","horizontal"],description:"Layout orientation",table:{type:{summary:"'vertical' | 'horizontal'"},defaultValue:{summary:"'vertical'"}}},columns:{control:"number",description:"Number of grid columns",table:{type:{summary:"number"}}},gap:{control:"text",description:"Gap between cards",table:{type:{summary:"string"},defaultValue:{summary:"'0.5rem'"}}},horizontal:{control:"boolean",description:"Horizontal card layout (image beside content)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},disabled:{control:"boolean",description:"Disable all cards",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},error:{control:"boolean",description:"Error state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},errorMessage:{control:"text",description:"Error message",table:{type:{summary:"string"}}},helperText:{control:"text",description:"Helper text",table:{type:{summary:"string"}}},required:{control:"boolean",description:"Required field",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}}},m=[{value:"basic",title:"Basic",subtitle:"$9/month",description:"Perfect for individuals getting started."},{value:"pro",title:"Pro",subtitle:"$29/month",description:"Best for growing teams and businesses."},{value:"enterprise",title:"Enterprise",subtitle:"$99/month",description:"Advanced features for large organizations."}],d=[{value:"analytics",title:"Analytics",description:"Track user behavior and engagement metrics."},{value:"automation",title:"Automation",description:"Automate repetitive tasks and workflows."},{value:"integrations",title:"Integrations",description:"Connect with your favorite tools."},{value:"support",title:"Priority Support",description:"24/7 dedicated support team."},{value:"api",title:"API Access",description:"Build custom integrations with our API."}],vt=[{value:"read",title:"Read",description:"View content and data"},{value:"write",title:"Write",description:"Create and edit content"},{value:"delete",title:"Delete",description:"Remove content",disabled:!0},{value:"admin",title:"Admin",description:"Full administrative access"}],a=[{value:"card1",title:"Card 1",description:"First card in the list"},{value:"card2",title:"Card 2",description:"Second card in the list"},{value:"card3",title:"Card 3",description:"Third card in the list"}],b={args:{label:"Available Plans",items:m}},v={args:{label:"Select a Plan",items:m,selectionMode:"single",defaultValue:"pro"}},x={args:{label:"Select Features",items:d,selectionMode:"multiple",defaultValue:["analytics","integrations"]}},f={args:{label:"Select a Plan",items:m,selectionMode:"single",helperText:"Choose the plan that best fits your needs"}},y={render:()=>e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h6",{className:"mb-2",children:"None (Display Only)"}),e.jsx(s,{label:"Plans",items:a,selectionMode:"none"})]}),e.jsxs("div",{children:[e.jsx("h6",{className:"mb-2",children:"Single (Radio)"}),e.jsx(s,{label:"Select One",items:a,selectionMode:"single",defaultValue:"card2"})]}),e.jsxs("div",{children:[e.jsx("h6",{className:"mb-2",children:"Multiple (Checkbox)"}),e.jsx(s,{label:"Select Many",items:a,selectionMode:"multiple",defaultValue:["card1","card3"]})]})]})},S={render:function(){const[t,l]=o.useState("pro");return e.jsxs("div",{children:[e.jsx(s,{label:"Select a Plan",items:m,selectionMode:"single",value:t,onChange:l}),e.jsxs("div",{className:"mt-3",children:[e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary me-2",onClick:()=>l(void 0),children:"Clear"}),e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-primary",onClick:()=>l("enterprise"),children:"Select Enterprise"})]}),e.jsxs("p",{className:"mt-2 text-muted small",children:["Selected: ",t||"None"]})]})}},C={render:function(){const[t,l]=o.useState(["analytics"]);return e.jsxs("div",{children:[e.jsx(s,{label:"Select Features",items:d,selectionMode:"multiple",value:t,onChange:l}),e.jsxs("div",{className:"mt-3",children:[e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary me-2",onClick:()=>l([]),children:"Clear All"}),e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-primary",onClick:()=>l(d.map(i=>i.value)),children:"Select All"})]}),e.jsxs("p",{className:"mt-2 text-muted small",children:["Selected: ",t.length>0?t.join(", "):"None"]})]})}},j={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h6",{className:"mb-2",children:"Elevated"}),e.jsx(s,{label:"Elevated Cards",items:a,selectionMode:"single",variant:"elevated",defaultValue:"card1"})]}),e.jsxs("div",{children:[e.jsx("h6",{className:"mb-2",children:"Outlined (Default)"}),e.jsx(s,{label:"Outlined Cards",items:a,selectionMode:"single",variant:"outlined",defaultValue:"card2"})]}),e.jsxs("div",{children:[e.jsx("h6",{className:"mb-2",children:"Ghost"}),e.jsx(s,{label:"Ghost Cards",items:a,selectionMode:"single",variant:"ghost",defaultValue:"card3"})]})]})},N={render:()=>e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:"2rem"},children:["primary","success","warning","info"].map(n=>e.jsxs("div",{children:[e.jsx("h6",{className:"mb-2 text-capitalize",children:n}),e.jsx(s,{label:`${n} Selection`,items:a.slice(0,2),selectionMode:"single",selectedColor:n,defaultValue:"card1"})]},n))})},M={args:{label:"Quick Selection",items:a,selectionMode:"single",orientation:"horizontal",defaultValue:"card2"}},w={args:{label:"Select Features",items:d,selectionMode:"multiple",columns:3,gap:"1rem",defaultValue:["analytics","api"]}},P={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h6",{className:"mb-2",children:"Small Gap (0.25rem)"}),e.jsx(s,{label:"Compact",items:a,selectionMode:"single",gap:"0.25rem",defaultValue:"card1"})]}),e.jsxs("div",{children:[e.jsx("h6",{className:"mb-2",children:"Large Gap (1.5rem)"}),e.jsx(s,{label:"Spacious",items:a,selectionMode:"single",gap:"1.5rem",defaultValue:"card1"})]})]})},L={args:{label:"Select a Plan",items:m,selectionMode:"single",horizontal:!0,defaultValue:"pro"}},V={args:{label:"Select a Plan",items:m,selectionMode:"single",defaultValue:"pro",disabled:!0}},k={args:{label:"Permissions",items:vt,selectionMode:"multiple",helperText:"Delete permission requires admin approval",defaultValue:["read"]}},A={args:{label:"Select a Plan",items:m,selectionMode:"single",error:!0,errorMessage:"Please select a plan to continue"}},F={args:{label:"Select a Plan",items:m,selectionMode:"single",required:!0}},z={render:function(){const[t,l]=o.useState([]),r=t.length===0?"none":t.length===1?"one":t.length===d.length?"all":"some";return e.jsxs("div",{children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("h5",{children:"FSM Visual State Machine"}),e.jsxs("div",{className:"d-flex gap-2 align-items-center mb-3 flex-wrap",children:[e.jsxs("div",{className:`p-2 rounded ${r==="none"?"bg-secondary text-white":"bg-light"}`,style:{minWidth:"70px",textAlign:"center"},children:[e.jsx("strong",{children:"none"}),e.jsx("div",{className:"small",children:"0 items"})]}),e.jsx("div",{className:"text-muted",children:"→"}),e.jsxs("div",{className:`p-2 rounded ${r==="one"?"bg-info text-dark":"bg-light"}`,style:{minWidth:"70px",textAlign:"center"},children:[e.jsx("strong",{children:"one"}),e.jsx("div",{className:"small",children:"1 item"})]}),e.jsx("div",{className:"text-muted",children:"→"}),e.jsxs("div",{className:`p-2 rounded ${r==="some"?"bg-warning text-dark":"bg-light"}`,style:{minWidth:"70px",textAlign:"center"},children:[e.jsx("strong",{children:"some"}),e.jsx("div",{className:"small",children:"Partial"})]}),e.jsx("div",{className:"text-muted",children:"→"}),e.jsxs("div",{className:`p-2 rounded ${r==="all"?"bg-success text-white":"bg-light"}`,style:{minWidth:"70px",textAlign:"center"},children:[e.jsx("strong",{children:"all"}),e.jsx("div",{className:"small",children:"All items"})]})]}),e.jsxs("p",{className:"text-muted small",children:["Current state: ",e.jsx("code",{children:r})," | Selected: ",t.length,"/",d.length]})]}),e.jsx(s,{label:"Select Features",items:d,selectionMode:"multiple",value:t,onChange:l,columns:2,gap:"0.75rem"})]})}},D={render:function(){const[t,l]=o.useState("pro"),[i,r]=o.useState(["analytics"]),[c,p]=o.useState(!1),h=g=>{g.preventDefault(),p(!0)};return e.jsxs("form",{onSubmit:h,children:[e.jsx("div",{className:"mb-4",children:e.jsx(s,{label:"Select a Plan",items:m,selectionMode:"single",value:t,onChange:l,name:"plan",required:!0})}),e.jsx("div",{className:"mb-4",children:e.jsx(s,{label:"Add Features",items:d.slice(0,4),selectionMode:"multiple",value:i,onChange:r,name:"features",columns:2,gap:"0.75rem",helperText:"Select additional features for your plan"})}),e.jsx("button",{type:"submit",className:"btn btn-primary",children:"Submit"}),c&&e.jsxs("div",{className:"alert alert-success mt-3",children:[e.jsx("strong",{children:"Form Submitted!"}),e.jsx("pre",{className:"mb-0 mt-2",children:JSON.stringify({plan:t,features:i},null,2)})]})]})}},T={render:()=>e.jsxs("div",{className:"d-flex flex-column gap-4",children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Semantic HTML Structure"}),e.jsx("p",{className:"text-muted small",children:"CardList renders as fieldset/legend with native inputs for proper screen reader support."})]}),e.jsx(s,{label:"Notification Preferences",items:a,selectionMode:"single",helperText:"Choose your preferred notification method",defaultValue:"card1"}),e.jsxs("div",{className:"alert alert-info small",children:[e.jsx("strong",{children:"HTML Structure:"}),e.jsx("pre",{className:"mb-0 mt-2",children:`<fieldset aria-describedby="...">
  <legend>Notification Preferences</legend>
  <div>Choose your preferred...</div>
  <label>
    <input type="radio" name="..." />
    <article class="card">...</article>
  </label>
  ...
</fieldset>`})]})]})},W={render:()=>e.jsxs("div",{className:"d-flex flex-column gap-4",children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Screen Reader Features"}),e.jsxs("ul",{className:"text-muted small",children:[e.jsxs("li",{children:[e.jsx(u,{size:14,className:"text-success me-1"}),"Group label announced as fieldset legend"]}),e.jsxs("li",{children:[e.jsx(u,{size:14,className:"text-success me-1"}),"Helper text linked via aria-describedby"]}),e.jsxs("li",{children:[e.jsx(u,{size:14,className:"text-success me-1"}),"Error state announced via aria-invalid"]}),e.jsxs("li",{children:[e.jsx(u,{size:14,className:"text-success me-1"}),"Native radio/checkbox inputs for full support"]})]})]}),e.jsx(s,{label:"With Helper Text",items:a,selectionMode:"single",helperText:"Helper text is announced by screen readers",defaultValue:"card1"}),e.jsx(s,{label:"With Error State",items:a,selectionMode:"single",error:!0,errorMessage:"Error message is announced when focused"})]})},I={render:()=>e.jsxs("div",{className:"d-flex flex-column gap-4",children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Development-Time Accessibility Warnings"}),e.jsx("p",{className:"text-muted small",children:"Open browser console to see warnings for missing accessible names."})]}),e.jsxs("div",{className:"alert alert-warning small",children:[e.jsx("strong",{children:"⚠️ Dev Warning"}),e.jsx("p",{className:"mb-0 mt-2",children:"A CardList without `label` or `aria-label` will log:"}),e.jsx("code",{className:"d-block mt-2 p-2 bg-dark text-light rounded",children:'[DSAi CardList] Missing accessible label. Provide a "label" prop or "aria-label"/"aria-labelledby" for screen reader users.'})]}),e.jsxs("div",{children:[e.jsxs("h6",{className:"text-success",children:[e.jsx(u,{size:14,className:"me-1"}),"Correct Usage"]}),e.jsx(s,{label:"With visible label",items:a.slice(0,2)}),e.jsx("div",{className:"mt-3",children:e.jsx(s,{"aria-label":"With aria-label",items:a.slice(0,2)})})]})]})},E={render:()=>e.jsxs("div",{className:"d-flex flex-column gap-4",children:[e.jsxs("div",{children:[e.jsx("h5",{children:"Security Features"}),e.jsx("p",{className:"text-muted small",children:"CardList inherits security features from underlying components."})]}),e.jsxs("ul",{className:"small",children:[e.jsxs("li",{children:[e.jsx(u,{size:14,className:"text-success me-1"}),"No dangerouslySetInnerHTML usage"]}),e.jsxs("li",{children:[e.jsx(u,{size:14,className:"text-success me-1"}),"Props are typed and validated"]}),e.jsxs("li",{children:[e.jsx(u,{size:14,className:"text-success me-1"}),"Safe attribute handling from Card/Checkbox/Radio"]}),e.jsxs("li",{children:[e.jsx(bt,{size:14,className:"text-danger me-1"}),"No unrestricted prop spreading"]})]}),e.jsx(s,{label:"Secure Card List",items:a,selectionMode:"single",name:"secure-list",defaultValue:"card1"})]})},O={render:function(){var r;const[t,l]=o.useState("pro"),i=[{value:"starter",title:"Starter",subtitle:"Free",description:"For individuals exploring the platform.",footer:e.jsxs("ul",{className:"list-unstyled small mb-0",children:[e.jsx("li",{children:"✓ 5 projects"}),e.jsx("li",{children:"✓ Basic analytics"}),e.jsx("li",{children:"✓ Community support"})]})},{value:"pro",title:"Pro",subtitle:"$29/month",description:"For professionals and growing teams.",footer:e.jsxs("ul",{className:"list-unstyled small mb-0",children:[e.jsx("li",{children:"✓ Unlimited projects"}),e.jsx("li",{children:"✓ Advanced analytics"}),e.jsx("li",{children:"✓ Priority support"}),e.jsx("li",{children:"✓ API access"})]})},{value:"enterprise",title:"Enterprise",subtitle:"Custom",description:"For large organizations with custom needs.",footer:e.jsxs("ul",{className:"list-unstyled small mb-0",children:[e.jsx("li",{children:"✓ Everything in Pro"}),e.jsx("li",{children:"✓ SSO & SAML"}),e.jsx("li",{children:"✓ Dedicated support"}),e.jsx("li",{children:"✓ Custom integrations"})]})}];return e.jsxs("div",{style:{maxWidth:"800px"},children:[e.jsxs("div",{className:"text-center mb-4",children:[e.jsx("h4",{children:"Choose Your Plan"}),e.jsx("p",{className:"text-muted",children:"Select the plan that best fits your needs"})]}),e.jsx(s,{label:"Pricing Plans",items:i,selectionMode:"single",value:t,onChange:l,columns:3,gap:"1rem",selectedColor:"primary"}),e.jsx("div",{className:"text-center mt-4",children:e.jsxs("button",{type:"button",className:"btn btn-primary btn-lg",disabled:!t,children:["Continue with"," ",t?(r=i.find(c=>c.value===t))==null?void 0:r.title:"..."]})})]})}},R={render:function(){const[t,l]=o.useState(["analytics","support"]),i=[{value:"analytics",title:"📊 Analytics",description:"Track user behavior, page views, and conversion rates."},{value:"automation",title:"⚡ Automation",description:"Automate workflows with triggers and actions."},{value:"integrations",title:"🔗 Integrations",description:"Connect with Slack, Zapier, and 100+ apps."},{value:"support",title:"💬 Priority Support",description:"Get help within 4 hours from our team."},{value:"api",title:"🔧 API Access",description:"Build custom solutions with our REST API."},{value:"white-label",title:"🏷️ White Label",description:"Remove branding and use your own domain.",disabled:!0}],r=29,c={analytics:0,automation:10,integrations:5,support:15,api:20,"white-label":50},p=r+t.reduce((h,g)=>h+(c[g]||0),0);return e.jsxs("div",{className:"card",style:{maxWidth:"700px"},children:[e.jsx("div",{className:"card-header",children:e.jsx("h5",{className:"mb-0",children:"Customize Your Plan"})}),e.jsx("div",{className:"card-body",children:e.jsx(s,{label:"Select Features",items:i,selectionMode:"multiple",value:t,onChange:l,columns:2,gap:"0.75rem",helperText:"White Label requires Enterprise plan"})}),e.jsxs("div",{className:"card-footer d-flex justify-content-between align-items-center",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-muted",children:"Monthly total:"}),e.jsxs("strong",{className:"ms-2 fs-4",children:["$",p,"/mo"]})]}),e.jsx("button",{type:"button",className:"btn btn-primary",children:"Upgrade Plan"})]})]})}},H={render:function(){const[t,l]=o.useState(),[i,r]=o.useState([]),[c,p]=o.useState(1),h=[{value:"developer",title:"👩‍💻 Developer",description:"I build software and want to improve my team's workflow."},{value:"designer",title:"🎨 Designer",description:"I design interfaces and want to collaborate better."},{value:"manager",title:"📋 Manager",description:"I lead teams and want to track progress effectively."},{value:"other",title:"🌟 Other",description:"I'm exploring what this platform can do for me."}],g=[{value:"project-management",title:"Project Management"},{value:"team-collaboration",title:"Team Collaboration"},{value:"code-review",title:"Code Review"},{value:"design-feedback",title:"Design Feedback"},{value:"documentation",title:"Documentation"},{value:"analytics",title:"Analytics"}];return e.jsxs("div",{className:"card",style:{maxWidth:"600px"},children:[e.jsx("div",{className:"card-header",children:e.jsxs("div",{className:"d-flex justify-content-between align-items-center",children:[e.jsx("h5",{className:"mb-0",children:"Welcome! Let's personalize your experience"}),e.jsxs("span",{className:"badge bg-secondary",children:["Step ",c," of 2"]})]})}),e.jsx("div",{className:"card-body",children:c===1?e.jsx(s,{label:"What best describes your role?",items:h,selectionMode:"single",value:t,onChange:l,gap:"0.75rem"}):e.jsx(s,{label:"What are you interested in?",items:g,selectionMode:"multiple",value:i,onChange:r,columns:2,gap:"0.5rem",helperText:"Select all that apply"})}),e.jsxs("div",{className:"card-footer d-flex justify-content-between",children:[e.jsx("button",{type:"button",className:"btn btn-outline-secondary",onClick:()=>p(1),disabled:c===1,children:"Back"}),c===1?e.jsx("button",{type:"button",className:"btn btn-primary",onClick:()=>p(2),disabled:!t,children:"Continue"}):e.jsx("button",{type:"button",className:"btn btn-success",disabled:i.length===0,onClick:()=>alert(`Setup complete!
Role: ${t}
Interests: ${i.join(", ")}`),children:"Complete Setup"})]})]})}},q={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("section",{children:[e.jsx("h5",{className:"mb-3",children:"Selection Modes"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"1rem"},children:[e.jsx(s,{label:"None",items:a.slice(0,2),selectionMode:"none"}),e.jsx(s,{label:"Single",items:a.slice(0,2),selectionMode:"single",defaultValue:"card1"}),e.jsx(s,{label:"Multiple",items:a.slice(0,2),selectionMode:"multiple",defaultValue:["card1"]})]})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-3",children:"Card Variants"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"1rem"},children:[e.jsx(s,{label:"Elevated",items:a.slice(0,2),selectionMode:"single",variant:"elevated",defaultValue:"card1"}),e.jsx(s,{label:"Outlined",items:a.slice(0,2),selectionMode:"single",variant:"outlined",defaultValue:"card1"}),e.jsx(s,{label:"Ghost",items:a.slice(0,2),selectionMode:"single",variant:"ghost",defaultValue:"card1"})]})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-3",children:"States"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"1rem"},children:[e.jsx(s,{label:"Disabled",items:a.slice(0,2),selectionMode:"single",defaultValue:"card1",disabled:!0}),e.jsx(s,{label:"Error",items:a.slice(0,2),selectionMode:"single",error:!0,errorMessage:"Selection required"}),e.jsx(s,{label:"Required",items:a.slice(0,2),selectionMode:"single",required:!0})]})]}),e.jsxs("section",{children:[e.jsx("h5",{className:"mb-3",children:"Layout Options"}),e.jsxs("div",{className:"mb-3",children:[e.jsx("h6",{children:"Horizontal Orientation"}),e.jsx(s,{label:"Quick Select",items:a,selectionMode:"single",orientation:"horizontal",defaultValue:"card2"})]}),e.jsxs("div",{children:[e.jsx("h6",{children:"Grid (3 columns)"}),e.jsx(s,{label:"Features",items:d.slice(0,6),selectionMode:"multiple",columns:3,gap:"0.75rem",defaultValue:["analytics","api"]})]})]})]})};var G,$,B,U,Q;b.parameters={...b.parameters,docs:{...(G=b.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    label: 'Available Plans',
    items: pricingPlans
  }
}`,...(B=($=b.parameters)==null?void 0:$.docs)==null?void 0:B.source},description:{story:"Default CardList in display-only mode (no selection)",...(Q=(U=b.parameters)==null?void 0:U.docs)==null?void 0:Q.description}}};var Y,J,X,Z,_;v.parameters={...v.parameters,docs:{...(Y=v.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    label: 'Select a Plan',
    items: pricingPlans,
    selectionMode: 'single',
    defaultValue: 'pro'
  }
}`,...(X=(J=v.parameters)==null?void 0:J.docs)==null?void 0:X.source},description:{story:"Single selection mode (radio-like behavior)",...(_=(Z=v.parameters)==null?void 0:Z.docs)==null?void 0:_.description}}};var K,ee,se,te,ae;x.parameters={...x.parameters,docs:{...(K=x.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    label: 'Select Features',
    items: featureOptions,
    selectionMode: 'multiple',
    defaultValue: ['analytics', 'integrations']
  }
}`,...(se=(ee=x.parameters)==null?void 0:ee.docs)==null?void 0:se.source},description:{story:"Multiple selection mode (checkbox-like behavior)",...(ae=(te=x.parameters)==null?void 0:te.docs)==null?void 0:ae.description}}};var le,ie,re,ne,oe;f.parameters={...f.parameters,docs:{...(le=f.parameters)==null?void 0:le.docs,source:{originalSource:`{
  args: {
    label: 'Select a Plan',
    items: pricingPlans,
    selectionMode: 'single',
    helperText: 'Choose the plan that best fits your needs'
  }
}`,...(re=(ie=f.parameters)==null?void 0:ie.docs)==null?void 0:re.source},description:{story:"With helper text",...(oe=(ne=f.parameters)==null?void 0:ne.docs)==null?void 0:oe.description}}};var ce,de,me,ue,pe;y.parameters={...y.parameters,docs:{...(ce=y.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem'
  }}>
      <div>
        <h6 className="mb-2">None (Display Only)</h6>
        <CardList label="Plans" items={showcaseCards} selectionMode="none" />
      </div>
      <div>
        <h6 className="mb-2">Single (Radio)</h6>
        <CardList label="Select One" items={showcaseCards} selectionMode="single" defaultValue="card2" />
      </div>
      <div>
        <h6 className="mb-2">Multiple (Checkbox)</h6>
        <CardList label="Select Many" items={showcaseCards} selectionMode="multiple" defaultValue={['card1', 'card3']} />
      </div>
    </div>
}`,...(me=(de=y.parameters)==null?void 0:de.docs)==null?void 0:me.source},description:{story:"All three selection modes side by side",...(pe=(ue=y.parameters)==null?void 0:ue.docs)==null?void 0:pe.description}}};var he,ge,be,ve,xe;S.parameters={...S.parameters,docs:{...(he=S.parameters)==null?void 0:he.docs,source:{originalSource:`{
  render: function ControlledSingleDemo() {
    const [selected, setSelected] = useState<string | undefined>('pro');
    return <div>
        <CardList label="Select a Plan" items={pricingPlans} selectionMode="single" value={selected} onChange={setSelected} />
        <div className="mt-3">
          <button type="button" className="btn btn-sm btn-outline-secondary me-2" onClick={() => setSelected(undefined)}>
            Clear
          </button>
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setSelected('enterprise')}>
            Select Enterprise
          </button>
        </div>
        <p className="mt-2 text-muted small">Selected: {selected || 'None'}</p>
      </div>;
  }
}`,...(be=(ge=S.parameters)==null?void 0:ge.docs)==null?void 0:be.source},description:{story:"Controlled single selection with external state",...(xe=(ve=S.parameters)==null?void 0:ve.docs)==null?void 0:xe.description}}};var fe,ye,Se,Ce,je;C.parameters={...C.parameters,docs:{...(fe=C.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  render: function ControlledMultipleDemo() {
    const [selected, setSelected] = useState<string[]>(['analytics']);
    return <div>
        <CardList label="Select Features" items={featureOptions} selectionMode="multiple" value={selected} onChange={setSelected} />
        <div className="mt-3">
          <button type="button" className="btn btn-sm btn-outline-secondary me-2" onClick={() => setSelected([])}>
            Clear All
          </button>
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setSelected(featureOptions.map(f => f.value))}>
            Select All
          </button>
        </div>
        <p className="mt-2 text-muted small">
          Selected: {selected.length > 0 ? selected.join(', ') : 'None'}
        </p>
      </div>;
  }
}`,...(Se=(ye=C.parameters)==null?void 0:ye.docs)==null?void 0:Se.source},description:{story:"Controlled multiple selection with external state",...(je=(Ce=C.parameters)==null?void 0:Ce.docs)==null?void 0:je.description}}};var Ne,Me,we,Pe,Le;j.parameters={...j.parameters,docs:{...(Ne=j.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }}>
      <div>
        <h6 className="mb-2">Elevated</h6>
        <CardList label="Elevated Cards" items={showcaseCards} selectionMode="single" variant="elevated" defaultValue="card1" />
      </div>
      <div>
        <h6 className="mb-2">Outlined (Default)</h6>
        <CardList label="Outlined Cards" items={showcaseCards} selectionMode="single" variant="outlined" defaultValue="card2" />
      </div>
      <div>
        <h6 className="mb-2">Ghost</h6>
        <CardList label="Ghost Cards" items={showcaseCards} selectionMode="single" variant="ghost" defaultValue="card3" />
      </div>
    </div>
}`,...(we=(Me=j.parameters)==null?void 0:Me.docs)==null?void 0:we.source},description:{story:"Card variants: elevated, outlined, ghost",...(Le=(Pe=j.parameters)==null?void 0:Pe.docs)==null?void 0:Le.description}}};var Ve,ke,Ae,Fe,ze;N.parameters={...N.parameters,docs:{...(Ve=N.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '2rem'
  }}>
      {(['primary', 'success', 'warning', 'info'] as const).map(color => <div key={color}>
          <h6 className="mb-2 text-capitalize">{color}</h6>
          <CardList label={\`\${color} Selection\`} items={showcaseCards.slice(0, 2)} selectionMode="single" selectedColor={color} defaultValue="card1" />
        </div>)}
    </div>
}`,...(Ae=(ke=N.parameters)==null?void 0:ke.docs)==null?void 0:Ae.source},description:{story:"Selected color variants",...(ze=(Fe=N.parameters)==null?void 0:Fe.docs)==null?void 0:ze.description}}};var De,Te,We,Ie,Ee;M.parameters={...M.parameters,docs:{...(De=M.parameters)==null?void 0:De.docs,source:{originalSource:`{
  args: {
    label: 'Quick Selection',
    items: showcaseCards,
    selectionMode: 'single',
    orientation: 'horizontal',
    defaultValue: 'card2'
  }
}`,...(We=(Te=M.parameters)==null?void 0:Te.docs)==null?void 0:We.source},description:{story:"Horizontal orientation (row layout)",...(Ee=(Ie=M.parameters)==null?void 0:Ie.docs)==null?void 0:Ee.description}}};var Oe,Re,He,qe,Ge;w.parameters={...w.parameters,docs:{...(Oe=w.parameters)==null?void 0:Oe.docs,source:{originalSource:`{
  args: {
    label: 'Select Features',
    items: featureOptions,
    selectionMode: 'multiple',
    columns: 3,
    gap: '1rem',
    defaultValue: ['analytics', 'api']
  }
}`,...(He=(Re=w.parameters)==null?void 0:Re.docs)==null?void 0:He.source},description:{story:"Grid layout with columns",...(Ge=(qe=w.parameters)==null?void 0:qe.docs)==null?void 0:Ge.description}}};var $e,Be,Ue,Qe,Ye;P.parameters={...P.parameters,docs:{...($e=P.parameters)==null?void 0:$e.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }}>
      <div>
        <h6 className="mb-2">Small Gap (0.25rem)</h6>
        <CardList label="Compact" items={showcaseCards} selectionMode="single" gap="0.25rem" defaultValue="card1" />
      </div>
      <div>
        <h6 className="mb-2">Large Gap (1.5rem)</h6>
        <CardList label="Spacious" items={showcaseCards} selectionMode="single" gap="1.5rem" defaultValue="card1" />
      </div>
    </div>
}`,...(Ue=(Be=P.parameters)==null?void 0:Be.docs)==null?void 0:Ue.source},description:{story:"Custom gap spacing",...(Ye=(Qe=P.parameters)==null?void 0:Qe.docs)==null?void 0:Ye.description}}};var Je,Xe,Ze,_e,Ke;L.parameters={...L.parameters,docs:{...(Je=L.parameters)==null?void 0:Je.docs,source:{originalSource:`{
  args: {
    label: 'Select a Plan',
    items: pricingPlans,
    selectionMode: 'single',
    horizontal: true,
    defaultValue: 'pro'
  }
}`,...(Ze=(Xe=L.parameters)==null?void 0:Xe.docs)==null?void 0:Ze.source},description:{story:"Horizontal cards (image beside content)",...(Ke=(_e=L.parameters)==null?void 0:_e.docs)==null?void 0:Ke.description}}};var es,ss,ts,as,ls;V.parameters={...V.parameters,docs:{...(es=V.parameters)==null?void 0:es.docs,source:{originalSource:`{
  args: {
    label: 'Select a Plan',
    items: pricingPlans,
    selectionMode: 'single',
    defaultValue: 'pro',
    disabled: true
  }
}`,...(ts=(ss=V.parameters)==null?void 0:ss.docs)==null?void 0:ts.source},description:{story:"Entire CardList disabled",...(ls=(as=V.parameters)==null?void 0:as.docs)==null?void 0:ls.description}}};var is,rs,ns,os,cs;k.parameters={...k.parameters,docs:{...(is=k.parameters)==null?void 0:is.docs,source:{originalSource:`{
  args: {
    label: 'Permissions',
    items: permissionCards,
    selectionMode: 'multiple',
    helperText: 'Delete permission requires admin approval',
    defaultValue: ['read']
  }
}`,...(ns=(rs=k.parameters)==null?void 0:rs.docs)==null?void 0:ns.source},description:{story:"Individual items disabled",...(cs=(os=k.parameters)==null?void 0:os.docs)==null?void 0:cs.description}}};var ds,ms,us,ps,hs;A.parameters={...A.parameters,docs:{...(ds=A.parameters)==null?void 0:ds.docs,source:{originalSource:`{
  args: {
    label: 'Select a Plan',
    items: pricingPlans,
    selectionMode: 'single',
    error: true,
    errorMessage: 'Please select a plan to continue'
  }
}`,...(us=(ms=A.parameters)==null?void 0:ms.docs)==null?void 0:us.source},description:{story:"Error state with message",...(hs=(ps=A.parameters)==null?void 0:ps.docs)==null?void 0:hs.description}}};var gs,bs,vs,xs,fs;F.parameters={...F.parameters,docs:{...(gs=F.parameters)==null?void 0:gs.docs,source:{originalSource:`{
  args: {
    label: 'Select a Plan',
    items: pricingPlans,
    selectionMode: 'single',
    required: true
  }
}`,...(vs=(bs=F.parameters)==null?void 0:bs.docs)==null?void 0:vs.source},description:{story:"Required field",...(fs=(xs=F.parameters)==null?void 0:xs.docs)==null?void 0:fs.description}}};var ys,Ss,Cs,js,Ns;z.parameters={...z.parameters,docs:{...(ys=z.parameters)==null?void 0:ys.docs,source:{originalSource:`{
  render: function FSMDemo() {
    const [selected, setSelected] = useState<string[]>([]);
    const getVisualState = () => {
      if (selected.length === 0) {
        return 'none';
      }
      if (selected.length === 1) {
        return 'one';
      }
      if (selected.length === featureOptions.length) {
        return 'all';
      }
      return 'some';
    };
    const visualState = getVisualState();
    return <div>
        <div className="mb-4">
          <h5>FSM Visual State Machine</h5>
          <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
            <div className={\`p-2 rounded \${visualState === 'none' ? 'bg-secondary text-white' : 'bg-light'}\`} style={{
            minWidth: '70px',
            textAlign: 'center'
          }}>
              <strong>none</strong>
              <div className="small">0 items</div>
            </div>
            <div className="text-muted">→</div>
            <div className={\`p-2 rounded \${visualState === 'one' ? 'bg-info text-dark' : 'bg-light'}\`} style={{
            minWidth: '70px',
            textAlign: 'center'
          }}>
              <strong>one</strong>
              <div className="small">1 item</div>
            </div>
            <div className="text-muted">→</div>
            <div className={\`p-2 rounded \${visualState === 'some' ? 'bg-warning text-dark' : 'bg-light'}\`} style={{
            minWidth: '70px',
            textAlign: 'center'
          }}>
              <strong>some</strong>
              <div className="small">Partial</div>
            </div>
            <div className="text-muted">→</div>
            <div className={\`p-2 rounded \${visualState === 'all' ? 'bg-success text-white' : 'bg-light'}\`} style={{
            minWidth: '70px',
            textAlign: 'center'
          }}>
              <strong>all</strong>
              <div className="small">All items</div>
            </div>
          </div>
          <p className="text-muted small">
            Current state: <code>{visualState}</code> | Selected: {selected.length}/
            {featureOptions.length}
          </p>
        </div>

        <CardList label="Select Features" items={featureOptions} selectionMode="multiple" value={selected} onChange={setSelected} columns={2} gap="0.75rem" />
      </div>;
  }
}`,...(Cs=(Ss=z.parameters)==null?void 0:Ss.docs)==null?void 0:Cs.source},description:{story:`FSM State Diagram

The CardList uses a Finite State Machine (FSM) to manage selection state.
This demo visualizes the current FSM visual state.`,...(Ns=(js=z.parameters)==null?void 0:js.docs)==null?void 0:Ns.description}}};var Ms,ws,Ps,Ls,Vs;D.parameters={...D.parameters,docs:{...(Ms=D.parameters)==null?void 0:Ms.docs,source:{originalSource:`{
  render: function FormDemo() {
    const [plan, setPlan] = useState<string | undefined>('pro');
    const [features, setFeatures] = useState<string[]>(['analytics']);
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
    };
    return <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <CardList label="Select a Plan" items={pricingPlans} selectionMode="single" value={plan} onChange={setPlan} name="plan" required />
        </div>

        <div className="mb-4">
          <CardList label="Add Features" items={featureOptions.slice(0, 4)} selectionMode="multiple" value={features} onChange={setFeatures} name="features" columns={2} gap="0.75rem" helperText="Select additional features for your plan" />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>

        {submitted && <div className="alert alert-success mt-3">
            <strong>Form Submitted!</strong>
            <pre className="mb-0 mt-2">{JSON.stringify({
            plan,
            features
          }, null, 2)}</pre>
          </div>}
      </form>;
  }
}`,...(Ps=(ws=D.parameters)==null?void 0:ws.docs)==null?void 0:Ps.source},description:{story:"Form submission example",...(Vs=(Ls=D.parameters)==null?void 0:Ls.docs)==null?void 0:Vs.description}}};var ks,As,Fs,zs,Ds;T.parameters={...T.parameters,docs:{...(ks=T.parameters)==null?void 0:ks.docs,source:{originalSource:`{
  render: () => <div className="d-flex flex-column gap-4">
      <div>
        <h5>Semantic HTML Structure</h5>
        <p className="text-muted small">
          CardList renders as fieldset/legend with native inputs for proper screen reader support.
        </p>
      </div>

      <CardList label="Notification Preferences" items={showcaseCards} selectionMode="single" helperText="Choose your preferred notification method" defaultValue="card1" />

      <div className="alert alert-info small">
        <strong>HTML Structure:</strong>
        <pre className="mb-0 mt-2">{\`<fieldset aria-describedby="...">
  <legend>Notification Preferences</legend>
  <div>Choose your preferred...</div>
  <label>
    <input type="radio" name="..." />
    <article class="card">...</article>
  </label>
  ...
</fieldset>\`}</pre>
      </div>
    </div>
}`,...(Fs=(As=T.parameters)==null?void 0:As.docs)==null?void 0:Fs.source},description:{story:"Accessibility: Fieldset/Legend Pattern\n\nThe CardList uses semantic HTML for accessibility:\n- `<fieldset>` groups related cards\n- `<legend>` provides the group label\n- `aria-describedby` links to helper/error text\n- `aria-invalid` for error state\n- Native radio/checkbox inputs for screen reader support",...(Ds=(zs=T.parameters)==null?void 0:zs.docs)==null?void 0:Ds.description}}};var Ts,Ws,Is,Es,Os;W.parameters={...W.parameters,docs:{...(Ts=W.parameters)==null?void 0:Ts.docs,source:{originalSource:`{
  render: () => <div className="d-flex flex-column gap-4">
      <div>
        <h5>Screen Reader Features</h5>
        <ul className="text-muted small">
          <li>
            <CheckIcon size={14} className="text-success me-1" />
            Group label announced as fieldset legend
          </li>
          <li>
            <CheckIcon size={14} className="text-success me-1" />
            Helper text linked via aria-describedby
          </li>
          <li>
            <CheckIcon size={14} className="text-success me-1" />
            Error state announced via aria-invalid
          </li>
          <li>
            <CheckIcon size={14} className="text-success me-1" />
            Native radio/checkbox inputs for full support
          </li>
        </ul>
      </div>

      <CardList label="With Helper Text" items={showcaseCards} selectionMode="single" helperText="Helper text is announced by screen readers" defaultValue="card1" />

      <CardList label="With Error State" items={showcaseCards} selectionMode="single" error errorMessage="Error message is announced when focused" />
    </div>
}`,...(Is=(Ws=W.parameters)==null?void 0:Ws.docs)==null?void 0:Is.source},description:{story:`Accessibility: Screen Reader Support

Proper ARIA attributes ensure screen reader compatibility:
- Group announced with label
- Individual cards properly labeled
- Error/helper text associated via aria-describedby`,...(Os=(Es=W.parameters)==null?void 0:Es.docs)==null?void 0:Os.description}}};var Rs,Hs,qs,Gs,$s;I.parameters={...I.parameters,docs:{...(Rs=I.parameters)==null?void 0:Rs.docs,source:{originalSource:`{
  render: () => <div className="d-flex flex-column gap-4">
      <div>
        <h5>Development-Time Accessibility Warnings</h5>
        <p className="text-muted small">
          Open browser console to see warnings for missing accessible names.
        </p>
      </div>

      <div className="alert alert-warning small">
        <strong>⚠️ Dev Warning</strong>
        <p className="mb-0 mt-2">A CardList without \`label\` or \`aria-label\` will log:</p>
        <code className="d-block mt-2 p-2 bg-dark text-light rounded">
          [DSAi CardList] Missing accessible label. Provide a &quot;label&quot; prop or
          &quot;aria-label&quot;/&quot;aria-labelledby&quot; for screen reader users.
        </code>
      </div>

      <div>
        <h6 className="text-success">
          <CheckIcon size={14} className="me-1" />
          Correct Usage
        </h6>
        <CardList label="With visible label" items={showcaseCards.slice(0, 2)} />
        <div className="mt-3">
          <CardList aria-label="With aria-label" items={showcaseCards.slice(0, 2)} />
        </div>
      </div>
    </div>
}`,...(qs=(Hs=I.parameters)==null?void 0:Hs.docs)==null?void 0:qs.source},description:{story:"Accessibility: Development Warnings\n\nThe component warns in development when accessibility best practices aren't followed:\n- Warns when no `label` or `aria-label` is provided\n- Warning only appears once per component instance",...($s=(Gs=I.parameters)==null?void 0:Gs.docs)==null?void 0:$s.description}}};var Bs,Us,Qs,Ys,Js;E.parameters={...E.parameters,docs:{...(Bs=E.parameters)==null?void 0:Bs.docs,source:{originalSource:`{
  render: () => <div className="d-flex flex-column gap-4">
      <div>
        <h5>Security Features</h5>
        <p className="text-muted small">
          CardList inherits security features from underlying components.
        </p>
      </div>

      <ul className="small">
        <li>
          <CheckIcon size={14} className="text-success me-1" />
          No dangerouslySetInnerHTML usage
        </li>
        <li>
          <CheckIcon size={14} className="text-success me-1" />
          Props are typed and validated
        </li>
        <li>
          <CheckIcon size={14} className="text-success me-1" />
          Safe attribute handling from Card/Checkbox/Radio
        </li>
        <li>
          <XLgIcon size={14} className="text-danger me-1" />
          No unrestricted prop spreading
        </li>
      </ul>

      <CardList label="Secure Card List" items={showcaseCards} selectionMode="single" name="secure-list" defaultValue="card1" />
    </div>
}`,...(Qs=(Us=E.parameters)==null?void 0:Us.docs)==null?void 0:Qs.source},description:{story:`Security: Safe Attribute Handling

CardList uses SelectableCard which inherits security features from Card, Checkbox, and Radio.`,...(Js=(Ys=E.parameters)==null?void 0:Ys.docs)==null?void 0:Js.description}}};var Xs,Zs,_s,Ks,et;O.parameters={...O.parameters,docs:{...(Xs=O.parameters)==null?void 0:Xs.docs,source:{originalSource:`{
  render: function PricingPage() {
    const [selectedPlan, setSelectedPlan] = useState<string | undefined>('pro');
    const plans: CardListItem[] = [{
      value: 'starter',
      title: 'Starter',
      subtitle: 'Free',
      description: 'For individuals exploring the platform.',
      footer: <ul className="list-unstyled small mb-0">
            <li>✓ 5 projects</li>
            <li>✓ Basic analytics</li>
            <li>✓ Community support</li>
          </ul>
    }, {
      value: 'pro',
      title: 'Pro',
      subtitle: '$29/month',
      description: 'For professionals and growing teams.',
      footer: <ul className="list-unstyled small mb-0">
            <li>✓ Unlimited projects</li>
            <li>✓ Advanced analytics</li>
            <li>✓ Priority support</li>
            <li>✓ API access</li>
          </ul>
    }, {
      value: 'enterprise',
      title: 'Enterprise',
      subtitle: 'Custom',
      description: 'For large organizations with custom needs.',
      footer: <ul className="list-unstyled small mb-0">
            <li>✓ Everything in Pro</li>
            <li>✓ SSO & SAML</li>
            <li>✓ Dedicated support</li>
            <li>✓ Custom integrations</li>
          </ul>
    }];
    return <div style={{
      maxWidth: '800px'
    }}>
        <div className="text-center mb-4">
          <h4>Choose Your Plan</h4>
          <p className="text-muted">Select the plan that best fits your needs</p>
        </div>
        <CardList label="Pricing Plans" items={plans} selectionMode="single" value={selectedPlan} onChange={setSelectedPlan} columns={3} gap="1rem" selectedColor="primary" />
        <div className="text-center mt-4">
          <button type="button" className="btn btn-primary btn-lg" disabled={!selectedPlan}>
            Continue with{' '}
            {selectedPlan ? plans.find(p => p.value === selectedPlan)?.title : '...'}
          </button>
        </div>
      </div>;
  }
}`,...(_s=(Zs=O.parameters)==null?void 0:Zs.docs)==null?void 0:_s.source},description:{story:"Pricing page example",...(et=(Ks=O.parameters)==null?void 0:Ks.docs)==null?void 0:et.description}}};var st,tt,at,lt,it;R.parameters={...R.parameters,docs:{...(st=R.parameters)==null?void 0:st.docs,source:{originalSource:`{
  render: function FeatureSelection() {
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['analytics', 'support']);
    const features: CardListItem[] = [{
      value: 'analytics',
      title: '📊 Analytics',
      description: 'Track user behavior, page views, and conversion rates.'
    }, {
      value: 'automation',
      title: '⚡ Automation',
      description: 'Automate workflows with triggers and actions.'
    }, {
      value: 'integrations',
      title: '🔗 Integrations',
      description: 'Connect with Slack, Zapier, and 100+ apps.'
    }, {
      value: 'support',
      title: '💬 Priority Support',
      description: 'Get help within 4 hours from our team.'
    }, {
      value: 'api',
      title: '🔧 API Access',
      description: 'Build custom solutions with our REST API.'
    }, {
      value: 'white-label',
      title: '🏷️ White Label',
      description: 'Remove branding and use your own domain.',
      disabled: true
    }];
    const basePrice = 29;
    const featurePrices: Record<string, number> = {
      analytics: 0,
      automation: 10,
      integrations: 5,
      support: 15,
      api: 20,
      'white-label': 50
    };
    const totalPrice = basePrice + selectedFeatures.reduce((sum, f) => sum + (featurePrices[f] || 0), 0);
    return <div className="card" style={{
      maxWidth: '700px'
    }}>
        <div className="card-header">
          <h5 className="mb-0">Customize Your Plan</h5>
        </div>
        <div className="card-body">
          <CardList label="Select Features" items={features} selectionMode="multiple" value={selectedFeatures} onChange={setSelectedFeatures} columns={2} gap="0.75rem" helperText="White Label requires Enterprise plan" />
        </div>
        <div className="card-footer d-flex justify-content-between align-items-center">
          <div>
            <span className="text-muted">Monthly total:</span>
            <strong className="ms-2 fs-4">\${totalPrice}/mo</strong>
          </div>
          <button type="button" className="btn btn-primary">
            Upgrade Plan
          </button>
        </div>
      </div>;
  }
}`,...(at=(tt=R.parameters)==null?void 0:tt.docs)==null?void 0:at.source},description:{story:"Feature selection example",...(it=(lt=R.parameters)==null?void 0:lt.docs)==null?void 0:it.description}}};var rt,nt,ot,ct,dt;H.parameters={...H.parameters,docs:{...(rt=H.parameters)==null?void 0:rt.docs,source:{originalSource:`{
  render: function OnboardingWizard() {
    const [role, setRole] = useState<string | undefined>();
    const [interests, setInterests] = useState<string[]>([]);
    const [step, setStep] = useState(1);
    const roles: CardListItem[] = [{
      value: 'developer',
      title: '👩‍💻 Developer',
      description: "I build software and want to improve my team's workflow."
    }, {
      value: 'designer',
      title: '🎨 Designer',
      description: 'I design interfaces and want to collaborate better.'
    }, {
      value: 'manager',
      title: '📋 Manager',
      description: 'I lead teams and want to track progress effectively.'
    }, {
      value: 'other',
      title: '🌟 Other',
      description: "I'm exploring what this platform can do for me."
    }];
    const interestOptions: CardListItem[] = [{
      value: 'project-management',
      title: 'Project Management'
    }, {
      value: 'team-collaboration',
      title: 'Team Collaboration'
    }, {
      value: 'code-review',
      title: 'Code Review'
    }, {
      value: 'design-feedback',
      title: 'Design Feedback'
    }, {
      value: 'documentation',
      title: 'Documentation'
    }, {
      value: 'analytics',
      title: 'Analytics'
    }];
    return <div className="card" style={{
      maxWidth: '600px'
    }}>
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Welcome! Let&apos;s personalize your experience</h5>
            <span className="badge bg-secondary">Step {step} of 2</span>
          </div>
        </div>
        <div className="card-body">
          {step === 1 ? <CardList label="What best describes your role?" items={roles} selectionMode="single" value={role} onChange={setRole} gap="0.75rem" /> : <CardList label="What are you interested in?" items={interestOptions} selectionMode="multiple" value={interests} onChange={setInterests} columns={2} gap="0.5rem" helperText="Select all that apply" />}
        </div>
        <div className="card-footer d-flex justify-content-between">
          <button type="button" className="btn btn-outline-secondary" onClick={() => setStep(1)} disabled={step === 1}>
            Back
          </button>
          {step === 1 ? <button type="button" className="btn btn-primary" onClick={() => setStep(2)} disabled={!role}>
              Continue
            </button> : <button type="button" className="btn btn-success" disabled={interests.length === 0} onClick={() => alert(\`Setup complete!\\nRole: \${role}\\nInterests: \${interests.join(', ')}\`)}>
              Complete Setup
            </button>}
        </div>
      </div>;
  }
}`,...(ot=(nt=H.parameters)==null?void 0:nt.docs)==null?void 0:ot.source},description:{story:"Onboarding wizard example",...(dt=(ct=H.parameters)==null?void 0:ct.docs)==null?void 0:dt.description}}};var mt,ut,pt,ht,gt;q.parameters={...q.parameters,docs:{...(mt=q.parameters)==null?void 0:mt.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }}>
      {/* Selection Modes */}
      <section>
        <h5 className="mb-3">Selection Modes</h5>
        <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem'
      }}>
          <CardList label="None" items={showcaseCards.slice(0, 2)} selectionMode="none" />
          <CardList label="Single" items={showcaseCards.slice(0, 2)} selectionMode="single" defaultValue="card1" />
          <CardList label="Multiple" items={showcaseCards.slice(0, 2)} selectionMode="multiple" defaultValue={['card1']} />
        </div>
      </section>

      {/* Variants */}
      <section>
        <h5 className="mb-3">Card Variants</h5>
        <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem'
      }}>
          <CardList label="Elevated" items={showcaseCards.slice(0, 2)} selectionMode="single" variant="elevated" defaultValue="card1" />
          <CardList label="Outlined" items={showcaseCards.slice(0, 2)} selectionMode="single" variant="outlined" defaultValue="card1" />
          <CardList label="Ghost" items={showcaseCards.slice(0, 2)} selectionMode="single" variant="ghost" defaultValue="card1" />
        </div>
      </section>

      {/* States */}
      <section>
        <h5 className="mb-3">States</h5>
        <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem'
      }}>
          <CardList label="Disabled" items={showcaseCards.slice(0, 2)} selectionMode="single" defaultValue="card1" disabled />
          <CardList label="Error" items={showcaseCards.slice(0, 2)} selectionMode="single" error errorMessage="Selection required" />
          <CardList label="Required" items={showcaseCards.slice(0, 2)} selectionMode="single" required />
        </div>
      </section>

      {/* Layout */}
      <section>
        <h5 className="mb-3">Layout Options</h5>
        <div className="mb-3">
          <h6>Horizontal Orientation</h6>
          <CardList label="Quick Select" items={showcaseCards} selectionMode="single" orientation="horizontal" defaultValue="card2" />
        </div>
        <div>
          <h6>Grid (3 columns)</h6>
          <CardList label="Features" items={featureOptions.slice(0, 6)} selectionMode="multiple" columns={3} gap="0.75rem" defaultValue={['analytics', 'api']} />
        </div>
      </section>
    </div>
}`,...(pt=(ut=q.parameters)==null?void 0:ut.docs)==null?void 0:pt.source},description:{story:"Complete showcase of CardList features",...(gt=(ht=q.parameters)==null?void 0:ht.docs)==null?void 0:gt.description}}};const jt=["Default","SingleSelection","MultipleSelection","WithHelperText","SelectionModes","ControlledSingle","ControlledMultiple","CardVariants","SelectedColors","HorizontalOrientation","GridLayout","CustomGap","HorizontalCards","Disabled","DisabledItems","ErrorState","Required","FSMStateVisualization","FormExample","AccessibilityFieldsetLegend","AccessibilityScreenReader","AccessibilityDevWarnings","SecuritySafeAttributes","PricingPageExample","FeatureSelectionExample","OnboardingWizardExample","CompleteShowcase"];export{I as AccessibilityDevWarnings,T as AccessibilityFieldsetLegend,W as AccessibilityScreenReader,j as CardVariants,q as CompleteShowcase,C as ControlledMultiple,S as ControlledSingle,P as CustomGap,b as Default,V as Disabled,k as DisabledItems,A as ErrorState,z as FSMStateVisualization,R as FeatureSelectionExample,D as FormExample,w as GridLayout,L as HorizontalCards,M as HorizontalOrientation,x as MultipleSelection,H as OnboardingWizardExample,O as PricingPageExample,F as Required,E as SecuritySafeAttributes,N as SelectedColors,y as SelectionModes,v as SingleSelection,f as WithHelperText,jt as __namedExportsOrder,Ct as default};
