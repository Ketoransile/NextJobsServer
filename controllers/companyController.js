import connectDB from "../connectDB.js";
import { Company } from "../models/Company.js";

import { User } from "../models/User.js";

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

export const createCompany = async (req, res) => {
  try {
    await connectDB();
    const { name, description, website, iconUrl, location } = req.body;
    const userId = req.auth.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!name) {
      return res.status(400).json({ message: "Company name is required" });
    }

    // Create the company
    const newCompany = await Company.create({
      name,
      description,
      website,
      iconUrl,
      location,
    });

    // Update the user: set role to 'recruiter' and link the company
    const updatedUser = await User.findOneAndUpdate(
      { clerkUserId: userId },
      {
        role: "recruiter",
        company: newCompany._id
      },
      { new: true }
    );

    return res.status(201).json({
      message: "Company created and user updated to recruiter successfully",
      company: newCompany,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error creating company:", error);
    return res
      .status(500)
      .json({ message: "Internal server error while creating company" });
  }
};
