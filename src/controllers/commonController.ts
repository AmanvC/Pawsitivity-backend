import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import User from "../models/User";
import jwt, { JwtPayload } from "jsonwebtoken";

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

export const saveExpoPushNotificationToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pushToken, token } = req.body;
    if(!pushToken || !token) {
      res.status(400).json({ status: "FAILURE", message: "Invalid params, pushToken missing!" });
      return;
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "") as JwtPayload;
    await User.findByIdAndUpdate(decodedToken.data.id, {
      "expoPushToken": pushToken
    });
    res.status(200).json({ status: "SUCCESS", message: "Push token saved!" });
  } catch(err) {
    next(err);
  }
}