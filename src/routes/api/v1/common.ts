
import { getAllCommunityDogGroupsAndDogInfo, saveExpoPushNotificationToken } from "../../../controllers/commonController";
import express from "express";

const commonRouter = express.Router();

commonRouter.post("/getAllInfo", getAllCommunityDogGroupsAndDogInfo);
commonRouter.post("/save/expoPushToken", saveExpoPushNotificationToken);

export default commonRouter;