import mongoose, { Schema } from "mongoose";

interface IFeedingRequest {
  createdBy: mongoose.Schema.Types.ObjectId,
  community: mongoose.Schema.Types.ObjectId;
  dogGroup: mongoose.Schema.Types.ObjectId;
  fromDate: Date;
  toDate: Date;
  message?: String;
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
    message: {
      type: String,
    }
  },
  { timestamps: true }
)

const FeedingRequest = mongoose.model<IFeedingRequest>("FeedingRequest", FeedingRequestSchema);

export default FeedingRequest;