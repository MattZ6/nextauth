import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import Router from 'next/router';

import { SignInService, GetProfileService } from '../services/user';

import { getAuthCookies, removeAuthCookies, setAuthCookies } from '../utils/authCookies';
import { api } from '../services/apiClient';

type AuthContextData = {
  isAuthenticated: boolean;
  user?: GetProfileService.User;
  signIn: (data: SignInService.Request) => Promise<void>;
}

const AuthContext = createContext({} as AuthContextData);

type Props = {
  children: ReactNode;
}

export function signOut() {
  removeAuthCookies();

  Router.replace('/');
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<GetProfileService.User | undefined>();
  const isAuthenticated = !!user;

  useEffect(() => {
    const { token } = getAuthCookies();

    if (!token) {
      return;
    }

    GetProfileService.getProfile()
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

  async function signIn(credentials: SignInService.Request) {
    try {
      const { data } = await SignInService.signIn(credentials);

      (api.defaults.headers as any)['Authorization'] = `Bearer ${data.token}`;

      setAuthCookies(data);

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
