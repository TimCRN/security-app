import {Request, Response} from 'express';
import {Users} from '../models/user.model';

export class UserController {
  /** Create a new user with given userId and email */
  async createUser(req: Request, res: Response) {
    const {userId, email} = req.body;
    // TODO: Implement error response

    // TODO: Implement error handling if userId was used before or another error occurred
    const user = await Users.create({
      _id: userId,
      email,
    });

    res.status(201).json({
      success: true,
      user,
    });
  }
}
