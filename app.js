import express from 'express';
import helmet from 'helmet';
import { errors } from 'celebrate';
import morgan from 'morgan';
import passport from 'passport';
import cors from './middlewares/cors.js';
import limiter from './middlewares/limiter.js';
import error from './middlewares/error.js';
import config from './config.js';
import router from './routes/index.js';

const { PORT } = config;

const app = express();
app.use(helmet());
app.use(cors);
app.use(limiter);
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(router);
app.use(errors());
app.use(error);

app.listen(PORT);