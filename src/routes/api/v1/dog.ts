import express from "express";
import { verifyToken } from "../../../middlewares/authMiddleware";
import { createDog } from "../../../controllers/dogController";
import upload from "../../../configs/multerConfig";

const dogRouter = express.Router();

dogRouter.post("/create", upload.single("image"), createDog);

export default dogRouter;