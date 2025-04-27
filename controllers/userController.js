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

    const user = await clerkClient.users.getUser(userId);

    return res.json({ user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Error while fetching current user" });
  }
};
