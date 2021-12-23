import { Request, Response } from 'express';
import { Device, DeviceInput } from '../models/devices.model';

export class DeviceController {
    async createDevice(req: Request, res: Response) {
        const { name } = req.body;

        if(!name)
        {
            return res.json({
                message: "The 'name' field must be specified!"
            });
        }

        const input: DeviceInput = {
            name
        }

        const deviceCreated = await Device.create(input)
        return res.status(201).json({data: deviceCreated});
    }
    async getAllDevices(req: Request, res: Response) {
        const devices = await Device.find();
        return res.status(201).json(devices);
    }
}