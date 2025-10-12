    import { PrismaClient } from '@prisma/client';

    const prisma = new PrismaClient();

    export const createUser = ({ name, email, password, provider, socialId }) => {
        return prisma.user.create({
            data: {
                name,
                email,
                password,
                [provider]: socialId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                [provider]: true
            }
        });
    }

    export const findUserByParam = (field, value) => {
        console.log(field, value)
        return prisma.user.findUnique({ 
            where: { [field]: value },
            select: {
                id: true,
                name: true,
                email: true,
                googleId: true,
                facebookId: true,
            }
        });
    }

    export const updateUserData = (fieldWhere, valueWhere, fieldData, valueData) => {
        return prisma.user.update({
            where: { [fieldWhere]: valueWhere },
            data: { [fieldData]: valueData },
        });
    }