import { Router } from 'express';
import { ProductController } from './controllers/product.controller';
import { CategoryController } from './controllers/category.controller';
import { InventoryController } from './controllers/inventory.controller';
import { authMiddleware, optionalAuth, requireRole } from './middleware/auth.middleware';
import { UserRole } from '@ecommerce/shared';

const router = Router();
const pCtrl = new ProductController();
const cCtrl = new CategoryController();
const iCtrl = new InventoryController();

router.get('/products', optionalAuth, (req, res, next) => pCtrl.list(req, res, next));
router.get('/products/mine', authMiddleware, requireRole(UserRole.SUPPLIER), (req, res, next) => pCtrl.listMine(req, res, next));
router.get('/products/:id', optionalAuth, (req, res, next) => pCtrl.getById(req, res, next));
router.post('/products', authMiddleware, requireRole(UserRole.ADMIN, UserRole.SUPPLIER), (req, res, next) => pCtrl.create(req, res, next));
router.put('/products/:id', authMiddleware, (req, res, next) => pCtrl.update(req, res, next));
router.delete('/products/:id', authMiddleware, (req, res, next) => pCtrl.delete(req, res, next));

router.get('/categories', (req, res, next) => cCtrl.list(req, res, next));
router.post('/categories', authMiddleware, requireRole(UserRole.ADMIN), (req, res, next) => cCtrl.create(req, res, next));
router.put('/categories/:id', authMiddleware, requireRole(UserRole.ADMIN), (req, res, next) => cCtrl.update(req, res, next));
router.delete('/categories/:id', authMiddleware, requireRole(UserRole.ADMIN), (req, res, next) => cCtrl.delete(req, res, next));

router.post('/inventory/:productId/deduct', authMiddleware, (req, res, next) => iCtrl.deduct(req, res, next));
router.post('/inventory/:productId/restore', authMiddleware, (req, res, next) => iCtrl.restore(req, res, next));
router.put('/inventory/:productId', authMiddleware, requireRole(UserRole.ADMIN, UserRole.SUPPLIER), (req, res, next) => iCtrl.setStock(req, res, next));

export default router;
