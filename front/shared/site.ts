import { SitePage } from './sitePage';
import { SitePath } from './sitePath';

const currentYear = new Date().getFullYear();

export const Site = {
    /**
     * 名前
     */
    title: 'Game Web',

    /**
     * 製作者
     */
    author: 'HiLow',

    /**
     * URL
     */
    url: SitePath.baseUrl,

    /**
     * 開発者サイトURL
     */
    developerUrl: SitePath.developerUrl,

    /**
     * サイトのページ
     */
    page: SitePage,

    /**
     * サイトのパス
     */
    path: SitePath,

    /**
     * ファビコン
     */
    favicon: SitePath.public.file.favicon,

    /**
     * Twitter ID
     */
    twitter: '@HiLow28564028',

    /**
     * 著作権
     */
    copyright: `© 2022-${currentYear} HiLow`
} as const;
