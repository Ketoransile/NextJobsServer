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
    console.log("User id from usercontroller is", userId);

    let user = await User.findOne({ clerkUserId: userId });

    // Lazy sync: If user authenticates but isn't in DB (e.g. dev environment without webhooks)
    if (!user) {
      console.log("User not found in DB, attempting lazy sync from Clerk...");
      try {
        const clerkUser = await clerkClient.users.getUser(userId);
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        if (!email) throw new Error("No email found for user");

        user = await User.create({
          clerkUserId: userId,
          username: clerkUser.firstName || email.split("@")[0],
          email: email,
          profilePicture: clerkUser.imageUrl,
          role: clerkUser.publicMetadata?.role || "user",
        });
        console.log("Lazy sync successful: User created in DB.");
      } catch (clerkError) {
        console.error("Failed to fetch/create user from Clerk:", clerkError);
        // Fallback: Return 404 if we really can't create them
        return res.status(404).json({ message: "User not found in DB and sync failed" });
      }
    }

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
