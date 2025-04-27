import mongoose from "mongoose";

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
      required: true,
    },
    skills: {
      type: [String],
      required: true,
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
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // the recruiter who posted
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
