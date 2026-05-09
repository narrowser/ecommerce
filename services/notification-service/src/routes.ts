import { Router } from 'express';
import { NotificationController } from './controllers/notification.controller';
import { authMiddleware } from './middleware/auth.middleware';

const router = Router();
const ctrl = new NotificationController();

router.get('/notifications', authMiddleware, (req, res, next) => ctrl.list(req, res, next));
router.put('/notifications/:id/read', authMiddleware, (req, res, next) => ctrl.markRead(req, res, next));

export default router;
