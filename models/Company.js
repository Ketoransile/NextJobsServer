import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      unique: true,
    },
    iconUrl: {
      type: String, // URL to company logo
    },
    description: {
      type: String,
    },
    website: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Company =
  mongoose.models.Company || mongoose.model("Company", companySchema);
