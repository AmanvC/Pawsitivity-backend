import express from "express";
import { verifyToken } from "../../../middlewares/authMiddleware";
import { createDogGroup } from "../../../controllers/dogGroupController";

const dogGroupRouter = express.Router();

dogGroupRouter.post("/create", createDogGroup);
// dogGroupRouter.post("/add-dogs", verifyToken, addDogGroupsToCommunity);

export default dogGroupRouter;