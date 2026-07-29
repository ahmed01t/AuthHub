import React from "react";
import mongoose from "mongoose";
import express from "express";
// creating a database connection function
const connectdb=async()=>{
    try {
        const connectioninstance=await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.dbname}`)
        console.log("MongoDB connected successfully");

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;

    }
};
export default connectdb;