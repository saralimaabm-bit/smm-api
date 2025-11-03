import mongoose from "mongoose";
import dotenv from "dotenv";
import Task from "./models/Task.js";
import Order from "./models/Order.js";

dotenv.config();

async function createTask() {
  await mongoose.connect(process.env.MONGO_URI);

  // Pegue um Order existente ou crie um novo
  const order = await Order.findOne(); // ou crie um novo se não houver

  if (!order) {
    console.log("Nenhum pedido encontrado. Crie um pedido primeiro.");
    process.exit();
  }

  const task = await Task.create({
    order_id: order._id,
    target: "https://instagram.com/teste",
    reward: 0.02,
    status: "pending"
  });

  console.log("Tarefa criada:", task);

  await mongoose.disconnect();
}

createTask();
