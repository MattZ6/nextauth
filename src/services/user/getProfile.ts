import { AxiosInstance } from 'axios';

import { api } from '../apiClient';

export namespace GetProfileService {
  export type User = {
    email: string;
    permissions: string[];
    roles: string[];
  }

  type Options = {
    instance?: AxiosInstance;
  }

  export function getProfile(options?: Options) {
    const instance = options?.instance ?? api;

    return instance.get<User>('/me');
  }
}
