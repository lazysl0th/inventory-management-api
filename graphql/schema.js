import { gql } from 'graphql-tag';
import { roles } from '../constants.js'

const typeDefs = gql`

directive @auth(owner: Boolean, roles: [String!]) on FIELD_DEFINITION

enum Category {
    Equipment
    Furniture
    Book
    Other
}

enum FieldType {
    TEXT
    LONGTEXT
    NUMBER
    FILE
    BOOLEAN
}

type User {
    id: Int!
    name: String!
    email: String!
    roles: [UserRole!]!
}

type Role {
    id: Int!
    name: String!
}

type UserRole {
    role: Role!
}

type Inventory {
    id: Int!
    title: String!
    description: String
    category: Category!
    tags: [Tag!]!
    image: String
    owner: User!
    ownerId: Int!
    isPublic: Boolean!
    allowedUsers: [User!]!
    customIdFormat: CustomIdFormat
    version: Int!
    fields: [InventoryField!]!
    itemsCount: Int!
    createdAt: String!
    updatedAt: String!
}

type CustomIdFormat {
    parts: [CustomIdPart!]
    summary: String
}

type CustomIdPart {
    type: String
    value: String
    format: String
    digits: Int
}

type InventoryField {
    id: Int!
    title: String!
    type: FieldType!
    description: String
    showInTable: Boolean!
    order: Int!
    isDeleted: Boolean!
}

type Tag {
    id: Int!
    name: String!
}

scalar JSON

input InventoryFieldInput {
    id: Int
    title: String!
    type: FieldType!
    description: String
    showInTable: Boolean
    order: Int
    isDeleted: Boolean!
}

input CreateInventoryInput {
    title: String!
    description: String
    category: Category!
    image: String
    isPublic: Boolean
    tagsNames: [String!]
    fields: [InventoryFieldInput!]
    customIdFormat: [CustomIdPartInput!]
    ownerId: Int!
}

input CustomIdPartInput {
    type: String!
    value: String
    format: String
    digits: Int
}

type Query {
    inventories: [Inventory!]!
    inventory(id: Int!): Inventory
}

type Mutation {
    createInventory(input: CreateInventoryInput!): Inventory! @auth
    updateInventory(id: Int!, input: CreateInventoryInput!): Inventory! @auth(owner: true, roles: ["${roles.ADMIN}"])
    deleteInventory(ids: [Int!]!): [Inventory!]! @auth(owner: true, roles: ["${roles.ADMIN}"])
}
`;

export default typeDefs;
