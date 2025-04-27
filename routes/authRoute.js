import {
  clerkClient,
  clerkMiddleware,
  getAuth,
  requireAuth,
} from "@clerk/express";
import express from "express";
import { createUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/webhooks", createUser);
export default router;
