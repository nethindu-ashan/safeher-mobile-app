import prisma from "../config/prisma.js";

export const getSOSRecords = async (status) => {
  return prisma.emergencySOS.findMany({
    where: status
      ? {
          status,
        }
      : undefined,
    orderBy: {
      activatedAt: "desc",
    },
  });
};

export const getSOSById = async (id) => {
  return prisma.emergencySOS.findUnique({
    where: {
      id,
    },
  });
};