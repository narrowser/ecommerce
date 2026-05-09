import { Request, Response, NextFunction } from 'express';
import { AddressService } from '../services/address.service';

const addrService = new AddressService();

export class AddressController {
  async list(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await addrService.list(req.user!.userId) }); } catch (e) { next(e); }
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try { res.status(201).json({ success: true, data: await addrService.create(req.user!.userId, req.body) }); } catch (e) { next(e); }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await addrService.update(req.user!.userId, req.params.id, req.body) }); } catch (e) { next(e); }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await addrService.delete(req.user!.userId, req.params.id) }); } catch (e) { next(e); }
  }
}
