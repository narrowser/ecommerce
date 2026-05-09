import { Router } from 'express';
import { PaymentController } from './controllers/payment.controller';
import { authMiddleware, requireRole } from './middleware/auth.middleware';
import { UserRole } from '@ecommerce/shared';

const router = Router();
const ctrl = new PaymentController();

router.post('/payments', authMiddleware, (req, res, next) => ctrl.create(req, res, next));
router.post('/payments/:id/pay', authMiddleware, (req, res, next) => ctrl.pay(req, res, next));
router.post('/payments/:id/refund', authMiddleware, requireRole(UserRole.ADMIN), (req, res, next) => ctrl.refund(req, res, next));
router.get('/payments', authMiddleware, (req, res, next) => ctrl.list(req, res, next));

export default router;
