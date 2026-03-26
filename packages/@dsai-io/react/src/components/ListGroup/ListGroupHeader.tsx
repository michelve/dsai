import { memo, type ReactNode } from 'react';

interface ListGroupHeaderProps {
  children: ReactNode;
}

export const ListGroupHeader = memo(function ListGroupHeader({ children }: ListGroupHeaderProps) {
  return (
    <li
      role="presentation"
      className="list-group-header fw-semibold text-body-secondary small px-3 py-2"
    >
      {children}
    </li>
  );
});

ListGroupHeader.displayName = 'ListGroupHeader';
