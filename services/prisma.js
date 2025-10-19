import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default (tx) => {
    return tx ?? prisma;
}