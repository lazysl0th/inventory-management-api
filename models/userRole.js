import prisma, { getPrismaClient } from '../infrastructure/prisma.js';
import { roles } from '../constants.js';

export const updateUsersRolesById = async (usersIds, rolesIds, newUsersRoles) => {
    console.log(usersIds, rolesIds);
    return prisma.$transaction(async (tx) => {
        await getPrismaClient(tx).userRole.deleteMany({
            where: {
                userId: { in: usersIds },
                roleId: { notIn: rolesIds },
                NOT: { role: { name: roles.USER } },
            },
        });
        if (newUsersRoles.length > 0) {
            await getPrismaClient(tx).userRole.createMany({
                data: newUsersRoles,
                skipDuplicates: true,
            });
        }
        const userRoles = await getPrismaClient(tx).userRole.findMany({
            where: { userId: { in: usersIds } },
            select: { userId: true, roleId: true, role: { select: { name: true } } },
        });
        return {
            userRoles,
            added: newUsersRoles.length,
        };
    });
};