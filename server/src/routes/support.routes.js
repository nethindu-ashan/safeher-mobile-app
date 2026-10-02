import express from "express";

import {
  getNearbySupportServices,
  getGooglePlaceDetails,
} from "../controllers/support.controller.js";

import {
  validateNearbySupportQuery,
  validatePlaceDetailsRequest,
} from "../validators/support.validator.js";

const router = express.Router();


// ============================================================
// REAL-WORLD NEARBY SERVICES
// ============================================================

// GET /api/support/nearby?lat=&lng=&type=&radius=
router.get(
  "/nearby",
  validateNearbySupportQuery,
  getNearbySupportServices
);


// ============================================================
// GOOGLE PLACE DETAILS
// ============================================================

// GET /api/support/place/:placeId?lat=&lng=
router.get(
  "/place/:placeId",
  validatePlaceDetailsRequest,
  getGooglePlaceDetails
);


export default router;