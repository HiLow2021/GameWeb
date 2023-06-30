import type { NextPage } from 'next';
import Head from 'next/head';
import GameProvider from '../../components/gameProvider';
import { Layout } from '../../components/layout';
import { SitePage } from '../../shared/sitePage';

const Index: NextPage = (): JSX.Element => {
    return (
        <Layout title={SitePage.lightsOut.title} top={false}>
            <Head>
                <title>{SitePage.lightsOut.title}</title>
                <meta name="description" content={SitePage.lightsOut.description} />
                <meta property="og:title" content={SitePage.lightsOut.title} />
                <meta property="og:url" content={SitePage.lightsOut.url} />
                <meta property="og:description" content={SitePage.lightsOut.description} />
                <meta property="og:image" content={SitePage.lightsOut.image} />
            </Head>
            <GameProvider componentName="lightsOut" />
        </Layout>
    );
};

export default Index;
