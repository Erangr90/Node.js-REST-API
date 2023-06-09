import mongoose from "mongoose";
import colors from "colors";
import redisClient from "./redis.js";

const connectDB = async () => {
  try {
    
    const uri = process.env.MONGO_URI

    const conn = await mongoose.connect(uri, {
      dbName: process.env.DB_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // auth: {
      //   user: process.env.MONGO_INITDB_ROOT_USERNAME,
      //   password: process.env.MONGO_INITDB_ROOT_PASSWORD
      // },
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);

    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};


export default connectDB;

