import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Community from "../models/Community";
import DogGroup from "../models/DogGroup";

export const createDogGroup = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if(!req.user) {
      res.status(400).json({status: "FAILURE", message: "User auth error!", options: {forceLogout: true}})
      return;
    }
    const { communityId, groupName } = req.body;
    const community = await Community.findById(communityId);
    if(!community) {
      res.status(404).json({ status: "FAILURE", message: "Community does not exist!" });
      return;
    }
    const existingDogGroup = await DogGroup.findOne({community: community._id, groupName});
    if(existingDogGroup) {
      res.status(400).json({ status: "FAILURE", message: "Dog group already exist!" });
      return;
    }
    const newDogGroup = await DogGroup.create({
      community: community._id,
      createdBy: req.user._id,
      dogs: [],
      groupName,
      lastUpdatedBy: req.user._id
    })
    community.dogGroups.push(newDogGroup._id);
    await community.save();
    res.status(200).json({ status: "SUCCESS", message: "Dog group created successfully!" });
  } catch(err) {
    next(err);
  }
}

export const addDogsToDogGroup = async (req: AuthRequest, res: Response, next: NextFunction) => {
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