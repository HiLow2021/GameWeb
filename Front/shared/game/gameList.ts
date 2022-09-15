import { Game } from './game';

export const GameList: Readonly<Game[]> = [
    { title: 'オセロ', path: '/othello', thumbnail: 'game/othello/thumbnail.png' },
    { title: '五目並べ', path: '/gomoku', thumbnail: 'game/gomoku/thumbnail.png' },
    { title: 'スライドパズル', path: '/slidingPuzzle', thumbnail: 'game/slidingPuzzle/thumbnail.png' }
] as const;
