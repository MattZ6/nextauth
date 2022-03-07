import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { getAuthCookies } from './authCookies';

export function withSSTGuest<P>(fn: GetServerSideProps<P>) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = getAuthCookies(ctx);

    if (cookies.token) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        }
      }
    }

    return await fn(ctx);
  }
}
