import {Request, Response} from 'express';
import {Device} from '../models/devices.model';
import {tuyaAPI} from '../services/tuya.service';

export class DeviceController {
  async getAllDevices(req: Request, res: Response) {
    const devices = await Device.find();
    return res.status(201).json(devices);
  }

  async getDevice(req: Request, res: Response) {
    const {id} = req.params;

    const device = await Device.findById(id);

    if (!device) {
      return res.status(404).json(`Device with ID '${id}' does not exist.`);
    }
    return res.status(201).json(device);
  }

  async updateDevice(req: Request, res: Response) {
    return res.status(201).json();
  }

  async deleteDevice(req: Request, res: Response) {
    const {id} = req.params;

    const device = await Device.findById(id);

    if (!device) {
      return res
        .status(404)
        .json(
          `Device with ID '${id}' can not be deleted, because it does not exist.`
        );
    }
    await Device.findByIdAndDelete(id);
    return res.status(201).json(`Device '${id}' has been succesfully deleted!`);
  }

  async tuyaInfo(req: Request, res: Response) {
    const data = await tuyaAPI.getDevices();
    return res.status(201).json(data);
  }

  async tuyaDeviceInfo(req: Request, res: Response) {
    const {id} = req.params;
    const data = await tuyaAPI.getDeviceStatus(id);
    return res.status(201).json(data);
  }
}
