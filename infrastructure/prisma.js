import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPrismaClient = (tx) => tx ?? prisma;

export default prisma