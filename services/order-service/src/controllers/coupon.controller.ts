import { Request, Response, NextFunction } from 'express';
import { CouponService } from '../services/coupon.service';

const couponService = new CouponService();

export class CouponController {
  async create(req: Request, res: Response, next: NextFunction) {
    try { res.status(201).json({ success: true, data: await couponService.create(req.body) }); } catch (e) { next(e); }
  }
  async list(_req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await couponService.list() }); } catch (e) { next(e); }
  }
  async validate(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await couponService.validate(req.body.code, req.body.amount) }); } catch (e) { next(e); }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await couponService.delete(req.params.id) }); } catch (e) { next(e); }
  }
}
