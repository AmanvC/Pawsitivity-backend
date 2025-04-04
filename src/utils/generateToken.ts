import jwt from "jsonwebtoken";

interface IUserToken {
  id: string;
  name: string;
  email: string;
}

const generateToken = (data: IUserToken): string => {
  return jwt.sign({ data }, process.env.JWT_SECRET as string, {
    expiresIn: "15d",
  });
};

export default generateToken;
