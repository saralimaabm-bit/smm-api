import express from "express";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Service from "../models/Service.js";

const router = express.Router();

// 🔹 Endpoint principal
router.get("/", async (req, res) => {
  const { action } = req.query;

  try {
    // Listar serviços
    if (action === "services") {
      const services = await Service.find();

      const formatted = services.map((s, i) => ({
        id: i + 1,
        name: s.name,
        rate: s.rate,
        type: s.type,
      }));

      return res.json(formatted);
    }

    return res.json({ error: "Ação inválida" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro no servidor" });
  }
});

// 🔹 Endpoint de ações via POST
router.post("/", async (req, res) => {
  const { key, action, service, link, quantity, order } = req.body;

  try {
    const user = await User.findOne({ api_key: key });
    if (!user) return res.status(401).json({ error: "API Key inválida" });

    // Consultar saldo
    if (action === "balance") {
      return res.json({ balance: user.balance });
    }

    // Criar pedido
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

    // Consultar status do pedido
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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro no servidor" });
  }
});

// apiV2.js
router.post("/seed-services", async (req, res) => {
  try {
    const services = [
      { name: "Seguidores BR", rate: 10, type: "follow" },
      { name: "Seguidores Mundiais", rate: 15, type: "follow" },
    ];
    await Service.insertMany(services);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
