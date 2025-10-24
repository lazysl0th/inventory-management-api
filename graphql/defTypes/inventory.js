import { gql } from 'graphql-tag';
import { roles, modelName } from '../../constants.js'

const inventoryTypeDefs = gql`

type Inventory {
    id: Int!
    title: String!
    description: String
    category: Category!
    customIdFormat: CustomIdFormat
    fields: [InventoryField!]!
    tags: [Tag!]!
    image: String
    isPublic: Boolean!
    allowedUsers: [User!]!
    version: Int!
    itemsCount: Int!
    owner: User!
    ownerId: Int!
    createdAt: String!
    updatedAt: String!
}

enum Category {
    Equipment
    Furniture
    Book
    Other
}

enum SortOrder {
    asc
    desc
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

enum FieldType {
    TEXT
    LONGTEXT
    NUMBER
    FILE
    BOOLEAN
}

type Tag {
    id: Int!
    name: String!
    inventoriesCount: Int
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

input InventoryByConditialInput {
    createdAt: SortOrder
    itemsCount: SortOrder
}

input CustomIdPartInput {
    type: String!
    value: String
    format: String
    digits: Int
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

type InventorySearchResult {
    id: Int!
    image: String
    owner: User!
    highlightedTitle: String
    highlightedDescription: String
}

extend type Query {
    selectInventories(orderBy: InventoryByConditialInput, skip: Int, take: Int): [Inventory!]!
    selectInventory(id: Int!): Inventory
    searchInventories(searchQuery: String!, orderBy: String!): [InventorySearchResult!]!
}

extend type Mutation {
    createInventory(input: CreateInventoryInput!): Inventory! @auth
    updateInventory(id: Int!, input: CreateInventoryInput!): Inventory! @auth(modelName: "${modelName.INVENTORY}", roles: ["${roles.ADMIN}"])
    deleteInventory(ids: [Int!]!): [Inventory!]! @auth(modelName: "${modelName.INVENTORY}", roles: ["${roles.ADMIN}"])
    grantInventoryAccess(id: Int!, userIds: [Int!]!): Inventory! @auth(modelName: "${modelName.INVENTORY}", roles: ["${roles.ADMIN}"])
    revokeInventoryAccess(id: Int!, userIds: [Int!]!): Inventory! @auth(modelName: "${modelName.INVENTORY}", roles: ["${roles.ADMIN}"])
}

`;

export default inventoryTypeDefs;
