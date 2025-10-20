import mongoose from "mongoose";
import dotenv from "dotenv";
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


    console.log("Data Imported!");
    return { success: true, message: "Data imported successfully" };
  } catch (error) {
    console.error(`Error: ${error}`);
    throw error;
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Location.deleteMany();


    console.log("Data Destroyed!");
    return { success: true, message: "Data destroyed successfully" };
  } catch (error) {
    console.error(`Error: ${error}`);
    throw error;
  }
};

// Only run if this file is executed directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv[2] === "-d") {
    destroyData().then(() => {
      console.log("Seeder completed");
    }).catch(() => {
      console.log("Seeder failed");
    });
  } else {
    importData().then(() => {
      console.log("Seeder completed");
    }).catch(() => {
      console.log("Seeder failed");
    });
  }
}

export { importData, destroyData };
