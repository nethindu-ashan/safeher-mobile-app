import express from "express";

import {
  getSafetyIncidents,
  getRouteSafetyIncidents,
  compareRoutes, } from "../controllers/routeSafety.controller.js";

import {
  validateNearbySafetyRequest,
  validateRouteIncidentRequest,
  validateRouteComparisonRequest,
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

//  Safety information for one selected route.
router.post("/route-incidents", validateRouteIncidentRequest, getRouteSafetyIncidents);

// Compare safety information between multiple route options.
router.post("/compare-routes", validateRouteComparisonRequest, compareRoutes);

export default router;