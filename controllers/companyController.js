import connectDB from "../connectDB.js";
import { Company } from "../models/Company.js";

export const getAllCompanies = async (req, res) => {
  try {
    await connectDB();
    const companies = await Company.find({});

    return res.status(200).json(companies);
  } catch (error) {
    console.error("Error while fetching companies:", error);
    return res
      .status(500)
      .json({ message: "Internal server error while fetching companies." });
  }
};
