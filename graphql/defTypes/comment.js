import { gql } from 'graphql-tag';

const commentTypeDefs = gql`

type Comment {
    id: Int!
    content: String!
    user: User!
    inventoryId: Int
    createdAt: String!
}

input CreateCommentInput {
    inventoryId: Int!
    content: String!
}

extend type Query {
    comments(inventoryId: Int!): [Comment!]!
}

extend type Mutation {
    createComment(input: CreateCommentInput!): Comment! @auth
}

extend type Subscription {
    commentAdded(inventoryId: Int!): Comment
}
`;

export default commentTypeDefs;
