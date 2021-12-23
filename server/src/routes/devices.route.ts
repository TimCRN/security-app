import { Router } from "express";
import { DeviceController } from "../controllers/device.controller";

const controller = new DeviceController;
export const devicesRouter = Router()

devicesRouter.get('/', controller.getAllDevices)

devicesRouter.get('/:id', (req, res) => {

})

devicesRouter.post('/', controller.createDevice)

devicesRouter.patch('/:id', (req, res) => {

})

devicesRouter.delete('/:id', (req, res) => {

})

