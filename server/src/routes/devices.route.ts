import { Router } from "express";
import { DeviceController } from "../controllers/device.controller";

const controller = new DeviceController;
export const devicesRouter = Router()

devicesRouter.get('/', controller.getAllDevices)

// devicesRouter.get('/:id', controller.getDevice)

// devicesRouter.post('/', controller.createDevice)

// devicesRouter.patch('/:id', controller.updateDevice)

// devicesRouter.delete('/:id', controller.deleteDevice)

devicesRouter.get('/tuya', controller.tuyaInfo)

