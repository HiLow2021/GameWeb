import type { NextPage } from 'next';
import Head from 'next/head';
import GameProvider from '../../components/gameProvider';
import { Layout } from '../../components/layout';
import { Site } from '../../shared/site';
import { SitePage } from '../../shared/sitePage';

const Index: NextPage = (): JSX.Element => {
    return (
        <Layout title={SitePage.othello.title} top={false}>
            <Head>
                <title>{`${SitePage.othello.title} - ${Site.title}`}</title>
                <meta name="description" content={SitePage.othello.description} key="description" />
                <meta property="og:title" content={`${SitePage.othello.title} - ${Site.title}`} key="og:title" />
                <meta property="og:url" content={SitePage.othello.url} key="og:url" />
                <meta property="og:description" content={SitePage.othello.description} key="og:description" />
                <meta property="og:image" content={SitePage.othello.image} key="og:image" />
            </Head>
            <GameProvider componentName="othello" />
        </Layout>
    );
};

export default Index;
