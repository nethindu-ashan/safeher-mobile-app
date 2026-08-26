import prisma from "../config/prisma.js";

export const createIncident = async (incidentData) => {
  const {
    category,
    location,
    dateTime,
    description,
    isAnonymous,
  } = incidentData;

  const incident = await prisma.incident.create({
    data: {
      category,
      location,
      incidentDatetime: new Date(dateTime),
      description,
      isAnonymous: isAnonymous ?? true,
    },
  });

  return incident;
};