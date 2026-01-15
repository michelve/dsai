# Table Component Guidelines

The Table component provides tabular data display with optional sorting and pagination.

## Import

```tsx
import { Table } from '@dsai-io/react';
```

## When to Use

Use Table when:

- Displaying structured data in rows and columns
- Comparing items across multiple attributes
- Showing sortable, filterable data
- Users need to scan and find specific items

Do not use Table when:

- Data is better as cards (mobile-first)
- Only showing key-value pairs (use description list)
- Data has no logical columns

## Basic Usage

```tsx
<Table>
  <Table.Head>
    <Table.Row>
      <Table.Header>Name</Table.Header>
      <Table.Header>Email</Table.Header>
      <Table.Header>Role</Table.Header>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>John Doe</Table.Cell>
      <Table.Cell>john@example.com</Table.Cell>
      <Table.Cell>Admin</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Jane Smith</Table.Cell>
      <Table.Cell>jane@example.com</Table.Cell>
      <Table.Cell>User</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

## With Data Array

```tsx
<Table data={users}>
  <Table.Head>
    <Table.Row>
      <Table.Header>Name</Table.Header>
      <Table.Header>Email</Table.Header>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    {users.map((user) => (
      <Table.Row key={user.id}>
        <Table.Cell>{user.name}</Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>
```

## Sortable Headers

```tsx
const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

<Table>
  <Table.Head>
    <Table.Row>
      <Table.Header
        sortable
        sorted={sortConfig.key === 'name' ? sortConfig.direction : undefined}
        onSort={() => handleSort('name')}
      >
        Name
      </Table.Header>
      <Table.Header
        sortable
        sorted={sortConfig.key === 'email' ? sortConfig.direction : undefined}
        onSort={() => handleSort('email')}
      >
        Email
      </Table.Header>
    </Table.Row>
  </Table.Head>
  <Table.Body>...</Table.Body>
</Table>;
```

## With Actions

```tsx
<Table>
  <Table.Head>
    <Table.Row>
      <Table.Header>Name</Table.Header>
      <Table.Header>Status</Table.Header>
      <Table.Header align="right">Actions</Table.Header>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    {items.map((item) => (
      <Table.Row key={item.id}>
        <Table.Cell>{item.name}</Table.Cell>
        <Table.Cell>
          <Badge variant={item.active ? 'success' : 'default'}>
            {item.active ? 'Active' : 'Inactive'}
          </Badge>
        </Table.Cell>
        <Table.Cell align="right">
          <Button size="sm" variant="ghost" onClick={() => edit(item)}>
            Edit
          </Button>
        </Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>
```

## Selectable Rows

```tsx
const [selected, setSelected] = useState<string[]>([]);

<Table>
  <Table.Head>
    <Table.Row>
      <Table.Header>
        <Checkbox
          checked={selected.length === items.length}
          indeterminate={selected.length > 0 && selected.length < items.length}
          onChange={(e) => setSelected(e.target.checked ? items.map((i) => i.id) : [])}
          aria-label="Select all"
        />
      </Table.Header>
      <Table.Header>Name</Table.Header>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    {items.map((item) => (
      <Table.Row key={item.id} selected={selected.includes(item.id)}>
        <Table.Cell>
          <Checkbox
            checked={selected.includes(item.id)}
            onChange={() => toggleSelection(item.id)}
            aria-label={`Select ${item.name}`}
          />
        </Table.Cell>
        <Table.Cell>{item.name}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>;
```

## With Pagination

```tsx
<Table>
  <Table.Head>...</Table.Head>
  <Table.Body>...</Table.Body>
</Table>
<Pagination
  total={totalItems}
  pageSize={10}
  currentPage={currentPage}
  onChange={setCurrentPage}
/>
```

## Loading State

```tsx
<Table>
  <Table.Head>...</Table.Head>
  <Table.Body>
    {isLoading ? (
      <Table.Row>
        <Table.Cell colSpan={4}>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
            <Spinner />
          </div>
        </Table.Cell>
      </Table.Row>
    ) : (
      items.map((item) => <Table.Row key={item.id}>...</Table.Row>)
    )}
  </Table.Body>
</Table>
```

## Empty State

```tsx
<Table>
  <Table.Head>...</Table.Head>
  <Table.Body>
    {items.length === 0 ? (
      <Table.Row>
        <Table.Cell colSpan={4}>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
            <Icon name="inbox" size="lg" />
            <p>No items found</p>
          </div>
        </Table.Cell>
      </Table.Row>
    ) : (
      items.map((item) => <Table.Row key={item.id}>...</Table.Row>)
    )}
  </Table.Body>
</Table>
```

## Sizes

```tsx
<Table size="sm">...</Table>  {/* Compact */}
<Table size="md">...</Table>  {/* Default */}
<Table size="lg">...</Table>  {/* Spacious */}
```

## Accessibility

- Use proper header cells for column labels
- Include `scope` attribute on headers
- Provide row selection labels
- Announce sort direction changes

```tsx
<Table aria-label="User list">
  <Table.Head>
    <Table.Row>
      <Table.Header scope="col">Name</Table.Header>
      <Table.Header scope="col">Email</Table.Header>
    </Table.Row>
  </Table.Head>
</Table>
```

## Do's and Don'ts

### Do

- Use proper table semantics
- Provide sortable columns for large datasets
- Include pagination for many rows
- Show loading and empty states

### Don't

- Don't use tables for layout
- Don't hide important columns on mobile
- Don't use for single-column lists
- Don't skip header cells
