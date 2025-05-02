import dotenv from "dotenv";
dotenv.config();
import { clerkMiddleware, getAuth, requireAuth } from "@clerk/express";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoute.js";
import jobRoutes from "./routes/jobsRoute.js";
import userRoutes from "./routes/userRoute.js";
import applicationRoutes from "./routes/applicationRoute.js";
import companyRoutes from "./routes/companyRoute.js";
const allowedOrigins = [
  "http://localhost:3000",
  "https://job-portal-omega-flame.vercel.app",
];
const app = express();

//
app.use("/api/v1/auth", express.raw({ type: "application/json" }), authRoutes);
app.use(express.json());
app.use(clerkMiddleware());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Routes
app.use("/api/v1/users", requireAuth(), userRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/applications", requireAuth(), applicationRoutes);
app.use("/api/v1/companies", companyRoutes);
// app.use("/api/v1/auth", authRoutes);

console.log("process.env.PORT", process.env.PORT);
console.log("process.env.MONGODB_URL", process.env.MONGODB_URL);

// app.get("/", (req, res) => {
//   res.send("Hello world 🥳");
// });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`App is running in on port ${PORT}`);
});
