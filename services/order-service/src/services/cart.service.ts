import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '@ecommerce/shared';

const prisma = new PrismaClient();

export class CartService {
  async getOrCreateCart(userId: string) {
    let cart = await prisma.cart.findUnique({ where: { userId }, include: { items: true } });
    if (!cart) { cart = await prisma.cart.create({ data: { userId }, include: { items: true } }); }
    return cart;
  }

  async addItem(userId: string, productId: string, quantity: number) {
    const cart = await this.getOrCreateCart(userId);
    const existing = cart.items.find(i => i.productId === productId);
    if (existing) {
      return prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    }
    return prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity } });
  }

  async updateItemQuantity(userId: string, itemId: string, quantity: number) {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find(i => i.id === itemId);
    if (!item) throw new NotFoundError('Cart item');
    return prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find(i => i.id === itemId);
    if (!item) throw new NotFoundError('Cart item');
    return prisma.cartItem.delete({ where: { id: itemId } });
  }

  async clearCheckoutItems(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, checked: true } });
  }
}
