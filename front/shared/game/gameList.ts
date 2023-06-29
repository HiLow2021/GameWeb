import { SitePage } from '../sitePage';
import { Game } from './game';

export const GameList: Readonly<Game[]> = [
    { title: SitePage.othello.title, path: SitePage.othello.url, thumbnail: SitePage.othello.image },
    { title: SitePage.gomoku.title, path: SitePage.gomoku.url, thumbnail: SitePage.gomoku.image },
    { title: SitePage.connectFour.title, path: SitePage.connectFour.url, thumbnail: SitePage.connectFour.image },
    { title: SitePage.slidingPuzzle.title, path: SitePage.slidingPuzzle.url, thumbnail: SitePage.slidingPuzzle.image },
    { title: SitePage.oneStrokeWriting.title, path: SitePage.oneStrokeWriting.url, thumbnail: SitePage.oneStrokeWriting.image },
    { title: SitePage.lightsOut.title, path: SitePage.lightsOut.url, thumbnail: SitePage.lightsOut.image }
] as const;
