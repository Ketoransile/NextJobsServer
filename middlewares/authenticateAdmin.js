import connectDB from "../connectDB.js";
import { User } from "../models/User.js";

export const authenticateAdmin = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    console.log("userid is", userId);
    if (!userId) {
      return res.status(400).json({ message: "Not authenticated" });
    }
    await connectDB();
    const user = await User.findOne({ clerkUserId: userId });
    console.log("user from authenticate Admin is ", user);
    if (!user) {
      return res.status(200).json({
        message: `No user found with the id ${userId} in the database`,
      });
    }
    if (user.role !== "admin") {
      return res
        .status(400)
        .json({ message: "You are not allowed to access this route" });
    }
    next();
  } catch (error) {
    console.error("Error while authneticating admin", error);
    return res
      .status(500)
      .json({ message: "Internal server error while authenticating admin" });
  }
};
