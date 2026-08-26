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