import type { NextPage } from 'next';
import Head from 'next/head';
import GameProvider from '../../components/gameProvider';
import { Layout } from '../../components/layout';
import { SitePage } from '../../shared/sitePage';

const Index: NextPage = (): JSX.Element => {
    return (
        <Layout title={SitePage.illustrationLogic.title} top={false}>
            <Head>
                <title>{SitePage.illustrationLogic.title}</title>
                <meta name="description" content={SitePage.illustrationLogic.description} />
                <meta property="og:title" content={SitePage.illustrationLogic.title} />
                <meta property="og:url" content={SitePage.illustrationLogic.url} />
                <meta property="og:description" content={SitePage.illustrationLogic.description} />
                <meta property="og:image" content={SitePage.illustrationLogic.image} />
            </Head>
            <GameProvider componentName="illustrationLogic" />
        </Layout>
    );
};

export default Index;
