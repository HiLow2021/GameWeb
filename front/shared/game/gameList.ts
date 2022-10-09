import { Game } from './game';

export const GameList: Readonly<Game[]> = [
    { title: 'オセロ', path: '/othello', thumbnail: 'game/othello/thumbnail.png' },
    { title: '五目並べ', path: '/gomoku', thumbnail: 'game/gomoku/thumbnail.png' },
    { title: 'コネクトフォー', path: '/connectFour', thumbnail: 'game/connectFour/thumbnail.png' },
    { title: 'スライドパズル', path: '/slidingPuzzle', thumbnail: 'game/slidingPuzzle/thumbnail.png' },
    { title: '点灯パズル', path: '/lightingPuzzle', thumbnail: 'game/lightingPuzzle/thumbnail.png' },
    { title: '消灯パズル', path: '/lightsOut', thumbnail: 'game/lightsOut/thumbnail.png' }
] as const;
