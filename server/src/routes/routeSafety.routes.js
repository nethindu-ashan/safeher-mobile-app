import express from "express";

import {
  getSafetyIncidents,
} from "../controllers/routeSafety.controller.js";

import {
  validateNearbySafetyRequest,
} from "../validators/routeSafety.validator.js";


const router = express.Router();


/*
  GET nearby safety incidents

  Example:
  /api/route-safety/incidents
  ?latitude=6.9271
  &longitude=79.8612
  &radiusKm=5
  &days=30
*/
router.get("/incidents", validateNearbySafetyRequest, getSafetyIncidents);


export default router;