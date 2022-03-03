import { createContext, ReactNode, useContext } from 'react';

type Credentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  isAuthenticated: boolean;
  signIn: (data: Credentials) => Promise<void>;
}

const AuthContext = createContext({} as AuthContextData);

type Props = {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const isAuthenticated = false;

  async function signIn(data: Credentials) {
    console.log(data);
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
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
