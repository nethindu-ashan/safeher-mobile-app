import express from "express";
import { createIncident , getNearbyIncidents  } from "../controllers/incident.controller.js";

const router = express.Router();

router.post("/", createIncident);
router.get("/nearby", getNearbyIncidents);

export default router;