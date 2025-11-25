import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as z}from"./iframe-D9LIu1Tf.js";import{S as a}from"./Tabs-C_aTPi4v.js";import"./preload-helper-Dp1pzeXC.js";const l=[{value:"apple",label:"Apple"},{value:"banana",label:"Banana"},{value:"cherry",label:"Cherry"},{value:"date",label:"Date"},{value:"elderberry",label:"Elderberry"}],i=[{value:"us",label:"United States"},{value:"uk",label:"United Kingdom"},{value:"ca",label:"Canada"},{value:"au",label:"Australia"},{value:"de",label:"Germany"},{value:"fr",label:"France"},{value:"jp",label:"Japan"},{value:"br",label:"Brazil"}],Sa=[{label:"Fruits",options:[{value:"apple",label:"Apple"},{value:"banana",label:"Banana"},{value:"cherry",label:"Cherry"}]},{label:"Vegetables",options:[{value:"carrot",label:"Carrot"},{value:"broccoli",label:"Broccoli"},{value:"spinach",label:"Spinach"}]}],ja={title:"Components/Select",component:a,parameters:{layout:"padded",docs:{description:{component:"A flexible dropdown select component built with Bootstrap 5 classes. Supports single/multiple selection, search, custom rendering, and keyboard navigation."}}},tags:["autodocs"],argTypes:{size:{control:"select",options:["sm","md","lg"],description:"Select size",table:{type:{summary:"SelectSize"},defaultValue:{summary:"md"}}},multiple:{control:"boolean",description:"Enable multiple selection",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},searchable:{control:"boolean",description:"Enable search/filter",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},disabled:{control:"boolean",description:"Disabled state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},error:{control:"boolean",description:"Error state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},success:{control:"boolean",description:"Success state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},loading:{control:"boolean",description:"Loading state",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},clearable:{control:"boolean",description:"Show clear button",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},required:{control:"boolean",description:"Required field",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}}},c={args:{label:"Fruit",options:l,placeholder:"Select a fruit"}},u={args:{"aria-label":"Select fruit",options:l,placeholder:"Select a fruit"}},p={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:"400px"},children:[e.jsx(a,{size:"sm",label:"Small",options:l,placeholder:"Select..."}),e.jsx(a,{size:"md",label:"Medium (default)",options:l,placeholder:"Select..."}),e.jsx(a,{size:"lg",label:"Large",options:l,placeholder:"Select..."})]})},d={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:"400px"},children:[e.jsx(a,{label:"Default",options:l,placeholder:"Select..."}),e.jsx(a,{label:"Error",options:l,error:!0,helperText:"Please select an option"}),e.jsx(a,{label:"Success",options:l,success:!0,value:"apple"}),e.jsx(a,{label:"Disabled",options:l,disabled:!0,placeholder:"Disabled"}),e.jsx(a,{label:"Loading",options:l,loading:!0})]})},m={args:{label:"Country",options:i,error:!0,helperText:"Please select your country"}},b={args:{label:"Country",options:i,success:!0,value:"us"}},h={render:function(){const[t,r]=z.useState();return e.jsxs("div",{style:{maxWidth:"400px"},children:[e.jsx(a,{label:"Favorite Fruit",options:l,value:t,onChange:s=>r(s),placeholder:"Choose one..."}),e.jsxs("p",{className:"mt-2 text-muted small",children:["Selected: ",t||"(none)"]})]})}},S={render:function(){const[t,r]=z.useState([]);return e.jsxs("div",{style:{maxWidth:"400px"},children:[e.jsx(a,{label:"Favorite Fruits",options:l,multiple:!0,value:t,onChange:s=>r(s),placeholder:"Choose multiple..."}),e.jsxs("p",{className:"mt-2 text-muted small",children:["Selected: ",t.join(", ")||"(none)"]})]})}},v={args:{label:"Country",options:i,searchable:!0,placeholder:"Search countries..."}},g={render:function(){const[t,r]=z.useState([]);return e.jsx(a,{label:"Countries",options:i,multiple:!0,searchable:!0,value:t,onChange:s=>r(s),placeholder:"Search and select..."})}},f={args:{label:"Food",options:Sa,placeholder:"Select food..."}},y={render:()=>{const o=[{value:"available1",label:"Available Option 1"},{value:"available2",label:"Available Option 2"},{value:"unavailable",label:"Unavailable Option",disabled:!0},{value:"available3",label:"Available Option 3"}];return e.jsx(a,{label:"Status",options:o,placeholder:"Select status..."})}},x={render:function(){const[t,r]=z.useState("apple");return e.jsx(a,{label:"Fruit",options:l,value:t,onChange:s=>r(s),clearable:!0,onClear:()=>r(void 0)})}},O={args:{label:"Data",options:[],loading:!0,placeholder:"Loading data..."}},j={args:{label:"Country",options:i,required:!0,placeholder:"Select your country"}},C={args:{label:"Country",options:i,helperText:"Select the country where you currently reside"}},D={render:()=>{const o=[{value:"#ff0000",label:"Red"},{value:"#00ff00",label:"Green"},{value:"#0000ff",label:"Blue"},{value:"#ffff00",label:"Yellow"},{value:"#ff00ff",label:"Magenta"}];return e.jsx(a,{label:"Color",options:o,placeholder:"Select a color...",renderOption:t=>e.jsxs("div",{className:"d-flex align-items-center gap-2",children:[e.jsx("span",{style:{width:16,height:16,backgroundColor:t.value,borderRadius:"50%",border:"1px solid var(--bs-border-color)"}}),t.label]}),renderValue:t=>{const r=t;return e.jsxs("div",{className:"d-flex align-items-center gap-2",children:[e.jsx("span",{style:{width:16,height:16,backgroundColor:r.value,borderRadius:"50%",border:"1px solid var(--bs-border-color)"}}),r.label]})}})}},F={render:function(){const[t,r]=z.useState({country:"",language:"",interests:[]}),s=[{value:"en",label:"English"},{value:"es",label:"Spanish"},{value:"fr",label:"French"},{value:"de",label:"German"}],va=[{value:"tech",label:"Technology"},{value:"sports",label:"Sports"},{value:"music",label:"Music"},{value:"art",label:"Art"},{value:"travel",label:"Travel"}],ga=n=>{n.preventDefault(),alert(JSON.stringify(t,null,2))};return e.jsx("form",{onSubmit:ga,style:{maxWidth:"400px"},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[e.jsx(a,{label:"Country",name:"country",options:i,value:t.country,onChange:n=>r({...t,country:n}),required:!0,searchable:!0,placeholder:"Search countries..."}),e.jsx(a,{label:"Preferred Language",name:"language",options:s,value:t.language,onChange:n=>r({...t,language:n}),required:!0}),e.jsx(a,{label:"Interests",name:"interests",options:va,value:t.interests,onChange:n=>r({...t,interests:n}),multiple:!0,placeholder:"Select your interests..."}),e.jsx("button",{type:"submit",className:"btn btn-primary",children:"Submit"})]})})}},V={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem",maxWidth:"500px"},children:[e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Basic Select"}),e.jsx(a,{label:"Fruit",options:l,placeholder:"Select..."})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Sizes"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(a,{size:"sm","aria-label":"Small",options:l,placeholder:"Small"}),e.jsx(a,{size:"md","aria-label":"Medium",options:l,placeholder:"Medium"}),e.jsx(a,{size:"lg","aria-label":"Large",options:l,placeholder:"Large"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"States"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(a,{label:"Error",options:l,error:!0,helperText:"Selection required"}),e.jsx(a,{label:"Success",options:l,success:!0,value:"apple"}),e.jsx(a,{label:"Disabled",options:l,disabled:!0,placeholder:"Disabled"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Features"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[e.jsx(a,{label:"Searchable",options:i,searchable:!0,placeholder:"Search..."}),e.jsx(a,{label:"Clearable",options:l,clearable:!0,defaultValue:"apple"}),e.jsx(a,{label:"Multiple",options:l,multiple:!0,placeholder:"Select many..."}),e.jsx(a,{label:"Required",options:l,required:!0,placeholder:"Required"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"0.5rem"},children:"Grouped Options"}),e.jsx(a,{label:"Food",options:Sa,placeholder:"Select food..."})]})]})};var M,w,B,W,q;c.parameters={...c.parameters,docs:{...(M=c.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    label: 'Fruit',
    options: fruitOptions,
    placeholder: 'Select a fruit'
  }
}`,...(B=(w=c.parameters)==null?void 0:w.docs)==null?void 0:B.source},description:{story:"Default select with label",...(q=(W=c.parameters)==null?void 0:W.docs)==null?void 0:q.description}}};var E,L,R,T,A;u.parameters={...u.parameters,docs:{...(E=u.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Select fruit',
    options: fruitOptions,
    placeholder: 'Select a fruit'
  }
}`,...(R=(L=u.parameters)==null?void 0:L.docs)==null?void 0:R.source},description:{story:"Select without label (uses aria-label)",...(A=(T=u.parameters)==null?void 0:T.docs)==null?void 0:A.description}}};var N,G,k,P,U;p.parameters={...p.parameters,docs:{...(N=p.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '400px'
  }}>
      <Select size="sm" label="Small" options={fruitOptions} placeholder="Select..." />
      <Select size="md" label="Medium (default)" options={fruitOptions} placeholder="Select..." />
      <Select size="lg" label="Large" options={fruitOptions} placeholder="Select..." />
    </div>
}`,...(k=(G=p.parameters)==null?void 0:G.docs)==null?void 0:k.source},description:{story:"Select sizes",...(U=(P=p.parameters)==null?void 0:P.docs)==null?void 0:U.description}}};var J,H,I,Y,_;d.parameters={...d.parameters,docs:{...(J=d.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '400px'
  }}>
      <Select label="Default" options={fruitOptions} placeholder="Select..." />
      <Select label="Error" options={fruitOptions} error helperText="Please select an option" />
      <Select label="Success" options={fruitOptions} success value="apple" />
      <Select label="Disabled" options={fruitOptions} disabled placeholder="Disabled" />
      <Select label="Loading" options={fruitOptions} loading />
    </div>
}`,...(I=(H=d.parameters)==null?void 0:H.docs)==null?void 0:I.source},description:{story:"Validation states",...(_=(Y=d.parameters)==null?void 0:Y.docs)==null?void 0:_.description}}};var K,Q,X,Z,$;m.parameters={...m.parameters,docs:{...(K=m.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    label: 'Country',
    options: countryOptions,
    error: true,
    helperText: 'Please select your country'
  }
}`,...(X=(Q=m.parameters)==null?void 0:Q.docs)==null?void 0:X.source},description:{story:"Error state",...($=(Z=m.parameters)==null?void 0:Z.docs)==null?void 0:$.description}}};var ee,ae,le,te,re;b.parameters={...b.parameters,docs:{...(ee=b.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {
    label: 'Country',
    options: countryOptions,
    success: true,
    value: 'us'
  }
}`,...(le=(ae=b.parameters)==null?void 0:ae.docs)==null?void 0:le.source},description:{story:"Success state",...(re=(te=b.parameters)==null?void 0:te.docs)==null?void 0:re.description}}};var se,oe,ie,ne,ce;h.parameters={...h.parameters,docs:{...(se=h.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: function SingleSelect() {
    const [value, setValue] = useState<string | undefined>();
    return <div style={{
      maxWidth: '400px'
    }}>
        <Select label="Favorite Fruit" options={fruitOptions} value={value} onChange={val => setValue(val as string)} placeholder="Choose one..." />
        <p className="mt-2 text-muted small">Selected: {value || '(none)'}</p>
      </div>;
  }
}`,...(ie=(oe=h.parameters)==null?void 0:oe.docs)==null?void 0:ie.source},description:{story:"Single selection (default)",...(ce=(ne=h.parameters)==null?void 0:ne.docs)==null?void 0:ce.description}}};var ue,pe,de,me,be;S.parameters={...S.parameters,docs:{...(ue=S.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  render: function MultiSelect() {
    const [values, setValues] = useState<string[]>([]);
    return <div style={{
      maxWidth: '400px'
    }}>
        <Select label="Favorite Fruits" options={fruitOptions} multiple value={values} onChange={val => setValues(val as string[])} placeholder="Choose multiple..." />
        <p className="mt-2 text-muted small">Selected: {values.join(', ') || '(none)'}</p>
      </div>;
  }
}`,...(de=(pe=S.parameters)==null?void 0:pe.docs)==null?void 0:de.source},description:{story:"Multiple selection",...(be=(me=S.parameters)==null?void 0:me.docs)==null?void 0:be.description}}};var he,Se,ve,ge,fe;v.parameters={...v.parameters,docs:{...(he=v.parameters)==null?void 0:he.docs,source:{originalSource:`{
  args: {
    label: 'Country',
    options: countryOptions,
    searchable: true,
    placeholder: 'Search countries...'
  }
}`,...(ve=(Se=v.parameters)==null?void 0:Se.docs)==null?void 0:ve.source},description:{story:"Searchable select",...(fe=(ge=v.parameters)==null?void 0:ge.docs)==null?void 0:fe.description}}};var ye,xe,Oe,je,Ce;g.parameters={...g.parameters,docs:{...(ye=g.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  render: function SearchableMultiSelect() {
    const [values, setValues] = useState<string[]>([]);
    return <Select label="Countries" options={countryOptions} multiple searchable value={values} onChange={val => setValues(val as string[])} placeholder="Search and select..." />;
  }
}`,...(Oe=(xe=g.parameters)==null?void 0:xe.docs)==null?void 0:Oe.source},description:{story:"Searchable with multiple selection",...(Ce=(je=g.parameters)==null?void 0:je.docs)==null?void 0:Ce.description}}};var De,Fe,Ve,ze,Me;f.parameters={...f.parameters,docs:{...(De=f.parameters)==null?void 0:De.docs,source:{originalSource:`{
  args: {
    label: 'Food',
    options: groupedOptions,
    placeholder: 'Select food...'
  }
}`,...(Ve=(Fe=f.parameters)==null?void 0:Fe.docs)==null?void 0:Ve.source},description:{story:"Options with groups",...(Me=(ze=f.parameters)==null?void 0:ze.docs)==null?void 0:Me.description}}};var we,Be,We,qe,Ee;y.parameters={...y.parameters,docs:{...(we=y.parameters)==null?void 0:we.docs,source:{originalSource:`{
  render: () => {
    const optionsWithDisabled: SelectOption[] = [{
      value: 'available1',
      label: 'Available Option 1'
    }, {
      value: 'available2',
      label: 'Available Option 2'
    }, {
      value: 'unavailable',
      label: 'Unavailable Option',
      disabled: true
    }, {
      value: 'available3',
      label: 'Available Option 3'
    }];
    return <Select label="Status" options={optionsWithDisabled} placeholder="Select status..." />;
  }
}`,...(We=(Be=y.parameters)==null?void 0:Be.docs)==null?void 0:We.source},description:{story:"Select with disabled options",...(Ee=(qe=y.parameters)==null?void 0:qe.docs)==null?void 0:Ee.description}}};var Le,Re,Te,Ae,Ne;x.parameters={...x.parameters,docs:{...(Le=x.parameters)==null?void 0:Le.docs,source:{originalSource:`{
  render: function ClearableSelect() {
    const [value, setValue] = useState<string | undefined>('apple');
    return <Select label="Fruit" options={fruitOptions} value={value} onChange={val => setValue(val as string | undefined)} clearable onClear={() => setValue(undefined)} />;
  }
}`,...(Te=(Re=x.parameters)==null?void 0:Re.docs)==null?void 0:Te.source},description:{story:"Clearable select",...(Ne=(Ae=x.parameters)==null?void 0:Ae.docs)==null?void 0:Ne.description}}};var Ge,ke,Pe,Ue,Je;O.parameters={...O.parameters,docs:{...(Ge=O.parameters)==null?void 0:Ge.docs,source:{originalSource:`{
  args: {
    label: 'Data',
    options: [],
    loading: true,
    placeholder: 'Loading data...'
  }
}`,...(Pe=(ke=O.parameters)==null?void 0:ke.docs)==null?void 0:Pe.source},description:{story:"Loading state",...(Je=(Ue=O.parameters)==null?void 0:Ue.docs)==null?void 0:Je.description}}};var He,Ie,Ye,_e,Ke;j.parameters={...j.parameters,docs:{...(He=j.parameters)==null?void 0:He.docs,source:{originalSource:`{
  args: {
    label: 'Country',
    options: countryOptions,
    required: true,
    placeholder: 'Select your country'
  }
}`,...(Ye=(Ie=j.parameters)==null?void 0:Ie.docs)==null?void 0:Ye.source},description:{story:"Required field",...(Ke=(_e=j.parameters)==null?void 0:_e.docs)==null?void 0:Ke.description}}};var Qe,Xe,Ze,$e,ea;C.parameters={...C.parameters,docs:{...(Qe=C.parameters)==null?void 0:Qe.docs,source:{originalSource:`{
  args: {
    label: 'Country',
    options: countryOptions,
    helperText: 'Select the country where you currently reside'
  }
}`,...(Ze=(Xe=C.parameters)==null?void 0:Xe.docs)==null?void 0:Ze.source},description:{story:"With helper text",...(ea=($e=C.parameters)==null?void 0:$e.docs)==null?void 0:ea.description}}};var aa,la,ta,ra,sa;D.parameters={...D.parameters,docs:{...(aa=D.parameters)==null?void 0:aa.docs,source:{originalSource:`{
  render: () => {
    const colorOptions: SelectOption[] = [{
      value: '#ff0000',
      label: 'Red'
    }, {
      value: '#00ff00',
      label: 'Green'
    }, {
      value: '#0000ff',
      label: 'Blue'
    }, {
      value: '#ffff00',
      label: 'Yellow'
    }, {
      value: '#ff00ff',
      label: 'Magenta'
    }];
    return <Select label="Color" options={colorOptions} placeholder="Select a color..." renderOption={option => <div className="d-flex align-items-center gap-2">
            <span style={{
        width: 16,
        height: 16,
        backgroundColor: option.value,
        borderRadius: '50%',
        border: '1px solid var(--bs-border-color)'
      }} />
            {option.label}
          </div>} renderValue={selected => {
      const opt = selected as SelectOption;
      return <div className="d-flex align-items-center gap-2">
              <span style={{
          width: 16,
          height: 16,
          backgroundColor: opt.value,
          borderRadius: '50%',
          border: '1px solid var(--bs-border-color)'
        }} />
              {opt.label}
            </div>;
    }} />;
  }
}`,...(ta=(la=D.parameters)==null?void 0:la.docs)==null?void 0:ta.source},description:{story:"Custom option rendering",...(sa=(ra=D.parameters)==null?void 0:ra.docs)==null?void 0:sa.description}}};var oa,ia,na,ca,ua;F.parameters={...F.parameters,docs:{...(oa=F.parameters)==null?void 0:oa.docs,source:{originalSource:`{
  render: function FormSelects() {
    const [formData, setFormData] = useState({
      country: '',
      language: '',
      interests: [] as string[]
    });
    const languageOptions: SelectOption[] = [{
      value: 'en',
      label: 'English'
    }, {
      value: 'es',
      label: 'Spanish'
    }, {
      value: 'fr',
      label: 'French'
    }, {
      value: 'de',
      label: 'German'
    }];
    const interestOptions: SelectOption[] = [{
      value: 'tech',
      label: 'Technology'
    }, {
      value: 'sports',
      label: 'Sports'
    }, {
      value: 'music',
      label: 'Music'
    }, {
      value: 'art',
      label: 'Art'
    }, {
      value: 'travel',
      label: 'Travel'
    }];
    const handleSubmit = (e: React.FormEvent): void => {
      e.preventDefault();
      alert(JSON.stringify(formData, null, 2));
    };
    return <form onSubmit={handleSubmit} style={{
      maxWidth: '400px'
    }}>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
          <Select label="Country" name="country" options={countryOptions} value={formData.country} onChange={val => setFormData({
          ...formData,
          country: val as string
        })} required searchable placeholder="Search countries..." />

          <Select label="Preferred Language" name="language" options={languageOptions} value={formData.language} onChange={val => setFormData({
          ...formData,
          language: val as string
        })} required />

          <Select label="Interests" name="interests" options={interestOptions} value={formData.interests} onChange={val => setFormData({
          ...formData,
          interests: val as string[]
        })} multiple placeholder="Select your interests..." />

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>;
  }
}`,...(na=(ia=F.parameters)==null?void 0:ia.docs)==null?void 0:na.source},description:{story:"Form with multiple selects",...(ua=(ca=F.parameters)==null?void 0:ca.docs)==null?void 0:ua.description}}};var pa,da,ma,ba,ha;V.parameters={...V.parameters,docs:{...(pa=V.parameters)==null?void 0:pa.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    maxWidth: '500px'
  }}>
      {/* Basic */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>Basic Select</h4>
        <Select label="Fruit" options={fruitOptions} placeholder="Select..." />
      </div>

      {/* Sizes */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>Sizes</h4>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
          <Select size="sm" aria-label="Small" options={fruitOptions} placeholder="Small" />
          <Select size="md" aria-label="Medium" options={fruitOptions} placeholder="Medium" />
          <Select size="lg" aria-label="Large" options={fruitOptions} placeholder="Large" />
        </div>
      </div>

      {/* States */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>States</h4>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
          <Select label="Error" options={fruitOptions} error helperText="Selection required" />
          <Select label="Success" options={fruitOptions} success value="apple" />
          <Select label="Disabled" options={fruitOptions} disabled placeholder="Disabled" />
        </div>
      </div>

      {/* Features */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>Features</h4>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
          <Select label="Searchable" options={countryOptions} searchable placeholder="Search..." />
          <Select label="Clearable" options={fruitOptions} clearable defaultValue="apple" />
          <Select label="Multiple" options={fruitOptions} multiple placeholder="Select many..." />
          <Select label="Required" options={fruitOptions} required placeholder="Required" />
        </div>
      </div>

      {/* Grouped */}
      <div>
        <h4 style={{
        marginBottom: '0.5rem'
      }}>Grouped Options</h4>
        <Select label="Food" options={groupedOptions} placeholder="Select food..." />
      </div>
    </div>
}`,...(ma=(da=V.parameters)==null?void 0:da.docs)==null?void 0:ma.source},description:{story:"Complete select showcase",...(ha=(ba=V.parameters)==null?void 0:ba.docs)==null?void 0:ha.description}}};const Ca=["Default","WithoutLabel","Sizes","ValidationStates","Error","Success","SingleSelection","MultipleSelection","Searchable","SearchableMultiple","GroupedOptions","DisabledOptions","Clearable","Loading","Required","WithHelperText","CustomOptionRendering","FormExample","CompleteShowcase"];export{x as Clearable,V as CompleteShowcase,D as CustomOptionRendering,c as Default,y as DisabledOptions,m as Error,F as FormExample,f as GroupedOptions,O as Loading,S as MultipleSelection,j as Required,v as Searchable,g as SearchableMultiple,h as SingleSelection,p as Sizes,b as Success,d as ValidationStates,C as WithHelperText,u as WithoutLabel,Ca as __namedExportsOrder,ja as default};
