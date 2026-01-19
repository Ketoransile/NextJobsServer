import { fileURLToPath } from "url";
import connectDB from "../connectDB.js";
import { Job } from "../models/Job.js";
import { jobListings } from "./jobsListing_updated.js";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function addJobs() {
  try {
    await connectDB();
    await Job.deleteMany({});
    console.log("All Previous Jobs Deleted");
    await Job.insertMany(jobListings);
    console.log("JObs are successfully inserted");
    process.exit();
  } catch (error) {
    console.error("Error while inserting jobs", error);
    process.exit(1);
  }
}
addJobs();
