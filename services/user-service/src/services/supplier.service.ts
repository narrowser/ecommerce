import { PrismaClient, SupplierStatus } from '@prisma/client';
import { AppError, NotFoundError } from '@ecommerce/shared';

const prisma = new PrismaClient();

export class SupplierService {
  async register(userId: string, data: any) {
    const existing = await prisma.supplierProfile.findUnique({ where: { userId } });
    if (existing) throw new AppError('Supplier profile already exists', 409);
    return prisma.supplierProfile.create({ data: { ...data, userId } });
  }

  async list() {
    return prisma.supplierProfile.findMany({ include: { user: { select: { id: true, email: true, name: true } } } });
  }

  async approve(id: string) {
    const profile = await prisma.supplierProfile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundError('Supplier profile');
    return prisma.$transaction([
      prisma.supplierProfile.update({ where: { id }, data: { status: SupplierStatus.APPROVED, verifiedAt: new Date() } }),
      prisma.user.update({ where: { id: profile.userId }, data: { role: 'SUPPLIER' } }),
    ]);
  }

  async reject(id: string) {
    const profile = await prisma.supplierProfile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundError('Supplier profile');
    return prisma.supplierProfile.update({ where: { id }, data: { status: SupplierStatus.REJECTED } });
  }
}
