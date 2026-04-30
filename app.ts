import express, { type Express } from 'express';
import helmet from 'helmet';
import { errors } from 'celebrate';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import error from './middlewares/error.js';
import Passport from './base/Passport.js';
import AppModule from './module/App.js';
import type { WebSocketServer } from "ws";
import { CORS_OPTIONS } from './constants/cors.js';
import { LIMITER_OPTIONS } from './constants/limiter.js';

export default class App {
    public readonly express: Express;
    constructor(wsServer: WebSocketServer) {
        this.express = this.init(wsServer)
    }

    private init(wsServer: WebSocketServer) {
        const app = express();
        const appModule = new AppModule(wsServer)
        app.set('trust proxy', 1);
        app.use(helmet());
        app.use(cors(CORS_OPTIONS));
        app.use(rateLimit(LIMITER_OPTIONS))
        app.use(cookieParser());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(morgan('dev'));
        app.use(Passport.initialize([
            appModule.passport.local.strategy,
            appModule.passport.jwt.strategy,
            appModule.passport.google.strategy, 
            appModule.passport.facebook.strategy,
        ]));
        app.use(appModule.router);
        app.use(errors());
        app.use(error);
        return app
    }
}