import { Request, Response, NextFunction } from 'express';
import { SupplierService } from '../services/supplier.service';

const suppService = new SupplierService();

export class SupplierController {
  async register(req: Request, res: Response, next: NextFunction) {
    try { res.status(201).json({ success: true, data: await suppService.register(req.user!.userId, req.body) }); } catch (e) { next(e); }
  }
  async list(_req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await suppService.list() }); } catch (e) { next(e); }
  }
  async approve(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await suppService.approve(req.params.id) }); } catch (e) { next(e); }
  }
  async reject(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await suppService.reject(req.params.id) }); } catch (e) { next(e); }
  }
}
