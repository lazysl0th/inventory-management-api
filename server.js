import http from 'http';
import app from './app.js';
import config from './config.js';

const { PORT } = config;

export const httpServer = http.createServer(app);

httpServer.listen(PORT);