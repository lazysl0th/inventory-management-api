import { mergeResolvers } from '@graphql-tools/merge';
import inventoryResolvers from './resolvers/inventory.js'
import itemResolvers from './resolvers/item.js'
import commentResolvers from './resolvers/comment.js';

const resolvers = mergeResolvers([
    inventoryResolvers,
    itemResolvers,
    commentResolvers
]);

export default resolvers;