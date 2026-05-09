import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';

const orderService = new OrderService();

export class OrderController {
  async create(req: Request, res: Response, next: NextFunction) {
    try { res.status(201).json({ success: true, data: await orderService.createOrder(req.user!.userId, req.body) }); } catch (e) { next(e); }
  }
  async getById(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await orderService.getOrder(req.params.id, req.user!.userId, req.user!.role) }); } catch (e) { next(e); }
  }
  async listMine(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, ...(await orderService.listByUser(req.user!.userId)) }); } catch (e) { next(e); }
  }
  async listAll(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, ...(await orderService.listAll(undefined, undefined, req.query.status as string)) }); } catch (e) { next(e); }
  }
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await orderService.updateStatus(req.params.id, req.body.status) }); } catch (e) { next(e); }
  }
  async listBySupplier(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, ...(await orderService.listBySupplier(req.user!.userId)) }); } catch (e) { next(e); }
  }
}
