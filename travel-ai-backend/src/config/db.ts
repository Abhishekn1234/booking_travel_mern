import mongoose from "mongoose";
import "./env.js";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

export default connectDB;
