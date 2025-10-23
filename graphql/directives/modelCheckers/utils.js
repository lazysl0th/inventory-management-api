export const isOwner = (objects, user) => objects.every(object => object.ownerId == user.id);

export const hasAdminRole = (requiredRoles, user) => user.roles.some((userRole) => requiredRoles.includes(userRole.role.name));

export const hasAccess = (objects, user) => {
    return objects.every((object) => object.isPublic || (object.allowedUsers?.some((allowedUser) => user.id == allowedUser.id)));
}