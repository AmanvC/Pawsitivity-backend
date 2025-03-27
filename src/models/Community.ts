import mongoose, { Schema } from "mongoose";
import { DogSchema, IDog } from "./Dog";
import { DogGroupSchema, IDogGroup } from "./DogGroup";

interface ICommunity {
  createdBy: mongoose.Schema.Types.ObjectId;
  lastUpdatedBy: mongoose.Schema.Types.ObjectId;
  communityName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  dogGroups: IDogGroup[];
}

const CommunitySchema: Schema<ICommunity> = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    communityName: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    dogGroups: [DogGroupSchema]
  },
  { timestamps: true }
)

const Community = mongoose.model<ICommunity>("Community", CommunitySchema);

export default Community;