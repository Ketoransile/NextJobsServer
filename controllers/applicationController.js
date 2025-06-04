import connectDB from "../connectDB.js";
import { v2 as cloudinary } from "cloudinary";
import { fileURLToPath } from "url";
import path from "path";
import { Application } from "../models/Application.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from "dotenv";
import { User } from "../models/User.js";
import { Job } from "../models/Job.js";
import streamifier from "streamifier";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const checkApplicationStatus = async (req, res) => {
  await connectDB();

  const userId = req.auth.userId;

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  // Find the user by their clerkUserId
  const mongoUser = await User.findOne({ clerkUserId: userId });
  if (!mongoUser) {
    return res.status(401).json({
      message: "No user found in the database",
    });
  }

  // Check if the user has applied for the job
  const isApplied = await Application.findOne({
    userId: mongoUser._id, // Use _id for MongoDB queries
    jobId: req.params.jobId,
  });

  // Return whether the user has applied or not
  return res.status(200).json({ hasApplied: Boolean(isApplied) });
};

// export const uploadResume = async (req, res) => {
//   await connectDB();

//   console.log("File uploaded:", req.file);

//   if (!req.file) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }
//   if (
//     !process.env.CLOUDINARY_NAME ||
//     !process.env.CLOUDINARY_API_KEY ||
//     !process.env.CLOUDINARY_API_SECRET
//   ) {
//     return res
//       .status(400)
//       .json({ message: "Cloudinary credentials were not found" });
//   }
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//   });
//   try {
//     const jobId = req.body.jobId;

//     const job = await Job.findById(jobId);
//     if (!job) {
//       return res
//         .status(404)
//         .json({ message: "No such job was found in the database" });
//     }
//     const companyId = job.companyId;
//     const portfolio = req.body.portfolio;
//     const coverLetter = req.body.coverLetter;
//     const resume = req.file;
//     const resumePath = path.join(__dirname, "..", resume.path);

//     const userId = req.auth.userId;

//     if (!userId) {
//       return res.status(401).json({ error: "User not authenticated" });
//     }
//     const mongoUser = await User.findOne({ clerkUserId: userId });
//     if (!mongoUser) {
//       return res.status(401).json({
//         message: "no user was found in the database",
//       });
//     }
//     if (!resume) {
//       return res.status(404).json({ message: "Resume not found" });
//     }

//     const result = await cloudinary.uploader.upload(resumePath, {
//       folder: "nextjobs-resumes",
//       resource_type: "auto",
//     });

//     const newApplication = new Application({
//       userId: mongoUser._id,
//       jobId,
//       companyId,
//       portfolio,
//       coverLetter,
//       resumeUrl: result.secure_url,
//     });
//     const existingApplication = await Application.findOne({
//       jobId,
//       userId: mongoUser._id,
//     });
//     if (existingApplication) {
//       return res.status(400).json({ message: "You have already applied!!" });
//     }
//     await newApplication.save();
//     return res.status(201).json({
//       message: "Application submitted successfully!!",
//       application: newApplication,
//     });
//   } catch (error) {
//     console.log("error uploading to cloudinary", error);
//     return res.status(500).json({ message: "Uploading resume failed" });
//   }
// };
export const uploadResume = async (req, res) => {
  await connectDB();

  console.log("File uploaded:", req.file);

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  if (
    !process.env.CLOUDINARY_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return res
      .status(400)
      .json({ message: "Cloudinary credentials were not found" });
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const jobId = req.body.jobId;

    const job = await Job.findById(jobId);
    if (!job) {
      return res
        .status(404)
        .json({ message: "No such job was found in the database" });
    }

    const companyId = job.companyId;
    const portfolio = req.body.portfolio;
    const coverLetter = req.body.coverLetter;
    const resume = req.file;

    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const mongoUser = await User.findOne({ clerkUserId: userId });
    if (!mongoUser) {
      return res
        .status(401)
        .json({ message: "No user was found in the database" });
    }

    const existingApplication = await Application.findOne({
      jobId,
      userId: mongoUser._id,
    });
    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied!!" });
    }

    // Upload buffer to Cloudinary using stream
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "nextjobs-resumes",
            resource_type: "auto",
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(resume.buffer);

    const newApplication = new Application({
      userId: mongoUser._id,
      jobId,
      companyId,
      portfolio,
      coverLetter,
      resumeUrl: result.secure_url,
    });

    await newApplication.save();

    return res.status(201).json({
      message: "Application submitted successfully!!",
      application: newApplication,
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return res.status(500).json({ message: "Uploading resume failed" });
  }
};
export const myApplications = async (req, res) => {
  try {
    await connectDB();
    const userId = req.auth.userId;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Find the user by their clerkUserId
    const mongoUser = await User.findOne({ clerkUserId: userId });
    if (!mongoUser) {
      return res.status(401).json({
        message: "No user found in the database",
      });
    }

    const applications = await Application.find({
      userId: mongoUser._id,
    })
      .populate("jobId")
      .populate("companyId");
    if (!applications || applications.length === 0) {
      return res
        .status(404)
        .json({ message: "No applications found for this user" });
    }
    return res.status(200).json({
      message: "Applications are fetched successfully",
      data: applications,
    });
  } catch (error) {
    console.error("Error while fetchng applications", error);
    return res
      .status(500)
      .json({ message: "Internal Error while fetching user applications" });
  }
};
