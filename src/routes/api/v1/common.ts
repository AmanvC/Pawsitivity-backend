
import { verifyToken } from "../../../middlewares/authMiddleware";
import { getAllCommunityDogGroupsAndDogInfo, saveExpoPushNotificationToken } from "../../../controllers/commonController";
import express from "express";

const commonRouter = express.Router();

commonRouter.post("/getAllInfo", verifyToken, getAllCommunityDogGroupsAndDogInfo);
commonRouter.post("/save/expoPushToken", saveExpoPushNotificationToken);

export default commonRouter;