import { ReactNode } from 'react';

import { AuthProvider } from './AuthContext';

type Props = {
  children: ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
