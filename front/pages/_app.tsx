import type { AppProps } from 'next/app';
import Head from 'next/head';
import { GoogleAnalytics } from '../components/googleAnalytics';
import SoundStateProvider from '../components/soundStateProvider';
import { Site } from '../shared/site';
import { existsGoogleSearchConsoleId, googleSearchConsoleId, useInvokePageView } from '../shared/utility/googleUtility';
import '../styles/globals.css';

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
    useInvokePageView();

    return (
        <>
            <Head>
                <link rel="icon" href={Site.favicon} />
                <title>{Site.title}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1.0" />
                <meta name="author" content={Site.author} />
                <meta name="description" content={Site.page.home.description} />
                <meta property="og:title" content={Site.title} />
                <meta property="og:url" content={Site.url} />
                <meta property="og:site_name" content={Site.title} />
                <meta property="og:description" content={Site.page.home.description} />
                <meta property="og:type" content="website" />
                <meta property="og:locale" content="ja_JP" />
                <meta name="twitter:card" content="summary_large_image" />
                {existsGoogleSearchConsoleId && <meta name="google-site-verification" content={googleSearchConsoleId} />}
            </Head>
            <GoogleAnalytics />
            <SoundStateProvider>
                <Component {...pageProps} />
            </SoundStateProvider>
        </>
    );
};

export default App;
