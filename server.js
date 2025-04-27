import dotenv from "dotenv";
dotenv.config();
import { clerkMiddleware, getAuth, requireAuth } from "@clerk/express";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoute.js";
import { authenticateUser } from "./middlewares/authenticateUser.js";
const app = express();

//
app.use(express.json());
app.use(clerkMiddleware());
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL
    credentials: true, // if you are using cookies or Authorization headers
  })
);

// Routes
app.use("/api/v1/users", requireAuth(), userRoutes);
// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/jobs", requireAuth(), jobRoutes);
// app.use("/api/v1/applications", requireAuth(), applicationRoutes);
// app.use("/api/v1/company", requireAuth(), companyRoutes);
console.log("process.env.PORT", process.env.PORT);
console.log("process.env.MONGODB_URL", process.env.MONGODB_URL);
app.get("/", (req, res) => {
  res.send("Hello world 🥳");
});
// app.get(
//   "/first/api",
//   requireAuth({ signInUrl: "/sign-in" }),
//   async (req, res) => {
//     const { userId } = getAuth(req);

//     // Use Clerk's JavaScript Backend SDK to get the user's User object
//     const user = await clerkClient.users.getUser(userId);
//     res.json({ message: "SUccessfully fetched from backend", user });
//   }
// );
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`App is running in on port ${PORT}`);
});
