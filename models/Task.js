import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  target: String,
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reward: Number,
  status: { type: String, default: "pending" },
});

export default mongoose.model("Task", taskSchema);
