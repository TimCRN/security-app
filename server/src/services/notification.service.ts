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
  // TODO: remove console log
  // Implement further push logic
  console.log(doc);
};

// TODO: Implement
const notifyUser = async (notification: INotification) => {
  // 1. Get all user's subscriptions
  // ? Optional: Implement preferred notification levels
  // ? User might only want push notifications for critical level notifications
  // 2. Call sendPushNotification for each subscription
  // ? What to do if no push subscriptions were ever registered by the user?
};

/** Send a push notification */
const sendPushNotification = () => {
  // TODO: take subscription as argument
  const subscription = {
    endpoint:
      'https://fcm.googleapis.com/fcm/send/dc4D2JAg3v4:APA91bHtVJ5BmpdkbeQb6HybH2KdgXq5j_bHJpFn6igwQTxkPfzJao1e3M5LCYeEnin781anlwhdh0FFnD_EIdfp-5IJrsy_DuylQBMk0tI5pcFiQPgi5M-hTD0Zf54xRCo4QfHt81iy',
    expirationTime: null,
    keys: {
      p256dh:
        'BD_nhYJsvfspbJzZb6iqkU6DhZMJTBT706wPup3bnHPiYzRyH1LCDelodWcwOB2TDrXhyPyC5XaYUAGaydtIA7g',
      auth: 'hS04otREVBvBSPHNMLO3Ig',
    },
  };

  const payload = {
    notification: {
      title: 'Hello World',
      body: 'This is a notification',
    },
  };

  webpush.sendNotification(subscription, JSON.stringify(payload));
};
