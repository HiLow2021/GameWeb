import type { NextPage } from 'next';
import Head from 'next/head';
import GameProvider from '../../components/gameProvider';
import { Layout } from '../../components/layout';
import { Site } from '../../shared/site';
import { SitePage } from '../../shared/sitePage';

const Index: NextPage = (): JSX.Element => {
    return (
        <Layout title={SitePage.connectFour.title} top={false}>
            <Head>
                <title>{`${SitePage.connectFour.title} - ${Site.title}`}</title>
                <meta name="description" content={SitePage.connectFour.description} key="description" />
                <meta property="og:title" content={`${SitePage.connectFour.title} - ${Site.title}`} key="og:title" />
                <meta property="og:url" content={SitePage.connectFour.url} key="og:url" />
                <meta property="og:description" content={SitePage.connectFour.description} key="og:description" />
                <meta property="og:image" content={SitePage.connectFour.image} key="og:image" />
            </Head>
            <GameProvider componentName="connectFour" />
        </Layout>
    );
};

export default Index;
