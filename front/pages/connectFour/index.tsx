import type { NextPage } from 'next';
import Head from 'next/head';
import GameProvider from '../../components/gameProvider';
import { Layout } from '../../components/layout';
import { SitePage } from '../../shared/sitePage';

const Index: NextPage = (): JSX.Element => {
    return (
        <Layout title={SitePage.connectFour.title}>
            <Head>
                <title>{SitePage.connectFour.title}</title>
                <meta name="description" content={SitePage.connectFour.description} />
                <meta property="og:title" content={SitePage.connectFour.title} />
                <meta property="og:url" content={SitePage.connectFour.url} />
                <meta property="og:description" content={SitePage.connectFour.description} />
                <meta property="og:image" content={SitePage.connectFour.image} />
            </Head>
            <GameProvider componentName="connectFour" />
        </Layout>
    );
};

export default Index;
