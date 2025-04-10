import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";

export interface IUserToken {
  id: ObjectId;
  name: string;
  email: string;
  joinedCommunities: { _id: ObjectId, communityName: string }[]
}

const generateToken = (data: IUserToken): string => {
  return jwt.sign({ data }, process.env.JWT_SECRET as string, {
    expiresIn: "15d",
  });
};

export default generateToken;
