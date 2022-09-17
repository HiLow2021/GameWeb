import { Router } from 'express';
import gomokuRouter from './gomokuRouter';
import othelloRouter from './othelloRouter';
import testRouter from './testRouter';

const routers: Router[] = [othelloRouter, gomokuRouter, testRouter];

export default routers;
