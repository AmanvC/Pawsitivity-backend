import mongoose, { Schema } from "mongoose";
import { DogSchema, IDog } from "./Dog";

interface IDogGroup {
  createdBy: mongoose.Schema.Types.ObjectId;
  lastUpdatedBy: mongoose.Schema.Types.ObjectId;
  community: mongoose.Schema.Types.ObjectId;
  groupName: string;
  // dogs: IDog[];
  dogs: mongoose.Schema.Types.ObjectId[];
}

const DogGroupSchema: Schema<IDogGroup> = new mongoose.Schema(
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
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true
    },
    groupName: {
      type: String,
      required: true
    },
    // dogs: [DogSchema]
    dogs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dog",
      required: true
    }]
  },
  { timestamps: true }
)

const DogGroup = mongoose.model<IDogGroup>("DogGroup", DogGroupSchema);

export default DogGroup;