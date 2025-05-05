import connectDB from "../connectDB.js";
import {
  clerkClient,
  clerkMiddleware,
  getAuth,
  requireAuth,
} from "@clerk/express";
import { User } from "../models/User.js";

export const getCurrentUser = async (req, res) => {
  try {
    await connectDB();

    const userId = req.auth.userId;
    console.log("USer id from usercontroller is", userId);
    const user = await User.findOne({ clerkUserId: userId });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User was not found", data: null });
    }
    // const user = await clerkClient.users.getUser(userId);

    return res.json({ message: "User successfully fetched", data: user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        message: "Internal Error while fetching current user",
        data: null,
      });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    await connectDB();

    const users = await User.find();

    if (users.length === 0) {
      return res.status(404).json({ message: "No users were found!" });
    }

    return res
      .status(200)
      .json({ message: "Users were fetched successfully", users });
  } catch (error) {
    console.error("Error while fetching users:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error while fetching users" });
  }
};
