import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/review.service';

const reviewService = new ReviewService();

export class ReviewController {
  async create(req: Request, res: Response, next: NextFunction) {
    try { res.status(201).json({ success: true, data: await reviewService.create(req.user!.userId, req.body) }); } catch (e) { next(e); }
  }
  async listByProduct(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, ...(await reviewService.listByProduct(req.params.productId)) }); } catch (e) { next(e); }
  }
  async listAll(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, ...(await reviewService.listAll()) }); } catch (e) { next(e); }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await reviewService.delete(req.params.id) }); } catch (e) { next(e); }
  }
}
