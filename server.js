import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import apiV2 from "./routes/apiV2.js";

dotenv.config();
const app = express();
app.use(express.json());

//  Coloque o CORS aqui, antes das rotas
import cors from "cors";
app.use(cors({
  origin: "*" // permite qualquer origem. Depois você pode restringir ao domínio do fornecedor
}));

// Conectar ao MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Erro ao conectar MongoDB:", err));

// Rotas
app.use("/api/v2", apiV2);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
