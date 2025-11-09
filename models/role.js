import prisma from '../infrastructure/prisma.js';

export const selectRolesByIds = (rolesId) => {
    return prisma.role.findMany({where: { id: { in: rolesId } },});
}