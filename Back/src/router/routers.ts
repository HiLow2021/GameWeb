import { Router } from 'express';
import othelloRouter from './othelloRouter';
import testRouter from './testRouter';

const routers: Router[] = [othelloRouter, testRouter];

export default routers;
