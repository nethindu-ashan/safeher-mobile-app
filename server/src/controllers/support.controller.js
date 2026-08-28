// Import all functions from the support service layer
// Controller should not directly access Prisma or the repository
import * as supportService from "../services/support.service.js";

/**
 * Get all available support services
 *
 * Example request:
 * GET /api/support
 */
export const getAllSupportServices = async (req, res) => {
  try {
    // Ask the service layer to get all support services
    const supportServices =
      await supportService.getAllSupportServices();

    // Send successful response to the client
    res.status(200).json({
      success: true,
      message: "Support services retrieved successfully",
      data: supportServices,
    });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get one support service by ID
 *
 * Example request:
 * GET /api/support/:id
 */
export const getSupportServiceById = async (req, res) => {
  try {
    // Get the support service ID from the URL parameter
    const { id } = req.params;

    // Ask the service layer to find the support service
    const supportServiceData =
      await supportService.getSupportServiceById(id);

    // Send successful response
    res.status(200).json({
      success: true,
      message: "Support service retrieved successfully",
      data: supportServiceData,
    });
  } catch (error) {
    // If the support service does not exist,
    // return a 404 response
    if (error.message === "Support service not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    // Handle other request errors
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



/**
 * Get nearby real-world support services
 * using the user's current latitude and longitude.
 *
 * Example:
 * GET /api/support/nearby?lat=6.9271&lng=79.8612
 *
 * Optional:
 * &type=HOSPITAL
 * &radius=5000
 */
export const getNearbySupportServices = async (req, res) => {
  try {
    // Get values sent through URL query parameters
    const {
      lat,
      lng,
      type = "ALL",
      radius = 5000,
    } = req.query;

    // Latitude and longitude are required
    // because nearby services depend on user's current location
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    // Send user's current location and filters
    // to the support service layer
    const nearbyServices =
      await supportService.getNearbySupportServices(
        lat,
        lng,
        type,
        radius
      );

    // Send nearby places back to the mobile application
    return res.status(200).json({
      success: true,
      message: "Nearby support services retrieved successfully",
      count: nearbyServices.length,
      data: nearbyServices,
    });
  } catch (error) {
    /**
     * These are client-side validation problems,
     * so return HTTP 400.
     */
    const validationErrors = [
      "Invalid latitude",
      "Invalid longitude",
      "Invalid support service type",
      "Radius must be between 1 and 50000 meters",
    ];

    if (validationErrors.includes(error.message)) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // Handle Google Places/API/server related errors
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};