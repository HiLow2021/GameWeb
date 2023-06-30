const gameDirectory = '/game/';

/**
 * サイトの各フォルダやファイルへのパスを管理
 */
export const SitePath = {
    /**
     * サイトURL
     */
    baseUrl: 'https://game-web-ggvhemkhnq-an.a.run.app',

    /**
     * 開発者サイトURL
     */
    developerUrl: 'https://hilow-web.vercel.app',

    /**
     * 相対URL
     */
    relativeUrl: {
        home: '/',

        othello: '/othello/',

        gomoku: '/gomoku/',

        connectFour: '/connectFour/',

        slidingPuzzle: '/slidingPuzzle/',

        oneStrokeWriting: '/oneStrokeWriting/',

        lightsOut: '/lightsOut/'
    },

    /**
     * パブリック(静的コンテンツ)
     */
    public: {
        /**
         * ディレクトリ
         */
        directory: {
            othello: `${gameDirectory}othello/`,

            gomoku: `${gameDirectory}gomoku/`,

            connectFour: `${gameDirectory}connectFour/`,

            slidingPuzzle: `${gameDirectory}slidingPuzzle/`,

            oneStrokeWriting: `${gameDirectory}oneStrokeWriting/`,

            lightsOut: `${gameDirectory}lightsOut/`
        },

        /**
         * ファイル
         */
        file: {
            /**
             * ファビコン
             */
            favicon: `/favicon.ico`,

            /**
             * サムネイル
             */
            thumbnail: 'thumbnail.webp'
        }
    }
} as const;