import mongoose, { Schema } from "mongoose";

export enum EFeedingRequestStatus {
  ACCEPTED = "ACCEPTED",
  PENDING = "PENDING"
}

interface IFeedingRequest {
  createdBy: mongoose.Schema.Types.ObjectId,
  community: mongoose.Schema.Types.ObjectId;
  dogGroup: mongoose.Schema.Types.ObjectId;
  fromDate: Date;
  toDate: Date;
  message?: string;
  requestStatus: {
    status: EFeedingRequestStatus
    acceptedBy?: mongoose.Schema.Types.ObjectId,
    acceptedOn?: Date
  }
}

const FeedingRequestSchema: Schema<IFeedingRequest> = new mongoose.Schema(
  {
    createdBy: {
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
    fromDate: {
      type: Date,
      required: true
    },
    toDate: {
      type: Date,
      required: true
    },
    message: {
      type: String,
    },
    requestStatus: {
      status: {
        type: String,
        enum: Object.values(EFeedingRequestStatus), // ← this will ensure enum validation
        default: EFeedingRequestStatus.PENDING,
      },
      acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
      },
      acceptedOn: {
        type: Date
      }
    }
  },
  { timestamps: true }
)

const FeedingRequest = mongoose.model<IFeedingRequest>("FeedingRequest", FeedingRequestSchema);

export default FeedingRequest;