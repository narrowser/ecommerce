import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';

const paymentService = new PaymentService();

export class PaymentController {
  async create(req: Request, res: Response, next: NextFunction) {
    try { res.status(201).json({ success: true, data: await paymentService.create({ ...req.body, userId: req.user!.userId }) }); } catch (e) { next(e); }
  }
  async pay(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await paymentService.pay(req.params.id) }); } catch (e) { next(e); }
  }
  async refund(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await paymentService.refund(req.params.id) }); } catch (e) { next(e); }
  }
  async list(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await paymentService.list(req.query.userId as string) }); } catch (e) { next(e); }
  }
}
