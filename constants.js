export const response = {
    OK: {
        statusCode: 200,
    },
    CREATED: {
        statusCode: 201,
    },
    BAD_REQUEST: {
        statusCode: 400,
        text: 'Incorrect data was transmitted',
    },
    UNAUTHORIZED: {
        statusCode: 401,
        text: 'Incorrect email or password'
    },
    NO_AUTH_TOKEN: {
        text: 'No auth token',
    },
    JWT_EXPIRED: {
        text: 'jwt expired'
    },
    FORBIDDEN: {
        statusCode: 403,
        text: 'Authorization required',
    },
    BLOCKED: {
        statusCode: 403,
        text: 'Your account has been blocked. Please contact support'
    },
    INSUFFICIENT_PERMISSION: {
        statusCode: 403,
        text: 'Insufficient permission',
    },
    NOT_FOUND: {
        statusCode: 404,
        text: 'Not found',
    },
    NOT_FOUND_RECORDS: {
        statusCode: 404,
        text: (modelName) => `Record(s) ${modelName} not found`,
    },
    CONFLICT: {
        statusCode: 409,
        text: (model) => {
            switch(model) {
                case modelName.USER:
                    return 'A user with this email already exists.'
                case modelName.INVENTORY_FIELD:
                    return 'A field with this title already exists in inventory.'
            }
        },
    },
    INTERNAL_SERVER_ERROR: {
        statusCode: 500,
        text: 'An error occurred on the server',
    },
    /*RESET_PASSWORD: {
        statusCode: 200,
        text: 'Message for change password has been send'
    },

    PASSWORD_CHANGE: {
        statusCode: 204,
        text: 'Password change'
    },
    BLOCKED: {
        statusCode: 403,
        text: 'Your account has been blocked. Please contact support'
    },
*/
};

export const roles = {
  USER: 'User',
  ADMIN: 'Admin'
}

export const userStatus = {
    BLOCKED: 'Blocked'
}

export const modelName = {
    INVENTORY: 'Inventory',
    ITEM: 'Item',
    USER: 'User',
    INVENTORY_FIELD: 'InventoryField'
}

export const conditions = {
    ownerId: (v) => ({ where: { ownerId: v } }),
    isPublic: (v) => ({ where: { isPublic: v } }),
    take: (v) => ({ take: v }),
    sortName: (v, o = 'desc') => 
        (v === 'countItems') ? ({ orderBy: { items: { _count: o.toLowerCase() } } }) : ({ orderBy: { [v]: o.toLowerCase() } }),
    allowedUser: (v) => ({ where: { allowedUsers: { some: { id: v } } },
  })
};

export const typeId = {
    INVENTORY: 'inventoryId',
    ITEM: 'itemId',
}