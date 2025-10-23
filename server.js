import http from 'http';
import app from './app.js';
import config from './config.js';

const { PORT } = config;

const server = http.createServer(app);

server.listen(PORT);