import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '@ecommerce/shared';

const prisma = new PrismaClient();

export class CategoryService {
  async list() {
    return prisma.category.findMany({
      where: { isActive: true },
      include: { children: { where: { isActive: true } } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(data: { name: string; slug: string; parentId?: string; image?: string; sortOrder?: number }) {
    return prisma.category.create({ data });
  }

  async update(id: string, data: any) {
    const cat = await prisma.category.findUnique({ where: { id } });
    if (!cat) throw new NotFoundError('Category');
    return prisma.category.update({ where: { id }, data });
  }

  async delete(id: string) {
    const cat = await prisma.category.findUnique({ where: { id } });
    if (!cat) throw new NotFoundError('Category');
    return prisma.category.update({ where: { id }, data: { isActive: false } });
  }
}
