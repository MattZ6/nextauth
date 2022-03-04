import { api } from '../api'

export namespace GetProfileService {
  export type User = {
    email: string;
    permissions: string[];
    roles: string[];
  }

  export function getProfile() {
    return api.get<User>('/me');
  }
}
