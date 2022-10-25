import express from 'express';
import corsHandler from './presentation/middleware/corsHandler';
import errorHandler from './presentation/middleware/errorHandler';
import routers from './presentation/routers';

const app: express.Express = express();
const port = 5000;

app.use(express.json());

app.use(corsHandler);

routers.map((router) => {
    app.use('/api', router);
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`start on port ${port}`);
});
