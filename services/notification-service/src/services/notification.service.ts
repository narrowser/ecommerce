import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { REDIS_CHANNELS } from '@ecommerce/shared';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');

export class NotificationService {
  async init() {
    redis.subscribe(REDIS_CHANNELS.PAYMENT_SUCCESS, (err) => {
      if (err) console.error('Failed to subscribe:', err);
    });

    redis.on('message', async (channel, message) => {
      const data = JSON.parse(message);
      if (channel === REDIS_CHANNELS.PAYMENT_SUCCESS) {
        await this.create({
          userId: data.userId,
          type: 'PAYMENT',
          title: '支付成功',
          content: `订单 ${data.orderId} 已支付成功，金额 ¥${Number(data.amount).toFixed(2)}`,
        });
      }
    });
  }

  async create(data: { userId: string; type: string; title: string; content: string }) {
    return prisma.notification.create({ data });
  }

  async list(userId: string) {
    return prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 50 });
  }

  async markRead(id: string, userId: string) {
    return prisma.notification.updateMany({ where: { id, userId }, data: { isRead: true } });
  }
}
