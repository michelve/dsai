# Table Component

A Bootstrap 5 table component with sorting, row selection, responsive layout, and sticky header support.

## Features

- **Sortable columns** with visual indicators and keyboard support
- **Row selection** with three modes: none, single, multiple
- **Responsive layout** with horizontal scroll on small screens
- **Sticky header** support for long tables
- **Semantic HTML** with proper ARIA attributes
- **FSM-based** state management for predictable behavior
- **TypeScript** with generic row type support

## Installation

```tsx
import { Table } from '@dsai-io/react';
import type { TableColumn } from '@dsai-io/react';
```

## Basic Usage

```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

const columns: TableColumn<User>[] = [
  { id: 'name', header: 'Name', accessor: 'name' },
  { id: 'email', header: 'Email', accessor: 'email' },
];

const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
];

<Table columns={columns} data={users} aria-label="User list" />;
```

## Examples

### Striped and Bordered

```tsx
// Striped rows
<Table columns={columns} data={users} variant="striped" />

// Bordered table
<Table columns={columns} data={users} variant="bordered" />

// Borderless table
<Table columns={columns} data={users} variant="borderless" />
```

### Small Table

```tsx
<Table columns={columns} data={users} size="sm" />
```

### With Header Color

```tsx
<Table columns={columns} data={users} headerColor="dark" />
<Table columns={columns} data={users} headerColor="primary" />
```

### Sortable Columns

```tsx
const sortableColumns: TableColumn<User>[] = [
  { id: 'name', header: 'Name', accessor: 'name', sortable: true },
  { id: 'email', header: 'Email', accessor: 'email', sortable: true },
];

// Uncontrolled sorting
<Table columns={sortableColumns} data={users} />;

// Controlled sorting
const [sortConfig, setSortConfig] = useState<SortConfig>();

<Table
  columns={sortableColumns}
  data={users}
  sortConfig={sortConfig}
  onSortChange={setSortConfig}
/>;
```

### Row Selection

```tsx
// Single selection
const [selected, setSelected] = useState<RowId>();

<Table
  columns={columns}
  data={users}
  selectionMode="single"
  rowId="id"
  selectedRows={selected}
  onSelectionChange={setSelected}
/>

// Multiple selection
const [selected, setSelected] = useState<RowId[]>([]);

<Table
  columns={columns}
  data={users}
  selectionMode="multiple"
  rowId="id"
  selectedRows={selected}
  onSelectionChange={setSelected}
/>

// With disabled rows
<Table
  columns={columns}
  data={users}
  selectionMode="multiple"
  rowId="id"
  disabledRows={[2, 3]}
  selectedRows={selected}
  onSelectionChange={setSelected}
/>
```

### Custom Cell Renderer

```tsx
const columns: TableColumn<User>[] = [
  { id: 'name', header: 'Name', accessor: 'name' },
  {
    id: 'email',
    header: 'Email',
    accessor: 'email',
    cell: (value, row) => <a href={`mailto:${value}`}>{String(value)}</a>,
  },
  {
    id: 'status',
    header: 'Status',
    accessor: (row) => (row.isActive ? 'Active' : 'Inactive'),
    cell: (value) => (
      <Badge variant={value === 'Active' ? 'success' : 'secondary'}>{String(value)}</Badge>
    ),
  },
];
```

### Sticky Header

```tsx
<Table columns={columns} data={longUserList} stickyHeader maxHeight={400} />
```

### Sticky Columns

Freeze columns to the left or right for wide tables with horizontal scrolling:

```tsx
const columns: TableColumn<User>[] = [
  // Sticky to the left - stays visible while scrolling right
  { id: 'id', header: 'ID', accessor: 'id', sticky: 'left', width: 80 },
  { id: 'name', header: 'Name', accessor: 'name' },
  { id: 'email', header: 'Email', accessor: 'email' },
  { id: 'department', header: 'Department', accessor: 'department' },
  // ... more columns
  // Sticky to the right - stays visible while scrolling left
  {
    id: 'actions',
    header: 'Actions',
    accessor: () => null,
    sticky: 'right',
    width: 120,
    cell: (_, row) => (
      <div className="d-flex gap-1">
        <Button size="sm" variant="outline-primary">
          Edit
        </Button>
        <Button size="sm" variant="outline-danger">
          Delete
        </Button>
      </div>
    ),
  },
];

<Table columns={columns} data={users} responsive />;
```

### Action Column

Create an actions column using the `cell` renderer. Set `accessor` to a dummy value since actions don't map to data:

```tsx
const columns: TableColumn<User>[] = [
  { id: 'name', header: 'Name', accessor: 'name' },
  { id: 'email', header: 'Email', accessor: 'email' },
  {
    id: 'actions',
    header: 'Actions',
    accessor: () => null, // No data to access
    align: 'right',
    cell: (_, row, index) => (
      <div className="d-flex gap-1 justify-content-end">
        <Button size="sm" variant="outline-primary" onClick={() => handleEdit(row)}>
          Edit
        </Button>
        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(row.id)}>
          Delete
        </Button>
      </div>
    ),
  },
];
```

**Tip**: Use `sticky: 'right'` to keep the actions column visible while scrolling horizontally.

### With Caption and Footer

```tsx
<Table
  columns={columns}
  data={users}
  caption="User Information"
  captionSide="top"
  footer={`Total: ${users.length} users`}
/>
```

### Custom Empty State

```tsx
<Table
  columns={columns}
  data={[]}
  emptyContent={
    <div className="text-center py-4">
      <p>No users found</p>
      <Button onClick={loadUsers}>Load Users</Button>
    </div>
  }
/>
```

### Pagination

```tsx
// Uncontrolled pagination (internal state)
<Table
  columns={columns}
  data={users}
  defaultPagination={{ page: 0, pageSize: 10 }}
  pageSizeOptions={[5, 10, 25, 50]}
/>

// Controlled pagination
const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });

<Table
  columns={columns}
  data={users}
  pagination={pagination}
  onPaginationChange={setPagination}
  pageSizeOptions={[5, 10, 25, 50]}
/>
```

### Multi-Column Sorting

Hold **Shift** and click additional column headers to sort by multiple columns. Use `maxSortColumns` to limit how many columns can be sorted simultaneously.

```tsx
<Table
  columns={sortableColumns}
  data={users}
  maxSortColumns={3}
  aria-label="Multi-sort table"
/>
```

### Row Expansion

```tsx
<Table
  columns={columns}
  data={users}
  expandable={{
    render: (row) => (
      <div className="p-3">
        <strong>Details for {row.name}:</strong> Additional content here.
      </div>
    ),
    expandAll: true, // Show "Expand All" toggle
  }}
/>
```

### Column Visibility

```tsx
// Hide specific columns
<Table
  columns={columns}
  data={users}
  columnVisibility={{ email: false, department: false }}
/>

// Controlled visibility with toggle UI
const [visibility, setVisibility] = useState<Record<string, boolean>>({});

<Table
  columns={columns}
  data={users}
  columnVisibility={visibility}
  onColumnVisibilityChange={setVisibility}
/>
```

### Column Resizing

```tsx
const resizableColumns: TableColumn<User>[] = [
  { id: 'name', header: 'Name', accessor: 'name', resizable: true },
  { id: 'email', header: 'Email', accessor: 'email', resizable: true, minWidth: 150, maxWidth: 400 },
  { id: 'role', header: 'Role', accessor: 'role', resizable: true },
];

<Table columns={resizableColumns} data={users} aria-label="Resizable table" />
```

### Server-Side Data

Use `manualSorting` and `manualPagination` flags when sorting and pagination are handled by the server.

```tsx
const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
const [sortConfig, setSortConfig] = useState<SortConfig>();

// Fetch data from API whenever pagination or sortConfig changes
const { data, totalCount } = useServerData({ pagination, sortConfig });

<Table
  columns={sortableColumns}
  data={data}
  manualSorting
  sortConfig={sortConfig}
  onSortChange={setSortConfig}
  manualPagination
  pagination={pagination}
  onPaginationChange={setPagination}
  totalRows={totalCount}
/>
```

### Column Alignment

```tsx
const columns: TableColumn<Product>[] = [
  { id: 'name', header: 'Product', accessor: 'name', align: 'left' },
  { id: 'quantity', header: 'Qty', accessor: 'quantity', align: 'center' },
  { id: 'price', header: 'Price', accessor: 'price', align: 'right' },
];
```

### Custom Row ID

```tsx
// Using property name
<Table columns={columns} data={users} rowId="id" />

// Using function
<Table
  columns={columns}
  data={users}
  rowId={(row, index) => `user-${row.id}`}
/>
```

## Props

### TableProps

| Prop                  | Type                                                   | Default               | Description                  |
| --------------------- | ------------------------------------------------------ | --------------------- | ---------------------------- |
| `columns`             | `TableColumn<T>[]`                                     | Required              | Column definitions           |
| `data`                | `T[]`                                                  | Required              | Array of row data            |
| `rowId`               | `keyof T \| ((row, index) => RowId)`                   | Index                 | Row identifier               |
| `variant`             | `'default' \| 'striped' \| 'bordered' \| 'borderless'` | `'default'`           | Table style variant          |
| `size`                | `'sm' \| 'md' \| 'lg'`                                 | `'md'`                | Table size                   |
| `headerColor`         | `TableColor`                                           | -                     | Header background color      |
| `hover`               | `boolean`                                              | `true`                | Enable row hover effect      |
| `responsive`          | `boolean`                                              | `true`                | Enable responsive wrapper    |
| `stickyHeader`        | `boolean`                                              | `false`               | Sticky header                |
| `maxHeight`           | `string \| number`                                     | -                     | Max height for sticky header |
| `sortConfig`          | `SortConfig`                                           | -                     | Controlled sort state        |
| `defaultSortConfig`   | `SortConfig`                                           | -                     | Initial sort state           |
| `onSortChange`        | `(config?: SortConfig) => void`                        | -                     | Sort change callback         |
| `selectionMode`       | `'none' \| 'single' \| 'multiple'`                     | `'none'`              | Row selection mode           |
| `selectedRows`        | `RowId \| RowId[]`                                     | -                     | Controlled selected rows     |
| `defaultSelectedRows` | `RowId \| RowId[]`                                     | -                     | Initial selected rows        |
| `onSelectionChange`   | `(selected) => void`                                   | -                     | Selection change callback    |
| `disabledRows`        | `RowId[]`                                              | `[]`                  | Disabled row IDs             |
| `emptyContent`        | `ReactNode`                                            | `'No data available'` | Empty state content          |
| `footer`              | `ReactNode`                                            | -                     | Table footer content         |
| `caption`             | `ReactNode`                                            | -                     | Table caption                |
| `captionSide`         | `'top' \| 'bottom'`                                    | `'top'`               | Caption position             |
| `onRowClick`          | `(row, index) => void`                                 | -                     | Row click callback           |
| `className`           | `string`                                               | -                     | Custom class name            |
| `style`               | `CSSProperties`                                        | -                     | Custom inline styles         |
| `pagination`          | `PaginationState`                                      | -                     | Controlled pagination state  |
| `defaultPagination`   | `PaginationState`                                      | -                     | Initial pagination state     |
| `onPaginationChange`  | `(state: PaginationState) => void`                     | -                     | Pagination change callback   |
| `pageSizeOptions`     | `number[]`                                             | `[10, 25, 50]`       | Page size dropdown options   |
| `totalRows`           | `number`                                               | -                     | Total rows (server-side)     |
| `manualPagination`    | `boolean`                                              | `false`               | Server-side pagination       |
| `manualSorting`       | `boolean`                                              | `false`               | Server-side sorting          |
| `maxSortColumns`      | `number`                                               | `3`                   | Max multi-sort columns       |
| `expandable`          | `ExpandableConfig<T>`                                  | -                     | Row expansion configuration  |
| `columnVisibility`    | `Record<string, boolean>`                              | -                     | Column visibility map        |
| `onColumnVisibilityChange` | `(vis: Record<string, boolean>) => void`          | -                     | Visibility change callback   |
| `aria-label`          | `string`                                               | -                     | Accessible label             |
| `aria-labelledby`     | `string`                                               | -                     | ID of labeling element       |
| `aria-describedby`    | `string`                                               | -                     | ID of describing element     |

### TableColumn

| Prop              | Type                               | Default  | Description              |
| ----------------- | ---------------------------------- | -------- | ------------------------ |
| `id`              | `string`                           | Required | Unique column identifier |
| `header`          | `ReactNode`                        | Required | Header content           |
| `accessor`        | `keyof T \| ((row) => unknown)`    | Required | Data accessor            |
| `cell`            | `(value, row, index) => ReactNode` | -        | Custom cell renderer     |
| `sortable`        | `boolean`                          | `false`  | Enable sorting           |
| `sortFn`          | `(a, b, direction) => number`      | -        | Custom sort function     |
| `width`           | `string \| number`                 | -        | Column width             |
| `minWidth`        | `string \| number`                 | -        | Minimum width            |
| `maxWidth`        | `string \| number`                 | -        | Maximum width            |
| `align`           | `'left' \| 'center' \| 'right'`    | `'left'` | Text alignment           |
| `sticky`          | `'left' \| 'right'`                | -        | Sticky column            |
| `resizable`       | `boolean`                          | `false`  | Enable column resizing   |
| `headerClassName` | `string`                           | -        | Header cell class        |
| `cellClassName`   | `string`                           | -        | Body cell class          |

## Accessibility

The Table component follows WCAG 2.2 AA guidelines:

### Semantic Structure

- Uses semantic `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>` elements
- Header cells have `scope="col"` attribute
- Caption element for table description

### ARIA Attributes

- `aria-sort` on sortable column headers (ascending/descending/none)
- `aria-selected` on rows when selection is enabled
- `aria-disabled` on disabled rows
- Support for `aria-label`, `aria-labelledby`, `aria-describedby`

### Keyboard Navigation

| Key              | Context         | Action                                  |
| ---------------- | --------------- | --------------------------------------- |
| `Enter` / `Space`| Sortable header | Toggle sort direction                   |
| `Shift+Enter`   | Sortable header | Add column to multi-sort                |
| `ArrowLeft`      | Header row      | Move focus to previous header           |
| `ArrowRight`     | Header row      | Move focus to next header               |
| `Enter` / `Space`| Selectable row  | Toggle row selection                    |
| `Enter` / `Space`| Expand toggle   | Expand or collapse row detail           |
| `Tab`            | Table           | Move focus to next interactive element  |

- Sortable headers are focusable and respond to Enter/Space
- Selectable rows are focusable and respond to Enter/Space
- Checkboxes have accessible labels

### Screen Readers

- Sort icons are hidden from screen readers (`aria-hidden`)
- "Select all" checkbox has clear accessible label
- Individual row checkboxes have "Select row N" labels

### Usage Guidelines

```tsx
// Always provide accessible name
<Table
  columns={columns}
  data={data}
  aria-label="User information table"
/>

// Or use caption
<Table
  columns={columns}
  data={data}
  caption="List of registered users"
/>

// Or reference external label
<h2 id="users-heading">Users</h2>
<Table
  columns={columns}
  data={data}
  aria-labelledby="users-heading"
/>
```

## Security

The Table component implements security best practices:

- **No `dangerouslySetInnerHTML`**: All content is safely escaped
- **XSS prevention**: Data values, headers, captions, and footers are rendered as text
- **Safe attribute handling**: Props are properly escaped by React
- **Custom cell renderers**: Receive values but must handle their own rendering safely

## Styling

The component uses Bootstrap 5 table classes:

```css
/* Base classes */
.table
.table-striped
.table-bordered
.table-borderless
.table-hover
.table-sm

/* Header colors */
.table-primary
.table-secondary
.table-dark
/* etc. */

/* Selection styling */
.table-active    /* Selected row */
.table-disabled  /* Disabled row */

/* Custom classes */
.table-select-cell     /* Selection column */
.table-sortable-header /* Sortable header */
.table-sorted          /* Currently sorted header */
.table-sort-icon       /* Sort indicator */
```

### Visual State Attribute

The table exposes a `data-visual-state` attribute for CSS styling:

```css
table[data-visual-state='none'] {
}
table[data-visual-state='one'] {
}
table[data-visual-state='some'] {
}
table[data-visual-state='all'] {
}
```

## State Management

The Table uses a Finite State Machine (FSM) for selection state:

### States

- `none`: No rows selected
- `one`: Exactly one row selected
- `some`: Multiple rows selected (not all)
- `all`: All enabled rows selected

### Events

- `RESET_FROM_PROPS`: Sync with controlled props
- `SELECT_ROW`: Select single row (single mode)
- `TOGGLE_ROW`: Toggle row selection (multiple mode)
- `TOGGLE_ALL`: Toggle all rows
- `CLEAR_ALL`: Deselect all rows

### Using FSM Predicates

```tsx
import {
  isAllSelected,
  isSomeSelected,
  isNoneSelected,
  isRowSelected,
  getSelectedCount,
} from '@dsai-io/react';
```

## TypeScript

The Table component is fully typed with generic support:

```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

// Column type is inferred
const columns: TableColumn<User>[] = [
  { id: 'name', header: 'Name', accessor: 'name' },
  // TypeScript will error if accessor doesn't match User properties
];

// Cell renderer gets typed value
const columns: TableColumn<User>[] = [
  {
    id: 'email',
    header: 'Email',
    accessor: 'email',
    cell: (value, row) => {
      // value is unknown, row is User
      return <a href={`mailto:${value}`}>{String(value)}</a>;
    },
  },
];
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future

Virtualization support for 10k+ rows via `@tanstack/react-virtual` is planned.

## Related Components

- [Checkbox](../Checkbox/README.md) - Used for row selection
- [Badge](../Badge/README.md) - Useful in custom cell renderers
- [Button](../Button/README.md) - Useful in table actions
