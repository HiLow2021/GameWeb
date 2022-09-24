import type { AppProps } from 'next/app';
import Head from 'next/head';
import SoundStateProvider from '../components/soundStateProvider';
import { Environment } from '../shared/environment';
import '../styles/globals.css';

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
    return (
        <>
            <Head>
                <link rel="icon" href={Environment.siteFavicon} />
                <title>{Environment.siteTitle}</title>
                <meta name="viewport" content="width=device-width,initial-scale=1.0" />
                <meta name="description" content={Environment.siteDescription} />
                <meta property="og:title" content={Environment.siteTitle} />
                <meta property="og:url" content={Environment.siteUrl} />
                <meta property="og:site_name" content={Environment.siteTitle} />
                <meta property="og:description" content={Environment.siteDescription} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <SoundStateProvider>
                <Component {...pageProps} />
            </SoundStateProvider>
        </>
    );
};

export default App;
