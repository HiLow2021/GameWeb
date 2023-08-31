import type { NextPage } from 'next';
import Head from 'next/head';
import GameProvider from '../../components/gameProvider';
import { Layout } from '../../components/layout';
import { Site } from '../../shared/site';
import { SitePage } from '../../shared/sitePage';

const Index: NextPage = (): JSX.Element => {
    return (
        <Layout title={SitePage.gomoku.title} top={false}>
            <Head>
                <title>{`${SitePage.gomoku.title} - ${Site.title}`}</title>
                <meta name="description" content={SitePage.gomoku.description} key="description" />
                <meta property="og:title" content={`${SitePage.gomoku.title} - ${Site.title}`} key="og:title" />
                <meta property="og:url" content={SitePage.gomoku.url} key="og:url" />
                <meta property="og:description" content={SitePage.gomoku.description} key="og:description" />
                <meta property="og:image" content={SitePage.gomoku.image} key="og:image" />
            </Head>
            <GameProvider componentName="gomoku" />
        </Layout>
    );
};

export default Index;
