import express from "express";
import { createIncident , getNearbyIncidents , getIncidentById  } from "../controllers/incident.controller.js";

const router = express.Router();

router.post("/", createIncident);
router.get("/nearby", getNearbyIncidents);
router.get("/:id", getIncidentById);

export default router;