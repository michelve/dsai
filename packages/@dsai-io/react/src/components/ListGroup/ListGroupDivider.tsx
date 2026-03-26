import { memo } from 'react';

export const ListGroupDivider = memo(function ListGroupDivider() {
  return <li role="separator" className="list-group-divider border-bottom my-1 p-0" />;
});

ListGroupDivider.displayName = 'ListGroupDivider';
