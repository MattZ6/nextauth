import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import decode from 'jwt-decode';

import { AuthTokenError } from '../services/errors/AuthTokenError';

import { getAuthCookies, removeAuthCookies } from './authCookies';
import { validateUserPermissions } from './validateUserPermissions';

type WithSSRAuthOptions = {
  permissions?: string[];
  roles?: string[];
}

type TokenData = {
  permissions: string[];
  roles: string[];
  iat: number;
  exp: number;
  sub: string;
}

export function withSSTAuth<P>(fn: GetServerSideProps<P>, options?: WithSSRAuthOptions) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = getAuthCookies(ctx);

    if (!cookies.token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        }
      }
    }

    if (options) {
      const tokenData = decode<TokenData>(cookies.token);

      const userHasValidPermissions = validateUserPermissions({
        user: tokenData!,
        permissions: options?.permissions,
        roles: options?.roles,
      });

      if (!userHasValidPermissions) {
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false,
          }
        }
      }
    }

    try {
      const response = await fn(ctx);

      return response;
    } catch (error) {
      if (error instanceof AuthTokenError) {
        removeAuthCookies(ctx);

        return {
          redirect: {
            destination: '/',
            permanent: false,
          }
        }
      }

      throw error;
    }
  }
}
