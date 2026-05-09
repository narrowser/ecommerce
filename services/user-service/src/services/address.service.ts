import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '@ecommerce/shared';

const prisma = new PrismaClient();

export class AddressService {
  async list(userId: string) {
    return prisma.userAddress.findMany({ where: { userId }, orderBy: { isDefault: 'desc' } });
  }

  async create(userId: string, data: any) {
    if (data.isDefault) {
      await prisma.userAddress.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    return prisma.userAddress.create({ data: { ...data, userId } });
  }

  async update(userId: string, addressId: string, data: any) {
    const addr = await prisma.userAddress.findFirst({ where: { id: addressId, userId } });
    if (!addr) throw new NotFoundError('Address');
    if (data.isDefault) {
      await prisma.userAddress.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    return prisma.userAddress.update({ where: { id: addressId }, data });
  }

  async delete(userId: string, addressId: string) {
    const addr = await prisma.userAddress.findFirst({ where: { id: addressId, userId } });
    if (!addr) throw new NotFoundError('Address');
    return prisma.userAddress.delete({ where: { id: addressId } });
  }
}
