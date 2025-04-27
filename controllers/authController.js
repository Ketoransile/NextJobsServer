import { Webhook } from "svix";
import { User } from "../models/User.js";
import connectDB from "../connectDB.js";
import path from "path";
import { fileURLToPath } from "url";

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env (in case it's not already loaded)
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const createUser = async (req, res) => {
  console.log("🌟 Webhook Hit! Checking Headers and Body...");

  try {
    const { headers, body } = req;

    console.log("👉 Headers received:", JSON.stringify(headers, null, 2));
    console.log("👉 Body received:", JSON.stringify(body, null, 2));

    // 1. Create Webhook instance
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SIGNING_SECRET);
    console.log("🔐 Verifying webhook...");

    // 2. Verify Signature
    await whook.verify(JSON.stringify(body), {
      "svix-id": headers["svix-id"],
      "svix-timestamp": headers["svix-timestamp"],
      "svix-signature": headers["svix-signature"],
    });

    console.log("✅ Webhook verified successfully!");

    const { data, type } = body;

    console.log(`📦 Event type: ${type}`);
    console.log(`📦 Event data:`, JSON.stringify(data, null, 2));

    // 3. Connect to MongoDB
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // 4. Process Event Type
    switch (type) {
      case "user.created": {
        console.log("🆕 Creating new user...");
        const userData = {
          clerkUserId: data.id,
          email: data.email_addresses[0].email_address,
          profilePicture: data.image_url,
        };
        await User.create(userData);
        console.log("✅ User created in DB!");
        res.status(200).json({ message: "User created" });
        break;
      }
      case "user.updated": {
        console.log("✏️ Updating user...");
        const userData = {
          email: data.email_addresses[0].email_address,
          profilePicture: data.image_url,
        };
        await User.findOneAndUpdate({ clerkUserId: data.id }, userData);
        console.log("✅ User updated!");
        res.status(200).json({ message: "User updated" });
        break;
      }
      case "user.deleted": {
        console.log("🗑️ Deleting user...");
        await User.findOneAndDelete({ clerkUserId: data.id });
        console.log("✅ User deleted!");
        res.status(200).json({ message: "User deleted" });
        break;
      }
      default: {
        console.log(`⚠️ No action for event type: ${type}`);
        res.status(200).json({ message: "No action for this event" });
        break;
      }
    }
  } catch (err) {
    console.error("🚨 ERROR in webhook handler:", err);
    return res.status(400).send("Error verifying webhook");
  }
};
