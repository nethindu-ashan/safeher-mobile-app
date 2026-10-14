import * as incidentRepository from "../repositories/incident.repository.js";

import {
  validateIncident,
  validateNearbyIncidents,
} from "../validators/incident.validator.js";
import { calculateDistance } from "../utils/distance.js";
import { sendNearbyIncidentNotifications } from "./notification.service.js";

export const createIncident = async (
  incidentData
) => {
  validateIncident(
    incidentData
  );

  const evidencePaths =
    incidentData.evidencePaths ??
    [];

  if (
    !Array.isArray(
      evidencePaths
    )
  ) {
    throw new Error(
      "Incident evidence must be an array."
    );
  }

  if (
    evidencePaths.length >
    3
  ) {
    throw new Error(
      "A maximum of 3 evidence images can be attached."
    );
  }

  const invalidEvidence =
    evidencePaths.some(
      (path) =>
        typeof path !==
          "string" ||
        !path.trim()
    );

  if (
    invalidEvidence
  ) {
    throw new Error(
      "Invalid incident evidence."
    );
  }

  console.log(
    "SERVICE EVIDENCE PATHS:",
    evidencePaths
  );

  const incident =
  await incidentRepository.createIncident({
    ...incidentData,
    evidencePaths,
  });

await sendNearbyIncidentNotifications(incident);

return incident;
};



export const getNearbyIncidents =
  async (
    latitude,
    longitude
  ) => {
    validateNearbyIncidents(
      latitude,
      longitude
    );

    const incidents =
      await incidentRepository.getNearbyIncidents(
        latitude,
        longitude
      );

    return incidents
      .map(
        (incident) => {
          const distance =
            calculateDistance(
              latitude,
              longitude,
              incident.latitude,
              incident.longitude
            );

          return {
            ...incident,
            distance,
          };
        }
      )
      .filter(
        (incident) =>
          incident.distance <=
          5
      );
  };

export const getMyIncidents =
  async (userId) => {
    if (!userId) {
      throw new Error(
        "Authenticated user ID is required."
      );
    }

    return incidentRepository.findIncidentsByUserId(
      userId
    );
  };

export const cancelMyIncident =
  async (
    incidentId,
    userId
  ) => {
    if (!userId) {
      throw new Error(
        "Authentication required."
      );
    }

    const incident =
      await incidentRepository.findUserIncidentById(
        incidentId,
        userId
      );

    if (!incident) {
      throw new Error(
        "Report not found or you do not have permission to cancel it."
      );
    }

    if (
      incident.status !==
      "Pending Review"
    ) {
      throw new Error(
        "Only reports that are pending review can be cancelled."
      );
    }

    return incidentRepository.cancelUserIncident(
      incidentId,
      userId
    );
  };

export const getIncidentById =
  async (id) => {
    const incident =
      await incidentRepository.getIncidentById(
        id
      );

    if (!incident) {
      throw new Error(
        "Incident not found"
      );
    }

    return incident;
  };