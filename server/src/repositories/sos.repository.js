import prisma from "../config/prisma.js";

export const createSOS = async (sosData) => {
  const {
    latitude,
    longitude,
    message,
  } = sosData;

  return await prisma.emergencySOS.create({
    data: {
      latitude,
      longitude,
      message:
        message ||
        "Emergency assistance requested",
    },
  });
};

export const findSOSById = async (id) => {
  return await prisma.emergencySOS.findUnique({
    where: {
      id,
    },
  });
};

export const cancelSOS = async (id) => {
  return await prisma.emergencySOS.update({
    where: {
      id,
    },

    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
    },
  });
};