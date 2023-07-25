import { Router } from 'express';
import connectFourRouter from './connectFourRouter';
import gomokuRouter from './gomokuRouter';
import numberLinkRouter from './numberLinkRouter';
import oneStrokeWritingRouter from './oneStrokeWritingRouter';
import othelloRouter from './othelloRouter';
import pingRouter from './pingRouter';
import illustrationLogicRouter from './illustrationLogicRouter';

const routers: Router[] = [
    pingRouter,
    othelloRouter,
    gomokuRouter,
    connectFourRouter,
    illustrationLogicRouter,
    numberLinkRouter,
    oneStrokeWritingRouter
];

export default routers;
