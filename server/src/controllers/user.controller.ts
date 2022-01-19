import {Request, Response} from 'express';
import {IPushSubcriptionItem, Users} from '../models/user.model';

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

  /** Get a user by their ID */
  async getUser(req: Request, res: Response) {
    const {userId} = req.params;
    // TODO: Implement error response

    const user = await Users.findOne({_id: userId});

    res.json({
      success: true,
      user,
    });
  }

  /** Update a user */
  async updateUser(req: Request, res: Response) {
    const {userId} = req.params;
    const patch = req.body;
    // TODO: Implement error response

    const user = await Users.findOneAndUpdate({_id: userId}, patch, {
      runValidators: true,
      new: true,
    });
    res.json({
      success: true,
      user,
    });
  }

  /** Register a push subscription for a user */
  async addPushSubscription(req: Request, res: Response) {
    const {userId} = req.params;
    const subscription: IPushSubcriptionItem = req.body;
    // TODO: Implement error response

    console.log(subscription);

    // TODO: wrap in trycatch
    const user = await Users.findOne({_id: userId});
    user?.pushSubscriptions.push(subscription);
    await user?.save();
    res.json({success: true});
  }
}
