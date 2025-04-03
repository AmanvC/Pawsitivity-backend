import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Community from "../models/Community";

export const createCommunity = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if(!req.user) {
      res.status(400).json({status: "FAILURE", message: "User auth error!", options: {forceLogout: true}})
      return;
    }
    const { communityName, address, city, state, country, pincode } = req.body;
    const existingCommunity = await Community.findOne({ communityName, address, city, state, country, pincode });
    if(existingCommunity) {
      res.status(400).json({ status: "FAILURE", message: "Community already exists!" });
      return;
    }
    await Community.create({
      communityName,
      address,
      city,
      state,
      country,
      pincode,
      dogGroups: [],
      createdBy: req.user._id,
      lastUpdatedBy: req.user._id
    });
    res.status(201).json({ status: "SUCCESS", message: "Community created successfully." });
  } catch(err) {
    next(err);
  }
}

// export const addDogGroupsToCommunity = async (req: AuthRequest, res: Response, next: NextFunction) => {
//   try {
//     const { dogGroupIdsList, communityId } = req.body;
//     const community = await Community.findById(communityId);
//     if(!community) {
//       res.status(404).json({ status: "FAILURE", message: "Community does not exist!" });
//       return;
//     }
//     for (const dogGroupId of dogGroupIdsList) {
//       if (!community.dogGroups.some(id => id.toString() === dogGroupId)) {
//         community.dogGroups.push(dogGroupId);
//       }
//     }
//     await community.save();
//     res.status(200).json({ status: "SUCCESS", message: "Dog Groups added successfully!", community });
//   } catch(err) {
//     next(err);
//   }
// }