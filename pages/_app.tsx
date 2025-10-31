import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.webmanifest?v=2" />
        <link rel="icon" href="/icons/app-icon-180.png?v=2" sizes="180x180" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/app-icon-180.png?v=2" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TransitExpense" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
