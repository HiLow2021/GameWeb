import { SitePath } from './sitePath';

const fallback = {
    description: `色々なミニゲームが遊べるサイトです。
                  ウェブアプリの学習の一環として製作してみました。
                  もし良ければ、遊んでみてくださいね😊`
} as const;

/**
 * サイトのページ
 */
export const SitePage = {
    home: {
        title: 'ホーム',

        url: SitePath.relativeUrl.home,

        description: fallback.description
    },

    othello: {
        title: 'オセロ',

        url: SitePath.relativeUrl.othello,

        description: fallback.description,

        image: `${SitePath.public.directory.othello}${SitePath.public.file.thumbnail}`
    },

    gomoku: {
        title: '五目並べ',

        url: SitePath.relativeUrl.gomoku,

        description: fallback.description,

        image: `${SitePath.public.directory.gomoku}${SitePath.public.file.thumbnail}`
    },

    connectFour: {
        title: 'コネクトフォー',

        url: SitePath.relativeUrl.connectFour,

        description: fallback.description,

        image: `${SitePath.public.directory.connectFour}${SitePath.public.file.thumbnail}`
    },

    illustrationLogic: {
        title: 'お絵かきロジック',

        url: SitePath.relativeUrl.illustrationLogic,

        description: fallback.description,

        image: `${SitePath.public.directory.illustrationLogic}${SitePath.public.file.thumbnail}`
    },

    numberLink: {
        title: 'ナンバーリンク',

        url: SitePath.relativeUrl.numberLink,

        description: fallback.description,

        image: `${SitePath.public.directory.numberLink}${SitePath.public.file.thumbnail}`
    },

    oneStrokeWriting: {
        title: '一筆書きパズル',

        url: SitePath.relativeUrl.oneStrokeWriting,

        description: fallback.description,

        image: `${SitePath.public.directory.oneStrokeWriting}${SitePath.public.file.thumbnail}`
    },

    slidingPuzzle: {
        title: 'スライドパズル',

        url: SitePath.relativeUrl.slidingPuzzle,

        description: fallback.description,

        image: `${SitePath.public.directory.slidingPuzzle}${SitePath.public.file.thumbnail}`
    },

    lightsOut: {
        title: 'ライツアウト',

        url: SitePath.relativeUrl.lightsOut,

        description: fallback.description,

        image: `${SitePath.public.directory.lightsOut}${SitePath.public.file.thumbnail}`
    }
} as const;
