import type { NextPage } from 'next';
import Head from 'next/head';
import GameProvider from '../../components/gameProvider';
import { Layout } from '../../components/layout';
import { SitePage } from '../../shared/sitePage';

const Index: NextPage = (): JSX.Element => {
    return (
        <Layout title={SitePage.gomoku.title} top={false}>
            <Head>
                <title>{SitePage.gomoku.title}</title>
                <meta name="description" content={SitePage.gomoku.description} />
                <meta property="og:title" content={SitePage.gomoku.title} />
                <meta property="og:url" content={SitePage.gomoku.url} />
                <meta property="og:description" content={SitePage.gomoku.description} />
                <meta property="og:image" content={SitePage.gomoku.image} />
            </Head>
            <GameProvider componentName="gomoku" />
        </Layout>
    );
};

export default Index;
