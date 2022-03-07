import { AxiosInstance } from 'axios';

import { api } from '../../apiClient'

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

  type Options = {
    instance?: AxiosInstance;
  }

  export function signIn(data: Request, options?: Options) {
    const instance = options?.instance ?? api;

    return instance.post<Authentication>('/sessions', data);
  }
}
