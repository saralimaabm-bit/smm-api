// seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Service from "./models/Service.js";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB conectado");

    // Criar usuário revendedor
    const user = await User.create({
      name: "Revendedor Teste",
      api_key: "CHAVE123",
      balance: 100,
      role: "revendedor",
    });

    // Criar serviço
    const service = await Service.create({
      name: "Seguidores Humanizados",
      rate: 15,
      type: "follow",
    });

    console.log("Usuário:", user);
    console.log("Serviço:", service);

    await mongoose.disconnect();
    console.log("✅ Seed finalizado com sucesso");
  } catch (err) {
    console.error("Erro:", err);
  }
};

run();
