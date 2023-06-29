import { Game } from './game';

export const GameList: Readonly<Game[]> = [
    { title: 'オセロ', path: '/othello', thumbnail: 'game/othello/thumbnail.webp' },
    { title: '五目並べ', path: '/gomoku', thumbnail: 'game/gomoku/thumbnail.webp' },
    { title: 'コネクトフォー', path: '/connectFour', thumbnail: 'game/connectFour/thumbnail.webp' },
    { title: 'スライドパズル', path: '/slidingPuzzle', thumbnail: 'game/slidingPuzzle/thumbnail.webp' },
    { title: '一筆書きパズル', path: '/oneStrokeWriting', thumbnail: 'game/oneStrokeWriting/thumbnail.webp' },
    { title: 'ライツアウト', path: '/lightsOut', thumbnail: 'game/lightsOut/thumbnail.webp' }
] as const;
