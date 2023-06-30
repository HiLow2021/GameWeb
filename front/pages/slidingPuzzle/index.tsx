import type { NextPage } from 'next';
import Head from 'next/head';
import GameProvider from '../../components/gameProvider';
import { Layout } from '../../components/layout';
import { SitePage } from '../../shared/sitePage';

const Index: NextPage = (): JSX.Element => {
    return (
        <Layout title={SitePage.slidingPuzzle.title} top={false}>
            <Head>
                <title>{SitePage.slidingPuzzle.title}</title>
                <meta name="description" content={SitePage.slidingPuzzle.description} />
                <meta property="og:title" content={SitePage.slidingPuzzle.title} />
                <meta property="og:url" content={SitePage.slidingPuzzle.url} />
                <meta property="og:description" content={SitePage.slidingPuzzle.description} />
                <meta property="og:image" content={SitePage.slidingPuzzle.image} />
            </Head>
            <GameProvider componentName="slidingPuzzle" />
        </Layout>
    );
};

export default Index;
