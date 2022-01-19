import {Router} from 'express';
import {UserController} from '../controllers/user.controller';

const controller = new UserController();
const router = new Router();

router.post('/', controller.createUser);

export {router as usersRouter};
