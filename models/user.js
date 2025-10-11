import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import config from '../config.js';

const { SALT_ROUNDS } = config;

const prisma = new PrismaClient();

export const createUser = async(name, email, password) => {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  return prisma.user.create({
    data: {
      name,
      email,
      password: hash
    }
  });
}

export const findUserByCredentials = async(email, password) => {
  const user = await prisma.user.findUnique({ where: { email }});
  if (!user) return null;
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) return null;
  return user;
};