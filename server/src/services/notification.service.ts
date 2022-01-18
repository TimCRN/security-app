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

export const createNotification = async (notification: INotification) => {
  const doc = await Notifications.create(notification);
  sendPushNotification();
  doc.actions.sentNotification = true;
  await doc.save();
  console.log(doc);
};

const sendPushNotification = () => {
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
