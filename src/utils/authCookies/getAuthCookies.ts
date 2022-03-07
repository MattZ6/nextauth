import { parseCookies } from 'nookies';

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '.';

type Cookies = {
  token?: string;
  refreshToken?: string;
}

export function getAuthCookies(context?: any): Cookies {
  const cookies = parseCookies(context);

  const token = cookies[ACCESS_TOKEN_KEY] ?? undefined;
  const refreshToken = cookies[REFRESH_TOKEN_KEY] ?? undefined;

  return {
    token,
    refreshToken,
  }
}
