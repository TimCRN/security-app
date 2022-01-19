import {Router} from 'express';
import {UserController} from '../controllers/user.controller';

const controller = new UserController();
const router = Router();

router.post('/', controller.createUser);
router.get('/:userId', controller.getUser);
router.patch('/:userId', controller.updateUser);
router.post('/:userId/registerPush', controller.addPushSubscription);

export {router as usersRouter};
