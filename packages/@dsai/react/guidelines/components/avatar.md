# Avatar Component Guidelines

The Avatar component displays a visual representation of users or entities.

## Import

```tsx
import { Avatar } from '@dsai/react';
```

## When to Use

Use Avatar when:

- Showing user profile images
- Displaying user initials when no image
- Representing team members or contacts
- Indicating message authors

## Basic Usage

```tsx
// With image
<Avatar src="/user.jpg" alt="John Doe" />

// With initials (fallback)
<Avatar>JD</Avatar>

// With name (auto-generates initials)
<Avatar name="John Doe" />
```

## Sizes

```tsx
<Avatar size="xs" name="User" />  {/* 24px */}
<Avatar size="sm" name="User" />  {/* 32px */}
<Avatar size="md" name="User" />  {/* 40px */}
<Avatar size="lg" name="User" />  {/* 48px */}
<Avatar size="xl" name="User" />  {/* 64px */}
```

## Fallback

When image fails to load:

```tsx
// Falls back to initials
<Avatar src="/broken-url.jpg" name="John Doe" />

// Falls back to icon
<Avatar src="/broken-url.jpg" fallback={<Icon name="user" />} />
```

## Avatar Group

```tsx
<Avatar.Group max={3}>
  <Avatar src="/user1.jpg" name="Alice" />
  <Avatar src="/user2.jpg" name="Bob" />
  <Avatar src="/user3.jpg" name="Carol" />
  <Avatar src="/user4.jpg" name="Dave" />
  <Avatar src="/user5.jpg" name="Eve" />
</Avatar.Group>;
{
  /* Shows: Alice, Bob, Carol, +2 */
}
```

## With Status Indicator

```tsx
<Avatar src="/user.jpg" name="John Doe">
  <Avatar.Badge status="online" />
</Avatar>

<Avatar name="Jane Smith">
  <Avatar.Badge status="offline" />
</Avatar>

<Avatar name="Bob Wilson">
  <Avatar.Badge status="busy" />
</Avatar>
```

## Shapes

```tsx
<Avatar shape="circle" name="User" />  {/* default */}
<Avatar shape="square" name="User" />
```

## Accessibility

```tsx
// Image with proper alt text
<Avatar src="/user.jpg" alt="Profile photo of John Doe" />

// Decorative (name shown elsewhere)
<Avatar src="/user.jpg" alt="" name="John Doe" />
<span>John Doe</span>
```

## Common Patterns

### User List

```tsx
{
  users.map((user) => (
    <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
      <Avatar src={user.avatar} name={user.name} size="sm" />
      <span>{user.name}</span>
    </div>
  ));
}
```

### Comment Author

```tsx
<div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
  <Avatar src={author.avatar} name={author.name} size="md" />
  <div>
    <strong>{author.name}</strong>
    <p>{comment.text}</p>
  </div>
</div>
```

## Do's and Don'ts

### Do

- Provide meaningful alt text or name
- Use consistent sizes within context
- Show status when relevant

### Don't

- Don't use for non-person entities (use Icon)
- Don't stretch or distort images
- Don't use without alt/name
