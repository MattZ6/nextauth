import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { getCookies } from '../services/api';

export function withSSTAuth<P>(fn: GetServerSideProps<P>) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = getCookies(ctx);

    if (!cookies.token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        }
      }
    }

    return await fn(ctx);
  }
}
