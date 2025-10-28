import { gql } from 'graphql-tag';
import { roles, modelName } from '../../constants.js'

const inventoryTypeDefs = gql`
    type Inventory {
        id: Int!
        title: String!
        description: String
        category: Category!
        image: String
        owner: User!
        ownerId: Int!
        createdAt: String!
        updatedAt: String!
        customIdFormat: CustomIdFormat
        fields: [InventoryField!]!
        items(take: Int, skip: Int): [Item!]!
        tags: [Tag!]
        isPublic: Boolean!
        allowedUsers: [User!]
        version: Int!
        itemsCount: Int!
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

    type InventorySearchResult {
        id: Int!
        image: String
        owner: User!
        highlightedTitle: String
        highlightedDescription: String
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

    input InventoryFieldInput {
        id: Int
        title: String!
        type: FieldType!
        description: String
        showInTable: Boolean
        order: Int
        isDeleted: Boolean
    }

    extend type Query {
        inventories(
            sortName: String,
            order: SortOrder,
            skip: Int,
            take: Int,
            ownerId: Int,
            isPublic: Boolean,
            allowedUser: Int,
            logic: String
        ): [Inventory!]!
        inventory(id: Int!): Inventory
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
