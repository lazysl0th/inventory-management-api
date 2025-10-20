import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { makeExecutableSchema } from '@graphql-tools/schema';
import authDirectiveTransformer from '../graphql/directives/auth.js';
import typeDefs from '../graphql/schema.js';
import resolvers from '../graphql/resolvers.js';
import createContext from '../graphql/context.js'
import BadRequest from '../errors/badRequest.js';
import { response } from '../constants.js';

const { BAD_REQUEST } = response

const router = express.Router();

let schema = makeExecutableSchema({ typeDefs, resolvers });
schema = authDirectiveTransformer(schema, 'auth');

const apolloServer = new ApolloServer({
    schema,
    introspection: true,
    plugins: [],
    landingPage: false,
    formatError: (e) => {
        console.log(e);
        if (e.extensions.code === 'BAD_USER_INPUT') throw new BadRequest(BAD_REQUEST.text);
        return e;
    }
})

await apolloServer.start();

router.use(expressMiddleware(apolloServer, { context: createContext }));

export default router;