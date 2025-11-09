import { gql } from 'graphql-tag';
import { roles, modelName } from '../../constants.js'

const inventoryTypeDefs = gql`
    type Inventory {
        id: Int
        title: String
        description: String
        category: Category!
        image: String
        owner: User
        ownerId: Int
        createdAt: String
        updatedAt: String
        customIdFormat: JSON
        fields: [InventoryField!]
        items(take: Int, skip: Int): [Item!]
        tags: [Tag!]
        isPublic: Boolean
        allowedUsers: [User!]
        version: Int
        itemsCount: Int
        highlightedTitle: String
        highlightedDescription: String
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
        guid: String!
        type: String!
        value: String
        separator: String
        format: String
        position: String
        order: Int
        currentSequence: String
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
        inventories: [Inventory!]!
        inventoriesCount: Int
    }

    type InventorySearchResult {
        id: Int!
        title: String
        description: String
        category: Category
        owner: User!
        highlightedTitle: String
        highlightedDescription: String
    }

    type InventoryDelta {
        id: Int!
        changedFields: [InventoryFieldDelta!]
        changedTags: [TagDelta!]
        changedCustomParts: [CustomIdPartDelta!]
        changedAllowedUsers: [UserDelta!]
        changedMeta: InventoryMetaDelta
    }

    type InventoryFieldDelta {
        id: Int
        title: String
        type: FieldType
        order: Int
        isDeleted: Boolean
    }

    type TagDelta {
        id: Int
        name: String
    }

    type CustomIdPartDelta {
        guid: String
        type: String
        value: String
        order: Int
    }

    type UserDelta {
        id: Int!
        name: String
        email: String
    }

    type InventoryMetaDelta {
        title: String
        description: String
        updatedAt: String
    }

    input CreateInventoryInput {
        id: Int
        title: String
        description: String
        category: Category
        image: String
        isPublic: Boolean
        tagsNames: [String]
        customIdFormat: JSON
        fields: [InventoryFieldInput]
        owner: UserIdInput
        tags: [TagInput]
        allowedUsers: [UserIdInput]
        version: Int
        updatedAt: String
        createdAt: String
        itemsCount: Int
    }

    input CustomIdFormatInput {
        parts: [CustomIdPartInput!]
        summary: String
    }

    input CustomIdPartInput {
        guid: String!
        type: String!
        value: String
        separator: String
        format: String
        digits: Int
        order: Int
        position: String
        currentSequence: String
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

    input UserIdInput {
        id: Int!
        name: String
        email: String
    }

    input TagInput {
        id: Int
        name: String
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
        searchInventories(searchQuery: String!, orderBy: String!): [Inventory]
    }

    extend type Mutation {
        createInventory(input: CreateInventoryInput!): Inventory! @auth
        updateInventory(id: Int!, input: CreateInventoryInput!, expectedVersion: Int!): Inventory! @auth(modelName: "${modelName.INVENTORY}", roles: ["${roles.ADMIN}"])
        deleteInventories(ids: [Int!]!): [Inventory!]! @auth(modelName: "${modelName.INVENTORY}", roles: ["${roles.ADMIN}"])
        grantInventoryAccess(id: Int!, userIds: [Int!]!): Inventory! @auth(modelName: "${modelName.INVENTORY}", roles: ["${roles.ADMIN}"])
        revokeInventoryAccess(id: Int!, userIds: [Int!]!): Inventory! @auth(modelName: "${modelName.INVENTORY}", roles: ["${roles.ADMIN}"])
    }
`;

export default inventoryTypeDefs;
