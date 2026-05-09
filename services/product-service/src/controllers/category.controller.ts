import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';

const catService = new CategoryService();

export class CategoryController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await catService.list() }); } catch (e) { next(e); }
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try { res.status(201).json({ success: true, data: await catService.create(req.body) }); } catch (e) { next(e); }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await catService.update(req.params.id, req.body) }); } catch (e) { next(e); }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await catService.delete(req.params.id) }); } catch (e) { next(e); }
  }
}
