import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import { users, locations } from "./data/users.js";;
import User from "./models/userModel.js";
import Location from "./models/locationModel.js";
import connectDB from "./config/db.js";

// mongodb+srv://admin:admin@cluster0.oseuj.mongodb.net/?retryWrites=true&w=majority

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Location.deleteMany();


    const createdUsers = await User.insertMany(users);
    const createdLocation = await Location.insertMany(locations);

    const adminUser = createdUsers[0]._id;


    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Location.deleteMany();


    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
