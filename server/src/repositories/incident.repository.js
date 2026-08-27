import prisma from "../config/prisma.js";

export const createIncident = async (incidentData) => {
  const {
    category,
    latitude,
    longitude,
    dateTime,
    description,
    isAnonymous,
  } = incidentData;

  const incident = await prisma.incident.create({
    data: {
      category,
      latitude,
      longitude,
      incidentDatetime: new Date(dateTime),
      description,
      isAnonymous: isAnonymous ?? true,
    },
  });

  return incident;
};