import type { NextPage } from 'next';
import Head from 'next/head';
import GameProvider from '../../components/gameProvider';
import { Layout } from '../../components/layout';
import { Site } from '../../shared/site';
import { SitePage } from '../../shared/sitePage';

const Index: NextPage = (): JSX.Element => {
    return (
        <Layout title={SitePage.lightsOut.title} top={false}>
            <Head>
                <title>{`${SitePage.lightsOut.title} - ${Site.title}`}</title>
                <meta name="description" content={SitePage.lightsOut.description} key="description" />
                <meta property="og:title" content={`${SitePage.lightsOut.title} - ${Site.title}`} key="og:title" />
                <meta property="og:url" content={SitePage.lightsOut.url} key="og:url" />
                <meta property="og:description" content={SitePage.lightsOut.description} key="og:description" />
                <meta property="og:image" content={SitePage.lightsOut.image} key="og:image" />
            </Head>
            <GameProvider componentName="lightsOut" />
        </Layout>
    );
};

export default Index;
