// Import all functions from the support repository
// Repository layer is responsible for talking directly with Prisma/database
import * as supportRepository from "../repositories/support.repository.js";

/**
 * Get all available support services
 */
export const getAllSupportServices = async () => {
  // Ask the repository to get all support services
  const supportServices =
    await supportRepository.getAllSupportServices();

  // Return the result back to the controller
  return supportServices;
};

/**
 * Get one support service by its ID
 *
 * @param {string} id - UUID of the support service
 */
export const getSupportServiceById = async (id) => {
  // Check whether an ID was provided
  if (!id) {
    throw new Error("Support service ID is required");
  }

  // Get the support service from the database through repository
  const supportService =
    await supportRepository.getSupportServiceById(id);

  // If no service exists with that ID, throw an error
  if (!supportService) {
    throw new Error("Support service not found");
  }

  // Return the support service
  return supportService;
};