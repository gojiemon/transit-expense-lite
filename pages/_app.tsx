import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/icons/app-icon-192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/app-icon-180.png" />
        {/* 既存のSVGもフォールバックとして残す */}
        <link rel="icon" href="/icons/te-icon.svg" type="image/svg+xml" />
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
