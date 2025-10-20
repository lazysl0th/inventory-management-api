import { gql } from 'graphql-tag';
import { roles } from '../constants.js'
import { modelName } from '../constants.js'

const typeDefs = gql`

directive @auth(modelName: String, roles: [String!]) on FIELD_DEFINITION

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

type Item {
    id: Int!
    customId: String!
    owner: User!
    ownerId: Int!
    inventoryId: Int!
    values: [ItemValue!]!
    likes: [Like!]!
    comments: [Comment!]!
    version: Int!
    createdAt: String!
    updatedAt: String!
}

type ItemValue {
    id: Int!
    field: InventoryField!
    value: String!
}

type Like {
    id: Int!
    userId: Int!
}

type Comment {
    id: Int!
    content: String!
    user: User!
    inventoryId: Int
    itemId: Int
    createdAt: String!
}

input InventoryFieldInput {
    id: Int
    title: String!
    type: FieldType!
    description: String
    showInTable: Boolean
    order: Int
    isDeleted: Boolean
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
}

input CustomIdPartInput {
    type: String!
    value: String
    format: String
    digits: Int
}

input ItemValueInput {
    fieldId: Int!
    value: String!
}

input CreateItemInput {
    inventoryId: Int!
    values: [ItemValueInput!]!
}

input CreateCommentInput {
    inventoryId: Int
    itemId: Int
    content: String!
}

type Query {
    inventories: [Inventory!]!
    inventory(id: Int!): Inventory
    items(inventoryId: Int!): [Item!]!
    item(id: Int!): Item
}

type Mutation {
    createInventory(input: CreateInventoryInput!): Inventory! @auth
    updateInventory(id: Int!, input: CreateInventoryInput!): Inventory! @auth(modelName: "${modelName.INVENTORY}", roles: ["${roles.ADMIN}"])
    deleteInventory(ids: [Int!]!): [Inventory!]! @auth(modelName: "${modelName.INVENTORY}", roles: ["${roles.ADMIN}"])
    createItem(input: CreateItemInput!): Item! @auth
    updateItem(id: Int!, input: CreateItemInput!): Item! @auth(modelName: "${modelName.ITEM}", roles: ["${roles.ADMIN}"])
    deleteItem(ids: [Int!]!): [Item!]! @auth(modelName: "${modelName.ITEM}", roles: ["${roles.ADMIN}"])
}
`;

export default typeDefs;
