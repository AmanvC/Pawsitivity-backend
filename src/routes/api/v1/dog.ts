import express from "express";
import { verifyToken } from "../../../middlewares/authMiddleware";
import { createDog, getAllDogsForACommunity } from "../../../controllers/dogController";
import upload from "../../../configs/multerConfig";

const dogRouter = express.Router();

dogRouter.post("/create", upload.single("image"), createDog);
dogRouter.post("/getAll", getAllDogsForACommunity);

export default dogRouter;