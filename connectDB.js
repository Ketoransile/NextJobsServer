import dotenv from "dotenv";

import mongoose from "mongoose";

dotenv.config();
const connectDB = async () => {
  try {
    console.log(process.env.MONGODB_URL);
    console.log(process.env.PORT);
    console.log(process.env.NAME);

    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected successfully!!👌 ");
  } catch (error) {
    console.log("Database connection Failed ❌");
    process.exit(1);
  }
};
export default connectDB;
