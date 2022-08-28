import cors, { CorsOptions } from 'cors';

const allowedOrigins = ['http://localhost:3000'];
const corsOptions: CorsOptions = {
    origin: allowedOrigins,
    optionsSuccessStatus: 200
};

const corsHandler = cors(corsOptions);

export default corsHandler;
