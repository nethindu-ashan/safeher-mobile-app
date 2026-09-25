import prisma from "../config/prisma.js";

export const findAllIncidents = async (
  status
) => {
  return prisma.incident.findMany({
    where: status
      ? {
          status,
        }
      : undefined,

    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      category: true,
      latitude: true,
      longitude: true,
      incidentDatetime: true,
      description: true,
      isAnonymous: true,
      status: true,
      createdAt: true,
      userId: true,

      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });
};

export const findIncidentForAdmin = async (
  id
) => {
  return prisma.incident.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      category: true,
      latitude: true,
      longitude: true,
      incidentDatetime: true,
      description: true,
      isAnonymous: true,
      status: true,
      createdAt: true,
      userId: true,

      evidencePaths: true,

      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });
};

export const updateIncidentStatus = async (
  id,
  status
) => {
  return prisma.incident.update({
    where: {
      id,
    },

    data: {
      status,
    },

    select: {
      id: true,
      category: true,
      latitude: true,
      longitude: true,
      incidentDatetime: true,
      description: true,
      isAnonymous: true,
      status: true,
      createdAt: true,
      userId: true,

      evidencePaths: true,

      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });
};