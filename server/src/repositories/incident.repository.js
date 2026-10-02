import prisma from "../config/prisma.js";

export const createIncident =
  async (
    incidentData
  ) => {
    const {
      category,
      latitude,
      longitude,
      dateTime,
      description,
      isAnonymous,
      userId,
      evidencePaths,
    } = incidentData;

    console.log(
      "REPOSITORY EVIDENCE PATHS:",
      evidencePaths
    );

    const incident =
      await prisma.incident.create({
        data: {
          category,

          latitude,

          longitude,

          incidentDatetime:
            new Date(
              dateTime
            ),

          description,

          isAnonymous:
            isAnonymous ??
            true,

          userId:
            userId ??
            null,

          evidencePaths:
            evidencePaths ??
            [],
        },
      });

    console.log(
      "SAVED INCIDENT:",
      incident
    );

    return incident;
  };

export const getNearbyIncidents =
  async (
    latitude,
    longitude
  ) => {
    return prisma.incident.findMany(
      {
        orderBy: {
          incidentDatetime:
            "desc",
        },

        select: {
          id: true,

          category: true,

          latitude: true,

          longitude: true,

          incidentDatetime:
            true,

          description: true,

          createdAt: true,

          status: true,

          isAnonymous: true,
        },
      }
    );
  };

export const getIncidentById =
  async (id) => {
    return prisma.incident.findUnique(
      {
        where: {
          id,
        },
      }
    );
  };

export const findIncidentsByUserId =
  async (userId) => {
    return prisma.incident.findMany(
      {
        where: {
          userId,
        },

        orderBy: {
          createdAt:
            "desc",
        },

        select: {
          id: true,

          category: true,

          latitude: true,

          longitude: true,

          incidentDatetime:
            true,

          description: true,

          isAnonymous: true,

          status: true,

          createdAt: true,

          evidencePaths: true,
        },
      }
    );
  };

export const findUserIncidentById =
  async (
    id,
    userId
  ) => {
    return prisma.incident.findFirst(
      {
        where: {
          id,
          userId,
        },
      }
    );
  };

export const cancelUserIncident =
  async (
    id,
    userId
  ) => {
    return prisma.incident.update(
      {
        where: {
          id,
        },

        data: {
          status:
            "Cancelled",
        },
      }
    );
  };