import{j as n}from"./jsx-runtime-D_zvdyIk.js";const P=({children:Y,...D})=>n.jsx("div",{style:{padding:"16px",backgroundColor:"#f3f4f6",borderRadius:"8px"},...D,children:Y||"Component Placeholder"}),U={title:"Components/Template",component:P,parameters:{docs:{description:{component:"Replace this with your component description. Explain what it does and when to use it."}}},tags:["autodocs"],argTypes:{children:{control:"text",description:"Content to display inside the component"}}},e={args:{children:"Default Component"}},o={args:{children:"Custom content example"}},r={args:{children:"Interactive playground"},parameters:{docs:{description:{story:"Try modifying the props in the Controls panel below to see how the component responds."}}}},t={render:()=>n.jsxs("div",{style:{maxWidth:"800px"},children:[n.jsx("h2",{children:"Usage"}),n.jsx("pre",{style:{backgroundColor:"#f3f4f6",padding:"16px",borderRadius:"8px",overflow:"auto"},children:`import { YourComponent } from '@dsai/react';

function Example() {
  return (
    <YourComponent prop1="value1" prop2="value2">
      Content
    </YourComponent>
  );
}`})]})};var s,a,p,i,d;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    children: 'Default Component'
  }
}`,...(p=(a=e.parameters)==null?void 0:a.docs)==null?void 0:p.source},description:{story:"Default story - shows the component in its default state",...(d=(i=e.parameters)==null?void 0:i.docs)==null?void 0:d.description}}};var c,l,m,u,h;o.parameters={...o.parameters,docs:{...(c=o.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    children: 'Custom content example'
  }
}`,...(m=(l=o.parameters)==null?void 0:l.docs)==null?void 0:m.source},description:{story:"Example with different props",...(h=(u=o.parameters)==null?void 0:u.docs)==null?void 0:h.description}}};var g,f,x,C,y;r.parameters={...r.parameters,docs:{...(g=r.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    children: 'Interactive playground'
  },
  parameters: {
    docs: {
      description: {
        story: 'Try modifying the props in the Controls panel below to see how the component responds.'
      }
    }
  }
}`,...(x=(f=r.parameters)==null?void 0:f.docs)==null?void 0:x.source},description:{story:"Playground - allows users to interact with all props",...(y=(C=r.parameters)==null?void 0:C.docs)==null?void 0:y.description}}};var w,v,b,j,E;t.parameters={...t.parameters,docs:{...(w=t.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: '800px'
  }}>
      <h2>Usage</h2>
      <pre style={{
      backgroundColor: '#f3f4f6',
      padding: '16px',
      borderRadius: '8px',
      overflow: 'auto'
    }}>
        {\`import { YourComponent } from '@dsai/react';

function Example() {
  return (
    <YourComponent prop1="value1" prop2="value2">
      Content
    </YourComponent>
  );
}\`}
      </pre>
    </div>
}`,...(b=(v=t.parameters)==null?void 0:v.docs)==null?void 0:b.source},description:{story:"Usage example",...(E=(j=t.parameters)==null?void 0:j.docs)==null?void 0:E.description}}};const S=["Default","WithCustomContent","Playground","Usage"];export{e as Default,r as Playground,t as Usage,o as WithCustomContent,S as __namedExportsOrder,U as default};
