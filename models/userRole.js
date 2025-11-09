import prisma from '../infrastructure/prisma.js';
import { roles } from '../constants.js';

export const updateUsersRolesById = async (usersIds, rolesIds, newUsersRoles) => {
    return prisma.$transaction(async (tx) => {
        await deleteUsersRoles(usersIds, rolesIds, tx);
        if (newUsersRoles.length > 0) await createUsersRoles(newUsersRoles, tx);
        const userRoles = await findUsersRoles(usersIds, tx);
        return {
            userRoles,
            added: newUsersRoles.length,
        };
    });
};

const deleteUsersRoles = (usersIds, rolesIds, client) => {
    return client.userRole.deleteMany({
        where: {
            userId: { in: usersIds },
            roleId: { notIn: rolesIds },
            NOT: { role: { name: roles.USER } },
        },
    });
}

const createUsersRoles = (newUsersRoles, client) => {
    return  client.userRole.createMany({
        data: newUsersRoles,
        skipDuplicates: true,
    });
}

const findUsersRoles = (usersIds, client) => {
    return client.userRole.findMany({
        where: { userId: { in: usersIds } },
        select: { userId: true, roleId: true, role: { select: { name: true } } },
    });
}