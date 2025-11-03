import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  service_id: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  link: String,
  quantity: Number,
  status: { type: String, default: "pending" },
  remains: Number,
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
