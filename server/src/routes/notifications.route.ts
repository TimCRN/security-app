import {Router} from 'express';
import {NotificationController} from '../controllers/notification.controller';

const controller = new NotificationController();
const router = Router();

router.get('/:notificationId', controller.getNotification);
router.get('/all/:userId', controller.getGroupedNotifications);
router.post('/resolve/:notificationId', controller.resolveNotification);

export {router as notificationsRouter};
