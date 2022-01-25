import * as mongoose from 'mongoose';

export type DeviceDocument = mongoose.Document & {
  _id: string;
  name: string;
  asset_id: string;
  asset_name: string;
  model?: string;
  category: string;
  online: boolean;
  status: deviceStatus[];
};

export type DeviceInput = {
  _id: DeviceDocument['_id'];
  name: DeviceDocument['name'];
  asset_id: DeviceDocument['asset_id'];
  asset_name: DeviceDocument['asset_name'];
  model: DeviceDocument['model'];
  category: DeviceDocument['category'];
  online: DeviceDocument['online'];
  status: DeviceDocument['status'];
};

export type deviceStatus = {
  code: string;
  value: string;
};

type simpleNotificationData = {
  type: 'critical' | 'warning' | 'info';
  title: string;
  description?: string;
};

export const deviceNotificationLib: Record<
  string,
  Record<string, Record<string, simpleNotificationData>>
> = {
  'Gas Detector': {
    // Gas Sensor State
    '0': {
      // Gas Detected
      '1': {
        type: 'critical',
        title: 'Gas detected',
        description:
          'Your device "%DEVICE_NAME%" has detected gas. Please take immediate action!',
      },
    },
  },
};

const deviceSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    asset_id: {
      type: String,
      required: true,
    },
    asset_name: {
      type: String,
    },
    model: {
      type: String,
    },
    category: {
      type: String,
    },
    online: {
      type: Boolean,
      required: true,
    },
    status: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    collection: 'devices',
    timestamps: true,
  }
);

export const Device = mongoose.model('Device', deviceSchema);
