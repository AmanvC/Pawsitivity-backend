import mongoose, { Document, Schema, Types } from "mongoose";

export interface IDog extends Document {
  createdBy: Types.ObjectId;
  lastUpdatedBy: Types.ObjectId;
  community: Types.ObjectId;
  dogGroup: Types.ObjectId;
  dogName: string;
  dob?: Date;
  abcStatus: boolean;
  vaccinationStatus: boolean;
  image: string;
  vaccinationDetails: Types.ObjectId[]
}

export const DogSchema = new Schema<IDog>(
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
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: true
    },
    dogGroup: {
      type: Schema.Types.ObjectId,
      ref: "DogGroup",
      required: true
    },
    dogName: {
      type: String,
      required: true
    },
    dob: {
      type: Date
    },
    abcStatus: {
      type: Boolean,
      required: true
    },
    vaccinationStatus: {
      type: Boolean,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    vaccinationDetails: [{
      type: Schema.Types.ObjectId,
      ref: "Vaccination",
      required: true
    }]
  },
  { timestamps: true }
);

const Dog = mongoose.model<IDog>("Dog", DogSchema);

export default Dog;