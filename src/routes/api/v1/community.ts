import { createCommunity } from "../../../controllers/communityController";
import express from "express";

const communityRouter = express.Router();

communityRouter.post("/create", createCommunity);

export default communityRouter;