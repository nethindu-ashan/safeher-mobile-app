import express from "express";
import cors from "cors";
import "dotenv/config";

import incidentRoutes from "./routes/incident.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "SafeHer API is running",
  });
});

app.use("/api/incidents", incidentRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`SafeHer server running on port ${PORT}`);
});