import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: "User",
    required: [true, "User id is required to apply"],
  },
  resume: {
    type: String,
    required: [true, "Resume is required for application"],
  },
  company: {
    type: String,
    required: [true, "Company is required to apply"],
  },
  title: {
    type: String,
    required: [true, "Job title is required to apply"],
  },
  location: {
    type: String,
    required: [true, "Location is required to apply"],
  },
  date: {
    type: String,
    required: [true, "Date is required when applying"],
  },
  status: {
    type: String,
    enum: ["accepted", "rejected", "pending"],
    default: "pending",
  },
});
export const Application =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);
