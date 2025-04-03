import { NextFunction, Response } from "express";
import { AuthRequest } from "middlewares/authMiddleware";
import Dog from "../models/Dog";
import Community from "../models/Community";
import DogGroup from "../models/DogGroup";
import Vaccination from "../models/Vaccination";
import { ObjectId } from "mongoose";

export const createDog = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if(!req.user) {
      res.status(400).json({status: "FAILURE", message: "User auth error!", options: {forceLogout: true}})
      return;
    }
    const imageUrl = req.file?.path;
    const { communityId, dogGroupId, dogName, dob, abcStatus, vaccinationStatus, vaccinationDetails } = req.body;
    const community = await Community.findById(communityId);
    const dogGroup = await DogGroup.findById(dogGroupId);
    if(!community || !dogGroup) {
      res.status(400).json({ status: "FAILURE", message: "Community/Dog Group doesn't exist!" });
      return;
    }
    const existingDog = await Dog.findOne({community: community._id, dogGroup: dogGroup._id, dogName, dob});
    if (existingDog) {
      res.status(400).json({ status: "FAILURE", message: "Dog already exist!" });
      return;
    }
    const vaccinationObjectIdList = [];
    for (const vacc of JSON.parse(vaccinationDetails)) {
      const obj = await Vaccination.create({
        vaccinationName: vacc.vaccinationName,
        veterinaryName: vacc.veterinaryName,
        vaccinationDate: vacc.vaccinationDate
      })
      vaccinationObjectIdList.push(obj._id);
    }
    const newDog = await Dog.create({
      createdBy: req.user._id,
      lastUpdatedBy: req.user._id,
      community: community._id,
      dogGroup: dogGroup._id,
      dogName,
      dob,
      abcStatus,
      vaccinationStatus,
      image: imageUrl,
      vaccinationDetails: vaccinationObjectIdList
    })
    dogGroup.dogs.push(newDog._id as ObjectId);
    await dogGroup.save();
    res.status(200).json({ status: "SUCCESS", message: "Dog created successfully!" });
  } catch(err) {
    next(err);
  }
}