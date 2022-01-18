import {Router} from 'express';
import {NotificationController} from '../controllers/notification.controller';

const controller = new NotificationController();
const router = Router();

router.get('/:userId', controller.getNotifications);

// TODO: Remove before release
router.post('/', controller.createNotification);

export {router as notificationsRouter};
