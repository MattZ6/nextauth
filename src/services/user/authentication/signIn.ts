import { api } from '../../api'

export namespace SignInService {
  export type Request = {
    email: string;
    password: string;
  }

  export type Authentication = {
    token: string;
    refreshToken: string;
    permissions: string[];
    roles: string[];
  }

  export function signIn(data: Request) {
    return api.post<Authentication>('/sessions', data);
  }
}
