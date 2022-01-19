import {Router} from 'express';
import {UserController} from '../controllers/user.controller';

const controller = new UserController();
const router = Router();

router.post('/', controller.createUser);
router.get('/:userId', controller.getUser);
router.patch('/:userId/update', controller.updateUser);

export {router as usersRouter};
