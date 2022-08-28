import express from 'express';
import errorHandler from './middleware/errorHandler';
import routers from './router/routers';

const app: express.Express = express();
const port = 5000;

app.use(express.json());

routers.map((router) => {
    app.use('/api', router);
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`start on port ${port}`);
});
