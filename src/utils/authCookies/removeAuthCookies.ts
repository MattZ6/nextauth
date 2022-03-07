import { destroyCookie } from 'nookies';

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '.';

export function removeAuthCookies(context?: any) {
  destroyCookie(context, ACCESS_TOKEN_KEY);
  destroyCookie(context, REFRESH_TOKEN_KEY);
}
