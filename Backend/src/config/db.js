import mongoose from "mongoose";
// Reuse Mongoose's existing connection when a serverless function stays warm.
const connectdb = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    try {
        const connectionString = `${process.env.MONGODB_URL}/${process.env.dbname}`;
        const connectioninstance = await mongoose.connect(connectionString);
        console.log("MongoDB connected successfully");
        return connectioninstance;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};
export default connectdb;
