import connectDB from "../connectDB.js";
import { Job } from "../models/Job.js";
export const getAllJobs = async (req, res) => {
  try {
    await connectDB();
    const jobs = await Job.find().populate(
      "companyId",
      "name iconUrl website description"
    );
    if (!jobs || jobs === null || jobs.length === 0) {
      return res.status(404).json({ message: "No jobs were found!!" });
    }
    res
      .status(200)
      .json({ message: "Jobs are successfully fetched", data: jobs });
  } catch (error) {
    console.error("Error while fetching jobs", error);
    return res
      .status(500)
      .json({ message: "Internal Error while fetching jobs" });
  }
};
