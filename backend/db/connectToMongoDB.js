import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_DB_URI);
    console.log(`MongoDB Connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log(error?.message || "MongoDB Connection Failed!!!");
  }
};

export default connectToMongoDB;
