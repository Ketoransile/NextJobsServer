import {
  clerkClient,
  clerkMiddleware,
  getAuth,
  requireAuth,
} from "@clerk/express";
import express from "express";
import { createUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/webhooks", express.raw({ type: "application/json" }), createUser);
export default router;
