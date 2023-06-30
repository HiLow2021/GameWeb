import type { NextPage } from 'next';
import Head from 'next/head';
import GameProvider from '../../components/gameProvider';
import { Layout } from '../../components/layout';
import { SitePage } from '../../shared/sitePage';

const Index: NextPage = (): JSX.Element => {
    return (
        <Layout title={SitePage.othello.title} top={false}>
            <Head>
                <title>{SitePage.othello.title}</title>
                <meta name="description" content={SitePage.othello.description} />
                <meta property="og:title" content={SitePage.othello.title} />
                <meta property="og:url" content={SitePage.othello.url} />
                <meta property="og:description" content={SitePage.othello.description} />
                <meta property="og:image" content={SitePage.othello.image} />
            </Head>
            <GameProvider componentName="othello" />
        </Layout>
    );
};

export default Index;
