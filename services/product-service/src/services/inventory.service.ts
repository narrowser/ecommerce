import { PrismaClient } from '@prisma/client';
import { NotFoundError, InsufficientStockError } from '@ecommerce/shared';

const prisma = new PrismaClient();

export class InventoryService {
  async getByProductId(productId: string) {
    const inv = await prisma.inventory.findUnique({ where: { productId } });
    if (!inv) throw new NotFoundError('Inventory');
    return inv;
  }

  async deductStock(productId: string, quantity: number) {
    const inv = await prisma.inventory.findUnique({ where: { productId } });
    if (!inv) throw new NotFoundError('Inventory');

    const available = inv.stock;
    if (available < quantity) throw new InsufficientStockError(productId, available);

    return prisma.inventory.update({
      where: { productId },
      data: { stock: { decrement: quantity } },
    });
  }

  async restoreStock(productId: string, quantity: number) {
    return prisma.inventory.update({
      where: { productId },
      data: { stock: { increment: quantity } },
    });
  }

  async setStock(productId: string, stock: number) {
    return prisma.inventory.update({ where: { productId }, data: { stock } });
  }
}
