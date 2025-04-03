import express from "express";
import authRouter from "./auth";
import communityRouter from "./community";
import dogGroupRouter from "./dogGroup";
import dogRouter from "./dog";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/community", communityRouter);
router.use("/dogGroup", dogGroupRouter);
router.use("/dog", dogRouter);

export default router;