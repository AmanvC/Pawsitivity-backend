import { NextFunction, Response } from "express";
import { AuthRequest } from "middlewares/authMiddleware";
import User from "../models/User";

export const getAllCommunityDogGroupsAndDogInfo = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if(!user) {
      res.status(400).json({status: "FAILURE", message: "User auth error!", options: {forceLogout: true}})
      return;
    }
    res.status(201).json({ status: "SUCCESS", data: user.joinedCommunities });
  } catch(err) {
    next(err);
  }
}

export const saveExpoPushNotificationToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if(!req.user) {
      res.status(400).json({status: "FAILURE", message: "User auth error!", options: {forceLogout: true}})
      return;
    }
    const { pushToken } = req.body;
    if(!pushToken) {
      res.status(400).json({ status: "FAILURE", message: "Invalid params, pushToken missing!" });
      return;
    }
    await User.findByIdAndUpdate(req.user._id, {
      "expoPushToken": pushToken
    });
    res.status(200).json({ status: "SUCCESS", message: "Push token saved!" });
  } catch(err) {
    next(err);
  }
}