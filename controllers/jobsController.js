import connectDB from "../connectDB.js";
import { Company } from "../models/Company.js";
import { Job } from "../models/Job.js";
import { User } from "../models/User.js";
export const getSingleJob = async (req, res) => {
  try {
    const { jobId } = await req.params;

    if (!jobId) {
      return res
        .status(400)
        .json({ message: "No job id was passed", job: null });
    }
    console.log("JOb id received in backend is ", jobId);
    await connectDB();
    const jobData = await Job.findById(jobId).populate("companyId");

    if (!jobData) {
      return res
        .status(404)
        .json({ message: "No job found with this id", job: null });
    }

    return res
      .status(200)
      .json({ message: "Job was successfully fetched", job: jobData || null });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error while fetching a job",
      job: null,
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 0;
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
    // if (!jobs?.length) {
    if (!jobs?.length) {
      return res.status(404).json({ message: "No jobs  found!!" });
    }
    res.setHeader("Cache-Control", "no-store, max-age=0");
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

export const createJob = async (req, res) => {
  try {
    await connectDB();

    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Find the user by Clerk ID
    const mongoUser = await User.findOne({ clerkUserId: userId });
    if (!mongoUser) {
      return res.status(401).json({ message: "No user found in the database" });
    }
    const companyId = mongoUser.company;
    if (!companyId) {
      return res
        .status(400)
        .json({ message: "Only recruiters can post a job" });
    }
    const {
      title,
      description,
      responsibilities = "",
      skills = "",
      location,
      level,
      ctc,
      category,
      applyLabel = "Apply now",
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !responsibilities ||
      !skills ||
      !location ||
      !level ||
      !ctc ||
      !category ||
      !companyId
    ) {
      return res.status(400).json({
        message:
          "Invalid request, please fill in the required fields properly.",
      });
    }

    const newJob = new Job({
      title,
      description,
      responsibilities,
      skills,
      location,
      level,
      ctc,
      category,
      companyId,
      postedBy: mongoUser._id,
      applyLabel,
    });

    const response = await Job.create(newJob);

    return res.status(200).json({
      message: "Job successfully created",
      data: response,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    return res.status(500).json({
      message: "Internal Server Error while creating new Job",
    });
  }
};
