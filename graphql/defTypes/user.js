import { gql } from 'graphql-tag';

const userTypeDefs = gql`

type User {
    id: Int!
    name: String!
    email: String!
    roles: [UserRole!]!
}

type UserRole {
    role: Role!
}

type Role {
    id: Int!
    name: String!
}

enum SearchBy {
    NAME
    EMAIL
}

extend type Query {
    searchUsers(searchQuery: String!, by: SearchBy!): [User!]!
}
`;

export default userTypeDefs;
