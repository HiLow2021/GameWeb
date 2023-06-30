import type { NextPage } from 'next';
import Head from 'next/head';
import GameProvider from '../../components/gameProvider';
import { Layout } from '../../components/layout';
import { SitePage } from '../../shared/sitePage';

const Index: NextPage = (): JSX.Element => {
    return (
        <Layout title={SitePage.oneStrokeWriting.title}>
            <Head>
                <title>{SitePage.oneStrokeWriting.title}</title>
                <meta name="description" content={SitePage.oneStrokeWriting.description} />
                <meta property="og:title" content={SitePage.oneStrokeWriting.title} />
                <meta property="og:url" content={SitePage.oneStrokeWriting.url} />
                <meta property="og:description" content={SitePage.oneStrokeWriting.description} />
                <meta property="og:image" content={SitePage.oneStrokeWriting.image} />
            </Head>
            <GameProvider componentName="oneStrokeWriting" />
        </Layout>
    );
};

export default Index;
