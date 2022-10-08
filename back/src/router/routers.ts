import { Router } from 'express';
import connectFourRouter from './connectFourRouter';
import gomokuRouter from './gomokuRouter';
import othelloRouter from './othelloRouter';
import testRouter from './testRouter';

const routers: Router[] = [othelloRouter, gomokuRouter, connectFourRouter, testRouter];

export default routers;
