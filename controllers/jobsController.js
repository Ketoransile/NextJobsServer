import connectDB from "../connectDB.js";
import { Company } from "../models/Company.js";
import { Job } from "../models/Job.js";
export const getAllJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 4;
    const search = req.query.search || "";
    const location = req.query.location || "";
    const company = req.query.company || "";
    const category = req.query.category || "";

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
    let companyIds = null;

    if (company) {
      const companyFound = await Company.findOne({
        name: { $regex: company, $options: "i" },
      });

      if (!companyFound) {
        return res
          .status(404)
          .json({ message: "No jobs found for this company" });
      }

      query.companyId = companyFound._id;
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }
    console.log("Query object is", query);
    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limit);
    console.log("Total jobs are ", totalJobs);
    console.log("Total pages are ", totalPages);
    const jobs = await Job.find(query)
      .populate("companyId", "name iconUrl website description")
      .skip(page * limit)
      .limit(limit);
    // if (!jobs || jobs === null || jobs.length === 0) {
    // The same as above but concise way
    if (!jobs?.length) {
      return res.status(404).json({ message: "No jobs  found!!" });
    }
    res.status(200).json({
      message: "Jobs are successfully fetched",
      data: jobs,
      totalPages,
    });
  } catch (error) {
    console.error("Error while fetching jobs", error);
    return res
      .status(500)
      .json({ message: "Internal Error while fetching jobs" });
  }
};
