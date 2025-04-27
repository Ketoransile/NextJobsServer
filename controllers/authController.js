import { verifyWebhook } from "@clerk/express/webhooks";
import { User } from "../models/User.js";
import connectDB from "../connectDB.js";
export const createUser = async (req, res) => {
  try {
    const evt = await verifyWebhook(req);

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data;
    const eventType = evt.type;
    await connectDB();
    switch (eventType) {
      case "user.created":
        const clerkUser = evt.data;
        const newUser = new User({
          clerkUserId: clerkUser.username || clerkUser.first_name,
          email: clerkUser.email_addresses[0].email_address,
          profilePicture: clerkUser.profile_image_url,
        });
        await newUser.save();
        break;

      case "user.deleted":
        await User.findOneAndDelete({
          email: evt.data.email_addresses[0].email_address,
        });
        break;
    }

    res.status(200).send("Webhook processed");
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return res.status(400).send("Error verifying webhook");
  }
};
