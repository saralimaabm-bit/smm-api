import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  api_key: String,
  balance: { type: Number, default: 0 },
  role: { type: String, enum: ["revendedor", "executor"], default: "revendedor" },
});

export default mongoose.model("User", userSchema);