import express from "express";

import {
  getAllSupportServices,
  getSupportServiceById,
  getNearbySupportServices,
  getGooglePlaceDetails,
} from "../controllers/support.controller.js";

import {
  validateNearbySupportQuery,
  validatePlaceDetailsRequest,
  validateSupportServiceId,
} from "../validators/support.validator.js";

const router = express.Router();


// ============================================================
// SAFEHER DATABASE SERVICES
// ============================================================

// GET /api/support
router.get(
  "/",
  getAllSupportServices
);


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


// ============================================================
// DATABASE SERVICE DETAILS
// ============================================================

// This dynamic route MUST remain last.
router.get(
  "/:id",
  validateSupportServiceId,
  getSupportServiceById
);


export default router;