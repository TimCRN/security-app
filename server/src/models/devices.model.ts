import * as mongoose from "mongoose";
import { INotification, severity } from "./notifications.model";

export type DeviceDocument = mongoose.Document & {
    _id: string;
    name: string;
    asset_id: string;
    asset_name: string;
    model?: string;
    category: string;
    category_name: string;
    online: boolean;
    status: deviceStatus[];
}

export type DeviceInput = {
    _id: DeviceDocument['_id'];
    name: DeviceDocument['name'];
    asset_id: DeviceDocument['asset_id'];
    asset_name: DeviceDocument['asset_name'];
    model: DeviceDocument['model'];
    category: DeviceDocument['category'];
    category_name: DeviceDocument['category_name'];
    online: DeviceDocument['online'];
    status: DeviceDocument['status'];
}

export type deviceStatus = {
    code: string
    value: string
}

interface ISimpleNotificationData {
    type: severity,
    title: string,
    description?: string
}

export const deviceNotificationLib : Record<string, Record<string, Record<string, ISimpleNotificationData>>> = {
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

export const deviceNotificationLib2 : Record<string, Record<string, Record<string, ISimpleNotificationData>>> = {
    'rqbj': // Gas Detector 
    { 
        'gas_sensor_state' :
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
        asset_id: {
            type: String,
            required: true
        },
        asset_name: {
            type: String
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

