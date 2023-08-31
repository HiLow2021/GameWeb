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
                <meta name="author" content={Site.author} key="author" />
                <meta name="description" content={Site.page.home.description} key="description" />
                <meta property="og:title" content={Site.title} key="og:title" />
                <meta property="og:url" content={Site.url} key="og:url" />
                <meta property="og:site_name" content={Site.title} key="og:site_name" />
                <meta property="og:description" content={Site.page.home.description} key="og:description" />
                <meta property="og:type" content="website" key="og:type" />
                <meta property="og:locale" content="ja_JP" key="og:locale" />
                <meta name="twitter:site" content={Site.twitter} key="twitter:site" />
                <meta name="twitter:creator" content={Site.twitter} key="twitter:creator" />
                <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
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
