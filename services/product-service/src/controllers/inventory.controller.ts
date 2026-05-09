import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory.service';

const invService = new InventoryService();

export class InventoryController {
  async deduct(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await invService.deductStock(req.params.productId, req.body.quantity) }); } catch (e) { next(e); }
  }
  async restore(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await invService.restoreStock(req.params.productId, req.body.quantity) }); } catch (e) { next(e); }
  }
  async setStock(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await invService.setStock(req.params.productId, req.body.stock) }); } catch (e) { next(e); }
  }
}
