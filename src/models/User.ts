import mongoose, { Document, Schema, Types } from "mongoose";

interface ISession {
  token: string;
  device: string;
  loginTime: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  sessions: ISession[];
  joinedCommunities: Types.ObjectId[];
}

const SessionSchema = new Schema<ISession>(
  {
    token: {
      type: String,
      required: true
    },
    device: {
      type: String,
      required: true
    },
    loginTime: {
      type: Date,
      default: Date.now
    },
  }
);

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    sessions: [SessionSchema],
    joinedCommunities: [{
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: true
    }]
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;