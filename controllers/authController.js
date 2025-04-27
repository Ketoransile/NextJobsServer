// import { verifyWebhook } from "@clerk/express/webhooks";
// import { User } from "../models/User.js";
// import connectDB from "../connectDB.js";
// import { Webhook } from "svix";
// export const createUser = async (req, res) => {
//   try {
//     const whook = new Webhook(process.env.CLERK_WEBHOOK_SIGNING_SECRET);

import { Webhook } from "svix";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
//     await whook.verify(JSON.stringify(req.body), {
//       "svix-id": req.headers["svix-id"],
//       "svix-timestamp": req.headers["svix-timestamp"],
//       "svix-signature": req.headers["svix-signature"],
//     });
//     // Getting data from request body
//     const { data, type } = req.body;

//     // const evt = await verifyWebhook(req);

//     // Do something with payload
//     // For this guide, log payload to console
//     // const { id } = evt.data;
//     // const eventType = evt.type;
//     await connectDB();
//     switch (type) {
//       // case "user.created":
//       //   const clerkUser = evt.data;
//       //   const newUser = new User({
//       //     clerkUserId: clerkUser.username || clerkUser.first_name,
//       //     email: clerkUser.email_addresses[0].email_address,
//       //     profilePicture: clerkUser.profile_image_url,
//       //   });
//       //   await newUser.save();
//       //   break;

//       // case "user.deleted":
//       //   await User.findOneAndDelete({
//       //     email: evt.data.email_addresses[0].email_address,
//       //   });
//       //   break;
//       case "user.created": {
//         const userData = {
//           clerkUserId: data.id,
//           email: data.email_addresses[0].email_address,
//           profilePicture: data.image_url,
//         };
//         await User.create(userData);
//         res.json({});
//         break;
//       }
//       case "user.updated": {
//         const userData = {
//           email: data.email_addresses[0].email_address,
//           profilePicture: data.image_url,
//         };
//         await User.findByIdAndUpdate(data.id, userData);
//         res.json({});
//         break;
//       }
//       case "user.deleted": {
//         await User.findByIdAndDelete(data.id);
//         res.json({});
//         break;
//       }
//       default: {
//         break;
//       }
//     }

//     // res.status(200).send("Webhook processed");
//   } catch (err) {
//     console.log("Error verifying webhook:", err);
//     return res.status(400).send("Error verifying webhook");
//   }
// };
export const createUser = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SIGNING_SECRET);

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    await connectDB();

    switch (type) {
      case "user.created": {
        const userData = {
          clerkUserId: data.id,
          email: data.email_addresses[0].email_address,
          profilePicture: data.image_url,
        };
        await User.create(userData);
        res.status(200).json({ message: "User created" });
        break;
      }
      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          profilePicture: data.image_url,
        };
        await User.findOneAndUpdate({ clerkUserId: data.id }, userData);
        res.status(200).json({ message: "User updated" });
        break;
      }
      case "user.deleted": {
        await User.findOneAndDelete({ clerkUserId: data.id });
        res.status(200).json({ message: "User deleted" });
        break;
      }
      default: {
        res.status(200).json({ message: "No action for this event" });
        break;
      }
    }
  } catch (err) {
    console.log("Error verifying webhook:", err);
    return res.status(400).send("Error verifying webhook");
  }
};
