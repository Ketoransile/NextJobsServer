import express from "express";
import {
  createJob,
  getAllJobs,
  getSingleJob,
} from "../controllers/jobsController.js";
import { clerkMiddleware, getAuth, requireAuth } from "@clerk/express";

const router = express.Router();

router.get("/getAllJobs", getAllJobs);
router.get("/getSingleJob/:jobId", getSingleJob);
router.post("/postJob", requireAuth(), createJob);
export default router;
