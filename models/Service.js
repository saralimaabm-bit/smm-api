import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rate: { type: Number, required: true },
  type: { type: String, required: true }, // ex: follow, like
});

export default mongoose.model("Service", ServiceSchema);
