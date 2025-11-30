import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{K as i}from"./Tabs-KsVJ-pPQ.js";import{r as n}from"./iframe-CyugwH-p.js";import"./preload-helper-Dp1pzeXC.js";const ts={title:"Components/SelectableCard",component:i,parameters:{layout:"padded",docs:{description:{component:"A card that behaves like a checkbox or radio option. Click anywhere on the card to toggle/select, not just the small control."}}},tags:["autodocs"],argTypes:{selectionMode:{control:"select",options:["none","checkbox","radio"],description:"Selection mode for the card",table:{type:{summary:"'none' | 'checkbox' | 'radio'"},defaultValue:{summary:"'none'"}}},checked:{control:"boolean",description:"Controlled checked state",table:{type:{summary:"boolean"}}},defaultChecked:{control:"boolean",description:"Default checked state (uncontrolled)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},disabled:{control:"boolean",description:"Disabled state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},error:{control:"boolean",description:"Error state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},required:{control:"boolean",description:"Required field",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},variant:{control:"select",options:["elevated","outlined","ghost"],description:"Card variant styling",table:{type:{summary:"'elevated' | 'outlined' | 'ghost'"},defaultValue:{summary:"'outlined'"}}},selectedColor:{control:"select",options:[void 0,"primary","secondary","success","danger","warning","info","light","dark"],description:"Background color when selected",table:{type:{summary:"'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'"}}},horizontal:{control:"boolean",description:"Horizontal layout (media on side)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},title:{control:"text",description:"Card title",table:{type:{summary:"ReactNode"}}},subtitle:{control:"text",description:"Card subtitle",table:{type:{summary:"ReactNode"}}},description:{control:"text",description:"Card description",table:{type:{summary:"ReactNode"}}},value:{control:"text",description:"Unique value (required when used in CardList)",table:{type:{summary:"string"}}},name:{control:"text",description:"Form field name (for radio grouping)",table:{type:{summary:"string"}}}}},u={args:{title:"Basic Card",description:"This is a basic selectable card with no selection mode.",selectionMode:"none"}},h={args:{title:"Checkbox Card",description:"Click anywhere on this card to toggle the checkbox.",selectionMode:"checkbox",value:"checkbox-card"}},b={args:{title:"Radio Card",description:"Click anywhere on this card to select it.",selectionMode:"radio",value:"radio-card",name:"radio-group"}},v={render:()=>e.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:[e.jsxs("div",{style:{flex:"1",minWidth:"250px"},children:[e.jsx("h6",{className:"mb-2",children:"None (Display Only)"}),e.jsx(i,{selectionMode:"none",title:"Display Card",description:"No selection control. Just displays content."})]}),e.jsxs("div",{style:{flex:"1",minWidth:"250px"},children:[e.jsx("h6",{className:"mb-2",children:"Checkbox"}),e.jsx(i,{selectionMode:"checkbox",value:"checkbox",title:"Checkbox Card",description:"Can be toggled on/off independently."})]}),e.jsxs("div",{style:{flex:"1",minWidth:"250px"},children:[e.jsx("h6",{className:"mb-2",children:"Radio"}),e.jsx(i,{selectionMode:"radio",value:"radio",name:"mode-demo",title:"Radio Card",description:"Part of a mutually exclusive group."})]})]}),parameters:{docs:{description:{story:"The three selection modes available for SelectableCard."}}}},x={args:{title:"Uncontrolled Card",description:"This card manages its own checked state internally.",selectionMode:"checkbox",value:"uncontrolled",defaultChecked:!0},parameters:{docs:{description:{story:"Uses `defaultChecked` prop. The component manages its own state. Good for simple forms where you only need the final value on submit."}}}},f={render:()=>{const[s,r]=n.useState(!1);return e.jsxs("div",{children:[e.jsx(i,{selectionMode:"checkbox",value:"controlled",title:"Controlled Card",description:`Current state: ${s?"Selected":"Not selected"}`,checked:s,onChange:r}),e.jsxs("div",{className:"mt-3",children:[e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-primary me-2",onClick:()=>r(!0),children:"Select"}),e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary",onClick:()=>r(!1),children:"Deselect"})]})]})},parameters:{docs:{description:{story:"Parent component controls the checked state via `checked` and `onChange` props. Use this when you need to synchronize state with other components or validate before changes."}}}},g={render:()=>{const[s,r]=n.useState("basic"),o=[{value:"basic",title:"Basic Plan",price:"$9/month",description:"5 projects, 10GB storage"},{value:"pro",title:"Pro Plan",price:"$29/month",description:"Unlimited projects, 100GB storage"},{value:"enterprise",title:"Enterprise",price:"Custom",description:"Unlimited everything, priority support"}];return e.jsxs("div",{children:[e.jsxs("p",{className:"text-muted mb-3",children:["Selected: ",s||"none"]}),e.jsx("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:o.map(t=>e.jsx(i,{selectionMode:"radio",name:"pricing-plan",value:t.value,checked:s===t.value,onChange:a=>{a&&r(t.value)},title:t.title,subtitle:t.price,description:t.description,style:{flex:"1",minWidth:"200px"}},t.value))})]})},parameters:{docs:{description:{story:'Radio cards with the same `name` form a group where only one can be selected. Note: For managed radio groups, prefer using `CardList` with `selectionMode="single"`.'}}}},y={render:()=>{const[s,r]=n.useState(new Set(["notifications"])),o=[{value:"notifications",title:"Email Notifications",description:"Receive updates about your account"},{value:"newsletter",title:"Weekly Newsletter",description:"Tips, tricks, and product updates"},{value:"marketing",title:"Marketing Emails",description:"Special offers and promotions"}],t=(a,l)=>{r(m=>{const d=new Set(m);return l?d.add(a):d.delete(a),d})};return e.jsxs("div",{children:[e.jsxs("p",{className:"text-muted mb-3",children:["Selected: ",[...s].join(", ")||"none"]}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"0.75rem"},children:o.map(a=>e.jsx(i,{selectionMode:"checkbox",value:a.value,checked:s.has(a.value),onChange:l=>t(a.value,l),title:a.title,description:a.description},a.value))})]})},parameters:{docs:{description:{story:'Multiple checkbox cards allow independent selection of each option. Note: For managed checkbox groups, prefer using `CardList` with `selectionMode="multiple"`.'}}}},k={render:()=>e.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:[e.jsx(i,{variant:"outlined",selectionMode:"checkbox",value:"outlined",title:"Outlined",description:"Default variant with border",defaultChecked:!0,style:{flex:"1",minWidth:"200px"}}),e.jsx(i,{variant:"elevated",selectionMode:"checkbox",value:"elevated",title:"Elevated",description:"Raised card with shadow",style:{flex:"1",minWidth:"200px"}}),e.jsx(i,{variant:"ghost",selectionMode:"checkbox",value:"ghost",title:"Ghost",description:"Minimal styling",style:{flex:"1",minWidth:"200px"}})]}),parameters:{docs:{description:{story:"SelectableCard supports the same variants as the base Card component."}}}},C={render:()=>{const s=["primary","secondary","success","danger","warning","info"];return e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))",gap:"1rem"},children:s.map(r=>e.jsx(i,{selectionMode:"checkbox",value:r,selectedColor:r,title:r.charAt(0).toUpperCase()+r.slice(1),description:"Click to see selected color",defaultChecked:!0},r))})},parameters:{docs:{description:{story:"The `selectedColor` prop changes the card background color when selected. This provides visual feedback for the selected state."}}}},S={render:()=>e.jsxs("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:[e.jsx(i,{selectionMode:"checkbox",value:"disabled-unchecked",title:"Disabled (Unchecked)",description:"Cannot be selected",disabled:!0,style:{flex:"1",minWidth:"200px"}}),e.jsx(i,{selectionMode:"checkbox",value:"disabled-checked",title:"Disabled (Checked)",description:"Cannot be deselected",disabled:!0,defaultChecked:!0,style:{flex:"1",minWidth:"200px"}})]}),parameters:{docs:{description:{story:"Disabled cards cannot be interacted with and show muted styling."}}}},j={args:{title:"Required Selection",description:"This field is required",selectionMode:"checkbox",value:"error-card",error:!0,required:!0},parameters:{docs:{description:{story:"Error state provides visual feedback for validation errors."}}}},N={args:{title:"Terms and Conditions",description:"You must agree to continue",selectionMode:"checkbox",value:"terms",required:!0},parameters:{docs:{description:{story:"Required cards show a red asterisk (*) indicator next to the title."}}}},w={args:{title:"Product Card",description:"A beautiful product with an image.",selectionMode:"checkbox",value:"media-card",media:e.jsx("img",{src:"https://via.placeholder.com/300x150/e9ecef/495057?text=Product+Image",alt:"Product",style:{width:"100%",height:"150px",objectFit:"cover"}})},parameters:{docs:{description:{story:"Use the `media` prop to add images, icons, or other content at the top of the card."}}}},M={args:{title:"Plan Details",description:"Includes all the features you need.",selectionMode:"checkbox",value:"footer-card",footer:e.jsxs("div",{className:"d-flex justify-content-between align-items-center",children:[e.jsx("span",{className:"text-muted small",children:"Updated 2 days ago"}),e.jsx("span",{className:"badge bg-success",children:"Popular"})]})},parameters:{docs:{description:{story:"Use the `footer` prop to add content at the bottom of the card."}}}},P={args:{title:"Professional Plan",subtitle:"$29/month",description:"Perfect for growing teams with advanced needs.",selectionMode:"checkbox",value:"subtitle-card"},parameters:{docs:{description:{story:"The `subtitle` prop adds secondary text below the title, ideal for pricing or metadata."}}}},A={render:()=>e.jsx(i,{selectionMode:"checkbox",value:"custom-children",defaultChecked:!0,children:e.jsxs("div",{children:[e.jsx("h5",{className:"card-title",children:"Custom Content"}),e.jsxs("p",{className:"card-text",children:["Use ",e.jsx("code",{children:"children"})," for completely custom card content."]}),e.jsxs("ul",{className:"list-unstyled mb-0",children:[e.jsx("li",{children:"✓ Feature one"}),e.jsx("li",{children:"✓ Feature two"}),e.jsx("li",{children:"✓ Feature three"})]})]})}),parameters:{docs:{description:{story:"Use `children` instead of `title`/`description` props for fully custom card content. The checkbox control is still rendered automatically."}}}},T={args:{title:"Horizontal Card",description:"Media appears on the left side in horizontal mode.",selectionMode:"checkbox",value:"horizontal-card",horizontal:!0,media:e.jsx("img",{src:"https://via.placeholder.com/100x100/e9ecef/495057?text=Icon",alt:"Icon",style:{width:"100px",height:"100px",objectFit:"cover"}})},parameters:{docs:{description:{story:"Set `horizontal` to true for a side-by-side layout with media on the left."}}}},q={render:()=>{const[s,r]=n.useState({selectionMode:"checkbox",checked:!1,disabled:!1,error:!1,required:!1,variant:"outlined",selectedColor:void 0});return e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-6 mb-4",children:[e.jsx("h6",{children:"Preview"}),e.jsx(i,{selectionMode:s.selectionMode,value:"demo",name:"demo-group",checked:s.checked,onChange:o=>r(t=>({...t,checked:o})),disabled:s.disabled,error:s.error,required:s.required,variant:s.variant,selectedColor:s.selectedColor,title:"Interactive Card",subtitle:"$19.99/month",description:"Toggle the controls to see how the card responds."})]}),e.jsxs("div",{className:"col-md-6",children:[e.jsx("h6",{children:"Controls"}),e.jsxs("div",{className:"d-flex flex-column gap-2",children:[e.jsxs("label",{className:"form-check",children:[e.jsx("input",{type:"checkbox",className:"form-check-input",checked:s.checked,onChange:o=>r(t=>({...t,checked:o.target.checked}))}),e.jsx("span",{className:"form-check-label",children:"Checked"})]}),e.jsxs("label",{className:"form-check",children:[e.jsx("input",{type:"checkbox",className:"form-check-input",checked:s.disabled,onChange:o=>r(t=>({...t,disabled:o.target.checked}))}),e.jsx("span",{className:"form-check-label",children:"Disabled"})]}),e.jsxs("label",{className:"form-check",children:[e.jsx("input",{type:"checkbox",className:"form-check-input",checked:s.error,onChange:o=>r(t=>({...t,error:o.target.checked}))}),e.jsx("span",{className:"form-check-label",children:"Error"})]}),e.jsxs("label",{className:"form-check",children:[e.jsx("input",{type:"checkbox",className:"form-check-input",checked:s.required,onChange:o=>r(t=>({...t,required:o.target.checked}))}),e.jsx("span",{className:"form-check-label",children:"Required"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"demo-selection-mode",className:"form-label small",children:"Selection Mode"}),e.jsxs("select",{id:"demo-selection-mode",className:"form-select form-select-sm",value:s.selectionMode,onChange:o=>r(t=>({...t,selectionMode:o.target.value})),children:[e.jsx("option",{value:"none",children:"None"}),e.jsx("option",{value:"checkbox",children:"Checkbox"}),e.jsx("option",{value:"radio",children:"Radio"})]})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"demo-selected-color",className:"form-label small",children:"Selected Color"}),e.jsxs("select",{id:"demo-selected-color",className:"form-select form-select-sm",value:s.selectedColor||"",onChange:o=>r(t=>({...t,selectedColor:o.target.value?o.target.value:void 0})),children:[e.jsx("option",{value:"",children:"None"}),e.jsx("option",{value:"primary",children:"Primary"}),e.jsx("option",{value:"success",children:"Success"})]})]})]})]})]})},parameters:{docs:{description:{story:"An interactive demo showing all the different states and options available."}}}},D={render:()=>{const[s,r]=n.useState("pro"),o=[{value:"starter",name:"Starter",price:"Free",features:["1 project","1GB storage","Community support"],badge:null},{value:"pro",name:"Pro",price:"$29/mo",features:["10 projects","50GB storage","Email support","API access"],badge:"Most Popular"},{value:"enterprise",name:"Enterprise",price:"$99/mo",features:["Unlimited projects","500GB storage","Priority support","SSO","SLA"],badge:null}];return e.jsxs("div",{children:[e.jsx("h5",{className:"mb-4",children:"Choose Your Plan"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(250px, 1fr))",gap:"1rem"},children:o.map(t=>e.jsx(i,{selectionMode:"radio",name:"pricing-tier",value:t.value,checked:s===t.value,onChange:a=>{a&&r(t.value)},selectedColor:s===t.value?"primary":void 0,children:e.jsxs("div",{className:"text-center py-2",children:[t.badge&&e.jsx("span",{className:"badge bg-primary mb-2",children:t.badge}),e.jsx("h4",{className:"mb-1",children:t.name}),e.jsx("p",{className:"h3 mb-3",children:t.price}),e.jsx("ul",{className:"list-unstyled text-start small",children:t.features.map(a=>e.jsxs("li",{className:"mb-1",children:["✓ ",a]},a))})]})},t.value))}),e.jsxs("p",{className:"text-muted mt-3",children:["Selected: ",s]})]})},parameters:{docs:{description:{story:"A common use case: selecting a pricing tier from multiple options."}}}},F={render:()=>{const[s,r]=n.useState(new Set(["dark-mode","notifications"])),o=[{value:"dark-mode",icon:"🌙",title:"Dark Mode",description:"Use dark theme across the application"},{value:"notifications",icon:"🔔",title:"Push Notifications",description:"Receive real-time alerts and updates"},{value:"analytics",icon:"📊",title:"Analytics",description:"Track usage and performance metrics"},{value:"ai-assist",icon:"🤖",title:"AI Assistant",description:"Get intelligent suggestions and help"}],t=(a,l)=>{r(m=>{const d=new Set(m);return l?d.add(a):d.delete(a),d})};return e.jsxs("div",{children:[e.jsx("h5",{className:"mb-4",children:"Customize Your Experience"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))",gap:"1rem"},children:o.map(a=>e.jsx(i,{selectionMode:"checkbox",value:a.value,checked:s.has(a.value),onChange:l=>t(a.value,l),selectedColor:s.has(a.value)?"success":void 0,children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{style:{fontSize:"2rem"},children:a.icon}),e.jsx("h6",{className:"mt-2 mb-1",children:a.title}),e.jsx("p",{className:"small text-muted mb-0",children:a.description})]})},a.value))}),e.jsxs("p",{className:"text-muted mt-3",children:["Enabled: ",s.size>0?[...s].join(", "):"None"]})]})},parameters:{docs:{description:{story:"Checkbox cards work great for enabling/disabling multiple features."}}}},W={render:()=>{const[s,r]=n.useState(null),o=[{value:"very-satisfied",emoji:"😄",label:"Very Satisfied"},{value:"satisfied",emoji:"🙂",label:"Satisfied"},{value:"neutral",emoji:"😐",label:"Neutral"},{value:"dissatisfied",emoji:"🙁",label:"Dissatisfied"},{value:"very-dissatisfied",emoji:"😞",label:"Very Dissatisfied"}];return e.jsxs("div",{style:{maxWidth:"600px"},children:[e.jsx("h5",{className:"mb-2",children:"How satisfied are you with our service?"}),e.jsx("p",{className:"text-muted small mb-4",children:"Select one option"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:o.map(t=>e.jsx(i,{selectionMode:"radio",name:"satisfaction",value:t.value,checked:s===t.value,onChange:a=>{a&&r(t.value)},selectedColor:"primary",children:e.jsxs("div",{className:"d-flex align-items-center gap-3",children:[e.jsx("span",{style:{fontSize:"1.5rem"},children:t.emoji}),e.jsx("span",{children:t.label})]})},t.value))}),s&&e.jsxs("div",{className:"alert alert-success mt-3",children:["Thank you for your feedback! You selected: ",e.jsx("strong",{children:s})]})]})},parameters:{docs:{description:{story:"Survey or quiz questions with visual card-based options."}}}},R={render:()=>e.jsxs("div",{children:[e.jsx("h5",{className:"mb-3",children:"Accessibility Features"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(i,{selectionMode:"checkbox",value:"aria-label-demo","aria-label":"Select the premium subscription plan",title:"With aria-label",description:"Has a custom aria-label for screen readers."}),e.jsx(i,{selectionMode:"checkbox",value:"required-demo",required:!0,title:"Required Field",description:"Shows required indicator and passes required to input."}),e.jsx(i,{selectionMode:"radio",name:"a11y-group",value:"keyboard-demo",title:"Keyboard Navigable",description:"Tab to focus, Space/Enter to select. Arrow keys for radio groups."})]}),e.jsxs("div",{className:"alert alert-info mt-4",children:[e.jsx("strong",{children:"Accessibility Notes:"}),e.jsxs("ul",{className:"mb-0 mt-2",children:[e.jsx("li",{children:"Uses native checkbox/radio inputs for screen reader support"}),e.jsxs("li",{children:["Card is wrapped in a ",e.jsx("code",{children:"<label>"})," for click-anywhere behavior"]}),e.jsxs("li",{children:["Supports ",e.jsx("code",{children:"aria-label"}),", ",e.jsx("code",{children:"aria-labelledby"}),", and"," ",e.jsx("code",{children:"aria-describedby"})]}),e.jsx("li",{children:"Shows development warnings for missing accessibility attributes"})]})]})]}),parameters:{docs:{description:{story:"SelectableCard includes comprehensive accessibility support following WCAG 2.2 AA guidelines."}}}},U={render:()=>{var d;const[s,r]=n.useState("basic"),[o,t]=n.useState(new Set),a=[{value:"basic",title:"Basic",price:"$0",desc:"For individuals"},{value:"pro",title:"Pro",price:"$19",desc:"For professionals"},{value:"team",title:"Team",price:"$49",desc:"For small teams"}],l=[{value:"support",title:"Priority Support",price:"+$10/mo"},{value:"storage",title:"Extra Storage",price:"+$5/mo"},{value:"analytics",title:"Advanced Analytics",price:"+$15/mo"}],m=(c,p)=>{t(E=>{const z=new Set(E);return p?z.add(c):z.delete(c),z})};return e.jsxs("div",{children:[e.jsxs("div",{className:"mb-5",children:[e.jsx("h5",{className:"mb-3",children:"1. Choose Your Plan (Radio)"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"1rem"},children:a.map(c=>e.jsx(i,{selectionMode:"radio",name:"showcase-plan",value:c.value,checked:s===c.value,onChange:p=>{p&&r(c.value)},title:c.title,subtitle:c.price,description:c.desc,selectedColor:"primary"},c.value))})]}),e.jsxs("div",{className:"mb-5",children:[e.jsx("h5",{className:"mb-3",children:"2. Select Add-ons (Checkbox)"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"0.75rem"},children:l.map(c=>e.jsx(i,{selectionMode:"checkbox",value:c.value,checked:o.has(c.value),onChange:p=>m(c.value,p),title:c.title,subtitle:c.price,selectedColor:"success"},c.value))})]}),e.jsx("div",{className:"card bg-light",children:e.jsxs("div",{className:"card-body",children:[e.jsx("h6",{className:"card-title",children:"Your Selection"}),e.jsxs("p",{className:"mb-1",children:[e.jsx("strong",{children:"Plan:"})," ",(d=a.find(c=>c.value===s))==null?void 0:d.title]}),e.jsxs("p",{className:"mb-0",children:[e.jsx("strong",{children:"Add-ons:"})," ",o.size>0?[...o].map(c=>{var p;return(p=l.find(E=>E.value===c))==null?void 0:p.title}).join(", "):"None"]})]})})]})},parameters:{docs:{description:{story:"A complete showcase combining radio cards for single selection and checkbox cards for multiple selections in a realistic checkout flow."}}}};var $,O,G,I,B;u.parameters={...u.parameters,docs:{...($=u.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    title: 'Basic Card',
    description: 'This is a basic selectable card with no selection mode.',
    selectionMode: 'none'
  }
}`,...(G=(O=u.parameters)==null?void 0:O.docs)==null?void 0:G.source},description:{story:`Default SelectableCard with no selection mode.
Acts as a regular display card.`,...(B=(I=u.parameters)==null?void 0:I.docs)==null?void 0:B.description}}};var L,V,Y,H,K;h.parameters={...h.parameters,docs:{...(L=h.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    title: 'Checkbox Card',
    description: 'Click anywhere on this card to toggle the checkbox.',
    selectionMode: 'checkbox',
    value: 'checkbox-card'
  }
}`,...(Y=(V=h.parameters)==null?void 0:V.docs)==null?void 0:Y.source},description:{story:`SelectableCard with checkbox mode.
Click anywhere on the card to toggle the checkbox.`,...(K=(H=h.parameters)==null?void 0:H.docs)==null?void 0:K.description}}};var J,Q,_,X,Z;b.parameters={...b.parameters,docs:{...(J=b.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    title: 'Radio Card',
    description: 'Click anywhere on this card to select it.',
    selectionMode: 'radio',
    value: 'radio-card',
    name: 'radio-group'
  }
}`,...(_=(Q=b.parameters)==null?void 0:Q.docs)==null?void 0:_.source},description:{story:`SelectableCard with radio mode.
Used when only one option can be selected from a group.`,...(Z=(X=b.parameters)==null?void 0:X.docs)==null?void 0:Z.description}}};var ee,te,se,ae,re;v.parameters={...v.parameters,docs:{...(ee=v.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  }}>
      <div style={{
      flex: '1',
      minWidth: '250px'
    }}>
        <h6 className="mb-2">None (Display Only)</h6>
        <SelectableCard selectionMode="none" title="Display Card" description="No selection control. Just displays content." />
      </div>
      <div style={{
      flex: '1',
      minWidth: '250px'
    }}>
        <h6 className="mb-2">Checkbox</h6>
        <SelectableCard selectionMode="checkbox" value="checkbox" title="Checkbox Card" description="Can be toggled on/off independently." />
      </div>
      <div style={{
      flex: '1',
      minWidth: '250px'
    }}>
        <h6 className="mb-2">Radio</h6>
        <SelectableCard selectionMode="radio" value="radio" name="mode-demo" title="Radio Card" description="Part of a mutually exclusive group." />
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'The three selection modes available for SelectableCard.'
      }
    }
  }
}`,...(se=(te=v.parameters)==null?void 0:te.docs)==null?void 0:se.source},description:{story:"Comparison of all three selection modes side by side.",...(re=(ae=v.parameters)==null?void 0:ae.docs)==null?void 0:re.description}}};var oe,ie,ce,le,de;x.parameters={...x.parameters,docs:{...(oe=x.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  args: {
    title: 'Uncontrolled Card',
    description: 'This card manages its own checked state internally.',
    selectionMode: 'checkbox',
    value: 'uncontrolled',
    defaultChecked: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Uses \`defaultChecked\` prop. The component manages its own state. ' + 'Good for simple forms where you only need the final value on submit.'
      }
    }
  }
}`,...(ce=(ie=x.parameters)==null?void 0:ie.docs)==null?void 0:ce.source},description:{story:"Uncontrolled SelectableCard manages its own state.\nUses `defaultChecked` for initial value.",...(de=(le=x.parameters)==null?void 0:le.docs)==null?void 0:de.description}}};var ne,pe,me,ue,he;f.parameters={...f.parameters,docs:{...(ne=f.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: () => {
    const [isChecked, setIsChecked] = useState(false);
    return <div>
        <SelectableCard selectionMode="checkbox" value="controlled" title="Controlled Card" description={\`Current state: \${isChecked ? 'Selected' : 'Not selected'}\`} checked={isChecked} onChange={setIsChecked} />
        <div className="mt-3">
          <button type="button" className="btn btn-sm btn-outline-primary me-2" onClick={() => setIsChecked(true)}>
            Select
          </button>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setIsChecked(false)}>
            Deselect
          </button>
        </div>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Parent component controls the checked state via \`checked\` and \`onChange\` props. ' + 'Use this when you need to synchronize state with other components or validate before changes.'
      }
    }
  }
}`,...(me=(pe=f.parameters)==null?void 0:pe.docs)==null?void 0:me.source},description:{story:"Controlled SelectableCard where parent manages state.",...(he=(ue=f.parameters)==null?void 0:ue.docs)==null?void 0:he.description}}};var be,ve,xe,fe,ge;g.parameters={...g.parameters,docs:{...(be=g.parameters)==null?void 0:be.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = useState<string | null>('basic');
    const plans = [{
      value: 'basic',
      title: 'Basic Plan',
      price: '$9/month',
      description: '5 projects, 10GB storage'
    }, {
      value: 'pro',
      title: 'Pro Plan',
      price: '$29/month',
      description: 'Unlimited projects, 100GB storage'
    }, {
      value: 'enterprise',
      title: 'Enterprise',
      price: 'Custom',
      description: 'Unlimited everything, priority support'
    }];
    return <div>
        <p className="text-muted mb-3">Selected: {selected || 'none'}</p>
        <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
          {plans.map(plan => <SelectableCard key={plan.value} selectionMode="radio" name="pricing-plan" value={plan.value} checked={selected === plan.value} onChange={checked => {
          if (checked) setSelected(plan.value);
        }} title={plan.title} subtitle={plan.price} description={plan.description} style={{
          flex: '1',
          minWidth: '200px'
        }} />)}
        </div>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Radio cards with the same \`name\` form a group where only one can be selected. ' + 'Note: For managed radio groups, prefer using \`CardList\` with \`selectionMode="single"\`.'
      }
    }
  }
}`,...(xe=(ve=g.parameters)==null?void 0:ve.docs)==null?void 0:xe.source},description:{story:`Multiple radio cards forming a group.
Only one can be selected at a time.`,...(ge=(fe=g.parameters)==null?void 0:fe.docs)==null?void 0:ge.description}}};var ye,ke,Ce,Se,je;y.parameters={...y.parameters,docs:{...(ye=y.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = useState<Set<string>>(new Set(['notifications']));
    const features = [{
      value: 'notifications',
      title: 'Email Notifications',
      description: 'Receive updates about your account'
    }, {
      value: 'newsletter',
      title: 'Weekly Newsletter',
      description: 'Tips, tricks, and product updates'
    }, {
      value: 'marketing',
      title: 'Marketing Emails',
      description: 'Special offers and promotions'
    }];
    const toggleFeature = (value: string, checked: boolean) => {
      setSelected(prev => {
        const next = new Set(prev);
        if (checked) {
          next.add(value);
        } else {
          next.delete(value);
        }
        return next;
      });
    };
    return <div>
        <p className="text-muted mb-3">Selected: {[...selected].join(', ') || 'none'}</p>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
          {features.map(feature => <SelectableCard key={feature.value} selectionMode="checkbox" value={feature.value} checked={selected.has(feature.value)} onChange={checked => toggleFeature(feature.value, checked)} title={feature.title} description={feature.description} />)}
        </div>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple checkbox cards allow independent selection of each option. ' + 'Note: For managed checkbox groups, prefer using \`CardList\` with \`selectionMode="multiple"\`.'
      }
    }
  }
}`,...(Ce=(ke=y.parameters)==null?void 0:ke.docs)==null?void 0:Ce.source},description:{story:"Multiple checkbox cards for multi-selection.",...(je=(Se=y.parameters)==null?void 0:Se.docs)==null?void 0:je.description}}};var Ne,we,Me,Pe,Ae;k.parameters={...k.parameters,docs:{...(Ne=k.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  }}>
      <SelectableCard variant="outlined" selectionMode="checkbox" value="outlined" title="Outlined" description="Default variant with border" defaultChecked style={{
      flex: '1',
      minWidth: '200px'
    }} />
      <SelectableCard variant="elevated" selectionMode="checkbox" value="elevated" title="Elevated" description="Raised card with shadow" style={{
      flex: '1',
      minWidth: '200px'
    }} />
      <SelectableCard variant="ghost" selectionMode="checkbox" value="ghost" title="Ghost" description="Minimal styling" style={{
      flex: '1',
      minWidth: '200px'
    }} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'SelectableCard supports the same variants as the base Card component.'
      }
    }
  }
}`,...(Me=(we=k.parameters)==null?void 0:we.docs)==null?void 0:Me.source},description:{story:"Different card variants (outlined, elevated, ghost).",...(Ae=(Pe=k.parameters)==null?void 0:Pe.docs)==null?void 0:Ae.description}}};var Te,qe,De,Fe,We;C.parameters={...C.parameters,docs:{...(Te=C.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  render: () => {
    const colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'] as const;
    return <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '1rem'
    }}>
        {colors.map(color => <SelectableCard key={color} selectionMode="checkbox" value={color} selectedColor={color} title={color.charAt(0).toUpperCase() + color.slice(1)} description="Click to see selected color" defaultChecked />)}
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'The \`selectedColor\` prop changes the card background color when selected. ' + 'This provides visual feedback for the selected state.'
      }
    }
  }
}`,...(De=(qe=C.parameters)==null?void 0:qe.docs)==null?void 0:De.source},description:{story:"Selected color variants applied when card is checked.",...(We=(Fe=C.parameters)==null?void 0:Fe.docs)==null?void 0:We.description}}};var Re,Ue,Ee,ze,$e;S.parameters={...S.parameters,docs:{...(Re=S.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  }}>
      <SelectableCard selectionMode="checkbox" value="disabled-unchecked" title="Disabled (Unchecked)" description="Cannot be selected" disabled style={{
      flex: '1',
      minWidth: '200px'
    }} />
      <SelectableCard selectionMode="checkbox" value="disabled-checked" title="Disabled (Checked)" description="Cannot be deselected" disabled defaultChecked style={{
      flex: '1',
      minWidth: '200px'
    }} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Disabled cards cannot be interacted with and show muted styling.'
      }
    }
  }
}`,...(Ee=(Ue=S.parameters)==null?void 0:Ue.docs)==null?void 0:Ee.source},description:{story:"Disabled state prevents interaction.",...($e=(ze=S.parameters)==null?void 0:ze.docs)==null?void 0:$e.description}}};var Oe,Ge,Ie,Be,Le;j.parameters={...j.parameters,docs:{...(Oe=j.parameters)==null?void 0:Oe.docs,source:{originalSource:`{
  args: {
    title: 'Required Selection',
    description: 'This field is required',
    selectionMode: 'checkbox',
    value: 'error-card',
    error: true,
    required: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Error state provides visual feedback for validation errors.'
      }
    }
  }
}`,...(Ie=(Ge=j.parameters)==null?void 0:Ge.docs)==null?void 0:Ie.source},description:{story:"Error state for validation feedback.",...(Le=(Be=j.parameters)==null?void 0:Be.docs)==null?void 0:Le.description}}};var Ve,Ye,He,Ke,Je;N.parameters={...N.parameters,docs:{...(Ve=N.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  args: {
    title: 'Terms and Conditions',
    description: 'You must agree to continue',
    selectionMode: 'checkbox',
    value: 'terms',
    required: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Required cards show a red asterisk (*) indicator next to the title.'
      }
    }
  }
}`,...(He=(Ye=N.parameters)==null?void 0:Ye.docs)==null?void 0:He.source},description:{story:"Required field indicator.",...(Je=(Ke=N.parameters)==null?void 0:Ke.docs)==null?void 0:Je.description}}};var Qe,_e,Xe,Ze,et;w.parameters={...w.parameters,docs:{...(Qe=w.parameters)==null?void 0:Qe.docs,source:{originalSource:`{
  args: {
    title: 'Product Card',
    description: 'A beautiful product with an image.',
    selectionMode: 'checkbox',
    value: 'media-card',
    media: <img src="https://via.placeholder.com/300x150/e9ecef/495057?text=Product+Image" alt="Product" style={{
      width: '100%',
      height: '150px',
      objectFit: 'cover'
    }} />
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the \`media\` prop to add images, icons, or other content at the top of the card.'
      }
    }
  }
}`,...(Xe=(_e=w.parameters)==null?void 0:_e.docs)==null?void 0:Xe.source},description:{story:"Card with media content (image at top).",...(et=(Ze=w.parameters)==null?void 0:Ze.docs)==null?void 0:et.description}}};var tt,st,at,rt,ot;M.parameters={...M.parameters,docs:{...(tt=M.parameters)==null?void 0:tt.docs,source:{originalSource:`{
  args: {
    title: 'Plan Details',
    description: 'Includes all the features you need.',
    selectionMode: 'checkbox',
    value: 'footer-card',
    footer: <div className="d-flex justify-content-between align-items-center">
        <span className="text-muted small">Updated 2 days ago</span>
        <span className="badge bg-success">Popular</span>
      </div>
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the \`footer\` prop to add content at the bottom of the card.'
      }
    }
  }
}`,...(at=(st=M.parameters)==null?void 0:st.docs)==null?void 0:at.source},description:{story:"Card with footer content.",...(ot=(rt=M.parameters)==null?void 0:rt.docs)==null?void 0:ot.description}}};var it,ct,lt,dt,nt;P.parameters={...P.parameters,docs:{...(it=P.parameters)==null?void 0:it.docs,source:{originalSource:`{
  args: {
    title: 'Professional Plan',
    subtitle: '$29/month',
    description: 'Perfect for growing teams with advanced needs.',
    selectionMode: 'checkbox',
    value: 'subtitle-card'
  },
  parameters: {
    docs: {
      description: {
        story: 'The \`subtitle\` prop adds secondary text below the title, ideal for pricing or metadata.'
      }
    }
  }
}`,...(lt=(ct=P.parameters)==null?void 0:ct.docs)==null?void 0:lt.source},description:{story:"Card with title and subtitle.",...(nt=(dt=P.parameters)==null?void 0:dt.docs)==null?void 0:nt.description}}};var pt,mt,ut,ht,bt;A.parameters={...A.parameters,docs:{...(pt=A.parameters)==null?void 0:pt.docs,source:{originalSource:`{
  render: () => <SelectableCard selectionMode="checkbox" value="custom-children" defaultChecked>
      <div>
        <h5 className="card-title">Custom Content</h5>
        <p className="card-text">
          Use <code>children</code> for completely custom card content.
        </p>
        <ul className="list-unstyled mb-0">
          <li>✓ Feature one</li>
          <li>✓ Feature two</li>
          <li>✓ Feature three</li>
        </ul>
      </div>
    </SelectableCard>,
  parameters: {
    docs: {
      description: {
        story: 'Use \`children\` instead of \`title\`/\`description\` props for fully custom card content. ' + 'The checkbox control is still rendered automatically.'
      }
    }
  }
}`,...(ut=(mt=A.parameters)==null?void 0:mt.docs)==null?void 0:ut.source},description:{story:"Card with custom children instead of structured content.",...(bt=(ht=A.parameters)==null?void 0:ht.docs)==null?void 0:bt.description}}};var vt,xt,ft,gt,yt;T.parameters={...T.parameters,docs:{...(vt=T.parameters)==null?void 0:vt.docs,source:{originalSource:`{
  args: {
    title: 'Horizontal Card',
    description: 'Media appears on the left side in horizontal mode.',
    selectionMode: 'checkbox',
    value: 'horizontal-card',
    horizontal: true,
    media: <img src="https://via.placeholder.com/100x100/e9ecef/495057?text=Icon" alt="Icon" style={{
      width: '100px',
      height: '100px',
      objectFit: 'cover'
    }} />
  },
  parameters: {
    docs: {
      description: {
        story: 'Set \`horizontal\` to true for a side-by-side layout with media on the left.'
      }
    }
  }
}`,...(ft=(xt=T.parameters)==null?void 0:xt.docs)==null?void 0:ft.source},description:{story:"Horizontal layout with media on the side.",...(yt=(gt=T.parameters)==null?void 0:gt.docs)==null?void 0:yt.description}}};var kt,Ct,St,jt,Nt;q.parameters={...q.parameters,docs:{...(kt=q.parameters)==null?void 0:kt.docs,source:{originalSource:`{
  render: () => {
    const [state, setState] = useState<{
      selectionMode: 'none' | 'checkbox' | 'radio';
      checked: boolean;
      disabled: boolean;
      error: boolean;
      required: boolean;
      variant: 'outlined' | 'elevated' | 'ghost';
      selectedColor: 'primary' | 'success' | undefined;
    }>({
      selectionMode: 'checkbox',
      checked: false,
      disabled: false,
      error: false,
      required: false,
      variant: 'outlined',
      selectedColor: undefined
    });
    return <div className="row">
        <div className="col-md-6 mb-4">
          <h6>Preview</h6>
          <SelectableCard selectionMode={state.selectionMode} value="demo" name="demo-group" checked={state.checked} onChange={checked => setState(s => ({
          ...s,
          checked
        }))} disabled={state.disabled} error={state.error} required={state.required} variant={state.variant} selectedColor={state.selectedColor} title="Interactive Card" subtitle="$19.99/month" description="Toggle the controls to see how the card responds." />
        </div>
        <div className="col-md-6">
          <h6>Controls</h6>
          <div className="d-flex flex-column gap-2">
            <label className="form-check">
              <input type="checkbox" className="form-check-input" checked={state.checked} onChange={e => setState(s => ({
              ...s,
              checked: e.target.checked
            }))} />
              <span className="form-check-label">Checked</span>
            </label>
            <label className="form-check">
              <input type="checkbox" className="form-check-input" checked={state.disabled} onChange={e => setState(s => ({
              ...s,
              disabled: e.target.checked
            }))} />
              <span className="form-check-label">Disabled</span>
            </label>
            <label className="form-check">
              <input type="checkbox" className="form-check-input" checked={state.error} onChange={e => setState(s => ({
              ...s,
              error: e.target.checked
            }))} />
              <span className="form-check-label">Error</span>
            </label>
            <label className="form-check">
              <input type="checkbox" className="form-check-input" checked={state.required} onChange={e => setState(s => ({
              ...s,
              required: e.target.checked
            }))} />
              <span className="form-check-label">Required</span>
            </label>
            <div>
              <label htmlFor="demo-selection-mode" className="form-label small">
                Selection Mode
              </label>
              <select id="demo-selection-mode" className="form-select form-select-sm" value={state.selectionMode} onChange={e => setState(s => ({
              ...s,
              selectionMode: e.target.value as 'none' | 'checkbox' | 'radio'
            }))}>
                <option value="none">None</option>
                <option value="checkbox">Checkbox</option>
                <option value="radio">Radio</option>
              </select>
            </div>
            <div>
              <label htmlFor="demo-selected-color" className="form-label small">
                Selected Color
              </label>
              <select id="demo-selected-color" className="form-select form-select-sm" value={state.selectedColor || ''} onChange={e => setState(s => ({
              ...s,
              selectedColor: e.target.value ? e.target.value as 'primary' | 'success' : undefined
            }))}>
                <option value="">None</option>
                <option value="primary">Primary</option>
                <option value="success">Success</option>
              </select>
            </div>
          </div>
        </div>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'An interactive demo showing all the different states and options available.'
      }
    }
  }
}`,...(St=(Ct=q.parameters)==null?void 0:Ct.docs)==null?void 0:St.source},description:{story:"Interactive demo with state display and controls.",...(Nt=(jt=q.parameters)==null?void 0:jt.docs)==null?void 0:Nt.description}}};var wt,Mt,Pt,At,Tt;D.parameters={...D.parameters,docs:{...(wt=D.parameters)==null?void 0:wt.docs,source:{originalSource:`{
  render: () => {
    const [selectedTier, setSelectedTier] = useState('pro');
    const tiers = [{
      value: 'starter',
      name: 'Starter',
      price: 'Free',
      features: ['1 project', '1GB storage', 'Community support'],
      badge: null
    }, {
      value: 'pro',
      name: 'Pro',
      price: '$29/mo',
      features: ['10 projects', '50GB storage', 'Email support', 'API access'],
      badge: 'Most Popular'
    }, {
      value: 'enterprise',
      name: 'Enterprise',
      price: '$99/mo',
      features: ['Unlimited projects', '500GB storage', 'Priority support', 'SSO', 'SLA'],
      badge: null
    }];
    return <div>
        <h5 className="mb-4">Choose Your Plan</h5>
        <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem'
      }}>
          {tiers.map(tier => <SelectableCard key={tier.value} selectionMode="radio" name="pricing-tier" value={tier.value} checked={selectedTier === tier.value} onChange={checked => {
          if (checked) setSelectedTier(tier.value);
        }} selectedColor={selectedTier === tier.value ? 'primary' : undefined}>
              <div className="text-center py-2">
                {tier.badge && <span className="badge bg-primary mb-2">{tier.badge}</span>}
                <h4 className="mb-1">{tier.name}</h4>
                <p className="h3 mb-3">{tier.price}</p>
                <ul className="list-unstyled text-start small">
                  {tier.features.map(feature => <li key={feature} className="mb-1">
                      ✓ {feature}
                    </li>)}
                </ul>
              </div>
            </SelectableCard>)}
        </div>
        <p className="text-muted mt-3">Selected: {selectedTier}</p>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'A common use case: selecting a pricing tier from multiple options.'
      }
    }
  }
}`,...(Pt=(Mt=D.parameters)==null?void 0:Mt.docs)==null?void 0:Pt.source},description:{story:"Pricing tier selection (common use case).",...(Tt=(At=D.parameters)==null?void 0:At.docs)==null?void 0:Tt.description}}};var qt,Dt,Ft,Wt,Rt;F.parameters={...F.parameters,docs:{...(qt=F.parameters)==null?void 0:qt.docs,source:{originalSource:`{
  render: () => {
    const [features, setFeatures] = useState<Set<string>>(new Set(['dark-mode', 'notifications']));
    const featureList = [{
      value: 'dark-mode',
      icon: '🌙',
      title: 'Dark Mode',
      description: 'Use dark theme across the application'
    }, {
      value: 'notifications',
      icon: '🔔',
      title: 'Push Notifications',
      description: 'Receive real-time alerts and updates'
    }, {
      value: 'analytics',
      icon: '📊',
      title: 'Analytics',
      description: 'Track usage and performance metrics'
    }, {
      value: 'ai-assist',
      icon: '🤖',
      title: 'AI Assistant',
      description: 'Get intelligent suggestions and help'
    }];
    const toggleFeature = (value: string, checked: boolean) => {
      setFeatures(prev => {
        const next = new Set(prev);
        if (checked) next.add(value);else next.delete(value);
        return next;
      });
    };
    return <div>
        <h5 className="mb-4">Customize Your Experience</h5>
        <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1rem'
      }}>
          {featureList.map(feature => <SelectableCard key={feature.value} selectionMode="checkbox" value={feature.value} checked={features.has(feature.value)} onChange={checked => toggleFeature(feature.value, checked)} selectedColor={features.has(feature.value) ? 'success' : undefined}>
              <div className="text-center">
                <div style={{
              fontSize: '2rem'
            }}>{feature.icon}</div>
                <h6 className="mt-2 mb-1">{feature.title}</h6>
                <p className="small text-muted mb-0">{feature.description}</p>
              </div>
            </SelectableCard>)}
        </div>
        <p className="text-muted mt-3">
          Enabled: {features.size > 0 ? [...features].join(', ') : 'None'}
        </p>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Checkbox cards work great for enabling/disabling multiple features.'
      }
    }
  }
}`,...(Ft=(Dt=F.parameters)==null?void 0:Dt.docs)==null?void 0:Ft.source},description:{story:"Feature toggles with checkbox cards.",...(Rt=(Wt=F.parameters)==null?void 0:Wt.docs)==null?void 0:Rt.description}}};var Ut,Et,zt,$t,Ot;W.parameters={...W.parameters,docs:{...(Ut=W.parameters)==null?void 0:Ut.docs,source:{originalSource:`{
  render: () => {
    const [answer, setAnswer] = useState<string | null>(null);
    const options = [{
      value: 'very-satisfied',
      emoji: '😄',
      label: 'Very Satisfied'
    }, {
      value: 'satisfied',
      emoji: '🙂',
      label: 'Satisfied'
    }, {
      value: 'neutral',
      emoji: '😐',
      label: 'Neutral'
    }, {
      value: 'dissatisfied',
      emoji: '🙁',
      label: 'Dissatisfied'
    }, {
      value: 'very-dissatisfied',
      emoji: '😞',
      label: 'Very Dissatisfied'
    }];
    return <div style={{
      maxWidth: '600px'
    }}>
        <h5 className="mb-2">How satisfied are you with our service?</h5>
        <p className="text-muted small mb-4">Select one option</p>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
          {options.map(option => <SelectableCard key={option.value} selectionMode="radio" name="satisfaction" value={option.value} checked={answer === option.value} onChange={checked => {
          if (checked) setAnswer(option.value);
        }} selectedColor="primary">
              <div className="d-flex align-items-center gap-3">
                <span style={{
              fontSize: '1.5rem'
            }}>{option.emoji}</span>
                <span>{option.label}</span>
              </div>
            </SelectableCard>)}
        </div>
        {answer && <div className="alert alert-success mt-3">
            Thank you for your feedback! You selected: <strong>{answer}</strong>
          </div>}
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Survey or quiz questions with visual card-based options.'
      }
    }
  }
}`,...(zt=(Et=W.parameters)==null?void 0:Et.docs)==null?void 0:zt.source},description:{story:"Survey/quiz question with single selection.",...(Ot=($t=W.parameters)==null?void 0:$t.docs)==null?void 0:Ot.description}}};var Gt,It,Bt,Lt,Vt;R.parameters={...R.parameters,docs:{...(Gt=R.parameters)==null?void 0:Gt.docs,source:{originalSource:`{
  render: () => <div>
      <h5 className="mb-3">Accessibility Features</h5>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
        <SelectableCard selectionMode="checkbox" value="aria-label-demo" aria-label="Select the premium subscription plan" title="With aria-label" description="Has a custom aria-label for screen readers." />
        <SelectableCard selectionMode="checkbox" value="required-demo" required title="Required Field" description="Shows required indicator and passes required to input." />
        <SelectableCard selectionMode="radio" name="a11y-group" value="keyboard-demo" title="Keyboard Navigable" description="Tab to focus, Space/Enter to select. Arrow keys for radio groups." />
      </div>
      <div className="alert alert-info mt-4">
        <strong>Accessibility Notes:</strong>
        <ul className="mb-0 mt-2">
          <li>Uses native checkbox/radio inputs for screen reader support</li>
          <li>
            Card is wrapped in a <code>&lt;label&gt;</code> for click-anywhere behavior
          </li>
          <li>
            Supports <code>aria-label</code>, <code>aria-labelledby</code>, and{' '}
            <code>aria-describedby</code>
          </li>
          <li>Shows development warnings for missing accessibility attributes</li>
        </ul>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'SelectableCard includes comprehensive accessibility support following WCAG 2.2 AA guidelines.'
      }
    }
  }
}`,...(Bt=(It=R.parameters)==null?void 0:It.docs)==null?void 0:Bt.source},description:{story:"Accessibility features demonstration.",...(Vt=(Lt=R.parameters)==null?void 0:Lt.docs)==null?void 0:Vt.description}}};var Yt,Ht,Kt,Jt,Qt;U.parameters={...U.parameters,docs:{...(Yt=U.parameters)==null?void 0:Yt.docs,source:{originalSource:`{
  render: () => {
    const [selectedPlan, setSelectedPlan] = useState('basic');
    const [addOns, setAddOns] = useState<Set<string>>(new Set());
    const plans = [{
      value: 'basic',
      title: 'Basic',
      price: '$0',
      desc: 'For individuals'
    }, {
      value: 'pro',
      title: 'Pro',
      price: '$19',
      desc: 'For professionals'
    }, {
      value: 'team',
      title: 'Team',
      price: '$49',
      desc: 'For small teams'
    }];
    const addOnsList = [{
      value: 'support',
      title: 'Priority Support',
      price: '+$10/mo'
    }, {
      value: 'storage',
      title: 'Extra Storage',
      price: '+$5/mo'
    }, {
      value: 'analytics',
      title: 'Advanced Analytics',
      price: '+$15/mo'
    }];
    const toggleAddOn = (value: string, checked: boolean) => {
      setAddOns(prev => {
        const next = new Set(prev);
        if (checked) next.add(value);else next.delete(value);
        return next;
      });
    };
    return <div>
        <div className="mb-5">
          <h5 className="mb-3">1. Choose Your Plan (Radio)</h5>
          <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem'
        }}>
            {plans.map(plan => <SelectableCard key={plan.value} selectionMode="radio" name="showcase-plan" value={plan.value} checked={selectedPlan === plan.value} onChange={checked => {
            if (checked) setSelectedPlan(plan.value);
          }} title={plan.title} subtitle={plan.price} description={plan.desc} selectedColor="primary" />)}
          </div>
        </div>

        <div className="mb-5">
          <h5 className="mb-3">2. Select Add-ons (Checkbox)</h5>
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
            {addOnsList.map(addOn => <SelectableCard key={addOn.value} selectionMode="checkbox" value={addOn.value} checked={addOns.has(addOn.value)} onChange={checked => toggleAddOn(addOn.value, checked)} title={addOn.title} subtitle={addOn.price} selectedColor="success" />)}
          </div>
        </div>

        <div className="card bg-light">
          <div className="card-body">
            <h6 className="card-title">Your Selection</h6>
            <p className="mb-1">
              <strong>Plan:</strong> {plans.find(p => p.value === selectedPlan)?.title}
            </p>
            <p className="mb-0">
              <strong>Add-ons:</strong>{' '}
              {addOns.size > 0 ? [...addOns].map(a => addOnsList.find(x => x.value === a)?.title).join(', ') : 'None'}
            </p>
          </div>
        </div>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'A complete showcase combining radio cards for single selection ' + 'and checkbox cards for multiple selections in a realistic checkout flow.'
      }
    }
  }
}`,...(Kt=(Ht=U.parameters)==null?void 0:Ht.docs)==null?void 0:Kt.source},description:{story:"Complete showcase demonstrating all features.",...(Qt=(Jt=U.parameters)==null?void 0:Jt.docs)==null?void 0:Qt.description}}};const ss=["Default","Checkbox","Radio","SelectionModes","Uncontrolled","Controlled","RadioGroup","CheckboxGroup","Variants","SelectedColors","Disabled","ErrorState","Required","WithMedia","WithFooter","WithSubtitle","WithChildren","HorizontalLayout","InteractiveDemo","PricingTierSelection","FeatureToggles","SurveyQuestion","AccessibilityDemo","CompleteShowcase"];export{R as AccessibilityDemo,h as Checkbox,y as CheckboxGroup,U as CompleteShowcase,f as Controlled,u as Default,S as Disabled,j as ErrorState,F as FeatureToggles,T as HorizontalLayout,q as InteractiveDemo,D as PricingTierSelection,b as Radio,g as RadioGroup,N as Required,C as SelectedColors,v as SelectionModes,W as SurveyQuestion,x as Uncontrolled,k as Variants,A as WithChildren,M as WithFooter,w as WithMedia,P as WithSubtitle,ss as __namedExportsOrder,ts as default};
