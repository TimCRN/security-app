import {Router} from 'express';
import {NotificationController} from '../controllers/notification.controller';

const controller = new NotificationController();
const router = Router();

router.get('/:userId', controller.getNotifications);

export {router as notificationsRouter};
