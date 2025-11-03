import mongoose from "mongoose";
import Task from "./models/Task.js";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const tasks = await Task.find();
  console.log(tasks);
  await mongoose.disconnect();
}

main();
