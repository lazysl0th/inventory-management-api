export const USER_SELECT = {
    id: true,
    name: true,
    email: true,
    googleId: true,
    facebookId: true,
    status: true,
    password: true,
    resetPasswordToken: true,
    refreshToken: true,
    createdAt: true,
    roles: {
        select: {
            role: {
                select: {
                    id: true,
                    name: true 
                }
            }
        }
    }
} as const

export const INVENTORY_SELECT = {
    id: true,
    title: true,
    description: true,
    category: true,
    image: true,
    ownerId: true,
    isPublic: true,
    customIdFormat: true,
    version: true,
    createdAt: true,
    updatedAt: true,
    token: true,
    owner: { select: { id: true, name: true, email: true } },
    tags: true,
    fields: true,
    allowedUsers: { select: { id: true, name: true, email: true } },
} as const

export const ITEM_SELECT = {
    id: true,
    inventoryId: true,
    customId: true,
    ownerId: true,
    owner: { select: { id: true, name: true, email: true } },
    version: true,
    createdAt: true,
    updatedAt: true,
    values: { select: { id: true, field: true, value: true,} },
} as const

export const TAG_SELECT = {
    id: true,
    name: true,
    _count: {
        select: {
            inventories: true,
        }
    }
} as const

export const COMMENT_SELECT = {
    id: true,
    content: true,
    userId: true,
    user: { select: { id: true, name: true, email: true, } },
    inventoryId: true,
    createdAt: true,
} as const