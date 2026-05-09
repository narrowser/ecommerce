import { PrismaClient, Prisma } from '@prisma/client';
import { NotFoundError, ForbiddenError } from '@ecommerce/shared';

const prisma = new PrismaClient();

export class ProductService {
  async create(supplierId: string, data: any) {
    const product = await prisma.product.create({
      data: {
        supplierId,
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        price: data.price,
        comparePrice: data.comparePrice,
        images: data.images || [],
        specs: data.specs || {},
        inventory: { create: { stock: data.stock || 0, lowStockThreshold: data.lowStockThreshold || 10 } },
      },
      include: { inventory: true, category: true },
    });
    return product;
  }

  async list(query: {
    page?: number; pageSize?: number; categoryId?: string; search?: string;
    minPrice?: number; maxPrice?: number; sortBy?: string;
  }) {
    const { page = 1, pageSize = 20, categoryId, search, minPrice, maxPrice, sortBy } = query;
    const where: Prisma.ProductWhereInput = { isActive: true };

    if (categoryId) where.categoryId = categoryId;
    if (search) where.name = { contains: search };
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sortBy === 'price_asc') orderBy = { price: 'asc' };
    if (sortBy === 'price_desc') orderBy = { price: 'desc' };
    if (sortBy === 'rating') orderBy = { avgRating: 'desc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where, orderBy, skip: (page - 1) * pageSize, take: pageSize,
        include: { inventory: { select: { stock: true } }, category: true },
      }),
      prisma.product.count({ where }),
    ]);

    return { data: products, total, page, pageSize };
  }

  async getById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { inventory: true, category: true },
    });
    if (!product) throw new NotFoundError('Product');
    return product;
  }

  async update(id: string, supplierId: string, role: string, data: any) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundError('Product');
    if (role !== 'ADMIN' && product.supplierId !== supplierId) throw new ForbiddenError('Not your product');

    return prisma.product.update({ where: { id }, data, include: { inventory: true, category: true } });
  }

  async delete(id: string, supplierId: string, role: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundError('Product');
    if (role !== 'ADMIN' && product.supplierId !== supplierId) throw new ForbiddenError('Not your product');

    return prisma.product.update({ where: { id }, data: { isActive: false } });
  }

  async listBySupplier(supplierId: string, page = 1, pageSize = 20) {
    const where = { supplierId };
    const [data, total] = await Promise.all([
      prisma.product.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, include: { inventory: true } }),
      prisma.product.count({ where }),
    ]);
    return { data, total, page, pageSize };
  }
}
