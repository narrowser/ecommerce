import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { NotFoundError, AppError, REDIS_CHANNELS } from '@ecommerce/shared';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');

export class ReviewService {
  async create(userId: string, data: { productId: string; orderItemId: string; rating: number; content: string; images?: string[] }) {
    const existing = await prisma.review.findFirst({
      where: { userId, productId: data.productId, orderItemId: data.orderItemId },
    });
    if (existing) throw new AppError('Already reviewed this item', 409);

    const review = await prisma.review.create({
      data: {
        userId, productId: data.productId, orderItemId: data.orderItemId,
        rating: data.rating, content: data.content,
        images: { create: (data.images || []).map(url => ({ url })) },
      },
      include: { images: true },
    });

    const stats = await prisma.review.aggregate({
      where: { productId: data.productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await redis.publish(REDIS_CHANNELS.REVIEW_CREATED, JSON.stringify({
      productId: data.productId,
      avgRating: stats._avg.rating,
      reviewCount: stats._count.rating,
    }));

    return review;
  }

  async listByProduct(productId: string, page = 1, pageSize = 20) {
    const where = { productId };
    const [data, total] = await Promise.all([
      prisma.review.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, include: { images: true }, orderBy: { createdAt: 'desc' } }),
      prisma.review.count({ where }),
    ]);
    const avg = await prisma.review.aggregate({ where, _avg: { rating: true } });
    return { data, total, page, pageSize, avgRating: avg._avg.rating || 0 };
  }

  async listAll(page = 1, pageSize = 20) {
    const [data, total] = await Promise.all([
      prisma.review.findMany({ skip: (page - 1) * pageSize, take: pageSize, include: { images: true }, orderBy: { createdAt: 'desc' } }),
      prisma.review.count(),
    ]);
    return { data, total, page, pageSize };
  }

  async delete(id: string) {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundError('Review');
    return prisma.review.delete({ where: { id } });
  }
}
