import { AxiosInstance } from 'axios';

import { api } from '../../apiClient'

export namespace RefreshTokenService {
  export type Request = {
    refreshToken: string;
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

  export function refreshToken(data: Request, options?: Options) {
    const instance = options?.instance ?? api;

    return instance.post<Authentication>('/refresh', data);
  }
}
