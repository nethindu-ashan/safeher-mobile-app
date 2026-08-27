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

export const getNearbyIncidents = async (latitude, longitude) => {
  const incidents = await prisma.incident.findMany({
    orderBy: {
      incidentDatetime: "desc",
    },
    select: {
      id: true,
      category: true,
      latitude: true,
      longitude: true,
      incidentDatetime: true,
      createdAt: true,
      status: true,
    },
  });

  return incidents;
};