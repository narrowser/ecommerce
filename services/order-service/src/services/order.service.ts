import { PrismaClient } from '@prisma/client';
import { NotFoundError, AppError, ForbiddenError } from '@ecommerce/shared';

const prisma = new PrismaClient();
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';

function generateOrderNo(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(2);
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  const d = now.getDate().toString().padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD${y}${m}${d}${rand}`;
}

export class OrderService {
  async createOrder(userId: string, data: { shippingAddr: any; couponId?: string; itemPrices?: number[]; itemNames?: string[] }) {
    const cart = await prisma.cart.findUnique({
      where: { userId }, include: { items: { where: { checked: true } } },
    });
    if (!cart || cart.items.length === 0) throw new AppError('No items selected for checkout', 400);

    // Deduct inventory from product-service for each item
    for (const item of cart.items) {
      const res = await fetch(`${PRODUCT_SERVICE_URL}/api/inventory/${item.productId}/deduct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: item.quantity }),
      });
      if (!res.ok) {
        // Rollback previously deducted items
        for (const prev of cart.items) {
          if (prev.productId === item.productId) break;
          await fetch(`${PRODUCT_SERVICE_URL}/api/inventory/${prev.productId}/restore`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: prev.quantity }),
          });
        }
        const err = await res.json();
        throw new AppError(err.error || 'Stock check failed');
      }
    }

    // Calculate totals from provided prices
    let totalAmount = 0;
    const orderItems = cart.items.map((item, i) => {
      const price = data.itemPrices?.[i] || 0;
      const productName = data.itemNames?.[i] || '';
      const subtotal = price * item.quantity;
      totalAmount += subtotal;
      return { productId: item.productId, productName, price, quantity: item.quantity, subtotal };
    });

    const orderNo = generateOrderNo();
    const order = await prisma.order.create({
      data: {
        userId,
        orderNo,
        totalAmount,
        discountAmount: 0,
        shippingAddr: data.shippingAddr,
        couponId: data.couponId,
        items: { create: orderItems },
      },
      include: { items: true },
    });

    // Clear checked cart items
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, checked: true } });

    return order;
  }

  async getOrder(id: string, userId: string, role: string) {
    const order = await prisma.order.findUnique({ where: { id }, include: { items: true, payments: true } });
    if (!order) throw new NotFoundError('Order');
    if (role !== 'ADMIN' && order.userId !== userId) throw new ForbiddenError('Not your order');
    return order;
  }

  async listByUser(userId: string, page = 1, pageSize = 20) {
    const where = { userId };
    const [data, total] = await Promise.all([
      prisma.order.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, include: { items: true }, orderBy: { createdAt: 'desc' } }),
      prisma.order.count({ where }),
    ]);
    return { data, total, page, pageSize };
  }

  async listAll(page = 1, pageSize = 20, status?: string) {
    const where: any = {};
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      prisma.order.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, include: { items: true }, orderBy: { createdAt: 'desc' } }),
      prisma.order.count({ where }),
    ]);
    return { data, total, page, pageSize };
  }

  async listBySupplier(supplierId: string, page = 1, pageSize = 20) {
    const [data, total] = await Promise.all([
      prisma.order.findMany({ skip: (page - 1) * pageSize, take: pageSize, include: { items: true }, orderBy: { createdAt: 'desc' } }),
      prisma.order.count(),
    ]);
    return { data, total, page, pageSize };
  }

  async updateStatus(id: string, status: string) {
    const VALID_TRANSITIONS: Record<string, string[]> = {
      PENDING_PAYMENT: ['PAID', 'CANCELLED'],
      PAID: ['SHIPPED', 'CANCELLED'],
      SHIPPED: ['DELIVERED'],
      DELIVERED: ['COMPLETED'],
    };

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundError('Order');
    const allowed = VALID_TRANSITIONS[order.status] || [];
    if (!allowed.includes(status)) {
      throw new AppError(`Cannot transition from ${order.status} to ${status}`, 400);
    }

    return prisma.order.update({ where: { id }, data: { status } });
  }
}
