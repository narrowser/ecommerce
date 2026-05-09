import { Router } from 'express';
import { CartController } from './controllers/cart.controller';
import { OrderController } from './controllers/order.controller';
import { CouponController } from './controllers/coupon.controller';
import { authMiddleware, requireRole } from './middleware/auth.middleware';
import { UserRole } from '@ecommerce/shared';

const router = Router();
const cartCtrl = new CartController();
const orderCtrl = new OrderController();
const couponCtrl = new CouponController();

// Cart
router.get('/cart', authMiddleware, (req, res, next) => cartCtrl.get(req, res, next));
router.post('/cart/items', authMiddleware, (req, res, next) => cartCtrl.add(req, res, next));
router.put('/cart/items/:itemId', authMiddleware, (req, res, next) => cartCtrl.update(req, res, next));
router.delete('/cart/items/:itemId', authMiddleware, (req, res, next) => cartCtrl.remove(req, res, next));

// Orders
router.post('/orders', authMiddleware, (req, res, next) => orderCtrl.create(req, res, next));
router.get('/orders/mine', authMiddleware, (req, res, next) => orderCtrl.listMine(req, res, next));
router.get('/orders/admin', authMiddleware, requireRole(UserRole.ADMIN), (req, res, next) => orderCtrl.listAll(req, res, next));
router.get('/orders/supplier', authMiddleware, requireRole(UserRole.SUPPLIER), (req, res, next) => orderCtrl.listBySupplier(req, res, next));
router.get('/orders/:id', authMiddleware, (req, res, next) => orderCtrl.getById(req, res, next));
router.put('/orders/:id/status', authMiddleware, requireRole(UserRole.ADMIN), (req, res, next) => orderCtrl.updateStatus(req, res, next));

// Coupons
router.get('/coupons', (req, res, next) => couponCtrl.list(req, res, next));
router.post('/coupons', authMiddleware, requireRole(UserRole.ADMIN), (req, res, next) => couponCtrl.create(req, res, next));
router.post('/coupons/validate', authMiddleware, (req, res, next) => couponCtrl.validate(req, res, next));
router.delete('/coupons/:id', authMiddleware, requireRole(UserRole.ADMIN), (req, res, next) => couponCtrl.delete(req, res, next));

export default router;
