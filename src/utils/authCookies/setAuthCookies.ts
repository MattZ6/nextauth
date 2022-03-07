import { setCookie } from 'nookies';

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '.';

type Data = {
  token: string;
  refreshToken: string;
}

export function setAuthCookies(data: Data, context?: any) {
  setCookie(context, ACCESS_TOKEN_KEY, data.token, {
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 👈 30 days
  });

  setCookie(context, REFRESH_TOKEN_KEY, data.refreshToken, {
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 👈 30 days
  });
}
