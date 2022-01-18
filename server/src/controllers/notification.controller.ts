import {Request, Response} from 'express';
import {Notifications, INotification} from '../models/notifications.model';

export class NotificationController {
  /** Retrieve all non-resolved notifications for a user */
  async getNotifications(req: Request, res: Response) {
    const {userId} = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "The 'userId' parameter must be specified.",
      });
    }

    const notifications = await Notifications.find({
      resolved: false,
      userId,
    }).exec();

    return res.json(notifications);
  }

  async createNotification(req: Request, res: Response) {
    await Notifications.create({
      userId: 'foo',
      priority: 2,
      type: 'warning',
      devices: ['abc123', 'xyz789'],
      actions: {
        sentNotification: false,
      },
      resolved: false,
    });
    res.status(201).send();
  }
}
