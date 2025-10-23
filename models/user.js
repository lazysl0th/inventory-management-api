import { getPrismaClient } from '../infrastructure/prisma.js';

export const createUser = ({ name, email, hash, provider, socialId }) => {
    return getPrismaClient().user.create({
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
            roles: { select: { role: { select: { name: true } } }, },
            ...(provider ? { [provider]: true } : {})
        },
    });
}

export const findUserByParam = (field, value) => {
    return getPrismaClient().user.findUnique({ 
        where: { [field]: value },
        include: { roles: { include: { role: true, }, }, },
    });
}

export const updateUserData = (fieldWhere, valueWhere, fieldData, valueData) => {
    return getPrismaClient().user.update({
        where: { [fieldWhere]: valueWhere },
        data: { [fieldData]: valueData },
    });
}

export const selectAllUsers = () => {
    return getPrismaClient().user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            googleId: true,
            facebookId: true,
            status: true,
            roles: { select: { role: { select: { name: true } } }, }
        }
    });
}

export const deleteUsersByIds = async (usersId) => {
    return await getPrismaClient().$transaction(async (tx) => {
        const needDeleteUsers = await tx.user.findMany({
            where: { id: { in: usersId } },
            select: { id: true },
        });
        const deletedUsers = await tx.user.deleteMany({
            where: { id: { in: usersId } },
        });
        return {
            needDeleteUsersCount: needDeleteUsers.length,
            deletedUsersCount: deletedUsers.count,
            requestUpdateUsersCount: usersId.length,
            needDeleteUsers
        }
    });
}

export const updateStatusByIds = async (userIds, status) => {
    return await getPrismaClient().$transaction(async (tx) => {
        const needUpdateStatusUser = await tx.user.findMany({
            where: { id: { in: userIds }, NOT: { status: status } },
            select: { id: true, status: true },
        })
        const updatedUsersStatusResult = await tx.user.updateMany({
            where: { id: { in: userIds }, NOT: { status: status } },
            data: { status },
        })
        const requestUpdateStatusUsers = await tx.user.findMany({
            where: { id: { in: userIds } },
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