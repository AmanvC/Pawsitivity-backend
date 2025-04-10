import { NextFunction, Response } from "express";
import { AuthRequest } from "middlewares/authMiddleware";

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