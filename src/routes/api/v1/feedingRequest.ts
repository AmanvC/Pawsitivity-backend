import {
  acceptPendingFeedingRequest,
  createFeedingRequest,
  getAllPendingFeedingRequests,
  getAllUserAcceptedFeedingRequests,
  getAllUserCreatedFeedingRequests
} from "../../../controllers/feedingRequestController";
import express from "express";

const feedingRequestRouter = express.Router();

feedingRequestRouter.post("/create", createFeedingRequest);
feedingRequestRouter.post("/get/pending", getAllPendingFeedingRequests);
feedingRequestRouter.patch("/accept", acceptPendingFeedingRequest);
feedingRequestRouter.get("/get/userCreated", getAllUserCreatedFeedingRequests);
feedingRequestRouter.get("/get/userAccepted", getAllUserAcceptedFeedingRequests);

export default feedingRequestRouter;