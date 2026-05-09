import { PrismaClient } from '@prisma/client';
import { NotFoundError, AppError } from '@ecommerce/shared';
import Redis from 'ioredis';
import { REDIS_CHANNELS } from '@ecommerce/shared';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://order-service:3003';

export class PaymentService {
  async create(data: { orderId: string; userId: string; amount: number; method: string }) {
    return prisma.payment.create({
      data: { orderId: data.orderId, userId: data.userId, amount: data.amount, method: data.method },
    });
  }

  async pay(id: string) {
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundError('Payment');
    if (payment.status !== 'PENDING') throw new AppError('Payment already processed', 400);

    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const updated = await prisma.payment.update({
      where: { id },
      data: { status: 'SUCCESS', transactionId, paidAt: new Date() },
    });

    // Callback to order service
    try {
      await fetch(`${ORDER_SERVICE_URL}/api/orders/${payment.orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PAID' }),
      });
    } catch (e) {
      console.error('Failed to notify order service:', e);
    }

    // Publish Redis notification
    await redis.publish(REDIS_CHANNELS.PAYMENT_SUCCESS, JSON.stringify({
      orderId: payment.orderId, userId: payment.userId, amount: payment.amount,
    }));

    return updated;
  }

  async refund(id: string) {
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundError('Payment');
    if (payment.status !== 'SUCCESS') throw new AppError('Only successful payments can be refunded', 400);
    return prisma.payment.update({ where: { id }, data: { status: 'REFUNDED' } });
  }

  async getByOrderId(orderId: string) {
    return prisma.payment.findMany({ where: { orderId } });
  }

  async list(userId?: string) {
    const where = userId ? { userId } : {};
    return prisma.payment.findMany({ where, orderBy: { createdAt: 'desc' }, take: 100 });
  }
}
