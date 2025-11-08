import { ApolloServer } from '@apollo/server';
import schema from '../graphql/schema.js';
import BadRequest from '../errors/badRequest.js';
import Conflict from '../errors/conflict.js';
import { modelName, response } from '../constants.js';

const { BAD_REQUEST, CONFLICT } = response

const apolloError = (formattedError, error) => {
    /*const original = error.originalError;
    console.log(original.statusCode)
    if (original?.code === 'P2002') throw new Conflict(CONFLICT.text(modelName.ITEM));
    if (original?.name === 'Conflict' || original?.statusCode === 409) throw new Conflict(CONFLICT.text(modelName.ITEM));
    if (original?.code === 'BAD_USER_INPUT') throw new BadRequest(BAD_REQUEST.text);*/

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