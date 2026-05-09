import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';

const notifService = new NotificationService();

export class NotificationController {
  async list(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await notifService.list(req.user!.userId) }); } catch (e) { next(e); }
  }
  async markRead(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await notifService.markRead(req.params.id, req.user!.userId) }); } catch (e) { next(e); }
  }
}
