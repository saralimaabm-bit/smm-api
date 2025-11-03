import express from "express";
import Task from "../models/Task.js";
import Order from "../models/Order.js";

const router = express.Router();

// Listar tarefas pendentes
router.get("/", async (req, res) => {
  const tasks = await Task.find({ status: "pending" }).limit(10);
  res.json(tasks);
});

// Marcar tarefa concluída via body (não URL)
router.post("/complete", async (req, res) => {
  const { task_id } = req.body; // agora pega do body

  if (!task_id) return res.status(400).json({ error: "task_id é obrigatório" });

  try {
    const task = await Task.findById(task_id);
    if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });

    task.status = "completed";
    await task.save();

    const order = await Order.findById(task.order_id);
    if (order) {
      order.remains -= 1;
      if (order.remains <= 0) order.status = "completed";
      await order.save();
    }

    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
