import express from "express";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Service from "../models/Service.js";

const router = express.Router();

// GET /api/v2?action=services
router.get("/", async (req, res) => {
  const { action } = req.query;
  if (action !== "services") return res.json({ error: "Ação inválida" });

  try {
    const services = await Service.find();
    res.json(services.map((s, i) => ({ id: i + 1, name: s.name, rate: s.rate, type: s.type })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// POST /api/v2
router.post("/", async (req, res) => {
  const { key, action, service, link, quantity, order, orders, refill, refills } = req.body;

  try {
    const user = await User.findOne({ api_key: key });
    if (!user) return res.status(401).json({ error: "API Key inválida" });

    if (action === "balance") return res.json({ balance: user.balance });

    if (action === "services") {
      const services = await Service.find();
      return res.json(services.map((s, i) => ({ id: i + 1, name: s.name, rate: s.rate, type: s.type })));
    }

    if (action === "add") {
      const svc = await Service.findOne({ id: Number(service) });
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
      if (order) {
        const ord = await Order.findById(order);
        if (!ord) return res.json({ error: "Pedido não encontrado" });
        return res.json({ order: ord._id, status: ord.status, remains: ord.remains });
      }

      if (orders) {
        const ids = orders.split(",").map(id => id.trim());
        const ords = await Order.find({ _id: { $in: ids } });
        return res.json(ords.map(o => ({ order: o._id, status: o.status, remains: o.remains })));
      }
    }

    if (action === "refill") {
      if (refill) return res.json({ refill, status: "requested" });
      if (refills) return res.json(refills.split(",").map(id => ({ refill: id.trim(), status: "requested" })));
    }

    if (action === "refill_status") {
      if (refill) return res.json({ refill, status: "completed" });
      if (refills) return res.json(refills.split(",").map(id => ({ refill: id.trim(), status: "completed" })));
    }

    if (action === "cancel") {
      if (!orders) return res.json({ error: "orders é obrigatório" });
      const ids = orders.split(",").map(id => id.trim());
      await Order.updateMany({ _id: { $in: ids } }, { status: "cancelled" });
      return res.json(ids.map(id => ({ order: id, status: "cancelled" })));
    }

    return res.json({ error: "Ação inválida" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// POST /api/v2/seed-services
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

import { v4 as uuidv4 } from "uuid"; // já deve estar no topo do arquivo

// 🔹 Registrar novo usuário
router.post("/register", async (req, res) => {
  try {
    const { name, email, balance } = req.body;

    if (!name || !email)
      return res.status(400).json({ error: "Nome e e-mail são obrigatórios" });

    // Gera chave única
    const api_key = uuidv4().replace(/-/g, "").slice(0, 16);

    // Verifica se já existe e-mail
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "E-mail já cadastrado" });

    // Cria novo usuário
    const user = await User.create({
      name,
      email,
      balance: balance || 100,
      api_key,
    });

    return res.json({
      message: "Usuário criado com sucesso",
      user: {
        name: user.name,
        email: user.email,
        balance: user.balance,
        api_key: user.api_key,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao criar usuário" });
  }
});


export default router;
