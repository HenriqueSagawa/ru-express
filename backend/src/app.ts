import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  console.log();
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/auth", authRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

app.use(errorHandler);

export default app;
