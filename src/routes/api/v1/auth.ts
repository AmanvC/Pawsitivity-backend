import express from "express";
import { forceLogin, loginUser, logoutAllDevices, logoutUser, registerUser } from "../../../controllers/authController";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/force-login", forceLogin);
authRouter.post("/logout", logoutUser);
authRouter.post("/logout-all", logoutAllDevices);

export default authRouter;