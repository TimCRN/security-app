import {
  IGroupedNotifications,
  IPushSubscription,
} from './../models/notifications.model';
import {Notifications, INotification} from '../models/notifications.model';
import webpush from 'web-push';
import {IPushSubcriptionItem, Users} from '../models/user.model';

// Load environment variables in non-production environment
if (process.env.ENV !== 'prod') {
  require('dotenv').config();
}

// Set web push credentials
webpush.setVapidDetails(
  'mailto:hi@niels.codes',
  process.env.VAPID_PUBLIC!,
  process.env.VAPID_PRIVATE!
);

/**
 * Retrieve all unresolved notifications for a user, grouped by notification type
 * @param userId user ID to retrieve notifications for
 * @returns Object with notification array per type
 */
export const getGroupedNotifications = async (
  userId: string
): Promise<IGroupedNotifications> => {
  try {
    const notifications = await Notifications.find({
      resolved: false,
      userId,
    }).exec();
    const grouped = groupNotificationsByType(notifications);
    return grouped;
  } catch (error) {
    console.error((error as Error).message);
    throw error;
  }
};

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
  const docId = doc.id;
  await notifyUser(notification, docId);
  doc.sentNotification = true;
  await doc.save();
};

/**
 * Find user's push subscriptions and use them to send notifications
 * - Retrieves a user's registered pushSubscriptions
 * - Checks user's preferred notification types (e.g. only critical notifications)
 * - Dispatches notifications via sendPushNotifications()
 * @param notification The notification to dispatch
 * @param notificationId The id of the notification
 */
const notifyUser = async (
  notification: INotification,
  notificationId: string
) => {
  const {userId} = notification;

  try {
    const user = await Users.findOne({_id: userId});
    if (!user) throw Error(`User with ID ${userId} not found`);
    const subscriptions: IPushSubscription[] = user.pushSubscriptions.map(
      (item: IPushSubcriptionItem) => item.sub
    );
    const notifyFromTypePref = user.settings.notifyFromType;

    if (notifyFromTypePref === 'critical' && notification.type !== 'critical')
      return;

    if (notifyFromTypePref === 'warning' && notification.type === 'info')
      return;

    for (const pushSub of subscriptions) {
      sendPushNotification(notification, pushSub, notificationId);
    }
  } catch (error) {
    console.error(error);
  }
  // ? What to do if no push subscriptions were ever registered by the user?
};

/**
 * Dispatch a notification to a specific push subscription
 * @param notification The notification to dispatch
 * @param subscription The push subscription to send the notification to
 * @param notificationId The ID of the notification being dispatched
 */
const sendPushNotification = (
  notification: INotification,
  subscription: IPushSubscription,
  notificationId: string
) => {
  const payload = {
    notification: {
      title: notification.title,
      icon: 'assets/icons/icon-512x512.png',
      // Only assign body property if a notification description was set
      ...(notification.description && {body: notification.description}),
      data: {
        onActionClick: {
          default: {
            operation: 'navigateLastFocusedOrOpen',
            url: `/event/${notificationId}?src=push`,
          },
        },
      },
    },
  };

  webpush.sendNotification(subscription, JSON.stringify(payload));
};
