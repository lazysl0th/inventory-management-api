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

`;

export default userTypeDefs;
