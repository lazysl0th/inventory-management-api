import express from 'express';
import { expressMiddleware } from '@as-integrations/express5';
import createContext from '../graphql/context.js'
import apolloServer from '../infrastructure/apolloServer.js';

const router = express.Router();

router.use(expressMiddleware(apolloServer, { context: createContext }));

export default router;