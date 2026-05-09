import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload, UnauthorizedError, UserRole, ForbiddenError } from '@ecommerce/shared';
import { config } from '../config';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or invalid token'));
  }
  try {
    req.user = jwt.verify(header.split(' ')[1], config.jwtSecret) as JwtPayload;
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new ForbiddenError('No authenticated user'));
    if (!roles.includes(req.user.role)) return next(new ForbiddenError('Insufficient permissions'));
    next();
  };
}
