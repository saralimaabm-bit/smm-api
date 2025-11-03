import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import apiV2Routes from "./routes/apiV2.js";
import taskRoutes from "./routes/tasks.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rotas principais
app.use("/api/v2", apiV2Routes);
app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
