import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError, UserRole, JwtPayload } from '@ecommerce/shared';
import { config } from '../config';

const prisma = new PrismaClient();

export class AuthService {
  async register(data: { email: string; password: string; name: string; role?: UserRole }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new AppError('Email already registered', 409);

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        role: data.role || UserRole.CUSTOMER,
      },
    });

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError('Invalid email or password', 401);

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AppError('Invalid email or password', 401);

    const payload: JwtPayload = { userId: user.id, role: user.role as UserRole, email: user.email };

    const accessToken = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.accessTokenExpiry,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, {
      expiresIn: config.refreshTokenExpiry,
    } as jwt.SignOptions);

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = jwt.verify(token, config.jwtRefreshSecret) as JwtPayload;
      const newAccessToken = jwt.sign(
        { userId: payload.userId, role: payload.role, email: payload.email },
        config.jwtSecret,
        { expiresIn: config.accessTokenExpiry } as jwt.SignOptions,
      );
      return { accessToken: newAccessToken };
    } catch {
      throw new AppError('Invalid refresh token', 401);
    }
  }
}
