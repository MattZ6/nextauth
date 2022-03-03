import { createContext, ReactNode, useContext, useState } from 'react';
import Router from 'next/router';

import { api } from '../services/api';

type Credentials = {
  email: string;
  password: string;
}

type UserAuthentication = {
  email: string;
  permissions: string[];
  roles: string[];
}

type AuthContextData = {
  isAuthenticated: boolean;
  user?: UserAuthentication;
  signIn: (data: Credentials) => Promise<void>;
}

const AuthContext = createContext({} as AuthContextData);

type Authentication = {
  token: string;
  refreshToken: string;
  permissions: string[];
  roles: string[];
}

type Props = {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<UserAuthentication | undefined>();
  const isAuthenticated = !!user;

  async function signIn(credentials: Credentials) {
    try {
      const { data } = await api.post<Authentication>('/sessions', credentials);

      setUser({
        email: credentials.email,
        permissions: data.permissions,
        roles: data.roles,
      });

      Router.push('/dashboard');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      signIn
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
