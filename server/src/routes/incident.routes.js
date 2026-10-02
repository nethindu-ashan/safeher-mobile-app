import express from "express";

import {
  createIncident,
  getNearbyIncidents,
  getMyIncidents,
  cancelMyIncident,
  getIncidentById,
} from "../controllers/incident.controller.js";

import {
  optionalAuth,
  requireAuth,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * Guest + authenticated user
 * can create reports.
 */
router.post(
  "/",
  optionalAuth,
  createIncident
);

/**
 * Public nearby incidents.
 */
router.get(
  "/nearby",
  getNearbyIncidents
);

/**
 * Logged-in user's reports.
 */
router.get(
  "/my",
  requireAuth,
  getMyIncidents
);

/**
 * Cancel own report.
 */
router.patch(
  "/:id/cancel",
  requireAuth,
  cancelMyIncident
);

/**
 * Single incident.
 */
router.get(
  "/:id",
  getIncidentById
);

export default router;