import { requireAuth } from "@clerk/express";
import express from "express";
import { getAllUsers, getCurrentUser } from "../controllers/userController.js";
import { authenticateAdmin } from "../middlewares/authenticateAdmin.js";

const router = express.Router();

router.get("/current-user", getCurrentUser);
router.get("/getAllUsers", authenticateAdmin, getAllUsers);
export default router;
