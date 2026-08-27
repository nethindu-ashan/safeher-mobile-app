// Import the shared Prisma client
// This is used to communicate with the PostgreSQL database
import prisma from "../config/prisma.js";

/**
 * Get all available support services from the database
 */
export const getAllSupportServices = async () => {
  return await prisma.supportService.findMany({
    // Only return services that are active/available
    where: {
      isAvailable: true,
    },

    // Sort services by name
    orderBy: {
      name: "asc",
    },
  });
};

/**
 * Get a single support service using its ID
 *
 * @param {string} id - UUID of the support service
 */
export const getSupportServiceById = async (id) => {
  return await prisma.supportService.findUnique({
    where: {
      id: id,
    },
  });
};