import { gql } from 'graphql-tag';

const commentTypeDefs = gql`

type Comment {
    id: Int!
    content: String!
    user: User!
    inventory: Inventory
    inventoryId: Int
    item: Item
    itemId: Int
    createdAt: String!
}

input CreateCommentInput {
    inventoryId: Int
    itemId: Int
    content: String!
}

extend type Mutation {
    createComment(input: CreateCommentInput!): Comment! @auth
}
`;

export default commentTypeDefs;
