import { gql } from 'graphql-tag';
import userTypeDefs from './defTypes/user.js';
import inventoryTypeDefs from './defTypes/inventory.js';
import itemTypeDefs from './defTypes/item.js';
import commentTypeDefs from './defTypes/comment.js';

const commonTypeDefs = gql`

directive @auth(modelName: String, roles: [String!]) on FIELD_DEFINITION

type Query {
    selectTags: [Tag]!
}

type Mutation

`;

const typeDefs = [
  userTypeDefs,
  inventoryTypeDefs,
  itemTypeDefs,
  commentTypeDefs,
  commonTypeDefs
];

export default typeDefs;