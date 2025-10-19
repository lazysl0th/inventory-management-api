import prisma from '../services/prisma.js';
import { roles } from '../constants.js';

const deleteUsersRoles = (client, usersId, rolesId) => {
    return client.userRole.deleteMany({
        where: {
            userId: { in: usersId },
            roleId: { notIn: rolesId },
            NOT: { role: { name: roles.USER } },
        },
    })
}

const upsertUserRole = (client, userId, roleId) => {
    return client.userRole.upsert({
        where: { userId_roleId: { userId, roleId } },
        update: {},
        create: { userId, roleId },
    })
}

export const updateUsersRolesById = (usersId, rolesId) => {
    return prisma.$transaction(async (tx) => {
        const deleteUsersRolesResult = await deleteUsersRoles(tx, usersId, rolesId);
        const upsertUsersRolesPromises = usersId.flatMap((userId) => rolesId.map((roleId) => upsertUserRole(tx, userId, roleId)));
        const updateUsersRoles = await Promise.all(upsertUsersRolesPromises);
        return {
            deleteUsersRolesCount: deleteUsersRolesResult.count,
            addUsersRoles: updateUsersRoles.length,
            updateUsersRoles
        };
    });
}