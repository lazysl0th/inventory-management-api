import express from 'express';
import helmet from 'helmet';
import cors from './middlewares/cors.js';
import limiter from './middlewares/limiter.js';
import morgan from 'morgan';
import config from './config.js';

const { PORT } = config;

const app = express();
app.use(helmet());
app.use(cors);
app.use(limiter);
app.use(morgan('dev'));

app.listen(PORT);