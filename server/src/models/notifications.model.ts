import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
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
    timestamp: {type: Date, default: Date.now},
  },
  {
    collection: 'notifications',
    timestamps: true,
  }
);

export const Notification = mongoose.model('Notification', notificationSchema);
