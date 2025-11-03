import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: String,
  rate: Number,
  type: String, // follow, like, comment...
});

export default mongoose.model("Service", serviceSchema);
