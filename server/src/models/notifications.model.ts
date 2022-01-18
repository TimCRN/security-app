import mongoose from 'mongoose';

export interface INotification {
  userId: string;
  priority: number;
  type: string;
  devices: string[];
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
    priority: {type: Number, required: true},
    type: {type: String, required: true},
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
