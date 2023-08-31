import type { NextPage } from 'next';
import Head from 'next/head';
import GameProvider from '../../components/gameProvider';
import { Layout } from '../../components/layout';
import { Site } from '../../shared/site';
import { SitePage } from '../../shared/sitePage';

const Index: NextPage = (): JSX.Element => {
    return (
        <Layout title={SitePage.oneStrokeWriting.title} top={false}>
            <Head>
                <title>{`${SitePage.oneStrokeWriting.title} - ${Site.title}`}</title>
                <meta name="description" content={SitePage.oneStrokeWriting.description} key="description" />
                <meta property="og:title" content={`${SitePage.oneStrokeWriting.title} - ${Site.title}`} key="og:title" />
                <meta property="og:url" content={SitePage.oneStrokeWriting.url} key="og:url" />
                <meta property="og:description" content={SitePage.oneStrokeWriting.description} key="og:description" />
                <meta property="og:image" content={SitePage.oneStrokeWriting.image} key="og:image" />
            </Head>
            <GameProvider componentName="oneStrokeWriting" />
        </Layout>
    );
};

export default Index;
