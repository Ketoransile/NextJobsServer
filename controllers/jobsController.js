import connectDB from "../connectDB.js";
import { Job } from "../models/Job.js";
export const getAllJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 0;
    const search = req.query.search || "";
    const location = req.query.location || "";

    await connectDB();
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        {
          description: { $regex: search, $options: "i" },
        },
      ];
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    console.log("Query object is", query);
    const jobs = await Job.find(query)
      .populate("companyId", "name iconUrl website description")
      .skip(page * limit)
      .limit(limit);
    // if (!jobs || jobs === null || jobs.length === 0) {
    // The same as above but concise way
    if (!jobs?.length) {
      return res.status(404).json({ message: "No jobs  found!!" });
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
