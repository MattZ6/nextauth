import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { AuthTokenError } from '../services/errors/AuthTokenError';

import { getAuthCookies, removeAuthCookies } from './authCookies';

export function withSSTAuth<P>(fn: GetServerSideProps<P>) {
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
