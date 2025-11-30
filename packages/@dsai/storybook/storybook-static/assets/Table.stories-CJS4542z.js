import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{O as o,a as M}from"./Tabs-DTVVglNe.js";import{r as c}from"./iframe-CgsZvN4H.js";import"./preload-helper-Dp1pzeXC.js";const a=[{id:1,name:"Alice Smith",email:"alice@example.com",role:"Engineer",status:"active",department:"Engineering",salary:95e3,joinDate:"2021-03-15"},{id:2,name:"Bob Johnson",email:"bob@example.com",role:"Designer",status:"active",department:"Design",salary:85e3,joinDate:"2020-07-22"},{id:3,name:"Charlie Brown",email:"charlie@example.com",role:"Manager",status:"inactive",department:"Operations",salary:11e4,joinDate:"2019-11-01"},{id:4,name:"Diana Ross",email:"diana@example.com",role:"Engineer",status:"active",department:"Engineering",salary:98e3,joinDate:"2022-01-10"},{id:5,name:"Eve Wilson",email:"eve@example.com",role:"Analyst",status:"pending",department:"Analytics",salary:78e3,joinDate:"2023-06-05"}],r=[{id:"name",header:"Name",accessor:"name"},{id:"email",header:"Email",accessor:"email"},{id:"role",header:"Role",accessor:"role"},{id:"department",header:"Department",accessor:"department"}],H=[{id:"name",header:"Name",accessor:"name",sortable:!0},{id:"email",header:"Email",accessor:"email",sortable:!0},{id:"role",header:"Role",accessor:"role",sortable:!0},{id:"salary",header:"Salary",accessor:"salary",sortable:!0,align:"right"}],is={title:"Components/Table",component:o,parameters:{layout:"padded",docs:{description:{component:"A Bootstrap 5 table component with sorting, row selection, responsive layout, and sticky header support. Uses FSM for predictable selection state."}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","striped","bordered","borderless"],description:"Table style variant",table:{type:{summary:"'default' | 'striped' | 'bordered' | 'borderless'"},defaultValue:{summary:"'default'"}}},size:{control:"select",options:["sm","md","lg"],description:"Table size",table:{type:{summary:"'sm' | 'md' | 'lg'"},defaultValue:{summary:"'md'"}}},headerColor:{control:"select",options:[void 0,"primary","secondary","success","danger","warning","info","light","dark"],description:"Header background color"},hover:{control:"boolean",description:"Enable row hover effect",table:{defaultValue:{summary:"true"}}},responsive:{control:"boolean",description:"Enable responsive wrapper",table:{defaultValue:{summary:"true"}}},stickyHeader:{control:"boolean",description:"Sticky header",table:{defaultValue:{summary:"false"}}}}},d={args:{columns:r,data:a,"aria-label":"User list"}},m={args:{columns:r,data:a,variant:"striped","aria-label":"Striped user list"}},u={args:{columns:r,data:a,variant:"bordered","aria-label":"Bordered user list"}},p={args:{columns:r,data:a,variant:"borderless","aria-label":"Borderless user list"}},b={args:{columns:r,data:a,size:"sm","aria-label":"Compact user list"}},h={args:{columns:r,data:a,hover:!1,"aria-label":"User list without hover"}},g={args:{columns:r,data:a,headerColor:"dark","aria-label":"User list with dark header"}},y={args:{columns:r,data:a,headerColor:"primary","aria-label":"User list with primary header"}},S={args:{columns:H,data:a,"aria-label":"Sortable user list"}},C={render:function(){const[t,s]=c.useState({columnId:"name",direction:"asc"});return e.jsxs("div",{children:[e.jsxs("div",{className:"mb-3",children:[e.jsx("strong",{children:"Current sort:"})," ",t?`${t.columnId} (${t.direction})`:"None",e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary ms-2",onClick:()=>s(void 0),children:"Clear sort"})]}),e.jsx(o,{columns:H,data:a,sortConfig:t,onSortChange:s,"aria-label":"Controlled sorting example"})]})}},w={render:function(){const[t,s]=c.useState();return e.jsxs("div",{children:[e.jsxs("div",{className:"mb-3",children:[e.jsx("strong",{children:"Selected:"})," ",t!==void 0?`Row ${t}`:"None"]}),e.jsx(o,{columns:r,data:a,selectionMode:"single",rowId:"id",selectedRows:t,onSelectionChange:s,"aria-label":"Single selection table"})]})}},v={render:function(){const[t,s]=c.useState([]);return e.jsxs("div",{children:[e.jsxs("div",{className:"mb-3",children:[e.jsxs("strong",{children:["Selected (",t.length,"):"]})," ",t.length>0?t.join(", "):"None"]}),e.jsx(o,{columns:r,data:a,selectionMode:"multiple",rowId:"id",selectedRows:t,onSelectionChange:s,"aria-label":"Multiple selection table"})]})}},f={render:function(){const[t,s]=c.useState([]);return e.jsxs("div",{children:[e.jsxs("div",{className:"mb-3",children:[e.jsx("strong",{children:"Note:"})," Rows 2 and 4 are disabled and cannot be selected."]}),e.jsx(o,{columns:r,data:a,selectionMode:"multiple",rowId:"id",selectedRows:t,onSelectionChange:s,disabledRows:[2,4],"aria-label":"Table with disabled rows"})]})}},x={render:function(){const t=[{id:"name",header:"Name",accessor:"name",sortable:!0},{id:"email",header:"Email",accessor:"email",cell:s=>e.jsx("a",{href:`mailto:${s}`,className:"text-decoration-none",children:String(s)})},{id:"status",header:"Status",accessor:"status",cell:s=>{const n=s==="active"?"success":s==="pending"?"warning":"secondary";return e.jsx(M,{variant:n,children:String(s)})}},{id:"salary",header:"Salary",accessor:"salary",align:"right",cell:s=>`$${Number(s).toLocaleString()}`}];return e.jsx(o,{columns:t,data:a,"aria-label":"Table with custom cells"})}},N={args:{columns:r,data:[],emptyContent:"No users found","aria-label":"Empty table"}},j={render:function(){return e.jsx(o,{columns:r,data:[],emptyContent:e.jsxs("div",{className:"text-center py-4",children:[e.jsx("div",{className:"fs-4 text-muted mb-2",children:"📋"}),e.jsx("p",{className:"mb-2",children:"No data available"}),e.jsx("button",{type:"button",className:"btn btn-primary btn-sm",children:"Add New User"})]}),"aria-label":"Table with custom empty state"})}},k={args:{columns:r,data:a,caption:"List of registered users in the system"}},T={args:{columns:r,data:a,footer:`Total: ${a.length} users`,"aria-label":"Table with footer"}},R={render:function(){const t=Array.from({length:20},(s,n)=>({...a[n%a.length],id:n+1,name:`User ${n+1}`,email:`user${n+1}@example.com`}));return e.jsx(o,{columns:r,data:t,stickyHeader:!0,maxHeight:300,"aria-label":"Table with sticky header"})}},$={render:function(){const t=[{id:"id",header:"ID",accessor:"id",sticky:"left",width:60},{id:"name",header:"Name",accessor:"name",minWidth:150},{id:"email",header:"Email",accessor:"email",minWidth:200},{id:"role",header:"Role",accessor:"role",minWidth:120},{id:"department",header:"Department",accessor:"department",minWidth:150},{id:"salary",header:"Salary",accessor:"salary",minWidth:120,align:"right",cell:s=>`$${Number(s).toLocaleString()}`},{id:"joinDate",header:"Join Date",accessor:"joinDate",minWidth:120},{id:"status",header:"Status",accessor:"status",minWidth:100,cell:s=>{const n=s==="active"?"success":s==="pending"?"warning":"secondary";return e.jsx(M,{variant:n,children:String(s)})}},{id:"actions",header:"Actions",accessor:()=>null,sticky:"right",width:100,align:"center",cell:()=>e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-primary",children:"Edit"})}];return e.jsxs("div",{style:{maxWidth:600},children:[e.jsx("p",{className:"text-muted small mb-2",children:"Scroll horizontally to see sticky columns (ID on left, Actions on right)."}),e.jsx(o,{columns:t,data:a,responsive:!0,"aria-label":"Table with sticky columns"})]})}},E={render:function(){const[t,s]=c.useState(null),n=[{id:"name",header:"Name",accessor:"name"},{id:"email",header:"Email",accessor:"email"},{id:"role",header:"Role",accessor:"role"},{id:"actions",header:"Actions",accessor:()=>null,align:"right",cell:(W,B)=>e.jsxs("div",{className:"d-flex gap-1 justify-content-end",children:[e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-primary",onClick:l=>{l.stopPropagation(),s(`Edit: ${B.name}`)},children:"Edit"}),e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-danger",onClick:l=>{l.stopPropagation(),s(`Delete: ${B.name}`)},children:"Delete"})]})}];return e.jsxs("div",{children:[t&&e.jsxs("div",{className:"alert alert-info mb-3",children:["Last action: ",e.jsx("strong",{children:t})]}),e.jsx(o,{columns:n,data:a,"aria-label":"Table with action buttons"})]})}},D={render:function(){const[t,s]=c.useState(null);return e.jsxs("div",{children:[t&&e.jsxs("div",{className:"alert alert-info mb-3",children:["Clicked: ",t.name," (",t.email,")"]}),e.jsx(o,{columns:r,data:a,onRowClick:n=>s(n),"aria-label":"Clickable rows table"})]})}},A={render:function(){const[t,s]=c.useState(),[n,W]=c.useState([]),B=[{id:"name",header:"Name",accessor:"name",sortable:!0},{id:"email",header:"Email",accessor:"email",sortable:!0},{id:"status",header:"Status",accessor:"status",cell:l=>{const ss=l==="active"?"success":l==="pending"?"warning":"secondary";return e.jsx(M,{variant:ss,children:String(l)})}},{id:"salary",header:"Salary",accessor:"salary",align:"right",sortable:!0,cell:l=>`$${Number(l).toLocaleString()}`}];return e.jsxs("div",{children:[e.jsxs("div",{className:"mb-3 d-flex gap-3 align-items-center",children:[e.jsxs("span",{children:[e.jsx("strong",{children:"Selected:"})," ",n.length," rows"]}),e.jsxs("span",{children:[e.jsx("strong",{children:"Sort:"})," ",t?`${t.columnId} (${t.direction})`:"None"]})]}),e.jsx(o,{columns:B,data:a,variant:"striped",selectionMode:"multiple",rowId:"id",selectedRows:n,onSelectionChange:W,sortConfig:t,onSortChange:s,caption:"Employee Directory"})]})}},I={render:function(){return e.jsxs("div",{children:[e.jsx("h2",{id:"employees-heading",className:"h5 mb-3",children:"Employee List"}),e.jsx("p",{id:"employees-desc",className:"text-muted small mb-3",children:"This table shows all employees with their roles and departments."}),e.jsx(o,{columns:H,data:a,"aria-labelledby":"employees-heading","aria-describedby":"employees-desc",selectionMode:"multiple",rowId:"id"})]})}},U={render:function(){const[t,s]=c.useState("none"),n=()=>{switch(t){case"none":return[];case"one":return[1];case"some":return[1,2,3];case"all":return a.map(W=>W.id)}};return e.jsxs("div",{children:[e.jsxs("div",{className:"mb-3 btn-group",children:[e.jsx("button",{type:"button",className:`btn btn-sm ${t==="none"?"btn-primary":"btn-outline-primary"}`,onClick:()=>s("none"),children:"None"}),e.jsx("button",{type:"button",className:`btn btn-sm ${t==="one"?"btn-primary":"btn-outline-primary"}`,onClick:()=>s("one"),children:"One"}),e.jsx("button",{type:"button",className:`btn btn-sm ${t==="some"?"btn-primary":"btn-outline-primary"}`,onClick:()=>s("some"),children:"Some"}),e.jsx("button",{type:"button",className:`btn btn-sm ${t==="all"?"btn-primary":"btn-outline-primary"}`,onClick:()=>s("all"),children:"All"})]}),e.jsxs("p",{className:"small text-muted mb-3",children:["Current visual state: ",e.jsxs("code",{children:['data-visual-state="',t,'"']})]}),e.jsx(o,{columns:r,data:a,selectionMode:"multiple",rowId:"id",selectedRows:n(),"aria-label":"Visual states demo"})]})}};var L,F,V,z,P;d.parameters={...d.parameters,docs:{...(L=d.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    columns: basicColumns,
    data: users,
    'aria-label': 'User list'
  }
}`,...(V=(F=d.parameters)==null?void 0:F.docs)==null?void 0:V.source},description:{story:"Basic table with default styling.",...(P=(z=d.parameters)==null?void 0:z.docs)==null?void 0:P.description}}};var _,O,J,G,q;m.parameters={...m.parameters,docs:{...(_=m.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    columns: basicColumns,
    data: users,
    variant: 'striped',
    'aria-label': 'Striped user list'
  }
}`,...(J=(O=m.parameters)==null?void 0:O.docs)==null?void 0:J.source},description:{story:"Striped table with alternating row colors.",...(q=(G=m.parameters)==null?void 0:G.docs)==null?void 0:q.description}}};var K,Q,X,Y,Z;u.parameters={...u.parameters,docs:{...(K=u.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    columns: basicColumns,
    data: users,
    variant: 'bordered',
    'aria-label': 'Bordered user list'
  }
}`,...(X=(Q=u.parameters)==null?void 0:Q.docs)==null?void 0:X.source},description:{story:"Bordered table with all cell borders.",...(Z=(Y=u.parameters)==null?void 0:Y.docs)==null?void 0:Z.description}}};var ee,te,se,ae,re;p.parameters={...p.parameters,docs:{...(ee=p.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {
    columns: basicColumns,
    data: users,
    variant: 'borderless',
    'aria-label': 'Borderless user list'
  }
}`,...(se=(te=p.parameters)==null?void 0:te.docs)==null?void 0:se.source},description:{story:"Borderless table with no borders.",...(re=(ae=p.parameters)==null?void 0:ae.docs)==null?void 0:re.description}}};var ne,oe,ie,le,ce;b.parameters={...b.parameters,docs:{...(ne=b.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    columns: basicColumns,
    data: users,
    size: 'sm',
    'aria-label': 'Compact user list'
  }
}`,...(ie=(oe=b.parameters)==null?void 0:oe.docs)==null?void 0:ie.source},description:{story:"Small table with reduced padding.",...(ce=(le=b.parameters)==null?void 0:le.docs)==null?void 0:ce.description}}};var de,me,ue,pe,be;h.parameters={...h.parameters,docs:{...(de=h.parameters)==null?void 0:de.docs,source:{originalSource:`{
  args: {
    columns: basicColumns,
    data: users,
    hover: false,
    'aria-label': 'User list without hover'
  }
}`,...(ue=(me=h.parameters)==null?void 0:me.docs)==null?void 0:ue.source},description:{story:"Table without hover effect.",...(be=(pe=h.parameters)==null?void 0:pe.docs)==null?void 0:be.description}}};var he,ge,ye,Se,Ce;g.parameters={...g.parameters,docs:{...(he=g.parameters)==null?void 0:he.docs,source:{originalSource:`{
  args: {
    columns: basicColumns,
    data: users,
    headerColor: 'dark',
    'aria-label': 'User list with dark header'
  }
}`,...(ye=(ge=g.parameters)==null?void 0:ge.docs)==null?void 0:ye.source},description:{story:"Table with dark header.",...(Ce=(Se=g.parameters)==null?void 0:Se.docs)==null?void 0:Ce.description}}};var we,ve,fe,xe,Ne;y.parameters={...y.parameters,docs:{...(we=y.parameters)==null?void 0:we.docs,source:{originalSource:`{
  args: {
    columns: basicColumns,
    data: users,
    headerColor: 'primary',
    'aria-label': 'User list with primary header'
  }
}`,...(fe=(ve=y.parameters)==null?void 0:ve.docs)==null?void 0:fe.source},description:{story:"Table with primary colored header.",...(Ne=(xe=y.parameters)==null?void 0:xe.docs)==null?void 0:Ne.description}}};var je,ke,Te,Re,$e;S.parameters={...S.parameters,docs:{...(je=S.parameters)==null?void 0:je.docs,source:{originalSource:`{
  args: {
    columns: sortableColumns,
    data: users,
    'aria-label': 'Sortable user list'
  }
}`,...(Te=(ke=S.parameters)==null?void 0:ke.docs)==null?void 0:Te.source},description:{story:"Table with sortable columns. Click column headers to sort.",...($e=(Re=S.parameters)==null?void 0:Re.docs)==null?void 0:$e.description}}};var Ee,De,Ae,Ie,Ue;C.parameters={...C.parameters,docs:{...(Ee=C.parameters)==null?void 0:Ee.docs,source:{originalSource:`{
  render: function ControlledSortingStory() {
    const [sortConfig, setSortConfig] = useState<SortConfig | undefined>({
      columnId: 'name',
      direction: 'asc'
    });
    return <div>
        <div className="mb-3">
          <strong>Current sort:</strong>{' '}
          {sortConfig ? \`\${sortConfig.columnId} (\${sortConfig.direction})\` : 'None'}
          <button type="button" className="btn btn-sm btn-outline-secondary ms-2" onClick={() => setSortConfig(undefined)}>
            Clear sort
          </button>
        </div>
        <Table columns={sortableColumns} data={users} sortConfig={sortConfig} onSortChange={setSortConfig} aria-label="Controlled sorting example" />
      </div>;
  }
}`,...(Ae=(De=C.parameters)==null?void 0:De.docs)==null?void 0:Ae.source},description:{story:"Controlled sorting with external state management.",...(Ue=(Ie=C.parameters)==null?void 0:Ie.docs)==null?void 0:Ue.description}}};var We,Be,Me,He,Le;w.parameters={...w.parameters,docs:{...(We=w.parameters)==null?void 0:We.docs,source:{originalSource:`{
  render: function SingleSelectionStory() {
    const [selected, setSelected] = useState<RowId | undefined>();
    return <div>
        <div className="mb-3">
          <strong>Selected:</strong> {selected !== undefined ? \`Row \${selected}\` : 'None'}
        </div>
        <Table columns={basicColumns} data={users} selectionMode="single" rowId="id" selectedRows={selected} onSelectionChange={setSelected} aria-label="Single selection table" />
      </div>;
  }
}`,...(Me=(Be=w.parameters)==null?void 0:Be.docs)==null?void 0:Me.source},description:{story:"Single row selection (radio-like behavior).",...(Le=(He=w.parameters)==null?void 0:He.docs)==null?void 0:Le.description}}};var Fe,Ve,ze,Pe,_e;v.parameters={...v.parameters,docs:{...(Fe=v.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
  render: function MultipleSelectionStory() {
    const [selected, setSelected] = useState<RowId[]>([]);
    return <div>
        <div className="mb-3">
          <strong>Selected ({selected.length}):</strong>{' '}
          {selected.length > 0 ? selected.join(', ') : 'None'}
        </div>
        <Table columns={basicColumns} data={users} selectionMode="multiple" rowId="id" selectedRows={selected} onSelectionChange={setSelected} aria-label="Multiple selection table" />
      </div>;
  }
}`,...(ze=(Ve=v.parameters)==null?void 0:Ve.docs)==null?void 0:ze.source},description:{story:"Multiple row selection with select-all checkbox.",...(_e=(Pe=v.parameters)==null?void 0:Pe.docs)==null?void 0:_e.description}}};var Oe,Je,Ge,qe,Ke;f.parameters={...f.parameters,docs:{...(Oe=f.parameters)==null?void 0:Oe.docs,source:{originalSource:`{
  render: function DisabledRowsStory() {
    const [selected, setSelected] = useState<RowId[]>([]);
    return <div>
        <div className="mb-3">
          <strong>Note:</strong> Rows 2 and 4 are disabled and cannot be selected.
        </div>
        <Table columns={basicColumns} data={users} selectionMode="multiple" rowId="id" selectedRows={selected} onSelectionChange={setSelected} disabledRows={[2, 4]} aria-label="Table with disabled rows" />
      </div>;
  }
}`,...(Ge=(Je=f.parameters)==null?void 0:Je.docs)==null?void 0:Ge.source},description:{story:"Selection with some rows disabled.",...(Ke=(qe=f.parameters)==null?void 0:qe.docs)==null?void 0:Ke.description}}};var Qe,Xe,Ye,Ze,et;x.parameters={...x.parameters,docs:{...(Qe=x.parameters)==null?void 0:Qe.docs,source:{originalSource:`{
  render: function CustomCellStory() {
    const customColumns: TableColumn<User>[] = [{
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true
    }, {
      id: 'email',
      header: 'Email',
      accessor: 'email',
      cell: value => <a href={\`mailto:\${value}\`} className="text-decoration-none">
            {String(value)}
          </a>
    }, {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      cell: value => {
        const variant = value === 'active' ? 'success' : value === 'pending' ? 'warning' : 'secondary';
        return <Badge variant={variant}>{String(value)}</Badge>;
      }
    }, {
      id: 'salary',
      header: 'Salary',
      accessor: 'salary',
      align: 'right',
      cell: value => \`$\${Number(value).toLocaleString()}\`
    }];
    return <Table columns={customColumns} data={users} aria-label="Table with custom cells" />;
  }
}`,...(Ye=(Xe=x.parameters)==null?void 0:Xe.docs)==null?void 0:Ye.source},description:{story:"Table with custom cell renderers for rich content.",...(et=(Ze=x.parameters)==null?void 0:Ze.docs)==null?void 0:et.description}}};var tt,st,at,rt,nt;N.parameters={...N.parameters,docs:{...(tt=N.parameters)==null?void 0:tt.docs,source:{originalSource:`{
  args: {
    columns: basicColumns,
    data: [],
    emptyContent: 'No users found',
    'aria-label': 'Empty table'
  }
}`,...(at=(st=N.parameters)==null?void 0:st.docs)==null?void 0:at.source},description:{story:"Table with empty state.",...(nt=(rt=N.parameters)==null?void 0:rt.docs)==null?void 0:nt.description}}};var ot,it,lt,ct,dt;j.parameters={...j.parameters,docs:{...(ot=j.parameters)==null?void 0:ot.docs,source:{originalSource:`{
  render: function CustomEmptyStory() {
    return <Table columns={basicColumns} data={[]} emptyContent={<div className="text-center py-4">
            <div className="fs-4 text-muted mb-2">📋</div>
            <p className="mb-2">No data available</p>
            <button type="button" className="btn btn-primary btn-sm">
              Add New User
            </button>
          </div>} aria-label="Table with custom empty state" />;
  }
}`,...(lt=(it=j.parameters)==null?void 0:it.docs)==null?void 0:lt.source},description:{story:"Table with custom empty content.",...(dt=(ct=j.parameters)==null?void 0:ct.docs)==null?void 0:dt.description}}};var mt,ut,pt,bt,ht;k.parameters={...k.parameters,docs:{...(mt=k.parameters)==null?void 0:mt.docs,source:{originalSource:`{
  args: {
    columns: basicColumns,
    data: users,
    caption: 'List of registered users in the system'
  }
}`,...(pt=(ut=k.parameters)==null?void 0:ut.docs)==null?void 0:pt.source},description:{story:"Table with caption for accessibility.",...(ht=(bt=k.parameters)==null?void 0:bt.docs)==null?void 0:ht.description}}};var gt,yt,St,Ct,wt;T.parameters={...T.parameters,docs:{...(gt=T.parameters)==null?void 0:gt.docs,source:{originalSource:`{
  args: {
    columns: basicColumns,
    data: users,
    footer: \`Total: \${users.length} users\`,
    'aria-label': 'Table with footer'
  }
}`,...(St=(yt=T.parameters)==null?void 0:yt.docs)==null?void 0:St.source},description:{story:"Table with footer.",...(wt=(Ct=T.parameters)==null?void 0:Ct.docs)==null?void 0:wt.description}}};var vt,ft,xt,Nt,jt;R.parameters={...R.parameters,docs:{...(vt=R.parameters)==null?void 0:vt.docs,source:{originalSource:`{
  render: function StickyHeaderStory() {
    // Generate more data
    const manyUsers = Array.from({
      length: 20
    }, (_, i) => ({
      ...users[i % users.length],
      id: i + 1,
      name: \`User \${i + 1}\`,
      email: \`user\${i + 1}@example.com\`
    }));
    return <Table columns={basicColumns} data={manyUsers} stickyHeader maxHeight={300} aria-label="Table with sticky header" />;
  }
}`,...(xt=(ft=R.parameters)==null?void 0:ft.docs)==null?void 0:xt.source},description:{story:"Table with sticky header for long lists.",...(jt=(Nt=R.parameters)==null?void 0:Nt.docs)==null?void 0:jt.description}}};var kt,Tt,Rt,$t,Et;$.parameters={...$.parameters,docs:{...(kt=$.parameters)==null?void 0:kt.docs,source:{originalSource:`{
  render: function StickyColumnsStory() {
    const wideColumns: TableColumn<User>[] = [{
      id: 'id',
      header: 'ID',
      accessor: 'id',
      sticky: 'left',
      width: 60
    }, {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      minWidth: 150
    }, {
      id: 'email',
      header: 'Email',
      accessor: 'email',
      minWidth: 200
    }, {
      id: 'role',
      header: 'Role',
      accessor: 'role',
      minWidth: 120
    }, {
      id: 'department',
      header: 'Department',
      accessor: 'department',
      minWidth: 150
    }, {
      id: 'salary',
      header: 'Salary',
      accessor: 'salary',
      minWidth: 120,
      align: 'right',
      cell: value => \`$\${Number(value).toLocaleString()}\`
    }, {
      id: 'joinDate',
      header: 'Join Date',
      accessor: 'joinDate',
      minWidth: 120
    }, {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      minWidth: 100,
      cell: value => {
        const variant = value === 'active' ? 'success' : value === 'pending' ? 'warning' : 'secondary';
        return <Badge variant={variant}>{String(value)}</Badge>;
      }
    }, {
      id: 'actions',
      header: 'Actions',
      accessor: () => null,
      sticky: 'right',
      width: 100,
      align: 'center',
      cell: () => <button type="button" className="btn btn-sm btn-outline-primary">
            Edit
          </button>
    }];
    return <div style={{
      maxWidth: 600
    }}>
        <p className="text-muted small mb-2">
          Scroll horizontally to see sticky columns (ID on left, Actions on right).
        </p>
        <Table columns={wideColumns} data={users} responsive aria-label="Table with sticky columns" />
      </div>;
  }
}`,...(Rt=(Tt=$.parameters)==null?void 0:Tt.docs)==null?void 0:Rt.source},description:{story:`Table with sticky columns that stay visible during horizontal scroll.
The ID column is sticky to the left, and the Actions column is sticky to the right.`,...(Et=($t=$.parameters)==null?void 0:$t.docs)==null?void 0:Et.description}}};var Dt,At,It,Ut,Wt;E.parameters={...E.parameters,docs:{...(Dt=E.parameters)==null?void 0:Dt.docs,source:{originalSource:`{
  render: function ActionColumnStory() {
    const [lastAction, setLastAction] = useState<string | null>(null);
    const actionColumns: TableColumn<User>[] = [{
      id: 'name',
      header: 'Name',
      accessor: 'name'
    }, {
      id: 'email',
      header: 'Email',
      accessor: 'email'
    }, {
      id: 'role',
      header: 'Role',
      accessor: 'role'
    }, {
      id: 'actions',
      header: 'Actions',
      accessor: () => null,
      // No data to access for actions
      align: 'right',
      cell: (_, row) => <div className="d-flex gap-1 justify-content-end">
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={e => {
          e.stopPropagation();
          setLastAction(\`Edit: \${(row as User).name}\`);
        }}>
              Edit
            </button>
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={e => {
          e.stopPropagation();
          setLastAction(\`Delete: \${(row as User).name}\`);
        }}>
              Delete
            </button>
          </div>
    }];
    return <div>
        {lastAction && <div className="alert alert-info mb-3">
            Last action: <strong>{lastAction}</strong>
          </div>}
        <Table columns={actionColumns} data={users} aria-label="Table with action buttons" />
      </div>;
  }
}`,...(It=(At=E.parameters)==null?void 0:At.docs)==null?void 0:It.source},description:{story:`Table with an actions column containing edit/delete buttons.
Action columns use a cell renderer since they don't map to data.`,...(Wt=(Ut=E.parameters)==null?void 0:Ut.docs)==null?void 0:Wt.description}}};var Bt,Mt,Ht,Lt,Ft;D.parameters={...D.parameters,docs:{...(Bt=D.parameters)==null?void 0:Bt.docs,source:{originalSource:`{
  render: function RowClickStory() {
    const [clickedRow, setClickedRow] = useState<User | null>(null);
    return <div>
        {clickedRow && <div className="alert alert-info mb-3">
            Clicked: {clickedRow.name} ({clickedRow.email})
          </div>}
        <Table columns={basicColumns} data={users} onRowClick={row => setClickedRow(row as User)} aria-label="Clickable rows table" />
      </div>;
  }
}`,...(Ht=(Mt=D.parameters)==null?void 0:Mt.docs)==null?void 0:Ht.source},description:{story:"Table with row click handler.",...(Ft=(Lt=D.parameters)==null?void 0:Lt.docs)==null?void 0:Ft.description}}};var Vt,zt,Pt,_t,Ot;A.parameters={...A.parameters,docs:{...(Vt=A.parameters)==null?void 0:Vt.docs,source:{originalSource:`{
  render: function FullFeaturedStory() {
    const [sortConfig, setSortConfig] = useState<SortConfig | undefined>();
    const [selected, setSelected] = useState<RowId[]>([]);
    const fullColumns: TableColumn<User>[] = [{
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true
    }, {
      id: 'email',
      header: 'Email',
      accessor: 'email',
      sortable: true
    }, {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      cell: value => {
        const variant = value === 'active' ? 'success' : value === 'pending' ? 'warning' : 'secondary';
        return <Badge variant={variant}>{String(value)}</Badge>;
      }
    }, {
      id: 'salary',
      header: 'Salary',
      accessor: 'salary',
      align: 'right',
      sortable: true,
      cell: value => \`$\${Number(value).toLocaleString()}\`
    }];
    return <div>
        <div className="mb-3 d-flex gap-3 align-items-center">
          <span>
            <strong>Selected:</strong> {selected.length} rows
          </span>
          <span>
            <strong>Sort:</strong>{' '}
            {sortConfig ? \`\${sortConfig.columnId} (\${sortConfig.direction})\` : 'None'}
          </span>
        </div>
        <Table columns={fullColumns} data={users} variant="striped" selectionMode="multiple" rowId="id" selectedRows={selected} onSelectionChange={setSelected} sortConfig={sortConfig} onSortChange={setSortConfig} caption="Employee Directory" />
      </div>;
  }
}`,...(Pt=(zt=A.parameters)==null?void 0:zt.docs)==null?void 0:Pt.source},description:{story:"Full-featured table with sorting, selection, and custom cells.",...(Ot=(_t=A.parameters)==null?void 0:_t.docs)==null?void 0:Ot.description}}};var Jt,Gt,qt,Kt,Qt;I.parameters={...I.parameters,docs:{...(Jt=I.parameters)==null?void 0:Jt.docs,source:{originalSource:`{
  render: function AccessibilityStory() {
    return <div>
        <h2 id="employees-heading" className="h5 mb-3">
          Employee List
        </h2>
        <p id="employees-desc" className="text-muted small mb-3">
          This table shows all employees with their roles and departments.
        </p>
        <Table columns={sortableColumns} data={users} aria-labelledby="employees-heading" aria-describedby="employees-desc" selectionMode="multiple" rowId="id" />
      </div>;
  }
}`,...(qt=(Gt=I.parameters)==null?void 0:Gt.docs)==null?void 0:qt.source},description:{story:"Table with all accessibility features enabled.",...(Qt=(Kt=I.parameters)==null?void 0:Kt.docs)==null?void 0:Qt.description}}};var Xt,Yt,Zt,es,ts;U.parameters={...U.parameters,docs:{...(Xt=U.parameters)==null?void 0:Xt.docs,source:{originalSource:`{
  render: function VisualStatesStory() {
    const [state, setState] = useState<'none' | 'one' | 'some' | 'all'>('none');
    const getSelectedRows = (): RowId[] => {
      switch (state) {
        case 'none':
          return [];
        case 'one':
          return [1];
        case 'some':
          return [1, 2, 3];
        case 'all':
          return users.map(u => u.id);
      }
    };
    return <div>
        <div className="mb-3 btn-group">
          <button type="button" className={\`btn btn-sm \${state === 'none' ? 'btn-primary' : 'btn-outline-primary'}\`} onClick={() => setState('none')}>
            None
          </button>
          <button type="button" className={\`btn btn-sm \${state === 'one' ? 'btn-primary' : 'btn-outline-primary'}\`} onClick={() => setState('one')}>
            One
          </button>
          <button type="button" className={\`btn btn-sm \${state === 'some' ? 'btn-primary' : 'btn-outline-primary'}\`} onClick={() => setState('some')}>
            Some
          </button>
          <button type="button" className={\`btn btn-sm \${state === 'all' ? 'btn-primary' : 'btn-outline-primary'}\`} onClick={() => setState('all')}>
            All
          </button>
        </div>
        <p className="small text-muted mb-3">
          Current visual state: <code>data-visual-state="{state}"</code>
        </p>
        <Table columns={basicColumns} data={users} selectionMode="multiple" rowId="id" selectedRows={getSelectedRows()} aria-label="Visual states demo" />
      </div>;
  }
}`,...(Zt=(Yt=U.parameters)==null?void 0:Yt.docs)==null?void 0:Zt.source},description:{story:"Example showing all visual states based on selection.",...(ts=(es=U.parameters)==null?void 0:es.docs)==null?void 0:ts.description}}};const ls=["Default","Striped","Bordered","Borderless","SmallSize","NoHover","DarkHeader","PrimaryHeader","Sortable","ControlledSorting","SingleSelection","MultipleSelection","SelectionWithDisabledRows","CustomCellRenderers","EmptyState","CustomEmptyContent","WithCaption","WithFooter","StickyHeader","StickyColumns","ActionColumn","RowClick","FullFeatured","AccessibilityShowcase","VisualStates"];export{I as AccessibilityShowcase,E as ActionColumn,u as Bordered,p as Borderless,C as ControlledSorting,x as CustomCellRenderers,j as CustomEmptyContent,g as DarkHeader,d as Default,N as EmptyState,A as FullFeatured,v as MultipleSelection,h as NoHover,y as PrimaryHeader,D as RowClick,f as SelectionWithDisabledRows,w as SingleSelection,b as SmallSize,S as Sortable,$ as StickyColumns,R as StickyHeader,m as Striped,U as VisualStates,k as WithCaption,T as WithFooter,ls as __namedExportsOrder,is as default};
