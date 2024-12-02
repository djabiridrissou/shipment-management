import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async () => {
  const mongoURI = process.env.DB_URI || "";
  console.log("mongoURI", mongoURI);
  const serverSelectionTimeoutMS = 5000;
  const maxRetries = 3;
  for (let i = 1; i <= maxRetries; i++) {
    try {
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS,
      });
      console.info("Connected to Database");
      break;
    } catch (error) {
      console.log(error);
      console.error(
        `Failed to connect to MongoDB. Retrying: ${i} of ${maxRetries}`,
      );
      if (i === maxRetries) {
        console.error("Failed to connect to MongoDB", error);
        throw error;
      }
    }
  }
};