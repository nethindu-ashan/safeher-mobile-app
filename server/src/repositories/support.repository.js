// Shared Prisma client used by the SafeHer backend.
import prisma from "../config/prisma.js";

/**
 * Get all active SafeHer-managed support services.
 */
export const getAllSupportServices = async () => {
  return prisma.supportService.findMany({
    where: {
      isAvailable: true,
    },

    orderBy: {
      name: "asc",
    },
  });
};

/**
 * Get one SafeHer-managed support service by UUID.
 *
 * @param {string} id
 */
export const getSupportServiceById = async (id) => {
  return prisma.supportService.findUnique({
    where: {
      id,
    },
  });
};