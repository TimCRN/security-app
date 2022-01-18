import {Request, Response} from 'express';
import {Notifications, INotification} from '../models/notifications.model';

export class NotificationController {
  /** Retrieve all non-resolved notifications for a user */
  async getGroupedNotifications(req: Request, res: Response) {
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

    const grouped = groupNotificationsByType(notifications);
    return res.json({
      success: true,
      notifications: grouped,
    });
  }

  async getNotification(req: Request, res: Response) {
    const {notificationId} = req.params;
    // TODO: implement error response
    const notification = await Notifications.findOne({_id: notificationId});
    res.json({
      success: true,
      notification,
    });
  }

  /** Resolve a notification by its ID */
  async resolveNotification(req: Request, res: Response) {
    const {notificationId} = req.params;
    // TODO: implement error response
    try {
      const doc = await Notifications.findOne({_id: notificationId});
      if (!doc) throw Error('No document found with ID');
      doc.resolved = true;
      await doc.save();
      res.status(204).send();
    } catch (error) {
      res.status(400).json({
        success: false,
        message: `No notification found with ID ${notificationId}`,
      });
    }
  }
}

/**
 * Group notifications by type
 * @param notifications raw array of notifications
 * @returns object with grouped notifications
 */
const groupNotificationsByType = (notifications: INotification[]) => {
  // Custom reducer function to implement with array.reduce
  // Groups array by all different types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const group = (acc: any, cur: any) => {
    acc[cur.type] = acc[cur.type] || []; // Create new empty array if no type is defined
    acc[cur.type].push(cur);
    return acc;
  };

  // Implement array.reduce method
  // Initialize with a null object, else first notification is skipped
  const groupedNotifications = notifications.reduce(group, Object.create(null));
  return groupedNotifications;
};
