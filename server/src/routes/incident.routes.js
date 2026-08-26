import express from "express";
import { createIncident } from "../controllers/incident.controller.js";

const router = express.Router();

router.post("/", createIncident);

export default router;