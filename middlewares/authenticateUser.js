import { getAuth } from "@clerk/express";

export const authenticateUser = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    console.log("auth", auth);

    if (!auth.userId || auth.userId === null) {
      return res.status(400).json({ message: "Please Login first" });
      // Proceed to the next middleware or route handler if the user is authenticated
    }
    return next();

    // If no userId, return a 400 response with a login prompt
  } catch (error) {
    // Handle any errors that may occur during the authentication process
    console.error("Authentication error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
