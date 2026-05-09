import { PrismaClient } from '@prisma/client';
import { NotFoundError, AppError } from '@ecommerce/shared';

const prisma = new PrismaClient();

export class CouponService {
  async create(data: { code: string; type: string; value: number; minAmount?: number; maxDiscount?: number; startAt: string; endAt: string; totalQty: number }) {
    return prisma.coupon.create({ data: { ...data, minAmount: data.minAmount || 0 } });
  }

  async list() { return prisma.coupon.findMany({ orderBy: { endAt: 'desc' } }); }

  async validate(code: string, amount: number) {
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon || !coupon.isActive) throw new AppError('Coupon not found', 404);
    if (new Date() > coupon.endAt || new Date() < coupon.startAt) throw new AppError('Coupon expired');
    if (coupon.usedQty >= coupon.totalQty) throw new AppError('Coupon sold out');
    if (amount < Number(coupon.minAmount)) throw new AppError(`Minimum order amount: ¥${coupon.minAmount}`);

    let discount = coupon.type === 'FIXED'
      ? Number(coupon.value)
      : amount * Number(coupon.value) / 100;
    if (coupon.maxDiscount) discount = Math.min(discount, Number(coupon.maxDiscount));

    return { couponId: coupon.id, discount: Math.min(discount, amount) };
  }

  async apply(couponId: string) {
    return prisma.coupon.update({ where: { id: couponId }, data: { usedQty: { increment: 1 } } });
  }

  async delete(id: string) {
    return prisma.coupon.update({ where: { id }, data: { isActive: false } });
  }
}
