import mongoose from "mongoose";

export const ConnectToDb = async () => {
  const mongoURL = process.env.MONGO_URL;

  try {
    if (!mongoURL) {
      throw new Error("MONGO_URL is not defined in environment variables");
    }

    await mongoose.connect(mongoURL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
};
