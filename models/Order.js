import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  service_id: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  link: { type: String, required: true },
  quantity: { type: Number, required: true },
  remains: { type: Number, required: true },
  status: { type: String, default: "pending" }, // pending, completed, cancelled
  //created_at: { type: Date, default: Date.now },
  created_at: {
    type: String,
    default: () =>
      new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour12: false
      })
  }
});

export default mongoose.model("Order", OrderSchema);
