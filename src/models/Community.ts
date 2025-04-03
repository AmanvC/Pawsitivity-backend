import mongoose, { Document, Types, Schema } from "mongoose";

interface ICommunity extends Document {
  createdBy: Types.ObjectId;
  lastUpdatedBy: Types.ObjectId;
  communityName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  // dogGroups: IDogGroup[];
  dogGroups: Types.ObjectId[];
}

const CommunitySchema = new Schema<ICommunity>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
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
    // dogGroups: [DogGroupSchema]
    dogGroups: [{
      type: Schema.Types.ObjectId,
      ref: "DogGroup",
      required: true
    }]
  },
  { timestamps: true }
)

const Community = mongoose.model<ICommunity>("Community", CommunitySchema);

export default Community;