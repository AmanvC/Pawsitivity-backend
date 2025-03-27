import mongoose, { Schema } from "mongoose";

interface IVaccinationDetail {
  vaccinationName: string;
  veterinaryName?: string;
  vaccinationDate?: Date;
}

export interface IDog {
  createdBy: mongoose.Schema.Types.ObjectId;
  lastUpdatedBy: mongoose.Schema.Types.ObjectId;
  community: mongoose.Schema.Types.ObjectId;
  dogGroup: mongoose.Schema.Types.ObjectId;
  dogName: string;
  dob?: Date;
  abcStatus: boolean;
  vaccinationStatus: boolean;
  image: string;
  vaccinationDetails: IVaccinationDetail[]
}

const VaccinationDetailSchema: Schema<IVaccinationDetail> = new mongoose.Schema({
  vaccinationName: { type: String, required: true },
  veterinaryName: { type: String },
  vaccinationDate: { type: Date }
});

export const DogSchema: Schema<IDog> = new mongoose.Schema(
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
    dogGroup: {
      type: mongoose.Schema.Types.ObjectId,
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
    vaccinationDetails: [VaccinationDetailSchema]
  },
  { timestamps: true }
);

const Dog = mongoose.model<IDog>("Dog", DogSchema);

export default Dog;