import { Router } from 'express';
import connectFourRouter from './connectFourRouter';
import gomokuRouter from './gomokuRouter';
import oneStrokeWritingRouter from './oneStrokeWritingRouter';
import othelloRouter from './othelloRouter';
import testRouter from './testRouter';

const routers: Router[] = [othelloRouter, gomokuRouter, connectFourRouter, oneStrokeWritingRouter, testRouter];

export default routers;
