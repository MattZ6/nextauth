import { ReactNode } from 'react';

import { useCan } from '../../hooks/useCan';

type Props = {
  permissions?: string[];
  roles?: string[];
  children: ReactNode;
}

export function Can({ permissions, roles, children }: Props) {
  const userCanSeeComponent = useCan({ permissions, roles });

  if (!userCanSeeComponent) {
    return null;
  }

  return (
    <>
      {children}
    </>
  );
}
