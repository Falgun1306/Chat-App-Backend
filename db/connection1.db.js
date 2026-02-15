import mongoose from "mongoose";

// we use async cause may be it's take some time to connect with database
export const connectDB = async (req) => {
    try {
        const MONGODB_URL = process.env.MONGODB_URL;
        const instance = await mongoose.connect(MONGODB_URL);
        console.log(`MongoDB connected successfully`);
    } catch(error){
        console.log(error);
    }
}