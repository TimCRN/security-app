import {IPushSubscription} from './notifications.model';
import mongoose from 'mongoose';

export interface IUser {
  _id: string;
  name?: string;
  email: string;
  phoneNumber: string;
  devices: string[];
  circleOfTrust: [ICircleOfTrustItem[]];
  settings: {
    notifyFromType: 'critical' | 'warning' | 'info';
    batteryWarningThreshold: number;
    batteryCriticalThreshold: number;
    maxConsecutiveOfflineStates: number;
    maxOfflineDevicesPercentage: number;
  };
  pushSubscriptions: IPushSubcriptionItem[];
}

export interface ICircleOfTrustItem {
  name: string;
  number: string;
}

export interface IPushSubcriptionItem {
  name: string;
  sub: IPushSubscription;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    _id: {type: String, required: true},
    name: String,
    email: {type: String, required: true},
    phoneNumber: {type: String},
    devices: {type: [String], default: []},
    circleOfTrust: [[{name: String, number: String}]],
    settings: {
      notifyFromType: {type: String, default: 'warning'},
      batteryWarningThreshold: {type: Number, default: 20},
      batteryCriticalThreshold: {type: Number, default: 10},
      maxConsecutiveOfflineStates: {type: Number, default: 5},
      maxOfflineDevicesPercentage: {type: Number, default: 25},
    },
    pushSubscriptions: {
      type: [
        {
          name: String,
          sub: {
            endpoint: {type: String, required: true},
            expirationTime: {type: String, default: null},
            keys: {
              p256dh: {type: String, required: true},
              auth: {type: String, required: true},
            },
          },
        },
      ],
      default: [],
    },
  },
  {
    collection: 'users',
    timestamps: true,
  }
);

export const Users = mongoose.model<IUser>('User', userSchema);
