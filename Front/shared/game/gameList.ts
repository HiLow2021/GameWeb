import { Game } from './game';

export const GameList: Readonly<Game[]> = [
    { title: 'オセロ', path: '/othello', thumbnail: 'game/othello/thumbnail.png' },
    { title: 'スライドパズル', path: '/slidingPuzzle', thumbnail: 'game/slidingPuzzle/thumbnail.png' }
] as const;
