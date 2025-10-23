import { gql } from 'graphql-tag';
import { roles, modelName } from '../../constants.js'

const itemTypeDefs = gql`

type Item {
    id: Int!
    customId: String!
    owner: User!
    ownerId: Int!
    inventoryId: Int!
    values: [ItemValue!]!
    likes: [Like!]!
    likesCount: Int!
    likedByMe: Boolean!
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

input CreateItemInput {
    inventoryId: Int!
    values: [ItemValueInput!]!
}

input ItemValueInput {
    fieldId: Int!
    value: String!
}

extend type Query {
    items(inventoryId: Int!): [Item!]!
    item(id: Int!): Item
}

extend type Mutation {
    createItem(input: CreateItemInput!): Item! @auth
    updateItem(id: Int!, input: CreateItemInput!): Item! @auth(modelName: "${modelName.ITEM}", roles: ["${roles.ADMIN}"])
    deleteItem(ids: [Int!]!): [Item!]! @auth(modelName: "${modelName.ITEM}", roles: ["${roles.ADMIN}"])
    toggleLikeItem(id: Int!): Item! @auth
}

`;

export default itemTypeDefs;