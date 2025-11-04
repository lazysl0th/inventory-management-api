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
            password: true,
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

export const deleteUsersByIds = async (usersIds) => {
    return await getPrismaClient().$transaction(async (tx) => {
        const deletedUsers = await getPrismaClient(tx).user.findMany({
            where: { id: { in: usersIds } },
            select: { id: true },
        });

        const { count } = await getPrismaClient(tx).user.deleteMany({
            where: { id: { in: usersIds } },
        });

        return {
            deletedUsersCount: count,
            requestDeleteUsersCount: usersIds.length,
            deletedUsers,
        };
    });
}

export const updateStatusByIds = async (usersIds, status) => {
    return await getPrismaClient().$transaction(async (tx) => {
        const { count } = await getPrismaClient(tx).user.updateMany({
            where: {
                id: { in: usersIds },
                NOT: { status },
            },
            data: { status },
        });
        const updatedUsers = await getPrismaClient(tx).user.findMany({
            where: { id: { in: usersIds } },
            select: { id: true, status: true },
        });
        return {
            updatedUsersStatusCount: count,
            requestUpdateStatusUsersCount: updatedUsers.length,
            requestUpdateStatusUsers: updatedUsers,
        };
    });
}


export const searchUsers = (searchQuery, by, client) => {
    const where = by === 'email' ? "EMAIL" : "USER"
        ? { email: { contains: searchQuery, mode: "insensitive" } }
        : { name: { contains: searchQuery, mode: "insensitive" } };

    return client.user.findMany({
        where,
        select: {
            id: true,
            name: true,
            email: true,
        },
        orderBy: { name: "asc" },
        take: 10,
    })
};