import express from "express";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Service from "../models/Service.js";

const router = express.Router();

// 🔹 ADD order
router.post("/", async (req, res) => {
  const { key, action, service, link, quantity, order } = req.body;

  const user = await User.findOne({ api_key: key });
  if (!user) return res.status(401).json({ error: "API Key inválida" });

  if (action === "balance") {
    return res.json({ balance: user.balance });
  }

  if (action === "add") {
    const svc = await Service.findById(service);
    if (!svc) return res.json({ error: "Serviço inválido" });

    const cost = (svc.rate / 1000) * quantity;
    if (user.balance < cost) return res.json({ error: "Saldo insuficiente" });

    user.balance -= cost;
    await user.save();

    const newOrder = await Order.create({
      user_id: user._id,
      service_id: svc._id,
      link,
      quantity,
      remains: quantity,
      status: "pending",
    });

    return res.json({ order: newOrder._id });
  }

  if (action === "status") {
    const ord = await Order.findById(order);
    if (!ord) return res.json({ error: "Pedido não encontrado" });
    return res.json({
      order: ord._id,
      status: ord.status,
      remains: ord.remains,
    });
  }

  return res.json({ error: "Ação inválida" });
});

export default router;
