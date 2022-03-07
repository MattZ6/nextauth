import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import Router from 'next/router';

import { SignInService, GetProfileService } from '../services/user';

import { getAuthCookies, removeAuthCookies, setAuthCookies } from '../utils/authCookies';
import { api } from '../services/apiClient';

type AuthContextData = {
  isAuthenticated: boolean;
  user?: GetProfileService.User;
  signIn: (data: SignInService.Request) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext({} as AuthContextData);

type Props = {
  children: ReactNode;
}

let authChanel: BroadcastChannel;

export function signOut() {
  removeAuthCookies();

  Router.replace('/');

  if (authChanel) {
    authChanel.postMessage('SIGN_OUT');
  }
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<GetProfileService.User | undefined>();
  const isAuthenticated = !!user;

  useEffect(() => {
    authChanel = new BroadcastChannel('authentication');

    authChanel.onmessage = event => {
      switch (event.data) {
        case 'SIGN_OUT':
          Router.reload();
          break;

        case 'SIGN_IN':
          Router.reload();
          break;

        default:
          break;
      }
    }

    return () => {
      authChanel.close();
    }
  }, []);

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

      if (authChanel) {
        authChanel.postMessage('SIGN_IN')
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
