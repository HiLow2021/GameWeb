import type { NextPage } from 'next';
import Head from 'next/head';
import GameProvider from '../../components/gameProvider';
import { Layout } from '../../components/layout';
import { Site } from '../../shared/site';
import { SitePage } from '../../shared/sitePage';

const Index: NextPage = (): JSX.Element => {
    return (
        <Layout title={SitePage.illustrationLogic.title} top={false}>
            <Head>
                <title>{`${SitePage.illustrationLogic.title} - ${Site.title}`}</title>
                <meta name="description" content={SitePage.illustrationLogic.description} key="description" />
                <meta property="og:title" content={`${SitePage.illustrationLogic.title} - ${Site.title}`} key="og:title" />
                <meta property="og:url" content={SitePage.illustrationLogic.url} key="og:url" />
                <meta property="og:description" content={SitePage.illustrationLogic.description} key="og:description" />
                <meta property="og:image" content={SitePage.illustrationLogic.image} key="og:image" />
            </Head>
            <GameProvider componentName="illustrationLogic" />
        </Layout>
    );
};

export default Index;
