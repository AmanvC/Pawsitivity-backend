import { NextFunction, Response } from "express";
import { AuthRequest } from "middlewares/authMiddleware";
import Dog from "../models/Dog";
import Community from "../models/Community";
import DogGroup from "../models/DogGroup";
import Vaccination from "../models/Vaccination";
import { ObjectId } from "mongoose";

export const createDog = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log({"CREATE DOG API CALLED": "APIU"})
    if(!req.user) {
      res.status(400).json({status: "FAILURE", message: "User auth error!", options: {forceLogout: true}})
      return;
    }
    console.log({file: req.file})
    const imageUrl = req.file?.path || '';
    const { communityId, dogGroupId, dogName, dob, abcStatus, vaccinationStatus, vaccinationDetails } = req.body;
    console.log({dob})
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
    console.log({imageUrl})
    const newDog = await Dog.create({
      createdBy: req.user._id,
      lastUpdatedBy: req.user._id,
      community: community._id,
      dogGroup: dogGroup._id,
      dogName,
      abcStatus,
      vaccinationStatus,
      image: imageUrl,
      vaccinationDetails: vaccinationObjectIdList,
      ...(dob ? { dob } : {})
    })
    dogGroup.dogs.push(newDog._id as ObjectId);
    await dogGroup.save();
    res.status(200).json({ status: "SUCCESS", message: "Dog created successfully!" });
  } catch(err) {
    next(err);
  }
}

export const getAllDogsForACommunity = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { communityId } = req.body;
    console.log({body: req.body})
    if(!communityId) {
      res.status(400).json({ status: "FAILURE", message: "Invalid params, communityId missing!" });
      return;
    }
    const allDogs = 
      await Dog.find({community: communityId})
      .select("-createdBy -__v -community")
      .populate("lastUpdatedBy", "_id name")
      .populate("dogGroup", "_id groupName")
      .populate("vaccinationDetails", "-__v")

    const uniqueGroupsMap = new Map();
    allDogs.forEach(dog => {
      const group = dog.dogGroup;
      if (group && !uniqueGroupsMap.has(group._id.toString())) {
        uniqueGroupsMap.set(group._id.toString(), group);
      }
    });
    const uniqueGroups = Array.from(uniqueGroupsMap.values());

    res.status(200).json({ status: "SUCCESS", dogsList: allDogs, filters: uniqueGroups });
  } catch(err) {
    next(err);
  }
}