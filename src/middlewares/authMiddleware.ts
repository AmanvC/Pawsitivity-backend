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

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {

      await User.updateOne(
        { _id: decoded.id },
        { $pull: { sessions: { token: token } } } // Remove expired token from session list
      );

      res.status(401).json({ status: "FAILURE", message: "Token expired", options: { logoutUser: true } });
      return;
    }
    const user = await User.findById(decoded.id).select("-password");
    if(!user) {
      res.status(404).json({ status: "FAILURE", message: "User not found" });
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ status: "FAILURE", message: "Invalid token" });
  }
};
