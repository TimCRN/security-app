import {Router} from 'express';
import {NotificationController} from '../controllers/notification.controller';

const controller = new NotificationController();
const router = Router();

router.get('/:userId', controller.getNotifications);
router.post('/resolve/:notificationId', controller.resolveNotification);

export {router as notificationsRouter};
