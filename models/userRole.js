import prisma from '../services/prisma.js';
import { roles } from '../constants.js';

const deleteUsersRoles = (tx, usersId, rolesId) => {
    return tx.userRole.deleteMany({
        where: {
            userId: { in: usersId },
            roleId: { notIn: rolesId },
            NOT: { role: { name: roles.USER } },
        },
    })
}

const upsertUserRole = (tx, userId, roleId) => {
    return tx.userRole.upsert({
        where: { userId_roleId: { userId, roleId } },
        update: {},
        create: { userId, roleId },
    })
}

export const deleteUserRolesByUsersId = (tx, usersIds) => {
    return tx.userRole.deleteMany({
        where: { userId: { in: usersIds } },
    });
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