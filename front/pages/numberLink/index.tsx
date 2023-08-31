import type { NextPage } from 'next';
import Head from 'next/head';
import GameProvider from '../../components/gameProvider';
import { Layout } from '../../components/layout';
import { Site } from '../../shared/site';
import { SitePage } from '../../shared/sitePage';

const Index: NextPage = (): JSX.Element => {
    return (
        <Layout title={SitePage.numberLink.title} top={false}>
            <Head>
                <title>{`${SitePage.numberLink.title} - ${Site.title}`}</title>
                <meta name="description" content={SitePage.numberLink.description} key="description" />
                <meta property="og:title" content={`${SitePage.numberLink.title} - ${Site.title}`} key="og:title" />
                <meta property="og:url" content={SitePage.numberLink.url} key="og:url" />
                <meta property="og:description" content={SitePage.numberLink.description} key="og:description" />
                <meta property="og:image" content={SitePage.numberLink.image} key="og:image" />
            </Head>
            <GameProvider componentName="numberLink" />
        </Layout>
    );
};

export default Index;
