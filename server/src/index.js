import express from "express";
import cors from "cors";
import "dotenv/config";

import incidentRoutes from "./routes/incident.routes.js";
import routeSearchRoutes from "./routes/routeSearch.routes.js";
import supportRoutes from "./routes/support.routes.js";
import sosRoutes from "./routes/sos.routes.js";
import routeSafetyRoutes from "./routes/routeSafety.routes.js";
import notificationPreferenceRoutes from "./routes/notificationPreference.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import pushTokenRoutes from "./routes/pushToken.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import trustedContactRoutes from "./routes/trustedContact.routes.js";
import adminSosRoutes from "./routes/adminSos.routes.js";

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

app.use("/api/notification-preferences", notificationPreferenceRoutes);

app.use("/api/push-tokens", pushTokenRoutes);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use("/api/users", userRoutes);

app.use("/api/admin/sos", adminSosRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/trusted-contacts", trustedContactRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`SafeHer server running on port ${PORT}`);
});