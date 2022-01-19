import * as mongoose from "mongoose";
import { INotification } from "./notifications.model";

export type DeviceDocument = mongoose.Document & {
    _id: string;
    name: string;
    model?: string;
    category: string;
    online: boolean;
    status: deviceStatus[];
}

export type DeviceInput = {
    _id: DeviceDocument['_id'];
    name: DeviceDocument['name'];
    model: DeviceDocument['model'];
    category: DeviceDocument['category'];
    online: DeviceDocument['online'];
    status: DeviceDocument['status'];
}

export type deviceStatus = {
    code: string
    value: string
}

type simpleNotificationData = {
    type: 'critical' | 'warning' | 'info',
    title: string,
    description?: string
}

export const deviceNotificationLib : Record<string, Record<string, Record<string, simpleNotificationData>>> = {
    'Gas Detector': 
    { 
        '0' : // Gas Sensor State
        {
            '1': // Gas Detected
            { 
                type: 'critical',
                title: 'Gas detected',
            }
        }
    }
}

const deviceSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        model: {
            type: String
        },
        category: {
            type: String
        },
        online: {
            type: Boolean,
            required: true
        },
        status: {
            type: mongoose.Schema.Types.Mixed
        }
    },
    {
        collection: 'devices',
        timestamps: true
    }
);

export const Device = mongoose.model('Device', deviceSchema);

