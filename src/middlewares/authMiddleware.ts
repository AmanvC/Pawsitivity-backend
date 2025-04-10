import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ status: "FAILURE", message: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = 
      await User.findById(decoded.data.id).select("-password")
      .populate({
        path: "joinedCommunities",
        select: "communityName dogGroups",
        populate: {
          path: "dogGroups",
          select: "groupName dogs",
          populate: {
            path: "dogs",
            select: "dogName"
          }
        }
      })
    if(!user) {
      res.status(404).json({ status: "FAILURE", message: "User not found" });
      return;
    }

    const isValidSession = user.sessions.filter(session => session.token === token);
    if(!isValidSession.length) {
      res.status(401).json({ status: "FAILURE", message: "Token expired", options: { logoutUser: true } });
      return;
    }
    req.user = user;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      const decoded = jwt.decode(token) as JwtPayload;
      await User.updateOne(
        { _id: decoded.data.id },
        { $pull: { sessions: { token: token } } } // Remove expired token from session list
      );
    }
    res.status(401).json({ status: "FAILURE", message: "Token expired", options: { logoutUser: true } });
  }
};
