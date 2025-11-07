import http from 'http';
import app from './app.js';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import schema from './graphql/schema.js';
import createContext from './graphql/context.js'
import config from './config.js';

const { PORT } = config;

const httpServer = http.createServer(app);

const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
});

useServer({ schema, context: createContext }, wsServer);

httpServer.listen(PORT);