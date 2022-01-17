import { Request, Response } from 'express';
import { Device, DeviceInput } from '../models/devices.model';
import { devicesRouter } from '../routes/devices.route';

export class DeviceController 
{
    
    async createDevice(req: Request, res: Response) 
    {
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
        return res.status(201).json(deviceCreated);
    }


    async getAllDevices(req: Request, res: Response) 
    {
        const devices = await Device.find();
        return res.status(201).json(devices);
    }


    async getDevice(req: Request, res: Response) 
    {
        const { id } = req.params;

        const device = await Device.findById(id);

        if(!device)
        {
            return res.status(404).json(`Device with ID '${id}' does not exist.`);
        }
        return res.status(201).json(device);
    }

    async updateDevice(req: Request, res: Response)
    {
        return res.status(201).json();
    }

    async deleteDevice(req: Request, res: Response) 
    {
        const { id } = req.params;

        const device = await Device.findById(id);

        if(!device)
        {
            return res.status(404).json(`Device with ID '${id}' can not be deleted, because it does not exist.`);
        }
        await Device.findByIdAndDelete(id);
        return res.status(201).json(`Device '${id}' has been succesfully deleted!`);
    }
}