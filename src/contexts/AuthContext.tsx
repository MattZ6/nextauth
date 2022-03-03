import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import Router from 'next/router';
import {  parseCookies, destroyCookie } from 'nookies';

import {
  api,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  Authentication,
  setAuthCookies,
} from '../services/api';

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

type Props = {
  children: ReactNode;
}

export function signOut() {
  destroyCookie(undefined, ACCESS_TOKEN_KEY);
  destroyCookie(undefined, REFRESH_TOKEN_KEY);

  Router.replace('/');
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<UserAuthentication | undefined>();
  const isAuthenticated = !!user;

  useEffect(() => {
    const cookies = parseCookies();

    const token = cookies[ACCESS_TOKEN_KEY];

    if (!token) {
      return;
    }

    api.get<UserAuthentication>('/me')
      .then(response => {
        const { email, permissions, roles } = response.data;

        setUser({
          email,
          permissions,
          roles,
        });
      })
      .catch(error => {
        signOut();
      });
  }, []);

  async function signIn(credentials: Credentials) {
    try {
      const { data } = await api.post<Authentication>('/sessions', credentials);

      setAuthCookies(api, data);

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
