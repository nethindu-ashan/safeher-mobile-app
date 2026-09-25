import express from "express";

import {
  getIncidents,
  getIncident,
  updateIncidentStatus,
} from "../controllers/admin.controller.js";

import {
  requireAuth,
} from "../middleware/auth.middleware.js";

import {
  requireAdmin,
} from "../middleware/admin.middleware.js";

const router = express.Router();

router.use(
  requireAuth,
  requireAdmin
);

router.get(
  "/incidents",
  getIncidents
);

router.get(
  "/incidents/:id",
  getIncident
);

router.patch(
  "/incidents/:id/status",
  updateIncidentStatus
);

export default router;