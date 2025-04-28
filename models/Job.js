import mongoose from "mongoose";
import { Company } from "./Company.js";
import { User } from "./User.js";
const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    responsibilities: {
      type: [String],
    },
    skills: {
      type: [String],
    },
    location: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    ctc: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "programming",
        "dataScience",
        "designing",
        "networking",
        "management",
        "marketing",
        "cybersecurity",
      ],
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applyLabel: {
      type: String,
      default: "Apply Now",
    },
  },
  { timestamps: true }
);

export const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);
