import { SitePage } from './sitePage';
import { SitePath } from './sitePath';

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
     * 著作権
     */
    copyright: '© 2022-2023 HiLow'
} as const;
