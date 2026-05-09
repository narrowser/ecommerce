import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

export class ProductController {
  async create(req: Request, res: Response, next: NextFunction) {
    try { res.status(201).json({ success: true, data: await productService.create(req.user!.userId, req.body) }); } catch (e) { next(e); }
  }
  async list(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, ...(await productService.list(req.query)) }); } catch (e) { next(e); }
  }
  async getById(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await productService.getById(req.params.id) }); } catch (e) { next(e); }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await productService.update(req.params.id, req.user!.userId, req.user!.role, req.body) }); } catch (e) { next(e); }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await productService.delete(req.params.id, req.user!.userId, req.user!.role) }); } catch (e) { next(e); }
  }
  async listMine(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, ...(await productService.listBySupplier(req.user!.userId)) }); } catch (e) { next(e); }
  }
}
