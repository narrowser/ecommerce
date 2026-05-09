import { Request, Response, NextFunction } from 'express';
import { UserRole, ForbiddenError } from '@ecommerce/shared';

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new ForbiddenError('No authenticated user'));
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    next();
  };
}
