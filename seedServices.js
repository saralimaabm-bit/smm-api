import mongoose from "mongoose";
import dotenv from "dotenv";
import Service from "./models/Service.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB conectado");
  } catch (err) {
    console.error("Erro ao conectar MongoDB:", err);
  }
};

const seedServices = async () => {
  await connectDB();

  const services = [
    { name: "Seguidores BR", rate: 10, type: "follow" },
    { name: "Seguidores Mundiais", rate: 15, type: "follow" }
  ];

  await Service.insertMany(services);
  console.log("Serviços adicionados com sucesso!");
  await mongoose.disconnect();
};

seedServices();