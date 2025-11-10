import express from 'express';
import helmet from 'helmet';
import { errors } from 'celebrate';
import morgan from 'morgan';
import passport from 'passport';
import cors from './middlewares/cors.js';
import error from './middlewares/error.js';
import router from './routes/index.js';

const app = express();

app.use(helmet());

app.use(cors);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use(passport.initialize());

app.use(router);

app.use(errors());

app.use(error);

export default app;