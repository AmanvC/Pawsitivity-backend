import { createCommunity } from "../../../controllers/communityController";
import express from "express";
import { verifyToken } from "../../../middlewares/authMiddleware";

const communityRouter = express.Router();

communityRouter.post("/create", createCommunity);
// communityRouter.post("/add-groups", verifyToken, addDogGroupsToCommunity);

export default communityRouter;