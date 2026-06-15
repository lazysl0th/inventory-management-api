import http from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import App from './app.js';
import { APP_PORT } from './constants/base.js';
import { terminusService } from './src/index.js';
import { createTerminus } from '@godaddy/terminus';

const httpServer = http.createServer();

export const wsServer: WebSocketServer = new WebSocketServer({
    server: httpServer,
    path: '/'
});

createTerminus(httpServer, terminusService.options());

const app = new App(wsServer);

httpServer.on('request', app.express);

httpServer.on('error', (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') throw error;

    const bind = typeof APP_PORT === 'string' ? `Pipe ${APP_PORT}` : `Port ${APP_PORT}`;

    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
        case 'EADDRINUSE':
            console.error(`${bind} already in use by another process`);
            process.exit(1);
        default:
            throw error;
    }
});

httpServer.listen(APP_PORT, () => {
    console.log(`The server has successfully started on port ${APP_PORT}`);
});

/*const gracefulShutdown = (signal: string): void => {
    console.log(`\n[${signal}] Signal received to stop. Graceful Shutdown initiating...`);

    const forceExitTimeout = setTimeout(() => {
        console.error('Unable to close connection in time, forcibly exiting.');
        process.exit(1);
    }, 10000);

    wsServer.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            client.close(1001, 'Server is shutting down');
        }
    });

    wsServer.close((wsErr?: Error) => {
        if (wsErr) console.error('Error closing WS:', wsErr);
        console.log('WebSocket server stopped.');

        httpServer.close((httpErr?: Error) => {
            if (httpErr) {
                console.error('Error closing HTTP:', httpErr);
                process.exit(1);
            }
            
            console.log('HTTP server stopped. Process terminated.');
            clearTimeout(forceExitTimeout);
            process.exit(0);
        });
    });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));*/


process.on('unhandledRejection', (reason: unknown) => {
    console.error('Unhandled rejection:', reason);
});