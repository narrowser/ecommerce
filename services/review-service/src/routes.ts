import { Router } from 'express';
import { ReviewController } from './controllers/review.controller';
import { authMiddleware, requireRole } from './middleware/auth.middleware';
import { UserRole } from '@ecommerce/shared';

const router = Router();
const ctrl = new ReviewController();

router.get('/reviews/product/:productId', (req, res, next) => ctrl.listByProduct(req, res, next));
router.get('/reviews', authMiddleware, requireRole(UserRole.ADMIN), (req, res, next) => ctrl.listAll(req, res, next));
router.post('/reviews', authMiddleware, (req, res, next) => ctrl.create(req, res, next));
router.delete('/reviews/:id', authMiddleware, requireRole(UserRole.ADMIN), (req, res, next) => ctrl.delete(req, res, next));

export default router;
