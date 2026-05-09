import { Router } from 'express';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { AddressController } from './controllers/address.controller';
import { SupplierController } from './controllers/supplier.controller';
import { authMiddleware } from './middleware/auth.middleware';
import { requireRole } from './middleware/role.middleware';
import { UserRole } from '@ecommerce/shared';

const router = Router();
const authCtrl = new AuthController();
const userCtrl = new UserController();
const addrCtrl = new AddressController();
const suppCtrl = new SupplierController();

// Auth
router.post('/auth/register', (req, res, next) => authCtrl.register(req, res, next));
router.post('/auth/login', (req, res, next) => authCtrl.login(req, res, next));
router.post('/auth/refresh', (req, res, next) => authCtrl.refresh(req, res, next));

// User profile
router.get('/users/me', authMiddleware, (req, res, next) => userCtrl.getMe(req, res, next));
router.put('/users/me', authMiddleware, (req, res, next) => userCtrl.updateMe(req, res, next));

// Addresses
router.get('/addresses', authMiddleware, (req, res, next) => addrCtrl.list(req, res, next));
router.post('/addresses', authMiddleware, (req, res, next) => addrCtrl.create(req, res, next));
router.put('/addresses/:id', authMiddleware, (req, res, next) => addrCtrl.update(req, res, next));
router.delete('/addresses/:id', authMiddleware, (req, res, next) => addrCtrl.delete(req, res, next));

// Admin: suppliers
router.get('/suppliers', authMiddleware, requireRole(UserRole.ADMIN), (req, res, next) => suppCtrl.list(req, res, next));
router.put('/suppliers/:id/approve', authMiddleware, requireRole(UserRole.ADMIN), (req, res, next) => suppCtrl.approve(req, res, next));
router.put('/suppliers/:id/reject', authMiddleware, requireRole(UserRole.ADMIN), (req, res, next) => suppCtrl.reject(req, res, next));

// Supplier registration
router.post('/suppliers/register', authMiddleware, (req, res, next) => suppCtrl.register(req, res, next));

export default router;
