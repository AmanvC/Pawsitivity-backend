
import { getAllCommunityDogGroupsAndDogInfo } from "../../../controllers/commonController";
import express from "express";

const commonRouter = express.Router();

commonRouter.post("/getAllInfo", getAllCommunityDogGroupsAndDogInfo);

export default commonRouter;