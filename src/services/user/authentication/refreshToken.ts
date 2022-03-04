import { api } from '../../api'

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

  export function refreshToken(data: Request) {
    return api.post<Authentication>('/refresh', data);
  }
}
