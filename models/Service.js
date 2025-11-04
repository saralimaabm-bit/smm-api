import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // ← ID numérico
  name: { type: String, required: true },
  rate: { type: Number, required: true },
  type: { type: String, required: true },
});

export default mongoose.model("Service", ServiceSchema);
