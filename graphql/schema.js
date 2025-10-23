import { makeExecutableSchema } from '@graphql-tools/schema';
import authDirectiveTransformer from '../graphql/directives/auth.js';
import typeDefs from '../graphql/defTypes.js';
import resolvers from '../graphql/resolvers.js';

let schema = makeExecutableSchema({ typeDefs, resolvers });
schema = authDirectiveTransformer(schema, 'auth');

export default schema;