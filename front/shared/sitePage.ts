import { SitePath } from './sitePath';

const fallback = {
    description: '色々なミニゲームが遊べるゲームサイトです。\n' + 'Web アプリとクラウドの学習の一環として製作してみました。'
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

        description: 'オセロが遊べるゲームサイトです。',

        image: `${SitePath.public.directory.othello}${SitePath.public.file.thumbnail}`
    },

    gomoku: {
        title: '五目並べ',

        url: SitePath.relativeUrl.gomoku,

        description: '五目並べが遊べるゲームサイトです。',

        image: `${SitePath.public.directory.gomoku}${SitePath.public.file.thumbnail}`
    },

    connectFour: {
        title: 'コネクトフォー',

        url: SitePath.relativeUrl.connectFour,

        description: 'コネクトフォーが遊べるゲームサイトです。',

        image: `${SitePath.public.directory.connectFour}${SitePath.public.file.thumbnail}`
    },

    illustrationLogic: {
        title: 'お絵かきロジック',

        url: SitePath.relativeUrl.illustrationLogic,

        description: 'お絵かきロジック (ピクロス) が遊べるゲームサイトです。',

        image: `${SitePath.public.directory.illustrationLogic}${SitePath.public.file.thumbnail}`
    },

    numberLink: {
        title: 'ナンバーリンク',

        url: SitePath.relativeUrl.numberLink,

        description: 'ナンバーリンクが遊べるゲームサイトです。',

        image: `${SitePath.public.directory.numberLink}${SitePath.public.file.thumbnail}`
    },

    oneStrokeWriting: {
        title: '一筆書きパズル',

        url: SitePath.relativeUrl.oneStrokeWriting,

        description: '一筆書きパズルが遊べるゲームサイトです。',

        image: `${SitePath.public.directory.oneStrokeWriting}${SitePath.public.file.thumbnail}`
    },

    slidingPuzzle: {
        title: 'スライドパズル',

        url: SitePath.relativeUrl.slidingPuzzle,

        description: 'スライドパズルが遊べるゲームサイトです。',

        image: `${SitePath.public.directory.slidingPuzzle}${SitePath.public.file.thumbnail}`
    },

    lightsOut: {
        title: 'ライツアウト',

        url: SitePath.relativeUrl.lightsOut,

        description: 'ライツアウトが遊べるゲームサイトです。',

        image: `${SitePath.public.directory.lightsOut}${SitePath.public.file.thumbnail}`
    }
} as const;
