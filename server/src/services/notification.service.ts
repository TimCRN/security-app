import {IPushSubscription} from './../models/notifications.model';
import {Notifications, INotification} from '../models/notifications.model';
import webpush from 'web-push';

// Load environment variables in non-production environment
if (process.env.ENV !== 'prod') {
  require('dotenv').config();
}

webpush.setVapidDetails(
  'mailto:hi@niels.codes',
  process.env.VAPID_PUBLIC!,
  process.env.VAPID_PRIVATE!
);

/**
 * Group notifications by type
 * @param notifications raw array of notifications
 * @returns object with grouped notifications
 */
export const groupNotificationsByType = (notifications: INotification[]) => {
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

/**
 * Create and dispatch a notification event
 * - Notification is created and stored in Mongo
 * - Push notifications are dispatched to the user if push subscriptions are present
 * @param notification The notification object to create
 */
export const createNotification = async (notification: INotification) => {
  const doc = await Notifications.create(notification);
  await notifyUser(notification);
  doc.sentNotification = true;
  await doc.save();
  // TODO: Implement further push logic
};

// TODO: Implement
/**
 * Find user's push subscriptions and use them to send notifications
 * - Retrieves a user's registered pushSubscriptions
 * - Checks user's preferred notification types (e.g. only critical notifications)
 * - Dispatches notifications via sendPushNotifications()
 * @param notification The notification to dispatch
 */
const notifyUser = async (notification: INotification) => {
  // 1. Get all user's subscriptions
  // ? Optional: Implement preferred notification levels
  // ? User might only want push notifications for critical level notifications
  // 2. Call sendPushNotification for each subscription
  // ? What to do if no push subscriptions were ever registered by the user?
};

/**
 * Dispatch a notification to a specific push subscription
 * @param notification The notification to dispatch
 * @param subscription The push subscription to send the notification to
 */
const sendPushNotification = (
  notification: INotification,
  subscription: IPushSubscription
) => {
  const payload = {
    notification: {
      title: notification.title,
      // Only assign body property if a notification description was set
      ...(notification.description && {body: notification.description}),
    },
  };

  webpush.sendNotification(subscription, JSON.stringify(payload));
};
