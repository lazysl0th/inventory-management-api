import prisma from '../services/prisma.js';

export const selectRolesByIds = (rolesId) => {
    return prisma.role.findMany({where: { id: { in: rolesId } },});
}