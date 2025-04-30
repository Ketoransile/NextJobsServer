import mongoose from "mongoose";
import { Job } from "./Job.js";
import { Company } from "./Company.js";

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required to apply"],
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    portfolio: {
      type: String,
    },
    coverLetter: {
      type: String,
      required: [true, "Cover letter is required"],
    },
    status: {
      type: String,
      enum: ["accepted", "rejected", "pending"],
      default: "pending",
    },
    resumeUrl: {
      type: String,
      required: [true, "Resume is required for application"],
    },
  },
  { timestamps: true }
);
export const Application =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);
