import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { makeExecutableSchema } from '@graphql-tools/schema';
import authDirectiveTransformer from '../graphql/directives/auth.js';
import typeDefs from '../graphql/schema.js';
import resolvers from '../graphql/resolvers.js';
import createContext from '../graphql/context.js'

const router = express.Router();

let schema = makeExecutableSchema({ typeDefs, resolvers });
schema = authDirectiveTransformer(schema, 'auth');

const apolloServer = new ApolloServer({
    schema,
    introspection: true,
    plugins: [],
    landingPage: false,
});

await apolloServer.start();

router.use(expressMiddleware(apolloServer, { context: createContext }));

export default router;