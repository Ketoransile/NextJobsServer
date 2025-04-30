import express from "express";

import {
  checkApplicationStatus,
  myApplications,
  uploadResume,
} from "../controllers/applicationController.js";
import multer from "multer";
const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("resume"), uploadResume);
router.get("/check-application/:jobId", checkApplicationStatus);
router.get("/my-applications", myApplications);

export default router;
