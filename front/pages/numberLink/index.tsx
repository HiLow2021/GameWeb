import type { NextPage } from 'next';
import Head from 'next/head';
import GameProvider from '../../components/gameProvider';
import { Layout } from '../../components/layout';
import { SitePage } from '../../shared/sitePage';

const Index: NextPage = (): JSX.Element => {
    return (
        <Layout title={SitePage.numberLink.title} top={false}>
            <Head>
                <title>{SitePage.numberLink.title}</title>
                <meta name="description" content={SitePage.numberLink.description} />
                <meta property="og:title" content={SitePage.numberLink.title} />
                <meta property="og:url" content={SitePage.numberLink.url} />
                <meta property="og:description" content={SitePage.numberLink.description} />
                <meta property="og:image" content={SitePage.numberLink.image} />
            </Head>
            <GameProvider componentName="numberLink" />
        </Layout>
    );
};

export default Index;
