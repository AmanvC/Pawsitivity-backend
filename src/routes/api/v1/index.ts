import express from "express";
import authRouter from "./auth";
import communityRouter from "./community";
import dogGroupRouter from "./dogGroup";
import dogRouter from "./dog";
import { verifyToken } from "../../../middlewares/authMiddleware";
import commonRouter from "./common";
import feedingRequestRouter from "./feedingRequest";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/community", verifyToken, communityRouter);
router.use("/dogGroup", verifyToken, dogGroupRouter);
router.use("/dog", verifyToken, dogRouter);
router.use("/common", verifyToken, commonRouter);
router.use("/feedingRequest", verifyToken, feedingRequestRouter);

export default router;