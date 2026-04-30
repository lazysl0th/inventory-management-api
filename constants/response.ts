export const OK = {
    STATUS_CODE: 200,
}

export const RESET_PASSWORD = {
    TEXT: 'Message for change password has been send'
}

export const CHANGE_PASSWORD = {
    TEXT: 'Password change'
}

export const CREATED = {
    STATUS_CODE: 201,
}

export const UNAUTHORIZED = {
    STATUS_CODE: 401,
    TEXT: 'Incorrect email or password',
}

export const FORBIDDEN = {
    STATUS_CODE: 401,
    TEXT: 'Authorization required',
}

export const INSUFFICIENT_PERMISSION = {
    STATUS_CODE: 403,
    TEXT: 'Insufficient permission',
}

export const BLOCKED = {
    STATUS_CODE: 403,
    TEXT: 'Your account has been blocked. Please contact support'
}
export const NOT_FOUND = {
    STATUS_CODE: 404,
    TEXT: 'Not found',
}
export const BAD_REQUEST = {
    STATUS_CODE: 400,
    TEXT: 'Incorrect data was transmitted',
}
export const CONFLICT = {
    STATUS_CODE: 409,
    TEXT_USER: 'A user with this email already exists.',
    TEXT_INVENTORY: 'Inventory with this id and version alredy exist',
}

export const LOGOUT = {
    TEXT: 'User logout'
}

export const INTERNAL_SERVER_ERROR = {
    STATUS_CODE: 500,
    TEXT: 'An error occurred on the server',
}