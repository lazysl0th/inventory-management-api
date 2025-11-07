import { ApolloServer } from '@apollo/server';
import schema from '../graphql/schema.js';
import BadRequest from '../errors/badRequest.js';
import Conflict from '../errors/conflict.js';
import { response } from '../constants.js';

const { BAD_REQUEST, CONFLICT } = response

const apolloError = (formattedError, error) => {
    const original = error.originalError;
    if (original?.code === 'P2002') throw new Conflict(CONFLICT.text(error.originalError.meta.modelName));
    if (original?.name === 'Conflict' || original?.statusCode === 409) throw new Conflict(CONFLICT.text(error.originalError.meta.modelName));
    if (e.extensions.code === 'BAD_USER_INPUT') throw new BadRequest(BAD_REQUEST.text);

    return formattedError;
}

const apolloServer = new ApolloServer({
    schema,
    introspection: true,
    plugins: [],
    landingPage: false,
    formatError: apolloError
})

await apolloServer.start();

export default apolloServer;