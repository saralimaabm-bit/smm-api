import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  api_key: { type: String, required: true, unique: true },
});

export default mongoose.model("User", UserSchema);