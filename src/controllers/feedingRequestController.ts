import { NextFunction, Response } from "express";
import { AuthRequest } from "middlewares/authMiddleware";
import Community from "../models/Community";
import DogGroup from "../models/DogGroup";
import FeedingRequest, { EFeedingRequestStatus } from "../models/FeedingRequest";
import { Schema } from "mongoose";
import { sendPushNotification } from "../utils/sendPushNotifications";

export const createFeedingRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if(!req.user) {
      res.status(400).json({status: "FAILURE", message: "User auth error!", options: {forceLogout: true}})
      return;
    }
    const { communityId, dogGroupId, fromDate, toDate, message } = req.body;
    if(!communityId || !dogGroupId || !fromDate) {
      res.status(400).json({ status: "FAILURE", message: "Invalid params!" });
      return;
    }
    const community = await Community.findById(communityId);
    if(!community) {
      res.status(404).json({ status: "FAILURE", message: "Community does not exist!" });
      return;
    }
    const existingDogGroup = await DogGroup.findById(dogGroupId);
    if(!existingDogGroup) {
      res.status(400).json({ status: "FAILURE", message: "Dog group does not exist!" });
      return;
    }
    let updatedToDate: Date | null = toDate;
    if(!toDate) {
      updatedToDate = fromDate;
    }
    await FeedingRequest.create({
      createdBy: req.user._id,
      community: communityId,
      dogGroup: dogGroupId,
      fromDate,
      toDate: updatedToDate,
      message
    })
    res.status(200).json({ status: "SUCCESS", message: `Feeding request for group: ${existingDogGroup.groupName} created successfully!` });
  } catch(err) {
    next(err);
  }
}

export const getAllPendingFeedingRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if(!req.user) {
      res.status(400).json({status: "FAILURE", message: "User auth error!", options: {forceLogout: true}})
      return;
    }
    const { communityId } = req.body;
    if(!communityId) {
      res.status(400).json({ status: "FAILURE", message: "Invalid params!" });
      return;
    }
    const community = await Community.findById(communityId);
    if(!community) {
      res.status(404).json({ status: "FAILURE", message: "Community does not exist!" });
      return;
    }
    const allPendingFeedingRequestsForACommunity = 
      await FeedingRequest.find({ "requestStatus.status": EFeedingRequestStatus.PENDING })
      .populate({
        path: "createdBy",
        select: "-_id name"
      })
      .populate({
        path: "dogGroup",
        select: "-_id dogs groupName",
        populate: {
          path: "dogs",
          select: "-_id dogName"
        }
      });
    res.status(200).json({ status: "SUCCESS", data: allPendingFeedingRequestsForACommunity });
  } catch(err) {
    next(err);
  }
}

export const acceptPendingFeedingRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if(!req.user) {
      res.status(400).json({status: "FAILURE", message: "User auth error!", options: {forceLogout: true}})
      return;
    }
    const { feedingRequestId } = req.body;
    if(!feedingRequestId) {
      res.status(400).json({ status: "FAILURE", message: "Invalid params!" });
      return;
    }
    const validPendingRequest = 
      await FeedingRequest.findOne({ _id: feedingRequestId, "requestStatus.status": EFeedingRequestStatus.PENDING })
      .populate({
        path: "createdBy",
        select: "_id expoPushToken"
      })
    
    if(!validPendingRequest) {
      res.status(400).json({ status: "FAILURE", message: "Request already accpeted / does not exist!" });
      return;
    }
    if ((validPendingRequest.createdBy as any)._id.toString() === req.user.id) {
      res.status(403).json({
        status: "FAILURE",
        message: "You cannot accept your own feeding request!"
      });
      return;
    }

    validPendingRequest.requestStatus.status = EFeedingRequestStatus.ACCEPTED;
    validPendingRequest.requestStatus.acceptedBy = req.user._id as Schema.Types.ObjectId;
    validPendingRequest.requestStatus.acceptedOn = new Date();

    await validPendingRequest.save();
    const expoPushToken = (validPendingRequest.createdBy as any).expoPushToken
    if(expoPushToken) {
      const message = {
        title: 'Woof Woof 🐶',
        body: `Your feeding request was accepted by ${req.user.name}. Click here to view.`,
        data: {
          page: "CREATED_FEEDING_REQUESTS",
          id: validPendingRequest._id,
        },
      };
      await sendPushNotification(expoPushToken, message);
    }

    

    res.status(200).json({ status: "SUCCESS", message: "Feeding request accepted successfully!" });
  } catch(err) {
    next(err);
  }
}

export const getAllUserCreatedFeedingRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if(!req.user) {
      res.status(400).json({status: "FAILURE", message: "User auth error!", options: {forceLogout: true}})
      return;
    }
    const allUserCreatedRequests = 
      await FeedingRequest.find({"createdBy": req.user._id})
      .populate({
        path: "requestStatus",
        select: "-_id",
        populate: {
          path: "acceptedBy",
          select: "-_id name"
        }
      })
      .populate({
        path: "dogGroup",
        select: "-_id dogs groupName",
        populate: {
          path: "dogs",
          select: "-_id dogName"
        }
      });
    res.status(200).json({ status: "SUCCESS", data: allUserCreatedRequests });
  } catch (err) {
    next(err);
  }
}

export const getAllUserAcceptedFeedingRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if(!req.user) {
      res.status(400).json({status: "FAILURE", message: "User auth error!", options: {forceLogout: true}})
      return;
    }
    const allUserAcceptedRequests = 
    await FeedingRequest.find({ $and: [{"requestStatus.status": EFeedingRequestStatus.ACCEPTED}, {"requestStatus.acceptedBy": req.user._id}]})
    .populate({
      path: "createdBy",
      select: "-_id name"
    })
    .populate({
      path: "dogGroup",
      select: "-_id dogs groupName",
      populate: {
        path: "dogs",
        select: "-_id dogName"
      }
    });
    res.status(200).json({ status: "SUCCESS", data: allUserAcceptedRequests });
  } catch (err) {
    next(err);
  }
}