import { createContext, useContext } from 'react';

import type { ListGroupSelectionMode } from './ListGroup.types';

export interface ListGroupContextValue {
  readonly activeKeys: ReadonlySet<string>;
  readonly onSelect?: (
    eventKey: string,
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => void;
  readonly selectionMode: ListGroupSelectionMode;
}

export const ListGroupContext = createContext<ListGroupContextValue | null>(null);

export function useListGroupContext(): ListGroupContextValue | null {
  return useContext(ListGroupContext);
}
