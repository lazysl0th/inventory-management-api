import { mergeResolvers } from '@graphql-tools/merge';
import inventoryResolvers from './resolvers/inventory.js'
import itemResolvers from './resolvers/item.js'

const resolvers = mergeResolvers([
    inventoryResolvers,
    itemResolvers,
]);

export default resolvers;