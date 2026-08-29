import express from "express";
import cors from "cors";
import "dotenv/config";

import incidentRoutes from "./routes/incident.routes.js";
import routeSearchRoutes from "./routes/routeSearch.routes.js";
import supportRoutes from "./routes/support.routes.js";
import sosRoutes from "./routes/sos.routes.js";
import routeSafetyRoutes from "./routes/routeSafety.routes.js";

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

app.use("/api/route-search", routeSearchRoutes);

app.use("/api/support", supportRoutes);

app.use("/api/sos", sosRoutes);

app.use("/api/route-safety", routeSafetyRoutes);


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`SafeHer server running on port ${PORT}`);
});