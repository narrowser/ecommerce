import { Request, Response, NextFunction } from 'express';
import { CartService } from '../services/cart.service';

const cartService = new CartService();

export class CartController {
  async get(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await cartService.getOrCreateCart(req.user!.userId) }); } catch (e) { next(e); }
  }
  async add(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await cartService.addItem(req.user!.userId, req.body.productId, req.body.quantity) }); } catch (e) { next(e); }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await cartService.updateItemQuantity(req.user!.userId, req.params.itemId, parseInt(req.body.quantity)) }); } catch (e) { next(e); }
  }
  async remove(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await cartService.removeItem(req.user!.userId, req.params.itemId) }); } catch (e) { next(e); }
  }
}
