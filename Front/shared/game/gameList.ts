import { Game } from './game';

export const GameList: Readonly<Game[]> = [{ title: 'オセロ', path: '/othello', thumbnail: 'game/othello/othello.png' }] as const;
