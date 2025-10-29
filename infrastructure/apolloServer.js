import { ApolloServer } from '@apollo/server';
import schema from '../graphql/schema.js';
import BadRequest from '../errors/badRequest.js';
import { response } from '../constants.js';

const { BAD_REQUEST } = response

const apolloError = (e) => {
    console.log(e);
    if (e.extensions.code === 'BAD_USER_INPUT') throw new BadRequest(BAD_REQUEST.text);
    return e;
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