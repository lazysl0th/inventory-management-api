import prisma from '../infrastructure/prisma.js'

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
            password: true,
            roles: { select: { role: { select: { name: true } } }, },
            ...(provider ? { [provider]: true } : {})
        },
    });
}

export const findUserByParam = (field, value) => {
    return prisma.user.findUnique({ 
        where: { [field]: value },
        select: {
            id: true,
            name: true,
            email: true,
            password: true,
            roles: { select: { role: { select: { name: true } } } }
        }
    });
}

export const updateUserDataByCondition = (fieldWhere, valueWhere, fieldData, valueData) => {
    return prisma.user.update({
        where: { [fieldWhere]: valueWhere },
        data: { [fieldData]: valueData },
    });
}

export const updateUserPassword = (token, hash) => {
    return prisma.user.updateMany({
        where: { reset_token: token },
        data: {
            password: hash,
            reset_token: '',
        },
    });
}

export const updateUserProfile = (id, name, email) => {
    return prisma.user.update({
        where: { id: id },
        data: { name: name, email: email },
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
            roles: { select: { role: { select: { name: true } } }, }
        }
    });
}

export const selectUserById = (userId) => {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            googleId: true,
            facebookId: true,
            status: true,
            roles: { select: { role: { select: { id: true, name: true } } }, }
        }
    });
}


export const deleteUsersByIds = async (usersIds) => {
    return await prisma.$transaction(async (tx) => {
        const deletedUsers = await tx.user.findMany({
            where: { id: { in: usersIds } },
            select: { id: true },
        });

        const { count } = await tx.user.deleteMany({
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
    return await prisma.$transaction(async (tx) => {
        const { count } = await tx.user.updateMany({
            where: {
                id: { in: usersIds },
                NOT: { status },
            },
            data: { status },
        });
        const updatedUsers = await tx.user.findMany({
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