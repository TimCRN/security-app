import mongoose from 'mongoose';
import {ICircleOfTrustItem} from './user.model';

export interface INotification {
  userId: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description?: string;
  devices?: string[];
  sentNotification: boolean;
  circleOfTrust?: [ICircleOfTrustNotificationItem[]];
  resolved: boolean;
}

export interface IPushSubscription {
  endpoint: string;
  expirationTime: null | string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface IGroupedNotifications {
  critical: INotification[];
  warning: INotification[];
  info: INotification[];
  total: number;
  new?: INotification[];
}

interface ICircleOfTrustNotificationItem extends ICircleOfTrustItem {
  contacted: boolean;
}

const notificationSchema = new mongoose.Schema<INotification>(
  {
    userId: {type: String, required: true},
    type: {type: String, required: true},
    title: {type: String, required: true},
    description: String,
    devices: [String],
    sentNotification: Boolean,
    circleOfTrust: [
      [
        {
          name: String,
          number: String,
          contacted: {type: Boolean, default: false},
        },
      ],
    ],
    resolved: {type: Boolean, required: true, default: false},
  },
  {
    collection: 'notifications',
    timestamps: true,
  }
);

export const Notifications = mongoose.model<INotification>(
  'Notification',
  notificationSchema
);
