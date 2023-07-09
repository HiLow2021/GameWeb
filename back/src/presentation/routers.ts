import { Router } from 'express';
import connectFourRouter from './connectFourRouter';
import gomokuRouter from './gomokuRouter';
import oneStrokeWritingRouter from './oneStrokeWritingRouter';
import othelloRouter from './othelloRouter';
import pingRouter from './pingRouter';

const routers: Router[] = [pingRouter, othelloRouter, gomokuRouter, connectFourRouter, oneStrokeWritingRouter];

export default routers;
