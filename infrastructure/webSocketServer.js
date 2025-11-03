import { useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';
import { httpServer } from '../server.js';
import schema from '../graphql/schema.js';
import createContext from '../graphql/context.js'

const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
});

useServer({ schema, context: createContext }, wsServer);