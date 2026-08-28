// Import Express to create routes
import express from "express";

// Import support controller functions
// These functions handle the HTTP requests and responses
import {
  getAllSupportServices,
  getSupportServiceById,
  getNearbySupportServices,
} from "../controllers/support.controller.js";

// Create a new Express router
const router = express.Router();

/**
 * GET /api/support
 *
 * Get all available support services
 *
 * Example:
 * GET http://localhost:5000/api/support
 */
router.get("/", getAllSupportServices);

/**
 * GET /api/support/nearby
 *
 * Find real-world nearby services using
 * the user's current latitude and longitude.
 *
 * Example:
 * /api/support/nearby?lat=6.9271&lng=79.8612
 *
 * Optional filters:
 * &type=HOSPITAL
 * &radius=5000
 */
router.get("/nearby", getNearbySupportServices);


/**
 * GET /api/support/:id
 *
 * Get one support service using its ID
 *
 * Example:
 * GET http://localhost:5000/api/support/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 */


router.get("/:id", getSupportServiceById);

// Export the router so we can register it
// inside the main Express application

export default router;