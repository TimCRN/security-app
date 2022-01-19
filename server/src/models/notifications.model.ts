import mongoose from 'mongoose';

export interface INotification {
  userId: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description?: string;
  devices?: string[];
  actions: {
    sentNotification: boolean;
    circleOfTrust?: [CircleOfTrustItem[]];
  };
  resolved: boolean;
}

interface CircleOfTrustItem {
  name: string;
  number: string;
  contacted: boolean;
}

const notificationSchema = new mongoose.Schema<INotification>(
  {
    userId: {type: String, required: true},
    type: {type: String, required: true},
    title: {type: String, required: true},
    description: String,
    devices: [String],
    actions: {
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
    },
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
