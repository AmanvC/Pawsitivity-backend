import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import generateToken, { IUserToken } from "../utils/generateToken";
import Community from "../models/Community";
import { ObjectId, Types } from "mongoose";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ status: "FAILURE", message: "User already exists!" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      sessions: []
    })

    res.status(201).json({ status: "SUCCESS", message: "User registered successfully." });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email: reqEmail, password: reqPassword, device } = req.body;
    const user = await User.findOne({ email: reqEmail }).populate("joinedCommunities", "_id communityName");

    if (!user || !(await bcrypt.compare(reqPassword, user.password))) {
      res.status(400).json({ status: "FAILURE", message: "Invalid credentials!" });
      return;
    }

    if (user.sessions.length > 0) {
      res.status(200).json({
        status: "SUCCESS",
        message: "Already logged in elsewhere. Choose to continue here or logout previous device.",
        options: {
          continueHere: true,
          logoutPrevious: true,
        },
      });
      return;
    }

    const { name, email, _id, joinedCommunities } = user.toObject();
    const typedJoinedCommunities = joinedCommunities as unknown as IUserToken['joinedCommunities'];
    const typedObjectId = _id as IUserToken['id'];

    const token = generateToken({name, email, id: typedObjectId, joinedCommunities: typedJoinedCommunities});

    user.sessions.push({ token, device, loginTime: new Date() });
    await user.save();

    res.json({ status: "SUCCESS", token, message: "Logged in successfully" });
  } catch (error) {
    next(error);
  }
};

export const forceLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email: reqEmail, password, device } = req.body;
    const user = await User.findOne({ email: reqEmail }).populate("joinedCommunities", "_id communityName");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(400).json({ status: "FAILURE", message: "Invalid credentials" });
      return;
    }
    const { name, email, _id, joinedCommunities } = user.toObject();
    const typedJoinedCommunities = joinedCommunities as unknown as IUserToken['joinedCommunities'];
    const typedObjectId = _id as IUserToken['id'];

    const token = generateToken({name, email, id: typedObjectId, joinedCommunities: typedJoinedCommunities});
    user.sessions = [{ token, device, loginTime: new Date() }];
    await user.save();

    res.json({ status: "SUCCESS", token, message: "Logged in and previous session logged out" });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ "sessions.token": token });

    if (!user) {
      res.status(400).json({ status: 'FAILURE', message: "Invalid session" })
      return;
    };

    user.sessions = user.sessions.filter((session) => session.token !== token);
    await user.save();

    res.json({ status: 'SUCCESS', message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const logoutAllDevices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ status: "FAILURE", message: "User not found" });
      return;
    }
    user.sessions = [];
    await user.save();

    res.json({ status: "SUCCESS", message: "Logged out from all devices" });
  } catch (error) {
    next(error);
  }
};