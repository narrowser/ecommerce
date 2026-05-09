import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export class UserController {
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getById(req.user!.userId);
      res.json({ success: true, data: user });
    } catch (e) { next(e); }
  }

  async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.update(req.user!.userId, req.body);
      res.json({ success: true, data: user });
    } catch (e) { next(e); }
  }
}
