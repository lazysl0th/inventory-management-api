import prisma from '../services/prisma.js';
import { deleteUserRolesByUsersId } from '../models/userRole.js';

export const createUser = ({ name, email, hash, provider, socialId }) => {
    return prisma.user.create({
        data: {
            name,
            email,
            password: hash,
            roles: { create: [ { role: { connectOrCreate: { where: { name: "User" }, create: { name: "User" }, } } } ] },
            ...(provider && socialId ? { [provider]: socialId } : {})
        },
        select: {
            id: true,
            name: true,
            email: true,
            roles: {
                select: {
                    role: {
                    select: {
                        name: true
                    }
                    }
                },
            },
            ...(provider ? { [provider]: true } : {})
        },
    });
}

export const findUserByParam = (field, value, withPassword) => {
    return prisma.user.findUnique({ 
        where: { [field]: value },
        select: {
            id: true,
            name: true,
            email: true,
            password: withPassword ? true : false,
            googleId: true,
            facebookId: true,
            roles: { select: { role: { select: { name: true } } } },
        },
    });
}

export const updateUserData = (fieldWhere, valueWhere, fieldData, valueData) => {
    return prisma.user.update({
        where: { [fieldWhere]: valueWhere },
        data: { [fieldData]: valueData },
    });
}

export const selectAllUsers = () => {
    return prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            googleId: true,
            facebookId: true,
            status: true,
            roles: { select: { role: { select: { name: true } } } }
        }
    });
}

export const deleteUsersByIds = async (usersId) => {
    return await prisma.$transaction(async (tx) => {
        const needDeleteUsers = await tx.user.findMany({
            where: { id: { in: usersId } },
            select: { id: true },
        });
        const deleteUsersRoles = await deleteUserRolesByUsersId(tx, usersId);
        const deletedUsers = await tx.user.deleteMany({
            where: { id: { in: usersId } },
        });
        return {
            needDeleteUsersCount: needDeleteUsers.length,
            deleteUsersRolesCount: deleteUsersRoles.count,
            deletedUsersCount: deletedUsers.count,
            requestUpdateUsersCount: usersId.length,
            needDeleteUsers
        }
    });
}

export const updateStatusByIds = async (ids, status) => {
    return await prisma.$transaction(async (tx) => {
        const needUpdateStatusUser = await tx.user.findMany({
            where: { id: { in: ids }, NOT: { status: status } },
            select: { id: true, status: true },
        })
        const updatedUsersStatusResult = await tx.user.updateMany({
            where: { id: { in: ids }, NOT: { status: status } },
            data: { status },
        })
        const requestUpdateStatusUsers = await tx.user.findMany({
            where: { id: { in: ids } },
            select: { id: true, status: true },
        })
        return {
            needUpdateStatusUserCount: needUpdateStatusUser.length,
            updatedUsersStatusCount: updatedUsersStatusResult.count,
            requestUpdateStatusUsersCount: requestUpdateStatusUsers.length,
            needUpdateStatusUser,
            requestUpdateStatusUsers,
        }
    });
}