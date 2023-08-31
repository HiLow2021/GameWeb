import type { NextPage } from 'next';
import Head from 'next/head';
import GameProvider from '../../components/gameProvider';
import { Layout } from '../../components/layout';
import { Site } from '../../shared/site';
import { SitePage } from '../../shared/sitePage';

const Index: NextPage = (): JSX.Element => {
    return (
        <Layout title={SitePage.slidingPuzzle.title} top={false}>
            <Head>
                <title>{`${SitePage.slidingPuzzle.title} - ${Site.title}`}</title>
                <meta name="description" content={SitePage.slidingPuzzle.description} key="description" />
                <meta property="og:title" content={`${SitePage.slidingPuzzle.title} - ${Site.title}`} key="og:title" />
                <meta property="og:url" content={SitePage.slidingPuzzle.url} key="og:url" />
                <meta property="og:description" content={SitePage.slidingPuzzle.description} key="og:description" />
                <meta property="og:image" content={SitePage.slidingPuzzle.image} key="og:image" />
            </Head>
            <GameProvider componentName="slidingPuzzle" />
        </Layout>
    );
};

export default Index;
