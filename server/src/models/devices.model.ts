import * as mongoose from "mongoose";

export type DeviceDocument = mongoose.Document & {
    name: string;
}

export type DeviceInput = {
    name: DeviceDocument['name'];
}

const deviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        }
    },
    {
        collection: 'devices',
        timestamps: true
    }
);

export const Device = mongoose.model('Device', deviceSchema);