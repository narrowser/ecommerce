import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserService {
  async getById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true, role: true, avatar: true, createdAt: true } });
  }

  async update(id: string, data: { name?: string; avatar?: string }) {
    return prisma.user.update({ where: { id }, data, select: { id: true, email: true, name: true, role: true, avatar: true } });
  }
}
