import type { AppProps } from 'next/app'

import { Providers } from '../contexts';

import '../styles/globals.css'

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}

export default CustomApp;
